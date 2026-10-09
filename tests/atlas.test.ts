import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Box3, Group, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { anatomy, getAncestors, isWithin } from '../src/data/anatomyTree';
import { anatomyModels, systems } from '../src/data/modelRegistry';
import { muscleCatalog } from '../src/data/muscleCatalog';
import { useAtlasStore } from '../src/store/atlasStore';
import { fitCameraToBox } from '../src/utils/camera';
import { mapMeshToAnatomy } from '../src/utils/meshMapping';
import { belongsToSystem, getOpacity } from '../src/utils/visibility';
import { explosionOffset } from '../src/utils/explosion';
import { getZoomLevel } from '../src/config/viewer';
import { ANATOMY_ZOOM, semanticZoom } from '../src/config/education';
import { canonicalBoneIds } from '../src/data/schoolAnatomy';
import { validateAnatomy, auditModel } from '../src/utils/validation';
import { regionKey } from '../src/utils/semantic';
import { publicUrl, restoredPagesPath } from '../src/utils/basePath';
import { simulations, motionScale, phaseIndex } from '../src/data/simulations';
import { useSimulationStore, simulationClock } from '../src/store/simulationStore';
import openModels from '../src/data/openModels.generated.json';

test('installed detailed GLBs parse, map every mesh, and preserve selectable heart and muscle assemblies',async()=>{
 const seen=new Set<string>();
 for(const [model,entry]of Object.entries(openModels)){
  if(seen.has(entry.url))continue;seen.add(entry.url);
  const buffer=await readFile(`public${entry.url}`);assert.equal(buffer.length,entry.bytes);
  const asset=await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
  const report=auditModel(asset.scene,model);assert.equal(report.meshes,entry.meshes);assert.deepEqual(report.unmapped,[]);
  if(model==='heart')for(const id of ['left-atrium','right-atrium','left-ventricle','right-ventricle'])assert.ok(report.mappedIds.includes(id),id);
  if(model==='muscular-body')assert.ok(report.mappedIds.some(id=>isWithin(id,'biceps-brachii-left')));
  if(model==='body'){assert.ok(report.meshes>1200);assert.ok(!report.mappedIds.some(id=>id.startsWith('real-kidneys')));}
 }
});

test('all seven physiology lessons link to real metadata and valid atlas routes',()=>{
 assert.equal(simulations.length,7);assert.equal(new Set(simulations.map(s=>s.id)).size,7);
 for(const lesson of simulations){
  assert.ok(anatomy[lesson.focus],lesson.focus);
  lesson.routeIds.forEach(id=>assert.ok(anatomy[id],id));
  assert.equal(lesson.stages.length,4);assert.ok(lesson.duration>0);
  const [,kind,id,selection]=lesson.route.split('/');
  assert.ok(kind==='atlas'?anatomyModels[id]:systems.some(s=>s.id===id));
  if(selection)assert.ok(anatomy[selection]);
 }
});
test('simulation scrubbing pauses playback and clamps invalid input',()=>{
 const s=useSimulationStore.getState();s.start('heartbeat');assert.equal(useSimulationStore.getState().playing,false);
 s.toggle();assert.equal(useSimulationStore.getState().playing,true);s.seek(.65);
 assert.equal(simulationClock.phase,.65);assert.equal(useSimulationStore.getState().playing,false);
 s.seek(-5);assert.equal(simulationClock.phase,0);s.seek(2);assert.ok(simulationClock.phase<1);
 s.setSpeed(100);assert.equal(useSimulationStore.getState().speed,2);s.setSpeed(NaN);assert.equal(useSimulationStore.getState().speed,1);
 s.stop();assert.equal(useSimulationStore.getState().id,null);assert.equal(simulationClock.phase,0);
});
test('functional deformation is bounded, cyclic, and leaves unrelated anatomy untouched',()=>{
 for(const lesson of simulations)for(let phase=0;phase<=1;phase+=.01){
  for(const id of lesson.routeIds)assert.ok(motionScale(lesson.id,id,phase).every(v=>Number.isFinite(v)&&v>=.75&&v<=1.2));
  assert.deepEqual(motionScale(lesson.id,'skull',phase),[1,1,1]);
 }
 assert.ok(motionScale('heartbeat','left-ventricle',.65)[0]<1);
 assert.ok(motionScale('breathing','left-lung',.5)[1]>1);
 assert.ok(motionScale('contraction','biceps-brachii-left',.5)[1]<1);
 assert.deepEqual([0,.25,.5,.75,1].map(phaseIndex),[0,1,2,3,3]);
});

