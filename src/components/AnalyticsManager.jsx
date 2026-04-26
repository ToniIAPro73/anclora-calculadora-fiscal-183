import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COOKIE_CONSENT_UPDATED_EVENT, getCookieConsent } from '@/lib/cookieConsent';
import { disableAnalytics, initializeAnalytics, trackPageView } from '@/lib/analytics';

const AnalyticsManager = () => {
  const location = useLocation();

  useEffect(() => {
    const syncAnalyticsWithConsent = async () => {
      const consent = getCookieConsent()?.status;

      if (consent === 'accepted') {
        try {
          const ready = await initializeAnalytics();
          if (ready) {
            trackPageView({
              path: `${window.location.pathname}${window.location.search}`,
              title: document.title,
              location: window.location.href,
            });
          }
        } catch (error) {
          console.error('Google Analytics initialization error:', error);
        }
        return;
      }

      disableAnalytics();
    };

    void syncAnalyticsWithConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncAnalyticsWithConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncAnalyticsWithConsent);
    };
  }, []);

  useEffect(() => {
    void initializeAnalytics().then((ready) => {
      if (!ready) {
        return;
      }

      trackPageView({
        path: `${location.pathname}${location.search}`,
        title: document.title,
        location: window.location.href,
      });
    }).catch((error) => {
      console.error('Google Analytics page view error:', error);
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsManager;
