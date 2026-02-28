"use client";

import React, { useState, useMemo } from "react";
import {
  dHondtByCircumscription,
  runGIME,
  gallagherIndex,
  compareAllocations
} from "@/lib/electoral-methods";
import {
  circunscripciones as defaultCirc,
  parties,
  calculateNationalTotals,
  CircunscripcionData
} from "@/data/elections2023";
import ComparisonChart from "./ComparisonChart";
import ResultsTable from "./ResultsTable";
import Pactometro from "./Pactometro";

const PRESETS = {
  "2023": { name: "2023 (Real)", votes: null },
  "ppMayoria": {
    name: "PP mayoría",
    multipliers: { PP: 1.3, PSOE: 0.85, VOX: 0.9, SUMAR: 0.8 }
  },
  "psoeMayoria": {
    name: "PSOE mayoría",
    multipliers: { PP: 0.85, PSOE: 1.3, VOX: 0.7, SUMAR: 1.1 }
  },
  "empate": {
    name: "Empate técnico",
    multipliers: { PP: 1.0, PSOE: 1.05, VOX: 0.9, SUMAR: 1.0 }
  },
  "terceros": {
    name: "Auge terceros",
    multipliers: { PP: 0.8, PSOE: 0.8, VOX: 1.4, SUMAR: 1.5 }
  },
};

