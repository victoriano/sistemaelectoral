/**
 * verify_biprop.ts — Verification harness for the biproportional (Zürich/
 * Pukelsheim) Stage 2 apportionment in src/lib/electoral-methods.ts.
 *
 * For EVERY dataset in src/data/all-elections.ts (including the 2027
 * projection) it runs the full pipeline (per-circumscription 3% quorum +
 * national Stage 1 D'Hondt + alternate-scaling Stage 2) and asserts:
 *   (a) every circumscription (row) sums to exactly its seat count;
 *   (b) every party (column) sums to its Stage 1 national seats;
 *   (c) the grand total is exactly 350;
 *   (d) the algorithm reports converged = true;
 *   (e) wall time per dataset is under 5 seconds.
 *
 * Exit code 0 -> all assertions hold for all datasets.
 * Exit code 1 -> any violation.
 *
 * Run with: npx tsx scripts/verify_biprop.ts   (= npm run verify:biprop)
 */

import { electionData } from "../src/data/all-elections";
import { gimeStage3, runGIME } from "../src/lib/electoral-methods";

const TOTAL_SEATS = 350;
const THRESHOLD = 0.03;
const MAX_MS = 5000;

let failures = 0;
const summary: { year: string; iterations: number; ms: number; status: string }[] = [];

const fail = (year: string, msg: string) => {
  console.error(`  FAIL ${year}: ${msg}`);
  failures++;
};

for (const year of Object.keys(electionData)) {
  const data = electionData[year];
  const circs = data.map(c => ({ name: c.name, seats: c.seats, votes: c.votes, blankVotes: c.blankVotes }));
  const declaredSeats = circs.reduce((s, c) => s + c.seats, 0);

  console.log(`\n=== ${year} (${circs.length} circumscriptions, ${declaredSeats} seats) ===`);
  if (declaredSeats !== TOTAL_SEATS) {
    fail(year, `circumscription seats sum to ${declaredSeats}, expected ${TOTAL_SEATS}`);
  }

  const t0 = performance.now();
  const stages = runGIME(circs, TOTAL_SEATS, 0, THRESHOLD);
  const ms = performance.now() - t0;

  const stage1 = stages.find(s => s.stage === 1)!;
  const stage2 = stages.find(s => s.stage === 2)!;
  const rows = stage2.circumscriptionAllocations || [];
  const yearFailuresBefore = failures;

  // (a) every row sums to its seat count
  if (rows.length !== circs.length) {
    fail(year, `expected ${circs.length} circumscription allocations, got ${rows.length}`);
  }
  for (const row of rows) {
    const sum = Object.values(row.allocation).reduce((a, b) => a + b, 0);
    if (sum !== row.seats) {
      fail(year, `row "${row.name}" sums to ${sum}, expected ${row.seats}`);
    }
  }

  // (b) every column sums to its Stage 1 national seats
  const colSums: { [party: string]: number } = {};
  for (const row of rows) {
    for (const [party, seats] of Object.entries(row.allocation)) {
      colSums[party] = (colSums[party] || 0) + seats;
    }
  }
  const allParties = Array.from(new Set([
    ...Object.keys(stage1.nationalAllocation),
    ...Object.keys(colSums),
  ]));
  for (const party of allParties) {
    const expected = stage1.nationalAllocation[party] || 0;
    const got = colSums[party] || 0;
    if (got !== expected) {
      fail(year, `party ${party} column sums to ${got}, Stage 1 national = ${expected}`);
    }
  }

  // (c) grand total = 350
  const grand = Object.values(colSums).reduce((a, b) => a + b, 0);
  if (grand !== TOTAL_SEATS) {
    fail(year, `grand total = ${grand}, expected ${TOTAL_SEATS}`);
  }

  // (d) converged
  if (stage2.converged !== true) {
    fail(year, `converged = ${stage2.converged} after ${stage2.iterations} iterations`);
  }

  // (e) wall time
  if (ms >= MAX_MS) {
    fail(year, `took ${ms.toFixed(0)} ms (limit ${MAX_MS} ms)`);
  }

  const ok = failures === yearFailuresBefore;
  console.log(
    `  iterations=${stage2.iterations}  converged=${stage2.converged}  ` +
    `total=${grand}  time=${ms.toFixed(1)}ms  ${ok ? "OK" : "FAIL"}`
  );

  // Sanity spotlight for 2023: Madrid row
  if (year === "2023") {
    const madrid = rows.find(r => r.name === "Madrid");
    if (madrid) {
      const sum = Object.values(madrid.allocation).reduce((a, b) => a + b, 0);
      console.log(`  2023 Madrid sanity: ${sum}/${madrid.seats} seats -> ` +
        Object.entries(madrid.allocation).map(([p, s]) => `${p} ${s}`).join(", "));
    }
  }

  summary.push({
    year,
    iterations: stage2.iterations || 0,
    ms,
    status: ok ? "OK" : "FAIL",
  });
}

