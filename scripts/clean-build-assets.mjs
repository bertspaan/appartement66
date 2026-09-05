import {readFile,rm} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
// Retain originals in the repository; deploy only the generated runtime copies.
const root=resolve('build');
const report=JSON.parse(await readFile('static/optimized/report.json','utf8'));
for(const {file} of report){
 const target=resolve(root,file);
 if(!target.startsWith(root+sep))throw new Error('Invalid asset path');
 await rm(target,{force:true});
}
await rm(resolve(root,'optimized/cache.json'),{force:true});
