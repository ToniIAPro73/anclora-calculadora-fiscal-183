# Prompt maestro para Gemini CLI — Corrección SEO técnico de páginas no indexadas

Este documento contiene un prompt completo para lanzar en Gemini CLI y corregir los problemas de indexación detectados en Google Search Console para las páginas legales/multidioma de Regla183.

---

# PROMPT MAESTRO — Corrección SEO técnico páginas no indexadas en Regla183

Actúa como agente técnico senior especializado en SEO técnico, React, Vite, React Router, React Helmet y despliegues en Vercel.

Vas a trabajar sobre el repositorio:

https://github.com/ToniIAPro73/calculadora-fiscal-183.git

Proyecto: Calculadora Fiscal 183 / Regla183  
Dominio producción: https://www.regla183.com/  
Stack principal: Vite + React + React Router + React Helmet + Vercel

## Objetivo

Corregir los problemas detectados en Google Search Console para varias páginas legales/multidioma que aparecen como no indexadas.

Google Search Console muestra principalmente estos problemas:

1. `Duplicada: el usuario no ha indicado ninguna versión canónica`
2. `Descubierta: actualmente sin indexar`

URLs afectadas visibles:

- https://www.regla183.com/es/privacy/
- https://www.regla183.com/en/cookies/
- https://www.regla183.com/en/legal-notice/
- https://www.regla183.com/es/cookies/
- https://www.regla183.com/es/legal-notice/

También debes revisar preventivamente:

- https://www.regla183.com/en/privacy/
- https://www.regla183.com/es/terms/
- https://www.regla183.com/en/terms/
- https://www.regla183.com/es/
- https://www.regla183.com/en/

## Diagnóstico técnico esperado

El problema más probable no está en `robots.txt` ni en `sitemap.xml`.

El problema principal está en que `index.html` contiene canonical y hreflang estáticos apuntando a la home española:

```html
<link rel="canonical" href="https://www.regla183.com/es/" />
<link rel="alternate" hreflang="es" href="https://www.regla183.com/es/" />
<link rel="alternate" hreflang="en" href="https://www.regla183.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://www.regla183.com/es/" />
```

Como Vercel reescribe casi todas las rutas a `/index.html`, Google puede recibir primero una canonical genérica incorrecta para páginas como `/es/privacy/`, `/es/cookies/` o `/en/legal-notice/`.

Aunque las páginas legales usan `react-helmet`, la señal inicial del HTML base puede crear ambigüedad.

También hay un problema secundario: el footer usa `button` + `navigate()` para las páginas legales, en vez de enlaces HTML reales. Esto reduce la calidad de enlazado interno para Google.

## Archivos que debes revisar

Revisa como mínimo:

- `index.html`
- `vercel.json`
- `src/lib/seo.js`
- `src/App.jsx`
- `src/components/Footer.jsx`
- `src/pages/PrivacyPolicy.jsx`
- `src/pages/CookiePolicy.jsx`
- `src/pages/LegalNotice.jsx`
- `src/pages/TermsOfService.jsx`
- `src/pages/TaxNomadCalculator.jsx`
- `public/sitemap.xml`
- `public/robots.txt`

## Tareas obligatorias

### 1. Eliminar canonical/hreflang fijos de `index.html`

En `index.html`, elimina el bloque estático:

```html
<link rel="canonical" href="https://www.regla183.com/es/" />
<link rel="alternate" hreflang="es" href="https://www.regla183.com/es/" />
<link rel="alternate" hreflang="en" href="https://www.regla183.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://www.regla183.com/es/" />
```

No debe quedar ninguna canonical fija en `index.html`.

Motivo: ese HTML base se sirve para múltiples rutas por el rewrite de Vercel. Una canonical fija a `/es/` es incorrecta para páginas legales y puede provocar problemas de duplicidad.

Mantén el resto de metadatos base, scripts, GTM, favicons y fallback SEO salvo que encuentres un motivo técnico claro para modificarlos.

