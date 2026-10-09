import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { moleculeAssembly } from '../../data/journeyMolecules';
import { CellScene, DNAScene, Mitochondrion, MoleculeScene } from './MicroScenes';
import { Flow } from './TissueLabs';
import { Material, MovingMarkers, Part, Sphere, Tube, type StudyProps } from './JourneyPrimitives';

function ProteinSynthesis({p}:{p:StudyProps}){
 const chain=useRef<Group>(null);
 useFrame(()=>{chain.current?.children.forEach((o,i)=>o.scale.setScalar(i/14<((p.clock.current%12)/12)?1:.08));});
 return <><Part id="ribosome" p={p} offset={[0,0,.8]}><group position={[0,.3,0]}><Sphere scale={[.85,.55,.5]} color="#bba999" p={p} opacity={.6}/></group><group position={[0,-.4,0]}><Sphere scale={[.7,.35,.4]} color="#9c8c86" p={p} opacity={.65}/></group></Part><Part id="rna" p={p} offset={[0,-.7,0]}><Tube points={[[-2,-.1,0],[-.5,0,0],[.6,0,0],[2,.2,0]]} radius={.055} color="#c4b879" p={p}/>{Array.from({length:18},(_,i)=><group key={i} position={[i*.2-1.7,0,0]}><Sphere scale={[.04,.08,.04]} color={i%2?'#84a8b6':'#c0959b'} p={p}/></group>)}</Part><Part id="trna" p={p} position={[.15,.9,0]} offset={[0,.6,0]}><Tube points={[[0,-.6,0],[0,-.1,0],[-.4,.1,0],[0,.4,0],[.4,.1,0],[0,-.1,0]]} color="#87acb0" p={p}/></Part><Part id="polypeptide" p={p} position={[.3,.5,.3]} offset={[.7,.3,0]}><group ref={chain}>{Array.from({length:14},(_,i)=><group key={i} position={[Math.sin(i*.65)*.35+i*.09,i*.13,0]}><Sphere scale={[.08,.08,.08]} color={i%2?'#b995b8':'#c9ac78'} p={p}/></group>)}</group></Part></>;
}
function Division({p}:{p:StudyProps}){
 const membranes=useRef<Group>(null),chromosomes=useRef<Group>(null);
 useFrame(()=>{const progress=(p.clock.current%12)/12,separation=Math.max(0,(progress-.35)/.65)*1.15;membranes.current?.children.forEach((o,i)=>{o.position.x=(i?1:-1)*separation;o.scale.set(1.35-separation*.3,1.4,1.1);});chromosomes.current?.children.forEach((o,i)=>o.position.x=(i%2?1:-1)*separation*.7);});
 return <><Part id="dividing-cell" p={p}><group ref={membranes}>{[-1,1].map(side=><group key={side}><Sphere color="#819ba9" opacity={.12} p={p}/></group>)}</group></Part><Part id="chromosome" p={p} offset={[0,0,.7]}><group ref={chromosomes}>{Array.from({length:8},(_,i)=><group key={i} position={[0,(Math.floor(i/2)-1.5)*.3,.2]}><Tube points={[[i%2?.08:-.08,-.12,0],[0,0,0],[i%2?.08:-.08,.12,0]]} radius={.035} color="#b58fb3" p={p}/></group>)}</group></Part><Part id="spindle" p={p} offset={[0,.7,-.4]}>{[-1,1].flatMap(side=>Array.from({length:7},(_,i)=><Tube key={`${side}-${i}`} points={[[side*1.2,0,0],[side*.6,(i-3)*.23,.1],[0,(i-3)*.19,.2]]} radius={.012} color="#b5c1aa" p={p}/>))}</Part></>;
}
function Organelle({p,study}:{p:StudyProps;study:string}){
 if(study==='ribosome')return <ProteinSynthesis p={p}/>;
 if(study==='mitochondrion')return <><Part id="mitochondrion" p={p}><group scale={1.5}><Mitochondrion p={p}/></group></Part><MovingMarkers p={p} kind="energy"/></>;
 if(study==='nucleus')return <><Part id="nucleus" p={p}><Sphere scale={[1.5,1.4,1.3]} color="#8c7a9c" opacity={.15} p={p}/></Part><Part id="chromatin" p={p} offset={[-.7,.2,0]}>{Array.from({length:5},(_,j)=><Tube key={j} points={Array.from({length:35},(_,i)=>[Math.cos(i*.7+j)*.8,Math.sin(i*.4+j)*.8,(i/34-.5)*1.6] as [number,number,number])} radius={.028} color="#b5a0c7" p={p}/>)}</Part><Part id="nucleolus" p={p} position={[.4,.25,.4]} offset={[.7,0,.3]}><Sphere scale={[.3,.3,.3]} color="#c4afcc" p={p}/></Part></>;
 if(study==='reticulum')return <><Part id="reticulum" p={p}>{Array.from({length:8},(_,i)=><Tube key={i} points={Array.from({length:25},(_,j)=>{const a=j/24*5.7;return [Math.cos(a)*(1+i*.08),Math.sin(a)*(.8+i*.05),i*.09-.4] as [number,number,number];})} radius={.065} color="#8fa8b4" p={p}/>)}</Part><Part id="ribosome" p={p} offset={[0,0,.8]}>{Array.from({length:20},(_,i)=><group key={i} position={[Math.cos(i)*1.3,Math.sin(i)*1,.4]}><Sphere scale={[.09,.09,.09]} color="#c8b89e" p={p}/></group>)}</Part></>;
 if(study==='golgi')return <><Part id="golgi" p={p}>{Array.from({length:7},(_,i)=><group key={i} position={[Math.sin(i*.6)*.15,(i-3)*.18,0]}><Sphere scale={[1.2,.08,.7]} color="#b699ac" p={p}/></group>)}</Part><Part id="vesicle" p={p} offset={[.7,0,.3]}><Flow p={p} points={[[-2,.8,0],[-1,.6,0],[0,.5,0],[1,.3,0],[2,-.3,0]]} count={5}/></Part></>;
 return <><Part id="lysosome" p={p}><Sphere scale={[1.25,1.25,1.25]} opacity={.18} color="#9ba57d" p={p}/></Part><Part id="cargo" p={p} offset={[1,0,0]}><Flow p={p} points={[[2,.5,0],[.8,.2,0],[0,0,0],[-.35,-.2,0]]} count={8} color="#c0b193"/></Part></>;
}
function Replication({p}:{p:StudyProps}){
 return <><Part id="parental-dna" p={p}>{[-1,1].map(side=><Tube key={side} points={Array.from({length:35},(_,i)=>{const y=i/34*2.4-2;return [side*(y<0?.25: .25+y*.55),y,Math.sin(i*.4+side)*.15] as [number,number,number];})} radius={.06} color={side===1?'#79afb8':'#c6a087'} p={p}/>)}</Part><Part id="new-dna" p={p} offset={[0,0,.6]}>{[-1,1].map(side=><Tube key={side} points={Array.from({length:25},(_,i)=>{const y=i/24*2.2;return [side*(.25+y*.55+.15),y,Math.cos(i*.5)*.15] as [number,number,number];})} radius={.045} color="#b3bb86" p={p}/>)}</Part><Part id="replication-fork" p={p} position={[0,0,0]}><Sphere scale={[.26,.2,.2]} color="#aa90b3" p={p}/></Part><Flow p={p} points={[[0,-1.8,.2],[0,0,.2],[1.4,2,.2]]} count={5}/></>;
}
function Chromatin({p}:{p:StudyProps}){
 const points:[number,number,number][]=[];for(let j=0;j<5;j++)for(let i=0;i<35;i++){const a=i/34*Math.PI*3.5;points.push([j*.7-1.4+Math.cos(a)*.31,Math.sin(a)*.31,(i/34-.5)*.4]);}
 return <><Part id="dna" p={p} offset={[0,.7,0]}><Tube points={points} radius={.035} color="#88b7c0" p={p}/></Part><Part id="histone" p={p} offset={[0,-.7,0]}>{Array.from({length:5},(_,i)=><group key={i} position={[i*.7-1.4,0,0]}><Sphere scale={[.23,.23,.2]} color="#b29ac1" p={p}/></group>)}</Part></>;
}

