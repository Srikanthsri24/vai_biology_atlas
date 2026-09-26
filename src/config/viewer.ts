export const ZOOM_LEVELS = [
 {id:'BODY',name:'Complete body',minDistance:8,skinOpacity:1,maxLabels:5},
 {id:'SYSTEM',name:'Body systems',minDistance:5,skinOpacity:.28,maxLabels:5},
 {id:'ORGAN',name:'Organs',minDistance:2.3,skinOpacity:.08,maxLabels:4},
 {id:'STRUCTURE',name:'Structure detail',minDistance:0,skinOpacity:.03,maxLabels:4}
] as const;
export type ZoomLevel = typeof ZOOM_LEVELS[number]['id'];
export const getZoomLevel = (distance:number)=>ZOOM_LEVELS.find(l=>distance>=l.minDistance) ?? ZOOM_LEVELS[3];
export const CAMERA_PRESETS = {front:[0,0,1],back:[0,0,-1],left:[1,0,0],right:[-1,0,0],superior:[0,1,.001],inferior:[0,-1,.001]} as const;
