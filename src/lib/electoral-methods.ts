/**
 * Implementación de métodos electorales proporcionales
 * 
 * Incluye:
 * - Método D'Hondt tradicional (por circunscripción)
 * - Método GIME (Grupo de Investigación en Métodos Electorales)
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
  circumscriptions: { name: string; seats: number; votes: VoteData }[],
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

// ==========================================
// MÉTODO GIME (BIPROPORCIONAL)
// ==========================================

/**
 * ETAPA 1: Reparto proporcional nacional
 * Calcula los escaños que corresponden a cada partido a nivel nacional
 * usando D'Hondt sobre el total de votos
 */
export function gimeStage1(
  nationalVotes: VoteData,
  totalSeats: number,
  threshold: number = 0.03
): GIMEStageResult {
  const { allocation } = dHondt(nationalVotes, totalSeats, threshold);
  
  return {
    stage: 1,
    description: "Reparto proporcional nacional: escaños asignados proporcionalmente a votos nacionales usando D'Hondt",
    nationalAllocation: allocation
  };
}

/**
 * ETAPA 2: Reparto biproporcional
 * Distribuye los escaños de cada partido entre las circunscripciones
 * manteniendo tanto los totales por partido (de Etapa 1) como 
 * los totales por circunscripción
 */
export function gimeStage2(
  circumscriptions: { name: string; seats: number; votes: VoteData }[],
  nationalAllocation: { [party: string]: number },
  maxIterations: number = 100
): GIMEStageResult {
  const parties = Object.keys(nationalAllocation).filter(p => nationalAllocation[p] > 0);
  const n = circumscriptions.length;
  
  // Inicializar matriz de asignación
  const allocation: number[][] = circumscriptions.map(c => 
    parties.map(() => 0)
  );
  
  // Multiplicadores para el algoritmo iterativo
  let partyMultipliers = parties.map(() => 1);
  let circMultipliers = circumscriptions.map(() => 1);
  
  let iterations = 0;
  let converged = false;
  
  while (!converged && iterations < maxIterations) {
    converged = true;
    iterations++;
    
    // Calcular escaños ideales (proporcionales)
    for (let i = 0; i < n; i++) {
      const circ = circumscriptions[i];
      const totalCircVotes = Object.values(circ.votes).reduce((a, b) => a + b, 0);
      
      for (let j = 0; j < parties.length; j++) {
        const party = parties[j];
        const votes = circ.votes[party] || 0;
        
        if (votes === 0) {
          allocation[i][j] = 0;
          continue;
        }
        
        // Fórmula biproporcional con multiplicadores
        const idealSeats = (votes / totalCircVotes) * circ.seats * 
                          partyMultipliers[j] * circMultipliers[i];
        allocation[i][j] = Math.round(idealSeats);
      }
    }
    
    // Ajustar multiplicadores de partidos para cumplir totales nacionales
    for (let j = 0; j < parties.length; j++) {
      const party = parties[j];
      const targetSeats = nationalAllocation[party];
      const currentSeats = allocation.reduce((sum, row) => sum + row[j], 0);
      
      if (currentSeats !== targetSeats && currentSeats > 0) {
        partyMultipliers[j] *= targetSeats / currentSeats;
        converged = false;
      }
    }
    
    // Ajustar multiplicadores de circunscripciones
    for (let i = 0; i < n; i++) {
      const targetSeats = circumscriptions[i].seats;
      const currentSeats = allocation[i].reduce((a, b) => a + b, 0);
      
      if (currentSeats !== targetSeats && currentSeats > 0) {
        circMultipliers[i] *= targetSeats / currentSeats;
        converged = false;
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
    description: "Reparto biproporcional: distribución iterativa que satisface totales por partido Y por circunscripción",
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
 * Ejecuta el método GIME completo
 */
export function runGIME(
  circumscriptions: { name: string; seats: number; votes: VoteData }[],
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
  const stage1 = gimeStage1(nationalVotes, totalSeats, threshold);
  
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
