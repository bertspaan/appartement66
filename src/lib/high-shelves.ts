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
 type Point=readonly[number,number];
 function run(name:string,a:Point,b:Point,kitchen=false){
  const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
  const shelf=new T.Group();shelf.name=name;shelf.position.set(a[0],0,a[1]);shelf.rotation.y=-Math.atan2(dz,dx);group.add(shelf);
  box(shelf,length/2,2.255,.12,length,.03,.22);
  // Small wall brackets, below the board.
  const brackets=Math.max(2,Math.ceil(length/.9));
  for(let i=0;i<brackets;i++){const x=.12+(length-.24)*i/(brackets-1);box(shelf,x,2.19,.025,.025,.13,.025,'#6e756b');box(shelf,x,2.23,.10,.025,.02,.18,'#6e756b');}
  if(!kitchen){
   // Continuous rows, with varied book heights and spine colours.
   const count=Math.floor((length-.08)/.033),step=(length-.08)/count;
   for(let i=0;i<count;i++){
    const x=.04+(i+.5)*step,h=.19+(i*7%9)*.014;
    box(shelf,x,2.27+h/2,.115,step-.002,h,.17,['#617985','#bd896b','#dfd4b9','#6c7964','#926d76','#394a57','#ad9c6e'][i%7]);
    box(shelf,x,2.27+h-.035,.201,step*.65,.004,.002,'#e9ddc7');
   }
  }else{
   const count=Math.floor((length-.16)/.24),step=(length-.16)/count;
   for(let i=0;i<count;i++){
    const x=.08+(i+.5)*step;
    if(i%4===0){
     // Stacks of small plates.
     for(let j=0;j<6;j++)cylinder(shelf,x,2.277+j*.012,.12,.087,.012,'#e4e0d1');
    }else if(i%4===1){
     const h=.16+(i%3)*.025;
     cylinder(shelf,x,2.27+h/2,.12,.052,h,'#c2b28c');
     cylinder(shelf,x,2.278+h,.12,.055,.016,'#9a805d');
    }else if(i%4===2){
     for(const offset of [-.055,.055]){
      cylinder(shelf,x+offset,2.318,.11,.034,.096,'#8fa5a0');
      const handle=new T.Mesh(new T.TorusGeometry(.025,.005,8,16),new T.MeshStandardMaterial({color:'#8fa5a0',roughness:.8}));
      handle.position.set(x+offset+.041,2.324,.11);shelf.add(handle);
     }
    }else{
     // Utensil crock with wooden spoons.
     cylinder(shelf,x,2.33,.12,.048,.12,'#b88167');
     for(let j=0;j<3;j++){
      cylinder(shelf,x+(j-1)*.022,2.44,.12,.003,.20,'#c4a475');
      const spoon=new T.Mesh(new T.SphereGeometry(1,10,8),wood);spoon.scale.set(.011,.025,.004);spoon.position.set(x+(j-1)*.022,2.53,.12);shelf.add(spoon);
     }
    }
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
