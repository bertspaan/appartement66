import * as T from 'three';

export function furnishBathrooms(source:T.Object3D,parent:T.Group){
 source.traverse(object=>{
  if(object instanceof T.Mesh&&String(object.userData.source_path).includes('Expansievat_wasbak'))object.visible=false;
 });
 const group=new T.Group();group.name='Bathroom and WC finishes';parent.add(group);
 const ceramic=new T.MeshStandardMaterial({color:'#f5f0e5',roughness:.22});
 const brass=new T.MeshStandardMaterial({color:'#bc995d',metalness:.8,roughness:.27});
 function box(p:T.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string){
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.65}));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;p.add(mesh);return mesh;
 }
 function cylinder(p:T.Object3D,x:number,y:number,z:number,r:number,h:number,mat:T.Material){
  const mesh=new T.Mesh(new T.CylinderGeometry(r,r,h,24),mat);mesh.position.set(x,y,z);mesh.castShadow=true;p.add(mesh);return mesh;
 }
 function floor(x0:number,x1:number,z0:number,z1:number){
  const nx=Math.ceil((x1-x0)/.22),nz=Math.ceil((z1-z0)/.22),w=(x1-x0)/nx,d=(z1-z0)/nz;
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)box(group,x0+(i+.5)*w,.033,z0+(j+.5)*d,w-.003,.015,d-.003,(i+j)%2?'#d0b79c':'#e9dfcf');
 }
 floor(1.185,2.60,-3.77,-1.98);floor(2.61,2.68,-3.77,-3.16);floor(2.68,3.57,-3.77,-2.445);floor(3.66,4.65,-3.055,-1.98);
 function tiledWall(x:number,z:number,length:number,rotation:number){
  const wall=new T.Group();wall.position.set(x,0,z);wall.rotation.y=rotation;group.add(wall);
  const count=Math.ceil(length/.15),w=length/count;
  for(let i=0;i<count;i++)for(let j=0;j<8;j++)box(wall,-length/2+(i+.5)*w,.08+(j+.5)*.15,0,w-.004,.146,.009,['#a0b7a5','#abc0ae','#98af9e'][(i+j)%3]);
  box(wall,0,1.30,0,length,.035,.024,'#d7dfce');
 }
 tiledWall(2.38,-3.767,2.38,0);tiledWall(1.188,-2.875,1.78,Math.PI/2);
 tiledWall(4.155,-3.052,1.0,0);tiledWall(4.642,-2.52,1.07,-Math.PI/2);
 function sink(name:string,x:number,z:number,rotation:number,small=false){
  const g=new T.Group();g.name=name;g.position.set(x,0,z);g.rotation.y=rotation;group.add(g);
  const width=small?.38:.60,depth=small?.29:.45,radius=width/2,centre=depth*.52,height=small?.83:.86;
  // Flat back with a broad rounded front, modelled as a hollow ceramic shell.
  const outline=new T.Shape();outline.moveTo(-width/2,0);outline.lineTo(width/2,0);
  outline.bezierCurveTo(width*.52,depth*.43,width*.48,depth*.86,width*.32,depth*.96);
  outline.bezierCurveTo(width*.12,depth*1.03,-width*.12,depth*1.03,-width*.32,depth*.96);
  outline.bezierCurveTo(-width*.48,depth*.86,-width*.52,depth*.43,-width/2,0);
  const contour=outline.getSpacedPoints(64),vertices:number[]=[],indices:number[]=[];
  const drop=small?.12:.17;
  const rings=[[.62,-drop],[.94,-drop*.45],[1,0],[.87,-.008],[.65,-drop*.55],[.10,-drop*.85]];
  for(const [scale,y] of rings)for(const point of contour)vertices.push(point.x*scale,height+y,centre+(point.y-centre)*scale);
  const count=contour.length;
  for(let r=0;r<rings.length-1;r++)for(let i=0;i<count-1;i++){
   const a=r*count+i,b=a+count;indices.push(a,a+1,b,a+1,b+1,b);
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const basinMaterial=ceramic.clone();basinMaterial.side=T.DoubleSide;
  const bowl=new T.Mesh(geometry,basinMaterial);bowl.castShadow=true;bowl.receiveShadow=true;g.add(bowl);
  const deck=new T.Mesh(new T.BoxGeometry(width*.97,.035,depth*.19),ceramic);deck.position.set(0,height-.012,depth*.095);g.add(deck);
  cylinder(g,0,height-drop*.85+.004,centre,.025,.004,brass);
  cylinder(g,0,height-drop-.10,centre,.018,.19,brass);
  const overflow=new T.Mesh(new T.CircleGeometry(.009,20),brass);overflow.position.set(0,height-.05,depth*.17);g.add(overflow);
  // Raised bridge tap and traditional cross handles, behind the bowl.
  cylinder(g,0,height+.06,.055,.013,.14,brass);
  const spout=cylinder(g,0,height+.12,.115,.012,.12,brass);spout.rotation.x=Math.PI/2;
  for(const x of [-radius*.5,radius*.5]){
   cylinder(g,x,height+.025,.055,.015,.06,brass);
   const handle=cylinder(g,x,height+.06,.055,.005,.065,brass);handle.rotation.z=Math.PI/2;
   const cross=cylinder(g,x,height+.06,.055,.005,.05,brass);cross.rotation.x=Math.PI/2;
  }
  const mirrorSize=small?.40:.45,mirrorY=small?1.40:1.60;
  const mirror=new T.Mesh(new T.PlaneGeometry(mirrorSize,mirrorSize),new T.MeshStandardMaterial({color:'#b9d0cc',metalness:.8,roughness:.13}));mirror.position.set(0,mirrorY,.014);g.add(mirror);
  for(const side of [-1,1]){
   const vertical=new T.Mesh(new T.BoxGeometry(.012,mirrorSize+.012,.012),brass);vertical.position.set(side*mirrorSize/2,mirrorY,.022);g.add(vertical);
   const horizontal=new T.Mesh(new T.BoxGeometry(mirrorSize,.012,.012),brass);horizontal.position.set(0,mirrorY+side*mirrorSize/2,.022);g.add(horizontal);
  }
 }
 sink('Rounded wall-hung washbasin from reference',1.205,-2.88,Math.PI/2);
 sink('Rounded wall-hung WC hand basin',4.624,-2.28,-Math.PI/2,true);
 // Warm timber shelf above the concealed cistern, with folded towels and toiletries.
 box(group,4.15,1.215,-3.15,.93,.025,.22,'#bc966a');
 for(let i=0;i<3;i++)box(group,4.36,1.245+i*.035,-3.14,.25,.035,.15,['#e8dccc','#d2ad9d','#a3b3a0'][i]);
 // Bathroom towel rail, on the rear wall, clear of the shower entrance.
 const rail=cylinder(group,2.20,1.20,-3.67,.012,.55,brass);rail.rotation.z=Math.PI/2;
 box(group,2.20,.99,-3.65,.40,.45,.022,'#d2ad9d');
 box(group,2.20,.79,-3.635,.39,.025,.008,'#be9486');
 box(group,3.12,1.38,-3.65,.58,.03,.18,'#bc966a');
 for(let i=0;i<3;i++){
  cylinder(group,2.94+i*.15,1.48,-3.63,.035,.17,new T.MeshStandardMaterial({color:['#ebddc4','#809b8b','#bc8c76'][i],roughness:.5}));
  cylinder(group,2.94+i*.15,1.58,-3.63,.018,.035,brass);
 }
 return group;
}
