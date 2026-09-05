import * as T from 'three';

// Photo-based Duplo marble run, approximately 70 × 55 × 58 cm.
export function addTipMarbleRun(parent:T.Group){
 const group=new T.Group();group.name='Tip — Duplo marble run';
 group.position.set(4.02,.025,.76);parent.add(group);
 const palette=['#d62831','#f2ca19','#087ac8','#159855','#e98026','#e683b4'];
 const materials=palette.map(color=>new T.MeshStandardMaterial({color,roughness:.28,side:T.DoubleSide}));
 const studGeometry=new T.CylinderGeometry(.010,.010,.008,12);
 function box(x:number,y:number,z:number,w:number,h:number,d:number,color:number){
  const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),materials[color]);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 function brick(x:number,y:number,z:number,color:number){
  box(x,y,z,.062,.036,.062,color);
  for(const dx of [-.016,.016])for(const dz of [-.016,.016]){
   const stud=new T.Mesh(studGeometry,materials[color]);stud.position.set(x+dx,y+.022,z+dz);stud.castShadow=true;group.add(stud);
  }
 }
 box(0,.007,0,.48,.014,.42,1);
 // Staggered towers of individual studded bricks leave openings below the tracks.
 for(const [x,z,levels] of [[-.16,-.12,13],[0,-.12,13],[.16,-.12,12],[-.16,.08,10],[0,.08,8],[.16,.08,7]] as const){
  for(let level=0;level<levels;level++){
   brick(x,.036+level*.04,z,(level+Math.round((x+.2)*20))%palette.length);
   brick(x+.064,.036+level*.04,z,(level+2)%palette.length);
  }
 }
 // Open half-round channels, not closed tubes: build the curved bowl cross-section.
 function channel(points:number[][],color:number){
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number])));
  const positions:number[]=[],indices:number[]=[];
  const steps=36,sides=12,radius=.032;
  for(let i=0;i<=steps;i++){
   const point=curve.getPoint(i/steps),tangent=curve.getTangent(i/steps);
   const sideways=new T.Vector3(-tangent.z,0,tangent.x).normalize();
   for(let j=0;j<=sides;j++){
    const angle=-Math.PI/2+j/sides*Math.PI;
    const vertex=point.clone().addScaledVector(sideways,Math.sin(angle)*radius);
    vertex.y-=Math.cos(angle)*radius;
    positions.push(vertex.x,vertex.y,vertex.z);
    if(i<steps&&j<sides){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);}
   }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new T.Mesh(geometry,materials[color]);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
 }
 // A descending serpentine route with the red, yellow, blue and green bends in the photo.
 channel([[-.23,.58,-.13],[-.08,.565,-.17],[.12,.55,-.17]],2);
 channel([[.12,.55,-.17],[.27,.53,-.13],[.29,.50,.01],[.20,.475,.08]],3);
 channel([[.20,.475,.08],[.13,.46,.15],[.02,.445,.08],[-.08,.43,.03]],1);
 channel([[-.08,.43,.03],[-.23,.415,.04],[-.29,.39,.16],[-.20,.37,.23]],0);
 channel([[-.20,.37,.23],[-.08,.35,.23],[.02,.33,.17],[.02,.30,.05]],2);
 channel([[.02,.30,.05],[.18,.28,.02],[.30,.25,.13],[.23,.22,.24]],3);
 channel([[.23,.22,.24],[.12,.20,.25],[.10,.17,.14],[.12,.14,-.03]],2);
 // Catch tray and a bright marble at the bottom.
 box(.12,.06,-.055,.12,.025,.12,1);
 for(const x of [.065,.175])box(x,.08,-.055,.01,.03,.12,1);
 const marble=new T.Mesh(new T.SphereGeometry(.012,16,12),new T.MeshStandardMaterial({color:'#f5ece1',metalness:.35,roughness:.15}));marble.position.set(.12,.085,-.065);group.add(marble);
 return group;
}
