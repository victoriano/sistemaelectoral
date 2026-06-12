# Simulador de gobiernos — diseño

## Objetivo

Nueva sección "Gobiernos" en la pestaña Impacto: para cada elección 1993–2023, simular si el Gobierno (o los pactos de investidura) podría haber cambiado con el reparto biproporcional, usando la orientación política y los **precedentes reales de pacto** de cada partido. Timeline interactivo: elecciones que podrían haber cambiado vs no; al pinchar, calculadora simulación vs realidad.

## Datos (investigados y citados)

### src/data/party-politics.ts

```ts
export type Stance = "si" | "abstencion" | "no";
export interface RelationEra {
  years: string[];   // claves de elección a las que aplica ("1993", "2019-N"...)
  PSOE: Stance;      // postura esperable en una investidura liderada por el PSOE
  PP: Stance;        // ídem liderada por el PP
  note: string;      // precedente factual de 1 línea que lo justifica
}
export interface PartyPolitics {
  name: string;
  orientation: "izquierda" | "centroizquierda" | "centro" | "centroderecha" | "derecha";
  ambito: "nacional" | "nacionalista" | "regionalista";
  relations: RelationEra[]; // cubre todos los años con escaños del partido
}
```

Las posturas son **por época** (Bildu: no al PSOE en 2011, sí desde 2019; CiU: sí a ambos en los 90; Junts: solo sí al PSOE en 2023). Cada era lleva nota con el precedente (investiduras, mociones, pactos autonómicos relevantes). Partidos sin precedente nacional (GIL, CDS-93, FRONT REPUBLICÀ, EQUO): postura por orientación, marcada como inferida.

### src/data/government-history.ts

Por elección: `outcome` (gobierno | repeticion), `pmParty`, `pm`, `kind` (mayoría absoluta / minoría / coalición), `yesParties`, `abstainParties` (en la votación de investidura que prosperó), `note`. Hechos verificados: 1993 González (CiU, PNV), 1996 Aznar (CiU, PNV, CC), 2000 y 2011 mayorías absolutas PP, 2004/2008 Zapatero, 2015 y 2019-A repeticiones, 2016 Rajoy (Cs, CC; abstención PSOE), 2019-N Sánchez–UP (167 sí > 165 no), 2023 Sánchez–Sumar (179 sí).

## Motor (src/lib/government-sim.ts)

Para cada elección y cada sistema (dhondt | biprop), para cada líder L ∈ {PSOE, PP}:

- `yes` = escaños de L + partidos con stance(L)="si" ese año
- `no` = escaños del otro líder + partidos con stance(L)="no"
- `abst` = resto
- viable: `yes ≥ 176` (1.ª votación) o `yes > no` (2.ª votación, mayoría simple — así se invistieron Zapatero 2008, Rajoy 2016 y Sánchez 2019)

Veredicto por elección comparando sistemas:
- **"cambio"**: el conjunto de líderes viables difiere entre sistemas (se abre o cierra una alternativa de Gobierno, o se desbloquea una repetición)
- **"matiz"**: mismos líderes viables, pero la coalición necesaria cambia materialmente (p. ej. mayoría absoluta que desaparece y pasa a necesitar socios)
- **"igual"**: misma estructura de viabilidad

## Verificación (scripts/verify_government.ts)

- El modelo reproduce la realidad con escaños D'Hondt: en las 9 elecciones con gobierno, el partido del presidente real es viable y la suma de síes reales supera a los noes; en 2015 y 2019-A el modelo da bloqueo para ambos líderes (como ocurrió).
- Totales 350 en ambos sistemas; posturas definidas para todos los partidos con escaños en cualquiera de los dos sistemas y todos sus años.
- npm script `verify:gobiernos`. exit(1) en fallo.

## UI (src/components/GovernmentTimeline.tsx, sección id="gobiernos" en Impacto)

- **Timeline horizontal** 1993→2023: un nodo por elección, color del partido que gobernó de verdad (gris = repetición), distintivo según veredicto (cambio / matiz / igual).
- **Al pinchar**: panel con dos columnas — *Lo que pasó* (escaños D'Hondt, investidura real con sus síes/abstenciones) vs *Con biproporcional* (escaños, investiduras viables con socios y su precedente, contador sí/no/abst con línea de 176). Veredicto en una frase.
- Nota de honestidad metodológica: es aritmética parlamentaria sobre precedentes reales, no una predicción (con otro reparto, los partidos podrían haber actuado distinto).
- Pill "Gobiernos" en TAB3_PILLS (page.tsx).

## Partidos a cubrir (con escaños en algún sistema, por año)

PSOE, PP, PNV, ERC, CCA (todos los años); BNG; UPN (93-15, 23); IU (93-15); CiU (93-11); BILDU (11-23); PA (93-04, 11); EA (93-04); Cs (15-19N); GBAI (04-11); COMPROMIS (11, 19A, 19N); UP (16-19N); VOX (19A-23); JUNTS (19A-23); HB (93,96); UV (93,96); CHA (00,04); UPyD (08,11); CDC (15,16); PRC (19A,19N); NA+ (19A,19N); CUP (19N,23); PAR (93); CDS (93); IC-V (00); GIL (00); FAC (11); EQUO (11); PODEMOS (15); FRONT REPUB (19A); MASPAIS (19N); TERUEL (19N); SUMAR (23).
