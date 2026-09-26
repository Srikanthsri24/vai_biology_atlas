import { Mesh, type Object3D } from 'three';
import { anatomy, isWithin } from '../data/anatomyTree';
import { anatomyModels } from '../data/modelRegistry';
import type { AnatomyNode } from '../data/types';
import { belongsToSystem } from './visibility';
import { mapMeshToAnatomy } from './meshMapping';
export type AssetReport={model:string;meshes:number;mapped:number;unmapped:string[];missingExpected:string[];mappedIds:string[];muscles:number;bones:number};
export function auditModel(root:Object3D,model:string):AssetReport{
 const config=anatomyModels[model],report:AssetReport={model,meshes:0,mapped:0,unmapped:[],missingExpected:[],mappedIds:[],muscles:0,bones:0};const ids=new Set<string>();
 root.traverse(object=>{if(!(object instanceof Mesh)&&object.userData.auditMesh!==true)return;report.meshes++;const id=mapMeshToAnatomy(object);if(id){report.mapped++;ids.add(id);}else report.unmapped.push(object.name||'(unnamed)');});
 report.mappedIds=[...ids];report.muscles=[...ids].filter(id=>anatomy[id]?.type==='muscle'&&!!anatomy[id]?.side).length;report.bones=[...ids].filter(id=>anatomy[id]?.canonicalBone).length;
 report.missingExpected=Object.values(anatomy).filter(n=>(!n.children.length||n.canonicalBone)&&isWithin(n.id,config.root)&&(!config.systemId||belongsToSystem(n.id,config.systemId,n.layer))&&!ids.has(n.id)).map(n=>n.id);return report;
}
export function validateAnatomy(entries:AnatomyNode[]){const errors:string[]=[],ids=new Set<string>();const map=new Map(entries.map(n=>[n.id,n]));for(const n of entries){if(ids.has(n.id))errors.push(`Duplicate ID: ${n.id}`);ids.add(n.id);if(n.parent&&!map.has(n.parent))errors.push(`Missing parent: ${n.id}`);if(!n.modelObjectName&&!n.meshNames?.length)errors.push(`Missing mesh mapping: ${n.id}`);if(!n.labelAnchor)errors.push(`Missing label anchor: ${n.id}`);if(!n.system)errors.push(`Missing system: ${n.id}`);if(!n.region)errors.push(`Missing region: ${n.id}`);const seen=new Set<string>();let current:AnatomyNode|undefined=n;while(current){if(seen.has(current.id)){errors.push(`Hierarchy cycle: ${n.id}`);break;}seen.add(current.id);current=map.get(current.parent??'');}for(const child of n.children)if(map.get(child)?.parent!==n.id)errors.push(`Broken child link: ${n.id}/${child}`);}return errors;}
