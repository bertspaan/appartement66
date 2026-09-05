import {access, rename, rm} from 'node:fs/promises';
import {homedir} from 'node:os';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output=resolve(root, 'static/og-apartment.jpg');
const temporary=`${output}.tmp`;
const candidates=process.env.CHROME_PATH ? [process.env.CHROME_PATH] : [
 '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
 resolve(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
];
let server;
let browser;
try{
 let executablePath;
 for(const path of candidates){
  try{await access(path);executablePath=path;break;}catch{/* Try the next installation. */}
 }
 if(!executablePath)throw new Error('Google Chrome not found. Install Chrome for macOS or set CHROME_PATH to its executable.');
 // An isolated local server leaves any existing development server untouched.
 server=await createServer({root,server:{host:'127.0.0.1',port:0,open:false},logLevel:'error'});
 await server.listen();
 const address=server.httpServer.address();
 if(!address||typeof address==='string')throw new Error('Could not determine the preview server port.');
 const url=`http://127.0.0.1:${address.port}${server.config.base}preview-render/`;
 browser=await chromium.launch({executablePath,headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(url,{waitUntil:'networkidle',timeout:120000});
 const card=page.locator('[data-preview-state]');
 await page.waitForFunction(()=>['ready','error'].includes(document.querySelector('[data-preview-state]')?.getAttribute('data-preview-state')??''),{},{timeout:120000});
 if(await card.getAttribute('data-preview-state')!=='ready')throw new Error('The apartment model failed to load; see the preview page.');
 await card.screenshot({path:temporary,type:'jpeg',quality:95});
 await rename(temporary,output);
 console.log(`Saved ${output} (1200 × 630)`);
}catch(error){
 console.error(error instanceof Error?error.message:error);
 process.exitCode=1;
}finally{
 await browser?.close();
 await server?.close();
 await rm(temporary,{force:true});
}
