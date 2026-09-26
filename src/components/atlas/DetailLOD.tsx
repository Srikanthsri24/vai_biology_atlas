import { useEffect, useMemo, useState } from 'react';
import { Box3, Vector3 } from 'three';
import { useSceneRegistry } from './SceneRegistry';
import { useAtlasStore } from '../../store/atlasStore';
import { anatomyModels } from '../../data/modelRegistry';
import { isWithin } from '../../data/anatomyTree';
import { useModelAsset } from '../../hooks/useModelAsset';
import GLTFAnatomy from './GLTFAnatomy';

function LoadedDetail({model,anchor,visible}:{model:string;anchor:Box3;visible:boolean}){
 const {asset,status}=useModelAsset(model,true,false),config=anatomyModels[model];
 const transform=useMemo(()=>({center:anchor.getCenter(new Vector3()),scale:Math.max(...anchor.getSize(new Vector3()).toArray())/(config.targetHeight??3)}),[anchor,config]);
 useEffect(()=>{if(!asset||status!=='ready'||!visible)return;useAtlasStore.setState({detailRoot:config.root});return()=>useAtlasStore.setState({detailRoot:null});},[asset,status,config,visible]);
 if(!asset||status!=='ready')return null;
 const authored=config.parentAnchor!;
 return <group position={transform.center} scale={transform.scale}><group position={authored.position} rotation={authored.rotation} scale={authored.scale}><GLTFAnatomy asset={asset} model={model} detail detailVisible={visible}/></group></group>;
}
/** Keep the outgoing registered detail alive while the parent fades back in. */
export default function DetailLOD(){
 const activeModel=useAtlasStore(s=>s.activeModel),selected=useAtlasStore(s=>s.selectedId),depth=useAtlasStore(s=>s.semanticDepth),registry=useSceneRegistry();
 const candidate=Object.values(anatomyModels).filter(m=>m.id!==activeModel&&m.root!=='body'&&!m.systemId&&m.category!=='Microscopic'&&m.parentAnchor&&isWithin(selected,m.root)).sort((a,b)=>isWithin(a.root,b.root)?-1:1)[0];
 const desired=anatomyModels[activeModel]?.root==='body'&&['SUBSTRUCTURES','MICRO'].includes(depth)?candidate?.id:undefined;
 const [retained,setRetained]=useState<{id:string;anchor:Box3}|null>(null);
 useEffect(()=>{
  if(desired){const anchor=registry.bounds(anatomyModels[desired].parentAnchor!.structureId);if(!anchor.isEmpty())setRetained({id:desired,anchor});return;}
  const timer=setTimeout(()=>setRetained(null),750);return()=>clearTimeout(timer);
 },[desired,activeModel]);
 if(!retained)return null;
 return <LoadedDetail key={retained.id} model={retained.id} anchor={retained.anchor} visible={desired===retained.id}/>;
}
