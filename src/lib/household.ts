import * as T from 'three';
import {sketch} from './sketch-layout';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Photo-based approximations; dimensions are provisional, in metres.
function material(color:string,metalness=0){return new T.MeshStandardMaterial({color,metalness,roughness:metalness?.32:.9});}
function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){const m=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,.004),material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
function ellipsoid(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){const m=new T.Mesh(new T.SphereGeometry(1,20,12),material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;p.add(m);return m;}
function cylinder(p:T.Object3D,x:number,y:number,z:number,r:number,h:number,color:string,metalness=0){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,24),material(color,metalness));m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;}
function rod(p:T.Object3D,a:T.Vector3,b:T.Vector3,r:number,color:string){const m=cylinder(p,0,0,0,r,a.distanceTo(b),color);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m;}
export function addOwnedBed(parent:T.Group){
 const bed=new T.Group();bed.name='Pine bed from photograph';bed.position.set(.50,0,2.48);parent.add(bed);
 const pine='#c49c69';
 for(const x of [-.79,.79])for(const z of [-1,1]){
  box(bed,x,.29,z,.14,.58,.14,pine);
  for(const y of [.38,.52]){const bolt=cylinder(bed,x,y,z+Math.sign(z)*.073,.012,.007,'#a5aaab',.8);bolt.rotation.x=Math.PI/2;}
 }
 for(const x of [-.77,.77])box(bed,x,.425,0,.10,.29,1.94,pine);
 for(const z of [-.98,.98])box(bed,0,.425,z,1.48,.29,.10,pine);
 for(let i=0;i<14;i++)box(bed,0,.40,-.90+i*.138,1.47,.035,.08,'#d4b98f');
 box(bed,0,.57,0,1.47,.24,1.91,'#eeeae0');
 box(bed,0,.699,0,1.48,.018,1.92,'#f6f2e9');
 // Mattress piping and subtle quilting, without pillows or bedding.
 for(const x of [-.738,.738])box(bed,x,.48,0,.007,.012,1.89,'#d7d2c8');
 for(let i=0;i<8;i++)box(bed,0,.709,-.81+i*.23,1.43,.002,.003,'#e4e0d7');
 // Small wood knots in the exposed footboard.
 for(const x of [-.57,-.20,.36]){const knot=ellipsoid(bed,x,.44,-1.033,.025,.010,.002,'#aa8052');knot.rotation.z=.3;}
 // Head end against the diagonal wall, on the solid section before the doorway.
 bed.position.set(0,0,0);bed.rotation.set(0,0,0);
 const bounds=new T.Box3().setFromObject(bed);
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight;
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
 const offset=bounds.max.z+.07;
 bed.rotation.y=Math.PI-Math.atan2(dz,dx);
 bed.position.set(a[0]+dx/length*.96-dz/length*offset,0,a[1]+dz/length*.96+dx/length*offset);
 return bed;
}
export function addCounterAppliances(parent:T.Group){
 const group=new T.Group();group.name='Owned countertop appliances';parent.add(group);
 const coffee=new T.Group();coffee.name='Rancilio espresso machine';coffee.position.set(-1.91,.95,-3.46);group.add(coffee);
 box(coffee,0,.015,0,.24,.03,.29,'#a9b0b1');
 box(coffee,0,.16,-.115,.24,.29,.055,'#aeb4b4');
 for(const x of [-.115,.115])box(coffee,x,.17,0,.012,.31,.28,'#abb2b3');
 box(coffee,0,.245,-.008,.24,.19,.25,'#bfc4c3');
 box(coffee,0,.347,-.01,.24,.016,.27,'#949c9e');
 for(let i=0;i<3;i++)box(coffee,-.087,.30-i*.037,.122,.023,.027,.009,'#232a2b');
 box(coffee,-.015,.296,.123,.025,.03,.009,'#252b2a');
 box(coffee,.012,.296,.124,.009,.032,.009,'#c28e3c');
 const knob=cylinder(coffee,.079,.194,.133,.024,.016,'#252b2c');knob.rotation.x=Math.PI/2;
 cylinder(coffee,-.025,.145,.055,.041,.025,'#292c2d');
 rod(coffee,new T.Vector3(-.025,.132,.06),new T.Vector3(-.025,.104,.24),.014,'#202426');
 rod(coffee,new T.Vector3(.085,.16,.10),new T.Vector3(.095,.048,.14),.004,'#bec6c7');
 for(let i=0;i<10;i++)box(coffee,-.095+i*.021,.036,.035,.008,.005,.18,'#50595b');
 cylinder(coffee,-.035,.36,-.01,.032,.015,'#b6babc',.7);
 cylinder(coffee,-.035,.391,-.01,.016,.047,'#23292b');
 const kettle=new T.Group();kettle.name='Red ribbed kettle';kettle.position.set(-1.43,.95,-3.47);group.add(kettle);
 cylinder(kettle,0,.13,0,.079,.25,'#b8323c');
 for(let i=0;i<28;i++){const a=i*Math.PI*2/28;rod(kettle,new T.Vector3(Math.cos(a)*.077,.025,Math.sin(a)*.077),new T.Vector3(Math.cos(a)*.077,.242,Math.sin(a)*.077),.003,'#c23e48');}
 cylinder(kettle,0,.263,0,.069,.018,'#b6313c');cylinder(kettle,0,.285,0,.018,.035,'#b6313c');
 box(kettle,.115,.222,0,.09,.033,.034,'#b8323c');box(kettle,.148,.14,0,.035,.18,.034,'#b8323c');
 const shape=new T.Shape();shape.moveTo(-.055,.17);shape.lineTo(-.118,.249);shape.lineTo(-.055,.235);shape.closePath();
 const spout=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.033,bevelEnabled:false}),material('#b8323c'));spout.position.z=-.0165;kettle.add(spout);
 return group;
}
export function addTipAnimals(parent:T.Group){
 const group=new T.Group();group.name='Tip stuffed animals from photographs';group.position.set(3.96,.035,2.37);parent.add(group);
 const dog=new T.Group();dog.name='Black dog with colourful sweater';dog.position.set(-.15,.04,-.34);group.add(dog);
 ellipsoid(dog,0,.14,0,.13,.13,.25,'#181c22');
 ellipsoid(dog,0,.18,-.28,.13,.11,.16,'#151a21');
 for(const x of [-.11,.11]){ellipsoid(dog,x,.15,-.18,.052,.032,.11,'#151a21');for(const z of [-.13,.17])ellipsoid(dog,x,.06,z,.068,.047,.083,'#151a21');}
 for(const x of [-.052,.052]){ellipsoid(dog,x,.238,-.34,.021,.009,.019,'#ecece5');ellipsoid(dog,x,.246,-.345,.009,.004,.01,'#171b22');}
 ellipsoid(dog,0,.18,-.422,.039,.026,.015,'#11161c');
 // Raised bands follow the knitted sweater silhouette.
 const colors=['#e2dac8','#b73940','#e2dac8','#6a9dac','#d4b461','#e2dac8','#528a81','#714855'];
 for(let i=0;i<12;i++)ellipsoid(dog,0,.14,-.11+i*.022,.135,.133,.016,colors[i%colors.length]);
 rod(dog,new T.Vector3(0,.17,.20),new T.Vector3(.06,.23,.36),.019,'#181c22');
 const kangaroo=new T.Group();kangaroo.name='Kangaroo with pouch and little owl';kangaroo.position.set(.18,0,.29);group.add(kangaroo);
 ellipsoid(kangaroo,0,.22,0,.11,.16,.09,'#bca889');ellipsoid(kangaroo,0,.44,-.015,.075,.094,.066,'#c8b694');
 for(const x of [-.067,.067]){const ear=ellipsoid(kangaroo,x,.535,0,.025,.080,.017,'#c7b491');ear.rotation.z=-Math.sign(x)*.40;ellipsoid(kangaroo,x,.535,-.014,.015,.056,.005,'#81948e');ellipsoid(kangaroo,x,.052,-.04,.04,.045,.11,'#bca889');rod(kangaroo,new T.Vector3(x,.31,0),new T.Vector3(x*1.9,.37,-.025),.022,'#bca889');}
 ellipsoid(kangaroo,0,.427,-.075,.037,.026,.025,'#ab9676');
 for(const x of [-.028,.028])ellipsoid(kangaroo,x,.472,-.071,.006,.007,.004,'#333735');
 ellipsoid(kangaroo,0,.20,-.075,.082,.078,.038,'#96a9a1');
 ellipsoid(kangaroo,0,.29,-.087,.042,.052,.030,'#ded4bb');
 for(const x of [-.018,.018]){ellipsoid(kangaroo,x,.308,-.112,.016,.018,.007,'#f1eadb');ellipsoid(kangaroo,x,.308,-.119,.007,.008,.003,'#302e27');}
 // A grey rabbit and blue-green soft globe beside the larger animals.
 const rabbit=new T.Group();rabbit.name='Grey rabbit';rabbit.position.set(-.25,.02,.63);group.add(rabbit);
 ellipsoid(rabbit,0,.13,0,.09,.12,.075,'#b6bec4');ellipsoid(rabbit,0,.27,-.01,.075,.07,.066,'#b6bec4');
 for(const x of [-.034,.034]){ellipsoid(rabbit,x,.38,0,.023,.09,.021,'#b6bec4');ellipsoid(rabbit,x,.38,-.017,.013,.06,.005,'#d6b4b8');ellipsoid(rabbit,x,.28,-.071,.006,.008,.004,'#333b40');}
 ellipsoid(rabbit,0,.258,-.079,.013,.01,.007,'#d2a3af');
 const globe=ellipsoid(group,.24,.16,-.74,.115,.115,.115,'#347aa9');globe.name='Blue-green soft globe';
 for(let i=0;i<7;i++){const a=i*2.4;ellipsoid(group,.24+Math.cos(a)*.092,.16+Math.sin(a)*.07,-.80,.028,.034,.018,'#71a769');}
 return group;
}

