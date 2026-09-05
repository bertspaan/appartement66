import * as T from 'three';
import {base} from '$app/paths';
import catalog from '../../static/art/teen-posters/sources.json';

export async function loadTeenPosterTextures(){
 const loader=new T.TextureLoader();
 return Promise.all(catalog.map(async item=>{
  const texture=await loader.loadAsync(`${base}/optimized/art/teen-posters/${item.file.replace(/\.[^.]+$/,'.webp')}`);
  texture.colorSpace=T.SRGBColorSpace;
  // Square retailer photos have equal white side margins around a 2:3 print.
  if(texture.image.width===texture.image.height){texture.repeat.x=2/3;texture.offset.x=1/6;}
  return texture;
 }));
}

export function addTeenPosters(parent:T.Group,textures:T.Texture[]){
 const posters=new T.Group();posters.name='Tip — ten real posters';parent.add(posters);
 catalog.forEach((item,i)=>{
  const p=new T.Group();p.name=item.name;p.userData.source=item.source;posters.add(p);
  const texture=textures[i];
  const aspect=texture.image.width/texture.image.height*texture.repeat.x;
  const height=i<8?.53:.45,width=height*aspect;
  if(i<8){
   // Two rows above the bed, including one landscape print.
   const column=i%4,row=Math.floor(i/4);
   p.position.set(4.602,1.46+row*.65,1.15+column*.64);p.rotation.y=-Math.PI/2;
  }else{
   p.position.set(2.006,2.27,1.78+(i-8)*.65);p.rotation.y=Math.PI/2;
  }
  const print=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshStandardMaterial({map:texture,roughness:1}));p.add(print);
  for(const side of [-1,1]){
   const tape=new T.Mesh(new T.PlaneGeometry(.055,.025),new T.MeshStandardMaterial({color:'#e8dbb8',roughness:1}));
   tape.position.set(side*width*.33,height/2-.008,.003);tape.rotation.z=side*.09;p.add(tape);
  }
 });
 return posters;
}