test('Pages prefixes assets and restores deep links without leaving the repository path',()=>{
 const base='/vai_biology_atlas/';
 assert.equal(publicUrl('/models/placeholders/heart.glb',base),base+'models/placeholders/heart.glb');
 assert.equal(publicUrl('/draco/',base),base+'draco/');
 assert.equal(publicUrl('https://example.org/heart.glb',base),'https://example.org/heart.glb');
 const path=base+'atlas/body/heart?learn=1#details';
 assert.equal(restoredPagesPath('?__atlas_route='+encodeURIComponent(path),base),path);
 assert.equal(restoredPagesPath('?__atlas_route=https%3A%2F%2Fexample.org',base),null);
 assert.equal(restoredPagesPath('?__atlas_route=%2Fother%2Fatlas',base),null);
});

test('school bone catalog has 206 unique entries and all canonical entries are present',()=>{
 assert.equal(canonicalBoneIds.length,206);assert.equal(new Set(canonicalBoneIds).size,206);
 assert.equal(Object.values(anatomy).filter(n=>n.canonicalBone).length,206);
 assert.deepEqual(validateAnatomy(Object.values(anatomy)),[]);
});
test('semantic separation is continuous at every zoom threshold and increases inward',()=>{
 let previous=0;for(let distance=12;distance>=0;distance-=.01){const current=semanticZoom(distance).separation;assert.ok(current>=previous-1e-9);previous=current;}
 for(const level of ANATOMY_ZOOM)assert.ok(Math.abs(semanticZoom(level.minDistance+.0001).separation-semanticZoom(Math.max(0,level.minDistance-.0001)).separation)<.001);
});
test('automatic muscle separation affects only the active region and preserves its skeleton',()=>{
 const state={activeModel:'muscular-body',selectedId:'body',explosion:0,systemFilter:'muscular',autoSeparation:.3,activeRegion:regionKey(anatomy['biceps-brachii-left']),modelScale:1};
 assert.ok(explosionOffset('biceps-brachii-left','muscles',state).length()>0);
 assert.equal(explosionOffset('biceps-brachii-right','muscles',state).length(),0);
 assert.equal(explosionOffset('femur','skeleton',state).length(),0);
 assert.equal(explosionOffset('biceps-brachii-left','muscles',{...state,autoSeparation:0}).length(),0);
});
test('back restores camera, selection and layer state',()=>{
 const store=useAtlasStore;store.getState().enter('body');store.getState().set('cameraPose',{position:[0,0,10],target:[0,0,0]});store.getState().opacity('skin',.4);store.getState().select('heart');store.getState().opacity('skin',.1);store.getState().backView();
 assert.equal(store.getState().selectedId,'body');assert.equal(store.getState().layerOpacity.skin,.4);assert.equal(store.getState().cameraCommand.type,'restore');assert.deepEqual(store.getState().cameraPose?.position,[0,0,10]);
});
test('validator catches duplicate metadata IDs and hierarchy cycles',()=>{
 const sample={...anatomy.heart,parent:'heart',children:[]};const errors=validateAnatomy([sample,sample]);assert.ok(errors.some(e=>e.startsWith('Duplicate ID')));assert.ok(errors.some(e=>e.startsWith('Hierarchy cycle')));
});

