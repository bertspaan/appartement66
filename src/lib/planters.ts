import * as T from 'three';

// Footprints from the two original balcony planters; height supplied by the user.
export const planterFootprints = [
 {x:-6.18,z:-2.81,width:1.60,depth:2.20},
 {x:3.66,z:5.16,width:2.20,depth:1.40}
];
export function addPlanters(parent:T.Group){
 const group=new T.Group();group.name='Balcony planters';parent.add(group);
 const pot=new T.MeshStandardMaterial({color:'#68706b',roughness:.95});
 const soil=new T.MeshStandardMaterial({color:'#40362b',roughness:1});
 const stem=new T.MeshStandardMaterial({color:'#536748',roughness:1});
 const greens=['#4e704a','#75915b','#315d49','#9aa774'].map(color=>new T.MeshStandardMaterial({color,roughness:.9}));
 const leafGeometry=new T.SphereGeometry(1,10,6);
 function add(p:T.Object3D,g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number){const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;p.add(mesh);return mesh;}
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material){return add(p,new T.BoxGeometry(w,h,d),m,x,y,z);}
 function twig(p:T.Object3D,a:T.Vector3,b:T.Vector3){const o=add(p,new T.CylinderGeometry(.005,.009,a.distanceTo(b),6),stem,0,0,0);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());}
 function shrub(p:T.Group,x:number,z:number,index:number){
  const h=.48+(index%3)*.13;
  twig(p,new T.Vector3(x,.91,z),new T.Vector3(x,.91+h,z));
  for(let j=0;j<24;j++){
   const angle=j*2.4+index,level=.97+(j%5)*h/5;
   const reach=.14+(j%3)*.035,tip=new T.Vector3(x+Math.cos(angle)*reach,level+.1,z+Math.sin(angle)*reach);
   twig(p,new T.Vector3(x,level-.04,z),tip);
   const leaf=add(p,leafGeometry,greens[(j+index)%greens.length],tip.x,tip.y,tip.z);
   leaf.scale.set(.065,.018,.14);leaf.rotation.set(.25+Math.sin(j)*.3,Math.PI/2-angle,.2);
  }
 }
 function grass(p:T.Group,x:number,z:number,index:number){
  const positions:number[]=[];
  for(let i=0;i<28;i++){
   const angle=i*2.399+index,h=.38+(i%7)*.065,lean=.12+(i%4)*.025;
   for(let j=0;j<4;j++){
    const point=(step:number,side:number)=>{const t=step/4,w=.008*(1-t)+.001;return [x+Math.cos(angle)*lean*t*t+Math.sin(angle)*w*side,.91+h*t,z+Math.sin(angle)*lean*t*t-Math.cos(angle)*w*side];};
    positions.push(...point(j,-1),...point(j,1),...point(j+1,1),...point(j,-1),...point(j+1,1),...point(j+1,-1));
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.computeVertexNormals();
  add(p,g,new T.MeshStandardMaterial({color:index%2?'#a3ad72':'#7a925c',roughness:1,side:T.DoubleSide}),0,0,0);
 }
 function flowers(p:T.Group,x:number,z:number,index:number){
  const petal=new T.MeshStandardMaterial({color:index%2?'#bd9cca':'#f2e4bc',roughness:.85});
  const centre=new T.MeshStandardMaterial({color:'#d4af57',roughness:1});
  for(let j=0;j<7;j++){
   const angle=j*2.4,h=.25+(j%3)*.1,px=x+Math.cos(angle)*.11,pz=z+Math.sin(angle)*.11;
   twig(p,new T.Vector3(x,.91,z),new T.Vector3(px,.91+h,pz));
   for(let k=0;k<5;k++){const a=k*Math.PI*2/5;const o=add(p,leafGeometry,petal,px+Math.cos(a)*.028,.92+h,pz+Math.sin(a)*.028);o.scale.set(.026,.009,.026);}
   const c=add(p,leafGeometry,centre,px,.925+h,pz);c.scale.set(.015,.011,.015);
  }
 }
 for(const [index,f] of planterFootprints.entries()){
  const p=new T.Group();p.name=`Planter ${index+1} — 1 metre high`;p.position.set(f.x,0,f.z);group.add(p);
  box(p,0,.055,0,f.width,.11,f.depth,pot);
  for(const x of [-f.width/2+.035,f.width/2-.035])box(p,x,.50,0,.07,1,f.depth,pot);
  for(const z of [-f.depth/2+.035,f.depth/2-.035])box(p,0,.50,z,f.width-.14,1,.07,pot);
  box(p,0,.88,0,f.width-.14,.06,f.depth-.14,soil);
  const innerW=f.width-.5,innerD=f.depth-.5;
  // Dense, staggered planting with 30 mixed plants per box.
  const columns=f.width>f.depth?6:5,rows=f.width>f.depth?5:6;
  for(let n=0;n<columns*rows;n++){
   const column=n%columns,row=Math.floor(n/columns);
   const x=(column/(columns-1)-.5)*innerW+Math.sin(n*2.4+index)*.035;
   const z=(row/(rows-1)-.5)*innerD+Math.cos(n*1.7+index)*.035;
   if((n+index)%3===0)grass(p,x,z,n);else if((n+index)%3===1)shrub(p,x,z,n);else flowers(p,x,z,n);
  }
 }
 return group;
}
