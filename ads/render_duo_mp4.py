#!/usr/bin/env python3
"""
Génère ads/meta-duo-v1.mp4 — 1080×1920, 30fps, 30s, sans audio.
Créa #2 : angle Compatibilité / Mode Duo
"""
import subprocess, sys, math, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 30
N   = FPS * DUR
OUT = "/home/user/Hirescan-Ai-/ads/meta-duo-v1.mp4"

BG      = (10,  0,  16)
VIOLET  = (124, 58, 237)
PINK    = (236, 72, 153)
LV      = (167, 139, 250)
WHITE   = (255, 255, 255)
GRAY1   = (200, 180, 230)
GRAY2   = (110,  80, 150)
GRAY3   = ( 28,  8,  48)

T = dict(
    hLogo=0.2, hQ1=0.5, hQ2=1.8, hHearts=3.2,
    build=4.0, cardL=4.3, cardR=5.1, conn=5.9, glow=6.8,
    cp1=7.4, cp2=8.8, cp3=10.2,
    reveal=12.0, rEye=12.3, gauge=12.8, score=15.5,
    pair=15.8, verdict=16.3, desc=17.5, disc=19.0,
    cta=22.0,
)
FADE = 0.38
TARGET_PCT = 0.87

B = "/usr/share/fonts/truetype/dejavu/DejaVuSans"
def F(s, bold=True): return ImageFont.truetype(f"{B}{'-Bold' if bold else ''}.ttf", s)

FL   = F(74)
FH   = F(102)
FS   = F(54, False)
FMOD = F(32)
FCO  = F(80)
FCN  = F(38)
FCS  = F(30, False)
FGNUM= F(148)
FGLB = F(38, False)
FRN  = F(52)
FRV  = F(68)
FRD  = F(40, False)
FRDI = F(28, False)
FC1  = F(96)
FCS2 = F(44, False)
FBT  = F(56)
FCHP = F(44)
FURL = F(44, False)
FCP  = F(44)
FA   = F(38, False)

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

