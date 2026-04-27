import { getCookieConsent } from '@/lib/cookieConsent';

function ensureDataLayer() {
  if (typeof window === 'undefined') {
    return null;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  return window.dataLayer;
}

export function updateTagManagerConsent(status) {
  if (typeof window === 'undefined' || !status) {
    return;
  }

  ensureDataLayer();

  const granted = status === 'accepted';

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  window.dataLayer.push({
    event: 'cookie_consent_update',
    consent_status: status,
  });
}

export function syncStoredConsentToTagManager() {
  const consent = getCookieConsent();
  if (consent && consent.status) {
    updateTagManagerConsent(consent.status);
  }
}

export function trackVirtualPageView({ path, title, location, language }) {
  if (typeof window === 'undefined') {
    return;
  }

  ensureDataLayer();

  window.dataLayer.push({
    event: 'taxnomad_virtual_pageview',
    page_path: path,
    page_title: title,
    page_location: location,
    site_language: language,
  });
}
