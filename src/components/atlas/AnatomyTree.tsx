import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Circle, Eye, EyeOff } from 'lucide-react';
import { anatomy, getAncestors } from '../../data/anatomyTree';
import { useAtlasStore } from '../../store/atlasStore';
import { belongsToSystem } from '../../utils/visibility';
export default function AnatomyTree({root}:{root:string}){
 const filter=useAtlasStore(s=>s.systemFilter);
 function relevant(id:string):boolean{return !filter||belongsToSystem(id,filter,anatomy[id]?.layer)||anatomy[id]?.children.some(relevant);}
 const selected=useAtlasStore(s=>s.selectedId);const hidden=useAtlasStore(s=>s.hiddenIds);const select=useAtlasStore(s=>s.select);const hide=useAtlasStore(s=>s.hide);const [expanded,setExpanded]=useState<Set<string>>(()=>new Set([root]));
 useEffect(()=>setExpanded(old=>new Set([...old,root,...getAncestors(selected).slice(0,-1).map(n=>n.id)])),[selected,root]);
 function row(id:string,depth=0){const n=anatomy[id];if(!n||id!==root&&!relevant(id))return null;const open=expanded.has(id);return <li key={id}><div className={`tree-row ${selected===id?'active':''} ${hidden.includes(id)?'hidden-structure':''}`} style={{paddingLeft:12+depth*14}}>{n.children.length?<button className="tree-expand" aria-label={`${open?'Collapse':'Expand'} ${n.name}`} aria-expanded={open} onClick={()=>setExpanded(old=>{const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next;})}>{open?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</button>:<Circle className="tree-leaf" size={5}/>}<button className="tree-select" aria-current={selected===id?'true':undefined} onClick={()=>select(id)}>{n.name}</button><button className="tree-visibility" aria-label={`${hidden.includes(id)?'Show':'Hide'} ${n.name}`} onClick={()=>hide(id)}>{hidden.includes(id)?<EyeOff size={13}/>:<Eye size={13}/>}</button></div>{open&&n.children.length>0&&<ul>{n.children.map(child=>row(child,depth+1))}</ul>}</li>}
 return <ul className="anatomy-tree" aria-label="Anatomy hierarchy">{row(root)}</ul>;
}

