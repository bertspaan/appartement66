import * as T from 'three';

export function addKitchenRack(parent:T.Group){
 const rack=new T.Group();rack.name='Steel kitchen shelving with pots and jars';
 // Empty stretch of rear wall, beside the leftmost kitchen cabinet.
 // 90 × 42 cm footprint leaves the route alongside the island open.
 rack.position.set(-4.10,0,-3.53);parent.add(rack);
 const steel=new T.MeshStandardMaterial({color:'#a4adad',metalness:.7,roughness:.38});
 const black=new T.MeshStandardMaterial({color:'#333b3c',roughness:.6});
 const enamel=new T.MeshStandardMaterial({color:'#b35439',roughness:.35});
 const ceramic=new T.MeshStandardMaterial({color:'#e2d5b9',roughness:.55});
 const lidMaterial=new T.MeshStandardMaterial({color:'#b29665',roughness:.65});
 function mesh(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number){
  const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;rack.add(o);return o;
 }
 function box(x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material){return mesh(new T.BoxGeometry(w,h,d),m,x,y,z);}
 function cylinder(x:number,y:number,z:number,r:number,h:number,m:T.Material){return mesh(new T.CylinderGeometry(r,r,h,20),m,x,y,z);}
 for(const x of [-.435,.435])for(const z of [-.195,.195]){
  box(x,1.01,z,.025,1.98,.025,steel);
  box(x,.035,z,.038,.025,.038,black);
 }
 for(const y of [.12,.55,.98,1.41,1.84]){
  box(0,y,0,.90,.018,.42,steel);
  for(const z of [-.20,.20])box(0,y-.026,z,.88,.038,.012,steel);
 }
 // Thin rear cross-bracing.
 for(const sign of [-1,1]){
  const brace=box(0,1,-.203,.014,Math.hypot(.84,1.70),.008,steel);
  brace.rotation.z=sign*Math.atan2(.84,1.70);
 }
 function pot(x:number,base:number,r:number,h:number,m:T.Material){
  cylinder(x,base+h/2,0,r,h,m);
  cylinder(x,base+h+.008,0,r+.008,.016,steel);
  box(x,base+h+.035,0,.06,.032,.025,black);
  for(const side of [-1,1])box(x+side*(r+.03),base+h*.72,0,.065,.023,.038,black);
 }
 pot(-.23,.13,.14,.24,steel);pot(.23,.13,.12,.18,enamel);
 pot(-.23,.56,.115,.15,enamel);
 // Stacked frying pans, with long handles pointing along the shelf.
 for(let i=0;i<3;i++){
  cylinder(.17,.59+i*.035,.01,.12,.03,black);
  box(.335,.598+i*.035,.01,.17,.018,.027,black);
 }
 // Storage jars with visible contents and screw-top lids.
 const glass=new T.MeshPhysicalMaterial({color:'#e4ede4',transparent:true,opacity:.25,roughness:.15,depthWrite:false});
 for(let i=0;i<4;i++){
  const x=-.31+i*.205,h=[.22,.27,.19,.25][i];
  const contents=new T.MeshStandardMaterial({color:['#d5b773','#d8cbb0','#a66f45','#8d9b66'][i],roughness:.85});
  cylinder(x,.995+h*.38,0,.062,h*.72,contents);
  const jar=cylinder(x,.995+h/2,0,.072,h,glass);jar.castShadow=false;
  cylinder(x,1.005+h,0,.076,.023,lidMaterial);
 }
 // Plates, bowls and a utensil crock on the upper shelves.
 for(let i=0;i<6;i++)cylinder(-.23,1.432+i*.012,0,.135,.01,ceramic);
 for(let i=0;i<3;i++)mesh(new T.CylinderGeometry(.10,.055,.055,20),ceramic,.15,1.45+i*.047,0);
 cylinder(-.24,1.96,0,.085,.21,ceramic);
 for(let i=0;i<4;i++){
  const x=-.29+i*.033;
  box(x,2.115,0,.012,.26,.012,lidMaterial);
  const spoon=mesh(new T.SphereGeometry(1,10,8),lidMaterial,x,2.25,0);spoon.scale.set(.023,.035,.007);
 }
 pot(.20,1.85,.11,.17,steel);
 return rack;
}