// ============================================================
// Stage 3 (governability bonus) checks — 2023 and 2019-N,
// bonus in {0, 5, 10, 15}.
// Asserts: total = 350; winner gains exactly the bonus vs its Stage 2
// seats; no negative allocations; row sums equal circumscription seats;
// column sums equal post-bonus national totals; bonus=0 output is
// identical to Stage 2.
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("STAGE 3 (governability bonus) checks");
console.log("=".repeat(60));

for (const year of ["2023", "2019-N"]) {
  const data = electionData[year];
  const circs = data.map(c => ({ name: c.name, seats: c.seats, votes: c.votes, blankVotes: c.blankVotes }));

  for (const bonus of [0, 5, 10, 15]) {
    const label = `${year} bonus=${bonus}`;
    const labelFailuresBefore = failures;
    const stages = runGIME(circs, TOTAL_SEATS, bonus, THRESHOLD);
    const stage2 = stages.find(s => s.stage === 2)!;

    if (bonus === 0) {
      // runGIME omits Stage 3 when bonus = 0; calling gimeStage3 directly
      // must return the Stage 2 result object unchanged.
      if (stages.some(s => s.stage === 3)) {
        fail(label, "Stage 3 present in runGIME output despite bonus = 0");
      }
      const direct = gimeStage3(stage2, 0, circs);
      if (direct !== stage2) {
        fail(label, "gimeStage3(bonus=0) did not return the Stage 2 result unchanged");
      }
      console.log(`  ${label}: identical to Stage 2  OK`);
      continue;
    }

    const stage3 = stages.find(s => s.stage === 3);
    if (!stage3) {
      fail(label, "Stage 3 missing from runGIME output");
      continue;
    }
    const nat3 = stage3.nationalAllocation;
    const nat2 = stage2.nationalAllocation;

    // Total = 350, no negatives
    const total3 = Object.values(nat3).reduce((a, b) => a + b, 0);
    if (total3 !== TOTAL_SEATS) {
      fail(label, `Stage 3 national total = ${total3}, expected ${TOTAL_SEATS}`);
    }
    for (const [party, seats] of Object.entries(nat3)) {
      if (seats < 0) fail(label, `negative national allocation for ${party}: ${seats}`);
    }

    // Winner (most Stage 2 seats) gains exactly the bonus
    const winner = Object.entries(nat2).sort((a, b) => b[1] - a[1])[0][0];
    const gained = (nat3[winner] || 0) - (nat2[winner] || 0);
    if (gained !== bonus) {
      fail(label, `winner ${winner} gained ${gained} seats, expected exactly ${bonus}`);
    }
    // Reductions on the others must sum exactly to the bonus
    const removed = Object.keys(nat2)
      .filter(p => p !== winner)
      .reduce((s, p) => s + ((nat2[p] || 0) - (nat3[p] || 0)), 0);
    if (removed !== bonus) {
      fail(label, `reductions sum to ${removed}, expected exactly ${bonus}`);
    }

    // Provincial tables: rows sum to circumscription seats, no negatives,
    // columns sum to post-bonus national totals.
    const rows3 = stage3.circumscriptionAllocations || [];
    if (rows3.length !== circs.length) {
      fail(label, `expected ${circs.length} circumscription allocations, got ${rows3.length}`);
    }
    const colSums3: { [party: string]: number } = {};
    for (const row of rows3) {
      let rowSum = 0;
      for (const [party, seats] of Object.entries(row.allocation)) {
        if (seats < 0) fail(label, `negative allocation in ${row.name} for ${party}: ${seats}`);
        rowSum += seats;
        colSums3[party] = (colSums3[party] || 0) + seats;
      }
      if (rowSum !== row.seats) {
        fail(label, `row "${row.name}" sums to ${rowSum}, expected ${row.seats}`);
      }
    }
    const parties3 = Array.from(new Set([...Object.keys(nat3), ...Object.keys(colSums3)]));
    for (const party of parties3) {
      const expected = nat3[party] || 0;
      const got = colSums3[party] || 0;
      if (got !== expected) {
        fail(label, `party ${party} column sums to ${got}, post-bonus national = ${expected}`);
      }
    }
    if (stage3.converged !== true) {
      fail(label, `Stage 3 re-fit converged = ${stage3.converged} after ${stage3.iterations} iterations`);
    }

    console.log(
      `  ${label}: winner ${winner} +${gained}, total=${total3}, ` +
      `refit iterations=${stage3.iterations} converged=${stage3.converged}  ` +
      (failures === labelFailuresBefore ? "OK" : "FAIL")
    );
  }
}

console.log("\n" + "=".repeat(60));
console.log("SUMMARY (per-dataset iterations)");
console.log("=".repeat(60));
for (const row of summary) {
  console.log(
    `  ${row.year.padEnd(8)} ${row.status.padEnd(6)} ` +
    `iterations=${String(row.iterations).padEnd(4)} time=${row.ms.toFixed(1)}ms`
  );
}

if (failures > 0) {
  console.log(`\nFAIL: ${failures} violation(s).`);
  process.exit(1);
} else {
  console.log(`\nPASS: all ${summary.length} datasets satisfy both marginals, total 350, converged, <5s.`);
  process.exit(0);
}
