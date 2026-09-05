import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
export type Options={layout:string;floor:string;light:string;furniture:boolean;depth:number;width:number};
export async function createApartment(host:HTMLElement,onState:(message:string)=>void){
 const scene=new T.Scene();scene.background=new T.Color('#e9edf0');
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;host.append(renderer.domElement);
 const camera=new T.PerspectiveCamera(48,1,.05,300);const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI*.49;orbit.minDistance=2;orbit.maxDistance=35;
 const walk=new PointerLockControls(camera,renderer.domElement);walk.addEventListener('lock',()=>{orbit.enabled=false;onState('Walk: W A S D or arrow keys · mouse to look · Esc to leave');});walk.addEventListener('unlock',()=>{orbit.enabled=true;orbit.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()).multiplyScalar(4));onState('Drag to orbit · scroll to zoom · right-drag to pan');});
 const model=new T.Group();scene.add(model);const loader=new GLTFLoader();
 const [shell,existing,floor]=await Promise.all(['shell','existing','floor'].map(n=>loader.loadAsync(`/model/${n}.glb`)));
 for(const g of [shell,existing,floor]){model.add(g.scene);g.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof T.MeshStandardMaterial)m.roughness=m.transparent?.15:.8;if(m.transparent)o.castShadow=false;});}});}
 // Finish overlay is a proposed material, independent of the original structural slab.
 const finish=new T.Mesh(new T.BoxGeometry(9.32,.018,7.58),new T.MeshStandardMaterial({color:'#ae855a',roughness:.72}));finish.position.set(0,.012,0);finish.receiveShadow=true;model.add(finish);
 const partitions=new T.Group();partitions.name='Proposed bedroom partitions';model.add(partitions);
 const furniture=new T.Group();furniture.name='Proposed furniture';model.add(furniture);
 const hemi=new T.HemisphereLight('#dcecff','#a19a91',2);scene.add(hemi);
 const sun=new T.DirectionalLight('#fff1da',3);sun.position.set(-4,9,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.normalBias=.025;scene.add(sun);
 const lamps=[[-2,2.35,2],[1,2.35,2],[1,2.35,-2]].map(p=>{const light=new T.PointLight('#ffd4a4',0,10,2);light.position.set(...p as [number,number,number]);scene.add(light);return light;});
 const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:'#dde3e7',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.42;ground.receiveShadow=true;scene.add(ground);
 const grid=new T.GridHelper(20,20,'#aab7be','#cbd3d8');grid.position.y=-.405;scene.add(grid);
 function box(group:T.Group,x:number,y:number,z:number,w:number,h:number,d:number,color:string){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;}
 function clear(group:T.Group){for(const obj of [...group.children]){obj.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});group.remove(obj);}}
 function bed(x:number,z:number){box(furniture,x,.2,z,1.6,.35,2.05,'#7f6249');box(furniture,x,.46,z,1.58,.24,2,'#eee9df');box(furniture,x,.62,z-.25,1.6,.09,1.4,'#577d8c');box(furniture,x-.4,.65,z+.68,.57,.13,.4,'#fffaf0');box(furniture,x+.4,.65,z+.68,.57,.13,.4,'#fffaf0');}
 function update(o:Options){existing.scene.visible=o.layout==='existing';partitions.visible=o.layout==='bedrooms';furniture.visible=o.furniture;
 (finish.material as T.MeshStandardMaterial).color.set(o.floor==='oak'?'#b58d60':o.floor==='concrete'?'#b8b8b3':'#73523e');
 hemi.intensity=o.light==='evening'?.35:2;sun.intensity=o.light==='evening'?.12:3;scene.background=new T.Color(o.light==='evening'?'#303943':'#e9edf0');lamps.forEach(l=>l.intensity=o.light==='evening'?85:0);
 clear(partitions);clear(furniture);
 const left=-4.66,back=3.79-o.depth,right=left+2*o.width;
 // Two 90 cm door openings, plus lintels; dimensions in metres.
 box(partitions,left+o.width,1.31,(3.79+back)/2,.1,2.62,o.depth,'#f0eee8');
 box(partitions,right,1.31,(3.79+back)/2,.1,2.62,o.depth,'#f0eee8');
 for(let n=0;n<2;n++){const a=left+n*o.width;box(partitions,a+(o.width-.95)/2,1.31,back,o.width-.95,2.62,.1,'#f0eee8');box(partitions,a+o.width-.475,2.385,back,.95,.47,.1,'#f0eee8');}
 if(o.layout==='bedrooms'){bed(left+o.width/2,2.55);bed(left+1.5*o.width,2.55);}
 box(furniture,-2,.27,-1.65,2.3,.5,.95,'#5a7378');box(furniture,-2,.73,-2.02,2.3,.65,.2,'#5a7378');box(furniture,-3.05,.55,-1.65,.2,.6,.95,'#5a7378');box(furniture,-.95,.55,-1.65,.2,.6,.95,'#5a7378');
 box(furniture,-2,.23,-.5,1.1,.1,.6,'#8c6245');box(furniture,2.6,.75,-.7,1.5,.08,.85,'#8c6245');for(const x of [2,3.2])for(const z of [-.95,-.45])box(furniture,x,.36,z,.05,.72,.05,'#343a3d');
 }
 function view(mode:string){if(walk.isLocked)walk.unlock();orbit.enabled=true;camera.up.set(0,1,0);if(mode==='plan'){camera.position.set(0,19,.01);orbit.target.set(0,0,0);}else if(mode==='walk'){camera.position.set(0,1.65,-1.8);camera.lookAt(0,1.65,2);walk.lock();}else{camera.position.set(-11,12,-13);orbit.target.set(0,.6,0);}orbit.update();}
 const keys=new Set<string>();const down=(e:KeyboardEvent)=>{if(walk.isLocked){keys.add(e.code);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();}};const up=(e:KeyboardEvent)=>keys.delete(e.code);const blur=()=>keys.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
 let last=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(walk.isLocked){const speed=dt*2;walk.moveForward(((keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0))*speed);walk.moveRight(((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0))*speed);camera.position.x=T.MathUtils.clamp(camera.position.x,-4.45,4.45);camera.position.z=T.MathUtils.clamp(camera.position.z,-3.55,3.55);camera.position.y=1.65;}else orbit.update();renderer.render(scene,camera);});
 async function download(){const buffer=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});const url=URL.createObjectURL(new Blob([buffer as ArrayBuffer],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='eureka-apartment.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 view('orbit');onState('Drag to orbit · scroll to zoom · right-drag to pan');
 return {update,view,download,destroy(){renderer.setAnimationLoop(null);resize.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);orbit.dispose();walk.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();}};
}
