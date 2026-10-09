import { useRef, useState } from 'react';
import { ArrowRight, Bookmark, Check, Search, SlidersHorizontal, X } from 'lucide-react';
import { filterJourneyTopics, journeyCategories, journeyLibrary, topicSceneName, type JourneyFilters, type JourneyTopic } from '../../data/journeyLibrary';
import { journeyStages } from '../../data/journey';

const initialFilters:JourneyFilters={search:'',category:'all',scale:'all',difficulty:'all',savedOnly:false,completedOnly:false,sort:'recommended'};
const pageSize=12;
type Props={active?:string;saved:string[];completed:string[];onToggle:(kind:'saved'|'completed',id:string)=>void;onStart:(topic:JourneyTopic)=>void};
export default function JourneyLibrary({active,saved,completed,onToggle,onStart}:Props){
 const [filters,setFilters]=useState(initialFilters),[page,setPage]=useState(0),panel=useRef<HTMLDetailsElement>(null);
 const results=filterJourneyTopics(filters,saved,completed),pages=Math.max(1,Math.ceil(results.length/pageSize)),currentPage=Math.min(page,pages-1);
 function update<K extends keyof JourneyFilters>(field:K,value:JourneyFilters[K]){setFilters(previous=>({...previous,[field]:value}));setPage(0);}
 function start(topic:JourneyTopic){if(panel.current)panel.current.open=false;onStart(topic);}
 return <details className="journey-library" ref={panel}>
  <summary><span><SlidersHorizontal size={17}/> Explore all {journeyLibrary.length} journeys</span><small>{journeyCategories.length} categories · Search, filter and save your next journey</small></summary>
  <div className="journey-library-body">
   <header><div className="eyebrow">YOUR ANATOMY LEARNING LIBRARY</div><h2>Choose where to go next.</h2><p>120 guided topics with focused explanations. Explore them through six core 3D routes and sixteen shared microscopic labs.</p><small>{completed.length} studied · {saved.length} saved on this device</small></header>
   <div className="journey-library-search"><Search size={19}/><input aria-label="Search journeys" placeholder="Search organs, processes, cells or molecules…" value={filters.search} onChange={event=>update('search',event.target.value)}/>{filters.search&&<button aria-label="Clear journey search" onClick={()=>update('search','')}><X size={17}/></button>}</div>
   <div className="journey-library-filters">
    <label>Body system / subject<select aria-label="Journey category" value={filters.category} onChange={event=>update('category',event.target.value)}><option value="all">All 15 categories</option>{journeyCategories.map(category=><option key={category} value={category}>{category}</option>)}</select></label>
    <label>Starting scale<select aria-label="Journey starting scale" value={filters.scale} onChange={event=>update('scale',event.target.value)}><option value="all">All scales</option>{journeyStages.slice(1).map((stage,index)=><option key={stage.id} value={index+1}>{stage.name}</option>)}</select></label>
    <label>Learning level<select aria-label="Journey learning level" value={filters.difficulty} onChange={event=>update('difficulty',event.target.value)}><option value="all">All levels</option>{['Foundation','Intermediate','Advanced'].map(level=><option key={level}>{level}</option>)}</select></label>
    <label>Sort by<select aria-label="Sort journeys" value={filters.sort} onChange={event=>update('sort',event.target.value as JourneyFilters['sort'])}><option value="recommended">Curriculum order</option><option value="title">Title A–Z</option></select></label>
   </div>
   <div className="journey-library-resultbar"><span role="status" aria-live="polite">{results.length} of {journeyLibrary.length} journeys{results.length>0?` · Showing ${currentPage*pageSize+1}–${Math.min((currentPage+1)*pageSize,results.length)}`:''}</span><div><button aria-pressed={filters.savedOnly} onClick={()=>update('savedOnly',!filters.savedOnly)}><Bookmark size={14}/> Saved only</button><button aria-pressed={filters.completedOnly} onClick={()=>update('completedOnly',!filters.completedOnly)}><Check size={14}/> Studied only</button><button onClick={()=>{setFilters(initialFilters);setPage(0);}}>Reset filters</button></div></div>
   {results.length===0?<div className="journey-library-empty"><Search size={26}/><h3>No journeys match these filters</h3><p>Try a broader term, another category, or reset your filters.</p><button onClick={()=>{setFilters(initialFilters);setPage(0);}}>Show all journeys</button></div>:<div className="journey-library-grid">{results.slice(currentPage*pageSize,(currentPage+1)*pageSize).map(topic=><article key={topic.id} className={active===topic.id?'active':''}>
    <div className="journey-topic-meta"><span>{topic.category}</span><button aria-label={`${saved.includes(topic.id)?'Unsave':'Save'} ${topic.title}`} aria-pressed={saved.includes(topic.id)} onClick={()=>onToggle('saved',topic.id)}><Bookmark size={16} fill={saved.includes(topic.id)?'currentColor':'none'}/></button></div>
    <h3>{topic.title}</h3><p>{topic.description}</p><div className="journey-topic-tags"><span>{journeyStages[topic.level].name}</span><span>{topic.difficulty}</span>{completed.includes(topic.id)&&<span className="studied"><Check size={11}/> Studied</span>}</div>
    <small>Shared 3D scene · {topicSceneName(topic)}</small><button className="journey-topic-start" onClick={()=>start(topic)}>{active===topic.id?'Continue journey':'Start journey'}<ArrowRight size={15}/></button>
   </article>)}</div>}
   {results.length>0&&<nav className="journey-library-pagination" aria-label="Journey library pages"><button disabled={currentPage===0} onClick={()=>setPage(currentPage-1)}>Previous</button><span>Page {currentPage+1} of {pages}</span><button disabled={currentPage===pages-1} onClick={()=>setPage(currentPage+1)}>Next</button></nav>}
  </div>
 </details>;
}
