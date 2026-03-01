"use client";

import React, { useState, useEffect } from "react";
import StepExplanation from "@/components/StepExplanation";
import Simulator from "@/components/Simulator";
import SpainMap from "@/components/SpainMap";
import { circunscripciones, realResults2023, parties } from "@/data/elections2023";
import { dHondtByCircumscription, runGIME } from "@/lib/electoral-methods";

const TAB1_PILLS = [
  { id: "problema", label: "El problema" },
  { id: "pasos", label: "Tres pasos" },
  { id: "circunscripciones", label: "Circunscripciones" },
  { id: "sobre", label: "Sobre el método" },
  { id: "referencias", label: "Referencias" },
];

const TAB2_PILLS = [
  { id: "datos", label: "Datos" },
  { id: "parametros", label: "Parámetros" },
  { id: "resultados", label: "Resultados" },
  { id: "gallagher", label: "Proporcionalidad" },
  { id: "gobernabilidad", label: "Gobernabilidad" },
  { id: "pactometro", label: "Pactómetro" },
  { id: "etapas", label: "Etapas GIME" },
];

const TAB2_IDS = TAB2_PILLS.map(p => p.id);
const TAB1_IDS = TAB1_PILLS.map(p => p.id);

export default function Home() {
  const [activeTab, setActiveTab] = useState<"intro" | "simulator">("intro");
  const [activePill, setActivePill] = useState<string>("problema");
  const [selectedCirc, setSelectedCirc] = useState<string | null>(null);

  // Read hash on mount to activate correct tab/section
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    if (hash === "simulador" || TAB2_IDS.includes(hash)) {
      setActiveTab("simulator");
      setActivePill(hash === "simulador" ? "datos" : hash);
      if (hash !== "simulador") {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else if (TAB1_IDS.includes(hash)) {
      setActiveTab("intro");
      setActivePill(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const totalSeats = circunscripciones.reduce((sum, c) => sum + c.seats, 0);
  const dHondtResult = dHondtByCircumscription(
    circunscripciones.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
    0.03
  );
  const gimeResults = runGIME(
    circunscripciones.map(c => ({ name: c.name, seats: c.seats, votes: c.votes })),
    totalSeats,
    0,
    0.03
  );
  const gimeNational = gimeResults[gimeResults.length - 1].nationalAllocation;

  const scrollToSection = (id: string) => {
    setActivePill(id);
    window.history.replaceState(null, "", `#${id}`);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pills = activeTab === "intro" ? TAB1_PILLS : TAB2_PILLS;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-navy text-white pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="max-w-5xl mx-auto px-5 md:px-20">
          {/* Top bar */}
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="text-[10px] md:text-xs tracking-widest uppercase text-white/50">
              Grupo de Investigación en Métodos Electorales
            </span>
          </div>

          {/* Title + Logo */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">
                Método GIME
              </h1>
              <p className="text-sm text-white/50 max-w-md">
                Un sistema electoral biproporcional que garantiza que cada voto cuente igual, sin importar la provincia.
              </p>
            </div>
            <img src="/ugr-logo-negativo.svg" alt="Universidad de Granada" className="h-32 md:h-48 opacity-90 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 md:px-20">
          <div className="flex justify-center gap-0 border-b border-gray-100">
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "intro"
                  ? "text-navy border-b-2 border-navy"
                  : "text-muted-text hover:text-body-text"
              }`}
              onClick={() => { setActiveTab("intro"); setActivePill("problema"); window.history.replaceState(null, "", "#problema"); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Cómo funciona
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "simulator"
                  ? "text-navy border-b-2 border-navy"
                  : "text-muted-text hover:text-body-text"
              }`}
              onClick={() => { setActiveTab("simulator"); setActivePill("datos"); window.history.replaceState(null, "", "#simulador"); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
              Simulador
            </button>
          </div>
          <div className="flex justify-center gap-2.5 py-3 overflow-x-auto no-scrollbar">
            {pills.map(pill => (
              <button
                key={pill.id}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activePill === pill.id
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-muted-text hover:bg-gray-200"
                }`}
                onClick={() => scrollToSection(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-5 md:px-20 py-10 md:py-16">
        {activeTab === "intro" && (
          <div className="space-y-20">
            {/* ===== EL PROBLEMA ===== */}
            <section id="problema">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">El problema</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-6 leading-tight">
                Tu voto no vale lo mismo en todas las provincias
              </h2>
              <p className="text-base text-muted-text mb-10 max-w-lg">
                El sistema D&apos;Hondt por circunscripciones produce una desproporcionalidad significativa. Los partidos grandes ganan escaños de más y los pequeños pierden representación.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sistema actual card — white with X */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-gray-100 text-body-text text-xs flex items-center justify-center font-bold">✕</span>
                    <h3 className="font-semibold text-navy text-sm">Sistema actual</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Partidos grandes sobrerrepresentados</li>
                    <li>Voto perdido en circunscripciones pequeñas</li>
                    <li>Desigualdad del valor del voto según provincia</li>
                    <li>Prima a partidos con voto concentrado</li>
                  </ul>
                </div>

                {/* Método GIME card — white with green check */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-bold">✓</span>
                    <h3 className="font-semibold text-navy text-sm">Método GIME</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Proporcionalidad perfecta a nivel nacional</li>
                    <li>Todos los votos cuentan igual</li>
                    <li>Mantiene circunscripciones territoriales</li>
                    <li>Transparente y matemáticamente riguroso</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ===== TRES PASOS ===== */}
            <section id="pasos">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">Cómo funciona</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-10 leading-tight">
                Tres pasos hacia la proporcionalidad
              </h2>
              <StepExplanation />
            </section>

            {/* ===== CIRCUNSCRIPCIONES ===== */}
            <section id="circunscripciones">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">Circunscripciones</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-4 leading-tight">
                52 provincias, un Congreso
              </h2>
              <p className="text-muted-text mb-8 max-w-lg text-sm">
                España tiene 52 circunscripciones (50 provincias + Ceuta + Melilla). El tamaño del círculo representa el número de escaños asignados. El color indica si la provincia está sobre o infrarrepresentada respecto a su población.
              </p>

              <SpainMap
                circumscriptions={circunscripciones}
                selectedCirc={selectedCirc}
                onSelect={setSelectedCirc}
              />
            </section>

            {/* ===== SOBRE EL MÉTODO ===== */}
            <section id="sobre">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">Sobre el método</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-8 leading-tight">
                El Método GIME
              </h2>

              <div className="space-y-8 text-body-text leading-relaxed">
                <p className="max-w-2xl">
                  El <strong>Método GIME</strong> (Grupo de Investigación en Métodos Electorales) es una propuesta desarrollada por <strong>Victoriano Ramírez González</strong> de la Universidad de Granada.
                </p>

                <div>
                  <h3 className="font-serif text-xl text-navy mb-4">Principios fundamentales</h3>
                  <ol className="space-y-3 max-w-2xl">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-step-blue text-white text-[10px] flex items-center justify-center font-bold">1</span>
                      <div className="text-sm"><strong>Proporcionalidad global</strong> — Los escaños totales de cada partido deben ser proporcionales a sus votos nacionales.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-step-amber text-white text-[10px] flex items-center justify-center font-bold">2</span>
                      <div className="text-sm"><strong>Biproporcionalidad</strong> — La distribución debe satisfacer simultáneamente los totales por partido Y los totales por circunscripción.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-step-pink text-white text-[10px] flex items-center justify-center font-bold">3</span>
                      <div className="text-sm"><strong>No regresión</strong> — Ningún partido puede perder escaños en etapas posteriores del algoritmo.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-navy text-white text-[10px] flex items-center justify-center font-bold">4</span>
                      <div className="text-sm"><strong>Gobernabilidad (opcional)</strong> — Se puede aplicar una bonificación al partido ganador si se considera necesario.</div>
                    </li>
                  </ol>
                </div>

                {/* 2-column: biproporcionalidad + implementación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <h3 className="font-serif text-lg text-navy mb-3">¿Por qué biproporcionalidad?</h3>
                    <p className="text-sm">
                      El método biproporcional fue desarrollado matemáticamente por <strong>Friedrich Pukelsheim</strong> y se usa en cantones suizos como Zúrich desde 2006.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-navy mb-3">Implementación técnica</h3>
                    <p className="text-sm">
                      El algoritmo usa un método iterativo de ajuste de multiplicadores de filas y columnas. En Método Exacto es un modelo de ecuaciones con una familia de soluciones que verifica todas las condiciones.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== REFERENCIAS ===== */}
            <section id="referencias">
              <h3 className="font-serif text-xl text-navy mb-4">Referencias</h3>
              <ul className="space-y-2 text-sm text-body-text">
                <li className="flex items-start gap-2">
                  <span className="text-muted-text">•</span>
                  Ramírez González, V. et al. — Publicaciones sobre métodos electorales
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-text">•</span>
                  Pukelsheim, F. — &ldquo;Proportional Representation: Apportionment Methods and Their Applications&rdquo;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-text">•</span>
                  Sistema biproporcional de Zúrich (implementación real desde 2006)
                </li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === "simulator" && <Simulator />}
      </div>

      {/* Footer */}
      <footer className="bg-navy text-white/60 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-20">
          <p className="text-[10px] text-white/30 mb-6">
            Simulador educativo basado en las ecuaciones de Victoriano Ramírez González, Universidad de Granada.
          </p>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-white">Método GIME</h2>
            <div className="flex gap-6 text-xs text-white/30">
              <span>GitHub</span>
              <span>Publicaciones</span>
              <span>Universidad de Granada</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
