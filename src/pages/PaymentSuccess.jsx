import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';
import { generateTaxReport } from '@/lib/generatePdf';
import { useLanguage } from '@/hooks/useLanguage';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [session, setSession] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState(() => t('payment.checking'));

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
    const deliveryToken = params.get('delivery_token');

    if (sessionId) {
      await verifyStripeSession(sessionId, deliveryToken);
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
        setStatusMessage(t('payment.validSessionMissing'));
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
        setStatusMessage(t('payment.localSessionError'));
      }
      return null;
    }
  };

  const verifyStripeSession = async (sessionId, deliveryToken) => {
    if (!deliveryToken) {
      setError(true);
      setStatusMessage(t('payment.missingDeliveryToken'));
      return;
    }

    try {
      const response = await fetch(
        `/api/checkout-session-status?session_id=${encodeURIComponent(sessionId)}&delivery_token=${encodeURIComponent(deliveryToken)}`,
      );
      if (!response.ok) {
        throw new Error('Verification request failed');
      }

      const verifiedSession = await response.json();
      if (!verifiedSession.verified) {
        setError(true);
        setStatusMessage(t('payment.stripeNotConfirmed'));
        return;
      }

      const localSession = hydrateFromLocalSession({ silentIfMissing: true });
      const reportPayload = verifiedSession.report_payload || {};
      const normalizedReportRanges = normalizeRanges(reportPayload.ranges);

      const mergedSession = localSession
        ? {
            ...localSession,
            name: reportPayload.name || localSession.name,
            email: reportPayload.email || localSession.email,
            taxId: reportPayload.taxId || localSession.taxId,
            documentType: reportPayload.documentType || localSession.documentType,
            language: reportPayload.language || localSession.language || language,
            fiscalYear: Number(reportPayload.fiscalYear || localSession.fiscalYear || new Date().getFullYear()),
            totalDays: Number(reportPayload.totalDays || localSession.totalDays),
            statusLabel: reportPayload.statusLabel || localSession.statusLabel,
            ranges: normalizedReportRanges.length > 0
              ? normalizedReportRanges
              : localSession.ranges,
          }
        : {
            name: reportPayload.name,
            email: reportPayload.email,
            taxId: reportPayload.taxId,
            documentType: reportPayload.documentType || 'passport',
            language: reportPayload.language || language,
            fiscalYear: Number(reportPayload.fiscalYear || new Date().getFullYear()),
            totalDays: Number(reportPayload.totalDays || 0),
            statusLabel: reportPayload.statusLabel,
            ranges: normalizedReportRanges,
          };

      if (!mergedSession.name || !mergedSession.taxId || !Array.isArray(mergedSession.ranges) || mergedSession.ranges.length === 0) {
        setError(true);
        setStatusMessage(t('payment.missingReportData'));
        return;
      }

      setSession(mergedSession);
      setStatusMessage(t('payment.verifiedMessage'));
      await downloadPdf(mergedSession);
    } catch (verificationError) {
      console.error('Stripe session verification error:', verificationError);
      setError(true);
      setStatusMessage(t('payment.verificationError'));
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
        fiscalYear: data.fiscalYear || new Date().getFullYear(),
        language: data.language || language,
      });
      const safeName = (data.name || 'informe').replace(/\s+/g, '_');
      doc.save(`TaxNomad_Informe_${safeName}_${data.fiscalYear || new Date().getFullYear()}.pdf`);
      setDownloaded(true);
      setStatusMessage(t('payment.autoDownloaded'));
    } catch (err) {
      console.error('PDF generation error:', err);
      setStatusMessage(t('payment.generationError'));
    }
  };

  const handleDownloadAgain = () => {
    if (session) downloadPdf(session);
  };

  if (error) {
    return (
      <>
        <Helmet>
          <title>Payment Status - TaxNomad</title>
          <meta name="robots" content="noindex,follow" />
        </Helmet>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
          <BrandLogo className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-foreground">{t('payment.expiredTitle')}</h1>
          <p className="text-muted-foreground text-center max-w-sm">
            {statusMessage}
          </p>
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-md">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('payment.backToCalculator')}
          </Button>
        </div>
      </>
    );
  }

  const statusLabel = session?.totalDays > 183
    ? t('progress.over')
    : session?.totalDays > 150
      ? t('progress.approaching')
      : t('progress.safe');

  return (
    <>
      <Helmet>
        <title>Payment Success - TaxNomad</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-4">
      <div className="grid w-full max-w-5xl gap-4 rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/20 md:p-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
        <section className="flex min-h-0 flex-col justify-between rounded-xl border border-border bg-muted/25 p-5 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)]">
                <CheckCircle2 className="h-7 w-7 text-[hsl(var(--success))]" />
                <BrandLogo className="absolute -bottom-1 -right-2 h-5 w-auto drop-shadow-sm" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--success)/0.2)] bg-[hsl(var(--success)/0.1)] px-3 py-1 text-xs font-semibold text-[hsl(var(--success))]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t('payment.verified')}
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t('payment.readyTitle')}
                </h1>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground md:text-base">
              {t('payment.readyDescription')}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {t('payment.backToCalculator')}
          </button>
        </section>

        <section className="grid min-h-0 gap-4 lg:grid-cols-[1fr_0.9fr]">
          {session && (
            <div className="rounded-xl border border-border bg-background/65 p-5 text-left">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {t('payment.reportTitle')} {session.fiscalYear || new Date().getFullYear()}
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="grid grid-cols-[0.8fr_1.2fr] items-start gap-4">
                  <span className="text-muted-foreground">{t('payment.holder')}</span>
                  <span className="text-right font-semibold leading-5 text-foreground">{session.name}</span>
                </div>
                <div className="grid grid-cols-[0.8fr_1.2fr] items-center gap-4">
                  <span className="text-muted-foreground">{t('payment.identification')}</span>
                  <span className="text-right font-mono text-foreground">{session.taxId}</span>
                </div>
                <div className="grid grid-cols-[0.8fr_1.2fr] items-center gap-4">
                  <span className="text-muted-foreground">{t('payment.daysInSpain')}</span>
                  <span className="text-right font-bold text-primary">{session.totalDays} {t('dateSelector.days')}</span>
                </div>
                <div className="grid grid-cols-[0.8fr_1.2fr] items-center gap-4">
                  <span className="text-muted-foreground">{t('payment.status')}</span>
                  <span className={`text-right font-bold ${
                    session.totalDays > 183 ? 'text-red-500' :
                    session.totalDays > 150 ? 'text-orange-500' : 'text-green-600'
                  }`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex flex-1 items-start gap-3 rounded-xl border border-border bg-muted/30 p-5 text-left">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Download className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">{t('payment.nextStep')}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t('payment.nextStepDescription')}
                </p>
              </div>
            </div>

            {downloaded && (
              <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--success)/0.2)] bg-[hsl(var(--success)/0.1)] p-3 text-sm font-medium text-[hsl(var(--success))]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {statusMessage}
              </div>
            )}

            <Button
              onClick={handleDownloadAgain}
              variant={downloaded ? 'outline' : 'default'}
              className="h-11 w-full rounded-md font-semibold gap-2"
            >
              <Download className="h-4 w-4" />
              {downloaded ? t('payment.downloadAgain') : t('payment.downloadPdf')}
            </Button>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              {t('payment.safeStorage')}
            </p>
          </div>
        </section>
      </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
