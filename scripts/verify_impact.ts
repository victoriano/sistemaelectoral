/**
 * Verifica los agregados de la pestaña Impacto (src/lib/impact-stats.ts):
 * - ambos métodos reparten exactamente los 350 escaños en todas las elecciones
 * - las diferencias por partido suman cero
 * - el biproporcional no empeora el índice de Gallagher
 * - los porcentajes de votos sin escaño están en rango y el biproporcional reduce
 *
 * Uso: npx tsx scripts/verify_impact.ts  (exit 1 si algo falla)
 */
import { computeImpactSummary } from "../src/lib/impact-stats";

let failures = 0;
function check(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error(`FAIL: ${msg}`);
  }
}

const summary = computeImpactSummary();

check(summary.elections.length === 11, `esperaba 11 elecciones reales, hay ${summary.elections.length}`);

for (const e of summary.elections) {
  const totalD = Object.values(e.dhondt).reduce((a, b) => a + b, 0);
  const totalB = Object.values(e.biprop).reduce((a, b) => a + b, 0);
  const diffSum = Object.values(e.diff).reduce((a, b) => a + b, 0);

  check(totalD === 350, `${e.year}: D'Hondt reparte ${totalD} escaños (≠350)`);
  check(totalB === 350, `${e.year}: biproporcional reparte ${totalB} escaños (≠350)`);
  check(diffSum === 0, `${e.year}: las diferencias suman ${diffSum} (≠0)`);
  check(e.seatsMoved > 0, `${e.year}: 0 escaños cambian de manos (sospechoso)`);
  check(
    e.gallagherBiprop < e.gallagherDHondt,
    `${e.year}: Gallagher biprop ${e.gallagherBiprop.toFixed(2)} >= D'Hondt ${e.gallagherDHondt.toFixed(2)}`
  );
  check(
    e.wastedDHondtPct > 0 && e.wastedDHondtPct < 100,
    `${e.year}: % votos sin escaño D'Hondt fuera de rango: ${e.wastedDHondtPct}`
  );
  check(
    e.wastedBipropPct >= 0 && e.wastedBipropPct < e.wastedDHondtPct,
    `${e.year}: % sin escaño biprop ${e.wastedBipropPct.toFixed(1)} no mejora a D'Hondt ${e.wastedDHondtPct.toFixed(1)}`
  );
}

const totalDiff = Object.values(summary.totalDiffByParty).reduce((a, b) => a + b, 0);
check(totalDiff === 0, `diff agregado por partido suma ${totalDiff} (≠0)`);
check(summary.electionsImproved === 11, `solo ${summary.electionsImproved}/11 elecciones mejoran Gallagher`);

console.log("\nResumen por elección:");
for (const e of summary.elections) {
  console.log(
    `  ${e.year.padEnd(7)} movidos=${String(e.seatsMoved).padStart(2)}  ` +
      `Gallagher ${e.gallagherDHondt.toFixed(2)} → ${e.gallagherBiprop.toFixed(2)}  ` +
      `sin escaño ${e.wastedDHondtPct.toFixed(1)}% → ${e.wastedBipropPct.toFixed(1)}%`
  );
}
console.log(`\nTotal escaños que cambian de manos: ${summary.totalSeatsMoved}`);
const sortedDiff = Object.entries(summary.totalDiffByParty).sort((a, b) => b[1] - a[1]);
console.log(`Mayores ganadores: ${sortedDiff.slice(0, 5).map(([p, d]) => `${p} +${d}`).join(", ")}`);
console.log(`Mayores perdedores: ${sortedDiff.slice(-3).map(([p, d]) => `${p} ${d}`).join(", ")}`);

if (failures > 0) {
  console.error(`\n${failures} comprobación(es) fallida(s)`);
  process.exit(1);
}
console.log("\nPASS: impact-stats verificado");
