"use client";

import React, { useState, useEffect } from "react";
import StepExplanation from "@/components/StepExplanation";
import Simulator from "@/components/Simulator";
import SpainMap from "@/components/SpainMap";
import { circunscripciones, realResults2023, parties } from "@/data/elections2023";
import { dHondtByCircumscription, runGIME } from "@/lib/electoral-methods";

const TAB1_PILLS = [
  { id: "problema", label: "El Problema" },
  { id: "circunscripciones", label: "El Sistema Actual" },
  { id: "pasos", label: "La Solución" },
  { id: "sobre", label: "Sobre GIME" },
];

const TAB2_PILLS = [
  { id: "datos", label: "Datos" },
  { id: "parametros", label: "Parámetros" },
  { id: "resultados", label: "Resultados" },
  { id: "gallagher", label: "Proporcionalidad" },
  { id: "gobernabilidad", label: "Gobernabilidad" },
  { id: "pactometro", label: "Pactómetro" },
  { id: "etapas", label: "Etapas Biproporcional" },
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
{/* Title + Logo */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">
                Grupo de Investigación en Métodos Electorales
              </h1>
              <p className="text-sm text-white/50 max-w-md">
                Propuesta sistema electoral biproporcional para España para un Parlamento más ecuánime, representativo y gobernable.
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
              La Solución
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
                Millones de votos se quedan sin representación política con el sistema de reparto de escaños actual
              </h2>
              <p className="text-base text-muted-text mb-10 max-w-lg">
                El sistema D&apos;Hondt por circunscripciones produce una desproporcionalidad significativa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sistema actual card — white with X */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-gray-100 text-body-text text-xs flex items-center justify-center font-bold">✕</span>
                    <h3 className="font-semibold text-navy text-sm">Sistema actual</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Partidos pequeños y medianos infrarepresentados</li>
                    <li>Voto perdido en circunscripciones pequeñas</li>
                    <li>Desigualdad del valor del voto según provincia</li>
                    <li>Prima a partidos con voto concentrado</li>
                  </ul>
                </div>

                {/* Método Biproporcional card — white with green check */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-bold">✓</span>
                    <h3 className="font-semibold text-navy text-sm">Método Biproporcional</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Proporcionalidad perfecta a nivel nacional</li>
                    <li>Todos los votos cuentan igual</li>
                    <li>Mantiene circunscripciones territoriales</li>
                    <li>Transparente y matemáticamente riguroso</li>
                  </ul>
                </div>
              </div>

              {/* Preguntas para reflexionar */}
              <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-6">
                <h3 className="font-serif text-lg text-navy mb-4">Preguntas para reflexionar</h3>
                <ul className="space-y-4 text-sm text-body-text">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>Si los partidos pequeños y medianos de ámbito nacional consiguieran una representación más justa, ¿favorecería la presencia de fuerzas menos radicalizadas que facilitasen pactos y una gobernabilidad más democrática?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>Si estos partidos nacionales tuvieran más peso, ¿representaría la cámara mejor los intereses del conjunto del país, en lugar de una donde los partidos nacionalistas regionalistas están sobrerrepresentados y condicionan la gobernabilidad?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>¿Cuántos votantes han dejado de apoyar a partidos que les representan mejor por miedo a &ldquo;tirar su voto&rdquo; en una circunscripción pequeña?</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* ===== CIRCUNSCRIPCIONES Y D'HONDT ===== */}
            <section id="circunscripciones">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">El sistema actual</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-4 leading-tight">
                Circunscripciones y D&apos;Hondt
              </h2>
              <p className="text-muted-text mb-8 max-w-lg text-sm">
                España tiene 52 circunscripciones (50 provincias + Ceuta + Melilla). El tamaño del círculo representa el número de escaños asignados. El color indica si la provincia está sobre o infrarrepresentada respecto a su población.
              </p>

              <SpainMap
                circumscriptions={circunscripciones}
                selectedCirc={selectedCirc}
                onSelect={setSelectedCirc}
              />

              {/* Explicación del sistema de circunscripciones */}
              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="font-serif text-xl text-navy mb-4">Cómo funciona el reparto actual</h3>
                  <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-4">
                    Los 350 escaños del Congreso se reparten entre las 52 circunscripciones. Cada provincia tiene un <strong>mínimo garantizado de 2 escaños</strong> (1 para Ceuta y Melilla), y los 248 restantes se distribuyen proporcionalmente a la población. Dentro de cada circunscripción, los escaños se asignan por el <strong>método D&apos;Hondt</strong>, que divide los votos de cada partido entre 1, 2, 3... y asigna escaños a los cocientes más altos.
                  </p>
                  <p className="text-sm text-body-text leading-relaxed max-w-2xl">
                    Este diseño tiene una <strong>ventaja clara</strong>: garantiza la representación territorial de las provincias menos pobladas. Sin el mínimo de 2 escaños, provincias como Soria, Ceuta o Melilla no tendrían representación directa en el Congreso.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-navy mb-4">El problema: la desigualdad del voto</h3>
                  <p className="text-sm text-body-text leading-relaxed max-w-2xl mb-4">
                    Sin embargo, el sistema produce <strong>grandes desigualdades</strong> en el valor del voto. En las elecciones del 23J de 2023, conseguir un escaño en Ceuta costó unos 13.000 votos, mientras que en Madrid hacían falta cerca de 100.000. Es decir, un voto en una provincia pequeña puede valer hasta <strong>8 veces más</strong> que en una grande.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-navy mb-4">Quién gana y quién pierde</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <h4 className="font-semibold text-navy text-sm mb-3">Partidos beneficiados</h4>
                      <ul className="space-y-2 text-sm text-muted-text">
                        <li><strong>Partidos grandes</strong> (PP, PSOE) &mdash; el método D&apos;Hondt en circunscripciones pequeñas les da escaños extra</li>
                        <li><strong>Partidos nacionalistas</strong> (PNV, Bildu, Junts, ERC) &mdash; su voto concentrado en pocas provincias se convierte eficientemente en escaños</li>
                        <li><strong>Partidos localistas</strong> (Teruel Existe, UPN) &mdash; con menos de 20.000 votos pueden obtener representación</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <h4 className="font-semibold text-navy text-sm mb-3">Partidos perjudicados</h4>
                      <ul className="space-y-2 text-sm text-muted-text">
                        <li><strong>Partidos medianos de ámbito nacional</strong> (Sumar, Vox) &mdash; necesitan más de 90.000 votos por escaño</li>
                        <li><strong>Partidos pequeños nacionales</strong> (PACMA) &mdash; 228.000 votos en 2019 y cero escaños</li>
                        <li>En general, todo partido cuyo <strong>voto está repartido</strong> por muchas provincias sin ser mayoritario en ninguna</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-navy text-sm mb-3">El coste real de un escaño (23J 2023)</h4>
                  <p className="text-sm text-muted-text mb-4">
                    La diferencia en el &ldquo;precio&rdquo; de un escaño revela la desproporcionalidad del sistema:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-serif text-navy">~13.000</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño en Ceuta</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif text-navy">~63.600</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño del PSOE</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif text-navy">~97.200</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño de Sumar</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif text-navy">~100.000</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño en Madrid</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== TRES PASOS ===== */}
            <section id="pasos">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">La solución</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-10 leading-tight">
                Tres pasos hacia la proporcionalidad
              </h2>
              <StepExplanation />
            </section>

            {/* ===== SOBRE GIME ===== */}
            <section id="sobre">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">Sobre GIME</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-8 leading-tight">
                Grupo de Investigación en Métodos Electorales
              </h2>

              <div className="space-y-10 text-body-text leading-relaxed">
                <p className="max-w-2xl text-sm">
                  El <strong>GIME</strong> (Grupo de Investigación en Métodos Electorales) es un equipo de investigación de la <strong>Universidad de Granada</strong> dedicado al estudio matemático de los sistemas de reparto electoral. Durante décadas, el grupo ha desarrollado y publicado propuestas para mejorar la proporcionalidad del sistema electoral español, combinando rigor académico con aplicabilidad práctica.
                </p>

                {/* Investigador principal */}
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
                  <div className="w-[200px] h-[200px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src="/victoriano-ramirez.jpg"
                      alt="Victoriano Ramírez González"
                      className="w-full h-full object-cover scale-[1.38] origin-[50%_2%]"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-navy mb-2">Victoriano Ramírez González</h3>
                    <p className="text-xs text-muted-text uppercase tracking-wider mb-3">Investigador principal · Profesor emérito</p>
                    <div className="space-y-3 text-sm">
                      <p>
                        Catedrático de Matemática Aplicada y actualmente <strong>profesor emérito</strong> de la Universidad de Granada. Ha dedicado gran parte de su carrera académica al estudio de los métodos de reparto proporcional y sus aplicaciones a los sistemas electorales.
                      </p>
                      <p>
                        Sus investigaciones han dado lugar a numerosas publicaciones científicas y propuestas concretas de reforma electoral presentadas ante instituciones españolas. Es el autor principal del método biproporcional adaptado al sistema de circunscripciones español que se presenta en este simulador.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Referencias */}
                <div className="pt-4">
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
                </div>
              </div>
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
            <h2 className="font-serif text-xl text-white">Método Biproporcional</h2>
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
