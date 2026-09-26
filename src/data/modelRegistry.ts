import type { BodySystem, ModelConfig, ModelId, LayerId, Vec3 } from './types';

export const systems:BodySystem[] = [
 {id:'integumentary',name:'Integumentary System',layer:'skin',modelId:'integumentary-system',group:'Protection',icon:'shield',description:'Explore the skin and its protective structures.',structures:['skin']},
 {id:'skeletal',name:'Skeletal System',layer:'skeleton',modelId:'skeletal-body',group:'Support & Movement',icon:'bone',description:'Explore individual bones, joints, and the supporting framework.',structures:['skull','rib-cage','spine','arms','legs']},
 {id:'muscular',name:'Muscular System',layer:'muscles',modelId:'muscular-body',group:'Support & Movement',icon:'activity',description:'Explore superficial and deep muscles, their attachments, and actions.',structures:['muscular-system'],treeRoot:'muscular-system'},
 {id:'nervous',name:'Nervous System',layer:'nervous',modelId:'nervous-system',group:'Control & Communication',icon:'brain',description:'Follow the brain, spinal cord, and named peripheral nerves.',structures:['brain','spinal-cord','peripheral-nerves']},
 {id:'endocrine',name:'Endocrine System',layer:'organs',modelId:'endocrine-system',group:'Control & Communication',icon:'scan',description:'Discover glands involved in hormonal communication.',structures:['hypothalamus','pituitary','pineal-gland','thyroid','parathyroids','adrenal-glands','pancreas','ovaries','testes']},
 {id:'cardiovascular',name:'Cardiovascular System',layer:'arteries',modelId:'cardiovascular-system',group:'Transport',icon:'heart',description:'Explore the heart, major arteries, and veins.',structures:['heart','arteries','veins']},
 {id:'lymphatic',name:'Lymphatic System',layer:'lymphatic',modelId:'lymphatic-system',group:'Transport',icon:'droplet',description:'Explore lymph vessels, nodes, and lymphoid organs.',structures:['lymph-vessels','lymph-nodes','spleen','thymus','tonsils']},
 {id:'immune',name:'Immune System',layer:'lymphatic',modelId:'immune-system',group:'Protection',icon:'shield',description:'Explore anatomical sites involved in immune defense.',structures:['lymph-nodes','spleen','thymus','tonsils','bone-marrow']},
 {id:'respiratory',name:'Respiratory System',layer:'organs',modelId:'respiratory-system',group:'Energy & Nutrition',icon:'wind',description:'Trace the airways from the nasal cavity to the lungs.',structures:['nasal-cavity','pharynx','larynx','trachea','bronchi','lungs','diaphragm']},
 {id:'digestive',name:'Digestive System',layer:'organs',modelId:'digestive-system',group:'Energy & Nutrition',icon:'scan',description:'Follow digestion from the mouth to the intestines.',structures:['oral-cavity','salivary-glands','pharynx','esophagus','stomach','liver','gallbladder','pancreas','intestines','rectum']},
 {id:'urinary',name:'Urinary System',layer:'organs',modelId:'urinary-system',group:'Transport',icon:'droplet',description:'Explore the kidneys and the pathway that carries urine.',structures:['kidneys','renal-arteries','renal-veins','ureters','bladder','urethra']},
 {id:'male-reproductive',name:'Male Reproductive System',layer:'organs',modelId:'male-reproductive',group:'Reproduction',icon:'scan',description:'Explore a dedicated educational module of male reproductive anatomy.',structures:['male-reproductive-anatomy'],treeRoot:'male-reproductive-anatomy'},
 {id:'female-reproductive',name:'Female Reproductive System',layer:'organs',modelId:'female-reproductive',group:'Reproduction',icon:'scan',description:'Explore a dedicated educational module of female reproductive anatomy.',structures:['female-reproductive-anatomy'],treeRoot:'female-reproductive-anatomy'}
];

