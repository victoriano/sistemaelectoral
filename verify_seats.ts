/**
 * verify_seats.ts — Regression harness for the D'Hondt "real system" reproduction.
 *
 * Recomputes every election (1993–2023) with dHondtByCircumscription() over
 * src/data/* and compares the national seat totals against the OFFICIAL
 * Congreso results (Ministerio del Interior historical record).
 *
 * Exit code 0  -> every diff is covered by KNOWN_DATA_ISSUES (or no diffs).
 * Exit code 1  -> any non-allowlisted diff, baseline error, or missing data.
 *
 * Run with: npm run verify   (= npx tsx verify_seats.ts)
 */

import { electionData } from "./src/data/all-elections";
import { PARTY_ALIASES } from "./src/data/party-aliases";
import { dHondtByCircumscription } from "./src/lib/electoral-methods";

type SeatMap = { [party: string]: number };

const TOTAL_SEATS = 350;

// ============================================================================
// OFFICIAL RESULTS — Congreso de los Diputados, by election.
// Source: Ministerio del Interior (infoelectoral.interior.gob.es).
// Every map MUST sum to exactly 350 (asserted at runtime).
//
// Canonical keys follow the historical attribution conventions of the MIR
// record: PP totals for 1993–2015 include the seats won by the PP–UPN
// coalition lists in Navarra; IU totals include its regional federations
// (EUPV, IC-V where they ran inside the IU candidacy).
// ============================================================================
const OFFICIAL: { [year: string]: SeatMap } = {
  "1993": {
    PSOE: 159, PP: 141, IU: 18, CiU: 17, PNV: 5, CCA: 4,
    HB: 2, ERC: 1, EA: 1, PAR: 1, UV: 1, CDS: 0,
  },
  "1996": {
    PP: 156, PSOE: 141, IU: 21, CiU: 16, PNV: 5, CCA: 4,
    BNG: 2, HB: 2, ERC: 1, EA: 1, UV: 1,
  },
  "2000": {
    PP: 183, PSOE: 125, CiU: 15, IU: 8, PNV: 7, CCA: 4,
    BNG: 3, PA: 1, ERC: 1, ICV: 1, EA: 1, CHA: 1,
  },
  "2004": {
    PSOE: 164, PP: 148, CiU: 10, ERC: 8, PNV: 7, IU: 5,
    CCA: 3, BNG: 2, CHA: 1, EA: 1, NABAI: 1,
  },
  "2008": {
    PSOE: 169, PP: 154, CiU: 10, PNV: 6, ERC: 3, IU: 2,
    BNG: 2, CCA: 2, UPyD: 1, NABAI: 1,
  },
  "2011": {
    PP: 186, PSOE: 110, CiU: 16, IU: 11, AMAIUR: 7, UPyD: 5,
    PNV: 5, ERC: 3, BNG: 2, CCA: 2, COMPROMIS: 1, FAC: 1, GBAI: 1,
  },
  "2015": {
    // PODEMOS includes the confluences (En Comú Podem, En Marea,
    // Compromís–Podemos–És el moment); IU = Unidad Popular.
    PP: 123, PSOE: 90, PODEMOS: 69, Cs: 40, ERC: 9, CDC: 8,
    PNV: 6, IU: 2, BILDU: 2, CCA: 1,
  },
  "2016": {
    // UP = Unidos Podemos including all confluences (ECP, A la valenciana,
    // En Marea): 45 + 12 + 9 + 5 = 71.
    PP: 137, PSOE: 85, UP: 71, Cs: 32, ERC: 9, CDC: 8,
    PNV: 5, BILDU: 2, CCA: 1,
  },
  "2019-A": {
    // UP = Unidas Podemos including En Comú Podem (35 + 7 = 42).
    // JUNTS = the JxCat lists (canonical key per src/data/party-aliases.ts).
    PSOE: 123, PP: 66, Cs: 57, UP: 42, VOX: 24, ERC: 15, JUNTS: 7,
    PNV: 6, BILDU: 4, CCA: 2, "NA+": 2, COMPROMIS: 1, PRC: 1,
  },
  "2019-N": {
    // UP = Unidas Podemos including En Comú Podem (28 + 7 = 35).
    // JUNTS = the JxCat lists (canonical key per src/data/party-aliases.ts).
    PSOE: 120, PP: 89, VOX: 52, UP: 35, ERC: 13, Cs: 10, JUNTS: 8,
    PNV: 6, BILDU: 5, CUP: 2, CCA: 2, "NA+": 2, MASPAIS: 2,
    COMPROMIS: 1, BNG: 1, PRC: 1, TERUEL: 1,
  },
  "2023": {
    PP: 137, PSOE: 121, VOX: 33, SUMAR: 31, ERC: 7, JUNTS: 7,
    BILDU: 6, PNV: 5, BNG: 1, CCA: 1, UPN: 1,
  },
};

