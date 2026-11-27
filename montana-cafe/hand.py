import numpy as np, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import distance_transform_edt, gaussian_filter
F="/tmp/claude-0/-home-user-Sangrado-ruidsooo/c7d5168e-b381-5e65-a7a1-e0769611653a/scratchpad/f/"
K=3; W,H=1080*K,1350*K
rng=np.random.default_rng(3)
def P(x,y): return (x*K,y*K)
def capsule(d,pts,r0,r1):
    pts=np.array(pts,float); seg=[]
    for i in range(len(pts)-1):
        for t in np.linspace(0,1,60): seg.append(pts[i]*(1-t)+pts[i+1]*t)
    n=len(seg)
    for i,p in enumerate(seg):
        r=(r0+(r1-r0)*(i/(n-1))**1.3)*K; x,y=p*K; d.ellipse((x-r,y-r,x+r,y+r),fill=255)
# geometry (base coords)
c=np.array([170,840.]); dv=np.array([-0.487,0.873]); nv=np.array([0.873,0.487])
hm=Image.new("L",(W,H),0); d=ImageDraw.Draw(hm)
d.ellipse((*P(210,330),*P(510,700)),fill=255)
capsule(d,[(350,480),(240,700),(150,870)],150,120)
capsule(d,[(390,360),(600,262),(835,222)],62,20)
capsule(d,[(440,445),(650,445),(850,478)],62,20)
capsule(d,[(400,640),(620,672),(830,640)],80,21)
hm=np.array(hm)>0
yy,xx=np.mgrid[0:H,0:W]/K
along=(xx-c[0])*dv[0]+(yy-c[1])*dv[1]; across=(xx-c[0])*nv[0]+(yy-c[1])*nv[1]
wav=10*np.sin(across/23)+6*np.sin(across/9)
hm&=(along<10)|(~((across>-560)&(across<230)))
side=(across>-560)&(across<200+8*np.sin(along/14)-0.05*np.maximum(along-150,0))
cuff=(along>-25+wav)&(along<150+wav)&side
sleeve=(along>=150+wav)&side
# distance & normals
din=distance_transform_edt(hm)/K
sm=gaussian_filter(hm.astype(float),6*K)
gy,gx=np.gradient(sm)
# background
bg=np.zeros((H,W,3)); g=np.clip(1-((xx-560)**2+(yy-500)**2)**.5/1100,0,1)[...,None]
bg[:]=np.array([236,222,208])*(1-g)+np.array([246,236,226])*g
# shadow
sh=gaussian_filter((hm|cuff).astype(float),18*K); sh=np.roll(np.roll(sh,22*K,0),14*K,1)
bg*=1-0.22*sh[...,None]
img=bg.copy()
# hand base shading
light=np.clip(0.55+0.45*np.tanh(din/40)-0.25*(yy-300)/600+0.15*np.clip(-gy*K*40,-1,1),0.25,1.15)[...,None]
green=np.array([150,205,30.])
img=np.where(hm[...,None],green*light,img)
img=np.where(cuff[...,None],np.array([238,236,232.])*np.clip(0.85+0.15*np.sin(across/30),0.7,1)[...,None],img)
img=np.where(sleeve[...,None],np.array([175,22,35.])*np.clip(0.7+0.3*((across+300)/600),0.5,1)[...,None],img)
im=Image.fromarray(np.clip(img,0,255).astype(np.uint8))
dr=ImageDraw.Draw(im)
def strands(mask,n,base,var,L0,L1,edgeboost,wid):
    ys,xs=np.nonzero(mask); idx=rng.integers(0,len(xs),n)
    for i in idx:
        x,y=xs[i],ys[i]; nx,ny=-gx[y,x],-gy[y,x]; mag=math.hypot(nx,ny)
        e=min(1,mag*K*25)  # near edge
        a0=math.atan2(ny,nx) if mag>1e-9 else rng.uniform(0,6.28)
        a=a0*e+(1-e)*(math.atan2(0.3,1)+rng.normal(0,1.2))+rng.normal(0,0.35)
        Ln=(L0+rng.random()*(L1-L0))*(1+edgeboost*e)*K
        x2,y2=x+math.cos(a)*Ln,y+math.sin(a)*Ln
        cx_=x+math.cos(a+0.6)*Ln*0.3; 
        l=rng.normal(1,var); col=tuple(int(min(255,max(0,v*l))) for v in base(x,y))
        dr.line([(x,y),(cx_,y+math.sin(a+0.6)*Ln*0.3),(x2,y2)],fill=col,width=wid)
def hb(x,y):
    s=img[y,x]; return s
strands(hm,700000,lambda x,y:img[y,x]*np.array([1.05,1.05,0.9]),0.16,7,15,1.6,max(1,K//2))
strands(cuff,260000,lambda x,y:img[y,x],0.07,8,20,1.2,max(1,K//2))
strands(sleeve,120000,lambda x,y:img[y,x],0.12,5,10,0.8,max(1,K//2))
# a few highlight hairs
strands(hm,90000,lambda x,y:(205,240,90),0.08,6,12,1.8,1)
im=im.filter(ImageFilter.GaussianBlur(0.6*K/2))
im.save("hand_big.png")
print("ok")