# Particles (violet + pink mix)
_rng=np.random.default_rng(13)
PX=_rng.uniform(0,W,65); PY=_rng.uniform(0,H,65)
PVX=_rng.uniform(-0.28,0.28,65); PVY=_rng.uniform(-0.28,0.28,65)
PR=_rng.uniform(1.2,4.5,65); PA=_rng.uniform(0.05,0.26,65)
PCOL=np.where(np.arange(65)<32, 0, 1)  # 0=violet,1=pink

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

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 1 · HOOK
# ─────────────────────────────────────────────────────────────────────────────
def scene_hook(t,fi):
    img=Image.new('RGBA',(W,H),(*BG,255))
    arr=np.array(img)
    draw_particles(arr,fi)
    img=Image.fromarray(arr)

    a_logo=fadein(t,T['hLogo'])
    a_q1  =fadein(t,T['hQ1'])
    a_q2  =fadein(t,T['hQ2'])
    a_hrt =fadein(t,T['hHearts'])

    arr=np.array(img)
    grad_text(arr,"UrCecret",FL,W//2,660,alpha=a_logo)
    img=Image.fromarray(arr)

    # Q1
    off=lambda a:int((1-a)*28)
    q1="Pourquoi ça matche avec\ncertaines personnes…"
    txt_ml(img,q1,FH,W//2,870-off(a_q1),WHITE,a_q1,sp=10)
    # Q2 avec gradient sur "d'autres"
    q2_a="…et pas du tout"
    q2_b="avec d'autres ?"
    txt_ml(img,q2_a+"\n"+q2_b,FH,W//2,1070-off(a_q2),WHITE,a_q2,sp=10)
    # Gradient overlay on "d'autres ?"
    try:
        bb_full=FH.getbbox("avec d'autres ?")
        bb_pre =FH.getbbox("avec ")
        bb_wrd =FH.getbbox("d'autres ?")
        fw=bb_full[2]-bb_full[0]; prw=bb_pre[2]-bb_pre[0]; ww=bb_wrd[2]-bb_wrd[0]
        lx=W//2-fw//2; wcx=lx+prw+ww//2
        arr=np.array(img)
        grad_text(arr,"d'autres ?",FH,wcx,1107-off(a_q2),alpha=a_q2)
        img=Image.fromarray(arr)
    except: pass

    txt(img,"💜  🔗  🩷",F(70),W//2,1230-int((1-a_hrt)*30),WHITE,a_hrt)
    return img

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 2 · BUILD
# ─────────────────────────────────────────────────────────────────────────────
CARD_W, CARD_H = 448, 620
CARD_LX = 52   # left card x
CARD_RX = 580  # right card x
CARD_Y  = 440
CONN_CX = (CARD_LX+CARD_W+CARD_RX)//2  # center between cards

def draw_card(img, arr, x, y, code, name, sub, emoji, is_left, alpha=1.0):
    if alpha<=0: return
    draw=ImageDraw.Draw(img)
    # Card BG
    if is_left:
        fc=(*lerpC(BG,VIOLET,0.18),int(alpha*255))
        oc=(*lerpC(BG,VIOLET,0.38),int(alpha*200))
    else:
        fc=(*lerpC(BG,PINK,0.14),int(alpha*255))
        oc=(*lerpC(BG,PINK,0.32),int(alpha*200))
    rrect(draw,x,y,x+CARD_W,y+CARD_H,44,fill=fc,outline=oc,lw=2)
    # Emoji
    txt(img,emoji,F(88),x+CARD_W//2,y+160,WHITE,alpha)
    # Code
    code_c=LV if is_left else PINK
    arr2=np.array(img)
    grad_text(arr2,code,FCO,x+CARD_W//2,y+290,c1=code_c,c2=PINK if is_left else LV,alpha=alpha)
    img2=Image.fromarray(arr2)
    # Name
    txt(img2,name,FCN,x+CARD_W//2,y+375,WHITE,alpha)
    # Sub traits
    txt_ml(img2,sub,FCS,x+CARD_W//2,y+455,GRAY1,alpha*0.72,sp=8)
    # Copy pixels back to img
    img.paste(img2,(0,0))

def scene_build(t):
    img=Image.new('RGBA',(W,H),(*BG,255))
    arr=np.array(img)
    grad_text(arr,"UrCecret",FL,W//2,168,alpha=1.0)
    img=Image.fromarray(arr)
    txt(img,"MODE DUO",FMOD,W//2,260,GRAY2,anchor='mm')

    # Card left
    if t>=T['cardL']:
        p=ease(clamp((t-T['cardL'])/0.55))
        tx=int((1-p)*(-600))
        a=min(1.0,(t-T['cardL'])/0.3)
        arr2=np.array(img)
        draw_card(img,arr2,CARD_LX+tx,CARD_Y,"INFP","Le Médiateur","Empathique · Créatif\nIdéaliste","🌿",True,a)

    # Card right
    if t>=T['cardR']:
        p=ease(clamp((t-T['cardR'])/0.55))
        tx=int((1-p)*600)
        a=min(1.0,(t-T['cardR'])/0.3)
        arr2=np.array(img)
        draw_card(img,arr2,CARD_RX+tx,CARD_Y,"ENTJ","Le Commandant","Ambitieux · Stratège\nVisionnaire","⚡",False,a)

    # Connector ×
    if t>=T['conn']:
        a_conn=min(1.0,(t-T['conn'])/0.35)
        arr2=np.array(img)
        grad_text(arr2,"×",F(80),CONN_CX,CARD_Y+CARD_H//2,alpha=a_conn)
        img=Image.fromarray(arr2)

    # Glow ring (approx: draw gradient circle outline)
    if t>=T['glow']:
        a_glow=min(1.0,(t-T['glow'])/0.4)
        draw3=ImageDraw.Draw(img)
        r=60; cx=CONN_CX; cy=CARD_Y+CARD_H//2+60
        col=(*lerpC(VIOLET,PINK,0.5),int(a_glow*180))
        draw3.ellipse([cx-r,cy-r,cx+r,cy+r],outline=col,width=4)

    # Compat points
    pts=[
        (T['cp1'],"🎯  Vision et sens profond partagés"),
        (T['cp2'],"💫  L'un inspire, l'autre structure"),
        (T['cp3'],"🔥  Dynamique puissante et rare"),
    ]
    base_y=1130
    for i,(pt,text) in enumerate(pts):
        if t>=pt:
            a=min(1.0,(t-pt)/0.35)
            off=int((1-a)*20)
            draw4=ImageDraw.Draw(img)
            py=base_y+i*142-off
            rrect(draw4,60,py,W-60,py+112,24,fill=(255,255,255,int(10*a)),outline=(255,255,255,int(18*a)))
            txt(img,text,FCP,W//2,py+56,GRAY1,a)

    return img

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 3 · REVEAL
# ─────────────────────────────────────────────────────────────────────────────
CIRC = 2*math.pi*124  # 779

def draw_gauge_arc(arr, pct, alpha=1.0):
    """Draw circular gauge arc using numpy pixel approach."""
    cx, cy, R = W//2, 820, 230
    stroke_w = 22
    # Draw arc pixels
    full_angle = 2*math.pi
    total_steps = 600
    for si in range(total_steps):
        frac = si/total_steps
        if frac > pct: continue
        angle = -math.pi/2 + frac * full_angle
        for ri in range(R-stroke_w//2, R+stroke_w//2+1):
            x = int(cx + ri*math.cos(angle))
            y = int(cy + ri*math.sin(angle))
            if 0<=x<W and 0<=y<H:
                t_col = frac
                col = np.array(lerpC(VIOLET, PINK, t_col), dtype=np.float32)
                arr[y,x,:3] = (arr[y,x,:3]*0.2 + col*0.8*alpha).clip(0,255).astype(np.uint8)

def scene_reveal(t):
    img=Image.new('RGBA',(W,H),(*BG,255))

    a_eye=fadein(t,T['rEye'])
    txt(img,"SCORE DE COMPATIBILITÉ",FA,W//2,290,GRAY2,a_eye)

    # Background gauge track
    arr=np.array(img)
    cx,cy,R=W//2,820,230; sw=22
    for si in range(600):
        angle=-math.pi/2+(si/600)*2*math.pi
        for ri in range(R-sw//2,R+sw//2+1):
            x=int(cx+ri*math.cos(angle)); y=int(cy+ri*math.sin(angle))
            if 0<=x<W and 0<=y<H:
                arr[y,x,:3]=(arr[y,x,:3]*0.3+np.array(GRAY3)*0.7).clip(0,255).astype(np.uint8)

    # Animated arc
    if t>=T['gauge']:
        dur=T['score']-T['gauge']
        p=ease(clamp((t-T['gauge'])/dur))
        pct=p*TARGET_PCT
        draw_gauge_arc(arr,pct,alpha=1.0)
    img=Image.fromarray(arr)

    # Center number
    if t>=T['gauge']:
        dur=T['score']-T['gauge']
        p=ease(clamp((t-T['gauge'])/dur))
        pct=round(p*TARGET_PCT*100)
        arr2=np.array(img)
        grad_text(arr2,f"{pct}%",FGNUM,cx,cy,alpha=1.0)
        img=Image.fromarray(arr2)
        txt(img,"compatibilité",FGLB,cx,cy+100,GRAY2,0.7)

    # Elements below gauge
    a_pair   =fadein(t,T['pair'])
    a_verdict=fadein(t,T['verdict'])
    a_desc   =fadein(t,T['desc'])
    a_disc   =fadein(t,T['disc'])

    txt(img,"INFP × ENTJ",FRN,cx,1120,GRAY1,a_pair)
    txt(img,"Vous vous complétez",FRV,cx,1220,WHITE,a_verdict)
    txt_ml(img,"L'intuition de l'un, la vision de l'autre.",FRD,cx,1340,GRAY1,a_desc,sp=12)
    txt(img,"🎯  Pour le fun — basé sur les 16 types MBTI",FRDI,cx,1470,GRAY2,a_disc*0.7)

    return img

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 4 · CTA
# ─────────────────────────────────────────────────────────────────────────────
def scene_cta(t):
    img=Image.new('RGBA',(W,H),(*BG,255))

    # Radial glow
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

    txt(img,"Teste ta",FC1,W//2,628,WHITE,a)
    arr=np.array(img)
    grad_text(arr,"compatibilité",FC1,W//2,744,alpha=a)
    img=Image.fromarray(arr)

    txt(img,"Commence par ton type — gratuit",FCS2,W//2,862,GRAY2,a*0.85)

    # Type pair chips
    draw=ImageDraw.Draw(img)
    chip_data=[("INFP",VIOLET),("×",None),("ENTJ",PINK),("·",None),("ENFP",VIOLET),("·",None),("+13",PINK)]
    xpos=[80,274,340,530,600,784,850]; widths=[180,0,180,0,180,0,140]
    for ci,(chip,col) in enumerate(chip_data):
        if col:
            cw=widths[ci]
            cx=xpos[ci]+cw//2
            rrect(draw,xpos[ci],975,xpos[ci]+cw,1060,40,fill=(*lerpC(col,BG,0.78),int(220*a)),outline=(*col,int(120*a)))
            txt(img,chip,FCHP,cx,1017,WHITE,a)
        else:
            txt(img,chip,FCHP,xpos[ci]+30,1017,GRAY2,a*0.5)

    # Button
    bx0,by0,bx1,by1=96,1112,W-96,1244
    btn_mask=Image.new('L',(W,H),0)
    ImageDraw.Draw(btn_mask).rounded_rectangle([bx0,by0,bx1,by1],radius=32,fill=int(255*a))
    m=np.array(btn_mask)/255.0
    arr=np.array(img)
    gr=np.tile(grad_row(bx1-bx0,VIOLET,PINK)[None],(by1-by0,1,1))
    arr[by0:by1,bx0:bx1,:3]=(arr[by0:by1,bx0:bx1,:3]*(1-m[by0:by1,bx0:bx1,None])+gr*m[by0:by1,bx0:bx1,None]).clip(0,255).astype(np.uint8)
    img=Image.fromarray(arr)
    txt(img,"Découvrir mon Duo",FBT,W//2,(by0+by1)//2,WHITE,a)

    txt(img,"urcecret.site",FURL,W//2,1304,GRAY2,a*0.85)
    return img

# ─────────────────────────────────────────────────────────────────────────────
# MAIN LOOP
# ─────────────────────────────────────────────────────────────────────────────
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