// Elections present in the data but excluded from baseline checking.
const INFORMATIONAL: { [year: string]: string } = {
  "2027*": "projection from polls, no official result exists",
};

// Elections we could not state a confident 350-sum baseline for. None today.
const SKIPPED: { [year: string]: string } = {};

// ============================================================================
// LABEL ALIASES — data keys -> canonical keys used in OFFICIAL, per election.
// Aggregation: seats of every alias are summed into the canonical key.
//
// Identity-preserving renames and Podemos-confluence merges now live in the
// shared app layer (src/data/party-aliases.ts) and are applied at data load
// in all-elections.ts, so electionData already carries canonical keys. They
// are still merged in here (idempotent no-ops) as a safety net.
//
// COUNTING_ALIASES below are baseline-attribution merges ONLY: they map
// seats of a distinct party onto the party the MIR record credits them to
// (e.g. UPN seats -> PP for the PP–UPN joint lists). The app deliberately
// does NOT apply these, because they would erase parties the pactómetro
// treats as separate actors (UPN) or rewrite identity (BILDU vs AMAIUR).
// ============================================================================
const COUNTING_ALIASES: { [year: string]: { [dataKey: string]: string } } = {
  "1993": {
    UPN: "PP",          // PP–UPN coalition list in Navarra
    EUPV: "IU",         // IU federation in C. Valenciana
    "IC-V": "IU",       // Iniciativa per Catalunya (inside IU in 1993)
    "IU-EUPV": "IU",
  },
  "1996": {
    UPN: "PP",
    EUPV: "IU",
    "IC-V": "IU",
    "IU-EUPV": "IU",
  },
  "2000": {
    UPN: "PP",
    EUPV: "IU",
    "IC-V": "ICV",      // ICV ran on its own list in 2000 (1 seat)
  },
  "2004": {
    UPN: "PP",          // PP–UPN list in Navarra
    ENTESA: "IU",       // L'Entesa (EUPV) in C. Valenciana, inside IU's 5
    GBAI: "NABAI",      // Nafarroa Bai
  },
  "2008": {
    UPN: "PP",
    GBAI: "NABAI",
  },
  "2011": {
    UPN: "PP",
    EUPV: "IU",
    "CHA-IU": "IU",     // La Izquierda Plural (IU–LV) included CHA's seat
    BILDU: "AMAIUR",    // 2011 lists were Amaiur; data keys them as BILDU.
                        // Counting-specific: the app keeps showing BILDU.
  },
  "2015": {
    UPN: "PP",          // UPN–PP coalition list in Navarra
  },
  // 2016 / 2019-A / 2019-N / 2023: fully covered by PARTY_ALIASES (or
  // already canonical in the data files).
};

const ALIASES: { [year: string]: { [dataKey: string]: string } } = {};
for (const year of new Set([...Object.keys(PARTY_ALIASES), ...Object.keys(COUNTING_ALIASES)])) {
  ALIASES[year] = { ...PARTY_ALIASES[year], ...COUNTING_ALIASES[year] };
}

// ============================================================================
// KNOWN_DATA_ISSUES — allowlisted diffs (computed − official) caused by
// inaccuracies in src/data/* vote numbers. Any diff NOT listed here fails
// the run. Stale entries (diff disappeared) are reported as warnings.
// ============================================================================
const KNOWN_DATA_ISSUES: { [year: string]: SeatMap } = {
  // Empty: every election reproduces the official result exactly from
  // official infoelectoral data (2023 regenerated by scripts/fetch_2023.ts;
  // 1993, 2015 and 2019-N by scripts/fetch_historical.ts).
};

// ============================================================================
// Harness
// ============================================================================

function canonicalize(year: string, computed: SeatMap): SeatMap {
  const aliases = ALIASES[year] || {};
  const out: SeatMap = {};
  for (const [key, seats] of Object.entries(computed)) {
    if (seats === 0) continue;
    const canonical = aliases[key] || key;
    out[canonical] = (out[canonical] || 0) + seats;
  }
  return out;
}

let hardFailures = 0;
const statusTable: { year: string; status: string; detail: string }[] = [];

const years = Object.keys(electionData);

