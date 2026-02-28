"use client";

import React from "react";
import { PartyInfo } from "@/data/elections2023";

interface Props {
  dHondt: { [party: string]: number };
  gime: { [party: string]: number };
  votes: { [party: string]: number };
  parties: { [key: string]: PartyInfo };
}

export default function ResultsTable({ dHondt, gime, votes, parties }: Props) {
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const totalSeatsDHondt = Object.values(dHondt).reduce((a, b) => a + b, 0);
  const totalSeatsGIME = Object.values(gime).reduce((a, b) => a + b, 0);
  
  const allParties = new Set([...Object.keys(dHondt), ...Object.keys(gime)]);
  
  const data = Array.from(allParties)
    .map(party => ({
      party,
      votes: votes[party] || 0,
      voteShare: ((votes[party] || 0) / totalVotes * 100),
      dHondt: dHondt[party] || 0,
      dHondtShare: ((dHondt[party] || 0) / totalSeatsDHondt * 100),
      gime: gime[party] || 0,
      gimeShare: ((gime[party] || 0) / totalSeatsGIME * 100),
      color: parties[party]?.color || "#888888"
    }))
    .filter(d => d.votes > 0)
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Partido</th>
            <th className="text-right">Votos</th>
            <th className="text-right">% Votos</th>
            <th className="text-right">Escaños D'Hondt</th>
            <th className="text-right">% Escaños</th>
            <th className="text-right">Escaños GIME</th>
            <th className="text-right">% Escaños</th>
            <th className="text-right">Desviación D'H</th>
            <th className="text-right">Desviación GIME</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const deviationDHondt = row.dHondtShare - row.voteShare;
            const deviationGIME = row.gimeShare - row.voteShare;
            
            return (
              <tr key={row.party}>
                <td>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="font-semibold">{row.party}</span>
                  </div>
                </td>
                <td className="text-right font-mono">
                  {row.votes.toLocaleString('es-ES')}
                </td>
                <td className="text-right font-mono">
                  {row.voteShare.toFixed(2)}%
                </td>
                <td className="text-right font-mono font-bold">
                  {row.dHondt}
                </td>
                <td className="text-right font-mono">
                  {row.dHondtShare.toFixed(2)}%
                </td>
                <td className="text-right font-mono font-bold">
                  {row.gime}
                </td>
                <td className="text-right font-mono">
                  {row.gimeShare.toFixed(2)}%
                </td>
                <td className="text-right">
                  <span className={`badge badge-sm ${
                    Math.abs(deviationDHondt) < 0.5 ? 'badge-success' :
                    Math.abs(deviationDHondt) < 2 ? 'badge-warning' : 'badge-error'
                  }`}>
                    {deviationDHondt > 0 ? '+' : ''}{deviationDHondt.toFixed(2)}
                  </span>
                </td>
                <td className="text-right">
                  <span className={`badge badge-sm ${
                    Math.abs(deviationGIME) < 0.5 ? 'badge-success' :
                    Math.abs(deviationGIME) < 2 ? 'badge-warning' : 'badge-error'
                  }`}>
                    {deviationGIME > 0 ? '+' : ''}{deviationGIME.toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td>TOTAL</td>
            <td className="text-right">{totalVotes.toLocaleString('es-ES')}</td>
            <td className="text-right">100%</td>
            <td className="text-right">{totalSeatsDHondt}</td>
            <td className="text-right">100%</td>
            <td className="text-right">{totalSeatsGIME}</td>
            <td className="text-right">100%</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
