import pickle,numpy as np
from PIL import Image,ImageDraw
s=pickle.load(open('/tmp/apt-scene.pkl','rb'))
im=Image.new('RGB',(2000,600),'white');d=ImageDraw.Draw(im)
for p in s.glb_primitives:
 m=s.mesh_index[p.geom_name]
 if m.layer not in ['IfcWall','IfcWindow','IfcDoor']:continue
 v=np.array(p.positions).reshape(-1,3);idx=np.array(p.indices).reshape(-1,3)
 color={'IfcWall':'#333333','IfcWindow':'#4497b5','IfcDoor':'#bda383'}[m.layer]
 for f in idx:
  vs=v[f]
  if vs[:,1].max()<0.7 or vs[:,1].min()>2:continue
  d.polygon([(30+float(x)*25,40-float(z)*25) for x,y,z in vs],fill=color)
for x in range(0,77,5):d.text((30+x*25,555),str(x),fill='black')
for y in range(0,21,5):d.text((3,40+y*25),str(y),fill='black')
im.save('model/floor-plan.png')
p=pickle.load(open('/tmp/apt-parsed.pkl','rb'));print(p.keys())
