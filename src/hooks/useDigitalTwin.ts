import { useEffect, useRef, useState } from 'react';
import { initialTwinState, stepTwin, type TwinState } from '../data/digitalTwin';
export type TwinSample=TwinState & {activity:number};
export function useDigitalTwin(){
 const [activity,setActivity]=useState(0),[running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[state,setState]=useState(initialTwinState),[history,setHistory]=useState<TwinSample[]>([]);
 const clock=useRef(initialTwinState()),controls=useRef({activity,running,speed});controls.current={activity,running,speed};
 useEffect(()=>{let frame=0,last=0,publish=0,record=0;function tick(now:number){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(controls.current.running){clock.current=stepTwin(clock.current,controls.current.activity,dt*controls.current.speed);if(now-publish>=160){setState({...clock.current});publish=now;}if(clock.current.seconds-record>=1){record=clock.current.seconds;const sample={...clock.current,activity:controls.current.activity};setHistory(old=>[...old.slice(-179),sample]);}}else{record=Math.min(record,clock.current.seconds);}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[]);
 function pause(){setRunning(false);setState({...clock.current});}
 function reset(){clock.current=initialTwinState();setState({...clock.current});setHistory([]);setActivity(0);setRunning(false);}
 return {activity,setActivity,running,setRunning,pause,speed,setSpeed,state,clock,history,reset};
}
