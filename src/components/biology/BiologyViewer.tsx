import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Group, MathUtils, Mesh, MeshStandardMaterial } from 'three';
import { sceneParts, type BiologyScene } from '../../data/biology';
import { CellScene, DNAScene } from '../journey/MicroScenes';
import CellularLabs from '../journey/CellularLabs';
import { Part, Sphere, Tube, Material, type StudyProps } from '../journey/JourneyPrimitives';

function Plant({p}:{p:StudyProps}){return <>
 <Part id="roots" p={p} offset={[0,-.6,0]}>{[-1,0,1].map(i=><Tube key={i} p={p} color="#b8a079" radius={.055} points={[[0,-1.3,0],[i*.3,-1.65,.1],[i*.65,-2,.2]]}/>)}</Part>
 <Part id="stem" p={p}><Tube p={p} color="#5b8460" radius={.075} points={[[0,-1.4,0],[.05,0,0],[0,1.7,0]]}/></Part>
 <Part id="leaves" p={p} offset={[.6,.25,0]}>{[-1,1].flatMap(side=>[0,1,2].map(i=><group key={`${side}-${i}`} position={[side*.5,i*.65-.6,0]} rotation={[0,0,-side*.45]}><Sphere p={p} color={i%2?'#71996a':'#537f58'} scale={[.62,.23,.065]}/><Tube p={p} color="#b1c89b" radius={.015} points={[[-.5,0,.07],[0,0,.07],[.5,0,.07]]}/></group>))}</Part>
 </>;}
function Flower({p}:{p:StudyProps}){return <>
 <Part id="petals" p={p} offset={[.6,0,0]}>{Array.from({length:5},(_,i)=>{const angle=i*Math.PI*2/5;return <group key={i} position={[Math.cos(angle)*.8,Math.sin(angle)*.8,0]} rotation={[0,0,angle]}><Sphere p={p} scale={[.9,.42,.09]} color="#c791a3"/></group>;})}</Part>
 <Part id="stamens" p={p} offset={[-.5,0,.6]}>{Array.from({length:6},(_,i)=>{const angle=i*Math.PI/3,x=Math.cos(angle)*.35,y=Math.sin(angle)*.35;return <group key={i}><Tube p={p} radius={.025} color="#c4b77d" points={[[x,y,0],[x,y,.55]]}/><group position={[x,y,.58]}><Sphere p={p} color="#d4ba72" scale={[.08,.13,.07]}/></group></group>;})}</Part>
 <Part id="carpel" p={p}><Sphere p={p} color="#769b78" scale={[.2,.25,.18]}/><Tube p={p} color="#9cae82" radius={.045} points={[[0,0,0],[0,0,.85]]}/><group position={[0,0,.85]}><Sphere p={p} color="#8eb594" scale={[.16,.12,.1]}/></group></Part>
 </>;}
function Butterfly({p}:{p:StudyProps}){return <>
 <Part id="head" p={p} position={[0,.85,0]} offset={[0,.3,0]}><Sphere p={p} color="#92785c" scale={[.19,.2,.16]}/>{[-1,1].map(side=><Tube key={side} p={p} radius={.018} color="#c4b391" points={[[side*.07,.1,0],[side*.2,.4,0],[side*.3,.55,0]]}/>)}</Part>
 <Part id="thorax" p={p} position={[0,.25,0]}><Sphere p={p} color="#8c795e" scale={[.2,.45,.18]}/></Part>
 <Part id="abdomen" p={p} position={[0,-.65,0]} offset={[0,-.3,0]}><Sphere p={p} color="#ac916e" scale={[.17,.55,.15]}/></Part>
 <Part id="wings" p={p} offset={[.5,0,.2]}>{[-1,1].flatMap(side=>[0,1].map(i=><group key={`${side}-${i}`} position={[side*(i?.65:.85),i?-.45:.45,0]} rotation={[0,0,side*(i?.35:-.3)]}><Sphere p={p} color={i?'#b88a63':'#698ea2'} scale={[i?.65:.8,i?.5:.7,.035]}/><Sphere p={p} color="#e3cf9c" scale={[.3,.24,.045]}/></group>))}</Part>
 <Part id="legs" p={p} offset={[-.4,0,.2]}>{[-1,1].flatMap(side=>[0,1,2].map(i=><Tube key={`${side}-${i}`} p={p} radius={.022} color="#c4b391" points={[[side*.1,.5-i*.25,.15],[side*.45,.2-i*.35,.25],[side*.8,-i*.4,.3]]}/>) )}</Part>
 </>;}
