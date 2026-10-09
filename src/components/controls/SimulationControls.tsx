import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Pause, Play, RotateCcw, X } from 'lucide-react';
import { phaseIndex, simulationById, simulations } from '../../data/simulations';
import { useSimulationStore } from '../../store/simulationStore';
import { useAtlasStore } from '../../store/atlasStore';

export function SimulationControls({onExplain}:{onExplain:()=>void}){
 const s=useSimulationStore(),location=useLocation(),navigate=useNavigate();
 const requested=new URLSearchParams(location.search).get('simulation');
 useEffect(()=>{const lesson=simulationById(requested);if(lesson){useSimulationStore.getState().start(lesson.id);useAtlasStore.setState({autoSeparate:false,autoSeparation:0,flowEnabled:false});}else useSimulationStore.getState().stop();return()=>useSimulationStore.getState().stop();},[requested]);
 const lesson=simulationById(s.id);
 function close(){const query=new URLSearchParams(location.search);query.delete('simulation');navigate({pathname:location.pathname,search:query.toString()},{replace:true});}
 return <div className={`living-controls ${lesson?'is-live':''}`}><Activity size={18}/><label htmlFor="living-lesson">Living organs</label><select id="living-lesson" value={lesson?.id??''} onChange={e=>{const next=simulationById(e.target.value);if(next)navigate(`${next.route}?simulation=${next.id}`);else close();}}><option value="">Choose a functional simulation</option>{simulations.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}</select>{lesson?<><button aria-label={s.playing?'Pause simulation':'Play simulation'} onClick={s.toggle}>{s.playing?<Pause size={16}/>:<Play size={16}/>}</button><button aria-label="Restart simulation" onClick={()=>s.seek(0)}><RotateCcw size={15}/></button><button className="living-explain" onClick={onExplain}>How it works</button><button aria-label="Close simulation" onClick={close}><X size={15}/></button></>:<Link to="/living">Explore the lab ↗</Link>}</div>;
}
export function SimulationExplanation(){
 const s=useSimulationStore(),lesson=simulationById(s.id),panel=useRef<HTMLElement>(null);
 useEffect(()=>{const aside=panel.current?.closest('aside');if(aside)aside.scrollTop=0;},[s.id]);
 if(!lesson)return null;
 const current=phaseIndex(s.phase);
 return <section ref={panel} className="simulation-explanation" aria-label="Functional simulation explanation"><div className="living-eyebrow"><Activity size={14}/> LIVING ORGANS · INTERACTIVE LESSON</div><h2>{lesson.title}</h2><p>{lesson.subtitle}</p><div className="simulation-readout"><span>{s.playing?'PLAYING':'PAUSED'} · {s.speed}× teaching speed</span><strong>{Math.round(s.phase*100)}%</strong></div><label className="living-label" htmlFor="simulation-timeline">Scrub the teaching cycle</label><input id="simulation-timeline" type="range" min="0" max=".9999" step=".001" value={s.phase} onChange={e=>s.seek(+e.target.value)}/><div className="living-speed"><label htmlFor="simulation-speed">Playback speed</label><select id="simulation-speed" value={s.speed} onChange={e=>s.setSpeed(+e.target.value)}>{[.25,.5,1,1.5,2].map(v=><option key={v} value={v}>{v}×</option>)}</select></div><div className="simulation-stages">{lesson.stages.map((stage,i)=><button key={stage.title} aria-pressed={current===i} onClick={()=>s.seek(i/4+.01)}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{stage.title}</strong><p>{stage.text}</p></div></button>)}</div><label className="living-marker"><input type="checkbox" checked={s.markers} onChange={e=>useSimulationStore.setState({markers:e.target.checked})}/> Show teaching markers</label><p className="living-legend">{lesson.legend}</p><div className="living-limit"><strong>What this simulation represents</strong><p>{lesson.limitation} Markers are hidden in cross-section mode. Playback starts paused; press Play to begin.</p></div><a href={lesson.source} target="_blank" rel="noreferrer">Read the physiology · OpenStax ↗</a></section>;
}
