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
    description: 'Terminos legales de uso de la Calculadora Nomada Fiscal 183 Dias para residencia fiscal en Espana y la UE.',
    updatedAt: 'Última actualización: 20 de abril de 2026',
    heading: 'Términos de Servicio',
    intro: 'Condiciones legales de uso del servicio TaxNomad. Léelas antes de realizar cualquier compra.',
    providerTitle: '1. Identificación del prestador del servicio',
    providerIntro: 'En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:',
    providerList: [
      ['Titular', 'Antonio Ballesteros Alonso'],
      ['NIF', '08997554T'],
      ['Domicilio', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)'],
      ['Email de contacto', 'hola@regla183.com'],
      ['Sitio web', 'regla183.com'],
    ],
    purposeTitle: '2. Propósito del servicio y limitación de responsabilidad',
    purposeBody: [
      'TaxNomad es una herramienta de utilidad técnica diseñada para ayudar a los usuarios a calcular sus días de presencia física en España con fines informativos.',
      'El informe generado no constituye asesoramiento legal o fiscal oficial ni reemplaza la consulta con un asesor fiscal, abogado o gestor colegiado.',
      'La exactitud del resultado depende exclusivamente de los datos introducidos por el usuario.',
    ],
    salesTitle: '3. Política de venta y derecho de desistimiento',
    salesBody: [
      'El Informe Premium tiene un coste de 9,99 € (IVA incluido) y se entrega en formato PDF de forma inmediata tras confirmarse el pago.',
      'De conformidad con el artículo 16.m) de la Directiva 2011/83/UE y el art. 103.m) del Real Decreto Legislativo 1/2007, el derecho de desistimiento no es aplicable a contenidos digitales suministrados en soporte no material una vez iniciada su ejecución con consentimiento expreso.',
    ],
    salesList: [
      'La ejecución ha comenzado con el consentimiento expreso del consumidor.',
      'El consumidor reconoce que perderá su derecho de desistimiento cuando el servicio se haya ejecutado completamente.',
    ],
    salesFooter: 'Si el PDF no pudiera descargarse por un error técnico imputable al servicio, el usuario podrá solicitar la regeneración del informe o el reembolso en hola@regla183.com en un plazo de 48 horas.',
    liabilityTitle: '4. Limitación de responsabilidad',
    liabilityLead: 'TaxNomad no será responsable de:',
    liabilityList: [
      'Decisiones fiscales o legales tomadas basándose en el informe generado.',
      'Errores derivados de datos incorrectos o incompletos introducidos por el usuario.',
      'Cambios normativos posteriores a la fecha de generación del informe.',
      'Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor.',
    ],
    liabilityFooter: 'En cualquier caso, la responsabilidad máxima de TaxNomad quedará limitada al importe abonado por el servicio contratado.',
    intellectualTitle: '5. Propiedad intelectual',
    intellectualBody: [
      'Todos los elementos del sitio web, incluidos diseño, código, textos, logotipos y la marca TaxNomad, son propiedad exclusiva del titular del servicio y están protegidos por la normativa aplicable.',
      'El informe PDF generado es de uso personal y exclusivo del usuario comprador. No puede ser revendido, redistribuido ni presentado como elaborado por un profesional fiscal colegiado.',
    ],
    lawTitle: '6. Legislación aplicable y resolución de disputas',
    lawBody: [
      'El presente contrato se rige por la legislación española. Para la resolución de controversias, ambas partes se someten a los juzgados y tribunales del domicilio del consumidor, conforme al artículo 90.2 del TRLGDCU.',
      'Los consumidores de la UE pueden acceder a la plataforma europea de resolución de litigios en línea (ODR) en ec.europa.eu/consumers/odr.',
    ],
    changesTitle: '7. Modificaciones de los términos',
    changesBody: 'TaxNomad se reserva el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios se publicarán en esta página con la fecha de actualización correspondiente.',
  },
  en: {
    title: 'Terms of Service · TaxNomad',
    description: 'Terms of use and legal conditions for the 183-Day Tax Nomad Calculator for Spain and EU tax residency.',
    updatedAt: 'Last updated: April 20, 2026',
    heading: 'Terms of Service',
    intro: 'Legal terms governing the use of the TaxNomad service. Please read them before purchasing.',
    providerTitle: '1. Service provider identification',
    providerIntro: 'In accordance with article 10 of Spain’s Law 34/2002 on Information Society Services and Electronic Commerce, the following information is provided:',
    providerList: [
      ['Owner', 'Antonio Ballesteros Alonso'],
      ['Tax ID', '08997554T'],
      ['Registered address', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain'],
      ['Contact email', 'hola@regla183.com'],
      ['Website', 'regla183.com'],
    ],
    purposeTitle: '2. Service purpose and liability limitation',
    purposeBody: [
      'TaxNomad is a technical utility designed to help users calculate days of physical presence in Spain for informational purposes.',
      'The generated report does not constitute official legal or tax advice and does not replace consultation with a qualified advisor.',
      'The accuracy of the result depends entirely on the data entered by the user.',
    ],
    salesTitle: '3. Sales policy and withdrawal rights',
    salesBody: [
      'The Premium Report costs €9.99 (VAT included) and is delivered immediately in PDF format once payment is confirmed.',
      'Under article 16(m) of Directive 2011/83/EU and article 103(m) of Spain’s Royal Legislative Decree 1/2007, the 14-day withdrawal right does not apply to digital content supplied on a non-tangible medium once performance has begun with the consumer’s express consent.',
    ],
    salesList: [
      'Performance has started with the consumer’s express consent.',
      'The consumer acknowledges losing the right of withdrawal once the service has been fully performed.',
    ],
    salesFooter: 'If the PDF cannot be downloaded due to a technical error attributable to the service, the user may request report regeneration or a refund at hola@regla183.com within 48 hours.',
    liabilityTitle: '4. Limitation of liability',
    liabilityLead: 'TaxNomad shall not be liable for:',
    liabilityList: [
      'Tax or legal decisions made based on the generated report.',
      'Errors derived from incomplete or incorrect user input.',
      'Regulatory changes introduced after the report generation date.',
      'Temporary service interruptions due to maintenance or force majeure.',
    ],
    liabilityFooter: 'In any event, TaxNomad’s maximum liability shall be limited to the amount paid for the contracted service.',
    intellectualTitle: '5. Intellectual property',
    intellectualBody: [
      'All website elements, including design, code, texts, logos and the TaxNomad brand, are the exclusive property of the service owner and are protected by applicable intellectual property laws.',
      'The generated PDF report is for the exclusive personal use of the purchasing user. It may not be resold, redistributed or presented as professional tax advice.',
    ],
    lawTitle: '6. Governing law and dispute resolution',
    lawBody: [
      'This agreement is governed by Spanish law. Any dispute shall be submitted to the courts of the consumer’s domicile in accordance with applicable consumer protection rules.',
      'EU consumers may access the European Online Dispute Resolution platform at ec.europa.eu/consumers/odr.',
    ],
    changesTitle: '7. Changes to these terms',
    changesBody: 'TaxNomad reserves the right to modify these Terms of Service at any time. Any change will be published on this page together with the updated revision date.',
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
        <link rel="canonical" href={getCanonicalUrl(language, '/terms')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/terms')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/terms')} />
        <link rel="alternate" hrefLang="x-default" href={`${getDefaultUrl()}terms`} />
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
              <p className="mb-3 leading-relaxed text-foreground/80">{content.lawBody[0]}</p>
              <p className="leading-relaxed text-foreground/80">
                {content.lawBody[1].split('ec.europa.eu/consumers/odr')[0]}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  ec.europa.eu/consumers/odr
                </a>
                {content.lawBody[1].split('ec.europa.eu/consumers/odr')[1]}
              </p>
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
