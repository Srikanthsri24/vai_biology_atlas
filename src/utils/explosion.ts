import { Vector3 } from 'three';
import { anatomy, isWithin } from '../data/anatomyTree';
import { anatomyModels, layers } from '../data/modelRegistry';
import type { AtlasState } from '../store/atlasStore';
import { sameExplorationRegion } from './semantic';
/** World-space displacements. Mesh parent transforms are resolved at the renderer. */
export function explosionOffset(id:string,layer:string,state:Pick<AtlasState,'activeModel'|'selectedId'|'explosion'|'systemFilter'>&Partial<Pick<AtlasState,'autoSeparation'|'activeRegion'|'modelScale'>>,out=new Vector3()){
 out.set(0,0,0);const automatic=sameExplorationRegion(id,state.activeRegion??null)?state.autoSeparation??0:0;const amount=Math.max(state.explosion,automatic);if(!amount)return out;const n=anatomy[id];const config=anatomyModels[state.activeModel];const selected=anatomy[state.selectedId];
 if(state.systemFilter==='muscular'){if(!layer.startsWith('muscles'))return out;const p=n?.cameraTarget??[0,0,0];const depth=n.depth==='deep'?.35:n.depth==='intermediate'?.65:1;const vector=n.explodeDirection??[Math.sign(p[0])*.7,0,p[2]>=0?.55:-.55];return out.fromArray(vector).normalize().multiplyScalar(amount*(n.maxExplodeDistance??.8)*depth*(state.modelScale??1));}
 if(config?.root!=='body'||selected?.radius<.65){if(selected?.radius<.65&&!isWithin(id,selected.id))return out;return out.fromArray(n?.explodeDirection??[0,0,.3]).multiplyScalar(state.explosion*.65);}
 return out.fromArray(layers.find(l=>l.id===layer)?.direction??[0,0,0]).multiplyScalar(state.explosion);
}