function Molecules({p,study}:{p:StudyProps;study:string}){
 const ref=useRef<Group>(null),assembly=moleculeAssembly(study);useFrame(()=>{if(ref.current)ref.current.rotation.y=p.clock.current*.22;});
 return <group ref={ref}>{!p.isolated&&assembly.bonds.filter(([a,b])=>!p.hidden?.includes(assembly.atoms[a].id)&&!p.hidden?.includes(assembly.atoms[b].id)).flatMap(([a,b],i)=>Array.from({length:assembly.bondOrders?.[i]??1},(_,j)=>{const shift=(assembly.bondOrders?.[i]??1)===2?(j? .055:-.055):0;return <Tube key={`${i}-${j}`} points={[assembly.atoms[a].position,assembly.atoms[b].position].map(([x,y,z])=>[x,y+shift,z] as [number,number,number])} radius={.03} color="#acbbc5" p={p}/>;}))}{assembly.atoms.map((atom,i)=><Part key={i} id={atom.id} position={atom.position} offset={atom.position.map(v=>v*.4) as [number,number,number]} p={{...p,labels:p.labels&&assembly.atoms.findIndex(a=>a.id===atom.id)===i}}><Sphere scale={atom.id==='hydrogen'?[.16,.16,.16]:[.3,.3,.3]} color={atom.id==='oxygen'?'#bd6875':atom.id==='hydrogen'?'#dde6eb':'#6f8595'} p={p}/></Part>)}</group>;
}
export default function CellularLabs({p,level,study}:{p:StudyProps;level:number;study:string}){
 if(level===3)return study==='translation'?<ProteinSynthesis p={p}/>:study==='division'?<Division p={p}/>:<CellScene p={p}/>;
 if(level===4)return <Organelle p={p} study={study}/>;
 if(level===5)return study==='replication'?<Replication p={p}/>:study==='chromatin'?<Chromatin p={p}/>:<DNAScene p={p}/>;
 return study==='water'?<MoleculeScene p={p}/>:<Molecules p={p} study={study}/>;
}
