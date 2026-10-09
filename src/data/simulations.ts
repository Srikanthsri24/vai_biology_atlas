export type SimulationId = 'heartbeat' | 'breathing' | 'filtration' | 'digestion' | 'neural' | 'contraction' | 'circulation' | 'urination' | 'bile' | 'pancreatic' | 'ovarian' | 'tubal';
export type Simulation = {id:SimulationId; model:string; title:string; subtitle:string; route:string; focus:string; duration:number; color:string; stages:{title:string;text:string}[]; routeIds:string[]; legend:string; limitation:string; source:string};
const source=(chapter:string)=>`https://openstax.org/books/anatomy-and-physiology-2e/pages/${chapter}`;
export const simulations:Simulation[]=[
 {id:'heartbeat',model:'heart',title:'The beating heart',subtitle:'A coordinated cycle of filling and ejection',route:'/atlas/heart',focus:'heart',duration:4,color:'#c46c77',routeIds:['right-atrium','right-ventricle','pulmonary-artery','pulmonary-veins','left-atrium','left-ventricle','aorta'],legend:'Moving markers trace a simplified flow sequence; chamber motion illustrates contraction.',limitation:'Slowed teaching cycle. Valve mechanics, pressures and fluid dynamics are not calculated.',source:source('19-3-cardiac-cycle'),stages:[{title:'Ventricular filling',text:'Relaxed ventricles receive blood through the open atrioventricular valves.'},{title:'Atrial contraction',text:'The atria contract and add the final portion of ventricular filling.'},{title:'Ventricular ejection',text:'Ventricular pressure rises. Atrioventricular valves close; semilunar valves open when ventricular pressure exceeds arterial pressure.'},{title:'Relaxation',text:'Ventricles relax. Semilunar valves close, and filling resumes after ventricular pressure falls sufficiently.'}]},
 {id:'breathing',model:'lungs',title:'A breath in motion',subtitle:'Volume changes create pressure gradients',route:'/systems/respiratory/lungs',focus:'lungs',duration:6,color:'#65a8bb',routeIds:['trachea','bronchi','left-lung'],legend:'Cyan markers show air entering during inspiration and leaving during expiration.',limitation:'Expansion is exaggerated for visibility. No gas concentrations, pressures or tidal volumes are calculated.',source:source('22-3-the-process-of-breathing'),stages:[{title:'Inspiration begins',text:'The diaphragm contracts and moves downward, increasing the space inside the thorax.'},{title:'Lungs expand',text:'Thoracic expansion lowers alveolar pressure below atmospheric pressure, drawing air inward.'},{title:'Passive expiration',text:'The diaphragm relaxes and elastic recoil reduces lung volume, moving air outward.'},{title:'Return to resting volume',text:'Airflow slows as the pressure difference falls. The lungs retain air between quiet breaths.'}]},
 {id:'filtration',model:'kidneys',title:'From blood to urine',subtitle:'Follow a nephron’s processing sequence',route:'/atlas/kidneys',focus:'kidneys',duration:12,color:'#c6a168',routeIds:['kidneys'],legend:'Gold markers show a conceptual processing loop within the kidney, not an anatomical tubule.',limitation:'The kidney asset does not contain authored nephron microanatomy. This overlay is a process diagram; reabsorption and secretion occur together along tubules.',source:source('25-5-physiology-of-urine-formation'),stages:[{title:'Glomerular filtration',text:'Pressure drives water and small solutes from glomerular blood into the capsule. Blood cells and most proteins remain in circulation.'},{title:'Tubular reabsorption',text:'Tubule cells return useful solutes and much of the filtered water to the blood.'},{title:'Tubular secretion',text:'Selected substances move from blood into tubular fluid, contributing to waste removal and chemical balance.'},{title:'Urine leaves the kidney',text:'Processed tubular fluid passes through collecting ducts toward the renal pelvis and ureter.'}]},
 {id:'digestion',model:'stomach',title:'The journey of a meal',subtitle:'Propulsion, mixing and absorption',route:'/systems/digestive/stomach',focus:'stomach',duration:16,color:'#c69359',routeIds:['esophagus','stomach','small-intestine','large-intestine','rectum'],legend:'Amber markers indicate the direction of luminal contents. Local squeezing represents peristalsis.',limitation:'Transit is greatly accelerated. Markers connect organ centres, not an authored lumen; digestive chemistry is explained rather than simulated.',source:source('23-2-digestive-system-processes-and-regulation'),stages:[{title:'Propulsion',text:'Coordinated muscular waves move swallowed material along the esophagus.'},{title:'Mixing',text:'The stomach combines food with gastric secretions and gradually releases chyme into the small intestine.'},{title:'Digestion and absorption',text:'Most nutrient absorption occurs in the small intestine after mechanical and chemical digestion.'},{title:'Water recovery',text:'The large intestine absorbs remaining water and electrolytes and helps form stool.'}]},
 {id:'neural',model:'neuron',title:'An impulse travels',subtitle:'Electrical signalling along a neuron',route:'/atlas/neuron',focus:'neuron',duration:8,color:'#b2a268',routeIds:['cell-body','axon','axon-terminals','synapse'],legend:'Gold markers indicate a travelling signal, not individual ions or particles moving down the entire axon.',limitation:'Greatly slowed conceptual signal. Membrane voltage, channels and synaptic chemistry are not numerically simulated.',source:source('12-4-the-action-potential'),stages:[{title:'Threshold reached',text:'Sufficient depolarization at the trigger zone initiates an action potential.'},{title:'Depolarization',text:'Voltage-gated sodium channels open, allowing sodium into the axon and depolarizing the membrane.'},{title:'Propagation and recovery',text:'Local currents excite the next region. Potassium efflux contributes to repolarization behind the travelling wave.'},{title:'Communication',text:'At a chemical synapse, terminal depolarization triggers calcium entry and neurotransmitter release.'}]},
 {id:'contraction',model:'muscular-body',title:'Muscle in action',subtitle:'From activation to shortening',route:'/systems/muscular/biceps-brachii-left',focus:'biceps-brachii-left',duration:6,color:'#b76661',routeIds:['biceps-brachii-left'],legend:'The highlighted muscle shortens and thickens along an illustrative axis.',limitation:'Conceptual deformation, not a rigged elbow or biomechanical solver. Attachments and joint motion require an authored rig.',source:source('10-3-muscle-fiber-contraction-and-relaxation'),stages:[{title:'Activation',text:'A muscle action potential leads to calcium release from the sarcoplasmic reticulum.'},{title:'Cross-bridge formation',text:'Calcium exposes binding sites on actin, allowing myosin to form cross-bridges.'},{title:'Shortening',text:'Repeated ATP-dependent cross-bridge cycles slide filaments past one another, shortening sarcomeres.'},{title:'Relaxation',text:'Calcium is returned to storage. Binding sites become covered and active tension declines.'}]},
 {id:'circulation',model:'cardiovascular-system',title:'One connected circuit',subtitle:'Pulmonary and systemic circulation',route:'/systems/cardiovascular/heart',focus:'heart',duration:14,color:'#b96673',routeIds:['right-atrium','right-ventricle','pulmonary-artery','left-lung','pulmonary-veins','left-atrium','left-ventricle','aorta','arteries','veins'],legend:'Blue indicates relatively oxygen-poor blood; red indicates relatively oxygen-rich blood. Blood is never actually blue.',limitation:'The route is a conceptual centre-to-centre overlay, not a vascular flow solver. Lung exchange is explained in the stages; only available mesh waypoints are drawn.',source:source('20-2-blood-flow-blood-pressure-and-resistance'),stages:[{title:'Return to the right heart',text:'Systemic veins return relatively oxygen-poor blood to the right atrium and then the right ventricle.'},{title:'Pulmonary circulation',text:'The right ventricle sends blood through pulmonary arteries to the lungs for gas exchange.'},{title:'Return to the left heart',text:'Pulmonary veins return oxygen-rich blood to the left atrium and then the left ventricle.'},{title:'Systemic delivery',text:'The left ventricle pumps into the aorta. Systemic vessels distribute blood to tissues and return it to the heart.'}]} ,
{
 "id": "urination",
 "model": "bladder",
 "title": "The bladder at work",
 "subtitle": "Storage, signalling and coordinated emptying",
 "route": "/systems/urinary/bladder",
 "focus": "bladder",
 "duration": 12,
 "color": "#c49c62",
 "routeIds": [
  "ureters",
  "bladder",
  "urethra"
 ],
 "legend": "Markers trace a simplified urine pathway. Bladder size illustrates filling and emptying.",
 "limitation": "Schematic anatomy and exaggerated volume change. Sphincters, nerve feedback and pressure are explained rather than calculated.",
 "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-2-gross-anatomy-of-urine-transport",
 "stages": [
  {
   "title": "Storage",
   "text": "Urine arriving through the ureters collects in the bladder while its wall accommodates the increasing volume."
  },
  {
   "title": "Sensation",
   "text": "Stretch receptors signal bladder filling to the nervous system."
  },
  {
   "title": "Coordinated voiding",
   "text": "Detrusor contraction and relaxation of the urethral outlet allow urine to leave."
  },
  {
   "title": "Return to storage",
   "text": "The bladder relaxes and the outlet closes as storage resumes."
  }
 ]
},
{
 "id": "bile",
 "model": "gallbladder",
 "title": "Liver, bile and digestion",
 "subtitle": "From bile production to fat emulsification",
 "route": "/systems/digestive/gallbladder",
 "focus": "gallbladder",
 "duration": 12,
 "color": "#b1a34f",
 "routeIds": [
  "liver",
  "gallbladder",
  "small-intestine"
 ],
 "legend": "Gold markers connect the liver, gallbladder and intestine. The gallbladder gently contracts during release.",
 "limitation": "The overlay connects organ centres, not bile ducts. Bile can also pass directly from liver to intestine; production and storage overlap.",
 "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder",
 "stages": [
  {
   "title": "Production",
   "text": "Liver cells produce bile, including bile salts that assist fat digestion."
  },
  {
   "title": "Storage",
   "text": "The gallbladder stores and concentrates bile between meals."
  },
  {
   "title": "Release",
   "text": "After a meal, signals including cholecystokinin promote gallbladder contraction and bile delivery to the duodenum."
  },
  {
   "title": "Emulsification",
   "text": "Bile salts disperse fat into smaller droplets, helping digestive enzymes act on it."
  }
 ]
},
{
 "id": "pancreatic",
 "model": "pancreas",
 "title": "The pancreas in digestion",
 "subtitle": "Enzymes and bicarbonate support the intestine",
 "route": "/systems/digestive/pancreas",
 "focus": "pancreas",
 "duration": 12,
 "color": "#d3a378",
 "routeIds": [
  "pancreas",
  "small-intestine"
 ],
 "legend": "Moving markers indicate pancreatic secretions reaching the small intestine.",
 "limitation": "A centre-to-centre process overlay, not a pancreatic duct simulation. This lesson covers exocrine secretion, not insulin or glucose control.",
 "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder",
 "stages": [
  {
   "title": "Meal signals",
   "text": "Chyme entering the duodenum stimulates intestinal signals that regulate pancreatic secretion."
  },
  {
   "title": "Enzyme secretion",
   "text": "Acinar cells release digestive enzymes and inactive precursors into the duct system."
  },
  {
   "title": "Acid neutralization",
   "text": "Bicarbonate-rich fluid helps neutralize acidic chyme in the duodenum."
  },
  {
   "title": "Nutrient breakdown",
   "text": "Pancreatic enzymes help break down proteins, fats and carbohydrates for absorption."
  }
 ]
},
{
 "id": "ovarian",
 "model": "female-reproductive",
 "title": "The ovarian cycle",
 "subtitle": "Follicle development, ovulation and hormone production",
 "route": "/systems/female-reproductive/ovaries",
 "focus": "ovaries",
 "duration": 16,
 "color": "#b97899",
 "routeIds": [
  "ovaries"
 ],
 "legend": "A pulsing ring locates the ovary while the four stages explain its changing activity. It does not depict follicles or an egg.",
 "limitation": "Schematic female anatomy. Equal teaching stages are not equal biological durations. Cycle timing varies; this is not a fertility predictor or hormone model.",
 "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-female-reproductive-system",
 "stages": [
  {
   "title": "Follicular development",
   "text": "FSH supports follicle development in the ovary. Developing follicles produce estrogen."
  },
  {
   "title": "Ovulation",
   "text": "An LH surge triggers release of an oocyte from the mature follicle."
  },
  {
   "title": "Luteal activity",
   "text": "Remaining follicular tissue forms the corpus luteum, which secretes progesterone and estrogen."
  },
  {
   "title": "Cycle renewal",
   "text": "Without pregnancy, the corpus luteum regresses and hormone levels fall, contributing to menstruation."
  }
 ]
},
{
 "id": "tubal",
 "model": "female-reproductive",
 "title": "Through the uterine tube",
 "subtitle": "Explore the connection between ovary and uterus",
 "route": "/systems/female-reproductive/uterine-tubes",
 "focus": "female-reproductive-anatomy",
 "duration": 14,
 "color": "#ad7b99",
 "routeIds": [
  "ovaries",
  "uterine-tubes",
  "uterus"
 ],
 "legend": "Markers follow a conceptual ovary-to-uterus route. They do not represent a stream of eggs.",
 "limitation": "Schematic female anatomy. Organ-centre connections are not a tubal lumen. Fertilization is possible, not assumed; this does not simulate pregnancy.",
 "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-female-reproductive-system",
 "stages": [
  {
   "title": "Release",
   "text": "Ovulation releases an oocyte near the open end of the uterine tube."
  },
  {
   "title": "Collection",
   "text": "Fimbriae and ciliary movement help direct the oocyte into the tube."
  },
  {
   "title": "Tubal transport",
   "text": "Cilia and smooth muscle activity assist transport. Fertilization most often occurs in the ampulla if sperm are present."
  },
  {
   "title": "Toward the uterus",
   "text": "The tube opens into the uterine cavity. Transport does not by itself imply fertilization or implantation."
  }
 ]
}
];
export const simulationById=(id:string|null)=>simulations.find(s=>s.id===id);
export const phaseIndex=(phase:number)=>Math.min(3,Math.floor(Math.max(0,Math.min(.999999,phase))*4));
export function motionScale(id:SimulationId,meshId:string,phase:number):[number,number,number]{
 const pulse=Math.sin(Math.PI*2*phase),breath=(1-Math.cos(Math.PI*2*phase))/2;
 if(id==='heartbeat'||id==='circulation'){
  const atrium=meshId.includes('atrium'),ventricle=meshId.includes('ventricle')||meshId==='heart';
  const contraction=atrium?Math.max(0,1-Math.abs(phase-.375)/.12):ventricle?Math.max(0,1-Math.abs(phase-.65)/.17):0;
  return [1-contraction*.11,1-contraction*.07,1-contraction*.11];
 }
 if(id==='breathing'&&meshId.includes('lung'))return [1+breath*.09,1+breath*.13,1+breath*.09];
 if(id==='breathing'&&meshId==='diaphragm')return [1,1-breath*.18,1];
 if(id==='contraction'&&(meshId==='biceps-brachii-left'||meshId.startsWith('real-')&&meshId.includes('left-biceps-brachii')))return [1+breath*.12,1-breath*.2,1+breath*.12];
 if(id==='digestion'&&['esophagus','stomach','small-intestine','large-intestine'].includes(meshId))return [1+pulse*.035,1-pulse*.035,1+pulse*.035];
 if(id==='urination'&&meshId==='bladder'){const fill=phase<.5?phase*2:phase<.75?1-(phase-.5)*4:0;return [1+fill*.16,1+fill*.18,1+fill*.16];}
 if(id==='bile'&&meshId==='gallbladder'){const squeeze=Math.max(0,1-Math.abs(phase-.625)/.125);return [1-squeeze*.12,1-squeeze*.08,1-squeeze*.12];}
 return [1,1,1];
}
