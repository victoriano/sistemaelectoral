// Datos OFICIALES de las Elecciones Generales de España 2023 (23 de julio)
// Fuente: Ministerio del Interior — infoelectoral
//   Dataset: https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02202307_TOTA.zip
//   Ficheros: 08022307.DAT (votos y electos por candidatura y provincia),
//             07022307.DAT (resumen provincial: votos en blanco, escaños),
//             03022307.DAT (registro de candidaturas y códigos de acumulación)
//   Descargado: 2026-06-12. Regenerable con: npx tsx scripts/fetch_2023.ts
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
export const circunscripciones: CircunscripcionData[] = [
  // ANDALUCÍA (61 escaños)
  {
    name: "Almería",
    shortName: "ALM",
    seats: 6,
    blankVotes: 2464,
    votes: { PP: 131524, PSOE: 93282, VOX: 68364, SUMAR: 21485, PACMA: 1962, ALM: 874, FO: 500, "PUM+J": 371, LB: 210, "RECORTES CERO": 206 }
  },
  {
    name: "Cádiz",
    shortName: "CAD",
    seats: 9,
    blankVotes: 7103,
    votes: { PP: 221703, PSOE: 211200, VOX: 96720, SUMAR: 82115, "ADELANTE ANDALUCÍA": 9191, PACMA: 5937, FO: 1225, CJ: 745, "PUM+J": 673, "RECORTES CERO": 486 }
  },
  {
    name: "Córdoba",
    shortName: "COR",
    seats: 6,
    blankVotes: 4348,
    votes: { PP: 169976, PSOE: 144080, VOX: 62526, SUMAR: 61594, PACMA: 2699, "ESCAÑOS EN BLANCO": 942, PCTE: 746, FO: 701, "PUM+J": 598, "RECORTES CERO": 392 }
  },
  {
    name: "Granada",
    shortName: "GRA",
    seats: 7,
    blankVotes: 4057,
    votes: { PP: 185996, PSOE: 165862, VOX: 81080, SUMAR: 58567, PACMA: 3143, JxG: 1218, "PUM+J": 765, PCTE: 695, FO: 658, CJ: 461, "RECORTES CERO": 343 }
  },
  {
    name: "Huelva",
    shortName: "HUE",
    seats: 5,
    blankVotes: 2410,
    votes: { PP: 93565, PSOE: 92326, VOX: 37572, SUMAR: 26752, XH: 1931, PACMA: 1663, "PUM+J": 368, "RECORTES CERO": 217 }
  },
  {
    name: "Jaén",
    shortName: "JAE",
    seats: 5,
    blankVotes: 2497,
    votes: { PP: 137617, PSOE: 133819, VOX: 54400, SUMAR: 29461, "JM+": 8293, PACMA: 1671, FO: 410, "PUM+J": 360, "RECORTES CERO": 203 }
  },
  {
    name: "Málaga",
    shortName: "MAL",
    seats: 11,
    blankVotes: 7509,
    votes: { PP: 302000, PSOE: 239172, VOX: 129758, SUMAR: 96652, PACMA: 8487, FO: 1662, "PUM+J": 1519, "RECORTES CERO": 888, CJ: 691 }
  },
  {
    name: "Sevilla",
    shortName: "SEV",
    seats: 12,
    blankVotes: 10951,
    votes: { PSOE: 387760, PP: 353663, SUMAR: 148745, VOX: 141087, PACMA: 9288, FO: 1950, "PUM+J": 1765, PCTE: 1522, "RECORTES CERO": 1034, CJ: 912, "FE de las JONS": 681 }
  },
  // ARAGÓN (13 escaños)
  {
    name: "Huesca",
    shortName: "HUE",
    seats: 3,
    blankVotes: 1217,
    votes: { PP: 45783, PSOE: 40307, VOX: 15155, SUMAR: 13774, EXISTE: 1312, PAR: 717, PACMA: 498, "ESCAÑOS EN BLANCO": 475, FO: 258, PCTE: 137, "PUM+J": 114, "F.I.A.": 84, "RECORTES CERO": 64 }
  },
  {
    name: "Teruel",
    shortName: "TER",
    seats: 3,
    blankVotes: 410,
    votes: { PP: 26586, PSOE: 22226, EXISTE: 11348, VOX: 9932, SUMAR: 4126, PAR: 711, PACMA: 172, "ESCAÑOS EN BLANCO": 135, FO: 94, PCTE: 60, "RECORTES CERO": 49, "PUM+J": 36, "F.I.A.": 28 }
  },
  {
    name: "Zaragoza",
    shortName: "ZAR",
    seats: 7,
    blankVotes: 4693,
    votes: { PP: 186776, PSOE: 159858, VOX: 79376, SUMAR: 69925, EXISTE: 7780, PAR: 2745, PACMA: 2428, "ESCAÑOS EN BLANCO": 2146, FO: 1026, PCTE: 561, "PUM+J": 419, "F.I.A.": 394, "RECORTES CERO": 306, "FE de las JONS": 272 }
  },
  // ASTURIAS (7 escaños)
  {
    name: "Asturias",
    shortName: "AST",
    seats: 7,
    blankVotes: 6079,
    votes: { PP: 212816, PSOE: 205049, SUMAR: 88630, VOX: 74571, PACMA: 3167, "ASTURIAS EXISTE EV": 2314, PCTE: 1598, FO: 1176, "PUM+J": 773, "RECORTES CERO": 590, PUEDE: 269 }
  },
  // BALEARES (8 escaños)
  {
    name: "Islas Baleares",
    shortName: "BAL",
    seats: 8,
    blankVotes: 4704,
    votes: { PP: 179303, PSOE: 151786, SUMAR: 83487, VOX: 76547, PACMA: 4969, FO: 1039, "RECORTES CERO": 726, PCTE: 719 }
  },
  // CANARIAS (15 escaños)
  {
    name: "Las Palmas",
    shortName: "LPA",
    seats: 8,
    blankVotes: 3062,
    votes: { PSOE: 175671, PP: 136857, VOX: 77343, SUMAR: 54369, "NC-bc": 42430, CCA: 33558, PACMA: 3570, "AHORA CANARIAS-PCPC": 883, FO: 635, "PUM+J": 563, "RECORTES CERO": 396 }
  },
  {
    name: "Santa Cruz de Tenerife",
    shortName: "TFE",
    seats: 7,
    blankVotes: 5088,
    votes: { PP: 174770, PSOE: 165590, CCA: 82805, SUMAR: 53632, PACMA: 6147, "NC-bc": 3165, FO: 1619, "AHORA CANARIAS-PCPC": 791, "RECORTES CERO": 766 }
  },
  // CANTABRIA (5 escaños)
  {
    name: "Cantabria",
    shortName: "CAN",
    seats: 5,
    blankVotes: 3262,
    votes: { PP: 147326, PSOE: 116596, VOX: 49243, SUMAR: 29713, PACMA: 2089, FO: 790, PCTE: 598, "RECORTES CERO": 533 }
  },
  // CASTILLA Y LEÓN (31 escaños)
  {
    name: "Ávila",
    shortName: "AVI",
    seats: 3,
    blankVotes: 632,
    votes: { PP: 42369, PSOE: 26828, VOX: 15068, XAV: 7362, SUMAR: 5027, PACMA: 275, FO: 100, "PUM+J": 91, PCTE: 85, "FE de las JONS": 77, "RECORTES CERO": 42 }
  },
  {
    name: "Burgos",
    shortName: "BUR",
    seats: 4,
    blankVotes: 1851,
    votes: { PP: 82329, PSOE: 69775, VOX: 25858, SUMAR: 17508, VB: 1774, "EV-PCAS-TC": 1184, PACMA: 943, FO: 490, "PUM+J": 354, PCTE: 349, "RECORTES CERO": 154 }
  },
  {
    name: "León",
    shortName: "LEO",
    seats: 4,
    blankVotes: 1577,
    votes: { PP: 101605, PSOE: 92578, VOX: 35451, "U.P.L.": 22675, SUMAR: 18577, PACMA: 895, FO: 541, "ESPAÑA VACIADA": 486, PCTE: 319, PREPAL: 309, "PUM+J": 155, "RECORTES CERO": 72 }
  },
  {
    name: "Palencia",
    shortName: "PAL",
    seats: 3,
    blankVotes: 833,
    votes: { PP: 40709, PSOE: 33613, VOX: 12504, SUMAR: 5877, VP: 1917, "ESPAÑA VACIADA": 384, GITV: 366, PACMA: 295, FO: 139, "PUM+J": 99, PCTE: 80, "FE de las JONS": 71, "RECORTES CERO": 42, CJ: 33 }
  },
  {
    name: "Salamanca",
    shortName: "SAL",
    seats: 4,
    blankVotes: 1649,
    votes: { PP: 93318, PSOE: 60718, VOX: 29203, SUMAR: 11012, "ESPAÑA VACIADA": 1062, PACMA: 631, PREPAL: 489, PCTE: 325, FO: 278, "PUM+J": 205, CJ: 140, "RECORTES CERO": 80 }
  },
  {
    name: "Segovia",
    shortName: "SEG",
    seats: 3,
    blankVotes: 875,
    votes: { PP: 39894, PSOE: 27113, VOX: 12510, SUMAR: 7137, PACMA: 307, "3e": 198, FO: 183, "PUM+J": 136, CJ: 102, PCTE: 94, "RECORTES CERO": 64 }
  },
  {
    name: "Soria",
    shortName: "SOR",
    seats: 2,
    blankVotes: 285,
    votes: { PP: 18895, PSOE: 14966, SY: 9697, VOX: 4978, SUMAR: 1711, PACMA: 94, FO: 68, PCTE: 43, "PUM+J": 23, "RECORTES CERO": 9 }
  },
  {
    name: "Valladolid",
    shortName: "VAL",
    seats: 5,
    blankVotes: 2419,
    votes: { PP: 129170, PSOE: 103596, VOX: 47948, SUMAR: 28049, "ESPAÑA VACIADA": 1226, PACMA: 1105, FO: 601, "ESCAÑOS EN BLANCO": 583, "Ud.Ca": 463, "PUM+J": 376, PCTE: 335, "FE de las JONS": 164, "RECORTES CERO": 159, "FUERZA CÍVICA": 115 }
  },
  {
    name: "Zamora",
    shortName: "ZAM",
    seats: 3,
    blankVotes: 922,
    votes: { PP: 46196, PSOE: 33601, VOX: 13652, SUMAR: 5839, Zsi: 1843, "U.P.L.": 526, PACMA: 313, PREPAL: 166, FO: 121, PCTE: 100, "PUM+J": 81, "RECORTES CERO": 50 }
  },
  // CASTILLA-LA MANCHA (21 escaños)
  {
    name: "Albacete",
    shortName: "ALB",
    seats: 4,
    blankVotes: 1834,
    votes: { PP: 88299, PSOE: 76322, VOX: 36750, SUMAR: 15834, PACMA: 1261, FO: 381, "PUM+J": 325, "RECORTES CERO": 185 }
  },
  {
    name: "Ciudad Real",
    shortName: "CRE",
    seats: 5,
    blankVotes: 2353,
    votes: { PP: 114709, PSOE: 100102, VOX: 46046, SUMAR: 17405, PACMA: 1319, FO: 447, "PUM+J": 365, "RECORTES CERO": 233 }
  },
  {
    name: "Cuenca",
    shortName: "CUE",
    seats: 3,
    blankVotes: 969,
    votes: { PP: 45255, PSOE: 42528, VOX: 17700, SUMAR: 6325, PACMA: 387, FO: 207, "ESCAÑOS EN BLANCO": 168, "PUM+J": 111, PCTE: 100, "RECORTES CERO": 58 }
  },
  {
    name: "Guadalajara",
    shortName: "GUA",
    seats: 3,
    blankVotes: 1143,
    votes: { PP: 51195, PSOE: 46479, VOX: 27126, SUMAR: 12907, PACMA: 1039, FO: 304, "PUM+J": 249, PCTE: 191, "RECORTES CERO": 162, "FE de las JONS": 118 }
  },
  {
    name: "Toledo",
    shortName: "TOL",
    seats: 6,
    blankVotes: 2611,
    votes: { PP: 146533, PSOE: 126072, VOX: 76044, SUMAR: 31876, PACMA: 2024, FO: 985, "PUM+J": 499, "FE de las JONS": 281, "RECORTES CERO": 275 }
  },
  // CATALUÑA (48 escaños)
  {
    name: "Barcelona",
    shortName: "BCN",
    seats: 32,
    blankVotes: 21059,
    votes: { PSOE: 952347, SUMAR: 405993, PP: 367519, ERC: 328697, JUNTS: 258159, VOX: 201775, CUP: 67266, PACMA: 28201, "PDeCAT-E-CiU": 24452, FO: 6048, "RECORTES CERO": 3104, PCTE: 2858 }
  },
  {
    name: "Girona",
    shortName: "GIR",
    seats: 6,
    blankVotes: 2981,
    votes: { PSOE: 93448, JUNTS: 63251, ERC: 47531, SUMAR: 35344, PP: 31341, VOX: 22706, CUP: 18229, PACMA: 3531, "PDeCAT-E-CiU": 3388, FO: 570, PCTE: 420, "RECORTES CERO": 248 }
  },
  {
    name: "Lleida",
    shortName: "LLE",
    seats: 4,
    blankVotes: 2059,
    votes: { PSOE: 54414, ERC: 34331, JUNTS: 33228, PP: 23699, SUMAR: 14561, VOX: 12560, CUP: 5449, "PDeCAT-E-CiU": 1865, PACMA: 1352, "ESCAÑOS EN BLANCO": 462, FO: 247, PCTE: 192, "RECORTES CERO": 120 }
  },
  {
    name: "Tarragona",
    shortName: "TAR",
    seats: 6,
    blankVotes: 3168,
    votes: { PSOE: 121126, ERC: 55461, PP: 51061, SUMAR: 41719, JUNTS: 40791, VOX: 38039, CUP: 8700, PACMA: 3797, "PDeCAT-E-CiU": 2311, FO: 661, PCTE: 405, "RECORTES CERO": 267, EVC: 265, "UNIDOS SI": 253 }
  },
  // COMUNIDAD VALENCIANA (32 escaños)
  {
    name: "Alicante",
    shortName: "ALI",
    seats: 12,
    blankVotes: 6575,
    votes: { PP: 330293, PSOE: 287737, VOX: 146133, SUMAR: 115787, PACMA: 7335, FO: 1724, "PARTIDO AUTÓNOMOS": 1446, "RECORTES CERO": 1135, CJ: 1027 }
  },
  {
    name: "Castellón",
    shortName: "CAS",
    seats: 5,
    blankVotes: 2655,
    votes: { PP: 108302, PSOE: 100530, VOX: 48913, SUMAR: 44187, PACMA: 1968, FO: 721, "RECORTES CERO": 493, "FE de las JONS": 161 }
  },
  {
    name: "Valencia",
    shortName: "VAL",
    seats: 16,
    blankVotes: 10810,
    votes: { PP: 483469, PSOE: 461353, SUMAR: 242839, VOX: 218657, PACMA: 10334, FO: 2919, "PUM+J": 1778, "RECORTES CERO": 1773, EVB: 1442, CJ: 1056, "FE de las JONS": 731 }
  },
  // EXTREMADURA (10 escaños)
  {
    name: "Badajoz",
    shortName: "BAD",
    seats: 5,
    blankVotes: 3225,
    votes: { PSOE: 153473, PP: 148068, VOX: 53492, SUMAR: 26778, BQEX: 3885, PACMA: 1395, FO: 477, "PUM+J": 464, "RECORTES CERO": 204 }
  },
  {
    name: "Cáceres",
    shortName: "CAC",
    seats: 4,
    blankVotes: 1721,
    votes: { PSOE: 91692, PP: 89633, VOX: 32076, SUMAR: 16354, BQEX: 1922, "Somos Cc": 963, PACMA: 814, FO: 316, "PUM+J": 249, "RECORTES CERO": 111 }
  },
  // GALICIA (23 escaños)
  {
    name: "A Coruña",
    shortName: "COR",
    seats: 8,
    blankVotes: 5197,
    votes: { PP: 292272, PSOE: 190897, SUMAR: 82618, BNG: 67653, VOX: 34410, PACMA: 3096, FO: 1011, "RECORTES CERO": 548 }
  },
  {
    name: "Lugo",
    shortName: "LUG",
    seats: 4,
    blankVotes: 1251,
    votes: { PP: 99769, PSOE: 60163, BNG: 17197, SUMAR: 10287, VOX: 8643, PACMA: 645, FO: 233, "PUM+J": 149, PCTE: 116, "RECORTES CERO": 113 }
  },
  {
    name: "Ourense",
    shortName: "OUR",
    seats: 4,
    blankVotes: 1109,
    votes: { PP: 93182, PSOE: 56035, BNG: 15317, SUMAR: 10171, VOX: 9080, PACMA: 700, FO: 182, CCD: 153, "PUM+J": 144, PCTE: 101, "RECORTES CERO": 97 }
  },
  {
    name: "Pontevedra",
    shortName: "PON",
    seats: 7,
    blankVotes: 3865,
    votes: { PP: 227658, PSOE: 179737, SUMAR: 75615, BNG: 53828, VOX: 27539, PACMA: 3003, FO: 884, "RECORTES CERO": 510, PCTE: 485 }
  },
  // LA RIOJA (4 escaños)
  {
    name: "La Rioja",
    shortName: "RIO",
    seats: 4,
    blankVotes: 1608,
    votes: { PP: 79715, PSOE: 62322, VOX: 17056, SUMAR: 11470, PACMA: 723, "ESCAÑOS EN BLANCO": 608, FO: 295, "3e": 286, "PUM+J": 232, PCTE: 224, "RECORTES CERO": 124 }
  },
  // MADRID (37 escaños)
  {
    name: "Madrid",
    shortName: "MAD",
    seats: 37,
    blankVotes: 28960,
    votes: { PP: 1463183, PSOE: 1004599, SUMAR: 557780, VOX: 506164, PACMA: 21742, FO: 7652, "PUM+J": 6749, "RECORTES CERO": 3784, PCTE: 3407, PH: 2902, "FE de las JONS": 1751 }
  },
  // MURCIA (10 escaños)
  {
    name: "Murcia",
    shortName: "MUR",
    seats: 10,
    blankVotes: 5034,
    votes: { PP: 307972, PSOE: 189210, VOX: 163124, SUMAR: 71578, PACMA: 5063, "POR MI REGIÓN": 1698, "ESCAÑOS EN BLANCO": 1377, FO: 1201, "RECORTES CERO": 546, CJ: 453, "FE de las JONS": 376, "+RDS+": 165 }
  },
  // NAVARRA (5 escaños)
  {
    name: "Navarra",
    shortName: "NAV",
    seats: 5,
    blankVotes: 2890,
    votes: { PSOE: 93553, BILDU: 58954, PP: 57134, UPN: 52188, SUMAR: 43922, VOX: 19491, GBAI: 9938, PACMA: 1530, "PUM+J": 1002, FO: 679, PCTE: 311, "RECORTES CERO": 252 }
  },
  // PAÍS VASCO (18 escaños)
  {
    name: "Álava",
    shortName: "ALA",
    seats: 4,
    blankVotes: 722,
    votes: { PSOE: 46775, BILDU: 32987, PP: 30212, PNV: 28075, SUMAR: 21561, VOX: 6573, PACMA: 773, "ESCAÑOS EN BLANCO": 619, FO: 354, "RECORTES CERO": 185, PCTE: 165, "PUM+J": 106 }
  },
  {
    name: "Guipúzcoa",
    shortName: "GUI",
    seats: 6,
    blankVotes: 2005,
    votes: { BILDU: 117321, PSOE: 87709, PNV: 85026, SUMAR: 40081, PP: 32721, VOX: 7877, PACMA: 1568, "ESCAÑOS EN BLANCO": 933, FO: 530, "RECORTES CERO": 442, PCTE: 259, "PUM+J": 149 }
  },
  {
    name: "Vizcaya",
    shortName: "VIZ",
    seats: 8,
    blankVotes: 3391,
    votes: { PNV: 164188, PSOE: 157448, BILDU: 125867, PP: 70533, SUMAR: 66592, VOX: 16069, PACMA: 2729, FO: 929, "PUM+J": 804, PCTE: 618, "RECORTES CERO": 525 }
  },
  // CEUTA (1 escaño)
  {
    name: "Ceuta",
    shortName: "CEU",
    seats: 1,
    blankVotes: 328,
    votes: { PP: 12918, PSOE: 11332, VOX: 7752, SUMAR: 821, FO: 53, LB: 53, "RECORTES CERO": 33, "PUM+J": 31 }
  },
  // MELILLA (1 escaño)
  {
    name: "Melilla",
    shortName: "MEL",
    seats: 1,
    blankVotes: 253,
    votes: { PP: 13446, PSOE: 6943, VOX: 4359, CpM: 1298, SUMAR: 827, PACMA: 160, "PUM+J": 40, "RECORTES CERO": 23 }
  },
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
