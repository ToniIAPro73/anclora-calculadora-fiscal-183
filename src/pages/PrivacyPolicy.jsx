import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Lock, Mail, FileText, UserCheck, Trash2, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';

const contentByLanguage = {
  es: {
    title: 'Política de Privacidad · TaxNomad',
    description: 'Política de privacidad de TaxNomad para la calculadora de la regla de 183 días y el informe premium.',
    updatedAt: 'Última actualización: 26 de abril de 2026',
    heading: 'Política de Privacidad',
    intro: 'Transparencia total sobre el tratamiento de tus datos personales.',
    quickSummaryTitle: 'Resumen rápido',
    quickSummary: [
      {
        icon: Lock,
        title: 'Pagos seguros',
        description: 'Procesados 100% por Stripe. No accedemos a tus datos bancarios.',
      },
      {
        icon: Eye,
        title: 'Datos mínimos',
        description: 'Solo tratamos la información necesaria para generar y entregar tu informe.',
      },
      {
        icon: Trash2,
        title: 'Retención limitada',
        description: 'No conservamos de forma permanente los datos del informe por nuestra parte.',
      },
      {
        icon: UserCheck,
        title: 'Tus derechos',
        description: 'Acceso, rectificación y supresión disponibles en todo momento.',
      },
      {
        icon: Mail,
        title: 'Contacto privacidad',
        description: 'hola@regla183.com',
        mailto: true,
      },
    ],
    sections: [
      {
        title: '1. Responsable del Tratamiento',
        body: [
          'En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), el responsable del tratamiento es TaxNomad.',
          'El servicio es operado por Antonio Ballesteros Alonso.',
          'Para cualquier cuestión relacionada con privacidad o protección de datos puedes escribir a hola@regla183.com.',
        ],
        list: [
          ['Servicio', 'TaxNomad'],
          ['Contacto', 'hola@regla183.com'],
          ['Referencia legal', 'La identificación completa del titular figura en el Aviso Legal.'],
        ],
      },
      {
        title: '2. Datos que tratamos',
        blocks: [
          {
            title: '2.1 Rangos de fechas introducidos por el usuario',
            body: 'Los rangos de fechas se utilizan para calcular los días de presencia física en España. Durante el flujo estándar de la calculadora se procesan localmente en el navegador.',
          },
          {
            title: '2.2 Datos del informe PDF',
            body: 'Si el usuario decide adquirir el informe premium, tratamos nombre completo, email e identificación (pasaporte o NIE) para generar y entregar el PDF personalizado.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
          },
          {
            title: '2.3 Datos de pago',
            body: 'Los pagos son procesados íntegramente por Stripe, Inc. No almacenamos ni accedemos a datos de tarjetas bancarias.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
            link: { href: 'https://stripe.com/es/privacy', label: 'stripe.com/es/privacy' },
          },
          {
            title: '2.4 Finalidades del tratamiento',
            body: 'Tratamos los datos exclusivamente para prestar el servicio, generar el informe contratado y gestionar el pago asociado.',
            note: 'No vendemos datos ni los compartimos con terceros para fines propios de marketing.',
          },
          {
            title: '2.5 Analítica opcional',
            body: 'Si aceptas cookies analíticas, Google Analytics 4 puede recopilar datos agregados de uso y navegación para ayudarnos a mejorar el servicio.',
            note: 'Base jurídica: Art. 6.1.a RGPD — consentimiento del interesado.',
            link: { href: 'https://policies.google.com/technologies/partner-sites', label: 'policies.google.com/technologies/partner-sites' },
          },
        ],
      },
      {
        title: '3. Plazo de conservación',
        body: [
          'Los datos del informe no se almacenan de forma permanente por nuestra parte. Se utilizan para la generación y entrega del PDF y, fuera de ese proceso, no se conservan de forma persistente.',
          'Los datos de transacción pueden ser conservados por Stripe conforme a sus obligaciones legales y políticas de retención.',
        ],
      },
      {
        title: '4. Transferencias internacionales',
        body: [
          'Los datos de pago son gestionados por Stripe, Inc. y pueden implicar transferencias internacionales bajo las garantías adecuadas aplicables en cada momento.',
          'No realizamos ninguna otra transferencia internacional de datos personales.',
        ],
      },
      {
        title: '5. Tus derechos (Arts. 15-22 RGPD)',
        body: ['Puedes ejercer en cualquier momento los siguientes derechos:'],
        bulletList: [
          ['Acceso (Art. 15)', 'Solicitar información sobre qué datos tuyos tratamos.'],
          ['Rectificación (Art. 16)', 'Corregir datos inexactos o incompletos.'],
          ['Supresión (Art. 17)', 'Solicitar la eliminación de tus datos.'],
          ['Limitación (Art. 18)', 'Pedir que restrinjamos el tratamiento de tus datos.'],
          ['Portabilidad (Art. 20)', 'Recibir tus datos en formato estructurado y legible.'],
          ['Oposición (Art. 21)', 'Oponerte al tratamiento basado en interés legítimo.'],
        ],
        footer: [
          'Para ejercer tus derechos, escríbenos a hola@regla183.com indicando el derecho que deseas ejercer y una prueba de identidad.',
          'También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD): www.aepd.es.',
        ],
      },
      {
        title: '6. Tecnologías locales del navegador',
        body: ['Actualmente utilizamos únicamente mecanismos locales necesarios para la experiencia básica del servicio:'],
        plainList: [
          'localStorage para guardar la preferencia de idioma y tema visual.',
          'localStorage para registrar tu preferencia de consentimiento de cookies opcionales.',
          'Google Analytics 4 solo se activa si aceptas cookies analíticas.',
        ],
      },
    ],
    commitmentTitle: 'Compromiso de privacidad',
    commitment: 'No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales propios. Tu informe PDF es de tu exclusiva propiedad.',
  },
  en: {
    title: 'Privacy Policy · TaxNomad',
    description: 'Privacy policy for TaxNomad’s 183-day rule calculator and premium report service.',
    updatedAt: 'Last updated: April 26, 2026',
    heading: 'Privacy Policy',
    intro: 'Full transparency about how your personal data is processed.',
    quickSummaryTitle: 'Quick summary',
    quickSummary: [
      {
        icon: Lock,
        title: 'Secure payments',
        description: 'Handled 100% by Stripe. We do not access your banking details.',
      },
      {
        icon: Eye,
        title: 'Minimal data',
        description: 'We only process the information needed to generate and deliver your report.',
      },
      {
        icon: Trash2,
        title: 'Limited retention',
        description: 'We do not permanently retain report data on our side.',
      },
      {
        icon: UserCheck,
        title: 'Your rights',
        description: 'Access, rectification and erasure rights are available at any time.',
      },
      {
        icon: Mail,
        title: 'Privacy contact',
        description: 'hola@regla183.com',
        mailto: true,
      },
    ],
    sections: [
      {
        title: '1. Data controller',
        body: [
          'In accordance with Regulation (EU) 2016/679 (GDPR), the data controller is TaxNomad.',
          'The service is operated by Antonio Ballesteros Alonso.',
          'For any privacy or data protection matter, you can contact hola@regla183.com.',
        ],
        list: [
          ['Service', 'TaxNomad'],
          ['Contact', 'hola@regla183.com'],
          ['Legal reference', 'Full owner details are available in the Legal Notice.'],
        ],
      },
      {
        title: '2. Data we process',
        blocks: [
          {
            title: '2.1 User-entered date ranges',
            body: 'Date ranges are used to calculate days of physical presence in Spain. During the standard calculator flow, they are processed locally in the browser.',
          },
          {
            title: '2.2 PDF report data',
            body: 'If the user purchases the premium report, we process full name, email, and identification details (passport or NIE) to generate and deliver the personalised PDF.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
          },
          {
            title: '2.3 Payment data',
            body: 'Payments are processed entirely by Stripe, Inc. We do not store or access your card data.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
            link: { href: 'https://stripe.com/privacy', label: 'stripe.com/privacy' },
          },
          {
            title: '2.4 Processing purposes',
            body: 'We process data solely to deliver the service, generate the purchased report, and manage the related payment flow.',
            note: 'We do not sell data or share it with third parties for our own marketing purposes.',
          },
          {
            title: '2.5 Optional analytics',
            body: 'If you accept analytics cookies, Google Analytics 4 may collect aggregated usage and navigation data to help us improve the service.',
            note: 'Legal basis: Article 6(1)(a) GDPR — consent.',
            link: { href: 'https://policies.google.com/technologies/partner-sites', label: 'policies.google.com/technologies/partner-sites' },
          },
        ],
      },
      {
        title: '3. Retention period',
        body: [
          'Report data is not permanently stored by us. It is used for PDF generation and delivery and is not retained persistently beyond that process.',
          'Transaction data may be retained by Stripe according to its legal obligations and retention policies.',
        ],
      },
      {
        title: '4. International transfers',
        body: [
          'Payment data is handled by Stripe, Inc. and may involve international transfers under the safeguards applicable at the relevant time.',
          'We do not perform any other international transfers of personal data.',
        ],
      },
      {
        title: '5. Your rights (Articles 15-22 GDPR)',
        body: ['You may exercise the following rights at any time:'],
        bulletList: [
          ['Access (Art. 15)', 'Request information about what personal data we process about you.'],
          ['Rectification (Art. 16)', 'Correct inaccurate or incomplete data.'],
          ['Erasure (Art. 17)', 'Request deletion of your personal data.'],
          ['Restriction (Art. 18)', 'Request restricted processing of your data.'],
          ['Portability (Art. 20)', 'Receive your data in a structured, machine-readable format.'],
          ['Objection (Art. 21)', 'Object to processing based on legitimate interest.'],
        ],
        footer: [
          'To exercise any of these rights, email hola@regla183.com and specify the request together with proof of identity.',
          'You may also file a complaint with the Spanish Data Protection Agency (AEPD): www.aepd.es.',
        ],
      },
      {
        title: '6. Local browser technologies',
        body: ['At present, we only rely on local mechanisms necessary for the basic service experience:'],
        plainList: [
          'localStorage to remember language and theme preferences.',
          'localStorage to record your optional cookie consent preference.',
          'Google Analytics 4 is only enabled if you accept analytics cookies.',
        ],
      },
    ],
    commitmentTitle: 'Privacy commitment',
    commitment: 'We do not sell, rent or share your personal information with third parties for our own commercial purposes. Your PDF report remains exclusively yours.',
  },
};

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const content = contentByLanguage[language] || contentByLanguage.en;

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={getCanonicalUrl(language, '/privacy')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/privacy')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/privacy')} />
        <link rel="alternate" hrefLang="x-default" href={`${getDefaultUrl()}privacy`} />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {content.updatedAt}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {content.heading.split(' ')[0]} <span className="text-primary">{content.heading.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-muted-foreground text-lg italic">
              {content.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 sticky top-24">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> {content.quickSummaryTitle}
                </h3>
                <ul className="space-y-4 text-sm">
                  {content.quickSummary.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          <strong>{item.title}:</strong>{' '}
                          {item.mailto ? (
                            <a href={`mailto:${item.description}`} className="underline">{item.description}</a>
                          ) : item.description}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10 text-foreground/80 leading-relaxed">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>

                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="mb-3">{paragraph}</p>
                  ))}

                  {section.list && (
                    <ul className="mt-3 space-y-1 text-sm list-none pl-4 border-l-2 border-primary/20">
                      {section.list.map(([label, value]) => (
                        <li key={label}><strong>{label}:</strong> {value}</li>
                      ))}
                    </ul>
                  )}

                  {section.blocks?.map((block) => (
                    <div key={block.title} className="mt-4 text-sm">
                      <strong className="block mb-1">{block.title}</strong>
                      <p>{block.body}</p>
                      {block.link && (
                        <p className="mt-2">
                          <a href={block.link.href} className="underline text-primary" target="_blank" rel="noopener noreferrer">
                            {block.link.label}
                          </a>
                        </p>
                      )}
                      {block.note && <p className="mt-2"><strong>{block.note}</strong></p>}
                    </div>
                  ))}

                  {section.bulletList && (
                    <ul className="space-y-2 text-sm mt-3">
                      {section.bulletList.map(([title, description]) => (
                        <li key={title} className="flex gap-3">
                          <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span><strong>{title}:</strong> {description}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.plainList && (
                    <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                      {section.plainList.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.footer?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-sm">
                      {paragraph.includes('hola@regla183.com') ? (
                        <>
                          {paragraph.split('hola@regla183.com')[0]}
                          <a href="mailto:hola@regla183.com" className="underline text-primary">hola@regla183.com</a>
                          {paragraph.split('hola@regla183.com')[1]}
                        </>
                      ) : paragraph.includes('www.aepd.es') ? (
                        <>
                          {paragraph.split('www.aepd.es')[0]}
                          <a href="https://www.aepd.es" className="underline text-primary" target="_blank" rel="noopener noreferrer">www.aepd.es</a>
                          {paragraph.split('www.aepd.es')[1]}
                        </>
                      ) : paragraph}
                    </p>
                  ))}
                </section>
              ))}

              <section className="p-8 rounded-3xl bg-muted/20 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> {content.commitmentTitle}
                </h2>
                <p className="text-sm italic">
                  {content.commitment}
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
