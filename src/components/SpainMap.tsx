"use client";

import React, { useState } from "react";

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
  "Madrid": 6751251,
  "Barcelona": 5714730,
  "Valencia": 2589312,
  "Sevilla": 1950219,
  "Alicante": 1881762,
  "Málaga": 1717504,
  "Murcia": 1531878,
  "Cádiz": 1244049,
  "Vizcaya": 1154778,
  "A Coruña": 1122799,
  "Las Palmas": 1131065,
  "Asturias": 1011792,
  "Islas Baleares": 1173008,
  "Santa Cruz de Tenerife": 1056641,
  "Zaragoza": 972528,
  "Granada": 919168,
  "Pontevedra": 947374,
  "Tarragona": 816772,
  "Córdoba": 781451,
  "Girona": 781788,
  "Guipúzcoa": 727121,
  "Almería": 727945,
  "Toledo": 703772,
  "Badajoz": 672137,
  "Navarra": 661197,
  "Jaén": 631381,
  "Castellón": 585590,
  "Cantabria": 584507,
  "Valladolid": 520649,
  "Ciudad Real": 502578,
  "Huelva": 524278,
  "León": 456439,
  "Lleida": 453025,
  "Cáceres": 391850,
  "Albacete": 396987,
  "Burgos": 357070,
  "Álava": 333940,
  "Salamanca": 329245,
  "Lugo": 327946,
  "La Rioja": 319914,
  "Ourense": 306650,
  "Guadalajara": 267629,
  "Huesca": 222687,
  "Cuenca": 196139,
  "Zamora": 170588,
  "Palencia": 160321,
  "Ávila": 158498,
  "Segovia": 153478,
  "Teruel": 134176,
  "Soria": 88884,
  "Ceuta": 83517,
  "Melilla": 87076,
};

// Coordenadas aproximadas para mapa de España (todas las provincias)
const provinceCoords: { [key: string]: { x: number; y: number; region: string } } = {
  // Galicia
  "A Coruña": { x: 8, y: 18, region: "GAL" },
  "Lugo": { x: 14, y: 20, region: "GAL" },
  "Ourense": { x: 14, y: 28, region: "GAL" },
  "Pontevedra": { x: 8, y: 28, region: "GAL" },
  // Asturias
  "Asturias": { x: 22, y: 16, region: "AST" },
  // Cantabria
  "Cantabria": { x: 30, y: 16, region: "CAN" },
  // País Vasco
  "Vizcaya": { x: 38, y: 14, region: "PV" },
  "Guipúzcoa": { x: 42, y: 12, region: "PV" },
  "Álava": { x: 38, y: 20, region: "PV" },
  // Navarra
  "Navarra": { x: 46, y: 18, region: "NAV" },
  // La Rioja
  "La Rioja": { x: 40, y: 26, region: "RIO" },
  // Aragón
  "Huesca": { x: 52, y: 20, region: "ARA" },
  "Zaragoza": { x: 50, y: 30, region: "ARA" },
  "Teruel": { x: 54, y: 40, region: "ARA" },
  // Cataluña
  "Lleida": { x: 58, y: 26, region: "CAT" },
  "Girona": { x: 68, y: 22, region: "CAT" },
  "Barcelona": { x: 66, y: 32, region: "CAT" },
  "Tarragona": { x: 60, y: 36, region: "CAT" },
  // Castilla y León
  "León": { x: 22, y: 26, region: "CYL" },
  "Palencia": { x: 30, y: 28, region: "CYL" },
  "Burgos": { x: 34, y: 26, region: "CYL" },
  "Soria": { x: 42, y: 32, region: "CYL" },
  "Segovia": { x: 36, y: 38, region: "CYL" },
  "Ávila": { x: 28, y: 40, region: "CYL" },
  "Salamanca": { x: 20, y: 40, region: "CYL" },
  "Zamora": { x: 18, y: 34, region: "CYL" },
  "Valladolid": { x: 28, y: 34, region: "CYL" },
  // Madrid
  "Madrid": { x: 36, y: 46, region: "MAD" },
  // Castilla-La Mancha
  "Guadalajara": { x: 44, y: 42, region: "CLM" },
  "Cuenca": { x: 50, y: 48, region: "CLM" },
  "Toledo": { x: 34, y: 54, region: "CLM" },
  "Ciudad Real": { x: 36, y: 64, region: "CLM" },
  "Albacete": { x: 50, y: 62, region: "CLM" },
  // Comunidad Valenciana
  "Castellón": { x: 60, y: 46, region: "VAL" },
  "Valencia": { x: 58, y: 54, region: "VAL" },
  "Alicante": { x: 58, y: 64, region: "VAL" },
  // Murcia
  "Murcia": { x: 54, y: 72, region: "MUR" },
  // Extremadura
  "Cáceres": { x: 20, y: 52, region: "EXT" },
  "Badajoz": { x: 18, y: 64, region: "EXT" },
  // Andalucía
  "Huelva": { x: 14, y: 76, region: "AND" },
  "Sevilla": { x: 22, y: 76, region: "AND" },
  "Córdoba": { x: 30, y: 72, region: "AND" },
  "Jaén": { x: 38, y: 72, region: "AND" },
  "Granada": { x: 38, y: 80, region: "AND" },
  "Almería": { x: 48, y: 80, region: "AND" },
  "Málaga": { x: 30, y: 86, region: "AND" },
  "Cádiz": { x: 18, y: 88, region: "AND" },
  // Baleares
  "Islas Baleares": { x: 76, y: 50, region: "BAL" },
  // Canarias
  "Las Palmas": { x: 8, y: 96, region: "CAN" },
  "Santa Cruz de Tenerife": { x: 4, y: 92, region: "CAN" },
  // Ceuta y Melilla
  "Ceuta": { x: 22, y: 96, region: "CEU" },
  "Melilla": { x: 30, y: 96, region: "MEL" },
};

