import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { CatmullRomCurve3, Group, MathUtils, Mesh, MeshStandardMaterial, Plane, TubeGeometry, Vector3 } from 'three';
export type StudyProps={selected:string;onSelect:(id:string)=>void;labels:boolean;transparent:boolean;section:boolean;explode:number;playing:boolean;speed:number;clock:{current:number};isolated?:string;hidden?:string[]};
export function Part({id,position=[0,0,0],offset=[0,0,0],children,p}: {id:string;position?:[number,number,number];offset?:[number,number,number];children:React.ReactNode;p:StudyProps}){
 const group=useRef<Group>(null);
 useFrame((_,dt)=>{if(group.current){let containsSelection=!p.isolated||p.isolated===id;if(!containsSelection)group.current.traverse(o=>{if(o.userData.journeyId===p.isolated)containsSelection=true;});group.current.visible=containsSelection&&!p.hidden?.includes(id);for(let i=0;i<3;i++)group.current.position.setComponent(i,MathUtils.damp(group.current.position.getComponent(i),position[i]+offset[i]*p.explode,6,Math.min(dt,.05)));}});
 useEffect(()=>{group.current?.traverse(o=>{if(o instanceof Mesh)for(const m of (Array.isArray(o.material)?o.material:[o.material]) as MeshStandardMaterial[]){if(!m.emissive)continue;m.userData.journeyEmissive??=m.emissive.clone();m.emissive.copy(m.userData.journeyEmissive);if(p.selected===id)m.emissive.addScalar(.09);}});},[p.selected,id]);
 function select(e:ThreeEvent<MouseEvent>){if(e.delta>5)return;e.stopPropagation();p.onSelect(id);}
 const name=id==='red-cell'?'Red cell':id==='dna'?'DNA':id==='rna'?'RNA':id==='trna'?'tRNA':id[0].toUpperCase()+id.slice(1).replaceAll('-',' ');
 return <group ref={group} position={position} userData={{journeyId:id,journeyLabel:p.labels?name:undefined}} onClick={select}>{children}</group>;
}
export function Material({color,p,opacity=1}:{color:string;p:StudyProps;opacity?:number}){
 const plane=useMemo(()=>new Plane(new Vector3(0,0,-1),0),[]);
 return <meshStandardMaterial color={color} roughness={.6} transparent opacity={opacity} userData={{journeyOpacity:opacity}} depthWrite={opacity===1&&!p.transparent} clippingPlanes={p.section?[plane]:[]} side={2}/>;
}
export function Sphere({scale=[1,1,1],color,p,opacity=1}:{scale?:[number,number,number];color:string;p:StudyProps;opacity?:number}){return <mesh scale={scale}><sphereGeometry args={[1,32,24]}/><Material color={color} p={p} opacity={opacity}/></mesh>;}
export function Tube({points,radius=.04,color,p}:{points:[number,number,number][];radius?:number;color:string;p:StudyProps}){
 const coordinates=JSON.stringify(points);
 const geometry=useMemo(()=>new TubeGeometry(new CatmullRomCurve3((JSON.parse(coordinates) as [number,number,number][]).map(v=>new Vector3(...v))),48,radius,10,false),[coordinates,radius]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry}><Material color={color} p={p}/></mesh>;
}
export function MovingMarkers({p,kind}:{p:StudyProps;kind:'transport'|'energy'|'impulse'|'transcription'}){
 const group=useRef<Group>(null);
 useFrame(()=>{group.current?.children.forEach((object,i)=>{const t=(p.clock.current*.13+i/10)%1;const dot=object as Mesh;
 if(kind==='transport')dot.position.set((t-.5)*5,Math.sin(i*2.3)*.55,Math.cos(i*2.3)*.55);
 else if(kind==='impulse')dot.position.set(0,0,-t*6);
 else if(kind==='transcription')dot.position.set(1.25+.1*Math.sin(t*7),-1.8+t*3,.1);
 else dot.position.set(Math.cos(t*Math.PI*2)*1.8,Math.sin(t*Math.PI*2)*.6,.45);
 });});
 return p.isolated?null:<group ref={group}>{Array.from({length:10},(_,i)=><mesh key={i} raycast={()=>{}}><sphereGeometry args={[.055,12,8]}/><meshStandardMaterial color={kind==='impulse'?'#e0c778':'#76c2ce'} emissive={kind==='impulse'?'#9d7834':'#35636d'} emissiveIntensity={.25}/></mesh>)}</group>;
}
