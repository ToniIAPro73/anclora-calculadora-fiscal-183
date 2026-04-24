import React from 'react';
import logoSource from '@/assets/logo.png';

const BrandLogo = ({
  className = '',
  alt = 'Logo de TaxNomad 183',
}) => {
  return (
    <img
      src={logoSource}
      alt={alt}
      className={`block object-contain ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
