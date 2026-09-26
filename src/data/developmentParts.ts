import { createParts, type Part } from './proceduralParts';
import { muscleCatalog } from './muscleCatalog';
import { anatomy } from './anatomyTree';

/** Test geometry only. Positions are schematic metadata anchors, not anatomical surfaces. */
export function createDevelopmentParts(): Part[] {
  const parts = createParts().filter(p => p.layer !== 'muscles' && anatomy[p.id]);
  for (const m of muscleCatalog) for (const side of ['left', 'right'] as const) {
    parts.push({key:`dev-${m.slug}-${side}`,id:`${m.slug}-${side}`,layer:'muscles',position:[m.position[0]*(side==='left'?1:-1),m.position[1],m.position[2]],scale:m.size,color:m.depth==='deep'?'#854f47':m.depth==='intermediate'?'#995b50':'#ad7164',shape:'sphere'});
  }
  const represented = new Set(parts.map(p => p.id));
  const colors = { organs:'#b57b7c', skeleton:'#e6dfcb', nervous:'#d8b879', lymphatic:'#91a777', arteries:'#aa5655', veins:'#6084a0', skin:'#b9c9c6' };
  for (const n of Object.values(anatomy)) {
    if (represented.has(n.id) || n.children.length || n.type==='region' || n.type==='system' || n.type==='muscle' || n.type==='micro') continue;
    // Small markers make catalog entries selectable while awaiting authored medical geometry.
    const bone=n.type==='bone',vessel=n.type==='vessel'||n.type==='nerve';
    parts.push({key:`dev-marker-${n.id}`,id:n.id,layer:n.layer as Part['layer'],position:n.cameraTarget,scale:bone?[.055,.075,.045]:vessel?[.025,.18,.025]:[.085,.065,.055],color:colors[n.layer as keyof typeof colors]??'#b57b7c',shape:'sphere'});
  }
  const add=(id:string,position:Part['position'],scale:Part['scale'],color:string)=>parts.push({key:`micro-${id}`,id,position,scale,color,shape:'sphere',layer:anatomy[id].layer as Part['layer']});
  add('cell-body',[0,0,0],[.3,.3,.2],'#b19aab');add('nucleus',[0,0,.18],[.1,.1,.07],'#836a8b');
  for(let i=0;i<5;i++)parts.push({key:`micro-dendrite-${i}`,id:'dendrites',position:[0,0,0],scale:[1,1,1],color:'#b19aab',layer:'nervous',shape:'tube',points:[[0,0,0],[-.4,(i-2)*.13,0],[-.8,(i-2)*.3,0]],radius:.025});
  parts.push({key:'micro-axon',id:'axon',position:[0,0,0],scale:[1,1,1],color:'#ad9b74',layer:'nervous',shape:'tube',points:[[.2,0,0],[1,0,0],[1.8,0,0]],radius:.035});
  for(let i=0;i<5;i++)parts.push({key:`micro-myelin-${i}`,id:'myelin',position:[0,0,0],scale:[1,1,1],color:'#dcc793',layer:'nervous',shape:'tube',points:[[.4+i*.25,0,0],[.57+i*.25,0,0]],radius:.065});
  add('axon-terminals',[1.85,0,0],[.16,.16,.1],'#a790aa');add('synapse',[2.1,0,0],[.025,.13,.1],'#bfa9bf');
  add('alveolus',[0,0,0],[.7,.6,.5],'#c99599');add('capillary',[0,0,0],[.12,.7,.12],'#b87578');add('nephron',[0,0,0],[.4,.5,.25],'#bca78b');
  return parts;
}
