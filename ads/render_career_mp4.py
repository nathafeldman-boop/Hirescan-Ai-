#!/usr/bin/env python3
"""
Génère ads/meta-career-v1.mp4 — 1080×1920, 30fps, 30s, sans audio.
Créa #3 : angle Carrière / Orientation
"""
import subprocess, sys, math, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 30
N   = FPS * DUR
OUT = "/home/user/Hirescan-Ai-/ads/meta-career-v1.mp4"

BG      = (10,  0,  16)
VIOLET  = (124, 58, 237)
PINK    = (236, 72, 153)
LV      = (167, 139, 250)
WHITE   = (255, 255, 255)
GRAY1   = (200, 180, 230)
GRAY2   = (110,  80, 150)
GRAY3   = ( 28,  8,  48)

T = dict(
    hLogo=0.2, hLine1=0.5, hLine2=1.8, hSub=3.1,
    build=4.0,
    q1=4.3, q1sel=5.3, q2=5.7, q2sel=6.7,
    q3=7.1, q3sel=8.1, q4=8.5, q4sel=9.5,
    kw1=10.1, kw2=10.75, kw3=11.4,
    reveal=12.0, rEye=12.3, rCard=12.7,
    str1=14.2, str2=15.8, str3=17.3, tagline=19.2,
    cta=22.0,
)
FADE = 0.38

B = "/usr/share/fonts/truetype/dejavu/DejaVuSans"
def F(s, bold=True): return ImageFont.truetype(f"{B}{'-Bold' if bold else ''}.ttf", s)

FL   = F(74)        # logo
FH   = F(102)       # hook lines
FS   = F(52, False) # hook sub
FQ   = F(58)        # quiz question
FO   = F(50)        # quiz options
FLB  = F(38)        # step label / small
FKW  = F(80)        # keywords
FRE  = F(150)       # INTJ code
FRN  = F(64)        # Le Stratège
FRT  = F(42, False) # tagline
FST  = F(46)        # strengths
FTG  = F(52, False) # reveal tagline
FC1  = F(92)        # CTA headline
FBT  = F(56)        # button
FCHP = F(44)        # chips
FURL = F(44, False) # URL
FB   = F(38)        # badge

def clamp(v,lo=0.0,hi=1.0): return max(lo,min(hi,v))
def ease(v): return 1-(1-clamp(v))**3
def fadein(t,s,d=0.42): return ease((t-s)/d) if t>=s else 0.0
def lerp(a,b,t): return a+(b-a)*clamp(t)
def lerpC(c1,c2,t): return tuple(int(lerp(c1[i],c2[i],t)) for i in range(3))

def grad_row(w, c1, c2):
    t=np.linspace(0,1,w,dtype=np.float32)
    r=np.empty((w,3),dtype=np.float32)
    for c in range(3): r[:,c]=c1[c]+(c2[c]-c1[c])*t
    return r

def grad_text(arr, text, font, cx, cy, c1=LV, c2=PINK, alpha=1.0):
    if alpha<=0 or not text: return
    try: bb=font.getbbox(text)
    except: return
    tw,th=bb[2]-bb[0],bb[3]-bb[1]
    ox,oy=bb[0],bb[1]
    pw,ph=tw+8,th+8
    tmp=Image.new('L',(pw,ph),0)
    ImageDraw.Draw(tmp).text((4-ox,4-oy),text,font=font,fill=255)
    mask=np.asarray(tmp,dtype=np.float32)/255.0
    row=grad_row(pw,c1,c2)
    gr=np.tile(row[None],(ph,1,1))
    px,py=cx-pw//2,cy-ph//2
    x0,y0=max(0,px),max(0,py)
    x1,y1=min(W,px+pw),min(H,py+ph)
    if x0>=x1 or y0>=y1: return
    sx,sy=x0-px,y0-py
    eh,ew=y1-y0,x1-x0
    m=mask[sy:sy+eh,sx:sx+ew]*alpha
    sl=arr[y0:y1,x0:x1,:3].astype(np.float32)
    sg=gr[sy:sy+eh,sx:sx+ew].astype(np.float32)
    arr[y0:y1,x0:x1,:3]=(sl*(1-m[:,:,None])+sg*m[:,:,None]).clip(0,255).astype(np.uint8)

