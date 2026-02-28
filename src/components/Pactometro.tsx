"use client";

import React, { useState, useMemo } from "react";
import { parties } from "@/data/elections2023";

interface PactometroProps {
  dHondtSeats: { [party: string]: number };
  gimeSeats: { [party: string]: number };
}

const PRESET_COALITIONS = {
  granCoalicion: {
    name: "Gran Coalición",
    description: "PP + PSOE (estilo alemán)",
    parties: ["PP", "PSOE"],
  },
  frankestein: {
    name: "Gobierno Frankenstein",
    description: "PSOE + SUMAR + ERC + Junts + PNV + Bildu + BNG + CC",
    parties: ["PSOE", "SUMAR", "ERC", "JUNTS", "PNV", "BILDU", "BNG", "CCA"],
  },
  derechasExtendido: {
    name: "Derechas + regionalistas",
    description: "PP + VOX + UPN + CC",
    parties: ["PP", "VOX", "UPN", "CCA"],
  },
  derechas: {
    name: "Bloque de derechas",
    description: "PP + VOX",
    parties: ["PP", "VOX"],
  },
  izquierdas: {
    name: "Bloque de izquierdas",
    description: "PSOE + SUMAR",
    parties: ["PSOE", "SUMAR"],
  },
};

const TOTAL_SEATS = 350;
const MAJORITY_THRESHOLD = 176;

