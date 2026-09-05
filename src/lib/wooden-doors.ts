import * as T from 'three';

/** Wooden leaf with a configurable hinge side and lever handles on both sides. */
export function addWoodenDoor(parent:T.Object3D,width:number,height:number,swingDirection=1,hingeSide:-1|1=-1){
 const door=new T.Group();door.name='Wooden door with lever handles';parent.add(door);
 const wood=new T.MeshStandardMaterial({color:'#bf9566',roughness:.68});
 const grain=new T.MeshStandardMaterial({color:'#ac8053',roughness:.8});
 const brass=new T.MeshStandardMaterial({color:'#b79860',metalness:.75,roughness:.3});
 const leaf=new T.Mesh(new T.BoxGeometry(width,height,.04),wood);leaf.position.y=height/2;leaf.castShadow=true;leaf.receiveShadow=true;door.add(leaf);
 for(const side of [-1,1]){
  // Fine vertical variation remains geometry-native in the downloadable model.
  for(let i=0;i<18;i++){
   const stripe=new T.Mesh(new T.BoxGeometry(.0015+(i%3)*.0006,height-.08,.0006),grain);
   stripe.position.set(-width/2+.025+(width-.05)*i/17,height/2,side*.0204);door.add(stripe);
  }
  const rose=new T.Mesh(new T.CylinderGeometry(.032,.032,.009,20),brass);rose.rotation.x=Math.PI/2;rose.position.set(-hingeSide*(width/2-.095),1.03,side*.027);door.add(rose);
  const stem=new T.Mesh(new T.CylinderGeometry(.009,.009,.03,12),brass);stem.rotation.x=Math.PI/2;stem.position.set(-hingeSide*(width/2-.095),1.03,side*.045);door.add(stem);
  // Horizontal lever points toward the hinges, away from the latch edge.
  const handle=new T.Mesh(new T.CapsuleGeometry(.009,.10,4,12),brass);
  handle.rotation.z=Math.PI/2;handle.position.set(-hingeSide*(width/2-.095)+hingeSide*.05,1.03,side*.066);handle.castShadow=true;door.add(handle);
 }
 const hinge=new T.Group();hinge.name='Door hinge';hinge.position.x=hingeSide*width/2;
 hinge.userData.woodenDoorHinge=true;hinge.userData.swingDirection=swingDirection;
 for(const child of [...door.children]){child.position.x-=hingeSide*width/2;hinge.add(child);}
 door.add(hinge);
 return door;
}

export function replaceServiceDoorLeaves(source:T.Object3D,parent:T.Object3D){
 const doors=new T.Group();doors.name='Wooden service-room doors';parent.add(doors);
 source.updateMatrixWorld(true);
 source.traverse(object=>{
  if(!(object instanceof T.Mesh)||object.userData.layer!=='IfcDoor')return;
  const bounds=new T.Box3().setFromObject(object),size=bounds.getSize(new T.Vector3());
  // Only the four interior leaves in the service-core frontage, not entrance/balcony doors.
  if(bounds.min.z< -1.93||bounds.max.z> -1.87||size.z>.05||size.x<.8||size.y<2)return;
  object.visible=false;
  const centre=bounds.getCenter(new T.Vector3());
  // The WC is the rightmost service room; its hinge is on the opposite jamb.
  const isWC=centre.x>3.65;
  const door=addWoodenDoor(doors,size.x,size.y,isWC?1:-1,isWC?1:-1);
  door.position.set(centre.x,bounds.min.y,centre.z);
 });
 return doors;
}

export function setWoodenDoorsOpen(root:T.Object3D,open:boolean){
 root.traverse(object=>{
  if(object.userData.woodenDoorHinge)object.rotation.y=open?object.userData.swingDirection*Math.PI/4:0;
 });
}

/** Handles fitted to the existing entrance leaf; retain its original geometry. */
export function addEntranceDoorHandles(parent:T.Object3D){
 const hardware=new T.Group();hardware.name='Entrance door lever handles';parent.add(hardware);
 // Source leaf spans x=4.726..4.766 and z=-1.824..-.890.
 const brass=new T.MeshStandardMaterial({color:'#b79860',metalness:.75,roughness:.3});
 for(const side of [-1,1]){
  const face=4.746+side*.02;
  const rose=new T.Mesh(new T.CylinderGeometry(.032,.032,.009,20),brass);
  rose.rotation.z=Math.PI/2;rose.position.set(face+side*.007,1.03,-1.729);hardware.add(rose);
  const stem=new T.Mesh(new T.CylinderGeometry(.009,.009,.03,12),brass);
  stem.rotation.z=Math.PI/2;stem.position.set(face+side*.025,1.03,-1.729);hardware.add(stem);
  const handle=new T.Mesh(new T.CapsuleGeometry(.009,.10,4,12),brass);
  handle.rotation.x=Math.PI/2;handle.position.set(face+side*.046,1.03,-1.679);handle.castShadow=true;hardware.add(handle);
 }
 return hardware;
}
