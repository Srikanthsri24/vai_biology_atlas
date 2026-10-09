import records from './openAnatomy.generated.json';
import type { AnatomyNode } from './types';
export function addOpenAnatomy(data:Record<string,AnatomyNode>){
 const nodes=records as unknown as Record<string,AnatomyNode>;
 for(const n of Object.values(nodes))if(!data[n.id])data[n.id]={...n,children:[...n.children]};
 for(const n of Object.values(nodes)){const parent=data[n.parent??''];if(parent&&!parent.children.includes(n.id))parent.children.push(n.id);}
}
