import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Original S400: 365 × 180 × 240 mm, per Buchardt's detailed description.
// https://buchardtaudio.com/pages/s400-detailed-description
export function addBuchardtS400(parent:T.Group,shelfHeight:number){
 const speaker=new T.Group();speaker.name='Buchardt Audio S400 — black';
 speaker.position.set(0,shelfHeight,.035);parent.add(speaker);
 const black=new T.MeshStandardMaterial({color:'#202222',roughness:.7});
 const cone=new T.MeshStandardMaterial({color:'#404447',metalness:.45,roughness:.4});
 const rubber=new T.MeshStandardMaterial({color:'#121617',roughness:.88});
 const cabinet=new T.Mesh(new RoundedBoxGeometry(.18,.365,.24,3,.004),black);cabinet.position.y=.1825;cabinet.castShadow=true;cabinet.receiveShadow=true;speaker.add(cabinet);
 function disc(y:number,radius:number,depth:number,mat:T.Material){
  const mesh=new T.Mesh(new T.CircleGeometry(radius,48),mat);mesh.position.set(0,y,depth);speaker.add(mesh);
 }
 // S400's characteristic inverted layout: aluminium woofer above the waveguide.
 disc(.268,.076,.1205,rubber);disc(.268,.064,.121,cone);
 const surround=new T.Mesh(new T.TorusGeometry(.068,.006,10,48),rubber);surround.position.set(0,.268,.123);speaker.add(surround);
 const cap=new T.Mesh(new T.SphereGeometry(.024,24,16),cone);cap.scale.z=.22;cap.position.set(0,.268,.123);speaker.add(cap);
 disc(.095,.076,.121,rubber);disc(.095,.059,.1215,black);
 const tweeter=new T.Mesh(new T.SphereGeometry(.0094,20,12),rubber);tweeter.scale.z=.5;tweeter.position.set(0,.095,.126);speaker.add(tweeter);
 // Rear oval passive radiator, visible when looking behind the speaker.
 const radiator=new T.Mesh(new T.CircleGeometry(1,48),rubber);radiator.scale.set(.064,.105,1);radiator.rotation.y=Math.PI;radiator.position.set(0,.20,-.1205);speaker.add(radiator);
 return speaker;
}
