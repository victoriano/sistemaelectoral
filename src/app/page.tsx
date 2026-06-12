"use client";

import React, { useState, useEffect } from "react";
import { DHondtExplainer, BipropExplainer } from "@/components/MethodExplainer";
import Simulator from "@/components/Simulator";
import ImpactDashboard from "@/components/ImpactDashboard";
import SpainMap from "@/components/SpainMap";
import { circunscripciones, realResults2023, parties } from "@/data/elections2023";
import { dHondtByCircumscription, runGIME } from "@/lib/electoral-methods";

const TAB1_PILLS = [
  { id: "problema", label: "¿Cuánto vale tu voto?" },
  { id: "circunscripciones", label: "¿Por qué pasa?" },
  { id: "pasos", label: "La Propuesta" },
  { id: "sobre", label: "¿Quién hay detrás?" },
];

const TAB2_PILLS = [
  { id: "datos", label: "Datos" },
  { id: "parametros", label: "Parámetros" },
  { id: "resultados", label: "Resultados" },
  { id: "gallagher", label: "Proporcionalidad" },
  { id: "gobernabilidad", label: "Gobernabilidad" },
  { id: "pactometro", label: "Pactómetro" },
];

const TAB3_PILLS = [
  { id: "resumen", label: "Resumen" },
  { id: "ganadores", label: "Ganadores y Perdedores" },
  { id: "gobiernos", label: "Gobiernos" },
  { id: "matriz", label: "Matriz" },
  { id: "evolucion", label: "Evolución" },
];

const TAB2_IDS = TAB2_PILLS.map(p => p.id);
const TAB1_IDS = TAB1_PILLS.map(p => p.id);
const TAB3_IDS = TAB3_PILLS.map(p => p.id);

