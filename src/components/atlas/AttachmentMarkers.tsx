import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { useState, useRef } from 'react';
import { Vector3 } from 'three';
import { useSceneRegistry } from './SceneRegistry';
import { useAtlasStore } from '../../store/atlasStore';
import { anatomy } from '../../data/anatomyTree';
export default function AttachmentMarkers(){const registry=useSceneRegistry(),s=useAtlasStore(),last=useRef(0);const [markers,setMarkers]=useState<{id:string;label:string;bone:Vector3;muscle:Vector3}[]>([]);useFrame(({clock})=>{if(clock.elapsedTime-last.current<.2)return;last.current=clock.elapsedTime;if(!s.showAttachments){if(markers.length)setMarkers([]);return;}const muscle=registry.bounds(s.selectedId).getCenter(new Vector3());setMarkers((anatomy[s.selectedId]?.attachments??[]).flatMap(a=>{const bounds=registry.bounds(a.boneId);return bounds.isEmpty()?[]:[{id:a.id,label:a.label,bone:bounds.getCenter(new Vector3()),muscle}];}));});return <group>{markers.map(m=><group key={m.id}><Line points={[m.muscle,m.bone]} color="#678c8d" lineWidth={1} dashed dashSize={.04} gapSize={.025}/><mesh position={m.bone}><sphereGeometry args={[.025,12,8]}/><meshBasicMaterial color="#527e7b" depthTest={false}/></mesh><Html position={m.bone} center style={{pointerEvents:'none'}}><span className="attachment-label">{m.label}</span></Html></group>)}</group>;}
