import { initialTwinState, stepTwin, twinFlow, protocolFrame, twinProtocols } from '../src/data/digitalTwin';
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
import { catalogPreviewModel, isDedicatedPreview } from '../src/data/previewPolicy';
import { studyCollections } from '../src/data/studyCollections';
import { anatomyRoute } from '../src/data/anatomyRoutes';
import { journeyRoutes, journeyStudies } from '../src/data/journeyCatalog';
import { moleculeAssembly } from '../src/data/journeyMolecules';
import { travelFrame } from '../src/data/journeyTravel';
import { journeyLibrary, journeyCategories, journeyTopicUrl, getJourneyTopic, filterJourneyTopics, type JourneyFilters } from '../src/data/journeyLibrary';
import { biologyModules, biologySubjects, classMap, sceneParts } from '../src/data/biology';
import { crossGenotypes, defaultLabInputs, labResponse, virtualLabs } from '../src/data/virtualLabs';
import { labControls, responseMaximum } from '../src/data/labControls';
import openModels from '../src/data/openModels.generated.json';
import { clampDepth, journeyStages, journeyParts, journeySelectable, stageIndex, travelPosition } from '../src/data/journey';

test('biology modules cover every class and subject with valid scenes and distinct lessons',()=>{
 assert.equal(biologyModules.length,332);assert.equal(new Set(biologyModules.map(module=>module.id)).size,332);
 assert.deepEqual(classMap.map(item=>item.classLevel),Array.from({length:12},(_,i)=>i+1));
 for(const item of classMap){assert.ok(item.modules.length>=25&&item.modules.length<=50);assert.ok(item.modules.every(module=>module.classLevel===item.classLevel));}
 for(const subject of biologySubjects)assert.ok(biologyModules.some(module=>module.subject===subject));
 for(const module of biologyModules){assert.ok(sceneParts[module.scene]);assert.ok(module.explanation.length>50);assert.ok(module.activity.length>25);}
 for(const lab of virtualLabs)assert.ok(lab.classes.every(grade=>grade>=1&&grade<=12));
});
test('all nine monohybrid crosses preserve probabilities and expected Mendelian combinations',()=>{
 for(const a of ['AA','Aa','aa'] as const)for(const b of ['AA','Aa','aa'] as const){const result=crossGenotypes(a,b);assert.equal(result.cells.length,4);assert.equal(Object.values(result.counts).reduce((sum,value)=>sum+value,0),4);assert.equal(result.dominant+result.recessive,1);assert.deepEqual(result.counts,crossGenotypes(b,a).counts);}
 assert.deepEqual(crossGenotypes('Aa','Aa').counts,{AA:1,Aa:2,aa:1});
 assert.deepEqual(crossGenotypes('AA','aa').counts,{AA:0,Aa:4,aa:0});
 assert.deepEqual(crossGenotypes('Aa','aa').counts,{AA:0,Aa:2,aa:2});
});
test('virtual laboratory responses are bounded and react to controlled inputs',()=>{
 assert.equal(labResponse('photosynthesis',{...defaultLabInputs,light:0}).value,0);
 assert.equal(labResponse('photosynthesis',{...defaultLabInputs,co2:0}).value,0);
 assert.equal(labResponse('enzymes',{...defaultLabInputs,substrate:0}).value,0);
 assert.equal(labResponse('enzymes',{...defaultLabInputs,enzyme:0}).value,0);
 assert.equal(labResponse('osmosis',defaultLabInputs).scale,1);
 assert.ok(labResponse('osmosis',{...defaultLabInputs,inside:100,outside:0}).scale>1);
 assert.ok(labResponse('osmosis',{...defaultLabInputs,inside:0,outside:100}).scale<1);
 assert.ok(labResponse('enzymes',{...defaultLabInputs,temperature:37}).value>labResponse('enzymes',{...defaultLabInputs,temperature:80}).value);
 for(const value of [NaN,Infinity,-1000,0,1000])for(const id of ['photosynthesis','enzymes','osmosis'] as const){const result=labResponse(id,{...defaultLabInputs,light:value,co2:value,temperature:value,inside:value,outside:value,ph:value,substrate:value,enzyme:value});assert.ok(Number.isFinite(result.value));assert.ok(result.value>=0&&result.value<=150);}
});

