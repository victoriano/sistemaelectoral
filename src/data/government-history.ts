// ============================================================================
// government-history.ts — Qué Gobierno salió realmente de cada elección
// (1993-2023): resultado de la investidura que prosperó (o la repetición
// electoral), con la lista de partidos que votaron sí y las abstenciones
// relevantes, usando las claves canónicas del proyecto (party-aliases.ts).
//
// Nota sobre claves: UPN figura como sí en 1996, 2000 y 2011 porque en esas
// elecciones concurrió coaligada con el PP (sus escaños van bajo la clave UPN
// en nuestros datos, aunque el registro oficial los atribuye al PP). En 2011
// la clave BILDU corresponde a Amaiur.
// ============================================================================

export type GovernmentKind = "mayoria_absoluta" | "minoria" | "coalicion";

export interface GovernmentRecord {
  outcome: "gobierno" | "repeticion";
  pmParty?: string; // clave canónica del partido del presidente investido
  pm?: string;
  kind?: GovernmentKind;
  round?: 1 | 2; // votación en la que prosperó la investidura
  date?: string; // fecha de esa votación (ISO)
  yesParties?: string[]; // partidos (con escaños en nuestros datos) que votaron sí
  abstainParties?: string[]; // abstenciones relevantes
  note: string;
}

export const governmentHistory: { [year: string]: GovernmentRecord } = {
  "1993": {
    outcome: "gobierno",
    pmParty: "PSOE",
    pm: "Felipe González",
    kind: "minoria",
    round: 1,
    date: "1993-07-09",
    yesParties: ["PSOE", "CiU", "PNV"],
    abstainParties: ["PAR"],
    note: "González investido en 1.ª votación (181 sí, 165 no, 1 abst.): PSOE+CiU+PNV; IU, CC, ERC, EA y UV votaron no, el PAR se abstuvo y HB no acudió.",
  },
  "1996": {
    outcome: "gobierno",
    pmParty: "PP",
    pm: "José María Aznar",
    kind: "minoria",
    round: 1,
    date: "1996-05-04",
    yesParties: ["PP", "UPN", "CiU", "PNV", "CCA"],
    abstainParties: ["UV"],
    note: "Aznar investido en 1.ª votación (181 sí, 166 no, 1 abst.) tras los pactos con CiU (Majestic), PNV y CC; UV se abstuvo.",
  },
  "2000": {
    outcome: "gobierno",
    pmParty: "PP",
    pm: "José María Aznar",
    kind: "mayoria_absoluta",
    round: 1,
    date: "2000-04-26",
    yesParties: ["PP", "UPN", "CiU", "CCA"],
    abstainParties: [],
    note: "Mayoría absoluta del PP (183 escaños); aun así CiU y CC votaron sí: 202 sí frente a 148 no, sin abstenciones.",
  },
  "2004": {
    outcome: "gobierno",
    pmParty: "PSOE",
    pm: "José Luis Rodríguez Zapatero",
    kind: "minoria",
    round: 1,
    date: "2004-04-16",
    yesParties: ["PSOE", "ERC", "IU", "CCA", "BNG", "CHA"],
    abstainParties: ["CiU", "PNV", "EA", "GBAI"],
    note: "Zapatero investido en 1.ª votación (183 sí, 148 no, 19 abst.); solo el PP votó en contra.",
  },
  "2008": {
    outcome: "gobierno",
    pmParty: "PSOE",
    pm: "José Luis Rodríguez Zapatero",
    kind: "minoria",
    round: 2,
    date: "2008-04-11",
    yesParties: ["PSOE"],
    abstainParties: ["CiU", "PNV", "IU", "BNG", "CCA", "GBAI"],
    note: "Investido en 2.ª votación por mayoría simple (169 sí, 158 no, 23 abst.) solo con los votos del PSOE; PP, ERC y UPyD votaron no.",
  },
  "2011": {
    outcome: "gobierno",
    pmParty: "PP",
    pm: "Mariano Rajoy",
    kind: "mayoria_absoluta",
    round: 1,
    date: "2011-12-20",
    yesParties: ["PP", "UPN", "FAC"],
    abstainParties: ["PNV", "BILDU", "CCA"],
    note: "Rajoy investido en 1.ª votación (187 sí, 149 no, 14 abst.): PP-UPN más Foro Asturias; CiU votó no y PNV, Amaiur y CC se abstuvieron.",
  },
  "2015": {
    outcome: "repeticion",
    note: "Rajoy declinó presentarse; investidura fallida de Sánchez con Cs (y CC en la 2.ª votación): 130-219-1 y 131-219 (mar. 2016). Repetición electoral el 26-J.",
  },
  "2016": {
    outcome: "gobierno",
    pmParty: "PP",
    pm: "Mariano Rajoy",
    kind: "minoria",
    round: 2,
    date: "2016-10-29",
    yesParties: ["PP", "Cs", "CCA"],
    abstainParties: ["PSOE"],
    note: "Investido en 2.ª votación (170 sí, 111 no, 68 abst.) gracias a la abstención de 68 diputados del PSOE; 15 socialistas rompieron la disciplina y votaron no.",
  },
  "2019-A": {
    outcome: "repeticion",
    note: "Investidura fallida de Sánchez (jul. 2019): 124 sí (PSOE+PRC) frente a 170/155 no; UP, PNV, Bildu y Compromís se abstuvieron y ERC pasó del no a la abstención. Repetición el 10-N.",
  },
  "2019-N": {
    outcome: "gobierno",
    pmParty: "PSOE",
    pm: "Pedro Sánchez",
    kind: "coalicion",
    round: 2,
    date: "2020-01-07",
    yesParties: ["PSOE", "UP", "PNV", "MASPAIS", "COMPROMIS", "BNG", "TERUEL"],
    abstainParties: ["ERC", "BILDU"],
    note: "Primera coalición (PSOE-UP), investido en 2.ª votación por 167 sí frente a 165 no (18 abst. de ERC y Bildu); el escaño de NC dentro de CCA votó sí (el 167.º), pero Oramas (CC) y el PRC votaron no.",
  },
  "2023": {
    outcome: "gobierno",
    pmParty: "PSOE",
    pm: "Pedro Sánchez",
    kind: "coalicion",
    round: 1,
    date: "2023-11-16",
    yesParties: ["PSOE", "SUMAR", "ERC", "JUNTS", "BILDU", "PNV", "BNG", "CCA"],
    abstainParties: [],
    note: "Investido en 1.ª votación (179 sí, 171 no) tras los acuerdos de amnistía con ERC y Junts; CC votó sí por la agenda canaria tras haber votado también sí a la investidura fallida de Feijóo (172-178, sep. 2023).",
  },
};

// ============================================================================
// Fuentes principales:
// - Wikipedia (es): «V legislatura de España» … «XV legislatura de España»
//   (resultados y desglose por partido de cada votación de investidura).
// - Congreso de los Diputados (congreso.es): Diarios de Sesiones.
// - Newtral: votación de 1996 (181-166-1, abstención de UV).
// - La Moncloa / Orain.eus: investidura fallida de jul. 2019 (124-170-52 y
//   124-155-67).
// - EITB / La Moncloa / Statista: investidura del 7 de enero de 2020
//   (167-165-18, con el desglose por partido).
// - Público / elEconomista / eldiario.es: investidura de nov. 2023 (179-171)
//   y acuerdo PSOE-CC; El Independiente: investidura fallida de Feijóo
//   (172-178, sep. 2023).
// ============================================================================
