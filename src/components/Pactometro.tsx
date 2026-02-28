"use client";

import React, { useState, useMemo } from "react";
import { parties } from "@/data/elections2023";

interface PactometroProps {
  dHondtSeats: { [party: string]: number };
  gimeSeats: { [party: string]: number };
}

// Pactos históricos/realistas predefinidos
const PRESET_COALITIONS = {
  derechas: {
    name: "Bloque de derechas",
    description: "PP + VOX (como en gobiernos autonómicos)",
    parties: ["PP", "VOX"],
    color: "#0056a3",
    emoji: "🔵"
  },
  derechasExtendido: {
    name: "Derechas + regionalistas",
    description: "PP + VOX + UPN + CC",
    parties: ["PP", "VOX", "UPN", "CCA"],
    color: "#0056a3",
    emoji: "🔵"
  },
  izquierdas: {
    name: "Bloque de izquierdas",
    description: "PSOE + SUMAR (como gobierno actual)",
    parties: ["PSOE", "SUMAR"],
    color: "#e30613",
    emoji: "🔴"
  },
  frankestein: {
    name: "Gobierno Frankenstein",
    description: "PSOE + SUMAR + ERC + Junts + PNV + Bildu + BNG + CC",
    parties: ["PSOE", "SUMAR", "ERC", "JUNTS", "PNV", "BILDU", "BNG", "CCA"],
    color: "#e30613",
    emoji: "🧟"
  },
  granCoalicion: {
    name: "Gran Coalición",
    description: "PP + PSOE (estilo alemán)",
    parties: ["PP", "PSOE"],
    color: "#800080",
    emoji: "🟣"
  },
};

const TOTAL_SEATS = 350; // Tamaño fijo del Congreso de los Diputados
const MAJORITY_THRESHOLD = 176; // Mayoría absoluta en el Congreso (350/2 + 1)

