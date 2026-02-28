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
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Partido</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Votos</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">% Votos</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">D&apos;Hondt</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">% Esc.</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">GIME</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">% Esc.</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Desv. D&apos;H</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Desv. GIME</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const deviationDHondt = row.dHondtShare - row.voteShare;
            const deviationGIME = row.gimeShare - row.voteShare;

            return (
              <tr key={row.party} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="font-medium text-navy">{row.party}</span>
                  </div>
                </td>
                <td className="text-right px-4 py-3 font-mono text-xs text-body-text">
                  {row.votes.toLocaleString("es-ES")}
                </td>
                <td className="text-right px-4 py-3 font-mono text-xs text-body-text">
                  {row.voteShare.toFixed(2)}%
                </td>
                <td className="text-right px-4 py-3 font-mono font-semibold text-navy">
                  {row.dHondt}
                </td>
                <td className="text-right px-4 py-3 font-mono text-xs text-muted-text">
                  {row.dHondtShare.toFixed(2)}%
                </td>
                <td className="text-right px-4 py-3 font-mono font-semibold text-navy">
                  {row.gime}
                </td>
                <td className="text-right px-4 py-3 font-mono text-xs text-muted-text">
                  {row.gimeShare.toFixed(2)}%
                </td>
                <td className="text-right px-4 py-3">
                  <DeviationBadge value={deviationDHondt} />
                </td>
                <td className="text-right px-4 py-3">
                  <DeviationBadge value={deviationGIME} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50/50 font-semibold text-navy">
            <td className="px-4 py-3">TOTAL</td>
            <td className="text-right px-4 py-3 font-mono text-xs">{totalVotes.toLocaleString("es-ES")}</td>
            <td className="text-right px-4 py-3 font-mono text-xs">100%</td>
            <td className="text-right px-4 py-3 font-mono">{totalSeatsDHondt}</td>
            <td className="text-right px-4 py-3 font-mono text-xs">100%</td>
            <td className="text-right px-4 py-3 font-mono">{totalSeatsGIME}</td>
            <td className="text-right px-4 py-3 font-mono text-xs">100%</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function DeviationBadge({ value }: { value: number }) {
  const abs = Math.abs(value);
  let bgColor = "bg-emerald-50 text-emerald-700";
  if (abs >= 2) bgColor = "bg-red-50 text-red-700";
  else if (abs >= 0.5) bgColor = "bg-amber-50 text-amber-700";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${bgColor}`}>
      {value > 0 ? "+" : ""}{value.toFixed(2)}
    </span>
  );
}
