import React, { useId } from 'react';

const palette = {
  light: {
    barShadow: '#1e3a8a',
    barShadowOpacity: 0.22,
    barStart: '#1d4ed8',
    barEnd: '#60a5fa',
    textFill: '#1d4ed8',
    textStroke: '#1e3a8a',
  },
  dark: {
    barShadow: '#0b1220',
    barShadowOpacity: 0.55,
    barStart: '#bfdbfe',
    barEnd: '#f1f5ff',
    textFill: '#ffffff',
    textStroke: '#1d4ed8',
  },
};

const BrandLogo = ({
  className = '',
  alt = 'Logo de TaxNomad 183',
  variant = 'light',
}) => {
  const uid = useId().replace(/:/g, '');
  const palKey = variant === 'dark' ? 'dark' : 'light';
  const pal = palette[palKey];
  const gradId = `tn-bar-${palKey}-${uid}`;

  return (
    <svg
      viewBox="0 0 240 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className={`block ${className}`.trim()}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradId} x1="30" y1="0" x2="210" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={pal.barStart} />
          <stop offset="100%" stopColor={pal.barEnd} />
        </linearGradient>
      </defs>

      {/* Top bar — 38 units above the visual centre (y=72) */}
      <path d="M30 34h160" stroke={pal.barShadow} strokeOpacity={pal.barShadowOpacity} strokeWidth="14" strokeLinecap="round" />
      <path d="M30 34h160" stroke={`url(#${gradId})`} strokeWidth="10" strokeLinecap="round" />

      {/* Bottom bar — 38 units below the visual centre (y=72) */}
      <path d="M30 110h160" stroke={pal.barShadow} strokeOpacity={pal.barShadowOpacity} strokeWidth="14" strokeLinecap="round" />
      <path d="M30 110h160" stroke={`url(#${gradId})`} strokeWidth="10" strokeLinecap="round" />

      {/* 183 — visually centred between the bars */}
      <text
        x="120"
        y="72"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="62"
        fontWeight="900"
        textAnchor="middle"
        dominantBaseline="central"
        fill={pal.textFill}
        stroke={pal.textStroke}
        strokeWidth="2.2"
        paintOrder="stroke fill"
      >
        183
      </text>

      {/* Checkmark — sits above and across the top bar on the right */}
      <path
        d="M162 24 l15 16 l29 -30"
        fill="none"
        stroke="#ca8a04"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M162 22 l15 16 l29 -30"
        fill="none"
        stroke="#facc15"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandLogo;
