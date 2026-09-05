import * as T from 'three';

// The source kitchen backs and service-wall ends share z=-3.785 with the
// concrete envelope's inside face. Separate them by 15 mm in the preview.
// Work on geometry so the correction is also included in downloaded GLBs.
export function separateInteriorSurfaces(root:T.Object3D){
 const wallFace=-3.785,clearance=.015;
 root.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  const source=String(object.userData.source_path??'').toLowerCase();
  const layer=String(object.userData.layer??'');
  const kitchen=source.includes('73__keuken')||source.includes('inductiekookplaat');
  const wall=layer==='IfcWall';
  if(!kitchen&&!wall)return;
  const original=object.geometry as T.BufferGeometry;original.computeBoundingBox();
  const bounds=original.boundingBox!;
  // Exclude the envelope itself and walls away from this shared surface.
  const endAtEnvelope=wall&&Math.abs(bounds.min.z-wallFace)<.001&&bounds.max.z>wallFace+.05;
  if(!kitchen&&!endAtEnvelope)return;
  const geometry=original.clone();
  // Move the kitchen 5 cm left to clear the fridge in the opposite corner.
  if(kitchen)geometry.translate(-.05,0,clearance);
  else{
   const positions=geometry.getAttribute('position');
   for(let i=0;i<positions.count;i++)if(positions.getZ(i)<wallFace+clearance)positions.setZ(i,wallFace+clearance);
   positions.needsUpdate=true;geometry.computeVertexNormals();
  }
  geometry.computeBoundingBox();geometry.computeBoundingSphere();object.geometry=geometry;
 });
}

/** Close the rear cut of the extracted building and remove buried wall-end faces. */
export function repairBuildingJunctions(roots:T.Object3D[]){
 const meshes:T.Mesh[]=[];
 for(const root of roots)root.traverse(object=>{
  if(object instanceof T.Mesh&&(object.userData.layer==='IfcWall'||String(object.userData.source_path).toLowerCase().includes('isolatie'))){meshes.push(object);}
 });
 const epsilon=1e-5,cut=-4.03;
 // The SketchUp extraction used uncapped plane cuts. Join each open edge loop
 // at the rear clipping plane and triangulate a real outward-facing surface.
 for(const mesh of meshes){
  const original=mesh.geometry,geometry=original.index?original.toNonIndexed():original.clone();
  const positions=geometry.getAttribute('position');
  const points=new Map<string,T.Vector2>(),edges=new Map<string,{a:string;b:string;count:number}>();
  const key=(x:number,y:number)=>`${Math.round(x/epsilon)},${Math.round(y/epsilon)}`;
  for(let i=0;i<positions.count;i+=3)for(let edge=0;edge<3;edge++){
   const a=i+edge,b=i+(edge+1)%3;
   if(Math.abs(positions.getZ(a)-cut)>epsilon||Math.abs(positions.getZ(b)-cut)>epsilon)continue;
   const ka=key(positions.getX(a),positions.getY(a)),kb=key(positions.getX(b),positions.getY(b));if(ka===kb)continue;
   points.set(ka,new T.Vector2(positions.getX(a),positions.getY(a)));points.set(kb,new T.Vector2(positions.getX(b),positions.getY(b)));
   const id=[ka,kb].sort().join('|'),entry=edges.get(id);if(entry)entry.count++;else edges.set(id,{a:ka,b:kb,count:1});
  }
  const boundary=[...edges.values()].filter(e=>e.count===1),caps:number[]=[];
  while(boundary.length){
   const first=boundary.pop()!,loop=[first.a,first.b];
   while(loop.at(-1)!==loop[0]){
    const end=loop.at(-1)!,index=boundary.findIndex(e=>e.a===end||e.b===end);if(index<0)break;
    const edge=boundary.splice(index,1)[0];loop.push(edge.a===end?edge.b:edge.a);
   }
   if(loop.at(-1)!==loop[0]||loop.length<4)continue;
   loop.pop();const contour=loop.map(k=>points.get(k)!);
   for(const triangle of T.ShapeUtils.triangulateShape(contour,[])){
    const vertices=triangle.map(i=>contour[i]);
    const cross=(vertices[1].x-vertices[0].x)*(vertices[2].y-vertices[0].y)-(vertices[1].y-vertices[0].y)*(vertices[2].x-vertices[0].x);
    if(cross>0)vertices.reverse(); // Outside of the rear wall is -Z.
    for(const p of vertices)caps.push(p.x,p.y,cut);
   }
  }
  if(caps.length){
   const values=Array.from(positions.array);values.push(...caps);
   const repaired=new T.BufferGeometry();repaired.setAttribute('position',new T.Float32BufferAttribute(values,3));repaired.computeVertexNormals();repaired.computeBoundingBox();repaired.computeBoundingSphere();mesh.geometry=repaired;
  }
  geometry.dispose();
 }
 // Contact faces between two abutting solid walls are internal, not finishes.
 // Remove only whole triangles contained by the neighbouring wall's footprint.
 const walls=meshes.filter(m=>m.userData.layer==='IfcWall');
 const boxes=walls.map(m=>{m.geometry.computeBoundingBox();return m.geometry.boundingBox!;});
 for(let mi=0;mi<walls.length;mi++){
  const mesh=walls[mi],box=boxes[mi],original=mesh.geometry;
  const g=original.index?original.toNonIndexed():original.clone(),p=g.getAttribute('position'),kept:number[]=[];
  for(let i=0;i<p.count;i+=3){
   const v=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,i+j));
   const buried=boxes.some((other,oi)=>oi!==mi&&[0,1,2].some(axis=>{
    const plane=v[0].getComponent(axis);
    if(!v.every(point=>Math.abs(point.getComponent(axis)-plane)<epsilon))return false;
    const touching=(Math.abs(box.max.getComponent(axis)-plane)<epsilon&&Math.abs(other.min.getComponent(axis)-plane)<epsilon)||(Math.abs(box.min.getComponent(axis)-plane)<epsilon&&Math.abs(other.max.getComponent(axis)-plane)<epsilon);
    return touching&&v.every(point=>[0,1,2].every(a=>a===axis||(point.getComponent(a)>=other.min.getComponent(a)-epsilon&&point.getComponent(a)<=other.max.getComponent(a)+epsilon)));
   }));
   if(!buried)for(const point of v)kept.push(point.x,point.y,point.z);
  }
  if(kept.length!==p.count*3){const repaired=new T.BufferGeometry();repaired.setAttribute('position',new T.Float32BufferAttribute(kept,3));repaired.computeVertexNormals();repaired.computeBoundingBox();repaired.computeBoundingSphere();mesh.geometry=repaired;}
  g.dispose();
 }
}

