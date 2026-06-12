// Proyección electoral 2027 basada en promedios de encuestas (febrero 2026)
// Fuentes de las encuestas: Ateneo del Dato, Target Point, NC Report,
// Sociométrica, 40dB.
//
// Metodología (swing nacional uniforme sobre la geografía oficial de 2023):
//   1. Objetivo nacional de cada partido = cuota de voto implícita en la
//      proyección original (promedio de encuestas de febrero 2026):
//   PP       32.75%
//   PSOE     27.54%
//   VOX      19.93%
//   SUMAR    7.02%
//   Podemos  4.13%
//   ERC      2.34%
//   JUNTS    1.99%
//   BILDU    1.69%
//   PNV      1.39%
//   BNG      0.53%
//   CCA      0.45%
//   UPN      0.24%
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
//   https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02202307_TOTA.zip (descargado 2026-06-12)
// Regenerable con: npx tsx scripts/fetch_2023.ts
//
// * NOTA: Esta proyección es una estimación educativa.

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2027: CircunscripcionData[] = [
  // ANDALUCÍA (61 escaños)
  {
    name: "Almería",
    shortName: "ALM",
    seats: 6,
    blankVotes: 2464,
    votes: { PP: 129265, VOX: 109135, PSOE: 80416, SUMAR: 12130, Podemos: 7133 }
  },
  {
    name: "Cádiz",
    shortName: "CAD",
    seats: 9,
    blankVotes: 7103,
    votes: { PP: 217895, PSOE: 182070, VOX: 154402, SUMAR: 46359, Podemos: 27262 }
  },
  {
    name: "Córdoba",
    shortName: "COR",
    seats: 6,
    blankVotes: 4348,
    votes: { PP: 167057, PSOE: 124208, VOX: 99815, SUMAR: 34773, Podemos: 20449 }
  },
  {
    name: "Granada",
    shortName: "GRA",
    seats: 7,
    blankVotes: 4057,
    votes: { PP: 182802, PSOE: 142986, VOX: 129435, SUMAR: 33065, Podemos: 19444 }
  },
  {
    name: "Huelva",
    shortName: "HUE",
    seats: 5,
    blankVotes: 2410,
    votes: { PP: 91958, PSOE: 79592, VOX: 59979, SUMAR: 15103, Podemos: 8881 }
  },
  {
    name: "Jaén",
    shortName: "JAE",
    seats: 5,
    blankVotes: 2497,
    votes: { PP: 135254, PSOE: 115362, VOX: 86843, SUMAR: 16632, Podemos: 9781 }
  },
  {
    name: "Málaga",
    shortName: "MAL",
    seats: 11,
    blankVotes: 7509,
    votes: { PP: 296813, VOX: 207144, PSOE: 206184, SUMAR: 54566, Podemos: 32088 }
  },
  {
    name: "Sevilla",
    shortName: "SEV",
    seats: 12,
    blankVotes: 10951,
    votes: { PP: 347589, PSOE: 334278, VOX: 225229, SUMAR: 83975, Podemos: 49382 }
  },
  // ARAGÓN (13 escaños)
  {
    name: "Huesca",
    shortName: "HUE",
    seats: 3,
    blankVotes: 1217,
    votes: { PP: 44997, PSOE: 34748, VOX: 24193, SUMAR: 7776, Podemos: 4573 }
  },
  {
    name: "Teruel",
    shortName: "TER",
    seats: 3,
    blankVotes: 410,
    votes: { PP: 26129, PSOE: 19160, VOX: 15855, SUMAR: 2329, Podemos: 1370 }
  },
  {
    name: "Zaragoza",
    shortName: "ZAR",
    seats: 7,
    blankVotes: 4693,
    votes: { PP: 183568, PSOE: 137810, VOX: 126715, SUMAR: 39477, Podemos: 23215 }
  },
  // ASTURIAS (7 escaños)
  {
    name: "Asturias",
    shortName: "AST",
    seats: 7,
    blankVotes: 6079,
    votes: { PP: 209161, PSOE: 176768, VOX: 119044, SUMAR: 50037, Podemos: 29425 }
  },
  // BALEARES (8 escaños)
  {
    name: "Islas Baleares",
    shortName: "BAL",
    seats: 8,
    blankVotes: 4704,
    votes: { PP: 176224, PSOE: 130851, VOX: 122198, SUMAR: 47133, Podemos: 27717 }
  },
  // CANARIAS (15 escaños)
  {
    name: "Las Palmas",
    shortName: "LPA",
    seats: 8,
    blankVotes: 3062,
    votes: { PSOE: 151442, PP: 134507, VOX: 123469, CCA: 31771, SUMAR: 30695, Podemos: 18050 }
  },
  {
    name: "Santa Cruz de Tenerife",
    shortName: "TFE",
    seats: 7,
    blankVotes: 5088,
    votes: { PP: 171768, PSOE: 142751, CCA: 78395, SUMAR: 30278, Podemos: 17805 }
  },
  // CANTABRIA (5 escaños)
  {
    name: "Cantabria",
    shortName: "CAN",
    seats: 5,
    blankVotes: 3262,
    votes: { PP: 144796, PSOE: 100515, VOX: 78611, SUMAR: 16775, Podemos: 9865 }
  },
  // CASTILLA Y LEÓN (31 escaños)
  {
    name: "Ávila",
    shortName: "AVI",
    seats: 3,
    blankVotes: 632,
    votes: { PP: 41641, VOX: 24054, PSOE: 23128, SUMAR: 2838, Podemos: 1669 }
  },
  {
    name: "Burgos",
    shortName: "BUR",
    seats: 4,
    blankVotes: 1851,
    votes: { PP: 80915, PSOE: 60151, VOX: 41279, SUMAR: 9884, Podemos: 5813 }
  },
  {
    name: "León",
    shortName: "LEO",
    seats: 4,
    blankVotes: 1577,
    votes: { PP: 99860, PSOE: 79809, VOX: 56593, SUMAR: 10488, Podemos: 6167 }
  },
  {
    name: "Palencia",
    shortName: "PAL",
    seats: 3,
    blankVotes: 833,
    votes: { PP: 40010, PSOE: 28977, VOX: 19961, SUMAR: 3318, Podemos: 1951 }
  },
  {
    name: "Salamanca",
    shortName: "SAL",
    seats: 4,
    blankVotes: 1649,
    votes: { PP: 91715, PSOE: 52343, VOX: 46619, SUMAR: 6217, Podemos: 3656 }
  },
  {
    name: "Segovia",
    shortName: "SEG",
    seats: 3,
    blankVotes: 875,
    votes: { PP: 39209, PSOE: 23373, VOX: 19971, SUMAR: 4029, Podemos: 2369 }
  },
  {
    name: "Soria",
    shortName: "SOR",
    seats: 2,
    blankVotes: 285,
    votes: { PP: 18570, PSOE: 12902, VOX: 7947, SUMAR: 966, Podemos: 568 }
  },
  {
    name: "Valladolid",
    shortName: "VAL",
    seats: 5,
    blankVotes: 2419,
    votes: { PP: 126952, PSOE: 89308, VOX: 76543, SUMAR: 15835, Podemos: 9312 }
  },
  {
    name: "Zamora",
    shortName: "ZAM",
    seats: 3,
    blankVotes: 922,
    votes: { PP: 45403, PSOE: 28967, VOX: 21794, SUMAR: 3296, Podemos: 1939 }
  },
  // CASTILLA-LA MANCHA (21 escaños)
  {
    name: "Albacete",
    shortName: "ALB",
    seats: 4,
    blankVotes: 1834,
    votes: { PP: 86783, PSOE: 65795, VOX: 58667, SUMAR: 8939, Podemos: 5257 }
  },
  {
    name: "Ciudad Real",
    shortName: "CRE",
    seats: 5,
    blankVotes: 2353,
    votes: { PP: 112739, PSOE: 86295, VOX: 73507, SUMAR: 9826, Podemos: 5778 }
  },
  {
    name: "Cuenca",
    shortName: "CUE",
    seats: 3,
    blankVotes: 969,
    votes: { PP: 44478, PSOE: 36662, VOX: 28256, SUMAR: 3571, Podemos: 2100 }
  },
  {
    name: "Guadalajara",
    shortName: "GUA",
    seats: 3,
    blankVotes: 1143,
    votes: { PP: 50316, VOX: 43303, PSOE: 40068, SUMAR: 7287, Podemos: 4285 }
  },
  {
    name: "Toledo",
    shortName: "TOL",
    seats: 6,
    blankVotes: 2611,
    votes: { PP: 144016, VOX: 121395, PSOE: 108684, SUMAR: 17996, Podemos: 10583 }
  },
  // CATALUÑA (48 escaños)
  {
    name: "Barcelona",
    shortName: "BCN",
    seats: 32,
    blankVotes: 21059,
    votes: { PSOE: 820995, ERC: 404785, PP: 361207, VOX: 322110, JUNTS: 318076, SUMAR: 229207, Podemos: 134787 }
  },
  {
    name: "Girona",
    shortName: "GIR",
    seats: 6,
    blankVotes: 2981,
    votes: { PSOE: 80559, JUNTS: 77931, ERC: 58534, VOX: 36247, PP: 30803, SUMAR: 19954, Podemos: 11734 }
  },
  {
    name: "Lleida",
    shortName: "LLE",
    seats: 4,
    blankVotes: 2059,
    votes: { PSOE: 46909, ERC: 42278, JUNTS: 40940, PP: 23292, VOX: 20051, SUMAR: 8221, Podemos: 4834 }
  },
  {
    name: "Tarragona",
    shortName: "TAR",
    seats: 6,
    blankVotes: 3168,
    votes: { PSOE: 104420, ERC: 68299, VOX: 60725, JUNTS: 50258, PP: 50184, SUMAR: 23553, Podemos: 13850 }
  },
  // COMUNIDAD VALENCIANA (32 escaños)
  {
    name: "Alicante",
    shortName: "ALI",
    seats: 12,
    blankVotes: 6575,
    votes: { PP: 324620, PSOE: 248051, VOX: 233284, SUMAR: 65369, Podemos: 38440 }
  },
  {
    name: "Castellón",
    shortName: "CAS",
    seats: 5,
    blankVotes: 2655,
    votes: { PP: 106442, PSOE: 86664, VOX: 78084, SUMAR: 24946, Podemos: 14670 }
  },
  {
    name: "Valencia",
    shortName: "VAL",
    seats: 16,
    blankVotes: 10810,
    votes: { PP: 475166, PSOE: 397721, VOX: 349060, SUMAR: 137097, Podemos: 80621 }
  },
  // EXTREMADURA (10 escaños)
  {
    name: "Badajoz",
    shortName: "BAD",
    seats: 5,
    blankVotes: 3225,
    votes: { PP: 145525, PSOE: 132305, VOX: 85394, SUMAR: 15118, Podemos: 8890 }
  },
  {
    name: "Cáceres",
    shortName: "CAC",
    seats: 4,
    blankVotes: 1721,
    votes: { PP: 88094, PSOE: 79045, VOX: 51206, SUMAR: 9233, Podemos: 5429 }
  },
  // GALICIA (23 escaños)
  {
    name: "A Coruña",
    shortName: "COR",
    seats: 8,
    blankVotes: 5197,
    votes: { PP: 287252, PSOE: 164568, BNG: 56895, VOX: 54932, SUMAR: 46643, Podemos: 27429 }
  },
  {
    name: "Lugo",
    shortName: "LUG",
    seats: 4,
    blankVotes: 1251,
    votes: { PP: 98056, PSOE: 51865, BNG: 14462, VOX: 13798, SUMAR: 5808, Podemos: 3415 }
  },
  {
    name: "Ourense",
    shortName: "OUR",
    seats: 4,
    blankVotes: 1109,
    votes: { PP: 91582, PSOE: 48306, VOX: 14495, BNG: 12881, SUMAR: 5742, Podemos: 3377 }
  },
  {
    name: "Pontevedra",
    shortName: "PON",
    seats: 7,
    blankVotes: 3865,
    votes: { PP: 223748, PSOE: 154947, BNG: 45268, VOX: 43963, SUMAR: 42689, Podemos: 25104 }
  },
  // LA RIOJA (4 escaños)
  {
    name: "La Rioja",
    shortName: "RIO",
    seats: 4,
    blankVotes: 1608,
    votes: { PP: 78346, PSOE: 53726, VOX: 27228, SUMAR: 6476, Podemos: 3808 }
  },
  // MADRID (37 escaños)
  {
    name: "Madrid",
    shortName: "MAD",
    seats: 37,
    blankVotes: 28960,
    votes: { PP: 1438054, PSOE: 866040, VOX: 808032, SUMAR: 314900, Podemos: 185179 }
  },
  // MURCIA (10 escaños)
  {
    name: "Murcia",
    shortName: "MUR",
    seats: 10,
    blankVotes: 5034,
    votes: { PP: 302683, VOX: 260408, PSOE: 163113, SUMAR: 40410, Podemos: 23763 }
  },
  // NAVARRA (5 escaños)
  {
    name: "Navarra",
    shortName: "NAV",
    seats: 5,
    blankVotes: 2890,
    votes: { PSOE: 80650, BILDU: 72597, UPN: 58766, PP: 56153, VOX: 31115, SUMAR: 24797, Podemos: 14582 }
  },
  // PAÍS VASCO (18 escaños)
  {
    name: "Álava",
    shortName: "ALA",
    seats: 4,
    blankVotes: 722,
    votes: { BILDU: 40621, PSOE: 40324, PNV: 34572, PP: 29693, SUMAR: 12172, VOX: 10493, Podemos: 7158 }
  },
  {
    name: "Guipúzcoa",
    shortName: "GUI",
    seats: 6,
    blankVotes: 2005,
    votes: { BILDU: 144471, PNV: 104702, PSOE: 75612, PP: 32159, SUMAR: 22628, Podemos: 13307, VOX: 12575 }
  },
  {
    name: "Vizcaya",
    shortName: "VIZ",
    seats: 8,
    blankVotes: 3391,
    votes: { PNV: 202183, BILDU: 154994, PSOE: 135732, PP: 69322, SUMAR: 37595, VOX: 25652, Podemos: 22108 }
  },
  // CEUTA (1 escaño)
  {
    name: "Ceuta",
    shortName: "CEU",
    seats: 1,
    blankVotes: 328,
    votes: { PP: 12696, VOX: 12375, PSOE: 9769, SUMAR: 464, Podemos: 273 }
  },
  // MELILLA (1 escaño)
  {
    name: "Melilla",
    shortName: "MEL",
    seats: 1,
    blankVotes: 253,
    votes: { PP: 13215, VOX: 6959, PSOE: 5985, SUMAR: 467, Podemos: 275 }
  },
];
