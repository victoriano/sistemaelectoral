"use client";

import React, { useState } from "react";
import { PartyInfo } from "@/data/elections2023";

interface Props {
  dHondt: { [party: string]: number };
  gime: { [party: string]: number };
  votes: { [party: string]: number };
  parties: { [key: string]: PartyInfo };
}

type SortKey = "party" | "votes" | "voteShare" | "dHondt" | "dHondtShare" | "gime" | "gimeShare" | "diff" | "deviationDHondt" | "deviationGIME";

export default function ResultsTable({ dHondt, gime, votes, parties }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("votes");
  const [sortAsc, setSortAsc] = useState(false);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const totalSeatsDHondt = Object.values(dHondt).reduce((a, b) => a + b, 0);
  const totalSeatsGIME = Object.values(gime).reduce((a, b) => a + b, 0);

  const allParties = new Set([...Object.keys(dHondt), ...Object.keys(gime)]);

  const data = Array.from(allParties)
    .map(party => {
      const voteShare = (votes[party] || 0) / totalVotes * 100;
      const dHondtShare = (dHondt[party] || 0) / totalSeatsDHondt * 100;
      const gimeShare = (gime[party] || 0) / totalSeatsGIME * 100;
      return {
        party,
        votes: votes[party] || 0,
        voteShare,
        dHondt: dHondt[party] || 0,
        dHondtShare,
        gime: gime[party] || 0,
        gimeShare,
        diff: (gime[party] || 0) - (dHondt[party] || 0),
        deviationDHondt: dHondtShare - voteShare,
        deviationGIME: gimeShare - voteShare,
        color: parties[party]?.color || "#888888"
      };
    })
    .filter(d => d.votes > 0)
    .sort((a, b) => {
      const aVal = sortKey === "party" ? a.party : a[sortKey];
      const bVal = sortKey === "party" ? b.party : b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "party"); // alphabetical asc by default, numbers desc
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <Th column="party" label="Partido" align="left" sortKey={sortKey} onSort={handleSort}><SortIcon column="party" /></Th>
            <Th column="votes" label="Votos" align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="votes" /></Th>
            <Th column="voteShare" label="% Votos" align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="voteShare" /></Th>
            <Th column="dHondt" label="D'Hondt" align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="dHondt" /></Th>
            <Th column="dHondtShare" label="% Esc." align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="dHondtShare" /></Th>
            <Th column="gime" label="Biprop." align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="gime" /></Th>
            <Th column="gimeShare" label="% Esc." align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="gimeShare" /></Th>
            <Th column="diff" label="Dif." align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="diff" /></Th>
            <Th column="deviationDHondt" label="Desv. D'H" align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="deviationDHondt" /></Th>
            <Th column="deviationGIME" label="Desv. Biprop." align="right" sortKey={sortKey} onSort={handleSort}><SortIcon column="deviationGIME" /></Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
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
                <DiffBadge value={row.diff} />
              </td>
              <td className="text-right px-4 py-3">
                <DeviationBadge value={row.deviationDHondt} />
              </td>
              <td className="text-right px-4 py-3">
                <DeviationBadge value={row.deviationGIME} />
              </td>
            </tr>
          ))}
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
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Th({ column, label, align, sortKey, onSort, children }: {
  column: SortKey;
  label: string;
  align: "left" | "right";
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <th
      className={`${align === "left" ? "text-left" : "text-right"} px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider cursor-pointer hover:text-navy select-none transition-colors ${sortKey === column ? "text-navy" : ""}`}
      onClick={() => onSort(column)}
    >
      {label}{children}
    </th>
  );
}

function DiffBadge({ value }: { value: number }) {
  if (value === 0) return <span className="font-mono text-xs text-muted-text">0</span>;
  const color = value > 0
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-700";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${color}`}>
      {value > 0 ? "+" : ""}{value}
    </span>
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
