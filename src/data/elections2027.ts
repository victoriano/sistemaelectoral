// Proyección electoral 2027 basada en promedios de encuestas (febrero 2026)
// Fuentes: Ateneo del Dato, Target Point, NC Report, Sociométrica, 40dB
// Metodología: promedios de intención de voto aplicados sobre patrones geográficos de 2023
//
// * NOTA: Esta proyección es una estimación educativa. Se basa en:
//   1. Promedio de 5 encuestas de febrero 2026
//   2. Distribución geográfica del voto de 2023 como base
//   3. Los votos de Podemos se distribuyen con el patrón geográfico de SUMAR
//   4. Los partidos regionales mantienen su distribución de 2023
//   5. Se asume la misma participación total que en 2023

import { CircunscripcionData } from "./elections2023";

export const circunscripciones2027: CircunscripcionData[] = [
  {
    name: "Almería",
    shortName: "ALM",
    seats: 6,
    votes: { PP: 109645, VOX: 90465, PSOE: 67606, SUMAR: 10066, Podemos: 5919 }
  },
  {
    name: "Cádiz",
    shortName: "CAD",
    seats: 9,
    votes: { PP: 157087, PSOE: 130399, VOX: 108984, SUMAR: 32778, Podemos: 19275 }
  },
  {
    name: "Córdoba",
    shortName: "COR",
    seats: 6,
    votes: { PP: 114211, PSOE: 84370, VOX: 66793, SUMAR: 23284, Podemos: 13692 }
  },
  {
    name: "Granada",
    shortName: "GRA",
    seats: 7,
    votes: { PP: 143816, PSOE: 111610, VOX: 99561, SUMAR: 25476, Podemos: 14982 }
  },
  {
    name: "Huelva",
    shortName: "HUE",
    seats: 5,
    votes: { PP: 77191, PSOE: 66273, VOX: 49265, SUMAR: 12413, Podemos: 7299 }
  },
  {
    name: "Jaén",
    shortName: "JAE",
    seats: 5,
    votes: { PP: 92128, PSOE: 77904, VOX: 57814, SUMAR: 11091, Podemos: 6522 }
  },
  {
    name: "Málaga",
    shortName: "MAL",
    seats: 11,
    votes: { PP: 249193, PSOE: 171652, VOX: 170017, SUMAR: 44862, Podemos: 26382 }
  },
  {
    name: "Sevilla",
    shortName: "SEV",
    seats: 12,
    votes: { PP: 285889, PSOE: 265155, VOX: 178393, SUMAR: 59102, Podemos: 34755 }
  },
  {
    name: "Huesca",
    shortName: "HUE",
    seats: 3,
    votes: { PP: 36274, PSOE: 27815, VOX: 19111, SUMAR: 6158, Podemos: 3621 }
  },
  {
    name: "Teruel",
    shortName: "TER",
    seats: 3,
    votes: { PP: 23933, PSOE: 18107, VOX: 15289, SUMAR: 3586, Podemos: 2109 }
  },
  {
    name: "Zaragoza",
    shortName: "ZAR",
    seats: 7,
    votes: { PP: 173638, PSOE: 133006, VOX: 105100, SUMAR: 35866, Podemos: 21091 }
  },
  {
    name: "Asturias",
    shortName: "AST",
    seats: 7,
    votes: { PP: 152746, PSOE: 128294, VOX: 85125, SUMAR: 35757, Podemos: 21027 }
  },
  {
    name: "Islas Baleares",
    shortName: "BAL",
    seats: 8,
    votes: { PP: 141921, PSOE: 104729, VOX: 96189, SUMAR: 37176, Podemos: 21862 }
  },
  {
    name: "Las Palmas",
    shortName: "LPA",
    seats: 8,
    votes: { PSOE: 122356, PP: 109664, VOX: 98337, CCA: 28909, SUMAR: 24490, Podemos: 14401 }
  },
  {
    name: "Santa Cruz de Tenerife",
    shortName: "TFE",
    seats: 7,
    votes: { PSOE: 103127, PP: 95701, VOX: 74671, CCA: 64830, SUMAR: 19556, Podemos: 11500 }
  },
  {
    name: "Cantabria",
    shortName: "CAN",
    seats: 5,
    votes: { PP: 109448, PSOE: 75133, VOX: 57985, SUMAR: 12370, Podemos: 7274 }
  },
  {
    name: "Ávila",
    shortName: "AVI",
    seats: 3,
    votes: { PP: 26640, VOX: 15052, PSOE: 14620, SUMAR: 1773, Podemos: 1042 }
  },
  {
    name: "Burgos",
    shortName: "BUR",
    seats: 4,
    votes: { PP: 70696, PSOE: 52040, VOX: 35280, SUMAR: 8429, Podemos: 4957 }
  },
  {
    name: "León",
    shortName: "LEO",
    seats: 4,
    votes: { PP: 72320, PSOE: 57318, VOX: 39976, SUMAR: 7437, Podemos: 4373 }
  },
  {
    name: "Palencia",
    shortName: "PAL",
    seats: 3,
    votes: { PP: 31619, PSOE: 22725, VOX: 15447, SUMAR: 2564, Podemos: 1508 }
  },
  {
    name: "Salamanca",
    shortName: "SAL",
    seats: 4,
    votes: { PP: 65500, PSOE: 43463, VOX: 33044, SUMAR: 7437, Podemos: 4373 }
  },
  {
    name: "Segovia",
    shortName: "SEG",
    seats: 3,
    votes: { PP: 28696, PSOE: 16316, VOX: 14811, SUMAR: 2869, Podemos: 1687 }
  },
  {
    name: "Soria",
    shortName: "SOR",
    seats: 2,
    votes: { PP: 16790, PSOE: 11415, VOX: 7070, SUMAR: 1285, Podemos: 756 }
  },
  {
    name: "Valladolid",
    shortName: "VAL",
    seats: 5,
    votes: { PP: 96025, PSOE: 69854, VOX: 53513, SUMAR: 13466, Podemos: 7919 }
  },
  {
    name: "Zamora",
    shortName: "ZAM",
    seats: 3,
    votes: { PP: 30429, PSOE: 19898, VOX: 12747, SUMAR: 2503, Podemos: 1472 }
  },
  {
    name: "Albacete",
    shortName: "ALB",
    seats: 4,
    votes: { PP: 70479, PSOE: 53076, VOX: 46633, SUMAR: 7114, Podemos: 4183 }
  },
  {
    name: "Ciudad Real",
    shortName: "CRE",
    seats: 5,
    votes: { PP: 86933, PSOE: 66018, VOX: 55405, SUMAR: 7412, Podemos: 4359 }
  },
  {
    name: "Cuenca",
    shortName: "CUE",
    seats: 3,
    votes: { PP: 34758, PSOE: 28381, VOX: 21554, SUMAR: 2729, Podemos: 1605 }
  },
  {
    name: "Guadalajara",
    shortName: "GUA",
    seats: 3,
    votes: { PP: 47315, VOX: 39752, PSOE: 37307, SUMAR: 6706, Podemos: 3943 }
  },
  {
    name: "Toledo",
    shortName: "TOL",
    seats: 6,
    votes: { PP: 123953, PSOE: 95492, VOX: 81035, SUMAR: 15251, Podemos: 8968 }
  },
  {
    name: "Barcelona",
    shortName: "BCN",
    seats: 32,
    votes: { PSOE: 781496, PP: 346506, ERC: 333446, VOX: 302241, JUNTS: 261497, SUMAR: 215120, Podemos: 126503 }
  },
  {
    name: "Girona",
    shortName: "GIR",
    seats: 6,
    votes: { PSOE: 87575, JUNTS: 73161, ERC: 54964, VOX: 38893, PP: 33676, SUMAR: 21445, Podemos: 12611 }
  },
  {
    name: "Lleida",
    shortName: "LLE",
    seats: 4,
    votes: { PSOE: 54227, ERC: 42157, JUNTS: 40888, PP: 27106, VOX: 22793, SUMAR: 9386, Podemos: 5519 }
  },
  {
    name: "Tarragona",
    shortName: "TAR",
    seats: 6,
    votes: { PSOE: 107934, VOX: 63834, ERC: 57758, PP: 54784, JUNTS: 39014, SUMAR: 28692, Podemos: 16873 }
  },
  {
    name: "Alicante",
    shortName: "ALI",
    seats: 12,
    votes: { PP: 260917, PSOE: 197290, VOX: 183038, SUMAR: 51348, Podemos: 30196 }
  },
  {
    name: "Castellón",
    shortName: "CAS",
    seats: 5,
    votes: { PP: 76217, PSOE: 61777, VOX: 54838, SUMAR: 17528, Podemos: 10308 }
  },
  {
    name: "Valencia",
    shortName: "VAL",
    seats: 16,
    votes: { PP: 412644, PSOE: 315960, VOX: 251326, SUMAR: 86734, Podemos: 51005 }
  },
  {
    name: "Badajoz",
    shortName: "BAD",
    seats: 5,
    votes: { PP: 94727, PSOE: 85530, VOX: 54374, SUMAR: 9629, Podemos: 5662 }
  },
  {
    name: "Cáceres",
    shortName: "CAC",
    seats: 4,
    votes: { PP: 66074, PSOE: 58732, VOX: 37517, SUMAR: 6767, Podemos: 3979 }
  },
  {
    name: "A Coruña",
    shortName: "COR",
    seats: 8,
    votes: { PP: 193122, PSOE: 109914, BNG: 48013, VOX: 36140, SUMAR: 30708, Podemos: 18058 }
  },
  {
    name: "Lugo",
    shortName: "LUG",
    seats: 4,
    votes: { PP: 65500, PSOE: 34376, BNG: 12120, VOX: 9015, SUMAR: 3795, Podemos: 2232 }
  },
  {
    name: "Ourense",
    shortName: "OUR",
    seats: 4,
    votes: { PP: 55260, PSOE: 28947, BNG: 9769, VOX: 8550, SUMAR: 3386, Podemos: 1991 }
  },
  {
    name: "Pontevedra",
    shortName: "PON",
    seats: 7,
    votes: { PP: 158159, PSOE: 108783, BNG: 40294, VOX: 30463, SUMAR: 29612, Podemos: 17414 }
  },
  {
    name: "La Rioja",
    shortName: "RIO",
    seats: 4,
    votes: { PP: 66074, PSOE: 44405, VOX: 29776, SUMAR: 8350, Podemos: 4910 }
  },
  {
    name: "Madrid",
    shortName: "MAD",
    seats: 37,
    votes: { PP: 1596463, PSOE: 953986, VOX: 878133, SUMAR: 342526, Podemos: 201426 }
  },
  {
    name: "Murcia",
    shortName: "MUR",
    seats: 10,
    votes: { PP: 260752, VOX: 219159, PSOE: 139322, SUMAR: 34058, Podemos: 20028 }
  },
  {
    name: "Navarra",
    shortName: "NAV",
    seats: 5,
    votes: { PSOE: 72588, BILDU: 56501, PP: 50842, UPN: 50004, VOX: 27592, SUMAR: 21993, Podemos: 12933 }
  },
  {
    name: "Álava",
    shortName: "ALA",
    seats: 4,
    votes: { PSOE: 38872, PNV: 33891, PP: 28805, BILDU: 28768, SUMAR: 11578, VOX: 9995, Podemos: 6809 }
  },
  {
    name: "Guipúzcoa",
    shortName: "GUI",
    seats: 6,
    votes: { BILDU: 98739, PNV: 71496, PSOE: 59769, PP: 25558, SUMAR: 17608, Podemos: 10354, VOX: 9789 }
  },
  {
    name: "Vizcaya",
    shortName: "VIZ",
    seats: 8,
    votes: { PNV: 185157, BILDU: 167141, PSOE: 109065, PP: 58031, SUMAR: 30824, VOX: 26680, Podemos: 18126 }
  },
  {
    name: "Ceuta",
    shortName: "CEU",
    seats: 1,
    votes: { PP: 9570, VOX: 9123, PSOE: 7306, SUMAR: 341, Podemos: 201 }
  },
  {
    name: "Melilla",
    shortName: "MEL",
    seats: 1,
    votes: { PP: 9320, VOX: 4796, PSOE: 4186, SUMAR: 322, Podemos: 189 }
  },
];
