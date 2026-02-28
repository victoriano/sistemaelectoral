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
} from "recharts";
import { PartyInfo } from "@/data/elections2023";

interface Props {
  dHondt: { [party: string]: number };
  gime: { [party: string]: number };
  parties: { [key: string]: PartyInfo };
}

export default function ComparisonChart({ dHondt, gime, parties }: Props) {
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

  const chartHeight = Math.max(300, data.length * 48);

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis
            type="number"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar
            dataKey="D'Hondt"
            fill="#6366f1"
            name="D'Hondt Tradicional"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
          <Bar
            dataKey="GIME"
            fill="#10b981"
            name="Método GIME"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