export default function Pactometro({ dHondtSeats, gimeSeats }: PactometroProps) {
  const [method, setMethod] = useState<"dhondt" | "gime">("dhondt");
  const [customCoalition, setCustomCoalition] = useState<string[]>([]);

  const seats = method === "dhondt" ? dHondtSeats : gimeSeats;

  const getCoalitionSeats = (partyList: string[]) => {
    return partyList.reduce((sum, party) => sum + (seats[party] || 0), 0);
  };

  // Coalitions sorted by total seats (highest first)
  const coalitionResults = useMemo(() => {
    return Object.entries(PRESET_COALITIONS)
      .map(([key, coalition]) => {
        const totalSeatsCoalition = getCoalitionSeats(coalition.parties);
        return {
          key,
          ...coalition,
          seats: totalSeatsCoalition,
          hasMajority: totalSeatsCoalition >= MAJORITY_THRESHOLD,
          seatsNeeded: Math.max(0, MAJORITY_THRESHOLD - totalSeatsCoalition),
          percentage: (totalSeatsCoalition / TOTAL_SEATS * 100).toFixed(1),
        };
      })
      .sort((a, b) => b.seats - a.seats);
  }, [seats]);

  const customCoalitionSeats = getCoalitionSeats(customCoalition);
  const customHasMajority = customCoalitionSeats >= MAJORITY_THRESHOLD;
  const availableParties = Object.keys(seats).filter(p => seats[p] > 0);

  const togglePartyInCoalition = (party: string) => {
    setCustomCoalition(prev =>
      prev.includes(party) ? prev.filter(p => p !== party) : [...prev, party]
    );
  };

  // Min winning coalitions
  const minWinningCoalitions = useMemo(() => {
    const results: { parties: string[], seats: number }[] = [];
    const sortedParties = [...availableParties].sort((a, b) => seats[b] - seats[a]);

    for (let i = 0; i < sortedParties.length; i++) {
      for (let j = i + 1; j < sortedParties.length; j++) {
        const combo = [sortedParties[i], sortedParties[j]];
        const total = getCoalitionSeats(combo);
        if (total >= MAJORITY_THRESHOLD) {
          results.push({ parties: combo, seats: total });
        }
      }
    }
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
    return results.sort((a, b) => a.parties.length - b.parties.length || a.seats - b.seats).slice(0, 6);
  }, [seats, availableParties]);

  return (
    <div className="space-y-8">
      {/* Method toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-0.5">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              method === "dhondt" ? "bg-navy text-white" : "text-muted-text hover:text-body-text"
            }`}
            onClick={() => setMethod("dhondt")}
          >
            D&apos;Hondt (Actual)
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              method === "gime" ? "bg-navy text-white" : "text-muted-text hover:text-body-text"
            }`}
            onClick={() => setMethod("gime")}
          >
            Método GIME
          </button>
        </div>
      </div>

      {/* Majority bar */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-navy">Mayoría absoluta</span>
          <span className="text-xs font-mono bg-navy text-white px-2 py-0.5 rounded-full">{MAJORITY_THRESHOLD} escaños</span>
        </div>
        {/* Seat bar */}
        <div className="w-full h-6 rounded-full bg-gray-200 relative overflow-hidden flex">
          {availableParties
            .sort((a, b) => seats[b] - seats[a])
            .filter(p => seats[p] > 0)
            .map(party => (
              <div
                key={party}
                className="h-full relative group"
                style={{
                  width: `${(seats[party] / TOTAL_SEATS) * 100}%`,
                  backgroundColor: parties[party]?.color || "#888",
                }}
                title={`${party}: ${seats[party]}`}
              />
            ))}
          {/* Majority line */}
          <div
            className="absolute top-0 w-0.5 h-full bg-navy"
            style={{ left: `${(MAJORITY_THRESHOLD / TOTAL_SEATS) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {availableParties
            .sort((a, b) => seats[b] - seats[a])
            .filter(p => seats[p] > 0)
            .map(party => (
              <span key={party} className="inline-flex items-center gap-1 text-[10px] text-muted-text">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: parties[party]?.color || "#888" }} />
                {party} {seats[party]}
              </span>
            ))}
        </div>
      </div>

      {/* Preset coalitions — 2-column grid sorted by seats */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-2">Pactos predefinidos</h4>
        <p className="text-xs text-muted-text mb-4">Coaliciones basadas en pactos históricos o ideológicamente viables.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coalitionResults.map(coalition => (
            <div
              key={coalition.key}
              className={`rounded-xl p-4 border ${
                coalition.hasMajority ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="font-medium text-navy text-sm">{coalition.name}</h5>
                  <p className="text-[10px] text-muted-text">{coalition.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-serif ${coalition.hasMajority ? "text-emerald-600" : "text-navy"}`}>
                    {coalition.seats}
                  </span>
                  <span className="text-[10px] text-muted-text block">{coalition.percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${coalition.hasMajority ? "bg-emerald-500" : "bg-amber-400"}`}
                  style={{ width: `${Math.min(100, (coalition.seats / MAJORITY_THRESHOLD) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {coalition.parties.map(party => (
                    <span
                      key={party}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white font-medium"
                      style={{ backgroundColor: parties[party]?.color || "#888" }}
                    >
                      {party} {seats[party] || 0}
                    </span>
                  ))}
                </div>
                {coalition.hasMajority ? (
                  <span className="text-[10px] font-medium text-emerald-600">+{coalition.seats - MAJORITY_THRESHOLD} sobre mayoría</span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-600">Faltan {coalition.seatsNeeded}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Min winning coalitions */}
      {minWinningCoalitions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-navy mb-4">Coaliciones mínimas ganadoras</h4>
          <div className="space-y-2">
            {minWinningCoalitions.map((combo, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <div className="flex flex-wrap gap-1">
                  {combo.parties.map(party => (
                    <span
                      key={party}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: parties[party]?.color || "#888" }}
                    >
                      {party} {seats[party]}
                    </span>
                  ))}
                </div>
                <span className="font-serif text-lg text-emerald-600">{combo.seats}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom coalition builder — always visible */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">Constructor de pactos</h4>
        <p className="text-xs text-muted-text mb-4">Selecciona partidos para crear tu propia coalición.</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {availableParties
            .sort((a, b) => seats[b] - seats[a])
            .map(party => {
              const isSelected = customCoalition.includes(party);
              return (
                <button
                  key={party}
                  onClick={() => togglePartyInCoalition(party)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "text-white ring-2 ring-offset-1"
                      : "bg-gray-100 text-muted-text hover:bg-gray-200"
                  }`}
                  style={isSelected ? { backgroundColor: parties[party]?.color, borderColor: parties[party]?.color } : {}}
                >
                  {isSelected && "✓ "}{party} ({seats[party]})
                </button>
              );
            })}
        </div>

        {customCoalition.length > 0 && (
          <div className={`rounded-xl p-4 ${customHasMajority ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-sm text-navy">{customCoalition.join(" + ")}</span>
                <span className="text-xs text-muted-text ml-2">
                  {customCoalitionSeats} escaños ({(customCoalitionSeats / TOTAL_SEATS * 100).toFixed(1)}%)
                </span>
              </div>
              <span className="text-2xl font-serif text-navy">{customCoalitionSeats}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-200">
              <div
                className={`h-2.5 rounded-full ${customHasMajority ? "bg-emerald-500" : "bg-amber-400"}`}
                style={{ width: `${Math.min(100, (customCoalitionSeats / MAJORITY_THRESHOLD) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-body-text">
                {customHasMajority
                  ? `Mayoría absoluta (+${customCoalitionSeats - MAJORITY_THRESHOLD} escaños)`
                  : `Faltan ${MAJORITY_THRESHOLD - customCoalitionSeats} escaños para mayoría`
                }
              </p>
              <button
                className="text-xs text-muted-text hover:text-body-text"
                onClick={() => setCustomCoalition([])}
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        {customCoalition.length === 0 && (
          <div className="rounded-xl bg-gray-50 p-4 text-xs text-muted-text text-center">
            Selecciona partidos para crear una coalición
          </div>
        )}
      </div>

      {/* Comparison table */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-4">¿Cambian los pactos con GIME?</h4>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Pacto</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">D&apos;Hondt</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">GIME</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Dif.</th>
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
                  <tr key={key} className="border-b border-gray-50">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-navy">{coalition.name}</span>
                      <br />
                      <span className="text-[10px] text-muted-text">{coalition.parties.join(" + ")}</span>
                    </td>
                    <td className="text-right px-4 py-2.5">
                      <span className={dhondtMajority ? "font-semibold text-emerald-600" : "text-body-text"}>
                        {dhondtTotal}
                      </span>
                      {dhondtMajority && <span className="text-emerald-500 ml-1 text-[10px]">✓</span>}
                    </td>
                    <td className="text-right px-4 py-2.5">
                      <span className={gimeMajority ? "font-semibold text-emerald-600" : "text-body-text"}>
                        {gimeTotal}
                      </span>
                      {gimeMajority && <span className="text-emerald-500 ml-1 text-[10px]">✓</span>}
                    </td>
                    <td className="text-right px-4 py-2.5">
                      {diff !== 0 ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          diff > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                          {diff > 0 ? "+" : ""}{diff}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-text">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
