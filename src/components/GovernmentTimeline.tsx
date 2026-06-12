"use client";

import React, { useMemo, useState } from "react";
import {
  simulateGovernments,
  GovernmentSimulation,
  SystemEval,
  LeaderEval,
  Leader,
  LEADERS,
  Verdict,
  viableLeaders,
} from "@/lib/government-sim";

const SHORT_YEAR: { [year: string]: string } = {
  "1993": "93",
  "1996": "96",
  "2000": "00",
  "2004": "04",
  "2008": "08",
  "2011": "11",
  "2015": "15",
  "2016": "16",
  "2019-A": "19A",
  "2019-N": "19N",
  "2023": "23",
};

const LEADER_COLORS: { [leader: string]: string } = {
  PSOE: "#e30613",
  PP: "#0056a3",
};
const REPEAT_COLOR = "#9ca3af";

const YES_COLOR = "#10b981";
const ABST_COLOR = "#d1d5db";
const NO_COLOR = "#f87171";

const VERDICT_ORDER: Verdict[] = ["cambio", "desbloqueo", "matiz", "igual"];

const VERDICT_META: {
  [v in Verdict]: { label: string; ring: string; legendRing: string; badge: string; accent: string };
} = {
  cambio: {
    label: "Cambia quién puede gobernar",
    ring: "ring-4 ring-amber-400",
    legendRing: "ring-2 ring-amber-400",
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    accent: "border-amber-400",
  },
  desbloqueo: {
    label: "El bloqueo se evita",
    ring: "ring-4 ring-emerald-400",
    legendRing: "ring-2 ring-emerald-400",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    accent: "border-emerald-400",
  },
  matiz: {
    label: "Mismo color, pactos distintos",
    ring: "ring-2 ring-amber-200",
    legendRing: "ring-2 ring-amber-200",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    accent: "border-amber-200",
  },
  igual: {
    label: "Sin cambios",
    ring: "ring-2 ring-gray-200",
    legendRing: "ring-2 ring-gray-200",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    accent: "border-gray-200",
  },
};

function govColor(sim: GovernmentSimulation): string {
  if (sim.real.outcome === "repeticion") return REPEAT_COLOR;
  return LEADER_COLORS[sim.real.pmParty || ""] || REPEAT_COLOR;
}

function kindLabel(kind?: string): string {
  if (kind === "mayoria_absoluta") return "con mayoría absoluta";
  if (kind === "coalicion") return "en coalición";
  return "en minoría";
}

/** Barra apilada sí / abstención / no sobre 350 escaños, con la línea de 176. */
function InvestidureBar({ ev }: { ev: LeaderEval }) {
  const pct = (n: number) => `${((n / 350) * 100).toFixed(2)}%`;
  return (
    <div className="relative pt-4">
      <div className="absolute top-0 bottom-0 z-10" style={{ left: pct(176) }}>
        <span className="absolute top-0 -translate-x-1/2 text-[10px] font-semibold text-navy">
          176
        </span>
        <div className="absolute top-4 bottom-0 -translate-x-1/2 border-l-2 border-dashed border-navy/70" />
      </div>
      <div className="flex h-7 rounded-lg overflow-hidden bg-gray-100">
        <div style={{ width: pct(ev.yes), backgroundColor: YES_COLOR }} title={`Sí: ${ev.yes}`} />
        <div
          style={{ width: pct(ev.abst), backgroundColor: ABST_COLOR }}
          title={`Abstención: ${ev.abst}`}
        />
        <div style={{ width: pct(ev.no), backgroundColor: NO_COLOR }} title={`No: ${ev.no}`} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-body-text tabular-nums">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: YES_COLOR }} />
          Sí {ev.yes}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ABST_COLOR }} />
          Abstención {ev.abst}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: NO_COLOR }} />
          No {ev.no}
        </span>
      </div>
    </div>
  );
}

