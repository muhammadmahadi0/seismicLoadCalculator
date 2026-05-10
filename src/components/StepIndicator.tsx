'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: 'Project Info' },
  { number: 2, title: 'Building Info' },
  { number: 3, title: 'Soil Data' },
  { number: 4, title: 'Seismic System' },
  { number: 5, title: 'Loads' },
  { number: 6, title: 'Results' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">BNBC Seismic</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Calculator for ETABS</p>
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
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : isCompleted
                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-l-4 border-transparent text-slate-600 dark:text-slate-300'
                    : 'bg-white dark:bg-slate-900 border-l-4 border-transparent text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }
              `}
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                {isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                ) : (
                  <span className={isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                    {step.number}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          BNBC 2020 Seismic Load Calculator for structural engineers in Bangladesh.
        </p>
      </div>
    </div>
  );
}