const totalPopulation = Object.values(populationData).reduce((a, b) => a + b, 0);
const totalSeats = 350;

export default function SpainMap({ circumscriptions, selectedCirc, onSelect }: Props) {
  const [sortBy, setSortBy] = useState<"seats" | "pop" | "ratio">("seats");
  const [showTable, setShowTable] = useState(true);

  // Crear datos enriquecidos
  const enrichedData = circumscriptions.map(circ => {
    const pop = populationData[circ.name] || 0;
    const pctSeats = (circ.seats / totalSeats) * 100;
    const pctPop = (pop / totalPopulation) * 100;
    const ratio = pctPop > 0 ? pctSeats / pctPop : 0;
    const coords = provinceCoords[circ.name];
    return {
      ...circ,
      population: pop,
      pctSeats,
      pctPop,
      ratio, // >1 = sobrerrepresentada, <1 = infrarrepresentada
      coords,
    };
  }).sort((a, b) => {
    if (sortBy === "seats") return b.seats - a.seats;
    if (sortBy === "pop") return b.population - a.population;
    return b.ratio - a.ratio;
  });

  const getColor = (ratio: number) => {
    if (ratio > 1.5) return "#22c55e"; // muy sobrerrepresentada (verde)
    if (ratio > 1.1) return "#86efac"; // algo sobrerrepresentada
    if (ratio > 0.9) return "#d4d4d4"; // equilibrada (gris)
    if (ratio > 0.7) return "#fca5a5"; // algo infrarrepresentada
    return "#ef4444"; // muy infrarrepresentada (rojo)
  };

  return (
    <div className="space-y-4">
      {/* Mapa visual */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <h3 className="card-title text-lg">🗺️ Mapa de Representación</h3>
          <p className="text-sm text-base-content/60 mb-2">
            Color = ratio representación (verde=sobrerrepresentada, rojo=infrarrepresentada). Tamaño = escaños.
          </p>
          
          <svg viewBox="0 0 85 100" className="w-full h-[300px]">
            {/* Contorno de España peninsular */}
            <path 
              d="M 5 15 Q 15 10 45 12 L 70 18 Q 75 25 72 40 L 65 55 Q 60 70 50 75 L 35 85 Q 20 90 12 80 L 8 65 Q 5 50 10 35 Q 8 25 5 15 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              opacity="0.2"
            />
            
            {enrichedData.map((circ) => {
              if (!circ.coords) return null;
              const isSelected = selectedCirc === circ.name;
              const radius = Math.max(1.5, Math.sqrt(circ.seats) * 0.9);
              
              return (
                <g 
                  key={circ.name}
                  onClick={() => onSelect(isSelected ? null : circ.name)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={circ.coords.x}
                    cy={circ.coords.y}
                    r={radius}
                    fill={getColor(circ.ratio)}
                    opacity={isSelected ? 1 : 0.8}
                    stroke={isSelected ? "#000" : "white"}
                    strokeWidth={isSelected ? 0.5 : 0.2}
                    className="transition-all duration-200 hover:opacity-100"
                  />
                  {circ.seats >= 7 && (
                    <text
                      x={circ.coords.x}
                      y={circ.coords.y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="2"
                      fill="#000"
                      fontWeight="bold"
                    >
                      {circ.seats}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Leyenda */}
          <div className="flex flex-wrap justify-center gap-2 text-xs mt-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: "#22c55e"}}></span>
              &gt;150%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: "#86efac"}}></span>
              110-150%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: "#d4d4d4"}}></span>
              90-110%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: "#fca5a5"}}></span>
              70-90%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{backgroundColor: "#ef4444"}}></span>
              &lt;70%
            </span>
          </div>
        </div>
      </div>

      {/* Toggle tabla */}
      <div className="flex justify-center">
        <button 
          className="btn btn-sm btn-ghost"
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? "▲ Ocultar tabla" : "▼ Ver tabla completa"}
        </button>
      </div>

      {/* Tabla de datos */}
      {showTable && (
        <div className="card bg-base-100 shadow">
          <div className="card-body p-3">
            <h3 className="card-title text-base">📊 Datos por Circunscripción</h3>
            
            {/* Botones de ordenación */}
            <div className="flex gap-2 mb-2">
              <button 
                className={`btn btn-xs ${sortBy === "seats" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSortBy("seats")}
              >
                Por escaños
              </button>
              <button 
                className={`btn btn-xs ${sortBy === "pop" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSortBy("pop")}
              >
                Por población
              </button>
              <button 
                className={`btn btn-xs ${sortBy === "ratio" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSortBy("ratio")}
              >
                Por ratio
              </button>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="table table-xs table-zebra">
                <thead className="sticky top-0 bg-base-200">
                  <tr>
                    <th>Provincia</th>
                    <th className="text-right">Escaños</th>
                    <th className="text-right">Población</th>
                    <th className="text-right">% Escaños</th>
                    <th className="text-right">% Población</th>
                    <th className="text-right">Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedData.map((circ) => (
                    <tr 
                      key={circ.name}
                      className={`cursor-pointer hover:bg-base-200 ${selectedCirc === circ.name ? "bg-primary/20" : ""}`}
                      onClick={() => onSelect(selectedCirc === circ.name ? null : circ.name)}
                    >
                      <td className="font-medium">{circ.name}</td>
                      <td className="text-right">{circ.seats}</td>
                      <td className="text-right">{(circ.population / 1000000).toFixed(2)}M</td>
                      <td className="text-right">{circ.pctSeats.toFixed(1)}%</td>
                      <td className="text-right">{circ.pctPop.toFixed(1)}%</td>
                      <td className="text-right">
                        <span 
                          className="badge badge-sm"
                          style={{ backgroundColor: getColor(circ.ratio), color: circ.ratio > 1.1 || circ.ratio < 0.7 ? "white" : "black" }}
                        >
                          {circ.ratio.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-base-content/60 mt-2">
              <strong>Ratio</strong> = % escaños / % población. 
              &gt;1 = sobrerrepresentada, &lt;1 = infrarrepresentada.
              <br/>
              Ejemplo: Soria tiene 2 escaños (0.57%) con 89K hab (0.19%) → ratio 3.0 (muy sobrerrepresentada)
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas resumen */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total escaños</div>
          <div className="stat-value text-primary">{totalSeats}</div>
          <div className="stat-desc">Congreso de los Diputados</div>
        </div>
        <div className="stat">
          <div className="stat-title">Población total</div>
          <div className="stat-value text-secondary">{(totalPopulation / 1000000).toFixed(1)}M</div>
          <div className="stat-desc">INE 2023</div>
        </div>
        <div className="stat">
          <div className="stat-title">Hab/escaño medio</div>
          <div className="stat-value">{Math.round(totalPopulation / totalSeats).toLocaleString()}</div>
          <div className="stat-desc">Media nacional</div>
        </div>
      </div>
    </div>
  );
}