def txt(img,text,font,cx,cy,color=WHITE,alpha=1.0,anchor='mm'):
    if alpha<=0 or not text: return
    r,g,b=color
    ImageDraw.Draw(img).text((cx,cy),text,font=font,fill=(r,g,b,int(alpha*255)),anchor=anchor)

def txt_ml(img,text,font,cx,cy,color=WHITE,alpha=1.0,sp=14):
    if alpha<=0: return
    lines=text.split('\n')
    bbs=[font.getbbox(l) for l in lines]
    hs=[b[3]-b[1] for b in bbs]
    tot=sum(hs)+sp*(len(lines)-1)
    y=cy-tot//2
    for line,h in zip(lines,hs):
        txt(img,line,font,cx,y+h//2,color,alpha)
        y+=h+sp

def rrect(draw,x0,y0,x1,y1,r,fill=None,outline=None,lw=2):
    draw.rounded_rectangle([x0,y0,x1,y1],radius=r,fill=fill,outline=outline,width=lw)

def prog_bar(arr,x,y,w,h,pct):
    arr[y:y+h,x:x+w,:3]=(arr[y:y+h,x:x+w,:3]*0.12+np.array(GRAY3)*0.88).clip(0,255).astype(np.uint8)
    fw=int(w*clamp(pct))
    if fw>=2:
        row=grad_row(fw,VIOLET,PINK)
        arr[y:y+h,x:x+fw,:3]=np.tile(row[None],(h,1,1)).astype(np.uint8)

# Particles
_rng=np.random.default_rng(21)
PX=_rng.uniform(0,W,65); PY=_rng.uniform(0,H,65)
PVX=_rng.uniform(-0.28,0.28,65); PVY=_rng.uniform(-0.28,0.28,65)
PR=_rng.uniform(1.2,4.5,65); PA=_rng.uniform(0.05,0.26,65)
PCOL=np.where(np.arange(65)<32,0,1)

def draw_particles(arr,fi):
    vc=np.array(LV,dtype=np.float32)
    pc_=np.array(PINK,dtype=np.float32)
    for i in range(len(PX)):
        x=(PX[i]+PVX[i]*fi)%W; y=(PY[i]+PVY[i]*fi)%H
        r=PR[i]; a=PA[i]
        x0i,y0i=max(0,int(x-r)),max(0,int(y-r))
        x1i,y1i=min(W,int(x+r+1)),min(H,int(y+r+1))
        if x1i>x0i and y1i>y0i:
            c=vc if PCOL[i]==0 else pc_
            sl=arr[y0i:y1i,x0i:x1i,:3].astype(np.float32)
            arr[y0i:y1i,x0i:x1i,:3]=(sl*(1-a)+c*a).clip(0,255).astype(np.uint8)

# ─── SCENE 1 · HOOK ──────────────────────────────────────────────────────────
def scene_hook(t,fi):
    img=Image.new('RGBA',(W,H),(*BG,255))
    arr=np.array(img)
    draw_particles(arr,fi)
    img=Image.fromarray(arr)

    a_logo=fadein(t,T['hLogo'])
    a_l1  =fadein(t,T['hLine1'])
    a_l2  =fadein(t,T['hLine2'])
    a_sub =fadein(t,T['hSub'])

    off=lambda a:int((1-a)*28)
    arr=np.array(img)
    grad_text(arr,"UrCecret",FL,W//2,620,alpha=a_logo)
    img=Image.fromarray(arr)

    txt(img,"Tu as parfois l'impression",FH,W//2,840-off(a_l1),WHITE,a_l1)

    # Line 2: "de ne pas être à ta place ?"
    # Render white then overlay gradient on "à ta place"
    line2="de ne pas être à ta place ?"
    txt(img,line2,FH,W//2,968-off(a_l2),WHITE,a_l2)
    try:
        bb_full=FH.getbbox(line2)
        bb_pre =FH.getbbox("de ne pas être ")
        bb_wrd =FH.getbbox("à ta place ?")
        fw_=bb_full[2]-bb_full[0]; prw=bb_pre[2]-bb_pre[0]; ww=bb_wrd[2]-bb_wrd[0]
        lx=W//2-fw_//2; wcx=lx+prw+ww//2
        arr=np.array(img)
        grad_text(arr,"à ta place ?",FH,wcx,968-off(a_l2),alpha=a_l2)
        img=Image.fromarray(arr)
    except: pass

    txt(img,"Ça s'explique.",FS,W//2,1105-off(a_sub),GRAY1,a_sub)
    return img

# ─── SCENE 2 · BUILD ─────────────────────────────────────────────────────────
QUIZ=[
    ("Tu préfères travailler\nseul·e ou en équipe ?",       ["Seul·e",           "En équipe"],          0),
    ("Tu as besoin de comprendre\nle POURQUOI de chaque tâche ?", ["Oui, toujours",    "Je fais confiance"],  0),
    ("Tu fonctionnes mieux avec\nune structure claire ?",    ["Oui",              "J'improvise mieux"],  0),
    ("Tu es plutôt grand stratège\nou dans les détails ?",   ["Grand stratège",    "Dans les détails"],   0),
]
QS=[T['q1'],T['q2'],T['q3'],T['q4']]
SL=[T['q1sel'],T['q2sel'],T['q3sel'],T['q4sel']]
KWS=[("TES FORCES",T['kw1']),("TON FONCTIONNEMENT",T['kw2']),("TES ENVIRONNEMENTS IDÉAUX",T['kw3'])]

def scene_build(t):
    img=Image.new('RGBA',(W,H),(*BG,255))
    arr=np.array(img)
    grad_text(arr,"UrCecret",FL,W//2,168,alpha=1.0)
    img=Image.fromarray(arr)

    in_keywords = t>=T['kw1']

    if not in_keywords:
        # Quiz phase
        draw=ImageDraw.Draw(img)
        qi=0
        for i in range(3,-1,-1):
            if t>=QS[i]: qi=i; break
        q_txt,opts,sel_idx=QUIZ[qi]
        sel=sel_idx if t>=SL[qi] else -1
        pct=qi/4+(0.25 if sel>=0 else 0)

        arr=np.array(img)
        prog_bar(arr,80,295,W-160,10,pct)
        img=Image.fromarray(arr); draw=ImageDraw.Draw(img)
        txt(img,f"{qi+1} / 4",FLB,W-88,282,GRAY2,anchor='rm')

        rrect(draw,60,355,W-60,1110,36,fill=(255,255,255,10),outline=(255,255,255,22))
        txt_ml(img,q_txt,FQ,W//2,570,WHITE,sp=12)

        opt_ys=[800,965]
        for i,opt in enumerate(opts):
            sel_i=(i==sel)
            fc=(*lerpC(GRAY3,VIOLET,0.55),255) if sel_i else (255,255,255,8)
            oc=(*VIOLET,200) if sel_i else (255,255,255,22)
            rrect(draw,96,opt_ys[i]-68,W-96,opt_ys[i]+68,24,fill=fc,outline=oc,lw=2)
            txt(img,opt,FO,W//2,opt_ys[i],WHITE if sel_i else GRAY1)

    else:
        # Keywords phase
        kw_y=[640, 840, 1040]
        for ki,(kw,kt) in enumerate(KWS):
            if t<kt: continue
            a=fadein(t,kt,0.45)
            sc=lerp(0.72,1.0,fadein(t,kt,0.5))
            # Approximate scale by adjusting font size
            fs=int(80*sc)
            try: kf=F(fs)
            except: kf=FKW
            arr=np.array(img)
            grad_text(arr,kw,kf,W//2,kw_y[ki],alpha=a)
            img=Image.fromarray(arr)
            # Underline accent
            try:
                bb=kf.getbbox(kw)
                lw_=bb[2]-bb[0]
                draw=ImageDraw.Draw(img)
                lx_=W//2-lw_//2; ly_=kw_y[ki]+40
                draw.rectangle([lx_,ly_,lx_+int(lw_*a),ly_+4],fill=(*lerpC(VIOLET,PINK,ki/2),int(200*a)))
            except: pass

    return img

# ─── SCENE 3 · REVEAL ────────────────────────────────────────────────────────
STRENGTHS=[
    ("🧠  Vision long terme",     T['str1']),
    ("⚡  Autonomie & efficacité", T['str2']),
    ("🎯  Résolution de problèmes",T['str3']),
]

def scene_reveal(t):
    img=Image.new('RGBA',(W,H),(*BG,255))
    draw=ImageDraw.Draw(img)

    a_eye =fadein(t,T['rEye'])
    a_card=fadein(t,T['rCard'])
    a_tag =fadein(t,T['tagline'])

    txt(img,"TON PROFIL",FLB,W//2,310,GRAY2,a_eye)

    # Card BG
    cy0,cy1=380,1080
    for c,vc in enumerate(VIOLET):
        arr_tmp=np.array(img)
        arr_tmp[cy0:cy1,80:W-80,c]=(arr_tmp[cy0:cy1,80:W-80,c].astype(np.float32)*(1-0.12*a_card)+vc*0.12*a_card).clip(0,255).astype(np.uint8)
        img=Image.fromarray(arr_tmp)
    draw=ImageDraw.Draw(img)
    oc=lerpC(BG,LV,0.3*a_card)
    rrect(draw,80,cy0,W-80,cy1,44,outline=(*oc,255),lw=2)

    # INTJ code
    scale_p=ease(clamp((t-T['rCard'])/0.55))
    arr=np.array(img)
    grad_text(arr,"INTJ",FRE,W//2,600,alpha=a_card)
    img=Image.fromarray(arr)

    txt(img,"Le Stratège",FRN,W//2,775,WHITE,a_card)
    txt(img,"Analytique  ·  Visionnaire  ·  Indépendant",FRT,W//2,860,GRAY1,a_card*0.85)

    # Strengths
    base_str_y=1130
    for si,(label,st) in enumerate(STRENGTHS):
        if t<st: continue
        a=fadein(t,st,0.4)
        off=int((1-a)*22)
        sy=base_str_y+si*145-off
        draw2=ImageDraw.Draw(img)
        fc=(*lerpC(GRAY3,VIOLET,0.4),int(220*a))
        oc2=(*lerpC(BG,VIOLET,0.45),int(180*a))
        rrect(draw2,60,sy,W-60,sy+108,24,fill=fc,outline=oc2,lw=2)
        # Gradient accent on left edge
        arr=np.array(img)
        arr[sy+8:sy+100,60:66,:3]=np.tile(grad_row(1,VIOLET,PINK)[None],(92,1,1)).astype(np.uint8)*int(a)
        img=Image.fromarray(arr)
        txt(img,label,FST,W//2,sy+54,WHITE,a)

    # Tagline
    txt(img,"Ton mode d'emploi, enfin.",FTG,W//2,1590,GRAY1,a_tag)

    return img

# ─── SCENE 4 · CTA ───────────────────────────────────────────────────────────
def scene_cta(t):
    img=Image.new('RGBA',(W,H),(*BG,255))
    arr=np.array(img,dtype=np.float32)
    ys=np.arange(H)[:,None]; xs=np.arange(W)[None,:]
    dist=np.sqrt((xs-W//2)**2+(ys-H//2)**2)
    g=np.clip(1-dist/580,0,1)*0.13
    arr[:,:,0]=(arr[:,:,0]+VIOLET[0]*g).clip(0,255)
    arr[:,:,2]=(arr[:,:,2]+VIOLET[2]*g).clip(0,255)
    img=Image.fromarray(arr.astype(np.uint8))

    a=fadein(t,T['cta'])
    arr=np.array(img)
    grad_text(arr,"UrCecret",FL,W//2,445,alpha=a)
    img=Image.fromarray(arr)

    txt(img,"Découvre ton profil",FC1,W//2,628,WHITE,a)
    arr=np.array(img)
    grad_text(arr,"gratuitement",FC1,W//2,740,alpha=a)
    img=Image.fromarray(arr)

    draw=ImageDraw.Draw(img)
    rrect(draw,W//2-300,842,W//2+300,924,40,fill=(*VIOLET[:3],int(38*a)),outline=(*LV,int(75*a)))
    txt(img,"✓  Sans carte bancaire",FB,W//2,883,LV,a)

    chips=[("INTJ",VIOLET),("×",None),("ENFP",LV),("·",None),("ISFJ",PINK),("·",None),("+13",VIOLET)]
    xpos=[80,272,340,530,600,788,852]; widths=[180,0,180,0,180,0,140]
    for ci,(chip,col) in enumerate(chips):
        if col:
            cw=widths[ci]; cxv=xpos[ci]+cw//2
            rrect(draw,xpos[ci],975,xpos[ci]+cw,1060,40,fill=(*lerpC(col,BG,0.78),int(220*a)),outline=(*col,int(120*a)))
            txt(img,chip,FCHP,cxv,1017,WHITE,a)
        else:
            txt(img,chip,FCHP,xpos[ci]+30,1017,GRAY2,a*0.5)

    bx0,by0,bx1,by1=96,1112,W-96,1244
    btn_mask=Image.new('L',(W,H),0)
    ImageDraw.Draw(btn_mask).rounded_rectangle([bx0,by0,bx1,by1],radius=32,fill=int(255*a))
    m=np.array(btn_mask)/255.0
    arr=np.array(img)
    gr=np.tile(grad_row(bx1-bx0,VIOLET,PINK)[None],(by1-by0,1,1))
    arr[by0:by1,bx0:bx1,:3]=(arr[by0:by1,bx0:bx1,:3]*(1-m[by0:by1,bx0:bx1,None])+gr*m[by0:by1,bx0:bx1,None]).clip(0,255).astype(np.uint8)
    img=Image.fromarray(arr)
    txt(img,"Commencer le test",FBT,W//2,(by0+by1)//2,WHITE,a)
    txt(img,"urcecret.site",FURL,W//2,1304,GRAY2,a*0.85)
    return img

# ─── MAIN LOOP ────────────────────────────────────────────────────────────────
def blend(a,b,alpha):
    na=np.array(a.convert('RGB'),dtype=np.float32)
    nb=np.array(b.convert('RGB'),dtype=np.float32)
    return Image.fromarray((na*(1-alpha)+nb*alpha).clip(0,255).astype(np.uint8))

def render(fi):
    t=fi/FPS
    if   t<T['build']:
        return scene_hook(t,fi)
    elif t<T['build']+FADE:
        return blend(scene_hook(t,fi),scene_build(t),(t-T['build'])/FADE)
    elif t<T['reveal']:
        return scene_build(t)
    elif t<T['reveal']+FADE:
        return blend(scene_build(t),scene_reveal(t),(t-T['reveal'])/FADE)
    elif t<T['cta']:
        return scene_reveal(t)
    elif t<T['cta']+FADE:
        return blend(scene_reveal(t),scene_cta(t),(t-T['cta'])/FADE)
    else:
        return scene_cta(t)

cmd=['ffmpeg','-y','-f','rawvideo','-vcodec','rawvideo',
     '-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
     '-c:v','libx264','-preset','fast','-pix_fmt','yuv420p','-crf','20',OUT]

print(f"⏳ Rendu {N} frames → {OUT}")
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
t0=time.time()
try:
    for i in range(N):
        proc.stdin.write(render(i).convert('RGB').tobytes())
        if i%30==0:
            el=time.time()-t0; rem=(el/max(i,1))*(N-i)
            print(f"\r  {i/N*100:5.1f}%  frame {i:3d}/{N}  ~{rem:.0f}s restant    ",end='',flush=True)
    proc.stdin.close(); proc.wait()
    print(f"\n✅ Terminé en {time.time()-t0:.0f}s  →  {OUT}")
except KeyboardInterrupt:
    proc.kill(); print("\n❌ Annulé"); sys.exit(1)
