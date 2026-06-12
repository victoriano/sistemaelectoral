// Datos OFICIALES de las Elecciones Generales de España 1993 (6 de junio)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02199306_TOTA.zip
//   Ficheros: 08029306.DAT (votos y electos por candidatura y provincia),
//             07029306.DAT (resumen provincial: votos en blanco, escaños),
//             03029306.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PSOE 159, PP 138, IU 18, CiU 17, PNV 5, CCA 4, UPN 3, HB 2, ERC 1, EA 1, PAR 1, UV 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const circunscripciones1993: CircunscripcionData[] = [
  { name: "Álava", shortName: "ALA", seats: 4, blankVotes: 2223, votes: { PSOE: 40860, PP: 30652, PNV: 26321, UA: 16623, HB: 14702, IU: 10748, EA: 9036, CDS: 1818, VERDES: 1775, LE: 1084, "ARM-ADE": 392, PLN: 204, NPS: 127, POR: 111 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 1843, votes: { PSOE: 103057, PP: 90453, IU: 20841, CDS: 4253, VERDES: 1310, LE: 619, "ARM-ADE": 456, PH: 132, "TC-PNC": 130, PLN: 125, NPS: 116 } },
  { name: "Alicante", shortName: "ALI", seats: 10, blankVotes: 4163, votes: { PP: 340312, PSOE: 312754, IU: 80339, CDS: 15212, UPV: 7488, VERDES: 6274, UV: 4328, LE: 2311, "ARM-ADE": 2117, PVPA: 1375, PCPE: 1148, SEES: 821, "FE-JONS": 729, "UNI.D.A": 715, PC: 685, POR: 522, ENV: 327, ACI: 294, ARDE: 292, NPS: 271, PH: 244, PLN: 200 } },
  { name: "Almería", shortName: "ALM", seats: 5, blankVotes: 1153, votes: { PSOE: 126242, PP: 98341, IU: 25020, CDS: 3585, PA: 3551, GIL: 1475, VERDES: 1391, PAP: 952, LE: 487, PIAP: 466, "ARM-ADE": 375, "FE-JONS": 131, PLN: 106, NPS: 101 } },
  { name: "Ávila", shortName: "AVI", seats: 3, blankVotes: 894, votes: { PP: 57324, PSOE: 34806, CDS: 13444, IU: 6227, VERDES: 654, LE: 283, "ARM-ADE": 181, URCL: 136, "TC-PNC": 103, PLN: 51, NPS: 50, PB: 41, PH: 37 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 2206, votes: { PSOE: 211124, PP: 142563, IU: 36552, CDS: 7657, "E U": 2130, VERDES: 1997, LE: 774, PREX: 483, "ARM-ADE": 394, NPS: 264, PLN: 171, PH: 119 } },
  { name: "Islas Baleares", shortName: "BAL", seats: 7, blankVotes: 3485, votes: { PP: 191461, PSOE: 140145, IU: 24574, "PSM-ENE": 20118, UMMP: 10053, VERDES: 8971, CDS: 7648, ERC: 2848, "ARM-ADE": 1268, PLN: 550, ABE: 416, POR: 369, NPS: 357, PRB: 282 } },
  { name: "Barcelona", shortName: "BCN", seats: 32, blankVotes: 18229, votes: { PSOE: 1030053, CiU: 851105, PP: 480204, IU: 240019, ERC: 122530, VERDES: 30188, CDS: 22446, LE: 9495, "PEC-VERDE": 8179, PST: 6813, "ARM-ADE": 4958, POR: 2557, PH: 1181, "FE-JONS": 1132, PLN: 1118, "FE (A)": 747, NPS: 712, UDLA: 594 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 3121, votes: { PP: 111439, PSOE: 76863, IU: 20343, CDS: 6734, VERDES: 1907, "TC-PNC": 1622, LE: 920, "ARM-ADE": 579, UC: 446, "FE-JONS": 176, NPS: 165, ACI: 161, PLN: 128, PB: 117, PH: 113 } },
  { name: "Cáceres", shortName: "CAC", seats: 5, blankVotes: 1403, votes: { PSOE: 131853, PP: 95628, IU: 15662, CDS: 5941, "E U": 4778, PREX: 1603, VERDES: 1391, LE: 786, "ARM-ADE": 305, PLN: 129 } },
  { name: "Cádiz", shortName: "CAD", seats: 9, blankVotes: 3054, votes: { PSOE: 280715, PP: 155785, IU: 61604, PAP: 27225, PA: 15786, CDS: 4287, VERDES: 3518, "ARM-ADE": 2732, GIL: 2455, LE: 1620, PST: 1250, PCPE: 740, "FE-JONS": 345, PLN: 279, NPS: 215, PH: 189 } },
  { name: "Castellón", shortName: "CAS", seats: 5, blankVotes: 1881, votes: { PP: 128916, PSOE: 113752, IU: 20250, UPV: 6135, CDS: 5867, UV: 5014, VERDES: 2294, LE: 1096, "ARM-ADE": 564, ARDE: 501, POR: 209, ENV: 164, "FE-JONS": 163, PC: 158, PLN: 140, NPS: 119, PH: 99 } },
  { name: "Ciudad Real", shortName: "CRE", seats: 5, blankVotes: 2055, votes: { PSOE: 146867, PP: 119123, IU: 21856, CDS: 6383, VERDES: 1481, LE: 717, "ARM-ADE": 550, "TC-PNC": 187, PLN: 162, NPS: 154, PH: 121 } },
  { name: "Córdoba", shortName: "COR", seats: 7, blankVotes: 2301, votes: { PSOE: 230258, PP: 128898, IU: 80977, PA: 12564, CDS: 4648, PAP: 2264, VERDES: 1530, GIL: 1298, LE: 956, PCPE: 885, "ARM-ADE": 457, "FE-JONS": 195, PLN: 134, PH: 123, NPS: 110 } },
  { name: "A Coruña", shortName: "COR", seats: 9, blankVotes: 6136, votes: { PP: 281077, PSOE: 236812, BNG: 53153, IU: 34550, CDS: 11328, VERDES: 2276, AG: 2252, LE: 1883, CNG: 1357, PST: 1355, "ARM-ADE": 1156, PCPE: 874, NPS: 340, PH: 336, PLN: 281, PB: 277 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 1064, votes: { PP: 64408, PSOE: 59763, IU: 7041, CDS: 3325, VERDES: 497, "TC-PNC": 361, LE: 235, "ARM-ADE": 232, UC: 124, PLN: 51, PH: 40 } },
  { name: "Girona", shortName: "GIR", seats: 5, blankVotes: 1911, votes: { CiU: 128957, PSOE: 84586, PP: 39112, ERC: 27449, IU: 10437, VERDES: 2846, CDS: 1519, PST: 1124, LE: 1078, "ARM-ADE": 682, POR: 290, NPS: 216, PLN: 170, PH: 125 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 2167, votes: { PSOE: 229537, PP: 160955, IU: 50588, PA: 6978, CDS: 5324, VERDES: 3687, PAP: 1757, GIL: 1034, LE: 1006, PCPE: 550, "ARM-ADE": 480, "FE-JONS": 245, PLN: 132, PH: 114, NPS: 111 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 1072, votes: { PP: 46908, PSOE: 35163, IU: 8826, CDS: 2300, VERDES: 647, "ARM-ADE": 311, LE: 308, PRGU: 267, "TC-PNC": 104, "FE-JONS": 75, NPS: 39, PH: 37, PLN: 34 } },
  { name: "Guipúzcoa", shortName: "GUI", seats: 6, blankVotes: 8775, votes: { PSOE: 86410, HB: 76309, EA: 66645, PNV: 64195, PP: 42934, IU: 17733, VERDES: 3703, CDS: 2044, LE: 1839, "ARM-ADE": 779, PLN: 310, POR: 216, NPS: 123 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 1185, votes: { PSOE: 138445, PP: 72640, IU: 22439, PA: 7454, CDS: 2093, PAP: 1304, VERDES: 1161, GIL: 676, LE: 538, "ARM-ADE": 392, PCPE: 290, "FE-JONS": 109, PLN: 90, PH: 58 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 1033, votes: { PSOE: 50720, PP: 43059, PAR: 23784, IU: 9756, CDS: 2840, CHA: 1229, PLN: 364, "ARM-ADE": 309, POR: 125, NPS: 81 } },
  { name: "Jaén", shortName: "JAE", seats: 6, blankVotes: 1683, votes: { PSOE: 210306, PP: 129705, IU: 41311, PA: 7211, CDS: 3455, VERDES: 1602, PAP: 1380, GIL: 735, LE: 607, OS: 540, PCPE: 526, "ARM-ADE": 324, "FE-JONS": 221, NPS: 128, PLN: 98, PH: 80 } },
  { name: "León", shortName: "LEO", seats: 5, blankVotes: 3440, votes: { PP: 142574, PSOE: 130241, IU: 21510, UPL: 11805, CDS: 7694, VERDES: 1682, PB: 1418, LE: 704, "ARM-ADE": 627, PREPAL: 385, "FE-JONS": 220, "TC-PNC": 117, PLN: 113, NPS: 109, PH: 106 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 1618, votes: { CiU: 83092, PSOE: 57218, PP: 41744, ERC: 15742, IU: 6798, VERDES: 1563, CDS: 1310, PST: 614, LE: 530, "ARM-ADE": 520, POR: 155, PLN: 143, PH: 98, NPS: 72 } },
  { name: "La Rioja", shortName: "RIO", seats: 4, blankVotes: 2125, votes: { PP: 78792, PSOE: 64037, IU: 11850, "P. RIOJANO": 7532, CDS: 3609, VERDES: 996, LE: 493, "ARM-ADE": 432, SEES: 142, PLN: 82, NPS: 76, ARDE: 73, PH: 71 } },
  { name: "Lugo", shortName: "LUG", seats: 5, blankVotes: 1766, votes: { PP: 120130, PSOE: 72745, BNG: 16226, IU: 6155, CNG: 3306, CDS: 2842, VERDES: 937, LE: 508, "ARM-ADE": 310, PCPE: 250, AG: 248, NPS: 159, PB: 108, PH: 107, PLN: 98 } },
  { name: "Madrid", shortName: "MAD", seats: 34, blankVotes: 30554, votes: { PP: 1373042, PSOE: 1093015, IU: 455685, CDS: 93347, VERDES: 33295, "ARM-ADE": 13782, LE: 10429, PST: 4808, "E U": 3745, PRIM: 1917, "FE-JONS": 1488, POR: 1391, "FE (I)": 1212, PLN: 1209, ARDE: 1202, ACI: 1189, MCE: 1178, PH: 1079, "TC-PNC": 805, FPE: 641, UPL: 608, NPS: 529 } },
  { name: "Málaga", shortName: "MAL", seats: 10, blankVotes: 3093, votes: { PSOE: 304745, PP: 196911, IU: 89498, PA: 12548, GIL: 8004, CDS: 5911, VERDES: 4976, PAP: 4403, LE: 2069, "ARM-ADE": 915, PCPE: 591, SEES: 578, "FE-JONS": 444, PH: 215 } },
  { name: "Murcia", shortName: "MUR", seats: 9, blankVotes: 3433, votes: { PP: 310507, PSOE: 253324, IU: 63717, CDS: 14442, VERDES: 5085, LE: 1685, ARCOIRIS: 1407, "ARM-ADE": 1399, POR: 686, PH: 487, PLN: 362 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 4495, votes: { UPN: 112228, PSOE: 108305, HB: 32221, IU: 27043, EA: 11437, CDS: 5241, VERDES: 4263, PNV: 3540, "ARM-ADE": 903, PLN: 332, PH: 244, POR: 201, NPS: 172 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 1472, votes: { PP: 106471, PSOE: 85035, BNG: 13780, IU: 4952, CDS: 2570, "ARM-ADE": 688, VERDES: 653, LE: 344, PCPE: 244, NPS: 146, AG: 144, PB: 123, PH: 80, PLN: 69 } },
  { name: "Asturias", shortName: "AST", seats: 9, blankVotes: 6306, votes: { PSOE: 271877, PP: 258355, IU: 106757, CDS: 25351, PAS: 11088, VERDES: 4532, PST: 2249, LE: 1408, "ARM-ADE": 920, AA: 787, CONCEYU: 528, "FE-JONS": 355, PLN: 261, UPL: 243, NPS: 186, PH: 178 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 1250, votes: { PP: 57744, PSOE: 46448, IU: 7761, CDS: 3714, APP: 1410, VERDES: 826, "ARM-ADE": 550, URCL: 428, LE: 322, "TC-PNC": 216, PCPE: 147, "FE-JONS": 122, PLN: 94, UC: 93, UPL: 52, PH: 51, PB: 35 } },
  { name: "Las Palmas", shortName: "LPA", seats: 7, blankVotes: 3029, votes: { PP: 160131, PSOE: 104367, CCA: 102913, IU: 22382, PGC: 15246, CDS: 4064, VERDES: 2452, LE: 1460, AIGRANC: 1009, PCPE: 884, "ARM-ADE": 634, PST: 563, NPS: 326, "P. TAGOROR": 278, PH: 262, PLN: 189 } },
  { name: "Pontevedra", shortName: "PON", seats: 8, blankVotes: 4388, votes: { PP: 239286, PSOE: 175307, BNG: 43806, IU: 28948, CDS: 7539, LE: 1804, "ARM-ADE": 1759, VERDES: 1600, PCPE: 849, AG: 642, PH: 338, PB: 291, NPS: 285, PLN: 279 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 2775, votes: { PP: 114031, PSOE: 87578, IU: 15633, CDS: 9041, VERDES: 2454, URCL: 761, LE: 679, "ARM-ADE": 569, PREPAL: 287, "FE-JONS": 169, NPS: 157, "TC-PNC": 131, PLN: 113, UPL: 110, PH: 93, PB: 83 } },
  { name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, blankVotes: 2076, votes: { PSOE: 137281, PP: 114535, CCA: 104164, IU: 17932, CDS: 5846, LE: 2801, PST: 1569, ATF: 1159, NPS: 454, "ARM-ADE": 448, LG: 385, PLN: 374, PH: 305 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 4252, votes: { PSOE: 122418, PP: 121967, UPCA: 27005, IU: 24453, PRC: 18608, CDS: 5081, VERDES: 1777, LE: 855, PST: 729, "ARM-ADE": 557, PCPE: 537, PNC: 383, PH: 239, PLN: 184, ARDE: 152, NPS: 147 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 1249, votes: { PP: 46001, PSOE: 30945, CDS: 8628, IU: 7104, VERDES: 854, LE: 347, "ARM-ADE": 237, "TC-PNC": 141, URCL: 140, PH: 86, PLN: 73, PB: 28 } },
  { name: "Sevilla", shortName: "SEV", seats: 12, blankVotes: 6106, votes: { PSOE: 543651, PP: 252241, IU: 113316, PA: 30421, CDS: 5597, VERDES: 5507, PAP: 3884, LE: 2506, PCPE: 1718, PST: 1713, "ARM-ADE": 1090, GIL: 775, PLN: 608, "FE-JONS": 440, NPS: 270, PH: 255, "FE (I)": 203 } },
  { name: "Soria", shortName: "SOR", seats: 3, blankVotes: 844, votes: { PP: 29627, PSOE: 21498, IU: 3280, CDS: 2151, VERDES: 305, "ARM-ADE": 199, LE: 128, US: 98, PANCAL: 70, UC: 64, URCL: 46, PLN: 35, NPS: 33, "TC-PNC": 31, PH: 12 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 2398, votes: { PSOE: 105981, CiU: 102629, PP: 63433, ERC: 21063, IU: 16190, CDS: 2301, VERDES: 2086, "PEC-VERDE": 1070, PST: 805, "ARM-ADE": 801, LE: 743, POR: 244, PLN: 161, "FE-JONS": 134, PH: 109, NPS: 106 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 597, votes: { PSOE: 36327, PP: 34293, PAR: 12070, IU: 3990, CDS: 1644, CHA: 465, LE: 200, VERDES: 193, "ARM-ADE": 86, PH: 63, POR: 56, NPS: 54, PLN: 46 } },
  { name: "Toledo", shortName: "TOL", seats: 5, blankVotes: 2305, votes: { PSOE: 142960, PP: 142403, IU: 23324, CDS: 5607, VERDES: 1638, LE: 907, "ARM-ADE": 681, "TC-PNC": 184, PLN: 167, MCES: 137, NPS: 107, PH: 101 } },
  { name: "Valencia", shortName: "VAL", seats: 16, blankVotes: 8144, votes: { PP: 518089, PSOE: 508819, IU: 156340, UV: 102999, UPV: 27429, CDS: 18844, VERDES: 14403, LE: 3760, "ARM-ADE": 3111, PST: 1631, ENV: 1026, POR: 873, ARDE: 843, "FE-JONS": 652, PLN: 533, PC: 457, PH: 421, NPS: 339 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 3991, votes: { PP: 145368, PSOE: 115617, IU: 37532, CDS: 11408, VERDES: 2141, LE: 1220, URCL: 908, "ARM-ADE": 573, "TC-PNC": 441, "FE-JONS": 342, UC: 222, UPL: 149, PH: 132, PLN: 132, MCES: 107, NPS: 99, PB: 86 } },
  { name: "Vizcaya", shortName: "VIZ", seats: 9, blankVotes: 8060, votes: { PNV: 197392, PSOE: 166172, PP: 102172, HB: 83644, IU: 47091, EA: 42175, VERDES: 6769, CDS: 5285, LE: 3215, PST: 3053, "ARM-ADE": 1359, PITRCG: 408, POR: 405, PLN: 387, PH: 353, NPS: 251 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 1437, votes: { PP: 67597, PSOE: 53965, IU: 6027, CDS: 4703, VERDES: 747, PREPAL: 521, "ARM-ADE": 421, LE: 352, URCL: 296, UPL: 130, "FE-JONS": 113, "TC-PNC": 74, PB: 74, PH: 69, PLN: 63 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 3883, votes: { PSOE: 174061, PP: 172753, PAR: 108690, IU: 60074, CDS: 5765, CHA: 4650, VERDES: 2615, PST: 1692, "ARM-ADE": 954, LE: 740, SEES: 418, IF: 303, POR: 257, PLN: 135, PH: 132, NPS: 115 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 231, votes: { PP: 15276, PSOE: 12170, PSPC: 1155, VERDES: 491, CDS: 485, PST: 100, PLN: 43, INCE: 42 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 325, votes: { PSOE: 12885, PP: 11865, IU: 687, CDS: 569, PLN: 80 } },
];
