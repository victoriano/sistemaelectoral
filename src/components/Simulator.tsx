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

// Presets de escenarios
const PRESETS = {
  "2023": { name: "Elecciones 2023 (Real)", votes: null },
  "ppMayoria": { 
    name: "PP mayoría absoluta", 
    multipliers: { PP: 1.3, PSOE: 0.85, VOX: 0.9, SUMAR: 0.8 }
  },
  "psoeMayoria": { 
    name: "PSOE mayoría absoluta", 
    multipliers: { PP: 0.85, PSOE: 1.3, VOX: 0.7, SUMAR: 1.1 }
  },
  "empate": { 
    name: "Empate técnico", 
    multipliers: { PP: 1.0, PSOE: 1.05, VOX: 0.9, SUMAR: 1.0 }
  },
  "terceros": { 
    name: "Auge de terceros partidos", 
    multipliers: { PP: 0.8, PSOE: 0.8, VOX: 1.4, SUMAR: 1.5 }
  },
};

export default function Simulator() {
  // Parámetros del sistema
  const [governabilityBonus, setGovernabilityBonus] = useState(0);
  const [threshold, setThreshold] = useState(3);
  const [selectedPreset, setSelectedPreset] = useState<string>("2023");
  
  // Multiplicadores de votos editables (para "what if")
  const [voteMultipliers, setVoteMultipliers] = useState<{[party: string]: number}>({
    PP: 1.0,
    PSOE: 1.0,
    VOX: 1.0,
    SUMAR: 1.0,
    ERC: 1.0,
    JUNTS: 1.0,
    PNV: 1.0,
    BILDU: 1.0,
    BNG: 1.0,
    CCA: 1.0,
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Aplicar multiplicadores a las circunscripciones
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
  
  // Calcular totales nacionales
  const nationalVotes = useMemo(() => 
    calculateNationalTotals(adjustedCircumscriptions), 
    [adjustedCircumscriptions]
  );
  
  const totalVotes = Object.values(nationalVotes).reduce((a, b) => a + b, 0);
  const totalSeats = adjustedCircumscriptions.reduce((sum, c) => sum + c.seats, 0);
  
  // Ejecutar D'Hondt tradicional
  const dHondtResult = useMemo(() => {
    return dHondtByCircumscription(
      adjustedCircumscriptions.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
      threshold / 100
    );
  }, [adjustedCircumscriptions, threshold]);
  
  // Ejecutar GIME
  const gimeResults = useMemo(() => {
    return runGIME(
      adjustedCircumscriptions.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
      totalSeats,
      governabilityBonus,
      threshold / 100
    );
  }, [adjustedCircumscriptions, governabilityBonus, threshold, totalSeats]);
  
  const gimeNational = gimeResults[gimeResults.length - 1].nationalAllocation;
  
  // Índices de Gallagher
  const gallagherDHondt = gallagherIndex(nationalVotes, dHondtResult.national);
  const gallagherGIME = gallagherIndex(nationalVotes, gimeNational);
  
  // Comparación
  const comparison = compareAllocations(dHondtResult.national, gimeNational);
  
  // ===== ÍNDICE DE GOBERNABILIDAD =====
  const MAJORITY = 176;
  
  // Definir bloques ideológicos para calcular gobernabilidad
  const GOVERNABILITY_COALITIONS = {
    derechas: ["PP", "VOX"],
    derechasExtendido: ["PP", "VOX", "UPN", "CCA"],
    izquierdas: ["PSOE", "SUMAR"],
    izquierdasNacionalistas: ["PSOE", "SUMAR", "ERC", "JUNTS", "PNV", "BILDU", "BNG", "CCA"],
    granCoalicion: ["PP", "PSOE"],
  };
  
  // Calcular índice de gobernabilidad para un conjunto de escaños
  const calculateGovernabilityIndex = (seats: {[party: string]: number}) => {
    const results: {coalition: string, seats: number, surplus: number, viable: boolean}[] = [];
    
    for (const [name, parties] of Object.entries(GOVERNABILITY_COALITIONS)) {
      const total = parties.reduce((sum, p) => sum + (seats[p] || 0), 0);
      const surplus = total - MAJORITY;
      results.push({
        coalition: name,
        seats: total,
        surplus,
        viable: total >= MAJORITY
      });
    }
    
    // Índice: combinación de factores
    // 1. ¿Hay alguna coalición viable? (0-40 puntos)
    // 2. ¿Cuántas coaliciones son viables? (0-20 puntos)
    // 3. ¿Hay coalición de 2 partidos viable? (0-20 puntos)
    // 4. Margen de la mejor coalición (0-20 puntos)
    
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

  // Aplicar preset
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
        setVoteMultipliers(prev => ({
          ...prev,
          ...preset.multipliers
        }));
      }
    }
  };
  
  // Actualizar multiplicador individual
  const updateMultiplier = (party: string, value: number) => {
    setSelectedPreset("custom");
    setVoteMultipliers(prev => ({ ...prev, [party]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Panel de control principal */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">⚙️ Parámetros del Sistema Electoral</h2>
          
          {/* Presets */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">📊 Escenario predefinido</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  className={`btn btn-sm ${selectedPreset === key ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => applyPreset(key)}
                >
                  {preset.name}
                </button>
              ))}
              {selectedPreset === "custom" && (
                <span className="badge badge-secondary self-center">Personalizado</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Umbral electoral */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">🚫 Umbral electoral (barrera)</span>
                <span className="label-text-alt badge badge-primary">{threshold}%</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5"
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="range range-primary" 
              />
              <div className="flex justify-between text-xs px-2 mt-1 text-base-content/60">
                <span>0% (sin barrera)</span>
                <span>3% (actual)</span>
                <span>5% (Alemania)</span>
                <span>10%</span>
              </div>
              <div className="text-xs mt-2 text-info">
                💡 El umbral actual en España es 3% por circunscripción. Alemania usa 5% nacional.
              </div>
            </div>
            
            {/* Bonificación gobernabilidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">🏛️ Bonificación de gobernabilidad</span>
                <span className="label-text-alt badge badge-secondary">{governabilityBonus} escaños</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="5"
                value={governabilityBonus} 
                onChange={(e) => setGovernabilityBonus(parseInt(e.target.value))}
                className="range range-secondary" 
              />
              <div className="flex justify-between text-xs px-2 mt-1 text-base-content/60">
                <span>0 (puro)</span>
                <span>10</span>
                <span>20</span>
                <span>30 (máx)</span>
              </div>
              <div className="text-xs mt-2 text-info">
                💡 Escaños extra al partido ganador para facilitar gobierno. 0 = proporcionalidad pura.
                Grecia usa ~50 escaños de bonus.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de votos interactivo */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl">🗳️ Ajustar Votos por Partido</h2>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▲ Ocultar' : '▼ Mostrar controles'}
            </button>
          </div>
          
          <p className="text-base-content/70 mb-4">
            Mueve los sliders para simular escenarios "¿Qué pasaría si...?". 
            El multiplicador 1.0 = votos reales de 2023.
          </p>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(parties).filter(([key]) => nationalVotes[key]).map(([partyKey, partyInfo]) => {
                const currentVotes = nationalVotes[partyKey] || 0;
                const percentage = totalVotes > 0 ? (currentVotes / totalVotes * 100).toFixed(1) : 0;
                const multiplier = voteMultipliers[partyKey] || 1.0;
                
                return (
                  <div key={partyKey} className="form-control bg-base-200 p-3 rounded-lg">
                    <label className="label py-1">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: partyInfo.color }}
                        />
                        {partyKey}
                      </span>
                      <span className="label-text-alt">{percentage}% ({(currentVotes/1000000).toFixed(2)}M)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="1.5" 
                        step="0.05"
                        value={multiplier} 
                        onChange={(e) => updateMultiplier(partyKey, parseFloat(e.target.value))}
                        className="range range-xs flex-1"
                        style={{ accentColor: partyInfo.color }}
                      />
                      <span className="badge badge-sm w-14 justify-center">
                        x{multiplier.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-base-content/50 mt-1">
                      <span>-50%</span>
                      <span>Real</span>
                      <span>+50%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Resumen rápido de votos */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(nationalVotes)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([party, votes]) => (
                <div 
                  key={party}
                  className="badge badge-lg gap-1"
                  style={{ backgroundColor: parties[party]?.color || '#888', color: 'white' }}
                >
                  {party}: {(votes/1000000).toFixed(2)}M ({(votes/totalVotes*100).toFixed(1)}%)
                </div>
              ))
            }
          </div>
          
          {/* Guía de rangos */}
          <div className="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-bold">📐 Guía de rangos realistas</h3>
              <ul className="text-sm mt-1 space-y-1">
                <li><strong>x0.7-0.9:</strong> Caída significativa (escándalo, desgaste, fragmentación)</li>
                <li><strong>x1.0:</strong> Resultado real de 2023</li>
                <li><strong>x1.1-1.3:</strong> Crecimiento notable (buena campaña, arrastre del líder)</li>
                <li><strong>x1.3+:</strong> Escenario excepcional (colapso de rivales, ola electoral)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de desproporcionalidad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-error">
            <span className="text-3xl">📊</span>
          </div>
          <div className="stat-title">Índice Gallagher</div>
          <div className="stat-value text-error">{gallagherDHondt.toFixed(2)}</div>
          <div className="stat-desc">D'Hondt tradicional (más alto = más injusto)</div>
        </div>
        
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-success">
            <span className="text-3xl">📊</span>
          </div>
          <div className="stat-title">Índice Gallagher</div>
          <div className="stat-value text-success">{gallagherGIME.toFixed(2)}</div>
          <div className="stat-desc">Método GIME (más bajo = más justo)</div>
        </div>
        
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-accent">
            <span className="text-3xl">✨</span>
          </div>
          <div className="stat-title">Mejora en proporcionalidad</div>
          <div className="stat-value text-accent">
            {gallagherDHondt > 0 
              ? `${((gallagherDHondt - gallagherGIME) / gallagherDHondt * 100).toFixed(0)}%`
              : '—'
            }
          </div>
          <div className="stat-desc">Reducción de la desproporcionalidad</div>
        </div>
      </div>

      {/* Índice de Gobernabilidad */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">🏛️ Índice de Gobernabilidad</h2>
          <p className="text-base-content/70 mb-4">
            Mide la facilidad para formar gobierno considerando coaliciones viables. 
            Mayor = más fácil gobernar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* D'Hondt */}
            <div className="bg-base-200 rounded-box p-4">
              <h3 className="font-bold mb-2">D'Hondt (Sistema actual)</h3>
              <div className="flex items-center gap-4">
                <div 
                  className="radial-progress text-primary" 
                  style={{"--value": govDHondt.index, "--size": "5rem"} as React.CSSProperties}
                >
                  {govDHondt.index}
                </div>
                <div className="text-sm space-y-1">
                  <div>✓ {govDHondt.viableCoalitions} coaliciones viables</div>
                  <div>{govDHondt.hasTwoPartyMajority ? '✓' : '✗'} Mayoría bipartita posible</div>
                  <div>Mejor margen: {govDHondt.bestSurplus > 0 ? `+${govDHondt.bestSurplus}` : govDHondt.bestSurplus}</div>
                </div>
              </div>
            </div>
            
            {/* GIME */}
            <div className="bg-base-200 rounded-box p-4">
              <h3 className="font-bold mb-2">Método GIME</h3>
              <div className="flex items-center gap-4">
                <div 
                  className="radial-progress text-secondary" 
                  style={{"--value": govGIME.index, "--size": "5rem"} as React.CSSProperties}
                >
                  {govGIME.index}
                </div>
                <div className="text-sm space-y-1">
                  <div>✓ {govGIME.viableCoalitions} coaliciones viables</div>
                  <div>{govGIME.hasTwoPartyMajority ? '✓' : '✗'} Mayoría bipartita posible</div>
                  <div>Mejor margen: {govGIME.bestSurplus > 0 ? `+${govGIME.bestSurplus}` : govGIME.bestSurplus}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interpretación */}
          <div className="alert mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-bold">¿Cómo se calcula?</h3>
              <div className="text-sm">
                El índice (0-100) considera: existencia de coaliciones viables (40pts), 
                número de opciones (20pts), posibilidad de mayoría con solo 2 partidos (20pts), 
                y margen sobre mayoría absoluta (20pts).
              </div>
            </div>
          </div>
          
          {/* Detalle de coaliciones */}
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" />
            <div className="collapse-title font-medium">
              📋 Ver detalle de coaliciones evaluadas
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Coalición</th>
                      <th>D'Hondt</th>
                      <th>GIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {govDHondt.details.map((d, i) => (
                      <tr key={d.coalition}>
                        <td className="capitalize">{d.coalition.replace(/([A-Z])/g, ' $1').trim()}</td>
                        <td>
                          <span className={d.viable ? 'text-success font-bold' : ''}>
                            {d.seats} {d.viable && '✓'}
                          </span>
                        </td>
                        <td>
                          <span className={govGIME.details[i].viable ? 'text-success font-bold' : ''}>
                            {govGIME.details[i].seats} {govGIME.details[i].viable && '✓'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explicación del índice Gallagher */}
      <div className="alert shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <h3 className="font-bold">¿Qué es el Índice Gallagher?</h3>
          <div className="text-sm">
            Mide la desproporcionalidad entre votos y escaños. <strong>0 = perfecto</strong>, mayor = peor.
            <br/>
            <span className="text-xs">• España actual: ~5-6 | Países Bajos: ~1 | Reino Unido: ~15-20</span>
          </div>
        </div>
      </div>

      {/* Gráfico comparativo */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">📊 Comparación de Escaños: D'Hondt vs GIME</h2>
          <ComparisonChart 
            dHondt={dHondtResult.national} 
            gime={gimeNational}
            parties={parties}
          />
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">📋 Resultados Detallados</h2>
          <ResultsTable 
            dHondt={dHondtResult.national}
            gime={gimeNational}
            votes={nationalVotes}
            parties={parties}
          />
        </div>
      </div>

      {/* Diferencias */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">↔️ ¿Quién gana/pierde con GIME?</h2>
          <p className="text-base-content/70 mb-4">
            Diferencia de escaños entre el sistema actual (D'Hondt) y el método GIME.
            Verde = gana escaños, Rojo = pierde escaños.
          </p>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Partido</th>
                  <th>% Votos</th>
                  <th>D'Hondt</th>
                  <th>GIME</th>
                  <th>Diferencia</th>
                  <th>Análisis</th>
                </tr>
              </thead>
              <tbody>
                {comparison
                  .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
                  .filter(c => c.method1 > 0 || c.method2 > 0)
                  .map((c) => {
                    const voteShare = nationalVotes[c.party] 
                      ? (nationalVotes[c.party] / totalVotes * 100).toFixed(1)
                      : '0';
                    const seatShareDHondt = (c.method1 / totalSeats * 100).toFixed(1);
                    const seatShareGIME = (c.method2 / totalSeats * 100).toFixed(1);
                    
                    return (
                      <tr key={c.party}>
                        <td className="font-semibold">
                          <span 
                            className="badge badge-lg" 
                            style={{ backgroundColor: parties[c.party]?.color || '#888', color: 'white' }}
                          >
                            {c.party}
                          </span>
                        </td>
                        <td>{voteShare}%</td>
                        <td>{c.method1} ({seatShareDHondt}%)</td>
                        <td>{c.method2} ({seatShareGIME}%)</td>
                        <td>
                          {c.diff !== 0 && (
                            <span className={`badge ${c.diff > 0 ? 'badge-success' : 'badge-error'}`}>
                              {c.diff > 0 ? '+' : ''}{c.diff}
                            </span>
                          )}
                          {c.diff === 0 && <span className="badge badge-ghost">0</span>}
                        </td>
                        <td className="text-xs text-base-content/60">
                          {c.diff > 0 && '↑ Infrarrepresentado actualmente'}
                          {c.diff < 0 && '↓ Sobrerrepresentado actualmente'}
                          {c.diff === 0 && '≈ Bien representado'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Etapas del algoritmo GIME */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">🔍 Etapas del Método GIME</h2>
          <p className="text-base-content/70 mb-4">
            El método GIME funciona en etapas sucesivas. Haz clic para ver el detalle de cada una.
          </p>
          <div className="space-y-2">
            {gimeResults.map((stage, i) => (
              <div key={i} className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="gime-stages" defaultChecked={i === 0} />
                <div className="collapse-title text-md font-medium">
                  <span className="badge badge-primary mr-2">Etapa {stage.stage}</span>
                  {stage.description.split(':')[0]}
                </div>
                <div className="collapse-content">
                  <p className="mb-4 text-base-content/70">{stage.description}</p>
                  {stage.iterations && (
                    <div className="badge badge-info mb-2">
                      ⚙️ Convergencia en {stage.iterations} iteraciones
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stage.nationalAllocation)
                      .filter(([_, seats]) => seats > 0)
                      .sort((a, b) => b[1] - a[1])
                      .map(([party, seats]) => (
                        <div 
                          key={party}
                          className="badge badge-lg gap-1"
                          style={{ backgroundColor: parties[party]?.color || '#888', color: 'white' }}
                        >
                          {party}: {seats}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pactómetro integrado */}
      <div className="divider text-xl font-bold mt-12">🤝 Pactómetro</div>
      <p className="text-center text-base-content/70 mb-6">
        Explora coaliciones y calcula qué pactos alcanzan mayoría absoluta
      </p>
      <Pactometro 
        dHondtSeats={dHondtResult.national}
        gimeSeats={gimeNational}
      />
    </div>
  );
}
