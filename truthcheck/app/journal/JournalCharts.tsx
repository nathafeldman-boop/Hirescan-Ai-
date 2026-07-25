'use client';

import { moodColor } from '@/lib/journalScales';

interface RadarPoint { key: string; label: string; emoji: string; value: number }

// Radar émotionnel — fréquence des tags (0-1), un axe par tag connu. SVG pur,
// aucune dépendance : un polygone tracé à partir de coordonnées polaires.
export function EmotionRadar({ points }: { points: RadarPoint[] }) {
  const size = 220;
  const center = size / 2;
  const radius = size / 2 - 34;
  const n = points.length;

  const coords = (value: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = radius * value;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const polygon = points.map((p, i) => coords(Math.max(0.06, p.value), i)).map((c) => `${c.x},${c.y}`).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size} role="img" aria-label="Radar émotionnel">
      {rings.map((r) => (
        <polygon
          key={r}
          points={points.map((_, i) => { const c = coords(r, i); return `${c.x},${c.y}`; }).join(' ')}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
        />
      ))}
      {points.map((_, i) => {
        const c = coords(1, i);
        return <line key={i} x1={center} y1={center} x2={c.x} y2={c.y} stroke="var(--line)" strokeWidth={1} />;
      })}
      <polygon
        points={polygon}
        fill="var(--gold)"
        fillOpacity={0.25}
        stroke="var(--gold)"
        strokeWidth={2}
        style={{ transition: 'all .6s cubic-bezier(.34,1.56,.64,1)' }}
      />
      {points.map((p, i) => {
        const c = coords(1.16, i);
        return (
          <text key={p.key} x={c.x} y={c.y} textAnchor="middle" dominantBaseline="middle" fontSize={13}>
            {p.emoji}
          </text>
        );
      })}
    </svg>
  );
}

interface HeatmapEntry { day: string; mood: number }

// Heatmap façon GitHub — 12 dernières semaines, coloré par humeur. today est
// "YYYY-MM-DD" (fuseau Paris, passé par le parent — pas de new Date() ici).
export function MoodHeatmap({ entries, today }: { entries: HeatmapEntry[]; today: string }) {
  const byDay = new Map(entries.map((e) => [e.day, e.mood]));
  const end = new Date(today + 'T12:00:00');
  // Recule jusqu'au lundi de la semaine courante, puis encore 11 semaines —
  // 12 colonnes de 7 jours, aligné comme le calendrier (lundi en haut).
  const endDow = (end.getDay() + 6) % 7;
  const start = new Date(end);
  start.setDate(start.getDate() - endDow - 11 * 7);

  const weeks: { day: string; mood: number | null }[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 12; w++) {
    const week: { day: string; mood: number | null }[] = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().slice(0, 10);
      week.push({ day: key, mood: byDay.get(key) ?? null });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((cell, di) => (
            <div
              key={cell.day}
              title={cell.day}
              className="w-3 h-3 rounded-sm"
              style={{
                background: cell.mood ? moodColor(cell.mood) : 'var(--line)',
                opacity: cell.mood ? 0.4 + cell.mood * 0.12 : 0.5,
                animation: `heatFadeIn .4s ease ${(wi * 7 + di) * 0.006}s backwards`,
              }}
            />
          ))}
        </div>
      ))}
      <style>{`@keyframes heatFadeIn { from { opacity:0; transform:scale(.5) } }`}</style>
    </div>
  );
}