for (const year of years) {
  if (INFORMATIONAL[year] !== undefined) {
    statusTable.push({ year, status: "INFO", detail: INFORMATIONAL[year] });
    continue;
  }
  if (SKIPPED[year] !== undefined) {
    statusTable.push({ year, status: "SKIPPED", detail: SKIPPED[year] });
    continue;
  }

  const expected = OFFICIAL[year];
  if (!expected) {
    console.error(`ERROR ${year}: no official baseline defined`);
    hardFailures++;
    statusTable.push({ year, status: "FAIL", detail: "missing baseline" });
    continue;
  }

  // Baseline sanity: must sum to exactly 350.
  const expectedTotal = Object.values(expected).reduce((a, b) => a + b, 0);
  if (expectedTotal !== TOTAL_SEATS) {
    console.error(`ERROR ${year}: official baseline sums to ${expectedTotal}, expected ${TOTAL_SEATS}`);
    hardFailures++;
    statusTable.push({ year, status: "FAIL", detail: `baseline sums to ${expectedTotal}` });
    continue;
  }

  const data = electionData[year];
  // blankVotes matters: the LOREG 3% threshold is over VALID votes (candidacy
  // + blank). E.g. official 1993 Madrid: CDS had 3.02% of candidacy votes but
  // 2.99% of valid votes, so it was excluded and the seat went to PSOE.
  const result = dHondtByCircumscription(
    data.map(c => ({ name: c.name, seats: c.seats, votes: c.votes, blankVotes: c.blankVotes })),
    0.03
  );
  const computed = canonicalize(year, result.national);
  const computedTotal = Object.values(computed).reduce((a, b) => a + b, 0);

  const allowlist = KNOWN_DATA_ISSUES[year] || {};
  const parties = [...new Set([...Object.keys(expected), ...Object.keys(computed)])]
    .sort((a, b) => (expected[b] || 0) - (expected[a] || 0));

  const violations: string[] = [];
  const allowlisted: string[] = [];
  const lines: string[] = [];

  for (const p of parties) {
    const exp = expected[p] || 0;
    const comp = computed[p] || 0;
    const diff = comp - exp;
    if (diff === 0) continue;
    const tag = `${p} ${diff > 0 ? "+" : ""}${diff} (official ${exp}, computed ${comp})`;
    if (allowlist[p] === diff) {
      allowlisted.push(tag);
      lines.push(`    allowlisted: ${tag}`);
    } else {
      violations.push(tag);
      lines.push(`    VIOLATION:   ${tag}`);
    }
  }

  // Stale allowlist entries: listed diff no longer occurs.
  for (const [p, diff] of Object.entries(allowlist)) {
    const actual = (computed[p] || 0) - (expected[p] || 0);
    if (actual !== diff) {
      lines.push(`    WARNING: stale allowlist entry ${p} ${diff > 0 ? "+" : ""}${diff} (actual diff ${actual >= 0 ? "+" : ""}${actual}) — remove or update it`);
    }
  }

  if (computedTotal !== TOTAL_SEATS) {
    violations.push(`computed total = ${computedTotal}, expected ${TOTAL_SEATS}`);
    lines.push(`    VIOLATION:   computed seats sum to ${computedTotal}, expected ${TOTAL_SEATS}`);
  }

  let status: string;
  let detail: string;
  if (violations.length > 0) {
    status = "FAIL";
    detail = violations.join("; ");
    hardFailures++;
  } else if (allowlisted.length > 0) {
    status = "OK-with-allowlist";
    detail = allowlisted.map(t => t.split(" (")[0]).join(", ");
  } else {
    status = "OK";
    detail = "exact match with official results";
  }

  console.log(`\n=== ${year} [${status}] official ${expectedTotal} / computed ${computedTotal} ===`);
  for (const line of lines) console.log(line);
  if (lines.length === 0) console.log("    all parties match the official record");

  statusTable.push({ year, status, detail });
}

// ============================================================================
// Summary
// ============================================================================
console.log("\n" + "=".repeat(72));
console.log("SUMMARY");
console.log("=".repeat(72));
for (const row of statusTable) {
  console.log(`  ${row.year.padEnd(8)} ${row.status.padEnd(18)} ${row.detail}`);
}

if (hardFailures > 0) {
  console.log(`\nFAIL: ${hardFailures} election(s) with non-allowlisted deviations.`);
  process.exit(1);
} else {
  const withAllowlist = statusTable.filter(r => r.status === "OK-with-allowlist").length;
  const clean = statusTable.filter(r => r.status === "OK").length;
  console.log(`\nPASS: ${clean} election(s) match the official record exactly, ` +
    `${withAllowlist} pass via KNOWN_DATA_ISSUES allowlist. No unexpected deviations.`);
  process.exit(0);
}
