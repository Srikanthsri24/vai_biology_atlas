import { useEffect, useRef, useState } from 'react';
import { initialTwinState, protocolFrame, stepTwin, type TwinProtocolId, type TwinState } from '../data/digitalTwin';
export type TwinSample=TwinState & {activity:number};
export function useDigitalTwin(){
 const [activity,setActivityState]=useState(0),[running,setRunningState]=useState(false),[speed,setSpeed]=useState(1),[state,setState]=useState(initialTwinState),[history,setHistory]=useState<TwinSample[]>([]),[protocol,setProtocol]=useState<TwinProtocolId>('free'),[reviewing,setReviewing]=useState<number|null>(null);
 const clock=useRef(initialTwinState()),controls=useRef({activity:0,running:false,speed:1,protocol:'free' as TwinProtocolId}),historyRef=useRef<TwinSample[]>([]),record=useRef(0);controls.current.speed=speed;
 function publishHistory(samples:TwinSample[]){historyRef.current=samples;setHistory(samples);}
 useEffect(()=>{let frame=0,last=0,publish=0;function tick(now:number){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(controls.current.running){const phase=protocolFrame(controls.current.protocol,clock.current.seconds);const workload=phase?.activity??controls.current.activity;
 if(phase?.complete){controls.current.running=false;setRunningState(false);setState({...clock.current});}else{clock.current=stepTwin(clock.current,workload,dt*controls.current.speed);controls.current.activity=workload;if(now-publish>=160){setState({...clock.current});setActivityState(workload);publish=now;}if(clock.current.seconds-record.current>=1){record.current=clock.current.seconds;const sample={...clock.current,activity:workload};const next=[...historyRef.current.slice(-899),sample];historyRef.current=next;setHistory(next);}}}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[]);
 function pause(){controls.current.running=false;setRunningState(false);setState({...clock.current});}
 function resume(){if(reviewing!==null){publishHistory(historyRef.current.slice(0,reviewing+1));record.current=clock.current.seconds;setReviewing(null);}controls.current.running=true;setRunningState(true);}
 function setRunning(value:boolean){value?resume():pause();}
 function setActivity(value:number){controls.current.activity=value;controls.current.protocol='free';setProtocol('free');setActivityState(value);}
 function reset(){pause();clock.current=initialTwinState();setState({...clock.current});publishHistory([]);record.current=0;setReviewing(null);setActivity(0);}
 function startProtocol(id:Exclude<TwinProtocolId,'free'>){reset();controls.current.protocol=id;setProtocol(id);const value=protocolFrame(id,0)!.activity;controls.current.activity=value;setActivityState(value);resume();}
 function seek(index:number){const sample=historyRef.current[index];if(!sample)return;pause();clock.current={...sample};setState({...sample});controls.current.activity=sample.activity;setActivityState(sample.activity);setReviewing(index);}
 return {activity,setActivity,running,setRunning,pause,speed,setSpeed,state,clock,history,reset,protocol,startProtocol,reviewing,seek};
}
