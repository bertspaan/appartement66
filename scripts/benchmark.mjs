import {chromium} from 'playwright-core';
import {createServer} from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:0},logLevel:'silent'});await server.listen();let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.httpServer.address().port}${server.config.base}benchmark-fixture`);
 const result=await page.evaluate(async(base)=>{
  document.body.innerHTML='<div id="benchmark" style="width:1200px;height:800px"></div>';
  const {createApartment}=await import(`${base}src/lib/apartment.ts`);
  const app=await createApartment(document.getElementById('benchmark'),()=>{});
  const options={floor:'oak',light:'day',furniture:true,doorOpen:0,hallwayWall:true,doorsOpen:false,instrument:'upright',tipAge:'child'};
  const wait=()=>new Promise(r=>setTimeout(r,250));
  app.update(options);await wait();const initial=app.stats();
  const start=performance.now();app.update({...options,floor:'concrete'});const updateMs=performance.now()-start;
  await wait();const settled=app.stats();await wait();const idle=app.stats();
  if(idle.frames!==settled.frames)throw new Error('Renderer keeps running at rest');
  if(idle.furnitureBuilds!==initial.furnitureBuilds)throw new Error('Floor change rebuilds furniture');
  if(idle.shadowUpdates!==initial.shadowUpdates)throw new Error('Floor change rebuilds shadows');
  app.update({...options,light:'evening'});await wait();
  if(app.stats().furnitureBuilds!==initial.furnitureBuilds)throw new Error('Lighting change rebuilds furniture');
  for(let i=0;i<3;i++){
   app.update({...options,tipAge:'teen',instrument:'nord',doorsOpen:true,hallwayWall:false});await wait();
   app.update(options);await wait();
  }
  const restored=app.stats();
  if(restored.geometries!==initial.geometries||restored.calls!==initial.calls)throw new Error('Variant switching leaks geometry or changes restored scene');
  window.benchmarkApp=app;return {initial,updateMs,settled,idle,restored};
 },server.config.base);
 const canvas=page.locator('canvas');const before=await canvas.screenshot();
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');await page.waitForTimeout(300);
 const rotated=await canvas.screenshot();if(before.equals(rotated))throw new Error('Arrow rotation failed');
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(300);await page.keyboard.up('ArrowUp');await page.waitForTimeout(300);
 if(rotated.equals(await canvas.screenshot()))throw new Error('Arrow zoom failed');
 const shadows=await page.evaluate(()=>window.benchmarkApp.stats().shadowUpdates);
 if(shadows!==result.restored.shadowUpdates)throw new Error('Camera movement rebuilds shadows');
 await page.evaluate(()=>window.benchmarkApp.destroy());
 if(errors.length)throw new Error(errors.join('\n'));
 console.log(JSON.stringify(result,null,2));console.log('PASS: idle rendering, selective updates, shadow cache, room/instrument variants, arrow controls and cleanup.');
}finally{await browser?.close();await server.close();}
