"use client";

import React, { useState, useRef, useEffect } from "react";

interface CircumscriptionData {
  name: string;
  shortName: string;
  seats: number;
}

interface Props {
  circumscriptions: CircumscriptionData[];
  selectedCirc: string | null;
  onSelect: (name: string | null) => void;
}

// Población por provincia (INE 2023)
const populationData: { [key: string]: number } = {
  "Madrid": 6751251, "Barcelona": 5714730, "Valencia": 2589312, "Sevilla": 1950219,
  "Alicante": 1881762, "Málaga": 1717504, "Murcia": 1531878, "Cádiz": 1244049,
  "Vizcaya": 1154778, "A Coruña": 1122799, "Las Palmas": 1131065, "Asturias": 1011792,
  "Islas Baleares": 1173008, "Santa Cruz de Tenerife": 1056641, "Zaragoza": 972528,
  "Granada": 919168, "Pontevedra": 947374, "Tarragona": 816772, "Córdoba": 781451,
  "Girona": 781788, "Guipúzcoa": 727121, "Almería": 727945, "Toledo": 703772,
  "Badajoz": 672137, "Navarra": 661197, "Jaén": 631381, "Castellón": 585590,
  "Cantabria": 584507, "Valladolid": 520649, "Ciudad Real": 502578, "Huelva": 524278,
  "León": 456439, "Lleida": 453025, "Cáceres": 391850, "Albacete": 396987,
  "Burgos": 357070, "Álava": 333940, "Salamanca": 329245, "Lugo": 327946,
  "La Rioja": 319914, "Ourense": 306650, "Guadalajara": 267629, "Huesca": 222687,
  "Cuenca": 196139, "Zamora": 170588, "Palencia": 160321, "Ávila": 158498,
  "Segovia": 153478, "Teruel": 134176, "Soria": 88884, "Ceuta": 83517, "Melilla": 87076,
};

const provinceCoords: { [key: string]: { x: number; y: number } } = {
  "A Coruña": { x: 8, y: 18 }, "Lugo": { x: 14, y: 20 }, "Ourense": { x: 14, y: 28 },
  "Pontevedra": { x: 8, y: 28 }, "Asturias": { x: 22, y: 16 }, "Cantabria": { x: 30, y: 16 },
  "Vizcaya": { x: 38, y: 14 }, "Guipúzcoa": { x: 42, y: 12 }, "Álava": { x: 38, y: 20 },
  "Navarra": { x: 46, y: 18 }, "La Rioja": { x: 40, y: 26 }, "Huesca": { x: 52, y: 20 },
  "Zaragoza": { x: 50, y: 30 }, "Teruel": { x: 54, y: 40 }, "Lleida": { x: 58, y: 26 },
  "Girona": { x: 68, y: 22 }, "Barcelona": { x: 66, y: 32 }, "Tarragona": { x: 60, y: 36 },
  "León": { x: 22, y: 26 }, "Palencia": { x: 30, y: 28 }, "Burgos": { x: 34, y: 26 },
  "Soria": { x: 42, y: 32 }, "Segovia": { x: 36, y: 38 }, "Ávila": { x: 28, y: 40 },
  "Salamanca": { x: 20, y: 40 }, "Zamora": { x: 18, y: 34 }, "Valladolid": { x: 28, y: 34 },
  "Madrid": { x: 36, y: 46 }, "Guadalajara": { x: 44, y: 42 }, "Cuenca": { x: 50, y: 48 },
  "Toledo": { x: 34, y: 54 }, "Ciudad Real": { x: 36, y: 64 }, "Albacete": { x: 50, y: 62 },
  "Castellón": { x: 60, y: 46 }, "Valencia": { x: 58, y: 54 }, "Alicante": { x: 58, y: 64 },
  "Murcia": { x: 54, y: 72 }, "Cáceres": { x: 20, y: 52 }, "Badajoz": { x: 18, y: 64 },
  "Huelva": { x: 14, y: 76 }, "Sevilla": { x: 22, y: 76 }, "Córdoba": { x: 30, y: 72 },
  "Jaén": { x: 38, y: 72 }, "Granada": { x: 38, y: 80 }, "Almería": { x: 48, y: 80 },
  "Málaga": { x: 30, y: 86 }, "Cádiz": { x: 18, y: 88 }, "Islas Baleares": { x: 76, y: 50 },
  "Las Palmas": { x: 8, y: 96 }, "Santa Cruz de Tenerife": { x: 4, y: 92 },
  "Ceuta": { x: 22, y: 96 }, "Melilla": { x: 30, y: 96 },
};

