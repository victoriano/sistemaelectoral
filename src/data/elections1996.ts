// Datos OFICIALES de las Elecciones Generales de España 1996 (3 de marzo)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02199603_TOTA.zip
//   Ficheros: 08029603.DAT (votos y electos por candidatura y provincia),
//             07029603.DAT (resumen provincial: votos en blanco, escaños),
//             03029603.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PP 154, PSOE 141, IU 21, CiU 16, PNV 5, CCA 4, UPN 2, BNG 2, HB 2, ERC 1, EA 1, UV 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const circunscripciones1996: CircunscripcionData[] = [
  { name: "Álava", shortName: "ALA", seats: 4, blankVotes: 2490, votes: { PP: 45731, PSOE: 42561, PNV: 33761, IU: 19535, HB: 12552, EA: 9364, LVE: 774, PRT: 255, UC: 213, PH: 190 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 2289, votes: { PP: 105294, PSOE: 103471, IU: 22682, UC: 617, PRCM: 495, PH: 301, PRT: 242, FEA: 227, "TC-PNC": 156 } },
  { name: "Alicante", shortName: "ALI", seats: 11, blankVotes: 6997, votes: { PP: 382321, PSOE: 335149, IU: 88772, LVE: 6707, "UPV-BN": 5586, UV: 4292, PCPE: 1825, UC: 1239, ERC: 1034, FEA: 818, UPRA: 651, PRT: 473, PH: 370, AR: 324, ENV: 292 } },
  { name: "Almería", shortName: "ALM", seats: 5, blankVotes: 1890, votes: { PSOE: 135789, PP: 115925, IU: 28580, PA: 4754, NA: 344, PCPE: 296, FEA: 205, PH: 182, UC: 180, PRT: 152 } },
  { name: "Ávila", shortName: "AVI", seats: 3, blankVotes: 1171, votes: { PP: 68503, PSOE: 35527, IU: 8977, UC: 1793, URCL: 196, FEA: 163, PH: 147, "TC-PNC": 136, PRT: 95 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 3081, votes: { PSOE: 208287, PP: 167254, IU: 42434, CEX: 3389, SIEX: 1073, PCPE: 584, UC: 502, PRT: 288, FEI: 199 } },
  { name: "Islas Baleares", shortName: "BAL", seats: 7, blankVotes: 4318, votes: { PP: 194859, PSOE: 155244, IU: 33224, "PSM-ENE": 24644, LVE: 9539, UM: 6943, ERC: 1802, UC: 449, CR: 384, ABA: 379 } },
  { name: "Barcelona", shortName: "BCN", seats: 31, blankVotes: 20365, votes: { PSOE: 1203339, CiU: 818832, PP: 548323, IU: 260881, ERC: 114195, LVE: 6241, PEC: 3980, UC: 2221, PRT: 1936, FEA: 1296, PH: 1060, PICC: 895, CR: 655, N: 495 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 3753, votes: { PP: 126837, PSOE: 71804, IU: 25880, "TC-PNC": 3205, URCL: 632, UC: 524, PRT: 378, FEA: 264 } },
  { name: "Cáceres", shortName: "CAC", seats: 5, blankVotes: 2000, votes: { PSOE: 131616, PP: 115444, IU: 20068, CEX: 3923, SIEX: 605, UC: 505, PRT: 193, FEA: 174, PH: 140, CR: 124 } },
  { name: "Cádiz", shortName: "CAD", seats: 9, blankVotes: 5126, votes: { PSOE: 270237, PP: 217795, IU: 81116, PA: 37356, PCPE: 925, NA: 905, PRT: 576, UC: 574, FEA: 574, PH: 573 } },
  { name: "Castellón", shortName: "CAS", seats: 5, blankVotes: 2559, votes: { PP: 140578, PSOE: 120997, IU: 23003, UV: 5933, "UPV-BN": 4341, LVE: 2446, ERC: 840, PCPE: 666, UC: 544, PRT: 174, FEA: 163, ENV: 157, PH: 144 } },
  { name: "Ciudad Real", shortName: "CRE", seats: 5, blankVotes: 2632, votes: { PSOE: 142101, PP: 141494, IU: 25689, UC: 862, PRCM: 788, PH: 290, PRT: 208, "TC-PNC": 149 } },
  { name: "Córdoba", shortName: "COR", seats: 7, blankVotes: 3415, votes: { PSOE: 220659, PP: 163155, IU: 91773, PA: 13194, PCPE: 711, PRT: 295, NA: 290, UC: 281, FEA: 266, PH: 245 } },
  { name: "A Coruña", shortName: "COR", seats: 9, blankVotes: 6736, votes: { PP: 325922, PSOE: 233344, BNG: 87824, IU: 29669, LVE: 3102, UC: 1228, FPG: 825, PH: 619 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 1235, votes: { PP: 70199, PSOE: 59261, IU: 7844, UC: 601, PRCM: 270, "TC-PNC": 216, PRT: 89, PH: 88 } },
  { name: "Girona", shortName: "GIR", seats: 5, blankVotes: 1739, votes: { CiU: 136448, PSOE: 120118, PP: 39569, ERC: 18548, IU: 11038, LVE: 620, PEC: 325, PRT: 273, PH: 219, UC: 219, FEA: 131, PICC: 90 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 3749, votes: { PSOE: 237446, PP: 196049, IU: 61214, PA: 9878, PCPE: 716, UC: 469, PRT: 351, NA: 329, PH: 302, FEA: 290 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 1380, votes: { PP: 53683, PSOE: 36156, IU: 11080, PRGU: 338, UC: 333, FEA: 138, PH: 121, PRT: 96, "TC-PNC": 87, PRCM: 84 } },
  { name: "Guipúzcoa", shortName: "GUI", seats: 6, blankVotes: 7998, votes: { PSOE: 89645, PNV: 77976, HB: 72829, EA: 58030, PP: 56651, IU: 28644, LVE: 2199, PRT: 431, PH: 374, UC: 236 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 1758, votes: { PSOE: 138259, PP: 89882, IU: 27060, PA: 7129, PCPE: 246, NA: 215, PH: 172, UC: 167, PRT: 143, FEA: 95 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 1980, votes: { PP: 61900, PSOE: 55766, IU: 10230, CHA: 4571, SOS: 727, UC: 294, PRT: 167, FEA: 115 } },
  { name: "Jaén", shortName: "JAE", seats: 6, blankVotes: 2639, votes: { PSOE: 205818, PP: 155947, IU: 49564, PA: 7200, PCPE: 461, UC: 354, NA: 236, FEA: 218, PRT: 182, PH: 171 } },
  { name: "León", shortName: "LEO", seats: 5, blankVotes: 3586, votes: { PP: 162850, PSOE: 126532, IU: 25622, UPL: 12049, LVE: 1109, PB: 1000, PREPAL: 395, UC: 313, FEA: 208, PH: 134, PRT: 121, URCL: 115, "TC-PNC": 61 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 1601, votes: { CiU: 88880, PSOE: 74686, PP: 40463, ERC: 12615, IU: 7508, PRT: 191, UC: 154, PH: 121, PICC: 99 } },
  { name: "La Rioja", shortName: "RIO", seats: 4, blankVotes: 2612, votes: { PP: 88069, PSOE: 65311, IU: 15530, "P.RIOJANO": 6065, UC: 472, FEA: 167 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 1838, votes: { PP: 129523, PSOE: 78692, BNG: 24136, IU: 6292, LVE: 857, UC: 439, FPG: 250, FEA: 121, PH: 108 } },
  { name: "Madrid", shortName: "MAD", seats: 34, blankVotes: 41927, votes: { PP: 1642489, PSOE: 1046904, IU: 547901, "LV-GV": 12975, UC: 12220, LV: 8483, LVE: 5492, AUN: 1907, PRIM: 1671, PCPE: 1588, PH: 1495, PRT: 1339, FEA: 1031, PRV: 976, FEI: 867, PREPAL: 815, CR: 712, AR: 656, ADEC: 598 } },
  { name: "Málaga", shortName: "MAL", seats: 10, blankVotes: 6666, votes: { PSOE: 288165, PP: 263920, IU: 103930, PA: 18492, FEA: 985, PCPE: 792, NA: 686, UAD: 627, PH: 624, UC: 589 } },
  { name: "Murcia", shortName: "MUR", seats: 9, blankVotes: 5516, votes: { PP: 350337, PSOE: 266738, IU: 73961, UC: 1916, NR: 1452, PRT: 892, AUN: 711, FEA: 669 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 5480, votes: { UPN: 120335, PSOE: 98102, IU: 40354, HB: 26451, CDN: 17020, EA: 12233, PNV: 3158, PRT: 501, UC: 356, FEA: 196 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 1583, votes: { PP: 112326, PSOE: 83474, BNG: 27779, IU: 3915, LVE: 611, UC: 231, FPG: 193, PH: 110 } },
  { name: "Asturias", shortName: "AST", seats: 9, blankVotes: 6805, votes: { PP: 297079, PSOE: 288558, IU: 112339, PAS: 12213, LVE: 3575, UC: 1709, PCPE: 813, PRT: 497, FEA: 487 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 1688, votes: { PP: 63245, PSOE: 46740, IU: 9784, URCL: 515, UC: 492, "TC-PNC": 321, PH: 165, PCPE: 143, FEA: 134, PRT: 71 } },
  { name: "Las Palmas", shortName: "LPA", seats: 7, blankVotes: 2919, votes: { PP: 194812, PSOE: 118769, CCA: 110338, IU: 26305, "LV-GV": 1823, FREPIC: 1496, PCPE: 765, PCN: 722, LVE: 609, PH: 473, UC: 362 } },
  { name: "Pontevedra", shortName: "PON", seats: 8, blankVotes: 5526, votes: { PP: 259634, PSOE: 178981, BNG: 80408, IU: 22377, LVE: 2026, FPG: 797, UC: 715, PH: 607 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 3367, votes: { PP: 130734, PSOE: 84687, IU: 19526, URCL: 1289, PREPAL: 702, UC: 600, PH: 227, PRT: 226, "TC-PNC": 183, FEA: 171 } },
  { name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, blankVotes: 2098, votes: { PSOE: 144480, PP: 135701, CCA: 110080, IU: 21867, "LV-GV": 1539, FREPIC: 1071, UC: 808, LVE: 508, PCPE: 415, PH: 261, LG: 243 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 5578, votes: { PP: 175651, PSOE: 123940, IU: 39541, UC: 1408, PCPE: 640, PH: 608, PRT: 377, AR: 257 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 1514, votes: { PP: 54188, PSOE: 31903, IU: 8808, UC: 990, "LV-GV": 840, "TC-PNC": 249, URCL: 144, FEA: 98, PH: 90, PRT: 84, CR: 56 } },
  { name: "Sevilla", shortName: "SEV", seats: 13, blankVotes: 10812, votes: { PSOE: 521484, PP: 327384, IU: 139733, PA: 36797, PCPE: 1162, PRT: 1117, FEA: 616, VDPA: 529, PH: 515, NA: 500, UC: 478, AUN: 351, FEI: 346 } },
  { name: "Soria", shortName: "SOR", seats: 3, blankVotes: 1083, votes: { PP: 32561, PSOE: 20226, IU: 4662, UC: 200, "TC-PNC": 132, URCL: 119 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 2152, votes: { PSOE: 133000, CiU: 107473, PP: 70045, IU: 17558, ERC: 17187, LVE: 967, PRT: 242, FEA: 206, UC: 158, PICC: 145, PH: 127 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 1158, votes: { PP: 45207, PSOE: 37856, IU: 5506, CHA: 1691, UC: 227, PRT: 94, FEA: 91 } },
  { name: "Toledo", shortName: "TOL", seats: 5, blankVotes: 2720, votes: { PP: 164313, PSOE: 142262, IU: 27904, UC: 1011, PRV: 680, PRCM: 642, FEA: 329, "TC-PNC": 309, PH: 214, PRT: 194 } },
  { name: "Valencia", shortName: "VAL", seats: 16, blankVotes: 11175, votes: { PP: 607914, PSOE: 534847, IU: 174807, UV: 81350, "UPV-BN": 16850, LVE: 11249, UC: 1599, ERC: 1420, PCPE: 1415, FEA: 621, ENV: 574, PH: 486, CR: 482, PRT: 475, AUN: 428, ALAS: 402, LAE: 296 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 4844, votes: { PP: 164840, PSOE: 120941, IU: 42622, UC: 942, "TC-PNC": 925, URCL: 867, PH: 543, PCPE: 350, FEA: 301, PRT: 263 } },
  { name: "Vizcaya", shortName: "VIZ", seats: 9, blankVotes: 9063, votes: { PNV: 204056, PSOE: 166293, PP: 128904, HB: 69472, IU: 67954, EA: 36234, "ICV-GORORDO": 11833, LVE: 3058, PRT: 560, UC: 430, PH: 394, CR: 331, FEA: 139, FEI: 138 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 1677, votes: { PP: 75223, PSOE: 51509, IU: 7824, UC: 1473, PREPAL: 850, PIZ: 215, URCL: 184, PH: 132, PRT: 108, "TC-PNC": 77 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 6221, votes: { PP: 263868, PSOE: 174567, IU: 55019, CHA: 43477, SOS: 2026, PRT: 449, FEA: 407, PH: 299, DSA: 265 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 395, votes: { PP: 17288, PSOE: 11627, PSPC: 2365, IU: 718, PRT: 56, PH: 41 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 441, votes: { PP: 13788, PSOE: 11810, IU: 950, PNM: 200, UC: 74 } },
];
