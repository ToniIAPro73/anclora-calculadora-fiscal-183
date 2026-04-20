import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/10 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="font-bold">{t('footer.brand')}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t('footer.legalTitle')}</h4>
            <button onClick={() => navigate('/privacy')} className="text-sm text-muted-foreground hover:text-primary text-left">{t('footer.privacy')}</button>
            <button onClick={() => navigate('/terms')} className="text-sm text-muted-foreground hover:text-primary text-left">{t('footer.terms')}</button>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t('footer.contactTitle')}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" /> hola@regla183.com
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <span>© {currentYear} {t('footer.copyrightShort')}</span>
          <a href="/llms.txt" className="hover:text-primary">{t('footer.docs')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
