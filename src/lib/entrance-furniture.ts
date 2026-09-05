import * as T from 'three';
import {sketch} from './sketch-layout';

export function addEntranceFurniture(parent:T.Group){
 const group=new T.Group();group.name='Entrance shoe cabinet and owned orange coat rack';parent.add(group);
 const materials=new Map<string,T.MeshStandardMaterial>();
 function mat(color:string){let m=materials.get(color);if(!m){m=new T.MeshStandardMaterial({color,roughness:.65});materials.set(color,m);}return m;}
 function mesh(p:T.Object3D,g:T.BufferGeometry,color:string,x=0,y=0,z=0){const m=new T.Mesh(g,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){return mesh(p,new T.BoxGeometry(w,h,d),color,x,y,z);}
 function rod(p:T.Object3D,a:T.Vector3,b:T.Vector3,r:number,color:string){const m=mesh(p,new T.CylinderGeometry(r,r,a.distanceTo(b),10),color);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return m;}
 // The 30 cm wall strip beside the entrance fits this narrow 26 cm shoe tower.
 const shoes=new T.Group();shoes.name='Narrow shoe cabinet beside entrance';shoes.position.set(4.47,0,-.69);shoes.rotation.y=-Math.PI/2;group.add(shoes);
 const wood='#bd9c74';
 for(const x of [-.12,.12])box(shoes,x,.49,0,.02,.92,.34,wood);
 box(shoes,0,.49,-.16,.22,.92,.02,'#a98a64');
 for(const y of [.06,.28,.50,.72,.95])box(shoes,0,y,0,.26,.025,.34,wood);
 for(let row=0;row<4;row++)for(const side of [-1,1]){
  const color=['#444d49','#c28c68','#c17e91','#809095'][row];
  const shoe=mesh(shoes,new T.SphereGeometry(1,12,8),color,side*.056,.112+row*.22,.015);shoe.scale.set(.047,.045,.125);
  box(shoes,side*.056,.085+row*.22,.015,.087,.015,.245,'#d8d2bf');
  for(let i=0;i<3;i++)box(shoes,side*.056,.151+row*.22,-.035+i*.025,.055,.004,.007,'#ddd6c8');
 }
 // Wall-facing transform tracks the diagonal between Tip's door and the entrance.
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight;
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),along=4.98;
 const rack=new T.Group();rack.name='Orange stepped coat rack with wooden shelf';
 rack.position.set(a[0]+dx/length*along+dz/length*.072,0,a[1]+dz/length*along-dx/length*.072);
 rack.rotation.y=Math.PI-Math.atan2(dz,dx);group.add(rack);
 const orange='#d64f2b';
 // Bent tubular outline: high left arm, dropped shelf, and shorter raised right arm.
 const path=new T.CurvePath<T.Vector3>();
 const point=(x:number,y:number)=>new T.Vector3(x,y,.025);
 const line=(a:number,b:number,c:number,d:number)=>path.add(new T.LineCurve3(point(a,b),point(c,d)));
 const curve=(a:number,b:number,c:number,d:number,e:number,f:number)=>path.add(new T.QuadraticBezierCurve3(point(a,b),point(c,d),point(e,f)));
 line(-.64,1.94,-.24,1.94);curve(-.24,1.94,-.12,1.94,-.12,1.82);
 line(-.12,1.82,-.12,1.51);curve(-.12,1.51,-.12,1.40,0,1.40);
 line(0,1.40,.37,1.40);curve(.37,1.40,.47,1.40,.47,1.51);
 line(.47,1.51,.47,1.64);curve(.47,1.64,.47,1.74,.56,1.74);line(.56,1.74,.64,1.74);
 mesh(rack,new T.TubeGeometry(path,64,.018,10,false),orange);
 box(rack,.18,1.47,.105,.62,.025,.19,'#7f5234');
 rod(rack,new T.Vector3(-.13,1.455,.20),new T.Vector3(.49,1.455,.20),.012,orange);
 const hooks=[[-.57,1.94],[-.40,1.94],[-.23,1.94],[.03,1.40],[.20,1.40],[.37,1.40],[.60,1.74]];
 for(const [x,y] of hooks)rod(rack,new T.Vector3(x,y,.025),new T.Vector3(x,y+.032,.087),.008,orange);
 for(const [x,y] of [[-.57,1.94],[.56,1.74],[.06,1.40]])mesh(rack,new T.SphereGeometry(.009,10,6),'#9da3a1',x,y,.043);
 function coat(x:number,top:number,height:number,color:string){
  const g=new T.Group();g.name='Hanging coat';g.position.set(x,top,.10);rack.add(g);
  const outline=new T.Shape();
  const points=[[-.035,0],[-.105,-.045],[-.16,-.14],[-.17,-.47],[-.115,-.48],[-.092,-.22],[-.10,-1],[.10,-1],[.092,-.22],[.115,-.48],[.17,-.47],[.16,-.14],[.105,-.045],[.035,0]];
  points.forEach(([x,y],i)=>i?outline.lineTo(x,y*height):outline.moveTo(x,y*height));outline.closePath();
  mesh(g,new T.ExtrudeGeometry(outline,{depth:.04,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.009,bevelThickness:.009}),color);
  rod(g,new T.Vector3(0,-.08,.052),new T.Vector3(0,-height+.025,.052),.0025,'#a5a39b');
  const hood=mesh(g,new T.TorusGeometry(.043,.011,8,16),color,0,-.045,.058);hood.scale.y=1.2;
  for(const side of [-1,1])box(g,side*.057,-height*.65,.055,.047,.08,.006,color);
 }
 coat(-.40,1.92,.85,'#293c35');coat(.03,1.38,.61,'#b4a08c');coat(.25,1.38,.66,'#414254');
 return group;
}
