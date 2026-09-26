import type { Object3D } from 'three';
import { anatomy } from '../data/anatomyTree';
const names=new Map<string,string>();
for(const n of Object.values(anatomy))for(const name of new Set([n.modelObjectName,...n.meshNames??[]]))names.set(name,n.id);
export function mapMeshToAnatomy(object:Object3D):string|null {let current:Object3D|null=object;while(current){const explicit=current.userData.anatomyId;if(typeof explicit==='string'&&anatomy[explicit])return explicit;const id=names.get(current.name);if(id)return id;current=current.parent;}return null;}
