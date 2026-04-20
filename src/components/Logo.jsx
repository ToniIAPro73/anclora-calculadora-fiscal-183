import React from 'react';

const Logo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="TaxNomad logo"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="7" fill="url(#logoGrad)" />
    <rect x="5" y="7" width="22" height="2" rx="1" fill="white" fillOpacity="0.4" />
    <text
      x="16" y="21"
      fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      fontSize="10"
      fontWeight="900"
      fill="white"
      textAnchor="middle"
    >183</text>
    <rect x="5" y="23" width="22" height="2" rx="1" fill="white" fillOpacity="0.4" />
  </svg>
);

export default Logo;
