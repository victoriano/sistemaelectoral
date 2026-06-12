# Pestaña "Impacto" — diseño

## Objetivo

Tercera pestaña que muestra, agregando las 11 elecciones reales (1993–2023), qué habría cambiado aplicando el método biproporcional en lugar de D'Hondt. Se excluye la proyección 2027 (no es una elección real).

## Cálculo (src/lib/impact-stats.ts)

Módulo puro, sin React. Para cada elección con `hasRealData`:

- D'Hondt: `dHondtByCircumscription(circs, 0.03)` (con `blankVotes`).
- Biproporcional: `runGIME(circs, 350, 0, 0.03)` — sin bonus de gobernabilidad, barrera 3% (quorum por circunscripción), parámetros por defecto del simulador.
- `diff = biprop − dhondt` por partido; `seatsMoved = Σ diffs positivos`.
- Gallagher de ambos métodos con `gallagherIndex` sobre votos nacionales (suma provincial).
- Votos sin escaño en su provincia: misma métrica para ambos métodos (votos en circunscripciones donde el partido obtuvo 0 escaños), en % sobre votos de candidaturas.

Agregados: diff total por partido, media de Gallagher y de votos sin escaño, total de escaños que cambian de manos.

## Verificación (scripts/verify_impact.ts)

Asserts con exit(1): totales = 350 en ambos métodos y todas las elecciones; Σdiff = 0; Gallagher biprop < D'Hondt; porcentajes en rango. npm script `verify:impact`.

## UI (src/components/ImpactDashboard.tsx)

Secciones (= pills de la pestaña):

1. **resumen** — 4 tarjetas KPI (escaños que cambian de manos, Gallagher medio ambos métodos, votos sin escaño medios, elecciones con mejora) + barra de escaños movidos por elección.
2. **ganadores** — barras divergentes horizontales: escaños ganados/perdidos por partido sumando todo el periodo, con color de partido (`canonicalParties`).
3. **matriz** — heatmap CSS (partido × elección) con la diferencia de escaños por celda, verde/rojo según signo e intensidad según magnitud.
4. **evolucion** — dos gráficos de líneas (Gallagher y % votos sin escaño), una línea por método, paleta consistente con ComparisonChart (D'Hondt índigo #6366f1, biprop esmeralda #10b981).

Nota de metodología al pie (parámetros usados y definición de la métrica).

## Integración (page.tsx)

- `activeTab: "intro" | "simulator" | "impact"`, botón "Impacto" con icono, hash `#impacto` + ids de sección en el routing por hash existente.
- De paso: las llamadas al motor en page.tsx (líneas 60–69) pierden `blankVotes` — se corrige (mismo bug que W11 arregló en Simulator).
