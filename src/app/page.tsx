'use client';

import React, { useState } from 'react';
import { StepIndicator } from '@/components/StepIndicator';
import { ProjectInfoStep } from '@/components/steps/ProjectInfo';
import { BuildingInfoStep } from '@/components/steps/BuildingInfo';
import { SoilDataStep } from '@/components/steps/SoilData';
import { SeismicSystemStep } from '@/components/steps/SeismicSystem';
import { LoadsStep } from '@/components/steps/Loads';
import { ResultsStep } from '@/components/steps/Results';
import { useSeismic } from '@/context/SeismicContext';
import { Button } from '@/components/ui/Input';

function StepNavigation() {
  const { currentStep, setCurrentStep, formData } = useSeismic();
  const canProceed = currentStep < 6;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
      <Button
        variant="secondary"
        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
        disabled={currentStep === 1}
      >
        ← Previous
      </Button>
      {canProceed && (
        <Button onClick={() => setCurrentStep(currentStep + 1)}>
          Next →
        </Button>
      )}
      {currentStep === 6 && (
        <Button onClick={() => setCurrentStep(1)}>
          New Calculation
        </Button>
      )}
    </div>
  );
}

function CurrentStepContent() {
  const { currentStep } = useSeismic();

  switch (currentStep) {
    case 1:
      return <ProjectInfoStep />;
    case 2:
      return <BuildingInfoStep />;
    case 3:
      return <SoilDataStep />;
    case 4:
      return <SeismicSystemStep />;
    case 5:
      return <LoadsStep />;
    case 6:
      return <ResultsStep />;
    default:
      return <ProjectInfoStep />;
  }
}

export default function Home() {
  const { currentStep, setCurrentStep, results } = useSeismic();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">BNBC 2020 Seismic Calculator</h1>
            <p className="text-slate-500 mt-1">
              Calculate seismic loads for ETABS analysis based on Bangladesh National Building Code 2020
            </p>
          </header>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <React.Fragment key={step}>
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                      transition-all duration-200
                      ${currentStep >= step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                      }
                    `}
                  >
                    {step}
                  </button>
                  {step < 6 && (
                    <div className={`flex-1 h-1 rounded ${currentStep > step ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <CurrentStepContent />

          {/* Navigation */}
          <StepNavigation />

          {/* Quick Results Summary (Always visible) */}
          {results && currentStep < 6 && (
            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h3 className="font-semibold text-emerald-800 mb-2">Quick Results Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-emerald-600">Site Class:</span>
                  <span className="font-mono font-semibold ml-1">{results.siteClass}</span>
                </div>
                <div>
                  <span className="text-emerald-600">SDS:</span>
                  <span className="font-mono font-semibold ml-1">{results.sds.toFixed(3)}g</span>
                </div>
                <div>
                  <span className="text-emerald-600">SD1:</span>
                  <span className="font-mono font-semibold ml-1">{results.sd1.toFixed(3)}g</span>
                </div>
                <div>
                  <span className="text-emerald-600">SDC:</span>
                  <span className="font-mono font-semibold ml-1">{results.sdc}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}