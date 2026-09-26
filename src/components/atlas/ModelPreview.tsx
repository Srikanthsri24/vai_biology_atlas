import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ModelId } from '../../data/types';
const AnatomyViewer=lazy(()=>import('./AnatomyViewer'));
export default function ModelPreview({model,animated=false}:{model:ModelId;animated?:boolean}){const ref=useRef<HTMLDivElement>(null);const drag=useRef([0,0]);const [visible,setVisible]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return <div ref={ref} className="model-preview" onPointerDown={e=>{drag.current=[e.clientX,e.clientY];}} onClickCapture={e=>{if(Math.hypot(e.clientX-drag.current[0],e.clientY-drag.current[1])>4){e.preventDefault();e.stopPropagation();}}}>{visible&&<Suspense fallback={<div className="preview-skeleton"/>}><AnatomyViewer model={model} preview animated={animated}/></Suspense>}</div>}

