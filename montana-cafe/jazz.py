import numpy as np, wave
from scipy.signal import butter, sosfilt, fftconvolve
SR=44100; BPM=88; B=60/BPM; DUR=34.5; N=int(SR*DUR)
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def mf(m): return 440*2**((m-69)/12)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); 
    if i>=N: return
    s=sig[:N-i]*g; L[i:i+len(s)]+=s*np.sqrt(0.5*(1-pan)); R[i:i+len(s)]+=s*np.sqrt(0.5*(1+pan))
def sw(beat): # swing eighths
    b=int(beat); f=beat-b
    return (b+(0.66 if abs(f-0.5)<1e-6 else f))*B
def rhodes(m,d,v=.5):
    t=np.arange(int((d+1.2)*SR))/SR; f=mf(m)
    env=np.exp(-t*2.2)*np.minimum(1,t*400); env[t>d]*=np.exp(-(t[t>d]-d)*8)
    idx=1.6*np.exp(-t*6)+0.25
    s=np.sin(2*np.pi*f*t+idx*np.sin(2*np.pi*f*t))+0.25*np.sin(2*np.pi*2*f*t)*np.exp(-t*4)
    s+=0.08*np.sin(2*np.pi*14*f*t)*np.exp(-t*40)  # tine
    return s*env*v*(1+0.12*np.sin(2*np.pi*4.5*t))
def bass(m,d,v=.8):
    t=np.arange(int((d+.3)*SR))/SR; f=mf(m)
    env=np.minimum(1,t*300)*np.exp(-t*3.0); env[t>d*0.92]*=np.exp(-(t[t>d*0.92]-d*0.92)*25)
    s=np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*2*f*t)+0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t*8)
    s+=0.15*rng.standard_normal(len(t))*np.exp(-t*60)
    return np.tanh(s*1.3)*env*v
def vib(m,d,v=.35):
    t=np.arange(int((d+1.5)*SR))/SR; f=mf(m)
    env=np.exp(-t*1.6)*np.minimum(1,t*800)
    s=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*4*f*t)*np.exp(-t*9)+0.1*np.sin(2*np.pi*10*f*t)*np.exp(-t*30)
    return s*env*v*(1+0.25*np.sin(2*np.pi*5.5*t))
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],'band',fs=SR,output='sos'),x)
def ride(v=.12):
    t=np.arange(int(1.2*SR))/SR; n=bp(rng.standard_normal(len(t)),5000,12000)
    m=sum(np.sin(2*np.pi*f*t) for f in [3150,4720,5830,7110])*0.15
    return (n+m)*np.exp(-t*5)*v
def brush(d=.25,v=.12):
    t=np.arange(int(d*SR))/SR; n=bp(rng.standard_normal(len(t)),1500,7000)
    return n*np.sin(np.pi*t/d)**2*v
def snare(v=.1):
    t=np.arange(int(.35*SR))/SR; n=bp(rng.standard_normal(len(t)),1200,6000)
    return (n*np.exp(-t*14)+0.4*np.sin(2*np.pi*190*t)*np.exp(-t*25))*v
def kick(v=.35):
    t=np.arange(int(.4*SR))/SR; f=55+60*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*v
prog=[(41,[57,60,64,67],[41,45,48,52]),(38,[53,57,60,64],[38,41,45,49]),(43,[58,62,65,69],[43,46,50,47]),(36,[58,64,69,74],[36,40,43,40])]
bars=int(DUR/(4*B))+1
mel={1:[(0,72),(1.5,74),(2,77),(3,76)],3:[(0,74),(.5,72),(1,70),(2.5,69)],5:[(1,77),(1.5,79),(2,81),(3.5,79)],7:[(0,76),(1,74),(2,72)],9:[(0,72),(1.5,74),(2,77),(3,81)],11:[(0,79),(1,77),(1.5,76),(2,77)]}
for b in range(bars):
    t0=b*4*B; root,voic,walk=prog[b%4]
    if b==bars-1: voic=[57,60,64,67]; walk=[41]
    fade=1.0
    # rhodes comp: charleston, varied
    hits=[(0,1.4),(1.5,1.0)] if b%2==0 else [(0,0.9),(2.5,1.2)]
    if b==bars-1: hits=[(0,3.5)]
    for hb,hd in hits:
        for k,m in enumerate(voic): add(rhodes(m,hd*B,.13),t0+sw(hb)+k*0.006,pan=-.25)
    # bass walk
    if b>=1:
        for q,m in enumerate(walk): add(bass(m,B*.95,.42),t0+q*B,pan=0)
    else: add(bass(root,4*B,.42),t0)
    # drums from bar 1
    if b>=1 and b<bars-1:
        for q in range(4):
            add(ride(.06 if q%2==0 else .085),t0+q*B,pan=.35)
            if q in(1,3): add(ride(.045),t0+sw(q+.5),pan=.35); add(brush(.18,.07),t0+q*B,pan=-.1)
        add(brush(4*B*.5,.035),t0,pan=.1); add(brush(4*B*.5,.035),t0+2*B,pan=-.1)
        add(kick(.22),t0); add(kick(.12),t0+sw(2.5))
        if b%4==3: add(snare(.05),t0+sw(3.5))
    if b in mel:
        for hb,m in mel[b]: add(vib(m,B,.16),t0+sw(hb),pan=.2)
# reverb
ir_t=np.arange(int(2.2*SR))/SR; ir=rng.standard_normal(len(ir_t))*np.exp(-ir_t*3.2)
irL=sosfilt(butter(1,6000,fs=SR,output='sos'),ir); irR=sosfilt(butter(1,6000,fs=SR,output='sos'),np.roll(ir,331))
wl=fftconvolve(L,irL)[:N]; wr=fftconvolve(R,irR)[:N]
k=np.std(L)/np.std(wl)*0.35
L2=L+wl*k; R2=R+wr*k
# warmth: gentle lowpass + tape sat
lp=butter(2,9000,fs=SR,output='sos'); L2=sosfilt(lp,L2); R2=sosfilt(lp,R2)
x=np.stack([L2,R2],1); x=np.tanh(x/np.max(np.abs(x))*1.4)
t=np.arange(N)/SR; env=np.minimum(1,t/1.0)*np.clip((DUR-t)/2.5,0,1)
x=x*env[:,None]; x=x/np.max(np.abs(x))*0.89
with wave.open('jazz.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print("ok",DUR)