test('all 120 guided journeys have unique IDs, specific lessons and valid scene deep links',()=>{
 assert.equal(journeyLibrary.length,120);assert.equal(journeyCategories.length,15);
 assert.equal(new Set(journeyLibrary.map(topic=>topic.id)).size,120);
 assert.equal(new Set(journeyLibrary.map(topic=>topic.description)).size,120);
 for(const topic of journeyLibrary){
  assert.ok(topic.description.length>35);assert.ok(topic.takeaway.length>25);
  assert.ok(journeyRoutes[topic.path]);assert.ok(journeyStages[topic.level]);
  if(topic.study)assert.ok(journeyStudies[topic.level]?.some(study=>study.id===topic.study));
  const url=new URL(journeyTopicUrl(topic),'https://atlas.example');
  assert.equal(url.pathname,`/journey/${journeyStages[topic.level].id}`);
  assert.equal(getJourneyTopic(url.searchParams.get('journey'))?.id,topic.id);
  assert.equal(url.searchParams.get('path'),topic.path);
  assert.equal(url.searchParams.get('study'),topic.study??null);
 }
 assert.equal(getJourneyTopic('invalid-topic'),undefined);
 for(const category of journeyCategories)assert.equal(journeyLibrary.filter(topic=>topic.category===category).length,8);
});
test('journey search and combined category, scale, level and progress filters are deterministic',()=>{
 const base:JourneyFilters={search:'',category:'all',scale:'all',difficulty:'all',savedOnly:false,completedOnly:false,sort:'recommended'};
 assert.equal(filterJourneyTopics(base).length,120);
 assert.equal(filterJourneyTopics({...base,category:'Female reproductive'}).length,8);
 assert.equal(filterJourneyTopics({...base,category:'Male reproductive'}).length,8);
 const oxygen=filterJourneyTopics({...base,search:'  OXYGEN  molecule ',scale:'6',difficulty:'Advanced'});
 assert.ok(oxygen.length>0);assert.ok(oxygen.every(topic=>topic.level===6));
 const id=journeyLibrary[0].id;
 assert.deepEqual(filterJourneyTopics({...base,savedOnly:true},[id]).map(topic=>topic.id),[id]);
 assert.deepEqual(filterJourneyTopics({...base,completedOnly:true},[],[id]).map(topic=>topic.id),[id]);
 assert.equal(filterJourneyTopics({...base,savedOnly:true,completedOnly:true},[id],[]).length,0);
 assert.equal(filterJourneyTopics({...base,search:'unmatchablexyz'}).length,0);
 const sorted=filterJourneyTopics({...base,sort:'title'}).map(topic=>topic.title);
 assert.deepEqual(sorted,[...sorted].sort((a,b)=>a.localeCompare(b)));
});

test('journey deep links resolve all scales and selectable structures have explanations',()=>{
 assert.equal(journeyStages.length,7);
 for(const [index,stage] of journeyStages.entries()){
  assert.equal(stageIndex(stage.id),index);
  for(const id of journeySelectable[stage.id])assert.ok(journeyParts[id]?.description,id);
  assert.ok(stage.source.startsWith('https://openstax.org/'));
 }
 assert.equal(stageIndex('not-a-scale'),-1);
 assert.equal(clampDepth(Infinity),0);assert.equal(clampDepth(-8),0);assert.equal(clampDepth(12),6);assert.equal(clampDepth(3.25),3.25);
});
test('inside travel stays bounded and moves continuously along the vessel and axon',()=>{
 for(const path of ['blood','neuron'] as const){
  assert.equal(travelPosition(0,path)[2],7);assert.equal(travelPosition(1,path)[2],-5);
  assert.deepEqual(travelPosition(-1,path),travelPosition(0,path));assert.deepEqual(travelPosition(2,path),travelPosition(1,path));
  assert.deepEqual(travelPosition(NaN,path),travelPosition(0,path));
  const before=travelPosition(.5,path),after=travelPosition(.51,path);
  assert.ok(Math.abs(before[2]-after[2]-.12)<1e-8);assert.equal(before[0],after[0]);
 }
});

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

