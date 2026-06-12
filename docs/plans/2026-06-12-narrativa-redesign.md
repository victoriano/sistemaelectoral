# Rediseño narrativo — "que lo entienda hasta mi padre"

## Principios

1. **Una historia, no un informe**: cada sección responde una pregunta que se haría un votante normal, en orden: ¿cuánto vale mi voto? → ¿por qué pasa esto? → ¿cuál es la solución? → ¿funciona de verdad? → ¿quién lo propone?
2. **Gancho visceral primero**: los datos más fuertes (Teruel Existe 1 diputado con 19.761 votos vs PACMA 0 con 228.856; un voto de Ceuta vale 8 veces el de Madrid) abren, no cierran.
3. **Jerga con glosa**: cada término técnico lleva 5 palabras de traducción en su primer uso. "Circunscripción (tu provincia, a efectos electorales)", "D'Hondt (la fórmula de reparto actual)", "índice de Gallagher (termómetro de injusticia: 0 = reparto perfecto)".
4. **Rigor en `<details>`**: la matemática exacta (Webster/Sainte-Laguë, iteraciones, Pukelsheim, LOREG) no desaparece — se pliega bajo "Para quien quiera el detalle matemático".
5. **Cada número, verificado**: solo cifras que salen de los scripts de verificación o de los datos oficiales cargados. Nada inventado.
6. **Eliminar duplicación**: el proceso de 3 etapas pasa de 3 explicaciones a 1 (la interactiva), con resumen plegable. StepExplanation y la sección "Etapas" del Simulador desaparecen.

## Estructura nueva

### Tab 1 — La Idea (antes "La Teoría")
1. **¿Cuánto vale tu voto?** (problema): 3 hechos-tarjeta con números reales; cierre: "no es fraude, es un defecto matemático — y tiene arreglo matemático".
2. **¿Por qué pasa esto?** (sistema actual): España = 52 elecciones a la vez; en provincias de 2-3 escaños solo caben los grandes; D'Hondt explicado con el ejemplo interactivo de Granada (MethodExplainer Parte 1 se muda aquí); mapa de España; quién gana/quién pierde.
3. **La propuesta: que cada voto cuente** (solución): 3 ideas llanas — (a) se cuentan todos los votos de España, (b) tu provincia conserva sus diputados, (c) una tabla de doble entrada cuadra ambas cosas (como Zúrich desde 2006) — con MethodExplainer Partes 2-3 y el rigor en details. StepExplanation se elimina (sus bullets rigurosos se pliegan aquí).
4. **¿Quién hay detrás?** (GIME): igual, copy pulido, referencias como enlaces reales.

### Tab 2 — Simulador ("no te fíes de nosotros: compruébalo")
- Intro de una línea reencuadrando el rol del usuario.
- Datos/Parámetros: copy motivado ("explora qué pasaría si…").
- Resultados: el "¿quién gana y quién pierde?" sube arriba; tabla después.
- Gallagher → "El termómetro de la injusticia" con escala contextual (0 perfecto · 1 Países Bajos · 5-6 España · 15-20 Reino Unido).
- Restos → "Votos que no eligieron a nadie", explicación llana primero.
- Gobernabilidad → reencuadre honesto: "la crítica habitual a la proporcionalidad, medida".
- Pactómetro: igual (es la mejor sección) + glosa de "Frankenstein".
- **Etapas: se elimina** (tercera repetición). Enlace a La Idea §3.

### Tab 3 — Impacto ("el veredicto: 30 años recalculados")
- Títulos y subtítulos reescritos como conclusiones, no como descripciones ("En 30 años, 277 escaños fueron a parar a quien no tocaba").
- Línea de interpretación bajo cada gráfico (p.ej. "2019-N fue la peor: 35 escaños mal repartidos").
- Leyenda explícita en ganadores/perdedores; nota de marcas que cambian (CiU→Junts) más visible.

## Números canónicos (verificados)

2023: PP 59.568 votos/escaño (8.160.837/137), PSOE 64.642, SUMAR 98.226, VOX 92.636; Ceuta PP 12.918/escaño; Madrid ~100.000; ratio 7,84×. 2019-N: Teruel Existe 19.761 → 1 escaño; PACMA 228.856 → 0. Impacto 1993-2023: 277 escaños cambiarían (25/elección; peor 2019-N con 35), Gallagher medio 5,7→1,7, votos sin escaño 8,7%→5,8%, 11/11 elecciones mejoran; IU +95, Cs +42, UP +29, VOX +28, UPyD +15; PP −143, PSOE −85, PNV −14. Zúrich usa el método desde 2006.

## Implementación

- Worker A: `page.tsx` (narrativa tab 1, pills, eliminar StepExplanation) + `MethodExplainer.tsx` (dividir en `DHondtExplainer` y `BipropExplainer`).
- Worker B: `Simulator.tsx` (copys, orden de Resultados, eliminar Etapas) + `Pactometro.tsx` (glosas).
- Worker C: `ImpactDashboard.tsx` (titulares-conclusión + interpretaciones).
- Gates: build + verify_seats/biprop/rules/impact + grep de jerga sin glosa + screenshot.
