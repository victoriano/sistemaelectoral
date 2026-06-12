import { electionData, electionMetadata } from "@/data/all-elections";
import {
  dHondtByCircumscription,
  runGIME,
  gallagherIndex,
  CircumscriptionVotes,
  CircumscriptionResult,
} from "@/lib/electoral-methods";

export interface ElectionImpact {
  year: string;
  name: string;
  /** Escaños por partido con D'Hondt provincial (sistema actual). */
  dhondt: { [party: string]: number };
  /** Escaños por partido con el método biproporcional (sin bonus). */
  biprop: { [party: string]: number };
  /** biprop − dhondt, solo partidos con diferencia ≠ 0. */
  diff: { [party: string]: number };
  /** Escaños que cambian de manos (suma de diferencias positivas). */
  seatsMoved: number;
  gallagherDHondt: number;
  gallagherBiprop: number;
  /** % de votos de candidaturas emitidos en circunscripciones donde el partido obtuvo 0 escaños. */
  wastedDHondtPct: number;
  wastedBipropPct: number;
}

export interface ImpactSummary {
  elections: ElectionImpact[];
  /** Suma de diff por partido en todo el periodo. */
  totalDiffByParty: { [party: string]: number };
  totalSeatsMoved: number;
  avgGallagherDHondt: number;
  avgGallagherBiprop: number;
  avgWastedDHondtPct: number;
  avgWastedBipropPct: number;
  /** Nº de elecciones en las que el biproporcional reduce el índice de Gallagher. */
  electionsImproved: number;
}

const THRESHOLD = 0.03;

/**
 * Votos emitidos a candidaturas en circunscripciones donde el partido no
 * obtuvo ningún escaño. Misma métrica para ambos métodos para que la
 * comparación sea homogénea.
 */
function zeroSeatVotes(
  circs: CircumscriptionVotes[],
  results: CircumscriptionResult[]
): { wasted: number; totalVotes: number } {
  let wasted = 0;
  let totalVotes = 0;
  circs.forEach((circ, i) => {
    const allocation = results[i]?.allocation || {};
    for (const [party, votes] of Object.entries(circ.votes)) {
      totalVotes += votes;
      if (votes > 0 && (allocation[party] || 0) === 0) wasted += votes;
    }
  });
  return { wasted, totalVotes };
}

function nationalVotes(circs: CircumscriptionVotes[]): { [party: string]: number } {
  const totals: { [party: string]: number } = {};
  for (const circ of circs) {
    for (const [party, votes] of Object.entries(circ.votes)) {
      totals[party] = (totals[party] || 0) + votes;
    }
  }
  return totals;
}

/** Años con datos reales, en orden cronológico (excluye la proyección 2027*). */
export function realElectionYears(): string[] {
  return Object.keys(electionMetadata)
    .filter(y => electionMetadata[y].hasRealData)
    .sort();
}

export function computeElectionImpact(year: string): ElectionImpact {
  const circs: CircumscriptionVotes[] = electionData[year].map(c => ({
    name: c.name,
    seats: c.seats,
    votes: c.votes,
    blankVotes: c.blankVotes,
  }));
  const totalSeats = circs.reduce((sum, c) => sum + c.seats, 0);

  const dhondtResult = dHondtByCircumscription(circs, THRESHOLD);
  const gimeStages = runGIME(circs, totalSeats, 0, THRESHOLD);
  const biprop = gimeStages[gimeStages.length - 1].nationalAllocation;
  const bipropCircs =
    gimeStages.find(s => s.circumscriptionAllocations)?.circumscriptionAllocations || [];

  const diff: { [party: string]: number } = {};
  const allParties = new Set([...Object.keys(dhondtResult.national), ...Object.keys(biprop)]);
  let seatsMoved = 0;
  for (const party of Array.from(allParties)) {
    const d = (biprop[party] || 0) - (dhondtResult.national[party] || 0);
    if (d !== 0) diff[party] = d;
    if (d > 0) seatsMoved += d;
  }

  const votes = nationalVotes(circs);
  const wastedD = zeroSeatVotes(circs, dhondtResult.results);
  const wastedB = zeroSeatVotes(circs, bipropCircs);

  return {
    year,
    name: electionMetadata[year].name,
    dhondt: dhondtResult.national,
    biprop,
    diff,
    seatsMoved,
    gallagherDHondt: gallagherIndex(votes, dhondtResult.national),
    gallagherBiprop: gallagherIndex(votes, biprop),
    wastedDHondtPct: (wastedD.wasted / wastedD.totalVotes) * 100,
    wastedBipropPct: (wastedB.wasted / wastedB.totalVotes) * 100,
  };
}

export function computeImpactSummary(): ImpactSummary {
  const elections = realElectionYears().map(computeElectionImpact);
  const n = elections.length;

  const totalDiffByParty: { [party: string]: number } = {};
  for (const e of elections) {
    for (const [party, d] of Object.entries(e.diff)) {
      totalDiffByParty[party] = (totalDiffByParty[party] || 0) + d;
    }
  }

  const avg = (f: (e: ElectionImpact) => number) =>
    elections.reduce((sum, e) => sum + f(e), 0) / n;

  return {
    elections,
    totalDiffByParty,
    totalSeatsMoved: elections.reduce((sum, e) => sum + e.seatsMoved, 0),
    avgGallagherDHondt: avg(e => e.gallagherDHondt),
    avgGallagherBiprop: avg(e => e.gallagherBiprop),
    avgWastedDHondtPct: avg(e => e.wastedDHondtPct),
    avgWastedBipropPct: avg(e => e.wastedBipropPct),
    electionsImproved: elections.filter(e => e.gallagherBiprop < e.gallagherDHondt).length,
  };
}
