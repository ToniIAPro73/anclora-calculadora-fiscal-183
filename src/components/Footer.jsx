
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage.js';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-[hsl(var(--footer))] mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[hsl(var(--footer-foreground))]">
          {t('footer.copyright')}
        </p>
        <div className="flex gap-6 text-sm font-medium">
          <a 
            href="#" 
            className="text-[hsl(var(--footer-foreground))] hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            {t('footer.privacy')}
          </a>
          <a 
            href="#" 
            className="text-[hsl(var(--footer-foreground))] hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            {t('footer.terms')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
