import SchoolControls from '../components/controls/SchoolControls';
import BodyNavigator from '../components/atlas/BodyNavigator';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronRight, Crosshair, Info, Menu, Minus, Plus, X, Box, Check, Search, Minimize, PanelLeftClose, PanelRightClose, Sun, Moon, Bug } from 'lucide-react';
import { anatomy, getAncestors, isWithin } from '../data/anatomyTree';
import { anatomyModels, systems } from '../data/modelRegistry';
import type { ViewerMode } from '../data/types';
import { useAtlasStore } from '../store/atlasStore';
import { ZOOM_LEVELS } from '../config/viewer';
import Sidebar from '../components/layout/Sidebar';
import RightPanel from '../components/layout/RightPanel';
import ViewerToolbar from '../components/layout/ViewerToolbar';
import LayerControls from '../components/controls/LayerControls';
import ExplodeControls from '../components/controls/ExplodeControls';
import OrientationCube from '../components/controls/OrientationCube';
import AnatomyViewer from '../components/atlas/AnatomyViewer';
import SearchDialog from '../components/atlas/SearchDialog';
import NotFound from './NotFound';
import { clearModelCache } from '../hooks/useModelAsset';
import { useAtlasTools } from '../hooks/useAtlasTools';

export default function Atlas(){
 const params=useParams(),location=useLocation(),navigate=useNavigate();const system=systems.find(x=>x.id===params.systemId);const model=system?.modelId??params.modelId??'body';const config=anatomyModels[model]??anatomyModels.body;const s=useAtlasStore();
 const [left,setLeft]=useState(false),[right,setRight]=useState(false),[layers,setLayers]=useState(false),[full,setFull]=useState(false),[section,setSection]=useState(0),[toast,setToast]=useState(''),[search,setSearch]=useState(false);
 const [collapseLeft,setCollapseLeft]=useState(false),[collapseRight,setCollapseRight]=useState(false);const main=useRef<HTMLElement>(null);const initialized=useRef('');
 const valid=!!anatomyModels[model]&&(!params.systemId||!!system)&&(!params.structure||!!anatomy[params.structure]&&isWithin(params.structure,config.root));
 // Route changes are inputs; local selections update the current deep link without remounting Canvas.
 useEffect(()=>{
  if(!valid)return;const route=`${model}|${params.systemId??''}`;const state=useAtlasStore.getState();
  if(initialized.current!==route){state.enter(model,params.structure,params.systemId);initialized.current=route;}
  else {const id=params.structure??system?.treeRoot??config.root;if(id!==state.selectedId)state.select(id);}
  if(new URLSearchParams(location.search).get('learn')==='1')state.set('learn',true);if(new URLSearchParams(location.search).get('presentation')==='1'){state.set('presentation',true);setCollapseLeft(true);setCollapseRight(true);}
 },[model,params.systemId,params.structure,valid,location.key]);
 useEffect(()=>{
  if(useAtlasStore.getState().selectedId!==s.selectedId)return;
  if(!valid||initialized.current!==`${model}|${params.systemId??''}`||s.activeModel!==model)return;
  const base=params.systemId?`/systems/${params.systemId}`:`/atlas/${model}`;const desired=`${base}${s.selectedId===(system?.treeRoot??config.root)?'':`/${s.selectedId}`}`;
  if(location.pathname!==desired)navigate(`${desired}${s.learn?'?learn=1':''}`,{replace:true});
 },[s.selectedId,s.activeModel,model,params.systemId,valid]);
 useEffect(()=>{
  const handler=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('input,select,textarea,dialog')||e.ctrlKey||e.metaKey||e.altKey)return;const a=useAtlasStore.getState();if(e.key.toLowerCase()==='r')a.reset();if(e.key.toLowerCase()==='f')a.command('focus',a.selectedId);if(e.key.toLowerCase()==='e')a.setExplosion(a.explosion?0:.65);if(e.key.toLowerCase()==='l'){a.set('labels',!a.labels);a.set('labelMode',a.labels?'off':'smart');}if(e.key==='Escape'){setLayers(false);setLeft(false);setRight(false);if(!document.fullscreenElement)a.setMode('normal');}};
  const onFullscreen=()=>{const active=document.fullscreenElement===main.current||document.fullscreenElement===document.documentElement;setFull(active);document.body.classList.toggle('atlas-fullscreen-active',active);};
  const notice=(e:Event)=>setToast((e as CustomEvent<string>).detail);
  window.addEventListener('keydown',handler);window.addEventListener('atlas-notice',notice);document.addEventListener('fullscreenchange',onFullscreen);onFullscreen();
  return()=>{window.removeEventListener('keydown',handler);window.removeEventListener('atlas-notice',notice);document.removeEventListener('fullscreenchange',onFullscreen);document.body.classList.remove('atlas-fullscreen-active');};
 },[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(timer);},[toast]);
 useAtlasTools();
 async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await main.current?.requestFullscreen();}catch(error){console.warn('[Human Atlas] Fullscreen request rejected',error);setToast('Fullscreen is unavailable in this browser. Open the site in a regular browser.');}}
 if(!valid)return <NotFound/>;
 const selected=anatomy[s.selectedId]??anatomy[config.root];const breadcrumbs=getAncestors(selected.id);const missing=s.modelStatus==='missing';
 return <main id="main" ref={main} className={`atlas-app ${full?'fullscreen-atlas':''} ${s.presentation?'presentation-mode':''} ${collapseLeft?'left-collapsed':''} ${collapseRight?'right-collapsed':''}`}>
  {full&&<div className="fullscreen-header"><button className="icon-btn" aria-label="Toggle anatomy sidebar" onClick={()=>{if(window.innerWidth<=1023){setLeft(!left);setRight(false);}else setCollapseLeft(!collapseLeft);}}><Menu size={19}/></button><strong>Human Atlas</strong><button className="fullscreen-search" onClick={()=>setSearch(true)}><Search size={16}/> Search anatomy <kbd>Ctrl K</kbd></button><button className="icon-btn" aria-label="Toggle information sidebar" onClick={()=>{if(window.innerWidth<=700){setRight(!right);setLeft(false);}else setCollapseRight(!collapseRight);}}><Info size={19}/></button><button className="exit-fullscreen" onClick={fullscreen}><Minimize size={16}/> Exit Fullscreen</button></div>}
  <Sidebar open={left} onClose={()=>setLeft(false)}/>
  <section className="atlas-workspace" aria-label="Anatomy explorer">
   {!full&&<div className="workspace-header"><div><button className="icon-btn desktop-panel-toggle" aria-label="Toggle anatomy sidebar" onClick={()=>{if(window.innerWidth<=1023){setLeft(!left);setRight(false);}else setCollapseLeft(!collapseLeft);}}><PanelLeftClose size={17}/></button><h1>{system?.id==='muscular'?'Muscular Body':system?.name??config.name}</h1></div><div className="workspace-actions"><button className={`learn-toggle ${s.learn?'active':''}`} aria-pressed={s.learn} onClick={()=>s.set('learn',!s.learn)}><BookOpen size={16}/><span>Learn Mode</span><i/></button><button className="icon-btn desktop-panel-toggle" aria-label="Toggle information sidebar" onClick={()=>{if(window.innerWidth<=700){setRight(!right);setLeft(false);}else setCollapseRight(!collapseRight);}}><PanelRightClose size={17}/></button></div></div>}
   <SchoolControls onPresentation={()=>{const next=!s.presentation;s.set('presentation',next);setCollapseLeft(next);setCollapseRight(next);if(next){s.reset();if(!full)void fullscreen();}else if(full)void fullscreen();}}/><div className="breadcrumb-row"><button className="icon-btn mobile-panel-toggle" aria-label="Open anatomy navigation" onClick={()=>{setLeft(!left);setRight(false);}}><Menu size={17}/></button><nav aria-label="Anatomy breadcrumb">{breadcrumbs.map((n,i)=><span key={n.id}>{i>0&&<ChevronRight size={12}/>}<button aria-current={n.id===selected.id?'page':undefined} onClick={()=>{if(isWithin(n.id,config.root))s.select(n.id);else navigate(`/atlas/body/${n.id}`);}}>{n.name}</button></span>)}</nav><button className="icon-btn mobile-panel-toggle" aria-label="Open structure information" onClick={()=>{setRight(!right);setLeft(false);}}><Info size={17}/></button></div>
   <div className={`viewer-stage background-${s.viewerBackground}`}>
    <div className="viewer-topline"><div className="mode-switch"><label className="sr-only" htmlFor="viewer-mode">Viewing mode</label><select id="viewer-mode" value={s.mode} onChange={e=>s.setMode(e.target.value as ViewerMode)}><option value="normal">Normal view</option><option value="transparent">Transparent</option><option value="xray">X-Ray</option><option value="isolate">Isolate selection</option><option value="exploded">Exploded anatomy</option><option value="section">Cross section</option></select></div><div className="viewer-quality"><span className="model-status">{s.modelStatus==='ready'?<><Check size={12}/> Anatomy model loaded</>:s.developerFallback?<><Bug size={12}/> Development Anatomy Model</>:<><Box size={12}/> Anatomy asset slot</>}</span><button className="icon-btn" aria-label={`Use ${s.viewerBackground==='clinical'?'Medical Dark':'Clinical Light'} background`} onClick={()=>s.set('viewerBackground',s.viewerBackground==='clinical'?'medical':'clinical')}>{s.viewerBackground==='clinical'?<Moon size={15}/>:<Sun size={15}/>}</button></div></div>
    <AnatomyViewer model={model} section={section}/>
    <div className="view-presets"><OrientationCube/><BodyNavigator/><div className="zoom-buttons"><button aria-label="Zoom in" onClick={()=>s.command('zoom',.8)}><Plus size={18}/></button><button aria-label="Fit selection" title="Fit selection (F)" onClick={()=>s.command('focus',selected.id)}><Crosshair size={18}/></button><button aria-label="Zoom out" onClick={()=>s.command('zoom',1.25)}><Minus size={18}/></button></div></div>
    <div className="zoom-depth"><span>EXPLORATION DEPTH</span><div>{ZOOM_LEVELS.map((z,i)=><button key={z.id} className={s.zoomLevel===z.id?'active':''} title={z.name} aria-label={`Explore ${z.name.toLowerCase()}`} onClick={()=>s.command('depth',[1,.65,.33,.12][i])}>{i+1}</button>)}</div><strong>{ZOOM_LEVELS.find(z=>z.id===s.zoomLevel)?.name}</strong></div>
    {s.isolation&&<button className="isolation-badge" onClick={()=>s.setMode('normal')}><X size={13}/> Exit isolation</button>}
    {s.hiddenIds.length>0&&<button className="hidden-badge" onClick={s.undoPeel}>Undo peel · {s.hiddenIds.length} hidden</button>}
    {s.mode==='section'&&<div className="section-slider"><label htmlFor="section-position">Section depth</label><select aria-label="Section plane" value={s.sectionAxis} onChange={e=>s.set('sectionAxis',e.target.value as typeof s.sectionAxis)}><option value="coronal">Coronal</option><option value="sagittal">Sagittal</option><option value="transverse">Transverse</option></select><input id="section-position" type="range" min="-3" max="3" step=".01" value={section} onChange={e=>setSection(+e.target.value)}/></div>}
    <AnimatePresence>{layers&&<motion.div className="layers-float" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><LayerControls onClose={()=>setLayers(false)}/></motion.div>}</AnimatePresence>
    {s.explosion>0&&<ExplodeControls/>}
    {s.modelStatus==='loading'&&<div className="model-loading"><img src="/favicon.svg" alt=""/><h3>Human Atlas</h3><p>Loading {system?.name??config.name}…</p><div className="progress-track"><span style={{width:`${s.loadingProgress||5}%`}}/></div><strong>{s.loadingProgress?s.loadingProgress+'%':s.loadingStage}</strong><small>{s.loadingStage}</small></div>}
    {s.modelStatus==='error'&&<div className="model-error"><strong>3D anatomy model unavailable</strong><span>{s.developerFallback?'Showing developer geometry.':'Check the asset and texture files.'}</span><button onClick={()=>{clearModelCache(model);s.set('retry',s.retry+1);}}>Retry model</button></div>}
    <div className="viewer-hint">Left-drag to rotate <span>·</span> Wheel to zoom <span>·</span> Right-drag to pan</div>
   </div>
   <ViewerToolbar layersOpen={layers} onLayers={()=>setLayers(!layers)} fullscreen={full} onFullscreen={fullscreen} onCapture={()=>window.dispatchEvent(new Event('atlas-screenshot'))}/>
   <div className="viewer-statusbar"><span><i/> {missing?'Awaiting anatomy asset':s.developerFallback&&s.modelStatus!=='ready'?'Schematic developer geometry':system?.name??'Interactive anatomy workspace'}</span>{<button aria-pressed={s.developerFallback} onClick={()=>{s.set('developerFallback',!s.developerFallback);if(s.developerFallback&&s.modelStatus==='procedural')s.set('modelStatus','missing');}}>Developer fallback {s.developerFallback?'on':'off'}</button>}</div>
  </section>
  <RightPanel open={right} onClose={()=>setRight(false)}/>
  {(left||right)&&<button className="panel-scrim" aria-label="Close anatomy panel" onClick={()=>{setLeft(false);setRight(false);}}/>}
  {full&&<SearchDialog open={search} onClose={()=>setSearch(false)} onOpen={()=>setSearch(true)}/>}
  <AnimatePresence>{toast&&<motion.div role="status" className="toast" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}><Check size={16}/>{toast}</motion.div>}</AnimatePresence>
 </main>;
}

