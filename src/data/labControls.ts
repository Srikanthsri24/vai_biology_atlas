import type { LabEngine } from './labCatalog';
import type { LabInputs } from './virtualLabs';
export type LabControl={key:keyof LabInputs;label:string;min:number;max:number;unit?:string};
const c=(key:LabControl['key'],label:string,min=0,max=100,unit='%'):LabControl=>({key,label,min,max,unit});
export const labControls:Record<LabEngine,LabControl[]>={
 photosynthesis:[c('light','Light availability'),c('co2','Carbon dioxide availability'),c('temperature','Temperature',0,50,'°C')],
 osmosis:[c('inside','Internal solute',0,100,' relative units'),c('outside','External solute',0,100,' relative units')],
 enzymes:[c('temperature','Temperature',0,80,'°C'),c('ph','pH',0,14,''),c('substrate','Substrate availability'),c('enzyme','Enzyme amount')],
 inheritance:[],microscopy:[c('magnification','Magnification',40,400,'×'),c('focus','Focus position'),c('stain','Stain contrast')],
 chromatography:[c('solvent','Solvent setting'),c('duration','Duration',0,60,' relative time units')],
 diffusion:[c('temperature','Temperature',0,80,'°C'),c('duration','Duration',0,60,' relative time units'),c('substrate','Sample concentration')],
 germination:[c('water','Water availability'),c('temperature','Temperature',0,50,'°C'),c('duration','Growth interval',0,60,' relative time units')],
 respiration:[c('substrate','Substrate availability'),c('temperature','Temperature',0,60,'°C'),c('oxygen','Oxygen availability'),c('duration','Duration',0,60,' relative time units')],
 transpiration:[c('humidity','Humidity'),c('wind','Air movement'),c('light','Light availability'),c('duration','Duration',0,60,' relative time units')],
 'water-quality':[c('ph','Sample pH',0,14,''),c('substrate','Indicator concentration')],
 electrophoresis:[c('fragment','Fragment size',100,5000,' bp'),c('voltage','Voltage',0,120,' V'),c('duration','Run duration',0,60,' relative time units'),c('substrate','Sample concentration')],
 ecology:[c('species','Species richness',1,8,' species'),c('density','Population density'),c('effort','Sampling effort',1,10,' quadrats')]
};
export const responseMaximum=(engine:LabEngine)=>engine==='osmosis'?150:engine==='water-quality'?14:engine==='ecology'?Math.log(8):100;