function SystemColumn({
  title,
  systemEval,
  sim,
  isReal,
}: {
  title: string;
  systemEval: SystemEval;
  sim: GovernmentSimulation;
  isReal: boolean;
}) {
  const real = sim.real;
  const viables = viableLeaders(systemEval);
  const pmLeader: Leader | undefined =
    real.pmParty === "PSOE" || real.pmParty === "PP" ? (real.pmParty as Leader) : undefined;

  // Mejor líder viable (preferencia por el ganador real); si nadie suma,
  // se muestra al que más cerca se queda, etiquetado como bloqueo.
  let shown: Leader;
  if (pmLeader && viables.includes(pmLeader)) shown = pmLeader;
  else if (viables.length > 0) shown = [...viables].sort((a, b) => systemEval[b].yes - systemEval[a].yes)[0];
  else shown = [...LEADERS].sort((a, b) => systemEval[b].yes - systemEval[a].yes)[0];

  const ev = systemEval[shown];
  const blocked = viables.length === 0;

  const chipClass = blocked
    ? "bg-red-100 text-red-700"
    : ev.viable === "abs"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  const chipText = blocked
    ? "nadie suma la investidura"
    : ev.viable === "abs"
      ? "mayoría absoluta (≥176 síes)"
      : "mayoría simple (2.ª votación)";

  const siPartners = ev.partners.filter(p => p.stance === "si");
  const abstPartners = ev.partners.filter(p => p.stance === "abstencion");

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5">
      <h4 className="text-sm font-semibold text-body-text mb-3">{title}</h4>

      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: LEADER_COLORS[shown] }}
        />
        <span className="text-sm font-semibold text-navy">
          {blocked ? "Bloqueo" : `Investidura viable: ${shown}`}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${chipClass}`}>
          {chipText}
        </span>
      </div>
      {blocked && (
        <p className="text-xs text-muted-text mb-1">
          El candidato que más cerca se queda: {shown}, con {ev.yes} síes frente a {ev.no} noes.
        </p>
      )}

      <InvestidureBar ev={ev} />

      {siPartners.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-body-text mb-1.5">
            {blocked ? "Apoyos posibles" : "Votarían sí"} ({shown}: {ev.seats} escaños propios)
          </div>
          <ul className="space-y-1.5">
            {siPartners.map(p => (
              <li key={p.party} className="text-xs leading-snug">
                <span className="font-medium text-body-text">{p.party}</span>
                <span className="text-muted-text tabular-nums"> · {p.seats} esc.</span>
                {ev.neededPartners.includes(p.party) && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-px rounded-full bg-navy/5 text-navy font-medium">
                    necesario
                  </span>
                )}
                <div className="text-[11px] text-muted-text">{p.note}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {abstPartners.length > 0 && (
        <p className="mt-3 text-[11px] text-muted-text">
          Se abstendrían: {abstPartners.map(p => `${p.party} (${p.seats})`).join(", ")}.
        </p>
      )}

      {isReal && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
          <div className="text-xs font-semibold text-body-text mb-1">La investidura real</div>
          {real.outcome === "gobierno" ? (
            <>
              <p className="text-xs text-body-text">
                {real.pm} ({real.pmParty}), {kindLabel(real.kind)}, investido en{" "}
                {real.round === 2 ? "2.ª" : "1.ª"} votación.
              </p>
              <p className="text-[11px] text-muted-text mt-1">
                Votaron sí: {(real.yesParties || []).map(p => `${p} (${sim.dhondtSeats[p] || 0})`).join(", ")}
                {(real.abstainParties || []).length > 0 && (
                  <>
                    {" "}
                    · Abstención:{" "}
                    {(real.abstainParties || [])
                      .map(p => `${p} (${sim.dhondtSeats[p] || 0})`)
                      .join(", ")}
                  </>
                )}
                .
              </p>
              <p className="text-[11px] text-muted-text mt-1">{real.note}</p>
            </>
          ) : (
            <p className="text-[11px] text-muted-text">{real.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GovernmentTimeline() {
  const sims = useMemo(() => simulateGovernments(), []);
  const defaultYear = useMemo(
    () =>
      (sims.find(s => s.verdict === "cambio" || s.verdict === "desbloqueo") || sims[0]).year,
    [sims]
  );
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const sim = sims.find(s => s.year === selectedYear) || sims[0];
  const meta = VERDICT_META[sim.verdict];

  const nCambio = sims.filter(s => s.verdict === "cambio" || s.verdict === "desbloqueo").length;
  const nMatiz = sims.filter(s => s.verdict === "matiz").length;
  const presentVerdicts = VERDICT_ORDER.filter(v => sims.some(s => s.verdict === v));

  return (
    <div>
      <h2 className="font-serif text-3xl text-navy mb-2">¿Habría cambiado quién gobierna?</h2>
      <p className="text-body-text text-base mb-3 max-w-2xl">
        En{" "}
        <span className="font-semibold text-navy">
          {nCambio} de las {sims.length} elecciones
        </span>{" "}
        el biproporcional cambia quién puede ser investido presidente; en otras {nMatiz} cambian
        los socios necesarios o desaparece la mayoría absoluta.
      </p>
      <p className="text-muted-text text-xs mb-8 max-w-2xl">
        El modelo suma los escaños de cada bloque según la postura (sí, no o abstención) que cada
        partido mantuvo hacia el PSOE y el PP en esa época, tomada de sus investiduras y pactos
        reales. Pincha en cada elección para ver el detalle.
      </p>

      {/* Timeline */}
      <div className="overflow-x-auto pb-1">
        <div className="relative min-w-[660px] md:min-w-0 px-2">
          <div className="absolute left-2 right-2 top-[22px] h-0.5 bg-gray-200" />
          <div className="relative flex">
            {sims.map(s => {
              const m = VERDICT_META[s.verdict];
              const isSel = s.year === sim.year;
              return (
                <button
                  key={s.year}
                  onClick={() => setSelectedYear(s.year)}
                  className="flex-1 flex flex-col items-center gap-2 py-1 group"
                  aria-pressed={isSel}
                  title={`${s.name}: ${m.label}`}
                >
                  <span
                    className={`w-9 h-9 rounded-full ring-offset-2 ring-offset-white transition-transform ${m.ring} ${
                      isSel ? "scale-110" : "group-hover:scale-105"
                    }`}
                    style={{ backgroundColor: govColor(s) }}
                  />
                  <span
                    className={`text-xs tabular-nums ${
                      isSel ? "font-bold text-navy" : "text-muted-text"
                    }`}
                  >
                    {SHORT_YEAR[s.year] || s.year}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full -mt-1 ${isSel ? "bg-navy" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-text mt-3 mb-6">
        <span className="font-medium text-body-text">Color: quién gobernó de verdad</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: LEADER_COLORS.PSOE }} />
          PSOE
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: LEADER_COLORS.PP }} />
          PP
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: REPEAT_COLOR }} />
          repetición electoral
        </span>
        <span className="font-medium text-body-text">Anillo: el veredicto</span>
        {presentVerdicts.map(v => (
          <span key={v} className="inline-flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full bg-white ${VERDICT_META[v].legendRing}`} />
            {VERDICT_META[v].label.toLowerCase()}
          </span>
        ))}
      </div>

      {/* Panel de detalle */}
      <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
          <h3 className="font-serif text-2xl text-navy">{sim.name}</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${meta.badge}`}>
            {meta.label}
          </span>
        </div>
        <p className={`text-sm text-body-text mb-6 max-w-3xl border-l-4 pl-3 ${meta.accent}`}>
          {sim.verdictText}
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <SystemColumn
            title={"Lo que pasó (D'Hondt)"}
            systemEval={sim.dhondt}
            sim={sim}
            isReal
          />
          <SystemColumn
            title="Con biproporcional"
            systemEval={sim.biprop}
            sim={sim}
            isReal={false}
          />
        </div>
      </div>

      {/* Nota de metodología */}
      <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-100 p-5 text-xs text-muted-text leading-relaxed">
        <span className="font-semibold text-body-text">Cómo leer esta simulación.</span> Es
        aritmética parlamentaria sobre los precedentes reales de pacto de cada partido
        (investiduras, mociones de censura y acuerdos autonómicos), no una predicción: con otro
        reparto de escaños, los partidos podrían haber negociado y actuado de otra manera. Las
        posturas sin precedente nacional figuran marcadas como inferidas en los propios datos, y
        el otro gran partido cuenta siempre como &ldquo;no&rdquo;. Viabilidad: mayoría absoluta
        (≥176 síes en primera votación) o mayoría simple (más síes que noes, en segunda).
        Verificable con <code>npm run verify:gobiernos</code>.
      </div>
    </div>
  );
}
