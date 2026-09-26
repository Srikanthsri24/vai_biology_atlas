import { anatomy, isWithin } from '../data/anatomyTree';
import { anatomyModels, systems } from '../data/modelRegistry';
import { ZOOM_LEVELS } from '../config/viewer';
import type { AtlasState } from '../store/atlasStore';
import type { LayerId } from '../data/types';
export function belongsToSystem(id:string,systemId:string,layer?:LayerId):boolean{
 const n=anatomy[id];if(!n)return false;const system=systems.find(s=>s.id===systemId);if(!system)return true;
 if(n.systems?.includes(systemId))return true;
 if(systemId==='muscular'&&layer?.startsWith('muscles'))return true;
 if(systemId==='skeletal')return layer==='skeleton';
 if(systemId==='integumentary')return layer==='skin';
 if(systemId==='nervous'&&layer==='nervous')return true;
 if(systemId==='cardiovascular'&&['arteries','veins','circulatory'].includes(layer??''))return true;
 return system.structures.some(root=>isWithin(id,root));
}
export function getOpacity(id:string,layer:LayerId,s:AtlasState):number{
 if(!s.visibleLayers[layer]||s.hiddenIds.some(h=>isWithin(id,h)))return 0;
 if(s.layerIsolation&&s.layerIsolation!==layer)return 0;
 if(s.isolation&&!isWithin(id,s.isolation))return 0;
 if(s.systemFilter&&!belongsToSystem(id,s.systemFilter,layer)){
  const attachmentBone=s.showAttachments&&anatomy[s.selectedId]?.attachments?.some(a=>a.boneId===id);
  if(!attachmentBone&&!(s.systemFilter==='muscular'&&layer==='skeleton'&&s.explosion>0))return 0;
 }
 let opacity=s.layerOpacity[layer];
 if(s.systemFilter==='muscular'&&s.explosion===0&&id!==s.selectedId){
  const level=s.semanticDepth;if(layer==='muscles-intermediate')opacity*=level==='BODY'||level==='REGIONS'?0:level==='SYSTEMS'?.35:1;
  if(layer==='muscles-deep')opacity*=level==='BODY'||level==='REGIONS'||level==='SYSTEMS'?0:level==='STRUCTURES'?.4:1;
 }
 if(s.transparentIds.some(h=>isWithin(id,h)))opacity*=.18;
 if(!s.systemFilter&&anatomyModels[s.activeModel]?.root==='body'&&!s.isolation&&s.explosion===0){const level=ZOOM_LEVELS.find(l=>l.id===s.zoomLevel)!;if(layer==='skin')opacity*=level.skinOpacity;if(layer.startsWith('muscles'))opacity*=s.zoomLevel==='BODY'?1:.25;}
 const selected=anatomy[s.selectedId];if(selected&&!['region','system'].includes(selected.type??'')&&!isWithin(id,selected.id)&&!s.isolation&&s.explosion===0){opacity*=layer==='skin'?.1:s.systemFilter==='muscular'?.45:.2;}
 if(s.mode==='transparent')opacity*=layer==='skin'?.15:layer.startsWith('muscles')?.25:1;
 if(s.mode==='xray')opacity*=layer==='skeleton'||layer==='organs'?1:layer==='skin'?.08:.16;
 return opacity;
}
