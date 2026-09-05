import * as T from 'three';
import {base} from '$app/paths';
import {sketch,getInstrumentPlacement} from './sketch-layout';

export async function addPaintings(parent:T.Group){
 const group=new T.Group();group.name='Family paintings';
 const loader=new T.TextureLoader();
 const textures=await Promise.all(['blue-juicer','yellow-still-life','small-landscape'].map(name=>loader.loadAsync(`${base}/art/${name}.png`)));
 // Estimated canvas sizes, pending measurements of the originals.
 const a=sketch.bedroomFrontLeft,b=sketch.bedroomFrontRight;
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
 // Project the piano centre onto the diagonal wall, then clear its living-room face.
 const piano=getInstrumentPlacement();
 const t=((piano.x-a[0])*dx+(piano.z-a[1])*dz)/(length*length);
 const specs=[{width:.75,height:1,x:a[0]-.068,y:1.65,z:2.50,rotation:-Math.PI/2,frame:.018,color:'#e6dfcb'},
  {width:.52,height:.52,x:a[0]+t*dx+dz/length*.068,y:1.85,z:a[1]+t*dz-dx/length*.068,
   rotation:Math.PI-Math.atan2(dz,dx),frame:.075,color:'#99968b'},
  {width:.45,height:.15,x:a[0]+dx/length*.96-dz/length*.068,y:1.40,z:a[1]+dz/length*.96+dx/length*.068,rotation:-Math.atan2(dz,dx),frame:.018,color:'#ad8b70'}];
 specs.forEach((s,i)=>{
  const painting=new T.Group();painting.name=['Blue juicer painting','Yellow still life painting','Small landscape above the bed'][i];
  // Each frame follows its wall and faces into the living room.
  painting.position.set(s.x,s.y,s.z);painting.rotation.y=s.rotation;group.add(painting);
  const frameMaterial=new T.MeshStandardMaterial({color:s.color,roughness:.8});
  function frame(x:number,y:number,w:number,h:number){
   const part=new T.Mesh(new T.BoxGeometry(w,h,.035),frameMaterial);
   part.position.set(x,y,0);part.castShadow=true;part.receiveShadow=true;painting.add(part);
  }
  for(const x of [-1,1])frame(x*(s.width+s.frame)/2,0,s.frame,s.height+2*s.frame);
  for(const y of [-1,1])frame(0,y*(s.height+s.frame)/2,s.width,s.frame);
  textures[i].colorSpace=T.SRGBColorSpace;
  const canvas=new T.Mesh(new T.PlaneGeometry(s.width,s.height),new T.MeshStandardMaterial({map:textures[i],roughness:1}));
  canvas.position.z=.012;canvas.receiveShadow=true;painting.add(canvas);
 });
 parent.add(group);
 return {group,dispose(){textures.forEach(texture=>texture.dispose());}};
}
