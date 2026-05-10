'use client';

import React from 'react';
import { Input, Select, Card } from '@/components/ui/Input';
import { useSeismic } from '@/context/SeismicContext';
import { Location, OccupancyCategory, ExposureCategory } from '@/types';
import { LOCATION_DATA, OCCUPANCY_DESCRIPTIONS } from '@/lib/bnbc-data';

const locationOptions = Object.entries(LOCATION_DATA).map(([value, data]) => ({
  value,
  label: `${data.name} (Zone ${data.zone}, Z=${data.z})`,
}));

const occupancyOptions: { value: OccupancyCategory; label: string }[] = [
  { value: 'I', label: 'Category I - Essential Facilities' },
  { value: 'II', label: 'Category II - Hazardous Facilities' },
  { value: 'III', label: 'Category III - Special Structures' },
  { value: 'IV', label: 'Category IV - Standard Structures' },
  { value: 'V', label: 'Category V - Miscellaneous Structures' },
];

const exposureOptions: { value: ExposureCategory; label: string }[] = [
  { value: 'A', label: 'Category A - Flat, unobstructed' },
  { value: 'B', label: 'Category B - Urban, suburban' },
  { value: 'C', label: 'Category C - Open terrain' },
  { value: 'D', label: 'Category D - Exposed coastal' },
];

export function ProjectInfoStep() {
  const { formData, updateProject } = useSeismic();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Project Information</h2>
        <p className="text-slate-500 dark:text-slate-400">Enter basic project details and location</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Project Name"
              value={formData.project.projectName}
              onChange={(e) => updateProject({ projectName: e.target.value })}
              placeholder="e.g., ABC Tower, Dhaka"
            />
          </div>

          <Select
            label="Project Location"
            value={formData.project.location}
            onChange={(e) => updateProject({ location: e.target.value as Location })}
            options={locationOptions}
            helperText={LOCATION_DATA[formData.project.location].description}
          />

          <Select
            label="Occupancy Category"
            value={formData.project.occupancyCategory}
            onChange={(e) => updateProject({ occupancyCategory: e.target.value as OccupancyCategory })}
            options={occupancyOptions}
            helperText={OCCUPANCY_DESCRIPTIONS[formData.project.occupancyCategory]}
          />

          <Select
            label="Wind Exposure Category"
            value={formData.project.exposureCategory}
            onChange={(e) => updateProject({ exposureCategory: e.target.value as ExposureCategory })}
            options={exposureOptions}
          />
        </div>
      </Card>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h4 className="font-medium text-emerald-800 dark:text-emerald-300">Seismic Zone Information</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
              Current location: <strong>{formData.project.location}</strong> — Zone <strong>{LOCATION_DATA[formData.project.location].zone}</strong> with Zone Coefficient Z = <strong className="font-mono">{LOCATION_DATA[formData.project.location].z}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}