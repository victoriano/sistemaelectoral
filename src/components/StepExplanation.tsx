"use client";

import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Proporcionalidad Nacional",
    description: "Los votos de todo el país se suman y se reparten los escaños proporcionalmente usando D'Hondt.",
    details: [
      "Se suman todos los votos de cada partido a nivel nacional",
      "Se aplica el método D'Hondt para asignar los 350 escaños",
      "Resultado: cada partido sabe cuántos escaños le corresponden en total",
      "Ventaja: perfecta proporcionalidad nacional"
    ],
    icon: "🗳️"
  },
  {
    number: 2,
    title: "Reparto Biproporcional",
    description: "Los escaños de cada partido se distribuyen entre las circunscripciones donde obtuvo votos.",
    details: [
      "Algoritmo iterativo que ajusta la distribución",
      "Restricción 1: cada partido mantiene su total de escaños (de Etapa 1)",
      "Restricción 2: cada circunscripción mantiene su número de escaños",
      "Se garantiza que ningún partido pierde escaños respecto a etapas anteriores (no regresión)"
    ],
    icon: "⚖️"
  },
  {
    number: 3,
    title: "Ajuste de Gobernabilidad (Opcional)",
    description: "Si se desea, se puede aplicar una bonificación al partido ganador para facilitar la formación de gobierno.",
    details: [
      "Este paso es opcional y configurable",
      "El partido ganador puede recibir escaños adicionales",
      "Los escaños se restan proporcionalmente de los demás partidos",
      "Equilibrio entre representatividad y gobernabilidad"
    ],
    icon: "🏛️"
  }
];

export default function StepExplanation() {
  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <div className="bg-base-100 rounded-box shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        ¿Cómo funciona el Método GIME?
      </h2>
      
      {/* Timeline de pasos */}
      <ul className="steps steps-horizontal w-full mb-8">
        {steps.map((step) => (
          <li 
            key={step.number}
            className={`step cursor-pointer ${activeStep >= step.number ? 'step-primary' : ''}`}
            onClick={() => setActiveStep(step.number)}
          >
            {step.title}
          </li>
        ))}
      </ul>

      {/* Detalle del paso activo */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{steps[activeStep - 1].icon}</span>
            <div>
              <h3 className="card-title text-xl">
                Etapa {activeStep}: {steps[activeStep - 1].title}
              </h3>
              <p className="text-base-content/70">{steps[activeStep - 1].description}</p>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <ul className="space-y-2">
            {steps[activeStep - 1].details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="badge badge-primary badge-sm mt-1">{i + 1}</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between mt-6">
        <button 
          className="btn btn-outline"
          disabled={activeStep === 1}
          onClick={() => setActiveStep(s => s - 1)}
        >
          ← Anterior
        </button>
        <button 
          className="btn btn-primary"
          disabled={activeStep === 3}
          onClick={() => setActiveStep(s => s + 1)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
