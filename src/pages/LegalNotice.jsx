import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileBadge2, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';

const contentByLanguage = {
  es: {
    title: 'Aviso Legal · TaxNomad',
    description: 'Aviso legal de TaxNomad con la información identificativa del titular conforme a la LSSICE.',
    updatedAt: 'Última actualización: 26 de abril de 2026',
    heading: 'Aviso Legal',
    intro: 'Información legal e identificativa del titular del sitio web, accesible de forma clara y permanente conforme a la normativa española aplicable.',
    compliance: 'En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), se informa de los siguientes datos:',
    details: [
      ['Titular', 'Antonio Ballesteros Alonso'],
      ['NIF', '08997554T'],
      ['Domicilio', 'Carrer Miquel Rosselló i Alemany 48, 07015 Palma de Mallorca (Islas Baleares), España'],
      ['Email', 'hola@regla183.com'],
      ['Sitio web', 'regla183.com'],
    ],
    useTitle: 'Alcance del sitio',
    useBody: 'TaxNomad ofrece una calculadora informativa de la regla de los 183 días y un informe premium en formato digital. El uso del sitio implica la aceptación de las condiciones publicadas en las páginas legales correspondientes.',
    contactTitle: 'Contacto',
    contactAddress: 'Carrer Miquel Rosselló i Alemany 48, 07015 Palma de Mallorca (Islas Baleares), España',
  },
  en: {
    title: 'Legal Notice · TaxNomad',
    description: 'Legal Notice for TaxNomad with the owner identification details required under Spanish law.',
    updatedAt: 'Last updated: April 26, 2026',
    heading: 'Legal Notice',
    intro: 'Legal and identifying information about the website owner, made permanently accessible in accordance with applicable Spanish law.',
    compliance: 'In accordance with Spain’s Law 34/2002 on Information Society Services and Electronic Commerce, the following information is provided:',
    details: [
      ['Owner', 'Antonio Ballesteros Alonso'],
      ['Tax ID (NIF)', '08997554T'],
      ['Address', 'Carrer Miquel Rosselló i Alemany 48, 07015 Palma de Mallorca (Balearic Islands), Spain'],
      ['Email', 'hola@regla183.com'],
      ['Website', 'regla183.com'],
    ],
    useTitle: 'Website scope',
    useBody: 'TaxNomad provides an informational 183-day rule calculator and a premium digital report. Use of the website implies acceptance of the conditions published in the corresponding legal pages.',
    contactTitle: 'Contact',
    contactAddress: 'Carrer Miquel Rossello i Alemany 48, 07015 Palma de Mallorca (Balearic Islands), Spain',
  },
};

const LegalNotice = () => {
  const { language } = useLanguage();
  const content = contentByLanguage[language] || contentByLanguage.en;

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getCanonicalUrl(language, '/legal-notice')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/legal-notice')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/legal-notice')} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es', '/legal-notice')} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {content.updatedAt}
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {content.heading.split(' ')[0]} <span className="text-primary">{content.heading.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {content.intro}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <ShieldCheck className="w-6 h-6 text-primary" /> {content.heading}
              </h2>
              <p className="mb-6 leading-relaxed text-foreground/80">{content.compliance}</p>
              <ul className="space-y-4 text-sm text-foreground/80">
                {content.details.map(([label, value]) => (
                  <li key={label} className="rounded-xl border border-border/70 bg-muted/15 px-4 py-4">
                    <strong className="block text-foreground">{label}</strong>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-8">
              <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
                  <FileBadge2 className="w-5 h-5 text-primary" /> {content.useTitle}
                </h2>
                <p className="leading-relaxed text-foreground/80">{content.useBody}</p>
              </section>

              <section className="rounded-2xl border border-border bg-muted/10 p-8">
                <h2 className="mb-4 text-xl font-bold">{content.contactTitle}</h2>
                <div className="space-y-3 text-sm text-foreground/80">
                  <p className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href="mailto:hola@regla183.com" className="underline text-primary">hola@regla183.com</a>
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <span>{content.contactAddress}</span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LegalNotice;
