// ============================================================================
// government-sim.ts — Simulador de investiduras 1993-2023.
//
// Para cada elección real y cada sistema de reparto (D'Hondt provincial vs
// biproporcional), evalúa si una investidura liderada por el PSOE o por el PP
// habría sumado, clasificando cada partido con escaños según la postura
// (sí / no / abstención) que mantuvo hacia ese líder en esa época
// (src/data/party-politics.ts). El otro gran partido cuenta SIEMPRE como "no".
//
// Viabilidad: "abs" (sí ≥ 176, primera votación) o "simple" (sí > no, segunda
// votación — así se invistieron Zapatero 2008, Rajoy 2016 y Sánchez 2020).
//
// Es aritmética parlamentaria sobre precedentes reales de pacto, NO una
// predicción: con otro reparto los partidos podrían haber actuado distinto.
// Verificable con `npm run verify:gobiernos`.
// ============================================================================

import { computeElectionImpact, realElectionYears } from "@/lib/impact-stats";
import { partyPolitics, Stance } from "@/data/party-politics";
import { governmentHistory, GovernmentRecord } from "@/data/government-history";

export type Leader = "PSOE" | "PP";
export type Viability = "abs" | "simple" | null;
export type Verdict = "desbloqueo" | "cambio" | "matiz" | "igual";

export const LEADERS: Leader[] = ["PSOE", "PP"];

export interface PartnerEval {
  party: string;
  seats: number;
  /** Postura del partido hacia el líder evaluado en ese año. */
  stance: Stance;
  /** Precedente factual que justifica la postura (de party-politics). */
  note: string;
}

export interface LeaderEval {
  leader: Leader;
  /** Escaños propios del partido del líder. */
  seats: number;
  yes: number;
  no: number;
  abst: number;
  viable: Viability;
  /** Todos los demás partidos con escaños, con su postura hacia este líder. */
  partners: PartnerEval[];
  /** Coalición mínima de síes (mayores primero) que hace viable la investidura. */
  neededPartners: string[];
}

export interface SystemEval {
  PSOE: LeaderEval;
  PP: LeaderEval;
}

export interface GovernmentSimulation {
  year: string;
  name: string;
  dhondtSeats: { [party: string]: number };
  bipropSeats: { [party: string]: number };
  dhondt: SystemEval;
  biprop: SystemEval;
  real: GovernmentRecord;
  verdict: Verdict;
  verdictText: string;
}

/**
 * Postura de un partido en un año electoral. Lanza error si el partido no
 * tiene era definida para ese año: la cobertura se comprueba en
 * scripts/verify_government.ts y no debe silenciarse aquí.
 */
export function stanceFor(
  party: string,
  year: string
): { PSOE: Stance; PP: Stance; note: string } {
  const politics = partyPolitics[party];
  const era = politics?.relations.find(r => r.years.includes(year));
  if (!era) {
    throw new Error(`party-politics: sin postura definida para ${party} en ${year}`);
  }
  return { PSOE: era.PSOE, PP: era.PP, note: era.note };
}

function evaluateLeader(
  leader: Leader,
  seats: { [party: string]: number },
  year: string
): LeaderEval {
  const other: Leader = leader === "PSOE" ? "PP" : "PSOE";
  const leaderSeats = seats[leader] || 0;
  let yes = leaderSeats;
  let no = 0;
  let abst = 0;
  const partners: PartnerEval[] = [];

  for (const [party, n] of Object.entries(seats)) {
    if (n <= 0 || party === leader) continue;
    const era = stanceFor(party, year);
    // El otro gran partido cuenta siempre como "no".
    const stance: Stance = party === other ? "no" : era[leader];
    if (stance === "si") yes += n;
    else if (stance === "no") no += n;
    else abst += n;
    partners.push({ party, seats: n, stance, note: era.note });
  }

  partners.sort((a, b) => b.seats - a.seats || a.party.localeCompare(b.party));

  const viable: Viability = yes >= 176 ? "abs" : yes > no ? "simple" : null;

  // Coalición mínima: socios "sí" de mayor a menor hasta alcanzar la
  // viabilidad (176 si el bloque completo llega; mayoría simple si no).
  const neededPartners: string[] = [];
  if (viable) {
    let sum = leaderSeats;
    const satisfied = () => (viable === "abs" ? sum >= 176 : sum > no);
    for (const p of partners) {
      if (p.stance !== "si") continue;
      if (satisfied()) break;
      neededPartners.push(p.party);
      sum += p.seats;
    }
  }

  return { leader, seats: leaderSeats, yes, no, abst, viable, partners, neededPartners };
}

