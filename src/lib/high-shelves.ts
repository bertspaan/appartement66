import * as T from 'three';
import {kitchen as kitchenLayout} from './kitchen-layout';
import {getHallwayEnd,sketch} from './sketch-layout';

// Shelf top 35 cm below the 2.62 m ceiling; 22 cm usable depth.
export function addHighShelves(parent:T.Group){
 const group=new T.Group();group.name='Continuous high wall shelves';parent.add(group);
 const wood=new T.MeshStandardMaterial({color:'#c4a278',roughness:.8});
 function box(p:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,color?:string){
  const m=new T.Mesh(new T.BoxGeometry(w,h,d),color?new T.MeshStandardMaterial({color,roughness:.85}):wood);
  m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;
 }
 type Point=readonly[number,number];
 function run(name:string,a:Point,b:Point,kitchen=false){
  const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
  const shelf=new T.Group();shelf.name=name;shelf.position.set(a[0],0,a[1]);shelf.rotation.y=-Math.atan2(dz,dx);group.add(shelf);
  box(shelf,length/2,2.255,.12,length,.03,.22);
  // Small wall brackets, below the board.
  const brackets=Math.max(2,Math.ceil(length/.9));
  for(let i=0;i<brackets;i++){const x=.12+(length-.24)*i/(brackets-1);box(shelf,x,2.19,.025,.025,.13,.025,'#6e756b');box(shelf,x,2.23,.10,.025,.02,.18,'#6e756b');}
  // Leave the kitchen boards empty while keeping the living-room books.
  if(kitchen)return;
  // Stable per-shelf variation: changing other options never reshuffles the objects.
  let seed=Array.from(name).reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),17)>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const colors=['#617985','#bd896b','#dfd4b9','#6c7964','#926d76','#394a57','#ad9c6e','#b95b48','#dedbcf','#526a67','#d0ab57'];
  const pick=()=>colors[Math.floor(random()*colors.length)];
  // Mixed upright runs and horizontal piles, with irregular widths and breathing room.
  let x=.035;
  while(x<length-.06){
   if(random()<.23&&x+.24<length-.03){
    const width=.17+random()*.05,count=3+Math.floor(random()*3);let y=2.27;
    for(let j=0;j<count;j++){
     const thickness=.017+random()*.019,w=width-random()*.024;
     const book=box(shelf,x+width/2+(random()-.5)*.012,y+thickness/2,.115,w,thickness,.15+random()*.025,pick());
     book.rotation.y=(random()-.5)*.09;y+=thickness+.002;
    }
    x+=width+.015+random()*.022;
   }else{
    const count=3+Math.floor(random()*7);
    for(let j=0;j<count&&x<length-.06;j++){
     const w=Math.min(.018+random()*.034,length-.03-x),h=.15+random()*.155,d=.135+random()*.06;
     box(shelf,x+w/2,2.27+h/2,.12+(random()-.5)*.009,w,h,d,pick());
     if(random()>.22){
      const z=.12+d/2+.006;
      box(shelf,x+w/2,2.27+h-.035,z,w*.65,.005,.002,'#e9ddc7');
      if(random()>.55)box(shelf,x+w/2,2.30,z,w*.72,.003,.002,'#cfbc99');
     }
     x+=w+.003;
    }
    x+=.008+random()*.016;
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
 // Leave the recirculation chimney and its side outlets clear of the shelf.
 const hoodLeft=kitchenLayout.hobX-kitchenLayout.hoodShelfGap/2,hoodRight=kitchenLayout.hobX+kitchenLayout.hoodShelfGap/2;
 run('Kitchen back-wall shelf left',[-4.66,-3.79],[hoodLeft,-3.79],true);
 run('Kitchen back-wall shelf right',[hoodRight,-3.79],[-.48,-3.79],true);
 run('Kitchen return-wall shelf',[-.48,-3.79],[-.48,-1.97],true);
 return group;
}
