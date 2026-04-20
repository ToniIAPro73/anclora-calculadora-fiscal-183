import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Lock, Mail, FileText, UserCheck, Trash2, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet><title>Política de Privacidad · TaxNomad</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">

          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Última actualización: 20 de abril de 2026
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Política de <span className="text-primary">Privacidad</span>
            </h1>
            <p className="text-muted-foreground text-lg italic">
              Transparencia total sobre el tratamiento de tus datos personales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Resumen lateral */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 sticky top-24">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Resumen rápido
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <Lock className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Pagos seguros:</strong> Procesados 100% por Stripe. No accedemos a tus datos bancarios.</span>
                  </li>
                  <li className="flex gap-3">
                    <Eye className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Sin almacenamiento:</strong> Nombre y DNI solo se usan para generar el PDF y no se guardan.</span>
                  </li>
                  <li className="flex gap-3">
                    <Trash2 className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Eliminación inmediata:</strong> Los datos se borran de memoria tras la descarga del PDF.</span>
                  </li>
                  <li className="flex gap-3">
                    <UserCheck className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Tus derechos:</strong> Acceso, rectificación y supresión disponibles en todo momento.</span>
                  </li>
                  {/* TODO: reemplazar con tu email real */}
                  <li className="flex gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Contacto DPO:</strong> <a href="mailto:privacidad@taxnomad.app" className="underline">privacidad@taxnomad.app</a></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Texto detallado */}
            <div className="lg:col-span-8 space-y-10 text-foreground/80 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Responsable del Tratamiento</h2>
                {/* TODO: Completar con tu nombre/empresa, dirección y CIF/NIF antes de publicar */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm mb-4">
                  <strong>⚠ Aviso de implementación:</strong> Sustituye los datos entre corchetes con tu información real antes de publicar.
                </div>
                <p>
                  En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), el Responsable del Tratamiento es:
                </p>
                <ul className="mt-3 space-y-1 text-sm list-none pl-4 border-l-2 border-primary/20">
                  <li><strong>Nombre / Razón social:</strong> [Tu nombre o empresa]</li>
                  <li><strong>Dirección:</strong> [Calle, Ciudad, País]</li>
                  <li><strong>CIF / NIF:</strong> [XXXXXXXXX]</li>
                  <li><strong>Email:</strong> privacidad@taxnomad.app</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Datos que Recopilamos y Finalidad</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="block mb-1">2.1 Datos de uso de la calculadora</strong>
                    <p>Los rangos de fechas introducidos se procesan localmente en tu navegador para calcular días de presencia física. <strong>No se envían a ningún servidor.</strong></p>
                  </div>
                  <div>
                    <strong className="block mb-1">2.2 Datos del informe PDF (usuarios de pago)</strong>
                    <p>Para generar el informe personalizado recopilamos: nombre completo y número de identificación (DNI, NIE o pasaporte). Estos datos se usan exclusivamente para insertar tu información en el PDF generado y se eliminan de la memoria inmediatamente después.</p>
                    <p className="mt-2"><strong>Base jurídica:</strong> Art. 6.1.b RGPD — ejecución de contrato (prestación del servicio contratado).</p>
                  </div>
                  <div>
                    <strong className="block mb-1">2.3 Datos de pago</strong>
                    <p>Los pagos son procesados íntegramente por <strong>Stripe, Inc.</strong> No almacenamos ni accedemos a datos de tarjetas bancarias. Consulta la política de privacidad de Stripe en <a href="https://stripe.com/es/privacy" className="underline text-primary" target="_blank" rel="noopener noreferrer">stripe.com/es/privacy</a>.</p>
                    <p className="mt-2"><strong>Base jurídica:</strong> Art. 6.1.b RGPD — ejecución de contrato.</p>
                  </div>
                  <div>
                    <strong className="block mb-1">2.4 Datos técnicos y cookies de publicidad</strong>
                    <p>Si tienes activa la publicidad (Google AdSense), Google puede utilizar cookies para mostrar anuncios personalizados basados en tu historial de navegación. Puedes gestionar tus preferencias en <a href="https://adssettings.google.com" className="underline text-primary" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.</p>
                    <p className="mt-2"><strong>Base jurídica:</strong> Art. 6.1.a RGPD — consentimiento del interesado (prestado a través del banner de cookies).</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Plazo de Conservación</h2>
                <p>
                  Los datos personales (nombre e identificación) <strong>no se almacenan</strong> en ningún sistema de nuestra parte. Son procesados en tiempo real en tu navegador y en la memoria del servidor únicamente durante la generación del PDF (proceso que dura segundos). No existe base de datos de usuarios.
                </p>
                <p className="mt-3">
                  Los datos de transacción (pago) son conservados por Stripe según su política de retención, generalmente durante 5 años por obligaciones legales contables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Transferencias Internacionales</h2>
                <p>
                  Los datos de pago son gestionados por Stripe, Inc. (EE.UU.), que opera bajo el marco de adecuación UE-EE.UU. (Data Privacy Framework) y las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea, garantizando un nivel de protección equivalente al europeo.
                </p>
                <p className="mt-3">
                  No realizamos ninguna otra transferencia internacional de datos personales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Tus Derechos (Arts. 15-22 RGPD)</h2>
                <p className="mb-3">Puedes ejercer en cualquier momento los siguientes derechos:</p>
                <ul className="space-y-2 text-sm">
                  {[
                    ['Acceso (Art. 15)',        'Solicitar información sobre qué datos tuyos tratamos.'],
                    ['Rectificación (Art. 16)', 'Corregir datos inexactos o incompletos.'],
                    ['Supresión (Art. 17)',      'Solicitar la eliminación de tus datos ("derecho al olvido").'],
                    ['Limitación (Art. 18)',     'Pedir que restrinjamos el tratamiento de tus datos.'],
                    ['Portabilidad (Art. 20)',   'Recibir tus datos en formato estructurado y legible por máquina.'],
                    ['Oposición (Art. 21)',      'Oponerte al tratamiento basado en interés legítimo.'],
                  ].map(([derecho, desc]) => (
                    <li key={derecho} className="flex gap-3">
                      <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>{derecho}:</strong> {desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">
                  Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:privacidad@taxnomad.app" className="underline text-primary">privacidad@taxnomad.app</a> indicando el derecho que deseas ejercer y una copia de tu identificación.
                </p>
                <p className="mt-3 text-sm">
                  Tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> — <a href="https://www.aepd.es" className="underline text-primary" target="_blank" rel="noopener noreferrer">www.aepd.es</a> — si consideras que el tratamiento de tus datos no es conforme al RGPD.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies</h2>
                <p>Utilizamos exclusivamente:</p>
                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                  <li><strong>localStorage</strong> (no es cookie técnicamente): para guardar tu preferencia de idioma y tema visual. No contiene datos personales.</li>
                  <li><strong>Cookies de Google AdSense</strong> (si aplica): cookies de terceros para personalización de anuncios. Requieren consentimiento previo.</li>
                </ul>
              </section>

              <section className="p-8 rounded-3xl bg-muted/20 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Compromiso de Privacidad
                </h2>
                <p className="text-sm italic">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales o publicitarios propios. Tu informe PDF es de tu exclusiva propiedad y no guardamos copias del mismo.
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