function PlantCell({p,volume=1}:{p:StudyProps;volume?:number}){const contents=useRef<Group>(null);useFrame((_,dt)=>{if(contents.current){const size=Math.min(1,.88*Math.cbrt(volume));contents.current.scale.x=MathUtils.damp(contents.current.scale.x,size,6,dt);contents.current.scale.y=MathUtils.damp(contents.current.scale.y,size,6,dt);}});return <>
 <Part id="wall" p={p} offset={[-.5,0,-.3]}><mesh><boxGeometry args={[3.2,2.5,1.2]}/><Material color="#82a47a" p={p} opacity={.17}/></mesh></Part>
 <group ref={contents} scale={[.88,.88,1]}>
 <Part id="membrane" p={p} offset={[.4,0,.25]}><mesh><boxGeometry args={[3,2.3,1.05]}/><Material color="#b6cdaa" p={p} opacity={.16}/></mesh></Part>
 <Part id="vacuole" p={p} offset={[0,.5,.4]}><Sphere color="#87b5ba" p={p} scale={[.9,.7,.34]} opacity={.28}/></Part>
 <Part id="nucleus" p={p} position={[-1,.4,.1]} offset={[-.4,.3,.4]}><Sphere color="#b2a1c6" p={p} scale={[.3,.3,.25]}/></Part>
 <Part id="chloroplast" p={p} offset={[.5,-.3,.4]}>{[[-1,-.75,0],[1,.65,0],[1,-.7,0],[-.45,.9,0]].map((position,i)=><group key={i} position={position as [number,number,number]}><Sphere color="#669675" p={p} scale={[.35,.17,.15]}/>{[-1,0,1].map(j=><mesh key={j} position={[j*.12,0,.14]}><cylinderGeometry args={[.07,.07,.08,12]}/><Material color="#b5c09a" p={p}/></mesh>)}</group>)}</Part>
 <Part id="mitochondrion" p={p} position={[.5,-.95,.1]} offset={[.3,-.4,.5]}><Sphere color="#ba9b76" p={p} scale={[.27,.11,.12]}/></Part>
 </group></>;}
