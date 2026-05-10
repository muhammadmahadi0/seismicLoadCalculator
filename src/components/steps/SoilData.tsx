'use client';

import React, { useState } from 'react';
import { Input, Select, Card, Button } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';
import { SPTData, SiteClass, SiteCoefficients, SiteSpecificData } from '@/types';
import { calculateSiteClass } from '@/lib/bnbc-data';

const siteClassOptions: { value: string; label: string }[] = [
  { value: '', label: 'Auto from SPT Data' },
  { value: 'A', label: 'A - Hard Rock (Navg > 50)' },
  { value: 'B', label: 'B - Rock (Navg 16-50)' },
  { value: 'C', label: 'C - Very Dense Soil/Soft Rock (Navg 8-16)' },
  { value: 'D', label: 'D - Stiff Soil (Navg < 8)' },
  { value: 'E', label: 'E - Soft Clay' },
  { value: 'F', label: 'F - Special Soils' },
];

export function SoilDataStep() {
  const { formData, updateSPTData, updateManualSiteClass, updateSiteSpecificData, results } = useSeismic();

  // Local state for site-specific coefficients (Site Class F)
  const [siteSpecificEnabled, setSiteSpecificEnabled] = useState(false);
  const [siteCoeffs, setSiteCoeffs] = useState<SiteCoefficients>({
    s: 1.5,
    tb: 0.15,
    tc: 0.5,
    td: 2.0,
  });

  const handleAddRow = () => {
    if (formData.sptData.length >= 10) return;
    const lastDepth = formData.sptData[formData.sptData.length - 1]?.depth || 0;
    updateSPTData([...formData.sptData, { depth: lastDepth + 1.5, nValue: 20 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (formData.sptData.length <= 1) return;
    const newData = formData.sptData.filter((_, i) => i !== index);
    updateSPTData(newData);
  };

  const handleUpdateRow = (index: number, field: 'depth' | 'nValue', value: number) => {
    const newData = [...formData.sptData];
    newData[index] = { ...newData[index], [field]: value };
    updateSPTData(newData);
  };

  const autoSiteClass = formData.sptData.length > 0 ? calculateSiteClass(results?.navg || 0) : 'D';
  const displaySiteClass = formData.manualSiteClass || autoSiteClass;

  const handleSiteSpecificToggle = (enabled: boolean) => {
    setSiteSpecificEnabled(enabled);
    if (enabled) {
      updateSiteSpecificData({
        enabled: true,
        coefficients: siteCoeffs,
      });
    } else {
      updateSiteSpecificData(null);
    }
  };

  const handleCoeffChange = (field: keyof SiteCoefficients, value: number) => {
    const newCoeffs = { ...siteCoeffs, [field]: value };
    setSiteCoeffs(newCoeffs);
    if (siteSpecificEnabled) {
      updateSiteSpecificData({
        enabled: true,
        coefficients: newCoeffs,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Soil / Site Classification</h2>
        <p className="text-slate-500 dark:text-slate-400">Enter SPT N-values or select site class directly</p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">SPT-N Data</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddRow}
            disabled={formData.sptData.length >= 10}
          >
            + Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full spt-table">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left">Depth (m)</th>
                <th className="px-3 py-2 text-left">SPT N-Value</th>
                <th className="px-3 py-2 text-left">d/N (m/blow)</th>
                <th className="px-3 py-2 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.sptData.map((row, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.depth}
                      onChange={(e) => handleUpdateRow(index, 'depth', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      step="0.5"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.nValue}
                      onChange={(e) => handleUpdateRow(index, 'nValue', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2 font-mono text-sm text-slate-600 dark:text-slate-400">
                    {row.nValue > 0 ? (row.depth / row.nValue).toFixed(3) : '-'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleRemoveRow(index)}
                      disabled={formData.sptData.length <= 1}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Average SPT-N (Navg): <span className="font-mono font-semibold">{results?.navg.toFixed(1) || 0}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Auto Site Class: <span className="font-mono font-semibold">{autoSiteClass}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Manual Site Class Selection</h3>
        <Select
          label="Site Class"
          value={formData.manualSiteClass || ''}
          onChange={(e) => updateManualSiteClass(e.target.value as SiteClass || null)}
          options={siteClassOptions}
          helperText={
            formData.manualSiteClass
              ? `Manually selected: Site Class ${formData.manualSiteClass}`
              : `Auto-calculated from SPT data: Site Class ${autoSiteClass}`
          }
        />
      </Card>

      {/* Site Class F - Special Handling */}
      {displaySiteClass === 'F' && (
        <Card>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Site-Specific Analysis Required</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Site Class F requires site-specific geotechnical evaluation. Enter coefficients from site-specific study or leave disabled for zero results.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="siteSpecificEnabled"
              checked={siteSpecificEnabled}
              onChange={(e) => handleSiteSpecificToggle(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600"
            />
            <label htmlFor="siteSpecificEnabled" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Enter site-specific coefficients from geotechnical report
            </label>
          </div>

          {siteSpecificEnabled && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="S (Spectral Accel.)"
                type="number"
                value={siteCoeffs.s}
                onChange={(e) => handleCoeffChange('s', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
              <Input
                label="TB (s)"
                type="number"
                value={siteCoeffs.tb}
                onChange={(e) => handleCoeffChange('tb', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
              <Input
                label="TC (s)"
                type="number"
                value={siteCoeffs.tc}
                onChange={(e) => handleCoeffChange('tc', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
              <Input
                label="TD (s)"
                type="number"
                value={siteCoeffs.td}
                onChange={(e) => handleCoeffChange('td', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
            </div>
          )}
        </Card>
      )}

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">BNBC 2020 Site Class Guidelines</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-600 dark:text-slate-400">
          <div><strong>A</strong>: Hard Rock (Navg &gt; 50)</div>
          <div><strong>B</strong>: Rock (Navg 16-50)</div>
          <div><strong>C</strong>: Very Dense/Soft Rock (Navg 8-16)</div>
          <div><strong>D</strong>: Stiff Soil (Navg &lt; 8)</div>
          <div><strong>E</strong>: Soft Clay (&gt;10m, Navg &lt; 20)</div>
          <div><strong>F</strong>: Special Soils</div>
        </div>
      </div>
    </div>
  );
}