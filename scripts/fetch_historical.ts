/**
 * fetch_historical.ts — Regenerates every historical src/data/electionsYYYY.ts
 * (1993–2019N, except 2023 which has its own scripts/fetch_2023.ts) from the
 * OFFICIAL Ministerio del Interior (infoelectoral) datasets.
 *
 * Source datasets (fixed-width DAT format documented in FICHEROS.doc):
 *   1993   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02199306_TOTA.zip
 *   1996   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02199603_TOTA.zip
 *   2000   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02200003_TOTA.zip
 *   2004   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02200403_TOTA.zip
 *   2008   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02200803_TOTA.zip
 *   2011   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201111_TOTA.zip
 *   2015   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201512_TOTA.zip
 *   2016   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201606_TOTA.zip
 *   2019A  https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201904_TOTA.zip
 *   2019N  https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201911_TOTA.zip
 *   - 03xxxxxx.DAT  candidacy register (code, siglas, accumulation codes)
 *   - 07xxxxxx.DAT  per-ambit summary (blank/null/candidacy votes, seats)
 *   - 08xxxxxx.DAT  per-ambit candidacy votes and elected counts
 *
 * For each election it:
 *   1. Downloads + unzips the dataset into a temp dir (cached across runs).
 *   2. Aggregates every candidacy's province votes by the MIR *national
 *      accumulation code* (PSC→PSOE, IU federations→IU, ...) and maps the
 *      accumulated siglas onto the party keys the app uses (canonical keys
 *      per src/data/party-aliases.ts where one exists). Candidacies the app
 *      deliberately keeps separate (UPN–PP joint lists) are NOT folded.
 *   3. Validates: province seats == file 07 == apportionment in the app,
 *      candidacy-vote sums == file 07 totals, and the dataset's own elected
 *      counts reproduce the official 350-seat outcome per mapped key.
 *   4. Writes the data file preserving the existing export names, province
 *      names/shortNames/order and seat counts, adding official blankVotes.
 *
 * Run with: npx tsx scripts/fetch_historical.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { execSync } from "child_process";

const RETRIEVAL_DATE = "2026-06-12";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

interface ProvinceDef {
  code: string; // MIR/INE province code
  name: string;
  shortName: string;
  seats: number;
}

interface ElectionConfig {
  id: string;
  zipName: string; // 02YYYYMM_TOTA.zip
  datSuffix: string; // e.g. "029306" -> 03029306.DAT etc.
  outFile: string;
  exportName: string;
  headerTitle: string;
  /** Map accumulated-candidacy siglas -> app party key (default: siglas). */
  accSiglasToKey: { [siglas: string]: string };
  /** Overrides checked on the candidacy's OWN siglas BEFORE accumulation
   *  (candidacies the app keeps as separate actors, e.g. UPN–PP). */
  ownSiglasToKey: { [siglas: string]: string };
  /** Official elected per mapped key (MIR record); validated against the
   *  dataset's own elected counts. */
  officialElected: { [key: string]: number };
  /** The 1993, 2000 and 2008 datasets have small internal inconsistencies
   *  between the file-07 per-province "votos de candidaturas" totals and the
   *  per-candidacy rows of file 08 (1993: max +1,033 in Huelva, < 0.5%;
   *  2000: −9 Guadalajara, −7 Pontevedra; 2008: +3 Murcia). File 08 is the
   *  authoritative per-candidacy record (it reproduces the official elected
   *  counts exactly), so for those elections the 07-vs-08 check is a
   *  warning. */
  lenient07Check?: boolean;
  provinces: ProvinceDef[];
  /** Extra lines emitted before the circumscriptions array. */
  preamble?: string;
}

// ---------------------------------------------------------------------------
// Election configurations
// ---------------------------------------------------------------------------

