"use client";

import React, { useMemo, useState } from "react";

type PartyId = "A" | "B" | "C" | "D";
type ProvincePartyId = "azul" | "rojo" | "verde" | "naranja";

interface PartyConfig {
  id: PartyId;
  name: string;
  color: string;
  bg: string;
  soft: string;
  border: string;
}

interface ProvincePartyConfig {
  id: ProvincePartyId;
  name: string;
  color: string;
  bg: string;
  soft: string;
  border: string;
}

interface Province {
  name: string;
  seats: number;
  votes: Record<ProvincePartyId, number>;
}

interface QuotientCell {
  partyId: PartyId;
  divisor: number;
  value: number;
  rank: number | null;
}

interface Stage {
  id: number;
  title: string;
  kicker: string;
  description: string;
  matrix: number[][];
  rowState: ("ok" | "warn")[];
  colState: ("ok" | "warn")[];
  badge: string;
}

const dHondtParties: PartyConfig[] = [
  {
    id: "A",
    name: "PP",
    color: "text-[#0056a3]",
    bg: "bg-[#0056a3]",
    soft: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: "B",
    name: "PSOE",
    color: "text-[#e30613]",
    bg: "bg-[#e30613]",
    soft: "bg-red-50",
    border: "border-red-200",
  },
  {
    id: "C",
    name: "VOX",
    color: "text-[#63be21]",
    bg: "bg-[#63be21]",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "D" as PartyId,
    name: "SUMAR",
    color: "text-[#e51c55]",
    bg: "bg-[#e51c55]",
    soft: "bg-pink-50",
    border: "border-pink-200",
  },
];

const provinceParties: ProvincePartyConfig[] = [
  {
    id: "azul",
    name: "Mayoritario azul",
    color: "text-sky-700",
    bg: "bg-sky-600",
    soft: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    id: "rojo",
    name: "Mayoritario rojo",
    color: "text-rose-700",
    bg: "bg-rose-600",
    soft: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    id: "verde",
    name: "Partido estatal disperso",
    color: "text-emerald-700",
    bg: "bg-emerald-600",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "naranja",
    name: "Partido regional concentrado",
    color: "text-amber-700",
    bg: "bg-amber-500",
    soft: "bg-amber-50",
    border: "border-amber-200",
  },
];

const provinceData: Province[] = [
  {
    name: "Madrid",
    seats: 10,
    votes: { azul: 420000, rojo: 360000, verde: 55000, naranja: 0 },
  },
  {
    name: "Soria",
    seats: 2,
    votes: { azul: 22000, rojo: 18000, verde: 8000, naranja: 0 },
  },
  {
    name: "Barcelona",
    seats: 8,
    votes: { azul: 280000, rojo: 260000, verde: 45000, naranja: 210000 },
  },
  {
    name: "País Vasco",
    seats: 5,
    votes: { azul: 120000, rojo: 95000, verde: 18000, naranja: 180000 },
  },
];

const walkthroughStages: Stage[] = [
  {
    id: 0,
    kicker: "Paso 1",
    title: "Empezamos con el reparto provincial clásico",
    description:
      "Cada provincia reparte sus escaños por separado. El mapa cuadra, pero el partido verde se queda fuera aunque suma muchos votos.",
    matrix: [
      [6, 4, 0, 0],
      [1, 1, 0, 0],
      [3, 3, 0, 2],
      [1, 1, 0, 3],
    ],
    rowState: ["ok", "ok", "ok", "ok"],
    colState: ["warn", "ok", "warn", "ok"],
    badge: "Las provincias cuadran; los partidos no.",
  },
  {
    id: 1,
    kicker: "Paso 2",
    title: "Ajustamos el volumen de cada partido",
    description:
      "Subimos el peso del verde y bajamos un poco el azul. Ahora los totales nacionales encajan, pero aparecen decimales y alguna provincia se descompensa.",
    matrix: [
      [5.4, 4.0, 0.6, 0.0],
      [0.8, 0.9, 0.3, 0.0],
      [2.8, 2.4, 0.1, 2.7],
      [1.0, 1.7, 0.0, 2.3],
    ],
    rowState: ["ok", "ok", "warn", "ok"],
    colState: ["ok", "ok", "ok", "ok"],
    badge: "Los partidos cuadran; falta cerrar bien las provincias.",
  },
  {
    id: 2,
    kicker: "Paso 3",
    title: "Repetimos el reparto con esos pesos ajustados",
    description:
      "El algoritmo itera hasta conseguir enteros y respetar las dos reglas a la vez: cuántos escaños tiene cada provincia y cuántos merece cada partido.",
    matrix: [
      [5, 4, 1, 0],
      [1, 1, 0, 0],
      [3, 2, 0, 3],
      [1, 2, 0, 2],
    ],
    rowState: ["ok", "ok", "ok", "ok"],
    colState: ["ok", "ok", "ok", "ok"],
    badge: "Cuadran provincias y partidos.",
  },
];

