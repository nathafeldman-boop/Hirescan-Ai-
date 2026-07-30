'use client';
import React from 'react';

interface Props {
  slug: string;
  size?: number;
  color?: string;
  className?: string;
}

function IconInfidelite({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <polyline points="11 9 9 13 13 13 11 17" />
    </svg>
  );
}

function IconAdopte({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M4 20v-1a5 5 0 0 1 10 0v1" />
      <circle cx="18" cy="8" r="1.5" opacity="0.6" />
      <path d="M16 19.5c0-1.93 1.12-3.5 2-3.5s2 1.57 2 3.5" opacity="0.6" />
      <line x1="12" y1="12" x2="16" y2="13" strokeDasharray="1.5 1.5" opacity="0.4" />
    </svg>
  );
}

function IconAmoureux({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth="1.6"
        fill={color}
        fillOpacity="0.15"
      />
      <path
        d="M10.5 9.5c0-1 1.5-1.5 1.5 0 0 1.5-1.5 1.5-1.5 3"
        stroke={color}
        strokeWidth="1.4"
        opacity="0.8"
        fill="none"
      />
      <circle cx="10.5" cy="14.5" r="0.6" fill={color} stroke="none" />
    </svg>
  );
}

function IconVraisAmis({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="7" r="3" />
      <path d="M3 20v-1a5.5 5.5 0 0 1 11 0v1" />
      <circle cx="15.5" cy="7" r="3" strokeOpacity="0.45" strokeDasharray="2 1.5" />
      <path d="M10.5 20v-1a5.5 5.5 0 0 1 11 0v1" strokeOpacity="0.45" strokeDasharray="2 1.5" />
    </svg>
  );
}

function IconOrientation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17C4 11.48 7.58 7 12 7s8 4.48 8 10" stroke={color} strokeOpacity="0.3" strokeWidth="2" />
      <path d="M6.5 17C6.5 12.75 9 9.5 12 9.5s5.5 3.25 5.5 7.5" stroke={color} strokeOpacity="0.6" strokeWidth="1.8" />
      <path d="M9 17c0-2.76 1.34-5 3-5s3 2.24 3 5" stroke={color} strokeOpacity="1" strokeWidth="1.6" />
      <circle cx="12" cy="19.5" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}

function IconNarcissique({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="13" rx="2" />
      <line x1="12" y1="15" x2="12" y2="19" />
      <path d="M9 21h6" />
      <path d="M9 9.5c1-1.5 4-1.5 5 0" strokeOpacity="0.5" />
      <circle cx="10.5" cy="7" r="1" fill={color} fillOpacity="0.4" stroke="none" />
      <circle cx="13.5" cy="7" r="1" fill={color} fillOpacity="0.4" stroke="none" />
    </svg>
  );
}

function IconMonEx({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path
        d="M12 12c0 0-3-2.5-3-4.5a2 2 0 0 1 3-1.7A2 2 0 0 1 15 7.5c0 2-3 4.5-3 4.5z"
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function IconManipule({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="3.5" r="1.5" />
      <line x1="12" y1="5" x2="12" y2="8" />
      <line x1="12" y1="8" x2="7" y2="12" />
      <line x1="12" y1="8" x2="17" y2="12" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <circle cx="7" cy="14" r="2" strokeOpacity="0.7" />
      <circle cx="17" cy="14" r="2" strokeOpacity="0.7" />
      <circle cx="12" cy="16" r="2" strokeOpacity="0.5" />
    </svg>
  );
}

function IconRompre({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
      <line
        x1="12"
        y1="5.5"
        x2="12"
        y2="21.5"
        stroke="#09090b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconJaloux({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3.5" />
      <line x1="12" y1="8.5" x2="12" y2="15.5" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

function IconRelationToxique({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconCrush({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
      <path
        d="M12 9c0 0-1.5-1.5-1.5-2.5a1.5 1.5 0 0 1 3 0C13.5 7.5 12 9 12 9z"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

function IconBurnout({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="18" height="10" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M23 11v2" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="2" y="8.5" width="3" height="7" rx="0.5" fill={color} fillOpacity="0.4" />
      <line x1="8" y1="10" x2="8" y2="14" stroke={color} strokeWidth="1.6" strokeOpacity="0.2" />
      <line x1="12" y1="10" x2="12" y2="14" stroke={color} strokeWidth="1.6" strokeOpacity="0.2" />
      <line x1="16" y1="10" x2="16" y2="14" stroke={color} strokeWidth="1.6" strokeOpacity="0.2" />
    </svg>
  );
}

function IconDepression({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <line x1="9" y1="21" x2="9" y2="23" strokeOpacity="0.7" />
      <line x1="12" y1="22" x2="12" y2="24" strokeOpacity="0.5" />
      <line x1="15" y1="21" x2="15" y2="23" strokeOpacity="0.35" />
    </svg>
  );
}

function IconVraiAmour({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth="1.6"
        fill={color}
        fillOpacity="0.2"
      />
      <line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="1.6" strokeOpacity="0.5" />
      <line x1="18.4" y1="3.6" x2="17" y2="5" stroke={color} strokeWidth="1.6" strokeOpacity="0.5" />
      <line x1="5.6" y1="3.6" x2="7" y2="5" stroke={color} strokeWidth="1.6" strokeOpacity="0.5" />
    </svg>
  );
}

function IconDefault({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" strokeWidth="2" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<{ color: string }>> = {
  amoureux: IconAmoureux,
  'vrais-amis': IconVraisAmis,
  narcissique: IconNarcissique,
  manipule: IconManipule,
  rompre: IconRompre,
  jaloux: IconJaloux,
  'relation-toxique': IconRelationToxique,
  burnout: IconBurnout,
  depression: IconDepression,
  'vrai-amour': IconVraiAmour,
};

export default function QuizIcon({ slug, size = 32, color = '#c2611f', className = '' }: Props) {
  const IconComponent = ICON_MAP[slug] ?? IconDefault;
  const padding = Math.round(size * 0.22);
  const iconSize = size - padding * 2;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '28%',
        background: `linear-gradient(135deg, ${color}22, ${color}0d)`,
        border: `1px solid ${color}35`,
        boxShadow: `0 0 16px ${color}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
        flexShrink: 0,
      }}
    >
      <div style={{ width: iconSize, height: iconSize }}>
        <IconComponent color={color} />
      </div>
    </div>
  );
}