test('all physiology lessons link to real metadata and valid atlas routes',()=>{
 assert.equal(simulations.length,12);assert.equal(new Set(simulations.map(s=>s.id)).size,simulations.length);
 for(const lesson of simulations){
  assert.ok(anatomy[lesson.focus],lesson.focus);assert.ok(anatomyModels[lesson.model],lesson.model);
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
  if(config.id==='female-reproductive'){const mapped:Record<string,number>={};asset.scene.traverse(o=>{if(o instanceof Mesh){const id=mapMeshToAnatomy(o)!;mapped[id]=(mapped[id]??0)+1;}});assert.equal(mapped.ovaries,2);assert.ok(mapped['uterine-tubes']>=2);for(const id of ['uterus','cervix','vagina'])assert.ok(mapped[id]);}
 }
});


test('public previews avoid external intimate anatomy and female studies resolve to their dedicated explorer',()=>{
 for(const id of ['body','male','female','integumentary-system'])assert.equal(catalogPreviewModel(id),'skeletal-body');
 for(const id of ['male-reproductive','female-reproductive']){assert.equal(isDedicatedPreview(id),true);assert.equal(isDedicatedPreview(id,'study'),false);}
 for(const collection of studyCollections)for(const structure of collection.structures)assert.ok(anatomy[structure.id],structure.id);
 for(const id of ['ovaries','uterine-tubes','uterus','cervix','vagina'])assert.equal(anatomyRoute(id),`/systems/female-reproductive/${id}`);
 assert.ok(motionScale('urination','bladder',.5)[0]>motionScale('urination','bladder',.8)[0]);
 assert.ok(motionScale('bile','gallbladder',.625)[0]<1);
});

test('all expanded routes and labs map to available models and explained selectable structures',()=>{
 assert.equal(Object.keys(journeyRoutes).length,6);
 for(const route of Object.values(journeyRoutes)){
  assert.ok(anatomyModels[route.model]);assert.ok(route.choices[route.answer]);
  for(const id of route.structures)assert.ok(journeyParts[id]?.description,id);
 }
 assert.equal(Object.values(journeyStudies).flat().length,16);
 for(const [level,labs] of Object.entries(journeyStudies)){
  assert.ok(Number(level)>=3&&Number(level)<=6);
  assert.equal(new Set(labs.map(lab=>lab.id)).size,labs.length);
  for(const lab of labs)for(const id of lab.structures)assert.ok(journeyParts[id]?.description,id);
 }
});
test('molecular study graphs preserve molecular composition and atomic valence',()=>{
 const formulas={'oxygen-molecule':{oxygen:2},'carbon-dioxide':{carbon:1,oxygen:2},glucose:{carbon:6,hydrogen:12,oxygen:6}};
 for(const [id,formula]of Object.entries(formulas)){
  const assembly=moleculeAssembly(id),counts:Record<string,number>={},valence=assembly.atoms.map(()=>0);
  for(const atom of assembly.atoms)counts[atom.id]=(counts[atom.id]??0)+1;
  assert.deepEqual(counts,formula);
  for(const [i,[a,b]]of assembly.bonds.entries()){assert.ok(a!==b&&assembly.atoms[a]&&assembly.atoms[b]);const order=assembly.bondOrders?.[i]??1;valence[a]+=order;valence[b]+=order;}
  assembly.atoms.forEach((atom,i)=>assert.equal(valence[i],atom.id==='carbon'?4:atom.id==='oxygen'?2:1,`${id}:${i}`));
 }
});
test('every functional route camera remains finite, bounded, and faces a separate target',()=>{
 for(const path of Object.keys(journeyRoutes) as (keyof typeof journeyRoutes)[]){
  for(const t of [0,.1,.5,.9,1,NaN,-2,3]){const frame=travelFrame(path,t);assert.ok([...frame.position.toArray(),...frame.target.toArray()].every(Number.isFinite));assert.ok(frame.position.distanceTo(frame.target)>.01);assert.ok(frame.position.length()<20);}
  assert.deepEqual(travelFrame(path,-2),travelFrame(path,0));assert.deepEqual(travelFrame(path,3),travelFrame(path,1));
 }
});
test('journey explanation panel contains no outbound reading or atlas-reference links',async()=>{
 const page=await readFile('src/pages/Journey.tsx','utf8');assert.ok(!page.includes('Read the biology'));assert.ok(!page.includes('Open detailed anatomy atlas'));assert.ok(!page.includes('href={stage.source}'));
});

