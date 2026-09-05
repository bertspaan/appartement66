import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {NodeIO} from '@gltf-transform/core';
import {dedup,weld} from '@gltf-transform/functions';

export async function optimizeAssets(){
 const root=resolve('static'),output=resolve(root,'optimized');
 await mkdir(output,{recursive:true});
 /** @type {Record<string,string>} */
 let cache={};try{cache=JSON.parse(await readFile(resolve(output,'cache.json'),'utf8'));}catch{}
 /** @type {Record<string,string>} */
 const next={};
 /** @type {{file:string,before:number,after:number}[]} */
 const report=[];
 /** @param {string} relative @param {string} extension @param {object} settings @param {(input:string,dest:string)=>Promise<void>} transform */
 async function generate(relative,extension,settings,transform){
  const input=resolve(root,relative),dest=resolve(output,relative.replace(/\.[^.]+$/,extension));
  const bytes=await readFile(input);const hash=createHash('sha256').update(bytes).update(JSON.stringify(settings)).digest('hex');
  let exists=true;try{await stat(dest);}catch{exists=false;}
  if(cache[relative]!==hash||!exists){await mkdir(dirname(dest),{recursive:true});await transform(input,dest);}
  next[relative]=hash;report.push({file:relative,before:bytes.length,after:(await stat(dest)).size});
 }
 for(const name of ['blue-juicer','yellow-still-life','small-landscape'])await generate(`art/${name}.png`,'.webp',{size:1024,quality:85},async(input,dest)=>{await sharp(input).resize({width:1024,height:1024,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(dest);});
 for(const category of ['child-posters','teen-posters']){
  const catalog=JSON.parse(await readFile(resolve(root,'art',category,'sources.json'),'utf8'));
  for(const item of catalog)await generate(`art/${category}/${item.file}`,'.webp',{size:512,quality:82},async(input,dest)=>{await sharp(input).resize({width:512,height:512,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(dest);});
 }
 const io=new NodeIO();
 // Lossless vertex welding and duplicate-resource removal preserve source metadata,
 // dimensions, wall joins and every visible detail used by the layout code.
 for(const name of ['shell','existing','floor','balcony'])await generate(`model/${name}.glb`,'.glb',{version:1,operations:['weld','dedup']},async(input,dest)=>{const doc=await io.read(input);await doc.transform(weld(),dedup());await io.write(dest,doc);});
 await writeFile(resolve(output,'cache.json'),JSON.stringify(next));
 await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
 return report;
}
if(process.argv[1]?.endsWith('optimize-assets.mjs')){
 const report=await optimizeAssets();console.log(JSON.stringify(report,null,2));
}
