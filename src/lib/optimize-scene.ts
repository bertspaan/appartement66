import * as T from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

// Small decorative curves need fewer segments at apartment scale.
// Architectural BufferGeometry and larger furniture silhouettes stay untouched.
function detailGeometry(source:T.BufferGeometry){
 if(source instanceof T.SphereGeometry&&source.parameters.radius<=.08){
  const p=source.parameters;
  return new T.SphereGeometry(p.radius,Math.min(p.widthSegments,16),Math.min(p.heightSegments,10),p.phiStart,p.phiLength,p.thetaStart,p.thetaLength);
 }
 if(source instanceof T.CylinderGeometry&&Math.max(source.parameters.radiusTop,source.parameters.radiusBottom)<=.025){
  const p=source.parameters;
  return new T.CylinderGeometry(p.radiusTop,p.radiusBottom,p.height,Math.min(p.radialSegments,12),p.heightSegments,p.openEnded,p.thetaStart,p.thetaLength);
 }
 return source;
}

/** Batch stationary opaque meshes by appearance and reduce tiny curved details. */
export function optimizeScene(root:T.Group){
 root.updateWorldMatrix(true,true);
 const inverse=new T.Matrix4().copy(root.matrixWorld).invert();
 const batches=new Map<string,T.Mesh[]>();
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh||Array.isArray(object.material))return;
  for(let p:T.Object3D|null=object;p&&p!==root;p=p.parent)if(!p.visible||p.userData.woodenDoorHinge)return;
  const mat=object.material as T.MeshStandardMaterial;
  // Keep transparent sorting, texture UVs and animated light materials independent.
  if(!mat.isMeshStandardMaterial||mat.transparent||mat.map||mat.emissive.getHex()!==0)return;
  const {uuid,metadata,name,...data}=mat.toJSON();
  const key=JSON.stringify([data,object.castShadow,object.receiveShadow,object.renderOrder]);
  const items=batches.get(key)??[];items.push(object);batches.set(key,items);
 });
 let removed=0;
 for(const objects of batches.values()){
  if(objects.length<2)continue;
  const parts=objects.map(object=>{
   const source=detailGeometry(object.geometry);
   const geometry=source.index?source.toNonIndexed():source.clone();
   if(source!==object.geometry)source.dispose();
   for(const name of Object.keys(geometry.attributes))if(name!=='position'&&name!=='normal')geometry.deleteAttribute(name);
   if(!geometry.getAttribute('normal'))geometry.computeVertexNormals();
   geometry.clearGroups();geometry.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,object.matrixWorld));
   return geometry;
  });
  const geometry=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());if(!geometry)continue;
  const indexed=mergeVertices(geometry,1e-6);geometry.dispose();
  const first=objects[0];const merged=new T.Mesh(indexed,first.material);
  merged.name='Batched static details';merged.castShadow=first.castShadow;merged.receiveShadow=first.receiveShadow;merged.renderOrder=first.renderOrder;
  root.add(merged);
  for(const object of objects){object.removeFromParent();object.geometry.dispose();}
  removed+=objects.length-1;
 }
 return removed;
}