const PROVINCES_1993: ProvinceDef[] = [
  { code: "01", name: "Álava", shortName: "ALA", seats: 4 },
  { code: "02", name: "Albacete", shortName: "ALB", seats: 4 },
  { code: "03", name: "Alicante", shortName: "ALI", seats: 10 },
  { code: "04", name: "Almería", shortName: "ALM", seats: 5 },
  { code: "05", name: "Ávila", shortName: "AVI", seats: 3 },
  { code: "06", name: "Badajoz", shortName: "BAD", seats: 6 },
  { code: "07", name: "Islas Baleares", shortName: "BAL", seats: 7 },
  { code: "08", name: "Barcelona", shortName: "BCN", seats: 32 },
  { code: "09", name: "Burgos", shortName: "BUR", seats: 4 },
  { code: "10", name: "Cáceres", shortName: "CAC", seats: 5 },
  { code: "11", name: "Cádiz", shortName: "CAD", seats: 9 },
  { code: "12", name: "Castellón", shortName: "CAS", seats: 5 },
  { code: "13", name: "Ciudad Real", shortName: "CRE", seats: 5 },
  { code: "14", name: "Córdoba", shortName: "COR", seats: 7 },
  { code: "15", name: "A Coruña", shortName: "COR", seats: 9 },
  { code: "16", name: "Cuenca", shortName: "CUE", seats: 3 },
  { code: "17", name: "Girona", shortName: "GIR", seats: 5 },
  { code: "18", name: "Granada", shortName: "GRA", seats: 7 },
  { code: "19", name: "Guadalajara", shortName: "GUA", seats: 3 },
  { code: "20", name: "Guipúzcoa", shortName: "GUI", seats: 6 },
  { code: "21", name: "Huelva", shortName: "HUE", seats: 5 },
  { code: "22", name: "Huesca", shortName: "HUE", seats: 3 },
  { code: "23", name: "Jaén", shortName: "JAE", seats: 6 },
  { code: "24", name: "León", shortName: "LEO", seats: 5 },
  { code: "25", name: "Lleida", shortName: "LLE", seats: 4 },
  { code: "26", name: "La Rioja", shortName: "RIO", seats: 4 },
  { code: "27", name: "Lugo", shortName: "LUG", seats: 5 },
  { code: "28", name: "Madrid", shortName: "MAD", seats: 34 },
  { code: "29", name: "Málaga", shortName: "MAL", seats: 10 },
  { code: "30", name: "Murcia", shortName: "MUR", seats: 9 },
  { code: "31", name: "Navarra", shortName: "NAV", seats: 5 },
  { code: "32", name: "Ourense", shortName: "OUR", seats: 4 },
  { code: "33", name: "Asturias", shortName: "AST", seats: 9 },
  { code: "34", name: "Palencia", shortName: "PAL", seats: 3 },
  { code: "35", name: "Las Palmas", shortName: "LPA", seats: 7 },
  { code: "36", name: "Pontevedra", shortName: "PON", seats: 8 },
  { code: "37", name: "Salamanca", shortName: "SAL", seats: 4 },
  { code: "38", name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7 },
  { code: "39", name: "Cantabria", shortName: "CAN", seats: 5 },
  { code: "40", name: "Segovia", shortName: "SEG", seats: 3 },
  { code: "41", name: "Sevilla", shortName: "SEV", seats: 12 },
  { code: "42", name: "Soria", shortName: "SOR", seats: 3 },
  { code: "43", name: "Tarragona", shortName: "TAR", seats: 6 },
  { code: "44", name: "Teruel", shortName: "TER", seats: 3 },
  { code: "45", name: "Toledo", shortName: "TOL", seats: 5 },
  { code: "46", name: "Valencia", shortName: "VAL", seats: 16 },
  { code: "47", name: "Valladolid", shortName: "VAL", seats: 5 },
  { code: "48", name: "Vizcaya", shortName: "VIZ", seats: 9 },
  { code: "49", name: "Zamora", shortName: "ZAM", seats: 3 },
  { code: "50", name: "Zaragoza", shortName: "ZAR", seats: 7 },
  { code: "51", name: "Ceuta", shortName: "CEU", seats: 1 },
  { code: "52", name: "Melilla", shortName: "MEL", seats: 1 },
];

/** Clone of PROVINCES_1993 with per-code seat overrides (official
 *  apportionment of each election, validated against DAT file 07). */
function withSeats(overrides: { [code: string]: number }): ProvinceDef[] {
  return PROVINCES_1993.map(p =>
    overrides[p.code] !== undefined ? { ...p, seats: overrides[p.code] } : { ...p }
  );
}

const PROVINCES_2015: ProvinceDef[] = withSeats({
  "03": 12, "04": 6, "07": 8, "08": 31, "10": 4, "14": 6, "15": 8,
  "17": 6, "23": 5, "27": 4, "28": 36, "29": 11, "30": 10, "33": 8,
  "35": 8, "36": 7, "42": 2, "45": 6, "46": 15, "48": 8,
});

// 1996 and 2000 shared the same apportionment (RD 2420/1995 / RD 64/2000).
const PROVINCES_1996: ProvinceDef[] = withSeats({ "03": 11, "08": 31, "27": 4, "41": 13 });
const PROVINCES_2000: ProvinceDef[] = withSeats({ "03": 11, "08": 31, "27": 4, "41": 13 });

const PROVINCES_2004: ProvinceDef[] = withSeats({
  "03": 11, "07": 8, "08": 31, "10": 4, "17": 6, "27": 4, "28": 35,
  "33": 8, "35": 8, "36": 7,
});

const PROVINCES_2008: ProvinceDef[] = withSeats({
  "03": 12, "04": 6, "07": 8, "08": 31, "10": 4, "14": 6, "15": 8,
  "17": 6, "27": 4, "28": 35, "30": 10, "33": 8, "35": 8, "36": 7,
  "42": 2, "45": 6, "48": 8,
});

const PROVINCES_2011: ProvinceDef[] = withSeats({
  "03": 12, "04": 6, "07": 8, "08": 31, "10": 4, "11": 8, "14": 6,
  "15": 8, "17": 6, "27": 4, "28": 36, "30": 10, "33": 8, "35": 8,
  "36": 7, "42": 2, "45": 6, "48": 8,
});