function formatVotes(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}

function formatCompact(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function computeDhondt(votes: Record<PartyId, number>, seats: number) {
  const quotients: QuotientCell[] = [];

  dHondtParties.forEach((party) => {
    for (let divisor = 1; divisor <= seats; divisor += 1) {
      quotients.push({
        partyId: party.id,
        divisor,
        value: votes[party.id] / divisor,
        rank: null,
      });
    }
  });

  const ordered = [...quotients].sort((left, right) => {
    if (right.value !== left.value) return right.value - left.value;
    return left.divisor - right.divisor;
  });

  const winners = ordered.slice(0, seats);
  const winnerMap = new Map<string, number>();
  const seatCount = { A: 0, B: 0, C: 0, D: 0 } as Record<PartyId, number>;

  winners.forEach((winner, index) => {
    winnerMap.set(`${winner.partyId}-${winner.divisor}`, index + 1);
    seatCount[winner.partyId] += 1;
  });

  const table = dHondtParties.map((party) =>
    Array.from({ length: seats }, (_, index) => {
      const divisor = index + 1;
      return {
        partyId: party.id,
        divisor,
        value: votes[party.id] / divisor,
        rank: winnerMap.get(`${party.id}-${divisor}`) ?? null,
      };
    })
  );

  return { winners, seatCount, table };
}

function computeProvinceSeats(votes: Record<ProvincePartyId, number>, seats: number) {
  const quotients = provinceParties.flatMap((party) =>
    Array.from({ length: seats }, (_, index) => ({
      partyId: party.id,
      value: votes[party.id] / (index + 1),
    }))
  );

  const winners = quotients
    .sort((left, right) => right.value - left.value)
    .slice(0, seats);

  return winners.reduce<Record<ProvincePartyId, number>>(
    (acc, winner) => {
      acc[winner.partyId] += 1;
      return acc;
    },
    { azul: 0, rojo: 0, verde: 0, naranja: 0 }
  );
}

export default function MethodExplainer() {
  const [votes, setVotes] = useState<Record<PartyId, number>>({
    A: 147623,
    B: 131567,
    C: 64312,
    D: 46478,
  });
  const [activeSeat, setActiveSeat] = useState<number>(7);
  const [activeStage, setActiveStage] = useState<number>(2);

  const seats = 7;
  const dHondt = useMemo(() => computeDhondt(votes, seats), [votes]);

  const provinceResults = useMemo(
    () =>
      provinceData.map((province) => ({
        ...province,
        seatAllocation: computeProvinceSeats(province.votes, province.seats),
      })),
    []
  );

  const nationalTotals = useMemo(() => {
    return provinceParties.reduce(
      (acc, party) => {
        const totalVotes = provinceData.reduce((sum, province) => sum + province.votes[party.id], 0);
        const totalSeats = provinceResults.reduce((sum, province) => sum + province.seatAllocation[party.id], 0);
        acc[party.id] = { votes: totalVotes, seats: totalSeats };
        return acc;
      },
      {} as Record<ProvincePartyId, { votes: number; seats: number }>
    );
  }, [provinceResults]);

  const biproNationalSeats = {
    azul: 10,
    rojo: 9,
    verde: 1,
    naranja: 5,
  } satisfies Record<ProvincePartyId, number>;

  const currentStage = walkthroughStages[activeStage];

  const handleVoteChange = (partyId: PartyId, nextValue: number) => {
    setVotes((current) => ({
      ...current,
      [partyId]: Math.max(0, nextValue),
    }));
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 md:px-8">
          <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-2">Parte 1</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl md:text-3xl text-navy">Cómo funciona D&apos;Hondt</h3>
              <p className="text-sm text-muted-text mt-2">
                Ejemplo real: <strong>Granada, elecciones 23J 2023</strong> (7 escaños). Cada escaño va al cociente más alto de la tabla.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm text-muted-text">
              Desliza los votos y mira cómo cambian los escaños en tiempo real.
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              {dHondtParties.map((party) => (
                <div key={party.id} className={`rounded-2xl border ${party.border} ${party.soft} p-4 transition-all duration-300`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${party.bg}`} />
                      <div>
                        <p className={`text-sm font-semibold ${party.color}`}>{party.name}</p>
                        <p className="text-xs text-muted-text">Granada 23J</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={votes[party.id]}
                      min={0}
                      step={5000}
                      onChange={(event) => handleVoteChange(party.id, Number(event.target.value))}
                      className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2 text-right text-sm text-navy outline-none transition-all duration-300 focus:border-navy"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={160000}
                    step={5000}
                    value={votes[party.id]}
                    onChange={(event) => handleVoteChange(party.id, Number(event.target.value))}
                    className="mt-4 w-full accent-current"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-text">
                    <span>0</span>
                    <span>{formatVotes(votes[party.id])} votos</span>
                    <span>160.000</span>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-3">Es el orden de los premios</p>
                <div className="flex flex-wrap gap-2">
                  {dHondt.winners.map((winner, index) => {
                    const party = dHondtParties.find((item) => item.id === winner.partyId)!;

                    return (
                      <button
                        key={`${winner.partyId}-${winner.divisor}`}
                        type="button"
                        onMouseEnter={() => setActiveSeat(index + 1)}
                        onFocus={() => setActiveSeat(index + 1)}
                        onClick={() => setActiveSeat(index + 1)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          activeSeat === index + 1
                            ? `${party.soft} ${party.color} ${party.border}`
                            : "border-gray-200 bg-white text-muted-text"
                        }`}
                      >
                        {index + 1}.º escaño
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-muted-text">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Partido</th>
                      {Array.from({ length: seats }, (_, index) => (
                        <th key={index} className="px-4 py-3 text-center font-medium">
                          ÷ {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dHondt.table.map((row, rowIndex) => {
                      const party = dHondtParties[rowIndex];

                      return (
                        <tr key={party.id} className="border-t border-gray-100">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className={`h-3 w-3 rounded-full ${party.bg}`} />
                              <span className="font-semibold text-navy">{party.name}</span>
                            </div>
                          </td>
                          {row.map((cell) => {
                            const isWon = cell.rank !== null;
                            const isVisible = cell.rank !== null && cell.rank <= activeSeat;

                            return (
                              <td key={`${cell.partyId}-${cell.divisor}`} className="px-2 py-2">
                                <div
                                  className={`relative rounded-2xl border px-3 py-3 text-center transition-all duration-300 ${
                                    isVisible
                                      ? `${party.soft} ${party.border} shadow-sm`
                                      : isWon
                                        ? "border-gray-200 bg-white/80"
                                        : "border-transparent bg-white"
                                  }`}
                                >
                                  <div className={`text-sm font-semibold ${isVisible ? party.color : "text-body-text"}`}>
                                    {Math.round(cell.value / 1000)}k
                                  </div>
                                  {isWon && (
                                    <div
                                      className={`absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white transition-all duration-300 ${
                                        isVisible ? party.bg : "bg-gray-300"
                                      }`}
                                    >
                                      {cell.rank}
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-2">Qué está pasando</p>
                  <p className="text-sm text-body-text leading-relaxed">
                    El <strong>{activeSeat}.º escaño</strong> se asigna a{" "}
                    <strong>
                      {dHondtParties.find(
                        (party) => party.id === dHondt.winners[Math.max(activeSeat - 1, 0)]?.partyId
                      )?.name ?? "ningún partido"}
                    </strong>{" "}
                    porque su cociente es el más alto entre los que quedan.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-3">Resultado final</p>
                  <div className="space-y-3">
                    {dHondtParties.map((party) => (
                      <div key={party.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${party.bg}`} />
                          <span className="text-sm text-body-text">{party.name}</span>
                        </div>
                        <span className="text-lg font-serif text-navy">
                          {dHondt.seatCount[party.id]} escaño{dHondt.seatCount[party.id] === 1 ? "" : "s"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
                En Granada 23J: PP consigue 3 escaños, PSOE 3 y VOX 1. <strong>Los {formatVotes(votes.D)} votantes de SUMAR se quedan sin representación.</strong>
                {" "}En D&apos;Hondt, esos votos simplemente se pierden. Prueba a mover los deslizadores para ver cuántos votos necesitaría SUMAR para conseguir escaño.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 md:px-8">
          <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-2">Parte 2</p>
          <h3 className="font-serif text-2xl md:text-3xl text-navy">El problema a escala nacional</h3>
          <p className="text-sm text-muted-text mt-2 max-w-2xl">
            Cuando el voto está repartido por todo el país, puede no bastar en ninguna provincia. En cambio, el voto concentrado sí convierte apoyo en escaños.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
            <div className="space-y-4">
              {provinceResults.map((province) => {
                const maxVotes = Math.max(...provinceParties.map((party) => province.votes[party.id]));

                return (
                  <div key={province.name} className="rounded-2xl border border-gray-200 p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="font-semibold text-navy">{province.name}</h4>
                        <p className="text-xs text-muted-text">{province.seats} escaños en juego</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {provinceParties.map((party) => (
                          <span
                            key={`${province.name}-${party.id}-seats`}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${party.soft} ${party.color}`}
                          >
                            {party.name.split(" ")[0]}: {province.seatAllocation[party.id]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {provinceParties.map((party) => (
                        <div key={`${province.name}-${party.id}`} className="grid grid-cols-[140px_1fr_auto] items-center gap-3">
                          <span className={`text-xs font-medium ${party.color}`}>{party.name}</span>
                          <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${party.bg} transition-all duration-300`}
                              style={{ width: `${(province.votes[party.id] / maxVotes) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-text">{formatVotes(province.votes[party.id])}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-4">Resumen nacional</p>
                <div className="space-y-3">
                  {provinceParties.map((party) => (
                    <div key={party.id} className={`rounded-2xl border ${party.border} bg-white p-4`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`text-sm font-semibold ${party.color}`}>{party.name}</p>
                          <p className="text-xs text-muted-text">{formatVotes(nationalTotals[party.id].votes)} votos</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-serif text-navy">{nationalTotals[party.id].seats} escaños</div>
                          <div className="text-xs text-muted-text">con D&apos;Hondt provincial</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h4 className="font-semibold text-navy mb-2">Lo que castiga el sistema</h4>
                <p className="text-sm text-body-text leading-relaxed">
                  El <strong>partido estatal disperso</strong> suma <strong>{formatVotes(nationalTotals.verde.votes)} votos</strong> y
                  obtiene <strong>0 escaños</strong>, porque nunca llega a entrar en el reparto de ninguna provincia.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h4 className="font-semibold text-navy mb-2">Lo que premia el sistema</h4>
                <p className="text-sm text-body-text leading-relaxed">
                  El <strong>partido regional concentrado</strong> reúne <strong>{formatVotes(nationalTotals.naranja.votes)} votos</strong> y
                  consigue <strong>{nationalTotals.naranja.seats} escaños</strong>, porque sus apoyos se concentran justo donde compite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 md:px-8">
          <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-2">Parte 3</p>
          <h3 className="font-serif text-2xl md:text-3xl text-navy">Cómo lo resuelve el biproporcional</h3>
          <p className="text-sm text-muted-text mt-2 max-w-2xl">
            Primero decide cuántos escaños merece cada partido en toda España. Después los coloca en las provincias sin romper el mapa.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-2">Paso 1. Reparto nacional</p>
              <p className="text-sm text-body-text leading-relaxed">
                Sumamos todos los votos y aplicamos D&apos;Hondt una sola vez. Así cada partido sabe cuántos escaños le corresponden en total.
              </p>
              <div className="mt-4 space-y-2">
                {provinceParties.map((party) => (
                  <div key={`national-${party.id}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${party.bg}`} />
                      <span className="text-body-text">{party.name}</span>
                    </div>
                    <span className="font-serif text-navy">{biproNationalSeats[party.id]} escaños</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
                Ahora cada voto cuenta igual, sin importar si se emitió en Madrid, Soria o Bilbao.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-2">Paso 2. Colocar los escaños</p>
              <p className="text-sm text-body-text leading-relaxed">
                Piensa en una tabla de doble entrada: filas para provincias, columnas para partidos. El algoritmo ajusta pesos hasta equilibrar ambos lados.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-gray-50 px-3 py-2 text-body-text">Multiplicador azul: 0,92x</div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 text-body-text">Multiplicador rojo: 1,01x</div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 text-body-text">Multiplicador verde: 1,36x</div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 text-body-text">Multiplicador naranja: 1,00x</div>
              </div>
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                La intuición: subimos el volumen del partido infrarepresentado y bajamos un poco el del sobrerrepresentado.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-2">Paso 3. Verificación</p>
              <div className="space-y-3 text-sm text-body-text">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  ✅ Cada provincia mantiene exactamente sus escaños.
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  ✅ Cada partido obtiene exactamente sus escaños nacionales.
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
                  El resultado combina representación territorial y proporcionalidad nacional.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-1">{currentStage.kicker}</p>
                <h4 className="font-serif text-xl text-navy">{currentStage.title}</h4>
                <p className="text-sm text-muted-text mt-2 max-w-2xl">{currentStage.description}</p>
              </div>
              <div className="flex gap-2">
                {walkthroughStages.map((stage, index) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStage(index)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      activeStage === index
                        ? "bg-navy text-white"
                        : "bg-gray-100 text-muted-text hover:bg-gray-200"
                    }`}
                  >
                    {stage.kicker}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-2 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-text">
                      Provincia
                    </th>
                    {provinceParties.map((party) => (
                      <th key={party.id} className={`px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider ${party.color}`}>
                        {party.name.split(" ")[0]}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-text">
                      Total provincia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {provinceData.map((province, provinceIndex) => (
                    <tr key={`matrix-${province.name}`}>
                      <td className="rounded-2xl bg-gray-50 px-4 py-3 font-semibold text-navy">{province.name}</td>
                      {provinceParties.map((party, partyIndex) => (
                        <td key={`matrix-${province.name}-${party.id}`}>
                          <div className={`rounded-2xl border px-4 py-3 text-center transition-all duration-300 ${party.border} ${party.soft}`}>
                            <div className={`text-base font-serif ${party.color}`}>
                              {formatCompact(currentStage.matrix[provinceIndex][partyIndex])}
                            </div>
                          </div>
                        </td>
                      ))}
                      <td>
                        <div
                          className={`rounded-2xl border px-4 py-3 text-center font-semibold transition-all duration-300 ${
                            currentStage.rowState[provinceIndex] === "ok"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {formatCompact(
                            currentStage.matrix[provinceIndex].reduce((sum, value) => sum + value, 0)
                          )}{" "}
                          / {province.seats}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="rounded-2xl bg-gray-50 px-4 py-3 font-semibold text-navy">Total partido</td>
                    {provinceParties.map((party, partyIndex) => (
                      <td key={`total-${party.id}`}>
                        <div
                          className={`rounded-2xl border px-4 py-3 text-center font-semibold transition-all duration-300 ${
                            currentStage.colState[partyIndex] === "ok"
                              ? `${party.border} ${party.soft} ${party.color}`
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {formatCompact(
                            currentStage.matrix.reduce((sum, row) => sum + row[partyIndex], 0)
                          )}{" "}
                          / {biproNationalSeats[party.id]}
                        </div>
                      </td>
                    ))}
                    <td className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center font-semibold text-navy">
                      {currentStage.matrix
                        .flat()
                        .reduce((sum, value) => sum + value, 0)}{" "}
                      / 25
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-body-text">
              <strong>{currentStage.badge}</strong> El biproporcional itera hasta lograr ambas cosas a la vez.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
