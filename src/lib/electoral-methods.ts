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
}

type CircumscriptionVotes = { name: string; seats: number; votes: VoteData };

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
  threshold: number = 0.03
): { allocation: { [party: string]: number }; quotients: { party: string; quotient: number; seat: number }[] } {
  // Filtrar por umbral (barrera electoral)
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const validParties = Object.entries(votes)
    .filter(([_, v]) => v / totalVotes >= threshold)
    .map(([party, _]) => party);
  
  const allocation: { [party: string]: number } = {};
  const quotients: { party: string; quotient: number; seat: number }[] = [];
  
  // Inicializar
  for (const party of Object.keys(votes)) {
    allocation[party] = 0;
  }
  
  // Asignar escaños uno a uno
  for (let seat = 1; seat <= seats; seat++) {
    let maxQuotient = -1;
    let winner = "";
    
    for (const party of validParties) {
      const quotient = votes[party] / (allocation[party] + 1);
      if (quotient > maxQuotient) {
        maxQuotient = quotient;
        winner = party;
      }
    }
    
    if (winner) {
      allocation[winner]++;
      quotients.push({ party: winner, quotient: maxQuotient, seat });
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
    const { allocation, quotients } = dHondt(circ.votes, circ.seats, threshold);
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

/**
 * Determina qué partidos superan el umbral en al menos una circunscripción.
 * Es la condición de entrada al reparto nacional del método GIME.
 */
export function getQualifiedPartiesByCircumscriptionThreshold(
  circumscriptions: CircumscriptionVotes[],
  threshold: number = 0.03
): Set<string> {
  const qualifiedParties = new Set<string>();

  for (const circ of circumscriptions) {
    const totalVotes = Object.values(circ.votes).reduce((a, b) => a + b, 0);
    if (totalVotes === 0) continue;

    for (const [party, votes] of Object.entries(circ.votes)) {
      if (votes / totalVotes >= threshold) {
        qualifiedParties.add(party);
      }
    }
  }

  return qualifiedParties;
}

// ==========================================
// MÉTODO BIPROPORCIONAL (GIME)
// ==========================================

/**
 * ETAPA 1: Reparto proporcional nacional
 * Calcula los escaños que corresponden a cada partido a nivel nacional
 * usando D'Hondt sobre el total de votos, pero solo entre partidos que
 * hayan superado el umbral en al menos una circunscripción
 */
export function gimeStage1(
  circumscriptions: CircumscriptionVotes[],
  nationalVotes: VoteData,
  totalSeats: number,
  threshold: number = 0.03
): GIMEStageResult {
  const qualifiedParties = getQualifiedPartiesByCircumscriptionThreshold(circumscriptions, threshold);
  const eligibleNationalVotes = Object.fromEntries(
    Object.entries(nationalVotes).filter(([party]) => qualifiedParties.has(party))
  );
  const { allocation: eligibleAllocation } = dHondt(eligibleNationalVotes, totalSeats, 0);
  const allocation = Object.keys(nationalVotes).reduce((result, party) => {
    result[party] = eligibleAllocation[party] || 0;
    return result;
  }, {} as { [party: string]: number });
  
  return {
    stage: 1,
    description: "Reparto proporcional nacional entre partidos que superan el umbral en al menos una circunscripción",
    nationalAllocation: allocation
  };
}

/**
 * Aplica D'Hondt para repartir `seats` escaños entre candidatos con votos ponderados.
 * Devuelve array de escaños asignados en el mismo orden que weightedVotes.
 */
function apportionDHondt(weightedVotes: number[], seats: number): number[] {
  const n = weightedVotes.length;
  const result = new Array(n).fill(0);
  
  for (let s = 0; s < seats; s++) {
    let maxQ = -1;
    let winner = -1;
    for (let i = 0; i < n; i++) {
      if (weightedVotes[i] <= 0) continue;
      const q = weightedVotes[i] / (result[i] + 1);
      if (q > maxQ) {
        maxQ = q;
        winner = i;
      }
    }
    if (winner >= 0) result[winner]++;
  }
  
  return result;
}

/**
 * ETAPA 2: Reparto biproporcional (Alternating Scaling con D'Hondt)
 * 
 * Implementa el algoritmo de escalado alternante:
 * - Para cada circunscripción, reparte sus escaños entre partidos usando
 *   D'Hondt con votos ponderados por multiplicadores de partido.
 * - Ajusta los multiplicadores de partido para que los totales nacionales
 *   por partido coincidan con los de la Etapa 1.
 * - Repite hasta convergencia.
 * 
 * Los totales por circunscripción se garantizan estructuralmente (cada circ
 * reparte exactamente sus escaños). Los multiplicadores de partido se
 * ajustan iterativamente para satisfacer los totales por partido.
 */
export function gimeStage2(
  circumscriptions: CircumscriptionVotes[],
  nationalAllocation: { [party: string]: number },
  maxIterations: number = 500
): GIMEStageResult {
  const parties = Object.keys(nationalAllocation).filter(p => nationalAllocation[p] > 0);
  const numCircs = circumscriptions.length;
  const numParties = parties.length;
  
  // Vote matrix: votes[circ][partyIdx]
  const votes: number[][] = circumscriptions.map(circ =>
    parties.map(p => circ.votes[p] || 0)
  );
  
  const circTargets = circumscriptions.map(c => c.seats);
  const partyTargets = parties.map(p => nationalAllocation[p]);
  
  // Party multipliers (the key variables we optimize)
  const partyMult = new Array(numParties).fill(1);
  
  let allocation: number[][] = circumscriptions.map(() => new Array(numParties).fill(0));
  
  let iterations = 0;
  let converged = false;
  
  while (!converged && iterations < maxIterations) {
    iterations++;
    converged = true;
    
    // For each circumscription, distribute its seats using D'Hondt
    // with weighted votes = votes × partyMultiplier
    for (let i = 0; i < numCircs; i++) {
      const weightedVotes = parties.map((_, j) => votes[i][j] * partyMult[j]);
      allocation[i] = apportionDHondt(weightedVotes, circTargets[i]);
    }
    
    // Check party totals and adjust multipliers
    for (let j = 0; j < numParties; j++) {
      const currentTotal = allocation.reduce((sum, row) => sum + row[j], 0);
      const target = partyTargets[j];
      if (currentTotal !== target) {
        converged = false;
        if (currentTotal > 0) {
          // Damped adjustment to help convergence
          const ratio = target / currentTotal;
          partyMult[j] *= 0.5 + 0.5 * ratio;
        } else if (target > 0) {
          // Party has no seats but should — boost multiplier
          partyMult[j] *= 2;
        }
      }
    }
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
    description: "Reparto biproporcional: escalado alternante con D'Hondt que satisface totales por partido Y por circunscripción",
    nationalAllocation,
    circumscriptionAllocations,
    iterations
  };
}

/**
 * ETAPA 3 (opcional): Ajuste de gobernabilidad
 * Puede aplicar bonificación al partido ganador si es necesario
 */
export function gimeStage3(
  stage2Result: GIMEStageResult,
  governabilityBonus: number = 0 // Escaños extra para el ganador (0 = sin ajuste)
): GIMEStageResult {
  if (governabilityBonus === 0) {
    return stage2Result;
  }
  
  const allocation = { ...stage2Result.nationalAllocation };
  
  // Encontrar ganador
  const winner = Object.entries(allocation)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Aplicar bonificación (restar proporcionalmente de otros)
  const others = Object.keys(allocation).filter(p => p !== winner && allocation[p] > 0);
  const totalOthers = others.reduce((sum, p) => sum + allocation[p], 0);
  
  for (const party of others) {
    const reduction = Math.round((allocation[party] / totalOthers) * governabilityBonus);
    allocation[party] = Math.max(0, allocation[party] - reduction);
  }
  allocation[winner] += governabilityBonus;
  
  return {
    stage: 3,
    description: `Ajuste de gobernabilidad: +${governabilityBonus} escaños al partido ganador (${winner})`,
    nationalAllocation: allocation,
    circumscriptionAllocations: stage2Result.circumscriptionAllocations
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
  
  // Etapa 1
  const stage1 = gimeStage1(circumscriptions, nationalVotes, totalSeats, threshold);
  
  // Etapa 2
  const stage2 = gimeStage2(circumscriptions, stage1.nationalAllocation);
  
  // Etapa 3 (si aplica)
  const stages = [stage1, stage2];
  if (governabilityBonus > 0) {
    stages.push(gimeStage3(stage2, governabilityBonus));
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
 * Calcula los votos "en restos" reales por circunscripción.
 * 
 * Para cada circunscripción, el último cociente que ganó escaño marca el
 * "precio" de un escaño. Los restos de cada partido son:
 * - Si tiene 0 escaños: TODOS sus votos son restos
 * - Si tiene N escaños: votos - N × precio_escaño (la parte "sobrante" 
 *   que no llegó para el siguiente escaño)
 * 
 * El "precio" se calcula como el menor cociente que ganó escaño en esa
 * circunscripción (el cociente del último escaño asignado).
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
    
    // Find the "seat price": the lowest winning quotient in this circ
    // This is: for each party with seats, votes/(seats) is their last winning quotient
    // The minimum of all those is the cutoff
    let seatPrice = 0;
    const partiesWithSeats = Object.entries(result.allocation).filter(([_, s]) => s > 0);
    if (partiesWithSeats.length > 0) {
      // The last winning D'Hondt quotient for each party is votes/(seats_won)
      // The minimum across all parties is the overall cutoff
      seatPrice = Math.min(
        ...partiesWithSeats.map(([party, seats]) => (circ.votes[party] || 0) / seats)
      );
    }
    
    Object.entries(circ.votes).forEach(([party, votes]) => {
      totalVotesSum += votes;
      if (votes <= 0) return;
      
      const seatsWon = result.allocation[party] || 0;
      let remainder: number;
      
      if (seatsWon === 0) {
        // All votes are wasted
        remainder = votes;
      } else {
        // Remainder = votes that didn't contribute to winning seats
        // = votes - seats × seatPrice (capped at 0)
        remainder = Math.max(0, votes - seatsWon * seatPrice);
      }
      
      if (remainder > 0) {
        wasted[party] = (wasted[party] || 0) + remainder;
      }
    });
  });

  const total = Object.values(wasted).reduce((a, b) => a + b, 0);
  return { byParty: wasted, total, totalVotes: totalVotesSum };
}

/**
 * Calcula los votos "en restos" para el método Biproporcional.
 * 
 * En el sistema biproporcional, TODOS los votos de partidos que superan
 * el umbral en al menos una circunscripción contribuyen al reparto nacional.
 * Por tanto, solo son "votos perdidos" los de partidos que NO superaron
 * el umbral en ninguna circunscripción.
 * 
 * Adicionalmente, calcula los votos "sin representación local": votos en
 * circunscripciones donde el partido no obtuvo escaño en el reparto
 * biproporcional (el votante no tiene representante local de su partido,
 * aunque su voto sí contó nacionalmente).
 */
export function calculateWastedVotesBiprop(
  circumscriptions: CircumscriptionVotes[],
  circumscriptionResults: CircumscriptionResult[],
  threshold: number = 0.03
): {
  byParty: { [party: string]: number };
  total: number;
  totalVotes: number;
  unrepresentedLocal: { byParty: { [party: string]: number }; total: number };
} {
  const qualifiedParties = getQualifiedPartiesByCircumscriptionThreshold(circumscriptions, threshold);
  const wasted: { [party: string]: number } = {};
  const unrepLocal: { [party: string]: number } = {};
  let totalVotesSum = 0;

  circumscriptions.forEach((circ, i) => {
    const result = circumscriptionResults[i];
    if (!result) return;
    Object.entries(circ.votes).forEach(([party, votes]) => {
      totalVotesSum += votes;
      if (votes > 0 && (result?.allocation[party] || 0) === 0) {
        if (!qualifiedParties.has(party)) {
          // Truly wasted: party didn't qualify anywhere
          wasted[party] = (wasted[party] || 0) + votes;
        } else {
          // Not wasted nationally, but no local representation
          unrepLocal[party] = (unrepLocal[party] || 0) + votes;
        }
      }
    });
  });

  const total = Object.values(wasted).reduce((a, b) => a + b, 0);
  const unrepTotal = Object.values(unrepLocal).reduce((a, b) => a + b, 0);
  return {
    byParty: wasted,
    total,
    totalVotes: totalVotesSum,
    unrepresentedLocal: { byParty: unrepLocal, total: unrepTotal }
  };
}

/**
 * Devuelve el detalle de votos en restos por partido y provincia.
 * Incluye tanto partidos con 0 escaños (todos sus votos) como
 * los restos de partidos que sí obtuvieron escaños.
 */
export function calculateWastedVotesDetail(
  circumscriptions: CircumscriptionVotes[],
  circumscriptionResults: CircumscriptionResult[]
): { [party: string]: { province: string; votes: number; seatsWon: number }[] } {
  const wastedDetail: { [party: string]: { province: string; votes: number; seatsWon: number }[] } = {};

  circumscriptions.forEach((circ, i) => {
    const result = circumscriptionResults[i];
    if (!result) return;

    // Calculate seat price for this circ
    let seatPrice = 0;
    const partiesWithSeats = Object.entries(result.allocation).filter(([_, s]) => s > 0);
    if (partiesWithSeats.length > 0) {
      seatPrice = Math.min(
        ...partiesWithSeats.map(([party, seats]) => (circ.votes[party] || 0) / seats)
      );
    }

    Object.entries(circ.votes).forEach(([party, votes]) => {
      if (votes <= 0) return;
      
      const seatsWon = result.allocation[party] || 0;
      let remainder: number;
      
      if (seatsWon === 0) {
        remainder = votes;
      } else {
        remainder = Math.max(0, votes - seatsWon * seatPrice);
      }
      
      if (remainder > 0) {
        if (!wastedDetail[party]) wastedDetail[party] = [];
        wastedDetail[party].push({
          province: circ.name,
          votes: Math.round(remainder),
          seatsWon
        });
      }
    });
  });

  return wastedDetail;
}

/**
 * Devuelve el detalle de votos en restos en biproporcional por partido y provincia.
 * Usa la misma lógica de "seat price" que D'Hondt pero con las asignaciones biprop.
 */
export function calculateUnrepresentedLocalDetail(
  circumscriptions: CircumscriptionVotes[],
  circumscriptionResults: CircumscriptionResult[],
  _threshold: number = 0.03
): { [party: string]: { province: string; votes: number; seatsWon: number }[] } {
  return calculateWastedVotesDetail(circumscriptions, circumscriptionResults);
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
