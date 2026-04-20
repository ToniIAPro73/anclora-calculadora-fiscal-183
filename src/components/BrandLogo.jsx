import React from 'react';

const BrandLogo = ({ className = '', alt = 'Logo de TaxNomad 183' }) => (
  <img
    src="/logo-calculadora-183-clean-512.png"
    alt={alt}
    className={`block object-contain ${className}`.trim()}
    loading="eager"
    decoding="async"
  />
);

export default BrandLogo;
