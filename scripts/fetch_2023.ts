/**
 * fetch_2023.ts — Regenerates src/data/elections2023.ts and
 * src/data/elections2027.ts from the OFFICIAL Ministerio del Interior
 * (infoelectoral) dataset for the 23 July 2023 Congreso election.
 *
 * Source dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02202307_TOTA.zip
 *   - 03022307.DAT  candidacy register (code, siglas, national accumulation code)
 *   - 07022307.DAT  per-ambit summary (census, blank/null/candidacy votes, seats)
 *   - 08022307.DAT  per-ambit candidacy votes and elected counts
 *   (fixed-width DAT format documented in the bundled FICHEROS.doc)
 *
 * What it does:
 *   1. Downloads + unzips the dataset into a temp dir (cached across runs).
 *   2. Parses the 52 provincial circumscriptions: every candidacy's votes
 *      (aggregated by the MIR *national accumulation code*, so PSC -> PSOE,
 *      SUMAR-ECP / SUMAR-COMPROMÍS / SUMAR MÉS -> SUMAR, etc.) plus the
 *      official blank votes per province.
 *   3. Validates internal consistency (province sums == file 07 totals ==
 *      national rows of file 08; elected counts == official 350 outcome;
 *      seats per province == expected apportionment).
 *   4. Writes src/data/elections2023.ts (official data, same export shape).
 *   5. Writes src/data/elections2027.ts: hypothetical projection that keeps
 *      the NATIONAL vote-share targets implied by the previous 2027 file
 *      (poll averages, Feb 2026) but distributes each party's votes across
 *      provinces with the OFFICIAL 2023 geography (uniform national swing).
 *
 * Run with: npx tsx scripts/fetch_2023.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

const ZIP_URL =
  "https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02202307_TOTA.zip";
const RETRIEVAL_DATE = "2026-06-12";

// ---------------------------------------------------------------------------
// 1. Download + unzip (cached)
// ---------------------------------------------------------------------------
const workDir = path.join(os.tmpdir(), "infoelectoral_02202307_TOTA");
const datFiles = ["03022307.DAT", "07022307.DAT", "08022307.DAT"];
if (!datFiles.every(f => fs.existsSync(path.join(workDir, f)))) {
  fs.mkdirSync(workDir, { recursive: true });
  const zipPath = path.join(workDir, "TOTA.zip");
  console.log(`Downloading ${ZIP_URL} ...`);
  // The MIR server resets connections without a browser-like User-Agent.
  execSync(
    `curl -sS -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" -o "${zipPath}" "${ZIP_URL}"`,
    { stdio: "inherit" }
  );
  execSync(`unzip -o "${zipPath}" -d "${workDir}"`, { stdio: "inherit" });
}

const readDat = (f: string): string[] =>
  fs
    .readFileSync(path.join(workDir, f), "latin1")
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0);

// ---------------------------------------------------------------------------
// 2. Parse
// ---------------------------------------------------------------------------

// File 03: candidacy register.
interface Candidacy {
  code: string;
  siglas: string;
  accNac: string; // national accumulation candidacy code
}
const candidacies: { [code: string]: Candidacy } = {};
for (const l of readDat("03022307.DAT")) {
  candidacies[l.slice(8, 14)] = {
    code: l.slice(8, 14),
    siglas: l.slice(14, 64).trim(),
    accNac: l.slice(226, 232),
  };
}

// File 07: per-ambit summary -> blank votes, candidacy votes, seats.
interface ProvinceSummary {
  blank: number;
  nullVotes: number;
  candidacyVotes: number;
  seats: number;
  datName: string;
}
const summaries: { [provCode: string]: ProvinceSummary } = {};
for (const l of readDat("07022307.DAT")) {
  const prov = l.slice(11, 13);
  if (prov === "99") continue; // community / national totals
  summaries[prov] = {
    datName: l.slice(14, 64).trim(),
    blank: parseInt(l.slice(125, 133), 10),
    nullVotes: parseInt(l.slice(133, 141), 10),
    candidacyVotes: parseInt(l.slice(141, 149), 10),
    seats: parseInt(l.slice(149, 155), 10),
  };
}

// File 08: candidacy votes + elected per ambit.
interface VoteRow {
  com: string;
  prov: string;
  cand: string;
  votes: number;
  elected: number;
}
const voteRows: VoteRow[] = readDat("08022307.DAT").map(l => ({
  com: l.slice(9, 11),
  prov: l.slice(11, 13),
  cand: l.slice(14, 20),
  votes: parseInt(l.slice(20, 28), 10),
  elected: parseInt(l.slice(28, 33), 10),
}));

// Canonical party keys (see src/data/party-aliases.ts) for the siglas of the
// national-accumulation candidacies; everything else keeps its siglas.
const SIGLAS_TO_KEY: { [siglas: string]: string } = {
  "JxCAT - JUNTS": "JUNTS",
  "EH Bildu": "BILDU",
  "EAJ-PNV": "PNV",
  "B.N.G.": "BNG",
  CCa: "CCA",
  "U.P.N.": "UPN",
  "CUP-PR": "CUP",
};
const keyOf = (candCode: string): string => {
  const nac = candidacies[candCode]?.accNac ?? candCode;
  const siglas = candidacies[nac]?.siglas ?? candidacies[candCode]?.siglas ?? candCode;
  return SIGLAS_TO_KEY[siglas] ?? siglas;
};

// Province register: MIR/INE code -> app name, shortName, region and the
// expected (fixed) seat apportionment of the July 2023 election.
interface ProvinceDef {
  code: string;
  name: string;
  shortName: string;
  seats: number;
  region: string;
}
const PROVINCES: ProvinceDef[] = [
  { code: "04", name: "Almería", shortName: "ALM", seats: 6, region: "ANDALUCÍA (61 escaños)" },
  { code: "11", name: "Cádiz", shortName: "CAD", seats: 9, region: "" },
  { code: "14", name: "Córdoba", shortName: "COR", seats: 6, region: "" },
  { code: "18", name: "Granada", shortName: "GRA", seats: 7, region: "" },
  { code: "21", name: "Huelva", shortName: "HUE", seats: 5, region: "" },
  { code: "23", name: "Jaén", shortName: "JAE", seats: 5, region: "" },
  { code: "29", name: "Málaga", shortName: "MAL", seats: 11, region: "" },
  { code: "41", name: "Sevilla", shortName: "SEV", seats: 12, region: "" },
  { code: "22", name: "Huesca", shortName: "HUE", seats: 3, region: "ARAGÓN (13 escaños)" },
  { code: "44", name: "Teruel", shortName: "TER", seats: 3, region: "" },
  { code: "50", name: "Zaragoza", shortName: "ZAR", seats: 7, region: "" },
  { code: "33", name: "Asturias", shortName: "AST", seats: 7, region: "ASTURIAS (7 escaños)" },
  { code: "07", name: "Islas Baleares", shortName: "BAL", seats: 8, region: "BALEARES (8 escaños)" },
  { code: "35", name: "Las Palmas", shortName: "LPA", seats: 8, region: "CANARIAS (15 escaños)" },
  { code: "38", name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, region: "" },
  { code: "39", name: "Cantabria", shortName: "CAN", seats: 5, region: "CANTABRIA (5 escaños)" },
  { code: "05", name: "Ávila", shortName: "AVI", seats: 3, region: "CASTILLA Y LEÓN (31 escaños)" },
  { code: "09", name: "Burgos", shortName: "BUR", seats: 4, region: "" },
  { code: "24", name: "León", shortName: "LEO", seats: 4, region: "" },
  { code: "34", name: "Palencia", shortName: "PAL", seats: 3, region: "" },
  { code: "37", name: "Salamanca", shortName: "SAL", seats: 4, region: "" },
  { code: "40", name: "Segovia", shortName: "SEG", seats: 3, region: "" },
  { code: "42", name: "Soria", shortName: "SOR", seats: 2, region: "" },
  { code: "47", name: "Valladolid", shortName: "VAL", seats: 5, region: "" },
  { code: "49", name: "Zamora", shortName: "ZAM", seats: 3, region: "" },
  { code: "02", name: "Albacete", shortName: "ALB", seats: 4, region: "CASTILLA-LA MANCHA (21 escaños)" },
  { code: "13", name: "Ciudad Real", shortName: "CRE", seats: 5, region: "" },
  { code: "16", name: "Cuenca", shortName: "CUE", seats: 3, region: "" },
  { code: "19", name: "Guadalajara", shortName: "GUA", seats: 3, region: "" },
  { code: "45", name: "Toledo", shortName: "TOL", seats: 6, region: "" },
  { code: "08", name: "Barcelona", shortName: "BCN", seats: 32, region: "CATALUÑA (48 escaños)" },
  { code: "17", name: "Girona", shortName: "GIR", seats: 6, region: "" },
  { code: "25", name: "Lleida", shortName: "LLE", seats: 4, region: "" },
  { code: "43", name: "Tarragona", shortName: "TAR", seats: 6, region: "" },
  { code: "03", name: "Alicante", shortName: "ALI", seats: 12, region: "COMUNIDAD VALENCIANA (32 escaños)" },
  { code: "12", name: "Castellón", shortName: "CAS", seats: 5, region: "" },
  { code: "46", name: "Valencia", shortName: "VAL", seats: 16, region: "" },
  { code: "06", name: "Badajoz", shortName: "BAD", seats: 5, region: "EXTREMADURA (10 escaños)" },
  { code: "10", name: "Cáceres", shortName: "CAC", seats: 4, region: "" },
  { code: "15", name: "A Coruña", shortName: "COR", seats: 8, region: "GALICIA (23 escaños)" },
  { code: "27", name: "Lugo", shortName: "LUG", seats: 4, region: "" },
  { code: "32", name: "Ourense", shortName: "OUR", seats: 4, region: "" },
  { code: "36", name: "Pontevedra", shortName: "PON", seats: 7, region: "" },
  { code: "26", name: "La Rioja", shortName: "RIO", seats: 4, region: "LA RIOJA (4 escaños)" },
  { code: "28", name: "Madrid", shortName: "MAD", seats: 37, region: "MADRID (37 escaños)" },
  { code: "30", name: "Murcia", shortName: "MUR", seats: 10, region: "MURCIA (10 escaños)" },
  { code: "31", name: "Navarra", shortName: "NAV", seats: 5, region: "NAVARRA (5 escaños)" },
  { code: "01", name: "Álava", shortName: "ALA", seats: 4, region: "PAÍS VASCO (18 escaños)" },
  { code: "20", name: "Guipúzcoa", shortName: "GUI", seats: 6, region: "" },
  { code: "48", name: "Vizcaya", shortName: "VIZ", seats: 8, region: "" },
  { code: "51", name: "Ceuta", shortName: "CEU", seats: 1, region: "CEUTA (1 escaño)" },
  { code: "52", name: "Melilla", shortName: "MEL", seats: 1, region: "MELILLA (1 escaño)" },
];

interface ProvinceData extends ProvinceDef {
  votes: { [key: string]: number };
  elected: { [key: string]: number };
  blankVotes: number;
}

const provinces: ProvinceData[] = PROVINCES.map(def => {
  const summary = summaries[def.code];
  if (!summary) throw new Error(`No file-07 summary for province ${def.code} ${def.name}`);
  const votes: { [key: string]: number } = {};
  const elected: { [key: string]: number } = {};
  for (const r of voteRows) {
    if (r.prov !== def.code || r.com === "99") continue;
    const key = keyOf(r.cand);
    votes[key] = (votes[key] || 0) + r.votes;
    elected[key] = (elected[key] || 0) + r.elected;
  }
  return { ...def, votes, elected, blankVotes: summary.blank };
});

// ---------------------------------------------------------------------------
// 3. Validate
// ---------------------------------------------------------------------------
let errors = 0;
const fail = (msg: string) => {
  console.error(`VALIDATION FAIL: ${msg}`);
  errors++;
};

// (a) seats per province match both the dataset and the expected apportionment
for (const p of provinces) {
  const s = summaries[p.code];
  if (s.seats !== p.seats) fail(`${p.name}: file-07 seats ${s.seats} != expected ${p.seats}`);
  const sum = Object.values(p.votes).reduce((a, b) => a + b, 0);
  if (sum !== s.candidacyVotes)
    fail(`${p.name}: sum of candidacy votes ${sum} != file-07 total ${s.candidacyVotes}`);
}

// (b) elected counts reproduce the official 350 outcome exactly
const OFFICIAL_SEATS: { [key: string]: number } = {
  PP: 137, PSOE: 121, VOX: 33, SUMAR: 31, ERC: 7, JUNTS: 7,
  BILDU: 6, PNV: 5, BNG: 1, CCA: 1, UPN: 1,
};
const electedNational: { [key: string]: number } = {};
for (const p of provinces)
  for (const [k, v] of Object.entries(p.elected))
    if (v > 0) electedNational[k] = (electedNational[k] || 0) + v;
for (const k of Array.from(new Set(Object.keys(OFFICIAL_SEATS).concat(Object.keys(electedNational))))) {
  if ((OFFICIAL_SEATS[k] || 0) !== (electedNational[k] || 0))
    fail(`elected ${k}: dataset ${electedNational[k] || 0} != official ${OFFICIAL_SEATS[k] || 0}`);
}

// (c) national per-party sums match the dataset's own national rows (com=99)
const nationalRows: { [key: string]: number } = {};
for (const r of voteRows) {
  if (r.com !== "99" || r.prov !== "99") continue;
  const key = keyOf(r.cand);
  nationalRows[key] = (nationalRows[key] || 0) + r.votes;
}
const nationalSums: { [key: string]: number } = {};
for (const p of provinces)
  for (const [k, v] of Object.entries(p.votes)) nationalSums[k] = (nationalSums[k] || 0) + v;
for (const k of Array.from(new Set(Object.keys(nationalRows).concat(Object.keys(nationalSums))))) {
  if ((nationalRows[k] || 0) !== (nationalSums[k] || 0))
    fail(`national ${k}: province sum ${nationalSums[k] || 0} != national row ${nationalRows[k] || 0}`);
}

const totalCandidacyVotes = Object.values(nationalSums).reduce((a, b) => a + b, 0);
console.log(`Total candidacy votes (52 provinces): ${totalCandidacyVotes}`);
console.log(`National sums: PP ${nationalSums.PP}, PSOE ${nationalSums.PSOE}, VOX ${nationalSums.VOX}, SUMAR ${nationalSums.SUMAR}`);

if (errors > 0) {
  console.error(`\n${errors} validation error(s); not writing any files.`);
  process.exit(1);
}
console.log("All validations passed.\n");

// ---------------------------------------------------------------------------
// 4. Emit src/data/elections2023.ts
// ---------------------------------------------------------------------------
const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const quoteKey = (k: string) => (IDENT_RE.test(k) ? k : JSON.stringify(k));
const votesLiteral = (votes: { [k: string]: number }) =>
  Object.entries(votes)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${quoteKey(k)}: ${v}`)
    .join(", ");

const repoRoot = path.resolve(__dirname, "..");

const provinceBlocks2023 = provinces
  .map(p => {
    const regionComment = p.region ? `\n  // ${p.region}\n` : "\n";
    return (
      regionComment +
      `  {\n` +
      `    name: ${JSON.stringify(p.name)},\n` +
      `    shortName: ${JSON.stringify(p.shortName)},\n` +
      `    seats: ${p.seats},\n` +
      `    blankVotes: ${p.blankVotes},\n` +
      `    votes: { ${votesLiteral(p.votes)} }\n` +
      `  },`
    );
  })
  .join("");

const file2023 = `// Datos OFICIALES de las Elecciones Generales de España 2023 (23 de julio)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: ${ZIP_URL}
//   Ficheros: 08022307.DAT (votos y electos por candidatura y provincia),
//             07022307.DAT (resumen provincial: votos en blanco, escaños),
//             03022307.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: ${RETRIEVAL_DATE}. Regenerable con: npx tsx scripts/fetch_2023.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Cada circunscripción incluye TODAS las candidaturas con voto > 0, agregadas
// por el código de acumulación nacional del MIR (PSC→PSOE; SUMAR-ECP,
// SUMAR-COMPROMÍS y SUMAR MÉS→SUMAR; etc.), más los votos en blanco
// (blankVotes), de modo que el denominador de la barrera del 3% (votos
// válidos) es el oficial. Claves canónicas según src/data/party-aliases.ts.
//
// Verificación: la suma nacional por partido coincide con las filas
// nacionales del propio fichero 08 (PP 8.160.837, PSOE 7.821.718,
// VOX 3.057.000, SUMAR 3.044.996) y los diputados electos del fichero
// reproducen exactamente el resultado oficial (PP 137, PSOE 121, VOX 33,
// SUMAR 31, ERC 7, JUNTS 7, BILDU 6, PNV 5, BNG 1, CCA 1, UPN 1 = 350).

export interface CircunscripcionData {
  name: string;
  shortName: string;
  seats: number;
  votes: { [party: string]: number };
  /** Votos en blanco oficiales (cuentan como voto válido para la barrera del 3%). */
  blankVotes?: number;
}

