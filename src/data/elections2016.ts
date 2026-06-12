// Datos OFICIALES de las Elecciones Generales de España 2016 (26 de junio)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02201606_TOTA.zip
//   Ficheros: 08021606.DAT (votos y electos por candidatura y provincia),
//             07021606.DAT (resumen provincial: votos en blanco, escaños),
//             03021606.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_historical.ts
//
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla).
// Votos agregados por el código de acumulación nacional del MIR y mapeados
// a las claves de partido de la app (las listas conjuntas que la app trata
// como actores separados, p. ej. UPN–PP, no se pliegan). Incluye los votos
// en blanco oficiales (blankVotes) para el denominador de la barrera del 3%.
//
// Verificación: los diputados electos del propio fichero 08 reproducen
// exactamente el resultado oficial (PP 137, PSOE 85, UP 71, Cs 32, ERC 9, CDC 8, PNV 5, BILDU 2, CCA 1 = 350).

import { CircunscripcionData } from "./elections2023";

export const electionInfo2016 = {
  year: "2016",
  name: "Elecciones Generales 2016",
  date: "26 de junio de 2016",
};

export const circunscripciones2016: CircunscripcionData[] = [
  { name: "A Coruna", shortName: "A C", seats: 8, blankVotes: 6693, votes: { PP: 257855, UP: 148566, PSOE: 139973, Cs: 60347, "BNG-NÓS": 19343, PACMA: 6857, "RECORTES CERO-GRUPO VERDE": 1583, VOX: 1026, PCPE: 754, SAIn: 392 } },
  { name: "Alava", shortName: "ALA", seats: 4, blankVotes: 1078, votes: { UP: 51827, PP: 34276, PNV: 26703, PSOE: 26381, BILDU: 15858, Cs: 8372, PACMA: 1657, "RECORTES CERO-GRUPO VERDE": 599, VOX: 306, UPyD: 298, PCPE: 211, Ln: 74 } },
  { name: "Albacete", shortName: "ALB", seats: 4, blankVotes: 1430, votes: { PP: 89717, PSOE: 59617, UP: 33509, Cs: 31976, PACMA: 1985, UPyD: 430, "RECORTES CERO-GRUPO VERDE": 321, "FE de las J": 255, PCPE: 233 } },
  { name: "Alacant/Alicante", shortName: "ALA", seats: 12, blankVotes: 4838, votes: { PP: 329628, UP: 193263, PSOE: 187484, Cs: 138517, PACMA: 10632, "CENTRO MODERADO": 3011, VOX: 2003, UPyD: 1961, PCPE: 1582, "RECORTES CERO-GRUPO VERDE": 1293, SOMVAL: 554, "P-LIB": 403 } },
  { name: "Almeria", shortName: "ALM", seats: 6, blankVotes: 2213, votes: { PP: 131801, PSOE: 84988, Cs: 41897, UP: 40578, PACMA: 2689, UPyD: 684, VOX: 435, EB: 347, "RECORTES CERO-GRUPO VERDE": 334, "FE de las J": 323, PCPE: 280, IZAR: 105 } },
  { name: "Asturias", shortName: "AST", seats: 8, blankVotes: 5374, votes: { PP: 209632, PSOE: 147920, UP: 141845, Cs: 74961, PACMA: 6398, EB: 2517, VOX: 1442, UPyD: 1391, PCPE: 1383, "RECORTES CERO-GRUPO VERDE": 1086, PH: 414, PUEDE: 336 } },
  { name: "Avila", shortName: "AVI", seats: 3, blankVotes: 717, votes: { PP: 50931, PSOE: 19277, Cs: 14096, UP: 12527, PACMA: 610, UPyD: 357, "FE de las J": 261, "RECORTES CERO-GRUPO VERDE": 141 } },
  { name: "Badajoz", shortName: "BAD", seats: 6, blankVotes: 2719, votes: { PP: 149603, PSOE: 133392, UP: 47182, Cs: 40417, PACMA: 2766, UPyD: 639, VOX: 617, "RECORTES CERO-GRUPO VERDE": 614 } },
  { name: "Illes Balears", shortName: "ILL", seats: 8, blankVotes: 4226, votes: { PP: 163045, UP: 118082, PSOE: 93363, Cs: 67700, SI: 7418, PACMA: 7266, "RECORTES CERO-GRUPO VERDE": 1644, UPyD: 1197, PFyV: 846 } },
  { name: "Barcelona", shortName: "BAR", seats: 31, blankVotes: 21081, votes: { UP: 694315, PSOE: 444812, ERC: 438126, PP: 357759, CDC: 323824, Cs: 305075, PACMA: 47660, "RECORTES CERO-GRUPO VERDE": 8006, PCPE: 3275 } },
  { name: "Bizkaia", shortName: "BIZ", seats: 8, blankVotes: 3907, votes: { UP: 179347, PNV: 175296, PSOE: 86425, PP: 78965, BILDU: 67653, Cs: 20685, PACMA: 4865, "RECORTES CERO-GRUPO VERDE": 1176, EB: 1026, UPyD: 766, VOX: 641, PCPE: 467 } },
  { name: "Burgos", shortName: "BUR", seats: 4, blankVotes: 1812, votes: { PP: 88785, PSOE: 45724, UP: 35705, Cs: 30361, PACMA: 1782, UPyD: 788, VOX: 647, "RECORTES CERO-GRUPO VERDE": 456, IMC: 356, PCPE: 287, SAIn: 278 } },
  { name: "Caceres", shortName: "CAC", seats: 4, blankVotes: 1539, votes: { PP: 95419, PSOE: 78767, UP: 33164, Cs: 24343, PACMA: 1690, "RECORTES CERO-GRUPO VERDE": 459, UPyD: 415, VOX: 409 } },
  { name: "Cadiz", shortName: "CAD", seats: 9, blankVotes: 6938, votes: { PP: 198876, PSOE: 175498, UP: 130643, Cs: 88029, PACMA: 9719, UPyD: 1750, "RECORTES CERO-GRUPO VERDE": 1417, VOX: 1253, PCPE: 767, "FE de las J": 472, "P-LIB": 393 } },
  { name: "Cantabria", shortName: "CAN", seats: 5, blankVotes: 2454, votes: { PP: 140252, PSOE: 79407, UP: 59845, Cs: 48626, PACMA: 3369, UPyD: 1051, VOX: 713, EB: 596, "RECORTES CERO-GRUPO VERDE": 483, PCPE: 468, SAIn: 156, "P-LIB": 147 } },
  { name: "Castellon", shortName: "CAS", seats: 5, blankVotes: 2069, votes: { PP: 106746, UP: 72281, PSOE: 66062, Cs: 44121, PACMA: 2985, CCD: 1712, VOX: 711, UPyD: 662, "RECORTES CERO-GRUPO VERDE": 561, "FE de las J": 476, SOMVAL: 415, PCPE: 403 } },
  { name: "Ceuta", shortName: "CEU", seats: 1, blankVotes: 316, votes: { PP: 15991, PSOE: 6974, Cs: 3549, UP: 3345, PACMA: 333, VOX: 139, "RECORTES CERO-GRUPO VERDE": 118, UPyD: 72 } },
  { name: "Ciudad Real", shortName: "CIU", seats: 5, blankVotes: 1939, votes: { PP: 121622, PSOE: 81728, UP: 37510, Cs: 33126, PACMA: 2334, UPyD: 679, "RECORTES CERO-GRUPO VERDE": 458 } },
  { name: "Cordoba", shortName: "COR", seats: 6, blankVotes: 4489, votes: { PP: 153750, PSOE: 139281, UP: 85058, Cs: 55248, PACMA: 4234, UPyD: 743, VOX: 708, PCPE: 663, PCOE: 627, EB: 614, AND: 606, "RECORTES CERO-GRUPO VERDE": 467, "FE de las J": 330 } },
  { name: "Cuenca", shortName: "CUE", seats: 3, blankVotes: 823, votes: { PP: 53004, PSOE: 34426, UP: 15263, Cs: 10868, PACMA: 785, VOX: 274, UPyD: 195, "RECORTES CERO-GRUPO VERDE": 130, PCPE: 81 } },
  { name: "Gipuzkoa", shortName: "GIP", seats: 6, blankVotes: 2711, votes: { UP: 104566, PNV: 85015, BILDU: 69828, PSOE: 51449, PP: 35312, Cs: 11683, PACMA: 2788, "RECORTES CERO-GRUPO VERDE": 1172, UPyD: 478, PCPE: 284, "P-LIB": 207 } },
  { name: "Girona", shortName: "GIR", seats: 6, blankVotes: 2642, votes: { ERC: 80824, CDC: 71453, UP: 53277, PSOE: 38558, PP: 31035, Cs: 23748, PACMA: 4627, PxC: 724, "RECORTES CERO-GRUPO VERDE": 583, PCPE: 382 } },
  { name: "Granada", shortName: "GRA", seats: 7, blankVotes: 3424, votes: { PP: 172721, PSOE: 151445, UP: 86975, Cs: 66000, PACMA: 5228, UPyD: 1158, VOX: 993, "RECORTES CERO-GRUPO VERDE": 763, PCPE: 641, IZAR: 192 } },
  { name: "Guadalajara", shortName: "GUA", seats: 3, blankVotes: 822, votes: { PP: 52047, PSOE: 30282, UP: 23884, Cs: 21586, PACMA: 1349, VOX: 541, UPyD: 413, "RECORTES CERO-GRUPO VERDE": 245, "FE de las J": 206, PCOE: 126, SAIn: 37 } },
  { name: "Huelva", shortName: "HUE", seats: 5, blankVotes: 2526, votes: { PSOE: 88100, PP: 81959, UP: 40023, Cs: 28685, PACMA: 2850, "RECORTES CERO-GRUPO VERDE": 470, UPyD: 464, VOX: 398, PCPE: 344 } },
  { name: "Huesca", shortName: "HUE", seats: 3, blankVotes: 1204, votes: { PP: 42332, PSOE: 29915, UP: 22430, Cs: 17934, PACMA: 909, EB: 487, VOX: 399, ENTABAN: 377, PCPE: 349, UPyD: 239, "RECORTES CERO-GRUPO VERDE": 216, MAS: 93 } },
  { name: "Jaen", shortName: "JAE", seats: 5, blankVotes: 2545, votes: { PSOE: 138612, PP: 131234, UP: 53239, Cs: 38884, PACMA: 3238, CILUS: 830, VOX: 638, UPyD: 589, PCPE: 498, "RECORTES CERO-GRUPO VERDE": 455 } },
  { name: "La Rioja", shortName: "LA ", seats: 4, blankVotes: 1225, votes: { PP: 73708, PSOE: 42010, UP: 28772, Cs: 24180, PACMA: 1350, UPyD: 425, VOX: 366, "RECORTES CERO-GRUPO VERDE": 312, EB: 304, PCPE: 250, "HRTS-Ln": 80 } },
  { name: "Las Palmas", shortName: "LAS", seats: 8, blankVotes: 3502, votes: { PP: 170316, PSOE: 119351, UP: 113256, Cs: 65172, CCA: 17982, PACMA: 6730, "RECORTES CERO-GRUPO VERDE": 1552, UPyD: 978, PCPE: 900, VOX: 882, "UNIDAD DEL PUEBLO": 686, JXC: 537, PH: 450, SAIn: 212 } },
  { name: "Leon", shortName: "LEO", seats: 4, blankVotes: 2397, votes: { PP: 112723, PSOE: 73681, UP: 49484, Cs: 35870, PACMA: 2184, UPL: 2094, VOX: 620, UPyD: 618, "RECORTES CERO-GRUPO VERDE": 430, PCPE: 381, PREPAL: 277, ALCD: 99 } },
  { name: "Lleida", shortName: "LLE", seats: 4, blankVotes: 2156, votes: { ERC: 45525, CDC: 40985, UP: 30182, PP: 24503, PSOE: 22533, Cs: 12592, PACMA: 1930, "RECORTES CERO-GRUPO VERDE": 288, PCPE: 267, VOX: 198 } },
  { name: "Lugo", shortName: "LUG", seats: 4, blankVotes: 2088, votes: { PP: 91516, PSOE: 45796, UP: 32752, Cs: 13343, "BNG-NÓS": 5009, PACMA: 1939, "RECORTES CERO-GRUPO VERDE": 514 } },
  { name: "Madrid", shortName: "MAD", seats: 36, blankVotes: 18137, votes: { PP: 1325665, UP: 737885, PSOE: 678340, Cs: 616503, PACMA: 39117, VOX: 16803, UPyD: 14659, "RECORTES CERO-GRUPO VERDE": 7377, "FE de las J": 3946, PCPE: 3110, PH: 2148, "P-LIB": 1111, SAIn: 994 } },
  { name: "Malaga", shortName: "MAL", seats: 11, blankVotes: 6178, votes: { PP: 256033, PSOE: 201444, UP: 140829, Cs: 121294, PACMA: 11523, UPyD: 1832, VOX: 1770, "RECORTES CERO-GRUPO VERDE": 1461, AND: 1121, PCPE: 983, IZAR: 390 } },
  { name: "Melilla", shortName: "MEL", seats: 1, blankVotes: 268, votes: { PP: 13522, PSOE: 6805, Cs: 3352, UP: 2667, PACMA: 317, UPyD: 146, "RECORTES CERO-GRUPO VERDE": 44 } },
  { name: "Murcia", shortName: "MUR", seats: 10, blankVotes: 3713, votes: { PP: 333109, PSOE: 144937, Cs: 111961, UP: 103522, PACMA: 8209, VOX: 2622, UPyD: 2083, "RECORTES CERO-GRUPO VERDE": 1305, EB: 1069, PCPE: 627, SAIn: 235, FME: 200 } },
  { name: "Navarra", shortName: "NAV", seats: 5, blankVotes: 3468, votes: { PP: 106976, UP: 94972, PSOE: 58173, BILDU: 31374, Cs: 20505, GBAI: 14343, PACMA: 2757, "RECORTES CERO-GRUPO VERDE": 1089, UPyD: 591, Ln: 548, SAIn: 539 } },
  { name: "Ourense", shortName: "OUR", seats: 4, blankVotes: 1527, votes: { PP: 92539, PSOE: 43429, UP: 29136, Cs: 13133, "BNG-NÓS": 4107, PACMA: 1671, "RECORTES CERO-GRUPO VERDE": 417, PCPE: 218 } },
  { name: "Palencia", shortName: "PAL", seats: 3, blankVotes: 838, votes: { PP: 45965, PSOE: 24751, UP: 15077, Cs: 12428, PACMA: 761, UPyD: 273, "RECORTES CERO-GRUPO VERDE": 202, "FE de las J": 184, PCPE: 90, SAIn: 57 } },
  { name: "Pontevedra", shortName: "PON", seats: 7, blankVotes: 4418, votes: { PP: 208921, UP: 137088, PSOE: 118816, Cs: 48302, "BNG-NÓS": 16793, PACMA: 6497, "RECORTES CERO-GRUPO VERDE": 1360, UPyD: 975, EB: 785, PCPE: 718 } },
  { name: "Salamanca", shortName: "SAL", seats: 4, blankVotes: 1443, votes: { PP: 97672, PSOE: 43252, Cs: 31878, UP: 25441, PACMA: 1359, UPyD: 683, "RECORTES CERO-GRUPO VERDE": 326, PREPAL: 233, PCPE: 196 } },
  { name: "Santa Cruz de Tenerife", shortName: "SAN", seats: 7, blankVotes: 2783, votes: { PP: 163129, PSOE: 101120, UP: 85178, CCA: 60271, Cs: 52576, PACMA: 8243, "RECORTES CERO-GRUPO VERDE": 1417, JXC: 653, PCPE: 649, EB: 647 } },
  { name: "Segovia", shortName: "SEG", seats: 3, blankVotes: 615, votes: { PP: 40172, PSOE: 19014, Cs: 13595, UP: 13440, PACMA: 612, UPyD: 352, VOX: 277, "RECORTES CERO-GRUPO VERDE": 202, "FE de las J": 129, PCPE: 117 } },
  { name: "Sevilla", shortName: "SEV", seats: 12, blankVotes: 9582, votes: { PSOE: 347470, PP: 299884, UP: 214663, Cs: 138086, PACMA: 13389, UPyD: 2712, VOX: 2146, "RECORTES CERO-GRUPO VERDE": 1950, PCPE: 1306, PCOE: 1069, "FE de las J": 855 } },
  { name: "Soria", shortName: "SOR", seats: 2, blankVotes: 600, votes: { PP: 22264, PSOE: 12762, UP: 7599, Cs: 5679, PACMA: 260, UPyD: 125, VOX: 119, "RECORTES CERO-GRUPO VERDE": 90, "FE de las J": 63, PCPE: 57 } },
  { name: "Tarragona", shortName: "TAR", seats: 6, blankVotes: 3060, votes: { UP: 75328, ERC: 67759, PSOE: 53967, PP: 51241, CDC: 47226, Cs: 39082, PACMA: 5680, "RECORTES CERO-GRUPO VERDE": 853, PCPE: 424 } },
  { name: "Teruel", shortName: "TER", seats: 3, blankVotes: 704, votes: { PP: 30913, PSOE: 19724, UP: 12558, Cs: 9871, PACMA: 402, EB: 245, "FE de las J": 160, "RECORTES CERO-GRUPO VERDE": 125, PCPE: 71, MAS: 62, UDT: 48, INDEPENDIEN: 39 } },
  { name: "Toledo", shortName: "TOL", seats: 6, blankVotes: 1974, votes: { PP: 159521, PSOE: 97733, UP: 53994, Cs: 47705, PACMA: 3386, VOX: 1013, UPyD: 695, "RECORTES CERO-GRUPO VERDE": 564, PCPE: 334, "FE de las J": 330, FE: 254 } },
  { name: "València/Valencia", shortName: "VAL", seats: 16, blankVotes: 8508, votes: { PP: 482855, UP: 394227, PSOE: 285732, Cs: 205489, PACMA: 18994, SOMVAL: 5678, CCD: 4561, VOX: 3381, UPyD: 2962, "RECORTES CERO-GRUPO VERDE": 2944, PCPE: 1566, "FE de las J": 1465, "P-LIB": 589, REPO: 570 } },
  { name: "Valladolid", shortName: "VAL", seats: 5, blankVotes: 2234, votes: { PP: 132026, PSOE: 71780, UP: 51637, Cs: 49283, "CCD-CI": 2672, PACMA: 2225, VOX: 1078, UPyD: 1068, "RECORTES CERO-GRUPO VERDE": 524, "FE de las J": 454, PCPE: 316, SAIn: 210, "P-LIB": 146, ALCD: 115 } },
  { name: "Zamora", shortName: "ZAM", seats: 3, blankVotes: 1010, votes: { PP: 52555, PSOE: 26045, UP: 15403, Cs: 12423, PACMA: 537, UPyD: 256, UPL: 201, "RECORTES CERO-GRUPO VERDE": 174, PREPAL: 158, PCPE: 131 } },
  { name: "Zaragoza", shortName: "ZAR", seats: 7, blankVotes: 4124, votes: { PP: 179211, PSOE: 125321, UP: 104199, Cs: 86434, PACMA: 5025, EB: 3032, VOX: 1614, UPyD: 1395, "RECORTES CERO-GRUPO VERDE": 1137, MAS: 568, PCPE: 564, INDEPENDIEN: 511 } },
];