export default function Home() {
  const [activeTab, setActiveTab] = useState<"intro" | "simulator" | "impact">("intro");
  const [activePill, setActivePill] = useState<string>("problema");
  const [selectedCirc, setSelectedCirc] = useState<string | null>(null);

  // Activate the right tab/section from the hash, on load and on every hash
  // change (e.g. internal links like "#pasos" clicked from another tab).
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const scrollTo = (id: string) =>
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      if (hash === "simulador" || TAB2_IDS.includes(hash)) {
        setActiveTab("simulator");
        setActivePill(hash === "simulador" ? "datos" : hash);
        if (hash !== "simulador") scrollTo(hash);
      } else if (hash === "impacto" || TAB3_IDS.includes(hash)) {
        setActiveTab("impact");
        setActivePill(hash === "impacto" ? "resumen" : hash);
        if (hash !== "impacto") scrollTo(hash);
      } else if (TAB1_IDS.includes(hash)) {
        setActiveTab("intro");
        setActivePill(hash);
        scrollTo(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const totalSeats = circunscripciones.reduce((sum, c) => sum + c.seats, 0);
  const dHondtResult = dHondtByCircumscription(
    circunscripciones.map(c => ({ name: c.name, seats: c.seats, votes: c.votes, blankVotes: c.blankVotes })),
    0.03
  );
  const gimeResults = runGIME(
    circunscripciones.map(c => ({ name: c.name, seats: c.seats, votes: c.votes, blankVotes: c.blankVotes })),
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

  const pills =
    activeTab === "intro" ? TAB1_PILLS : activeTab === "simulator" ? TAB2_PILLS : TAB3_PILLS;

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
              La Idea
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
            <button
              className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "impact"
                  ? "text-navy border-b-2 border-navy"
                  : "text-muted-text hover:text-body-text"
              }`}
              onClick={() => { setActiveTab("impact"); setActivePill("resumen"); window.history.replaceState(null, "", "#impacto"); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Impacto
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
            {/* ===== ¿CUÁNTO VALE TU VOTO? ===== */}
            <section id="problema">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">El problema</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-6 leading-tight">
                Tu voto no vale lo mismo que el de tu vecino
              </h2>
              <p className="text-base text-muted-text mb-10 max-w-lg">
                Tres hechos reales, con datos oficiales. Ninguno es un error: así reparte escaños nuestro sistema.
              </p>

              {/* Tres hechos-tarjeta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="text-4xl font-serif text-navy mb-1">11×</div>
                  <p className="text-sm font-semibold text-navy mb-3">Once veces más votos, cero escaños</p>
                  <p className="text-sm text-muted-text leading-relaxed">
                    En 2019, Teruel Existe logró <strong>1 diputado con 19.761 votos</strong>. PACMA, con{" "}
                    <strong>228.856 votos</strong> —once veces más—, se quedó con <strong>cero</strong>.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="text-4xl font-serif text-navy mb-1">−40%</div>
                  <p className="text-sm font-semibold text-navy mb-3">Un votante de Sumar valió un 40% menos</p>
                  <p className="text-sm text-muted-text leading-relaxed">
                    En 2023, un escaño del PP costó unos <strong>59.600 votos</strong>. Uno de Sumar, unos{" "}
                    <strong>98.200</strong>. Mismo Congreso, votos con distinto peso.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="text-4xl font-serif text-navy mb-1">8×</div>
                  <p className="text-sm font-semibold text-navy mb-3">Depende de dónde vivas</p>
                  <p className="text-sm text-muted-text leading-relaxed">
                    Un voto en <strong>Ceuta</strong> pesa casi <strong>8 veces más</strong> que un voto en{" "}
                    <strong>Madrid</strong>. Mismo país, mismas elecciones.
                  </p>
                </div>
              </div>

              {/* La frase clave */}
              <p className="mt-10 max-w-2xl font-serif text-xl md:text-2xl text-navy leading-snug">
                No es fraude ni mala fe: parte de este desequilibrio se diseñó <span className="text-accent-red">a propósito</span>,
                para dar voz a las provincias menos pobladas. Pero el efecto se ha desbordado mucho más allá de esa
                intención — y se puede corregir <span className="text-accent-red">sin renunciar a ella</span>.
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sistema actual card — white with X */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-gray-100 text-body-text text-xs flex items-center justify-center font-bold">✕</span>
                    <h3 className="font-semibold text-navy text-sm">Lo que pasa hoy</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Millones de votos no eligen a nadie</li>
                    <li>Tu voto vale más o menos según tu provincia</li>
                    <li>Los partidos medianos reciben menos escaños de los que votan los ciudadanos</li>
                    <li>Se premia el voto concentrado en pocas provincias y se castiga el repartido por toda España</li>
                  </ul>
                </div>

                {/* Propuesta card — white with green check */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-bold">✓</span>
                    <h3 className="font-semibold text-navy text-sm">Lo que propone el método biproporcional</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-text">
                    <li>Todos los votos de España cuentan, y cuentan igual</li>
                    <li>Cada provincia conserva exactamente sus diputados</li>
                    <li>Quien gana hoy un escaño en su territorio, lo conserva si supera el umbral (el mínimo de votos exigido)</li>
                    <li>Transparente: cualquiera puede repetir las cuentas</li>
                  </ul>
                </div>
              </div>

              {/* Preguntas para reflexionar */}
              <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-6">
                <h3 className="font-serif text-lg text-navy mb-4">Preguntas para reflexionar</h3>
                <ul className="space-y-4 text-sm text-body-text">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>¿Cuánta gente vota a un partido que no es su favorito por miedo a &ldquo;tirar el voto&rdquo; en su provincia?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>Si los partidos medianos tuvieran los escaños que les corresponden por sus votos, ¿habría más pactos posibles y menos bloqueo?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-red font-bold mt-0.5">?</span>
                    <span>¿Te parece razonable que dos partidos con votos parecidos acaben con escaños muy distintos?</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* ===== ¿POR QUÉ PASA? ===== */}
            <section id="circunscripciones">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">¿Por qué pasa?</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-6 leading-tight">
                España no celebra una elección: celebra 52 a la vez
              </h2>

              <div className="space-y-4 max-w-2xl mb-10">
                <p className="text-sm text-body-text leading-relaxed">
                  Los 350 escaños del Congreso no se reparten mirando los votos de toda España. Se reparten en{" "}
                  <strong>52 concursos separados</strong>, uno por <strong>circunscripción</strong> (tu provincia, a
                  efectos electorales): 50 provincias más Ceuta y Melilla. Cada provincia tiene un mínimo garantizado de
                  2 escaños (1 para Ceuta y Melilla) y los 248 restantes se asignan según la población.
                </p>
                <p className="text-sm text-body-text leading-relaxed">
                  Ahí empieza el problema. En una provincia que reparte 3 escaños, matemáticamente solo caben 2 o 3
                  partidos. Si votas al cuarto, tu voto no elige a nadie: <strong>se tira</strong>.
                </p>
                <p className="text-sm text-body-text leading-relaxed">
                  Dentro de cada provincia se usa la fórmula <strong>D&apos;Hondt</strong> (la fórmula de reparto que
                  usamos desde 1977). La idea es sencilla: cada partido pone sobre la mesa varias tarjetas con números
                  —sus votos divididos entre 1, entre 2, entre 3…— y, si hay 7 escaños, ganan las 7 tarjetas más altas.
                  Cada una de esas divisiones se llama <strong>cociente</strong> (el resultado de dividir los votos
                  entre 1, 2, 3…).
                </p>
                <p className="text-sm text-body-text leading-relaxed">
                  Y aquí conviene ser justos: este desequilibrio <strong>no es un accidente, es un diseño</strong>. La
                  ley electoral de 1977 (que heredó la LOREG de 1985) buscaba dos cosas razonables para una democracia
                  recién nacida: que las provincias poco pobladas tuvieran <strong>voz propia</strong> en el Congreso
                  —sin el mínimo de 2 escaños, Soria apenas contaría— y que de las urnas salieran{" "}
                  <strong>mayorías estables</strong> capaces de gobernar.
                </p>
                <p className="text-sm text-body-text leading-relaxed">
                  El problema no es la intención: es la <strong>escala</strong>. Proteger a Soria no exigía que un voto
                  valiera 8 veces menos según la provincia, ni que millones de votos a partidos medianos no eligieran a
                  nadie. Lo que nació como una corrección razonable genera hoy efectos que van mucho más allá de
                  aquello para lo que se diseñó. Por eso la propuesta que verás después{" "}
                  <strong>no toca la garantía territorial</strong>: corrige el exceso.
                </p>
              </div>

              <h3 className="font-serif text-xl text-navy mb-4">Míralo con un caso real: Granada, 23J de 2023</h3>
              <DHondtExplainer />

              {/* Mapa */}
              <div className="mt-12">
                <h3 className="font-serif text-xl text-navy mb-4">El mapa de la desigualdad</h3>
                <p className="text-muted-text mb-8 max-w-2xl text-sm">
                  Al repartir por provincias, unas quedan <strong>sobrerrepresentadas</strong> (tienen más escaños de
                  los que les tocarían por población) y otras infrarrepresentadas. Eso importa porque decide cuánto pesa
                  tu voto: en 2023, un escaño costó unos 12.900 votos en Ceuta y unos 100.000 en Madrid. El tamaño del
                  círculo es el número de escaños; el color, si la provincia está sobre o infrarrepresentada.
                </p>
                <SpainMap
                  circumscriptions={circunscripciones}
                  selectedCirc={selectedCirc}
                  onSelect={setSelectedCirc}
                />
              </div>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="font-serif text-xl text-navy mb-4">Quién gana y quién pierde</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <h4 className="font-semibold text-navy text-sm mb-3">Partidos beneficiados</h4>
                      <ul className="space-y-2 text-sm text-muted-text">
                        <li><strong>Partidos grandes</strong> (PP, PSOE) &mdash; D&apos;Hondt en provincias pequeñas les da escaños extra</li>
                        <li><strong>Partidos nacionalistas</strong> (PNV, Bildu, Junts, ERC) &mdash; su voto, concentrado en pocas provincias, se convierte en escaños con mucha eficacia</li>
                        <li><strong>Partidos localistas</strong> (Teruel Existe, UPN) &mdash; con menos de 20.000 votos pueden lograr representación</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <h4 className="font-semibold text-navy text-sm mb-3">Partidos perjudicados</h4>
                      <ul className="space-y-2 text-sm text-muted-text">
                        <li><strong>Partidos medianos de ámbito nacional</strong> (Sumar, Vox) &mdash; en 2023 pagaron más de 90.000 votos por escaño</li>
                        <li><strong>Partidos pequeños nacionales</strong> (PACMA) &mdash; 228.856 votos en 2019 y cero escaños</li>
                        <li>En general, todo partido cuyo <strong>voto está repartido</strong> por muchas provincias sin ser mayoritario en ninguna</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
                  <h4 className="font-semibold text-navy text-sm mb-3">El coste real de un escaño (23J 2023)</h4>
                  <p className="text-sm text-muted-text mb-4">
                    El &ldquo;precio&rdquo; de un escaño cambia según el partido y la provincia:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-serif text-navy">~12.900</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño en Ceuta</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif text-navy">~59.600</div>
                      <div className="text-xs text-muted-text mt-1">votos/escaño del PP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-serif text-navy">~98.200</div>
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

            {/* ===== LA PROPUESTA ===== */}
            <section id="pasos">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">La propuesta</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-6 leading-tight">
                Que cada voto cuente, sin que tu provincia pierda nada
              </h2>
              <p className="text-base text-muted-text mb-4 max-w-2xl">
                La propuesta se llama método <strong>biproporcional</strong> (proporcional en dos direcciones a la vez:
                partidos y provincias). Se resume en tres ideas.
              </p>
              <p className="text-base text-muted-text mb-10 max-w-2xl">
                No persigue la proporcionalidad pura a cualquier precio: busca optimizar a la vez las{" "}
                <strong>dos cosas</strong> que todo sistema electoral debe equilibrar —{" "}
                <strong>representatividad</strong> (que el Congreso se parezca a lo votado) y{" "}
                <strong>gobernabilidad</strong> (que de él pueda salir un gobierno) — los mismos objetivos que ya
                perseguía la ley de 1977, con herramientas matemáticas mejores.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="w-10 h-10 rounded-full bg-navy text-white font-serif flex items-center justify-center mb-4">1</div>
                  <h3 className="font-semibold text-navy text-sm mb-2">Se cuentan TODOS los votos de España</h3>
                  <p className="text-sm text-muted-text leading-relaxed mb-4">
                    Para decidir cuántos diputados merece cada partido se suman sus votos en todo el país. Da igual
                    dónde vivas: tu voto vale lo mismo.
                  </p>
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-navy">Justicia</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="w-10 h-10 rounded-full bg-navy text-white font-serif flex items-center justify-center mb-4">2</div>
                  <h3 className="font-semibold text-navy text-sm mb-2">Tu provincia no pierde nada</h3>
                  <p className="text-sm text-muted-text leading-relaxed mb-4">
                    Cada provincia conserva exactamente los diputados que tiene hoy. Soria sigue eligiendo los suyos y
                    Madrid los suyos: solo cambia qué partido se lleva cada uno.
                  </p>
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-navy">Cercanía</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="w-10 h-10 rounded-full bg-navy text-white font-serif flex items-center justify-center mb-4">3</div>
                  <h3 className="font-semibold text-navy text-sm mb-2">Una tabla de doble entrada cuadra las dos cosas a la vez</h3>
                  <p className="text-sm text-muted-text leading-relaxed mb-4">
                    Un algoritmo coloca los escaños de cada partido en las provincias hasta que cuadran filas y columnas
                    a la vez. Es el mismo método que usa Zúrich desde 2006.
                  </p>
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-navy">Rigor</span>
                </div>
              </div>

              <BipropExplainer />

              {/* Detalle matemático plegable */}
              <details className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-navy text-sm hover:bg-gray-100 transition-colors">
                  Para quien quiera el detalle matemático
                </summary>
                <div className="px-6 pb-6 pt-2">
                  <ul className="space-y-3 text-sm text-body-text">
                    <li className="flex items-start gap-3">
                      <span className="text-accent-red font-bold mt-0.5">•</span>
                      <span>
                        <strong>Umbral</strong> (mínimo de votos exigido para entrar en el reparto): participa todo
                        partido que supere el <strong>3% en al menos una circunscripción</strong>, comprobado igual que
                        en el sistema actual.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent-red font-bold mt-0.5">•</span>
                      <span>
                        <strong>Reparto nacional</strong>: los 350 escaños se asignan a los partidos según sus votos
                        totales en España.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent-red font-bold mt-0.5">•</span>
                      <span>
                        <strong>Reparto biproporcional</strong>: un algoritmo iterativo de divisores coloca esos escaños
                        en las provincias cumpliendo dos condiciones a la vez: cada partido conserva su total nacional y
                        cada provincia conserva sus escaños. Se usa el redondeo{" "}
                        <strong>Webster/Sainte-Laguë</strong> (una regla estándar para pasar de decimales a escaños
                        enteros), igual que en el sistema de Zúrich.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent-red font-bold mt-0.5">•</span>
                      <span>
                        <strong>Bonificación opcional de gobernabilidad</strong>: el partido más votado puede recibir
                        escaños extra para facilitar la formación de gobierno. Se restan proporcionalmente del resto y
                        el reparto provincial se recalcula biproporcionalmente con los nuevos totales.
                      </span>
                    </li>
                  </ul>
                </div>
              </details>
            </section>

            {/* ===== ¿QUIÉN HAY DETRÁS? ===== */}
            <section id="sobre">
              <p className="text-accent-red text-xs font-semibold tracking-widest uppercase mb-3">¿Quién hay detrás?</p>
              <h2 className="font-serif text-3xl md:text-5xl text-navy mb-8 leading-tight">
                Grupo de Investigación en Métodos Electorales
              </h2>

              <div className="space-y-10 text-body-text leading-relaxed">
                <p className="max-w-2xl text-sm">
                  El <strong>GIME</strong> (Grupo de Investigación en Métodos Electorales) es un equipo de la{" "}
                  <a href="https://www.ugr.es" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 underline-offset-2 hover:text-navy">
                    <strong>Universidad de Granada</strong>
                  </a>{" "}
                  dedicado al estudio matemático del reparto electoral. Lleva décadas publicando propuestas para mejorar
                  la proporcionalidad del sistema español, con una premisa: que el rigor académico sirva para algo
                  práctico.
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
                        Catedrático de Matemática Aplicada y <strong>profesor emérito</strong> de la Universidad de
                        Granada. Ha dedicado gran parte de su carrera al estudio de los métodos de reparto proporcional
                        y su aplicación a los sistemas electorales.
                      </p>
                      <p>
                        Sus investigaciones han dado lugar a numerosas publicaciones científicas y a propuestas
                        concretas de reforma electoral presentadas ante instituciones españolas. Es el autor principal
                        del método biproporcional adaptado a las circunscripciones españolas que se presenta aquí.
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
                      <span>
                        Pukelsheim, F. —{" "}
                        <a
                          href="https://doi.org/10.1007/978-3-319-64707-4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-gray-300 underline-offset-2 hover:text-navy"
                        >
                          &ldquo;Proportional Representation: Apportionment Methods and Their Applications&rdquo;
                        </a>{" "}
                        (Springer) — la referencia académica estándar sobre métodos de reparto proporcional
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-text">•</span>
                      <span>
                        <a
                          href="https://en.wikipedia.org/wiki/Biproportional_apportionment"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-gray-300 underline-offset-2 hover:text-navy"
                        >
                          Reparto biproporcional en Zúrich
                        </a>{" "}
                        — en uso real en elecciones cantonales desde 2006
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-text">•</span>
                      <span>
                        Ramírez González, V. et al. — publicaciones sobre métodos electorales,{" "}
                        <a
                          href="https://www.ugr.es"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-gray-300 underline-offset-2 hover:text-navy"
                        >
                          Universidad de Granada
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "simulator" && <Simulator />}

        {activeTab === "impact" && <ImpactDashboard />}
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
              <a
                href="https://github.com/victoriano/sistemaelectoral"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.ugr.es"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                Universidad de Granada
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
