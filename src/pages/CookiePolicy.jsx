import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Cookie, ShieldCheck, SlidersHorizontal, Clock3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';
import {
  COOKIE_CONSENT_MAX_AGE_DAYS,
  COOKIE_CONSENT_UPDATED_EVENT,
  getCookieConsent,
  setCookieConsent,
} from '@/lib/cookieConsent';

const contentByLanguage = {
  es: {
    title: 'Política de Cookies · TaxNomad',
    description: 'Política de cookies de TaxNomad con detalle sobre tecnologías técnicas, consentimiento y servicios de terceros.',
    updatedAt: 'Última actualización: 26 de abril de 2026',
    heading: 'Política de Cookies',
    intro: 'Información clara sobre las tecnologías de almacenamiento local, cookies técnicas y cualquier futuro uso de medición opcional.',
    summaryTitle: 'Estado actual',
    summaryBody: 'TaxNomad utiliza Google Analytics 4 solo si aceptas cookies analíticas. Sin consentimiento, la app mantiene bloqueada la medición opcional y solo usa tecnologías necesarias para la experiencia básica y el flujo de pago.',
    tableTitle: 'Tecnologías utilizadas',
    tableColumns: ['Elemento', 'Finalidad', 'Tipo', 'Duración', 'Tercero'],
    rows: [
      ['`language` en localStorage', 'Guardar tu preferencia de idioma entre visitas.', 'Técnica / preferencia', 'Hasta que la cambies o limpies tu navegador.', 'No'],
      ['`theme` en localStorage', 'Recordar el modo visual claro u oscuro.', 'Técnica / preferencia', 'Hasta que la cambies o limpies tu navegador.', 'No'],
      ['`taxnomad_cookie_consent` en localStorage', 'Registrar tu elección sobre cookies opcionales.', 'Técnica / cumplimiento', `Hasta ${COOKIE_CONSENT_MAX_AGE_DAYS} días desde tu última elección.`, 'No'],
      ['Google Analytics 4 (`gtag.js`)', 'Medición agregada de visitas, navegación y rendimiento del sitio cuando aceptas analítica.', 'Analítica / opcional', 'Variable según Google Analytics.', 'Sí, Google'],
      ['Cookies de Stripe en checkout alojado', 'Seguridad, prevención de fraude y procesamiento del pago cuando accedes al checkout de Stripe.', 'Terceros / técnica', 'Variable según Stripe y el tipo de sesión.', 'Sí, Stripe'],
    ],
    sections: [
      {
        title: '1. ¿Qué son las cookies?',
        body: [
          'Las cookies y tecnologías similares son pequeños archivos o mecanismos de almacenamiento que un sitio web puede utilizar para recordar preferencias, mantener la seguridad o medir el uso del servicio.',
          'En TaxNomad también utilizamos almacenamiento local del navegador (`localStorage`) para guardar ajustes necesarios como idioma, tema y estado de consentimiento.',
        ],
      },
      {
        title: '2. Tipos de tecnologías',
        body: [
          'Las tecnologías técnicas o estrictamente necesarias permiten que la web funcione correctamente y no requieren consentimiento previo.',
          'Las tecnologías analíticas o publicitarias no se activan sin consentimiento explícito, libre e informado del usuario.',
        ],
      },
      {
        title: '3. Base legal',
        body: [
          'Las tecnologías no esenciales solo se utilizarán sobre la base de tu consentimiento explícito.',
          'Las tecnologías técnicas se usan al amparo de su necesidad para la prestación del servicio solicitado por el usuario.',
        ],
      },
      {
        title: '4. Gestión del consentimiento',
        body: [
          'Puedes aceptar o rechazar las tecnologías no esenciales desde el banner mostrado en la web.',
          'También puedes cambiar tu elección en cualquier momento desde esta página.',
        ],
      },
      {
        title: '5. Cambios en esta política',
        body: [
          'Podremos actualizar esta Política de Cookies para reflejar cambios legales, técnicos o de producto.',
          'Cuando ocurra, publicaremos la nueva versión con su fecha de actualización correspondiente.',
        ],
      },
    ],
    consentTitle: 'Gestionar tu elección',
    consentAccepted: 'Actualmente has aceptado las cookies opcionales.',
    consentRejected: 'Actualmente has rechazado las cookies opcionales.',
    consentMissing: 'Todavía no has elegido una preferencia de cookies opcionales.',
    accept: 'Aceptar cookies opcionales',
    reject: 'Rechazar cookies opcionales',
    providerNote: 'Para más información sobre cookies de terceros relacionadas con pagos, consulta la documentación y política de privacidad de Stripe.',
  },
  en: {
    title: 'Cookie Policy · TaxNomad',
    description: 'TaxNomad cookie policy describing technical storage, consent handling, and third-party payment technologies.',
    updatedAt: 'Last updated: April 26, 2026',
    heading: 'Cookie Policy',
    intro: 'Clear information about local storage technologies, technical cookies, and any future optional measurement usage.',
    summaryTitle: 'Current status',
    summaryBody: 'TaxNomad uses Google Analytics 4 only if you accept analytics cookies. Without consent, the app keeps optional measurement blocked and only uses technologies necessary for the core experience and payment flow.',
    tableTitle: 'Technologies in use',
    tableColumns: ['Item', 'Purpose', 'Type', 'Duration', 'Third party'],
    rows: [
      ['`language` in localStorage', 'Stores your language preference between visits.', 'Technical / preference', 'Until you change it or clear your browser.', 'No'],
      ['`theme` in localStorage', 'Remembers your light or dark visual mode.', 'Technical / preference', 'Until you change it or clear your browser.', 'No'],
      ['`taxnomad_cookie_consent` in localStorage', 'Records your choice for optional cookies.', 'Technical / compliance', `Up to ${COOKIE_CONSENT_MAX_AGE_DAYS} days from your latest choice.`, 'No'],
      ['Google Analytics 4 (`gtag.js`)', 'Aggregated measurement of visits, navigation, and site performance when you accept analytics.', 'Analytics / optional', 'Varies according to Google Analytics.', 'Yes, Google'],
      ['Stripe cookies on hosted checkout', 'Security, fraud prevention, and payment processing when you open Stripe Checkout.', 'Third-party / technical', 'Varies according to Stripe and session type.', 'Yes, Stripe'],
    ],
    sections: [
      {
        title: '1. What are cookies?',
        body: [
          'Cookies and similar technologies are small files or storage mechanisms that a website may use to remember preferences, maintain security, or measure service usage.',
          'At TaxNomad we also use browser local storage (`localStorage`) to keep necessary settings such as language, theme, and consent status.',
        ],
      },
      {
        title: '2. Types of technologies',
        body: [
          'Technical or strictly necessary technologies allow the website to function properly and do not require prior consent.',
          'Analytics or advertising technologies are never enabled without the user’s explicit, freely given, and informed consent.',
        ],
      },
      {
        title: '3. Legal basis',
        body: [
          'Non-essential technologies will only be used on the basis of your explicit consent.',
          'Technical technologies are used when necessary to provide the service requested by the user.',
        ],
      },
      {
        title: '4. Managing consent',
        body: [
          'You can accept or reject non-essential technologies from the banner shown on the website.',
          'You can also change your choice at any time from this page.',
        ],
      },
      {
        title: '5. Changes to this policy',
        body: [
          'We may update this Cookie Policy to reflect legal, technical, or product changes.',
          'When that happens, we will publish the new version together with its updated revision date.',
        ],
      },
    ],
    consentTitle: 'Manage your choice',
    consentAccepted: 'You have currently accepted optional cookies.',
    consentRejected: 'You have currently rejected optional cookies.',
    consentMissing: 'You have not selected an optional cookie preference yet.',
    accept: 'Accept optional cookies',
    reject: 'Reject optional cookies',
    providerNote: 'For more information about third-party payment-related cookies, please review Stripe’s documentation and privacy policy.',
  },
};

