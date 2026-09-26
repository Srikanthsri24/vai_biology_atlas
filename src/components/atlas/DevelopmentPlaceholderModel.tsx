import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Html } from '@react-three/drei';
import GLTFAnatomy from './GLTFAnatomy';
/** An explicit boundary between test geometry and authored production anatomy. */
export default function DevelopmentPlaceholderModel({asset,model,preview=false,section=0}:{asset:GLTF;model:string;preview?:boolean;section?:number}){
 return <><GLTFAnatomy asset={asset} model={model} preview={preview} section={section}/>{preview&&<Html position={[0,-1.4,0]} center style={{pointerEvents:'none'}}><span className="preview-development-badge">Development model</span></Html>}</>;
}
