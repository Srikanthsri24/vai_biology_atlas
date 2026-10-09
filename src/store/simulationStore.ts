import { create } from 'zustand';
import { simulationById, type SimulationId } from '../data/simulations';
export const simulationClock={phase:0};
type SimulationState={id:SimulationId|null;playing:boolean;speed:number;phase:number;markers:boolean;start:(id:SimulationId)=>void;stop:()=>void;seek:(phase:number)=>void;setSpeed:(speed:number)=>void;toggle:()=>void};
export const useSimulationStore=create<SimulationState>((set,get)=>({id:null,playing:false,speed:1,phase:0,markers:true,
 start:id=>{if(!simulationById(id))return;simulationClock.phase=0;set({id,phase:0,playing:false,speed:1});},
 stop:()=>{simulationClock.phase=0;set({id:null,playing:false,phase:0});},
 seek:phase=>{const value=Number.isFinite(phase)?Math.max(0,Math.min(.9999,phase)):0;simulationClock.phase=value;set({phase:value,playing:false});},
 setSpeed:speed=>set({speed:Number.isFinite(speed)?Math.max(.25,Math.min(2,speed)):1}),
 toggle:()=>set({playing:!get().playing})
}));
