import {addWoodenDoor} from './wooden-doors';
import * as T from 'three';
type Point = readonly [number, number];
// Metres in the imported apartment's coordinate system. Traced approximately
// from PXL_20260905_101619644.jpg, using the facade and service core as anchors.
// 30 cm clear along the exterior wall from the entrance jamb at z=-.84.
// Include the 10 cm partition thickness at its oblique intersection.
let bedroomFrontRightZ=-.54;
for(let i=0;i<10;i++)bedroomFrontRightZ=-.84+.30+.05*Math.hypot(5.76,bedroomFrontRightZ-.95)/5.76;
export const sketch = {
 // Facade concrete pier ends at x=-1.01; the full wall width lands on concrete.
 bedroomFrontLeft: [-1.10, .95] as Point,
 bedroomFrontRight: [4.66, bedroomFrontRightZ] as Point,
 // Source window frame begins at x=1.99; 10 cm wall ends exactly before it.
 bedroomDividerX: 1.94,
 // Shifted toward the hallway for more piano clearance; remains on the core frontage.
 hallwayStart: [0, -1.90] as Point,
} as const;
// Orthogonal projection keeps the service-core end fixed and guarantees a
// right-angle junction, even if the bedroom front wall moves later.
export function getHallwayEnd(): Point {
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight,start=sketch.hallwayStart;
 const dx=b[0]-a[0],dz=b[1]-a[1];
 const t=((start[0]-a[0])*dx+(start[1]-a[1])*dz)/(dx*dx+dz*dz);
 return [a[0]+t*dx,a[1]+t*dz];
}
export function addSketchLayout(group:T.Group,open:number,hallwayWall=true){
 group.name='Room layout from hand sketch';
 const height=2.62;
 function segment(a:Point,b:Point,thickness=.1,h=height,y=h/2,material?:T.Material){
  const dx=b[0]-a[0],dz=b[1]-a[1];
  const mesh=new T.Mesh(new T.BoxGeometry(Math.hypot(dx,dz),h,thickness),material??new T.MeshStandardMaterial({color:'#efeee7',roughness:.85}));
  mesh.position.set((a[0]+b[0])/2,y,(a[1]+b[1])/2);mesh.rotation.y=-Math.atan2(dz,dx);mesh.castShadow=!material;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight;
 const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
 const along=(distance:number):Point=>[a[0]+(b[0]-a[0])*distance/length,a[1]+(b[1]-a[1])*distance/length];
 // Two provisional bedroom entrances in the diagonal front wall.
 const doors=[[1.88,2.73],[3.40,4.25]];
 let cursor=0;
 for(const [index,[start,end]] of doors.entries()){
  segment(along(cursor),along(start));segment(along(start),along(end),.1,.47,2.385);
  const frameMaterial=new T.MeshStandardMaterial({color:'#e7d1af',roughness:.7});
  for(const distance of [start+.0125,end-.0125])segment(along(distance-.0125),along(distance+.0125),.115,2.15,1.075,frameMaterial);
  segment(along(start),along(end),.115,.025,2.1375,frameMaterial);
  const door=addWoodenDoor(group,end-start-.06,2.10,index===0?1:-1,index===0?1:-1),centre=along((start+end)/2);
  door.name=index===0?'Bedroom door — Sarah and Bert':'Bedroom door — Tip';
  door.position.set(centre[0],.015,centre[1]);door.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);
  cursor=end;
 }
 segment(along(cursor),b);
 segment(a,[a[0],3.79]);
 const dividerZ=a[1]+(b[1]-a[1])*(sketch.bedroomDividerX-a[0])/(b[0]-a[0]);
 segment([sketch.bedroomDividerX,dividerZ],[sketch.bedroomDividerX,3.79]);
 if(!hallwayWall)return;
 const end=getHallwayEnd(),start=sketch.hallwayStart;
 const dx=end[0]-start[0],dz=end[1]-start[1],len=Math.hypot(dx,dz);
 const at=(distance:number,offset=0):Point=>[start[0]+dx/len*distance-dz/len*offset,start[1]+dz/len*distance+dx/len*offset];
 const frosted=()=>new T.MeshPhysicalMaterial({color:'#d8ece8',roughness:.72,metalness:0,transmission:.35,thickness:.025,transparent:true,opacity:.68,side:T.DoubleSide,depthWrite:false});
 const frame=()=>new T.MeshStandardMaterial({color:'#566a6b',roughness:.65});
 // Keep the full 1.10 m opening and 1.12 m slide on the shorter partition.
 const openingStart=.18,openingEnd=openingStart+1.10;
 const leafStart=openingStart-.02,leafEnd=openingEnd+.02;
 segment(at(0),at(openingStart),.035,2.48,1.26,frosted());
 segment(at(openingEnd),at(len),.035,2.48,1.26,frosted());
 segment(at(0),at(len),.07,.07,2.54,frame());
 for(const s of [0,openingStart,openingEnd,len])segment(at(s-.012),at(s+.012),.06,2.50,1.27,frame());
 const travel=Math.min(1.12,len-leafEnd-.01)*T.MathUtils.clamp(open,0,1);
 const leaf=segment(at(leafStart+travel,.065),at(leafEnd+travel,.065),.025,2.43,1.245,frosted());leaf.name='Translucent sliding door';
 for(const s of [leafStart,leafEnd])segment(at(s+travel-.012,.065),at(s+travel+.012,.065),.045,2.46,1.245,frame());
 segment(at(leafStart+.12+travel,.10),at(leafStart+.15+travel,.10),.035,.25,1.12,frame());
 group.name='Room layout from hand sketch';
}

// Keep either instrument against the changing diagonal, with clearance behind it.
export function getInstrumentPlacement(){
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight;
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
 const along=.98,offset=.38;
 return {x:a[0]+dx/length*along+dz/length*offset,z:a[1]+dz/length*along-dx/length*offset,rotation:-Math.atan2(dz,dx)};
}
