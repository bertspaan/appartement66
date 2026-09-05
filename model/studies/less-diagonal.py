from PIL import Image, ImageDraw, ImageFont
from math import hypot, atan2, degrees
from pathlib import Path
W,H=1800,1120
im=Image.new('RGB',(W,H),'#f7f5f0');d=ImageDraw.Draw(im)
font='/System/Library/Fonts/Supplemental/Arial.ttf'
def f(n): return ImageFont.truetype(font,n)
def text(x,y,s,n=22,c='#24333d'): d.text((x,y),s,font=f(n),fill=c)
text(55,30,'Een minder schuine slaapkamerwand',38)
text(55,82,'Studie op basis van het huidige model • wand achter de bank en draaipunt blijven vast',23)
a=(-1.10,.95);sx,sz=0,-1.90;divider=1.94
scale=76
for panel,endz in enumerate([-.81,.10]):
 ox=65+panel*880;oy=185
 def p(q):return (ox+(q[0]+5)*scale,oy+(q[1]+4.2)*scale)
 def line(q,r,col,width=6):d.line([p(q),p(r)],fill=col,width=width)
 def poly(q,col):d.polygon([p(v) for v in q],fill=col)
 def label(q,s,n=21,c='#24333d'):
  x,y=p(q);text(x,y,s,n,c)
 b=(4.66,endz);dx=b[0]-a[0];dz=b[1]-a[1];length=hypot(dx,dz)
 t=((sx-a[0])*dx+(sz-a[1])*dz)/(length*length)
 e=(a[0]+t*dx,a[1]+t*dz)
 def along(s):return(a[0]+dx*s/length,a[1]+dz*s/length)
 zd=a[1]+dz*(divider-a[0])/dx
 text(ox,140,'HUIDIG · 17°' if panel==0 else 'VOORSTEL · 8,4°',26)
 poly([(-4.66,-3.785),(4.66,-3.785),(4.66,3.79),(-4.66,3.79)],'#eee6d8')
 poly([a,b,(4.66,3.79),(-1.10,3.79)],'#dbe6eb')
 poly([(divider,zd),b,(4.66,3.79),(divider,3.79)],'#e5ddeb')
 poly([(sx,sz),(4.66,sz),b,e],'#dcebdd')
 poly([(-.48,-3.785),(4.66,-3.785),(4.66,-1.98),(-.48,-1.98)],'#deded9')
 for q,r in [((-4.66,-3.785),(4.66,-3.785)),((-4.66,-3.785),(-4.66,3.79)),((-4.66,3.79),(4.66,3.79)),((4.66,-3.785),(4.66,-1.874)),((4.66,-.84),(4.66,3.79))]:line(q,r,'#59636a',10)
 # Clear entrance opening shown at the source-model location, with no assumed swing.
 line((4.66,-1.874),(4.66,-.84),'#c89d5b',3)
 label((3.20,-1.72),'Voordeur',19)
 label((.0,-3.10),'Vaste voorzieningen',21)
 label((.0,-2.70),'schematisch',17,'#657079')
 line((-.48,-1.98),(4.66,-1.98),'#9eaaa8',4)
 # Original diagonal in the alternative, to make the gained area legible.
 if panel:
  oldb=(4.66,-.81)
  for i in range(30):
   if i%2==0:line((a[0]+(oldb[0]-a[0])*i/30,a[1]+(oldb[1]-a[1])*i/30),(a[0]+(oldb[0]-a[0])*(i+1)/30,a[1]+(oldb[1]-a[1])*(i+1)/30),'#94a0a5',3)
 # Existing provisional bedroom openings retain their distance from the pivot.
 cursor=0
 for start,end in [(1.88,2.73),(3.10,3.95)]:
  line(along(cursor),along(start),'#b75c40',8);cursor=end
 line(along(cursor),b,'#b75c40',8)
 line(a,(-1.10,3.79),'#344750',8)
 line((divider,zd),(divider,3.79),'#59636a',6)
 # Translucent wall follows a perpendicular projection from its fixed core end.
 line((sx,sz),e,'#4c999d',7)
 # Indicate the sliding-door span.
 for u,v in [(.18,1.28)]:
  L=hypot(e[0]-sx,e[1]-sz)
  line((sx+(e[0]-sx)*u/L,sz+(e[1]-sz)*u/L),(sx+(e[0]-sx)*v/L,sz+(e[1]-sz)*v/L),'#b8dcdc',4)
 # Right-angle symbol at the junction.
 ux,uz=dx/length,dz/length;nx,nz=-uz,ux;r=.18
 line((e[0]-ux*r,e[1]-uz*r),(e[0]-ux*r-nx*r,e[1]-uz*r-nz*r),'#32666b',2)
 line((e[0]-ux*r-nx*r,e[1]-uz*r-nz*r),(e[0]-nx*r,e[1]-nz*r),'#32666b',2)
 x,y=p(a);d.ellipse((x-7,y-7,x+7,y+7),fill='#b75c40')
 label((-3.85,.35),'Woonkamer',24)
 # Sofa stays in precisely the same position and footprint.
 poly([(-2.20,1.23),(-1.17,1.23),(-1.17,3.77),(-2.20,3.77)],'#485158')
 label((-2.10,2.10),'Bank',17,'#ffffff')
 label((-.67,2.30),'Sarah & Bert',21)
 label((2.70,2.30),'Tip',24)
 label((1.40,-1.20),'Hal',21)
 label((-3.80,4.10),'Bankwand blijft 2,84 m',20)
 # Dimension beside the door: wall centreline to near jamb, not a clear passage width.
 q=(5.02,-.84);r=(5.02,endz)
 line(q,r,'#b75c40',2)
 for v in [q,r]:line((v[0]-.08,v[1]),(v[0]+.08,v[1]),'#b75c40',2)
 label((4.85,.35 if panel else -.65),'94 cm' if panel else '3 cm',18,'#9e4f37')
 text(ox,875,'Aansluiting vlak naast de voordeur' if not panel else 'Aansluiting 91 cm verder van de voordeur',23)
 text(ox,915,'Halwand haaks op slaapkamerwand' if not panel else 'Halwand blijft haaks; slaapkamerdeuren indicatief',20,'#52636a')
 if panel:
  text(ox,952,'Slaapkamers: samen circa 2,6 m² kleiner',21,'#9e4f37')
text(65,1018,'Oranje: slaapkamerwand • turquoise: translucente halwand • stippellijn: huidige wand',21)
text(65,1054,'Maten tot hart wand, geen vrije doorgangsmaat. Deurzwaai en meubelpassing nog te toetsen. 3D-model ongewijzigd.',19,'#657079')
out=Path(__file__).with_name('less-diagonal.png');im.save(out);print(out)
