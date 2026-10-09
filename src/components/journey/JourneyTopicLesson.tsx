import { Bookmark, Check } from 'lucide-react';
import { type JourneyTopic, topicSceneName } from '../../data/journeyLibrary';
import { journeyStages } from '../../data/journey';

export default function JourneyTopicLesson({topic,saved,completed,onToggle,onReturn}:{topic:JourneyTopic;saved:boolean;completed:boolean;onToggle:(kind:'saved'|'completed',id:string)=>void;onReturn:()=>void}){
 return <section className="journey-topic-lesson" aria-label="Guided journey lesson">
  <div className="eyebrow">GUIDED JOURNEY · {topic.category.toUpperCase()}</div><h2>{topic.title}</h2><p>{topic.description}</p>
  <ol><li><strong>Observe</strong> Open the {topicSceneName(topic).toLowerCase()} scene at {journeyStages[topic.level].name.toLowerCase()} scale. Select, rotate and isolate its structures.</li><li><strong>Understand</strong> {topic.takeaway}</li><li><strong>Connect</strong> Compare the current scene with an adjacent scale. Explain how structure supports the function described above.</li></ol>
  <p className="journey-topic-scope">This topic uses a shared teaching scene. Its specialized anatomy and processes are explained here; the scene does not recreate every topic-specific structure.</p>
  <div><button onClick={onReturn}>Open topic’s 3D scene</button><button aria-pressed={saved} onClick={()=>onToggle('saved',topic.id)}><Bookmark size={13}/>{saved?'Saved':'Save'}</button><button aria-pressed={completed} onClick={()=>onToggle('completed',topic.id)}><Check size={13}/>{completed?'Studied':'Mark studied'}</button></div>
 </section>;
}