export interface PartyInfo {
  name: string;
  shortName: string;
  color: string;
  national: boolean;
}

export const parties: { [key: string]: PartyInfo } = {
  PP: { name: "Partido Popular", shortName: "PP", color: "#0056a3", national: true },
  PSOE: { name: "Partido Socialista Obrero Español", shortName: "PSOE", color: "#e30613", national: true },
  VOX: { name: "VOX", shortName: "VOX", color: "#63be21", national: true },
  SUMAR: { name: "Sumar", shortName: "SUMAR", color: "#e51c55", national: true },
  ERC: { name: "Esquerra Republicana de Catalunya", shortName: "ERC", color: "#ffb400", national: false },
  JUNTS: { name: "Junts per Catalunya", shortName: "JUNTS", color: "#00b2a9", national: false },
  PNV: { name: "Partido Nacionalista Vasco", shortName: "PNV", color: "#008000", national: false },
  BILDU: { name: "EH Bildu", shortName: "BILDU", color: "#b5cf00", national: false },
  BNG: { name: "Bloque Nacionalista Galego", shortName: "BNG", color: "#76b6de", national: false },
  CCA: { name: "Coalición Canaria", shortName: "CC", color: "#ffcc00", national: false },
  UPN: { name: "Unión del Pueblo Navarro", shortName: "UPN", color: "#0070b8", national: false },
};

