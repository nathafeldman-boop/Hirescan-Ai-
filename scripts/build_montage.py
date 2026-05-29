#!/usr/bin/env python3
"""HireScan AI — Video Montage Builder (ffmpeg)"""
import subprocess, struct, math, os

SRC = "/root/.claude/uploads/c9408912-8f11-4461-93b4-16779fc9721a/3f013e33-HeyGenVideo1779591264921.mp4"
DST = "/home/user/my-video/public/heygen_montage.mp4"
DURATION = 30.64
W, H = 720, 1280
SR = 44100
FONT_B = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

os.makedirs("/tmp/hm", exist_ok=True)
os.makedirs("/home/user/my-video/public", exist_ok=True)

# ── WAV writer ───────────────────────────────────────────────
def write_wav(samples, path):
    n = len(samples)
    with open(path, 'wb') as f:
        f.write(b'RIFF'); f.write(struct.pack('<I', 36+n*2))
        f.write(b'WAVE')
        f.write(b'fmt '); f.write(struct.pack('<I',16))
        f.write(struct.pack('<H',1)); f.write(struct.pack('<H',1))
        f.write(struct.pack('<I',SR)); f.write(struct.pack('<I',SR*2))
        f.write(struct.pack('<H',2)); f.write(struct.pack('<H',16))
        f.write(b'data'); f.write(struct.pack('<I',n*2))
        for s in samples:
            f.write(struct.pack('<h', max(-32767, min(32767, int(s*32767)))))

# ── SFX generators ───────────────────────────────────────────
def sfx_whoosh(dur=0.22, vol=0.38):
    n=int(SR*dur); r=[]
    for i in range(n):
        p=i/n; freq=2200-1800*p
        r.append(math.sin(2*math.pi*freq*i/SR)*((1-p)**1.8)*math.exp(-p*3)*vol)
    return r

def sfx_bass(dur=0.16, vol=0.80):
    n=int(SR*dur); r=[]
    for i in range(n):
        p=i/n; freq=85-55*p
        env=math.exp(-p*18)*vol
        r.append(math.tanh(math.sin(2*math.pi*freq*i/SR)*2.5)*0.55*env)
    return r

def sfx_ding(freq=1100, dur=0.45, vol=0.48):
    n=int(SR*dur); r=[]
    for i in range(n):
        t=i/SR
        env=math.exp(-t*7)*min(1,t*300)
        r.append((math.sin(2*math.pi*freq*t)*0.65+math.sin(2*math.pi*freq*2.76*t)*0.25)*env*vol)
    return r

def sfx_pop(freq=750, dur=0.10, vol=0.55):
    n=int(SR*dur)
    return [math.sin(2*math.pi*freq*i/SR)*math.exp(-i/n*25)*vol for i in range(n)]

# ── Build SFX mix track ──────────────────────────────────────
ws=sfx_whoosh(); bs=sfx_bass(); ds=sfx_ding(); ps=sfx_pop()
total_n=int(SR*(DURATION+1))
track=[0.0]*total_n

def mix_at(samples, t_s, vol=1.0):
    st=int(t_s*SR)
    for i,s in enumerate(samples):
        if st+i<total_n: track[st+i]+=s*vol

# Whoosh at every 1.8s cut
for i in range(1, int(DURATION/1.8)+2):
    ct=i*1.8
    if 0.5<ct<DURATION-0.3: mix_at(ws, ct, 0.42)

# Bass hits at key moments
mix_at(bs, 0.03, 0.65)
mix_at(bs, 4.8,  0.90)
mix_at(bs, 9.0,  0.85)
mix_at(bs, 18.5, 0.78)
mix_at(bs, 25.6, 0.75)

# Pops
mix_at(ps, 0.03, 0.6)
mix_at(ps, 9.0,  0.7)
mix_at(ps, 18.5, 0.6)

# Dings at CTA
mix_at(ds, 25.6, 0.65)
mix_at(ds, 28.0, 0.52)

# Normalize
mx=max(abs(s) for s in track) or 1
if mx>0.88: track=[s*0.88/mx for s in track]
write_wav(track, "/tmp/hm/sfx.wav")
print("✓ SFX generated")

# ── ASS Subtitles ────────────────────────────────────────────
def ts(t):
    return f"{int(t//3600)}:{int((t%3600)//60):02d}:{int(t%60):02d}.{int((t-int(t))*100):02d}"

# ASS BGR color codes (opposite of RGB)
OR  = r"{\c&H0066FF&}"   # orange
GRN = r"{\c&H44CC00&}"   # green  
BLU = r"{\c&H00AAFF&}"   # blue
WHT = r"{\c&HFFFFFF&}"   # white reset