test('all hierarchy references are bidirectional, unique, and acyclic',()=>{
 for(const n of Object.values(anatomy)){
  assert.equal(new Set(n.children).size,n.children.length,n.id);
  if(n.parent)assert.ok(anatomy[n.parent]?.children.includes(n.id),`${n.id} missing parent link ${n.parent}`);
  for(const child of n.children)assert.equal(anatomy[child]?.parent,n.id,child);
  const seen=new Set();let cursor:typeof n|undefined=n;
  while(cursor){assert.ok(!seen.has(cursor.id),`Cycle at ${cursor.id}`);seen.add(cursor.id);cursor=anatomy[cursor.parent??''];}
  for(const related of n.relatedStructures??[])assert.ok(anatomy[related],`Missing related ${related}`);
 }
});
test('all 13 systems and every model root resolve',()=>{
 assert.equal(systems.length,13);
 for(const s of systems){assert.ok(anatomyModels[s.modelId]);for(const id of s.structures)assert.ok(anatomy[id],id);}
 for(const m of Object.values(anatomyModels)){assert.ok(anatomy[m.root],m.id);assert.ok(m.urls[0].endsWith('.glb'));}
});
test('80 named bilateral muscles have isolated mesh identities and depth',()=>{
 assert.equal(muscleCatalog.length,40);
 for(const m of muscleCatalog)for(const side of ['left','right']){const n=anatomy[`${m.slug}-${side}`];assert.equal(n.type,'muscle');assert.ok(n.depth);assert.ok(n.meshNames?.includes(`muscle_${m.slug.replaceAll('-','_')}_${side}`));}
});
test('mesh configuration aliases, parent mappings and explicit extras work',()=>{
 const mesh=new Mesh();mesh.name='muscle_biceps_brachii_left';assert.equal(mapMeshToAnatomy(mesh),'biceps-brachii-left');
 mesh.name='unnamed';const group=new Group();group.name='organ_heart';group.add(mesh);assert.equal(mapMeshToAnatomy(mesh),'heart');
 mesh.userData.anatomyId='brain';assert.equal(mapMeshToAnatomy(mesh),'brain');
});
test('selection restores ancestors, peel undo restores the exact history, reset clears edits',()=>{
 const store=useAtlasStore;store.getState().enter('body');store.getState().peel('chest');store.getState().peel('head');store.getState().undoPeel();assert.deepEqual(store.getState().hiddenIds,['chest']);
 store.getState().select('heart');assert.deepEqual(store.getState().hiddenIds,[]);assert.equal(store.getState().cameraCommand.value,'heart');
 store.getState().setMode('isolate');assert.equal(getOpacity('brain','nervous',store.getState()),0);assert.ok(getOpacity('heart','organs',store.getState())>0);
 store.getState().reset();assert.equal(store.getState().isolation,null);assert.equal(store.getState().selectedId,'body');assert.equal(store.getState().peelHistory.length,0);
});
test('skeletal filtering excludes arm muscles and regional skin meshes',()=>{
 assert.equal(belongsToSystem('upper-arm','skeletal','skin'),false);
 assert.equal(belongsToSystem('humerus-left','skeletal','skeleton'),true);
 assert.equal(belongsToSystem('biceps-brachii-left','skeletal','muscles'),false);
});
test('organs fade surrounding anatomy and muscle layers are independently controlled',()=>{
 useAtlasStore.getState().enter('body','heart');assert.equal(anatomy.heart.type,'organ');assert.ok(getOpacity('left-lung','organs',useAtlasStore.getState())<getOpacity('heart','organs',useAtlasStore.getState()));
 useAtlasStore.getState().enter('muscular-body',undefined,'muscular');useAtlasStore.getState().set('semanticDepth','SUBSTRUCTURES');useAtlasStore.getState().toggleLayer('muscles');assert.equal(getOpacity('biceps-brachii-left','muscles',useAtlasStore.getState()),0);assert.ok(getOpacity('brachialis-left',anatomy['brachialis-left'].layer,useAtlasStore.getState())>0);
});
test('bbox camera fit contains every corner for portrait, landscape and six orientations',()=>{
 const box=new Box3(new Vector3(-2,-3,-1),new Vector3(2,3,1));
 for(const aspect of [.4,1,2.5])for(const d of [new Vector3(0,0,1),new Vector3(0,0,-1),new Vector3(1,0,0),new Vector3(-1,0,0),new Vector3(0,1,.001),new Vector3(0,-1,.001)]){
  const fit=fitCameraToBox(box,38,aspect,d),forward=d.clone().normalize(),up=Math.abs(forward.y)>.98?new Vector3(0,0,-1):new Vector3(0,1,0),right=new Vector3().crossVectors(up,forward).normalize(),vertical=new Vector3().crossVectors(forward,right).normalize(),tanY=Math.tan(38*Math.PI/360);
  for(const x of [-2,2])for(const y of [-3,3])for(const z of [-1,1]){const point=new Vector3(x,y,z),depth=fit.distance-point.dot(forward);assert.ok(Math.abs(point.dot(right))<=depth*tanY*aspect);assert.ok(Math.abs(point.dot(vertical))<=depth*tanY);}
 }
});
test('explosion preserves skeleton and is reversible',()=>{
 const state={activeModel:'muscular-body',selectedId:'body',explosion:1,systemFilter:'muscular'};
 assert.equal(explosionOffset('femur','skeleton',state).length(),0);assert.ok(explosionOffset('biceps-brachii-left','muscles',state).length()>0);assert.equal(explosionOffset('biceps-brachii-left','muscles',{...state,explosion:0}).length(),0);
});
test('deep navigation and zoom thresholds are deterministic',()=>{
 assert.ok(isWithin('left-ventricle','body'));assert.deepEqual(getAncestors('left-ventricle').map(n=>n.id),['body','chest','heart','left-ventricle']);assert.equal(getZoomLevel(9).id,'BODY');assert.equal(getZoomLevel(1).id,'STRUCTURE');
});
test('every bundled development GLB parses and every mesh maps to metadata',async()=>{
 for(const config of Object.values(anatomyModels)){
  const buffer=await readFile(`public/models/placeholders/${config.id}.glb`);const asset=await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
  let count=0;asset.scene.traverse(object=>{if(object instanceof Mesh){count++;assert.ok(mapMeshToAnatomy(object),`${config.id}: ${object.name}`);}});assert.ok(count>0,config.id);
  if(config.id==='body'){const report=auditModel(asset.scene,config.id);assert.equal(report.bones,206);assert.equal(report.muscles,80);}
 }
});