// Todas las 52 circunscripciones con datos oficiales de 2023
export const circunscripciones: CircunscripcionData[] = [${provinceBlocks2023}
];

// Resultados reales 2023 (escaños obtenidos con el sistema actual)
export const realResults2023: { [party: string]: number } = {
  PP: 137,
  PSOE: 121,
  VOX: 33,
  SUMAR: 31,
  ERC: 7,
  JUNTS: 7,
  PNV: 5,
  BILDU: 6,
  BNG: 1,
  CCA: 1,
  UPN: 1,
};

// Total de escaños en el Congreso
export const totalSeats = 350;

// Calcular totales nacionales desde las circunscripciones
export function calculateNationalTotals(circumscriptions: CircunscripcionData[]): { [party: string]: number } {
  const totals: { [party: string]: number } = {};

  for (const circ of circumscriptions) {
    for (const [party, votes] of Object.entries(circ.votes)) {
      totals[party] = (totals[party] || 0) + votes;
    }
  }

  return totals;
}
`;

fs.writeFileSync(path.join(repoRoot, "src/data/elections2023.ts"), file2023);
console.log("Wrote src/data/elections2023.ts");

// ---------------------------------------------------------------------------
// 5. Emit src/data/elections2027.ts (uniform-swing projection)
// ---------------------------------------------------------------------------
// National vote-share targets implied by the previous elections2027.ts
// (poll averages of Feb 2026: Ateneo del Dato, Target Point, NC Report,
// Sociométrica, 40dB). Computed as oldVotes / oldTotal (oldTotal 20,836,183)
// before that file was regenerated.
const OLD_2027_NATIONAL: { [key: string]: number } = {
  PP: 6824745,
  PSOE: 5737499,
  VOX: 4152483,
  SUMAR: 1462756,
  Podemos: 860183,
  ERC: 488325,
  JUNTS: 414560,
  BILDU: 351149,
  PNV: 290544,
  BNG: 110196,
  CCA: 93739,
  UPN: 50004,
};
const OLD_2027_TOTAL = Object.values(OLD_2027_NATIONAL).reduce((a, b) => a + b, 0);

// Geography donor in the official 2023 data for each projected party.
// Podemos (split from the Sumar coalition after 2023) reuses SUMAR's 2023
// geographic pattern, as the previous projection did.
const GEO_DONOR: { [key: string]: string } = { Podemos: "SUMAR" };

const projected2027: { name: string; shortName: string; seats: number; region: string; blankVotes: number; votes: { [k: string]: number } }[] =
  provinces.map(p => {
    const votes: { [k: string]: number } = {};
    for (const [party, oldVotes] of Object.entries(OLD_2027_NATIONAL)) {
      const donor = GEO_DONOR[party] ?? party;
      const donorNational = nationalSums[donor] || 0;
      const donorProv = p.votes[donor] || 0;
      if (donorNational === 0 || donorProv === 0) continue;
      const targetShare = oldVotes / OLD_2027_TOTAL;
      const targetNational = targetShare * totalCandidacyVotes;
      const v = Math.round(donorProv * (targetNational / donorNational));
      if (v > 0) votes[party] = v;
    }
    return { name: p.name, shortName: p.shortName, seats: p.seats, region: p.region, blankVotes: p.blankVotes, votes };
  });

const provinceBlocks2027 = projected2027
  .map(p => {
    const regionComment = p.region ? `\n  // ${p.region}\n` : "\n";
    return (
      regionComment +
      `  {\n` +
      `    name: ${JSON.stringify(p.name)},\n` +
      `    shortName: ${JSON.stringify(p.shortName)},\n` +
      `    seats: ${p.seats},\n` +
      `    blankVotes: ${p.blankVotes},\n` +
      `    votes: { ${votesLiteral(p.votes)} }\n` +
      `  },`
    );
  })
  .join("");