SUBS = [
    (0.0,  2.4,  "Tu envoies des CVs partout..."),
    (2.4,  4.8,  "Mais aucune réponse ?"),
    (4.8,  7.2,  f"Les ATS éliminent {OR}75%{WHT} des candidatures"),
    (7.2,  9.0,  "Avant même qu'un humain te lise"),
    (9.0,  11.4, f"{GRN}HireScan AI{WHT} analyse ton CV"),
    (11.4, 13.8, f"Score ATS {GRN}instantané{WHT}"),
    (13.8, 16.2, "Mots-clés manquants détectés"),
    (16.2, 18.5, f"Conseils {BLU}personnalisés{WHT}"),
    (18.5, 20.8, f"En moins de {OR}30 secondes{WHT} !"),
    (20.8, 23.2, "Passe enfin les filtres ATS"),
    (23.2, 25.6, "Décroche plus d'entretiens"),
    (25.6, 28.0, f"Essaie {GRN}GRATUITEMENT{WHT}"),
    (28.0, 30.64,f"{OR}hirescan.online{WHT}"),
]

ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,FreeSans,54,&H00FFFFFF,&H000000FF,&H00000000,&HAA000000,-1,0,0,0,100,100,1.5,0,1,3,2,2,25,25,110,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
for s,e,txt in SUBS:
    ass += f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{{\\fad(130,90)}}{txt}\n"

with open("/tmp/hm/subs.ass","w",encoding="utf-8") as f:
    f.write(ass)
print("✓ Subtitles generated")

# ── Title cards — write to textfiles (avoids escaping hell) ──
TITLES = [
    (0.0,  2.2,  "ATTENTION !", "Si tu cherches un emploi...", "FF6600"),
    (4.8,  7.2,  "75% REJETES !", "Par les robots ATS", "FF3300"),
    (9.0,  11.4, "LA SOLUTION", "HireScan AI", "00AA44"),
    (18.5, 20.8, "30 SECONDES", "C est tout ce qu il faut", "FF9900"),
    (25.6, 28.0, "GRATUIT !", "Commence maintenant", "00AA44"),
]

for i,(s,e,main,sub,col) in enumerate(TITLES):
    with open(f"/tmp/hm/t{i}_main.txt","w") as f: f.write(main)
    with open(f"/tmp/hm/t{i}_sub.txt","w")  as f: f.write(sub)

print("✓ Title textfiles written")

# ── Build ffmpeg video filter ─────────────────────────────────
filters = []

# 1. Constant zoom: scale 5% larger, crop back to original size
zw, zh = int(W*1.055), int(H*1.055)
cx, cy = (zw-W)//2, (zh-H)//2
filters.append(f"scale={zw}:{zh}:flags=lanczos")
filters.append(f"crop={W}:{H}:{cx}:{cy}")

# 2. Saturation + brightness spike at every cut (every 1.8s)
# hue filter: s supports time expressions
filters.append(
    "hue=s='1+0.85*exp(-pow(mod(t+0.001,1.8)*24,2))':"
    "b='0.08*exp(-pow(mod(t+0.001,1.8)*24,2))'"
)

# 3. Slight sharpening for crispness
filters.append("unsharp=5:5:0.5:5:5:0.0")

# 4. Title cards: box + main text + subtitle text
for i,(s,e,main,sub,col) in enumerate(TITLES):
    en = f"between(t,{s},{e})"
    r,g,b = int(col[0:2],16), int(col[2:4],16), int(col[4:6],16)
    box_col = f"0x{col}@0.88"
    # Dark background box
    filters.append(f"drawbox=x=0:y=58:w={W}:h=155:color=0x111111@0.88:t=fill:enable='{en}'")
    # Colored accent left bar
    filters.append(f"drawbox=x=0:y=58:w=8:h=155:color={box_col}:t=fill:enable='{en}'")
    # Main title
    filters.append(
        f"drawtext=textfile=/tmp/hm/t{i}_main.txt:"
        f"fontfile={FONT_B}:fontsize=65:"
        f"fontcolor=0x{col}:x=22:y=75:enable='{en}'"
    )
    # Subtitle
    filters.append(
        f"drawtext=textfile=/tmp/hm/t{i}_sub.txt:"
        f"fontfile={FONT_R}:fontsize=38:"
        f"fontcolor=0xFFDDAA:x=22:y=155:enable='{en}'"
    )

# 5. Animated subtitles
filters.append("subtitles=/tmp/hm/subs.ass:fontsdir=/usr/share/fonts/truetype/freefont")

# 6. Watermark / CTA badge (always visible at bottom-right)
# hirescan.online pill — shown last 8 seconds
filters.append(
    f"drawbox=x={W-260}:y={H-90}:w=248:h=70:color=0xFF6600@0.92:t=fill:enable='gte(t,22.5)'"
)
filters.append(
    f"drawtext=text='hirescan.online':"
    f"fontfile={FONT_B}:fontsize=32:"
    f"fontcolor=white:x={W-250}:y={H-68}:enable='gte(t,22.5)'"
)

video_filter = ",".join(filters)

# ── ffmpeg command ────────────────────────────────────────────
cmd = [
    "ffmpeg", "-y",
    "-i", SRC,
    "-i", "/tmp/hm/sfx.wav",
    "-filter_complex",
    f"[0:v]{video_filter}[vout];"
    f"[0:a][1:a]amix=inputs=2:duration=first:weights='1 0.75'[aout]",
    "-map", "[vout]",
    "-map", "[aout]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "17",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart",
    DST
]

print("\n🎬 Running ffmpeg montage render...")
print("Filters:", len(filters), "stages")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
print(result.stderr[-3000:] if result.stderr else "")
if result.returncode == 0:
    size = os.path.getsize(DST)//1024
    print(f"\n✅ SUCCESS → {DST} ({size}KB)")
else:
    print(f"\n❌ FAILED (code {result.returncode})")
    print(result.stdout[-1000:])