### 2. Garantizar SEO dinámico por ruta con React Helmet

Comprueba que cada página indexable define mediante `Helmet`:

- `<title>` específico
- `<meta name="description">` específica
- `<link rel="canonical">` específico
- `hreflang="es"`
- `hreflang="en"`
- `hreflang="x-default"`
- `<html lang="...">` si es viable sin romper nada

Las páginas legales ya parecen tener parte de esto, pero valida que todas lo tengan correctamente:

- `PrivacyPolicy.jsx`
- `CookiePolicy.jsx`
- `LegalNotice.jsx`
- `TermsOfService.jsx`

La canonical debe ser absoluta y con trailing slash.

Ejemplo esperado para privacidad en español:

```html
<link rel="canonical" href="https://www.regla183.com/es/privacy/" />
<link rel="alternate" hreflang="es" href="https://www.regla183.com/es/privacy/" />
<link rel="alternate" hreflang="en" href="https://www.regla183.com/en/privacy/" />
<link rel="alternate" hreflang="x-default" href="https://www.regla183.com/es/privacy/" />
```

Ejemplo esperado para cookies en inglés:

```html
<link rel="canonical" href="https://www.regla183.com/en/cookies/" />
<link rel="alternate" hreflang="es" href="https://www.regla183.com/es/cookies/" />
<link rel="alternate" hreflang="en" href="https://www.regla183.com/en/cookies/" />
<link rel="alternate" hreflang="x-default" href="https://www.regla183.com/es/cookies/" />
```

### 3. Añadir o corregir Helmet en la home/calculadora

Al eliminar la canonical de `index.html`, asegúrate de que la página principal/calculadora define sus metadatos con `Helmet`.

Revisa `src/pages/TaxNomadCalculator.jsx`.

Debe tener SEO dinámico similar a:

```jsx
<Helmet>
  <html lang={language} />
  <title>
    {language === 'es'
      ? 'Calculadora Regla 183 España | Residencia Fiscal'
      : 'Spain 183-Day Rule Calculator | Tax Residency'}
  </title>
  <meta
    name="description"
    content={
      language === 'es'
        ? 'Calcula si eres residente fiscal en España según la regla de los 183 días.'
        : 'Calculate whether you may be tax resident in Spain under the 183-day rule.'
    }
  />
  <link rel="canonical" href={getCanonicalUrl(language, '/')} />
  <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/')} />
  <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/')} />
  <link rel="alternate" hrefLang="x-default" href={getDefaultUrl()} />
</Helmet>
```

Adapta el contenido al estilo existente del código. No dupliques imports. No rompas la arquitectura actual.

### 4. Revisar `src/lib/seo.js`

Comprueba que `getCanonicalUrl()` genera URLs absolutas, con idioma y trailing slash.

Debe devolver:

```text
getCanonicalUrl('es', '/')              => https://www.regla183.com/es/
getCanonicalUrl('en', '/')              => https://www.regla183.com/en/
getCanonicalUrl('es', '/privacy')       => https://www.regla183.com/es/privacy/
getCanonicalUrl('en', '/cookies')       => https://www.regla183.com/en/cookies/
getCanonicalUrl('es', '/legal-notice')  => https://www.regla183.com/es/legal-notice/
```

Si ya funciona así, no lo cambies salvo para mejorar claridad o testabilidad.

### 5. Cambiar enlaces legales del footer

En `src/components/Footer.jsx`, sustituye los botones con `navigate()` por enlaces reales.

Actualmente el footer usa botones tipo:

```jsx
<button onClick={() => navigate(`${langPrefix}/privacy`)}>
```

Esto debe cambiarse a `Link` de `react-router-dom` o, preferiblemente para SEO, a `<a href="...">`.

Opción recomendada: usar `<a href>` con trailing slash, porque son enlaces HTML nativos y perfectamente rastreables.

Ejemplo:

