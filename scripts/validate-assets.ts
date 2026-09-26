import { readFile, writeFile } from 'node:fs/promises';
import { Group } from 'three';
import { anatomy } from '../src/data/anatomyTree';
import { anatomyModels } from '../src/data/modelRegistry';
import { auditModel, validateAnatomy } from '../src/utils/validation';
const errors=validateAnatomy(Object.values(anatomy));if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
const reports=[];for(const config of Object.values(anatomyModels)){
 let buffer:Buffer|undefined,path='';for(const url of [...config.urls,`/models/placeholders/${config.id}.glb`]){try{buffer=await readFile(`public${url}`);path=`public${url}`;break;}catch{}}
 if(!buffer){console.error(`Missing model: ${config.id}`);process.exitCode=1;continue;}
 // Inspect glTF JSON directly: compressed meshes and external textures need no GPU decoding for naming checks.
 const json=buffer.readUInt32LE(0)===0x46546c67?JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)).toString().trim()):JSON.parse(buffer.toString());
 const objects=(json.nodes??[]).map((n:{name?:string;mesh?:number;extras?:object})=>{const group=new Group();group.name=n.name??'';group.userData={...n.extras,auditMesh:n.mesh!==undefined};return group;});
 (json.nodes??[]).forEach((n:{children?:number[]},i:number)=>n.children?.forEach(child=>objects[i].add(objects[child])));const root=new Group();objects.filter((o:Group)=>!o.parent).forEach((o:Group)=>root.add(o));
 const report={path,...auditModel(root,config.id)};reports.push(report);console.log(`${config.id}: meshes ${report.meshes}; mapped ${report.mapped}; unmapped ${report.unmapped.length}; missing expected ${report.missingExpected.length}; named muscles ${report.muscles}; canonical bones ${report.bones}`);
}
await writeFile('public/models/asset-report.json',JSON.stringify({dataErrors:errors,models:reports},null,2));
