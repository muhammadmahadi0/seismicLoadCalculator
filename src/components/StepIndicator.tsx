'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { number: 1, title: 'Project Info', icon: '📋' },
  { number: 2, title: 'Building Info', icon: '🏢' },
  { number: 3, title: 'Soil Data', icon: '🗺️' },
  { number: 4, title: 'Seismic System', icon: '⚙️' },
  { number: 5, title: 'Loads', icon: '⚖️' },
  { number: 6, title: 'Results', icon: '📊' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-emerald-600">BNBC Seismic</h1>
        <p className="text-xs text-slate-500">Calculator for ETABS</p>
      </div>

      <nav className="space-y-2">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              disabled={step.number > currentStep}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                transition-all duration-200
                ${isCurrent
                  ? 'bg-emerald-50 border-l-4 border-emerald-600 text-emerald-700'
                  : isCompleted
                    ? 'bg-white hover:bg-slate-50 border-l-4 border-transparent text-slate-600'
                    : 'bg-white border-l-4 border-transparent text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                {isCompleted ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className={isCurrent ? 'text-emerald-600' : 'text-slate-400'}>
                    {step.number}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-500">
          BNBC 2020 Seismic Load Calculator for structural engineers in Bangladesh.
        </p>
      </div>
    </div>
  );
}