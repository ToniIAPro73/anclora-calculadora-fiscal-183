import React from 'react';
import { Helmet } from 'react-helmet';
import { APP_ORIGIN } from '@/lib/seo.js';

export function SeoAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calculadora Nomada Fiscal 183 Dias',
    alternateName: '183-Day Tax Nomad Calculator',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1250',
    },
    publisher: {
      '@type': 'Person',
      name: 'Antonio Ballesteros Alonso',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Palma de Mallorca',
        addressCountry: 'ES',
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
