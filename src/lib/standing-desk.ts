import * as T from 'three';

// StandUp Nomad: birch plywood side frames, sliding uprights and open storage.
export function addStandingDesk(parent:T.Group){
 const desk=new T.Group();desk.name='StandUp Nomad with MacBook';
 // Opposite side of the same bookshelf, with 3 mm clearance and the working side facing away.
 desk.position.set(-4.55,0,.864);desk.rotation.y=Math.PI;parent.add(desk);
 const wood=new T.MeshStandardMaterial({color:'#dfc69c',roughness:.65});
 const edge=new T.MeshStandardMaterial({color:'#bd9d70',roughness:.7});
 const silver=new T.MeshStandardMaterial({color:'#b9bec1',metalness:.7,roughness:.3});
 const dark=new T.MeshStandardMaterial({color:'#23272b',roughness:.5});
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material){
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;p.add(mesh);return mesh;
 }
 function beam(x:number,ay:number,az:number,by:number,bz:number,width:number){
  const m=box(desk,x,(ay+by)/2,(az+bz)/2,.018,Math.hypot(by-ay,bz-az),width,wood);
  m.rotation.x=Math.atan2(bz-az,by-ay);return m;
 }
 for(const x of [-.265,.265]){
  // Open triangular feet and the diagonal telescoping upper leg.
  beam(x,.04,-.23,.67,.04,.085);beam(x,.04,.23,.67,.04,.085);
  box(desk,x,.09,0,.018,.065,.44,wood);
  beam(x+.023,.055,.235,1.005,-.15,.105);
  beam(x+.034,.08,.23,.36,.15,.009).material=edge;
  for(let i=0;i<5;i++){
   const pin=new T.Mesh(new T.CylinderGeometry(.005,.005,.021,8),dark);
   pin.rotation.z=Math.PI/2;pin.position.set(x+.025,.14+i*.042,.21-i*.012);desk.add(pin);
  }
  box(desk,x,.999,-.025,.018,.12,.43,wood);
 }
 box(desk,0,.25,.10,.53,.018,.15,wood); // Footrest.
 box(desk,0,.60,-.035,.53,.065,.018,wood);
 box(desk,0,.941,-.025,.55,.018,.43,wood);
 box(desk,0,.997,-.231,.55,.12,.018,wood);
 box(desk,0,1.07,0,.80,.018,.55,wood);
 // Fine exposed plywood laminations around the worktop.
 box(desk,0,1.068,.276,.80,.003,.001,edge);
 box(desk,-.401,1.068,0,.001,.003,.55,edge);
 box(desk,.401,1.068,0,.001,.003,.55,edge);
 const laptop=new T.Group();laptop.name='Open silver MacBook';laptop.position.set(0,1.088,.01);desk.add(laptop);
 box(laptop,0,0,0,.32,.012,.225,silver);
 box(laptop,0,.007,-.035,.275,.002,.10,dark);
 for(let row=0;row<4;row++)for(let col=0;col<12;col++)box(laptop,-.124+col*.0225,.009,-.068+row*.022,.018,.002,.016,dark);
 box(laptop,0,.008,.060,.115,.002,.063,silver);
 const lid=new T.Group();lid.position.set(0,.005,-.108);lid.rotation.x=-.20;laptop.add(lid);
 box(lid,0,.105,0,.32,.21,.007,silver);
 box(lid,0,.105,.0045,.306,.194,.002,dark);
 const screen=new T.MeshStandardMaterial({color:'#718fa7',roughness:.4,emissive:'#385065',emissiveIntensity:.2});
 box(lid,0,.106,.006,.293,.18,.001,screen);
 box(lid,-.026,.11,.007,.19,.125,.001,new T.MeshStandardMaterial({color:'#dce5e5',roughness:.6}));
 for(let i=0;i<5;i++)box(lid,-.043,.15-i*.018,.008,.13-i%2*.025,.003,.001,screen);
 return desk;
}
