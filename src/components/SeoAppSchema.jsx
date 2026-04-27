import React from 'react';
import { Helmet } from 'react-helmet';
import { APP_ORIGIN } from '@/lib/seo.js';

export function SeoAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TaxNomad',
    alternateName: '183 Day Rule Spain Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: APP_ORIGIN,
    offers: {
      '@type': 'Offer',
      price: '9.99',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: APP_ORIGIN,
    },
    provider: {
      '@type': 'Organization',
      name: 'TaxNomad',
      url: APP_ORIGIN,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hola@regla183.com',
        availableLanguage: ['English', 'Spanish'],
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
