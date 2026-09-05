import * as T from 'three';
import {base} from '$app/paths';
import {addPaintings} from './paintings';
import {addPlanters} from './planters';
import {addSketchLayout} from './sketch-layout';
import {addTipBed,addPiano,addLamps,addKitchenIsland,addFestEdgeSofa,addColumnBookshelves,addKitchenAppliances} from './furnishings';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
export type Options={floor:string;light:string;furniture:boolean;doorOpen:number};
export async function createApartment(host:HTMLElement,onState:(message:string)=>void){
 const scene=new T.Scene();scene.background=new T.Color('#e9edf0');
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;host.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(48,1,.05,300);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.49;orbit.minDistance=2;orbit.maxDistance=35;
 const walk=new PointerLockControls(camera,renderer.domElement);walk.addEventListener('lock',()=>{orbit.enabled=false;onState('Lopen: W A S D of pijltjestoetsen · kijken met de muis · Esc om te stoppen');});walk.addEventListener('unlock',()=>{orbit.enabled=true;orbit.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()).multiplyScalar(4));onState('Slepen om te draaien · scrollen om te zoomen · slepen met de rechtermuisknop om te verschuiven');});
 const model=new T.Group();scene.add(model);const loader=new GLTFLoader();
 const [shell,existing,floor,balcony]=await Promise.all(['shell','existing','floor','balcony'].map(n=>loader.loadAsync(`${base}/model/${n}.glb`)));
 for(const g of [shell,existing,floor,balcony]){model.add(g.scene);g.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof T.MeshStandardMaterial)m.roughness=m.transparent?.15:.8;if(m.transparent)o.castShadow=false;});}});}
 // Replace the low source landscaping trays with the user's metre-high planters.
 balcony.scene.traverse(o=>{if(o instanceof T.Mesh){const source=String(o.userData.source_path??'').toLowerCase();if(source.includes('groenvoorziening')||source.includes('terreinmaterialen'))o.visible=false;}});
 addPlanters(model);
 // Finish overlay is a proposed material, independent of the original structural slab.
 // Simplified 1.10 m railing along the two exposed slab edges.
 // Exact railing profiles/heights need the architectural details.
 const railing=new T.Group();railing.name='Provisional balcony railing';model.add(railing);
 function railRun(ax:number,az:number,bx:number,bz:number){
  const length=Math.hypot(bx-ax,bz-az),count=Math.ceil(length/1.2);
  const bar=(x:number,y:number,z:number,w:number,h:number,d:number)=>{
   const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color:'#596369',metalness:.6,roughness:.45}));mesh.position.set(x,y,z);mesh.castShadow=true;railing.add(mesh);return mesh;
  };
  for(let i=0;i<=count;i++){const t=i/count;bar(ax+(bx-ax)*t,.55,az+(bz-az)*t,.045,1.10,.045);}
  for(const y of [.10,1.10]){const beam=bar((ax+bx)/2,y,(az+bz)/2,length,.045,.045);beam.rotation.y=-Math.atan2(bz-az,bx-ax);}
  const pane=new T.Mesh(new T.BoxGeometry(length,.95,.012),new T.MeshPhysicalMaterial({color:'#d3e5e9',transparent:true,opacity:.25,roughness:.2,side:T.DoubleSide,depthWrite:false}));pane.position.set((ax+bx)/2,.60,(az+bz)/2);pane.rotation.y=-Math.atan2(bz-az,bx-ax);railing.add(pane);
 }
 railRun(-7.11,-4.03,-7.11,5.99);railRun(-7.11,5.99,4.91,5.99);
 const finish=new T.Mesh(new T.BoxGeometry(9.32,.018,7.58),new T.MeshStandardMaterial({color:'#ae855a',roughness:.72}));finish.position.set(0,.012,0);finish.receiveShadow=true;model.add(finish);
 const partitions=new T.Group();partitions.name='Proposed bedroom partitions';model.add(partitions);
 const furniture=new T.Group();furniture.name='Proposed furniture';model.add(furniture);
 const hemi=new T.HemisphereLight('#dcecff','#a19a91',2);scene.add(hemi);
 const sun=new T.DirectionalLight('#fff1da',3);sun.position.set(-4,9,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.normalBias=.025;scene.add(sun);
 const lamps=addLamps(model);
 const paintings=await addPaintings(model);
 const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:'#dde3e7',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.42;ground.receiveShadow=true;scene.add(ground);
 const grid=new T.GridHelper(20,20,'#aab7be','#cbd3d8');grid.position.y=-.405;scene.add(grid);
 function box(group:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,color:string){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;}
 function clear(group:T.Group){for(const obj of [...group.children]){obj.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});group.remove(obj);}}
 function bed(x:number,z:number){box(furniture,x,.2,z,1.6,.35,2.05,'#7f6249');box(furniture,x,.46,z,1.58,.24,2,'#eee9df');box(furniture,x,.62,z-.25,1.6,.09,1.4,'#577d8c');box(furniture,x-.4,.65,z+.68,.57,.13,.4,'#fffaf0');box(furniture,x+.4,.65,z+.68,.57,.13,.4,'#fffaf0');}
 function update(o:Options){furniture.visible=o.furniture;
 (finish.material as T.MeshStandardMaterial).color.set(o.floor==='oak'?'#b58d60':o.floor==='concrete'?'#b8b8b3':'#73523e');
 hemi.intensity=o.light==='evening'?.35:2;sun.intensity=o.light==='evening'?.12:3;scene.background=new T.Color(o.light==='evening'?'#303943':'#e9edf0');lamps.setEvening(o.light==='evening');
 clear(partitions);clear(furniture);
 addSketchLayout(partitions,o.doorOpen);
 bed(.50,2.48);addTipBed(furniture);addPiano(furniture);
 addFestEdgeSofa(furniture);addColumnBookshelves(furniture);
 box(furniture,-2.8,.23,2.05,.65,.1,1.1,'#8c6245');addKitchenIsland(furniture);addKitchenAppliances(furniture);

 }
 function view(mode:string){if(walk.isLocked)walk.unlock();orbit.enabled=true;camera.up.set(0,1,0);if(mode==='plan'){camera.position.set(-1,23,1.01);orbit.target.set(-1,0,1);}else if(mode==='walk'){camera.position.set(0,1.65,-1.8);camera.lookAt(0,1.65,2);walk.lock();}else{camera.position.set(-14,14,-15);orbit.target.set(-1,.6,1);}orbit.update();}
 const keys=new Set<string>();const down=(e:KeyboardEvent)=>{if(walk.isLocked){keys.add(e.code);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();}};const up=(e:KeyboardEvent)=>keys.delete(e.code);const blur=()=>keys.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
 let last=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(walk.isLocked){const speed=dt*2;walk.moveForward(((keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0))*speed);walk.moveRight(((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0))*speed);camera.position.x=T.MathUtils.clamp(camera.position.x,-6.90,4.45);camera.position.z=T.MathUtils.clamp(camera.position.z,-3.55,5.75);camera.position.y=1.65;}else orbit.update();renderer.render(scene,camera);});
 async function download(){const buffer=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});const url=URL.createObjectURL(new Blob([buffer as ArrayBuffer],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='appartement-sarah-bert-tip.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 view('orbit');onState('Slepen om te draaien · scrollen om te zoomen · slepen met de rechtermuisknop om te verschuiven');
 return {update,view,download,destroy(){paintings.dispose();renderer.setAnimationLoop(null);resize.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);orbit.dispose();walk.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();}};
}