// 2016 keeps the names/shortNames/order of the existing data file.
const PROVINCES_2016: ProvinceDef[] = [
  { code: "15", name: "A Coruna", shortName: "A C", seats: 8 },
  { code: "01", name: "Alava", shortName: "ALA", seats: 4 },
  { code: "02", name: "Albacete", shortName: "ALB", seats: 4 },
  { code: "03", name: "Alacant/Alicante", shortName: "ALA", seats: 12 },
  { code: "04", name: "Almeria", shortName: "ALM", seats: 6 },
  { code: "33", name: "Asturias", shortName: "AST", seats: 8 },
  { code: "05", name: "Avila", shortName: "AVI", seats: 3 },
  { code: "06", name: "Badajoz", shortName: "BAD", seats: 6 },
  { code: "07", name: "Illes Balears", shortName: "ILL", seats: 8 },
  { code: "08", name: "Barcelona", shortName: "BAR", seats: 31 },
  { code: "48", name: "Bizkaia", shortName: "BIZ", seats: 8 },
  { code: "09", name: "Burgos", shortName: "BUR", seats: 4 },
  { code: "10", name: "Caceres", shortName: "CAC", seats: 4 },
  { code: "11", name: "Cadiz", shortName: "CAD", seats: 9 },
  { code: "39", name: "Cantabria", shortName: "CAN", seats: 5 },
  { code: "12", name: "Castellon", shortName: "CAS", seats: 5 },
  { code: "51", name: "Ceuta", shortName: "CEU", seats: 1 },
  { code: "13", name: "Ciudad Real", shortName: "CIU", seats: 5 },
  { code: "14", name: "Cordoba", shortName: "COR", seats: 6 },
  { code: "16", name: "Cuenca", shortName: "CUE", seats: 3 },
  { code: "20", name: "Gipuzkoa", shortName: "GIP", seats: 6 },
  { code: "17", name: "Girona", shortName: "GIR", seats: 6 },
  { code: "18", name: "Granada", shortName: "GRA", seats: 7 },
  { code: "19", name: "Guadalajara", shortName: "GUA", seats: 3 },
  { code: "21", name: "Huelva", shortName: "HUE", seats: 5 },
  { code: "22", name: "Huesca", shortName: "HUE", seats: 3 },
  { code: "23", name: "Jaen", shortName: "JAE", seats: 5 },
  { code: "26", name: "La Rioja", shortName: "LA ", seats: 4 },
  { code: "35", name: "Las Palmas", shortName: "LAS", seats: 8 },
  { code: "24", name: "Leon", shortName: "LEO", seats: 4 },
  { code: "25", name: "Lleida", shortName: "LLE", seats: 4 },
  { code: "27", name: "Lugo", shortName: "LUG", seats: 4 },
  { code: "28", name: "Madrid", shortName: "MAD", seats: 36 },
  { code: "29", name: "Malaga", shortName: "MAL", seats: 11 },
  { code: "52", name: "Melilla", shortName: "MEL", seats: 1 },
  { code: "30", name: "Murcia", shortName: "MUR", seats: 10 },
  { code: "31", name: "Navarra", shortName: "NAV", seats: 5 },
  { code: "32", name: "Ourense", shortName: "OUR", seats: 4 },
  { code: "34", name: "Palencia", shortName: "PAL", seats: 3 },
  { code: "36", name: "Pontevedra", shortName: "PON", seats: 7 },
  { code: "37", name: "Salamanca", shortName: "SAL", seats: 4 },
  { code: "38", name: "Santa Cruz de Tenerife", shortName: "SAN", seats: 7 },
  { code: "40", name: "Segovia", shortName: "SEG", seats: 3 },
  { code: "41", name: "Sevilla", shortName: "SEV", seats: 12 },
  { code: "42", name: "Soria", shortName: "SOR", seats: 2 },
  { code: "43", name: "Tarragona", shortName: "TAR", seats: 6 },
  { code: "44", name: "Teruel", shortName: "TER", seats: 3 },
  { code: "45", name: "Toledo", shortName: "TOL", seats: 6 },
  { code: "46", name: "València/Valencia", shortName: "VAL", seats: 16 },
  { code: "47", name: "Valladolid", shortName: "VAL", seats: 5 },
  { code: "49", name: "Zamora", shortName: "ZAM", seats: 3 },
  { code: "50", name: "Zaragoza", shortName: "ZAR", seats: 7 },
];

// 2019A keeps the names/shortNames/order of the existing data file.
const PROVINCES_2019A: ProvinceDef[] = [
  { code: "15", name: "A Coruña", shortName: "A C", seats: 8 },
  { code: "02", name: "Albacete", shortName: "ALB", seats: 4 },
  { code: "03", name: "Alacant/Alicante", shortName: "ALA", seats: 12 },
  { code: "04", name: "Almería", shortName: "ALM", seats: 6 },
  { code: "33", name: "Asturias", shortName: "AST", seats: 7 },
  { code: "06", name: "Badajoz", shortName: "BAD", seats: 6 },
  { code: "08", name: "Barcelona", shortName: "BAR", seats: 32 },
  { code: "48", name: "Bizkaia", shortName: "BIZ", seats: 8 },
  { code: "09", name: "Burgos", shortName: "BUR", seats: 4 },
  { code: "39", name: "Cantabria", shortName: "CAN", seats: 5 },
  { code: "12", name: "Castelló/Castellón", shortName: "CAS", seats: 5 },
  { code: "13", name: "Ciudad Real", shortName: "CIU", seats: 5 },
  { code: "16", name: "Cuenca", shortName: "CUE", seats: 3 },
  { code: "10", name: "Cáceres", shortName: "CÁC", seats: 4 },
  { code: "11", name: "Cádiz", shortName: "CÁD", seats: 9 },
  { code: "14", name: "Córdoba", shortName: "CÓR", seats: 6 },
  { code: "20", name: "Gipuzkoa", shortName: "GIP", seats: 6 },
  { code: "17", name: "Girona", shortName: "GIR", seats: 6 },
  { code: "18", name: "Granada", shortName: "GRA", seats: 7 },
  { code: "19", name: "Guadalajara", shortName: "GUA", seats: 3 },
  { code: "21", name: "Huelva", shortName: "HUE", seats: 5 },
  { code: "22", name: "Huesca", shortName: "HUE", seats: 3 },
  { code: "07", name: "Illes Balears", shortName: "ILL", seats: 8 },
  { code: "23", name: "Jaén", shortName: "JAÉ", seats: 5 },
  { code: "26", name: "La Rioja", shortName: "LA ", seats: 4 },
  { code: "35", name: "Las Palmas", shortName: "LAS", seats: 8 },
  { code: "24", name: "León", shortName: "LEÓ", seats: 4 },
  { code: "25", name: "Lleida", shortName: "LLE", seats: 4 },
  { code: "27", name: "Lugo", shortName: "LUG", seats: 4 },
  { code: "28", name: "Madrid", shortName: "MAD", seats: 37 },
  { code: "30", name: "Murcia", shortName: "MUR", seats: 10 },
  { code: "29", name: "Málaga", shortName: "MÁL", seats: 11 },
  { code: "31", name: "Navarra", shortName: "NAV", seats: 5 },
  { code: "32", name: "Ourense", shortName: "OUR", seats: 4 },
  { code: "34", name: "Palencia", shortName: "PAL", seats: 3 },
  { code: "36", name: "Pontevedra", shortName: "PON", seats: 7 },
  { code: "37", name: "Salamanca", shortName: "SAL", seats: 4 },
  { code: "38", name: "Santa Cruz de Tenerife", shortName: "SAN", seats: 7 },
  { code: "40", name: "Segovia", shortName: "SEG", seats: 3 },
  { code: "41", name: "Sevilla", shortName: "SEV", seats: 12 },
  { code: "42", name: "Soria", shortName: "SOR", seats: 2 },
  { code: "43", name: "Tarragona", shortName: "TAR", seats: 6 },
  { code: "44", name: "Teruel", shortName: "TER", seats: 3 },
  { code: "45", name: "Toledo", shortName: "TOL", seats: 6 },
  { code: "46", name: "València/Valencia", shortName: "VAL", seats: 15 },
  { code: "47", name: "Valladolid", shortName: "VAL", seats: 5 },
  { code: "49", name: "Zamora", shortName: "ZAM", seats: 3 },
  { code: "50", name: "Zaragoza", shortName: "ZAR", seats: 7 },
  { code: "01", name: "Araba/Álava", shortName: "ARA", seats: 4 },
  { code: "05", name: "Ávila", shortName: "ÁVI", seats: 3 },
  { code: "51", name: "Ceuta", shortName: "CEU", seats: 1 },
  { code: "52", name: "Melilla", shortName: "MEL", seats: 1 },
];

