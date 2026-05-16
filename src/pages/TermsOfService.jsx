import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, CreditCard, AlertCircle, CheckCircle2, Globe, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';

const contentByLanguage = {
  es: {
    title: 'Términos de Servicio · TaxNomad',
    description: 'Condiciones de uso del servicio TaxNomad para el informe premium y la calculadora de la regla de 183 días en España.',
    updatedAt: 'Última actualización: 26 de abril de 2026',
    heading: 'Términos de Servicio',
    intro: 'Condiciones legales de uso del servicio TaxNomad. Regulan el acceso a la calculadora y la compra del informe premium.',
    providerTitle: '1. Descripción del servicio',
    providerIntro: 'TaxNomad es una herramienta digital diseñada para calcular días de presencia física en España con fines exclusivamente informativos.',
    providerList: [
      ['Naturaleza del informe', 'El informe generado no constituye asesoramiento legal, fiscal ni financiero.'],
      ['Alcance', 'No sustituye la consulta con un profesional cualificado.'],
      ['Referencia legal', 'La identificación completa del titular está disponible en el Aviso Legal.'],
    ],
    purposeTitle: '2. Responsabilidad del usuario',
    purposeBody: [
      'La precisión de los resultados depende enteramente de los datos introducidos por el usuario.',
      'El usuario es el único responsable de la exactitud, integridad y actualización de la información proporcionada.',
      'Cualquier decisión tomada a partir del informe generado corresponde exclusivamente al usuario.',
    ],
    salesTitle: '3. Compra y entrega',
    salesBody: [
      'El Informe Premium se ofrece como servicio de pago único.',
      'Precio: 9,99 € (IVA incluido).',
      'Entrega: inmediata tras la confirmación correcta del pago.',
    ],
    salesList: [
      'Al completar la compra, el usuario consiente expresamente la entrega inmediata del contenido digital.',
      'La descarga o regeneración del PDF forma parte de la ejecución del servicio contratado.',
    ],
    salesFooter: 'Si el PDF no pudiera descargarse por un error técnico imputable al servicio, el usuario podrá solicitar la regeneración del informe o una revisión del caso escribiendo a hola@regla183.com.',
    liabilityTitle: '4. Derecho de desistimiento',
    liabilityLead: 'En relación con el contenido digital suministrado de forma inmediata:',
    liabilityList: [
      'El derecho de desistimiento no resulta aplicable una vez entregado el contenido digital.',
      'Esta excepción se aplica siempre que el usuario haya prestado consentimiento previo para el inicio inmediato de la ejecución.',
      'El usuario reconoce que, con dicha entrega inmediata, pierde su derecho de desistimiento conforme a la normativa aplicable.',
    ],
    liabilityFooter: 'Esta política se aplica al informe premium como contenido digital suministrado de forma inmediata tras el pago.',
    intellectualTitle: '5. Limitación de responsabilidad',
    intellectualBody: [
      'TaxNomad no será responsable de decisiones tomadas por el usuario basándose en el informe generado.',
      'Tampoco responderá de errores derivados de información incorrecta o incompleta facilitada por el usuario, de cambios normativos posteriores a la generación del informe ni de interrupciones temporales del servicio.',
      'En cualquier caso, la responsabilidad máxima de TaxNomad quedará limitada al importe efectivamente abonado por el servicio.',
    ],
    lawTitle: '6. Propiedad intelectual',
    lawBody: [
      'Todos los contenidos, el diseño, el código y los elementos distintivos de TaxNomad son propiedad exclusiva del titular del servicio o se utilizan con la correspondiente autorización.',
      'El informe generado se entrega para uso exclusivamente personal y no puede ser revendido, redistribuido ni explotado comercialmente sin autorización expresa.',
    ],
    changesTitle: '7. Legislación aplicable',
    changesBody: 'Estos Términos se rigen por la legislación española.',
  },
  en: {
    title: 'Terms of Service · TaxNomad',
    description: 'Terms of use for TaxNomad and the premium report related to Spain’s 183-day tax residency rule.',
    updatedAt: 'Last updated: April 26, 2026',
    heading: 'Terms of Service',
    intro: 'Legal terms governing the use of TaxNomad. They apply to both the calculator and the one-time premium report purchase.',
    providerTitle: '1. Service description',
    providerIntro: 'TaxNomad is a digital tool designed to calculate days of physical presence in Spain for informational purposes only.',
    providerList: [
      ['Report nature', 'The generated report does not constitute legal, tax, or financial advice.'],
      ['Scope', 'It does not replace consultation with a qualified professional.'],
      ['Legal identification', 'Full owner details are available in the Legal Notice.'],
    ],
    purposeTitle: '2. User responsibility',
    purposeBody: [
      'The accuracy of the results depends entirely on the data entered by the user.',
      'The user is solely responsible for the correctness, completeness, and updating of the submitted information.',
      'Any decision made on the basis of the generated report remains the sole responsibility of the user.',
    ],
    salesTitle: '3. Purchase and delivery',
    salesBody: [
      'The Premium Report is offered as a one-time payment service.',
      'Price: €9.99 (VAT included).',
      'Delivery: immediate after successful payment.',
    ],
    salesList: [
      'By completing the purchase, the user expressly agrees to the immediate delivery of digital content.',
      'PDF delivery or regeneration forms part of the contracted service performance.',
    ],
    salesFooter: 'If the PDF cannot be downloaded due to a technical error attributable to the service, the user may request report regeneration or a case review by emailing hola@regla183.com.',
    liabilityTitle: '4. Withdrawal rights',
    liabilityLead: 'Regarding digital content supplied immediately after payment:',
    liabilityList: [
      'The right of withdrawal does not apply once the digital content has been delivered.',
      'This exception applies provided that the user has given prior consent for immediate performance to begin.',
      'The user acknowledges the loss of the withdrawal right once immediate digital delivery has started, as permitted by applicable law.',
    ],
    liabilityFooter: 'This rule applies to the premium report as digital content supplied immediately after payment.',
    intellectualTitle: '5. Limitation of liability',
    intellectualBody: [
      'TaxNomad shall not be liable for decisions made by the user based on the generated report.',
      'It shall also not be liable for errors resulting from incorrect or incomplete user input, regulatory changes after report generation, or temporary service interruptions.',
      'In all cases, TaxNomad’s maximum liability shall be limited to the amount paid for the service.',
    ],
    lawTitle: '6. Intellectual property',
    lawBody: [
      'All content, design, code, and distinctive elements of TaxNomad are the exclusive property of the service owner or are used with proper authorisation.',
      'The generated report is provided for personal use only and may not be resold, redistributed, or commercially exploited without prior written permission.',
    ],
    changesTitle: '7. Governing law',
    changesBody: 'These Terms are governed by Spanish law.',
  },
};

