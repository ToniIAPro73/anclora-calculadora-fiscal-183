import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { COOKIE_CONSENT_UPDATED_EVENT } from '@/lib/cookieConsent';
import { syncStoredConsentToTagManager, trackVirtualPageView, updateTagManagerConsent } from '@/lib/tagManager';

const TagManagerManager = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    syncStoredConsentToTagManager();

    const handleConsentUpdate = (event) => {
      updateTagManagerConsent(event.detail?.status ?? 'rejected');
    };

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdate);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdate);
    };
  }, []);

  useEffect(() => {
    trackVirtualPageView({
      path: `${location.pathname}${location.search}`,
      title: document.title,
      location: window.location.href,
      language,
    });
  }, [language, location.pathname, location.search]);

  return null;
};

export default TagManagerManager;
