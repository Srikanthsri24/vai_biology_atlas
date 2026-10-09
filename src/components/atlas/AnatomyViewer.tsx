import SimulationScene from './SimulationScene';
import DetailLOD from './DetailLOD';
import EducationalFlow from './EducationalFlow';
import AttachmentMarkers from './AttachmentMarkers';
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { Box, RotateCcw } from 'lucide-react';
import { useAtlasStore } from '../../store/atlasStore';
import { anatomy } from '../../data/anatomyTree';
import { anatomyModels } from '../../data/modelRegistry';
import AnatomyModel from './AnatomyModel';
import AnatomyLabels from './AnatomyLabels';
import CameraRig from '../../hooks/useCameraFocus';
import { SceneRegistryProvider } from './SceneRegistry';
function ContextMonitor({onLost}:{onLost:()=>void}){const {gl}=useThree();useEffect(()=>{const handler=(e:Event)=>{e.preventDefault();onLost();};gl.domElement.addEventListener('webglcontextlost',handler);return()=>gl.domElement.removeEventListener('webglcontextlost',handler);},[gl,onLost]);return null;}
class CanvasBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}componentDidCatch(e:Error){console.error('[Human Atlas] 3D rendering error',e);}render(){return this.state.failed?<div className="canvas-error"><Box size={34}/><h3>3D anatomy model unavailable</h3><p>Check WebGL support and try again.</p><button className="primary-btn" onClick={()=>this.setState({failed:false})}><RotateCcw size={16}/> Retry viewer</button></div>:this.props.children;}}
export default function AnatomyViewer({model,preview=false,animated=false,section=0}:{model:string;preview?:boolean;animated?:boolean;section?:number}){
 const [dpr,setDpr]=useState(Math.min(window.devicePixelRatio,2));const config=anatomyModels[model];const hover=useAtlasStore(s=>s.hoveredId);const dragging=useAtlasStore(s=>s.dragging);const mode=useAtlasStore(s=>s.mode);const ref=useRef<HTMLDivElement>(null);const [contextLost,setContextLost]=useState(false);
 const onContextLost=useCallback(()=>{setContextLost(true);if(!preview)useAtlasStore.setState({modelStatus:'error'});},[preview]);
 useEffect(()=>{if(preview)return;const capture=async()=>{
  const canvas=ref.current?.querySelector('canvas');if(!canvas)return;
  try{await document.fonts.ready;const output=document.createElement('canvas');output.width=canvas.width;output.height=canvas.height;const ctx=output.getContext('2d');if(!ctx)return;const canvasRect=canvas.getBoundingClientRect();const ratio=canvas.width/canvasRect.width;ctx.fillStyle=useAtlasStore.getState().viewerBackground==='medical'?'#182b37':'#eff3f5';ctx.fillRect(0,0,output.width,output.height);ctx.drawImage(canvas,0,0);ctx.scale(ratio,ratio);ctx.font='12px sans-serif';ctx.fillStyle=useAtlasStore.getState().viewerBackground==='medical'?'#d7e5eb':'#37515d';ctx.strokeStyle='#79969c';
   ref.current?.querySelectorAll<HTMLElement>('[data-anatomy-label]').forEach(label=>{const r=label.getBoundingClientRect();const x=r.left-canvasRect.left,y=r.top-canvasRect.top;const ax=Number(label.dataset.anchorX),ay=Number(label.dataset.anchorY);ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(x+70,y+12);ctx.stroke();ctx.fillText(label.dataset.anatomyLabel??'',x+5,y+15);});
   output.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`human-atlas-${model}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);window.dispatchEvent(new CustomEvent('atlas-notice',{detail:'Screenshot saved with visible labels'}));},'image/png');
  }catch(error){console.error('[Human Atlas] Screenshot failed',error);window.dispatchEvent(new CustomEvent('atlas-notice',{detail:'Screenshot unavailable. Check cross-origin texture access.'}));}
 };window.addEventListener('atlas-screenshot',capture);return()=>window.removeEventListener('atlas-screenshot',capture);},[preview,model]);
 return <div ref={ref} className={`canvas-wrap ${!preview&&dragging?'is-dragging':!preview&&hover?'mesh-hover':''}`} aria-label={`Interactive 3D ${config.name}. Drag to rotate. Scroll to zoom.`}>
  {!contextLost&&<CanvasBoundary><Canvas dpr={dpr} camera={{position:[0,0,10],fov:38,near:.01,far:1000}} gl={{antialias:true,alpha:true,preserveDrawingBuffer:!preview,powerPreference:'high-performance',toneMapping:ACESFilmicToneMapping,outputColorSpace:SRGBColorSpace}} onCreated={({gl})=>{gl.localClippingEnabled=true;gl.toneMappingExposure=1;}}>
   <ContextMonitor onLost={onContextLost}/>
   <ambientLight intensity={.28}/><hemisphereLight args={['#e5edf3','#77706a',.65]}/><directionalLight position={[3,5,6]} intensity={2.2}/><directionalLight position={[-4,1,4]} intensity={.75}/><directionalLight position={[2,3,-5]} intensity={1.5} color="#ddeaf6"/>
   <Environment resolution={128} frames={1}><Lightformer form="rect" intensity={1.2} position={[4,3,4]} scale={[4,6,1]} target={[0,0,0]}/><Lightformer form="rect" intensity={.55} position={[-4,1,-3]} scale={[3,4,1]} target={[0,0,0]}/></Environment>
   <PerformanceMonitor onDecline={()=>setDpr(1.25)} onIncline={()=>setDpr(Math.min(window.devicePixelRatio,2))}/>
   <SceneRegistryProvider><Suspense fallback={null}><AnatomyModel model={model} preview={preview} section={section}/><ContactShadows position={[0,config.root==='body'?-3.05:-1.6,0]} opacity={.22} scale={12} blur={2.5} far={6} resolution={512} frames={1}/></Suspense><CameraRig preview={preview} animated={animated}/>{!preview&&<><SimulationScene/><DetailLOD/><AnatomyLabels/><AttachmentMarkers/><EducationalFlow/></>}</SceneRegistryProvider>
  </Canvas></CanvasBoundary>}
  {contextLost&&<div className="canvas-error"><p>The graphics context was interrupted.</p><button className="primary-btn" onClick={()=>setContextLost(false)}>Restore 3D viewer</button></div>}
  {!preview&&hover&&!dragging&&anatomy[hover]&&<div className="anatomy-tooltip"><strong>{anatomy[hover].name}</strong><span>{anatomy[hover].system}</span><small>Click to select · Double-click to focus</small></div>}
  {!preview&&mode==='section'&&<div className="section-note">Cross section · open surfaces are not capped</div>}
 </div>;
}


