import { useEffect, useState } from 'react';
import { getJourneyTopic } from '../data/journeyLibrary';

type Progress={saved:string[];completed:string[]};
const key='human-atlas-journey-progress-v1';
function restore():Progress{
 try{const value=JSON.parse(localStorage.getItem(key)??'{}');const valid=(items:unknown)=>Array.isArray(items)?[...new Set(items.filter((id):id is string=>typeof id==='string'&&!!getJourneyTopic(id)))]:[];return {saved:valid(value.saved),completed:valid(value.completed)};}catch{return {saved:[],completed:[]};}
}
export function useJourneyProgress(){
 const [progress,setProgress]=useState<Progress>(restore);
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(progress));}catch{/* Browsing remains available when storage is disabled. */}},[progress]);
 function toggle(kind:keyof Progress,id:string){if(!getJourneyTopic(id))return;setProgress(previous=>({...previous,[kind]:previous[kind].includes(id)?previous[kind].filter(item=>item!==id):[...previous[kind],id]}));}
 return {...progress,toggle};
}
