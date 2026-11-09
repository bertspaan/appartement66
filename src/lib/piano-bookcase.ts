import * as T from 'three';

// Top meets the existing wall shelf at 2.27 m; both piano and hall sides stay open.
export function addPianoBookcase(parent:T.Group,width=.70){
 const group=new T.Group();group.name='Piano bookcase joined to high wall shelf';parent.add(group);
 const top=2.27,depth=.28,board=.03;
 const wood=new T.MeshStandardMaterial({color:'#c4a278',roughness:.8});
 function box(name:string,x:number,y:number,z:number,w:number,h:number,d:number,material=wood){
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.name=name;
  mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 for(const side of [-1,1])box('Bookcase side',side*(width-board)/2,top/2,0,board,top,depth);
 box('Recessed bookcase base',0,.04,-.025,width-.08,.08,depth-.05);
 const levels=[.10,.46,.82,1.18,1.54,1.90,top];
 for(const height of levels)box(height===top?'Top joining the wall shelf':'Bookcase shelf',0,height-board/2,0,width-2*board,board,depth);
 const colors=['#617985','#bd896b','#dfd4b9','#6c7964','#926d76','#394a57','#b95b48'];
 for(let level=0;level<levels.length-1;level++){
  let x=-width/2+board+.025;
  for(let i=0;i<8;i++){
   const w=.026+((i+level)%3)*.009,h=.19+((i*3+level)%5)*.022;
   const cover=new T.MeshStandardMaterial({color:colors[(i+level*2)%colors.length],roughness:.85});
   box('Book',x+w/2,levels[level]+h/2,.025,w,h,.19,cover);x+=w+.005;
  }
 }
 return group;
}
