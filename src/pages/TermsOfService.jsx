import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, CreditCard, AlertCircle, CheckCircle2, Globe, ShieldAlert } from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <Helmet><title>Términos de Servicio · TaxNomad</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">

          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Última actualización: 20 de abril de 2026
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Términos de <span className="text-primary">Servicio</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Condiciones legales de uso del servicio TaxNomad. Léelas antes de realizar cualquier compra.
            </p>
          </div>

          {/* TODO: Completar con datos reales antes de publicar */}
          <div className="mb-10 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm">
            <strong>⚠ Aviso de implementación:</strong> Sustituye los datos entre corchetes con tu información real (nombre/empresa, dirección, CIF/NIF, email) antes de publicar en producción.
          </div>

          <div className="space-y-8 max-w-4xl">

            {/* 1. Identificación del prestador */}
            <section className="relative p-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Scale className="w-24 h-24" />
              </div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-primary" /> 1. Identificación del Prestador del Servicio
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-3">
                En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:
              </p>
              <ul className="space-y-1 text-sm text-foreground/80 pl-4 border-l-2 border-primary/20">
                <li><strong>Titular:</strong> [Tu nombre completo o razón social]</li>
                <li><strong>CIF / NIF:</strong> [XXXXXXXXX]</li>
                <li><strong>Domicilio:</strong> [Dirección postal completa]</li>
                <li><strong>Email de contacto:</strong> hola@taxnomad.app</li>
                <li><strong>Sitio web:</strong> taxnomad.app</li>
              </ul>
            </section>

            {/* 2. Propósito y limitación legal */}
            <section className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-primary" /> 2. Propósito del Servicio y Limitación de Responsabilidad
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                TaxNomad es una <strong>herramienta de utilidad técnica</strong> diseñada para ayudar a los usuarios a calcular sus días de presencia física en España a efectos informativos.
              </p>
              <p className="mt-3 text-foreground/80 leading-relaxed">
                <strong>El informe generado no constituye, bajo ninguna circunstancia, asesoramiento legal o fiscal oficial</strong>, ni reemplaza la consulta con un asesor fiscal, abogado o gestor colegiado. TaxNomad no asume responsabilidad alguna por decisiones fiscales o legales tomadas en base a los resultados del calculador.
              </p>
              <p className="mt-3 text-foreground/80 leading-relaxed">
                La exactitud de los resultados depende exclusivamente de los datos introducidos por el usuario. El usuario es el único responsable de la veracidad y completitud de los datos aportados.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* 3. Política de venta y derecho de desistimiento */}
              <section className="p-8 rounded-2xl border border-border bg-muted/10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" /> 3. Política de Venta y Derecho de Desistimiento
                </h2>
                <p className="text-sm text-foreground/80 mb-3">
                  El Informe Premium tiene un coste de <strong>9,99 € (IVA incluido)</strong> y se entrega en formato PDF de forma inmediata tras confirmarse el pago.
                </p>
                <p className="text-sm text-foreground/80 mb-3">
                  De conformidad con el artículo 16.m) de la Directiva 2011/83/UE del Parlamento Europeo y el art. 103.m) del Real Decreto Legislativo 1/2007 (TRLGDCU), <strong>el derecho de desistimiento de 14 días no es aplicable a contenidos digitales</strong> suministrados en soporte no material cuando:
                </p>
                <ol className="text-sm text-foreground/80 list-decimal pl-5 space-y-1">
                  <li>La ejecución ha comenzado con el previo consentimiento expreso del consumidor.</li>
                  <li>El consumidor ha reconocido que perderá su derecho de desistimiento una vez que el contrato se haya ejecutado completamente.</li>
                </ol>
                <p className="text-sm text-foreground/80 mt-3">
                  <strong>Al proceder al pago, el usuario consiente expresamente el inicio inmediato de la prestación y reconoce la pérdida del derecho de desistimiento</strong> en el momento de la descarga del PDF.
                </p>
                <p className="text-sm text-foreground/80 mt-3">
                  No obstante, si el archivo PDF estuviera dañado o no pudiera descargarse por un error técnico imputable al servicio, el usuario podrá solicitar la regeneración del informe o el reembolso en <a href="mailto:soporte@taxnomad.app" className="underline text-primary">soporte@taxnomad.app</a> en un plazo de 48 horas.
                </p>
              </section>

              {/* 4. Responsabilidad */}
              <section className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-destructive">
                  <AlertCircle className="w-6 h-6" /> 4. Limitación de Responsabilidad
                </h2>
                <p className="text-sm italic text-foreground/80 mb-3">
                  TaxNomad no será responsable de:
                </p>
                <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-2">
                  <li>Decisiones fiscales o legales adoptadas basándose en el informe generado.</li>
                  <li>Errores derivados de datos incorrectos o incompletos introducidos por el usuario.</li>
                  <li>Cambios normativos posteriores a la fecha de generación del informe.</li>
                  <li>Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor.</li>
                </ul>
                <p className="text-sm text-foreground/80 mt-3">
                  En cualquier caso, la responsabilidad máxima de TaxNomad frente al usuario estará limitada al importe abonado por el servicio contratado.
                </p>
              </section>
            </div>

            {/* 5. Propiedad intelectual */}
            <section className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-4">5. Propiedad Intelectual</h2>
              <p className="text-foreground/80 leading-relaxed">
                Todos los elementos del sitio web (diseño, código, textos, logotipos, marca "TaxNomad") son propiedad exclusiva del titular del servicio y están protegidos por la legislación española e internacional de propiedad intelectual. Queda prohibida su reproducción, distribución o transformación sin autorización expresa por escrito.
              </p>
              <p className="mt-3 text-foreground/80 leading-relaxed">
                El <strong>informe PDF generado</strong> es de uso personal y exclusivo del usuario que lo adquirió. No puede ser revendido, distribuido ni presentado como elaborado por un profesional fiscal colegiado.
              </p>
            </section>

            {/* 6. Legislación aplicable y resolución de disputas */}
            <section className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" /> 6. Legislación Aplicable y Resolución de Disputas
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-3">
                El presente contrato se rige por la legislación española. Para la resolución de controversias, ambas partes se someten a los juzgados y tribunales del domicilio del consumidor, de conformidad con el artículo 90.2 del TRLGDCU.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                En aplicación del Reglamento (UE) n.º 524/2013, los consumidores de la UE pueden acceder a la plataforma europea de resolución de litigios en línea (ODR) en:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            {/* 7. Modificaciones */}
            <section className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" /> 7. Modificaciones de los Términos
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                TaxNomad se reserva el derecho de modificar los presentes Términos de Servicio en cualquier momento. Los cambios serán publicados en esta página con la actualización de la fecha indicada en el encabezado. El uso continuado del servicio tras la publicación de modificaciones implica la aceptación de las mismas. Se recomienda revisar esta página periódicamente.
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
