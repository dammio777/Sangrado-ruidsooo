from PIL import Image, ImageDraw, ImageFont
import math, sys
S=sys.argv[1]; D=sys.argv[2]; F=S+"/f/"
big=Image.open(S+"/hand_big.png").convert("RGB")
RED=(196,22,40); INK=(20,20,20)
def nun(sz):
    f=ImageFont.truetype(F+"Nunito.ttf",sz)
    try: f.set_variation_by_name("Black")
    except Exception: pass
    return f
def ctext(d,cx,cy,lines,f,fill,sp=1.05):
    asc,desc=f.getmetrics(); lh=int((asc+desc)*sp*0.82); y=cy-lh*len(lines)/2
    for l in lines:
        w=d.textlength(l,font=f); d.text((cx-w/2,y),l,font=f,fill=fill); y+=lh
L=["de pedir un café","en Montaña Coffee"]
# slide 1
s1=big.resize((1080,1350),Image.LANCZOS); d=ImageDraw.Draw(s1)
ctext(d,706,560,L,nun(19),INK)
cb=ImageFont.truetype(F+"CaveatBrush-Regular.ttf",120)
txt="Estoy a esto"; w=d.textlength(txt,font=cb); x0=1030-w; y0=760
d.text((x0,y0),txt,font=cb,fill=RED)
# dashes
d.line([(x0-55,y0+60),(x0-25,y0+75)],fill=RED,width=7); d.line([(x0-48,y0+95),(x0-22,y0+100)],fill=RED,width=7)
d.line([(1015,y0+20),(1035,y0-8)],fill=RED,width=7); d.line([(1035,y0+45),(1065,y0+35)],fill=RED,width=7)
# arrow curve from text up to thumb tip
pts=[]
for i in range(41):
    t=i/40; x=(1-t)**2*890+2*(1-t)*t*960+t*t*855; y=(1-t)**2*(y0+10)+2*(1-t)*t*690+t*t*668; pts.append((x,y))
d.line(pts,fill=RED,width=7,joint="curve")
ex,ey=pts[-1]; px,py=pts[-6]; a=math.atan2(ey-py,ex-px)
for s in(+1,-1): d.line([(ex,ey),(ex-38*math.cos(a+s*0.55),ey-38*math.sin(a+s*0.55))],fill=RED,width=7)
# brand mark
lg=Image.open(S+"/v/a/logo.png").convert("RGBA").resize((86,86),Image.LANCZOS)
s1.paste(lg,(960,1230),lg)
f2=nun(17); f2.set_variation_by_name("Bold")
t2="@montanafrioycafe"; d.text((945-d.textlength(t2,font=f2),1262),t2,font=f2,fill=(110,100,92))
s1.save(D+"/estoy_a_esto_1.jpg",quality=95)
# slide 2: zoom
box=(470*3,285*3,910*3,835*3)
s2=big.crop(box).resize((1080,1350),Image.LANCZOS); d=ImageDraw.Draw(s2)
sc=1080/440; cx=(706-470)*sc; cy=(560-285)*sc
ctext(d,cx,cy,L,nun(47),INK)
f3=nun(26); f3.set_variation_by_name("SemiBold")
ft="@MONTANAFRIOYCAFE  ·  MEDELLÍN"; sp=4
tw=sum(d.textlength(ch,font=f3)+sp for ch in ft)-sp; x=540-tw/2
for ch in ft: d.text((x,1262),ch,font=f3,fill=(120,110,100)); x+=d.textlength(ch,font=f3)+sp
s2.save(D+"/estoy_a_esto_2.jpg",quality=95)
