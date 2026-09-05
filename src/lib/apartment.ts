import {addEntranceFurniture} from './entrance-furniture';
import {addStandingDesk} from './standing-desk';
import {addKitchenRack} from './kitchen-rack';
import {addOwnedArmchair} from './furnishings';
import {optimizeScene} from './optimize-scene';
import {addStorageShelves} from './storage-shelves';
import {loadChildPosterTextures,addChildPosters} from './child-posters';
import {loadTeenPosterTextures} from './teen-posters';
import {furnishBathrooms} from './bathrooms';
import {addEntranceDoorHandles,replaceServiceDoorLeaves,setWoodenDoorsOpen} from './wooden-doors';
import {addTipMarbleRun} from './marble-run';
import {addTipToyCabinet} from './toy-cabinet';
import * as T from 'three';
import {separateFacadeLayers,separateFloorEdges,repairBuildingJunctions,separateInteriorSurfaces} from './geometry-clearance';
import {base} from '$app/paths';
import {addOwnedBed,addCounterAppliances,addTipAnimals,addDiningTable} from './household';
import {addBalconyStringLights} from './balcony-lights';
import {addHighShelves} from './high-shelves';
import {addPaintings} from './paintings';
import {addPlanters} from './planters';
import {addSketchLayout} from './sketch-layout';
import {addRectangularBalconyTable,addBalconyBistroTable,addTipBed,addTipTeenRoom,addPiano,addNordElectro,addLamps,addKitchenIsland,addFestEdgeSofa,addColumnBookshelves,addKitchenAppliances} from './furnishings';
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
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;host.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(48,1,.05,300);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.49;orbit.minDistance=2;orbit.maxDistance=35;
 const walk=new PointerLockControls(camera,renderer.domElement);walk.addEventListener('lock',()=>{orbit.enabled=false;onState('↑/↓ of W/S: lopen · ←/→: draaien · A/D: zijwaarts · muis: kijken · Esc: stoppen');invalidate();});walk.addEventListener('unlock',()=>{keys.clear();orbit.enabled=true;orbit.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()).multiplyScalar(4));invalidate();onState('←/→: draaien · ↑/↓: zoomen · slepen: draaien · rechtermuisknop: verschuiven');});
 const model=new T.Group();scene.add(model);const loader=new GLTFLoader();
 const [shell,existing,floor,balcony]=await Promise.all(['shell','existing','floor','balcony'].map(n=>loader.loadAsync(`${base}/optimized/model/${n}.glb`)));
 separateInteriorSurfaces(shell.scene);separateInteriorSurfaces(existing.scene);
 repairBuildingJunctions([shell.scene,existing.scene,balcony.scene]);
 separateFacadeLayers(shell.scene);
 separateFloorEdges([shell.scene,existing.scene,floor.scene,balcony.scene]);
 for(const g of [shell,existing,floor,balcony]){model.add(g.scene);g.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof T.MeshStandardMaterial)m.roughness=m.transparent?.15:.8;if(m.transparent)o.castShadow=false;});}});}
 // Replace the low source landscaping trays with the user's metre-high planters.
 balcony.scene.traverse(o=>{if(o instanceof T.Mesh){const source=String(o.userData.source_path??'').toLowerCase();if(source.includes('groenvoorziening')||source.includes('terreinmaterialen'))o.visible=false;}});
 shell.scene.traverse(object=>{if(object instanceof T.Mesh&&String(object.userData.source_path).includes('Expansievat_wasmachine'))object.visible=false;});
 furnishBathrooms(shell.scene,model);
 replaceServiceDoorLeaves(existing.scene,model);addEntranceDoorHandles(model);
 addPlanters(model);addHighShelves(model);
 // Use the original balcony railing, restoring its glass material instead of
 // drawing a second provisional railing in front of the source panels.
 const railingGlass=new T.MeshPhysicalMaterial({color:'#dceeed',transparent:true,opacity:.18,roughness:.08,metalness:.05,side:T.DoubleSide,depthWrite:false});
 balcony.scene.traverse(object=>{
  if(!(object instanceof T.Mesh))return;
  const source=String(object.userData.source_path??'').toLowerCase();
  if(source.includes('34_reling')&&source.includes('glas')){
   object.material=railingGlass;object.castShadow=false;object.receiveShadow=false;
  }
 });
 optimizeScene(model);
 const finish=new T.Mesh(new T.BoxGeometry(9.36,.018,7.62),new T.MeshStandardMaterial({color:'#ae855a',roughness:.72}));finish.position.set(0,.012,0);finish.receiveShadow=true;model.add(finish);
 const partitions=new T.Group();partitions.name='Proposed bedroom partitions';model.add(partitions);
 const furniture=new T.Group();furniture.name='Proposed furniture';model.add(furniture);
 const tipRoom=new T.Group(),instrument=new T.Group();tipRoom.name='Tip room variant';instrument.name='Instrument variant';furniture.add(tipRoom,instrument);
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
 let previous:Options|undefined;
 let furnitureBuilds=0;
 function update(o:Options){
  furniture.visible=o.furniture;
  (finish.material as T.MeshStandardMaterial).color.set(o.floor==='oak'?'#b58d60':o.floor==='concrete'?'#b8b8b3':'#73523e');
  if(!previous||previous.light!==o.light){
   hemi.intensity=o.light==='evening'?.35:2;sun.intensity=o.light==='evening'?.12:3;host.style.background=o.light==='evening'?eveningBackground:dayBackground;lamps.setEvening(o.light==='evening');balconyLights.setEvening(o.light==='evening');
  }
  if(!previous||previous.doorOpen!==o.doorOpen||previous.hallwayWall!==o.hallwayWall){
   clear(partitions);addSketchLayout(partitions,o.doorOpen,o.hallwayWall);
  }
  setWoodenDoorsOpen(model,o.doorsOpen);
  if(!previous){
   const fixed=new T.Group();fixed.name='Fixed furniture';furniture.add(fixed);
   addOwnedArmchair(fixed);addKitchenRack(fixed);addStandingDesk(fixed);addEntranceFurniture(fixed);addOwnedBed(fixed);addStorageShelves(fixed);addFestEdgeSofa(fixed);addColumnBookshelves(fixed);
   addBalconyBistroTable(fixed);addRectangularBalconyTable(fixed);addKitchenIsland(fixed);addDiningTable(fixed);addKitchenAppliances(fixed);addCounterAppliances(fixed);
   optimizeScene(fixed);furnitureBuilds++;
  }
  if(!previous||previous.tipAge!==o.tipAge){
   clear(tipRoom);
   if(o.tipAge==='teen')addTipTeenRoom(tipRoom,teenPosterTextures);
   else{addTipBed(tipRoom);addTipAnimals(tipRoom);addTipToyCabinet(tipRoom);addTipMarbleRun(tipRoom);addChildPosters(tipRoom,childPosterTextures);}
   optimizeScene(tipRoom);furnitureBuilds++;
  }
  if(!previous||previous.instrument!==o.instrument){
   clear(instrument);if(o.instrument==='nord')addNordElectro(instrument);else addPiano(instrument);
   optimizeScene(instrument);furnitureBuilds++;
  }
  const shadowsChanged=!previous||(['light','furniture','doorOpen','hallwayWall','doorsOpen','tipAge','instrument'] as const).some(key=>previous![key]!==o[key]);
  previous={...o};invalidate(shadowsChanged);
 }
 let currentView='orbit';
 function view(mode:string){keys.clear();currentView=mode;if(walk.isLocked)walk.unlock();orbit.enabled=true;camera.up.set(0,1,0);if(mode==='plan'){camera.position.set(-1,23,1.01);orbit.target.set(-1,0,1);}else if(mode==='walk'){camera.position.set(0,1.65,-1.8);camera.lookAt(0,1.65,2);walk.lock();}else{orbit.target.set(-1,.6,1);camera.position.set(-16,13.4,13).multiplyScalar(mode==='preview'?1:.65).add(orbit.target);}orbit.update();invalidate();}
 const keys=new Set<string>();
 const arrowKeys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
 const down=(e:KeyboardEvent)=>{
  if(walk.isLocked){keys.add(e.code);invalidate();if([...arrowKeys,'Space'].includes(e.code))e.preventDefault();return;}
  // Preserve native arrow-key behavior in sidebar inputs and editable fields.
  const editing=e.target instanceof Element&&e.target.closest('input,select,textarea,[contenteditable="true"],[role="slider"],[role="radio"]');
  if(currentView==='orbit'&&arrowKeys.includes(e.code)&&!editing&&!e.altKey&&!e.ctrlKey&&!e.metaKey){keys.add(e.code);invalidate();e.preventDefault();}
 };
 const up=(e:KeyboardEvent)=>keys.delete(e.code);
 const blur=()=>keys.clear();
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);window.addEventListener('focusin',blur);
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();invalidate();});resize.observe(host);
 const turnRotation=new T.Quaternion(),upAxis=new T.Vector3(0,1,0),overviewOffset=new T.Vector3();
 let pendingFrame=0,disposed=false,frames=0,shadowUpdates=0;
 function invalidate(shadows=false){
  if(shadows)renderer.shadowMap.needsUpdate=true;
  if(!disposed&&!pendingFrame)pendingFrame=requestAnimationFrame(render);
 }
 const orbitChanged=()=>invalidate();orbit.addEventListener('change',orbitChanged);
 const mouseChanged=()=>{if(walk.isLocked)invalidate();};walk.addEventListener('change',mouseChanged);
 let last=performance.now();
 function render(){pendingFrame=0;if(disposed)return;const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(walk.isLocked){const speed=dt*2;const turn=(keys.has('ArrowLeft')?1:0)-(keys.has('ArrowRight')?1:0);
 // Rotate around world-up so mouse pitch never tilts keyboard turning.
 camera.quaternion.premultiply(turnRotation.setFromAxisAngle(upAxis,turn*dt*Math.PI/2));
 walk.moveForward(((keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0))*speed);walk.moveRight(((keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0))*speed);camera.position.x=T.MathUtils.clamp(camera.position.x,-6.90,4.45);camera.position.z=T.MathUtils.clamp(camera.position.z,-3.55,5.75);camera.position.y=1.65;}else{
  if(currentView==='orbit'){
   const turn=Number(keys.has('ArrowLeft'))-Number(keys.has('ArrowRight'));
   const zoom=Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'));
   if(turn||zoom){
    overviewOffset.copy(camera.position).sub(orbit.target);
    overviewOffset.applyAxisAngle(upAxis,turn*dt*Math.PI/2);
    const distance=T.MathUtils.clamp(overviewOffset.length()*Math.exp(zoom*dt),orbit.minDistance,orbit.maxDistance);
    overviewOffset.setLength(distance);camera.position.copy(orbit.target).add(overviewOffset);
   }
  }
  orbit.update();
 }if(renderer.shadowMap.needsUpdate)shadowUpdates++;renderer.render(scene,camera);frames++;
 if(keys.size)invalidate();
 }

 async function download(){const buffer=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});const url=URL.createObjectURL(new Blob([buffer as ArrayBuffer],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='appartement-sarah-bert-tip.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 view('orbit');onState('←/→: draaien · ↑/↓: zoomen · slepen: draaien · rechtermuisknop: verschuiven');
 return {update,view,download,stats(){return {frames,shadowUpdates,furnitureBuilds,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures};},destroy(){disposed=true;cancelAnimationFrame(pendingFrame);orbit.removeEventListener('change',orbitChanged);walk.removeEventListener('change',mouseChanged);childPosterTextures.forEach(texture=>texture.dispose());teenPosterTextures.forEach(texture=>texture.dispose());paintings.dispose();renderer.setAnimationLoop(null);resize.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);window.removeEventListener('focusin',blur);orbit.dispose();walk.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();}};
}