const TermsOfService = () => {
  const { language } = useLanguage();
  const content = contentByLanguage[language] || contentByLanguage.en;

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getCanonicalUrl(language, '/terms')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/terms')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/terms')} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es', '/terms')} />
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

          <div className="space-y-8 max-w-4xl">
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Scale className="w-24 h-24" />
              </div>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <Scale className="w-6 h-6 text-primary" /> {content.providerTitle}
              </h2>
              <p className="mb-3 leading-relaxed text-foreground/80">{content.providerIntro}</p>
              <ul className="space-y-1 border-l-2 border-primary/20 pl-4 text-sm text-foreground/80">
                {content.providerList.map(([label, value]) => (
                  <li key={label}><strong>{label}:</strong> {value}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <ShieldAlert className="w-6 h-6 text-primary" /> {content.purposeTitle}
              </h2>
              {content.purposeBody.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-foreground/80 first:mt-0">{paragraph}</p>
              ))}
            </section>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <section className="rounded-2xl border border-border bg-muted/10 p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
                  <CreditCard className="w-6 h-6 text-primary" /> {content.salesTitle}
                </h2>
                {content.salesBody.map((paragraph) => (
                  <p key={paragraph} className="mb-3 text-sm text-foreground/80">{paragraph}</p>
                ))}
                <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/80">
                  {content.salesList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <p className="mt-3 text-sm text-foreground/80">
                  {content.salesFooter.split('hola@regla183.com')[0]}
                  <a href="mailto:hola@regla183.com" className="underline text-primary">hola@regla183.com</a>
                  {content.salesFooter.split('hola@regla183.com')[1]}
                </p>
              </section>

              <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-destructive">
                  <AlertCircle className="w-6 h-6" /> {content.liabilityTitle}
                </h2>
                <p className="mb-3 text-sm italic text-foreground/80">{content.liabilityLead}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/80">
                  {content.liabilityList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-foreground/80">{content.liabilityFooter}</p>
              </section>
            </div>

            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">{content.intellectualTitle}</h2>
              {content.intellectualBody.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-foreground/80 first:mt-0">{paragraph}</p>
              ))}
            </section>

            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <Globe className="w-6 h-6 text-primary" /> {content.lawTitle}
              </h2>
              {content.lawBody.map((paragraph) => (
                <p key={paragraph} className="mb-3 last:mb-0 leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <CheckCircle2 className="w-6 h-6 text-primary" /> {content.changesTitle}
              </h2>
              <p className="leading-relaxed text-foreground/80">
                {content.changesBody}
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
