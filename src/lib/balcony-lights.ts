import * as T from 'three';

export function addBalconyStringLights(parent:T.Group){
 const group=new T.Group();group.name='Coloured balcony string lights';parent.add(group);
 const cableMaterial=new T.MeshStandardMaterial({color:'#303c36',roughness:.8});
 const bulbMaterials:T.MeshStandardMaterial[]=[];
 const lights:T.PointLight[]=[];
 const colors=['#e46c68','#f5c967','#73ba98','#6a9bd5','#bd8bd0'];
 let index=0;
 function run(a:T.Vector3,b:T.Vector3){
  const length=a.distanceTo(b),spans=Math.ceil(length/1.2);
  const position=(t:number)=>a.clone().lerp(b,t).add(new T.Vector3(0,-.09*Math.sin((t*spans%1)*Math.PI),0));
  const points=Array.from({length:spans*16+1},(_,i)=>position(i/(spans*16)));
  const cable=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),spans*24,.006,6,false),cableMaterial);group.add(cable);
  const count=Math.floor(length/.48);
  for(let i=0;i<count;i++){
   const p=position((i+.5)/count),color=colors[index%colors.length];
   const socket=new T.Mesh(new T.CylinderGeometry(.016,.016,.035,12),cableMaterial);socket.position.copy(p).add(new T.Vector3(0,-.024,0));group.add(socket);
   const mat=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:0,roughness:.35});bulbMaterials.push(mat);
   const bulb=new T.Mesh(new T.SphereGeometry(.030,14,10),mat);bulb.scale.y=1.22;bulb.position.copy(p).add(new T.Vector3(0,-.072,0));group.add(bulb);
   // A few local lights provide coloured spill without one light per bulb.
   if(i===Math.floor(count*.25)||i===Math.floor(count*.75)){
    const light=new T.PointLight(color,0,3,2);light.position.copy(bulb.position).add(new T.Vector3(0,.04,0));lights.push(light);group.add(light);
   }
   index++;
  }
 }
 // Follow the railing on both exposed sides; the balcony remains open overhead.
 run(new T.Vector3(-7.05,1.13,-4.0),new T.Vector3(-7.05,1.13,5.93));
 run(new T.Vector3(-7.05,1.13,5.93),new T.Vector3(4.88,1.13,5.93));
 return {setEvening(evening:boolean){bulbMaterials.forEach(m=>m.emissiveIntensity=evening?2.8:0);lights.forEach(l=>l.intensity=evening?5:0);}};
}
