import pickle,json
from openskp.scene import build_scene
import numpy as np
from dataclasses import asdict
p=pickle.load(open('/tmp/apt-parsed.pkl','rb'))
s=build_scene(p)
pickle.dump(s,open('/tmp/apt-scene.pkl','wb'))
rows=[]
for prim in s.glb_primitives:
 v=np.array(prim.positions).reshape(-1,3)
 meta=asdict(s.mesh_index[prim.geom_name])
 rows.append(dict(id=prim.geom_name,**meta,min=v.min(0).tolist(),max=v.max(0).tolist(),triangles=len(prim.indices)//3))
json.dump(rows,open('model/components.json','w'),indent=2)
print('meshes',len(rows),'materials',len(s.gltf_materials))
print('bounds',np.min([r['min'] for r in rows],0),np.max([r['max'] for r in rows],0))
