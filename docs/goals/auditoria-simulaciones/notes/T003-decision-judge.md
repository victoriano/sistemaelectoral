# T003 — Decisión del Judge

## Ruling: umbral del 3%

El 3% nacional en `gimeStage1`/`runGIME` es un **BUG**. Regla correcta: *un partido es elegible para el reparto nacional (Stage 1) si alcanza el umbral (3% por defecto) de votos válidos en al menos una circunscripción; los elegibles compiten nacionalmente con todos sus votos.*

Razones: (1) el copy del slider es la spec ("…en una circunscripción", Simulator.tsx:385); (2) Zúrich/Pukelsheim usa exactamente ese quorum (≥umbral en ≥1 distrito); (3) aniquilar a ERC/JUNTS/PNV/BILDU/BNG/CCA/UPN contradice el pitch ("Mantiene circunscripciones territoriales") y hace la simulación políticamente absurda.

Corolarios: (a) denominador del umbral = votos válidos = candidaturas + blancos (campo `blankVotes?` con default 0); (b) desempate D'Hondt: más votos totales, luego regla determinista documentada; (c) el copy se queda, el código se mueve.

## Orden de ejecución (Workers)

- **W1 T-baseline**: arreglar `verify_seats.ts` (totales=350, mapa de alias, allowlist `KNOWN_DATA_ISSUES` para 2023, exit≠0 en diffs no permitidos). Files: verify_seats.ts, package.json (script "verify").
- **W2 T-party-keys**: capa de normalización `src/data/party-aliases.ts` aplicada en `all-elections.ts`; Pactometro/Simulator solo lookups.
- **W3 T-rules**: implementar ruling de umbral + desempate LOREG + hook blankVotes + guard de <350 escaños. Verify: ERC/JUNTS/PNV/BILDU/BNG >0 en biprop 2023, total 350, D'Hondt histórico sin cambios.
- **W4 T-fix-biprop**: reemplazar `gimeStage2` por escalado alternado correcto (divisores continuos, redondeo fijo, marginales garantizados, iteraciones veraces). Verify: 12 datasets, ambos marginales exactos, total 350.
- **W5 T-stage3**: bonus de gobernabilidad preserva total=350 y coherencia provincial.
- **W6 T-data-2023** [necesita red]: datos oficiales infoelectoral por provincia (todos los partidos + blancos), regenerar 2027, quitar allowlist. Verify 2023 exacto: PP 137, PSOE 121, VOX 33, SUMAR 31, ERC 7, JUNTS 7, BILDU 6, PNV 5, BNG 1, CCA 1, UPN 1.
- **W7 T-copy**: alinear copy (badge iteraciones real, números de page.tsx, descripciones).

## Riesgos

1. Sin framework de tests: los scripts tsx deben `process.exit(1)` en fallo. No usar `npm run lint` como gate.
2. Hasta W6, los números absolutos 2023/2027 (incl. KPI votos desperdiciados) siguen mal: no declarar outcome completo con W1–W5 solo.
3. No refactorizar Simulator.tsx (806 líneas) — fuera de scope de todos los slices.
4. W6 debe documentar la derivación de 2027 en la cabecera del fichero.
