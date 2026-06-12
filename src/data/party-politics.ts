// ============================================================================
// party-politics.ts — Posturas históricas de pacto/investidura de cada partido
// con representación (en D'Hondt o biproporcional) entre 1993 y 2023.
//
// Cada partido lleva eras (RelationEra) con la postura ESPERABLE en una
// investidura liderada por el PSOE o por el PP en esa época, justificada con
// un precedente factual de una línea (investiduras, mociones de censura o
// pactos autonómicos). Posturas sin precedente nacional van marcadas como
// "(inferida)". Las claves son las canónicas del proyecto (party-aliases.ts).
//
// Matiz metodológico: la postura es la de un pacto alternativo plausible, no
// siempre el voto literal (p. ej. IU votó no a González en 1993 por la
// estrategia de Anguita, pero era el único socio plausible del PSOE → "si"
// con nota). Cuando el voto real ES el dato político relevante (Podemos 2015,
// PRC 2020), se respeta el voto literal.
// ============================================================================

export type Stance = "si" | "abstencion" | "no";

export interface RelationEra {
  years: string[]; // claves de elección a las que aplica ("1993", "2019-N"...)
  PSOE: Stance; // postura esperable en una investidura liderada por el PSOE
  PP: Stance; // ídem liderada por el PP
  note: string; // precedente factual de 1 línea que lo justifica
}

export interface PartyPolitics {
  name: string;
  orientation: "izquierda" | "centroizquierda" | "centro" | "centroderecha" | "derecha";
  ambito: "nacional" | "nacionalista" | "regionalista";
  relations: RelationEra[]; // cubre todos los años con escaños del partido
}

const ALL_YEARS = [
  "1993",
  "1996",
  "2000",
  "2004",
  "2008",
  "2011",
  "2015",
  "2016",
  "2019-A",
  "2019-N",
  "2023",
];

