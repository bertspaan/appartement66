import * as T from 'three';
import {kitchen} from './kitchen-layout';

// RYTMISK 803.889.69: 598 × 471 mm, minimum recirculation height 715 mm.
// NYTTIG FIL 400 sits inside the motor housing; filtered air exits the upper slots.
export function addKitchenHood(parent:T.Group){
 const group=new T.Group();group.name='RYTMISK recirculating hood with NYTTIG FIL 400';
 group.position.set(kitchen.hobX,kitchen.worktopHeight+kitchen.hoodClearance,-3.77);parent.add(group);
 const steel=new T.MeshStandardMaterial({color:'#c0c7c6',metalness:.55,roughness:.29});
 const dark=new T.MeshStandardMaterial({color:'#3d4545',metalness:.3,roughness:.6});
 const filter=new T.MeshStandardMaterial({color:'#939c9a',metalness:.5,roughness:.55});
 const light=new T.MeshStandardMaterial({color:'#fff8dd',emissive:'#fff1cd',emissiveIntensity:.55,roughness:.3});
 function box(name:string,x:number,y:number,z:number,w:number,h:number,d:number,material:T.Material){
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 box('Rolled front fascia',0,.018,.2355,.598,.036,.471,steel);
 // Four folded sloping panels lead from the canopy to the narrow wall chimney.
 const lower=[[-.299,.036,0],[.299,.036,0],[.299,.036,.471],[-.299,.036,.471]];
 const upper=[[-.0835,.146,0],[.0835,.146,0],[.0835,.146,.169],[-.0835,.146,.169]];
 const vertices:number[]=[];
 for(let i=0;i<4;i++){
  const j=(i+1)%4;for(const p of [lower[i],upper[i],lower[j],lower[j],upper[i],upper[j]])vertices.push(...p);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();
 const canopy=new T.Mesh(geometry,steel);canopy.name='Folded steel canopy';canopy.castShadow=true;canopy.receiveShadow=true;group.add(canopy);
 box('Recirculation chimney',0,(.146+kitchen.hoodHeight)/2,.0845,.167,kitchen.hoodHeight-.146,.169,steel);
 // Visible side outlets, below the closed top, with no duct into the ceiling.
 for(const side of [-1,1])for(let i=0;i<5;i++)box('Filtered air outlet',side*.084,kitchen.hoodHeight-.025-i*.012,.089,.0015,.005,.112,dark);
 box('Chimney telescoping seam',0,.45,.170,.169,.003,.002,filter);
 for(const side of [-1,1]){
  box('Removable grease filter',side*.141,-.002,.238,.265,.004,.365,filter);
  for(let i=0;i<17;i++)box('Grease filter mesh',side*.141,-.0045,.066+i*.020,.250,.001,.0015,dark);
  for(let i=0;i<12;i++)box('Grease filter crosswire',side*.141-.115+i*.021,-.0048,.238,.001,.001,.345,dark);
  box('Filter release catch',side*.141,-.006,.391,.035,.008,.018,steel);
 }
 box('LED work light',0,-.004,.432,.23,.006,.023,light);
 for(let i=0;i<5;i++)box('Speed and light button',.13+i*.025,.019,.472,.015,.011,.003,dark);
 return group;
}