const PROVINCES_2019N: ProvinceDef[] = [
  { code: "04", name: "Almería", shortName: "ALM", seats: 6 },
  { code: "11", name: "Cádiz", shortName: "CÁD", seats: 9 },
  { code: "14", name: "Córdoba", shortName: "CÓR", seats: 6 },
  { code: "18", name: "Granada", shortName: "GRA", seats: 7 },
  { code: "21", name: "Huelva", shortName: "HUE", seats: 5 },
  { code: "23", name: "Jaén", shortName: "JAÉ", seats: 5 },
  { code: "29", name: "Málaga", shortName: "MÁL", seats: 11 },
  { code: "41", name: "Sevilla", shortName: "SEV", seats: 12 },
  { code: "22", name: "Huesca", shortName: "HUE", seats: 3 },
  { code: "44", name: "Teruel", shortName: "TER", seats: 3 },
  { code: "50", name: "Zaragoza", shortName: "ZAR", seats: 7 },
  { code: "33", name: "Asturias", shortName: "AST", seats: 7 },
  { code: "07", name: "Illes Balears", shortName: "ILL", seats: 8 },
  { code: "35", name: "Las Palmas", shortName: "LAS", seats: 8 },
  { code: "38", name: "Santa Cruz de Tenerife", shortName: "SAN", seats: 7 },
  { code: "39", name: "Cantabria", shortName: "CAN", seats: 5 },
  { code: "02", name: "Albacete", shortName: "ALB", seats: 4 },
  { code: "13", name: "Ciudad Real", shortName: "CIU", seats: 5 },
  { code: "16", name: "Cuenca", shortName: "CUE", seats: 3 },
  { code: "19", name: "Guadalajara", shortName: "GUA", seats: 3 },
  { code: "45", name: "Toledo", shortName: "TOL", seats: 6 },
  { code: "05", name: "Ávila", shortName: "ÁVI", seats: 3 },
  { code: "09", name: "Burgos", shortName: "BUR", seats: 4 },
  { code: "24", name: "León", shortName: "LEÓ", seats: 4 },
  { code: "34", name: "Palencia", shortName: "PAL", seats: 3 },
  { code: "37", name: "Salamanca", shortName: "SAL", seats: 4 },
  { code: "40", name: "Segovia", shortName: "SEG", seats: 3 },
  { code: "42", name: "Soria", shortName: "SOR", seats: 2 },
  { code: "47", name: "Valladolid", shortName: "VAL", seats: 5 },
  { code: "49", name: "Zamora", shortName: "ZAM", seats: 3 },
  { code: "08", name: "Barcelona", shortName: "BAR", seats: 32 },
  { code: "17", name: "Girona", shortName: "GIR", seats: 6 },
  { code: "25", name: "Lleida", shortName: "LLE", seats: 4 },
  { code: "43", name: "Tarragona", shortName: "TAR", seats: 6 },
  { code: "51", name: "Ceuta", shortName: "CEU", seats: 1 },
  { code: "03", name: "Alicante/Alacant", shortName: "ALI", seats: 12 },
  { code: "12", name: "Castellón/Castelló", shortName: "CAS", seats: 5 },
  // OJO: en 2019 el reparto oficial era Valencia 15 y Badajoz 6 (BOE,
  // RD 551/2019). El fichero anterior copiaba el reparto de 2023 (16/5),
  // lo que causaba el escaño PSOE/PP desviado frente al resultado oficial.
  { code: "46", name: "Valencia/València", shortName: "VAL", seats: 15 },
  { code: "06", name: "Badajoz", shortName: "BAD", seats: 6 },
  { code: "10", name: "Cáceres", shortName: "CÁC", seats: 4 },
  { code: "15", name: "A Coruña", shortName: "A C", seats: 8 },
  { code: "27", name: "Lugo", shortName: "LUG", seats: 4 },
  { code: "32", name: "Ourense", shortName: "OUR", seats: 4 },
  { code: "36", name: "Pontevedra", shortName: "PON", seats: 7 },
  { code: "26", name: "La Rioja", shortName: "LA ", seats: 4 },
  { code: "28", name: "Madrid", shortName: "MAD", seats: 37 },
  { code: "52", name: "Melilla", shortName: "MEL", seats: 1 },
  { code: "30", name: "Murcia", shortName: "MUR", seats: 10 },
  { code: "31", name: "Navarra", shortName: "NAV", seats: 5 },
  { code: "01", name: "Araba/Álava", shortName: "ARA", seats: 4 },
  { code: "48", name: "Bizkaia", shortName: "BIZ", seats: 8 },
  { code: "20", name: "Gipuzkoa", shortName: "GIP", seats: 6 },
];

