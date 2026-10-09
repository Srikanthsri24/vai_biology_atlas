import { useState } from 'react';
import { journeyRoutes, studyFor } from '../../data/journeyCatalog';
import { journeyLesson, type JourneyPath } from '../../data/journey';

export function expandedLesson(level:number,path:JourneyPath,study:string){
 const base=journeyLesson(level,path),route=journeyRoutes[path],lab=studyFor(level,study);
 if(lab){const clarification=level===3&&lab.id==='transport'?(path==='blood'?' The circulation route uses a vessel-wall cell, not a mature red blood cell, which lacks a nucleus.':path==='muscle'?' This is a comparison cell; skeletal muscle fibres have multiple peripheral nuclei.':''):'';return {...base,...lab,description:lab.description+clarification,process:lab.name};}
 if(level===0)return {...base,description:`Start with the complete body, then follow ${route.name.toLowerCase()} from organ to microscopic structures. Choose among six routes or move freely between scales.`};
 if(level===1)return {...base,title:`Explore ${route.organ.toLowerCase()}`,description:`${route.summary}. Inspect the anatomy before moving into the route’s functional tissue assembly.`,steps:route.steps,process:route.name};
 return {...base,title:route.tissueTitle,description:route.tissueDescription,steps:route.steps,process:route.name};
}
export default function JourneyKnowledgeCheck({path}:{path:JourneyPath}){
 const route=journeyRoutes[path],[answer,setAnswer]=useState<number>();
 return <section className="journey-check" aria-label="Knowledge check"><div className="eyebrow">CHECK YOUR UNDERSTANDING</div><h3>{route.question}</h3><div>{route.choices.map((choice,i)=><button key={choice} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{choice}</button>)}</div>{answer!==undefined&&<p role="status"><strong>{answer===route.answer?'Correct.':'Try again.'}</strong> {answer===route.answer?route.explanation:'Review the process steps and choose the best answer.'}</p>}</section>;
}
