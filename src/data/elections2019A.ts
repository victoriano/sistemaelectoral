// Datos OFICIALES de las Elecciones Generales de España 28-A 2019 (28 de abril)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201904_TOTA.zip
//   Ficheros: 08021904.DAT (votos y electos por candidatura y provincia),
//             07021904.DAT (resumen provincial: votos en blanco, escaños),
//             03021904.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PSOE 123, PP 66, Cs 57, UP 42, VOX 24, ERC 15, JUNTS 7, PNV 6, BILDU 4, CCA 2, NA+ 2, COMPROMIS 1, PRC 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const electionInfo2019A = {
  year: "2019-A",
  name: "Elecciones Generales 28-A 2019",
  date: "28 de abril de 2019",
};

export const circunscripciones2019A: CircunscripcionData[] = [
  { name: "A Coruña", shortName: "A C", seats: 8, blankVotes: 7901, votes: { PSOE: 212665, PP: 172799, UP: 100019, Cs: 81677, BNG: 45095, VOX: 38187, PACMA: 7176, "EN MAREA": 6806, PCOE: 1814, "R. Cero": 1331, CxG: 1272, PCTE: 600 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 1705, votes: { PSOE: 75005, PP: 51817, Cs: 43835, VOX: 33948, UP: 24855, PACMA: 2205, "R. Cero": 324, "PUM+J": 304, PCPE: 224, PCTE: 182 } },
  { name: "Alacant/Alicante", shortName: "ALA", seats: 12, blankVotes: 6222, votes: { PSOE: 259404, PP: 179056, Cs: 177691, UP: 127615, VOX: 115249, COMPROMIS: 31030, PACMA: 12982, "AVANT ADELA": 3183, "R. Cero": 1527, PCPE: 1345, ERPV: 1221, "P-LIB": 973 } },
  { name: "Almería", shortName: "ALM", seats: 6, blankVotes: 2283, votes: { PSOE: 98924, PP: 73952, VOX: 62648, Cs: 56268, UP: 28934, PACMA: 3452, EB: 536, "R. Cero": 412, PCPA: 353, "PUM+J": 335 } },
  { name: "Asturias", shortName: "AST", seats: 7, blankVotes: 6858, votes: { PSOE: 207586, PP: 112180, UP: 107426, Cs: 104688, VOX: 72018, PACMA: 6670, PACT: 4554, PCTE: 1359, "R. Cero": 1133, "ANDECHA AST": 932, "PUM+J": 777, PH: 480 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 3424, votes: { PSOE: 157164, PP: 83278, Cs: 75583, VOX: 44890, UP: 38252, PACMA: 2938, "C.Ex-C.R.Ex": 920, PACT: 745, "R. Cero": 449, "PUM+J": 442, DP: 308 } },
  { name: "Barcelona", shortName: "BAR", seats: 32, blankVotes: 16747, votes: { PSOE: 769548, ERC: 716714, UP: 509016, Cs: 373820, JUNTS: 316904, PP: 155935, VOX: 112019, "FRONT REPUB": 84945, PACMA: 50505, "R. Cero": 5845, PCPC: 2555, IZQP: 2213, PCTE: 1882, CNV: 1793 } },
  { name: "Bizkaia", shortName: "BIZ", seats: 8, blankVotes: 4557, votes: { PNV: 235916, PSOE: 136547, UP: 121740, BILDU: 91771, PP: 49859, Cs: 21392, VOX: 15839, PACMA: 6187, "R. Cero": 1177, "PUM+J": 844, PCTE: 603, SOLIDARIA: 528 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 2275, votes: { PSOE: 64287, PP: 53926, Cs: 43533, UP: 27436, VOX: 24382, PACMA: 1981, "R. Cero": 715, "PUM+J": 597, PCTE: 421 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 2303, votes: { PSOE: 90534, PP: 77902, Cs: 54361, PRC: 52266, VOX: 40139, UP: 36784, PACMA: 3049, EB: 427, "R. Cero": 332, PCPE: 286, "PUM+J": 274, PCTE: 260, "P-LIB": 187 } },
  { name: "Castelló/Castellón", shortName: "CAS", seats: 5, blankVotes: 2301, votes: { PSOE: 92379, PP: 63756, Cs: 51017, UP: 43656, VOX: 37551, COMPROMIS: 16713, PACMA: 3381, ERPV: 859, "AVANT ADELA": 586, "R. Cero": 341, PCPE: 329, "PUM+J": 302, "FE de las J": 222 } },
  { name: "Ciudad Real", shortName: "CIU", seats: 5, blankVotes: 2464, votes: { PSOE: 100720, PP: 69559, Cs: 50733, VOX: 40313, UP: 26952, PACMA: 2360, "R. Cero": 529, "PDSJE-UDEC": 277 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 1015, votes: { PSOE: 42654, PP: 31997, VOX: 16755, Cs: 16467, UP: 9482, PACMA: 776, "R. Cero": 135, "PUM+J": 109, PCTE: 84, "P-LIB": 56 } },
  { name: "Cáceres", shortName: "CÁC", seats: 4, blankVotes: 1770, votes: { PSOE: 93016, PP: 57195, Cs: 42452, VOX: 25903, UP: 24292, PACMA: 1724, "C.Ex-C.R.Ex": 1230, PACT: 743, "R. Cero": 407 } },
  { name: "Cádiz", shortName: "CÁD", seats: 9, blankVotes: 8206, votes: { PSOE: 210131, Cs: 131567, UP: 110807, PP: 99394, VOX: 87438, PACMA: 11079, AxSI: 4284, PCOE: 2224, "R. Cero": 1620, PCPA: 812 } },
  { name: "Córdoba", shortName: "CÓR", seats: 6, blankVotes: 4755, votes: { PSOE: 163000, PP: 89203, Cs: 79978, UP: 70427, VOX: 56919, PACMA: 4946, PCOE: 1233, PCPA: 816, EB: 788, "R. Cero": 756, "PUM+J": 469, PCTE: 426 } },
  { name: "Gipuzkoa", shortName: "GIP", seats: 6, blankVotes: 2422, votes: { PNV: 119668, BILDU: 96364, PSOE: 77720, UP: 71296, PP: 20797, Cs: 11892, VOX: 6783, PACMA: 3171, EB: 678, "R. Cero": 593, "PUM+J": 429, PCTE: 313 } },
  { name: "Girona", shortName: "GIR", seats: 6, blankVotes: 1854, votes: { ERC: 114031, JUNTS: 85863, PSOE: 65422, UP: 36947, Cs: 34009, "FRONT REPUB": 14434, PP: 12377, VOX: 10715, PACMA: 5112, CNV: 485, "R. Cero": 433, PCPC: 353, IZQP: 240 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 3728, votes: { PSOE: 177478, PP: 96588, Cs: 90935, VOX: 73914, UP: 71466, PACMA: 5804, "\"JF\"": 876, AxSI: 779, "R. Cero": 630, "PUM+J": 624, PCTE: 391, PCPA: 373, IZAR: 257 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 996, votes: { PSOE: 42521, PP: 28618, Cs: 26817, VOX: 23501, UP: 17524, PACMA: 1816, "R. Cero": 335, PCOE: 325, "PUM+J": 254 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 2909, votes: { PSOE: 97766, PP: 44909, Cs: 44842, UP: 34396, VOX: 33920, PACMA: 3182, PCOE: 871, AxSI: 856, "R. Cero": 646, PCPA: 272 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 1271, votes: { PSOE: 41354, PP: 25149, Cs: 24568, UP: 17151, VOX: 13389, PACMA: 1013, EB: 474, "R. Cero": 284, PCPE: 216, "PUM+J": 170, PYLN: 148, FIA: 127 } },
  { name: "Illes Balears", shortName: "ILL", seats: 8, blankVotes: 4647, votes: { PSOE: 136698, UP: 92477, Cs: 90340, PP: 87352, VOX: 58567, "ARA-MES-ESQ": 25191, "EL PI": 11692, PACMA: 8864, "R. Cero": 1197, PACT: 796, "PUM+J": 686 } },
  { name: "Jaén", shortName: "JAÉ", seats: 5, blankVotes: 2524, votes: { PSOE: 152932, PP: 75885, Cs: 61413, VOX: 46934, UP: 40880, PACMA: 3369, "CILU-LINARE": 1081, AxSI: 545, PCPA: 437, "R. Cero": 401, "PUM+J": 325, RISA: 190 } },
  { name: "La Rioja", shortName: "LA ", seats: 4, blankVotes: 1460, votes: { PSOE: 57307, PP: 47947, Cs: 32181, UP: 21331, VOX: 16255, "PR+": 2098, PACMA: 1394, EB: 385, "R. Cero": 275, "PUM+J": 199 } },
  { name: "Las Palmas", shortName: "LAS", seats: 8, blankVotes: 4261, votes: { PSOE: 154342, UP: 91216, PP: 88313, Cs: 84015, VOX: 38229, NCa: 36225, CCA: 34853, PACMA: 8669, "R. Cero": 1439, "AHORA CANAR": 1263, "PUM+J": 837, PCPE: 831, PH: 559 } },
  { name: "León", shortName: "LEÓ", seats: 4, blankVotes: 2899, votes: { PSOE: 95536, PP: 68530, Cs: 50945, UP: 35103, VOX: 33653, PACMA: 2338, PREPAL: 1476, "PUM+J": 419, PCTE: 402, "R. Cero": 299 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 1479, votes: { ERC: 75760, JUNTS: 46781, PSOE: 37637, Cs: 19150, UP: 18723, PP: 11153, "FRONT REPUB": 6194, VOX: 6005, PACMA: 2089, PCPC: 205, "R. Cero": 204, IZQP: 138, "PUM+J": 137 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 2320, votes: { PP: 67191, PSOE: 66441, UP: 20282, Cs: 17812, VOX: 11450, BNG: 9658, "EN MAREA": 2168, PACMA: 1602, CxG: 391, "R. Cero": 306, PCTE: 304, "C 21": 73 } },
  { name: "Madrid", shortName: "MAD", seats: 37, blankVotes: 24631, votes: { PSOE: 1031534, Cs: 792203, PP: 705119, UP: 613911, VOX: 524176, PACMA: 50909, PACT: 19208, "R. Cero": 7512, "PUM+J": 5221, PH: 3456, PCTE: 2329, PCPE: 2038 } },
  { name: "Murcia", shortName: "MUR", seats: 10, blankVotes: 4771, votes: { PSOE: 190540, PP: 180163, Cs: 150289, VOX: 143234, UP: 80053, PACMA: 10611, "SOMOS REGIÓ": 4976, "R. Cero": 1406, PCOE: 1162, IZQP: 712, PCPE: 663, DPL: 504 } },
  { name: "Málaga", shortName: "MÁL", seats: 11, blankVotes: 7288, votes: { PSOE: 251908, Cs: 159316, PP: 144562, UP: 118537, VOX: 114199, PACMA: 15122, "R. Cero": 1769, AxSI: 1655, "PUM+J": 1046, PCPA: 835, PCTE: 631 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 3767, votes: { "NA+": 107619, PSOE: 94551, UP: 68393, BILDU: 46765, GBAI: 22309, VOX: 17771, PACMA: 3325, "R. Cero": 1295, "PUM+J": 1203 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 1804, votes: { PP: 67020, PSOE: 63304, Cs: 20689, UP: 17213, VOX: 9984, BNG: 7548, "EN MAREA": 2220, PACMA: 1576, VOU: 335, CxG: 272, "PUM+J": 213, "R. Cero": 202, PCTE: 143 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 1010, votes: { PSOE: 33209, PP: 31332, Cs: 16843, VOX: 12407, UP: 9787, PACMA: 799, "R. Cero": 265, "PUM+J": 159, PCTE: 133, "FE de las J": 99 } },
  { name: "Pontevedra", shortName: "PON", seats: 7, blankVotes: 5257, votes: { PSOE: 185785, PP: 144290, UP: 100547, Cs: 63867, BNG: 32132, VOX: 27426, PACMA: 6859, "EN MAREA": 6705, "R. Cero": 1007, EB: 886, CxG: 825, PCTE: 601 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 1834, votes: { PP: 60154, PSOE: 59331, Cs: 43580, VOX: 26631, UP: 16575, PACMA: 1370, "PUM+J": 322, PREPAL: 309, "R. Cero": 275, PCTE: 265 } },
  { name: "Santa Cruz de Tenerife", shortName: "SAN", seats: 7, blankVotes: 3352, votes: { PSOE: 141132, CCA: 102811, PP: 76491, UP: 75695, Cs: 71667, VOX: 31385, PACMA: 9157, "AHORA CANAR": 1774, "R. Cero": 1212, PCPE: 655, "PUM+J": 582, F8: 571 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 779, votes: { PSOE: 26088, PP: 24853, Cs: 18460, VOX: 11468, UP: 8931, PACMA: 611, centrados: 459, PACT: 276, PCOE: 184, "R. Cero": 183, "PUM+J": 127, PCTE: 89 } },
  { name: "Sevilla", shortName: "SEV", seats: 12, blankVotes: 11391, votes: { PSOE: 416543, Cs: 187243, UP: 179497, PP: 162891, VOX: 136949, PACMA: 15073, PACT: 3567, AxSI: 3288, "R. Cero": 1592, "PUM+J": 1527, PCOE: 1317, PCTE: 830, PCPA: 799 } },
  { name: "Soria", shortName: "SOR", seats: 2, blankVotes: 642, votes: { PSOE: 16513, PP: 13887, Cs: 8501, VOX: 4866, UP: 4481, PPSO: 2663, PACMA: 263, "R. Cero": 103, PCTE: 81, "PUM+J": 77 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 2202, votes: { ERC: 113887, PSOE: 89650, Cs: 52395, JUNTS: 51239, UP: 50979, PP: 21376, VOX: 20105, "FRONT REPUB": 8234, PACMA: 6189, PCTE: 471, "R. Cero": 462, "PUM+J": 280, CNV: 263, PCPC: 260, IZQP: 200 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 823, votes: { PSOE: 25629, PP: 18566, Cs: 15357, VOX: 8336, UP: 8224, PACMA: 452, EB: 272, "R. Cero": 113, PCPE: 96, "PUM+J": 74, PYLN: 66, "+MAS+": 47, UDT: 28 } },
  { name: "Toledo", shortName: "TOL", seats: 6, blankVotes: 2483, votes: { PSOE: 123561, PP: 87134, Cs: 69678, VOX: 66927, UP: 41934, PACMA: 3931, "R. Cero": 703, "PUM+J": 559 } },
  { name: "València/Valencia", shortName: "VAL", seats: 15, blankVotes: 9156, votes: { PSOE: 394703, PP: 255868, Cs: 254360, UP: 211527, VOX: 170070, COMPROMIS: 126078, PACMA: 20923, "UIG-SOM-CUI": 4473, "AVANT ADELA": 3563, ERPV: 2156, "R. Cero": 2108, PCPE: 1542 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 2801, votes: { PSOE: 97244, PP: 78433, Cs: 67775, VOX: 45965, UP: 39305, PACMA: 2699, "R. Cero": 545, "UNIÓN REGIO": 490, "PUM+J": 473, PCPE: 313, PCTE: 282, "FE de las J": 229 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 1070, votes: { PSOE: 34628, PP: 32750, Cs: 18729, VOX: 12887, UP: 9187, PACMA: 585, PREPAL: 405, "R. Cero": 147, "PUM+J": 141, PCTE: 116 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 4861, votes: { PSOE: 173557, Cs: 115651, PP: 99527, UP: 77555, VOX: 70663, PACMA: 5469, EB: 2626, "R. Cero": 1428, "PUM+J": 749, FIA: 658, PYLN: 621, PCTE: 589, PCPE: 453 } },
  { name: "Araba/Álava", shortName: "ARA", seats: 4, blankVotes: 1075, votes: { PNV: 40300, PSOE: 39722, UP: 31469, BILDU: 24747, PP: 24385, Cs: 7082, VOX: 5608, PACMA: 1869, "R. Cero": 536, "PUM+J": 338, PCTE: 235 } },
  { name: "Ávila", shortName: "ÁVI", seats: 3, blankVotes: 722, votes: { PP: 32001, PSOE: 26503, Cs: 19102, VOX: 14623, UP: 7730, PACMA: 673, PACT: 347, "R. Cero": 169, "PUM+J": 113, "FE de las J": 96 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 324, votes: { PSOE: 13800, VOX: 9092, PP: 8147, Cs: 4546, UP: 1838, "R. Cero": 157, "PUM+J": 87 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 237, votes: { PP: 8087, PSOE: 6989, CpM: 6857, VOX: 5807, Cs: 4351, UP: 1292, "R. Cero": 99, "PUM+J": 39 } },
];
