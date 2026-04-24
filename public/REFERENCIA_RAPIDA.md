# REFERENCIA RÁPIDA - Favicons 183 Premium

## 📋 Etiquetas HTML (Copiar y pegar directamente)

```html
<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="theme-color" content="#001a33">
```

## 📦 Archivos Requeridos (estructura public/)

```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── mstile-150x150.png
├── site.webmanifest
└── browserconfig.xml
```

## ⚡ Implementación Next.js 15

En `app/layout.tsx`:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "183",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "183",
  },
  themeColor: "#001a33",
  manifest: "/site.webmanifest",
};
```

## 🚀 Implementación React Standard

En `public/index.html` dentro de `<head>`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png">
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/apple-touch-icon.png">
    <link rel="manifest" href="%PUBLIC_URL%/site.webmanifest">
    <meta name="msapplication-config" content="%PUBLIC_URL%/browserconfig.xml">
    <meta name="theme-color" content="#001a33">
    
    <title>183</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

## 🔧 Troubleshooting

### El favicon no se actualiza
**Solución:** Agrega parámetro de versión
```html
<link rel="icon" href="/favicon.ico?v=2">
```

### iOS no muestra el icono
**Solución:** Asegúrate de que `apple-touch-icon.png` es exactamente 180x180px

### Android no reconoce el manifest
**Solución:** Verifica que `site.webmanifest` está en la raíz pública y el path es correcto

### Windows muestra icono incorrecto
**Solución:** Verifica que `mstile-150x150.png` existe en la raíz pública

## 📊 Especificaciones Técnicas

| Aspecto | Valor |
|---------|-------|
| Formato primario | PNG con transparencia RGBA |
| Formato ICO | Compatible 16x16, 32x32, 48x48 |
| Calidad | 95% (LANCZOS resampling) |
| Color tema | #001a33 |
| Adaptive icons | Soportados (maskable) |

## ✅ Checklist de Validación

- [ ] Todos los archivos están en `public/`
- [ ] Las etiquetas `<link>` están en `<head>`
- [ ] `site.webmanifest` está referenciado en HTML
- [ ] `browserconfig.xml` está en raíz pública
- [ ] `theme-color` metaetiqueta está presente
- [ ] Actualizar navegador con Ctrl+Shift+R
- [ ] Validar en https://realfavicongenerator.net/ (subir favicon.ico)

## 🎯 Validación Online

Verifica tu implementación en:
- https://realfavicongenerator.net/ - Carga `favicon.ico`
- https://www.favicon-generator.org/ - Carga cualquier PNG
- Chrome DevTools > Application > Manifest - Verificar `site.webmanifest`
