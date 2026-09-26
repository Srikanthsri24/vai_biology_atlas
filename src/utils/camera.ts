import { Box3, MathUtils, Vector3 } from 'three';
/** Fit all eight box corners to both frustum axes, including their depth. */
export function fitCameraToBox(box:Box3,fov:number,aspect:number,direction=new Vector3(0,0,1),padding=1.15){
 const target=box.getCenter(new Vector3());const forward=direction.clone().normalize();const up=Math.abs(forward.y)>.98?new Vector3(0,0,-1):new Vector3(0,1,0);const right=new Vector3().crossVectors(up,forward).normalize();const vertical=new Vector3().crossVectors(forward,right).normalize();const tanY=Math.tan(MathUtils.degToRad(fov)/2);const tanX=tanY*Math.max(.1,aspect);let distance=.1;
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const point=new Vector3(x,y,z).sub(target);const depth=point.dot(forward);distance=Math.max(distance,depth+Math.abs(point.dot(right))*padding/tanX,depth+Math.abs(point.dot(vertical))*padding/tanY);}
 return {target,position:forward.multiplyScalar(distance).add(target),distance};
}
