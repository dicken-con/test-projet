import React from 'react';

export type IconType = 'cross' | 'pill' | 'mouth' | 'inhaler' | 'syringe';

interface GlossyIconProps {
  type: IconType;
}

const contenuIcone = (type: IconType) => {
  switch (type) {
    case 'cross':
      return (
        <>
          <rect x="46" y="26" width="28" height="68" rx="8" fill="white" />
          <rect x="26" y="46" width="68" height="28" rx="8" fill="white" />
        </>
      );
    case 'pill':
      return (
        <g transform="rotate(-35 60 60)">
          <path d="M30 60 a20 20 0 0 1 20 -20 h20 v40 h-20 a20 20 0 0 1 -20 -20 Z" fill="white" />
          <path d="M70 40 h10 a20 20 0 0 1 0 40 h-10 Z" fill="#dcfce7" />
          <line x1="60" y1="40" x2="60" y2="80" stroke="#16a34a" strokeWidth="1.5" opacity="0.4" />
        </g>
      );
    case 'mouth':
      return (
        <>
          <ellipse cx="60" cy="66" rx="26" ry="14" fill="white" />
          <path d="M36 62 Q60 82 84 62" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="60" cy="38" rx="9" ry="13" fill="#dcfce7" />
          <ellipse cx="60" cy="38" rx="9" ry="13" fill="none" stroke="white" strokeWidth="2" />
        </>
      );
    case 'inhaler':
      return (
        <>
          <rect x="42" y="20" width="36" height="52" rx="10" fill="white" />
          <rect x="34" y="66" width="52" height="24" rx="7" fill="#dcfce7" />
          <rect x="54" y="10" width="12" height="16" rx="4" fill="white" opacity="0.85" />
        </>
      );
    case 'syringe':
      return (
        <g transform="rotate(-20 60 60)">
          <rect x="22" y="50" width="58" height="20" rx="3" fill="white" />
          <rect x="28" y="45" width="16" height="30" fill="#dcfce7" />
          <line x1="80" y1="60" x2="102" y2="60" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="16" y1="60" x2="4" y2="60" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
  }
};

const GlossyIcon: React.FC<GlossyIconProps> = ({ type }) => {
  const gradientId = `bgGrad-${type}`;
  const glossId = `glossGrad-${type}`;
  const shadowId = `dropShadow-${type}`;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id={glossId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="45%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#166534" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Coque de l'icône, façon app iOS */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill={`url(#${gradientId})`} filter={`url(#${shadowId})`} />

      {/* Contenu spécifique (croix, pilule, bouche, inhalateur, seringue) */}
      {contenuIcone(type)}

      {/* Reflet glossy en haut */}
      <rect x="4" y="4" width="112" height="60" rx="28" fill={`url(#${glossId})`} />

      {/* Fin liseré de contour pour la profondeur */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />

      {/* Sweep lumineux animé, effet "sheen" premium */}
      <g clipPath={`inset(0 round 28px)`}>
        <rect className="icon-sheen" x="0" y="4" width="20" height="112" fill="white" opacity="0.18" />
      </g>
    </svg>
  );
};

export default GlossyIcon;