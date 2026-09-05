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