export default function Pactometro({ dHondtSeats, gimeSeats }: PactometroProps) {
  const [method, setMethod] = useState<"dhondt" | "gime">("dhondt");
  const [customCoalition, setCustomCoalition] = useState<string[]>([]);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  
  const seats = method === "dhondt" ? dHondtSeats : gimeSeats;
  const totalSeats = TOTAL_SEATS; // Siempre 350, independiente del método
  
  // Calcular escaños de una coalición
  const getCoalitionSeats = (partyList: string[]) => {
    return partyList.reduce((sum, party) => sum + (seats[party] || 0), 0);
  };
  
  // Calcular todas las coaliciones predefinidas
  const coalitionResults = useMemo(() => {
    return Object.entries(PRESET_COALITIONS).map(([key, coalition]) => {
      const totalSeatsCoalition = getCoalitionSeats(coalition.parties);
      const hasMajority = totalSeatsCoalition >= MAJORITY_THRESHOLD;
      const seatsNeeded = Math.max(0, MAJORITY_THRESHOLD - totalSeatsCoalition);
      
      return {
        key,
        ...coalition,
        seats: totalSeatsCoalition,
        hasMajority,
        seatsNeeded,
        percentage: (totalSeatsCoalition / totalSeats * 100).toFixed(1)
      };
    });
  }, [seats, totalSeats]);
  
  // Coalición personalizada
  const customCoalitionSeats = getCoalitionSeats(customCoalition);
  const customHasMajority = customCoalitionSeats >= MAJORITY_THRESHOLD;
  
  // Partidos disponibles para seleccionar
  const availableParties = Object.keys(seats).filter(p => seats[p] > 0);
  
  // Toggle partido en coalición personalizada
  const togglePartyInCoalition = (party: string) => {
    setCustomCoalition(prev => 
      prev.includes(party) 
        ? prev.filter(p => p !== party)
        : [...prev, party]
    );
  };
  
  // Encontrar coaliciones mínimas ganadoras
  const minWinningCoalitions = useMemo(() => {
    const results: { parties: string[], seats: number }[] = [];
    const sortedParties = availableParties.sort((a, b) => seats[b] - seats[a]);
    
    // Buscar combinaciones de 2 partidos
    for (let i = 0; i < sortedParties.length; i++) {
      for (let j = i + 1; j < sortedParties.length; j++) {
        const combo = [sortedParties[i], sortedParties[j]];
        const total = getCoalitionSeats(combo);
        if (total >= MAJORITY_THRESHOLD) {
          results.push({ parties: combo, seats: total });
        }
      }
    }
    
    // Buscar combinaciones de 3 partidos si no hay de 2
    if (results.length < 3) {
      for (let i = 0; i < Math.min(sortedParties.length, 6); i++) {
        for (let j = i + 1; j < Math.min(sortedParties.length, 6); j++) {
          for (let k = j + 1; k < Math.min(sortedParties.length, 6); k++) {
            const combo = [sortedParties[i], sortedParties[j], sortedParties[k]];
            const total = getCoalitionSeats(combo);
            if (total >= MAJORITY_THRESHOLD && total < MAJORITY_THRESHOLD + 30) {
              results.push({ parties: combo, seats: total });
            }
          }
        }
      }
    }
    
    return results
      .sort((a, b) => a.parties.length - b.parties.length || a.seats - b.seats)
      .slice(0, 6);
  }, [seats, availableParties]);

  return (
    <div className="space-y-6">
      {/* Selector de método */}
      <div className="flex justify-center">
        <div className="btn-group">
          <button 
            className={`btn ${method === 'dhondt' ? 'btn-active btn-primary' : ''}`}
            onClick={() => setMethod('dhondt')}
          >
            D'Hondt (Actual)
          </button>
          <button 
            className={`btn ${method === 'gime' ? 'btn-active btn-secondary' : ''}`}
            onClick={() => setMethod('gime')}
          >
            Método GIME
          </button>
        </div>
      </div>
      
      {/* Barra de mayoría */}
      <div className="card bg-base-200">
        <div className="card-body py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Mayoría absoluta</span>
            <span className="badge badge-lg badge-primary">{MAJORITY_THRESHOLD} escaños</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-4 relative">
            <div 
              className="bg-primary h-4 rounded-full"
              style={{ width: `${MAJORITY_THRESHOLD / totalSeats * 100}%` }}
            />
            <div 
              className="absolute top-0 left-1/2 w-0.5 h-full bg-error"
              style={{ left: `${MAJORITY_THRESHOLD / totalSeats * 100}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1 text-base-content/60">
            {MAJORITY_THRESHOLD} de {totalSeats} escaños necesarios para gobernar
          </div>
        </div>
      </div>

      {/* Escaños actuales por partido */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title text-lg">📊 Escaños por partido ({method === 'dhondt' ? 'D\'Hondt' : 'GIME'})</h3>
          <div className="flex flex-wrap gap-2">
            {availableParties
              .sort((a, b) => seats[b] - seats[a])
              .map(party => (
                <div 
                  key={party}
                  className="badge badge-lg gap-1 py-3"
                  style={{ backgroundColor: parties[party]?.color || '#888', color: 'white' }}
                >
                  {party}: {seats[party]}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Pactos predefinidos */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl">🤝 Pactos Predefinidos</h3>
          <p className="text-base-content/70 mb-4">
            Coaliciones basadas en pactos históricos o ideológicamente viables.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coalitionResults.map(coalition => (
              <div 
                key={coalition.key}
                className={`card ${coalition.hasMajority ? 'bg-success/10 border-success' : 'bg-base-200'} border-2`}
              >
                <div className="card-body py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <span>{coalition.emoji}</span>
                        {coalition.name}
                      </h4>
                      <p className="text-xs text-base-content/60">{coalition.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${coalition.hasMajority ? 'text-success' : 'text-base-content'}`}>
                        {coalition.seats}
                      </div>
                      <div className="text-xs text-base-content/60">{coalition.percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-base-300 rounded-full h-3 mt-2">
                    <div 
                      className={`h-3 rounded-full transition-all ${coalition.hasMajority ? 'bg-success' : 'bg-warning'}`}
                      style={{ width: `${Math.min(100, coalition.seats / MAJORITY_THRESHOLD * 100)}%` }}
                    />
                  </div>
                  
                  {/* Partidos de la coalición */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {coalition.parties.map(party => (
                      <span 
                        key={party}
                        className="badge badge-sm"
                        style={{ backgroundColor: parties[party]?.color || '#888', color: 'white' }}
                      >
                        {party} ({seats[party] || 0})
                      </span>
                    ))}
                  </div>
                  
                  {/* Estado */}
                  <div className="mt-2">
                    {coalition.hasMajority ? (
                      <span className="badge badge-success gap-1">
                        ✅ Mayoría absoluta (+{coalition.seats - MAJORITY_THRESHOLD})
                      </span>
                    ) : (
                      <span className="badge badge-warning gap-1">
                        ⚠️ Faltan {coalition.seatsNeeded} escaños
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coaliciones mínimas ganadoras */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl">🎯 Coaliciones Mínimas Ganadoras</h3>
          <p className="text-base-content/70 mb-4">
            Las combinaciones más pequeñas que alcanzan mayoría absoluta.
          </p>
          
          {minWinningCoalitions.length > 0 ? (
            <div className="space-y-2">
              {minWinningCoalitions.map((combo, i) => (
                <div key={i} className="flex items-center justify-between bg-base-200 rounded-lg p-3">
                  <div className="flex flex-wrap gap-1">
                    {combo.parties.map(party => (
                      <span 
                        key={party}
                        className="badge badge-lg"
                        style={{ backgroundColor: parties[party]?.color || '#888', color: 'white' }}
                      >
                        {party} ({seats[party]})
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-success">{combo.seats}</span>
                    <span className="text-xs text-base-content/60 ml-1">escaños</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning">
              No se encontraron coaliciones de 2-3 partidos que alcancen mayoría.
            </div>
          )}
        </div>
      </div>

      {/* Constructor de coalición personalizada */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="card-title text-xl">🔧 Constructor de Pactos</h3>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowCustomBuilder(!showCustomBuilder)}
            >
              {showCustomBuilder ? '▲ Ocultar' : '▼ Mostrar'}
            </button>
          </div>
          
          {showCustomBuilder && (
            <>
              <p className="text-base-content/70 mb-4">
                Selecciona partidos para crear tu propia coalición.
              </p>
              
              {/* Selector de partidos */}
              <div className="flex flex-wrap gap-2 mb-4">
                {availableParties
                  .sort((a, b) => seats[b] - seats[a])
                  .map(party => {
                    const isSelected = customCoalition.includes(party);
                    return (
                      <button
                        key={party}
                        onClick={() => togglePartyInCoalition(party)}
                        className={`btn btn-sm gap-1 ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        style={isSelected ? { backgroundColor: parties[party]?.color, borderColor: parties[party]?.color } : {}}
                      >
                        {isSelected && '✓'} {party} ({seats[party]})
                      </button>
                    );
                  })
                }
              </div>
              
              {/* Resultado de la coalición personalizada */}
              {customCoalition.length > 0 && (
                <div className={`alert ${customHasMajority ? 'alert-success' : 'alert-warning'}`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold">Tu coalición: {customCoalition.join(' + ')}</h4>
                        <p className="text-sm">
                          {customCoalitionSeats} escaños ({(customCoalitionSeats / totalSeats * 100).toFixed(1)}%)
                        </p>
                      </div>
                      <div className="text-3xl font-bold">
                        {customCoalitionSeats}
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-base-300 rounded-full h-4 mt-2">
                      <div 
                        className={`h-4 rounded-full ${customHasMajority ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${Math.min(100, customCoalitionSeats / MAJORITY_THRESHOLD * 100)}%` }}
                      />
                    </div>
                    
                    <p className="text-sm mt-2">
                      {customHasMajority 
                        ? `✅ ¡Mayoría absoluta! Sobran ${customCoalitionSeats - MAJORITY_THRESHOLD} escaños.`
                        : `⚠️ Faltan ${MAJORITY_THRESHOLD - customCoalitionSeats} escaños para mayoría absoluta.`
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {customCoalition.length === 0 && (
                <div className="alert">
                  <span>👆 Selecciona partidos arriba para crear una coalición</span>
                </div>
              )}
              
              {/* Botón de reset */}
              {customCoalition.length > 0 && (
                <button 
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => setCustomCoalition([])}
                >
                  🗑️ Limpiar selección
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comparativa D'Hondt vs GIME en pactos */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl">⚖️ ¿Cambian los pactos con GIME?</h3>
          <p className="text-base-content/70 mb-4">
            Comparativa de viabilidad de pactos entre el sistema actual y GIME.
          </p>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Pacto</th>
                  <th>D'Hondt</th>
                  <th>GIME</th>
                  <th>Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PRESET_COALITIONS).map(([key, coalition]) => {
                  const dhondtTotal = coalition.parties.reduce((sum, p) => sum + (dHondtSeats[p] || 0), 0);
                  const gimeTotal = coalition.parties.reduce((sum, p) => sum + (gimeSeats[p] || 0), 0);
                  const diff = gimeTotal - dhondtTotal;
                  const dhondtMajority = dhondtTotal >= MAJORITY_THRESHOLD;
                  const gimeMajority = gimeTotal >= MAJORITY_THRESHOLD;
                  
                  return (
                    <tr key={key}>
                      <td>
                        <span className="font-semibold">{coalition.emoji} {coalition.name}</span>
                        <br/>
                        <span className="text-xs text-base-content/60">{coalition.parties.join(' + ')}</span>
                      </td>
                      <td>
                        <span className={dhondtMajority ? 'text-success font-bold' : ''}>
                          {dhondtTotal}
                        </span>
                        {dhondtMajority && <span className="badge badge-success badge-xs ml-1">✓</span>}
                      </td>
                      <td>
                        <span className={gimeMajority ? 'text-success font-bold' : ''}>
                          {gimeTotal}
                        </span>
                        {gimeMajority && <span className="badge badge-success badge-xs ml-1">✓</span>}
                      </td>
                      <td>
                        {diff !== 0 && (
                          <span className={`badge ${diff > 0 ? 'badge-success' : 'badge-error'}`}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        )}
                        {diff === 0 && <span className="badge badge-ghost">0</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
