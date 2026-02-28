"use client";

import React from "react";

interface Step {
  number: number;
  title: string;
  shortTitle: string;
  shortDesc: string;
  description: string;
  details: string[];
  circleColor: string;
  circleBg: string;
  circleRing: string;
  numberColor: string;
  numberBg: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Proporcionalidad Nacional",
    shortTitle: "Reparto nacional",
    shortDesc: "Se asignan los 350 escaños a cada partido en proporción a sus votos totales en todo el país.",
    description: "Los votos se suman y reparten proporcionalmente usando D'Hondt",
    details: [
      "Se suman todos los votos de cada partido a nivel nacional",
      "Se aplica el método D'Hondt para asignar los 350 escaños",
      "Cada partido sabe cuántos escaños le corresponden en total",
      "Ventaja: perfecta proporcionalidad nacional"
    ],
    circleColor: "bg-step-blue",
    circleBg: "bg-step-blue-light",
    circleRing: "ring-step-blue/20",
    numberColor: "text-step-blue",
    numberBg: "bg-step-blue-light",
  },
  {
    number: 2,
    title: "Reparto Biproporcional",
    shortTitle: "Ajuste biproporcional",
    shortDesc: "Se distribuyen los escaños de cada partido entre las circunscripciones respetando ambos totales marginales.",
    description: "Los escaños de cada partido se distribuyen entre las circunscripciones",
    details: [
      "Algoritmo iterativo que ajusta la distribución",
      "Restricción 1: cada partido mantiene su total de escaños (de Etapa 1)",
      "Restricción 2: cada circunscripción mantiene su número de escaños",
      "Ningún partido pierde escaños respecto a etapas anteriores (no regresión)"
    ],
    circleColor: "bg-step-amber",
    circleBg: "bg-step-amber-light",
    circleRing: "ring-step-amber/20",
    numberColor: "text-step-amber",
    numberBg: "bg-step-amber-light",
  },
  {
    number: 3,
    title: "Ajuste de Gobernabilidad (Opcional)",
    shortTitle: "Verificación",
    shortDesc: "Se comprueba la no regresión: ningún partido pierde escaños respecto al método D'Hondt original.",
    description: "Bonificación al partido ganador para facilitar gobierno",
    details: [
      "Este paso es opcional y configurable",
      "El partido ganador puede recibir escaños adicionales",
      "Los escaños se restan proporcionalmente de los demás partidos",
      "Equilibrio entre representatividad y gobernabilidad"
    ],
    circleColor: "bg-step-pink",
    circleBg: "bg-step-pink-light",
    circleRing: "ring-step-pink/20",
    numberColor: "text-step-pink",
    numberBg: "bg-step-pink-light",
  }
];

export default function StepExplanation() {
  return (
    <div className="space-y-10">
      {/* 3-column circles with titles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map(step => (
          <div key={step.number} className="text-left">
            <div className="mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif ring-4 ${step.circleColor} text-white ${step.circleRing}`}>
                {step.number}
              </div>
            </div>
            <h3 className="font-semibold text-navy text-sm mb-2">{step.shortTitle}</h3>
            <p className="text-sm text-muted-text leading-relaxed">{step.shortDesc}</p>
          </div>
        ))}
      </div>

      {/* All 3 detail cards — white bg, subtle border, full width */}
      <div className="space-y-5">
        {steps.map(step => (
          <div key={step.number} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Header with colored circle + title — gray bg bar */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50/70 border-b border-gray-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif ring-4 ${step.circleColor} text-white ${step.circleRing} flex-shrink-0`}>
                {step.number}
              </div>
              <div>
                <h4 className="font-semibold text-navy text-sm">{step.title}</h4>
                <p className="text-xs text-muted-text">{step.description}</p>
              </div>
            </div>
            {/* Detail bullets with colored numbers */}
            <div className="px-6 py-5 space-y-3">
              {step.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${step.numberBg} ${step.numberColor} text-[10px] flex items-center justify-center font-bold`}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-body-text">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
