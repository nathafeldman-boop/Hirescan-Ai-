import React from 'react';
import {
  AbsoluteFill, Audio, interpolate, spring,
  useCurrentFrame, staticFile,
} from 'remotion';

export const HIRESCAN_V3_FRAMES = 1140; // 38s
const SD = 57; // 1.9s/scene — ~1.8s eye stimulation rule
const F = "'Inter','Helvetica Neue',Arial,sans-serif";

// ─── SPRING HELPERS ───────────────────────────────────────────────────────────
const sp = (frame: number, d = 14, k = 180, m = 0.8) =>
  spring({ fps: 30, frame, config: { damping: d, stiffness: k, mass: m } });

const spDel = (frame: number, delay: number, d = 14, k = 180) =>
  sp(Math.max(0, frame - delay), d, k);

function fadeIn(f: number, dur = 10) {
  return interpolate(f, [0, dur], [0, 1], { extrapolateRight: 'clamp' });
}
function slideUp(f: number) {
  const s = sp(f, 16, 200);
  return { opacity: fadeIn(s * 10, 10), transform: `translateY(${interpolate(s,[0,1],[40,0])}px)` };
}

// ─── BRAND LOGO BADGE ─────────────────────────────────────────────────────────
const Logo: React.FC<{
  color: string; text: string; icon: string;
  x: number; y: number; frame: number; delay: number; rot?: number; scale?: number;
}> = ({ color, text, icon, x, y, frame, delay, rot = 0, scale = 1 }) => {
  const s = spDel(frame, delay, 10, 200);
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: `scale(${interpolate(s,[0,1],[0,1]) * scale}) rotate(${rot}deg)`,
      opacity: interpolate(s,[0,1],[0,1]),
      transformOrigin: 'center',
    }}>
      <div style={{
        background: color, borderRadius: 18, width: 80, height: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 24px ${color}55`,
        border: '2px solid rgba(255,255,255,0.4)',
      }}>
        <div style={{ fontSize: 28 }}>{icon}</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'white', letterSpacing: '0.05em', marginTop: 2 }}>
          {text}
        </div>
      </div>
    </div>
  );
};

// ─── 3D FLOATING SCREEN ───────────────────────────────────────────────────────
const Screen3D: React.FC<{
  frame: number;
  rotX?: number; rotY?: number;
  width?: number;
  children: React.ReactNode;
}> = ({ frame, rotX = 8, rotY = -14, width = 82, children }) => {
  const s = sp(frame, 12, 140, 0.9);
  const bobY = Math.sin(frame * 0.04) * 6;
  const bobRot = Math.sin(frame * 0.03) * 1.5;

  return (
    <div style={{ perspective: 1400, perspectiveOrigin: '50% 35%', width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: `${width}%`,
        transform: `
          rotateX(${rotX + bobRot * 0.5}deg)
          rotateY(${rotY + bobRot}deg)
          scale(${interpolate(s,[0,1],[0.5,1])})
          translateY(${bobY}px)`,
        transformStyle: 'preserve-3d',
        opacity: interpolate(s,[0,1],[0,1]),
        boxShadow: '0 50px 100px rgba(0,0,0,0.25), 0 15px 40px rgba(0,0,0,0.12)',
        borderRadius: 24,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
};

// ─── HIRESCAN UI MOCK SCREENS ─────────────────────────────────────────────────
const HeaderBar: React.FC = () => (
  <div style={{
    background: 'white', borderBottom: '1px solid #E5E7EB',
    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <div style={{
      width: 30, height: 30, borderRadius: 8,
      background: 'linear-gradient(135deg,#4F46E5,#06B6D4)',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize: 14, color: 'white', fontWeight: 900,
    }}>H</div>
    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#111827' }}>HireScan</span>
    <span style={{ fontFamily: F, fontSize: 12, color: '#6B7280', marginLeft: 4 }}>· Analyseur IA</span>
    <div style={{ marginLeft: 'auto', display:'flex', gap:6 }}>
      {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => (
        <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
      ))}
    </div>
  </div>
);

const UploadScreen: React.FC<{ frame: number }> = ({ frame: _frame }) => {
  return (
    <div style={{ background: '#FAFBFF', fontFamily: F }}>
      <HeaderBar />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
          Analyse ton CV
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>
          Téléverse ton CV pour obtenir ton score ATS
        </div>
        <div style={{
          border: '2.5px dashed rgba(79,70,229,0.4)',
          borderRadius: 16, padding: '36px 20px', textAlign: 'center',
          background: 'rgba(79,70,229,0.03)',
          animation: 'none',
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📄</div>
          <div style={{ fontWeight: 700, color: '#4F46E5', fontSize: 17 }}>
            Glisse ton CV ici
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>
            PDF, Word, Image — tous formats acceptés
          </div>
          <div style={{
            marginTop: 20, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)',
            color: 'white', borderRadius: 100, padding: '10px 28px',
            display: 'inline-block', fontWeight: 700, fontSize: 14,
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
          }}>Choisir un fichier</div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['💼 LinkedIn', '📋 Indeed', '🏛️ Pôle Emploi'].map((tag, i) => (
            <div key={i} style={{
              background: 'rgba(79,70,229,0.08)', color: '#4F46E5',
              borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            }}>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScanningScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = Math.min((frame / 50) * 100, 92);
  const msgs = ['Extraction du texte...', 'Analyse des mots-clés...', 'Calcul du score ATS...', 'Comparaison sectorielle...'];
  const msgIdx = Math.min(Math.floor(frame / 12), msgs.length - 1);

  return (
    <div style={{ background: '#FAFBFF', fontFamily: F }}>
      <HeaderBar />
      <div style={{ padding: '24px' }}>
        <div style={{ fontWeight: 800, color: '#111827', fontSize: 18, marginBottom: 20 }}>
          Analyse en cours...
        </div>
        {/* CV preview strip */}
        <div style={{
          background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 28 }}>📄</div>
          <div>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>Mon_CV_2024.pdf</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>247 KB · 2 pages</div>
          </div>
          <div style={{
            marginLeft: 'auto', background: '#F0FDF4', color: '#16A34A',
            borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          }}>✓ Reçu</div>
        </div>
        {/* AI pulse animation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 70, height: 70 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid rgba(79,70,229,0.4)',
                transform: `scale(${1 + i * 0.25 + Math.sin(frame * 0.15 + i) * 0.1})`,
                opacity: 0.6 - i * 0.18,
              }} />
            ))}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'linear-gradient(135deg,#4F46E5,#06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, color: 'white',
            }}>⚡</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: '#F3F4F6', borderRadius: 100, height: 8, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%', borderRadius: 100,
            width: `${progress}%`,
            background: 'linear-gradient(90deg,#4F46E5,#06B6D4)',
            boxShadow: '0 0 8px rgba(79,70,229,0.5)',
            transition: 'width 0.1s ease',
          }} />
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', fontWeight: 500 }}>
          {msgs[msgIdx]}
        </div>
      </div>
    </div>
  );
};

const ResultsScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const score = Math.round(interpolate(sp(frame, 10, 120), [0,1], [0, 91]));
  const color = score > 70 ? '#16A34A' : score > 40 ? '#D97706' : '#DC2626';
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (score / 100);

  return (
    <div style={{ background: '#FAFBFF', fontFamily: F }}>
      <HeaderBar />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight: 800, color: '#111827', fontSize: 17, marginBottom: 14 }}>
          Ton score ATS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
          {/* Donut */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <svg width={120} height={120}>
              <circle cx={60} cy={60} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={10} />
              <circle cx={60} cy={60} r={radius} fill="none"
                stroke={color} strokeWidth={10}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
              />
            </svg>
            <div style={{
              position:'absolute', inset:0, display:'flex',
              flexDirection:'column', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight:1 }}>{score}</div>
              <div style={{ fontSize: 11, color:'#9CA3AF', fontWeight:600 }}>/100</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color: score > 70 ? '#16A34A' : '#DC2626' }}>
              {score > 70 ? '✓ Excellent !' : score > 40 ? '⚠ À améliorer' : '✕ Faible'}
            </div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:4, lineHeight:1.5 }}>
              {score > 70
                ? 'Ton CV passe les filtres ATS'
                : 'Des mots-clés critiques manquent'}
            </div>
          </div>
        </div>
        {/* Mini metrics */}
        {[
          { label:'Mots-clés correspondants', val: `${Math.round(score * 0.87)}/100`, ok: score > 50 },
          { label:'Lisibilité ATS', val: score > 60 ? 'Optimale' : 'Problèmes', ok: score > 60 },
          { label:'Structure', val: score > 55 ? 'Conforme' : 'À corriger', ok: score > 55 },
        ].map((m, i) => (
          <div key={i} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'8px 0', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none',
          }}>
            <span style={{ fontSize:12, color:'#374151' }}>{m.label}</span>
            <span style={{ fontSize:12, fontWeight:700, color: m.ok ? '#16A34A' : '#DC2626' }}>
              {m.ok ? '✓ ' : '✕ '}{m.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KeywordsScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const missing = ['Intelligence Artificielle', 'Data Analysis', 'Scrum Master', 'KPI', 'ROI', 'SQL'];
  const present = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Git'];

  return (
    <div style={{ background: '#FAFBFF', fontFamily: F }}>
      <HeaderBar />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight:800, color:'#111827', fontSize:17, marginBottom:16 }}>
          Mots-clés manquants
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:16, fontSize:12 }}>
          <div style={{
            background:'#FEF2F2', color:'#DC2626', borderRadius:100, padding:'4px 12px', fontWeight:700,
          }}>✕ {missing.length} absents</div>
          <div style={{
            background:'#F0FDF4', color:'#16A34A', borderRadius:100, padding:'4px 12px', fontWeight:700,
          }}>✓ {present.length} présents</div>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
          {missing.map((kw, i) => {
            const s = spDel(frame, i * 4, 16, 220);
            return (
              <div key={i} style={{
                background:'#FEF2F2', border:'1px solid rgba(220,38,38,0.3)',
                color:'#DC2626', borderRadius:100, padding:'5px 12px',
                fontSize:12, fontWeight:600,
                opacity: interpolate(s,[0,1],[0,1]),
                transform:`scale(${interpolate(s,[0,1],[0.5,1])})`,
              }}>{kw}</div>
            );
          })}
          {present.map((kw, i) => (
            <div key={i} style={{
              background:'#F0FDF4', border:'1px solid rgba(22,163,74,0.3)',
              color:'#16A34A', borderRadius:100, padding:'5px 12px', fontSize:12, fontWeight:600,
            }}>{kw}</div>
          ))}
        </div>
        <div style={{
          background:'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(6,182,212,0.08))',
          border:'1px solid rgba(79,70,229,0.15)', borderRadius:12, padding:'12px 16px',
        }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#4F46E5', marginBottom:4 }}>💡 Conseil IA</div>
          <div style={{ fontSize:12, color:'#374151', lineHeight:1.5 }}>
            Ajoute ces termes dans tes expériences pour multiplier ta visibilité par 3.
          </div>
        </div>
      </div>
    </div>
  );
};

const ImprovementScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const items = [
    { icon:'⚡', text:'Reformuler 3 bullet points', done: frame > 10 },
    { icon:'🎯', text:"Ajouter l'offre d'emploi cible", done: frame > 20 },
    { icon:'📊', text:'Quantifier tes résultats', done: frame > 30 },
    { icon:'🔑', text:'Insérer les mots-clés manquants', done: frame > 40 },
    { icon:'✅', text:'Score estimé après : 91%', done: frame > 48 },
  ];

  return (
    <div style={{ background: '#FAFBFF', fontFamily: F }}>
      <HeaderBar />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight:800, color:'#111827', fontSize:17, marginBottom:16 }}>
          Plan d'action IA
        </div>
        {items.map((item, i) => {
          const s = spDel(frame, i * 9, 16, 220);
          const isLast = i === items.length - 1;
          return (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'10px 14px', marginBottom:8, borderRadius:12,
              background: isLast ? 'linear-gradient(135deg,rgba(79,70,229,0.1),rgba(6,182,212,0.1))' : 'white',
              border: `1px solid ${isLast ? 'rgba(79,70,229,0.25)' : '#F3F4F6'}`,
              opacity: interpolate(s,[0,1],[0,1]),
              transform:`translateX(${interpolate(s,[0,1],[-30,0])}px)`,
            }}>
              <div style={{ fontSize:20 }}>{item.icon}</div>
              <div style={{
                fontSize:13, fontWeight: isLast ? 800 : 600,
                color: isLast ? '#4F46E5' : '#111827', flex:1,
              }}>{item.text}</div>
              {item.done && (
                <div style={{
                  background: isLast ? 'linear-gradient(135deg,#4F46E5,#06B6D4)' : '#16A34A',
                  color:'white', borderRadius:'50%', width:20, height:20,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,
                }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SCENE COMPONENTS ─────────────────────────────────────────────────────────
// S0-1: Hook — floating job logos on white
const HookScene: React.FC<{ frame: number; sub: number }> = ({ frame, sub }) => {
  const logos = [
    { color:'#0077B5', text:'LINKEDIN', icon:'💼', x:8,  y:18, delay:3,  rot:-8,  scale:1.1 },
    { color:'#003A9B', text:'INDEED',   icon:'🔍', x:70, y:12, delay:6,  rot:6,   scale:0.95 },
    { color:'#7C3AED', text:'WELCOME',  icon:'👔', x:62, y:60, delay:10, rot:-5,  scale:0.9 },
    { color:'#DC2626', text:'MONSTER',  icon:'🐉', x:5,  y:58, delay:8,  rot:10,  scale:0.85 },
    { color:'#059669', text:'PÔLE EMP', icon:'🏛️', x:38, y:72, delay:14, rot:-4,  scale:0.9 },
    { color:'#F59E0B', text:'APEC',     icon:'⭐', x:78, y:44, delay:5,  rot:8,   scale:0.8 },
  ];

  const lines = [
    ['Ton CV survit', '6 secondes.'],
    ['Sur le marché', "de l'emploi."],
  ];
  const [line1, line2] = lines[Math.min(sub, 1)];

  return (
    <AbsoluteFill style={{ background: '#F8F9FF' }}>
      {logos.map((l, i) => (
        <Logo key={i} {...l} frame={frame} />
      ))}
      {/* Dot grid bg */}
      <AbsoluteFill style={{ opacity: 0.12 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#4F46E5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </AbsoluteFill>
      {/* Main text */}
      <AbsoluteFill style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', padding:'0 40px',
      }}>
        <div style={{ ...slideUp(frame), textAlign:'center' }}>
          <div style={{
            fontFamily:F, fontSize:68, fontWeight:900, color:'#111827',
            lineHeight:1.0, letterSpacing:'-0.03em',
          }}>
            {line1}
          </div>
          <div style={{
            fontFamily:F, fontSize:68, fontWeight:900, lineHeight:1.0,
            letterSpacing:'-0.03em',
            background:'linear-gradient(135deg,#4F46E5,#06B6D4)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {line2}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S2-3: Stat on dark gradient
const StatScene: React.FC<{ frame: number; sub: number }> = ({ frame, sub }) => {
  const sc = sp(frame, 10, 130);
  const num = Math.round(interpolate(sc, [0,1], [0, 75]));

  return (
    <AbsoluteFill style={{ background:'linear-gradient(160deg,#0f0c29,#302b63,#24243e)' }}>
      {/* Geometric lines */}
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.1}}>
        {Array.from({length:6},(_,i) => (
          <line key={i} x1={`${i*20}%`} y1="0" x2={`${i*20+10}%`} y2="100%"
            stroke="rgba(150,100,255,0.5)" strokeWidth="1"/>
        ))}
      </svg>
      <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        {sub === 0 ? (
          <>
            <div style={{
              fontFamily:F, fontSize:160, fontWeight:900,
              color:'white', lineHeight:0.85,
              textShadow:'0 0 80px rgba(150,100,255,0.6)',
              transform:`scale(${interpolate(sc,[0,1],[0.4,1])})`,
              opacity:interpolate(sc,[0,1],[0,1]),
            }}>{num}%</div>
            <div style={{fontFamily:F,fontSize:28,fontWeight:700,color:'rgba(200,180,255,0.9)',marginTop:16,...slideUp(frame)}}>
              des candidats éliminés
            </div>
            <div style={{fontFamily:F,fontSize:22,color:'rgba(180,160,255,0.7)',marginTop:8,...slideUp(frame)}}>
              par un robot. Sans être lus.
            </div>
          </>
        ) : (
          <div style={{textAlign:'center',padding:'0 50px',...slideUp(frame)}}>
            <div style={{fontFamily:F,fontSize:52,fontWeight:900,color:'white',lineHeight:1.2}}>
              Les systèmes ATS
            </div>
            <div style={{
              fontFamily:F,fontSize:52,fontWeight:900,lineHeight:1.2,
              background:'linear-gradient(135deg,#FF4444,#FF8800)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            }}>
              rejettent. Filtrent.
            </div>
            <div style={{fontFamily:F,fontSize:28,color:'rgba(255,255,255,0.6)',marginTop:16}}>
              Avant qu'un humain te lise.
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S4-5: Villain — ATS robot
const VillainScene: React.FC<{ frame: number }> = ({ frame }) => {
  const scanY = (frame * 4.5) % 100;
  const pulse = 0.6 + Math.sin(frame * 0.12) * 0.4;

  return (
    <AbsoluteFill style={{ background:'#0D0014' }}>
      {/* Grid */}
      <AbsoluteFill style={{opacity:0.06}}>
        {Array.from({length:25},(_,i) => (
          <div key={i} style={{position:'absolute',left:0,right:0,top:`${i*4}%`,height:1,background:'rgba(255,50,50,0.5)'}}/>
        ))}
      </AbsoluteFill>
      {/* Scanner beam */}
      <div style={{
        position:'absolute',left:0,right:0,top:`${scanY}%`,height:5,
        background:'linear-gradient(90deg,transparent,rgba(255,30,30,0.9) 40%,rgba(255,100,100,1) 50%,rgba(255,30,30,0.9) 60%,transparent)',
        boxShadow:'0 0 25px rgba(255,0,0,0.7)',pointerEvents:'none',
      }}/>
      {/* Eyes */}
      <div style={{position:'absolute',top:'30%',left:'50%',transform:'translate(-50%,-50%)',display:'flex',gap:44}}>
        {[0,1].map(i => (
          <div key={i} style={{
            width:86,height:86,borderRadius:'50%',
            background:`rgba(255,20,20,${pulse*0.12})`,
            border:`3px solid rgba(255,40,40,${pulse*0.9})`,
            boxShadow:`0 0 40px rgba(255,0,0,${pulse*0.7}),0 0 80px rgba(255,0,0,${pulse*0.3})`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <div style={{width:32,height:32,borderRadius:'50%',background:`rgba(255,60,60,${pulse})`,
              boxShadow:`0 0 20px rgba(255,0,0,${pulse})`}}/>
          </div>
        ))}
      </div>
      {/* Status */}
      <div style={{position:'absolute',top:'62%',left:'50%',transform:'translateX(-50%)',width:'80%'}}>
        {['SCANNING...','MOTS-CLÉS : 0/10','ATS SCORE: 12% — REJETÉ'].map((t,i) => (
          <div key={i} style={{
            fontFamily:F,fontSize:i===2?22:18,fontWeight:700,
            color:i===2?'#FF4444':'rgba(255,100,100,0.7)',
            letterSpacing:'0.12em',textAlign:'center',
            opacity:interpolate(Math.max(0,frame-i*8),[0,10],[0,1],{extrapolateRight:'clamp'}),
            marginBottom:8,
          }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// S6: Reveal — white flash + logo
const RevealScene: React.FC<{ frame: number }> = ({ frame }) => {
  const sc = sp(frame, 10, 140);
  const rings = [120, 220, 340, 480];
  return (
    <AbsoluteFill style={{background:'white'}}>
      {rings.map((r,i) => {
        const rs = spDel(frame, i*5, 16, 120);
        const pulse = 0.3 + Math.sin(frame*0.06 + i)*0.2;
        return (
          <div key={i} style={{
            position:'absolute',top:'42%',left:'50%',width:r,height:r,
            transform:`translate(-50%,-50%) scale(${interpolate(rs,[0,1],[0.2,1])})`,
            borderRadius:'50%',
            border:`2px solid rgba(79,70,229,${pulse*(0.8-i*0.15)*interpolate(rs,[0,1],[0,1])})`,
            boxShadow:`0 0 20px rgba(79,70,229,${0.15*pulse})`,
          }}/>
        );
      })}
      <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{
          width:80,height:80,borderRadius:20,
          background:'linear-gradient(135deg,#4F46E5,#06B6D4)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:36,color:'white',fontWeight:900,
          boxShadow:'0 20px 50px rgba(79,70,229,0.4)',
          transform:`scale(${interpolate(sc,[0,1],[0.3,1])})`,
          opacity:interpolate(sc,[0,1],[0,1]),
          marginBottom:20,
        }}>H</div>
        <div style={{
          fontFamily:F,fontSize:64,fontWeight:900,letterSpacing:'-0.02em',
          transform:`scale(${interpolate(sc,[0,1],[0.5,1])})`,
          opacity:interpolate(sc,[0,1],[0,1]),
        }}>
          <span style={{
            background:'linear-gradient(135deg,#4F46E5,#06B6D4)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
          }}>HireScan</span>
        </div>
        <div style={{fontFamily:F,fontSize:22,color:'#6B7280',marginTop:8,...slideUp(frame)}}>
          Analyse ton CV comme un recruteur.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S7-11: Demo screens in 3D
const DemoScene: React.FC<{ frame: number; screenIndex: number }> = ({ frame, screenIndex }) => {
  const bg = '#F0F2FF';
  const screens = [UploadScreen, ScanningScreen, ResultsScreen, KeywordsScreen, ImprovementScreen];
  const SC = screens[Math.min(screenIndex, screens.length-1)];
  const rotY = [-14, 12, -10, 14, -8][Math.min(screenIndex, 4)];

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* Background pattern */}
      <AbsoluteFill style={{opacity:0.06}}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4F46E5" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </AbsoluteFill>
      {/* 3D Screen */}
      <Screen3D frame={frame} rotY={rotY}>
        <SC frame={frame}/>
      </Screen3D>
      {/* Label */}
      <div style={{
        position:'absolute',bottom:120,left:0,right:0,
        display:'flex',justifyContent:'center',
        ...slideUp(frame),
      }}>
        <div style={{
          background:'white',borderRadius:100,padding:'8px 20px',
          boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
          fontFamily:F,fontSize:15,fontWeight:700,color:'#111827',
          display:'flex',alignItems:'center',gap:8,
        }}>
          <div style={{
            width:8,height:8,borderRadius:'50%',
            background:'linear-gradient(135deg,#4F46E5,#06B6D4)',
          }}/>
          {['Téléverse ton CV','Analyse IA en cours','Résultats en temps réel','Mots-clés manquants',"Plan d'action personnalisé"][screenIndex]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// S12-13: Score transformation
const ScoreRevealScene: React.FC<{ frame: number; isAfter: boolean }> = ({ frame, isAfter }) => {
  const targetScore = isAfter ? 91 : 34;
  const sc = sp(frame, 10, 150, 0.8);
  const score = Math.round(interpolate(sc, [0,1], [0, targetScore]));
  const color = isAfter ? '#16A34A' : '#DC2626';
  const radius = 110;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (score / 100);
  const bg = isAfter ? '#F0FDF4' : '#FEF2F2';

  return (
    <AbsoluteFill style={{background:bg}}>
      <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{
          fontSize:22,fontFamily:F,fontWeight:700,
          color:isAfter?'#16A34A':'#DC2626',marginBottom:24,
          ...slideUp(frame),
        }}>
          {isAfter ? '✓ Après HireScan' : '✕ Avant HireScan'}
        </div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width={260} height={260}>
            <circle cx={130} cy={130} r={radius} fill="none"
              stroke={isAfter?'rgba(22,163,74,0.12)':'rgba(220,38,38,0.12)'} strokeWidth={20}/>
            <circle cx={130} cy={130} r={radius} fill="none"
              stroke={color} strokeWidth={20}
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round" transform="rotate(-90 130 130)"
              style={{filter:`drop-shadow(0 0 16px ${color}80)`}}
            />
          </svg>
          <div style={{
            position:'absolute',inset:0,display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',
          }}>
            <div style={{
              fontFamily:F,fontSize:88,fontWeight:900,color,lineHeight:0.9,
              transform:`scale(${interpolate(sc,[0,1],[0.4,1])})`,
              opacity:interpolate(sc,[0,1],[0,1]),
            }}>{score}</div>
            <div style={{fontFamily:F,fontSize:24,fontWeight:800,color,marginTop:4}}>%</div>
          </div>
        </div>
        <div style={{
          fontFamily:F,fontSize:26,fontWeight:700,
          color:isAfter?'#16A34A':'#DC2626',marginTop:20,
          ...slideUp(frame),
        }}>
          {isAfter ? '→ Entretien décroché !' : '→ CV rejeté directement'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S14-15: Social proof — testimonials
const SocialScene: React.FC<{ frame: number }> = ({ frame }) => {
  const cards = [
    { name:'Marie L.', role:'Dev Frontend', score:'34% → 92%', text:'Entretien en 3 jours !', color:'#4F46E5' },
    { name:'Thomas R.', role:'Chef de projet', score:'28% → 88%', text:'3 offres en 1 semaine', color:'#06B6D4' },
    { name:'Sara M.', role:'Data Analyst', score:'41% → 95%', text:'CDI décroché !', color:'#7C3AED' },
  ];

  return (
    <AbsoluteFill style={{background:'white'}}>
      <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',
        justifyContent:'center',padding:'0 30px',gap:14}}>
        <div style={{fontFamily:F,fontSize:32,fontWeight:900,color:'#111827',textAlign:'center',
          marginBottom:6,...slideUp(frame)}}>
          Ils l'ont utilisé.
        </div>
        {cards.map((c,i) => {
          const sc = spDel(frame, i*10, 16, 220);
          return (
            <div key={i} style={{
              width:'100%',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:16,
              padding:'16px 20px',display:'flex',alignItems:'center',gap:14,
              transform:`translateX(${interpolate(sc,[0,1],[i%2===0?-80:80,0])}px)`,
              opacity:interpolate(sc,[0,1],[0,1]),
            }}>
              <div style={{
                width:44,height:44,borderRadius:'50%',flexShrink:0,
                background:`linear-gradient(135deg,${c.color},${c.color}88)`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:18,color:'white',fontWeight:900,
              }}>{c.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:F,fontWeight:700,fontSize:14,color:'#111827'}}>{c.name}</div>
                <div style={{fontFamily:F,fontSize:12,color:'#6B7280'}}>{c.role}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:F,fontSize:13,fontWeight:800,color:c.color}}>{c.score}</div>
                <div style={{fontFamily:F,fontSize:12,color:'#374151'}}>"{ c.text}"</div>
              </div>
            </div>
          );
        })}
        <div style={{fontFamily:F,fontSize:15,color:'#6B7280',textAlign:'center',marginTop:4,...slideUp(frame)}}>
          ⭐⭐⭐⭐⭐ &nbsp;4.9/5 · +12 000 utilisateurs
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S16-19: CTA
const CTAScene: React.FC<{ frame: number; phase: number }> = ({ frame, phase }) => {
  const pulse = 0.8 + Math.sin(frame * 0.1) * 0.2;
  const sc = sp(frame, 12, 160);

  // Particles
  const particles = Array.from({length:24},(_,i) => ({
    x:(i*141.7+i*i*2.7)%98,
    y:100-((frame*(0.35+i*0.025)+i*21)%108),
    op:0.2+Math.abs(Math.sin(frame*0.05+i))*0.5,
    sz:3+(i%4)*2,
    c:['#4F46E5','#06B6D4','#7C3AED'][i%3],
  }));

  if (phase === 3) {
    // Final CTA
    return (
      <AbsoluteFill style={{background:'linear-gradient(160deg,#0f0c29,#302b63)'}}>
        <AbsoluteFill style={{overflow:'hidden',pointerEvents:'none'}}>
          {particles.map((p,i) => (
            <div key={i} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,
              width:p.sz,height:p.sz,borderRadius:'50%',background:p.c,opacity:p.op,
              boxShadow:`0 0 8px ${p.c}`}}/>
          ))}
        </AbsoluteFill>
        <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',
          justifyContent:'center',padding:'0 44px'}}>
          <div style={{
            fontFamily:F,fontSize:26,fontWeight:900,color:'rgba(255,255,255,0.5)',
            letterSpacing:'0.15em',marginBottom:16,...slideUp(frame),
          }}>✦ ESSAIE GRATUITEMENT</div>
          <div style={{
            fontFamily:F,fontSize:60,fontWeight:900,letterSpacing:'0.03em',
            color:'#00FFCC',textAlign:'center',
            textShadow:`0 0 50px rgba(0,255,200,${pulse*0.7})`,
            transform:`scale(${interpolate(sc,[0,1],[0.5,1])})`,
            opacity:interpolate(sc,[0,1],[0,1]),
          }}>hirescan.online</div>
          <div style={{
            marginTop:36,
            background:`rgba(0,255,200,${pulse*0.15})`,
            border:`2px solid rgba(0,255,200,${pulse*0.7})`,
            borderRadius:100,padding:'18px 52px',
            boxShadow:`0 0 30px rgba(0,255,200,${pulse*0.4})`,
            ...slideUp(frame),
          }}>
            <span style={{fontFamily:F,fontSize:22,fontWeight:900,color:'#00FFCC',letterSpacing:'0.06em'}}>
              COMMENCER MAINTENANT →
            </span>
          </div>
          <div style={{fontFamily:F,fontSize:16,color:'rgba(255,255,255,0.5)',marginTop:20,...slideUp(frame)}}>
            Gratuit · Sans carte bancaire · Résultat en 30 secondes
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Phases 0-2: feature highlights on white
  const features = [
    { icon:'⚡', title:'30 secondes', sub:'Pour analyser ton CV complet', color:'#4F46E5' },
    { icon:'🎯', title:'Score précis', sub:'Comme un vrai recruteur ATS', color:'#06B6D4' },
    { icon:'🆓', title:'100% gratuit', sub:'Sans inscription requise', color:'#7C3AED' },
  ];
  const feat = features[Math.min(phase, 2)];

  return (
    <AbsoluteFill style={{background:'white'}}>
      <AbsoluteFill style={{display:'flex',flexDirection:'column',alignItems:'center',
        justifyContent:'center',padding:'0 50px'}}>
        <div style={{
          width:100,height:100,borderRadius:28,
          background:`linear-gradient(135deg,${feat.color},${feat.color}88)`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:48,boxShadow:`0 20px 50px ${feat.color}40`,
          transform:`scale(${interpolate(sc,[0,1],[0.2,1])})`,
          opacity:interpolate(sc,[0,1],[0,1]),
          marginBottom:24,
        }}>{feat.icon}</div>
        <div style={{fontFamily:F,fontSize:58,fontWeight:900,color:'#111827',textAlign:'center',
          lineHeight:1.1,...slideUp(frame)}}>
          {feat.title}
        </div>
        <div style={{fontFamily:F,fontSize:24,color:'#6B7280',textAlign:'center',
          marginTop:12,...slideUp(frame)}}>
          {feat.sub}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE MAP ────────────────────────────────────────────────────────────────
type SceneID =
  | {t:'hook'; sub:number}
  | {t:'stat'; sub:number}
  | {t:'villain'}
  | {t:'reveal'}
  | {t:'demo'; idx:number}
  | {t:'score'; after:boolean}
  | {t:'social'}
  | {t:'cta'; phase:number};

const SCENE_MAP: SceneID[] = [
  {t:'hook',sub:0}, {t:'hook',sub:1},              // 0-1
  {t:'stat',sub:0}, {t:'stat',sub:1},              // 2-3
  {t:'villain'}, {t:'villain'},                    // 4-5
  {t:'reveal'},                                    // 6
  {t:'demo',idx:0}, {t:'demo',idx:1},              // 7-8
  {t:'demo',idx:2}, {t:'demo',idx:3},              // 9-10
  {t:'demo',idx:4},                                // 11
  {t:'score',after:false}, {t:'score',after:true}, // 12-13
  {t:'social'}, {t:'social'},                      // 14-15
  {t:'cta',phase:0}, {t:'cta',phase:1},            // 16-17
  {t:'cta',phase:2}, {t:'cta',phase:3},            // 18-19
];

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const HireScanAdV3: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneIndex = Math.min(Math.floor(frame / SD), SCENE_MAP.length - 1);
  const lf = frame - sceneIndex * SD;
  const def = SCENE_MAP[sceneIndex];

  // Flash on entry for some scenes
  const doFlash = (sceneIndex === 6 || sceneIndex === 13) && lf < 8;
  const flashOp = doFlash ? interpolate(lf, [0, 8], [1, 0]) : 0;

  return (
    <AbsoluteFill style={{background:'white', fontFamily:F}}>
      {/* Beat music (background) */}
      <Audio src={staticFile('beat.mp3')} volume={0.22} />
      {/* Voice (foreground) */}
      <Audio src={staticFile('voice.mp3')} volume={1} />

      {/* Scene */}
      {def.t === 'hook'    && <HookScene    frame={lf} sub={def.sub}          />}
      {def.t === 'stat'    && <StatScene    frame={lf} sub={def.sub}          />}
      {def.t === 'villain' && <VillainScene frame={lf}                        />}
      {def.t === 'reveal'  && <RevealScene  frame={lf}                        />}
      {def.t === 'demo'    && <DemoScene    frame={lf} screenIndex={def.idx}  />}
      {def.t === 'score'   && <ScoreRevealScene frame={lf} isAfter={def.after}/>}
      {def.t === 'social'  && <SocialScene  frame={lf}                        />}
      {def.t === 'cta'     && <CTAScene     frame={lf} phase={def.phase}      />}

      {/* White flash transition */}
      {doFlash && (
        <AbsoluteFill style={{background:'white', opacity:flashOp, pointerEvents:'none'}}/>
      )}

      {/* Watermark */}
      <div style={{
        position:'absolute',top:48,left:0,right:0,
        display:'flex',justifyContent:'center',pointerEvents:'none',zIndex:100,
      }}>
        <span style={{
          fontFamily:F,fontSize:16,fontWeight:700,letterSpacing:'0.15em',
          color:'rgba(79,70,229,0.5)',textTransform:'uppercase',
        }}>HireScan · AI</span>
      </div>

      {/* Bottom safe zone */}
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,height:90,
        background:'linear-gradient(to top,rgba(0,0,0,0.15),transparent)',
        pointerEvents:'none',
      }}/>
    </AbsoluteFill>
  );
};
