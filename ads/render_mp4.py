#!/usr/bin/env python3
"""
Génère ads/meta-mbti-v1.mp4 — 1080×1920, 30fps, 30s, sans audio.
Ajoute vo-mbti.mp3 dans CapCut / iMovie / Premiere après.
"""
import subprocess, sys, math, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 30
N = FPS * DUR  # 900 frames
OUT = "/home/user/Hirescan-Ai-/ads/meta-mbti-v1.mp4"

# ── Brand colors ──────────────────────────────────────────────────────────────
BG      = (10,  0, 16)
VIOLET  = (124, 58, 237)
PINK    = (236, 72, 153)
LV      = (167, 139, 250)
WHITE   = (255, 255, 255)
GRAY1   = (200, 180, 230)
GRAY2   = (110, 80,  150)
GRAY3   = ( 30, 10,  50)

# ── Timestamps ────────────────────────────────────────────────────────────────
T = dict(
    hLogo=0.2, hLine1=0.5, hLine2=1.1, hSub=2.1,
    quiz=3.0,
    q1=3.2, q1sel=4.6, q2=5.1, q2sel=6.4,
    q3=6.9, q3sel=8.1, q4=8.6, q4sel=9.8,
    analysis=10.4,
    reveal=12.0, rEye=12.3, rCard=12.6, rDuo=16.2,
    cta=22.0,
)
FADE = 0.35

# ── Fonts ─────────────────────────────────────────────────────────────────────
B = "/usr/share/fonts/truetype/dejavu/DejaVuSans"
def F(s, bold=True): return ImageFont.truetype(f"{B}{'-Bold' if bold else ''}.ttf", s)

FL  = F(74)          # logo "UrCecret"
FH  = F(106)         # hook big lines
FS  = F(54, False)   # hook subtitle
FQ  = F(60)          # quiz question
FO  = F(50)          # quiz options
FLB = F(38)          # quiz step label / small labels
FR  = F(150)         # reveal ENFP
FN  = F(64)          # reveal name
FTG = F(44, False)   # tagline
FTR = F(34)          # traits
FC  = F(90)          # CTA headline
FBT = F(54)          # CTA button

# ── Easing / helpers ──────────────────────────────────────────────────────────
def clamp(v, lo=0.0, hi=1.0): return max(lo, min(hi, v))
def ease(v): return 1-(1-clamp(v))**3
def fadein(t, s, d=0.45): return ease((t-s)/d) if t>=s else 0.0
def lerp(a,b,t): return a+(b-a)*clamp(t)
def lerpC(c1,c2,t): return tuple(int(lerp(c1[i],c2[i],t)) for i in range(3))

# ── Gradient helpers (numpy) ───────────────────────────────────────────────────
def grad_row(w, c1, c2):
    t = np.linspace(0, 1, w, dtype=np.float32)
    row = np.empty((w, 3), dtype=np.float32)
    for c in range(3): row[:,c] = c1[c]+(c2[c]-c1[c])*t
    return row  # (w,3)

def grad_rect(arr, x0, y0, x1, y1, c1, c2, alpha=1.0):
    """Fill rect with horizontal gradient, blended over arr (works with 3 or 4 channels)."""
    w = x1-x0; h = y1-y0
    if w<=0 or h<=0: return
    row = grad_row(w, c1, c2)                  # (w,3)
    tile = np.tile(row[None], (h, 1, 1))       # (h,w,3)
    arr[y0:y1, x0:x1, :3] = (arr[y0:y1,x0:x1,:3]*(1-alpha) + tile*alpha).clip(0,255).astype(np.uint8)

