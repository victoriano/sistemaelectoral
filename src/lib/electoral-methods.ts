/**
 * Implementación de métodos electorales proporcionales
 * 
 * Incluye:
 * - Método D'Hondt tradicional (por circunscripción)
 * - Método Biproporcional (GIME - Grupo de Investigación en Métodos Electorales)
 */

export interface VoteData {
  [party: string]: number;
}

/**
 * Datos de una circunscripción para el reparto.
 *
 * `blankVotes` (opcional, default 0): votos en blanco de la circunscripción.
 * Según LOREG art. 163.1.a, los votos válidos = votos a candidaturas + votos
 * en blanco, y la barrera electoral se calcula sobre los votos VÁLIDOS.
 * Mientras los datos no incluyan blancos, el comportamiento es idéntico al
 * anterior (denominador = votos a candidaturas).
 */
export interface CircumscriptionVotes {
  name: string;
  seats: number;
  votes: VoteData;
  blankVotes?: number;
}

export interface CircumscriptionResult {
  name: string;
  seats: number;
  allocation: { [party: string]: number };
  quotients?: { party: string; quotient: number; seat: number }[];
}

export interface GIMEStageResult {
  stage: number;
  description: string;
  nationalAllocation: { [party: string]: number };
  circumscriptionAllocations?: CircumscriptionResult[];
  iterations?: number;
  converged?: boolean;
}

// ==========================================
// MÉTODO D'HONDT TRADICIONAL
// ==========================================

/**
 * Método D'Hondt: reparte escaños dividiendo votos por 1, 2, 3...
 * y asignando escaños a los mayores cocientes
 */
export function dHondt(
  votes: VoteData,
  seats: number,
  threshold: number = 0.03,
  blankVotes: number = 0
): { allocation: { [party: string]: number }; quotients: { party: string; quotient: number; seat: number }[] } {
  // Filtrar por umbral (barrera electoral).
  // LOREG 163.1.a: la barrera se aplica sobre los votos VÁLIDOS
  // (candidaturas + blancos), no solo sobre los votos a candidaturas.
  const candidacyVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const validVotes = candidacyVotes + blankVotes;
  let validParties = Object.entries(votes)
    .filter(([_, v]) => validVotes > 0 && v / validVotes >= threshold)
    .map(([party, _]) => party);

  // Salvaguarda: si ningún partido supera la barrera (posible con umbrales
  // altos, p.ej. 10% en el simulador), los escaños NO se pierden: se reparten
  // entre todas las candidaturas con votos. Elección documentada: es el
  // comportamiento menos sorprendente y mantiene el total de escaños.
  if (validParties.length === 0) {
    validParties = Object.entries(votes)
      .filter(([_, v]) => v > 0)
      .map(([party, _]) => party);
  }

  const allocation: { [party: string]: number } = {};
  const quotients: { party: string; quotient: number; seat: number }[] = [];

  // Inicializar
  for (const party of Object.keys(votes)) {
    allocation[party] = 0;
  }

  // Asignar escaños uno a uno
  for (let seat = 1; seat <= seats; seat++) {
    let winner = "";

    for (const party of validParties) {
      if (!winner) {
        winner = party;
        continue;
      }
      // Comparación exacta de cocientes por producto cruzado (aritmética
      // entera, sin errores de coma flotante):
      //   votes[party]/(alloc[party]+1)  vs  votes[winner]/(alloc[winner]+1)
      const vA = votes[party];
      const dA = allocation[party] + 1;
      const vB = votes[winner];
      const dB = allocation[winner] + 1;
      const cmp = vA * dB - vB * dA;
      // Desempate LOREG 163.1.d: a igualdad de cociente, el escaño va al
      // partido con MÁS votos totales en la circunscripción. Si además
      // empatan en votos, la LOREG prevé sorteo (el primero) y alternancia;
      // aquí usamos una regla determinista documentada: gana el primer
      // partido en el orden estable de entrada de los datos.
      if (cmp > 0 || (cmp === 0 && vA > vB)) {
        winner = party;
      }
    }

    if (winner) {
      allocation[winner]++;
      quotients.push({ party: winner, quotient: votes[winner] / allocation[winner], seat });
    }
  }

  return { allocation, quotients };
}

/**
 * D'Hondt aplicado circunscripción por circunscripción (sistema actual español)
 */
