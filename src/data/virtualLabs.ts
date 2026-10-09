export type LabId='photosynthesis'|'osmosis'|'enzymes'|'inheritance';
export type LabInputs={light:number;co2:number;temperature:number;inside:number;outside:number;ph:number;substrate:number;enzyme:number;parentA:'AA'|'Aa'|'aa';parentB:'AA'|'Aa'|'aa'};
export const defaultLabInputs:LabInputs={light:70,co2:70,temperature:25,inside:50,outside:50,ph:7,substrate:60,enzyme:70,parentA:'Aa',parentB:'Aa'};
export const virtualLabs=[
 {id:'photosynthesis' as const,title:'Photosynthesis response',classes:[7,8,9,10,11,12],scene:'plant' as const,description:'Change light, carbon dioxide and temperature. Compare relative responses while controlling other variables.',limits:'An illustrative response model, not measured oxygen production. It omits water limitation, species differences and many interacting processes.'},
 {id:'osmosis' as const,title:'Osmosis and cell volume',classes:[8,9,10,11,12],scene:'plant-cell' as const,description:'Compare internal and external solute settings. Observe predicted water direction and bounded cell-content volume.',limits:'Assumes a membrane permeable to water and impermeable to the model solute. Relative units are not osmolarity; pressure and solute transport are omitted.'},
 {id:'enzymes' as const,title:'Enzyme activity',classes:[10,11,12],scene:'animal-cell' as const,description:'Investigate temperature, pH, substrate availability and enzyme amount using a hypothetical enzyme.',limits:'The teaching enzyme has an assumed optimum of 37°C and pH 7. Responses are illustrative; irreversible denaturation and real enzyme kinetics are not simulated.'},
 {id:'inheritance' as const,title:'Monohybrid inheritance',classes:[9,10,11,12],scene:'dna' as const,description:'Choose parental genotypes and inspect all four equally likely allele combinations.',limits:'A single autosomal locus with complete dominance, equal gamete probabilities and no viability differences. Expected probabilities are not a prediction of an individual child.'}
];
const bounded=(value:number,min:number,max:number)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):min;
export function crossGenotypes(a:LabInputs['parentA'],b:LabInputs['parentB']){
 const valid=['AA','Aa','aa'];if(!valid.includes(a)||!valid.includes(b))throw new Error('Unsupported genotype');
 const cells=[...a].flatMap(first=>[...b].map(second=>[first,second].sort().join('')));
 const counts={AA:0,Aa:0,aa:0};for(const cell of cells)counts[cell as keyof typeof counts]++;
 return {cells,counts,dominant:(counts.AA+counts.Aa)/4,recessive:counts.aa/4};
}
export function labResponse(id:LabId,inputs:LabInputs){
 if(id==='inheritance'){const cross=crossGenotypes(inputs.parentA,inputs.parentB);return {value:cross.dominant*100,unit:'% dominant phenotype',summary:`Expected AA ${cross.counts.AA*25}%, Aa ${cross.counts.Aa*25}%, aa ${cross.counts.aa*25}%.`,scale:1};}
 if(id==='osmosis'){const difference=bounded(inputs.inside,0,100)-bounded(inputs.outside,0,100);const scale=1+.3*Math.tanh(difference/40);return {value:scale*100,unit:'% relative cell-content volume',summary:difference===0?'No net water movement in this equal-solute model.':difference>0?'Water tends to enter the cell; the wall limits expansion.':'Water tends to leave the cell; the contents shrink away from the wall.',scale};}
 if(id==='photosynthesis'){const value=100*Math.min(bounded(inputs.light,0,100)/100,bounded(inputs.co2,0,100)/100)*Math.exp(-(((bounded(inputs.temperature,0,80)-25)/18)**2));return {value,unit:'relative response / 100',summary:'Compare trials with one variable changed. The temperature response peaks at an assumed 25°C.',scale:1};}
 const value=100*(bounded(inputs.enzyme,0,100)/100)*(bounded(inputs.substrate,0,100)/(bounded(inputs.substrate,0,100)+20))*Math.exp(-(((bounded(inputs.temperature,0,80)-37)/18)**2))*Math.exp(-(((bounded(inputs.ph,0,14)-7)/2.2)**2));
 return {value,unit:'relative activity / 100',summary:'Activity depends on all four inputs in this hypothetical model. Compare controlled trials rather than interpreting this as a measured reaction.',scale:1};
}
