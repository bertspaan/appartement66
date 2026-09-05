import * as T from 'three';
import {getHallwayEnd,sketch} from './sketch-layout';

// Shelf top 35 cm below the 2.62 m ceiling; 22 cm usable depth.
export function addHighShelves(parent:T.Group){
 const group=new T.Group();group.name='Continuous high wall shelves';parent.add(group);
 const wood=new T.MeshStandardMaterial({color:'#c4a278',roughness:.8});
 function box(p:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,color?:string){
  const m=new T.Mesh(new T.BoxGeometry(w,h,d),color?new T.MeshStandardMaterial({color,roughness:.85}):wood);
  m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;
 }
 function cylinder(p:T.Group,x:number,y:number,z:number,r:number,h:number,color:string){
  const m=new T.Mesh(new T.CylinderGeometry(r,r*.87,h,20),new T.MeshStandardMaterial({color,roughness:.8}));
  m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;
 }
 function plant(p:T.Group,x:number){
  cylinder(p,x,2.32,.12,.045,.10,'#b87f65');
  for(let i=0;i<7;i++){
   const leaf=new T.Mesh(new T.SphereGeometry(1,10,8),new T.MeshStandardMaterial({color:i%2?'#739269':'#466d54',roughness:1}));
   leaf.position.set(x+Math.sin(i*2.4)*.042,2.405+(i%3)*.019,.12+Math.cos(i*2.4)*.035);
   leaf.scale.set(.018,.056,.027);leaf.rotation.z=Math.sin(i)*.6;p.add(leaf);
  }
 }
 type Point=readonly[number,number];
 function run(name:string,a:Point,b:Point,kitchen=false){
  const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
  const shelf=new T.Group();shelf.name=name;shelf.position.set(a[0],0,a[1]);shelf.rotation.y=-Math.atan2(dz,dx);group.add(shelf);
  box(shelf,length/2,2.255,.12,length,.03,.22);
  // Small wall brackets, below the board.
  const brackets=Math.max(2,Math.ceil(length/.9));
  for(let i=0;i<brackets;i++){const x=.12+(length-.24)*i/(brackets-1);box(shelf,x,2.19,.025,.025,.13,.025,'#6e756b');box(shelf,x,2.23,.10,.025,.02,.18,'#6e756b');}
  const count=Math.max(1,Math.floor(length/.7));
  for(let i=0;i<count;i++){
   const x=(i+.5)*length/count;
   if(i%3===0)plant(shelf,x);
   else if(kitchen){
    for(let j=0;j<3;j++){const h=.13+j*.025;cylinder(shelf,x+(j-1)*.09,2.27+h/2,.12,.034,h,['#ddc99d','#a9b5a2','#c28d72'][j]);cylinder(shelf,x+(j-1)*.09,2.27+h+.008,.12,.037,.016,'#a18461');}
   }else{
    for(let j=0;j<5;j++){const h=.18+(j%3)*.022;box(shelf,x+(j-2)*.036,2.27+h/2,.115,.03,h,.15,['#617985','#bd896b','#dfd4b9','#6c7964','#926d76'][j]);}
   }
  }
 }
 const a=sketch.bedroomFrontLeft,end=getHallwayEnd();
 // Living-room side of the bedroom partition and diagonal, ending at the glass wall.
 run('Shelf above sofa',[a[0]-.05,a[1]],[a[0]-.05,3.79]);
 const dx=a[0]-end[0],dz=a[1]-end[1],len=Math.hypot(dx,dz);
 const offset=(p:Point):Point=>[p[0]-dz/len*.05,p[1]+dx/len*.05];
 run('Shelf above piano',offset(end),offset(a));
 // Back kitchen wall and the solid service-core return wall; clear of facade windows.
 run('Kitchen back-wall shelf',[-4.66,-3.79],[-.48,-3.79],true);
 run('Kitchen return-wall shelf',[-.48,-3.79],[-.48,-1.97],true);
 return group;
}
