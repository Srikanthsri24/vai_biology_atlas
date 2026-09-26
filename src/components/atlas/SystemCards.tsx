import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, Bone, Brain, Droplet, HeartPulse, Scan, Shield, Wind } from 'lucide-react';
import { systems } from '../../data/modelRegistry';
import type { BodySystem } from '../../data/types';
import ModelPreview from './ModelPreview';
const icons={bone:Bone,activity:Activity,heart:HeartPulse,brain:Brain,wind:Wind,scan:Scan,shield:Shield,droplet:Droplet};
export default function SystemCards({items=systems,previews=false}:{items?:BodySystem[];previews?:boolean}){return <div className="system-cards">{items.map(s=>{const Icon=icons[s.icon];return <article key={s.id} className={`system-card system-${s.id}`}>{previews&&<div className="system-preview"><ModelPreview model={s.modelId}/></div>}<div className="system-card-top"><span className="system-icon"><Icon size={25} strokeWidth={1.4}/></span><span className="system-group">{s.group}</span></div><h3>{s.name}</h3><p>{s.description}</p><small>{s.structures.length} major {s.structures.length===1?'anatomy group':'structures / groups'}</small><Link className="system-explore" to={`/systems/${s.id}`}>Explore {s.name.replace(' System','').toLowerCase()}<ArrowUpRight size={16}/></Link></article>;})}</div>}
