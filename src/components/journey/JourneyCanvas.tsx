import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, Plane, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useModelAsset } from '../../hooks/useModelAsset';
import { journeyStages, travelPosition, type JourneyPath } from '../../data/journey';
import { TissueScene, CellScene, DNAScene, MoleculeScene } from './MicroScenes';
import { Part, type StudyProps } from './JourneyPrimitives';

type Label={id:string;name:string;x:number;y:number};
type Loading={model:string;status:string;progress:number;stage:string};
type Props=StudyProps&{depth:number;path:JourneyPath;travel:boolean;travelProgress:number;command:{serial:number;view:'front'|'side'|'fit'};onError:()=>void};
function Asset({model,onError,onLoading,active}:{model:string;onError:()=>void;onLoading:(status:Loading)=>void;active:boolean}){
 const {asset,status,progress,stage}=useModelAsset(model,true);
 useEffect(()=>{if(active&&(status==='error'||status==='missing'))onError();},[status,onError,active]);
 useEffect(()=>{onLoading({model,status,progress,stage});},[model,status,progress,stage,onLoading]);
 const built=useMemo(()=>{
  if(!asset)return null;const scene=clone(asset.scene);const materials:MeshStandardMaterial[]=[];
  scene.traverse(o=>{if(o instanceof Mesh){const m=(Array.isArray(o.material)?o.material:[o.material]).map(v=>{const c=v.clone() as MeshStandardMaterial;c.userData.journeyOpacity=c.opacity;materials.push(c);return c;});o.material=Array.isArray(o.material)?m:m[0];}});
  const box=new Box3().setFromObject(scene),scale=(model==='body'||model==='skeletal-body'?6:3)/Math.max(...box.getSize(new Vector3()).toArray());
  return {scene,scale,center:box.getCenter(new Vector3()).multiplyScalar(-scale),materials};
 },[asset,model]);
 useEffect(()=>()=>built?.materials.forEach(m=>m.dispose()),[built]);
 return built?<group scale={built.scale} position={built.center}><primitive object={built.scene}/></group>:null;
}
function Stage({index,depth,p,children,focusHeight=0}:{index:number;depth:{current:number};p:StudyProps;children:ReactNode;focusHeight?:number}){
 const group=useRef<Group>(null),plane=useMemo(()=>new Plane(new Vector3(0,0,-1),0),[]);
 useFrame(()=>{
  if(!group.current)return;const weight=Math.max(0,1-Math.abs(depth.current-index));group.current.visible=weight>.015;
  const delta=depth.current-index,scale=delta>0?1+Math.min(1,delta)*.6:.65+weight*.35;
  group.current.scale.setScalar(scale);group.current.position.y=-focusHeight*Math.max(0,Math.min(1,delta))*scale;
  if(weight>.015)group.current.traverse(o=>{if(o instanceof Mesh)for(const m of (Array.isArray(o.material)?o.material:[o.material]) as MeshStandardMaterial[]){
   const initial=m.userData.journeyOpacity??(m.userData.journeyOpacity=m.opacity);
   m.opacity=initial*weight*(p.transparent?.45:1);const transparent=m.opacity<.995;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.depthWrite=!transparent;m.clippingPlanes=p.section?[plane]:[];
  }});
 });
 return <group ref={group} userData={{journeyStage:index}}>{children}</group>;
}
function Camera({p,level}:{p:Props;level:number}){
 const {camera,size,scene}=useThree();const controls=useRef<React.ComponentRef<typeof OrbitControls>>(null);const moving=useRef(true);
 const destination=useRef({position:new Vector3(0,0,12),target:new Vector3()});
 useEffect(()=>{
  const box=new Box3();if(p.command.view==='fit'&&p.selected)scene.traverse(o=>{if(o.userData.journeyId===p.selected){let parent=o.parent;while(parent&&parent.userData.journeyStage===undefined)parent=parent.parent;if(parent?.userData.journeyStage===level)box.union(new Box3().setFromObject(o));}});
  const target=box.isEmpty()?new Vector3():box.getCenter(new Vector3());
  const width=box.isEmpty()?(level===0?6:4.8):Math.max(...box.getSize(new Vector3()).toArray());
  const aspect=size.width/Math.max(1,size.height);const distance=Math.max(2,width/(2*Math.tan((camera as PerspectiveCamera).fov*Math.PI/360)*Math.min(1,aspect))*1.3);
  destination.current={position:target.clone().add(p.command.view==='side'?new Vector3(distance,0,.01):new Vector3(0,0,distance)),target};moving.current=true;
 },[level,p.command.serial,p.command.view,p.path,size.width,size.height,scene,camera]);
 useFrame((_,dt)=>{
  const control=controls.current;if(!control)return;
  if(p.travel&&level===2){const position=travelPosition(p.travelProgress,p.path);destination.current.position.set(...position);destination.current.target.set(position[0],position[1],position[2]-3);moving.current=true;}
  if(moving.current){const t=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-Math.min(dt,.05)*5);camera.position.lerp(destination.current.position,t);control.target.lerp(destination.current.target,t);control.update();if(!p.travel&&camera.position.distanceTo(destination.current.position)<.005)moving.current=false;}
 });
 return <OrbitControls ref={controls} makeDefault enabled={!p.travel} enableDamping minDistance={.08} maxDistance={60} onStart={()=>moving.current=false}/>;
}
function Scene(p:Props&{onLabels:(labels:Label[])=>void;onLoading:(status:Loading)=>void}){
 const {scene,camera,size}=useThree();
 const depth=useRef(p.depth),[near,setNear]=useState(Math.round(p.depth)),publish=useRef(0);
 useFrame((_,dt)=>{
  depth.current=MathUtils.damp(depth.current,p.depth,3,Math.min(dt,.05));publish.current+=dt;
  if(publish.current>.1){publish.current=0;setNear(Math.round(depth.current));const labels:Label[]=[];
   scene.traverse(o=>{if(!o.userData.journeyLabel||p.hidden?.includes(o.userData.journeyId)||(p.isolated&&p.isolated!==o.userData.journeyId))return;let parent=o.parent;while(parent&&parent.userData.journeyStage===undefined)parent=parent.parent;if(parent?.userData.journeyStage!==Math.round(p.depth))return;
    const v=o.getWorldPosition(new Vector3()).add(new Vector3(0,.3,0)).project(camera);if(v.z<-1||v.z>1||Math.abs(v.x)>1||Math.abs(v.y)>1)return;labels.push({id:o.userData.journeyId,name:o.userData.journeyLabel,x:(v.x*.5+.5)*size.width,y:(-.5*v.y+.5)*size.height});
   });p.onLabels(labels);
  }
  if(p.playing&&!document.hidden)p.clock.current+=Math.min(dt,.05)*p.speed;
 });
 const level=Math.round(p.depth);
 return <><ambientLight intensity={.8}/><hemisphereLight args={['#e5eff9','#3d3041',1]}/><directionalLight position={[4,6,8]} intensity={2.4}/><directionalLight position={[-4,1,-4]} intensity={1}/>
 {journeyStages.map((stage,i)=>Math.abs(i-level)<=1||Math.abs(i-near)<=1?<Stage key={stage.id} index={i} depth={depth} p={p} focusHeight={i===0?(p.path==='blood'?.8:2.4):0}>
  {i===0?<Part id="body" p={{...p,labels:false}}><Asset model="body" onError={p.onError} onLoading={p.onLoading} active={level===0}/></Part>:i===1?<Part id="organ" p={{...p,labels:false}}><Asset model={p.path==='blood'?'heart':'brain'} onError={p.onError} onLoading={p.onLoading} active={level===1}/></Part>:i===2?<TissueScene p={{...p,labels:p.labels&&i===level}} path={p.path}/>:i===3?<CellScene p={{...p,labels:p.labels&&i===level}}/>:i===4?<CellScene p={{...p,labels:p.labels&&i===level}} organelle/>:i===5?<DNAScene p={{...p,labels:p.labels&&i===level}}/>:<MoleculeScene p={{...p,labels:p.labels&&i===level}}/>} 
 </Stage>:null)}<Camera p={p} level={level}/></>;
}
class ViewerBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(error:Error){console.error('[Journey] Viewer failed',error);this.props.onError();}render(){return this.state.failed?<div className="journey-error">The 3D viewer could not start. Reload the journey to retry.</div>:this.props.children;}}
export default function JourneyCanvas(p:Props){
 const [labels,setLabels]=useState<Label[]>([]),[loading,setLoading]=useState<Record<string,Loading>>({});
 const onLabels=useCallback((value:Label[])=>setLabels(old=>old.length===value.length&&old.every((item,i)=>item.id===value[i].id&&Math.abs(item.x-value[i].x)<.5&&Math.abs(item.y-value[i].y)<.5)?old:value),[]);
 const onLoading=useCallback((value:Loading)=>setLoading(old=>({...old,[value.model]:value})),[]);
 const wrapper=useRef<HTMLDivElement>(null);
 useEffect(()=>{const canvas=wrapper.current?.querySelector('canvas');function lost(e:Event){e.preventDefault();p.onError();}canvas?.addEventListener('webglcontextlost',lost);return()=>canvas?.removeEventListener('webglcontextlost',lost);},[p.onError]);
 const level=Math.round(p.depth),status=loading[level===0?'body':p.path==='blood'?'heart':'brain'];
 return <div className="journey-canvas-wrap" ref={wrapper}><ViewerBoundary onError={p.onError}><Canvas dpr={[1,1.5]} camera={{position:[0,0,12],fov:42,near:.015,far:200}} gl={{antialias:true,preserveDrawingBuffer:true,alpha:true}} onCreated={({gl})=>{gl.localClippingEnabled=true;gl.setClearColor('#172631',1);}} aria-label="Interactive journey in 3D. Drag to orbit, scroll to explore scales and click a structure."><Suspense fallback={null}><Scene {...p} onLabels={onLabels} onLoading={onLoading}/></Suspense></Canvas>
 <div className="journey-labels">{p.labels&&labels.map((label,i)=><button key={`${label.id}-${i}`} className={`journey-label ${p.selected===label.id?'selected':''}`} style={{left:label.x,top:label.y}} onClick={()=>p.onSelect(label.id)}>{label.name}</button>)}</div>
 {level<2&&(!status||status.status==='loading'||status.status==='error'||status.status==='missing')&&<div className="journey-asset-status"><div className="journey-loading" role="status">{status?.status==='error'||status?.status==='missing'?'Anatomy model unavailable. Retry or continue to the microscopic scales.':<><strong>Preparing your anatomy</strong><progress max={100} value={status?.progress??0}/><small>{status?.progress??0}% · {status?.stage??'Locating anatomy asset'}</small></>}</div></div>}
 </ViewerBoundary></div>;
}