const ELECTIONS: ElectionConfig[] = [
  {
    id: "1993",
    zipName: "02199306_TOTA.zip",
    datSuffix: "029306",
    outFile: "src/data/elections1993.ts",
    exportName: "circunscripciones1993",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 1993 (6 de junio)",
    accSiglasToKey: {
      CIU: "CiU",
      "EAJ-PNV": "PNV",
      CC: "CCA",
      "EA-EUE": "EA",
    },
    // The PP–UPN joint list in Navarra is kept as UPN (the app treats UPN as
    // a separate actor; verify_seats.ts re-attributes it to PP for counting).
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PSOE: 159, PP: 138, UPN: 3, IU: 18, CiU: 17, PNV: 5, CCA: 4,
      HB: 2, ERC: 1, EA: 1, PAR: 1, UV: 1,
    },
    lenient07Check: true,
    provinces: PROVINCES_1993,
  },
  {
    id: "1996",
    zipName: "02199603_TOTA.zip",
    datSuffix: "029603",
    outFile: "src/data/elections1996.ts",
    exportName: "circunscripciones1996",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 1996 (3 de marzo)",
    accSiglasToKey: {
      CIU: "CiU",
      "EAJ-PNV": "PNV",
      CC: "CCA",
    },
    // The PP–UPN joint list in Navarra is kept as UPN (verify_seats.ts
    // re-attributes it to PP for counting, as the MIR record does).
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PP: 154, UPN: 2, PSOE: 141, IU: 21, CiU: 16, PNV: 5, CCA: 4,
      BNG: 2, HB: 2, ERC: 1, EA: 1, UV: 1,
    },
    provinces: PROVINCES_1996,
  },
  {
    id: "2000",
    zipName: "02200003_TOTA.zip",
    datSuffix: "020003",
    outFile: "src/data/elections2000.ts",
    exportName: "circunscripciones2000",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 2000 (12 de marzo)",
    accSiglasToKey: {
      CIU: "CiU",
      "EAJ-PNV": "PNV",
      CC: "CCA",
      "PSOE-PROGR.": "PSOE",
      // IC-V (own list in 2000, 1 seat) keeps the app key "IC-V";
      // verify_seats.ts maps it to its ICV baseline key.
    },
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PP: 180, UPN: 3, PSOE: 125, CiU: 15, IU: 8, PNV: 7, CCA: 4,
      BNG: 3, PA: 1, ERC: 1, "IC-V": 1, EA: 1, CHA: 1,
    },
    lenient07Check: true,
    provinces: PROVINCES_2000,
  },
  {
    id: "2004",
    zipName: "02200403_TOTA.zip",
    datSuffix: "020403",
    outFile: "src/data/elections2004.ts",
    exportName: "circunscripciones2004",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 2004 (14 de marzo)",
    accSiglasToKey: {
      "EAJ-PNV": "PNV",
      CC: "CCA",
      "Na-Bai": "GBAI", // Nafarroa Bai (app key GBAI; baseline NABAI)
    },
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PSOE: 164, PP: 146, UPN: 2, CiU: 10, ERC: 8, PNV: 7, IU: 5,
      CCA: 3, BNG: 2, CHA: 1, EA: 1, GBAI: 1,
    },
    provinces: PROVINCES_2004,
  },
  {
    id: "2008",
    zipName: "02200803_TOTA.zip",
    datSuffix: "020803",
    outFile: "src/data/elections2008.ts",
    exportName: "circunscripciones2008",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 2008 (9 de marzo)",
    accSiglasToKey: {
      "P.S.O.E.": "PSOE",
      "P.P.": "PP",
      "I.U.": "IU",
      "EAJ-PNV": "PNV",
      ESQUERRA: "ERC",
      "B.N.G.": "BNG",
      "CC-PNC": "CCA",
      "NA-BAI": "GBAI",
    },
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PSOE: 169, PP: 152, UPN: 2, CiU: 10, PNV: 6, ERC: 3, IU: 2,
      BNG: 2, CCA: 2, UPyD: 1, GBAI: 1,
    },
    lenient07Check: true,
    provinces: PROVINCES_2008,
  },
  {
    id: "2011",
    zipName: "02201111_TOTA.zip",
    datSuffix: "021111",
    outFile: "src/data/elections2011.ts",
    exportName: "circunscripciones2011",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 20-N 2011 (20 de noviembre)",
    accSiglasToKey: {
      "IU-LV": "IU",           // La Izquierda Plural (incl. ICV-EUiA, CHA-IU…)
      "EAJ-PNV": "PNV",
      ESQUERRA: "ERC",
      AMAIUR: "BILDU",         // app convention: province key BILDU;
                               // verify_seats.ts re-maps it to AMAIUR.
      "CC-NC-PNC": "CCA",
      "COMPROMÍS-Q": "COMPROMIS",
      "P.R.C.": "PRC",
    },
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PP: 184, UPN: 2, PSOE: 110, CiU: 16, IU: 11, BILDU: 7, UPyD: 5,
      PNV: 5, ERC: 3, BNG: 2, CCA: 2, COMPROMIS: 1, FAC: 1, GBAI: 1,
    },
    provinces: PROVINCES_2011,
  },
  {
    id: "2015",
    zipName: "02201512_TOTA.zip",
    datSuffix: "021512",
    outFile: "src/data/elections2015.ts",
    exportName: "circunscripciones2015",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 20-D 2015 (20 de diciembre)",
    accSiglasToKey: {
      "C's": "Cs",
      // Podemos and its confluences, aggregated as in the official record
      // (and as verify_seats.ts' OFFICIAL baseline counts them).
      PODEMOS: "PODEMOS",
      "EN COMÚ": "PODEMOS",
      "PODEMOS-COM": "PODEMOS",
      "PODEMOS-En": "PODEMOS",
      // Unidad Popular (IU) and its regional lists.
      "IU-UPeC": "IU",
      "UNIDAD POPU": "IU",
      DL: "CDC", // Democràcia i Llibertat (CDC)
      "ERC-CATSI": "ERC",
      "EAJ-PNV": "PNV",
      "EH Bildu": "BILDU",
      "CCa-PNC": "CCA",
      UPYD: "UPyD",
      "NÓS": "BNG", // candidatura BNG-NÓS
    },
    ownSiglasToKey: { "UPN-PP": "UPN" },
    officialElected: {
      PP: 121, UPN: 2, PSOE: 90, PODEMOS: 69, Cs: 40, ERC: 9, CDC: 8,
      PNV: 6, IU: 2, BILDU: 2, CCA: 1,
    },
    provinces: PROVINCES_2015,
  },
  {
    id: "2016",
    zipName: "02201606_TOTA.zip",
    datSuffix: "021606",
    outFile: "src/data/elections2016.ts",
    exportName: "circunscripciones2016",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 2016 (26 de junio)",
    accSiglasToKey: {
      // Unidos Podemos and its confluences (ECP, A la valenciana, En Marea),
      // aggregated as in verify_seats.ts' baseline (UP = 45+12+9+5 = 71).
      "PODEMOS-IU-EQUO": "UP",
      ECP: "UP",
      "PODEMOS-COM": "UP",                // PODEMOS-COMPROMÍS-EUPV
      "PODEMOS-EN MAREA-ANOVA-EU": "UP",
      "C's": "Cs",
      "ERC-CATSÍ": "ERC",
      "EAJ-PNV": "PNV",
      "EH Bildu": "BILDU",
      "CCa-PNC": "CCA",
    },
    // NOTE: unlike 1993–2015, in 2016 the UPN–PP list is NOT kept separate:
    // the existing data file and the verify baseline (PP 137) fold it into
    // PP, and there is no 2016 UPN counting alias. Keeping that convention
    // requires zero alias edits.
    ownSiglasToKey: {},
    officialElected: {
      PP: 137, PSOE: 85, UP: 71, Cs: 32, ERC: 9, CDC: 8,
      PNV: 5, BILDU: 2, CCA: 1,
    },
    provinces: PROVINCES_2016,
    preamble:
      `export const electionInfo2016 = {\n` +
      `  year: "2016",\n` +
      `  name: "Elecciones Generales 2016",\n` +
      `  date: "26 de junio de 2016",\n` +
      `};\n\n`,
  },
  {
    id: "2019A",
    zipName: "02201904_TOTA.zip",
    datSuffix: "021904",
    outFile: "src/data/elections2019A.ts",
    exportName: "circunscripciones2019A",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 28-A 2019 (28 de abril)",
    accSiglasToKey: {
      // Unidas Podemos and its confluences (En Comú Podem, En Común-Unidas
      // Podemos), aggregated as in verify_seats.ts' baseline (33+7+2 = 42).
      "PODEMOS-IU-": "UP",
      "ECP-GUANYEM": "UP",
      "PODEMOS-EU-": "UP",
      "ERC-SOBIRAN": "ERC",
      "JxCAT-JUNTS": "JUNTS",
      "EAJ-PNV": "PNV",
      "EH Bildu": "BILDU",
      "COMPROMÍS 2": "COMPROMIS",          // Compromís 2019
      "CCa-PNC": "CCA",
      "RECORTES CE": "R. Cero",
    },
    ownSiglasToKey: {},
    officialElected: {
      PSOE: 123, PP: 66, Cs: 57, UP: 42, VOX: 24, ERC: 15, JUNTS: 7,
      PNV: 6, BILDU: 4, CCA: 2, "NA+": 2, COMPROMIS: 1, PRC: 1,
    },
    provinces: PROVINCES_2019A,
    preamble:
      `export const electionInfo2019A = {\n` +
      `  year: "2019-A",\n` +
      `  name: "Elecciones Generales 28-A 2019",\n` +
      `  date: "28 de abril de 2019",\n` +
      `};\n\n`,
  },
  {
    id: "2019N",
    zipName: "02201911_TOTA.zip",
    datSuffix: "021911",
    outFile: "src/data/elections2019N.ts",
    exportName: "circunscripciones2019N",
    headerTitle: "Datos OFICIALES de las Elecciones Generales de España 10-N 2019 (10 de noviembre)",
    accSiglasToKey: {
      "ERC-SOBIRANISTES": "ERC",
      "JxCAT-JUNTS": "JUNTS",
      "EAJ-PNV": "PNV",
      "EH Bildu": "BILDU",
      // Unidas Podemos and its confluences (incl. En Comú Podem and
      // Galicia en Común), aggregated as in verify_seats.ts' baseline.
      "PODEMOS-IU": "UP",
      "ECP-GUANYEM": "UP",
      "PODEMOS-EU": "UP",
      "MÁS PAÍS-EQ": "MASPAIS",
      "MÁS PAÍS": "MASPAIS",
      "MÉS COMPROM": "COMPROMIS", // Més Compromís (1 seat, València)
      "CUP-PR": "CUP",
      "CCa-PNC-NC": "CCA",
      "¡TERUEL EXI": "TERUEL",
      "M PAÍS-CHA-": "MP-CHA", // Más País–CHA (Zaragoza), kept separate
      "MÉS-ESQUERR": "MÉS",
      "RECORTES CERO-GV": "R. Cero",
    },
    ownSiglasToKey: {},
    officialElected: {
      PSOE: 120, PP: 89, VOX: 52, UP: 35, ERC: 13, Cs: 10, JUNTS: 8,
      PNV: 6, BILDU: 5, MASPAIS: 2, COMPROMIS: 1, CUP: 2, CCA: 2,
      "NA+": 2, PRC: 1, BNG: 1, TERUEL: 1,
    },
    provinces: PROVINCES_2019N,
    preamble:
      `export const electionInfo2019N = {\n` +
      `  year: "2019-N",\n` +
      `  name: "Elecciones Generales 10-N 2019",\n` +
      `  date: "10 de noviembre de 2019",\n` +
      `};\n\n`,
  },
];