test('expanded labs provide unique protocols, controlled responses and complete apparatus configuration',()=>{assert.equal(virtualLabs.length,104);assert.equal(new Set(virtualLabs.map(lab=>lab.id)).size,104);assert.equal(new Set(virtualLabs.map(lab=>lab.engine)).size,13);for(const lab of virtualLabs){assert.equal(lab.steps.length,4);assert.ok(lab.principle.length>20);assert.ok(labControls[lab.engine]);const response=labResponse(lab.engine,defaultLabInputs);assert.ok(Number.isFinite(response.value));assert.ok(response.value>=0&&response.value<=responseMaximum(lab.engine));for(const control of labControls[lab.engine]){for(const value of [NaN,Infinity,-1000,10000]){const result=labResponse(lab.engine,{...defaultLabInputs,[control.key]:value});assert.ok(Number.isFinite(result.value),lab.id+' '+control.key);}}}});


test('digital twin coordinates exercise, recovery, stable rest and frozen time',()=>{
 const rest=initialTwinState();let state=rest;
 for(let i=0;i<120;i++)state=stepTwin(state,0,.5);
 assert.equal(state.heartRate,72);assert.equal(state.breathingRate,14);assert.equal(state.demand,1);assert.equal(state.heatLoad,0);assert.equal(twinFlow(state),1);
 for(let i=0;i<240;i++)state=stepTwin(state,85,.5);
 const exercised=state;assert.ok(state.heartRate>140);assert.ok(state.breathingRate>35);assert.ok(state.demand>6);assert.ok(state.heatProduction>7);assert.ok(state.heatLoad>0);assert.ok(twinFlow(state)>2);
 assert.deepEqual(stepTwin(state,100,0),state);
 for(let i=0;i<600;i++)state=stepTwin(state,0,.5);
 assert.ok(state.heartRate<exercised.heartRate);assert.ok(state.breathingRate<exercised.breathingRate);assert.ok(state.heatLoad<exercised.heatLoad);assert.ok(state.demand<1.01);
 for(const input of [NaN,Infinity,-100,200]){const next=stepTwin(rest,input,.5);assert.ok(Object.values(next).every(Number.isFinite));assert.ok(next.heartRate>=72&&next.heartRate<=176);}
 assert.deepEqual(stepTwin(rest,100,NaN),rest);
});
test('digital twin lag remains continuous and approximately frame-rate independent',()=>{let a=initialTwinState(),b=initialTwinState();for(let i=0;i<600;i++)a=stepTwin(a,55,.1);for(let i=0;i<1200;i++)b=stepTwin(b,55,.05);assert.ok(Math.abs(a.heartRate-b.heartRate)<.1);assert.ok(Math.abs(a.breathingRate-b.breathingRate)<.1);const first=stepTwin(initialTwinState(),100,.1);assert.ok(first.heartRate<73);assert.ok(first.demand<1.1);});


test('guided twin protocols advance at exact boundaries and finish in recovery',()=>{
 assert.equal(protocolFrame('free',0),null);
 for(const protocol of twinProtocols){let seconds=0;for(const [index,phase] of protocol.phases.entries()){const frame=protocolFrame(protocol.id,seconds)!;assert.equal(frame.index,index);assert.equal(frame.activity,phase.activity);assert.equal(frame.complete,false);assert.equal(protocolFrame(protocol.id,seconds+phase.seconds-.001)!.index,index);seconds+=phase.seconds;}assert.equal(protocolFrame(protocol.id,seconds)!.complete,true);assert.equal(protocolFrame(protocol.id,seconds+100)!.complete,true);assert.equal(protocol.phases.at(-1)!.activity,0);}
});
test('guided intervals retain a thermal footprint across short recovery',()=>{
 let state=initialTwinState();const observations:Record<string,ReturnType<typeof initialTwinState>>={};let previous='';for(let i=0;i<2150;i++){const phase=protocolFrame('interval',i/10)!;if(previous&&previous!==phase.name)observations[previous]={...state};previous=phase.name;state=stepTwin(state,phase.activity,.1);assert.ok(Object.values(state).every(Number.isFinite));}
 assert.ok(observations['First effort'].heartRate>120);assert.ok(observations['Short recovery'].heartRate<observations['First effort'].heartRate);assert.ok(observations['Second effort'].heatLoad>observations['First effort'].heatLoad);assert.ok(state.heatLoad<observations['Second effort'].heatLoad);
});
