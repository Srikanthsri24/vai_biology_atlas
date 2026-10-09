import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Box, X } from 'lucide-react';
import { anatomyModels, modelRoute } from '../../data/modelRegistry';
import ModelPreview from './ModelPreview';

/** A single preview keeps the expanded gallery within browser WebGL limits. */
export default function AtlasModules() {
 const [preview, setPreview] = useState<string|null>(null);
 return <section aria-label="Atlas modules" className="library-modules">
  <p className="module-guide">30 anatomy modules · choose Preview for interactive 3D, or open a study.</p>
  <div className="library-models">{Object.values(anatomyModels).filter(m=>!m.systemId).map(m=><article key={m.id} className="atlas-module">
   <div className="module-preview">{preview===m.id?<><ModelPreview model={m.id}/><button className="module-close" aria-label={`Close ${m.name} preview`} onClick={()=>setPreview(null)}><X size={14}/></button></>:<button className="module-open" aria-label={`Preview ${m.name} in 3D`} onClick={()=>setPreview(m.id)}><Box size={32} strokeWidth={1}/><span>Preview in 3D</span></button>}</div>
   <Link to={modelRoute(m)}><strong>{m.name}</strong><ArrowUpRight size={15}/></Link>
  </article>)}</div>
 </section>;
}
