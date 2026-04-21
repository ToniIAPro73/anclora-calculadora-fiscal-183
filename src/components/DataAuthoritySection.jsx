
import React from 'react';
import { ArrowSquareOut, ShieldCheck, WarningCircle } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';

const DataAuthoritySection = () => {
  const { t } = useLanguage();

  return (
    <div className="double-shell">
      <div className="double-shell-core space-y-8 p-6 sm:p-8">
        <div className="space-y-4">
          <span className="premium-eyebrow">
            <ShieldCheck size={12} weight="fill" className="mr-2" />
            Source-backed guidance
          </span>
          <h3 className="text-3xl font-[620] tracking-[-0.05em] text-foreground">
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

            <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
              <h4 className="mb-3 text-base font-semibold text-foreground">{t('authority.sourcesTitle')}</h4>
              <div className="space-y-3">
                <a 
                  href="https://sede.agenciatributaria.gob.es/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-background/80 px-4 py-3 text-sm text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[1px]"
                >
                  <span>{t('authority.source1')}</span>
                  <ArrowSquareOut size={16} weight="bold" className="text-primary" />
                </a>
                <a 
                  href="https://taxation-customs.ec.europa.eu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-background/80 px-4 py-3 text-sm text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[1px]"
                >
                  <span>{t('authority.source2')}</span>
                  <ArrowSquareOut size={16} weight="bold" className="text-primary" />
                </a>
              </div>
            </div>
            </div>
          </section>
        </div>

          <div className="rounded-[1.75rem] border border-[hsl(var(--warning)/0.18)] bg-[hsl(var(--warning)/0.08)] p-5">
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