```jsx
<a
  href={`${langPrefix}/privacy/`}
  className="inline-flex items-center gap-2 text-left text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
>
  {t('footer.privacy')} <ArrowUpRight size={14} weight="bold" />
</a>
```

Haz lo mismo para:

- privacy
- terms
- legal-notice
- cookies

Elimina `useNavigate` si queda sin uso.

Todos los enlaces internos legales deben usar trailing slash:

```text
/es/privacy/
/es/terms/
/es/legal-notice/
/es/cookies/
/en/privacy/
/en/terms/
/en/legal-notice/
/en/cookies/
```

### 6. Añadir redirects con trailing slash en `vercel.json`

Añade redirects permanentes para normalizar rutas idiomáticas sin trailing slash.

Añade estas entradas dentro de `redirects`:

```json
{
  "source": "/es/privacy",
  "destination": "/es/privacy/",
  "permanent": true
},
{
  "source": "/en/privacy",
  "destination": "/en/privacy/",
  "permanent": true
},
{
  "source": "/es/cookies",
  "destination": "/es/cookies/",
  "permanent": true
},
{
  "source": "/en/cookies",
  "destination": "/en/cookies/",
  "permanent": true
},
{
  "source": "/es/legal-notice",
  "destination": "/es/legal-notice/",
  "permanent": true
},
{
  "source": "/en/legal-notice",
  "destination": "/en/legal-notice/",
  "permanent": true
},
{
  "source": "/es/terms",
  "destination": "/es/terms/",
  "permanent": true
},
{
  "source": "/en/terms",
  "destination": "/en/terms/",
  "permanent": true
},
{
  "source": "/es/calculator",
  "destination": "/es/calculator/",
  "permanent": true
},
{
  "source": "/en/calculator",
  "destination": "/en/calculator/",
  "permanent": true
}
```

No elimines los redirects existentes salvo que haya duplicidad directa o conflicto.

Mantén el redirect de dominio raíz `regla183.com` hacia `www.regla183.com`.

Mantén el rewrite SPA, salvo que detectes un error claro.

### 7. Revisar rutas en `App.jsx`

Actualmente puede haber rutas sin trailing slash:

```jsx
<Route path="/es/privacy" element={<PrivacyPolicy />} />
```

React Router normalmente funciona igual si Vercel ya normaliza con trailing slash, pero valida que las rutas con slash final no fallen.

Si hace falta, añade equivalentes con trailing slash:

```jsx
<Route path="/es/privacy/" element={<PrivacyPolicy />} />
<Route path="/en/privacy/" element={<PrivacyPolicy />} />
```

Hazlo para:

- privacy
- terms
- legal-notice
- cookies
- calculator
- home idiomática si aplica

Evita romper rutas existentes.

### 8. Revisar `sitemap.xml`

Verifica que `public/sitemap.xml` contiene las URLs canónicas con trailing slash:

- `https://www.regla183.com/es/`
- `https://www.regla183.com/en/`
- `https://www.regla183.com/es/privacy/`
- `https://www.regla183.com/en/privacy/`
- `https://www.regla183.com/es/terms/`
- `https://www.regla183.com/en/terms/`
- `https://www.regla183.com/es/legal-notice/`
- `https://www.regla183.com/en/legal-notice/`
- `https://www.regla183.com/es/cookies/`
- `https://www.regla183.com/en/cookies/`

Comprueba que cada entrada tiene `xhtml:link` alternates correctos para `es`, `en` y `x-default`.

Si ya está bien, no lo cambies de forma innecesaria.

### 9. Revisar `robots.txt`

Debe permitir indexación:

```txt
User-agent: *
Allow: /

Sitemap: https://www.regla183.com/sitemap.xml
```

No añadas bloqueos.

### 10. Evitar noindex accidental

Busca en todo el repo:

```bash
grep -RniE "noindex|nofollow|X-Robots-Tag|robots" .
```

No debe haber `noindex` aplicado a las páginas afectadas.

Si existe un `noindex` accidental en HTML, Helmet, headers o configuración, elimínalo salvo que sea para páginas privadas o de pago que no deben indexarse.

