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
 // Small toy train alongside the photo-based stuffed animals.
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
 box(group,1.55,.25,3.43,.40,.47,.40,'#b9936b');
 for(const [x,y,z,name] of [[1.55,.51,3.43,'Bedside lamp'],[4.48,1.68,.70,'Tip wall lamp']] as const){
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
 // Approximate 1.20 × 0.75 m island, 92 cm worktop height.
 box(group,0,.06,0,1.00,.12,.55,'#4a4842');
 box(group,0,.50,0,1.10,.76,.65,'#b89d79');
 box(group,0,.90,0,1.20,.04,.75,'#e2ddd1');
 // Cabinet fronts and a drawer beneath the worktop, facing the living room.
 for(const x of [-.275,.275]){
  box(group,x,.40,.334,.538,.55,.025,'#c6ac86');
  box(group,x,.775,.334,.538,.18,.025,'#c6ac86');
  box(group,x,.815,.355,.22,.015,.022,'#565950');
  box(group,x,.645,.355,.22,.015,.022,'#565950');
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

export function addNordElectro(parent:T.Group){
 const group=new T.Group();group.name='Nord Electro with monitor speakers';
 group.position.set(-.153,0,.397);group.rotation.y=Math.atan2(sketch.bedroomFrontLeft[1]-sketch.bedroomFrontRight[1],sketch.bedroomFrontRight[0]-sketch.bedroomFrontLeft[0]);parent.add(group);
 // Official case dimensions: 1066 × 104 × 294 mm. Stand and stool are approximate.
 // https://www.nordkeyboards.com/products/nord-electro-7/specifications/
 const red='#bc2635',black='#25292b';
 for(const z of [-.10,.10]){
  rod(group,new T.Vector3(-.36,.04,z),new T.Vector3(.34,.70,z),.018,black);
  rod(group,new T.Vector3(.36,.04,z),new T.Vector3(-.34,.70,z),.018,black);
 }
 for(const x of [-.36,.36]){box(group,x,.025,0,.07,.04,.43,black);box(group,x,.69,0,.05,.025,.30,black);}
 box(group,0,.742,0,1.066,.084,.294,red);
 for(const x of [-.521,.521])box(group,x,.752,0,.024,.104,.294,'#aa2632');
 // 43 white keys and 30 black keys: E–E over six octaves.
 const keyWidth=.98/43;
 for(let i=0;i<43;i++)box(group,-.49+(i+.5)*keyWidth,.780,-.065,keyWidth-.001,.02,.154,'#f5f3e9');
 for(let i=0;i<42;i++)if([1,2,4,5,6].includes(i%7))box(group,-.49+(i+1)*keyWidth,.795,-.027,keyWidth*.58,.018,.08,'#16191b');
 box(group,0,.788,.088,.95,.01,.094,red);
 box(group,.03,.796,.09,.072,.004,.044,'#243943');
 for(let i=0;i<9;i++){box(group,-.43+i*.019,.797,.094,.009,.01,.043,black);box(group,-.43+i*.019,.805,.077+(i%3)*.009,.015,.007,.01,i<3?'#e3dbca':'#26292a');}
 for(let i=0;i<15;i++){const knob=mesh(group,new T.CylinderGeometry(.007,.007,.012,12),material(black),-.19+(i%8)*.086,.801,.067+Math.floor(i/8)*.047);knob.name='Control knob';}
 box(group,0,.48,-.55,.55,.08,.30,black);
 for(const x of [-.22,.22])for(const z of [-.65,-.45])box(group,x,.23,z,.03,.42,.03,black);
 box(group,.12,.035,-.32,.065,.045,.15,black);
 // Compact nearfield monitors on separate stands, facing the player.
 // Keep the right-hand stand inside the translucent-wall clearance.
 for(const x of [-.66,.66]){
  const speaker=new T.Group();speaker.name=x<0?'Left monitor on stand':'Right monitor on stand';
  speaker.position.set(x,0,.04);group.add(speaker);
  box(speaker,0,.02,0,.20,.04,.24,black);
  rod(speaker,new T.Vector3(0,.04,0),new T.Vector3(0,.99,0),.017,'#43494d');
  box(speaker,0,.99,0,.17,.02,.19,black);
  box(speaker,0,1.14,0,.17,.28,.19,'#303639');
  for(const [y,r] of [[1.085,.055],[1.225,.022]]){
   const cone=mesh(speaker,new T.CylinderGeometry(r,r*.78,.012,24),material('#171d20'),0,y,-.101);
   cone.rotation.x=Math.PI/2;
   const rim=mesh(speaker,new T.TorusGeometry(r,.004,8,24),material('#566168'),0,y,-.109);
   ball(speaker,0,y,-.113,r*.32,'#343e43');
  }
  ball(speaker,.057,1.027,-.097,.003,'#8ebbb2');
 }
 return group;
}

export function addTipTeenRoom(parent:T.Group){
 const group=new T.Group();group.name='Tip — teenage room';parent.add(group);
 const oak='#bd9c76',sage='#8eaaa1',dark='#333e46';
 // Single bed along the same wall as the childhood loft bed.
 box(group,3.96,.24,2.37,1.04,.28,2.10,oak);
 box(group,3.96,.45,2.37,.96,.20,2.01,'#eee9df');
 box(group,3.96,.58,2.18,.97,.10,1.56,sage);
 box(group,3.96,.60,3.12,.68,.14,.38,'#e6d8be');
 box(group,4.46,.57,2.37,.05,.88,2.10,oak);
 for(const x of [3.52,4.40])for(const z of [1.43,3.31])box(group,x,.08,z,.07,.16,.07,dark);
 // Desk faces the bedroom divider; its footprint stays clear of the door.
 const desk=new T.Group();desk.name='Study desk with PlayStation';desk.position.set(2.32,0,2.16);desk.rotation.y=Math.PI/2;group.add(desk);
 box(desk,0,.75,0,1.25,.045,.60,oak);
 for(const x of [-.55,.55])for(const z of [-.23,.23])box(desk,x,.365,z,.035,.73,.035,dark);
 box(desk,.41,.54,.02,.31,.33,.49,'#d6d8ce');
 for(const y of [.46,.60])box(desk,.41,y,.271,.12,.013,.015,dark);
 // Monitor, controller and a stylised white PlayStation console.
 box(desk,-.15,.79,-.13,.25,.025,.17,dark);box(desk,-.15,.92,-.16,.035,.25,.035,dark);
 box(desk,-.15,1.115,-.16,.57,.34,.035,'#202a30');
 box(desk,-.15,1.115,-.139,.535,.302,.005,'#274d64');
 box(desk,-.15,1.115,-.135,.39,.014,.002,'#719dac');
 box(desk,-.15,1.06,-.135,.20,.006,.002,'#83a7b0');
 const consoleGroup=new T.Group();consoleGroup.name='PlayStation';consoleGroup.position.set(.45,.78,-.10);desk.add(consoleGroup);
 box(consoleGroup,0,.165,0,.052,.33,.17,'#222930');
 for(const x of [-.037,.037]){const panel=box(consoleGroup,x,.17,0,.017,.35,.185,'#eeeee9');panel.rotation.z=-Math.sign(x)*.045;}
 box(consoleGroup,-.028,.17,.088,.004,.28,.004,'#779fca');
 const pad=new T.Group();pad.name='Game controller';pad.position.set(.04,.80,.17);desk.add(pad);
 box(pad,0,.008,0,.11,.027,.055,'#e4e4df');
 for(const x of [-.053,.053]){const grip=ball(pad,x,-.004,.021,.023,'#e4e4df');grip.scale.set(.7,.65,1.3);ball(pad,x*.44,.025,.008,.008,'#252d32');}
 for(const [x,z] of [[.036,-.014],[.045,-.005],[.036,.004],[.027,-.005]])ball(pad,x,.026,z,.003,'#454b51');
 box(pad,-.035,.025,-.005,.021,.005,.007,'#252d32');box(pad,-.035,.026,-.005,.007,.005,.021,'#252d32');
 // Homework, pencils and headphones.
 box(desk,-.42,.787,.16,.22,.014,.16,'#eee5ce');
 rod(desk,new T.Vector3(-.48,.80,.15),new T.Vector3(-.34,.80,.18),.003,'#cc9c56');
 const phones=mesh(desk,new T.TorusGeometry(.057,.009,8,24,Math.PI),material('#485862'),-.42,.80,-.03);phones.rotation.x=Math.PI/2;
 for(const x of [-.477,-.363])box(desk,x,.803,-.03,.025,.026,.04,'#33434b');
 // Compact chair between desk and bed.
 box(group,2.97,.47,2.16,.43,.06,.43,dark);box(group,3.16,.76,2.16,.045,.52,.43,sage);
 rod(group,new T.Vector3(2.97,.08,2.16),new T.Vector3(2.97,.44,2.16),.026,dark);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;rod(group,new T.Vector3(2.97,.08,2.16),new T.Vector3(2.97+Math.cos(a)*.25,.04,2.16+Math.sin(a)*.25),.014,dark);}
 // Books and keepsakes on a shelf above the desk.
 box(group,2.13,1.65,2.16,.26,.035,1.18,oak);
 for(let i=0;i<9;i++)box(group,2.13,1.79+(i%3)*.013,1.72+i*.043,.19,.24+(i%3)*.026,.035,['#647e8b','#c8996d','#a16f6a','#d6c9a7'][i%4]);
 const pot=mesh(group,new T.CylinderGeometry(.065,.05,.11,16),material('#c49178'),2.13,1.72,2.59);
 for(let i=0;i<5;i++){const leaf=ball(group,2.13+Math.sin(i*2.4)*.045,1.83+(i%2)*.04,2.59+Math.cos(i*2.4)*.045,.045,'#66886c');leaf.scale.set(.45,1.5,.7);}
 // One childhood keepsake on the bed.
 ball(group,4.19,.70,3.05,.065,'#c1b394');ball(group,4.19,.79,3.05,.045,'#c1b394');
 for(const x of [4.16,4.22])ball(group,x,.83,3.05,.016,'#c1b394');
 return group;
}
