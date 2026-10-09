import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { brand } from './config/brand';
import Header from './components/layout/Header';
import Home from './pages/Home';
import About from './pages/About';
import Systems from './pages/Systems';
import NotFound from './pages/NotFound';
import Library from './pages/Library';
const Journey=lazy(()=>import('./pages/Journey'));
const LivingOrgans=lazy(()=>import('./pages/LivingOrgans'));
const Atlas=lazy(()=>import('./pages/Atlas'));
export default function App(){
 const [dark,setDark]=useState(()=>{try{return localStorage.getItem('atlas-theme')==='dark';}catch{return false;}});const location=useLocation();
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.setProperty('--accent',brand.accent);try{localStorage.setItem('atlas-theme',dark?'dark':'light');}catch{/* Storage may be unavailable in private sessions. */}},[dark]);
 useEffect(()=>{if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'smooth'}));}else if(!location.pathname.startsWith('/atlas/')&&!location.pathname.startsWith('/systems/'))window.scrollTo(0,0);},[location.pathname,location.hash]);
 return <><a className="skip-link" href="#main">Skip to content</a><Header dark={dark} toggleTheme={()=>setDark(d=>!d)}/><Suspense fallback={<div className="route-loading"><img src={brand.logo} alt=""/><span>Preparing your atlas…</span></div>}><Routes><Route path="/" element={<Home/>}/><Route path="/journey/:stage?" element={<Journey/>}/><Route path="/living" element={<LivingOrgans/>}/><Route path="/structures" element={<Library structures/>}/><Route path="/atlas" element={<Library/>}/><Route path="/atlas/:modelId/:structure?" element={<Atlas/>}/><Route path="/systems/:systemId/:structure?" element={<Atlas/>}/><Route path="/systems" element={<Systems/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></>;
}

