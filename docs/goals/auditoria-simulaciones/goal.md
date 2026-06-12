# Goal: Auditoría y mejora de las simulaciones del sistema electoral

## Original request

"Este proyecto y encuéntrame los fallos en cómo contamos esta propuesta del sistema electoral y cómo mejorarla y hacerlo mucho mejor, sobre todo la parte de las simulaciones."

## Interpreted outcome

La web del Método Biproporcional calcula los escaños correctamente y de forma verificable:

1. El reparto D'Hondt "real" reproduce los resultados oficiales históricos (1993–2023) o las desviaciones quedan explicadas y documentadas.
2. El reparto del método propuesto (biproporcional) es matemáticamente correcto (algoritmo, redondeos, umbrales, votos en blanco, agrupaciones de partidos).
3. Los KPIs derivados (votos desperdiciados, etc.) son correctos.
4. Los fallos encontrados se corrigen en el código y quedan cubiertos por un script de verificación reproducible.

## Intake

- input_shape: audit con sesgo a ejecución (el usuario pide encontrar fallos Y arreglarlos)
- authority: approved (repo propio, trabajo local, sin publicar)
- proof: script de verificación que compara escaños calculados vs resultados oficiales + build verde
- likely_misfire: reescribir presentación/copy en vez de auditar y corregir el cálculo; o refactorizar sin verificar números contra fuentes oficiales
- blind_spots: umbral del 3% provincial, tratamiento de votos en blanco/nulos, coaliciones que cambian de nombre entre elecciones, Ceuta/Melilla (escaño único, no proporcional), redondeos del método biproporcional (convergencia del algoritmo)
- non_goals: rediseño visual, despliegue, cambios de copy salvo que un número mostrado sea incorrecto

## Constraints

- No tocar nada fuera del repo. No desplegar.
- `state.yaml` es la verdad del tablero.
- Verificación numérica contra resultados oficiales (Ministerio del Interior) antes de dar por buena cualquier corrección.

## Tranche

Descubrir los fallos de cálculo/presentación de mayor impacto, corregirlos en slices acotados y verificados, y auditar contra el outcome original hasta completarlo.
