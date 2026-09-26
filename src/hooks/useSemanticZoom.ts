import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSceneRegistry } from '../components/atlas/SceneRegistry';
import { useAtlasStore } from '../store/atlasStore';
import { anatomy } from '../data/anatomyTree';
import { semanticZoom } from '../config/education';
import { regionKey } from '../utils/semantic';

export function useSemanticZoom(preview=false){
 const registry=useSceneRegistry(),last=useRef(0),scale=useRef({version:-1,value:1});
 useFrame(({camera,controls,clock})=>{
  if(preview||clock.elapsedTime-last.current<.12)return;last.current=clock.elapsedTime;
  const state=useAtlasStore.getState();if(!registry.entries.size)return;
  if(scale.current.version!==registry.version){scale.current={version:registry.version,value:Math.max(.01,registry.bounds().getSize(new Vector3()).length()/6.5)};}
  const target=(controls as unknown as {target?:Vector3})?.target??new Vector3();const distance=camera.position.distanceTo(target)/scale.current.value;const zoom=semanticZoom(distance);
  let region:string|null=null;const selected=anatomy[state.selectedId];
  if(selected?.type==='muscle')region=regionKey(selected);
  else if(zoom.depth!=='BODY'){
   let best=Infinity;
   for(const entry of registry.entries){const n=anatomy[entry.id];if(n?.type!=='muscle'||!entry.mesh.visible)continue;
    const point=entry.mesh.getWorldPosition(new Vector3()),screen=point.clone().project(camera);if(screen.z< -1||screen.z>1||Math.abs(screen.x)>1||Math.abs(screen.y)>1)continue;
    const score=screen.x*screen.x+screen.y*screen.y+point.distanceTo(target)*.08/scale.current.value;
    if(score<best){best=score;region=regionKey(n);}
   }
  }
  const amount=state.autoSeparate&&state.systemFilter==='muscular'&&region?zoom.separation:0;
  if(state.semanticDepth!==zoom.depth||state.activeRegion!==region||Math.abs(state.autoSeparation-amount)>.003||state.modelScale!==scale.current.value)useAtlasStore.setState({semanticDepth:zoom.depth,activeRegion:region,autoSeparation:amount,modelScale:scale.current.value});
 });
}