export const partyPolitics: { [party: string]: PartyPolitics } = {
  // ── Grandes partidos nacionales ──────────────────────────────────────────
  PSOE: {
    name: "Partido Socialista Obrero Español",
    orientation: "centroizquierda",
    ambito: "nacional",
    relations: [
      {
        years: ALL_YEARS,
        PSOE: "si",
        PP: "no",
        note: "Nunca ha investido a un candidato del PP; la abstención de 68 diputados (oct. 2016) fue una excepción forzada tras dos elecciones, con 15 díscolos votando no.",
      },
    ],
  },
  PP: {
    name: "Partido Popular",
    orientation: "centroderecha",
    ambito: "nacional",
    relations: [
      {
        years: ALL_YEARS,
        PSOE: "no",
        PP: "si",
        note: "Nunca ha apoyado una investidura del PSOE: votó no en todas (1993-2023).",
      },
    ],
  },

  // ── Izquierda nacional ───────────────────────────────────────────────────
  IU: {
    name: "Izquierda Unida",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["1993", "1996"],
        PSOE: "si",
        PP: "no",
        note: "Anguita votó no a la investidura de González (1993), pero IU era el único socio plausible del PSOE; pactable a la izquierda (matiz histórico).",
      },
      {
        years: ["2000"],
        PSOE: "si",
        PP: "no",
        note: "Acuerdo electoral PSOE-IU (pacto Almunia-Frutos, 2000).",
      },
      {
        years: ["2004", "2008"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Zapatero (2004); en 2008 se abstuvo.",
      },
      {
        years: ["2011", "2015"],
        PSOE: "si",
        PP: "no",
        note: "Socio preferente del PSOE; en mar. 2016 Garzón votó no a la investidura Sánchez-Cs por el pacto con Cs (matiz).",
      },
    ],
  },
  PODEMOS: {
    name: "Podemos",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["2015"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a la investidura Sánchez-Rivera (mar. 2016): vetaba el acuerdo con Cs y exigía una coalición de izquierdas; ese veto cruzado produjo el bloqueo real.",
      },
    ],
  },
  UP: {
    name: "Unidas Podemos",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["2016"],
        PSOE: "si",
        PP: "no",
        note: "Reclamaba un gobierno de coalición con el PSOE («a la valenciana», 2016); votó no a la investidura de Rajoy (oct. 2016).",
      },
      {
        years: ["2019-A"],
        PSOE: "abstencion",
        PP: "no",
        note: "Se abstuvo en la investidura fallida de jul. 2019 al romperse la negociación de la coalición con el PSOE.",
      },
      {
        years: ["2019-N"],
        PSOE: "si",
        PP: "no",
        note: "Firmó el primer gobierno de coalición con el PSOE y votó sí (ene. 2020).",
      },
    ],
  },
  SUMAR: {
    name: "Sumar",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["2023"],
        PSOE: "si",
        PP: "no",
        note: "Socio de coalición del Gobierno Sánchez: votó sí a su investidura (nov. 2023).",
      },
    ],
  },
  MASPAIS: {
    name: "Más País",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["2019-N"],
        PSOE: "si",
        PP: "no",
        note: "Errejón votó sí a la investidura de Sánchez (ene. 2020).",
      },
    ],
  },
  EQUO: {
    name: "EQUO",
    orientation: "izquierda",
    ambito: "nacional",
    relations: [
      {
        years: ["2011"],
        PSOE: "si",
        PP: "no",
        note: "Ecologismo de izquierdas sin precedente nacional propio; confluyó después con Podemos y Más País en el bloque del PSOE (inferida).",
      },
    ],
  },

  // ── Centro nacional ──────────────────────────────────────────────────────
  Cs: {
    name: "Ciudadanos",
    orientation: "centro",
    ambito: "nacional",
    relations: [
      {
        years: ["2015", "2016"],
        PSOE: "si",
        PP: "si",
        note: "Firmó el pacto Sánchez-Rivera (feb. 2016) y votó sí a su investidura fallida; invistió a Rajoy (oct. 2016) tras el acuerdo de 150 medidas.",
      },
      {
        years: ["2019-A", "2019-N"],
        PSOE: "no",
        PP: "si",
        note: "Veto de Rivera a Sánchez tras el 28-A: votó no en jul. 2019 y ene. 2020.",
      },
    ],
  },
  UPyD: {
    name: "Unión Progreso y Democracia",
    orientation: "centro",
    ambito: "nacional",
    relations: [
      {
        years: ["2008", "2011"],
        PSOE: "abstencion",
        PP: "abstencion",
        note: "Votó no a Zapatero (2008) y a Rajoy (2011), pero invistió al socialista Patxi López en Euskadi (2009) junto al PP; bisagra exigente: abstención (inferida).",
      },
    ],
  },
  CDS: {
    name: "Centro Democrático y Social",
    orientation: "centro",
    ambito: "nacional",
    relations: [
      {
        years: ["1993"],
        PSOE: "abstencion",
        PP: "abstencion",
        note: "Centrismo bisagra post-Suárez sin precedente de investidura nacional propio (inferida por orientación).",
      },
    ],
  },

  // ── Derecha nacional ─────────────────────────────────────────────────────
  VOX: {
    name: "Vox",
    orientation: "derecha",
    ambito: "nacional",
    relations: [
      {
        years: ["2019-A", "2019-N", "2023"],
        PSOE: "no",
        PP: "si",
        note: "Votó no a todas las investiduras de Sánchez y sí a la fallida de Feijóo (sep. 2023).",
      },
    ],
  },

  // ── Nacionalistas vascos y navarros ──────────────────────────────────────
  PNV: {
    name: "Partido Nacionalista Vasco",
    orientation: "centroderecha",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996"],
        PSOE: "si",
        PP: "si",
        note: "Invistió a González (1993, 181 síes) y a Aznar (1996).",
      },
      {
        years: ["2000"],
        PSOE: "abstencion",
        PP: "no",
        note: "Ruptura con Aznar tras el Pacto de Lizarra (1998): votó no a su investidura (2000).",
      },
      {
        years: ["2004", "2008"],
        PSOE: "abstencion",
        PP: "no",
        note: "Se abstuvo en las dos investiduras de Zapatero (2004 y 2008).",
      },
      {
        years: ["2011"],
        PSOE: "abstencion",
        PP: "abstencion",
        note: "Se abstuvo en la investidura de Rajoy (2011).",
      },
      {
        years: ["2015", "2016"],
        PSOE: "abstencion",
        PP: "no",
        note: "Votó no a la investidura Sánchez-Cs (mar. 2016) por el acuerdo con Cs y no a Rajoy (oct. 2016); en 2018 apoyó la moción de censura de Sánchez.",
      },
      {
        years: ["2019-A", "2019-N", "2023"],
        PSOE: "si",
        PP: "no",
        note: "Tras la moción de 2018, votó sí a las investiduras de Sánchez (ene. 2020 y nov. 2023); en jul. 2019 se abstuvo.",
      },
    ],
  },
  EA: {
    name: "Eusko Alkartasuna",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996", "2000"],
        PSOE: "abstencion",
        PP: "no",
        note: "Votó no a las investiduras de González (1993) y Aznar (1996, 2000), aunque cogobernaba Euskadi en coaliciones con PNV y PSE; postura de pacto: abstención.",
      },
      {
        years: ["2004"],
        PSOE: "abstencion",
        PP: "no",
        note: "Se abstuvo en la investidura de Zapatero (2004).",
      },
    ],
  },
  HB: {
    name: "Herri Batasuna",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996"],
        PSOE: "no",
        PP: "no",
        note: "No participaba: sus diputados no acudían a las investiduras (ausentes en 1993 y 1996).",
      },
    ],
  },
  BILDU: {
    name: "EH Bildu (Amaiur en 2011)",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2011"],
        PSOE: "no",
        PP: "no",
        note: "Amaiur no apoyaba a ningún partido estatal; se abstuvo en la investidura de Rajoy (2011) como gesto de no participación.",
      },
      {
        years: ["2015", "2016"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a la investidura Sánchez-Cs (mar. 2016) y a la de Rajoy (oct. 2016).",
      },
      {
        years: ["2019-A", "2019-N"],
        PSOE: "abstencion",
        PP: "no",
        note: "Se abstuvo en las investiduras de Sánchez (jul. 2019 y ene. 2020) para facilitarlas.",
      },
      {
        years: ["2023"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Sánchez (nov. 2023).",
      },
    ],
  },
  GBAI: {
    name: "Geroa Bai (Na-Bai hasta 2011)",
    orientation: "centroizquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2004", "2008"],
        PSOE: "abstencion",
        PP: "no",
        note: "Na-Bai (Uxue Barkos) se abstuvo en las dos investiduras de Zapatero (2004 y 2008).",
      },
      {
        years: ["2011"],
        PSOE: "abstencion",
        PP: "no",
        note: "Geroa Bai votó no a la investidura de Rajoy (2011); después fue socio habitual del PSN en Navarra.",
      },
    ],
  },
  UPN: {
    name: "Unión del Pueblo Navarro",
    orientation: "derecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["1993", "1996", "2000", "2004", "2008", "2011", "2015", "2023"],
        PSOE: "no",
        PP: "si",
        note: "Coaligada o aliada con el PP en todas las generales desde 1989 (con ruptura puntual 2008-2011 por los presupuestos); su diputado votó sí a Feijóo y no a Sánchez (2023).",
      },
    ],
  },
  "NA+": {
    name: "Navarra Suma",
    orientation: "derecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["2019-A", "2019-N"],
        PSOE: "no",
        PP: "si",
        note: "Coalición UPN-PP-Cs: votó no a las investiduras de Sánchez de 2019 y 2020.",
      },
    ],
  },

  // ── Nacionalistas catalanes ──────────────────────────────────────────────
  CiU: {
    name: "Convergència i Unió",
    orientation: "centroderecha",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996"],
        PSOE: "si",
        PP: "si",
        note: "Invistió a González (1993) y a Aznar (1996, Pacto del Majestic).",
      },
      {
        years: ["2000"],
        PSOE: "abstencion",
        PP: "si",
        note: "Votó sí a la investidura de Aznar (2000) pese a su mayoría absoluta.",
      },
      {
        years: ["2004", "2008"],
        PSOE: "abstencion",
        PP: "abstencion",
        note: "Se abstuvo en las dos investiduras de Zapatero (2004 y 2008).",
      },
      {
        years: ["2011"],
        PSOE: "abstencion",
        PP: "no",
        note: "Votó no a la investidura de Rajoy (2011), aunque después apoyó sus primeros ajustes.",
      },
    ],
  },
  CDC: {
    name: "Convergència (DiL)",
    orientation: "centroderecha",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2015", "2016"],
        PSOE: "no",
        PP: "no",
        note: "DiL/CDC en pleno procés: votó no a la investidura Sánchez-Cs (mar. 2016) y a la de Rajoy (oct. 2016).",
      },
    ],
  },
  JUNTS: {
    name: "Junts per Catalunya",
    orientation: "centroderecha",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2019-A", "2019-N"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a las investiduras de Sánchez (jul. 2019 y ene. 2020).",
      },
      {
        years: ["2023"],
        PSOE: "si",
        PP: "no",
        note: "Acuerdo de Bruselas: votó sí a la investidura de Sánchez (nov. 2023) a cambio de la amnistía; no a Feijóo.",
      },
    ],
  },
  ERC: {
    name: "Esquerra Republicana de Catalunya",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996", "2000"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a la investidura de González (1993) y a las dos de Aznar (1996, 2000).",
      },
      {
        years: ["2004"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Zapatero (2004), en la estela del tripartito catalán.",
      },
      {
        years: ["2008"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a la investidura de Zapatero (2008) tras el recorte del Estatut.",
      },
      {
        years: ["2011", "2015", "2016"],
        PSOE: "no",
        PP: "no",
        note: "Años del procés: votó no a Rajoy (2011 y 2016) y a la investidura Sánchez-Cs (mar. 2016).",
      },
      {
        years: ["2019-A", "2019-N"],
        PSOE: "abstencion",
        PP: "no",
        note: "Su abstención pactada (ene. 2020) hizo presidente a Sánchez; en jul. 2019 pasó del no a la abstención.",
      },
      {
        years: ["2023"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Sánchez (nov. 2023) a cambio de la ley de amnistía.",
      },
    ],
  },
  CUP: {
    name: "Candidatura d'Unitat Popular",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2019-N", "2023"],
        PSOE: "no",
        PP: "no",
        note: "Votó no a la investidura de Sánchez (ene. 2020); no inviste presidentes españoles (2023 inferida: sin escaños).",
      },
    ],
  },
  "FRONT REPUB": {
    name: "Front Republicà",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2019-A"],
        PSOE: "no",
        PP: "no",
        note: "Frente independentista contrario a investir a cualquier presidente español (inferida: no obtuvo escaño).",
      },
    ],
  },
  "IC-V": {
    name: "Iniciativa per Catalunya Verds",
    orientation: "izquierda",
    ambito: "regionalista",
    relations: [
      {
        years: ["2000"],
        PSOE: "si",
        PP: "no",
        note: "Votó no a Aznar (2000); aliada estable del PSC en Cataluña (tripartito desde 2003).",
      },
    ],
  },

  // ── Otros nacionalistas y regionalistas ──────────────────────────────────
  BNG: {
    name: "Bloque Nacionalista Galego",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["1993", "1996", "2000"],
        PSOE: "abstencion",
        PP: "no",
        note: "Votó no a Aznar (1996 y 2000); aún sin precedente de apoyo al PSOE (abstención inferida).",
      },
      {
        years: ["2004"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Zapatero (2004).",
      },
      {
        years: ["2008", "2011"],
        PSOE: "abstencion",
        PP: "no",
        note: "Se abstuvo con Zapatero (2008) y votó no a Rajoy (2011).",
      },
      {
        years: ["2015", "2016"],
        PSOE: "abstencion",
        PP: "no",
        note: "Sin escaños en estas Cortes; izquierda nacionalista próxima al bloque del PSOE (inferida).",
      },
      {
        years: ["2019-A", "2019-N", "2023"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a las investiduras de Sánchez (ene. 2020 y nov. 2023).",
      },
    ],
  },
  CCA: {
    name: "Coalición Canaria",
    orientation: "centro",
    ambito: "regionalista",
    relations: [
      {
        years: ["1993"],
        PSOE: "no",
        PP: "si",
        note: "Votó no a la investidura de González (1993); tres años después invistió a Aznar (PP inferida del giro de 1996).",
      },
      {
        years: ["1996", "2000"],
        PSOE: "abstencion",
        PP: "si",
        note: "Invistió a Aznar en 1996 y en 2000.",
      },
      {
        years: ["2004"],
        PSOE: "si",
        PP: "si",
        note: "Votó sí a la investidura de Zapatero (2004); bisagra pactable con ambos.",
      },
      {
        years: ["2008"],
        PSOE: "abstencion",
        PP: "si",
        note: "Se abstuvo en la investidura de Zapatero (2008); con el PP, precedentes de 1996-2000 (inferida).",
      },
      {
        years: ["2011"],
        PSOE: "abstencion",
        PP: "abstencion",
        note: "Se abstuvo en la investidura de Rajoy (2011).",
      },
      {
        years: ["2015", "2016"],
        PSOE: "si",
        PP: "si",
        note: "Votó sí a Sánchez en la 2.ª votación fallida (mar. 2016) y sí a la investidura de Rajoy (oct. 2016).",
      },
      {
        years: ["2019-A"],
        PSOE: "no",
        PP: "si",
        note: "Oramas votó no a Sánchez en las dos votaciones de jul. 2019 (multada por su partido, que pedía abstención).",
      },
      {
        years: ["2019-N"],
        PSOE: "abstencion",
        PP: "si",
        note: "Voto dividido en ene. 2020: Oramas (CC) votó no, pero el diputado de NC dentro de la coalición votó sí (el 167.º); neto equivalente a una abstención, que era además la postura oficial del partido.",
      },
      {
        years: ["2023"],
        PSOE: "si",
        PP: "si",
        note: "Valido votó sí a la investidura fallida de Feijóo (sep. 2023) y también a la de Sánchez (nov. 2023) por la agenda canaria.",
      },
    ],
  },
  PRC: {
    name: "Partido Regionalista de Cantabria",
    orientation: "centro",
    ambito: "regionalista",
    relations: [
      {
        years: ["2019-A"],
        PSOE: "si",
        PP: "abstencion",
        note: "Mazón fue el único voto no socialista a favor de Sánchez en jul. 2019; con el PP gobernó Cantabria en coalición hasta 2003 (inferida).",
      },
      {
        years: ["2019-N"],
        PSOE: "no",
        PP: "abstencion",
        note: "Mazón votó no a la investidura (ene. 2020) en rechazo del pacto PSOE-ERC.",
      },
    ],
  },
  TERUEL: {
    name: "Teruel Existe",
    orientation: "centro",
    ambito: "regionalista",
    relations: [
      {
        years: ["2019-N"],
        PSOE: "si",
        PP: "abstencion",
        note: "Guitarte votó sí a la investidura de Sánchez (ene. 2020); con el PP, sin precedente (inferida).",
      },
    ],
  },
  COMPROMIS: {
    name: "Compromís",
    orientation: "izquierda",
    ambito: "nacionalista",
    relations: [
      {
        years: ["2011"],
        PSOE: "si",
        PP: "no",
        note: "Baldoví votó no a la investidura de Rajoy (2011); valencianismo de izquierdas, luego socio del PSPV en el Botànic (PSOE inferida).",
      },
      {
        years: ["2019-A", "2019-N"],
        PSOE: "si",
        PP: "no",
        note: "Se abstuvo en jul. 2019 y votó sí a la investidura de Sánchez (ene. 2020).",
      },
    ],
  },
  CHA: {
    name: "Chunta Aragonesista",
    orientation: "izquierda",
    ambito: "regionalista",
    relations: [
      {
        years: ["2000"],
        PSOE: "si",
        PP: "no",
        note: "Labordeta votó no a la investidura de Aznar (2000); izquierda aragonesista del bloque progresista (PSOE inferida).",
      },
      {
        years: ["2004"],
        PSOE: "si",
        PP: "no",
        note: "Votó sí a la investidura de Zapatero (2004).",
      },
    ],
  },
  PA: {
    name: "Partido Andalucista",
    orientation: "centroizquierda",
    ambito: "regionalista",
    relations: [
      {
        years: ["1993", "1996", "2000", "2004", "2011"],
        PSOE: "si",
        PP: "no",
        note: "Gobernó la Junta de Andalucía en coalición con el PSOE (1996-2004); votó no a Aznar (2000).",
      },
    ],
  },
  PAR: {
    name: "Partido Aragonés",
    orientation: "centroderecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["1993"],
        PSOE: "abstencion",
        PP: "si",
        note: "Se abstuvo en la investidura de González (1993); aliado después del PP en Aragón (gobierno Lanzuela, 1995-1999).",
      },
    ],
  },
  UV: {
    name: "Unió Valenciana",
    orientation: "derecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["1993", "1996"],
        PSOE: "no",
        PP: "si",
        note: "Votó no a González (1993) y se abstuvo con Aznar (1996); socia del PP en la Generalitat Valenciana (gobierno Zaplana, 1995).",
      },
    ],
  },
  FAC: {
    name: "Foro Asturias",
    orientation: "centroderecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["2011"],
        PSOE: "no",
        PP: "si",
        note: "Cascos (ex secretario general del PP) votó sí a la investidura de Rajoy (2011).",
      },
    ],
  },
  GIL: {
    name: "Grupo Independiente Liberal",
    orientation: "derecha",
    ambito: "regionalista",
    relations: [
      {
        years: ["2000"],
        PSOE: "no",
        PP: "abstencion",
        note: "Populismo de derechas sin precedente nacional; el PP rechazaba pactar con él en Ceuta y Melilla (inferida por orientación).",
      },
    ],
  },
};

// ============================================================================
// Fuentes principales:
// - Wikipedia (es): «V legislatura de España» … «XV legislatura de España»
//   (tablas de las votaciones de investidura de 1993, 1996, 2000, 2004, 2008,
//   2011, 2016, 2019 y 2020, con desglose por partido).
// - Wikipedia (es): «Moción de censura contra Mariano Rajoy de 2018».
// - Congreso de los Diputados (congreso.es): Diarios de Sesiones de los
//   debates de investidura.
// - Newtral (newtral.es): «El PSOE votó en contra de la investidura de Aznar
//   en 1996» (desglose 181-166-1, abstención de UV) y «Claves del acuerdo
//   PSOE-Coalición Canaria» (2023).
// - Orain.eus / La Moncloa: resultados de las votaciones de investidura de
//   julio de 2019 (124-170-52 y 124-155-67, con el desglose por partido).
// - Público: «Qué ha votado cada partido en la sesión de investidura de Pedro
//   Sánchez» (nov. 2023); El Independiente / EITB: votaciones de la
//   investidura fallida de Feijóo (sep. 2023, 172-178).
// ============================================================================