// ---------------------------------------------------------------------------
// Shared parsing helpers (same fixed-width offsets as scripts/fetch_2023.ts)
// ---------------------------------------------------------------------------

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const quoteKey = (k: string) => (IDENT_RE.test(k) ? k : JSON.stringify(k));
const repoRoot = path.resolve(__dirname, "..");

let totalErrors = 0;

function processElection(cfg: ElectionConfig): void {
  console.log(`\n========== ${cfg.id} ==========`);
  const zipUrl = `https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/${cfg.zipName}`;
  const workDir = path.join(os.tmpdir(), `infoelectoral_${cfg.zipName.replace(".zip", "")}`);
  const datFiles = [`03${cfg.datSuffix}.DAT`, `07${cfg.datSuffix}.DAT`, `08${cfg.datSuffix}.DAT`];
  if (!datFiles.every(f => fs.existsSync(path.join(workDir, f)))) {
    fs.mkdirSync(workDir, { recursive: true });
    const zipPath = path.join(workDir, "TOTA.zip");
    console.log(`Downloading ${zipUrl} ...`);
    // The MIR server resets connections without a browser-like User-Agent.
    execSync(`curl -sS -L -A "${UA}" -o "${zipPath}" "${zipUrl}"`, { stdio: "inherit" });
    execSync(`unzip -o -q "${zipPath}" -d "${workDir}"`, { stdio: "inherit" });
  }
  const readDat = (f: string): string[] =>
    fs.readFileSync(path.join(workDir, f), "latin1").split(/\r?\n/).filter(l => l.trim().length > 0);

  // File 03: candidacy register.
  const cands: { [code: string]: { siglas: string; accNac: string } } = {};
  for (const l of readDat(`03${cfg.datSuffix}.DAT`)) {
    cands[l.slice(8, 14)] = { siglas: l.slice(14, 64).trim(), accNac: l.slice(226, 232) };
  }

  // Candidacy code -> app party key.
  const keyOf = (candCode: string): string => {
    const own = cands[candCode]?.siglas ?? candCode;
    if (cfg.ownSiglasToKey[own] !== undefined) return cfg.ownSiglasToKey[own];
    const nac = cands[candCode]?.accNac ?? candCode;
    const accSiglas = cands[nac]?.siglas ?? own;
    return cfg.accSiglasToKey[accSiglas] ?? accSiglas;
  };

  // File 07: per-province summary (blank votes, candidacy votes, seats).
  const summaries: { [prov: string]: { blank: number; candidacyVotes: number; seats: number } } = {};
  for (const l of readDat(`07${cfg.datSuffix}.DAT`)) {
    const com = l.slice(9, 11);
    const prov = l.slice(11, 13);
    if (com === "99" || prov === "99") continue; // national / community totals
    summaries[prov] = {
      blank: parseInt(l.slice(125, 133), 10),
      candidacyVotes: parseInt(l.slice(141, 149), 10),
      seats: parseInt(l.slice(149, 155), 10),
    };
  }

  // File 08: candidacy votes + elected per province.
  const provVotes: { [prov: string]: { [key: string]: number } } = {};
  const provElected: { [prov: string]: { [key: string]: number } } = {};
  for (const l of readDat(`08${cfg.datSuffix}.DAT`)) {
    const com = l.slice(9, 11);
    const prov = l.slice(11, 13);
    if (com === "99" || prov === "99") continue; // national / community totals
    const key = keyOf(l.slice(14, 20));
    const votes = parseInt(l.slice(20, 28), 10);
    const elected = parseInt(l.slice(28, 33), 10);
    (provVotes[prov] ||= {})[key] = (provVotes[prov]?.[key] || 0) + votes;
    (provElected[prov] ||= {})[key] = (provElected[prov]?.[key] || 0) + elected;
  }

  // Validate.
  let errors = 0;
  const fail = (msg: string) => {
    console.error(`VALIDATION FAIL [${cfg.id}]: ${msg}`);
    errors++;
  };

  for (const p of cfg.provinces) {
    const s = summaries[p.code];
    if (!s) { fail(`${p.name}: no file-07 summary`); continue; }
    if (s.seats !== p.seats) fail(`${p.name}: file-07 seats ${s.seats} != expected ${p.seats}`);
    const sum = Object.values(provVotes[p.code] || {}).reduce((a, b) => a + b, 0);
    if (sum !== s.candidacyVotes) {
      const relDiff = Math.abs(sum - s.candidacyVotes) / s.candidacyVotes;
      if (cfg.lenient07Check && relDiff < 0.005) {
        console.warn(
          `WARNING [${cfg.id}]: ${p.name}: file-08 candidacy votes ${sum} != ` +
          `file-07 total ${s.candidacyVotes} (known MIR dataset inconsistency; using file 08)`
        );
      } else {
        fail(`${p.name}: sum of candidacy votes ${sum} != file-07 total ${s.candidacyVotes}`);
      }
    }
    if (!Number.isFinite(s.blank)) fail(`${p.name}: blank votes not parsed`);
  }
  const provCodes = new Set(cfg.provinces.map(p => p.code));
  for (const code of Object.keys(summaries))
    if (!provCodes.has(code)) fail(`unexpected province code ${code} in file 07`);

  // Elected counts must reproduce the official outcome exactly.
  const electedNational: { [key: string]: number } = {};
  for (const p of cfg.provinces)
    for (const [k, v] of Object.entries(provElected[p.code] || {}))
      if (v > 0) electedNational[k] = (electedNational[k] || 0) + v;
  const allKeys = Array.from(new Set(Object.keys(cfg.officialElected).concat(Object.keys(electedNational))));
  for (const k of allKeys)
    if ((cfg.officialElected[k] || 0) !== (electedNational[k] || 0))
      fail(`elected ${k}: dataset ${electedNational[k] || 0} != official ${cfg.officialElected[k] || 0}`);
  const electedTotal = Object.values(electedNational).reduce((a, b) => a + b, 0);
  if (electedTotal !== 350) fail(`elected total ${electedTotal} != 350`);

  const nationalSums: { [key: string]: number } = {};
  for (const p of cfg.provinces)
    for (const [k, v] of Object.entries(provVotes[p.code] || {}))
      nationalSums[k] = (nationalSums[k] || 0) + v;
  const topParties = Object.entries(nationalSums).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, v]) => `${k} ${v.toLocaleString("es-ES")}`).join(", ");
  console.log(`National totals: ${topParties}`);
  console.log(`Elected (mapped keys): ${Object.entries(electedNational).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`).join(", ")}`);

  if (errors > 0) {
    console.error(`${errors} validation error(s) for ${cfg.id}; file NOT written.`);
    totalErrors += errors;
    return;
  }

  // Emit.
  const votesLiteral = (votes: { [k: string]: number }) =>
    Object.entries(votes)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${quoteKey(k)}: ${v}`)
      .join(", ");

  const blocks = cfg.provinces
    .map(p => {
      const s = summaries[p.code];
      return (
        `  { name: ${JSON.stringify(p.name)}, shortName: ${JSON.stringify(p.shortName)}, ` +
        `seats: ${p.seats}, blankVotes: ${s.blank}, votes: { ${votesLiteral(provVotes[p.code] || {})} } },`
      );
    })
    .join("\n");

  const electedDoc = Object.entries(cfg.officialElected)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");

  const header =
    `// ${cfg.headerTitle}\n` +
    `// Fuente: Ministerio del Interior — infoelectoral\n` +
    `//   Dataset: ${zipUrl}\n` +
    `//   Ficheros: 08${cfg.datSuffix}.DAT (votos y electos por candidatura y provincia),\n` +
    `//             07${cfg.datSuffix}.DAT (resumen provincial: votos en blanco, escaños),\n` +
    `//             03${cfg.datSuffix}.DAT (registro de candidaturas y códigos de acumulación)\n` +
    `//   Descargado: ${RETRIEVAL_DATE}. Regenerable con: npx tsx scripts/fetch_historical.ts\n` +
    `//\n` +
    `// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).\n` +
    `// Votos agregados por el código de acumulación nacional del MIR y mapeados\n` +
    `// a las claves de partido de la app (las listas conjuntas que la app trata\n` +
    `// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos\n` +
    `// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.\n` +
    `//\n` +
    `// Verificación: los diputados electos del propio fichero 08 reproducen\n` +
    `// exactamente el resultado oficial (${electedDoc} = 350).\n\n` +
    `import { CircunscripcionData } from "./elections2023";\n\n`;

  const body =
    (cfg.preamble ?? "") +
    `export const ${cfg.exportName}: CircunscripcionData[] = [\n${blocks}\n];\n`;

  fs.writeFileSync(path.join(repoRoot, cfg.outFile), header + body);
  console.log(`Wrote ${cfg.outFile}`);
}

for (const cfg of ELECTIONS) processElection(cfg);

if (totalErrors > 0) {
  console.error(`\n${totalErrors} validation error(s) in total.`);
  process.exit(1);
}
console.log("\nAll elections regenerated successfully.");
