import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';
import { generateTaxReport } from '@/lib/generatePdf';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Verificando pago...');

  useEffect(() => {
    void bootstrapPaymentState();
  }, []);

  const normalizeRanges = (ranges = []) =>
    ranges
      .map((range) => {
        const start = range?.start ?? range?.entryDate ?? null;
        const end = range?.end ?? range?.exitDate ?? null;

        if (!start || !end) {
          return null;
        }

        return {
          start,
          end,
          days: Number(range?.days ?? 0),
        };
      })
      .filter(Boolean);

  const bootstrapPaymentState = async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      await verifyStripeSession(sessionId);
      return;
    }

    // Mock/dev flow: still relies on local state, but only when there is no Stripe session_id.
    hydrateFromLocalSession({ autoDownload: true });
  };

  const hydrateFromLocalSession = ({ autoDownload = false, silentIfMissing = false } = {}) => {
    const raw = sessionStorage.getItem('taxnomad_session');
    if (!raw) {
      if (!silentIfMissing) {
        setError(true);
        setStatusMessage('No se encontró una sesión de pago válida.');
      }
      return null;
    }

    try {
      const data = JSON.parse(raw);
      const normalizedData = {
        ...data,
        ranges: normalizeRanges(data.ranges),
      };

      setSession(normalizedData);
      sessionStorage.removeItem('taxnomad_session');

      if (autoDownload) {
        void downloadPdf(normalizedData);
      }

      return normalizedData;
    } catch {
      if (!silentIfMissing) {
        setError(true);
        setStatusMessage('No se pudo recuperar la sesión local de pago.');
      }
      return null;
    }
  };

  const verifyStripeSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/checkout-session-status?session_id=${encodeURIComponent(sessionId)}`);
      if (!response.ok) {
        throw new Error('Verification request failed');
      }

      const verifiedSession = await response.json();
      if (!verifiedSession.verified) {
        setError(true);
        setStatusMessage('Stripe no ha confirmado el pago de esta sesión.');
        return;
      }

      const localSession = hydrateFromLocalSession({ silentIfMissing: true });
      const reportPayload = verifiedSession.report_payload || {};
      const normalizedReportRanges = normalizeRanges(reportPayload.ranges);

      const mergedSession = localSession
        ? {
            ...localSession,
            name: reportPayload.name || localSession.name,
            taxId: reportPayload.taxId || localSession.taxId,
            documentType: reportPayload.documentType || localSession.documentType,
            totalDays: Number(reportPayload.totalDays || localSession.totalDays),
            statusLabel: reportPayload.statusLabel || localSession.statusLabel,
            ranges: normalizedReportRanges.length > 0
              ? normalizedReportRanges
              : localSession.ranges,
          }
        : {
            name: reportPayload.name,
            taxId: reportPayload.taxId,
            documentType: reportPayload.documentType || 'passport',
            totalDays: Number(reportPayload.totalDays || 0),
            statusLabel: reportPayload.statusLabel,
            ranges: normalizedReportRanges,
          };

      if (!mergedSession.name || !mergedSession.taxId || !Array.isArray(mergedSession.ranges) || mergedSession.ranges.length === 0) {
        setError(true);
        setStatusMessage('Pago verificado, pero faltan datos suficientes para regenerar el PDF.');
        return;
      }

      setSession(mergedSession);
      setStatusMessage('Pago verificado correctamente.');
      await downloadPdf(mergedSession);
    } catch (verificationError) {
      console.error('Stripe session verification error:', verificationError);
      setError(true);
      setStatusMessage('No se pudo verificar el pago con Stripe.');
    }
  };

  const downloadPdf = async (data) => {
    try {
      const doc = await generateTaxReport({
        name: data.name,
        taxId: data.taxId,
        documentType: data.documentType || 'passport',
        totalDays: data.totalDays,
        ranges: data.ranges || [],
        language: 'es',
      });
      const safeName = (data.name || 'informe').replace(/\s+/g, '_');
      doc.save(`TaxNomad_Informe_${safeName}_2026.pdf`);
      setDownloaded(true);
      setStatusMessage('PDF descargado automáticamente.');
    } catch (err) {
      console.error('PDF generation error:', err);
      setStatusMessage('El pago está validado, pero hubo un error al generar el PDF.');
    }
  };

  const handleDownloadAgain = () => {
    if (session) downloadPdf(session);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <BrandLogo className="h-12 w-auto" />
        <h1 className="text-2xl font-black text-foreground">Sesión expirada</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          {statusMessage}
        </p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al calculador
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Delivery header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <BrandLogo className="h-7 w-auto drop-shadow-sm" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Pago verificado correctamente
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
              Tu informe ya está listo
            </h1>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Ya puedes descargar tu informe premium de residencia fiscal. Esta pantalla está pensada para la entrega del documento, no para repetir la confirmación del checkout.
            </p>
          </div>
        </div>

        {/* Session summary */}
        {session && (
          <div className="rounded-2xl border border-border bg-muted/30 p-6 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Informe de Residencia Fiscal 2026
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titular</span>
                <span className="font-semibold">{session.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Identificación</span>
                <span className="font-mono">{session.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días en España</span>
                <span className="font-bold text-primary">{session.totalDays} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado</span>
                <span className={`font-bold ${
                  session.totalDays > 183 ? 'text-red-500' :
                  session.totalDays > 150 ? 'text-orange-500' : 'text-green-600'
                }`}>
                  {session.totalDays > 183 ? 'Límite superado' :
                   session.totalDays > 150 ? 'Atención' : 'Seguro'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-background/70 p-5 text-left space-y-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
              <Download className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Siguiente paso</p>
              <p className="text-sm text-muted-foreground">
                Descarga tu PDF y guárdalo como respaldo fiscal. Si la descarga automática no se ha abierto, puedes lanzarla manualmente desde aquí.
              </p>
            </div>
          </div>
        </div>

        {/* Download status */}
        {downloaded ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {statusMessage}
            </div>
            <Button
              onClick={handleDownloadAgain}
              variant="outline"
              className="w-full rounded-full h-11 font-semibold gap-2"
            >
              <Download className="w-4 h-4" /> Descargar informe otra vez
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleDownloadAgain}
            className="w-full rounded-full h-12 font-bold text-base gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Descargar informe PDF
          </Button>
        )}

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al calculador
        </button>

        <p className="text-xs text-muted-foreground">
          Guarda este PDF en un lugar seguro. Es tu documento de respaldo fiscal.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
