import { publicUrl } from '../../utils/basePath';
import { Html } from '@react-three/drei';
import { FileBox } from 'lucide-react';
import { anatomyModels } from '../../data/modelRegistry';
import { useModelAsset, clearModelCache } from '../../hooks/useModelAsset';
import { useAtlasStore } from '../../store/atlasStore';
import GLTFAnatomy from './GLTFAnatomy';
import DevelopmentPlaceholderModel from './DevelopmentPlaceholderModel';
export default function AnatomyModel({model,preview=false,section=0}:{model:string;preview?:boolean;section?:number}){
 const config=anatomyModels[model],{asset,status}=useModelAsset(model,preview);
 if(asset)return status==='procedural'?<DevelopmentPlaceholderModel asset={asset} model={model} preview={preview} section={section}/>:<GLTFAnatomy asset={asset} model={model} preview={preview} section={section}/>;
 if(status==='loading')return preview?<Html center><span className="preview-loading-text" role="status">Loading 3D anatomy…</span></Html>:null;
 return <Html center zIndexRange={[5,0]}><div className={`asset-slot ${preview?'compact':''}`}><FileBox size={preview?27:37}/><strong>{preview?'Anatomy asset slot':status==='error'?`${config.name} model could not be loaded`:'High-resolution anatomy asset not installed'}</strong>{!preview&&<><p>Install an authored anatomy asset or enable the clearly labelled development preview.</p><code>{config.urls[0]}</code><button className="outline-btn" onClick={()=>{clearModelCache(model);useAtlasStore.setState(s=>({retry:s.retry+1}));}}>Retry model</button><button className="developer-link" onClick={()=>useAtlasStore.setState({developerFallback:true})}>Enable development preview</button><a href={publicUrl('/atlas/body')}>Return to Body</a></>}{preview&&<small>{config.name}</small>}</div></Html>;
}
