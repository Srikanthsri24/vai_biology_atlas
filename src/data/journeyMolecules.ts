export type Atom={id:string;position:[number,number,number]};
export function moleculeAssembly(study:string):{atoms:Atom[];bonds:[number,number][];bondOrders?:number[]}{
 if(study==='oxygen-molecule')return {atoms:[{id:'oxygen',position:[-.65,0,0]},{id:'oxygen',position:[.65,0,0]}],bonds:[[0,1]],bondOrders:[2]};
 if(study==='carbon-dioxide')return {atoms:[{id:'carbon',position:[0,0,0]},{id:'oxygen',position:[-1.25,0,0]},{id:'oxygen',position:[1.25,0,0]}],bonds:[[0,1],[0,2]],bondOrders:[2,2]};
 const atoms:Atom[]=[],bonds:[number,number][]=[];
 for(let i=0;i<6;i++){const a=i*Math.PI/3;atoms.push({id:i===5?'oxygen':'carbon',position:[Math.cos(a),Math.sin(a),0]});bonds.push([i,(i+1)%6]);}
 atoms.push({id:'carbon',position:[1.5,-1.05,0]});bonds.push([0,6]);
 for(let i=0;i<5;i++){const parent=i===4?6:i+1,[x,y]=atoms[parent].position;atoms.push({id:'oxygen',position:[x*1.5,y*1.5,.15]});bonds.push([parent,atoms.length-1]);}
 // Atom counts emphasize composition; this view does not encode glucose stereochemistry.
 for(let i=0;i<12;i++){const parent=i<5?7+i:i<10?i-5:6,[x,y,z]=atoms[parent].position;atoms.push({id:'hydrogen',position:[x+(x>=0?.32:-.32),y+.18,z+(i%2?.5:-.5)]});bonds.push([parent,atoms.length-1]);}
 return {atoms,bonds};
}
