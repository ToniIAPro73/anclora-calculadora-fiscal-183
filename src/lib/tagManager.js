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
  if (typeof window === 'undefined') {
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
    event: 'taxnomad_cookie_consent_update',
    cookie_consent_status: status || 'unset',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

export function syncStoredConsentToTagManager() {
  const status = getCookieConsent()?.status ?? 'rejected';
  updateTagManagerConsent(status);
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