export default function Simulator() {
  const [governabilityBonus, setGovernabilityBonus] = useState(0);
  const [threshold, setThreshold] = useState(3);
  const [selectedPreset, setSelectedPreset] = useState<string>("2023");
  const [voteMultipliers, setVoteMultipliers] = useState<{[party: string]: number}>({
    PP: 1.0, PSOE: 1.0, VOX: 1.0, SUMAR: 1.0,
    ERC: 1.0, JUNTS: 1.0, PNV: 1.0, BILDU: 1.0, BNG: 1.0, CCA: 1.0,
  });
  const [activeSection, setActiveSection] = useState("parametros");

  const adjustedCircumscriptions = useMemo((): CircunscripcionData[] => {
    return defaultCirc.map(circ => ({
      ...circ,
      votes: Object.fromEntries(
        Object.entries(circ.votes).map(([party, votes]) => [
          party,
          Math.round(votes * (voteMultipliers[party] || 1.0))
        ])
      )
    }));
  }, [voteMultipliers]);

  const nationalVotes = useMemo(() =>
    calculateNationalTotals(adjustedCircumscriptions),
    [adjustedCircumscriptions]
  );

  const totalVotes = Object.values(nationalVotes).reduce((a, b) => a + b, 0);
  const totalSeats = adjustedCircumscriptions.reduce((sum, c) => sum + c.seats, 0);

  const dHondtResult = useMemo(() => {
    return dHondtByCircumscription(
      adjustedCircumscriptions.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
      threshold / 100
    );
  }, [adjustedCircumscriptions, threshold]);

  const gimeResults = useMemo(() => {
    return runGIME(
      adjustedCircumscriptions.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
      totalSeats,
      governabilityBonus,
      threshold / 100
    );
  }, [adjustedCircumscriptions, governabilityBonus, threshold, totalSeats]);

  const gimeNational = gimeResults[gimeResults.length - 1].nationalAllocation;

  const gallagherDHondt = gallagherIndex(nationalVotes, dHondtResult.national);
  const gallagherGIME = gallagherIndex(nationalVotes, gimeNational);
  const comparison = compareAllocations(dHondtResult.national, gimeNational);

  // Governability index
  const MAJORITY = 176;
  const GOVERNABILITY_COALITIONS = {
    derechas: ["PP", "VOX"],
    derechasExtendido: ["PP", "VOX", "UPN", "CCA"],
    izquierdas: ["PSOE", "SUMAR"],
    izquierdasNacionalistas: ["PSOE", "SUMAR", "ERC", "JUNTS", "PNV", "BILDU", "BNG", "CCA"],
    granCoalicion: ["PP", "PSOE"],
  };

  const calculateGovernabilityIndex = (seats: {[party: string]: number}) => {
    const results: {coalition: string, seats: number, surplus: number, viable: boolean}[] = [];
    for (const [name, ps] of Object.entries(GOVERNABILITY_COALITIONS)) {
      const total = ps.reduce((sum, p) => sum + (seats[p] || 0), 0);
      const surplus = total - MAJORITY;
      results.push({ coalition: name, seats: total, surplus, viable: total >= MAJORITY });
    }
    const viableCount = results.filter(r => r.viable).length;
    const bestSurplus = Math.max(...results.map(r => r.surplus));
    const hasTwoPartyMajority = results.some(r =>
      r.viable && GOVERNABILITY_COALITIONS[r.coalition as keyof typeof GOVERNABILITY_COALITIONS].length <= 2
    );
    let index = 0;
    if (viableCount > 0) index += 40;
    index += Math.min(20, viableCount * 5);
    if (hasTwoPartyMajority) index += 20;
    index += Math.min(20, Math.max(0, bestSurplus) * 2);
    return {
      index: Math.min(100, index),
      viableCoalitions: viableCount,
      bestSurplus,
      hasTwoPartyMajority,
      details: results
    };
  };

  const govDHondt = useMemo(() => calculateGovernabilityIndex(dHondtResult.national), [dHondtResult.national]);
  const govGIME = useMemo(() => calculateGovernabilityIndex(gimeNational), [gimeNational]);

  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === "2023") {
      setVoteMultipliers({
        PP: 1.0, PSOE: 1.0, VOX: 1.0, SUMAR: 1.0,
        ERC: 1.0, JUNTS: 1.0, PNV: 1.0, BILDU: 1.0, BNG: 1.0, CCA: 1.0,
      });
    } else {
      const preset = PRESETS[presetKey as keyof typeof PRESETS];
      if ('multipliers' in preset) {
        setVoteMultipliers(prev => ({ ...prev, ...preset.multipliers }));
      }
    }
  };

  const updateMultiplier = (party: string, value: number) => {
    setSelectedPreset("custom");
    setVoteMultipliers(prev => ({ ...prev, [party]: value }));
  };

  const COALITION_LABELS: {[key: string]: string} = {
    derechas: "Bloque derechas",
    derechasExtendido: "Derechas + reg.",
    izquierdas: "Bloque izquierdas",
    izquierdasNacionalistas: "Gob. Frankenstein",
    granCoalicion: "Gran Coalición",
  };

  return (
    <div className="space-y-16">
      {/* ===== PARÁMETROS ===== */}
      <section id="parametros" className="space-y-6">
        <div>
          <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">Parámetros del sistema</p>
          <h2 className="font-serif text-3xl md:text-5xl text-navy mb-2">Simulador electoral</h2>
          <p className="text-sm text-muted-text max-w-md">
            Configura los parámetros del sistema electoral, selecciona unas elecciones y simula escenarios alternativos.
          </p>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider block mb-2">Escenario</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedPreset === key
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-muted-text hover:bg-gray-200"
                }`}
                onClick={() => applyPreset(key)}
              >
                {preset.name}
              </button>
            ))}
            {selectedPreset === "custom" && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-step-amber-light text-step-amber">Personalizado</span>
            )}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-navy">Umbral electoral</label>
              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-navy">{threshold}%</span>
            </div>
            <input
              type="range"
              min="0" max="10" step="0.5"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="range range-sm range-primary w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-text mt-1">
              <span>0%</span>
              <span>3% (actual)</span>
              <span>5% (Alemania)</span>
              <span>10%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-navy">Bonificación gobernabilidad</label>
              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-navy">{governabilityBonus} esc.</span>
            </div>
            <input
              type="range"
              min="0" max="30" step="5"
              value={governabilityBonus}
              onChange={(e) => setGovernabilityBonus(parseInt(e.target.value))}
              className="range range-sm range-secondary w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-text mt-1">
              <span>0 (puro)</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* Vote adjusters — always visible */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-navy">Ajustar votos por partido</label>
            <span className="text-[10px] text-muted-text">Multiplicador: 0.5× – 1.5× (1× = votos reales 2023)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(parties).filter(([key]) => nationalVotes[key]).map(([partyKey, partyInfo]) => {
              const currentVotes = nationalVotes[partyKey] || 0;
              const percentage = totalVotes > 0 ? (currentVotes / totalVotes * 100).toFixed(1) : "0";
              const multiplier = voteMultipliers[partyKey] || 1.0;

              return (
                <div key={partyKey} className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-navy">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: partyInfo.color }} />
                      {partyKey}
                    </span>
                    <span className="text-[10px] font-mono text-muted-text">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5" max="1.5" step="0.05"
                    value={multiplier}
                    onChange={(e) => updateMultiplier(partyKey, parseFloat(e.target.value))}
                    className="range range-xs w-full"
                    style={{ accentColor: partyInfo.color }}
                  />
                  <div className="text-center text-[10px] font-mono text-muted-text mt-0.5">
                    x{multiplier.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-text mt-3 rounded-lg bg-gray-50 p-2.5">
            <strong>Guía de rangos realistas:</strong> x0.7-0.9 Caída significativa · x1.0 Real 2023 · x1.1-1.3 Crecimiento notable · x1.3+ Escenario excepcional
          </p>
        </div>
      </section>

      {/* ===== GALLAGHER ===== */}
      <section id="gallagher" className="space-y-6">
        <p className="text-accent-red text-xs font-semibold tracking-widest uppercase">Proporcionalidad</p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy">Índice Gallagher</h3>
        <p className="text-sm text-muted-text mb-6">
          Mide la desproporcionalidad entre votos y escaños. 0 = perfecto, mayor = peor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5 text-center">
            <div className="text-xs text-muted-text mb-1 uppercase tracking-wider">D&apos;Hondt</div>
            <div className="text-3xl font-serif text-accent-red">{gallagherDHondt.toFixed(2)}</div>
            <div className="text-[10px] text-muted-text mt-1">más alto = más injusto</div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 text-center">
            <div className="text-xs text-muted-text mb-1 uppercase tracking-wider">GIME</div>
            <div className="text-3xl font-serif text-emerald-600">{gallagherGIME.toFixed(2)}</div>
            <div className="text-[10px] text-muted-text mt-1">más bajo = más justo</div>
          </div>
          <div className="rounded-2xl bg-emerald-500 p-5 text-center text-white">
            <div className="text-xs text-white/70 mb-1 uppercase tracking-wider">Mejora</div>
            <div className="text-3xl font-serif">
              {gallagherDHondt > 0
                ? `${((gallagherDHondt - gallagherGIME) / gallagherDHondt * 100).toFixed(0)}%`
                : "—"
              }
            </div>
            <div className="text-[10px] text-white/60 mt-1">Reducción de la desproporcionalidad</div>
          </div>
        </div>

        <div className="rounded-xl bg-step-blue-light/50 p-4 text-sm text-body-text">
          <strong>Referencia:</strong> España actual ~5-6 · Países Bajos ~1 · Reino Unido ~15-20
        </div>
      </section>

      {/* ===== GOBERNABILIDAD ===== */}
      <section id="gobernabilidad" className="space-y-6">
        <p className="text-accent-red text-xs font-semibold tracking-widest uppercase">Gobernabilidad</p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy">Índice de Gobernabilidad</h3>
        <p className="text-sm text-muted-text">
          Mide la facilidad para formar gobierno. Mayor = más fácil gobernar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* D'Hondt */}
          <div className="rounded-2xl bg-gray-50 p-6">
            <h4 className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-4">D&apos;Hondt (actual)</h4>
            <div className="flex items-center gap-5">
              <div
                className="radial-progress text-step-blue"
                style={{"--value": govDHondt.index, "--size": "5rem"} as React.CSSProperties}
              >
                <span className="text-lg font-serif text-navy">{govDHondt.index}</span>
              </div>
              <div className="text-sm space-y-1 text-body-text">
                <div>{govDHondt.viableCoalitions} coaliciones viables</div>
                <div>{govDHondt.hasTwoPartyMajority ? "Mayoría bipartita posible" : "Sin mayoría bipartita"}</div>
                <div>Mejor margen: {govDHondt.bestSurplus > 0 ? `+${govDHondt.bestSurplus}` : govDHondt.bestSurplus}</div>
              </div>
            </div>
          </div>

          {/* GIME */}
          <div className="rounded-2xl bg-gray-50 p-6">
            <h4 className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-4">Método GIME</h4>
            <div className="flex items-center gap-5">
              <div
                className="radial-progress text-step-pink"
                style={{"--value": govGIME.index, "--size": "5rem"} as React.CSSProperties}
              >
                <span className="text-lg font-serif text-navy">{govGIME.index}</span>
              </div>
              <div className="text-sm space-y-1 text-body-text">
                <div>{govGIME.viableCoalitions} coaliciones viables</div>
                <div>{govGIME.hasTwoPartyMajority ? "Mayoría bipartita posible" : "Sin mayoría bipartita"}</div>
                <div>Mejor margen: {govGIME.bestSurplus > 0 ? `+${govGIME.bestSurplus}` : govGIME.bestSurplus}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Coalition eval table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Coalición</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">D&apos;Hondt</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">GIME</th>
              </tr>
            </thead>
            <tbody>
              {govDHondt.details.map((d, i) => (
                <tr key={d.coalition} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 font-medium text-navy">
                    {COALITION_LABELS[d.coalition] || d.coalition}
                  </td>
                  <td className="text-right px-4 py-2.5">
                    <span className={d.viable ? "font-semibold text-emerald-600" : "text-muted-text"}>
                      {d.seats} {d.viable && "✓"}
                    </span>
                  </td>
                  <td className="text-right px-4 py-2.5">
                    <span className={govGIME.details[i].viable ? "font-semibold text-emerald-600" : "text-muted-text"}>
                      {govGIME.details[i].seats} {govGIME.details[i].viable && "✓"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-muted-text">
          <strong className="text-body-text">Cálculo:</strong> existencia de coaliciones viables (40pts), número de opciones (20pts),
          mayoría con 2 partidos (20pts), margen sobre mayoría absoluta (20pts).
        </div>
      </section>

      {/* ===== RESULTADOS ===== */}
      <section id="resultados" className="space-y-6">
        <p className="text-accent-red text-xs font-semibold tracking-widest uppercase">Comparación</p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy">Resultados</h3>

        {/* Chart */}
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">Escaños: D&apos;Hondt vs GIME</h4>
          <ComparisonChart
            dHondt={dHondtResult.national}
            gime={gimeNational}
            parties={parties}
          />
        </div>

        {/* Table */}
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">Tabla detallada</h4>
          <ResultsTable
            dHondt={dHondtResult.national}
            gime={gimeNational}
            votes={nationalVotes}
            parties={parties}
          />
        </div>

        {/* Winners/losers */}
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">¿Quién gana y pierde con GIME?</h4>
          <p className="text-xs text-muted-text mb-4">
            Diferencia de escaños entre D&apos;Hondt y GIME. Verde = gana, Rojo = pierde.
          </p>
          <div className="flex flex-wrap gap-2">
            {comparison
              .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
              .filter(c => c.method1 > 0 || c.method2 > 0)
              .map(c => (
                <span
                  key={c.party}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    c.diff > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : c.diff < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-muted-text"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: parties[c.party]?.color || "#888" }} />
                  {c.party}
                  {c.diff !== 0 && (
                    <span className="font-semibold">{c.diff > 0 ? "+" : ""}{c.diff}</span>
                  )}
                  {c.diff === 0 && <span>0</span>}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ===== PACTÓMETRO ===== */}
      <section id="pactometro" className="space-y-6">
        <p className="text-accent-red text-xs font-semibold tracking-widest uppercase">Pactómetro</p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy">Pactos y mayorías</h3>
        <p className="text-sm text-muted-text">Explora qué coaliciones alcanzan la mayoría absoluta (176 escaños) bajo cada sistema electoral.</p>
        <Pactometro
          dHondtSeats={dHondtResult.national}
          gimeSeats={gimeNational}
        />
      </section>

      {/* ===== ETAPAS GIME ===== */}
      <section id="etapas" className="space-y-6">
        <p className="text-accent-red text-xs font-semibold tracking-widest uppercase">Algoritmo</p>
        <h3 className="font-serif text-2xl md:text-3xl text-navy">Etapas del Método GIME</h3>
        <p className="text-sm text-muted-text mb-4">
          El método GIME funciona en etapas sucesivas.
        </p>

        <div className="space-y-4">
          {gimeResults.map((stage, i) => {
            const stageColors = [
              { badge: "bg-step-blue text-white", bg: "bg-step-blue-light/50", border: "border-step-blue" },
              { badge: "bg-step-amber text-white", bg: "bg-step-amber-light/50", border: "border-step-amber" },
              { badge: "bg-step-pink text-white", bg: "bg-step-pink-light/50", border: "border-step-pink" },
            ];
            const color = stageColors[Math.min(i, stageColors.length - 1)];

            return (
              <details key={i} className={`rounded-2xl border-l-4 ${color.border} ${color.bg} group`} open={i === 0}>
                <summary className="cursor-pointer p-5 flex items-center gap-3 list-none">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${color.badge}`}>
                    ETAPA {stage.stage}
                  </span>
                  <span className="text-sm font-medium text-navy flex-1">
                    {stage.description.split(":")[0]}
                  </span>
                  <span className="text-muted-text text-xs group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-text mb-3">{stage.description}</p>
                  {stage.iterations && (
                    <p className="text-xs text-step-blue mb-3">Convergencia en {stage.iterations} iteraciones</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stage.nationalAllocation)
                      .filter(([_, seats]) => seats > 0)
                      .sort((a, b) => b[1] - a[1])
                      .map(([party, seats]) => (
                        <span
                          key={party}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white font-medium"
                          style={{ backgroundColor: parties[party]?.color || "#888" }}
                        >
                          {party}: {seats}
                        </span>
                      ))}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
