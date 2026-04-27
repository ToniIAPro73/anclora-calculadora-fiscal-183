export const COOKIE_CONSENT_STORAGE_KEY = 'taxnomad_cookie_consent';
export const COOKIE_CONSENT_MAX_AGE_DAYS = 180;
export const COOKIE_CONSENT_UPDATED_EVENT = 'taxnomad:cookie-consent-updated';

function getNow() {
  return Date.now();
}

export function getCookieConsent() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.status || !parsed?.expiresAt) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }

    if (parsed.expiresAt <= getNow()) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    return null;
  }
}

export function setCookieConsent(status) {
  if (typeof window === 'undefined') {
    return null;
  }

  const payload = {
    status,
    updatedAt: getNow(),
    expiresAt: getNow() + COOKIE_CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
  };

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: payload }));
  return payload;
}

export function clearCookieConsent() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: null }));
}

export function hasAcceptedOptionalCookies() {
  return getCookieConsent()?.status === 'accepted';
}
