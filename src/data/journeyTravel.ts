import { CatmullRomCurve3, Vector3 } from 'three';
import type { JourneyPath } from './journey';
export const renalTubePath:[number,number,number][]=[[0,.5,0],[.6,.3,.1],[1,.65,.1],[1.3,.1,0],[.9,-.8,0],[.7,-1.6,0],[.2,-1.9,0],[-.25,-1.6,0],[-.3,-.6,0],[-.6,.15,0],[-1,.35,.1],[-1.4,.1,0]];
const renalCurve=new CatmullRomCurve3(renalTubePath.map(point=>new Vector3(...point)));
export function travelFrame(path:JourneyPath,value:number){
 const t=Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;
 if(path==='renal'){const point=renalCurve.getPoint(t);return {position:point.clone().add(new Vector3(0,.15,1.2)),target:point};}
 if(path==='respiratory')return {position:new Vector3(0,0,6-t*4.2),target:new Vector3(0,0,-.3)};
 if(path==='digestive')return {position:new Vector3(.5,.4,6-t*4.6),target:new Vector3(.3,.4,0)};
 if(path==='muscle')return {position:new Vector3(-1.6+t*3.2,.4,2.6),target:new Vector3(-1.6+t*3.2,0,0)};
 const z=7-t*12,x=path==='blood'?0:.3,y=path==='blood'?0:.2;
 return {position:new Vector3(x,y,z),target:new Vector3(x,y,z-3)};
}
