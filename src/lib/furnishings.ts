import * as T from 'three';
import {sketch} from './sketch-layout';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Approximate furniture dimensions in metres, to be checked against owned pieces.
function material(color:string,metalness=0){return new T.MeshStandardMaterial({color,roughness:metalness?.32:.72,metalness});}
function mesh(parent:T.Object3D,geometry:T.BufferGeometry,mat:T.Material,x=0,y=0,z=0){const o=new T.Mesh(geometry,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(parent:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){return mesh(parent,new T.BoxGeometry(w,h,d),material(color),x,y,z);}
function ball(parent:T.Object3D,x:number,y:number,z:number,r:number,color:string){return mesh(parent,new T.SphereGeometry(r,16,12),material(color),x,y,z);}
function rod(parent:T.Object3D,a:T.Vector3,b:T.Vector3,r:number,color:string){const o=mesh(parent,new T.CylinderGeometry(r,r,a.distanceTo(b),12),material(color,.3));o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}

export function addTipBed(parent:T.Group){
 const group=new T.Group();group.name='Tip — loft bunk with toys';group.position.set(3.96,0,2.37);parent.add(group);
 const wood='#d3b387',paint='#b8ced0';
 for(const x of [-.49,.49])for(const z of [-1,1])box(group,x,.94,z,.065,1.88,.065,wood);
 box(group,0,1.43,0,1.04,.14,2.10,wood);box(group,0,1.56,0,.94,.16,1.99,'#fff4e5');
 box(group,0,1.65,-.25,.95,.055,1.45,'#d7a36f');box(group,0,1.69,.72,.65,.11,.38,'#f9e6d2');
 for(const z of [-1,1])box(group,0,1.79,z,1.04,.23,.04,paint);
 box(group,.49,1.79,0,.04,.23,2.04,paint);
 // Guard with an access gap by the ladder at the foot of the bed.
 box(group,-.49,1.79,.23,.04,.23,1.55,paint);
 for(const z of [-.98,-.57])rod(group,new T.Vector3(-.82,.05,z),new T.Vector3(-.52,1.51,z),.027,wood);
 for(let i=0;i<6;i++){const y=.20+i*.24;box(group,-.82+.30*y/1.51,y,-.775,.11,.045,.44,wood);}
 // Rug, storage crates and low shelves underneath the raised mattress.
 box(group,0,.025,.05,.92,.025,1.84,'#91aaa0');
 box(group,.22,.48,.83,.44,.87,.26,wood);
 for(const y of [.12,.43,.73])box(group,.22,y,.80,.43,.035,.31,'#f1e2cc');
 for(const [x,z,c] of [[-.25,.66,'#d38e7d'],[.24,-.59,'#b7c9a0']] as const){box(group,x,.16,z,.35,.26,.40,c);box(group,x,.298,z,.28,.015,.32,'#625b52');}
 const colors=['#cf715c','#f0c661','#8aaebc','#8fab81'];
 for(let i=0;i<8;i++){const x=-.30+(i%3)*.19,z=-.18+Math.floor(i/3)*.17;const block=box(group,x,.10+(i===7?.13:0),z,.12,.12,.12,colors[i%4]);block.rotation.y=i*.42;}
 // Teddy bear and a small toy train, both visible in the play space.
 ball(group,.26,.29,.28,.14,'#b58960');ball(group,.26,.48,.28,.105,'#b58960');
 for(const x of [.18,.34])ball(group,x,.56,.28,.038,'#b58960');
 for(const x of [.22,.30])ball(group,x,.49,.185,.012,'#34302a');
 ball(group,.26,.45,.175,.04,'#e1c49a');
 for(let i=0;i<3;i++){box(group,-.26+i*.19,.09,-.71,.15,.10,.10,colors[i]);for(const x of [-.31+i*.19,-.21+i*.19])for(const z of [-.77,-.65])ball(group,x,.065,z,.028,'#455359');}
 return group;
}

export function addPiano(parent:T.Group){
 const group=new T.Group();group.name='Upright piano';group.position.set(-.153,0,.397);group.rotation.y=Math.atan2(sketch.bedroomFrontLeft[1]-sketch.bedroomFrontRight[1],sketch.bedroomFrontRight[0]-sketch.bedroomFrontLeft[0]);parent.add(group);
 const black='#25282a',wood='#36302b';
 box(group,0,.62,.09,1.35,1.22,.36,black);box(group,0,1.245,.09,1.39,.045,.40,wood);
 box(group,0,.755,-.17,1.35,.075,.29,black);box(group,0,.42,-.01,1.27,.55,.06,wood);
 for(const x of [-.64,.64])box(group,x,.39,-.21,.09,.73,.13,black);
 // 52 white keys and raised black keys in repeating piano groups.
 const keyWidth=1.20/52;
 for(let i=0;i<52;i++)box(group,-.60+(i+.5)*keyWidth,.803,-.235,keyWidth-.001,.018,.17,'#f6f1df');
 for(let i=0;i<51;i++)if(![2,6].includes(i%7))box(group,-.60+(i+1)*keyWidth,.82,-.19,keyWidth*.58,.03,.09,'#17191b');
 for(const x of [-.09,0,.09])mesh(group,new T.BoxGeometry(.035,.02,.12),material('#bda56a',.75),x,.075,-.19);
 box(group,0,1.02,-.105,.57,.25,.035,wood);
 // Stool stays on the living-room side, clear of the hallway opening.
 box(group,0,.49,-.67,.72,.10,.34,'#48413a');
 for(const x of [-.29,.29])for(const z of [-.78,-.56])box(group,x,.245,z,.04,.44,.04,black);
 return group;
}

export function addLamps(parent:T.Group){
 const group=new T.Group();group.name='Lamps';parent.add(group);
 const lights:T.Light[]=[];const bulbs:T.MeshStandardMaterial[]=[];
 function glow(){const m=new T.MeshStandardMaterial({color:'#fff4d7',emissive:'#ffd59a',emissiveIntensity:0,roughness:.4});bulbs.push(m);return m;}
 // Baby-blue articulated floor lamp, matching the reference silhouette.
 const floor=new T.Group();floor.name='Baby-blue articulated floor lamp';floor.position.set(-3.70,0,2.95);group.add(floor);
 const blue='#a8d2e9';mesh(floor,new T.CylinderGeometry(.18,.20,.045,32),material(blue,.35),0,.04,0);
 mesh(floor,new T.SphereGeometry(.075,20,12,0,Math.PI*2,0,Math.PI/2),material(blue,.35),0,.065,0);
 const joints=[[0,.14,0],[.30,.47,0],[-.035,.79,0],[.23,1.18,0],[-.13,1.68,0]].map(p=>new T.Vector3(...p as [number,number,number]));
 for(let i=0;i<joints.length-1;i++)rod(floor,joints[i],joints[i+1],.013,blue);
 for(const p of joints){const hinge=mesh(floor,new T.CylinderGeometry(.033,.033,.043,18),material(blue,.4),p.x,p.y,p.z);hinge.rotation.x=Math.PI/2;ball(floor,p.x,p.y,p.z-.025,.011,'#5b6972');}
 const head=new T.Group();head.position.copy(joints.at(-1)!);head.rotation.z=-.45;floor.add(head);
 rod(head,new T.Vector3(0,0,0),new T.Vector3(-.12,.025,0),.024,blue);
 mesh(head,new T.SphereGeometry(.115,28,18,0,Math.PI*2,0,Math.PI/2),material(blue,.35),-.17,.015,0);
 const rim=mesh(head,new T.TorusGeometry(.115,.006,8,32),material('#e6edf0',.5),-.17,.015,0);rim.rotation.x=Math.PI/2;
 const bulb=mesh(head,new T.SphereGeometry(.044,16,12),glow(),-.17,.009,0);bulb.castShadow=false;
 const spot=new T.SpotLight('#ffe3b5',0,6,Math.PI/3,.75,2);spot.position.set(-.17,-.025,0);head.add(spot);head.add(spot.target);spot.target.position.set(-.17,-1,0);lights.push(spot);
 // Kitchen island pendant.
 const pendant=new T.Group();pendant.name='Kitchen island pendant';pendant.position.set(-2.15,0,-2.2);group.add(pendant);
 rod(pendant,new T.Vector3(0,2.61,0),new T.Vector3(0,2.19,0),.006,'#454e52');
 mesh(pendant,new T.CylinderGeometry(.10,.25,.19,32,1,true),new T.MeshStandardMaterial({color:'#c4ad83',roughness:.7,side:T.DoubleSide}),0,2.15,0);
 mesh(pendant,new T.SphereGeometry(.06,16,12),glow(),0,2.10,0).castShadow=false;
 const diningLight=new T.PointLight('#ffe0ac',0,7,2);diningLight.position.set(0,2.025,0);pendant.add(diningLight);lights.push(diningLight);
 // Parent bedside lamp and Tip's warm wall light.
 box(group,1.55,.25,2.65,.40,.47,.40,'#b9936b');
 for(const [x,y,z,name] of [[1.55,.51,2.65,'Bedside lamp'],[4.48,1.68,.70,'Tip wall lamp']] as const){
  const lamp=new T.Group();lamp.name=name;lamp.position.set(x,y,z);group.add(lamp);
  mesh(lamp,new T.CylinderGeometry(.075,.10,.025,20),material('#b4a180'),0,.015,0);
  rod(lamp,new T.Vector3(0,.03,0),new T.Vector3(0,.19,0),.014,'#8c806d');
  mesh(lamp,new T.CylinderGeometry(.08,.14,.17,24,1,true),new T.MeshStandardMaterial({color:name==='Tip wall lamp'?'#dfaf7c':'#ede4ce',roughness:.8,side:T.DoubleSide}),0,.23,0);
  mesh(lamp,new T.SphereGeometry(.035,12,10),glow(),0,.20,0).castShadow=false;
  const l=new T.PointLight('#ffd6a1',0,4,2);l.position.set(0,.19,-.08);lamp.add(l);lights.push(l);
 }
 return {group,setEvening(evening:boolean){lights.forEach((l,i)=>l.intensity=evening?[36,65,12,10][i]:0);bulbs.forEach(m=>m.emissiveIntensity=evening?1.8:0);}};
}

export function addKitchenIsland(parent:T.Group){
 const group=new T.Group();group.name='Kitchen island';group.position.set(-2.15,0,-2.2);parent.add(group);
 // Approximate 1.60 × 0.90 m island, 92 cm worktop height.
 box(group,0,.06,0,1.40,.12,.70,'#4a4842');
 box(group,0,.50,0,1.50,.76,.80,'#b89d79');
 box(group,0,.90,0,1.60,.04,.90,'#e2ddd1');
 // Cabinet fronts and a drawer beneath the worktop, facing the living room.
 for(const x of [-.50,0,.50]){
  box(group,x,.40,.409,.488,.55,.025,'#c6ac86');
  box(group,x,.775,.409,.488,.18,.025,'#c6ac86');
  box(group,x,.815,.43,.22,.015,.022,'#565950');
  box(group,x,.645,.43,.22,.015,.022,'#565950');
 }
 return group;
}


export function addFestEdgeSofa(parent:T.Group){
 // FEST Edge 3-seater: W254 × D103 × H71 cm; seat height 43 cm,
 // seat depth 62 cm. Upholstery and seam details are an approximation.
 // Source: https://www.festamsterdam.com/products/edge-3-zits-bank
 const group=new T.Group();group.name='FEST Edge 3-seater — anthracite';
 // Back and end sit 2 cm clear of the bedroom wall and window facade.
 group.position.set(sketch.bedroomFrontLeft[0]-.585,0,2.50);group.rotation.y=Math.PI/2;parent.add(group);
 const fabric=new T.MeshPhysicalMaterial({color:'#373b3e',roughness:.95,sheen:.45,sheenColor:'#5b6063',sheenRoughness:.85});
 const seam=new T.MeshStandardMaterial({color:'#505558',roughness:1});
 function cushion(x:number,y:number,z:number,w:number,h:number,d:number,r=.022){return mesh(group,new RoundedBoxGeometry(w,h,d,3,r),fabric,x,y,z);}
 for(const x of [-1.12,1.12])for(const z of [-.37,.37])box(group,x,.021,z,.08,.042,.08,'#16191a');
 // Two upholstered modules, with a narrow central join.
 for(const x of [-.637,.637])cushion(x,.155,0,1.266,.226,1.01,.012);
 for(const x of [-1.165,1.165])cushion(x,.295,0,.21,.51,1.03,.025);
 for(const x of [-.532,.532]){
  cushion(x,.3475,-.195,1.056,.165,.62,.025);
  cushion(x,.51,.305,1.056,.40,.42,.027);
  // Visible stitched outlines just inside the seat and back cushions.
  const points=[[-.516,-.295],[.516,-.295],[.516,.295],[-.516,.295],[-.516,-.295]].map(([px,pz])=>new T.Vector3(x+px,.422,-.195+pz));
  const outline=new T.CurvePath<T.Vector3>();
  for(let i=0;i<points.length-1;i++)outline.add(new T.LineCurve3(points[i],points[i+1]));
  mesh(group,new T.TubeGeometry(outline,40,.002,5,false),seam);
 }
 return group;
}

export function addColumnBookshelves(parent:T.Group){
 // Source columns: x=-4.66 interior face, z=[-1.522,-.986] and [1.134,1.670].
 // Keep the 52 cm cabinets inside each 53.6 cm pier, clear of adjacent glazing.
 const group=new T.Group();group.name='Custom living-room bookshelves';parent.add(group);
 const oak='#c5a47c',edge='#d6b990';
 for(const [index,z] of [-1.254,1.402].entries()){
  const cabinet=new T.Group();cabinet.name=`Column bookshelf ${index+1}`;
  cabinet.position.set(-4.505,0,z);cabinet.rotation.y=Math.PI/2;group.add(cabinet);
  box(cabinet,0,1.25,-.14,.52,2.50,.02,oak);
  for(const x of [-.248,.248])box(cabinet,x,1.25,0,.024,2.50,.30,edge);
  box(cabinet,0,.045,0,.47,.09,.27,oak);
  for(const y of [.10,.48,.88,1.28,1.68,2.08,2.488])box(cabinet,0,y,0,.472,.024,.30,edge);
  // Closed storage at the bottom, open adjustable shelves above.
  box(cabinet,0,.29,.151,.466,.35,.022,oak);
  box(cabinet,0,.425,.168,.10,.012,.015,'#675c4e');
  const colors=['#627e84','#b46752','#e4d8bb','#555f53','#bda15e','#796a80'];
  for(let row=0;row<5;row++){
   const shelf=.492+row*.40;
   if(row===2){
    // A short horizontal stack and a ceramic bowl.
    for(let i=0;i<3;i++)box(cabinet,-.105,shelf+.018+i*.035,0,.21,.032,.19,colors[(i+index)%6]);
    mesh(cabinet,new T.SphereGeometry(.064,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2),material('#d3b8a0'),.13,shelf+.065,.025);
   }else{
    for(let i=0;i<7;i++){
     const height=.21+((i*3+row+index)%5)*.019;
     const x=-.194+i*.053;
     box(cabinet,x,shelf+height/2,.005,.042,height,.205,colors[(i+row+index)%6]);
     box(cabinet,x,shelf+height-.045,.109,.027,.006,.002,'#e9deca');
    }
   }
  }
 }
 return group;
}

export function addKitchenAppliances(parent:T.Group){
 const group=new T.Group();group.name='Kitchen appliances';parent.add(group);
 // Complete the source induction cooking position with an oven below it.
 // Its front covers the existing cabinet face; the source hob stays visible.
 const oven=new T.Group();oven.name='Oven below induction hob';oven.position.set(-2.515,0,-3.15);group.add(oven);
 box(oven,0,.48,0,.59,.76,.04,'#33383a');
 box(oven,0,.79,.025,.57,.12,.012,'#bbc0c1');
 box(oven,0,.43,.027,.50,.49,.015,'#151c20');
 box(oven,0,.43,.037,.39,.32,.008,'#29383f');
 box(oven,0,.685,.065,.43,.025,.035,'#c5c8c7');
 for(const x of [-.20,.20]){const knob=mesh(oven,new T.CylinderGeometry(.024,.024,.018,20),material('#434a4d',.5),x,.79,.045);knob.rotation.x=Math.PI/2;}
 box(oven,0,.79,.033,.12,.038,.009,'#172625');
 for(let i=0;i<5;i++)box(oven,-.16+i*.08,.15,.025,.055,.009,.008,'#171d20');
 // Standard 60 cm fridge-freezer beside the source kitchen run; sizes provisional.
 const fridge=new T.Group();fridge.name='Fridge-freezer';fridge.position.set(-3.23,0,-3.44);group.add(fridge);
 box(fridge,0,1.005,0,.60,2.01,.65,'#c1c5c3');
 box(fridge,0,.055,.02,.53,.10,.57,'#414747');
 box(fridge,0,.43,.336,.585,.70,.035,'#d7dad6');
 box(fridge,0,1.395,.336,.585,1.20,.035,'#d7dad6');
 box(fridge,-.235,.69,.38,.025,.19,.045,'#818b8c');
 box(fridge,-.235,.96,.38,.025,.25,.045,'#818b8c');
 return group;
}