function Contents({scene,p,volume,response}:{scene:BiologyScene;p:StudyProps;volume:number;response?:number}){
 const root=useRef<Group>(null);
 useFrame((_,dt)=>{if(p.playing)p.clock.current+=Math.min(dt,.05)*p.speed;if(root.current&&['plant','flower','butterfly','plant-cell'].includes(scene))root.current.rotation.y=Math.sin(p.clock.current*.3)*.12;root.current?.traverse(object=>{if(object instanceof Mesh)for(const material of (Array.isArray(object.material)?object.material:[object.material]) as MeshStandardMaterial[]){if(material.userData.journeyOpacity!==undefined)material.opacity=MathUtils.damp(material.opacity,material.userData.journeyOpacity*(p.transparent?.25:1),5,dt);}});});
 return <group ref={root}>{scene==='plant'?<Plant p={p}/>:scene==='flower'?<Flower p={p}/>:scene==='butterfly'?<Butterfly p={p}/>:scene==='plant-cell'?<PlantCell p={p} volume={volume}/>:scene==='animal-cell'?<CellScene p={p}/>:scene==='dna'?<DNAScene p={p}/>:<CellularLabs p={p} level={3} study={scene}/>} {response!==undefined&&<ResponseMarkers p={p} response={response}/>}</group>;
}
function ResponseMarkers({p,response}:{p:StudyProps;response:number}){const dots=useRef<Group>(null);useFrame(()=>{dots.current?.children.forEach((dot,i)=>{dot.visible=i<Math.ceil(response/8);dot.position.set(Math.sin(i*2.3)*1.5,((p.clock.current*.4+i*.23)%4)-2,.5);});});return <group ref={dots}>{Array.from({length:13},(_,i)=><mesh key={i}><sphereGeometry args={[.055,12,8]}/><meshStandardMaterial color="#cce9d7"/></mesh>)}</group>;}
class Boundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(error:Error){console.error('[Biology viewer]',error);}render(){return this.state.failed?<p role="alert">3D viewer unavailable. Use Reset viewer to retry.</p>:this.props.children;}}
export default function BiologyViewer({scene,volume=1,response,animate}:{scene:BiologyScene;volume?:number;response?:number;animate?:boolean}){
 const [selected,setSelected]=useState(Object.keys(sceneParts[scene])[0]),[isolate,setIsolate]=useState(false),[explode,setExplode]=useState(0),[transparent,setTransparent]=useState(false),[playing,setPlaying]=useState(false),[key,setKey]=useState(0),[lost,setLost]=useState(false);const clock=useRef(0);
 useEffect(()=>{setSelected(Object.keys(sceneParts[scene])[0]);setIsolate(false);setExplode(0);clock.current=0;},[scene]);
 const p:StudyProps={selected,onSelect:setSelected,isolated:isolate?selected:undefined,explode,transparent,section:false,labels:false,playing:animate??playing,speed:1,clock};
 return <section className="bio-explorer" aria-label="Biology 3D explorer"><div className="bio-canvas"><span className="bio-scene-caption">INTERACTIVE 3D · {scene.replaceAll('-',' ').toUpperCase()}</span><Boundary key={key}><Canvas dpr={[1,1.5]} camera={{position:[0,0,7.5],fov:42}} gl={{antialias:true}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',()=>setLost(true),{once:true});}} aria-label={`Interactive ${scene.replaceAll('-',' ')} teaching model`}><ambientLight intensity={1.1}/><directionalLight position={[3,4,5]} intensity={2.4}/><directionalLight position={[-3,-1,2]} intensity={.8}/><Contents scene={scene} p={p} volume={volume} response={response}/><OrbitControls makeDefault minDistance={3} maxDistance={15}/></Canvas></Boundary>{lost&&<p role="alert" className="bio-scene-caption">Graphics context lost. Reset viewer to retry.</p>}<small>Drag to rotate · scroll to zoom · click a structure</small></div>
 <div className="bio-view-tools"><button aria-pressed={playing} onClick={()=>setPlaying(value=>!value)} disabled={animate!==undefined}>{animate!==undefined?(animate?'Experiment running':'Experiment paused'):(playing?'Pause animation':'Play animation')}</button><button aria-pressed={isolate} onClick={()=>setIsolate(value=>!value)}>Isolate</button><button aria-pressed={transparent} onClick={()=>setTransparent(value=>!value)}>Transparent</button><button onClick={()=>setExplode(value=>value?0:1)}>{explode?'Assemble':'Explode'}</button><button onClick={()=>{setKey(value=>value+1);setLost(false);setIsolate(false);setExplode(0);setTransparent(false);setPlaying(false);clock.current=0;}}>Reset viewer</button></div>
 <div className="bio-part-list" aria-label="Biology structures">{Object.keys(sceneParts[scene]).map(id=><button key={id} aria-pressed={selected===id} onClick={()=>setSelected(id)}>{id.replaceAll('-',' ')}</button>)}</div><p className="bio-selected-description" role="status">{sceneParts[scene][selected]??'Select a structure to learn more.'}</p><small className="bio-model-scope">Schematic educational geometry. Shapes and animation illustrate organization; they are not scans or species-specific reconstructions.</small>
 </section>;
}
