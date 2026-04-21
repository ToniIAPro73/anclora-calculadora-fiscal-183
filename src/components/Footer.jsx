import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, EnvelopeSimple, ShieldCheck } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="mt-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="double-shell">
          <div className="double-shell-core px-6 py-8 sm:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ShieldCheck size={18} weight="light" className="text-primary" />
              </div>
              <span className="text-lg font-[620] tracking-[-0.04em]">{t('footer.brand')}</span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('footer.legalTitle')}</h4>
            <button onClick={() => navigate('/privacy')} className="inline-flex items-center gap-2 text-left text-sm text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground">{t('footer.privacy')} <ArrowUpRight size={14} weight="bold" /></button>
            <button onClick={() => navigate('/terms')} className="inline-flex items-center gap-2 text-left text-sm text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground">{t('footer.terms')} <ArrowUpRight size={14} weight="bold" /></button>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('footer.contactTitle')}</h4>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <EnvelopeSimple size={18} weight="light" />
              hola@regla183.com
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-8 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span>© {currentYear} {t('footer.copyrightShort')}</span>
          <a href="/llms.txt" className="transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground">{t('footer.docs')}</a>
        </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
