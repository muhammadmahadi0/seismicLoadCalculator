'use client';

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';
import { generateETABSOutput } from '@/lib/calculations';
import { SEISMIC_SYSTEMS, LOCATION_DATA } from '@/lib/bnbc-data';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded transition-colors"
    >
      {copied ? '✓' : label || 'Copy'}
    </button>
  );
}

export function ResultsStep() {
  const { formData, results } = useSeismic();
  const [copiedAll, setCopiedAll] = useState(false);

  if (!results) return null;

  const system = SEISMIC_SYSTEMS[formData.seismicSystem];
  const location = LOCATION_DATA[formData.project.location];
  const etabsOutput = generateETABSOutput(results, formData);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(etabsOutput);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Seismic Design Parameters</h2>
          <p className="text-slate-500 dark:text-slate-400">BNBC 2020 calculations - Ready for ETABS input</p>
        </div>
        <Button onClick={handleCopyAll}>
          {copiedAll ? '✓ Copied!' : '📋 Copy All for ETABS'}
        </Button>
      </div>

      {/* Main Results - ETABS Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - System Factors */}
        <Card className="border-l-4 border-l-emerald-500 dark:border-l-emerald-400">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <span className="w-1 h-6 bg-emerald-500 dark:bg-emerald-400 mr-3 rounded"></span>
            System Factors
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Response Modification (R)</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{results.r}</span>
                <CopyButton text={`R = ${results.r}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">System Overstrength (Ω₀)</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{results.omega}</span>
                <CopyButton text={`Omega = ${results.omega}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Deflection Amplification (C<sub>d</sub>)</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{results.cd}</span>
                <CopyButton text={`Cd = ${results.cd}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">Occupancy Importance (I)</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{results.i}</span>
                <CopyButton text={`I = ${results.i}`} />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              <strong>System:</strong> {system.name}
            </p>
          </div>
        </Card>

        {/* Right Side - Seismic Coefficients */}
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-500 dark:bg-blue-400 mr-3 rounded"></span>
            Seismic Coefficients
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">0.2s Spectral Accel (S<sub>S</sub>)</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{results.ss.toFixed(3)}g</span>
                <CopyButton text={`Ss = ${results.ss}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">1.0s Spectral Accel (S<sub>1</sub>)</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{results.s1.toFixed(3)}g</span>
                <CopyButton text={`S1 = ${results.s1}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Site Class</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{results.siteClass}</span>
                <CopyButton text={`Site Class = ${results.siteClass}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Site Coefficient (F<sub>a</sub>)</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{results.fa.toFixed(3)}</span>
                <CopyButton text={`Fa = ${results.fa.toFixed(3)}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Site Coefficient (F<sub>v</sub>)</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{results.fv.toFixed(3)}</span>
                <CopyButton text={`Fv = ${results.fv.toFixed(3)}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium">S<sub>DS</sub> = (2/3) × F<sub>a</sub> × Z</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{results.sds.toFixed(4)}g</span>
                <CopyButton text={`SDS = ${results.sds.toFixed(4)}`} />
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">S<sub>D1</sub> = (2/3) × F<sub>v</sub> × Z</span>
              <div className="flex items-center">
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{results.sd1.toFixed(4)}g</span>
                <CopyButton text={`SD1 = ${results.sd1.toFixed(4)}`} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Design Category</h4>
          <div className="text-center py-4">
            <span className="text-5xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{results.sdc}</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Seismic Design Category</p>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Base Shear</h4>
          <div className="text-center py-4">
            <span className="text-4xl font-bold font-mono text-blue-600 dark:text-blue-400">{results.v.toFixed(1)}</span>
            <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400"> kN</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">V = Cₛ × W</p>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Seismic Zone</h4>
          <div className="text-center py-4">
            <span className="text-4xl font-bold font-mono text-amber-600 dark:text-amber-400">Z = {location.z}</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{formData.project.location}</p>
          </div>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Additional Parameters</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Weight (W)</p>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{results.totalWeight.toFixed(0)} kN</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
              <p className="text-xs text-slate-500 dark:text-slate-400">Response Coeff (Cₛ)</p>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{results.cs.toFixed(4)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
              <p className="text-xs text-slate-500 dark:text-slate-400">Period (Tₐ)</p>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{results.ta.toFixed(3)} s</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg SPT-N (Nₐᵥg)</p>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{results.navg.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Project Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Project:</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{formData.project.projectName || 'Untitled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Location:</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{formData.project.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Stories:</span>
              <span className="font-mono text-slate-800 dark:text-slate-100">{formData.geometry.numberOfStories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Height:</span>
              <span className="font-mono text-slate-800 dark:text-slate-100">{(formData.geometry.numberOfStories * formData.geometry.floorHeight).toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Occupancy:</span>
              <span className="font-mono text-slate-800 dark:text-slate-100">Category {formData.project.occupancyCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">System:</span>
              <span className="font-mono text-slate-800 dark:text-slate-100">{formData.seismicSystem}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ETABS Export Box - Dark Theme Box */}
      <Card className="bg-slate-900 dark:bg-slate-950 text-slate-100 border border-slate-800 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-white dark:text-slate-100 mb-4 flex items-center">
          📋 ETABS Parameters (Copy to Clipboard)
        </h3>
        <pre className="text-xs font-mono overflow-x-auto p-4 bg-slate-800/50 dark:bg-slate-900 rounded-lg max-h-64 text-slate-300 dark:text-slate-400">
          {etabsOutput}
        </pre>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleCopyAll} variant="secondary">
            {copiedAll ? '✓ Copied!' : 'Copy All Parameters'}
          </Button>
        </div>
      </Card>
    </div>
  );
}