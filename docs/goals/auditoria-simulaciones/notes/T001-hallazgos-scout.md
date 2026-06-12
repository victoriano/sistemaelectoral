# T001 — Hallazgos del Scout (auditoría de cálculo de escaños)

## Resumen

Los números "biproporcionales" de la UI NO salen de un algoritmo biproporcional: `gimeStage2` está roto (2023 → 9.798 escaños; 2019N → matriz a cero; marginales violados en 52/52 provincias). La UI sobrevive porque muestra el reparto nacional D'Hondt del Stage 1. Además, los datos provinciales de 2023 (y 2027) parecen aproximados/fabricados (sumas provinciales 12–14% por debajo de los totales reales), y hay claves de partido inconsistentes que rompen pactómetro/gobernabilidad en 2015–2019.

## Hallazgos por severidad

1. **ALTA — Stage 2 biproporcional roto.** `src/lib/electoral-methods.ts:154-201`. Redondea dentro del bucle y ajusta multiplicadores sobre la matriz redondeada → explota o colapsa. Esperado: método de escalado alternado de Pukelsheim (divisores continuos fila/columna, redondeo con signpost fijo, garantiza ambos marginales). El badge "Convergencia en N iteraciones" (`Simulator.tsx:781-783`) es falso.
2. **ALTA — Datos 2023 fabricados.** `src/data/elections2023.ts` (Madrid PSOE 1.124.567 vs real ≈989.8xx; solo 4–6 partidos/provincia; sin blancos). D'Hondt reproduce mal 2023: PSOE +3, SUMAR −3, VOX +1, PP −1, JUNTS −1. `elections2027.ts` hereda el problema.
3. **ALTA — Umbral 3% aplicado NACIONALMENTE en biproporcional Stage 1.** `electoral-methods.ts:114-126`. 2023 → PP 128/PSOE 124/VOX 49/SUMAR 49, cero para ERC/JUNTS/PNV/BILDU/BNG/CCA/UPN. Contradice el copy del slider ("…en una circunscripción", `Simulator.tsx:385`) y `page.tsx:183`. → Decisión de Judge: ¿feature o bug?
4. **ALTA — Claves de partido inconsistentes.** Datos usan "EH Bildu", "EAJ-PNV", "CCa-NC", "JxCAT-JUNTS", "C's", "PODEMOS-IU-EQUO", "ECP"; coaliciones usan BILDU/PNV/CCA/JUNTS (`Pactometro.tsx:11-37`, `Simulator.tsx:167-173`). Pactómetro omite esos partidos en 2015–2019.
5. **MEDIA — Denominador del umbral excluye votos en blanco.** `electoral-methods.ts:42-44`; LOREG 163.1.a cuenta válidos = candidaturas + blancos. Ningún dataset tiene blancos.
6. **MEDIA — Bonus de gobernabilidad (Stage 3) rompe invariantes.** `electoral-methods.ts:236-250`: total puede ≠350 y las tablas provinciales no se actualizan.
7. **MEDIA — verify_seats.ts con baseline erróneo.** Totales esperados suman 347/348/349 (faltan ERC/PAR/UV/Na-Bai) y no agrega variantes de etiqueta (IU vs EUPV/IC-V…), enmascarando el fallo real de 2023.
8. **BAJA — Desempate** `electoral-methods.ts:62` usa `>` estricto; LOREG: más votos totales, luego sorteo.
9. **BAJA — Escaños perdidos con umbral alto** `electoral-methods.ts:68`: total puede caer bajo 350.
10. **BAJA — KPI votos desperdiciados**: definición no estándar pero declarada en UI; denominadores sin blancos.
11. **BAJA — Números hardcodeados en copy** `page.tsx:273-287` con deriva menor.

**Sano:** 12 datasets con 52 circunscripciones que suman 350 (Ceuta/Melilla 1+1); apportionment 2023 correcto (Madrid 37/Barcelona 32/Valencia 16); build pasa.

## Comandos de verificación

- `npx tsx verify_seats.ts` — funciona
- `npm run build` — pasa
- `npm run lint` — inusable (sin config ESLint, prompt interactivo)
- Sin suite de tests

## Tareas candidatas

- T-fix-biprop: reimplementar Stage 2 (Pukelsheim) + tests de invariantes (fila=escaños provincia, col=escaños nacionales, total=350)
- T-data-2023: datos oficiales provinciales 2023 (todos los partidos + blancos); regenerar 2027
- T-party-keys: normalización canónica de claves de partido al cargar datos
- T-baseline: arreglar verify_seats.ts (350 + mapa de agregación de etiquetas) y promoverlo a test real
- T-copy: alinear copy de umbral / Stage 3 / badge de iteraciones

## Ambigüedad para Judge

Umbral 3% nacional vs provincial en el método biproporcional: el código lo aplica nacional (aniquila regionales), el copy dice provincial, el pitch de la propuesta dice preservar representación territorial. Es la decisión que más cambia los KPIs.
