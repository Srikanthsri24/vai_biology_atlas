import type { AnatomyNode, LayerId, Vec3 } from './types';
import { extendSchoolAnatomy } from './schoolAnatomy';
import { extendAnatomy } from './extendedAnatomy';
import { addMuscles } from './muscleData';
export const anatomy: Record<string, AnatomyNode> = {};
function add(id: string, name: string, parent: string | null, position: Vec3, radius: number, description: string, system = 'Regional anatomy', layer: LayerId = 'organs', scientificName = name, functions: string[] = [], location = '') {
  anatomy[id] = { id, name, parent, scientificName, system, layer, radius, description, functions: functions.length ? functions : [description], location: location || (parent ? anatomy[parent]?.name : 'Whole body') || 'Human body', children: [], modelObjectName: id.replaceAll('-', '_'), cameraTarget: position, cameraPosition: [position[0], position[1], position[2] + radius * 4], explodeDirection: [position[0] > 0 ? .8 : -.8, position[1] > .8 ? .4 : -.3, .6] };
  if (parent && anatomy[parent]) anatomy[parent].children.push(id);
}
add('body','Human Body',null,[0,0,0],3,'Explore the connected regions and systems of the human body. Move closer to reveal deeper layers, or choose a structure to begin.','Complete anatomy','skin','Corpus humanum',['Support and movement','Transport and exchange','Coordination and regulation'],'Whole body');
add('head','Head','body',[0,2.35,0],.6,'Contains the brain and major sensory organs. The skull protects the brain.','Regional anatomy','skin','Caput');
add('brain','Brain','head',[0,2.42,0],.43,'The brain integrates sensory information and coordinates movement, thought, memory, and many functions of the body.','Nervous system','nervous','Encephalon',['Integrates sensory information','Supports cognition and memory','Coordinates movement'],'Cranial cavity');
const brainParts: [string,string,Vec3,string][] = [
 ['frontal-lobe','Frontal Lobe',[0,2.47,.23],'Supports planning, decision-making, and voluntary movement.'],
 ['parietal-lobe','Parietal Lobe',[0,2.62,-.02],'Helps integrate bodily sensation and spatial information.'],
 ['temporal-lobe','Temporal Lobe',[.25,2.33,.02],'Contributes to hearing, language, and memory.'],
 ['occipital-lobe','Occipital Lobe',[0,2.43,-.25],'Processes visual information.'],
 ['cerebellum','Cerebellum',[0,2.18,-.18],'Coordinates movement and contributes to posture and balance.'],
 ['brainstem','Brainstem',[0,2.05,-.06],'Connects the brain with the spinal cord and supports vital functions including breathing.']
];
brainParts.forEach(([id,name,p,d],i)=>{ add(id,name,'brain',p,.18,d,'Nervous system','nervous'); anatomy[id].explodeDirection = [[0,.3,1],[.1,1,0],[1,0,0],[0,.2,-1],[0,-.8,-.5],[0,-1,.4]][i] as Vec3; anatomy[id].source='https://www.nimh.nih.gov/news/media/2023/get-to-know-your-brain'; });
add('eyes','Eyes','head',[.2,2.39,.33],.16,'The eyes detect light and provide sensory information for vision.','Nervous system','organs','Oculi');
add('skull','Skull','head',[0,2.35,0],.48,'The bony framework of the head protects the brain and supports facial structures.','Skeletal system','skeleton','Cranium');
add('chest','Chest','body',[0,1.03,0],.95,'The thorax contains the heart and lungs within a protective framework formed by the ribs and sternum.','Regional anatomy','skin','Thorax');
add('heart','Heart','chest',[.18,1.05,.22],.34,'A muscular organ that keeps blood moving through the lungs and the rest of the body. Its four chambers work together in a coordinated pumping cycle.','Cardiovascular system','organs','Cor',['Pumps blood through the lungs','Supplies the body through systemic circulation'],'Thoracic cavity, between the lungs');
anatomy.heart.source='https://www.nhlbi.nih.gov/health/heart/anatomy';
const heartParts: [string,string,Vec3,number,string][] = [
 ['left-atrium','Left Atrium',[.31,1.23,.16],.11,'Receives oxygen-rich blood returning from the lungs.'],
 ['right-atrium','Right Atrium',[.04,1.22,.22],.13,'Receives oxygen-poor blood returning from the body.'],
 ['left-ventricle','Left Ventricle',[.29,.96,.26],.2,'Pumps oxygen-rich blood into the aorta and systemic circulation.'],
 ['right-ventricle','Right Ventricle',[.08,1,.34],.18,'Pumps blood into the pulmonary circulation toward the lungs.'],
 ['aorta','Aorta',[.18,1.42,.18],.16,'The main artery carrying blood from the left ventricle to the body.'],
 ['pulmonary-artery','Pulmonary Artery',[.02,1.4,.3],.14,'Carries oxygen-poor blood from the right ventricle toward the lungs.'],
 ['pulmonary-veins','Pulmonary Veins',[.36,1.29,.05],.12,'Return oxygen-rich blood from the lungs to the left atrium.'],
 ['valves','Valves',[.18,1.13,.22],.1,'The tricuspid, pulmonary, mitral, and aortic valves guide one-way blood flow through the heart.']
];
heartParts.forEach(([id,name,p,r,d],i)=>{add(id,name,'heart',p,r,d,'Cardiovascular system'); anatomy[id].explodeDirection=[[.8,.5,-.2],[-.8,.5,.2],[.9,-.7,.1],[-.8,-.6,.7],[.2,1.1,0],[-.5,1,.5],[1,.3,-.7],[0,0,1.2]][i] as Vec3; anatomy[id].source='https://www.nhlbi.nih.gov/health/heart/blood-flow';});
add('left-lung','Left Lung','chest',[.46,1.14,0],.45,'Exchanges oxygen and carbon dioxide between inhaled air and the blood. The left lung has two lobes.','Respiratory system');
add('right-lung','Right Lung','chest',[-.43,1.14,0],.45,'Exchanges gases through its branching airways and alveoli. The right lung has three lobes.','Respiratory system');
add('rib-cage','Rib Cage','chest',[0,1.12,0],.85,'Ribs, thoracic vertebrae, and the sternum form a protective cage around the heart and lungs.','Skeletal system','skeleton');
add('abdomen','Abdomen','body',[0,-.05,0],.7,'Contains much of the digestive system and organs involved in processing nutrients and removing waste.','Regional anatomy','skin');
add('liver','Liver','abdomen',[-.26,.46,.1],.38,'Processes absorbed nutrients, produces bile, and performs many metabolic functions.','Digestive system');
add('stomach','Stomach','abdomen',[.3,.33,.14],.25,'Stores and mixes food with gastric secretions as part of digestion.','Digestive system');
add('kidneys','Kidneys','abdomen',[0,.04,-.19],.4,'Filter blood and help regulate fluid, electrolytes, and acid-base balance.','Urinary system');
add('intestines','Intestines','abdomen',[0,-.25,.1],.45,'The small intestine absorbs most nutrients. The large intestine absorbs water and forms stool.','Digestive system');
add('arms','Arms','body',[0,.55,0],1.7,'The upper limbs support reaching, positioning, and manipulation.','Regional anatomy','skin','Upper limbs');
for(const side of ['left','right']) {
 const x=side==='left'?1:-1, label=side==='left'?'Left':'Right';
 add(`${side}-arm`,`${label} Arm`,'arms',[x*1.05,.6,0],.9,'The arm and forearm connect the shoulder to the hand.','Regional anatomy','skin');
 add(side==='left'?'upper-arm':'right-upper-arm',`${label} Upper Arm`,`${side}-arm`,[x*.95,1.05,0],.45,'The humerus provides the bony framework between shoulder and elbow.','Skeletal system','skeleton','Brachium');
 add(side==='left'?'forearm':'right-forearm',`${label} Forearm`,`${side}-arm`,[x*1.23,.25,0],.4,'The radius and ulna support forearm rotation and the wrist.','Skeletal system','skeleton','Antebrachium');
 add(side==='left'?'hand':'right-hand',`${label} Hand`,`${side}-arm`,[x*1.4,-.45,0],.36,'The hand combines bones, joints, muscles, tendons, nerves, and vessels for precise movement and touch.','Regional anatomy','skin','Manus');
}
add('hand-bones','Bones','hand',[1.4,-.48,0],.32,'The hand contains carpals, metacarpals, and phalanges.','Skeletal system','skeleton');
for(const [id,name,y,d] of [['carpals','Carpals',-.23,'Eight wrist bones connect the forearm and hand.'],['metacarpals','Metacarpals',-.43,'Five bones form the framework of the palm.'],['phalanges','Phalanges',-.69,'Fourteen bones form the fingers and thumb.']] as const) add(id,name,'hand-bones',[1.4,y,.02],.19,d,'Skeletal system','skeleton');
for(const [id,name,layer,d] of [['hand-muscles','Muscles','muscles','Muscles in the hand and forearm cooperate to move the digits.'],['hand-tendons','Tendons','muscles','Connect muscles to bones and transmit force for movement.'],['hand-nerves','Nerves','nervous','Carry sensory information and signals that activate muscles.'],['hand-vessels','Blood Vessels','circulatory','Supply hand tissues and return blood toward the heart.']] as const) add(id,name,'hand',[1.4,-.45,.07],.25,d,name==='Muscles'||name==='Tendons'?'Muscular system':name==='Nerves'?'Nervous system':'Cardiovascular system',layer);
add('legs','Legs','body',[0,-1.65,0],1.45,'The lower limbs support body weight and enable standing and locomotion.','Regional anatomy','skin','Lower limbs');
for(const side of ['left','right']) {
 const x=side==='left'?.4:-.4,label=side==='left'?'Left':'Right',prefix=side==='left'?'':'right-';
 add(`${side}-leg`,`${label} Leg`,'legs',[x,-1.68,0],1.2,'Explore the thigh, knee, lower leg, and foot as a connected lower limb.','Regional anatomy','skin','Lower limb');
 for(const [id,name,y,r,d] of [['femur','Femur',-1.12,.5,'Thigh bone connecting the hip region with the knee.'],['knee','Knee',-1.66,.2,'Joint involving the femur, tibia, and patella, supported by cartilage, ligaments, and tendons.'],['tibia','Tibia',-2.19,.45,'The larger lower-leg bone bears most of the transmitted body weight.'],['fibula','Fibula',-2.19,.43,'Slender bone alongside the tibia on the outer side of the lower leg.'],['foot','Foot',-2.86,.29,'A structure of bones, joints, and soft tissues that supports balance and movement.']] as const) add(prefix+id,name,`${side}-leg`,[x+(id==='fibula'?(side==='left'?.13:-.13):0),y,id==='foot'?.16:0],r,d,'Skeletal system','skeleton');
}
for(const [id,name,layer,system,d] of [['leg-muscles','Muscles','muscles','Muscular system','Generate force to support posture and move the lower limb.'],['leg-nerves','Nerves','nervous','Nervous system','Carry motor and sensory signals between the lower limb and central nervous system.'],['leg-vessels','Blood Vessels','circulatory','Cardiovascular system','Deliver blood to lower-limb tissues and return it toward the heart.']] as const) add(id,name,'left-leg',[.4,-1.7,.06],.8,d,system,layer);
extendAnatomy(anatomy);
addMuscles(anatomy);
extendSchoolAnatomy(anatomy);
export const roots = ['head','chest','abdomen','pelvis','arms','legs','spine'];
export function getAncestors(id: string): AnatomyNode[] { const result: AnatomyNode[] = []; const seen = new Set<string>(); let n=anatomy[id]; while(n && !seen.has(n.id)){result.unshift(n);seen.add(n.id);n=anatomy[n.parent??''];} return result; }
export function isWithin(id: string, ancestor: string): boolean { return getAncestors(id).some(n=>n.id===ancestor); }
export function searchAnatomy(query: string) { const q=query.toLowerCase().trim(); return Object.values(anatomy).filter(n=>!q||q.split(/\s+/).every(token=>`${n.name} ${n.scientificName} ${n.system} ${n.id} ${n.side??''}`.toLowerCase().includes(token))).sort((a,b)=>(a.name.toLowerCase()===q?-1:0)-(b.name.toLowerCase()===q?-1:0)).slice(0,16); }
