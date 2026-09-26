import { useSemanticZoom } from './useSemanticZoom';
import { useEffect, useRef, type ComponentRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box3, MOUSE, PerspectiveCamera, Vector3 } from 'three';
import { useAtlasStore } from '../store/atlasStore';
import { anatomyModels } from '../data/modelRegistry';
import { CAMERA_PRESETS, getZoomLevel } from '../config/viewer';
import { useSceneRegistry } from '../components/atlas/SceneRegistry';
import { fitCameraToBox } from '../utils/camera';
export default function CameraRig({preview=false,animated=false}:{preview?:boolean;animated?:boolean}){
 useSemanticZoom(preview);
 const ref=useRef<ComponentRef<typeof OrbitControls>>(null);const {camera,size,gl}=useThree();const registry=useSceneRegistry();
 const command=useAtlasStore(s=>s.cameraCommand),tool=useAtlasStore(s=>s.tool);
 const destination=useRef({position:new Vector3(),target:new Vector3(),moving:false});const frame=useRef(0);const userInteracted=useRef(false);const previous=useRef({serial:-1,version:-1});
 useEffect(()=>{const bounds=registry.bounds();if(bounds.isEmpty())return;const controls=ref.current;if(!controls||!(camera instanceof PerspectiveCamera))return;
  camera.aspect=size.width/Math.max(1,size.height);camera.updateProjectionMatrix();
  const target=controls.target.clone(),position=camera.position.clone();const direction=camera.position.clone().sub(target).normalize();
  const repeated=previous.current.serial===command.serial;
  // Sidebar/fullscreen resize fits the current selection; it must not replay the last zoom step.
  const effective=preview?{type:'reset',value:undefined}:repeated?{type:'focus',value:useAtlasStore.getState().selectedId}:command;
  previous.current={serial:command.serial,version:registry.version};
  if(effective.type==='restore'&&useAtlasStore.getState().cameraPose){const pose=useAtlasStore.getState().cameraPose!;position.fromArray(pose.position);target.fromArray(pose.target);}
  else if(effective.type==='zoom'){position.sub(target).multiplyScalar(Number(effective.value)).clampLength(.06,300).add(target);}
  else if(effective.type==='depth'){const fullFit=fitCameraToBox(bounds,camera.fov,camera.aspect);const amount=Number(effective.value);position.copy(direction).multiplyScalar(fullFit.distance*amount).add(target);}
  else if(effective.type==='preset'){const preset=CAMERA_PRESETS[effective.value as keyof typeof CAMERA_PRESETS]??CAMERA_PRESETS.front;const fit=fitCameraToBox(registry.bounds(useAtlasStore.getState().selectedId),camera.fov,camera.aspect,new Vector3(...preset));if(!Number.isFinite(fit.distance))return;target.copy(fit.target);position.copy(fit.position);}
  else {const selected=effective.type==='focus'?registry.bounds(String(effective.value)):bounds;if(selected.isEmpty())return;const fit=fitCameraToBox(selected,camera.fov,camera.aspect,effective.type==='reset'?new Vector3(0,0,1):direction,preview?1.08:1.18);target.copy(fit.target);position.copy(fit.position);}
  if(!Number.isFinite(position.length()))return;
  destination.current={position,target,moving:true};
  camera.near=Math.max(.005,bounds.getSize(new Vector3()).length()/2000);camera.far=Math.max(1000,position.length()*10);camera.updateProjectionMatrix();
 },[preview,command,registry.version,size.width,size.height,camera]);
 useEffect(()=>{const canvas=gl.domElement;const stopMenu=(e:Event)=>e.preventDefault();canvas.addEventListener('contextmenu',stopMenu);return()=>canvas.removeEventListener('contextmenu',stopMenu);},[gl]);
 useFrame((_,dt)=>{const controls=ref.current;if(!controls)return;const d=destination.current;if(d.moving){const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const t=reduced?1:1-Math.exp(-Math.min(dt,.05)*5.5);camera.position.lerp(d.position,t);controls.target.lerp(d.target,t);controls.update();if(camera.position.distanceTo(d.position)<.001&&controls.target.distanceTo(d.target)<.001)d.moving=false;}
  if(!preview&&++frame.current%12===0){const s=useAtlasStore.getState();if(!d.moving&&(!s.cameraPose||camera.position.distanceTo(new Vector3(...s.cameraPose.position))>.001||controls.target.distanceTo(new Vector3(...s.cameraPose.target))>.001))useAtlasStore.setState({cameraPose:{position:camera.position.toArray(),target:controls.target.toArray()}});const bounds=registry.bounds();if(bounds.isEmpty())return;const scale=bounds.getSize(new Vector3()).length()/6.5;const distance=camera.position.distanceTo(controls.target)/Math.max(.1,scale);const level=getZoomLevel(distance);const organ=anatomyModels[s.activeModel]?.root!=='body';const id=organ?(distance<5?'STRUCTURE':'ORGAN'):level.id;if(s.zoomLevel!==id)s.set('zoomLevel',id);}
 });
 return <OrbitControls ref={ref} makeDefault enableDamping dampingFactor={.08} minDistance={.06} maxDistance={300} rotateSpeed={.65} zoomSpeed={.8} panSpeed={.7} enableRotate={preview||tool!=='select'&&tool!=='peel'} autoRotate={preview&&animated&&!userInteracted.current&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches} autoRotateSpeed={.12} onStart={()=>{destination.current.moving=false;userInteracted.current=true;if(!preview)useAtlasStore.setState({dragging:true,hoveredId:null,cameraView:'custom'});if(ref.current)ref.current.autoRotate=false;}} onEnd={()=>{if(!preview)useAtlasStore.setState({dragging:false});}} mouseButtons={{LEFT:tool==='pan'&&!preview?MOUSE.PAN:tool==='zoom'&&!preview?MOUSE.DOLLY:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN}}/>;
}


