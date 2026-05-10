'use client';

import React from 'react';
import { Select, Card } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';
import { SeismicSystemType } from '@/types';
import { SEISMIC_SYSTEMS } from '@/lib/bnbc-data';

const systemOptions: { value: SeismicSystemType; label: string }[] = [
  { value: 'SMF', label: 'Special Moment Resisting Frame (SMRF)' },
  { value: 'OMF', label: 'Ordinary Moment Resisting Frame (OMRF)' },
  { value: 'SCBF', label: 'Special Concentric Braced Frame (SCBF)' },
  { value: 'OCBF', label: 'Ordinary Concentric Braced Frame (OCBF)' },
  { value: 'EBF', label: 'Eccentric Braced Frame (EBF)' },
  { value: 'SW-S', label: 'Special Shear Wall' },
  { value: 'SW-O', label: 'Ordinary Shear Wall' },
  { value: 'Dual-SMF', label: 'Dual System with Special Moment Frame' },
];

export function SeismicSystemStep() {
  const { formData, updateSeismicSystem } = useSeismic();
  const system = SEISMIC_SYSTEMS[formData.seismicSystem];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Seismic Force-Resisting System</h2>
        <p className="text-slate-500">Select the lateral force-resisting system type</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6">
          <Select
            label="System Type"
            value={formData.seismicSystem}
            onChange={(e) => updateSeismicSystem(e.target.value as SeismicSystemType)}
            options={systemOptions}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">System Coefficients (BNBC 2020 Table 6.5.1)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <p className="text-sm text-emerald-700 mb-1">Response Modification</p>
            <p className="text-4xl font-bold font-mono text-emerald-800">R</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">{system.r}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-sm text-amber-700 mb-1">Overstrength Factor</p>
            <p className="text-4xl font-bold font-mono text-amber-800">Ω₀</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-2">{system.omega}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 mb-1">Deflection Amplification</p>
            <p className="text-4xl font-bold font-mono text-blue-800">C<sub>d</sub></p>
            <p className="text-2xl font-bold font-mono text-blue-600 mt-2">{system.cd}</p>
          </div>
        </div>
      </Card>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">System Description</h4>
        <p className="text-slate-600">{system.name}</p>
        <div className="mt-3 text-sm text-slate-500">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>R = {system.r}</strong>: Reduces elastic design forces to account for inelastic behavior</li>
            <li><strong>Ω₀ = {system.omega}</strong>: Amplification factor for overstrength design</li>
            <li><strong>C<sub>d</sub> = {system.cd}</strong>: Amplifies elastic displacements for drift calculations</li>
          </ul>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Common Systems Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">System</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">R</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">Ω₀</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">C<sub>d</sub></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(SEISMIC_SYSTEMS).map((sys) => (
                <tr
                  key={sys.code}
                  className={formData.seismicSystem === sys.code ? 'bg-emerald-50' : ''}
                >
                  <td className="px-3 py-2">{sys.name}</td>
                  <td className="px-3 py-2 text-center font-mono">{sys.r}</td>
                  <td className="px-3 py-2 text-center font-mono">{sys.omega}</td>
                  <td className="px-3 py-2 text-center font-mono">{sys.cd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}