import * as T from 'three';

// Photo-based cardboard playhouse; dimensions estimated from the reference.
export function addCardboardHouse(parent:T.Group){
 const house=new T.Group();house.name='Tip cardboard playhouse';
 // Against the window between the sofa and armchair, with the little window facing the room.
 house.position.set(-3.05,.025,3.89);house.rotation.y=Math.PI;house.scale.setScalar(2/3);parent.add(house);
 const card=new T.MeshStandardMaterial({color:'#af854b',roughness:1});
 const flapCard=new T.MeshStandardMaterial({color:'#c19b65',roughness:1});
 const tape=new T.MeshStandardMaterial({color:'#d2bc8d',roughness:.55});
 const crease=new T.MeshStandardMaterial({color:'#8d6d44',roughness:1});
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material){
  const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;
 }
 function panel(width:number,height:number,hole?:[number,number,number,number]){
  const shape=new T.Shape();shape.moveTo(-width/2,0);shape.lineTo(width/2,0);shape.lineTo(width/2,height);shape.lineTo(-width/2,height);shape.closePath();
  if(hole){const [x,y,w,h]=hole;const cut=new T.Path();cut.moveTo(x,y);cut.lineTo(x,y+h);cut.lineTo(x+w,y+h);cut.lineTo(x+w,y);cut.closePath();shape.holes.push(cut);}
  const mesh=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.007,bevelEnabled:false}),card);mesh.castShadow=true;mesh.receiveShadow=true;house.add(mesh);return mesh;
 }
 const front=panel(.84,1.16,[-.16,.48,.31,.39]);front.position.z=.417;
 panel(.84,1.16).position.z=-.424;
 const left=panel(.84,1.16,[-.22,.008,.44,.84]);left.rotation.y=-Math.PI/2;left.position.x=-.417;
 const right=panel(.84,1.16);right.rotation.y=Math.PI/2;right.position.x=.417;
 // Three-sided cut flap opens out from the front window, with rough corrugated edges.
 const shutter=new T.Group();shutter.position.set(-.16,.48,.428);shutter.rotation.y=-.78;house.add(shutter);
 box(shutter,.153,.193,0,.306,.386,.007,flapCard);
 for(let i=0;i<38;i++)box(shutter,.307,.006+i*.010,0,.003,.004,.008,crease);
 // A loose string tied to the window flap.
 const stringCurve=new T.CatmullRomCurve3([new T.Vector3(.28,.05,.013),new T.Vector3(.31,-.02,.015),new T.Vector3(.27,-.18,.025),new T.Vector3(.30,-.29,.025)]);
 shutter.add(new T.Mesh(new T.TubeGeometry(stringCurve,18,.0025,5,false),tape));
 // Uneven box flaps form a wonky, partly open roof.
 function roof(x:number,z:number,rotation:number,tilt:number,width:number,depth:number){
  const hinge=new T.Group();hinge.position.set(x,1.16,z);hinge.rotation.y=rotation;house.add(hinge);
  const fold=new T.Group();fold.rotation.x=tilt;hinge.add(fold);
  box(fold,0,0,depth/2,width,.007,depth,flapCard);
  for(const offset of [-.24,.10])box(fold,offset,.0045,depth/2,.002,.001,depth,crease);
  box(fold,-.12,.005,depth/2,.055,.001,depth,tape);
 }
 roof(0,-.42,0,-.22,.84,.36);
 roof(0,.42,Math.PI,.12,.84,.26);
 roof(-.42,0,-Math.PI/2,.45,.83,.40);
 roof(.42,0,Math.PI/2,-.30,.83,.22);
 for(const x of [-.407,.407])box(house,x,.58,.425,.024,1.14,.001,tape);
 // Folds, a shipping label and a few pencil scribbles retain the improvised look.
 box(house,.27,1.10,.426,.14,.055,.001,new T.MeshStandardMaterial({color:'#dfd6bb',roughness:1}));
 for(let i=0;i<10;i++)box(house,.22+i*.01,1.10,.427,.003,.037,.001,crease);
 for(let i=0;i<3;i++){
  const path=new T.CatmullRomCurve3(Array.from({length:14},(_,j)=>new T.Vector3(-.28+j*.028,1.00+i*.028+Math.sin(j*.9+i)*.012,.426)));
  house.add(new T.Mesh(new T.TubeGeometry(path,20,.0008,4,false),crease));
 }
 return house;
}
