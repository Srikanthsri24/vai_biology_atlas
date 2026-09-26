import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { useSceneRegistry } from './SceneRegistry';
import { useAtlasStore } from '../../store/atlasStore';
const route=['right-atrium','right-ventricle','pulmonary-artery','left-lung','pulmonary-veins','left-atrium','left-ventricle','aorta'];
function FlowDot({index}:{index:number}){const mesh=useRef<Mesh>(null),registry=useSceneRegistry(),time=useRef(index*.55);useFrame((_,dt)=>{const s=useAtlasStore.getState();if(!mesh.current)return;mesh.current.visible=s.flowEnabled;if(!s.flowEnabled)return;if(s.motionPlaying)time.current+=dt*s.motionSpeed*.6;const segment=Math.floor(time.current)%route.length,t=time.current%1;(mesh.current.material as MeshBasicMaterial).color.set(segment<3?'#638aa5':'#b26367');mesh.current.scale.setScalar(s.modelScale);const from=registry.bounds(route[segment]),to=registry.bounds(route[(segment+1)%route.length]);if(from.isEmpty()||to.isEmpty()){mesh.current.visible=false;return;}mesh.current.position.lerpVectors(from.getCenter(new Vector3()),to.getCenter(new Vector3()),t);});return <mesh ref={mesh}><sphereGeometry args={[.023,10,8]}/><meshBasicMaterial color={index<4?'#638aa5':'#b26367'} depthTest={false}/></mesh>;}
export default function EducationalFlow(){const active=useAtlasStore(s=>s.flowEnabled);return active?<group>{Array.from({length:8},(_,i)=><FlowDot key={i} index={i}/>)}</group>:null;}
