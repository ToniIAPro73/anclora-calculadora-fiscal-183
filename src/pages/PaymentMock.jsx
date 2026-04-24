import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';
import { useLanguage } from '@/hooks/useLanguage';

const PaymentMock = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [session, setSession] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('taxnomad_session');
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const handlePay = () => {
    setPaying(true);
    // Simulate a brief network delay, then redirect to success
    setTimeout(() => navigate('/payment-success'), 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-center gap-2 bg-[hsl(var(--warning))] py-2 text-center text-sm font-semibold text-[hsl(var(--warning-foreground))]">
        <AlertTriangle className="w-4 h-4" />
        {t('paymentMock.banner')}
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pt-10">
        <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl md:flex-row">

          <div className="flex flex-col gap-6 border-b border-border bg-muted/35 p-8 md:w-5/12 md:border-b-0 md:border-r">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-11 w-auto shrink-0" />
              <div>
                <p className="text-lg font-bold leading-tight text-foreground">TaxNomad</p>
                <p className="text-xs text-primary">{t('paymentMock.report')}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('paymentMock.total')}</p>
              <p className="text-4xl font-bold text-foreground">9,99 €</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('paymentMock.taxIncluded')}</p>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('paymentMock.report')}</p>
                  <p className="text-xs text-muted-foreground">183 días · {session?.fiscalYear || new Date().getFullYear()}</p>
                </div>
              </div>
              {session && (
                <>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="w-4 text-center">·</span>
                    {t('payment.holder')}: <span className="text-foreground">{session.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="w-4 text-center">·</span>
                    {t('stats.totalDays')}: <span className="font-bold text-foreground">{session.totalDays}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5" />
              Powered by <span className="font-semibold text-foreground">Stripe</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-8 md:w-7/12">
            <div>
              <h2 className="text-xl font-bold text-foreground">{t('paymentMock.cardTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('paymentMock.cardDescription')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('paymentMock.cardNumber')}
                </label>
                <div className="flex items-center justify-between rounded-md border border-input bg-muted/35 px-4 py-3 font-mono text-sm text-muted-foreground">
                  <span>4242 4242 4242 4242</span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-sans text-xs font-semibold text-primary">TEST</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('paymentMock.expiry')}
                  </label>
                  <div className="rounded-md border border-input bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                    12 / 28
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('paymentMock.cvc')}
                  </label>
                  <div className="rounded-md border border-input bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                    •••
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('paymentMock.cardName')}
                </label>
                <div className="rounded-md border border-input bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  {session?.name || 'NOMBRE APELLIDOS'}
                </div>
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={paying}
              className="h-12 w-full rounded-md text-base font-bold"
            >
              {paying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {t('paymentMock.processing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {t('paymentMock.pay')} 9,99 €
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              {t('paymentMock.secure')}
            </div>

            <button
              onClick={() => navigate('/')}
              className="mx-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="w-3 h-3" /> {t('payment.backToCalculator')}
            </button>
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-xs text-muted-foreground">
        TaxNomad · Calculadora de Residencia Fiscal {session?.fiscalYear || new Date().getFullYear()}
      </p>
    </div>
  );
};

export default PaymentMock;
