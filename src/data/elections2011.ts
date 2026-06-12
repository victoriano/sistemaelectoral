// Datos OFICIALES de las Elecciones Generales de España 20-N 2011 (20 de noviembre)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201111_TOTA.zip
//   Ficheros: 08021111.DAT (votos y electos por candidatura y provincia),
//             07021111.DAT (resumen provincial: votos en blanco, escaños),
//             03021111.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PP 184, PSOE 110, CiU 16, IU 11, BILDU 7, UPyD 5, PNV 5, ERC 3, UPN 2, BNG 2, CCA 2, COMPROMIS 1, FAC 1, GBAI 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2011: CircunscripcionData[] = [
  { name: "Álava", shortName: "ALA", seats: 4, blankVotes: 1924, votes: { PP: 46034, PSOE: 39698, BILDU: 32439, PNV: 31931, IU: 6917, UPyD: 4662, EQUO: 3574, PACMA: 1178, "PUM+J": 778, UCE: 290 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 3082, votes: { PP: 127995, PSOE: 69981, IU: 14324, UPyD: 11614, EQUO: 2077, Eb: 1153, PACMA: 921, "PUM+J": 597, "P.C.P.E.": 386, CYD: 192 } },
  { name: "Alicante", shortName: "ALI", seats: 12, blankVotes: 10124, votes: { PP: 489946, PSOE: 239318, IU: 57677, UPyD: 49662, COMPROMIS: 27619, PACMA: 4904, ERC: 2301, "P.C.P.E.": 2122, PH: 1782, RPS: 1078, UCE: 894 } },
  { name: "Almería", shortName: "ALM", seats: 6, blankVotes: 3490, votes: { PP: 180249, PSOE: 93495, IU: 16445, UPyD: 12225, EQUO: 2828, PA: 2659, "D.N.": 493, ANTICAPITALISTAS: 338, DeC: 270, PRAO: 253, UCE: 178 } },
  { name: "Ávila", shortName: "AVI", seats: 3, blankVotes: 1233, votes: { PP: 65600, PSOE: 24278, UPyD: 8217, IU: 4803, EQUO: 725, PACMA: 275, "FE de las JONS": 233, RPS: 200, "HARTOS.ORG": 174, "PUM+J": 105, PFyV: 83, UCE: 50 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 4832, votes: { PP: 207068, PSOE: 153692, IU: 24344, UPyD: 14174, EQUO: 1801, PACMA: 1371, "PUM+J": 986, CEx: 574 } },
  { name: "Islas Baleares", shortName: "BAL", seats: 8, blankVotes: 7941, votes: { PP: 217327, PSOE: 126512, EQUO: 31417, IU: 21668, UPyD: 18525, ERC: 4681, Eb: 4271, PACMA: 3641, "PUM+J": 1093, PFyV: 746, UCE: 450 } },
  { name: "Barcelona", shortName: "BCN", seats: 31, blankVotes: 46738, votes: { PSOE: 727220, CiU: 710178, PP: 547376, IU: 237327, ERC: 169601, PxC: 53142, Eb: 40054, UPyD: 33111, PACMA: 18638, "PIRATA.CAT": 17393, ANTICAPITALISTAS: 11346, UCE: 3341 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 3952, votes: { PP: 116057, PSOE: 59878, UPyD: 16090, IU: 11892, EQUO: 1938, PCAS: 1515, PACMA: 1007, "PUM+J": 605, ANTICAPITALISTAS: 502, SAIn: 454, CCD: 203 } },
  { name: "Cáceres", shortName: "CAC", seats: 4, blankVotes: 2941, votes: { PP: 132169, PSOE: 92822, IU: 13422, UPyD: 8739, EQUO: 1695, PACMA: 886, "PUM+J": 544, CEx: 516, UCE: 256 } },
  { name: "Cádiz", shortName: "CAD", seats: 8, blankVotes: 8511, votes: { PP: 291897, PSOE: 203251, IU: 54262, UPyD: 29761, PA: 19289, EQUO: 4345, PACMA: 2872, Eb: 2329, "P.C.P.E.": 1072, "HARTOS.ORG": 921, ANTICAPITALISTAS: 874, INTERNET: 603, UCE: 265 } },
  { name: "Castellón", shortName: "CAS", seats: 5, blankVotes: 4146, votes: { PP: 156683, PSOE: 87657, IU: 15692, UPyD: 12008, COMPROMIS: 11890, "ESPAÑA 2000": 3687, ERC: 1501, PACMA: 1223, PIRATA: 1001, "P.C.P.E.": 563, POSI: 284, UCE: 180 } },
  { name: "Ciudad Real", shortName: "CRE", seats: 5, blankVotes: 4016, votes: { PP: 164776, PSOE: 95375, IU: 16116, UPyD: 13106, EQUO: 1517, Eb: 1225, PACMA: 836, CCD: 469, "P.C.P.E.": 423, "PUM+J": 381, UCE: 101 } },
  { name: "Córdoba", shortName: "COR", seats: 6, blankVotes: 6490, votes: { PP: 209067, PSOE: 170367, IU: 46066, UPyD: 17998, PA: 10453, EQUO: 3782, Eb: 1786, "P.C.P.E.": 982, "PUM+J": 701, "FE de las JONS": 502, SAIn: 241, UCE: 188 } },
  { name: "A Coruña", shortName: "COR", seats: 8, blankVotes: 12173, votes: { PP: 343270, PSOE: 182056, BNG: 77945, IU: 30557, UPyD: 8812, EQUO: 4802, PACMA: 2709, "PUM+J": 1241, "P.C.P.E.": 776, PH: 694, "C.XXI": 487, SAIn: 476, UCE: 319 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 1737, votes: { PP: 69939, PSOE: 41293, IU: 5968, UPyD: 4468, EQUO: 802, PACMA: 306, "C.D.L.": 178, "PUM+J": 157, PCAS: 154, UCE: 90 } },
  { name: "Girona", shortName: "GIR", seats: 6, blankVotes: 5572, votes: { CiU: 120156, PSOE: 65674, PP: 49617, ERC: 33000, IU: 16777, Eb: 5206, PxC: 2636, PACMA: 2163, "PIRATA.CAT": 1865, UPyD: 1798, ANTICAPITALISTAS: 1099, "P.C.P.E.": 480, UCE: 205 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 5294, votes: { PP: 237785, PSOE: 185867, IU: 40360, UPyD: 26255, PA: 3942, EQUO: 3852, PACMA: 1370, Eb: 1200, "P.C.P.E.": 873, PRAO: 620, "PUM+J": 544, ANTICAPITALISTAS: 484, SAIn: 185, UCE: 151 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 1776, votes: { PP: 71362, PSOE: 36589, UPyD: 9947, IU: 9036, EQUO: 1273, PACMA: 620, Eb: 498, "D.N.": 471, PCAS: 197, ANTICAPITALISTAS: 194, CCD: 99, UCE: 92 } },
  { name: "Guipúzcoa", shortName: "GUI", seats: 6, blankVotes: 4239, votes: { BILDU: 130055, PNV: 83703, PSOE: 78462, PP: 51362, IU: 12595, UPyD: 5734, EQUO: 4390, PACMA: 1990, "PUM+J": 1038, UCE: 399 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 3412, votes: { PP: 115651, PSOE: 106835, IU: 18532, UPyD: 9048, PA: 4992, EQUO: 2001, Eb: 917, PACMA: 821, "P.C.P.E.": 444, "PUM+J": 309, "D.N.": 296, RPS: 249 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 2890, votes: { PP: 58435, PSOE: 40721, IU: 9937, UPyD: 5408, EQUO: 1471, PACMA: 558, PIRATA: 403, "P.C.P.E.": 354, "PUM+J": 286, UCE: 107 } },
  { name: "Jaén", shortName: "JAE", seats: 6, blankVotes: 4124, votes: { PP: 183339, PSOE: 165348, IU: 28059, UPyD: 13727, PA: 4920, EQUO: 2149, PRAO: 911, SAIn: 454, UCE: 412 } },
  { name: "León", shortName: "LEO", seats: 5, blankVotes: 5470, votes: { PP: 152672, PSOE: 100210, IU: 15598, UPyD: 13672, EQUO: 2154, PREPAL: 1221, PACMA: 1074, "PUM+J": 565, "P.C.P.E.": 502, UCE: 152 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 4468, votes: { CiU: 79511, PSOE: 39157, PP: 37401, ERC: 16529, IU: 7487, Eb: 2573, PxC: 1074, UPyD: 1069, "PIRATA.CAT": 915, PACMA: 892, ANTICAPITALISTAS: 551, "PUM+J": 366, "P.C.P.E.": 355, UCE: 91 } },
  { name: "La Rioja", shortName: "RIO", seats: 4, blankVotes: 2793, votes: { PP: 95124, PSOE: 54066, UPyD: 10367, IU: 7995, EQUO: 1626, PACMA: 779, "PUM+J": 686, "P.C.P.E.": 380, UCE: 94 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 3628, votes: { PP: 121422, PSOE: 61357, BNG: 19811, IU: 6603, UPyD: 2020, PACMA: 1054, UCE: 293, "C.XXI": 247 } },
  { name: "Madrid", shortName: "MAD", seats: 36, blankVotes: 35093, votes: { PP: 1719709, PSOE: 878724, UPyD: 347354, IU: 271209, EQUO: 65169, PACMA: 13136, Eb: 12877, FAC: 6645, "PUM+J": 5314, ANTICAPITALISTAS: 4268, "P.C.P.E.": 3815, PH: 2706, RPS: 2183, POSI: 1723, "P-LIB": 1655, SAIn: 1350, UCE: 875 } },
  { name: "Málaga", shortName: "MAL", seats: 10, blankVotes: 8350, votes: { PP: 357578, PSOE: 227463, IU: 64969, UPyD: 40407, PA: 7442, EQUO: 5369, PACMA: 2903, Eb: 1996, "P.C.P.E.": 1108, ACIMA: 966, PH: 756, UCE: 383, SAIn: 341 } },
  { name: "Murcia", shortName: "MUR", seats: 10, blankVotes: 6688, votes: { PP: 471851, PSOE: 154225, UPyD: 45984, IU: 41896, EQUO: 4464, PACMA: 2629, Eb: 1745, "P.C.P.E.": 1130, "C.D.L.": 1127, "+MAS+": 791, "P.R.D.E.": 678, CYD: 528, RPS: 485, UCE: 465 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 6707, votes: { UPN: 126516, PSOE: 72892, BILDU: 49208, GBAI: 42415, IU: 18251, UPyD: 6829, EQUO: 3656, PIRATA: 1804, "PUM+J": 1393, SAIn: 1061, UCE: 353 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 2857, votes: { PP: 115796, PSOE: 57340, BNG: 19054, IU: 4757, UPyD: 1677, EQUO: 1125, PACMA: 679, "PUM+J": 654, "C.XXI": 191, UCE: 156 } },
  { name: "Asturias", shortName: "AST", seats: 8, blankVotes: 8392, votes: { PP: 223906, PSOE: 185526, FAC: 92828, IU: 83755, UPyD: 24721, EQUO: 4033, Eb: 2532, PACMA: 2125, "P.C.P.E.": 1202, ANDECHA: 1087, "HARTOS.ORG": 867, "PUM+J": 383, PDYC: 304, PH: 284, SAIn: 282, UCE: 209 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 1775, votes: { PP: 58759, PSOE: 33328, IU: 6259, UPyD: 4686, PCAS: 565, PACMA: 352, "PUM+J": 249, "FE de las JONS": 234, "U.R.C.L.": 174, SAIn: 89, UCE: 77 } },
  { name: "Las Palmas", shortName: "LPA", seats: 8, blankVotes: 6990, votes: { PP: 240897, PSOE: 123486, CCA: 53329, IU: 19971, UPyD: 13208, EQUO: 5414, PACMA: 2012, "P.C.P.E.": 1460, "PUM+J": 1288, "UNIDAD DEL PUEBLO": 1138, PH: 1051, ANC: 987, UCE: 541, SAIn: 316 } },
  { name: "Pontevedra", shortName: "PON", seats: 7, blankVotes: 8068, votes: { PP: 284079, PSOE: 156880, BNG: 67227, IU: 25834, UPyD: 7460, EQUO: 4132, PACMA: 2932, "P.C.P.E.": 809, "C.XXI": 518, UCE: 432, SAIn: 408 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 3223, votes: { PP: 128887, PSOE: 56331, UPyD: 13276, IU: 9256, EQUO: 1648, Eb: 686, PACMA: 584, PREPAL: 408, "H.D.": 206, UCE: 161 } },
  { name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, blankVotes: 5054, votes: { PP: 205221, PSOE: 107600, CCA: 90552, IU: 20152, UPyD: 11316, EQUO: 10173, PACMA: 2894, ANC: 2193, "PUM+J": 1384, "P.C.P.E.": 845, UCE: 438 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 4157, votes: { PP: 183244, PSOE: 88624, PRC: 44010, UPyD: 12614, IU: 12608, EQUO: 2482, PACMA: 1232, "P.C.P.E.": 578, "BASTA YA": 380, ANTICAPITALISTAS: 354, RPS: 277, PH: 275, SAIn: 269, UCE: 145 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 1477, votes: { PP: 52173, PSOE: 24780, UPyD: 6889, IU: 5237, EQUO: 981, PACMA: 353, "FE de las JONS": 247, "PUM+J": 237, UCE: 115 } },
  { name: "Sevilla", shortName: "SEV", seats: 12, blankVotes: 13596, votes: { PSOE: 442267, PP: 410046, IU: 91519, UPyD: 58502, PA: 23302, EQUO: 11313, Eb: 2966, "PUM+J": 1415, ANTICAPITALISTAS: 1194, "FE de las JONS": 1160, "P.C.P.E.": 1077, PH: 900, SAIn: 593, UCE: 332 } },
  { name: "Soria", shortName: "SOR", seats: 2, blankVotes: 1295, votes: { PP: 28063, PSOE: 16066, IU: 2385, UPyD: 2190, EQUO: 559, "D.N.": 181, PACMA: 152, "PUM+J": 127, UCE: 73 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 7106, votes: { CiU: 105846, PSOE: 90496, PP: 81977, ERC: 25724, IU: 18561, UPyD: 3672, PxC: 3097, Eb: 3046, PACMA: 2133, "PIRATA.CAT": 1703, "HARTOS.ORG": 1069, ANTICAPITALISTAS: 880, "P.C.P.E.": 712, "PRE-R": 419, UCE: 267 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 1694, votes: { PP: 39993, PSOE: 25426, IU: 6103, UPyD: 2656, Eb: 466, PACMA: 260, PIRATA: 218, SXT: 169, "PUM+J": 151, UCE: 93 } },
  { name: "Toledo", shortName: "TOL", seats: 6, blankVotes: 4422, votes: { PP: 220474, PSOE: 112568, IU: 22373, UPyD: 19089, EQUO: 2178, PACMA: 1473, "HARTOS.ORG": 789, "U.C.I.T.": 785, "P.C.P.E.": 629, UCE: 163 } },
  { name: "Valencia", shortName: "VAL", seats: 16, blankVotes: 14515, votes: { PP: 743604, PSOE: 370499, IU: 96417, COMPROMIS: 85797, UPyD: 84394, PACMA: 6381, "ESPAÑA 2000": 5579, Eb: 3972, ERC: 3648, UxV: 2210, "P.C.P.E.": 1742, "C.D.L.": 1543, PH: 1221, RPS: 958, UCE: 906 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 4719, votes: { PP: 172671, PSOE: 94521, IU: 24223, UPyD: 23536, EQUO: 2161, PACMA: 1244, "PUM+J": 581, "U.R.C.L.": 535, "FE de las JONS": 522, "D.N.": 426, "P.C.P.E.": 380, SAIn: 344, CCD: 303, UCE: 167 } },
  { name: "Vizcaya", shortName: "VIZ", seats: 8, blankVotes: 7285, votes: { PNV: 208683, PSOE: 136853, BILDU: 122796, PP: 113401, IU: 24205, UPyD: 10886, EQUO: 7387, PACMA: 3278, Eb: 2886, "PUM+J": 1670, UCE: 550 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 2057, votes: { PP: 68228, PSOE: 35059, IU: 6161, UPyD: 4641, Eb: 649, PREPAL: 429, PACMA: 395, "PUM+J": 298, ANTICAPITALISTAS: 205 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 9951, votes: { PP: 241074, PSOE: 158167, IU: 58904, UPyD: 32968, EQUO: 3858, Eb: 2640, PACMA: 2586, "P.C.P.E.": 1055, "PUM+J": 939, DeC: 508, PH: 463, "P-LIB": 410, UCE: 370 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 498, votes: { PP: 20968, PSOE: 6445, Caballas: 1712, UPyD: 1061, IU: 576, "LV-GV": 293, PACMA: 186, "PUM+J": 65 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 496, votes: { PP: 17828, PSOE: 6766, UPyD: 992, EQUO: 427, PACMA: 137, "PUM+J": 80 } },
];
