// Datos históricos de elecciones generales de España
// Fuente: Ministerio del Interior

import { CircunscripcionData, parties } from "./elections2023";

export interface ElectionData {
  year: string;
  name: string;
  date: string;
  totalVotes: number;
  participation: number;
  circumscriptions: CircunscripcionData[];
  nationalResults: { [party: string]: number }; // escaños reales
}

// Resultados nacionales simplificados por elección
// Para el simulador usamos los votos nacionales y los distribuimos proporcionalmente

export const historicalElections: { [key: string]: ElectionData } = {
  "2023": {
    year: "2023",
    name: "Elecciones Generales 23-J",
    date: "23 de julio de 2023",
    totalVotes: 24688087,
    participation: 66.59,
    circumscriptions: [], // Se carga desde elections2023.ts
    nationalResults: {
      PP: 137, PSOE: 121, VOX: 33, SUMAR: 31, ERC: 7, JUNTS: 7, 
      BILDU: 6, PNV: 5, BNG: 1, CCA: 1, UPN: 1
    }
  },
  "2019-N": {
    year: "2019-N",
    name: "Elecciones Generales 10-N",
    date: "10 de noviembre de 2019",
    totalVotes: 24508049,
    participation: 66.23,
    circumscriptions: [],
    nationalResults: {
      PSOE: 120, PP: 89, VOX: 52, UP: 35, ERC: 13, Cs: 10, 
      JUNTS: 8, PNV: 6, BILDU: 5, MP: 3, CUP: 2, CCA: 2, 
      BNG: 1, NA: 1, PRC: 1, TE: 1
    }
  },
  "2019-A": {
    year: "2019-A",
    name: "Elecciones Generales 28-A",
    date: "28 de abril de 2019",
    totalVotes: 26472773,
    participation: 71.76,
    circumscriptions: [],
    nationalResults: {
      PSOE: 123, PP: 66, Cs: 57, UP: 42, VOX: 24, ERC: 15,
      JUNTS: 7, PNV: 6, BILDU: 4, CCA: 2, COMPROMIS: 1, PRC: 1
    }
  },
  "2016": {
    year: "2016",
    name: "Elecciones Generales 2016",
    date: "26 de junio de 2016",
    totalVotes: 24161083,
    participation: 66.48,
    circumscriptions: [],
    nationalResults: {
      PP: 137, PSOE: 85, UP: 71, Cs: 32, ERC: 9, CDC: 8,
      PNV: 5, BILDU: 2, CCA: 1, 
    }
  },
  "2015": {
    year: "2015",
    name: "Elecciones Generales 2015",
    date: "20 de diciembre de 2015",
    totalVotes: 25349824,
    participation: 69.67,
    circumscriptions: [],
    nationalResults: {
      PP: 123, PSOE: 90, Podemos: 69, Cs: 40, ERC: 9, CDC: 8, 
      PNV: 6, UP: 2, BILDU: 2, CCA: 1
    }
  },
  "2011": {
    year: "2011",
    name: "Elecciones Generales 2011",
    date: "20 de noviembre de 2011",
    totalVotes: 24590557,
    participation: 68.94,
    circumscriptions: [],
    nationalResults: {
      PP: 186, PSOE: 110, CiU: 16, IU: 11, AMAIUR: 7, UPyD: 5,
      PNV: 5, ERC: 3, BNG: 2, CCA: 2, COMPROMIS: 1, FAC: 1, GBAI: 1
    }
  },
  "2008": {
    year: "2008",
    name: "Elecciones Generales 2008",
    date: "9 de marzo de 2008",
    totalVotes: 25900439,
    participation: 73.85,
    circumscriptions: [],
    nationalResults: {
      PSOE: 169, PP: 154, CiU: 10, PNV: 6, ERC: 3, IU: 2,
      BNG: 2, CCA: 2, UPyD: 1, NA: 1
    }
  },
  "2004": {
    year: "2004",
    name: "Elecciones Generales 2004",
    date: "14 de marzo de 2004",
    totalVotes: 26155436,
    participation: 75.66,
    circumscriptions: [],
    nationalResults: {
      PSOE: 164, PP: 148, CiU: 10, ERC: 8, PNV: 7, IU: 5,
      CCA: 3, BNG: 2, CHA: 1, EA: 1, NA: 1
    }
  },
};

