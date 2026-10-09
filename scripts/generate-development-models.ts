import { mkdir, writeFile } from 'node:fs/promises';
import { Group, Mesh, MeshStandardMaterial, SphereGeometry, TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createDevelopmentParts } from '../src/data/developmentParts';
import { anatomy, isWithin } from '../src/data/anatomyTree';
import { anatomyModels } from '../src/data/modelRegistry';
import { belongsToSystem } from '../src/utils/visibility';

// GLTFExporter uses the browser FileReader interface; Blob itself is native in Node.
class NodeFileReader {
 result: string|ArrayBuffer|null=null; onloadend: null|(()=>void)=null;
 readAsArrayBuffer(blob:Blob){void blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.();});}
 readAsDataURL(blob:Blob){void blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader});
const parts=createDevelopmentParts(),directory='public/models/placeholders';
const sphere=new SphereGeometry(1,20,16);
await mkdir(directory,{recursive:true});
for(const config of Object.values(anatomyModels)){
 if(process.env.ATLAS_MODEL_FILTER&&config.id!==process.env.ATLAS_MODEL_FILTER)continue;
 const group=new Group();group.name='DEVELOPMENT_SCHEMATIC_NOT_MEDICAL_ANATOMY';group.userData={developmentAnatomy:true,license:'CC0-1.0',description:'Schematic geometry for testing. Not anatomically accurate or clinically validated.'};
 const materials=new Map<string,MeshStandardMaterial>();
 for(const part of parts){const n=anatomy[part.id];if(config.id==='heart'&&part.layer==='circulatory')continue;if(!isWithin(part.id,config.root))continue;if(n.type==='micro'&&config.category!=='Microscopic')continue;if(config.systemId&&!belongsToSystem(n.id,config.systemId,n.layer)&&!(config.systemId==='muscular'&&n.layer==='skeleton'))continue;
  const geometry=part.shape==='tube'&&part.points?new TubeGeometry(new CatmullRomCurve3(part.points.map(p=>new Vector3(...p))),Math.max(8,part.points.length*4),part.radius??.025,6,false):sphere;
  if(!materials.has(part.color))materials.set(part.color,new MeshStandardMaterial({color:part.color,roughness:.76,metalness:0}));
  const mesh=new Mesh(geometry,materials.get(part.color));mesh.name=part.key;mesh.userData={anatomyId:part.id,developmentAnatomy:true};mesh.position.set(...part.position);mesh.scale.set(...part.scale);if(part.rotation)mesh.rotation.set(...part.rotation);group.add(mesh);
 }
 const binary=await new GLTFExporter().parseAsync(group,{binary:true});
 await writeFile(`${directory}/${config.id}.glb`,Buffer.from(binary as ArrayBuffer));
 console.log(`${config.id}: ${group.children.length} schematic meshes`);
 for(const child of group.children){const mesh=child as Mesh;mesh.geometry.dispose();(mesh.material as MeshStandardMaterial).dispose();}
}
await writeFile(`${directory}/LICENSE.txt`,'These generated schematic development meshes are dedicated to the public domain under CC0 1.0. https://creativecommons.org/publicdomain/zero/1.0/\nThey are not medical-quality anatomy, and their shapes, positions, and proportions are illustrative only.\n');
await writeFile('public/models/anatomy-manifest.json',JSON.stringify({models:anatomyModels,structures:anatomy},null,2));
for(const folder of ['body','systems','organs','regions','micro']){await mkdir(`public/models/production/${folder}`,{recursive:true});await writeFile(`public/models/production/${folder}/README.md`,'Place authored medical-quality GLB/glTF assets here using the filenames in ../../../../ASSET_GUIDE.md. No licensed medical assets are bundled here. Development GLBs are kept separately in ../../placeholders/.\n');}