function evaluateSystem(seats: { [party: string]: number }, year: string): SystemEval {
  return {
    PSOE: evaluateLeader("PSOE", seats, year),
    PP: evaluateLeader("PP", seats, year),
  };
}

export function viableLeaders(systemEval: SystemEval): Leader[] {
  return LEADERS.filter(l => systemEval[l].viable !== null);
}

// ── Veredicto y texto ───────────────────────────────────────────────────────

function listEsY(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function partnerSeats(ev: LeaderEval, party: string): number {
  return ev.partners.find(p => p.party === party)?.seats || 0;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildVerdict(
  real: GovernmentRecord,
  d: SystemEval,
  b: SystemEval
): { verdict: Verdict; verdictText: string } {
  const vD = viableLeaders(d);
  const vB = viableLeaders(b);
  const sameSets = vD.length === vB.length && vD.every(l => vB.includes(l));
  const pm = real.pmParty === "PSOE" || real.pmParty === "PP" ? (real.pmParty as Leader) : undefined;
  const pmName = real.pm ? real.pm.split(" ").pop() : undefined;

  // Caso 2016: hubo gobierno pero el modelo de posturas no reproduce esa
  // investidura con D'Hondt (Rajoy gobernó por la abstención extraordinaria
  // del PSOE). El veredicto se calcula igual; el texto lo reconoce.
  const pmNotReproduced = real.outcome === "gobierno" && pm !== undefined && d[pm].viable === null;
  const realityPrefix = pmNotReproduced
    ? `En la realidad el ${pm} gobernó gracias a la abstención extraordinaria del PSOE, que la aritmética de pactos no recoge. `
    : "";

  // 1. Desbloqueo: la elección fue repetición y el biproporcional abre una investidura.
  if (real.outcome === "repeticion" && vB.length > 0) {
    const best = [...vB].sort((x, y) => b[y].yes - b[x].yes)[0];
    const ev = b[best];
    const detail =
      ev.viable === "abs"
        ? `${ev.yes} síes (mayoría absoluta)`
        : `${ev.yes} síes frente a ${ev.no} noes`;
    return {
      verdict: "desbloqueo",
      verdictText: `El bloqueo podría haberse evitado: con el reparto biproporcional el ${best} habría sumado ${detail}.`,
    };
  }

  // 2. Cambio: el conjunto de líderes viables difiere entre sistemas.
  if (!sameSets) {
    const lost = vD.filter(l => !vB.includes(l));
    const gained = vB.filter(l => !vD.includes(l));
    const parts: string[] = [];
    for (const g of gained) {
      parts.push(
        `con biproporcional se abriría la investidura del ${g} (${b[g].yes} síes posibles frente a ${b[g].no} noes)`
      );
    }
    for (const l of lost) {
      parts.push(
        `con biproporcional el ${l} se quedaría sin investidura posible (${b[l].yes} síes frente a ${b[l].no} noes)`
      );
    }
    let tail = "";
    if (vB.length === 0) {
      tail = `; ningún candidato sumaría y la repetición electoral habría sido el desenlace más probable`;
    } else if (lost.length > 0) {
      const alt = vB[0];
      tail = `; la única investidura viable pasaría a ser la del ${alt} (hasta ${b[alt].yes} síes posibles)`;
    }
    return {
      verdict: "cambio",
      verdictText: realityPrefix + capitalize(parts.join("; ") + tail + "."),
    };
  }

  // 3. Matiz: mismos líderes viables, pero cambia la estructura del ganador real.
  if (real.outcome === "gobierno" && pm !== undefined) {
    const absD = d[pm].seats >= 176;
    const absB = b[pm].seats >= 176;
    if (absD !== absB) {
      const neededB = b[pm].neededPartners;
      const text =
        absD && !absB
          ? `El ${pm} habría perdido la mayoría absoluta (${d[pm].seats}→${b[pm].seats} escaños) y ${
              neededB.length > 0
                ? `habría necesitado a ${listEsY(neededB)} para sumar la investidura`
                : "habría tenido que gobernar en minoría, investido por mayoría simple"
            }.`
          : `El ${pm} habría ganado la mayoría absoluta (${d[pm].seats}→${b[pm].seats} escaños).`;
      return { verdict: "matiz", verdictText: text };
    }
    if (d[pm].viable && b[pm].viable && d[pm].viable !== b[pm].viable) {
      const label = (v: Viability) => (v === "abs" ? "mayoría absoluta" : "mayoría simple");
      return {
        verdict: "matiz",
        verdictText: `${pmName} seguiría siendo investido, pero su mayoría pasaría de ${label(
          d[pm].viable
        )} a ${label(b[pm].viable)} (${d[pm].yes}→${b[pm].yes} síes posibles).`,
      };
    }
    if (d[pm].viable && b[pm].viable) {
      const nd = d[pm].neededPartners;
      const nb = b[pm].neededPartners;
      const removed = nd.filter(p => !nb.includes(p));
      const added = nb.filter(p => !nd.includes(p));
      if (removed.length > 0 || added.length > 0) {
        const coalition = [pm, ...nb].join("+");
        const sum = b[pm].seats + nb.reduce((s, p) => s + partnerSeats(b[pm], p), 0);
        let middle: string;
        if (removed.length > 0 && added.length === 0) {
          middle = `habría podido sumar la investidura sin ${listEsY(removed)} (${coalition} = ${sum} escaños)`;
        } else if (added.length > 0 && removed.length === 0) {
          middle = `habría necesitado además a ${listEsY(added)} (${coalition} = ${sum} escaños)`;
        } else {
          middle = `habría cambiado a ${listEsY(removed)} por ${listEsY(added)} (${coalition} = ${sum} escaños)`;
        }
        return {
          verdict: "matiz",
          verdictText: `Mismo color, pactos distintos: ${pmName} ${middle}.`,
        };
      }
    }
  }

  // 4. Igual: misma estructura de viabilidad.
  let text: string;
  if (real.outcome === "repeticion") {
    text =
      "El bloqueo se habría producido igualmente: ningún candidato sumaba una mayoría de investidura con ninguno de los dos repartos.";
  } else if (pmNotReproduced) {
    const alt = [...vB].sort((x, y) => b[y].yes - b[x].yes)[0];
    text = alt
      ? `${realityPrefix}Con biproporcional el escenario sería el mismo: la única mayoría aritmética seguiría siendo ${[
          alt,
          ...b[alt].neededPartners,
        ].join("+")} (${b[alt].yes} síes posibles), un acuerdo que en la realidad nunca cuajó.`
      : `${realityPrefix}El modelo de pactos da bloqueo con los dos repartos.`;
  } else if (pm !== undefined) {
    text = `Mismo desenlace: ${pmName} seguiría sumando la investidura (${d[pm].yes} síes posibles con D'Hondt, ${b[pm].yes} con biproporcional).`;
  } else {
    text = "Misma estructura de viabilidad con los dos repartos.";
  }
  return { verdict: "igual", verdictText: text };
}

// ── API pública ─────────────────────────────────────────────────────────────

export function simulateElection(year: string): GovernmentSimulation {
  const impact = computeElectionImpact(year);
  const real = governmentHistory[year];
  if (!real) {
    throw new Error(`government-history: falta el registro de la elección ${year}`);
  }
  const dhondt = evaluateSystem(impact.dhondt, year);
  const biprop = evaluateSystem(impact.biprop, year);
  const { verdict, verdictText } = buildVerdict(real, dhondt, biprop);
  return {
    year,
    name: impact.name,
    dhondtSeats: impact.dhondt,
    bipropSeats: impact.biprop,
    dhondt,
    biprop,
    real,
    verdict,
    verdictText,
  };
}

/** Simulación completa de las 11 elecciones reales, en orden cronológico. */
export function simulateGovernments(): GovernmentSimulation[] {
  return realElectionYears().map(simulateElection);
}
