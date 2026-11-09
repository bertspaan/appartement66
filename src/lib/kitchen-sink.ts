import * as T from 'three';
import {kitchen} from './kitchen-layout';

// LÅNGUDDEN 56 × 52.5 cm; bowl 50 × 40 × 18 cm. Corner radii are visual approximations.
function roundedRect(w:number,d:number,r:number,cx=0,cz=0){
 const shape=new T.Shape(),x=cx-w/2,z=cz-d/2;
 shape.moveTo(x+r,z);shape.lineTo(x+w-r,z);shape.quadraticCurveTo(x+w,z,x+w,z+r);
 shape.lineTo(x+w,z+d-r);shape.quadraticCurveTo(x+w,z+d,x+w-r,z+d);
 shape.lineTo(x+r,z+d);shape.quadraticCurveTo(x,z+d,x,z+d-r);
 shape.lineTo(x,z+r);shape.quadraticCurveTo(x,z,x+r,z);return shape;
}
function slab(shape:T.Shape,depth:number,y:number){
 const geometry=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:12});
 geometry.rotateX(Math.PI/2);geometry.translate(0,y,0);return geometry;
}

export function addKitchenSink(sources:T.Object3D[],parent:T.Group){
 const x=kitchen.sinkX,z=-3.475,top=kitchen.worktopHeight;
 // Replace the old sink and cut through both the worktop and the solid source
 // cabinet's hidden lid. Otherwise those surfaces would fill the new bowl.
 for(const source of sources)source.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  const path=String(object.userData.source_path??'').toLowerCase();
  if(path.includes('56_expansievat_spoelbak')){object.visible=false;return;}
  if(!path.includes('73__keuken'))return;
  object.geometry.computeBoundingBox();const bounds=object.geometry.boundingBox!;
  if(Math.abs(bounds.min.y-.91)<.001&&Math.abs(bounds.max.y-top)<.001){
   const outline=roundedRect(bounds.max.x-bounds.min.x,bounds.max.z-bounds.min.z,0,(bounds.min.x+bounds.max.x)/2,(bounds.min.z+bounds.max.z)/2);
   outline.holes.push(roundedRect(.54,.505,.025,x,z));
   object.geometry=slab(outline,.04,top);
  }else if(Math.abs(bounds.max.y-.91)<.001){
   const geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();
   const positions=geometry.getAttribute('position'),indices:number[]=[];
   for(let i=0;i<positions.count;i+=3)if(![0,1,2].every(j=>Math.abs(positions.getY(i+j)-.91)<.001))indices.push(i,i+1,i+2);
   geometry.setIndex(indices);object.geometry=geometry;
  }
 });
 const group=new T.Group();group.name='LÅNGUDDEN large rounded stainless steel kitchen sink';group.position.set(x,top,z);parent.add(group);
 const steel=new T.MeshStandardMaterial({color:'#bac3c5',metalness:.65,roughness:.26,side:T.DoubleSide});
 const chrome=new T.MeshStandardMaterial({color:'#d6dfe0',metalness:.72,roughness:.19});
 const dark=new T.MeshStandardMaterial({color:'#344144',roughness:.55});
 const add=(name:string,geometry:T.BufferGeometry,mat:T.Material,px=0,py=0,pz=0)=>{
  const mesh=new T.Mesh(geometry,mat);mesh.name=name;mesh.position.set(px,py,pz);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 };
 const deck=roundedRect(.56,.525,.026);deck.holes.push(roundedRect(.50,.40,.05,0,.035));
 add('Thin rolled steel rim and rear tap deck',slab(deck,.004,.004),steel);
 // Several progressively inset rings make the rolled lip, tapered sides and
 // soft wall-to-floor transition one continuous hollow surface.
 const rings=[ [.500,.400,.050,.004], [.496,.396,.050,-.004], [.489,.389,.052,-.018], [.462,.362,.060,-.135], [.453,.353,.064,-.151], [.438,.338,.069,-.165], [.414,.314,.074,-.175], [.390,.290,.078,-.178] ];
 const vertices:number[]=[],indices:number[]=[];
 const contours=rings.map(([w,d,r,y])=>roundedRect(w,d,r).getPoints(12).slice(0,-1).map(p=>new T.Vector3(p.x,y,p.y+.035)));
 const count=contours[0].length;
 for(const contour of contours)for(const p of contour)vertices.push(p.x,p.y,p.z);
 for(let ring=0;ring<rings.length-1;ring++)for(let i=0;i<count;i++){
  const a=ring*count+i,b=ring*count+(i+1)%count,c=a+count,e=b+count;indices.push(a,c,b,b,c,e);
 }
 // Gently sloping floor closes at the drain rather than leaving an open box.
 const centre=vertices.length/3;vertices.push(0,-.180,.035);
 for(let i=0;i<count;i++)indices.push((rings.length-1)*count+i,centre,(rings.length-1)*count+(i+1)%count);
 const bowl=new T.BufferGeometry();bowl.setAttribute('position',new T.Float32BufferAttribute(vertices,3));bowl.setIndex(indices);bowl.computeVertexNormals();
 add('Rounded bowl with curved bottom',bowl,steel);
 add('Drain flange',new T.CylinderGeometry(.045,.043,.003,48),chrome,0,-.177,.035);
 add('Recessed strainer',new T.CylinderGeometry(.033,.033,.003,40),dark,0,-.175,.035);
 add('Strainer centre',new T.CylinderGeometry(.015,.015,.003,32),steel,0,-.173,.035);
 for(let i=0;i<10;i++){const angle=i*Math.PI/5;add('Strainer perforation',new T.CylinderGeometry(.0027,.0027,.001,8),steel,Math.sin(angle)*.025,-.173, .035+Math.cos(angle)*.025);}
 for(const dx of [-.014,0,.014])add('Overflow slot',new T.BoxGeometry(.009,.004,.002),dark,dx,-.041,-.154);
 // Arched mixer: rounded neck, downward aerator and a small side lever.
 const tapZ=-.211;
 add('Tap foot',new T.CylinderGeometry(.027,.029,.009,32),chrome,0,.008,tapZ);
 add('Mixer body',new T.CylinderGeometry(.020,.022,.105,32),chrome,0,.063,tapZ);
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,.106,tapZ),new T.Vector3(0,.245,tapZ),new T.Vector3(0,.330,-.172),new T.Vector3(0,.335,-.079),new T.Vector3(0,.279,-.024),new T.Vector3(0,.247,-.024)]);
 add('Smooth swan-neck spout',new T.TubeGeometry(curve,48,.012,16,false),chrome);
 add('Aerator collar',new T.CylinderGeometry(.014,.014,.020,24),steel,0,.240,-.024);
 add('Aerator mesh',new T.CylinderGeometry(.010,.010,.001,24),dark,0,.229,-.024);
 const handle=add('Mixer side lever',new T.CylinderGeometry(.005,.005,.075,16),chrome,.038,.111,tapZ);handle.rotation.z=-.30;
 const pivot=add('Mixer lever pivot',new T.CylinderGeometry(.013,.013,.033,24),chrome,.023,.075,tapZ);pivot.rotation.z=Math.PI/2;
 return group;
}
