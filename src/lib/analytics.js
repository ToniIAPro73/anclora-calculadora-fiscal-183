import { hasAcceptedOptionalCookies } from '@/lib/cookieConsent';

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-R9RGVFDPHS';

const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;

let scriptLoadingPromise = null;
let initialized = false;

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
}

function setAnalyticsDisabled(disabled) {
  window[GA_DISABLE_KEY] = disabled;
}

function injectScript() {
  const existingScript = document.querySelector(`script[src="${GA_SCRIPT_SRC}"]`);
  if (existingScript) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = GA_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Analytics'));
    document.head.appendChild(script);
  });
}

export async function initializeAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (!hasAcceptedOptionalCookies()) {
    return false;
  }

  if (!scriptLoadingPromise) {
    scriptLoadingPromise = injectScript();
  }

  await scriptLoadingPromise;
  ensureDataLayer();
  setAnalyticsDisabled(false);

  if (!initialized) {
    window.gtag('js', new Date());
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
    });
    initialized = true;
  }

  return true;
}

export function disableAnalytics() {
  if (typeof window === 'undefined') {
    return;
  }

  setAnalyticsDisabled(true);

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

export function trackPageView({ path, title, location }) {
  if (
    typeof window === 'undefined' ||
    typeof window.gtag !== 'function' ||
    !initialized ||
    !hasAcceptedOptionalCookies()
  ) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: path,
    page_location: location,
  });
}
