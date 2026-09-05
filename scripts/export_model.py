"""Extract the preview's upper-right apartment from real SKP geometry.
Coordinates in metres, Y-up. Crop is inferred from envelope/demising walls.
Original components remain available as a separate reference GLB.
"""
import pickle,json,numpy as np,trimesh
from pathlib import Path
from openskp import SkpFile
s=SkpFile.open('4e verdieping Eureka.skp').build_scene()
out=Path('static/model');out.mkdir(parents=True,exist_ok=True)
scenes={k:trimesh.Scene() for k in ['shell','existing','floor']}
origin=np.array([7.21,.38,-6.09]); records=[]
for p in s.glb_primitives:
 v=np.array(p.positions,dtype=float).reshape(-1,3);lo=v.min(0);hi=v.max(0)
 if hi[0]<2.05 or lo[0]>12.12 or hi[2]<-10.12 or lo[2]>-1.85:continue
 meta=s.mesh_index[p.geom_name]
 if meta.layer=='IfcOpeningElement':continue
 mesh=trimesh.Trimesh(v,np.array(p.indices).reshape(-1,3),process=False)
 for normal,point in [([1,0,0],[2.05,0,0]),([-1,0,0],[12.12,0,0]),([0,0,1],[0,0,-10.12]),([0,0,-1],[0,0,-1.85])]:
  mesh=mesh.slice_plane(point,normal)
  if len(mesh.faces)==0:break
 if len(mesh.faces)==0:continue
 interior=lo[0]>2.6 and hi[0]<11.9 and lo[2]>-9.9 and hi[2]<-2.35
 structural=any(x in meta.path for x in ['Constructiebeton','Gebonden met kalk','Steen - Kalkzandsteen'])
 category='existing' if interior and not structural else 'shell'
 if meta.layer=='IfcSlab' and hi[1]<.4:category='floor'
 if interior and meta.layer in ['IfcFlowStorageDevice','IfcDistributionChamberElement']:category='shell'
 mat=s.gltf_materials[p.material_index];c=mat.get('pbrMetallicRoughness',{}).get('baseColorFactor',[.75,.75,.75,1])
 is_glass=p.material_index==7 and meta.layer in ['IfcWindow','IfcDoor']
 if is_glass:c=[.82,.94,.96,.22]
 material=trimesh.visual.material.PBRMaterial(name='Preview glazing' if is_glass else f'Source material {p.material_index}',baseColorFactor=np.array(c),roughnessFactor=.15 if is_glass else .8,metallicFactor=0,alphaMode='BLEND' if is_glass else 'OPAQUE',doubleSided=True)
 mesh.visual=trimesh.visual.TextureVisuals(material=material)
 mesh.vertices-=origin
 name=p.geom_name
 mesh.metadata={'source_path':meta.path,'layer':meta.layer,'category':category}
 scenes[category].add_geometry(mesh,node_name=name,geom_name=name)
 records.append({'id':name,'source':meta.path,'layer':meta.layer,'category':category})
for k,sce in scenes.items():
 sce.export(out/f'{k}.glb');print(k,len(sce.geometry),'bounds',sce.bounds.tolist())
json.dump({'source':'4e verdieping Eureka.skp','units':'metres','origin':origin.tolist(),'crop':{'x':[2.05,12.12],'z':[-10.12,-1.85]},'interior':{'width':9.32,'depth':7.58,'height':2.62},'status':'Extracted geometry; boundary and fixed services require confirmation against drawings. Bedroom layout is a proposal.','components':records},open(out/'manifest.json','w'),indent=2)
