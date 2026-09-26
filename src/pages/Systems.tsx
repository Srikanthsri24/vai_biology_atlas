import { useState } from 'react';
import SystemCards from '../components/atlas/SystemCards';
import Footer from '../components/layout/Footer';
import { systems } from '../data/modelRegistry';
export default function Systems(){const [group,setGroup]=useState('All');return <><main id="main" className="content-page"><div className="eyebrow">THE BODY, CONNECTED</div><h1>Explore human<br/><em>body systems.</em></h1><p>See how the body’s interconnected systems work together, from muscles and bones to nerves, circulation and internal organs.</p><div className="filter-tabs" aria-label="Filter body systems">{['All',...new Set(systems.map(s=>s.group))].map(g=><button aria-pressed={g===group} key={g} onClick={()=>setGroup(g)}>{g}</button>)}</div><SystemCards items={systems.filter(s=>group==='All'||s.group===group)} previews/></main><Footer/></>}
