// Índice de todas las elecciones con datos reales por circunscripción
// Fuente: Ministerio del Interior (infoelectoral.interior.gob.es)

import { CircunscripcionData } from "./elections2023";
import { circunscripciones as circunscripciones2023 } from "./elections2023";
import { circunscripciones2019N } from "./elections2019N";
import { circunscripciones2019A } from "./elections2019A";
import { circunscripciones2016 } from "./elections2016";
import { circunscripciones2027 } from "./elections2027";
import { circunscripciones2015 } from "./elections2015";
import { circunscripciones2011 } from "./elections2011";
import { circunscripciones2008 } from "./elections2008";
import { circunscripciones2004 } from "./elections2004";
import { circunscripciones2000 } from "./elections2000";
import { circunscripciones1996 } from "./elections1996";
import { circunscripciones1993 } from "./elections1993";

export interface ElectionMetadata {
  year: string;
  name: string;
  date: string;
  hasRealData: boolean;
}

export const electionMetadata: { [key: string]: ElectionMetadata } = {
  "2027*": {
    year: "2027*",
    name: "Proyección 2027 *",
    date: "Encuestas Feb 2026",
    hasRealData: false,
  },
  "2023": {
    year: "2023",
    name: "Elecciones Generales 23-J",
    date: "23 de julio de 2023",
    hasRealData: true,
  },
  "2019-N": {
    year: "2019-N",
    name: "Elecciones Generales 10-N",
    date: "10 de noviembre de 2019",
    hasRealData: true,
  },
  "2019-A": {
    year: "2019-A",
    name: "Elecciones Generales 28-A",
    date: "28 de abril de 2019",
    hasRealData: true,
  },
  "2016": {
    year: "2016",
    name: "Elecciones Generales 2016",
    date: "26 de junio de 2016",
    hasRealData: true,
  },
  "2015": {
    year: "2015",
    name: "Elecciones Generales 20-D",
    date: "20 de diciembre de 2015",
    hasRealData: true,
  },
  "2011": {
    year: "2011",
    name: "Elecciones Generales 20-N",
    date: "20 de noviembre de 2011",
    hasRealData: true,
  },
  "2008": {
    year: "2008",
    name: "Elecciones Generales 2008",
    date: "9 de marzo de 2008",
    hasRealData: true,
  },
  "2004": {
    year: "2004",
    name: "Elecciones Generales 2004",
    date: "14 de marzo de 2004",
    hasRealData: true,
  },
  "2000": {
    year: "2000",
    name: "Elecciones Generales 2000",
    date: "12 de marzo de 2000",
    hasRealData: true,
  },
  "1996": {
    year: "1996",
    name: "Elecciones Generales 1996",
    date: "3 de marzo de 1996",
    hasRealData: true,
  },
  "1993": {
    year: "1993",
    name: "Elecciones Generales 1993",
    date: "6 de junio de 1993",
    hasRealData: true,
  },
};

export const electionData: { [key: string]: CircunscripcionData[] } = {
  "2027*": circunscripciones2027,
  "2023": circunscripciones2023,
  "2019-N": circunscripciones2019N,
  "2019-A": circunscripciones2019A,
  "2016": circunscripciones2016,
  "2015": circunscripciones2015,
  "2011": circunscripciones2011,
  "2008": circunscripciones2008,
  "2004": circunscripciones2004,
  "2000": circunscripciones2000,
  "1996": circunscripciones1996,
  "1993": circunscripciones1993,
};

export function getElectionYears(): string[] {
  return Object.keys(electionMetadata);
}

export function getCircunscripciones(year: string): CircunscripcionData[] {
  return electionData[year] || circunscripciones2023;
}
