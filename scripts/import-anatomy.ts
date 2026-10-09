/** Reproducible open anatomy import. Asset derivatives remain CC BY-SA 4.0. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Box3, Color, Group, Matrix4, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { anatomy, isWithin } from '../src/data/anatomyTree';
import type { AnatomyNode, LayerId, Vec3 } from '../src/data/types';

class NodeFileReader {
 result:string|ArrayBuffer|null=null; onloadend:(()=>void)|null=null;
 readAsArrayBuffer(b:Blob){void b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();});}
 readAsDataURL(b:Blob){void b.arrayBuffer().then(v=>{this.result=`data:${b.type};base64,${Buffer.from(v).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader});
const output='public/models/open-anatomy', cache='.cache/open-anatomy';
await mkdir(output,{recursive:true});await mkdir(cache,{recursive:true});
const sources={vanatome:'https://raw.githubusercontent.com/vixotic/Vanatome/8185b3fa46a1dbefdd907390918c57954fd9b816',bodyexplorer:'https://raw.githubusercontent.com/JohanBellander/BodyExplorer/7d04bf3c4de2bd9cb234dd51d7e6857c099afafd'};
const provenance:Record<string,unknown>={sources,license:'CC BY-SA 4.0',modifications:'Coordinate registration, mesh selection, anatomical identifiers, natural tissue colors, module exports. Kidney meshes excluded because upstream notices identify an NC source.'};
async function asset(key:string,url:string){let bytes:Buffer;try{bytes=await readFile(`${cache}/${key}`);}catch{const r=await fetch(url);if(!r.ok)throw Error(`${r.status}: ${url}`);bytes=Buffer.from(await r.arrayBuffer());await writeFile(`${cache}/${key}`,bytes);}provenance[key]={url,sha256:createHash('sha256').update(bytes).digest('hex')};return bytes;}
async function load(key:string,url:string){const b=await asset(key,url);return (await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength) as ArrayBuffer,'')).scene;}
const [atlas,muscles,bones]=await Promise.all([load('body.glb',`${sources.vanatome}/public/models/z-anatomy-1.4.0-full-body.glb`),load('muscles.glb',`${sources.bodyexplorer}/public/anatomy.glb`),load('bones.glb',`${sources.bodyexplorer}/public/skeleton.glb`)]);
const manifest=JSON.parse((await asset('manifest.json',`${sources.vanatome}/public/models/z-anatomy-1.4.0-manifest.json`)).toString());
const imported:Record<string,AnatomyNode>={};
for(const id of Object.keys(anatomy))if(id.startsWith('real-'))delete anatomy[id];
for(const n of Object.values(anatomy))n.children=n.children.filter(id=>!id.startsWith('real-'));
const original=Object.values(anatomy).filter(n=>!n.id.startsWith('real-'));
const normalize=(s:string)=>s.toLowerCase().replace(/[_—.()]/g,' ').replace(/\bbone\b/g,'').replace(/\s+/g,' ').trim();
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const region=(p:Vector3)=>p.y>1.46?'head':Math.abs(p.x)>.22&&p.y>.6?(p.y<.9?(p.x>=0?'hand':'right-hand'):(p.x>=0?'left-arm':'right-arm')):p.y<.16?(p.x>=0?'foot':'right-foot'):p.y<.83?(p.x>=0?'left-leg':'right-leg'):p.y>1.2?'chest':p.y>.95?'abdomen':'pelvis';
const aliases:Record<string,string>={'oesophagus':'esophagus','body-shell':'skin','thyroid-gland':'thyroid','pituitary-gland':'pituitary','parathyroid-glands':'parathyroids','heart-left-atrium':'left-atrium','heart-right-atrium':'right-atrium','heart-left-ventricle':'left-ventricle','heart-right-ventricle':'right-ventricle','pulmonary-arteries':'pulmonary-artery'};
function findExisting(name:string,layer:LayerId){const n=normalize(name),side=/\bleft\b/.test(n)?'left':/\bright\b/.test(n)?'right':undefined,core=n.replace(/\b(left|right)\b/g,'').replace(/\s+/g,' ').trim();
 return original.filter(a=>(layer.startsWith('muscles')?a.type==='muscle':layer==='skeleton'?a.layer==='skeleton':a.layer===layer)&&(!side||a.side===side||a.id.endsWith(`-${side}`))).find(a=>normalize(a.name)===n||normalize(a.scientificName)===core||normalize(a.name).replace(/\b(left|right)\b/g,'').trim()===core)?.id;
}
function create(id:string,name:string,parent:string,system:string,layer:LayerId,p:Vector3,type:AnatomyNode['type']='tissue'){
 if(anatomy[id])return id;if(imported[id])return id;const target:Vec3=[p.x*3.44,(p.y-.872)*3.44,p.z*3.44];
 imported[id]={id,name,scientificName:name,parent,region:anatomy[region(p)]?.name??'Human body',labelAnchor:[0,0,0],side:/left/i.test(name)?'left':/right/i.test(name)?'right':'midline',system:`${system[0].toUpperCase()+system.slice(1)} system`,systems:[system==='reproductive'?'male-reproductive':system],layer,type,description:`${name} is shown as a separately selectable surface from the open anatomy dataset. Explore its position and relationship to neighboring structures in 3D.`,functions:[],location:anatomy[parent]?.name??imported[parent]?.name??'Human body',children:[],modelObjectName:id,cameraTarget:target,cameraPosition:[target[0],target[1],target[2]+2],radius:.3,explodeDirection:[p.x>=0?.65:-.65,0,p.z>=0?.4:-.4],source:'https://github.com/Z-Anatomy/Models-of-human-anatomy',maxExplodeDistance:.65};return id;
}
function flattened(root:Group){root.updateMatrixWorld(true);const result:Mesh[]=[];root.traverse(o=>{if(o instanceof Mesh){const m=new Mesh(o.geometry.clone().applyMatrix4(o.matrixWorld),o.material);if(o.matrixWorld.determinant()<0){const index=m.geometry.index;if(index)for(let i=0;i<index.count;i+=3){const b=index.getX(i+1);index.setX(i+1,index.getX(i+2));index.setX(i+2,b);}}m.name=o.name;m.userData={...o.userData};result.push(m);}});return result;}
const z=flattened(atlas), b=flattened(bones), mu=flattened(muscles);
// BP3D is millimetres, Z up; Z-Anatomy is metres, Y up. Register shared femur centres.
const bpToMetres=new Matrix4().set(.001,0,0,0, 0,0,.001,0, 0,-.001,0,0, 0,0,0,1);
for(const m of [...b,...mu])m.geometry.applyMatrix4(bpToMetres);
const center=(m:Mesh)=>{m.geometry.computeBoundingBox();return m.geometry.boundingBox!.getCenter(new Vector3());};
const offsets:Vector3[]=[];
for(const side of ['left','right']){const zm=z.find(m=>m.userData.anatomyId===`appendicular-skeleton-femur-${side}`),bm=b.find(m=>normalize(m.name)===`${side} femur`);if(zm&&bm)offsets.push(center(zm).sub(center(bm)));}
if(offsets.length!==2)throw Error('Unable to register shared femur landmarks');
const translation=offsets[0].clone().add(offsets[1]).multiplyScalar(.5);
console.log('Registration offset (metres)',translation.toArray());provenance.registrationTranslation=translation.toArray();
for(const m of [...b,...mu])m.geometry.translate(translation.x,translation.y,translation.z);
const all:Mesh[]=[];
function prepare(m:Mesh,id:string,layer:LayerId,system:string,color:string){m.userData={anatomyId:id,anatomySystem:system,source:'Open anatomy',layer};m.name=id;m.geometry.normalizeNormals();m.material=new MeshStandardMaterial({color:new Color(color),roughness:layer==='skin'?.68:layer==='skeleton'?.58:.43,metalness:0});all.push(m);}
const groupIds:Record<string,string>={};
for(const [key,g] of Object.entries(manifest.groups) as [string,any][]){if(g.system==='muscular'||g.system==='skeletal'||key==='kidneys')continue;
 const p=new Vector3(g.centerBlender[0],g.centerBlender[2],-g.centerBlender[1]);const layer:LayerId=g.system==='nervous'?'nervous':g.system==='regional-anatomy'?'skin':g.system==='lymphatic'?'lymphatic':key.includes('arter')?'arteries':key.includes('vein')?'veins':'organs';
 const parent=g.system==='nervous'?'brain':g.system==='reproductive'?'male-reproductive-anatomy':g.system==='cardiovascular'?'heart':region(p);
 groupIds[key]=aliases[key]??(anatomy[key]?key:create(`real-${key}`,g.name,parent,g.system,layer,p,'organ'));
 for(const [sid,s] of Object.entries(g.structures) as [string,any][]){if(sid===key)continue;const sp=new Vector3(s.centerBlender[0],s.centerBlender[2],-s.centerBlender[1]);const name=s.name.replace(/\.l$/,' — Left').replace(/\.r$/,' — Right');
  const lungParent=sid.includes('left-lung')?'left-lung':sid.includes('right-lung')?'right-lung':groupIds[key];
  groupIds[sid]=aliases[sid]??create(`real-${sid}`,name,lungParent,g.system,layer,sp,'tissue');
 }
}
for(const m of z){const sys=m.userData.anatomySystem,sid=m.userData.anatomyId;if(sys==='skeletal'||sys==='muscular'||sid?.startsWith('kidneys'))continue;let id=groupIds[sid];if(!id)continue;
 const p=center(m);let layer:LayerId=sys==='nervous'?'nervous':sys==='regional-anatomy'?'skin':sys==='lymphatic'?'lymphatic':sid.includes('arter')?'arteries':sid.includes('vein')?'veins':'organs';
 if(sid==='body-shell'){const name=m.userData.sourceName??m.name;id=create(`real-skin-${slug(name)}`,name.replace(/\.l$/,' — Left').replace(/\.r$/,' — Right'),region(p),'integumentary',layer,p);}
 const colors:Record<string,string>={skin:'#bd927a',nervous:'#d5bc83',lymphatic:'#819257',arteries:'#a74742',veins:'#526d99'};
 const organColor=sid.includes('heart')?'#9d4d48':sid.includes('lung')?'#bb8a8b':sid.includes('liver')?'#79473e':sid.includes('intestine')?'#bc9274':sid.includes('cerebr')?'#c6aaa1':'#b38364';
 prepare(m,id,layer,sys,colors[layer]??organColor);
}
for(const m of [...b,...mu]){const isBone=b.includes(m),p=center(m),name=m.name.replaceAll('_',' '),n=normalize(name);const layer:LayerId=isBone?'skeleton':/tendon|ligament|retinaculum|aponeurosis|fascia|membrane/.test(n)?'tendons':'muscles';const sys=isBone?'skeletal':'muscular';
 let id=name.toLowerCase()==='diaphragm'?'diaphragm':findExisting(name,layer);let parent=region(p);
 if(!id&&!isBone){const side=/\bleft\b/.test(n)?'left':/\bright\b/.test(n)?'right':undefined;const candidate=original.filter(a=>a.type==='muscle'&&a.side===side&&n.includes(normalize(a.scientificName))).sort((a,b)=>b.scientificName.length-a.scientificName.length)[0];if(candidate)parent=candidate.id;else {const r=region(p);parent=r==='head'?'muscles-head-neck':r.includes('arm')||r.includes('hand')?'muscle-upper-limb':r.includes('leg')||r.includes('foot')?'muscle-lower-limb':r==='chest'?'muscles-chest':r==='abdomen'?'muscles-abdomen':'muscles-gluteal';}}
 if(!id&&isBone&&p.y>1.48)parent='skull';
 id=id??create(`real-${slug(name)}`,name[0].toUpperCase()+name.slice(1),parent,sys,layer,p,isBone?'bone':layer==='tendons'?'tendon':'muscle');
 prepare(m,id,layer,sys,isBone?'#d7c9ac':layer==='tendons'?'#dbccb6':'#a45950');
}
// Commit generated metadata before building module filters; retain curated descriptions on known IDs.
for(const n of Object.values(imported))anatomy[n.id]=n;
for(const n of Object.values(imported)){if(!anatomy[n.parent!])throw Error(`Missing parent ${n.parent}`);if(!anatomy[n.parent!].children.includes(n.id))anatomy[n.parent!].children.push(n.id);}
await writeFile('src/data/openAnatomy.generated.json',JSON.stringify(imported));
const moduleFilters:Record<string,(m:Mesh)=>boolean>={body:()=>true,male:()=>true,'muscular-body':m=>m.userData.anatomySystem==='muscular','skeletal-body':m=>m.userData.layer==='skeleton','integumentary-system':m=>m.userData.layer==='skin'};
for(const [model,sys] of Object.entries({'nervous-system':'nervous','endocrine-system':'endocrine','cardiovascular-system':'cardiovascular','lymphatic-system':'lymphatic','immune-system':'lymphatic','respiratory-system':'respiratory','digestive-system':'digestive','male-reproductive':'reproductive'}))moduleFilters[model]=m=>m.userData.anatomySystem===sys;
for(const id of ['heart','brain','lungs','liver','stomach','pancreas','spleen','intestines','bladder','gallbladder','thyroid','small-intestine','large-intestine','skull','head','spine','hand','foot'])moduleFilters[id]=m=>isWithin(m.userData.anatomyId,id);
moduleFilters.head=m=>center(m).y>1.46;
moduleFilters.hand=m=>{const p=center(m);return p.x>.22&&p.y>.6&&p.y<.9;};
moduleFilters.leg=m=>{const p=center(m);return p.x>0&&p.x<.22&&p.y<.83;};
moduleFilters['respiratory-system']=m=>m.userData.anatomySystem==='respiratory'||m.userData.anatomyId==='diaphragm';
const installed:Record<string,{url:string;meshes:number;bytes:number}>={};
for(const [id,filter]of Object.entries(moduleFilters)){if(id==='male'){installed.male={...installed.body};continue;}const group=new Group();group.name=`OPEN_ANATOMY_${id}`;group.userData={license:'CC BY-SA 4.0',attribution:'Z-Anatomy / BodyParts3D / Vanatome / BodyExplorer',coverage:'Selected structures; not a complete clinical atlas'};for(const m of all.filter(filter))group.add(m.clone());if(!group.children.length)continue;
 const data=await new GLTFExporter().parseAsync(group,{binary:true});const bytes=Buffer.from(data as ArrayBuffer);await writeFile(`${output}/${id}.glb`,bytes);installed[id]={url:`/models/open-anatomy/${id}.glb`,meshes:group.children.length,bytes:bytes.length};console.log(id,group.children.length,Math.round(bytes.length/1024)+' KiB');}
await writeFile('src/data/openModels.generated.json',JSON.stringify(installed,null,2));
await writeFile(`${output}/provenance.json`,JSON.stringify(provenance,null,2));
