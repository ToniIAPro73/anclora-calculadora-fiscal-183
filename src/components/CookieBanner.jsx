import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getCookieConsent,
  setCookieConsent,
} from '@/lib/cookieConsent';

const contentByLanguage = {
  es: {
    eyebrow: 'Cookies y privacidad',
    title: 'Usamos tecnologías necesarias y solo activamos Google Analytics 4 si das tu consentimiento.',
    body: 'Puedes aceptar o rechazar cookies no esenciales. La medición analítica permanece bloqueada hasta que aceptes.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    policy: 'Política de Cookies',
  },
  en: {
    eyebrow: 'Cookies and privacy',
    title: 'We use necessary technologies and only enable Google Analytics 4 if you give consent.',
    body: 'You can accept or reject non-essential cookies. Analytics measurement stays blocked until you accept.',
    accept: 'Accept',
    reject: 'Reject',
    policy: 'Cookie Policy',
  },
};

const CookieBanner = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const content = contentByLanguage[language] || contentByLanguage.en;
  const langPrefix = language === 'en' ? '/en' : '/es';

  useEffect(() => {
    const syncConsentState = () => {
      setVisible(!getCookieConsent());
    };

    syncConsentState();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsentState);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsentState);
    };
  }, []);

  const handleAccept = () => {
    setCookieConsent('accepted');
    // Gate future optional analytics here once they are added.
  };

  const handleReject = () => {
    setCookieConsent('rejected');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 lg:px-8">
      <div className="pointer-events-auto mx-auto max-w-[1280px]">
        <div
          className={cn(
            'double-shell overflow-hidden rounded-[1.35rem] border border-border/80 bg-background/95 backdrop-blur-xl',
            'shadow-[0_24px_60px_-32px_rgba(15,23,42,0.65)]',
          )}
        >
          <div className="relative">
            <div className="glass-orb -left-12 bottom-0 h-28 w-28 bg-primary/20" />
            <div className="glass-orb right-0 top-0 h-24 w-24 bg-primary/10" />
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-3">
                <span className="premium-eyebrow">
                  <ShieldCheck size={12} weight="fill" className="mr-2" />
                  {content.eyebrow}
                </span>
                <div className="max-w-3xl space-y-2">
                  <p className="text-sm font-semibold leading-6 text-foreground sm:text-[15px]">
                    {content.title}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {content.body}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-[132px] rounded-full border-border bg-background/80 px-5"
                  onClick={handleReject}
                >
                  {content.reject}
                </Button>
                <Button
                  type="button"
                  className="h-11 min-w-[132px] rounded-full px-5"
                  onClick={handleAccept}
                >
                  {content.accept}
                </Button>
                <Link
                  to={`${langPrefix}/cookies`}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <SlidersHorizontal size={16} />
                  {content.policy}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