export function addDiningTable(parent:T.Group){
 // User's 2 m table, with estimated 85 cm width and 76 cm height.
 // Shifted 50 cm toward the window-side balcony for more piano-side walking space.
 const table=new T.Group();table.name='Owned wooden dining table';table.position.set(-2.65,0,-.825);parent.add(table);
 const wood='#b6884e',edge='#a57b47';
 for(let i=0;i<4;i++)box(table,-.31875+i*.2125,.74,0,.2105,.04,2,wood);
 for(const x of [-.37,.37])box(table,x,.65,0,.035,.14,1.88,edge);
 for(const z of [-.94,.94])box(table,0,.65,z,.75,.14,.035,edge);
 for(const x of [-.365,.365])for(const z of [-.91,.91])box(table,x,.315,z,.075,.63,.075,wood);
 // A few small everyday objects, leaving most of the table usable.
 cylinder(table,-.21,.819,-.70,.063,.118,'#ac703b');
 for(let i=0;i<7;i++){
  const a=i*2.4;
  rod(table,new T.Vector3(-.21,.87,-.70),new T.Vector3(-.21+Math.sin(a)*.08,.99+(i%3)*.05,-.70+Math.cos(a)*.07),.003,'#496247');
  const leaf=ellipsoid(table,-.21+Math.sin(a)*.08,.99+(i%3)*.05,-.70+Math.cos(a)*.07,.025,.07,.018,'#446a44');leaf.rotation.z=Math.sin(a)*.6;
 }
 ellipsoid(table,.17,.79,-.44,.052,.033,.044,'#6d8983');cylinder(table,.17,.825,-.44,.014,.04,'#6d8983');
 rod(table,new T.Vector3(.17,.84,-.44),new T.Vector3(.19,1.0,-.43),.002,'#617455');
 cylinder(table,.19,.807,.53,.035,.09,'#b7353b');
 const handle=new T.Mesh(new T.TorusGeometry(.023,.006,8,20),material('#b7353b'));handle.position.set(.235,.811,.53);table.add(handle);
 box(table,-.16,.767,.49,.22,.012,.29,'#f2e5cf');
 for(let i=0;i<3;i++)rod(table,new T.Vector3(-.23,.776,.43+i*.036),new T.Vector3(-.10,.776,.46+i*.025),.002,['#709b8a','#ca9767','#a685aa'][i]);
 rod(table,new T.Vector3(-.21,.781,.58),new T.Vector3(-.07,.781,.60),.003,'#d7ad4f');
 // Four mixed chairs, two on each long side.
 for(const [side,z,color] of [[-1,-.50,'#9b926e'],[-1,.43,'#b96c65'],[1,-.50,'#9b926e'],[1,.43,'#b96c65']] as const){
  const chair=new T.Group();chair.name='Dining chair';chair.position.set(side*.68,0,z);chair.rotation.y=-side*Math.PI/2;table.add(chair);
  box(chair,0,.45,0,.42,.035,.40,color);
  for(const x of [-.17,.17])for(const depth of [-.16,.16])rod(chair,new T.Vector3(x,.02,depth),new T.Vector3(x,.44,depth),.017,color);
  for(const x of [-.17,.17])rod(chair,new T.Vector3(x,.45,-.17),new T.Vector3(x,.91,-.19),.016,color);
  for(let i=0;i<5;i++)rod(chair,new T.Vector3(-.14+i*.07,.48,-.18),new T.Vector3(-.14+i*.07,.86,-.19),.009,color);
  box(chair,0,.90,-.19,.43,.09,.035,color);
 }
 // Photo-based custom-painted Stokke: lime frame, two pinks, black crossbars.
 const stokke=new T.Group();stokke.name='Custom lime and pink Stokke chair';
 stokke.position.set(0,0,1.26);stokke.rotation.y=Math.PI;table.add(stokke);
 const lime='#c5d74a',palePink='#e7bed8',pink='#ca81b5';
 for(const x of [-.225,.225]){
  box(stokke,x,.025,0,.045,.05,.53,lime);
  // Slanted flat uprights rather than round chair legs.
  const upright=box(stokke,x,.445,-.02,.045,.89,.065,lime);upright.rotation.x=-.28;
  for(let j=0;j<11;j++){
   const y=.18+j*.036,z=.10-(y-.18)*.285;
   box(stokke,x-Math.sign(x)*.024,y,z,.007,.009,.071,'#a8bc38');
  }
  for(const y of [.16,.36,.70]){
   const bolt=cylinder(stokke,x+Math.sign(x)*.026,y,.10-(y-.18)*.285,.008,.004,'#3f4540',.5);bolt.rotation.z=Math.PI/2;
  }
 }
 box(stokke,0,.545,.025,.425,.025,.30,palePink);
 box(stokke,0,.295,.095,.425,.026,.37,pink);
 box(stokke,0,.77,-.10,.42,.095,.025,pink);
 box(stokke,0,.87,-.13,.42,.095,.025,palePink);
 for(const y of [.13,.40])rod(stokke,new T.Vector3(-.22,y,.03),new T.Vector3(.22,y,.03),.007,'#333b37');
 // Finger slots at the leading edge of the adjustable boards.
 box(stokke,.105,.559,.125,.033,.002,.008,'#8c6a7d');
 box(stokke,.105,.309,.24,.033,.002,.008,'#865774');
 return table;
}