export function dHondtByCircumscription(
  circumscriptions: CircumscriptionVotes[],
  threshold: number = 0.03
): { results: CircumscriptionResult[]; national: { [party: string]: number } } {
  const results: CircumscriptionResult[] = [];
  const national: { [party: string]: number } = {};

  for (const circ of circumscriptions) {
    const { allocation, quotients } = dHondt(circ.votes, circ.seats, threshold, circ.blankVotes ?? 0);
    results.push({
      name: circ.name,
      seats: circ.seats,
      allocation,
      quotients
    });
    
    // Acumular totales nacionales
    for (const [party, seats] of Object.entries(allocation)) {
      national[party] = (national[party] || 0) + seats;
    }
  }
  
  return { results, national };
}

// ==========================================
// MÉTODO BIPROPORCIONAL (GIME)
// ==========================================

/**
 * Cuórum de elegibilidad del método biproporcional (estilo Zúrich):
 * un partido es elegible para el reparto nacional de la Etapa 1 si alcanza
 * la barrera (default 3%) de los votos VÁLIDOS (candidaturas + blancos,
 * LOREG 163.1.a) en AL MENOS UNA circunscripción. Los partidos elegibles
 * compiten después a nivel nacional con TODOS sus votos.
 *
 * NOTA: la barrera NO se aplica sobre el total nacional de votos — eso era
 * el bug corregido (ver docs/goals/auditoria-simulaciones/notes/T003).
 */
export function getBiproportionalEligibleParties(
  circumscriptions: CircumscriptionVotes[],
  threshold: number = 0.03
): string[] {
  const eligible = new Set<string>();
  for (const circ of circumscriptions) {
    const candidacyVotes = Object.values(circ.votes).reduce((a, b) => a + b, 0);
    const validVotes = candidacyVotes + (circ.blankVotes ?? 0);
    if (validVotes <= 0) continue;
    for (const [party, v] of Object.entries(circ.votes)) {
      if (v / validVotes >= threshold) {
        eligible.add(party);
      }
    }
  }
  return Array.from(eligible);
}

/**
 * ETAPA 1: Reparto proporcional nacional
 * Calcula los escaños que corresponden a cada partido a nivel nacional
 * usando D'Hondt sobre el total de votos, restringido a los partidos
 * elegibles según el cuórum por circunscripción
 * (ver getBiproportionalEligibleParties).
 */
export function gimeStage1(
  nationalVotes: VoteData,
  totalSeats: number,
  eligibleParties: string[]
): GIMEStageResult {
  // Solo compiten los partidos elegibles, pero con TODOS sus votos
  // nacionales. Sin barrera adicional (threshold 0): la elegibilidad
  // ya se decidió circunscripción a circunscripción.
  const eligibleVotes: VoteData = {};
  for (const party of eligibleParties) {
    if ((nationalVotes[party] || 0) > 0) {
      eligibleVotes[party] = nationalVotes[party];
    }
  }

  const { allocation } = dHondt(eligibleVotes, totalSeats, 0);

  return {
    stage: 1,
    description: "Reparto proporcional nacional: escaños asignados proporcionalmente a votos nacionales usando D'Hondt entre los partidos que superan la barrera en al menos una circunscripción",
    nationalAllocation: allocation
  };
}

/**
 * Reparto de `target` escaños entre entidades mediante el método de
 * Webster/Sainte-Laguë (redondeo estándar), por selección de cocientes:
 * los cocientes son value/(s - 0.5) para s = 1, 2, 3...; se asignan los
 * `target` mayores. Equivale a elegir un divisor d tal que
 * sum(round(value/d)) == target.
 *
 * Desempate determinista cuando varios cocientes coinciden exactamente:
 * gana la celda con MÁS votos brutos; si también empatan, el orden
 * estable de entrada (índice menor).
 *
 * Devuelve la asignación y un divisor d compatible con ella
 * (round(value[k]/d) == alloc[k] salvo empate exacto en la frontera,
 * que se resuelve con la regla anterior).
 */
