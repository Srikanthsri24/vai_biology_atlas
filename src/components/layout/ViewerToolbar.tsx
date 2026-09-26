import { Camera, Expand, Hand, Layers3, Maximize, MousePointer2, Move3D, RotateCcw, ScanLine, Tags, ZoomIn, Slice, Focus, Eye, Undo2 } from 'lucide-react';
import { useAtlasStore } from '../../store/atlasStore';
export default function ViewerToolbar({layersOpen,onLayers,onFullscreen,fullscreen,onCapture}:{layersOpen:boolean;onLayers:()=>void;onFullscreen:()=>void;fullscreen:boolean;onCapture:()=>void}){
 const s=useAtlasStore();const buttons=[
 {label:'Rotate',icon:Move3D,active:s.tool==='orbit',action:()=>s.set('tool','orbit'),tip:'Left-drag to rotate'},
 {label:'Pan',icon:Hand,active:s.tool==='pan',action:()=>s.set('tool','pan'),tip:'Pan, or use right-drag'},
 {label:'Zoom',icon:ZoomIn,active:s.tool==='zoom',action:()=>s.set('tool','zoom'),tip:'Zoom, or use the mouse wheel'},
 {label:'Select',icon:MousePointer2,active:s.tool==='select',action:()=>s.set('tool','select'),tip:'Select without moving the camera'},
 {label:'Layers',icon:Layers3,active:layersOpen,action:onLayers,tip:'Layer visibility, opacity, and isolation'},
 {label:'Transparent',icon:ScanLine,active:s.mode==='transparent',action:()=>s.setMode(s.mode==='transparent'?'normal':'transparent'),tip:'Skin 15%, muscle 25%, deeper structures 100%'},
 {label:'X-Ray',icon:Eye,active:s.mode==='xray',action:()=>s.setMode(s.mode==='xray'?'normal':'xray'),tip:'Reveal skeleton and organs'},
 {label:'Peel',icon:Slice,active:s.tool==='peel',action:()=>s.set('tool',s.tool==='peel'?'orbit':'peel'),tip:'Click a structure to remove it'},
 {label:'Isolate',icon:Focus,active:!!s.isolation,action:()=>s.setMode(s.isolation?'normal':'isolate'),tip:'Isolate selected anatomy'},
 {label:'Explode',icon:Expand,active:s.explosion>0,action:()=>s.setExplosion(s.explosion?0:.65),tip:'Explode / assemble (E)'},
 {label:'Section',icon:Slice,active:s.mode==='section',action:()=>s.setMode(s.mode==='section'?'normal':'section'),tip:'Cross section through the model'},
 {label:'Reset',icon:RotateCcw,active:false,action:s.reset,tip:'Reset anatomy (R)'},
 {label:fullscreen?'Exit full':'Fullscreen',icon:Maximize,active:fullscreen,action:onFullscreen,tip:'Browser fullscreen'},
 {label:'Screenshot',icon:Camera,active:false,action:onCapture,tip:'Download model, visible labels, and orientation'}
 ];return <div className="viewer-toolbar" role="toolbar" aria-label="3D viewer controls">{buttons.slice(0,4).map(b=><button key={b.label} aria-pressed={b.active} title={b.tip} onClick={b.action}><b.icon size={18}/><span>{b.label}</span></button>)}<div className="label-mode-control"><Tags size={18}/><select aria-label="Label mode" value={s.labelMode} onChange={e=>{s.set('labelMode',e.target.value as typeof s.labelMode);s.set('labels',e.target.value!=='off');}}><option value="off">Off</option><option value="smart">Smart labels</option><option value="all">All visible</option></select></div>{buttons.slice(4).map(b=><button key={b.label} aria-pressed={b.active} title={b.tip} onClick={b.action}><b.icon size={18}/><span>{b.label}</span></button>)}{s.peelHistory.length>0&&<button onClick={s.undoPeel} title="Undo last peel"><Undo2 size={18}/><span>Undo peel</span></button>}</div>;
}
