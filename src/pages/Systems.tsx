import StudyCollections from '../components/atlas/StudyCollections';
import { useState } from 'react';
import SystemCards from '../components/atlas/SystemCards';
import Footer from '../components/layout/Footer';
import { systems } from '../data/modelRegistry';
export default function Systems(){const [group,setGroup]=useState('All');return <><main id="main" className="content-page"><div className="eyebrow">THE BODY, CONNECTED</div><h1>Explore human<br/><em>body systems.</em></h1><p>Explore all {systems.length} system collections. Choose a function below, open a complete system, or jump directly to an organ. Male and female reproductive anatomy each have their own explorer.</p><div className="filter-tabs" aria-label="Filter body systems">{['All',...new Set(systems.map(s=>s.group))].map(g=><button aria-pressed={g===group} key={g} onClick={()=>setGroup(g)}>{g}</button>)}</div><p className="system-results" aria-live="polite">{systems.filter(s=>group==='All'||s.group===group).length} collections · {group==='All'?'All body functions':group}</p><SystemCards items={systems.filter(s=>group==='All'||s.group===group)} previews/><StudyCollections/></main><Footer/></>}
