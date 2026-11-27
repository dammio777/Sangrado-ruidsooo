import numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter
K=3; W,H=1080*K,1350*K
rng=np.random.default_rng(3)
def cr(pts,closed=True,n=16):
    P=np.array(pts,float); m=len(P); out=[]
    rng_=range(m) if closed else range(m-1)
    for i in rng_:
        p0,p1,p2,p3=P[(i-1)%m],P[i],P[(i+1)%m],P[(i+2)%m]
        for t in np.linspace(0,1,n,endpoint=False):
            t2,t3=t*t,t*t*t
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3))
    return [tuple(q*K) for q in out]
def mask(pts,sharp=()):
    im=Image.new("L",(W,H),0); ImageDraw.Draw(im).polygon(cr(pts),fill=255); return np.array(im)>0
hand=[(165,730),(172,610),(196,480),(240,350),(300,240),(372,172),(450,148),(540,148),(680,162),(790,192),(850,212),
      (790,224),(680,218),(572,228),(495,262),(466,292),(472,322),(530,346),(650,386),(770,436),(852,470),
      (780,464),(660,438),(565,438),(516,462),(508,505),(540,538),(640,566),(750,588),(830,600),
      (760,622),(640,642),(540,652),(470,678),(428,735),(405,820),(280,840)]
hm=mask(hand)
outer=[(-40,590),(90,600),(220,650),(350,740),(430,880),(450,1040),(410,1200),(330,1390),(-40,1390)]
inner=[(-40,860),(70,860),(160,920),(205,1030),(200,1180),(160,1390),(-40,1390)]
cuffo=mask(outer); sleeve=mask(inner); cuff=cuffo&~sleeve; hm&=~cuffo
yy,xx=np.mgrid[0:H,0:W]/K
def grads(m):
    sm=gaussian_filter(m.astype(float),6*K); gy,gx=np.gradient(sm); return gx,gy
din=distance_transform_edt(hm)/K
bg=np.zeros((H,W,3)); g=np.clip(1-((xx-560)**2+(yy-500)**2)**.5/1100,0,1)[...,None]
bg[:]=np.array([236,222,208])*(1-g)+np.array([246,236,226])*g
sh=gaussian_filter((hm|cuffo).astype(float),18*K); sh=np.pad(sh,((22*K,0),(14*K,0)))[:H,:W]
bg*=1-0.22*sh[...,None]; img=bg.copy()
hgx,hgy=grads(hm)
light=np.clip(0.6+0.4*np.tanh(din/30)-0.2*(yy-300)/600+0.15*np.clip(-hgy*K*40,-1,1),0.3,1.15)[...,None]
img=np.where(hm[...,None],np.array([150,205,30.])*light,img)
dc=distance_transform_edt(cuff)/K
img=np.where(cuff[...,None],np.array([240,238,234.])*np.clip(0.72+0.28*np.tanh(dc/40),0,1)[...,None],img)
ds=distance_transform_edt(sleeve)/K
img=np.where(sleeve[...,None],np.array([178,22,36.])*np.clip(0.55+0.45*np.tanh(ds/80),0,1)[...,None],img)
im=Image.fromarray(np.clip(img,0,255).astype(np.uint8)); dr=ImageDraw.Draw(im)
def strands(m,n,var,L0,L1,eb,tint=(1,1,1),flow=0.3,fixed=None):
    gx,gy=grads(m); ys,xs=np.nonzero(m); idx=rng.integers(0,len(xs),n); w=max(1,K//2)
    for i in idx:
        x,y=xs[i],ys[i]; nx,ny=-gx[y,x],-gy[y,x]; mag=math.hypot(nx,ny); e=min(1,mag*K*25)
        a0=math.atan2(ny,nx) if mag>1e-9 else 0
        a=a0*e+(1-e)*(flow+rng.normal(0,1.2))+rng.normal(0,0.35) if e>0.05 else flow+rng.normal(0,1.2)
        Ln=(L0+rng.random()*(L1-L0))*(1+eb*e)*K
        base=fixed if fixed else img[y,x]; l=rng.normal(1,var)
        col=tuple(int(min(255,max(0,v*l*t))) for v,t in zip(base,tint))
        b=rng.normal(0,0.5)
        dr.line([(x,y),(x+math.cos(a+b)*Ln*.5,y+math.sin(a+b)*Ln*.5),(x+math.cos(a)*Ln,y+math.sin(a)*Ln)],fill=col,width=w)
strands(sleeve,110000,0.12,5,10,0.8)
strands(cuff,320000,0.07,9,22,1.4)
strands(hm,700000,0.16,7,14,1.5,tint=(1.05,1.05,.9),flow=0.2)
strands(hm,90000,0.08,6,12,1.8,fixed=(205,240,90))
im=im.filter(ImageFilter.GaussianBlur(0.75)); im.save("hand_big.png"); print("ok")
