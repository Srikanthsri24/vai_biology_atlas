import SkeletonDivisions from '../atlas/SkeletonDivisions';
import AssetAudit from '../atlas/AssetAudit';
import { Link, useNavigate } from 'react-router-dom';
import { Box, ChevronLeft, Layers3, X } from 'lucide-react';
import { anatomyModels, systems } from '../../data/modelRegistry';
import { useAtlasStore } from '../../store/atlasStore';
import AnatomyTree from '../atlas/AnatomyTree';
export default function Sidebar({open,onClose}:{open:boolean;onClose:()=>void}){const model=useAtlasStore(s=>s.activeModel),filter=useAtlasStore(s=>s.systemFilter);const navigate=useNavigate();return <aside className={`atlas-sidebar ${open?'panel-open':''}`} aria-label="Anatomy navigation"><div className="sidebar-top"><Link to="/" className="back-link"><ChevronLeft size={14}/> Back to collection</Link><button className="icon-btn panel-close" aria-label="Close anatomy navigation" onClick={onClose}><X size={17}/></button><div className="sidebar-title"><Box size={20}/><span>Your anatomy atlas</span></div><label className="sr-only" htmlFor="atlas-select">Choose an atlas</label><select id="atlas-select" value={model} onChange={e=>navigate(`/atlas/${e.target.value}`)}>{anatomyModels[model]?.systemId&&<option value={model}>{anatomyModels[model].name}</option>}{Object.values(anatomyModels).filter(m=>!m.systemId).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div><SkeletonDivisions/><div className="sidebar-scroll"><div className="panel-eyebrow">ANATOMY HIERARCHY</div><AnatomyTree root={systems.find(s=>s.id===filter)?.treeRoot??anatomyModels[model].root}/><div className="sidebar-systems"><div className="panel-eyebrow">BODY SYSTEMS</div>{systems.map(s=><Link key={s.id} to={`/systems/${s.id}`} className={filter===s.id?'active':''}><Layers3 size={14}/>{s.name}</Link>)}</div></div><AssetAudit/><div className="sidebar-footer"><span className="shortcut-key">R</span> Reset view <span className="shortcut-key">F</span> Focus</div></aside>}



