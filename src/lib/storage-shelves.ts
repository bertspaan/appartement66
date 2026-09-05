import * as T from 'three';

export function addStorageShelves(parent:T.Group){
 const rack=new T.Group();rack.name='Berging — shelves, crates and camping equipment';
 // Back wall: 1.36 m wide, 48 cm deep. Full-width shelves replace the washer.
 rack.position.set(.33,0,-3.515);parent.add(rack);
 const materials=new Map<string,T.MeshStandardMaterial>();
 function material(color:string){let m=materials.get(color);if(!m){m=new T.MeshStandardMaterial({color,roughness:.8});materials.set(color,m);}return m;}
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){
  const m=new T.Mesh(new T.BoxGeometry(w,h,d),material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;
 }
 function cylinder(p:T.Object3D,x:number,y:number,z:number,r:number,length:number,color:string){
  const m=new T.Mesh(new T.CylinderGeometry(r,r,length,24),material(color));m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;
 }
 const wood='#bb9467',steel='#414b48';
 for(const x of [-.665,.665])for(const z of [-.215,.215])box(rack,x,1.13,z,.03,2.20,.03,steel);
 for(const y of [.11,.53,.96,1.43,1.90,2.31]){
  box(rack,0,y,0,1.36,.035,.48,wood);
  for(const z of [-.215,.215])box(rack,0,y-.033,z,1.34,.035,.025,steel);
 }
 function crate(x:number,y:number,color:string){
  const g=new T.Group();g.name='Camping storage crate';g.position.set(x,y,0);rack.add(g);
  box(g,0,.015,0,.39,.03,.38,color);
  for(const z of [-.185,.185]){
   for(const h of [.07,.16,.27])box(g,0,h,z,.39,.022,.018,color);
   for(let i=0;i<7;i++)box(g,-.18+i*.06,.15,z,.016,.26,.018,color);
  }
  for(const x of [-.185,.185]){
   for(const h of [.07,.16,.27])box(g,x,h,0,.018,.022,.38,color);
   for(let i=0;i<6;i++)box(g,x,.15,-.16+i*.064,.018,.26,.016,color);
  }
  for(let i=0;i<3;i++)box(g,-.11+i*.11,.085,.015,.085,.12,.25,['#dcc5a1','#729383','#c3866b'][i]);
 }
 for(const x of [-.43,0,.43]){crate(x,.128,'#b08d42');crate(x,.548,'#416f65');}
 crate(-.43,.978,'#527a7f');crate(0,.978,'#ad7353');crate(.43,.978,'#b49c4b');
 // Rolled sleeping bags: soft cylinders with compression straps and round ends.
 for(let i=0;i<3;i++){
  const x=-.43+i*.43,y=1.60,color=['#677d66','#bd7890','#c8a94e'][i];
  const bag=cylinder(rack,x,y,0,.145,.36,color);bag.rotation.x=Math.PI/2;bag.name='Rolled sleeping bag';
  for(const z of [-.12,.12]){
   const strap=cylinder(rack,x,y,z,.148,.025,steel);strap.rotation.x=Math.PI/2;
  }
 }
 // Long zipped tent bag, with two carrying straps.
 box(rack,-.13,2.04,0,.91,.235,.34,'#778161');
 box(rack,-.13,2.161,0,.85,.006,.009,'#303c32');
 for(const x of [-.40,.14]){
  box(rack,x,2.044,.175,.033,.23,.012,steel);
  box(rack,x,2.169,0,.033,.012,.35,steel);
 }
 // Camping saucepan and lid alongside the tent.
 cylinder(rack,.49,2.015,0,.115,.18,'#969e9f');
 cylinder(rack,.49,2.112,0,.12,.014,'#b5bcbc');
 box(rack,.49,2.134,0,.055,.03,.023,steel);
 // Foam sleeping mats on the upper shelf, with visible rolled edges.
 for(let i=0;i<2;i++){
  const x=-.37+i*.42,y=2.425,color=i?'#698c9b':'#bd9660';
  const mat=cylinder(rack,x,y,0,.09,.39,color);mat.rotation.x=Math.PI/2;mat.name='Rolled camping mat';
  for(const radius of [.033,.062,.088]){
   const ring=new T.Mesh(new T.TorusGeometry(radius,.003,6,28),material(steel));ring.position.set(x,y,.197);rack.add(ring);
  }
 }
 return rack;
}
