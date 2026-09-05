import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// H120: 43 cm wide, 10 cm high including feet; allow 35 cm overall depth.
export function addHegelH120(parent:T.Group,shelfHeight:number){
 const amp=new T.Group();amp.name='Hegel H120 — black';amp.position.set(0,shelfHeight,.075);parent.add(amp);
 const black=new T.MeshStandardMaterial({color:'#202224',roughness:.5,metalness:.35});
 const dark=new T.MeshStandardMaterial({color:'#090e12',roughness:.4});
 function box(x:number,y:number,z:number,w:number,h:number,d:number,mat:T.Material){
  const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;amp.add(m);return m;
 }
 const body=new T.Mesh(new RoundedBoxGeometry(.43,.08,.31,2,.003),black);body.position.y=.06;body.castShadow=true;body.receiveShadow=true;amp.add(body);
 for(const x of [-.17,.17])for(const z of [-.115,.115]){
  const foot=new T.Mesh(new T.CylinderGeometry(.018,.018,.02,12),dark);foot.position.set(x,.01,z);amp.add(foot);
 }
 for(const x of [-.165,.165]){
  const knob=new T.Mesh(new T.CylinderGeometry(.025,.025,.018,24),black);knob.rotation.x=Math.PI/2;knob.position.set(x,.059,.164);amp.add(knob);
 }
 box(0,.060,.156,.108,.031,.002,dark);
 const glow=new T.MeshStandardMaterial({color:'#a7d9f1',emissive:'#6faac8',emissiveIntensity:.35});
 // Small illuminated display marks, without a new texture download.
 for(let i=0;i<6;i++)box(-.04+i*.01,.065,.158,.006,.009,.001,glow);
 box(.033,.059,.158,.012,.012,.001,glow);
 const jack=new T.Mesh(new T.TorusGeometry(.004,.001,6,12),dark);jack.position.set(.202,.043,.156);amp.add(jack);
 for(let i=0;i<18;i++)box(-.17+i*.02,.1005,-.015,.006,.001,.11,dark);
 for(const x of [-.14,-.09,.09,.14])box(x,.048,-.164,.014,.014,.018,dark);
 return amp;
}