function websterSelect(
  values: number[],
  rawVotes: number[],
  target: number
): { alloc: number[]; divisor: number } {
  const n = values.length;
  const alloc = new Array(n).fill(0);

  // Cocientes: por cada entidad con valor positivo, target+1 cocientes
  // bastan (nadie puede recibir más de `target` escaños y necesitamos
  // conocer el primer cociente excluido para fijar el divisor).
  const quotients: { q: number; k: number; v: number }[] = [];
  for (let k = 0; k < n; k++) {
    if (values[k] <= 0) continue;
    for (let s = 1; s <= target + 1; s++) {
      quotients.push({ q: values[k] / (s - 0.5), k, v: rawVotes[k] });
    }
  }

  if (quotients.length === 0) {
    // Sin votos positivos: imposible asignar (el llamante lo detecta
    // porque la suma de la fila/columna no alcanzará su objetivo).
    return { alloc, divisor: 1 };
  }

  quotients.sort((a, b) => {
    if (b.q !== a.q) return b.q - a.q;
    if (b.v !== a.v) return b.v - a.v; // empate: más votos en la celda
    return a.k - b.k;                  // empate total: orden estable
  });

  if (target === 0) {
    // Cualquier divisor mayor que el cociente máximo da 0 en todas.
    return { alloc, divisor: quotients[0].q * 2 };
  }

  for (let t = 0; t < target && t < quotients.length; t++) {
    alloc[quotients[t].k]++;
  }

  // Divisor entre el último cociente aceptado y el primero rechazado.
  const qIn = quotients[Math.min(target, quotients.length) - 1].q;
  const qOut = target < quotients.length ? quotients[target].q : 0;
  const divisor = qIn > qOut ? (qIn + qOut) / 2 : qIn;
  return { alloc, divisor };
}

/**
 * ETAPA 2: Reparto biproporcional (método de Zúrich / Pukelsheim).
 *
 * Distribuye los escaños de cada partido entre las circunscripciones
 * manteniendo a la vez los totales por partido (de la Etapa 1) y los
 * totales por circunscripción.
 *
 * Algoritmo: escalado alternante sobre divisores (iterative proportional
 * fitting). Se mantienen divisores continuos por fila (circunscripción)
 * y por columna (partido), de modo que
 *   asignación[i][j] = round(votos[i][j] / (rowDiv[i] * colDiv[j]))
 * con redondeo estándar (signpost de Webster/Sainte-Laguë, el usado en
 * Zúrich). En cada pasada se reajustan primero los divisores de fila
 * para que cada circunscripción sume exactamente sus escaños, y después
 * los de columna para que cada partido sume sus escaños nacionales; se
 * repite hasta que ambos marginales se cumplen a la vez.
 *
 * Los partidos sin escaños nacionales (no elegibles) quedan a cero en
 * todas las circunscripciones. Si no converge en `maxIterations`
 * alternancias, se devuelve converged=false con la última matriz cuyas
 * FILAS suman correcto (las filas se imponen en último lugar).
 */
