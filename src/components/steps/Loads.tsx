'use client';

import React from 'react';
import { Input, Card } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';

export function LoadsStep() {
  const { formData, updateLoads, geometry } = useSeismic();

  const totalDeadLoad = formData.loads.deadLoad + formData.loads.additionalDeadLoad;
  const totalFloorLoad = totalDeadLoad + formData.loads.liveLoad * 0.25;
  const totalBuildingWeight = totalFloorLoad * geometry.slabArea * geometry.numberOfStories;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Loads & Weight</h2>
        <p className="text-slate-500 dark:text-slate-400">Enter design loads for seismic weight calculation</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Floor Dead Load"
            type="number"
            min={0}
            step={0.5}
            value={formData.loads.deadLoad}
            onChange={(e) => updateLoads({ deadLoad: parseFloat(e.target.value) || 0 })}
            unit="kN/m²"
            helperText="Self-weight + finishes"
          />

          <Input
            label="Additional Dead Load"
            type="number"
            min={0}
            step={0.5}
            value={formData.loads.additionalDeadLoad}
            onChange={(e) => updateLoads({ additionalDeadLoad: parseFloat(e.target.value) || 0 })}
            unit="kN/m²"
            helperText="Partitions, cladding"
          />

          <Input
            label="Floor Live Load"
            type="number"
            min={0}
            step={0.5}
            value={formData.loads.liveLoad}
            onChange={(e) => updateLoads({ liveLoad: parseFloat(e.target.value) || 0 })}
            unit="kN/m²"
            helperText="25% used in seismic (BNBC)"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Weight Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Dead Load</p>
            <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{totalDeadLoad.toFixed(1)} kN/m²</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">Effective Live Load (25%)</p>
            <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{(formData.loads.liveLoad * 0.25).toFixed(1)} kN/m²</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Floor Load</p>
            <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">{totalFloorLoad.toFixed(1)} kN/m²</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Building Weight (W)</p>
            <p className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">{totalBuildingWeight.toFixed(0)} kN</p>
          </div>
        </div>
      </Card>

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Note on Seismic Weight (W)</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          According to BNBC 2020 Section 6.4.2, seismic weight W consists of the total dead load of the structure
          plus 25% of the live load (or snow load where applicable). This weight is used to calculate the
          design base shear V = Cₛ × W.
        </p>
      </div>
    </div>
  );
}