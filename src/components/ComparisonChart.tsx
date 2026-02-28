"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { PartyInfo } from "@/data/elections2023";

interface Props {
  dHondt: { [party: string]: number };
  gime: { [party: string]: number };
  parties: { [key: string]: PartyInfo };
}

export default function ComparisonChart({ dHondt, gime, parties }: Props) {
  // Preparar datos para el gráfico
  const allParties = new Set([...Object.keys(dHondt), ...Object.keys(gime)]);
  
  const data = Array.from(allParties)
    .map(party => ({
      name: party,
      "D'Hondt": dHondt[party] || 0,
      "GIME": gime[party] || 0,
      color: parties[party]?.color || "#888888"
    }))
    .filter(d => d["D'Hondt"] > 0 || d["GIME"] > 0)
    .sort((a, b) => b["D'Hondt"] - a["D'Hondt"]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            tick={{ fill: 'currentColor' }}
            label={{ value: 'Escaños', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))',
              borderColor: 'var(--fallback-b3,oklch(var(--b3)/1))',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Bar 
            dataKey="D'Hondt" 
            fill="#6366f1" 
            name="D'Hondt Tradicional"
          />
          <Bar 
            dataKey="GIME" 
            fill="#10b981" 
            name="Método GIME"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
