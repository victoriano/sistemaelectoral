/**
 * verify_rules.ts — Rule-level assertions for the electoral methods (W3).
 *
 * Checks:
 *  (a) Biproportional Stage 1 (2023): per-circumscription eligibility quorum
 *      means ERC, JUNTS, PNV, BILDU and BNG all get >0 national seats, and
 *      the Stage 1 national total is exactly 350.
 *  (b) D'Hondt with a 10% threshold (2023): no seats are silently lost —
 *      national total is still exactly 350 (fallback guard).
 *  (c) Tie-break (LOREG 163.1.d): on an exact quotient tie the seat goes to
 *      the party with more total votes in the circumscription, regardless of
 *      data insertion order.
 *
 * Exit 0 on success, exit 1 (with message) on any failed assertion.
 * Run with: npx tsx scripts/verify_rules.ts
 */

import { electionData } from "../src/data/all-elections";
import { dHondt, dHondtByCircumscription, runGIME } from "../src/lib/electoral-methods";

let failures = 0;

function check(name: string, cond: boolean, detail: string) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    console.error(`  FAIL  ${name} — ${detail}`);
    failures++;
  }
}

const TOTAL_SEATS = 350;
// Build engine input exactly the way the app (Simulator.tsx) does:
// include blankVotes so the 3% threshold uses valid votes (candidacies + blanks).
const appInput = (year: string) => electionData[year].map(c => ({
  name: c.name,
  seats: c.seats,
  votes: c.votes,
  blankVotes: c.blankVotes,
}));
const data2023 = appInput("2023");

// ===========================================================================
// (a) Biprop Stage 1, 2023: regional parties eligible via per-circ quorum
// ===========================================================================
console.log("\n(a) Biproportional Stage 1 — 2023, threshold 3%");
const stages = runGIME(data2023, TOTAL_SEATS, 0, 0.03);
const stage1 = stages[0].nationalAllocation;
const stage1Total = Object.values(stage1).reduce((s, v) => s + v, 0);

check("Stage 1 national total = 350", stage1Total === TOTAL_SEATS,
  `total is ${stage1Total}`);

for (const party of ["ERC", "JUNTS", "PNV", "BILDU", "BNG"]) {
  const seats = stage1[party] || 0;
  check(`${party} > 0 national seats in Stage 1`, seats > 0,
    `${party} got ${seats} seats`);
}

console.log("  Stage 1 (2023) national allocation:",
  JSON.stringify(Object.fromEntries(
    Object.entries(stage1).filter(([, s]) => s > 0).sort((x, y) => y[1] - x[1])
  )));

// ===========================================================================
// (b) D'Hondt with 10% threshold, 2023: total still 350 (no lost seats)
// ===========================================================================
console.log("\n(b) D'Hondt — 2023, threshold 10%");
const dh10 = dHondtByCircumscription(data2023, 0.10);
const dh10Total = Object.values(dh10.national).reduce((s, v) => s + v, 0);
check("D'Hondt @10% national total = 350", dh10Total === TOTAL_SEATS,
  `total is ${dh10Total}`);

// ===========================================================================
// (c) Tie-break: equal quotient -> party with more total votes wins
// ===========================================================================
console.log("\n(c) Tie-break sanity (LOREG 163.1.d)");
// A=200, B=100, 2 seats. Seat 1: A (200 > 100). Seat 2: exact quotient tie
// 200/2 = 100/1 = 100 -> must go to A (more total votes in the circ).
const tieAB = dHondt({ A: 200, B: 100 }, 2, 0).allocation;
check("tie goes to higher-vote party (A first in data)",
  tieAB["A"] === 2 && tieAB["B"] === 0,
  `allocation ${JSON.stringify(tieAB)}`);

// Same case with reversed insertion order: result must be identical
// (tie-break must not depend on data order when votes differ).
const tieBA = dHondt({ B: 100, A: 200 }, 2, 0).allocation;
check("tie goes to higher-vote party (B first in data)",
  tieBA["A"] === 2 && tieBA["B"] === 0,
  `allocation ${JSON.stringify(tieBA)}`);

// ===========================================================================
// (d) App parity, 1993: with blankVotes in the engine input (as the app
//     builds it), D'Hondt @3% must reproduce the official result —
//     PSOE 159 / CDS 0 nationally (Madrid CDS = 3.02% of candidacy votes
//     but 2.99% of valid votes, so it falls below the LOREG threshold).
// ===========================================================================
console.log("\n(d) App parity — 1993 D'Hondt @3% with blankVotes");
const dh1993 = dHondtByCircumscription(appInput("1993"), 0.03);
check("1993 PSOE national seats = 159", (dh1993.national["PSOE"] || 0) === 159,
  `PSOE got ${dh1993.national["PSOE"] || 0}`);
check("1993 CDS national seats = 0", (dh1993.national["CDS"] || 0) === 0,
  `CDS got ${dh1993.national["CDS"] || 0}`);

// ===========================================================================
console.log("");
if (failures > 0) {
  console.error(`FAIL: ${failures} assertion(s) failed.`);
  process.exit(1);
}
console.log("PASS: all rule assertions hold.");
process.exit(0);
