"use client";

import React, { useState } from "react";
import StepExplanation from "@/components/StepExplanation";
import Simulator from "@/components/Simulator";
import SpainMap from "@/components/SpainMap";
import Pactometro from "@/components/Pactometro";
import { circunscripciones, realResults2023, calculateNationalTotals, parties } from "@/data/elections2023";
import { dHondtByCircumscription, runGIME } from "@/lib/electoral-methods";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"intro" | "simulator" | "about">("intro");
  const [selectedCirc, setSelectedCirc] = useState<string | null>(null);
  
  // Calcular resultados para el pactómetro
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

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="hero bg-gradient-to-br from-primary to-secondary text-primary-content py-16">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              Método GIME
            </h1>
            <p className="text-xl mb-2">
              Sistema Electoral Biproporcional
            </p>
            <p className="text-lg opacity-80 mb-6">
              Una propuesta del Grupo de Investigación en Métodos Electorales
              <br />
              <span className="text-sm">(Victoriano Ramírez González, Universidad de Granada)</span>
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="badge badge-lg badge-outline">🗳️ Proporcionalidad Nacional</div>
              <div className="badge badge-lg badge-outline">⚖️ Biproporcionalidad</div>
              <div className="badge badge-lg badge-outline">🛡️ No Regresión</div>
              <div className="badge badge-lg badge-outline">🏛️ Gobernabilidad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="tabs tabs-boxed justify-center py-2 bg-transparent">
            <button 
              className={`tab tab-lg ${activeTab === 'intro' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              📚 ¿Cómo funciona?
            </button>
            <button 
              className={`tab tab-lg ${activeTab === 'simulator' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('simulator')}
            >
              🧮 Simulador + Pactómetro
            </button>
            <button 
              className={`tab tab-lg ${activeTab === 'about' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              ℹ️ Sobre el método
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "intro" && (
          <div className="space-y-8">
            <StepExplanation />
            
            {/* Problema del sistema actual */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">🚨 El Problema del Sistema Actual</h2>
                <p className="text-lg">
                  El sistema electoral español actual (D'Hondt por circunscripciones) produce una 
                  <strong> desproporcionalidad significativa</strong> entre votos y escaños.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-error/10 rounded-box p-4">
                    <h3 className="font-bold text-error mb-2">❌ Problemas actuales</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Partidos grandes sobrerrepresentados</li>
                      <li>Partidos pequeños infrarrepresentados</li>
                      <li>Voto "perdido" en circunscripciones pequeñas</li>
                      <li>Desigualdad del valor del voto según provincia</li>
                      <li>Prima a partidos con voto concentrado geográficamente</li>
                    </ul>
                  </div>
                  
                  <div className="bg-success/10 rounded-box p-4">
                    <h3 className="font-bold text-success mb-2">✅ Soluciones GIME</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Proporcionalidad perfecta a nivel nacional</li>
                      <li>Todos los votos cuentan igual</li>
                      <li>Mantiene circunscripciones y cercanía al territorio</li>
                      <li>Compatible con ajustes de gobernabilidad</li>
                      <li>Transparente y matemáticamente riguroso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa de circunscripciones */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">🗺️ Circunscripciones Electorales</h2>
                <p className="text-base-content/70 mb-4">
                  España tiene 52 circunscripciones (50 provincias + Ceuta + Melilla). 
                  El tamaño del círculo representa el número de escaños.
                </p>
                <SpainMap 
                  circumscriptions={circunscripciones}
                  selectedCirc={selectedCirc}
                  onSelect={setSelectedCirc}
                />
                
                {selectedCirc && (
                  <div className="alert alert-info mt-4">
                    <span>
                      <strong>{selectedCirc}:</strong>{' '}
                      {circunscripciones.find(c => c.name === selectedCirc)?.seats} escaños
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA al simulador */}
            <div className="text-center py-8">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setActiveTab('simulator')}
              >
                🧮 Prueba el Simulador
              </button>
            </div>
          </div>
        )}

        {activeTab === "simulator" && <Simulator />}

        {activeTab === "about" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">📖 Sobre el Método GIME</h2>
                
                <div className="prose max-w-none">
                  <p>
                    El <strong>Método GIME</strong> (Grupo de Investigación en Métodos Electorales) 
                    es una propuesta desarrollada por <strong>Victoriano Ramírez González</strong> 
                    de la Universidad de Granada.
                  </p>
                  
                  <h3>Principios fundamentales</h3>
                  <ol>
                    <li>
                      <strong>Proporcionalidad global:</strong> Los escaños totales de cada partido 
                      deben ser proporcionales a sus votos nacionales.
                    </li>
                    <li>
                      <strong>Biproporcionalidad:</strong> La distribución debe satisfacer 
                      simultáneamente los totales por partido Y los totales por circunscripción.
                    </li>
                    <li>
                      <strong>No regresión:</strong> Ningún partido puede perder escaños en 
                      etapas posteriores del algoritmo.
                    </li>
                    <li>
                      <strong>Gobernabilidad (opcional):</strong> Se puede aplicar una bonificación 
                      al partido ganador si se considera necesario para la estabilidad.
                    </li>
                  </ol>

                  <h3>¿Por qué biproporcionalidad?</h3>
                  <p>
                    El método biproporcional fue desarrollado matemáticamente por 
                    <strong> Friedrich Pukelsheim</strong> y se usa en cantones suizos como Zúrich.
                    Permite mantener circunscripciones territoriales mientras se garantiza 
                    proporcionalidad nacional.
                  </p>

                  <h3>Implementación técnica</h3>
                  <p>
                    El algoritmo usa un método iterativo de ajuste de multiplicadores 
                    (similar al algoritmo de Sinkhorn) para encontrar una matriz de escaños 
                    que satisfaga ambas restricciones marginales.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">📊 Resultados Reales 2023</h2>
                <p className="text-base-content/70 mb-4">
                  Resultados oficiales de las elecciones generales del 23 de julio de 2023:
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {Object.entries(realResults2023)
                    .sort((a, b) => b[1] - a[1])
                    .map(([party, seats]) => (
                      <div 
                        key={party}
                        className="stat bg-base-200 rounded-box px-4 py-2"
                      >
                        <div className="stat-title text-xs">{party}</div>
                        <div className="stat-value text-2xl">{seats}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">🔗 Referencias</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Ramírez González, V. et al. - Publicaciones sobre métodos electorales
                  </li>
                  <li>
                    Pukelsheim, F. - "Proportional Representation: Apportionment Methods and Their Applications"
                  </li>
                  <li>
                    Sistema biproporcional de Zúrich (implementación real desde 2006)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content mt-8">
        <div>
          <p className="font-bold text-lg">Método GIME</p>
          <p>Sistema Electoral Biproporcional</p>
          <p className="text-sm text-base-content/60">
            Simulador educativo - Los datos son aproximados y con fines ilustrativos
          </p>
        </div>
        <div>
          <p>Desarrollado con Next.js, Tailwind CSS y DaisyUI</p>
        </div>
      </footer>
    </main>
  );
}
