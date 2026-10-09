import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, LatheGeometry, Vector2 } from 'three';
import { Material, MovingMarkers, Part, Sphere, Tube, type StudyProps } from './JourneyPrimitives';
import type { JourneyPath } from '../../data/journey';

function Neuron({p}:{p:StudyProps}){
 return <><Part id="neuron" p={p}><Sphere color="#b6a073" p={p} scale={[.75,.65,.65]}/><Sphere color="#938593" p={p} scale={[.32,.32,.32]} opacity={.7}/><Tube points={[[0,0,0],[.1,.03,-3],[0,0,-6]]} radius={.09} color="#c2ab7b" p={p}/>
 {Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,dx=Math.cos(a),dy=Math.sin(a);return <group key={i}><Tube points={[[dx*.3,dy*.3,0],[dx*.9,dy*.9,.15],[dx*1.4,dy*1.4,.25]]} radius={.065} color="#b6a073" p={p}/>{[-1,1].map(side=><Tube key={side} points={[[dx*1.05,dy*1.05,.2],[dx*1.55-dy*side*.25,dy*1.55+dx*side*.25,.3],[dx*1.9-dy*side*.6,dy*1.9+dx*side*.6,.4]]} radius={.027} color="#b6a073" p={p}/>)}</group>;})}
 {Array.from({length:6},(_,i)=><mesh key={i} position={[.05,0,-.8-i*.8]} rotation={[Math.PI/2,0,0]}><capsuleGeometry args={[.18,.45,6,16]}/><Material color="#c7baa1" p={p} opacity={.8}/></mesh>)}
 </Part><MovingMarkers p={p} kind="impulse"/></>;
}

function NuclearContents({p}:{p:StudyProps}){return <group>{Array.from({length:3},(_,j)=><Tube key={j} points={Array.from({length:25},(_,i)=>[Math.cos(i*.7+j*2)*.32,Math.sin(i*.7)*.25,(i/24-.5)*.6] as [number,number,number])} radius={.015} color="#b3a5c7" p={p}/>)}</group>;}

