import { anatomy } from '../data/anatomyTree';
import type { AnatomyNode } from '../data/types';
export function regionKey(n:AnatomyNode){return n.explorationRegion??`${n.region??n.parent??'body'}:${n.side??'midline'}`;}
export function sameExplorationRegion(id:string,region:string|null){return !!region&&!!anatomy[id]&&regionKey(anatomy[id])===region;}
