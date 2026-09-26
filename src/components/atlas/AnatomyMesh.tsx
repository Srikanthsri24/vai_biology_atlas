import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { CatmullRomCurve3, Color, DoubleSide, MathUtils, Mesh, MeshStandardMaterial, Plane, TubeGeometry, Vector3 } from 'three';
import type { Part } from '../../data/proceduralParts';
import { useAtlasStore } from '../../store/atlasStore';
import { anatomy, isWithin } from '../../data/anatomyTree';
import { layers } from '../../data/modelRegistry';
import { getOpacity } from '../../utils/visibility';
import { useSceneRegistry } from './SceneRegistry';
import { explosionOffset } from '../../utils/explosion';
const selectedColor=new Color('#719d9f');
export function getPartOffset(id:string,layer:string,amount:number,model:string){const dir=['body','male','female'].includes(model)?layers.find(l=>l.id===layer)?.direction:anatomy[id]?.explodeDirection;return new Vector3(...(dir??[0,0,0])).multiplyScalar(amount*(['heart','brain'].includes(model)?.5:.7));}
export default function AnatomyMesh({part,preview=false,previewModel='body',section=0}:{part:Part;preview?:boolean;previewModel?:string;section?:number}){
 const {register}=useSceneRegistry();const layer=part.layer==='muscles'?anatomy[part.id]?.layer??part.layer:part.layer;
 const mesh=useRef<Mesh>(null);const material=useRef<MeshStandardMaterial>(null);const base=useMemo(()=>new Vector3(...part.position),[part]);const color=useMemo(()=>new Color(part.color),[part.color]);const target=useMemo(()=>new Vector3(),[]);const plane=useMemo(()=>new Plane(new Vector3(0,0,-1),section),[section]);
 const geometry=useMemo(()=>part.shape==='tube'&&part.points?new TubeGeometry(new CatmullRomCurve3(part.points.map(p=>new Vector3(...p))),Math.max(8,part.points.length*4),part.radius??.025,7,false):null,[part]);
 useEffect(()=>()=>geometry?.dispose(),[geometry]);
 useLayoutEffect(()=>mesh.current?register([{mesh:mesh.current,id:part.id,layer}]):undefined,[part,layer]);
 useFrame((_,dt)=>{if(!mesh.current||!material.current)return;const state=useAtlasStore.getState();const opacity=preview?(part.layer==='skin'?(previewModel==='body'?.8:1):1):getOpacity(part.id,layer,state);const mat=material.current;mat.opacity=MathUtils.damp(mat.opacity,opacity,7,Math.min(dt,.05));mesh.current.visible=mat.opacity>.009;mat.depthWrite=mat.opacity>.92;
  if(!preview)explosionOffset(part.id,layer,state,target);else target.set(0,0,0);target.add(base);mesh.current.position.lerp(target,1-Math.exp(-dt*6));
  const selected=!preview&&state.selectedId!=='body'&&isWithin(part.id,state.selectedId);const hover=!preview&&part.id===state.hoveredId;mat.color.copy(color).lerp(selectedColor,selected?.42:hover?.2:0);mat.emissive.set(selected?'#163d41':'#000000');mat.emissiveIntensity=selected?.12:0;mat.clippingPlanes=!preview&&state.mode==='section'?[plane]:[];
 });
 function pick(event:ThreeEvent<MouseEvent>){const s=useAtlasStore.getState();if(preview||!material.current||material.current.opacity<.1||s.dragging||event.delta>4)return;event.stopPropagation();if(s.tool==='peel')s.peel(part.id);else s.select(part.id,s.tool!=='select');}
 function hover(event:ThreeEvent<PointerEvent>){if(preview||!material.current||material.current.opacity<.1||useAtlasStore.getState().dragging)return;event.stopPropagation();useAtlasStore.setState({hoveredId:part.id});}
 return <mesh ref={mesh} userData={{atlasId:part.id}} position={part.position} scale={part.shape==='tube'?[1,1,1]:part.scale} rotation={part.rotation} geometry={geometry??undefined} castShadow onClick={pick} onDoubleClick={e=>{if(preview||e.delta>4)return;e.stopPropagation();useAtlasStore.getState().select(part.id);}} onPointerOver={hover} onPointerOut={()=>!preview&&useAtlasStore.setState({hoveredId:null})}>
  {!geometry&&(part.shape==='capsule'?<capsuleGeometry args={[1,1,5,14]}/>:<sphereGeometry args={[1,24,16]}/>)}
  <meshStandardMaterial ref={material} color={part.color} roughness={.72} metalness={0} transparent side={DoubleSide}/>
 </mesh>;
}
