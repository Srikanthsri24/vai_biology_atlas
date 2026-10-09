import { useState } from 'react';
import { useAtlasStore } from '../../store/atlasStore';
import { layers } from '../../data/modelRegistry';
type Preset='Surface'|'Muscles'|'Organs'|'Skeleton';
export default function DissectionPresets(){
 const [active,setActive]=useState<Preset>('Surface');
 const apply=(preset:Preset)=>{setActive(preset);const s=useAtlasStore.getState();const visible={...s.visibleLayers};const opacity={...s.layerOpacity};
  for(const layer of layers){visible[layer.id]=preset==='Surface'||preset==='Muscles'&&(layer.id.startsWith('muscles')||['skeleton','tendons','ligaments'].includes(layer.id))||preset==='Organs'&&!layer.id.startsWith('muscles')&&!['skin','tendons','ligaments'].includes(layer.id)||preset==='Skeleton'&&layer.id==='skeleton';opacity[layer.id]=preset==='Organs'&&layer.id==='skeleton'?.16:1;}
  useAtlasStore.setState({visibleLayers:visible,layerOpacity:opacity,hiddenIds:[],transparentIds:[],isolation:null,layerIsolation:null,mode:'normal',explosion:0,autoSeparation:0,selectedId:'body'});
 };
 return <div className="dissection-presets" role="group" aria-label="Anatomy dissection presets">{(['Surface','Muscles','Organs','Skeleton'] as Preset[]).map(p=><button key={p} aria-pressed={active===p} onClick={()=>apply(p)}>{p}</button>)}</div>;
}
