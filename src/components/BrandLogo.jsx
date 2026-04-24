import React from 'react';
import logoSource from '@/assets/logo-header.webp';

const BrandLogo = ({
  className = '',
  alt = 'Logo de TaxNomad 183',
}) => {
  return (
    <img
      src={logoSource}
      alt={alt}
      className={`block object-contain ${className}`.trim()}
      width="256"
      height="256"
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