const totalPopulation = Object.values(populationData).reduce((a, b) => a + b, 0);
const totalSeatsConst = 350;

export default function SpainMap({ circumscriptions, selectedCirc, onSelect }: Props) {
  const [sortBy, setSortBy] = useState<"seats" | "pop" | "ratio" | "name" | "pctSeats" | "pctPop">("seats");
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to selected row when clicking on map
  useEffect(() => {
    if (selectedCirc && tableContainerRef.current) {
      const row = tableContainerRef.current.querySelector(`[data-province="${selectedCirc}"]`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedCirc]);

  const enrichedData = circumscriptions.map(circ => {
    const pop = populationData[circ.name] || 0;
    const pctSeats = (circ.seats / totalSeatsConst) * 100;
    const pctPop = (pop / totalPopulation) * 100;
    const ratio = pctPop > 0 ? pctSeats / pctPop : 0;
    const coords = provinceCoords[circ.name];
    return { ...circ, population: pop, pctSeats, pctPop, ratio, coords };
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name, "es");
    if (sortBy === "seats") return b.seats - a.seats;
    if (sortBy === "pop") return b.population - a.population;
    if (sortBy === "pctSeats") return b.pctSeats - a.pctSeats;
    if (sortBy === "pctPop") return b.pctPop - a.pctPop;
    return b.ratio - a.ratio;
  });

  const getColor = (ratio: number) => {
    if (ratio > 1.5) return "#22c55e";
    if (ratio > 1.1) return "#86efac";
    if (ratio > 0.9) return "#d4d4d4";
    if (ratio > 0.7) return "#fca5a5";
    return "#ef4444";
  };

  return (
    <div className="space-y-6">
      {/* Map + Stats side by side */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
        {/* Map card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
          <svg viewBox="0 0 85 100" className="w-full h-[300px] md:h-[400px]">
            <path
              d="M 5 15 Q 15 10 45 12 L 70 18 Q 75 25 72 40 L 65 55 Q 60 70 50 75 L 35 85 Q 20 90 12 80 L 8 65 Q 5 50 10 35 Q 8 25 5 15 Z"
              fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.1"
            />
            {enrichedData.map((circ) => {
              if (!circ.coords) return null;
              const isSelected = selectedCirc === circ.name;
              const radius = Math.max(1.5, Math.sqrt(circ.seats) * 0.9);
              return (
                <g key={circ.name} onClick={() => onSelect(isSelected ? null : circ.name)} className="cursor-pointer">
                  <circle
                    cx={circ.coords.x} cy={circ.coords.y} r={radius}
                    fill={getColor(circ.ratio)}
                    opacity={isSelected ? 1 : 0.8}
                    stroke={isSelected ? "#1a1f35" : "white"}
                    strokeWidth={isSelected ? 0.5 : 0.2}
                    className="transition-all duration-200 hover:opacity-100"
                  />
                  {circ.seats >= 7 && (
                    <text x={circ.coords.x} y={circ.coords.y + 0.5} textAnchor="middle"
                      dominantBaseline="middle" fontSize="2" fill="#1a1f35" fontWeight="bold">
                      {circ.seats}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-[10px] text-muted-text mt-2">
            {[
              { color: "#22c55e", label: ">150%" },
              { color: "#86efac", label: "110–150%" },
              { color: "#d4d4d4", label: "90–110%" },
              { color: "#fca5a5", label: "70–90%" },
              { color: "#ef4444", label: "<70%" },
            ].map(item => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stat cards — stacked right */}
        <div className="flex md:flex-col gap-3">
          <div className="rounded-xl bg-navy text-white p-4 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-1">Total escaños</span>
            <span className="text-3xl font-serif block">{totalSeatsConst}</span>
            <span className="text-[10px] text-white/40">Congreso de los Diputados</span>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-text block mb-1">Población total</span>
            <span className="text-2xl font-serif text-navy block">{(totalPopulation / 1e6).toFixed(1)}M</span>
            <span className="text-[10px] text-muted-text">INE 2023</span>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-text block mb-1">Habitantes / escaño</span>
            <span className="text-2xl font-serif text-navy block">{Math.round(totalPopulation / totalSeatsConst / 1000)}K</span>
            <span className="text-[10px] text-muted-text">Media nacional</span>
          </div>
        </div>
      </div>

      {/* Province table — full width, all provinces, scrollable */}
      <div ref={tableContainerRef} className="rounded-xl border border-gray-100 max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider">
                <button onClick={() => setSortBy("name")} className={sortBy === "name" ? "text-navy" : "hover:text-navy"}>Provincia{sortBy === "name" ? " ↑" : ""}</button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider">
                <button onClick={() => setSortBy("seats")} className={sortBy === "seats" ? "text-navy" : "hover:text-navy"}>Escaños{sortBy === "seats" ? " ↓" : ""}</button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider hidden md:table-cell">
                <button onClick={() => setSortBy("pop")} className={sortBy === "pop" ? "text-navy" : "hover:text-navy"}>Población{sortBy === "pop" ? " ↓" : ""}</button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider">
                <button onClick={() => setSortBy("pctSeats")} className={sortBy === "pctSeats" ? "text-navy" : "hover:text-navy"}>% Escaños{sortBy === "pctSeats" ? " ↓" : ""}</button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider hidden md:table-cell">
                <button onClick={() => setSortBy("pctPop")} className={sortBy === "pctPop" ? "text-navy" : "hover:text-navy"}>% Población{sortBy === "pctPop" ? " ↓" : ""}</button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-text uppercase tracking-wider">
                <button onClick={() => setSortBy("ratio")} className={sortBy === "ratio" ? "text-navy" : "hover:text-navy"}>Ratio{sortBy === "ratio" ? " ↓" : ""}</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {enrichedData.map(circ => (
              <tr
                key={circ.name}
                data-province={circ.name}
                className={`border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors ${selectedCirc === circ.name ? "bg-step-blue-light/50" : ""}`}
                onClick={() => onSelect(selectedCirc === circ.name ? null : circ.name)}
              >
                <td className="px-4 py-2.5 font-medium text-navy">{circ.name}</td>
                <td className="text-right px-4 py-2.5">{circ.seats}</td>
                <td className="text-right px-4 py-2.5 text-muted-text hidden md:table-cell">{(circ.population / 1e6).toFixed(2)}M</td>
                <td className="text-right px-4 py-2.5">{circ.pctSeats.toFixed(1)}%</td>
                <td className="text-right px-4 py-2.5 text-muted-text hidden md:table-cell">{circ.pctPop.toFixed(1)}%</td>
                <td className="text-right px-4 py-2.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    circ.ratio > 1.5 ? "bg-emerald-50 text-emerald-700" :
                    circ.ratio > 1.1 ? "bg-emerald-50 text-emerald-600" :
                    circ.ratio < 0.7 ? "bg-red-50 text-red-700" :
                    circ.ratio < 0.9 ? "bg-amber-50 text-amber-700" :
                    "bg-gray-50 text-muted-text"
                  }`}>
                    {circ.ratio.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-muted-text">
        Ratio = % escaños / % población. &gt;1 = sobrerrepresentada, &lt;1 = infrarrepresentada. Ej: Soria tiene 2 escaños (0.57%) con 89K hab (0.19%) = ratio 3.0
      </p>
    </div>
  );
}
