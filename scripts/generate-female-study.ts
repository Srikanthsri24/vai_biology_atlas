import { writeFile } from 'node:fs/promises';
import { Group, Mesh, MeshStandardMaterial, SphereGeometry, LatheGeometry, TubeGeometry, CatmullRomCurve3, Vector2, Vector3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

class NodeFileReader {
 result:string|ArrayBuffer|null=null; onloadend:(()=>void)|null=null;
 readAsArrayBuffer(blob:Blob){void blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.();});}
 readAsDataURL(blob:Blob){void blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader});
const group=new Group();
group.name='SCHEMATIC_FEMALE_REPRODUCTIVE_STUDY';
group.userData={developmentAnatomy:true,license:'CC0-1.0',description:'Illustrative educational anatomy. Not clinically validated or patient-specific.'};
function add(id:string,name:string,geometry:Mesh['geometry'],position:[number,number,number],scale:[number,number,number],color:string){
 const mesh=new Mesh(geometry,new MeshStandardMaterial({color,roughness:.7}));
 mesh.name=name;mesh.userData={anatomyId:id,developmentAnatomy:true};mesh.position.set(...position);mesh.scale.set(...scale);group.add(mesh);
}
function tube(id:string,name:string,points:number[][],radius:number,color:string){
 add(id,name,new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(...p))),48,radius,10,false),[0,0,0],[1,1,1],color);
}
// A smooth external uterine outline; this does not claim to model wall microanatomy.
const profile=[[0,-.115],[.032,-.11],[.041,-.075],[.065,-.03],[.1,.035],[.115,.08],[.105,.12],[.075,.145],[0,.155]];
add('uterus','organ_uterus',new LatheGeometry(profile.map(([r,y])=>new Vector2(r,y)),48),[0,-.52,0],[1,1,.62],'#b97d85');
add('cervix','organ_cervix',new SphereGeometry(1,32,24),[0,-.65,0],[.039,.047,.026],'#ad707c');
tube('vagina','organ_vagina',[[0,-.68,0],[0,-.74,.008],[0,-.8,.025]],.038,'#c68e98');
for(const side of [-1,1]){
 const label=side<0?'right':'left';
 add('ovaries',`organ_${label}_ovary`,new SphereGeometry(1,32,24),[side*.285,-.475,0],[.067,.038,.03],'#d2b4a2');
 tube('uterine-tubes',`organ_${label}_uterine_tube`,[[side*.085,-.43,0],[side*.16,-.412,0],[side*.25,-.411,0],[side*.33,-.435,0],[side*.34,-.46,0]],.012,'#c69297');
 for(let i=0;i<7;i++){
  const angle=Math.PI*.15+i*Math.PI*.12;
  tube('uterine-tubes',`${label}_fimbria_${i}`,[[side*.34,-.46,0],[side*(.325+.025*Math.cos(angle)),-.477,.012*Math.sin(angle)],[side*(.285+.035*Math.cos(angle)),-.49,.018*Math.sin(angle)]],.0035,'#cf9aa1');
 }
}
const binary=await new GLTFExporter().parseAsync(group,{binary:true});
await writeFile('public/models/placeholders/female-reproductive.glb',Buffer.from(binary as ArrayBuffer));
console.log(`Female reproductive study: ${group.children.length} selectable schematic meshes`);
