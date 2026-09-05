import * as T from 'three';
import {base} from '$app/paths';
import catalog from '../../static/art/child-posters/sources.json';

export async function loadChildPosterTextures(){
 const loader=new T.TextureLoader();
 return Promise.all(catalog.map(async (item,i)=>{
  const texture=await loader.loadAsync(`${base}/optimized/art/child-posters/${item.file.replace(/\.[^.]+$/,'.webp')}`);
  texture.colorSpace=T.SRGBColorSpace;
  // Show the print itself, excluding the retailer photograph's white margins.
  if(i===0){texture.repeat.set(642/1005,959/1005);texture.offset.set(168/1005,20/1005);}
  return texture;
 }));
}

export function addChildPosters(parent:T.Group,textures:T.Texture[]){
 const group=new T.Group();group.name='Tip — Peppa Pig and Postman Pat';parent.add(group);
 catalog.forEach((item,i)=>{
  const texture=textures[i];
  const aspect=texture.image.width*texture.repeat.x/(texture.image.height*texture.repeat.y);
  const height=i===0?.62:.43,width=height*aspect;
  const poster=new T.Group();poster.name=item.name;poster.userData.source=item.source;
  poster.position.set(4.602,1.62,1.90+i*.75);poster.rotation.y=-Math.PI/2;group.add(poster);
  poster.add(new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshStandardMaterial({map:texture,roughness:1})));
  for(const side of [-1,1]){
   const tape=new T.Mesh(new T.PlaneGeometry(.055,.025),new T.MeshStandardMaterial({color:'#e8dbb8',roughness:1}));
   tape.position.set(side*width*.33,height/2-.008,.003);tape.rotation.z=side*.09;poster.add(tape);
  }
 });
 return group;
}
