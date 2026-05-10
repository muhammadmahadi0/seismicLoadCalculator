'use client';

import React from 'react';
import { Input, Card } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';

export function BuildingInfoStep() {
  const { formData, updateGeometry, buildingHeight } = useSeismic();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Building Geometry</h2>
        <p className="text-slate-500">Enter building dimensions and story count</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            label="Number of Stories"
            type="number"
            min={1}
            max={50}
            value={formData.geometry.numberOfStories}
            onChange={(e) => updateGeometry({ numberOfStories: parseInt(e.target.value) || 1 })}
            helperText="1 to 50 stories"
          />

          <Input
            label="Floor Height"
            type="number"
            min={2}
            max={6}
            step={0.1}
            value={formData.geometry.floorHeight}
            onChange={(e) => updateGeometry({ floorHeight: parseFloat(e.target.value) || 3 })}
            unit="m"
            helperText="Typical: 3.0m"
          />

          <Input
            label="Total Building Height"
            type="text"
            value={buildingHeight.toFixed(1)}
            disabled
            helperText="Auto-calculated"
          />

          <Input
            label="Floor Area (Typical Floor)"
            type="number"
            min={10}
            value={formData.geometry.slabArea}
            onChange={(e) => updateGeometry({ slabArea: parseFloat(e.target.value) || 100 })}
            unit="m²"
            helperText="Approximate floor area"
          />

          <Input
            label="Plan Length (L)"
            type="number"
            min={1}
            value={formData.geometry.planLength}
            onChange={(e) => updateGeometry({ planLength: parseFloat(e.target.value) || 10 })}
            unit="m"
          />

          <Input
            label="Plan Width (B)"
            type="number"
            min={1}
            value={formData.geometry.planWidth}
            onChange={(e) => updateGeometry({ planWidth: parseFloat(e.target.value) || 10 })}
            unit="m"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Building Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-500">Stories</p>
            <p className="text-2xl font-bold font-mono text-slate-800">{formData.geometry.numberOfStories}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-500">Height</p>
            <p className="text-2xl font-bold font-mono text-slate-800">{buildingHeight.toFixed(1)} m</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-500">Floor Area</p>
            <p className="text-2xl font-bold font-mono text-slate-800">{formData.geometry.slabArea} m²</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-500">Plan Area</p>
            <p className="text-2xl font-bold font-mono text-slate-800">{(formData.geometry.planLength * formData.geometry.planWidth).toFixed(0)} m²</p>
          </div>
        </div>
      </Card>
    </div>
  );
}