const CookiePolicy = () => {
  const { language } = useLanguage();
  const content = contentByLanguage[language] || contentByLanguage.en;
  const [consentStatus, setConsentStatus] = useState(() => getCookieConsent()?.status ?? null);

  useEffect(() => {
    const syncConsentState = () => {
      setConsentStatus(getCookieConsent()?.status ?? null);
    };

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsentState);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsentState);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={getCanonicalUrl(language, '/cookies')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/cookies')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/cookies')} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es', '/cookies')} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {content.updatedAt}
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {content.heading.split(' ')[0]} <span className="text-primary">{content.heading.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              {content.intro}
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-8">
              <section className="trust-panel p-6 sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                  <ShieldCheck className="w-6 h-6 text-primary" /> {content.summaryTitle}
                </h2>
                <p className="leading-7 text-foreground/80">{content.summaryBody}</p>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                  <SlidersHorizontal className="w-6 h-6 text-primary" /> {content.consentTitle}
                </h2>
                <p className="mb-5 text-sm leading-6 text-muted-foreground">
                  {consentStatus === 'accepted'
                    ? content.consentAccepted
                    : consentStatus === 'rejected'
                    ? content.consentRejected
                    : content.consentMissing}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="button" className="h-11 rounded-full px-5" onClick={() => setCookieConsent('accepted')}>
                    {content.accept}
                  </Button>
                  <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => setCookieConsent('rejected')}>
                    {content.reject}
                  </Button>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold">
                <Cookie className="w-6 h-6 text-primary" /> {content.tableTitle}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="grid grid-cols-1 md:grid-cols-5 bg-muted/35">
                  {content.tableColumns.map((column) => (
                    <div key={column} className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground md:border-b-0 md:border-r last:border-r-0">
                      {column}
                    </div>
                  ))}
                </div>
                {content.rows.map((row, rowIndex) => (
                  <div key={row[0]} className="grid grid-cols-1 md:grid-cols-5">
                    {row.map((cell, cellIndex) => (
                      <div
                        key={`${rowIndex}-${cellIndex}`}
                        className="border-b border-border px-4 py-4 text-sm leading-6 text-foreground/80 md:border-r last:border-r-0 last:border-b-0"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{content.providerNote}</p>
            </section>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {content.sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                  {index % 2 === 0 ? (
                    <Clock3 className="w-6 h-6 text-primary" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  )}
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-relaxed text-foreground/80 first:mt-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CookiePolicy;
