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
  // Stable per-shelf variation: changing other options never reshuffles the objects.
  let seed=Array.from(name).reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),17)>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const colors=['#617985','#bd896b','#dfd4b9','#6c7964','#926d76','#394a57','#ad9c6e','#b95b48','#dedbcf','#526a67','#d0ab57'];
  const pick=()=>colors[Math.floor(random()*colors.length)];
  if(!kitchen){
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
  }else{
   let x=.08;
   while(x<length-.20){
    const kind=Math.floor(random()*7),width=.16+random()*.10,center=x+width/2;
    if(center+.10>length-.025)break;
    const color=pick();
    if(kind===0){
     const count=3+Math.floor(random()*6);
     for(let j=0;j<count;j++)cylinder(shelf,center,2.277+j*.012,.12,.07+random()*.012,.012,j%3===0?color:'#e4e0d1');
    }else if(kind===1){
     const h=.13+random()*.14;
     cylinder(shelf,center,2.27+h/2,.12,.047+random()*.012,h,color);
     cylinder(shelf,center,2.278+h,.12,.059,.016,'#9a805d');
    }else if(kind===2){
     for(const offset of [-.052,.052]){
      cylinder(shelf,center+offset,2.316,.11,.033,.092,color);
      const handle=new T.Mesh(new T.TorusGeometry(.025,.005,8,16),new T.MeshStandardMaterial({color,roughness:.8}));
      handle.position.set(center+offset+.039,2.324,.11);shelf.add(handle);
     }
    }else if(kind===3){
     cylinder(shelf,center,2.33,.12,.048,.12,'#b88167');
     for(let j=0;j<3;j++){
      const h=.15+random()*.07;
      cylinder(shelf,center+(j-1)*.022,2.35+h/2,.12,.003,h,'#c4a475');
      const spoon=new T.Mesh(new T.SphereGeometry(1,10,8),wood);spoon.scale.set(.011,.025,.004);spoon.position.set(center+(j-1)*.022,2.35+h,.12);shelf.add(spoon);
     }
    }else if(kind===4){
     // Nested serving bowls, with a contrasting rim.
     for(let j=0;j<3;j++){
      cylinder(shelf,center,2.30+j*.03,.12,.075+j*.008,.055,j===1?'#eee4cf':color);
     }
    }else if(kind===5){
     // Small lidded casserole with two dark handles.
     cylinder(shelf,center,2.33,.12,.072,.12,color);
     cylinder(shelf,center,2.397,.12,.078,.015,'#a3aaa6');
     box(shelf,center,2.414,.12,.032,.02,.022,'#454b46');
     for(const side of [-1,1])box(shelf,center+side*.085,2.35,.12,.033,.018,.032,'#454b46');
    }else{
     // A short group of cookbooks between the crockery.
     for(let j=0;j<4;j++){
      const h=.18+random()*.08;
      box(shelf,center-.06+j*.04,2.27+h/2,.12,.032,h,.16,pick());
     }
    }
    x+=width+.025+random()*.065;
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
