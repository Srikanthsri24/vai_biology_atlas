import { auditModel } from '../../utils/validation';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Box3, Color, MathUtils, Mesh, MeshStandardMaterial, Plane, Vector3, Texture } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { anatomy, isWithin } from '../../data/anatomyTree';
import { anatomyModels } from '../../data/modelRegistry';
import { useAtlasStore } from '../../store/atlasStore';
import { getOpacity } from '../../utils/visibility';
import { mapMeshToAnatomy } from '../../utils/meshMapping';
import { explosionOffset } from '../../utils/explosion';
import { useSceneRegistry, type SceneEntry } from './SceneRegistry';
type Record=SceneEntry&{base:Vector3;materials:MeshStandardMaterial[];colors:Color[];opacities:number[];baseTransparent:boolean[];baseDepthWrite:boolean[]};
export default function GLTFAnatomy({asset,model,preview=false,section=0,detail=false,detailVisible=true}:{asset:GLTF;model:string;preview?:boolean;section?:number;detail?:boolean;detailVisible?:boolean}){
 const sectionAxis=useAtlasStore(s=>s.sectionAxis);const {gl}=useThree();const config=anatomyModels[model];const {register}=useSceneRegistry();
 const {scene,meshes,scale,center}=useMemo(()=>{
  const scene=clone(asset.scene);scene.rotation.set(...config.gltfTransform.rotation);scene.scale.setScalar(config.gltfTransform.scale);scene.position.set(...config.gltfTransform.position);scene.updateMatrixWorld(true);
  const bounds=new Box3().setFromObject(scene);const scale=(config.targetHeight??6)/Math.max(.00001,...bounds.getSize(new Vector3()).toArray());const center=bounds.getCenter(new Vector3()).multiplyScalar(-scale);const records:Record[]=[];let unmatched=0;
  scene.traverse(obj=>{if(!(obj instanceof Mesh))return;const mapped=mapMeshToAnatomy(obj);const id=mapped??config.root;if(!mapped)unmatched++;
   const materials=(Array.isArray(obj.material)?obj.material:[obj.material]).map(material=>{const copy=material.clone() as MeshStandardMaterial;for(const v of Object.values(copy))if(v instanceof Texture)v.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());return copy;});
   obj.material=Array.isArray(obj.material)?materials:materials[0];obj.userData.atlasId=id;obj.frustumCulled=true;obj.castShadow=true;obj.receiveShadow=true;records.push({mesh:obj,id,layer:anatomy[id].layer,base:obj.position.clone(),materials,colors:materials.map(m=>m.color?.clone()??new Color('white')),opacities:materials.map(m=>m.opacity),baseTransparent:materials.map(m=>m.transparent),baseDepthWrite:materials.map(m=>m.depthWrite)});
  });if(unmatched)console.warn(`[Human Atlas] ${unmatched} unmapped meshes in ${model}. Add meshNames entries; they currently select the atlas root.`);
  if(detail)records.forEach(r=>r.materials.forEach(m=>m.opacity=0));return {scene,meshes:records,scale,center};
 },[asset,config,gl,model,detail]);
 useLayoutEffect(()=>register(meshes),[meshes]);
 useEffect(()=>{if(!preview&&!detail)useAtlasStore.setState({assetReport:auditModel(scene,model)});},[scene,model,preview]);
 useEffect(()=>()=>meshes.forEach(r=>r.materials.forEach(m=>m.dispose())),[meshes]);
 const plane=useMemo(()=>new Plane(sectionAxis==='sagittal'?new Vector3(-1,0,0):sectionAxis==='transverse'?new Vector3(0,-1,0):new Vector3(0,0,-1),section),[section,sectionAxis]);const clipping=useMemo(()=>[plane],[plane]);const offset=useMemo(()=>new Vector3(),[]),zero=useMemo(()=>new Vector3(),[]),selectionColor=useMemo(()=>new Color('#80b3b7'),[]);
 useFrame((_,dt)=>{const s=useAtlasStore.getState();for(const r of meshes){const opacity=detail&&!detailVisible?0:preview?1:!detail&&s.detailRoot&&isWithin(r.id,s.detailRoot)?0:getOpacity(r.id,r.layer,s);const selected=!preview&&s.selectedId!==config.root&&isWithin(r.id,s.selectedId),hover=!preview&&s.hoveredId===r.id;
   r.mesh.visible=opacity>.005||r.materials.some(m=>m.opacity>.01);r.materials.forEach((m,i)=>{m.opacity=MathUtils.damp(m.opacity,opacity*r.opacities[i],8,Math.min(dt,.05));const faded=m.opacity<r.opacities[i]-.005;const transparent=r.baseTransparent[i]||faded;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.depthWrite=r.baseDepthWrite[i]&&!faded;if(m.color)m.color.copy(r.colors[i]).lerp(selectionColor,selected?.18:hover?.1:0);m.clippingPlanes=!preview&&s.mode==='section'?clipping:null;});
   explosionOffset(r.id,r.layer,preview?{...s,explosion:0,autoSeparation:0}:s,offset);if(r.mesh.parent){zero.set(0,0,0);r.mesh.parent.worldToLocal(zero);r.mesh.parent.worldToLocal(offset);offset.sub(zero);}offset.add(r.base);r.mesh.position.lerp(offset,1-Math.exp(-dt*6));
  }});
 function interact(e:ThreeEvent<MouseEvent|PointerEvent>,action:'hover'|'select'|'focus'){
  if(preview)return;const mesh=e.object as Mesh,id=mesh.userData.atlasId;const s=useAtlasStore.getState();if(!id||!mesh.visible||getOpacity(id,anatomy[id].layer,s)<.12||s.dragging||('delta'in e&&e.delta>4))return;e.stopPropagation();
  if(action==='hover')s.set('hoveredId',id);else if(s.tool==='peel')s.peel(id);else s.select(id,action==='focus'||s.tool!=='select');
 }
 return <group scale={scale} position={center}><primitive object={scene} onClick={(e:ThreeEvent<MouseEvent>)=>interact(e,'select')} onDoubleClick={(e:ThreeEvent<MouseEvent>)=>interact(e,'focus')} onPointerOver={(e:ThreeEvent<PointerEvent>)=>interact(e,'hover')} onPointerOut={()=>useAtlasStore.setState({hoveredId:null})}/></group>;
}