/** Recess source floor edges so they cannot share an exterior wall face. */
export function separateFloorEdges(roots:T.Object3D[]){
 const epsilon=1e-5,recess=.003;
 for(const root of roots)root.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  const source=String(object.userData.source_path??'').toLowerCase();
  if(object.userData.layer!=='IfcSlab'&&!source.includes('43_vloer'))return;
  const geometry=object.geometry.clone(),positions=geometry.getAttribute('position');
  // Only wall-aligned building edges; leave the balcony slab joints continuous.
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i),z=positions.getZ(i);
   if(Math.abs(z+4.03)<epsilon)positions.setZ(i,z+recess);
   if(Math.abs(z-4.04)<epsilon)positions.setZ(i,z-recess);
   if(Math.abs(x-4.91)<epsilon)positions.setX(i,x-recess);
   if(Math.abs(x+4.96)<epsilon)positions.setX(i,x+recess);
  }
  geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();object.geometry=geometry;
 });
}

/** Separate facade insulation from the concrete piers around the windows. */
export function separateFacadeLayers(root:T.Object3D){
 const epsilon=1e-5,clearance=.003;
 root.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  const source=String(object.userData.source_path??'').toLowerCase();
  if(!/isolatie\s*-\s*steenwol/.test(source))return;
  const geometry=object.geometry.clone(),positions=geometry.getAttribute('position');
  geometry.computeBoundingBox();const bounds=geometry.boundingBox!;
  // The two facades meet concrete at x=-4.96 and z=4.04 respectively.
  // Recess only the insulation's contact surface, retaining window positions.
  const west=Math.abs(bounds.max.x+4.96)<epsilon;
  const north=Math.abs(bounds.min.z-4.04)<epsilon;
  if(!west&&!north){geometry.dispose();return;}
  for(let i=0;i<positions.count;i++){
   if(west&&Math.abs(positions.getX(i)+4.96)<epsilon)positions.setX(i,-4.96-clearance);
   if(north&&Math.abs(positions.getZ(i)-4.04)<epsilon)positions.setZ(i,4.04+clearance);
  }
  positions.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();object.geometry=geometry;
 });
}