export function gimeStage2(
  circumscriptions: CircumscriptionVotes[],
  nationalAllocation: { [party: string]: number },
  maxIterations: number = 1000
): GIMEStageResult {
  const parties = Object.keys(nationalAllocation).filter(p => nationalAllocation[p] > 0);
  const n = circumscriptions.length;
  const m = parties.length;

  // Matriz de votos (filas = circunscripciones, columnas = partidos)
  const votes: number[][] = circumscriptions.map(c =>
    parties.map(p => c.votes[p] || 0)
  );

  const rowDiv: number[] = new Array(n).fill(1);
  const colDiv: number[] = new Array(m).fill(1);
  let allocation: number[][] = circumscriptions.map(() => new Array(m).fill(0));

  const fitRows = () => {
    for (let i = 0; i < n; i++) {
      const adjusted = parties.map((_, j) => votes[i][j] / colDiv[j]);
      const { alloc, divisor } = websterSelect(adjusted, votes[i], circumscriptions[i].seats);
      allocation[i] = alloc;
      rowDiv[i] = divisor;
    }
  };

  const fitCols = () => {
    for (let j = 0; j < m; j++) {
      const adjusted = circumscriptions.map((_, i) => votes[i][j] / rowDiv[i]);
      const raw = circumscriptions.map((_, i) => votes[i][j]);
      const { alloc, divisor } = websterSelect(adjusted, raw, nationalAllocation[parties[j]]);
      for (let i = 0; i < n; i++) allocation[i][j] = alloc[i];
      colDiv[j] = divisor;
    }
  };

  const colsOk = () => {
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += allocation[i][j];
      if (sum !== nationalAllocation[parties[j]]) return false;
    }
    return true;
  };

  const rowsOk = () => {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < m; j++) sum += allocation[i][j];
      if (sum !== circumscriptions[i].seats) return false;
    }
    return true;
  };

  let iterations = 0;
  let converged = false;

  while (iterations < maxIterations) {
    iterations++;

    // Pasada de filas: cada circunscripción suma exactamente sus escaños.
    fitRows();
    if (colsOk()) { converged = true; break; }

    // Pasada de columnas: cada partido suma sus escaños nacionales.
    fitCols();
    if (rowsOk()) { converged = true; break; }
  }

  // Sin convergencia: imponer las filas en último lugar para que al menos
  // los totales por circunscripción sean correctos.
  if (!converged) {
    fitRows();
  }

  // Convertir a formato de resultado
  const circumscriptionAllocations: CircumscriptionResult[] = circumscriptions.map((circ, i) => ({
    name: circ.name,
    seats: circ.seats,
    allocation: parties.reduce((obj, party, j) => {
      if (allocation[i][j] > 0) {
        obj[party] = allocation[i][j];
      }
      return obj;
    }, {} as { [party: string]: number })
  }));

  return {
    stage: 2,
    description: "Reparto biproporcional (Zúrich/Pukelsheim): escalado alternante de divisores con redondeo estándar (Webster/Sainte-Laguë) que satisface a la vez los totales por partido y por circunscripción",
    nationalAllocation,
    circumscriptionAllocations,
    iterations,
    converged
  };
}

/**
 * ETAPA 3 (opcional): Ajuste de gobernabilidad.
 *
 * El partido ganador recibe EXACTAMENTE +bonus escaños; las reducciones
 * del resto suman exactamente el bonus, de modo que el total sigue siendo
 * exactamente el mismo (350).
 *
 * Reglas documentadas:
 * - Ganador: el partido con más escaños nacionales tras la Etapa 2.
 *   Desempate: más votos nacionales; si también empatan, orden estable
 *   de entrada de los datos.
 * - Reparto de las reducciones: método de restos mayores (Hamilton)
 *   proporcional a los escaños de cada partido (cuota =
 *   escaños·bonus/escañosResto; se asigna floor(cuota) y los escaños de
 *   reducción restantes van a los mayores restos fraccionarios; desempate
 *   de restos: pierde el escaño extra el partido con MÁS escaños, después
 *   orden estable). Garantiza sum(reducciones) == bonus y ningún partido
 *   queda por debajo de 0 (la cuota nunca supera los escaños del partido).
 * - Clamp: si el bonus pedido supera los escaños retirables (la suma de
 *   escaños del resto de partidos), se recorta a ese máximo y la
 *   descripción lo indica.
 * - bonus == 0: se devuelve el resultado de la Etapa 2 sin cambios.
 *
 * Coherencia provincial: si se pasan las circunscripciones, tras ajustar
 * los objetivos nacionales se RE-EJECUTA el ajuste biproporcional de la
 * Etapa 2 con los nuevos totales por partido, de modo que las tablas
 * provinciales suman exactamente los totales nacionales post-bonus.
 * iterations/converged reflejan ese re-ajuste. Si no se pasan las
 * circunscripciones, NO se devuelven tablas provinciales (las de la
 * Etapa 2 ya no serían coherentes con los totales post-bonus).
 */