## Validaciones obligatorias

Ejecuta:

```bash
npm run build
```

Si hay tests configurados y no son excesivamente lentos:

```bash
npm test
```

También ejecuta:

```bash
grep -RniE "canonical|hreflang|noindex|nofollow|X-Robots-Tag" index.html src public vercel.json
```

Verifica específicamente que `index.html` ya no contiene canonical ni hreflang fijos.

## Validación local sugerida

Levanta preview local si es viable:

```bash
npm run build
npm run start
```

Revisa visualmente que estas rutas funcionan:

```text
/es/privacy/
/en/privacy/
/es/cookies/
/en/cookies/
/es/legal-notice/
/en/legal-notice/
/es/terms/
/en/terms/
/es/
/en/
```

## Validación post-deploy sugerida

Después del deploy en Vercel, el usuario podrá ejecutar:

```bash
for url in \
  https://www.regla183.com/es/privacy/ \
  https://www.regla183.com/en/privacy/ \
  https://www.regla183.com/es/cookies/ \
  https://www.regla183.com/en/cookies/ \
  https://www.regla183.com/es/legal-notice/ \
  https://www.regla183.com/en/legal-notice/ \
  https://www.regla183.com/es/terms/ \
  https://www.regla183.com/en/terms/
do
  echo
  echo "===== $url ====="
  curl -I -L "$url" | grep -Ei "HTTP|location|x-robots-tag|content-type"
  curl -L -s "$url" | grep -Ei "canonical|hreflang|<title>|description|noindex|<h1" | head -80
done
```

Nota: al ser una SPA, `curl` puede no mostrar metadatos generados por React Helmet si no hay prerender. Aun así, debe comprobarse que `index.html` ya no envía una canonical incorrecta a `/es/`.

## Criterios de aceptación

La tarea se considera correcta si:

1. `index.html` no contiene canonical ni hreflang fijos.
2. Cada página indexable define canonical propia mediante Helmet.
3. La home/calculadora define canonical propia mediante Helmet.
4. Footer usa enlaces reales HTML a las páginas legales.
5. Los enlaces internos legales usan trailing slash.
6. `vercel.json` normaliza rutas idiomáticas sin slash a rutas con slash.
7. `sitemap.xml` sigue usando URLs canónicas con trailing slash.
8. `robots.txt` permite indexación.
9. No existe `noindex` accidental en las páginas afectadas.
10. `npm run build` pasa correctamente.

## Restricciones

No hagas rediseño visual.

No cambies textos legales salvo que sea estrictamente necesario para SEO técnico.

No cambies configuración de Stripe, APIs, base de datos ni flujo de pagos.

No elimines GTM ni consentimiento de cookies.

No cambies dominio canónico: debe ser siempre `https://www.regla183.com`.

No conviertas el proyecto a Next.js ni introduzcas SSR.

No añadas dependencias pesadas salvo que sea absolutamente necesario. La solución debe ser mínima y segura.

## Rama y commit

Trabaja en una rama nueva o en la rama indicada por el usuario.

Rama sugerida para implementación:

```bash
git checkout -b fix/seo-indexing-legal-pages
```

Al terminar:

```bash
npm run build
git status
git diff --stat
```

Haz commit con mensaje:

```bash
git add index.html vercel.json src
git commit -m "fix: clarify canonical signals for legal pages indexing"
```

No hagas push si el usuario no lo ha autorizado explícitamente.

## Informe final requerido

Al finalizar, entrega un resumen con:

1. Archivos modificados.
2. Cambios realizados.
3. Validaciones ejecutadas.
4. Resultado de `npm run build`.
5. Riesgos pendientes.
6. Próximos pasos en Google Search Console.

Próximos pasos esperados para el usuario:

- Desplegar en producción.
- Inspeccionar URL publicada en Search Console.
- Solicitar indexación de las URLs afectadas.
- Pulsar “Validar corrección”.
