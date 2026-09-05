import * as T from 'three';

// Confirmed width: 1.70 m; estimated depth 45 cm and height 84 cm.
// Local +Z is the open front; the back sits 2 cm off the exterior wall.
export function addTipToyCabinet(parent:T.Group){
 const cabinet=new T.Group();cabinet.name='Tip — toy cabinet with coloured crates';
 cabinet.position.set(4.415,0,2.30);
 cabinet.scale.x=1.70/1.80;cabinet.rotation.y=-Math.PI/2;parent.add(cabinet);
 const materials=new Map<string,T.MeshStandardMaterial>();
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){
  let material=materials.get(color);
  if(!material){material=new T.MeshStandardMaterial({color,roughness:.78});materials.set(color,material);}
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;p.add(mesh);return mesh;
 }
 const steel='#252c2b',wood='#c6a574';
 box(cabinet,0,.82,0,1.80,.04,.45,wood);
 // Individual boards, subtle grain streaks and the black rolling frame.
 for(let i=0;i<4;i++)box(cabinet,0,.8405,-.165+i*.11,1.79,.001,.002,'#a58356');
 for(const x of [-.87,-.435,0,.435,.87]){
  for(const z of [-.19,.19])box(cabinet,x,.435,z,.025,.73,.025,steel);
  for(const y of [.12,.45,.79])box(cabinet,x,y,0,.025,.025,.40,steel);
 }
 for(const y of [.12,.45,.79])for(const z of [-.19,.19])box(cabinet,0,y,z,1.76,.025,.025,steel);
 for(const x of [-.83,.83])for(const z of [-.17,.17]){
  const wheel=new T.Mesh(new T.CylinderGeometry(.045,.045,.032,12),materials.get(steel));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.055,z);cabinet.add(wheel);
 }
 const colors=['#ba7837','#258fc5','#e2bf25','#b17a3b','#e6c323','#bc4246','#205b4a','#a7b3b7'];
 for(let row=0;row<2;row++)for(let column=0;column<4;column++){
  const crate=new T.Group();crate.name='Open lattice toy crate';crate.position.set(-.65+column*.435,.145+row*.33,0);cabinet.add(crate);
  const color=colors[row*4+column];
  box(crate,0,.01,0,.40,.02,.36,color);
  for(const z of [-.18,.18]){
   for(const y of [.04,.13,.245])box(crate,0,y,z,.40,.018,.012,color);
   for(let i=0;i<9;i++)box(crate,-.19+i*.0475,.137,z,.012,.22,.012,color);
  }
  for(const x of [-.195,.195]){
   for(const y of [.04,.13,.245])box(crate,x,y,0,.012,.018,.36,color);
   for(let i=0;i<7;i++)box(crate,x,.137,-.165+i*.055,.012,.22,.012,color);
  }
  // Colourful blocks and books remain visible through the open fronts.
  for(let i=0;i<4;i++){
   const toy=box(crate,-.12+i*.08,.075+(i%2)*.03,0,.065,.10,.20,['#dc939d','#5ea68f','#e6c654','#819cc4'][i]);toy.rotation.y=(i-1)*.12;
  }
 }
 // Recognisable tabletop toys: a red seaplane and two small brick builds.
 const plane=new T.Group();plane.name='Red toy seaplane';plane.position.set(.32,.87,0);cabinet.add(plane);
 box(plane,0,.08,0,.07,.065,.24,'#e6e0c8');box(plane,0,.13,0,.32,.016,.065,'#d5443f');
 box(plane,0,.13,-.10,.012,.085,.045,'#d5443f');
 for(const x of [-.055,.055])box(plane,x,.025,0,.035,.03,.27,'#ede7d6');
 box(plane,0,.10,.04,.055,.04,.05,'#66898b');
 for(const x of [-.56,.62]){
  box(cabinet,x,.848,.02,.25,.012,.23,'#38895e');
  for(let i=0;i<6;i++)box(cabinet,x-.07+(i%3)*.07,.87+Math.floor(i/3)*.045,.01,.055,.04,.055,['#dfb827','#d8618c','#9668b7'][i%3]);
 }
 return cabinet;
}
