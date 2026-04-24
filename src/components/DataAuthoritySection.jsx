
import React from 'react';
import { ArrowSquareOut, ShieldCheck, WarningCircle } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';

const DataAuthoritySection = () => {
  const { t } = useLanguage();

  return (
    <div className="trust-panel">
      <div className="space-y-6 p-5 sm:p-6">
        <div className="space-y-4">
          <span className="premium-eyebrow">
            <ShieldCheck size={12} weight="fill" className="mr-2" />
            {t('authority.eyebrow')}
          </span>
          <h3 className="text-2xl font-[700] tracking-tight text-foreground">
            {t('authority.title')}
          </h3>
        </div>

        <div className="grid gap-6 text-sm leading-7 lg:grid-cols-2">
          <section>
            <h4 className="mb-2 text-base font-semibold text-foreground">{t('authority.whatIsTitle')}</h4>
            <p className="text-muted-foreground">
              {t('authority.whatIsDesc')}
            </p>
          </section>

          <section>
            <h4 className="mb-2 text-base font-semibold text-foreground">{t('authority.whatCountsTitle')}</h4>
            <p className="text-muted-foreground mb-2">
              {t('authority.whatCountsDesc')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>{t('authority.whatCountsList1')}</li>
              <li>{t('authority.whatCountsList2')}</li>
              <li>{t('authority.whatCountsList3')}</li>
              <li>{t('authority.whatCountsList4')}</li>
            </ul>
          </section>

          <section className="lg:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
            <h4 className="mb-2 text-base font-semibold text-foreground">{t('authority.exceptionsTitle')}</h4>
            <p className="text-muted-foreground mb-2">
              {t('authority.exceptionsDesc')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>{t('authority.exceptionsList1')}</li>
              <li>{t('authority.exceptionsList2')}</li>
              <li>{t('authority.exceptionsList3')}</li>
              <li>{t('authority.exceptionsList4')}</li>
              <li>{t('authority.exceptionsList5')}</li>
            </ul>
            </div>

            <div className="rounded-xl border border-border bg-muted/35 p-5">
              <h4 className="mb-3 text-base font-semibold text-foreground">{t('authority.sourcesTitle')}</h4>
              <div className="space-y-3">
                <a 
                  href="https://sede.agenciatributaria.gob.es/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 hover:border-primary/30"
                >
                  <span>{t('authority.source1')}</span>
                  <ArrowSquareOut size={16} weight="bold" className="text-primary" />
                </a>
                <a 
                  href="https://taxation-customs.ec.europa.eu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 hover:border-primary/30"
                >
                  <span>{t('authority.source2')}</span>
                  <ArrowSquareOut size={16} weight="bold" className="text-primary" />
                </a>
              </div>
            </div>
            </div>
          </section>
        </div>

          <div className="rounded-xl border border-[hsl(var(--warning)/0.18)] bg-[hsl(var(--warning)/0.08)] p-5">
            <div className="flex gap-3">
              <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[hsl(var(--warning-foreground))]" />
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold block mb-1 text-foreground">{t('authority.disclaimerTitle')}</span>
                {t('authority.disclaimerDesc')}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default DataAuthoritySection;
