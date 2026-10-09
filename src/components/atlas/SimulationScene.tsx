import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { useSceneRegistry } from './SceneRegistry';
import { simulationById } from '../../data/simulations';
import { simulationClock, useSimulationStore } from '../../store/simulationStore';
import { useAtlasStore } from '../../store/atlasStore';

/** Flow markers are educational overlays; they never modify the cached asset. */
export default function SimulationScene(){
 const registry=useSceneRegistry(),group=useRef<Group>(null),lastPublish=useRef(0);
 const point=useMemo(()=>new Vector3(),[]),size=useMemo(()=>new Vector3(),[]);
 const route=useRef<Vector3[]>([]),refresh=useRef(0),lastLesson=useRef<string|undefined>(undefined);
 useFrame((_,dt)=>{
  const state=useSimulationStore.getState(),lesson=simulationById(state.id);
  if(!group.current)return;
  group.current.visible=!!lesson&&state.markers&&useAtlasStore.getState().mode!=='section';
  if(!lesson){route.current=[];lastLesson.current=undefined;return;}
  if(lastLesson.current!==lesson.id){route.current=[];lastLesson.current=lesson.id;}
  if(state.playing&&!document.hidden)simulationClock.phase=(simulationClock.phase+Math.min(dt,.05)*state.speed/lesson.duration)%1;
  lastPublish.current+=dt;
  if(lastPublish.current>.1){lastPublish.current=0;if(state.phase!==simulationClock.phase)useSimulationStore.setState({phase:simulationClock.phase});}
  refresh.current+=dt;
  if(refresh.current>.12||!route.current.length){
   refresh.current=0;route.current=lesson.routeIds.flatMap(id=>{const bounds=registry.bounds(id,true);return bounds.isEmpty()?[]:[bounds.getCenter(new Vector3())];});
  }
  const points=route.current;
  const bounds=registry.bounds(lesson.focus,true);if(bounds.isEmpty()){group.current.visible=false;return;}
  bounds.getSize(size);const unit=Math.max(.08,Math.min(1,size.length()/4));
  group.current.children.forEach((child,index)=>{
   const dot=child as Mesh;dot.visible=points.length>0;if(!points.length)return;
   const t=(simulationClock.phase+index/12)%1;

   if(points.length===1){
    if(!['filtration','ovarian'].includes(lesson.id)){dot.visible=false;return;}
    // Conceptual kidney processing loop; no invented nephron mesh mapping.
    point.copy(points[0]);point.x+=Math.cos(t*Math.PI*2)*size.x*.4;point.y+=Math.sin(t*Math.PI*2)*size.y*.4;point.z+=size.z*.55;
   }else{
    const progress=lesson.id==='breathing'?(simulationClock.phase<.5?t:1-t):t;
    const u=progress*(points.length-1),segment=Math.min(points.length-2,Math.floor(u));
    point.lerpVectors(points[segment],points[segment+1],u-segment);
   }
   dot.position.copy(point);dot.scale.setScalar(unit*(lesson.id==='ovarian'?1+.2*Math.sin(simulationClock.phase*Math.PI*2):1));
   const oxygenated=t>=.4&&t<.85;
   (dot.material as MeshBasicMaterial).color.set(lesson.id==='circulation'?(oxygenated?'#df6b73':'#66a4cd'):lesson.color);
   dot.visible=state.markers&&lesson.id!=='contraction';
  });
 });
 return <group ref={group}>{Array.from({length:12},(_,i)=><mesh key={i} raycast={()=>{}}><sphereGeometry args={[.045,12,8]}/><meshBasicMaterial color="#d6b778" depthTest={false} transparent opacity={.9}/></mesh>)}</group>;
}
