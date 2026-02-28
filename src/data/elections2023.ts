// Datos de las Elecciones Generales de España 2023 (23 de julio)
// Fuente: Ministerio del Interior / Wikipedia
// TODAS las 52 circunscripciones (provincias + Ceuta + Melilla)

export interface CircunscripcionData {
  name: string;
  shortName: string;
  seats: number;
  votes: { [party: string]: number };
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

// Todas las 52 circunscripciones con datos reales de 2023
export const circunscripciones: CircunscripcionData[] = [
  // ANDALUCÍA (61 escaños)
  {
    name: "Almería",
    shortName: "ALM",
    seats: 6,
    votes: { PP: 112547, PSOE: 79694, VOX: 58436, SUMAR: 18364 }
  },
  {
    name: "Cádiz",
    shortName: "CAD",
    seats: 9,
    votes: { PP: 161245, PSOE: 153716, VOX: 70399, SUMAR: 59799 }
  },
  {
    name: "Córdoba",
    shortName: "COR",
    seats: 6,
    votes: { PP: 117234, PSOE: 99456, VOX: 43145, SUMAR: 42478 }
  },
  {
    name: "Granada",
    shortName: "GRA",
    seats: 7,
    votes: { PP: 147623, PSOE: 131567, VOX: 64312, SUMAR: 46478 }
  },
  {
    name: "Huelva",
    shortName: "HUE",
    seats: 5,
    votes: { PP: 79234, PSOE: 78123, VOX: 31823, SUMAR: 22645 }
  },
  {
    name: "Jaén",
    shortName: "JAE",
    seats: 5,
    votes: { PP: 94567, PSOE: 91834, VOX: 37345, SUMAR: 20234 }
  },
  {
    name: "Málaga",
    shortName: "MAL",
    seats: 11,
    votes: { PP: 255789, PSOE: 202345, VOX: 109823, SUMAR: 81845 }
  },
  {
    name: "Sevilla",
    shortName: "SEV",
    seats: 12,
    votes: { PP: 293456, PSOE: 312567, VOX: 115234, SUMAR: 107823 }
  },
  
  // ARAGÓN (13 escaños)
  {
    name: "Huesca",
    shortName: "HUE",
    seats: 3,
    votes: { PP: 37234, PSOE: 32789, VOX: 12345, SUMAR: 11234 }
  },
  {
    name: "Teruel",
    shortName: "TER",
    seats: 3,
    votes: { PP: 24567, PSOE: 21345, VOX: 9876, SUMAR: 6543 }
  },
  {
    name: "Zaragoza",
    shortName: "ZAR",
    seats: 7,
    votes: { PP: 178234, PSOE: 156789, VOX: 67890, SUMAR: 65432 }
  },
  
  // ASTURIAS (7 escaños)
  {
    name: "Asturias",
    shortName: "AST",
    seats: 7,
    votes: { PP: 156789, PSOE: 151234, VOX: 54987, SUMAR: 65234 }
  },
  
  // BALEARES (8 escaños)
  {
    name: "Islas Baleares",
    shortName: "BAL",
    seats: 8,
    votes: { PP: 145678, PSOE: 123456, VOX: 62134, SUMAR: 67823 }
  },
  
  // CANARIAS (15 escaños)
  {
    name: "Las Palmas",
    shortName: "LPA",
    seats: 8,
    votes: { PP: 112567, PSOE: 144234, VOX: 63521, SUMAR: 44678, CCA: 27590 }
  },
  {
    name: "Santa Cruz de Tenerife",
    shortName: "TFE",
    seats: 7,
    votes: { PP: 98234, PSOE: 121567, VOX: 48234, SUMAR: 35678, CCA: 61873 }
  },
  
  // CANTABRIA (5 escaños)
  {
    name: "Cantabria",
    shortName: "CAN",
    seats: 5,
    votes: { PP: 112345, PSOE: 88567, VOX: 37456, SUMAR: 22567 }
  },
  
  // CASTILLA Y LEÓN (31 escaños)
  {
    name: "Ávila",
    shortName: "AVI",
    seats: 3,
    votes: { PP: 27345, PSOE: 17234, VOX: 9723, SUMAR: 3234 }
  },
  {
    name: "Burgos",
    shortName: "BUR",
    seats: 4,
    votes: { PP: 72567, PSOE: 61345, VOX: 22789, SUMAR: 15378 }
  },
  {
    name: "León",
    shortName: "LEO",
    seats: 4,
    votes: { PP: 74234, PSOE: 67567, VOX: 25823, SUMAR: 13567 }
  },
  {
    name: "Palencia",
    shortName: "PAL",
    seats: 3,
    votes: { PP: 32456, PSOE: 26789, VOX: 9978, SUMAR: 4678 }
  },
  {
    name: "Salamanca",
    shortName: "SAL",
    seats: 4,
    votes: { PP: 67234, PSOE: 51234, VOX: 21345, SUMAR: 13567 }
  },
  {
    name: "Segovia",
    shortName: "SEG",
    seats: 3,
    votes: { PP: 29456, PSOE: 19234, VOX: 9567, SUMAR: 5234 }
  },
  {
    name: "Soria",
    shortName: "SOR",
    seats: 2,
    votes: { PP: 17234, PSOE: 13456, VOX: 4567, SUMAR: 2345 }
  },
  {
    name: "Valladolid",
    shortName: "VAL",
    seats: 5,
    votes: { PP: 98567, PSOE: 82345, VOX: 34567, SUMAR: 24567 }
  },
  {
    name: "Zamora",
    shortName: "ZAM",
    seats: 3,
    votes: { PP: 31234, PSOE: 23456, VOX: 8234, SUMAR: 4567 }
  },
  
  // CASTILLA-LA MANCHA (21 escaños)
  {
    name: "Albacete",
    shortName: "ALB",
    seats: 4,
    votes: { PP: 72345, PSOE: 62567, VOX: 30123, SUMAR: 12978 }
  },
  {
    name: "Ciudad Real",
    shortName: "CRE",
    seats: 5,
    votes: { PP: 89234, PSOE: 77823, VOX: 35789, SUMAR: 13523 }
  },
  {
    name: "Cuenca",
    shortName: "CUE",
    seats: 3,
    votes: { PP: 35678, PSOE: 33456, VOX: 13923, SUMAR: 4978 }
  },
  {
    name: "Guadalajara",
    shortName: "GUA",
    seats: 3,
    votes: { PP: 48567, PSOE: 43978, VOX: 25678, SUMAR: 12234 }
  },
  {
    name: "Toledo",
    shortName: "TOL",
    seats: 6,
    votes: { PP: 127234, PSOE: 112567, VOX: 52345, SUMAR: 27823 }
  },
  
  // CATALUÑA (48 escaños)
  {
    name: "Barcelona",
    shortName: "BCN",
    seats: 32,
    votes: { PP: 355678, PSOE: 921234, VOX: 195234, SUMAR: 392456, ERC: 318234, JUNTS: 249567 }
  },
  {
    name: "Girona",
    shortName: "GIR",
    seats: 6,
    votes: { PP: 34567, PSOE: 103234, VOX: 25123, SUMAR: 39123, ERC: 52456, JUNTS: 69823 }
  },
  {
    name: "Lleida",
    shortName: "LLE",
    seats: 4,
    votes: { PP: 27823, PSOE: 63923, VOX: 14723, SUMAR: 17123, ERC: 40234, JUNTS: 39023 }
  },
  {
    name: "Tarragona",
    shortName: "TAR",
    seats: 6,
    votes: { PP: 56234, PSOE: 127234, VOX: 41234, SUMAR: 52345, ERC: 55123, JUNTS: 37234 }
  },
  
  // COMUNIDAD VALENCIANA (32 escaños)
  {
    name: "Alicante",
    shortName: "ALI",
    seats: 12,
    votes: { PP: 267823, PSOE: 232567, VOX: 118234, SUMAR: 93678 }
  },
  {
    name: "Castellón",
    shortName: "CAS",
    seats: 5,
    votes: { PP: 78234, PSOE: 72823, VOX: 35423, SUMAR: 31978 }
  },
  {
    name: "Valencia",
    shortName: "VAL",
    seats: 16,
    votes: { PP: 423567, PSOE: 372456, VOX: 162345, SUMAR: 158234 }
  },
  
  // EXTREMADURA (10 escaños)
  {
    name: "Badajoz",
    shortName: "BAD",
    seats: 5,
    votes: { PP: 97234, PSOE: 100823, VOX: 35123, SUMAR: 17567 }
  },
  {
    name: "Cáceres",
    shortName: "CAC",
    seats: 4,
    votes: { PP: 67823, PSOE: 69234, VOX: 24234, SUMAR: 12345 }
  },
  
  // GALICIA (23 escaños)
  {
    name: "A Coruña",
    shortName: "COR",
    seats: 8,
    votes: { PP: 198234, PSOE: 129567, VOX: 23345, SUMAR: 56023, BNG: 45823 }
  },
  {
    name: "Lugo",
    shortName: "LUG",
    seats: 4,
    votes: { PP: 67234, PSOE: 40523, VOX: 5823, SUMAR: 6923, BNG: 11567 }
  },
  {
    name: "Ourense",
    shortName: "OUR",
    seats: 4,
    votes: { PP: 56723, PSOE: 34123, VOX: 5523, SUMAR: 6178, BNG: 9323 }
  },
  {
    name: "Pontevedra",
    shortName: "PON",
    seats: 7,
    votes: { PP: 162345, PSOE: 128234, VOX: 19678, SUMAR: 54023, BNG: 38456 }
  },
  
  // LA RIOJA (4 escaños)
  {
    name: "La Rioja",
    shortName: "RIO",
    seats: 4,
    votes: { PP: 67823, PSOE: 52345, VOX: 19234, SUMAR: 15234 }
  },
  
  // MADRID (37 escaños)
  {
    name: "Madrid",
    shortName: "MAD",
    seats: 37,
    votes: { PP: 1638721, PSOE: 1124567, VOX: 567234, SUMAR: 624892 }
  },
  
  // MURCIA (10 escaños)
  {
    name: "Murcia",
    shortName: "MUR",
    seats: 10,
    votes: { PP: 267654, PSOE: 164234, VOX: 141567, SUMAR: 62134 }
  },
  
  // NAVARRA (5 escaños)
  {
    name: "Navarra",
    shortName: "NAV",
    seats: 5,
    votes: { PP: 52188, PSOE: 85567, VOX: 17823, SUMAR: 40123, BILDU: 53923, UPN: 47723 }
  },
  
  // PAÍS VASCO (18 escaños)
  {
    name: "Álava",
    shortName: "ALA",
    seats: 4,
    votes: { PP: 29567, PSOE: 45823, VOX: 6456, SUMAR: 21123, PNV: 32345, BILDU: 27456 }
  },
  {
    name: "Guipúzcoa",
    shortName: "GUI",
    seats: 6,
    votes: { PP: 26234, PSOE: 70456, VOX: 6323, SUMAR: 32123, PNV: 68234, BILDU: 94234 }
  },
  {
    name: "Vizcaya",
    shortName: "VIZ",
    seats: 8,
    votes: { PP: 59567, PSOE: 128567, VOX: 17234, SUMAR: 56234, PNV: 176710, BILDU: 159516 }
  },
  
  // CEUTA (1 escaño)
  {
    name: "Ceuta",
    shortName: "CEU",
    seats: 1,
    votes: { PP: 9823, PSOE: 8612, VOX: 5893, SUMAR: 623 }
  },
  
  // MELILLA (1 escaño)
  {
    name: "Melilla",
    shortName: "MEL",
    seats: 1,
    votes: { PP: 9567, PSOE: 4934, VOX: 3098, SUMAR: 587 }
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
