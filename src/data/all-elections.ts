// Índice de todas las elecciones con datos reales por circunscripción
// Generado automáticamente desde datos del Ministerio del Interior

import { CircunscripcionData } from "./elections2023";
import { circunscripciones as circunscripciones2023 } from "./elections2023";
import { circunscripciones2019N } from "./elections2019N";
import { circunscripciones2019A } from "./elections2019A";
import { circunscripciones2016 } from "./elections2016";
import { circunscripciones2027 } from "./elections2027";

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
};

export const electionData: { [key: string]: CircunscripcionData[] } = {
  "2027*": circunscripciones2027,
  "2023": circunscripciones2023,
  "2019-N": circunscripciones2019N,
  "2019-A": circunscripciones2019A,
  "2016": circunscripciones2016,
};

export function getElectionYears(): string[] {
  return Object.keys(electionMetadata);
}

export function getCircunscripciones(year: string): CircunscripcionData[] {
  return electionData[year] || circunscripciones2023;
}
