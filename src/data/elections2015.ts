// Datos OFICIALES de las Elecciones Generales de España 20-D 2015 (20 de diciembre)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201512_TOTA.zip
//   Ficheros: 08021512.DAT (votos y electos por candidatura y provincia),
//             07021512.DAT (resumen provincial: votos en blanco, escaños),
//             03021512.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PP 121, PSOE 90, PODEMOS 69, Cs 40, ERC 9, CDC 8, PNV 6, UPN 2, IU 2, BILDU 2, CCA 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2015: CircunscripcionData[] = [
  { name: "Álava", shortName: "ALA", seats: 4, blankVotes: 1292, votes: { PODEMOS: 48413, PP: 33683, PNV: 28353, PSOE: 25331, BILDU: 21225, Cs: 10512, IU: 6814, PACMA: 1385, UPyD: 768, "RECORTES CE": 561, EB: 473, PCPE: 175, OE: 110, Ln: 82 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 1727, votes: { PP: 85241, PSOE: 65205, Cs: 33755, PODEMOS: 32320, IU: 9306, PACMA: 1583, UPyD: 1146, VOX: 538, "RECORTES CE": 305, PCPE: 251, PLD: 205 } },
  { name: "Alicante", shortName: "ALI", seats: 12, blankVotes: 5293, votes: { PP: 297083, PODEMOS: 201610, PSOE: 188711, Cs: 154397, IU: 33397, PACMA: 8262, UPyD: 5570, "CENTRO MODE": 3278, VOX: 2227, "RECORTES CE": 1761, PCPE: 1741, ARAPV: 608, FDEE: 456, "P-LIB": 415, SOMVAL: 404 } },
  { name: "Almería", shortName: "ALM", seats: 6, blankVotes: 2211, votes: { PP: 117635, PSOE: 89434, Cs: 44494, PODEMOS: 39780, IU: 10828, PACMA: 2126, UPyD: 1532, VOX: 558, "FE de las J": 343, PCPE: 318, "RECORTES CE": 297, "PUM+J": 176, DN: 164 } },
  { name: "Ávila", shortName: "AVI", seats: 3, blankVotes: 744, votes: { PP: 47072, PSOE: 20254, Cs: 15971, PODEMOS: 11951, IU: 3905, UPyD: 908, PACMA: 519, VOX: 330, "FE de las J": 238, "RECORTES CE": 125 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 3117, votes: { PSOE: 148493, PP: 137640, PODEMOS: 47368, Cs: 45350, IU: 12338, PACMA: 2041, UPyD: 1546, "EU-eX": 951, "RECORTES CE": 508 } },
  { name: "Islas Baleares", shortName: "BAL", seats: 8, blankVotes: 3997, votes: { PP: 140640, PODEMOS: 111628, PSOE: 88635, Cs: 71551, "MÉS": 33877, "EL PI": 12910, IU: 11451, PACMA: 5114, UPyD: 2276, "RECORTES CE": 1177, PFyV: 714 } },
  { name: "Barcelona", shortName: "BCN", seats: 31, blankVotes: 18119, votes: { PODEMOS: 768235, PSOE: 464588, ERC: 414163, Cs: 387061, CDC: 378723, PP: 321980, "unio.cat": 48326, PACMA: 34394, "RECORTES CE": 10730, UPyD: 6595, PCPE: 5493 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 2049, votes: { PP: 82037, PSOE: 44640, PODEMOS: 36818, Cs: 33558, IU: 10171, UPyD: 2356, PACMA: 1431, VOX: 926, PCPE: 507, SAIn: 501, "RECORTES CE": 452, IFem: 341 } },
  { name: "Cáceres", shortName: "CAC", seats: 4, blankVotes: 1559, votes: { PP: 87924, PSOE: 84758, PODEMOS: 34730, Cs: 28406, IU: 7252, PACMA: 1363, UPyD: 1074, "EU-eX": 1070, VOX: 518, "RECORTES CE": 338 } },
  { name: "Cádiz", shortName: "CAD", seats: 9, blankVotes: 6781, votes: { PSOE: 180895, PP: 179319, PODEMOS: 130734, Cs: 94962, IU: 38881, PACMA: 7591, UPyD: 3637, VOX: 1493, "RECORTES CE": 1042, PCPE: 780, "P-LIB": 422 } },
  { name: "Castellón", shortName: "CAS", seats: 5, blankVotes: 2093, votes: { PP: 98474, PODEMOS: 74732, PSOE: 66590, Cs: 48328, IU: 9605, PACMA: 2252, CCD: 2137, UPyD: 1743, VOX: 921, PCPE: 509, "RECORTES CE": 489, DN: 471, SOMVAL: 467, ARAPV: 413, IFem: 261 } },
  { name: "Ciudad Real", shortName: "CRE", seats: 5, blankVotes: 2282, votes: { PP: 113451, PSOE: 91959, PODEMOS: 36879, Cs: 36477, IU: 9834, PACMA: 1949, UPyD: 1625, VOX: 560, "RECORTES CE": 386, DN: 174 } },
  { name: "Córdoba", shortName: "COR", seats: 6, blankVotes: 4481, votes: { PSOE: 149851, PP: 142101, PODEMOS: 68740, Cs: 55812, IU: 37650, PACMA: 3529, UPyD: 2069, PCPE: 876, PCOE: 813, EB: 631, "RECORTES CE": 605, "FE de las J": 494 } },
  { name: "A Coruña", shortName: "COR", seats: 8, blankVotes: 7674, votes: { PP: 239303, PODEMOS: 177581, PSOE: 137734, Cs: 66784, BNG: 30618, PACMA: 5169, UPyD: 3531, "RECORTES CE": 1548, PCPE: 1447, VOX: 1246, PT: 1119, SAIn: 429 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 931, votes: { PP: 50736, PSOE: 37019, PODEMOS: 14113, Cs: 13049, IU: 3628, PACMA: 537, UPyD: 464, VOX: 356, "RECORTES CE": 165, PCPE: 97 } },
  { name: "Girona", shortName: "GIR", seats: 6, blankVotes: 2513, votes: { CDC: 83170, ERC: 78030, PODEMOS: 54071, PSOE: 42096, Cs: 32762, PP: 28410, "unio.cat": 5871, PACMA: 3623, "RECORTES CE": 889, PCPE: 602, UPyD: 586 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 3442, votes: { PP: 158693, PSOE: 158027, PODEMOS: 83650, Cs: 70845, IU: 26022, PACMA: 3843, UPyD: 2697, VOX: 1245, PCPE: 696, "RECORTES CE": 638, "PUM+J": 445 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 979, votes: { PP: 47365, PSOE: 30685, Cs: 24603, PODEMOS: 23827, IU: 5628, PACMA: 1152, UPyD: 1026, VOX: 645, "RECORTES CE": 283, SAIn: 75 } },
  { name: "Guipúzcoa", shortName: "GUI", seats: 6, blankVotes: 2537, votes: { PODEMOS: 98533, PNV: 91359, BILDU: 81257, PSOE: 51764, PP: 33884, Cs: 14608, IU: 10722, PACMA: 2276, UPyD: 1313, "RECORTES CE": 782, Ln: 368 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 2409, votes: { PSOE: 95637, PP: 74353, PODEMOS: 39435, Cs: 30776, IU: 11786, PACMA: 2385, UPyD: 1014, VOX: 460, "RECORTES CE": 336, PCPE: 307, DN: 192 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 1251, votes: { PP: 39747, PSOE: 30183, PODEMOS: 21943, Cs: 19789, IU: 6433, UPyD: 833, PACMA: 792, EB: 554, PCPE: 257, "RECORTES CE": 249, Independien: 114 } },
  { name: "Jaén", shortName: "JAE", seats: 5, blankVotes: 2713, votes: { PSOE: 148511, PP: 121984, PODEMOS: 48640, Cs: 41398, IU: 16771, PACMA: 2543, UPyD: 1287, CILUS: 1189, VOX: 715, AJU: 711, PCPE: 469, "RECORTES CE": 371, SAIn: 198 } },
  { name: "León", shortName: "LEO", seats: 5, blankVotes: 2943, votes: { PP: 104077, PSOE: 74128, PODEMOS: 51441, Cs: 37902, IU: 13997, UPyD: 2047, PACMA: 1838, CRA: 1032, PREPAL: 922, VOX: 745, PCPE: 534, "RECORTES CE": 482, DN: 313 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 2124, votes: { CDC: 48289, ERC: 44317, PODEMOS: 30538, PSOE: 24668, PP: 22360, Cs: 17897, "unio.cat": 4867, PACMA: 1743, UPyD: 687, VOX: 465, "RECORTES CE": 398, PCPE: 316 } },
  { name: "La Rioja", shortName: "RIO", seats: 4, blankVotes: 1496, votes: { PP: 67941, PSOE: 41973, PODEMOS: 28073, Cs: 26812, IU: 7423, UPyD: 1361, PACMA: 1177, EB: 362, "RECORTES CE": 360, PCPE: 229 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 2445, votes: { PP: 86446, PSOE: 48772, PODEMOS: 39122, Cs: 15441, BNG: 7253, PACMA: 1633, UPyD: 971, "RECORTES CE": 443, PCPE: 421, PT: 405 } },
  { name: "Madrid", shortName: "MAD", seats: 36, blankVotes: 18751, votes: { PP: 1210219, PODEMOS: 756257, Cs: 681167, PSOE: 645645, IU: 190193, UPyD: 43508, PACMA: 28322, VOX: 22643, "X LA IZQUIE": 4994, "FE de las J": 4579, "RECORTES CE": 4037, "PUM+J": 2870, PH: 1779, PCPE: 1742, SAIn: 1137, "P-LIB": 1075 } },
  { name: "Málaga", shortName: "MAL", seats: 11, blankVotes: 5724, votes: { PP: 224745, PSOE: 208896, PODEMOS: 132980, Cs: 132586, IU: 52772, PACMA: 8886, UPyD: 4522, VOX: 1817, PCPE: 1029, "RECORTES CE": 974, "mlgXSÍ": 934, SOLUCIONA: 409, "P-LIB": 290 } },
  { name: "Murcia", shortName: "MUR", seats: 10, blankVotes: 4511, votes: { PP: 293943, PSOE: 147883, Cs: 128570, PODEMOS: 110601, IU: 22767, PACMA: 6591, UPyD: 5442, VOX: 3282, "RECORTES CE": 1268, EB: 1063, PCPE: 1051, SAIn: 330, "+MAS+": 313 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 3714, votes: { UPN: 102244, PODEMOS: 81216, PSOE: 54856, BILDU: 34939, GBAI: 30642, Cs: 24969, IU: 14528, PACMA: 2343, UPyD: 1452, "RECORTES CE": 956, SAIn: 913, Ln: 576 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 1749, votes: { PP: 86673, PSOE: 44726, PODEMOS: 34357, Cs: 15174, BNG: 6455, PACMA: 1406, "X LA IZQUIE": 873, UPyD: 777, "RECORTES CE": 399, PT: 344 } },
  { name: "Asturias", shortName: "AST", seats: 8, blankVotes: 5591, votes: { PP: 187568, PSOE: 145113, PODEMOS: 132984, Cs: 84464, IU: 52583, PACMA: 4555, UPyD: 3855, EB: 1869, VOX: 1715, PCPE: 1240, "RECORTES CE": 1038, PH: 392 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 993, votes: { PP: 42182, PSOE: 25698, Cs: 14814, PODEMOS: 14083, IU: 4699, UPyD: 828, PACMA: 624, "FE de las J": 218, EB: 182, "RECORTES CE": 159, PCPE: 126, SAIn: 72 } },
  { name: "Las Palmas", shortName: "LPA", seats: 8, blankVotes: 4111, votes: { PP: 145372, PODEMOS: 136583, PSOE: 115521, Cs: 63385, CCA: 21788, IU: 15262, PACMA: 5351, UPyD: 2564, "CANARIAS DE": 1605, "RECORTES CE": 1478, PCPE: 953, VOX: 774, "PUM+J": 616, PH: 439, SAIn: 300 } },
  { name: "Pontevedra", shortName: "PON", seats: 7, blankVotes: 5481, votes: { PP: 197201, PODEMOS: 159638, PSOE: 118988, Cs: 51453, BNG: 26537, PACMA: 5315, UPyD: 3177, "RECORTES CE": 1439, PCPE: 1377, PT: 1158 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 1997, votes: { PP: 89375, PSOE: 45593, Cs: 35242, PODEMOS: 25743, IU: 7017, UPyD: 1669, PACMA: 1175, VOX: 822, "RECORTES CE": 319, PCPE: 264, PREPAL: 251 } },
  { name: "Santa Cruz de Tenerife", shortName: "TFE", seats: 7, blankVotes: 3151, votes: { PP: 138203, PSOE: 102892, PODEMOS: 94936, CCA: 60129, Cs: 50257, IU: 15716, PACMA: 6537, UPyD: 2117, "CANARIAS DE": 1278, "RECORTES CE": 1182, VOX: 772, PCPE: 759 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 2849, votes: { PP: 129216, PSOE: 78460, PODEMOS: 62569, Cs: 53371, IU: 15488, PACMA: 2943, UPyD: 2875, VOX: 901, "RECORTES CE": 529, PCPE: 461, PH: 236, SAIn: 173 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 903, votes: { PP: 36182, PSOE: 19769, Cs: 15665, PODEMOS: 13144, IU: 3742, UPyD: 1274, PACMA: 517, "RECORTES CE": 227, "FE de las J": 223, PCPE: 190 } },
  { name: "Sevilla", shortName: "SEV", seats: 12, blankVotes: 9968, votes: { PSOE: 371142, PP: 275463, PODEMOS: 208408, Cs: 142574, IU: 62309, PACMA: 9976, UPyD: 6421, VOX: 2717, "RECORTES CE": 1413, PCOE: 1096, "FE de las J": 989, PCPE: 893, "P-LIB": 652 } },
  { name: "Soria", shortName: "SOR", seats: 2, blankVotes: 679, votes: { PP: 20030, PSOE: 12331, PODEMOS: 8328, Cs: 7872, IU: 1836, UPyD: 327, PACMA: 192, DN: 101, "RECORTES CE": 86, PCPE: 54 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 2684, votes: { PODEMOS: 77036, ERC: 65272, PSOE: 58922, CDC: 57071, Cs: 53152, PP: 45619, "unio.cat": 6324, PACMA: 4170, "RECORTES CE": 894, PCPE: 705, UPyD: 686, EB: 625 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 883, votes: { PP: 28282, PSOE: 19938, PODEMOS: 11895, Cs: 11427, IU: 3897, UPyD: 456, PACMA: 375, EB: 313, "RECORTES CE": 139, PCPE: 97 } },
  { name: "Toledo", shortName: "TOL", seats: 6, blankVotes: 2325, votes: { PP: 149442, PSOE: 106988, Cs: 53199, PODEMOS: 52587, IU: 13590, PACMA: 3039, UPyD: 1901, VOX: 1509, "RECORTES CE": 612, PCPE: 306 } },
  { name: "Valencia", shortName: "VAL", seats: 15, blankVotes: 8747, votes: { PP: 442578, PODEMOS: 397207, PSOE: 276188, Cs: 221896, IU: 68961, PACMA: 14494, UPyD: 9990, CCD: 7111, SOMVAL: 5232, VOX: 4135, "RECORTES CE": 2761, PCPE: 2091, ARAPV: 1482, "EN POSITIU": 1276, AVANT: 1003, IFem: 1002 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 2683, votes: { PP: 121323, PSOE: 70879, Cs: 56347, PODEMOS: 50204, IU: 17935, UPyD: 2940, PACMA: 1735, CCD: 1579, VOX: 1230, "RECORTES CE": 489, PCPE: 429, "FE de las J": 411, DN: 289, SAIn: 272 } },
  { name: "Vizcaya", shortName: "VIZ", seats: 8, blankVotes: 4840, votes: { PNV: 182604, PODEMOS: 170728, PSOE: 84893, BILDU: 81704, PP: 74560, Cs: 25148, IU: 18466, PACMA: 4342, UPyD: 2012, "X LA IZQUIE": 1447, "RECORTES CE": 1089, EB: 1045, "PUM+J": 479, PCPE: 414, "JS,PC": 406 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 1227, votes: { PP: 48160, PSOE: 25985, PODEMOS: 15865, Cs: 14608, IU: 5514, UPyD: 747, PACMA: 502, PREPAL: 246, "RECORTES CE": 187, PCPE: 128 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 4657, votes: { PP: 161662, PSOE: 118936, PODEMOS: 102596, Cs: 95130, IU: 34869, UPyD: 4514, PACMA: 4057, EB: 2967, VOX: 1849, "RECORTES CE": 1088, PCPE: 845, Independien: 562 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 413, votes: { PP: 14813, PSOE: 7627, PODEMOS: 4646, Cs: 4392, IU: 431, PACMA: 358, UPyD: 197, "RECORTES CE": 146 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 299, votes: { PP: 12331, PSOE: 6905, Cs: 4366, PODEMOS: 3215, IU: 366, PACMA: 314, UPyD: 240, "RECORTES CE": 46 } },
];
