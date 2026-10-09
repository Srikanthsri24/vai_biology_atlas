import { laboratoryCatalog, type LabEngine } from './labCatalog';
export type LabId=LabEngine;
export type LabInputs={light:number;co2:number;temperature:number;inside:number;outside:number;ph:number;substrate:number;enzyme:number;parentA:'AA'|'Aa'|'aa';parentB:'AA'|'Aa'|'aa';magnification:number;focus:number;stain:number;solvent:number;duration:number;water:number;oxygen:number;wind:number;humidity:number;fragment:number;voltage:number;density:number;species:number;effort:number};
export const defaultLabInputs:LabInputs={light:70,co2:70,temperature:25,inside:50,outside:50,ph:7,substrate:60,enzyme:70,parentA:'Aa',parentB:'Aa',magnification:100,focus:50,stain:60,solvent:60,duration:10,water:70,oxygen:80,wind:30,humidity:50,fragment:1000,voltage:70,density:40,species:4,effort:5};
export const virtualLabs=laboratoryCatalog;
const bounded=(value:number,min:number,max:number)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):min;
export function crossGenotypes(a:LabInputs['parentA'],b:LabInputs['parentB']){
 const valid=['AA','Aa','aa'];if(!valid.includes(a)||!valid.includes(b))throw new Error('Unsupported genotype');
 const cells=[...a].flatMap(first=>[...b].map(second=>[first,second].sort().join('')));
 const counts={AA:0,Aa:0,aa:0};for(const cell of cells)counts[cell as keyof typeof counts]++;
 return {cells,counts,dominant:(counts.AA+counts.Aa)/4,recessive:counts.aa/4};
}
export function labResponse(id:LabId,inputs:LabInputs){
 if(id==='microscopy'){const focus=1-Math.abs(bounded(inputs.focus,0,100)-50)/50;return {value:100*focus*(.35+.65*bounded(inputs.stain,0,100)/100),unit:'relative image clarity / 100',summary:`Field width decreases as magnification rises. Clarity depends on focus and contrast in this teaching view.`,scale:1};}
 if(id==='chromatography'){const rf=.2+.6*bounded(inputs.solvent,0,100)/100;return {value:rf*100,unit:'model band Rf × 100',summary:`The reference band has illustrative Rf ${rf.toFixed(2)}. Band and solvent-front distances must both be recorded.`,scale:1};}
 if(id==='diffusion'){const value=Math.min(100,Math.sqrt(bounded(inputs.duration,0,60)/60)*(.3+.7*bounded(inputs.temperature,0,80)/80)*100);return {value,unit:'relative spread / 100',summary:'Spread grows with time in this diffusion-only rule. Stirring and convection are not represented.',scale:1};}
 if(id==='germination'){const value=100*(bounded(inputs.water,0,100)/100)*Math.exp(-(((bounded(inputs.temperature,0,80)-25)/18)**2))*Math.min(1,bounded(inputs.duration,0,60)/20);return {value,unit:'relative growth / 100',summary:'Growth is a bounded teaching index, not measured seedling length. Water and temperature affect the model.',scale:1};}
 if(id==='respiration'){const value=100*bounded(inputs.substrate,0,100)/(bounded(inputs.substrate,0,100)+20)*bounded(inputs.oxygen,0,100)/100*Math.exp(-(((bounded(inputs.temperature,0,80)-30)/20)**2));return {value,unit:'relative aerobic response / 100',summary:'This aerobic model depends on oxygen, substrate and temperature. Anaerobic fermentation is not simulated.',scale:1};}
 if(id==='transpiration'){const value=Math.min(100,(1-bounded(inputs.humidity,0,100)/100)*(.3+.7*bounded(inputs.light,0,100)/100)*(1+bounded(inputs.wind,0,100)/100)*75);return {value,unit:'relative water uptake / 100',summary:'The potometer bubble illustrates uptake. This rule omits stomatal regulation, storage changes and species differences.',scale:1};}
 if(id==='water-quality'){const value=bounded(inputs.ph,0,14);return {value,unit:'model sample pH',summary:'This is the pH setting of a simulated sample. Indicator colour alone cannot establish overall water quality.',scale:1};}
 if(id==='electrophoresis'){const value=Math.min(100,100*bounded(inputs.voltage,0,120)/120*bounded(inputs.duration,0,60)/60/(1+Math.log10(Math.max(100,bounded(inputs.fragment,100,5000))/100)));return {value,unit:'relative migration / 100',summary:'Migration follows a qualitative fragment-size rule. Real gels need a calibrated ladder and controlled gel composition.',scale:1};}
 if(id==='ecology'){const richness=Math.round(bounded(inputs.species,1,8));return {value:Math.log(richness),unit:'idealized Shannon diversity',summary:`${richness} equally abundant model species; density ${Math.round(bounded(inputs.density,0,100))}%. This idealized community is not a field survey.`,scale:1};}

 if(id==='inheritance'){const cross=crossGenotypes(inputs.parentA,inputs.parentB);return {value:cross.dominant*100,unit:'% dominant phenotype',summary:`Expected AA ${cross.counts.AA*25}%, Aa ${cross.counts.Aa*25}%, aa ${cross.counts.aa*25}%.`,scale:1};}
 if(id==='osmosis'){const difference=bounded(inputs.inside,0,100)-bounded(inputs.outside,0,100);const scale=1+.3*Math.tanh(difference/40);return {value:scale*100,unit:'% relative cell-content volume',summary:difference===0?'No net water movement in this equal-solute model.':difference>0?'Water tends to enter the cell; the wall limits expansion.':'Water tends to leave the cell; the contents shrink away from the wall.',scale};}
 if(id==='photosynthesis'){const value=100*Math.min(bounded(inputs.light,0,100)/100,bounded(inputs.co2,0,100)/100)*Math.exp(-(((bounded(inputs.temperature,0,80)-25)/18)**2));return {value,unit:'relative response / 100',summary:'Compare trials with one variable changed. The temperature response peaks at an assumed 25°C.',scale:1};}
 const value=100*(bounded(inputs.enzyme,0,100)/100)*(bounded(inputs.substrate,0,100)/(bounded(inputs.substrate,0,100)+20))*Math.exp(-(((bounded(inputs.temperature,0,80)-37)/18)**2))*Math.exp(-(((bounded(inputs.ph,0,14)-7)/2.2)**2));
 return {value,unit:'relative activity / 100',summary:'Activity depends on all four inputs in this hypothetical model. Compare controlled trials rather than interpreting this as a measured reaction.',scale:1};
}