export function gimeStage3(
  stage2Result: GIMEStageResult,
  governabilityBonus: number = 0, // Escaños extra para el ganador (0 = sin ajuste)
  circumscriptions?: CircumscriptionVotes[]
): GIMEStageResult {
  if (governabilityBonus === 0) {
    return stage2Result;
  }

  const allocation = { ...stage2Result.nationalAllocation };

  // Votos nacionales (para el desempate del ganador), si hay datos.
  const nationalVotes: VoteData = {};
  if (circumscriptions) {
    for (const circ of circumscriptions) {
      for (const [party, v] of Object.entries(circ.votes)) {
        nationalVotes[party] = (nationalVotes[party] || 0) + v;
      }
    }
  }

  // Ganador: más escaños; desempate por más votos nacionales; después
  // orden estable de entrada.
  let winner = "";
  for (const party of Object.keys(allocation)) {
    if (!winner) {
      winner = party;
      continue;
    }
    const sA = allocation[party];
    const sB = allocation[winner];
    if (sA > sB || (sA === sB && (nationalVotes[party] || 0) > (nationalVotes[winner] || 0))) {
      winner = party;
    }
  }

  const others = Object.keys(allocation).filter(p => p !== winner && allocation[p] > 0);
  const totalOthers = others.reduce((sum, p) => sum + allocation[p], 0);

  // Clamp documentado: no se pueden retirar más escaños de los que tiene
  // el resto de partidos.
  const bonus = Math.min(governabilityBonus, totalOthers);

  // Reducciones por restos mayores proporcionales a escaños.
  const reductions: { [party: string]: number } = {};
  let assigned = 0;
  const remainders: { party: string; r: number; seats: number }[] = [];
  for (const party of others) {
    const quota = (allocation[party] / totalOthers) * bonus;
    const floor = Math.floor(quota);
    reductions[party] = floor;
    assigned += floor;
    remainders.push({ party, r: quota - floor, seats: allocation[party] });
  }
  remainders.sort((a, b) => {
    if (b.r !== a.r) return b.r - a.r;        // mayor resto pierde primero
    return b.seats - a.seats;                  // empate: pierde el más grande
  });
  let remaining = bonus - assigned;
  for (const entry of remainders) {
    if (remaining <= 0) break;
    if (reductions[entry.party] + 1 <= allocation[entry.party]) {
      reductions[entry.party]++;
      remaining--;
    }
  }
  // Salvaguarda (no alcanzable matemáticamente: cuota <= escaños y los
  // restos positivos siempre admiten +1): si quedara algo por retirar,
  // se quita de los partidos con más escaños disponibles.
  while (remaining > 0) {
    const candidate = others
      .filter(p => reductions[p] < allocation[p])
      .sort((a, b) => (allocation[b] - reductions[b]) - (allocation[a] - reductions[a]))[0];
    if (!candidate) break;
    reductions[candidate]++;
    remaining--;
  }

  for (const party of others) {
    allocation[party] -= reductions[party];
  }
  allocation[winner] += bonus;

  const clampNote = bonus < governabilityBonus
    ? ` (bonus recortado de ${governabilityBonus} a ${bonus}: máximo retirable del resto de partidos)`
    : "";
  const description =
    `Ajuste de gobernabilidad: +${bonus} escaños al partido ganador (${winner}), ` +
    `retirados del resto por restos mayores proporcionales a sus escaños${clampNote}; ` +
    `reparto provincial recalculado biproporcionalmente con los totales post-bonus`;

  // Re-ejecutar la Etapa 2 con los objetivos nacionales post-bonus para
  // que las tablas provinciales cuadren con los totales nacionales.
  if (circumscriptions) {
    const refit = gimeStage2(circumscriptions, allocation);
    return {
      stage: 3,
      description,
      nationalAllocation: allocation,
      circumscriptionAllocations: refit.circumscriptionAllocations,
      iterations: refit.iterations,
      converged: refit.converged
    };
  }

  // Sin circunscripciones no hay tablas provinciales coherentes que devolver.
  return {
    stage: 3,
    description,
    nationalAllocation: allocation
  };
}

/**
 * Ejecuta el método biproporcional completo
 */
export function runGIME(
  circumscriptions: CircumscriptionVotes[],
  totalSeats: number,
  governabilityBonus: number = 0,
  threshold: number = 0.03
): GIMEStageResult[] {
  // Calcular votos nacionales
  const nationalVotes: VoteData = {};
  for (const circ of circumscriptions) {
    for (const [party, votes] of Object.entries(circ.votes)) {
      nationalVotes[party] = (nationalVotes[party] || 0) + votes;
    }
  }

  // Cuórum de elegibilidad: barrera en al menos una circunscripción
  let eligibleParties = getBiproportionalEligibleParties(circumscriptions, threshold);

  // Salvaguarda: con umbrales extremos, si ningún partido fuera elegible,
  // los 350 escaños no pueden perderse: compiten todas las candidaturas.
  if (eligibleParties.length === 0) {
    eligibleParties = Object.keys(nationalVotes).filter(p => nationalVotes[p] > 0);
  }

  // Etapa 1
  const stage1 = gimeStage1(nationalVotes, totalSeats, eligibleParties);
  
  // Etapa 2
  const stage2 = gimeStage2(circumscriptions, stage1.nationalAllocation);
  
  // Etapa 3 (si aplica)
  const stages = [stage1, stage2];
  if (governabilityBonus > 0) {
    stages.push(gimeStage3(stage2, governabilityBonus, circumscriptions));
  }
  
  return stages;
}

