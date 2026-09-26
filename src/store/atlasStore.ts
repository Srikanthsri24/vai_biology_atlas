import type { AssetReport } from '../utils/validation';
import type { LearningLevel, AnatomyDepth } from '../config/education';
import { create } from 'zustand';
import { anatomy, getAncestors, isWithin } from '../data/anatomyTree';
import { anatomyModels, layers, systems } from '../data/modelRegistry';
import type { LayerId, ModelId, ViewerMode } from '../data/types';
import type { ZoomLevel } from '../config/viewer';
export type CameraCommand={type:'restore'|'focus'|'reset'|'preset'|'zoom'|'depth';value?:string|number;serial:number};
type ViewSnapshot=Pick<AtlasState,'selectedId'|'visibleLayers'|'layerOpacity'|'hiddenIds'|'transparentIds'|'isolation'|'mode'|'explosion'|'autoSeparate'|'cameraPose'>;
export type AtlasState={
 cameraPose:{position:[number,number,number];target:[number,number,number]}|null;viewHistory:ViewSnapshot[];backView:()=>void;
 detailRoot:string|null;flowEnabled:boolean;assetReport:AssetReport|null;learningLevel:LearningLevel;presentation:boolean;semanticDepth:AnatomyDepth;activeRegion:string|null;autoSeparation:number;autoSeparate:boolean;modelScale:number;showAttachments:boolean;motionPlaying:boolean;motionSpeed:number;sectionAxis:'sagittal'|'coronal'|'transverse';
 activeModel:ModelId;selectedId:string;hoveredId:string|null;zoomLevel:ZoomLevel;
 visibleLayers:Record<LayerId,boolean>;layerOpacity:Record<LayerId,number>;layerIsolation:LayerId|null;
 hiddenIds:string[];transparentIds:string[];peelHistory:string[][];isolation:string|null;systemFilter:string|null;
 explosion:number;mode:ViewerMode;labels:boolean;labelMode:'off'|'smart'|'all';learn:boolean;detailed:boolean;
 tool:'orbit'|'pan'|'zoom'|'select'|'peel';cameraCommand:CameraCommand;dragging:boolean;cameraView:string;
 modelStatus:'loading'|'missing'|'procedural'|'ready'|'error';loadingProgress:number;loadingStage:string;retry:number;
 developerFallback:boolean;viewerBackground:'clinical'|'medical';assetMessage:string;
 set:<K extends keyof AtlasState>(key:K,value:AtlasState[K])=>void;
 enter:(model:ModelId,selection?:string,system?:string)=>void;select:(id:string,focus?:boolean)=>void;
 command:(type:CameraCommand['type'],value?:string|number)=>void;toggleLayer:(id:LayerId)=>void;opacity:(id:LayerId,value:number)=>void;
 setExplosion:(value:number)=>void;setMode:(mode:ViewerMode)=>void;hide:(id:string)=>void;peel:(id:string)=>void;undoPeel:()=>void;transparent:(id:string)=>void;reset:()=>void;
};
const visibility=()=>Object.fromEntries(layers.map(l=>[l.id,true])) as Record<LayerId,boolean>;
const opacities=()=>Object.fromEntries(layers.map(l=>[l.id,1])) as Record<LayerId,number>;
export const useAtlasStore=create<AtlasState>((set,get)=>({
 cameraPose:null,viewHistory:[],backView:()=>{const s=get(),snapshot=s.viewHistory.at(-1);if(snapshot)set({...snapshot,viewHistory:s.viewHistory.slice(0,-1),cameraCommand:{type:snapshot.cameraPose?'restore':'focus',value:snapshot.selectedId,serial:s.cameraCommand.serial+1}});},
 detailRoot:null,flowEnabled:false,assetReport:null,learningLevel:'standard',presentation:false,semanticDepth:'BODY',activeRegion:null,autoSeparation:0,autoSeparate:true,modelScale:1,showAttachments:false,motionPlaying:false,motionSpeed:1,sectionAxis:'coronal',
 activeModel:'body',selectedId:'body',hoveredId:null,zoomLevel:'BODY',visibleLayers:visibility(),layerOpacity:opacities(),layerIsolation:null,
 hiddenIds:[],transparentIds:[],peelHistory:[],isolation:null,systemFilter:null,explosion:0,mode:'normal',labels:true,labelMode:'smart',learn:false,detailed:false,
 tool:'orbit',cameraCommand:{type:'reset',serial:0},dragging:false,cameraView:'front',modelStatus:'loading',loadingProgress:0,loadingStage:'Locating anatomy asset',retry:0,
 developerFallback:import.meta.env?.VITE_DEVELOPMENT_MODE!=='false',viewerBackground:'clinical',assetMessage:'',
 set:(key,value)=>set({[key]:value}),
 enter:(model,selection,system)=>{
  const config=anatomyModels[model];if(!config)return;const root=systems.find(s=>s.id===(system??config.systemId))?.treeRoot??config.root;const selected=selection&&anatomy[selection]&&isWithin(selection,config.root)?selection:root;
  set({viewHistory:[],cameraPose:null,detailRoot:null,flowEnabled:false,assetReport:null,activeRegion:null,autoSeparation:0,autoSeparate:true,showAttachments:false,motionPlaying:false,activeModel:model,selectedId:selected,hoveredId:null,visibleLayers:visibility(),layerOpacity:opacities(),layerIsolation:null,hiddenIds:[],transparentIds:[],peelHistory:[],isolation:null,systemFilter:system??config.systemId??null,explosion:0,mode:'normal',zoomLevel:'BODY',cameraCommand:{type:selected===config.root?'reset':'focus',value:selected,serial:get().cameraCommand.serial+1}});
 },
 select:(id,focus=true)=>{
  const n=anatomy[id];if(!n)return;const ancestors=getAncestors(id).map(a=>a.id);
  const old=get();const snapshot:ViewSnapshot={selectedId:old.selectedId,visibleLayers:old.visibleLayers,layerOpacity:old.layerOpacity,hiddenIds:old.hiddenIds,transparentIds:old.transparentIds,isolation:old.isolation,mode:old.mode,explosion:old.explosion,autoSeparate:old.autoSeparate,cameraPose:old.cameraPose};
  set({viewHistory:id===old.selectedId?old.viewHistory:[...old.viewHistory.slice(-29),snapshot],showAttachments:false,motionPlaying:false,selectedId:id,layerIsolation:get().layerIsolation===n.layer?n.layer:null,hiddenIds:get().hiddenIds.filter(h=>!ancestors.includes(h)),visibleLayers:{...get().visibleLayers,[n.layer]:true},layerOpacity:{...get().layerOpacity,[n.layer]:Math.max(.15,get().layerOpacity[n.layer])},isolation:get().isolation?id:null,...(focus?{cameraCommand:{type:'focus' as const,value:id,serial:get().cameraCommand.serial+1}}:{})});
 },
 command:(type,value)=>set({cameraCommand:{type,value,serial:get().cameraCommand.serial+1},...(type==='preset'?{cameraView:String(value)}:{})}),
 toggleLayer:id=>set({visibleLayers:{...get().visibleLayers,[id]:!get().visibleLayers[id]}}),
 opacity:(id,value)=>set({layerOpacity:{...get().layerOpacity,[id]:Math.max(0,Math.min(1,value))}}),
 setExplosion:value=>{const amount=Math.max(0,Math.min(1,value));set({explosion:amount,mode:amount>0?'exploded':'normal',isolation:null});},
 setMode:mode=>set({mode,isolation:mode==='isolate'?get().selectedId:null,explosion:mode==='exploded'?.65:0}),
 hide:id=>{if(get().hiddenIds.includes(id))set({hiddenIds:get().hiddenIds.filter(h=>h!==id)});else get().peel(id);},
 peel:id=>{if(!anatomy[id]||get().hiddenIds.includes(id))return;set({peelHistory:[...get().peelHistory.slice(-49),get().hiddenIds],hiddenIds:[...get().hiddenIds,id],isolation:null,mode:get().mode==='isolate'?'normal':get().mode});},
 undoPeel:()=>{const history=get().peelHistory;if(history.length)set({hiddenIds:history[history.length-1],peelHistory:history.slice(0,-1)});},
 transparent:id=>set({transparentIds:get().transparentIds.includes(id)?get().transparentIds.filter(h=>h!==id):[...get().transparentIds,id]}),
 reset:()=>get().enter(get().activeModel,undefined,get().systemFilter??undefined)
}));




