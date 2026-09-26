import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Box3, Mesh } from 'three';
import { isWithin } from '../../data/anatomyTree';
import type { LayerId } from '../../data/types';
export type SceneEntry={mesh:Mesh;id:string;layer:LayerId};
type Registry={entries:Set<SceneEntry>;version:number;register:(entries:SceneEntry[])=>()=>void;bounds:(id?:string,visibleOnly?:boolean)=>Box3};
const Context=createContext<Registry|null>(null);
export function SceneRegistryProvider({children}:{children:ReactNode}){
 const entries=useMemo(()=>new Set<SceneEntry>(),[]);const [version,setVersion]=useState(0);
 const value=useMemo<Registry>(()=>({entries,version,register(items){items.forEach(e=>entries.add(e));setVersion(v=>v+1);return()=>{items.forEach(e=>entries.delete(e));setVersion(v=>v+1);};},bounds(id,visibleOnly=false){const box=new Box3();for(const entry of entries){if((!id||isWithin(entry.id,id))&&(!visibleOnly||entry.mesh.visible)){entry.mesh.updateWorldMatrix(true,false);const geometry=entry.mesh.geometry;if(!geometry.boundingBox)geometry.computeBoundingBox();if(geometry.boundingBox)box.union(geometry.boundingBox.clone().applyMatrix4(entry.mesh.matrixWorld));}}return box;}}),[entries,version]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSceneRegistry(){const value=useContext(Context);if(!value)throw new Error('Scene registry must be inside Canvas');return value;}