function model(id:ModelId,name:string,root:string,path:string,category:string,origin:Vec3=[0,0,0],scale=1,description='Explore this anatomical structure in a dedicated 3D workspace.'):ModelConfig {
 return {id,name,root,urls:[path,path.replace('.glb','.gltf')],category,origin,scale,description,subtitle:'Explore the Human Body in 3D',cameraDistance:10,targetHeight:root==='body'?6:3,gltfTransform:{position:[0,0,0],rotation:[0,0,0],scale:1}};
}
export const anatomyModels:Record<ModelId,ModelConfig>={
 body:model('body','Full Human Body','body','/models/body/full-body.glb','Body'),
 male:model('male','Male Anatomy','body','/models/body/male-body.glb','Body'),
 female:model('female','Female Anatomy','body','/models/body/female-body.glb','Body'),
 brain:model('brain','Brain','brain','/models/organs/brain.glb','Organs',[0,2.4,0],4.3),
 heart:model('heart','Heart','heart','/models/organs/heart.glb','Organs',[.18,1.15,.2],5.2),
 hand:model('hand','Hand','hand','/models/regions/hand.glb','Regions',[1.4,-.48,0],4.3),
 leg:model('leg','Leg','left-leg','/models/regions/leg.glb','Regions',[.4,-1.72,0],1.8)
};
for(const id of ['body','male','female','brain','heart','hand','leg']){anatomyModels[id].featured=true;anatomyModels[id].urls.push(`/models/${id}/${id}.glb`,`/models/${id}/${id}.gltf`);}
for(const [id,name,root,origin,scale] of [
 ['lungs','Lungs','lungs',[0,1.1,0],2.3],['liver','Liver','liver',[-.26,.46,.1],4],['kidneys','Kidneys','kidneys',[0,.04,-.19],4],['stomach','Stomach','stomach',[.3,.33,.14],5],['pancreas','Pancreas','pancreas',[0,.22,-.05],4],['spleen','Spleen','spleen',[.5,.4,-.1],5],['intestines','Intestines','intestines',[0,-.25,.1],3],['eye','Eye','eyes',[.2,2.39,.33],8],['ear','Ear','ear',[.37,2.33,0],7],['bladder','Bladder','bladder',[0,-.6,.15],6]
 ] as [string,string,string,Vec3,number][]){anatomyModels[id]=model(id,name,root,`/models/organs/${id==='kidneys'?'kidney':id}.glb`,'Organs',origin,scale);}
for(const [id,name,origin,scale] of [['head','Head',[0,2.3,0],2.5],['skull','Skull',[0,2.3,0],3],['foot','Foot',[.4,-2.86,.16],5],['spine','Spine',[0,.3,-.2],1.4]] as [string,string,Vec3,number][]){anatomyModels[id]=model(id,name,id,`/models/regions/${id}.glb`,'Regions',origin,scale);}
anatomyModels.skin=model('skin','Skin Cross Section','skin','/models/regions/skin.glb','Tissues');
for(const [id,name] of [['gallbladder','Gallbladder'],['thyroid','Thyroid'],['small-intestine','Small Intestine'],['large-intestine','Large Intestine']])anatomyModels[id]=model(id,name,id,`/models/organs/${id}.glb`,'Organs');
for(const [id,name,parent] of [['neuron','Neuron','nerve-fiber'],['alveolus','Alveolus','bronchioles'],['capillary','Capillary','arteries'],['nephron','Nephron','kidneys']]){anatomyModels[id]=model(id,name,id,`/models/micro/${id}.glb`,'Microscopic');anatomyModels[id].parentAnchor={structureId:parent,position:[0,0,0],rotation:[0,0,0],scale:1};}
for(const system of systems){anatomyModels[system.modelId]=model(system.modelId,system.id==='muscular'?'Complete Muscular Human Body':system.name,system.id.includes('reproductive')?`${system.id}-anatomy`:'body',`/models/systems/${system.id}.glb`,'Systems');anatomyModels[system.modelId].systemId=system.id;}
for(const config of Object.values(anatomyModels)){config.urls=[...config.urls.slice(0,2).map(url=>url.replace('/models/','/models/production/')),...config.urls];config.lod={...config.lod,[config.category==='Microscopic'?'micro':config.root==='body'?'body':config.category==='Regions'?'region':'structure']:config.urls[0]};if(config.root!=='body'&&!config.systemId&&!config.parentAnchor)config.parentAnchor={structureId:config.root,position:[0,0,0],rotation:[0,0,0],scale:1};}
export const layers:{id:LayerId;name:string;color:string;direction:Vec3}[]=[
 {id:'tendons',name:'Tendons',color:'#dfd4b4',direction:[-.7,0,.2]},
 {id:'ligaments',name:'Ligaments',color:'#d5c89f',direction:[.3,0,.2]},
 {id:'skin',name:'Skin',color:'#bdc5bc',direction:[-2.1,0,0]},
 {id:'muscles',name:'Superficial muscles',color:'#ab6258',direction:[-1.4,0,0]},
 {id:'muscles-intermediate',name:'Intermediate muscles',color:'#a7544c',direction:[-.9,0,0]},
 {id:'muscles-deep',name:'Deep muscles',color:'#874740',direction:[-.5,0,0]},
 {id:'skeleton',name:'Skeleton',color:'#c6bb9e',direction:[0,0,0]},
 {id:'organs',name:'Organs',color:'#a9666c',direction:[.8,0,.4]},
 {id:'arteries',name:'Arteries',color:'#aa5655',direction:[1.6,0,.2]},
 {id:'veins',name:'Veins',color:'#6084a0',direction:[2.1,0,.1]},
 {id:'nervous',name:'Nervous system',color:'#bb9d54',direction:[2.6,0,-.1]},
 {id:'lymphatic',name:'Lymphatic system',color:'#819c68',direction:[3.2,0,-.1]},
 {id:'circulatory',name:'Other vessels',color:'#7c7495',direction:[1.8,0,.1]}
];
export function modelRoute(model:ModelConfig){return model.systemId?`/systems/${model.systemId}`:`/atlas/${model.id}`;}