def grad_text_np(arr, text, font, cx, cy, c1=LV, c2=PINK, alpha=1.0):
    """Render text with horizontal gradient onto arr in-place."""
    if alpha<=0 or not text: return
    try: bb = font.getbbox(text)
    except: return
    tw,th = bb[2]-bb[0], bb[3]-bb[1]
    ox,oy = bb[0], bb[1]
    pw,ph = tw+8, th+8
    tmp = Image.new('L', (pw,ph), 0)
    ImageDraw.Draw(tmp).text((4-ox, 4-oy), text, font=font, fill=255)
    mask = np.asarray(tmp, dtype=np.float32)/255.0   # (ph,pw)
    row  = grad_row(pw, c1, c2)                       # (pw,3)
    gr   = np.tile(row[None], (ph,1,1))               # (ph,pw,3)
    px,py = cx-pw//2, cy-ph//2
    x0,y0 = max(0,px), max(0,py)
    x1,y1 = min(W,px+pw), min(H,py+ph)
    if x0>=x1 or y0>=y1: return
    sx,sy = x0-px, y0-py
    eh,ew = y1-y0, x1-x0
    m = mask[sy:sy+eh, sx:sx+ew]*alpha
    sl = arr[y0:y1, x0:x1, :3].astype(np.float32)
    sg = gr[sy:sy+eh, sx:sx+ew].astype(np.float32)
    arr[y0:y1, x0:x1, :3] = (sl*(1-m[:,:,None]) + sg*m[:,:,None]).clip(0,255).astype(np.uint8)

def prog_bar_np(arr, x, y, w, h, pct):
    arr[y:y+h, x:x+w, :3] = (arr[y:y+h,x:x+w,:3]*0.15 + np.array(GRAY3)*0.85).clip(0,255).astype(np.uint8)
    fw = int(w*clamp(pct))
    if fw>=2: grad_rect(arr, x, y, x+fw, y+h, VIOLET, PINK)

# ── PIL text helpers ───────────────────────────────────────────────────────────
def txt(img, text, font, cx, cy, color=WHITE, alpha=1.0, anchor='mm'):
    if alpha<=0 or not text: return
    r,g,b = color
    ImageDraw.Draw(img).text((cx,cy), text, font=font,
                             fill=(r,g,b,int(alpha*255)), anchor=anchor)

