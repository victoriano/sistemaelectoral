/**
 * Verifica el simulador de gobiernos (src/lib/government-sim.ts):
 *  1. Cobertura: todo partido con escaños (en cualquier sistema, cualquier
 *     año) tiene postura definida para ese año en party-politics.
 *  2. Reproducción de la realidad con los escaños D'Hondt:
 *     (a) en las elecciones con gobierno "ordinario" el líder real es viable;
 *     (b) en 2015 y 2019-A el modelo da bloqueo para ambos líderes;
 *     (c) en 2016 el modelo NO reproduce la investidura de Rajoy por posturas
 *         (gobernó por la abstención extraordinaria del PSOE), pero con las
 *         listas reales de government-history se cumple sí > no;
 *     (d) en todas las elecciones con gobierno, la suma de los yesParties
 *         reales supera al resto menos las abstenciones (con el ajuste
 *         documentado del voto dividido de CCA en 2019-N).
 *  3. Coherencia interna: sí+no+abst = 350 en cada evaluación.
 *
 * Uso: npx tsx scripts/verify_government.ts  (exit 1 si algo falla)
 */
import { computeElectionImpact, realElectionYears } from "../src/lib/impact-stats";
import { partyPolitics } from "../src/data/party-politics";
import { governmentHistory } from "../src/data/government-history";
import {
  simulateGovernments,
  viableLeaders,
  LEADERS,
  GovernmentSimulation,
} from "../src/lib/government-sim";

let failures = 0;
function check(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error(`FAIL: ${msg}`);
  }
}

const years = realElectionYears();
check(years.length === 11, `esperaba 11 elecciones reales, hay ${years.length}`);

// ── 1. Cobertura de posturas ────────────────────────────────────────────────
const impacts = years.map(y => computeElectionImpact(y));
for (const impact of impacts) {
  for (const system of ["dhondt", "biprop"] as const) {
    for (const [party, seats] of Object.entries(impact[system])) {
      if (seats <= 0) continue;
      const era = partyPolitics[party]?.relations.find(r => r.years.includes(impact.year));
      check(
        era !== undefined,
        `cobertura: ${party} tiene ${seats} escaños (${system}) en ${impact.year} sin postura en party-politics`
      );
    }
  }
}
if (failures > 0) {
  console.error(`\n${failures} fallo(s) de cobertura: el motor no puede ejecutarse`);
  process.exit(1);
}

// ── 2. Simulación completa ──────────────────────────────────────────────────
let sims: GovernmentSimulation[];
try {
  sims = simulateGovernments();
} catch (e) {
  console.error(`FAIL: simulateGovernments() lanzó: ${(e as Error).message}`);
  process.exit(1);
}
const byYear: { [y: string]: GovernmentSimulation } = {};
for (const s of sims) byYear[s.year] = s;

// Coherencia: sí+no+abst = 350 en toda evaluación.
for (const s of sims) {
  for (const system of ["dhondt", "biprop"] as const) {
    for (const leader of LEADERS) {
      const ev = s[system][leader];
      const total = ev.yes + ev.no + ev.abst;
      check(
        total === 350,
        `${s.year} ${system} ${leader}: sí+no+abst = ${total} (≠350)`
      );
    }
  }
}

// (a) Elecciones con gobierno "ordinario": el líder real es viable con D'Hondt.
const ORDINARY = ["1993", "1996", "2000", "2004", "2008", "2011", "2019-N", "2023"];
for (const y of ORDINARY) {
  const pm = governmentHistory[y].pmParty as "PSOE" | "PP";
  const ev = byYear[y].dhondt[pm];
  check(
    ev.viable !== null,
    `(a) ${y}: el líder real (${pm}) no es viable en el modelo D'Hondt (sí ${ev.yes}, no ${ev.no})`
  );
}

// (b) 2015 y 2019-A: bloqueo para ambos líderes con D'Hondt (como ocurrió).
for (const y of ["2015", "2019-A"]) {
  for (const leader of LEADERS) {
    const ev = byYear[y].dhondt[leader];
    check(
      ev.viable === null,
      `(b) ${y}: ${leader} aparece viable con D'Hondt (sí ${ev.yes}, no ${ev.no}) pero hubo bloqueo real`
    );
  }
}

// (c) 2016: el modelo no reproduce la investidura real de Rajoy por posturas.
{
  const ev16 = byYear["2016"].dhondt.PP;
  check(
    ev16.viable === null,
    `(c) 2016: el modelo da viable a Rajoy por posturas (sí ${ev16.yes}, no ${ev16.no}); debería requerir la abstención del PSOE`
  );
  console.log(
    "Documentado (c): en 2016 el modelo de posturas no reproduce la investidura de Rajoy\n" +
      `  (PP: ${ev16.yes} síes frente a ${ev16.no} noes): gobernó por la abstención extraordinaria\n` +
      "  del PSOE. La mayoría aritmética PSOE+UP+Cs que da el modelo fracasó en la realidad\n" +
      "  por los vetos cruzados. Con las listas reales de government-history sí se cumple sí > no:"
  );
}

// (c2 / d) Validación de las listas históricas: suma de yesParties (escaños
// D'Hondt) > resto menos abstainParties, en toda elección con gobierno.
for (const s of sims) {
  const real = s.real;
  if (real.outcome !== "gobierno") continue;
  const seatsOf = (p: string) => s.dhondtSeats[p] || 0;
  for (const p of [...(real.yesParties || []), ...(real.abstainParties || [])]) {
    check(seatsOf(p) > 0, `(d) ${s.year}: ${p} figura en las listas reales pero no tiene escaños D'Hondt`);
  }
  let yes = (real.yesParties || []).reduce((sum, p) => sum + seatsOf(p), 0);
  const abst = (real.abstainParties || []).reduce((sum, p) => sum + seatsOf(p), 0);
  let no = 350 - yes - abst;
  let adjustment = "";
  if (s.year === "2019-N") {
    // Voto dividido documentado en government-history: el escaño de NC dentro
    // de la candidatura CCA votó sí (el 167.º) y el de Oramas (CC) votó no.
    yes += 1;
    no -= 1;
    adjustment = " [ajuste documentado CCA: NC sí, CC no]";
  }
  check(
    yes > no,
    `(d) ${s.year}: yesParties suman ${yes} y no superan al resto menos abstenciones (${no})${adjustment}`
  );
  console.log(
    `  (d) ${s.year.padEnd(7)} investidura real: sí=${yes} no=${no} abst=${abst}${adjustment}`
  );
}

// ── 3. Tabla resumen ────────────────────────────────────────────────────────
const fmtViables = (ls: string[]) => (ls.length > 0 ? ls.join("+") : "bloqueo");
console.log("\nResumen por elección (veredicto y líderes viables):");
console.log("  Año      Veredicto    D'Hondt      Biprop");
for (const s of sims) {
  console.log(
    `  ${s.year.padEnd(7)}  ${s.verdict.padEnd(11)}  ${fmtViables(viableLeaders(s.dhondt)).padEnd(
      11
    )}  ${fmtViables(viableLeaders(s.biprop))}`
  );
  console.log(`           ${s.verdictText}`);
}

const counts: { [v: string]: number } = {};
for (const s of sims) counts[s.verdict] = (counts[s.verdict] || 0) + 1;
console.log(
  `\nVeredictos: ${Object.entries(counts)
    .map(([v, n]) => `${v}=${n}`)
    .join(", ")}`
);

if (failures > 0) {
  console.error(`\n${failures} comprobación(es) fallida(s)`);
  process.exit(1);
}
console.log("\nPASS: government-sim verificado");