export function TissueScene({p,path}:{p:StudyProps;path:JourneyPath}){
 const cells=useRef<Group>(null);
 const disc=useMemo(()=>new LatheGeometry([[0,.04],[.08,.05],[.2,.12],[.32,.1],[.36,0],[.32,-.1],[.2,-.12],[.08,-.05],[0,-.04]].map(v=>new Vector2(...v as [number,number])),32),[]);
 useEffect(()=>()=>disc.dispose(),[disc]);
 useFrame(()=>{cells.current?.children.forEach((g,i)=>{g.position.z=5-((p.clock.current*.6+i*1.7)%12);g.rotation.z=p.clock.current*.12+i;});});
 if(path==='neuron')return <Neuron p={p}/>;
 return <><Part id="wall" p={p}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1.6,1.6,16,48,1,true]}/><Material color="#9b5964" p={p} opacity={.35}/></mesh></Part><group ref={cells}>{Array.from({length:7},(_,i)=><group key={i} position={[Math.sin(i*2.1)*.8,Math.cos(i*2.1)*.8,0]}><Part id="red-cell" p={{...p,labels:p.labels&&i===0}}><mesh geometry={disc} rotation={[Math.PI/2,.5,0]}><Material color="#a83f50" p={p}/></mesh></Part></group>)}</group></>;
}
export function Mitochondrion({p}:{p:StudyProps}){return <><Sphere color="#bc8d6a" scale={[1.15,.52,.5]} p={p} opacity={.22}/>{Array.from({length:7},(_,i)=><Tube key={i} points={[[i*.25-.75,-.28,0],[i*.25-.65,.3,.05],[i*.25-.55,-.28,0]]} radius={.045} color="#cfa774" p={p}/>)}</>;}
export function CellScene({p,organelle=false}:{p:StudyProps;organelle?:boolean}){
 if(organelle)return <><Part id="mitochondrion" p={p} position={[-.9,0,0]} offset={[-.9,0,0]}><Mitochondrion p={p}/></Part><Part id="nucleus" p={p} position={[1.05,.1,0]} offset={[.9,0,0]}><Sphere scale={[.68,.68,.68]} color="#847999" p={p} opacity={.4}/><Sphere scale={[.2,.2,.2]} color="#aea1bf" p={p}/><NuclearContents p={p}/></Part><MovingMarkers p={p} kind="energy"/></>;
 return <><Part id="membrane" p={p}><Sphere scale={[2.15,1.55,1.45]} color="#7ea4ad" p={p} opacity={.13}/></Part><Part id="nucleus" p={p} position={[-.3,.12,0]} offset={[-.7,.5,0]}><Sphere scale={[.68,.65,.6]} color="#837497" p={p} opacity={.35}/><NuclearContents p={p}/></Part>{[[-1,-.55,0],[1,.4,.15],[.5,-.75,0]].map((v,i)=><Part id="mitochondrion" key={i} p={{...p,labels:p.labels&&i===1}} position={v as [number,number,number]} offset={[v[0],v[1],.25]}><group scale={.45}><Mitochondrion p={p}/></group></Part>)}{Array.from({length:12},(_,i)=><Part key={i} id="ribosome" p={{...p,labels:p.labels&&i===0}} position={[Math.cos(i*2.4)*1.6,Math.sin(i*2.4)*1.15,.4]} offset={[0,0,.5]}><Sphere scale={[.07,.07,.07]} color="#c4b898" p={p}/></Part>)}<Part id="reticulum" p={{...p,labels:p.labels&&p.selected==='reticulum'}} position={[-.5,.05,-.15]} offset={[-.6,0,-.4]}>{Array.from({length:6},(_,i)=><Tube key={i} points={Array.from({length:22},(_,j)=>{const a=j/21*4.7;return [Math.cos(a)*(.8+i*.075),Math.sin(a)*(.55+i*.04),i*.05] as [number,number,number];})} radius={.03} color="#839ba6" p={p}/>)}</Part><Part id="golgi" p={{...p,labels:p.labels&&p.selected==='golgi'}} position={[1,-.5,.3]} offset={[.6,-.4,.5]}>{Array.from({length:5},(_,i)=><group key={i} position={[0,i*.09,0]}><Sphere scale={[.38,.035,.2]} color="#b798a3" p={p}/></group>)}</Part><Part id="lysosome" p={{...p,labels:p.labels&&p.selected==='lysosome'}} position={[-1.15,.55,.5]} offset={[-.5,.5,.5]}><Sphere scale={[.16,.16,.16]} color="#9fa887" p={p}/></Part><MovingMarkers p={p} kind="transport"/></>;
}
export function DNAScene({p}:{p:StudyProps}){
 const strands=useMemo(()=>[0,Math.PI].map(shift=>Array.from({length:81},(_,i)=>{const a=i*.22+shift;return [Math.cos(a)*.65,(i/80-.5)*4.3,Math.sin(a)*.65] as [number,number,number];})),[]);
 return <><Part id="dna" p={p}><Part id="dna" p={{...p,labels:false}} offset={[-.7,0,0]}><Tube points={strands[0]} radius={.065} color="#72aeb6" p={p}/></Part><Part id="dna" p={{...p,labels:false}} offset={[.7,0,0]}><Tube points={strands[1]} radius={.065} color="#d7a786" p={p}/></Part>{Array.from({length:32},(_,i)=>{const a=i/31*80*.22,y=(i/31-.5)*4.3;return <Part id="dna" p={{...p,labels:false}} key={i} offset={[0,0,.5]}><Tube points={[[Math.cos(a)*.65,y,Math.sin(a)*.65],[-Math.cos(a)*.65,y,-Math.sin(a)*.65]]} radius={.026} color={i%2?'#a394bd':'#b8bc81'} p={p}/></Part>;})}</Part><Part id="rna" p={p} position={[1.25,0,0]} offset={[.6,0,0]}><Tube points={[[0,-1.8,0],[.1,-.8,.3],[-.1,.2,0],[.1,1.2,.3]]} color="#c6bc75" p={p}/></Part><MovingMarkers p={p} kind="transcription"/></>;
}
export function MoleculeScene({p}:{p:StudyProps}){
 const group=useRef<Group>(null);
 useFrame((_,dt)=>{if(group.current)group.current.rotation.y=p.clock.current*.25;});
 const h:[number,number,number][]=[[1.1,.85,0],[-1.1,.85,0]];
 return <group ref={group}><Part id="oxygen" p={p}><Sphere scale={[.55,.55,.55]} color="#b85c69" p={p}/></Part>{h.map((v,i)=><group key={i}>{!p.isolated&&!p.hidden?.includes('hydrogen')&&!p.hidden?.includes('oxygen')&&<Tube points={[[0,0,0],v]} radius={.045} color="#c2cbd1" p={p}/>}<Part id="hydrogen" p={{...p,labels:p.labels&&i===0}} position={v} offset={[v[0]*.45,v[1]*.45,0]}><Sphere scale={[.3,.3,.3]} color="#e2e7e9" p={p}/></Part></group>)}</group>;
}
