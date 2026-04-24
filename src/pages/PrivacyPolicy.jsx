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
    description: 'Politica de privacidad para usuarios que calculan su residencia fiscal en Espana y la UE con la regla de 183 dias.',
    updatedAt: 'Última actualización: 20 de abril de 2026',
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
        title: 'Sin almacenamiento',
        description: 'Nombre e identificación solo se usan para generar el PDF y no se guardan.',
      },
      {
        icon: Trash2,
        title: 'Eliminación inmediata',
        description: 'Los datos se borran de memoria tras la descarga del PDF.',
      },
      {
        icon: UserCheck,
        title: 'Tus derechos',
        description: 'Acceso, rectificación y supresión disponibles en todo momento.',
      },
      {
        icon: Mail,
        title: 'Contacto DPO',
        description: 'hola@regla183.com',
        mailto: true,
      },
    ],
    sections: [
      {
        title: '1. Responsable del Tratamiento',
        body: [
          'En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), el Responsable del Tratamiento es:',
        ],
        list: [
          ['Nombre / Razón social', 'Antonio Ballesteros Alonso'],
          ['Dirección', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)'],
          ['NIF', '08997554T'],
          ['Email', 'hola@regla183.com'],
        ],
      },
      {
        title: '2. Datos que recopilamos y finalidad',
        blocks: [
          {
            title: '2.1 Datos de uso de la calculadora',
            body: 'Los rangos de fechas introducidos se procesan localmente en tu navegador para calcular días de presencia física. No se envían a ningún servidor.',
          },
          {
            title: '2.2 Datos del informe PDF',
            body: 'Para generar el informe personalizado recopilamos nombre completo y número de identificación (pasaporte o NIE). Estos datos se usan exclusivamente para insertar tu información en el PDF generado.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
          },
          {
            title: '2.3 Datos de pago',
            body: 'Los pagos son procesados íntegramente por Stripe, Inc. No almacenamos ni accedemos a datos de tarjetas bancarias.',
            note: 'Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.',
            link: { href: 'https://stripe.com/es/privacy', label: 'stripe.com/es/privacy' },
          },
          {
            title: '2.4 Datos técnicos y cookies de publicidad',
            body: 'Si activas publicidad mediante Google AdSense, Google puede utilizar cookies para mostrar anuncios personalizados en función de tu historial de navegación.',
            note: 'Base jurídica: Art. 6.1.a RGPD — consentimiento del interesado.',
            link: { href: 'https://adssettings.google.com', label: 'adssettings.google.com' },
          },
        ],
      },
      {
        title: '3. Plazo de conservación',
        body: [
          'Los datos personales del informe no se almacenan de forma persistente por nuestra parte. Se procesan durante la generación del PDF y se descartan después.',
          'Los datos de transacción pueden ser conservados por Stripe conforme a sus obligaciones legales y políticas de retención.',
        ],
      },
      {
        title: '4. Transferencias internacionales',
        body: [
          'Los datos de pago son gestionados por Stripe, Inc. (EE.UU.), bajo mecanismos de transferencia internacional adecuados como el Data Privacy Framework y las Cláusulas Contractuales Tipo.',
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
        title: '6. Cookies',
        body: ['Utilizamos exclusivamente los siguientes mecanismos locales o de terceros:'],
        plainList: [
          'localStorage para guardar tu preferencia de idioma y tema visual. No contiene datos personales sensibles.',
          'Cookies de Google AdSense, solo si se activa publicidad y siempre sujetas a consentimiento previo cuando resulte exigible.',
        ],
      },
    ],
    commitmentTitle: 'Compromiso de privacidad',
    commitment: 'No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales propios. Tu informe PDF es de tu exclusiva propiedad.',
  },
  en: {
    title: 'Privacy Policy · TaxNomad',
    description: 'Privacy policy for users calculating tax residency in Spain and the EU with the 183-day rule.',
    updatedAt: 'Last updated: April 20, 2026',
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
        title: 'No retention',
        description: 'Name and identification are only used to generate the PDF and are not stored permanently.',
      },
      {
        icon: Trash2,
        title: 'Immediate deletion',
        description: 'Report data is cleared from working memory after delivery.',
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
          'In accordance with Regulation (EU) 2016/679 (GDPR), the data controller is:',
        ],
        list: [
          ['Name', 'Antonio Ballesteros Alonso'],
          ['Address', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain'],
          ['Tax ID', '08997554T'],
          ['Email', 'hola@regla183.com'],
        ],
      },
      {
        title: '2. Data we collect and why',
        blocks: [
          {
            title: '2.1 Calculator usage data',
            body: 'The date ranges you enter are processed locally in your browser to calculate physical presence days. They are not sent to a server during the standard calculator flow.',
          },
          {
            title: '2.2 PDF report data',
            body: 'To generate the personalised report we collect your full name and identification number (passport or NIE). This information is used solely to populate your PDF report.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
          },
          {
            title: '2.3 Payment data',
            body: 'Payments are processed entirely by Stripe, Inc. We do not store or access your card data.',
            note: 'Legal basis: Article 6(1)(b) GDPR — performance of a contract.',
            link: { href: 'https://stripe.com/privacy', label: 'stripe.com/privacy' },
          },
          {
            title: '2.4 Technical data and advertising cookies',
            body: 'If advertising is enabled through Google AdSense, Google may use cookies to personalise ads based on your browsing history.',
            note: 'Legal basis: Article 6(1)(a) GDPR — consent.',
            link: { href: 'https://adssettings.google.com', label: 'adssettings.google.com' },
          },
        ],
      },
      {
        title: '3. Retention period',
        body: [
          'Report personal data is not stored persistently by us. It is processed for delivery and then discarded.',
          'Transaction data may be retained by Stripe according to its legal obligations and retention policies.',
        ],
      },
      {
        title: '4. International transfers',
        body: [
          'Payment data is handled by Stripe, Inc. in the United States under recognised international transfer mechanisms such as the EU-U.S. Data Privacy Framework and Standard Contractual Clauses.',
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
        title: '6. Cookies',
        body: ['We only rely on the following local or third-party mechanisms:'],
        plainList: [
          'localStorage to remember language and theme preferences. It does not contain sensitive personal data.',
          'Google AdSense cookies, only if advertising is enabled and subject to prior consent when legally required.',
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
