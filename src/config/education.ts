export type LearningLevel='basic'|'standard'|'advanced';
export const learningLevels={basic:{name:'Basic',labelLimit:3,description:'Major structures and simple functions'},standard:{name:'Standard',labelLimit:6,description:'School anatomy and related structures'},advanced:{name:'Advanced',labelLimit:10,description:'Substructures, attachments and innervation'}};
export const ANATOMY_ZOOM=[
 {id:'BODY',name:'Whole body',minDistance:8,separation:0},
 {id:'REGIONS',name:'Body regions',minDistance:6,separation:.03},
 {id:'SYSTEMS',name:'Muscle groups',minDistance:4,separation:.08},
 {id:'STRUCTURES',name:'Structures',minDistance:2,separation:.15},
 {id:'SUBSTRUCTURES',name:'Substructures',minDistance:.8,separation:.3},
 {id:'MICRO',name:'Microscopic concepts',minDistance:0,separation:.3}
] as const;
export type AnatomyDepth=typeof ANATOMY_ZOOM[number]['id'];
export function semanticZoom(distance:number){const index=ANATOMY_ZOOM.findIndex(l=>distance>=l.minDistance);const level=ANATOMY_ZOOM[Math.max(0,index)];const above=ANATOMY_ZOOM[Math.max(0,index-1)];const span=Math.max(.01,above.minDistance-level.minDistance);const t=Math.max(0,Math.min(1,(above.minDistance-distance)/span));const ease=t*t*(3-2*t);return{depth:level.id,separation:above.separation+(level.separation-above.separation)*ease};}
export const curriculumExtensions={quiz:{enabled:false,selectionKey:'anatomyId'},bookmarks:{enabled:false,storageKey:'human-atlas-bookmarks'},comparison:{enabled:false},splitAnatomy:{enabled:false}};