def txt_ml(img, text, font, cx, cy, color=WHITE, alpha=1.0, sp=16):
    """Centered multiline text."""
    if alpha<=0: return
    lines = text.split('\n')
    bbs = [font.getbbox(l) for l in lines]
    hs = [b[3]-b[1] for b in bbs]
    tot = sum(hs)+(sp*(len(lines)-1))
    y = cy - tot//2
    for line, h in zip(lines, hs):
        txt(img, line, font, cx, y+h//2, color, alpha)
        y += h+sp

def rrect(draw, x0,y0,x1,y1, r, fill=None, outline=None, lw=2):
    draw.rounded_rectangle([x0,y0,x1,y1], radius=r, fill=fill, outline=outline, width=lw)

# ── Particle field ─────────────────────────────────────────────────────────────
_rng = np.random.default_rng(7)
PX  = _rng.uniform(0,W,55)
PY  = _rng.uniform(0,H,55)
PVX = _rng.uniform(-0.28,0.28,55)
PVY = _rng.uniform(-0.28,0.28,55)
PR  = _rng.uniform(1.5,4.5,55)
PA  = _rng.uniform(0.05,0.28,55)

def draw_particles(arr, fi):
    lv = np.array(LV, dtype=np.float32)
    for i in range(len(PX)):
        x = (PX[i]+PVX[i]*fi)%W
        y = (PY[i]+PVY[i]*fi)%H
        r = PR[i]; a = PA[i]
        x0i,y0i = max(0,int(x-r)), max(0,int(y-r))
        x1i,y1i = min(W,int(x+r+1)), min(H,int(y+r+1))
        if x1i>x0i and y1i>y0i:
            sl = arr[y0i:y1i,x0i:x1i,:3].astype(np.float32)
            arr[y0i:y1i,x0i:x1i,:3] = (sl*(1-a)+lv*a).clip(0,255).astype(np.uint8)

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 1 · HOOK
# ─────────────────────────────────────────────────────────────────────────────
def scene_hook(t, fi):
    img = Image.new('RGBA',(W,H),(*BG,255))
    arr = np.array(img)
    draw_particles(arr, fi)
    img = Image.fromarray(arr)

    a_logo = fadein(t, T['hLogo'])
    a_l1   = fadein(t, T['hLine1'])
    a_l2   = fadein(t, T['hLine2'])
    a_sub  = fadein(t, T['hSub'])

    off = lambda a: int((1-a)*32)
    arr = np.array(img)
    grad_text_np(arr, "UrCecret", FL, W//2, 680-off(a_logo), alpha=a_logo)
    img = Image.fromarray(arr)

    txt(img, "16 types.", FH, W//2, 870-off(a_l1), WHITE, a_l1)

    # "Un seul est vraiment toi." — "vraiment" in gradient
    line2 = "Un seul est vraiment toi."
    txt(img, line2, FH, W//2, 1000-off(a_l2), WHITE, a_l2)
    # Overlay gradient on "vraiment"
    try:
        bb_full  = FH.getbbox(line2)
        bb_pre   = FH.getbbox("Un seul est ")
        bb_word  = FH.getbbox("vraiment")
        full_w   = bb_full[2]-bb_full[0]
        pre_w    = bb_pre[2]-bb_pre[0]
        word_w   = bb_word[2]-bb_word[0]
        left_x   = W//2 - full_w//2
        word_cx  = left_x + pre_w + word_w//2
        arr = np.array(img)
        grad_text_np(arr, "vraiment", FH, word_cx, 1000-off(a_l2), alpha=a_l2)
        img = Image.fromarray(arr)
    except: pass

    txt(img, "Lequel ?", FS, W//2, 1120-off(a_sub), GRAY1, a_sub)
    return img

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 2 · QUIZ
# ─────────────────────────────────────────────────────────────────────────────
QUIZ = [
    ("Tu préfères les soirées\nen groupe ou seul·e ?",   ["En groupe",         "Seul·e / duo"],        0),
    ("Tu fais confiance\nà ton intuition ?",               ["Oui, souvent",      "Je préfère les faits"],0),
    ("Tu décides avec\nle cœur ou la logique ?",           ["Le cœur",           "La logique"],          0),
    ("Tu aimes planifier\nou improviser ?",                 ["Planifier",         "Improviser"],          1),
]
QS = [T['q1'],T['q2'],T['q3'],T['q4']]
SL = [T['q1sel'],T['q2sel'],T['q3sel'],T['q4sel']]

def scene_quiz(t):
    img = Image.new('RGBA',(W,H),(*BG,255))
    draw = ImageDraw.Draw(img)
    arr  = np.array(img)
    grad_text_np(arr, "UrCecret", FL, W//2, 175, alpha=1.0)
    img  = Image.fromarray(arr); draw = ImageDraw.Draw(img)

    # Analysis overlay
    if t >= T['analysis']:
        a_an = fadein(t, T['analysis'])
        return scene_analysis(img, a_an)

    # Current question
    qi = 0
    for i in range(3,-1,-1):
        if t>=QS[i]: qi=i; break

    q_txt, opts, sel_idx = QUIZ[qi]
    sel = sel_idx if t>=SL[qi] else -1
    pct = qi/4 + (0.25 if sel>=0 else 0.0)

    arr = np.array(img)
    prog_bar_np(arr, 80, 295, W-160, 10, pct)
    img = Image.fromarray(arr); draw = ImageDraw.Draw(img)
    txt(img, f"{qi+1} / 4", FLB, W-88, 282, GRAY2, anchor='rm')

    # Card
    rrect(draw, 60, 355, W-60, 1110, 36,
          fill=(255,255,255,10), outline=(255,255,255,22))

    txt_ml(img, q_txt, FQ, W//2, 590, WHITE, sp=14)

    opt_ys = [810, 975]
    for i, opt in enumerate(opts):
        sel_i = (i==sel)
        fc = (*lerpC(GRAY3, VIOLET, 0.55),255) if sel_i else (255,255,255,8)
        oc = (*VIOLET,200)                      if sel_i else (255,255,255,22)
        rrect(draw, 96, opt_ys[i]-68, W-96, opt_ys[i]+68, 24, fill=fc, outline=oc, lw=2)
        txt(img, opt, FO, W//2, opt_ys[i], WHITE if sel_i else GRAY1)

    return img

def scene_analysis(base, alpha):
    ov = Image.new('RGBA',(W,H),(0,0,0,0))
    draw = ImageDraw.Draw(ov)
    bg_ov = Image.new('RGBA',(W,H),(*BG, int(alpha*255)))
    ov = Image.alpha_composite(bg_ov, ov)
    draw = ImageDraw.Draw(ov)

    txt(ov, "Analyse...", F(88), W//2, 650, GRAY1, alpha)
    txt(ov, "Ton profil est", F(68), W//2, 820, WHITE, alpha)
    txt(ov, "en cours d'analyse", F(68), W//2, 910, WHITE, alpha)

    bars = [("E / I",0.72),("N / S",0.85),("F / T",0.62),("P / J",0.78)]
    arr = np.array(ov)
    for bi,(lbl,pct) in enumerate(bars):
        by = 1060 + bi*78
        prog_bar_np(arr, 270, by-7, 560, 14, pct*alpha)
        ov = Image.fromarray(arr)
        txt(ov, lbl, FLB, 250, by, GRAY2, alpha, anchor='rm')
        arr = np.array(ov)
    ov = Image.fromarray(arr)
    return Image.alpha_composite(base.convert('RGBA'), ov)

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 3 · REVEAL
# ─────────────────────────────────────────────────────────────────────────────
TRAITS = ["Imaginatif","Empathique","Spontané","Inspirant"]

def scene_reveal(t):
    img  = Image.new('RGBA',(W,H),(*BG,255))
    draw = ImageDraw.Draw(img)

    a_eye  = fadein(t, T['rEye'])
    a_card = fadein(t, T['rCard'])
    a_duo  = fadein(t, T['rDuo'])

    # Eyebrow
    txt(img, "TON TYPE DE PERSONNALITÉ", FLB, W//2, 415, GRAY2, a_eye)

    # Card background (subtle violet tint)
    arr = np.array(img)
    for c,vc in enumerate(VIOLET):
        arr[480:1300, 80:W-80, c] = (
            arr[480:1300,80:W-80,c].astype(np.float32)*(1-0.1*a_card)+vc*0.1*a_card
        ).clip(0,255).astype(np.uint8)
    img = Image.fromarray(arr); draw = ImageDraw.Draw(img)
    oc = lerpC(BG, LV, 0.32*a_card)
    rrect(draw, 80,480, W-80,1310, 44, outline=(*oc,255), lw=2)

    # ENFP
    arr = np.array(img)
    grad_text_np(arr, "ENFP", FR, W//2, 730, alpha=a_card)
    img = Image.fromarray(arr)

    txt(img, "Le Champion",                   FN,  W//2, 900, WHITE,  a_card)
    txt(img, "Créatif  ·  Enthousiaste  ·  Libre", FTG, W//2, 980, GRAY1,  a_card*0.9)

    # Trait chips
    draw = ImageDraw.Draw(img)
    cols = [160, 400, 640, 880]
    for i,(trait,cx) in enumerate(zip(TRAITS, cols)):
        rrect(draw, cx-108, 1060, cx+108, 1120, 32,
              fill=(255,255,255,int(14*a_card)), outline=(255,255,255,int(28*a_card)))
        txt(img, trait, FTR, cx, 1090, GRAY1, a_card*0.85)

    # Duo card
    dy = 1345
    rrect(draw, 80, dy, W-80, dy+205, 32,
          fill=(255,255,255,int(9*a_duo)), outline=(255,255,255,int(18*a_duo)))
    txt(img, "MODE DUO",            FLB, 240, dy+52,  GRAY2, a_duo, anchor='mm')
    txt(img, "Compatibilité avec",  FTG, 240, dy+107, GRAY1, a_duo, anchor='mm')
    arr = np.array(img)
    grad_text_np(arr, "INTJ", F(62), 560, dy+87, alpha=a_duo)
    img = Image.fromarray(arr)
    txt(img, "Découvre ton partenaire idéal", FLB, W//2+80, dy+155, GRAY2, a_duo*0.8, anchor='mm')

    return img

# ─────────────────────────────────────────────────────────────────────────────
# SCENE 4 · CTA
# ─────────────────────────────────────────────────────────────────────────────
def scene_cta(t):
    img  = Image.new('RGBA',(W,H),(*BG,255))

    # Radial glow
    arr = np.array(img, dtype=np.float32)
    ys = np.arange(H)[:,None]; xs = np.arange(W)[None,:]
    dist = np.sqrt((xs-W//2)**2+(ys-H//2)**2)
    g = np.clip(1-dist/580, 0, 1)*0.12
    arr[:,:,0] = (arr[:,:,0]+VIOLET[0]*g).clip(0,255)
    arr[:,:,2] = (arr[:,:,2]+VIOLET[2]*g).clip(0,255)
    img = Image.fromarray(arr.astype(np.uint8))

    a = fadein(t, T['cta'])

    arr = np.array(img)
    grad_text_np(arr, "UrCecret", FL, W//2, 460, alpha=a)
    img = Image.fromarray(arr)

    txt(img, "Découvre ton type", FC, W//2, 640, WHITE, a)
    arr = np.array(img)
    grad_text_np(arr, "gratuitement", FC, W//2, 754, alpha=a)
    img = Image.fromarray(arr)

    draw = ImageDraw.Draw(img)

    # Badge "Sans carte"
    rrect(draw, W//2-300, 842, W//2+300, 924, 40,
          fill=(*VIOLET[:3],int(38*a)), outline=(*LV,int(75*a)))
    txt(img, "✓  Sans carte bancaire", F(40), W//2, 883, LV, a)

    # Type chips
    chips = ["ENFP","INTJ","ISFJ","+13"]
    for ci,(chip,cxv) in enumerate(zip(chips,[150,370,590,770])):
        rrect(draw, cxv-135,968, cxv+135,1050, 42,
              fill=(255,255,255,int(14*a)), outline=(255,255,255,int(22*a)))
        txt(img, chip, F(42), cxv, 1009, WHITE, a)

    # Gradient button (rounded via PIL mask → numpy fill)
    bx0,by0,bx1,by1 = 96, 1102, W-96, 1232
    btn_mask = Image.new('L',(W,H),0)
    ImageDraw.Draw(btn_mask).rounded_rectangle([bx0,by0,bx1,by1], radius=30, fill=int(255*a))
    mask_arr = np.array(btn_mask)/255.0   # (H,W)
    arr = np.array(img)
    gr = np.tile(grad_row(bx1-bx0, VIOLET, PINK)[None], (by1-by0,1,1))  # (h,w,3)
    m = mask_arr[by0:by1, bx0:bx1, None]
    arr[by0:by1,bx0:bx1,:3] = (arr[by0:by1,bx0:bx1,:3]*(1-m)+gr*m).clip(0,255).astype(np.uint8)
    img = Image.fromarray(arr)
    txt(img, "Commencer le quiz", FBT, W//2, (by0+by1)//2, WHITE, a)

    txt(img, "urcecret.site", F(46,False), W//2, 1292, GRAY2, a*0.85)
    return img

# ─────────────────────────────────────────────────────────────────────────────
# MAIN LOOP — pipe to FFmpeg
# ─────────────────────────────────────────────────────────────────────────────
def blend(a, b, alpha):
    na = np.array(a.convert('RGB'), dtype=np.float32)
    nb = np.array(b.convert('RGB'), dtype=np.float32)
    return Image.fromarray((na*(1-alpha)+nb*alpha).clip(0,255).astype(np.uint8))

def render(fi):
    t = fi/FPS
    if   t < T['quiz']:
        return scene_hook(t, fi)
    elif t < T['quiz']+FADE:
        fa = (t-T['quiz'])/FADE
        return blend(scene_hook(t,fi), scene_quiz(t), fa)
    elif t < T['reveal']:
        return scene_quiz(t)
    elif t < T['reveal']+FADE:
        fa = (t-T['reveal'])/FADE
        return blend(scene_quiz(t), scene_reveal(t), fa)
    elif t < T['cta']:
        return scene_reveal(t)
    elif t < T['cta']+FADE:
        fa = (t-T['cta'])/FADE
        return blend(scene_reveal(t), scene_cta(t), fa)
    else:
        return scene_cta(t)

cmd = [
    'ffmpeg','-y',
    '-f','rawvideo','-vcodec','rawvideo',
    '-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),
    '-i','-',
    '-c:v','libx264','-preset','fast',
    '-pix_fmt','yuv420p','-crf','20',
    OUT
]

print(f"⏳ Rendu {N} frames → {OUT}")
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
t0 = time.time()
try:
    for i in range(N):
        frame = render(i)
        proc.stdin.write(frame.convert('RGB').tobytes())
        if i%30==0:
            el = time.time()-t0
            rem = (el/max(i,1))*(N-i)
            print(f"\r  {i/N*100:5.1f}%  frame {i:3d}/{N}  ~{rem:.0f}s restant    ",
                  end='', flush=True)
    proc.stdin.close()
    proc.wait()
    print(f"\n✅ Terminé en {time.time()-t0:.0f}s  →  {OUT}")
except KeyboardInterrupt:
    proc.kill()
    print("\n❌ Annulé")
    sys.exit(1)
