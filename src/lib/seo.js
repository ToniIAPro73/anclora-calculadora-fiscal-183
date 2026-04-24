export const APP_ORIGIN = 'https://regla183.com';

export const LANGUAGES = ['es', 'en'];

export function getLanguageFromPath(pathname = '') {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return LANGUAGES.includes(firstSegment) ? firstSegment : undefined;
}

export function getCanonicalUrl(language = 'es', route = '/') {
  const normalizedRoute = route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}/`;
  return `${APP_ORIGIN}/${language}${normalizedRoute === '/' ? '/' : normalizedRoute}`;
}

export function getDefaultUrl() {
  return `${APP_ORIGIN}/`;
}
