import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Group, Vector3 } from 'three';
import { Material, Part, Sphere, Tube, type StudyProps } from './JourneyPrimitives';
import type { JourneyPath } from '../../data/journey';

import { renalTubePath as renalTube } from '../../data/journeyTravel';

export function Flow({p,points,color='#80c8d1',count=12,id}:{p:StudyProps;points:[number,number,number][];color?:string;count?:number;id?:string}){
 const ref=useRef<Group>(null),coordinates=JSON.stringify(points);
 const curve=useMemo(()=>new CatmullRomCurve3((JSON.parse(coordinates) as [number,number,number][]).map(point=>new Vector3(...point))),[coordinates]);
 useFrame(()=>{ref.current?.children.forEach((object,i)=>object.position.copy(curve.getPoint((p.clock.current*.09+i/count)%1)));});
 return <group ref={ref}>{Array.from({length:count},(_,i)=><group key={i}>{id?<Part id={id} p={{...p,labels:p.labels&&i===0}}><Sphere scale={[.06,.06,.06]} color={color} p={p}/></Part>:<mesh raycast={()=>{}}><sphereGeometry args={[.045,10,8]}/><Material color={color} p={p}/></mesh>}</group>)}</group>;
}
function Alveolus({p}:{p:StudyProps}){
 const breathing=useRef<Group>(null);
 useFrame(()=>breathing.current?.scale.setScalar(1+.035*Math.sin(p.clock.current*1.5)));
 const loop=Array.from({length:45},(_,i)=>{const a=i/44*Math.PI*2;return [Math.cos(a)*1.85,Math.sin(a)*1.85,.2+Math.sin(a*3)*.15] as [number,number,number];});
 return <><group ref={breathing}><Part id="alveolus-wall" p={p}><Sphere scale={[1.6,1.5,1.4]} color="#b19a9e" p={p} opacity={.18}/>{Array.from({length:16},(_,i)=>{const a=i*Math.PI*2/16;return <group key={i} position={[Math.cos(a)*1.4,Math.sin(a)*1.3,0]}><Sphere scale={[.17,.14,.08]} color="#c3adaf" p={p} opacity={.65}/></group>;})}</Part></group><Part id="capillary" p={p} offset={[.4,0,.4]}><Tube points={loop} radius={.11} color="#a54f60" p={p}/></Part><Flow p={p} points={[[0,0,0],[.7,.3,.4],[1.7,.5,.2]]} id="oxygen-gas"/><Flow p={p} points={[[-1.7,-.4,.2],[-.8,-.2,.2],[0,0,0]]} color="#d1b57b" id="carbon-dioxide-gas"/></>;
}
function Nephron({p}:{p:StudyProps}){
 const tuft=Array.from({length:100},(_,i)=>{const a=i*.4;return [Math.cos(a)*(.5+.1*Math.sin(a*3)),.65+Math.sin(a)*.45,Math.sin(a*2)*.27] as [number,number,number];});
 return <><Part id="capsule" p={p} position={[0,.65,0]} offset={[0,.8,0]}><Sphere scale={[.9,.8,.7]} color="#b3977c" opacity={.18} p={p}/></Part><Part id="glomerulus" p={p} offset={[-.6,.3,.4]}><Tube points={tuft} radius={.055} color="#b96372" p={p}/></Part><Part id="tubule" p={p}><Tube points={renalTube} radius={.12} color="#c2ad78" p={p}/></Part><Part id="collecting-duct" p={p} offset={[-.5,0,0]}><Tube points={[[-1.4,.3,0],[-1.45,-.7,0],[-1.45,-2.2,0]]} radius={.15} color="#a99570" p={p}/></Part><Flow p={p} points={renalTube}/></>;
}
function Villus({p}:{p:StudyProps}){
 return <><Part id="villus" p={p}><Sphere scale={[.8,1.7,.7]} color="#b89b88" p={p} opacity={.18}/></Part><Part id="epithelium" p={p} offset={[.7,.1,.4]}>{Array.from({length:18},(_,i)=>{const a=i/17*Math.PI;return <group key={i} position={[Math.cos(a)*.75,Math.sin(a)*1.5-.25,0]}><Sphere scale={[.15,.21,.14]} color="#c9ad97" p={p}/>{[0,1,2].map(j=><mesh key={j} position={[(j-1)*.08,.27,0]}><capsuleGeometry args={[.022,.12,3,6]}/><Material color="#d8c3a9" p={p}/></mesh>)}</group>;})}</Part><Part id="capillary" p={p} offset={[-.6,0,0]}><Tube points={[[-.35,-1.8,0],[-.45,.5,0],[0,1.2,0],[.45,.5,0],[.35,-1.8,0]]} radius={.075} color="#b85d6b" p={p}/></Part><Part id="lacteal" p={p} offset={[0,0,.5]}><Tube points={[[0,-1.8,.1],[0,-.2,.1],[0,.9,.1]]} radius={.1} color="#8fa184" p={p}/></Part><Flow p={p} points={[[1.8,.7,.2],[.7,.6,.2],[.3,0,.2],[.3,-1.6,.2]]} color="#d0bc76"/></>;
}
function Sarcomere({p}:{p:StudyProps}){
 const left=useRef<Group>(null),right=useRef<Group>(null);
 useFrame(()=>{const d=2-.45*(.5+.5*Math.sin(p.clock.current*1.6));if(left.current)left.current.position.x=-d;if(right.current)right.current.position.x=d;});
 return <>{[-1,1].map(side=><group key={side} ref={side===-1?left:right}><Part id="z-disc" p={{...p,labels:p.labels&&side===-1}} offset={[side*.6,0,0]}><mesh><boxGeometry args={[.08,1.5,1]}/><Material color="#bcaab6" p={p}/></mesh></Part><Part id="actin" p={{...p,labels:p.labels&&side===1}}>{[-.5,-.25,0,.25,.5].map((y,i)=><Tube key={i} points={[[0,y,.2],[side*-1.4,y,.2]]} radius={.025} color="#9fb8c4" p={p}/>)}</Part></group>)}<Part id="myosin" p={p} offset={[0,0,.6]}>{[-.38,-.12,.12,.38].map((y,i)=><group key={i}><Tube points={[[-.9,y,0],[.9,y,0]]} radius={.065} color="#bb8a87" p={p}/>{Array.from({length:8},(_,j)=><Tube key={j} points={[[j*.22-.8,y,0],[j*.22-.75,y+.12,.16]]} radius={.022} color="#d0a09a" p={p}/>)}</group>)}</Part></>;
}
export default function TissueLabs({p,path}:{p:StudyProps;path:JourneyPath}){return path==='respiratory'?<Alveolus p={p}/>:path==='renal'?<Nephron p={p}/>:path==='digestive'?<Villus p={p}/>:<Sarcomere p={p}/>;}
