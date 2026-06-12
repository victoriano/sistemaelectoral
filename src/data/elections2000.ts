// Datos OFICIALES de las Elecciones Generales de España 2000 (12 de marzo)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02200003_TOTA.zip
//   Ficheros: 08020003.DAT (votos y electos por candidatura y provincia),
//             07020003.DAT (resumen provincial: votos en blanco, escaños),
//             03020003.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PP 180, PSOE 125, CiU 15, IU 8, PNV 7, CCA 4, UPN 3, BNG 3, PA 1, ERC 1, IC-V 1, EA 1, CHA 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2000: CircunscripcionData[] = [
  { name: "Álava", shortName: "ALA", seats: 4, blankVotes: 5163, votes: { PP: 66267, PSOE: 41182, PNV: 35155, IU: 9509, EA: 7985, VERDES: 1880, PLN: 705, PH: 624, POSI: 372, "UC-CDS": 206, AR: 170, ES2000: 116, FE: 89, "LI (LIT-CI)": 65 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 3484, votes: { PP: 113406, PSOE: 91270, IU: 11062, GIL: 535, PLN: 474, PH: 307, "TC-PNC": 250, "UC-CDS": 248, FE: 207, ES2000: 175, PADE: 121 } },
  { name: "Alicante", shortName: "ALI", seats: 11, blankVotes: 9319, votes: { PP: 436740, PSOE: 280085, IU: 42998, "BLOC-VERDS": 12353, LVE: 8671, GIL: 2727, UV: 2392, PCPE: 1266, ERC: 973, POSI: 968, "UC-CDS": 913, PADE: 909, ES2000: 886, PEDA: 774, FE: 650, PH: 496, II: 425, PLN: 360, "FEI-FE 2000": 325, AR: 318, ENV: 228, EC: 192 } },
  { name: "Almería", shortName: "ALM", seats: 5, blankVotes: 3931, votes: { PP: 135531, PSOE: 117685, IU: 11749, PA: 6569, URAL: 838, IA: 638, NA: 320, "UC-CDS": 206, ES2000: 189, PH: 180, PLN: 164, FE: 161, "FEI-FE 2000": 137, A: 83, PADE: 81 } },
  { name: "Ávila", shortName: "AVI", seats: 3, blankVotes: 1842, votes: { PP: 70058, PSOE: 28596, IU: 5117, "TC-PNC": 372, "UC-CDS": 327, URCL: 262, PLN: 210, FE: 193, PH: 132, PADE: 107, ES2000: 62 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 4810, votes: { PP: 187273, PSOE: 178396, IU: 21402, VERDES: 1874, EU: 1723, SIEX: 994, "PREX-CREX": 723, "UC-CDS": 308, FE: 238, PH: 198, PLN: 157, "FEI-FE 2000": 137, ES2000: 110, PADE: 86 } },
  { name: "Islas Baleares", shortName: "BAL", seats: 7, blankVotes: 5943, votes: { PP: 214348, PSOE: 116515, "PSM-EN": 23482, IU: 15928, VERDES: 9556, "UM-INME": 8372, ERC: 1340, UPB: 524, POSI: 423, "UC-CDS": 341, PRIB: 334, ES2000: 221, FE: 220, "FEI-FE 2000": 182, EC: 169 } },
  { name: "Barcelona", shortName: "BCN", seats: 31, blankVotes: 36486, votes: { PSOE: 909601, CiU: 673558, PP: 602777, ERC: 131114, "IC-V": 103778, IU: 64111, "LV-GV": 14922, "EV-AV": 7685, POSI: 3501, GIL: 2547, EC: 1538, "UC-CDS": 1450, PH: 1333, "IR-PRE": 1275, PLN: 1048, PNCA: 861, "FEI-FE 2000": 826, FE: 826, N: 710, ES2000: 613, "LI (LIT-CI)": 518, PADE: 430 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 5704, votes: { PP: 129501, PSOE: 64358, IU: 10153, "TC-PNC": 9862, PLN: 521, URCL: 464, PADE: 355, "UC-CDS": 318, PH: 252, FE: 143, ES2000: 139, "FEI-FE 2000": 113 } },
  { name: "Cáceres", shortName: "CAC", seats: 5, blankVotes: 2795, votes: { PP: 123577, PSOE: 115435, IU: 9463, EU: 3048, "PREX-CREX": 1648, VERDES: 1543, SIEX: 418, FE: 223, "UC-CDS": 217, PLN: 169, PADE: 102, ES2000: 81 } },
  { name: "Cádiz", shortName: "CAD", seats: 9, blankVotes: 6692, votes: { PP: 228024, PSOE: 218133, PA: 54570, IU: 36851, GIL: 3006, IA: 1887, NA: 667, PH: 596, PPCR: 546, A: 527, PLN: 487, "UC-CDS": 401, ES2000: 342, FE: 338, "FEI-FE 2000": 321, PADE: 279 } },
  { name: "Castellón", shortName: "CAS", seats: 5, blankVotes: 3751, votes: { PP: 152462, PSOE: 100177, IU: 10773, "BLOC-VERDS": 6678, UV: 3511, LVE: 2111, POSI: 997, GIL: 668, ERC: 662, PCPE: 263, "UC-CDS": 258, FE: 242, PH: 171, PC: 159, PLN: 131, ES2000: 118, ENV: 118, EC: 113, PADE: 62 } },
  { name: "Ciudad Real", shortName: "CRE", seats: 5, blankVotes: 3655, votes: { PP: 150842, PSOE: 124180, IU: 10843, PLN: 552, "TC-PNC": 459, "UC-CDS": 384, PH: 339, FE: 241, ES2000: 184, PADE: 120 } },
  { name: "Córdoba", shortName: "COR", seats: 7, blankVotes: 6001, votes: { PP: 188636, PSOE: 187195, IU: 55125, PA: 20963, IA: 861, GIL: 564, PCPE: 560, A: 349, PH: 290, NA: 221, PLN: 207, "UC-CDS": 185, FE: 178, "FEI-FE 2000": 136, PADE: 119, ES2000: 105 } },
  { name: "A Coruña", shortName: "COR", seats: 9, blankVotes: 9741, votes: { PP: 340434, PSOE: 162273, BNG: 126287, IU: 9321, "AU.TO.NO.MO": 1676, DG: 1347, CG: 788, PH: 746, "UC-CDS": 619, FPG: 606, PLN: 531, FE: 379, PADE: 320, ES2000: 319 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 1670, votes: { PP: 69688, PSOE: 53762, IU: 3823, "LV-GV": 605, "UC-CDS": 303, "TC-PNC": 292, FE: 114, "EL-PAPI": 100, PADE: 67, PLN: 64, AR: 61, PC: 39, ES2000: 33 } },
  { name: "Girona", shortName: "GIR", seats: 5, blankVotes: 4007, votes: { CiU: 121116, PSOE: 83741, PP: 46992, ERC: 25534, "IC-V": 5346, IU: 4644, "EV-AV": 1790, POSI: 541, EC: 334, FE: 188, PH: 178, "UC-CDS": 161, PLN: 144, "LI (LIT-CI)": 108, ES2000: 85, PNCA: 78, PADE: 60 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 5994, votes: { PSOE: 213019, PP: 204875, IU: 34809, PA: 16594, GIL: 1112, IA: 876, PCPE: 596, A: 443, PH: 383, NA: 383, PLN: 305, PADE: 263, "UC-CDS": 212, "FEI-FE 2000": 196, ES2000: 182 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 1895, votes: { PP: 55895, PSOE: 37060, IU: 6000, GIL: 645, PRGU: 400, "TC-PNC": 244, PLN: 187, PH: 128, "UC-CDS": 119, FE: 114, PADE: 41, ES2000: 31, PC: 14 } },
  { name: "Guipúzcoa", shortName: "GUI", seats: 6, blankVotes: 11634, votes: { PNV: 89783, PP: 79696, PSOE: 76731, EA: 45525, IU: 15107, VERDES: 2772, PH: 855, PLN: 648, POSI: 263, PC: 248, "UC-CDS": 155, ES2000: 140, "LI (LIT-CI)": 115, FE: 78, "FEI-FE 2000": 75 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 2858, votes: { PSOE: 115071, PP: 98575, IU: 15729, PA: 11613, IA: 446, NA: 189, PH: 175, A: 141, ES2000: 138, PLN: 128, "UC-CDS": 119, FE: 97, PADE: 97, "FEI-FE 2000": 76 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 2142, votes: { PP: 56610, PSOE: 46490, PAR: 8207, CHA: 6926, IU: 3898, "LV-GV": 819, INAR: 137, PLN: 86, PH: 71, EC: 63 } },
  { name: "Jaén", shortName: "JAE", seats: 6, blankVotes: 4033, votes: { PSOE: 190958, PP: 161285, IU: 28450, PA: 13038, IA: 437, PCPE: 349, NA: 250, FE: 196, PH: 186, PLN: 168, A: 150, "UC-CDS": 146, PADE: 102, ES2000: 102, "FEI-FE 2000": 99 } },
  { name: "León", shortName: "LEO", seats: 5, blankVotes: 4206, votes: { PP: 152268, PSOE: 99804, UPL: 41690, IU: 11316, PB: 1191, PREPAL: 330, "UC-CDS": 293, PLN: 277, FE: 239, PCPE: 224, PH: 216, PADE: 151, "TC-PNC": 129 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 2897, votes: { CiU: 78131, PSOE: 55374, PP: 42081, ERC: 14367, "IC-V": 3581, IU: 1931, "EV-AV": 864, POSI: 356, EC: 198, "UC-CDS": 149, PH: 142, FE: 139, PLN: 115, PNCA: 71, "LI (LIT-CI)": 64, ES2000: 61, PADE: 42 } },
  { name: "La Rioja", shortName: "RIO", seats: 4, blankVotes: 3265, votes: { PP: 91810, PSOE: 59171, IU: 6830, "P.RIOJANO": 6155, VERDES: 1709, PADE: 139, "UC-CDS": 131, MASH: 121, FE: 104, PLN: 79, PH: 79, PC: 56, ES2000: 46 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 2506, votes: { PP: 134168, PSOE: 53028, BNG: 37422, IU: 2297, CG: 351, "AU.TO.NO.MO": 298, "UC-CDS": 291, DG: 238, PLN: 185, ES2000: 181, FPG: 161, PH: 157, FE: 118, PADE: 61 } },
  { name: "Madrid", shortName: "MAD", seats: 34, blankVotes: 58114, votes: { PP: 1625831, PSOE: 1023212, IU: 282180, GIL: 32432, VERDES: 24372, "LV-CM": 21087, "UC-CDS": 3557, PCPE: 2836, "EL-PAPI": 2336, PH: 2050, FE: 1955, POSI: 1757, PAVIEL: 1690, "FEI-FE 2000": 1469, PRIM: 1363, PADE: 1306, "TC-PNC": 1264, PLN: 1263, PAE: 1194, AR: 1089, ES2000: 773, "CSD-L": 650, PF: 609, UNIB: 388, PC: 384, "LI (LIT-CI)": 306 } },
  { name: "Málaga", shortName: "MAL", seats: 10, blankVotes: 9250, votes: { PP: 282229, PSOE: 253630, IU: 52723, PA: 33566, GIL: 10570, IA: 1599, PCPE: 1292, PH: 780, NA: 721, A: 666, PLN: 482, FE: 479, "UC-CDS": 441, UN: 314, PADE: 300, ES2000: 243 } },
  { name: "Murcia", shortName: "MUR", seats: 9, blankVotes: 7185, votes: { PP: 389564, PSOE: 217179, IU: 41842, VERDES: 6555, GIL: 2362, PADE: 1389, PEDA: 1130, CCS: 645, "UC-CDS": 635, FE: 604, NR: 598, PLN: 410, ES2000: 383, EC: 203 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 11945, votes: { UPN: 150995, PSOE: 82688, IU: 23038, EA: 14185, CDN: 8646, PNV: 6536, PLN: 1366, PH: 970, PC: 650, "UC-CDS": 529, FE: 455, ES2000: 267, "LI (LIT-CI)": 263, "FEI-FE 2000": 153 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 2037, votes: { PP: 128535, PSOE: 51864, BNG: 38106, IU: 1626, CG: 714, DG: 688, "AU.TO.NO.MO": 256, ES2000: 230, FPG: 184, "UC-CDS": 180, PH: 169, FE: 149 } },
  { name: "Asturias", shortName: "AST", seats: 9, blankVotes: 10985, votes: { PP: 302626, PSOE: 241830, IU: 67024, URAS: 13360, PAS: 5876, VERDES: 4874, AA: 2036, BIA: 1085, "AU.TO.NO.MO": 1036, "UC-CDS": 658, ES2000: 607, PH: 329, FE: 295, PLN: 280, "FEI-FE 2000": 173, PADE: 160 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 2251, votes: { PP: 64185, PSOE: 41368, IU: 4910, "TC-PNC": 1080, URCL: 556, PLN: 257, "UC-CDS": 225, CIVES: 206, PCPE: 161, PH: 113, "FEI-FE 2000": 100, FE: 78, ES2000: 64, PADE: 59 } },
  { name: "Las Palmas", shortName: "LPA", seats: 7, blankVotes: 3969, votes: { PP: 210774, CCA: 113075, PSOE: 80695, IU: 10941, PIL: 10323, VERDES: 4982, "UP-CAN": 980, PCPE: 752, PH: 630, FE: 478, "UC-CDS": 437, TPC: 319, PLN: 301 } },
  { name: "Pontevedra", shortName: "PON", seats: 8, blankVotes: 7419, votes: { PP: 284955, PSOE: 122834, BNG: 104453, IU: 7883, FPG: 1301, "AU.TO.NO.MO": 952, PH: 839, DG: 685, "UC-CDS": 634, CG: 508, "FEI-FE 2000": 329, FE: 247, PADE: 213, ES2000: 199 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 4613, votes: { PP: 130360, PSOE: 72769, IU: 8195, URCL: 2917, USI: 1416, PREPAL: 760, "UC-CDS": 386, PLN: 309, PH: 275, "TC-PNC": 260, FE: 167, PADE: 118, "FEI-FE 2000": 106, ES2000: 97 } },
  { name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, blankVotes: 3264, votes: { PP: 140336, CCA: 135186, PSOE: 105668, IU: 9273, VERDES: 5320, PCPE: 656, "UC-CDS": 623, PH: 501, FE: 331 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 8726, votes: { PP: 189442, PSOE: 111556, IU: 16714, CNC: 2103, GIL: 1343, "UC-CDS": 743, PLN: 598, PCPE: 536, PH: 353, POSI: 328, FE: 293, "FEI-FE 2000": 194, ES2000: 183, PADE: 156 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 2223, votes: { PP: 54367, PSOE: 29178, IU: 4898, "UC-CDS": 1407, "LV-GV": 1143, "TC-PNC": 613, URCL: 236, PADE: 145, FE: 128, PLN: 87, PH: 75, ES2000: 55, PC: 29 } },
  { name: "Sevilla", shortName: "SEV", seats: 13, blankVotes: 16727, votes: { PSOE: 476277, PP: 339879, IU: 80455, PA: 49342, IA: 1431, FE: 939, POSI: 921, GIL: 871, PCPE: 762, PH: 607, NA: 511, VDPA: 493, PLN: 489, A: 368, "UC-CDS": 364, AR: 303, ES2000: 283, PADE: 240, "FEI-FE 2000": 238 } },
  { name: "Soria", shortName: "SOR", seats: 3, blankVotes: 1527, votes: { PP: 31883, PSOE: 17436, IU: 2363, "UC-CDS": 709, "TC-PNC": 237, PLN: 112, URCL: 109, PADE: 57, FE: 53, ES2000: 40 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 4136, votes: { PSOE: 101817, CiU: 97616, PP: 76468, ERC: 19277, "IC-V": 6585, IU: 4405, "EV-AV": 1240, GIL: 455, POSI: 353, "IR-PRE": 266, EC: 251, "UC-CDS": 220, FE: 218, PH: 167, PLN: 167, PNCA: 132, "LI (LIT-CI)": 126, ES2000: 96, PDEP: 85, PADE: 74 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 1193, votes: { PP: 40383, PSOE: 28488, PAR: 8294, CHA: 2831, IU: 2438, "LV-GV": 317, FE: 81, INAR: 65, PH: 51, PLN: 36, ES2000: 32, PADE: 25, EC: 18 } },
  { name: "Toledo", shortName: "TOL", seats: 5, blankVotes: 3624, votes: { PP: 173372, PSOE: 132358, IU: 15018, GIL: 1518, PH: 488, PLN: 459, "TC-PNC": 367, "UC-CDS": 318, "EL-PAPI": 277, PAE: 268, PADE: 224, FE: 199, ES2000: 166, "FEI-FE 2000": 130, PC: 44 } },
  { name: "Valencia", shortName: "VAL", seats: 16, blankVotes: 16128, votes: { PP: 677860, PSOE: 446333, IU: 87633, UV: 51927, "BLOC-VERDS": 39520, LVE: 11438, GIL: 2049, PCPE: 1620, ERC: 1448, "UC-CDS": 789, POSI: 766, PH: 718, AR: 636, ENV: 574, FE: 543, PLN: 524, ES2000: 512, "FEI-FE 2000": 459, FN: 343, ALAS: 339, PADE: 262, PC: 236, EC: 196, PNCA: 189 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 7117, votes: { PP: 168780, PSOE: 111588, IU: 19246, PCL: 4184, "TC-PNC": 2685, URCL: 908, PLN: 641, "UC-CDS": 559, PH: 529, PCPE: 491, "FEI-FE 2000": 238, FE: 197, ES2000: 183, PADE: 164, PC: 90 } },
  { name: "Vizcaya", shortName: "VIZ", seats: 9, blankVotes: 17584, votes: { PNV: 222479, PP: 177272, PSOE: 148670, IU: 37677, EA: 33047, VERDES: 5469, PKD: 2759, PH: 1579, PLN: 1025, POSI: 662, PCPE: 534, "UC-CDS": 348, AR: 281, ES2000: 246, FE: 243, PC: 182, "FEI-FE 2000": 179, "LI (LIT-CI)": 151 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 2196, votes: { PP: 75268, PSOE: 41498, IU: 3637, UPZ: 2347, "UC-CDS": 1129, PREPAL: 1028, URCL: 231, PLN: 204, "TC-PNC": 176, FE: 150, ES2000: 71 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 7138, votes: { PP: 244403, PSOE: 149672, CHA: 65599, PAR: 22382, IU: 19059, "LV-GV": 2638, INAR: 855, FE: 293, PH: 226, "UC-CDS": 194, "FEI-FE 2000": 192, ES2000: 173, PLN: 161, PADE: 93, EC: 81 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 497, votes: { PP: 14514, GIL: 8758, PSOE: 5491, PSPC: 788, IU: 229, FE: 93, PLN: 76, "UC-CDS": 31, PADE: 24 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 551, votes: { PP: 13078, BLM: 6514, PSOE: 5363, IU: 397, "LV-GV": 174, AN: 60, FE: 48, "FEI-FE 2000": 38, PLN: 23, PADE: 13 } },
];