const sharesDoc = Object.entries(OLD_2027_NATIONAL)
  .map(([k, v]) => `//   ${k.padEnd(8)} ${((100 * v) / OLD_2027_TOTAL).toFixed(2)}%`)
  .join("\n");

const file2027 = `// Proyección electoral 2027 basada en promedios de encuestas (febrero 2026)
// Fuentes de las encuestas: Ateneo del Dato, Target Point, NC Report,
// Sociométrica, 40dB.
//
// Metodología (swing nacional uniforme sobre la geografía oficial de 2023):
//   1. Objetivo nacional de cada partido = cuota de voto implícita en la
//      proyección original (promedio de encuestas de febrero 2026):
${sharesDoc}
//   2. Voto provincial = voto oficial 2023 del partido en la provincia
//      × (objetivo nacional / total oficial 2023 del partido).
//      Los votos de Podemos se reparten con el patrón geográfico de SUMAR
//      2023 (Podemos concurrió dentro de Sumar en 2023).
//   3. Se asume la misma participación total que en 2023 (los objetivos son
//      cuotas sobre el total oficial de votos a candidaturas de 2023:
//      24.487.414) y los mismos votos en blanco provinciales que en 2023.
//   4. Los partidos menores de 2023 (PACMA, CUP, FO, ...) no se proyectan.
//
// Datos 2023 de base: Ministerio del Interior — infoelectoral
//   ${ZIP_URL} (descargado ${RETRIEVAL_DATE})
// Regenerable con: npx tsx scripts/fetch_2023.ts
//
// * NOTA: Esta proyección es una estimación educativa.

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2027: CircunscripcionData[] = [${provinceBlocks2027}
];
`;

fs.writeFileSync(path.join(repoRoot, "src/data/elections2027.ts"), file2027);
console.log("Wrote src/data/elections2027.ts");

// Summary of projected national totals
const projNational: { [k: string]: number } = {};
let projTotal = 0;
for (const p of projected2027)
  for (const [k, v] of Object.entries(p.votes)) {
    projNational[k] = (projNational[k] || 0) + v;
    projTotal += v;
  }
console.log(`2027 projection total votes: ${projTotal} (2023 official: ${totalCandidacyVotes})`);
for (const [k, v] of Object.entries(projNational).sort((a, b) => b[1] - a[1]))
  console.log(`  ${k.padEnd(10)} ${String(v).padStart(9)}  ${((100 * v) / projTotal).toFixed(2)}%`);