// Votos nacionales por partido para cada elección (para simular)
export const nationalVotes: { [year: string]: { [party: string]: number } } = {
  "2023": {
    PP: 8160837, PSOE: 7821718, VOX: 3057000, SUMAR: 3044996,
    ERC: 466020, JUNTS: 395429, BILDU: 335129, PNV: 277289,
    BNG: 153995, CCA: 116363, UPN: 52188
  },
  "2019-N": {
    PSOE: 6792199, PP: 5047040, VOX: 3640417, UP: 2381960,
    ERC: 874859, Cs: 1637540, JUNTS: 527375, PNV: 379002,
    BILDU: 277621, MP: 341354, CUP: 244754, CCA: 123981,
    BNG: 120456, NA: 98448, PRC: 47432, TE: 47719
  },
  "2019-A": {
    PSOE: 7513142, PP: 4373653, Cs: 4155665, UP: 3732929,
    VOX: 2688092, ERC: 1020392, JUNTS: 500787, PNV: 395197,
    BILDU: 259647, CCA: 139083, COMPROMIS: 175614, PRC: 51688
  },
  "2016": {
    PP: 7941236, PSOE: 5443846, UP: 5087538, Cs: 3141570,
    ERC: 639652, CDC: 483488, PNV: 287014, BILDU: 184713, CCA: 78253
  },
  "2015": {
    PP: 7236965, PSOE: 5545315, Podemos: 5212711, Cs: 3514528,
    ERC: 601782, CDC: 565501, PNV: 302316, UP: 926783, 
    BILDU: 219181, CCA: 81917
  },
  "2011": {
    PP: 10866566, PSOE: 7003511, CiU: 1015691, IU: 1686040,
    AMAIUR: 334498, UPyD: 1143225, PNV: 324317, ERC: 256985,
    BNG: 184037, CCA: 143881, COMPROMIS: 125306, FAC: 99473, GBAI: 42415
  },
  "2008": {
    PSOE: 11289335, PP: 10278010, CiU: 779425, PNV: 306128,
    ERC: 291532, IU: 969946, BNG: 212543, CCA: 174629, 
    UPyD: 306079, NA: 62398
  },
  "2004": {
    PSOE: 11026163, PP: 9763144, CiU: 835471, ERC: 652196,
    PNV: 420980, IU: 1284081, CCA: 235221, BNG: 208688,
    CHA: 94252, EA: 80905, NA: 61045
  },
};

// Colores para partidos históricos
export const historicalParties: { [key: string]: { name: string; color: string } } = {
  ...parties,
  Cs: { name: "Ciudadanos", color: "#eb6109" },
  UP: { name: "Unidas Podemos", color: "#6a2c70" },
  Podemos: { name: "Podemos", color: "#6a2c70" },
  CiU: { name: "Convergència i Unió", color: "#003366" },
  CDC: { name: "Convergència", color: "#003366" },
  IU: { name: "Izquierda Unida", color: "#d40000" },
  UPyD: { name: "UPyD", color: "#e0147d" },
  AMAIUR: { name: "Amaiur", color: "#b5cf00" },
  MP: { name: "Más País", color: "#00a85a" },
  CUP: { name: "CUP", color: "#ffed00" },
  NA: { name: "Navarra Suma / UPN", color: "#0070b8" },
  PRC: { name: "PRC", color: "#bfd730" },
  TE: { name: "Teruel Existe", color: "#147a3b" },
  COMPROMIS: { name: "Compromís", color: "#d25d10" },
  FAC: { name: "Foro Asturias", color: "#1a4b8c" },
  GBAI: { name: "Geroa Bai", color: "#6aab25" },
  EA: { name: "Eusko Alkartasuna", color: "#c00" },
  CHA: { name: "Chunta Aragonesista", color: "#008000" },
};

export function getElectionYears(): string[] {
  return Object.keys(historicalElections).sort().reverse();
}
