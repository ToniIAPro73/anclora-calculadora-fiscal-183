# Independent Public Utility App Contract

## Objetivo

Definir la base UX/UI y de producto para apps públicas ligeras fuera de `Anclora Group`, especialmente calculators, utilities y micro-productos orientados a SEO, Ads o captación.

## Regla de marca

- no Anclora branding by default
- no iconografía Anclora por defecto
- no gramática premium de Anclora por defecto

## Autoridad

- Registro operativo: `docs/governance/contracts-registry.json`
- Inventario aplicable: `docs/governance/independent-products.json`
- Fuente ejecutable relacionada: ninguna por defecto

## Tipo de producto

Este contrato aplica a productos que suelen ser:

- públicos
- rápidos de entender
- `public_no_auth`
- orientados a `seo`
- monetizados con Ads, afiliación o captación

## Repos a los que aplica

- `anclora-calculadora-fiscal-183`

## Sincronización con repos consumidores

- Contrato fuente en la bóveda: `docs/standards/INDEPENDENT_PUBLIC_UTILITY_APP_CONTRACT.md`
- Target normal de propagación: `docs/standards/`
- Dependencia de auditoría y propagación desde `docs/governance/contracts-registry.json`
- Este contrato no hereda automáticamente branding ni contratos de `Anclora Group`

## Reglas obligatorias

### 1. Claridad inmediata

- El primer viewport debe explicar qué hace la herramienta y qué dato obtiene el usuario.
- La acción principal debe estar visible sin exploración compleja.

### 2. Input/output legible

- Los formularios deben ser simples y directos.
- Los resultados deben ser estables, escaneables y fáciles de interpretar.
- `result readability` es requisito contractual, no mejora opcional.

### 3. Móvil primero

- `mobile-first` por defecto.
- La app no puede depender de tablas frágiles, grids complejos o paneles laterales para funcionar.

### 4. Monetización compatible con confianza

- `ad placements` permitidos, pero no pueden romper la tarea principal.
- La publicidad no puede empujar el resultado principal fuera de la zona visible inmediata si eso daña la utilidad del producto.

### 5. SEO útil

- Los bloques SEO deben aportar contexto real.
- FAQ, explicaciones y notas deben reforzar la utilidad, no actuar solo como relleno.

### 6. Performance

- La rapidez percibida es parte del contrato.
- No introducir librerías, efectos o bloques pesados que degraden innecesariamente el tiempo de carga.

## Gate de aceptación

Una app no cumple este contrato si:

- parece una landing de marca en vez de una utilidad real
- oculta la acción principal o el resultado
- prioriza Ads por encima de la tarea principal
- rompe la experiencia móvil
- usa branding de Anclora sin ser parte de `Anclora Group`
