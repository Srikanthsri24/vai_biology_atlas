import { publicUrl } from '../utils/basePath';
import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { anatomyModels } from '../data/modelRegistry';
import { useAtlasStore } from '../store/atlasStore';
type Status='loading'|'missing'|'ready'|'procedural'|'error';
type AssetState={model:string;asset:GLTF|null;status:Status;progress:number;stage:string};
const cache=new Map<string,Promise<GLTF>>();
const probes=new Map<string,Promise<string|undefined>>();
export function clearModelCache(model:string){for(const url of [...anatomyModels[model].urls,(anatomyModels[model].developmentUrl??`/models/placeholders/${model}.glb`)])cache.delete(publicUrl(url));probes.delete(model);}
async function discover(model:string){if(!probes.has(model))probes.set(model,(async()=>{for(const url of anatomyModels[model].urls){const response=await fetch(publicUrl(url),{method:'HEAD'});if(response.ok&&!response.headers.get('content-type')?.includes('text/html'))return url;}return undefined;})());return probes.get(model)!;}
export function useModelAsset(model:string,preview=false,allowDevelopment=true){
 const {gl}=useThree();const retry=useAtlasStore(s=>s.retry);const development=useAtlasStore(s=>s.developerFallback);const [result,setResult]=useState<AssetState>({model,asset:null,status:'loading',progress:0,stage:'Locating anatomy asset'});
 useEffect(()=>{let alive=true;const draco=new DRACOLoader().setDecoderPath(publicUrl('/draco/'));const ktx=new KTX2Loader().setTranscoderPath(publicUrl('/basis/')).detectSupport(gl);const loader=new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx).setMeshoptDecoder(MeshoptDecoder);
  const report=(next:Partial<AssetState>)=>{if(!alive)return;setResult(old=>({...old,...next}));if(!preview)useAtlasStore.setState({...next.status?{modelStatus:next.status}:{},...next.progress!==undefined?{loadingProgress:next.progress}:{},...next.stage?{loadingStage:next.stage}:{}});};
  report({model,asset:null,status:'loading',progress:0,stage:'Locating anatomy asset'});
  const load=(path:string)=>{const url=publicUrl(path);if(!cache.has(url)){const promise=loader.loadAsync(url,event=>report({progress:event.total?Math.round(event.loaded/event.total*85):0,stage:'Loading geometry and materials'}));cache.set(url,promise);promise.catch(()=>cache.delete(url));}return cache.get(url)!;};
  void (async()=>{try{const installed=await discover(model);const url=installed??(development&&allowDevelopment?(anatomyModels[model].developmentUrl??`/models/placeholders/${model}.glb`):undefined);if(!url){report({status:'missing',stage:'Anatomy asset not installed'});return;}
   const coarse=!preview&&installed&&anatomyModels[model].progressiveUrl;if(coarse){try{const previewAsset=await load(coarse);report({asset:previewAsset,stage:'Refining anatomy geometry'});}catch(e){console.warn('[Human Atlas] Optional progressive model unavailable',e);}}
   const asset=await load(preview&&installed&&anatomyModels[model].previewUrl?anatomyModels[model].previewUrl!:url);report({asset,progress:95,stage:'Preparing labels and interaction'});requestAnimationFrame(()=>report({status:installed?'ready':'procedural',progress:100,stage:installed?'Ready':'Development Anatomy Model'}));
  }catch(error){probes.delete(model);console.error(`[Human Atlas] Model failed: ${model}`,error);report({status:'error',stage:'3D anatomy model unavailable'});}})();
  return()=>{alive=false;/* In-flight cached loads own the decoder workers until completion. */Promise.allSettled([...cache.values()]).finally(()=>{draco.dispose();ktx.dispose();});};
 },[model,retry,preview,gl,development,allowDevelopment]);return result.model===model?result:{model,asset:null,status:'loading' as const,progress:0,stage:'Locating anatomy asset'};
}

