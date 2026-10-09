import StudyCollections from '../components/atlas/StudyCollections';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { anatomy } from '../data/anatomyTree';
import { systems } from '../data/modelRegistry';
import { libraryRegions } from '../data/extendedAnatomy';
import { anatomyRoute } from '../data/anatomyRoutes';
import { belongsToSystem } from '../utils/visibility';
import AtlasModules from '../components/atlas/AtlasModules';
import Footer from '../components/layout/Footer';
export const structureCategories:Record<string,string>={All:'',Regions:'region',Organs:'organ',Bones:'bone',Muscles:'muscle',Joints:'joint',Tendons:'tendon',Ligaments:'ligament',Nerves:'nerve',Arteries:'arteries',Veins:'veins',Microscopic:'micro'};
export default function Library({structures=false}:{structures?:boolean}){
 const [params]=useSearchParams(),[query,setQuery]=useState(''),[type,setType]=useState(params.get('type')??'All'),[region,setRegion]=useState('All regions'),[system,setSystem]=useState(''),[letter,setLetter]=useState(''),[limit,setLimit]=useState(30);
 useEffect(()=>setType(params.get('type')??'All'),[params]);
 const nodes=useMemo(()=>Object.values(anatomy).filter(n=>(!structureCategories[type]||(['arteries','veins'].includes(structureCategories[type])?n.layer===structureCategories[type]:n.type===structureCategories[type]))&&(region==='All regions'||n.region===region)&&(!system||belongsToSystem(n.id,system,n.layer))&&(!letter||n.name.toUpperCase().startsWith(letter))&&query.toLowerCase().split(/\s+/).every(word=>`${n.name} ${n.system} ${n.scientificName} ${n.id} ${n.side??''}`.toLowerCase().includes(word))).sort((a,b)=>a.name.localeCompare(b.name)),[query,type,region,system,letter]);
 return <><main id="main" className="content-page library-page"><div className="eyebrow">EXPLORE THE COLLECTION</div><h1>{structures?'Explore by':'Anatomy'} <em>{structures?'Structure.':'Library.'}</em></h1><p>Explore a body system, choose a region, or focus on an individual structure.</p>{!structures&&<AtlasModules/>}
 {!structures&&<StudyCollections/>}<h2 className="catalog-heading">Browse every structure</h2><div className="library-filters"><div><Search size={18}/><input value={query} aria-label="Search anatomy library" placeholder="Try left femur, ACL, optic nerve…" onChange={e=>{setQuery(e.target.value);setLimit(30);}}/></div><select aria-label="Filter anatomical region" value={region} onChange={e=>{setRegion(e.target.value);setLimit(30);}}>{['All regions',...libraryRegions].map(r=><option key={r}>{r}</option>)}</select><select aria-label="Filter body system" value={system} onChange={e=>{setSystem(e.target.value);setLimit(30);}}><option value="">All systems</option>{systems.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></div>
 <div className="filter-tabs" aria-label="Filter anatomy type">{Object.keys(structureCategories).map(f=><button key={f} aria-pressed={type===f} onClick={()=>{setType(f);setLimit(30);}}>{f}</button>)}</div><div className="alphabet-filter" aria-label="Alphabetical filter">{['',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(l=><button key={l} aria-pressed={letter===l} onClick={()=>{setLetter(l);setLimit(30);}}>{l||'All'}</button>)}</div><p className="library-count">{nodes.length} catalog entries · entries may represent a group, pair or individual structure</p><div className="library-results">{nodes.slice(0,limit).map(n=><Link key={n.id} to={anatomyRoute(n.id)}><small>{n.type} · {n.region}</small><h3>{n.name}</h3><p>{n.description}</p><span>{n.system}<ArrowUpRight size={14}/></span></Link>)}</div>{!nodes.length&&<div className="empty-state">No structures match your filters.</div>}{nodes.length>limit&&<button className="outline-btn load-more" onClick={()=>setLimit(n=>n+30)}>Show more structures</button>}</main><Footer/></>;
}
