"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { computeImpactSummary } from "@/lib/impact-stats";
import { canonicalParties } from "@/data/party-aliases";

const DHONDT_COLOR = "#6366f1";
const BIPROP_COLOR = "#10b981";

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

function partyColor(party: string): string {
  return canonicalParties[party]?.color || "#94a3b8";
}

/** Verde/rojo con intensidad proporcional a la magnitud de la diferencia. */
function heatColor(diff: number, maxAbs: number): string {
  if (diff === 0) return "transparent";
  const alpha = 0.15 + 0.75 * Math.min(1, Math.abs(diff) / maxAbs);
  return diff > 0 ? `rgba(16, 185, 129, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
}

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "0.75rem",
  fontSize: 13,
};

export default function ImpactDashboard() {
  const summary = useMemo(() => computeImpactSummary(), []);
  const { elections } = summary;

  const partyDiffData = useMemo(
    () =>
      Object.entries(summary.totalDiffByParty)
        .filter(([, d]) => d !== 0)
        .sort((a, b) => b[1] - a[1])
        .map(([party, diff]) => ({ party, diff })),
    [summary]
  );

  const heatmapParties = useMemo(
    () =>
      Object.entries(summary.totalDiffByParty)
        .map(([party, total]) => ({
          party,
          total,
          sumAbs: elections.reduce((s, e) => s + Math.abs(e.diff[party] || 0), 0),
        }))
        .filter(p => p.sumAbs > 0)
        .sort((a, b) => b.sumAbs - a.sumAbs)
        .slice(0, 14),
    [summary, elections]
  );

  const heatMaxAbs = useMemo(
    () =>
      Math.max(
        1,
        ...heatmapParties.flatMap(p => elections.map(e => Math.abs(e.diff[p.party] || 0)))
      ),
    [heatmapParties, elections]
  );

  const evolutionData = elections.map(e => ({
    year: SHORT_YEAR[e.year] || e.year,
    fullYear: e.year,
    "D'Hondt": +e.gallagherDHondt.toFixed(2),
    Biproporcional: +e.gallagherBiprop.toFixed(2),
    wastedDHondt: +e.wastedDHondtPct.toFixed(1),
    wastedBiprop: +e.wastedBipropPct.toFixed(1),
    seatsMoved: e.seatsMoved,
  }));

  const avgSeatsMoved = summary.totalSeatsMoved / elections.length;

  return (
    <div className="space-y-16">
      {/* ===== RESUMEN ===== */}
      <section id="resumen" className="scroll-mt-32">
        <h2 className="font-serif text-3xl text-navy mb-2">El impacto, de un vistazo</h2>
        <p className="text-body-text text-sm mb-8 max-w-2xl">
          Resultado de aplicar el método biproporcional (barrera del 3% en al menos una
          circunscripción, sin bonus de gobernabilidad) a las {elections.length} elecciones
          generales celebradas entre 1993 y 2023, comparado con el reparto D&apos;Hondt real.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="text-3xl font-semibold text-navy">{summary.totalSeatsMoved}</div>
            <div className="text-xs text-muted-text mt-1">
              escaños habrían cambiado de manos ({avgSeatsMoved.toFixed(0)} de media por elección)
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="text-3xl font-semibold text-navy">
              {summary.avgGallagherDHondt.toFixed(1)}
              <span className="text-muted-text mx-1 text-xl">→</span>
              <span className="text-emerald-600">{summary.avgGallagherBiprop.toFixed(1)}</span>
            </div>
            <div className="text-xs text-muted-text mt-1">
              índice de Gallagher medio (desproporcionalidad, menos es mejor)
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="text-3xl font-semibold text-navy">
              {summary.avgWastedDHondtPct.toFixed(1)}%
              <span className="text-muted-text mx-1 text-xl">→</span>
              <span className="text-emerald-600">{summary.avgWastedBipropPct.toFixed(1)}%</span>
            </div>
            <div className="text-xs text-muted-text mt-1">
              votos sin escaño en su provincia (media)
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="text-3xl font-semibold text-navy">
              {summary.electionsImproved}/{elections.length}
            </div>
            <div className="text-xs text-muted-text mt-1">
              elecciones con menor desproporcionalidad bajo el biproporcional
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-body-text mb-3">
          Escaños que cambian de manos en cada elección
        </h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={evolutionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [`${v} escaños`, "Cambian de manos"]}
                labelFormatter={(label: string) =>
                  elections.find(e => (SHORT_YEAR[e.year] || e.year) === label)?.name || label
                }
              />
              <Bar dataKey="seatsMoved" fill="#0f2557" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== GANADORES / PERDEDORES ===== */}
      <section id="ganadores" className="scroll-mt-32">
        <h2 className="font-serif text-3xl text-navy mb-2">Ganadores y perdedores históricos</h2>
        <p className="text-body-text text-sm mb-6 max-w-2xl">
          Escaños que cada partido habría ganado (verde, derecha) o perdido (rojo, izquierda)
          sumando las {elections.length} elecciones. El biproporcional corrige la prima de los
          dos grandes partidos y reparte ese exceso entre las fuerzas medianas de ámbito
          nacional; los partidos territoriales apenas varían.
        </p>
        <div style={{ width: "100%", height: Math.max(280, partyDiffData.length * 34) }}>
          <ResponsiveContainer>
            <BarChart
              data={partyDiffData}
              layout="vertical"
              margin={{ top: 5, right: 50, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis
                type="category"
                dataKey="party"
                tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <ReferenceLine x={0} stroke="#9ca3af" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [v > 0 ? `+${v} escaños` : `${v} escaños`, "1993–2023"]}
              />
              <Bar dataKey="diff" radius={[0, 4, 4, 0]} barSize={18}>
                {partyDiffData.map(d => (
                  <Cell key={d.party} fill={partyColor(d.party)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== MATRIZ ===== */}
      <section id="matriz" className="scroll-mt-32">
        <h2 className="font-serif text-3xl text-navy mb-2">Partido a partido, elección a elección</h2>
        <p className="text-body-text text-sm mb-6 max-w-2xl">
          Diferencia de escaños (biproporcional − D&apos;Hondt) por partido en cada elección.
          Verde: ganaría escaños; rojo: los perdería. Los {heatmapParties.length} partidos con
          mayor variación acumulada.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th className="text-left pr-3 py-1 font-semibold text-body-text sticky left-0 bg-white">
                  Partido
                </th>
                {elections.map(e => (
                  <th key={e.year} className="px-1 py-1 font-medium text-muted-text text-center w-12">
                    {SHORT_YEAR[e.year] || e.year}
                  </th>
                ))}
                <th className="pl-3 py-1 font-semibold text-body-text text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {heatmapParties.map(({ party, total }) => (
                <tr key={party}>
                  <td className="pr-3 py-0.5 font-medium sticky left-0 bg-white whitespace-nowrap">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                      style={{ backgroundColor: partyColor(party) }}
                    />
                    {party}
                  </td>
                  {elections.map(e => {
                    const d = e.diff[party] || 0;
                    const inElection =
                      (e.dhondt[party] || 0) > 0 ||
                      (e.biprop[party] || 0) > 0 ||
                      d !== 0;
                    return (
                      <td
                        key={e.year}
                        className="text-center rounded w-12 h-7 font-medium tabular-nums"
                        style={{ backgroundColor: heatColor(d, heatMaxAbs) }}
                        title={`${party} · ${e.name}: D'Hondt ${e.dhondt[party] || 0} → Biprop ${e.biprop[party] || 0}`}
                      >
                        {d !== 0 ? (d > 0 ? `+${d}` : d) : inElection ? "·" : ""}
                      </td>
                    );
                  })}
                  <td
                    className={`pl-3 text-center font-semibold tabular-nums ${
                      total > 0 ? "text-emerald-600" : total < 0 ? "text-red-500" : "text-muted-text"
                    }`}
                  >
                    {total > 0 ? `+${total}` : total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-text mt-2">
          · = el partido concurrió con el mismo resultado en ambos métodos. Celdas vacías: no concurrió
          (o concurrió bajo otra marca: CiU→CDC→Junts, IU dentro de Sumar desde 2023, etc.).
        </p>
      </section>

      {/* ===== EVOLUCIÓN ===== */}
      <section id="evolucion" className="scroll-mt-32">
        <h2 className="font-serif text-3xl text-navy mb-2">Tres décadas de desproporcionalidad</h2>
        <p className="text-body-text text-sm mb-6 max-w-2xl">
          Índice de Gallagher (cuánto se desvía el reparto de escaños del reparto de votos) y
          porcentaje de votos emitidos en provincias donde el partido votado no obtuvo escaño.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-body-text mb-3">Índice de Gallagher</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis domain={[0, 8]} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="D'Hondt" stroke={DHONDT_COLOR} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Biproporcional" stroke={BIPROP_COLOR} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-body-text mb-3">Votos sin escaño en su provincia</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis
                    domain={[0, 12]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="wastedDHondt" name="D'Hondt" stroke={DHONDT_COLOR} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="wastedBiprop" name="Biproporcional" stroke={BIPROP_COLOR} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-100 p-5 text-xs text-muted-text leading-relaxed">
          <span className="font-semibold text-body-text">Metodología.</span> Datos oficiales por
          circunscripción del Ministerio del Interior (todas las candidaturas y votos en blanco).
          Biproporcional calculado con barrera del 3% de votos válidos en al menos una
          circunscripción y sin bonus de gobernabilidad; D&apos;Hondt con la barrera provincial del
          3% de la LOREG. &ldquo;Votos sin escaño en su provincia&rdquo; usa la misma métrica para
          ambos métodos: votos a candidaturas en circunscripciones donde el partido no obtuvo
          ningún escaño. Verificable con <code>npm run verify:impact</code>.
        </div>
      </section>
    </div>
  );
}