// ==========================================
// COMPARATIVA Y MÉTRICAS
// ==========================================

/**
 * Calcula el índice de desproporcionalidad de Gallagher
 */
export function gallagherIndex(
  votes: VoteData,
  seats: { [party: string]: number }
): number {
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const totalSeats = Object.values(seats).reduce((a, b) => a + b, 0);
  
  let sumSquares = 0;
  const allParties = Array.from(new Set([...Object.keys(votes), ...Object.keys(seats)]));

  for (const party of allParties) {
    const voteShare = ((votes[party] || 0) / totalVotes) * 100;
    const seatShare = ((seats[party] || 0) / totalSeats) * 100;
    sumSquares += Math.pow(voteShare - seatShare, 2);
  }
  
  return Math.sqrt(sumSquares / 2);
}

/**
 * Calcula los votos "en restos" (wasted votes) por circunscripción.
 * Para D'Hondt: votos de partidos que obtuvieron 0 escaños en cada circunscripción.
 * Estos son los votos que literalmente no eligieron a nadie.
 */
export function calculateWastedVotesCirc(
  circumscriptions: CircumscriptionVotes[],
  circumscriptionResults: CircumscriptionResult[]
): { byParty: { [party: string]: number }; total: number; totalVotes: number } {
  const wasted: { [party: string]: number } = {};
  let totalVotesSum = 0;

  circumscriptions.forEach((circ, i) => {
    const result = circumscriptionResults[i];
    if (!result) return;
    Object.entries(circ.votes).forEach(([party, votes]) => {
      totalVotesSum += votes;
      if (votes > 0 && (result.allocation[party] || 0) === 0) {
        wasted[party] = (wasted[party] || 0) + votes;
      }
    });
  });

  const total = Object.values(wasted).reduce((a, b) => a + b, 0);
  return { byParty: wasted, total, totalVotes: totalVotesSum };
}

/**
 * Calcula los votos "en restos" para el método Biproporcional.
 * Usa la misma lógica por circunscripción, pero excluye partidos que tienen
 * escaños a nivel nacional, ya que en el sistema biproporcional sus votos
 * cuentan nacionalmente aunque no obtengan escaño en esa circunscripción.
 */
export function calculateWastedVotesBiprop(
  circumscriptions: CircumscriptionVotes[],
  circumscriptionResults: CircumscriptionResult[],
  nationalSeats: { [party: string]: number }
): { byParty: { [party: string]: number }; total: number; totalVotes: number } {
  const wasted: { [party: string]: number } = {};
  let totalVotesSum = 0;

  circumscriptions.forEach((circ, i) => {
    const result = circumscriptionResults[i];
    if (!result) return;
    Object.entries(circ.votes).forEach(([party, votes]) => {
      totalVotesSum += votes;
      if (votes > 0 && (result.allocation[party] || 0) === 0 && (nationalSeats[party] || 0) === 0) {
        wasted[party] = (wasted[party] || 0) + votes;
      }
    });
  });

  const total = Object.values(wasted).reduce((a, b) => a + b, 0);
  return { byParty: wasted, total, totalVotes: totalVotesSum };
}

/**
 * Calcula la diferencia entre dos asignaciones
 */
export function compareAllocations(
  allocation1: { [party: string]: number },
  allocation2: { [party: string]: number }
): { party: string; diff: number; method1: number; method2: number }[] {
  const allParties = Array.from(new Set([...Object.keys(allocation1), ...Object.keys(allocation2)]));
  const comparison = [];

  for (const party of allParties) {
    const seats1 = allocation1[party] || 0;
    const seats2 = allocation2[party] || 0;
    comparison.push({
      party,
      diff: seats2 - seats1,
      method1: seats1,
      method2: seats2
    });
  }
  
  return comparison.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}
