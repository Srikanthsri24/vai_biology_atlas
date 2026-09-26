import { learningLevels } from '../../config/education';
import { regionKey } from '../../utils/semantic';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Box3, MeshStandardMaterial, Raycaster, Vector3 } from 'three';
import { anatomy, isWithin } from '../../data/anatomyTree';
import { useAtlasStore } from '../../store/atlasStore';
import { useSceneRegistry } from './SceneRegistry';
import { getOpacity } from '../../utils/visibility';
type Label={id:string;name:string;x:number;y:number;anchorX:number;anchorY:number;side:'left'|'right'};
export default function AnatomyLabels(){
 const registry=useSceneRegistry();const [labels,setLabels]=useState<Label[]>([]);const last=useRef(0);const signature=useRef('');const ray=useMemo(()=>new Raycaster(),[]);
 useFrame(({camera,size,clock})=>{if(clock.elapsedTime-last.current<.16)return;last.current=clock.elapsedTime;const s=useAtlasStore.getState();if(!s.labels||s.labelMode==='off'){if(signature.current!==''){signature.current='';setLabels([]);}return;}
  const max=Math.min(s.labelMode==='all'?12:s.zoomLevel==='BODY'?4:s.zoomLevel==='SYSTEM'?5:s.zoomLevel==='ORGAN'?7:8,learningLevels[s.learningLevel].labelLimit);
  const grouped=new Map<string,Box3>();const visible=[...registry.entries].filter(e=>e.mesh.visible&&getOpacity(e.id,e.layer,s)>.15);
  for(const entry of visible){let id=entry.id;const n=anatomy[id];if(!n)continue;if(s.zoomLevel==='BODY'&&s.systemFilter==='muscular'&&n.parent)id=n.parent;else if(s.zoomLevel==='BODY'&&!s.systemFilter){let current=n;while(current.parent&&current.parent!=='body')current=anatomy[current.parent];id=current.id;}
   entry.mesh.updateWorldMatrix(true,false);const box=new Box3().setFromObject(entry.mesh);const current=grouped.get(id);if(current)current.union(box);else grouped.set(id,box);
  }
  const candidates=[...grouped].map(([id,box])=>{const point=box.getCenter(new Vector3()).add(new Vector3(...(anatomy[id].labelAnchor??[0,0,0])).multiply(box.getSize(new Vector3()))),projection=point.clone().project(camera);return{id,point,projection,box,priority:id===s.selectedId?0:isWithin(id,s.selectedId)?1:regionKey(anatomy[id])===s.activeRegion?2:3,distance:point.distanceTo(camera.position)};}).filter(c=>c.projection.z>-1&&c.projection.z<1&&Math.abs(c.projection.x)<.98&&Math.abs(c.projection.y)<.92).sort((a,b)=>a.priority-b.priority||a.distance-b.distance);
  const chosen:Label[]=[];const occupied={left:[] as number[],right:[] as number[]};
  for(const c of candidates){if(chosen.length>=max)break;const normal=anatomy[c.id].labelNormal;if(normal&&c.id!==s.selectedId&&new Vector3(...normal).dot(camera.position.clone().sub(c.point).normalize())<-.05)continue;const screenX=(c.projection.x*.5+.5)*size.width,screenY=(-c.projection.y*.5+.5)*size.height;const side=screenX<size.width/2?'left':'right';let y=screenY;
   if(s.zoomLevel!=='BODY'){ray.set(camera.position,c.point.clone().sub(camera.position).normalize());ray.far=c.distance*.96;const opaque=visible.filter(e=>!isWithin(e.id,c.id)&&((Array.isArray(e.mesh.material)?e.mesh.material[0]:e.mesh.material) as MeshStandardMaterial).opacity>.85).map(e=>e.mesh);if(ray.intersectObjects(opaque,false).length)continue;}
   const gap=s.presentation?48:34;for(let attempt=0;attempt<12&&occupied[side].some(v=>Math.abs(v-y)<gap);attempt++)y+=attempt%2===0?gap:-gap*2;
   if(y<72||y>size.height-105||occupied[side].some(v=>Math.abs(v-y)<gap))continue;
   occupied[side].push(y);chosen.push({id:c.id,name:anatomy[c.id].name.replace('Muscles — ','').replace(/ — Left$/,' · L').replace(/ — Right$/,' · R'),x:side==='left'?22:Math.max(22,size.width-(size.width<700?162:s.presentation?262:182)),y,anchorX:screenX,anchorY:screenY,side});
  }
  const next=JSON.stringify(chosen.map(l=>[l.id,Math.round(l.anchorX),Math.round(l.anchorY),Math.round(l.y)]));if(signature.current!==next){signature.current=next;setLabels(chosen);}
 });
 return <Html fullscreen style={{pointerEvents:'none'}} zIndexRange={[8,0]}><div className="smart-labels" aria-label="Visible anatomical labels">{labels.map(l=><div className="smart-label" key={l.id} data-anatomy-label={l.name} data-anchor-x={l.anchorX} data-anchor-y={l.anchorY} style={{left:l.x,top:l.y}}><svg className="label-leader" aria-hidden="true" style={{left:-l.x,top:-l.y,width:'100vw',height:'100vh'}}><path d={`M ${l.anchorX} ${l.anchorY} L ${l.side==='left'?l.x+165:l.x-12} ${l.y+12} L ${l.side==='left'?l.x+145:l.x} ${l.y+12}`}/><circle cx={l.anchorX} cy={l.anchorY} r="2.4"/></svg><button className={useAtlasStore.getState().selectedId===l.id?'selected':''} onPointerEnter={()=>useAtlasStore.setState({hoveredId:l.id})} onPointerLeave={()=>useAtlasStore.setState({hoveredId:null})} onClick={()=>useAtlasStore.getState().select(l.id)}>{l.name}</button></div>)}</div></Html>;
}


