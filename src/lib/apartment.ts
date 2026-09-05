import {addStorageShelves} from './storage-shelves';
import {loadChildPosterTextures,addChildPosters} from './child-posters';
import {loadTeenPosterTextures} from './teen-posters';
import {furnishBathrooms} from './bathrooms';
import {addEntranceDoorHandles,replaceServiceDoorLeaves,setWoodenDoorsOpen} from './wooden-doors';
import {addTipMarbleRun} from './marble-run';
import {addTipToyCabinet} from './toy-cabinet';
import * as T from 'three';
import {separateInteriorSurfaces} from './geometry-clearance';
import {base} from '$app/paths';
import {addOwnedBed,addCounterAppliances,addTipAnimals,addDiningTable} from './household';
import {addBalconyStringLights} from './balcony-lights';
import {addHighShelves} from './high-shelves';
import {addPaintings} from './paintings';
import {addPlanters} from './planters';
import {addSketchLayout} from './sketch-layout';
import {addBalconyBistroTable,addTipBed,addTipTeenRoom,addPiano,addNordElectro,addLamps,addKitchenIsland,addFestEdgeSofa,addColumnBookshelves,addKitchenAppliances} from './furnishings';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
export type Options={floor:string;light:string;furniture:boolean;doorOpen:number;hallwayWall:boolean;doorsOpen:boolean;instrument:'upright'|'nord';tipAge:'child'|'teen'};
export async function createApartment(host:HTMLElement,onState:(message:string)=>void){
 const scene=new T.Scene();
 const dayBackground='linear-gradient(155deg, #fff9ee 0%, #eef0b7 45%, #c6d843 100%)';
 const eveningBackground='linear-gradient(155deg, #41452a 0%, #303821 55%, #222918 100%)';
 host.style.background=dayBackground;
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;host.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(48,1,.05,300);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.49;orbit.minDistance=2;orbit.maxDistance=35;
 const walk=new PointerLockControls(camera,renderer.domElement);walk.addEventListener('lock',()=>{orbit.enabled=false;onState('↑/↓ of W/S: lopen · ←/→: draaien · A/D: zijwaarts · muis: kijken · Esc: stoppen');});walk.addEventListener('unlock',()=>{keys.clear();orbit.enabled=true;orbit.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()).multiplyScalar(4));onState('Slepen om te draaien · scrollen om te zoomen · slepen met de rechtermuisknop om te verschuiven');});
 const model=new T.Group();scene.add(model);const loader=new GLTFLoader();
 const [shell,existing,floor,balcony]=await Promise.all(['shell','existing','floor','balcony'].map(n=>loader.loadAsync(`${base}/model/${n}.glb`)));
 separateInteriorSurfaces(shell.scene);separateInteriorSurfaces(existing.scene);
 for(const g of [shell,existing,floor,balcony]){model.add(g.scene);g.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof T.MeshStandardMaterial)m.roughness=m.transparent?.15:.8;if(m.transparent)o.castShadow=false;});}});}
 // Replace the low source landscaping trays with the user's metre-high planters.
 balcony.scene.traverse(o=>{if(o instanceof T.Mesh){const source=String(o.userData.source_path??'').toLowerCase();if(source.includes('groenvoorziening')||source.includes('terreinmaterialen'))o.visible=false;}});
 shell.scene.traverse(object=>{if(object instanceof T.Mesh&&String(object.userData.source_path).includes('Expansievat_wasmachine'))object.visible=false;});
 furnishBathrooms(shell.scene,model);
 replaceServiceDoorLeaves(existing.scene,model);addEntranceDoorHandles(model);
 addPlanters(model);addHighShelves(model);
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
 const balconyLights=addBalconyStringLights(model);
 const paintings=await addPaintings(model);
 const teenPosterTextures=await loadTeenPosterTextures();
 const childPosterTextures=await loadChildPosterTextures();
 const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({color:'#586225',opacity:.16}));ground.rotation.x=-Math.PI/2;ground.position.y=-.42;ground.receiveShadow=true;scene.add(ground);
 const grid=new T.GridHelper(20,20,'#7f8b40','#9ca859');grid.material.transparent=true;grid.material.opacity=.12;grid.material.depthWrite=false;grid.position.y=-.405;scene.add(grid);
 function box(group:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,color:string){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;}
 function clear(group:T.Group){for(const obj of [...group.children]){obj.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});group.remove(obj);}}
 function update(o:Options){furniture.visible=o.furniture;
 (finish.material as T.MeshStandardMaterial).color.set(o.floor==='oak'?'#b58d60':o.floor==='concrete'?'#b8b8b3':'#73523e');
 hemi.intensity=o.light==='evening'?.35:2;sun.intensity=o.light==='evening'?.12:3;host.style.background=o.light==='evening'?eveningBackground:dayBackground;lamps.setEvening(o.light==='evening');balconyLights.setEvening(o.light==='evening');
 clear(partitions);clear(furniture);
 addSketchLayout(partitions,o.doorOpen,o.hallwayWall);
 setWoodenDoorsOpen(model,o.doorsOpen);
 addOwnedBed(furniture);if(o.tipAge==='teen')addTipTeenRoom(furniture,teenPosterTextures);else{addTipBed(furniture);addTipAnimals(furniture);addTipToyCabinet(furniture);addTipMarbleRun(furniture);addChildPosters(furniture,childPosterTextures);}if(o.instrument==='nord')addNordElectro(furniture);else addPiano(furniture);
 addStorageShelves(furniture);addFestEdgeSofa(furniture);addColumnBookshelves(furniture);
 box(furniture,-2.8,.23,2.05,.65,.1,1.1,'#8c6245');addBalconyBistroTable(furniture);addKitchenIsland(furniture);addDiningTable(furniture);addKitchenAppliances(furniture);addCounterAppliances(furniture);

 }
 function view(mode:string){if(walk.isLocked)walk.unlock();orbit.enabled=true;camera.up.set(0,1,0);if(mode==='plan'){camera.position.set(-1,23,1.01);orbit.target.set(-1,0,1);}else if(mode==='walk'){camera.position.set(0,1.65,-1.8);camera.lookAt(0,1.65,2);walk.lock();}else{orbit.target.set(-1,.6,1);camera.position.set(-16,13.4,13).multiplyScalar(mode==='preview'?1:.65).add(orbit.target);}orbit.update();}
 const keys=new Set<string>();const down=(e:KeyboardEvent)=>{if(walk.isLocked){keys.add(e.code);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();}};const up=(e:KeyboardEvent)=>keys.delete(e.code);const blur=()=>keys.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
 const turnRotation=new T.Quaternion(),upAxis=new T.Vector3(0,1,0);
 let last=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(walk.isLocked){const speed=dt*2;const turn=(keys.has('ArrowLeft')?1:0)-(keys.has('ArrowRight')?1:0);
 // Rotate around world-up so mouse pitch never tilts keyboard turning.
 camera.quaternion.premultiply(turnRotation.setFromAxisAngle(upAxis,turn*dt*Math.PI/2));
 walk.moveForward(((keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0))*speed);walk.moveRight(((keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0))*speed);camera.position.x=T.MathUtils.clamp(camera.position.x,-6.90,4.45);camera.position.z=T.MathUtils.clamp(camera.position.z,-3.55,5.75);camera.position.y=1.65;}else orbit.update();renderer.render(scene,camera);});
 async function download(){const buffer=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});const url=URL.createObjectURL(new Blob([buffer as ArrayBuffer],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='appartement-sarah-bert-tip.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 view('orbit');onState('Slepen om te draaien · scrollen om te zoomen · slepen met de rechtermuisknop om te verschuiven');
 return {update,view,download,destroy(){childPosterTextures.forEach(texture=>texture.dispose());teenPosterTextures.forEach(texture=>texture.dispose());paintings.dispose();renderer.setAnimationLoop(null);resize.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);orbit.dispose();walk.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();}};
}
