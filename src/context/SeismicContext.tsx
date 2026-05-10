'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  SeismicFormData,
  ProjectData,
  BuildingGeometry,
  SeismicSystemType,
  LoadData,
  SPTData,
  SiteClass,
  CalculationResults,
  Location,
  OccupancyCategory,
  ExposureCategory,
  SiteSpecificData,
  SiteCoefficients,
} from '@/types';
import { DEFAULT_SPT_DATA } from '@/lib/bnbc-data';
import { calculateSeismicParameters } from '@/lib/calculations';

interface SeismicContextType {
  formData: SeismicFormData;
  currentStep: number;
  results: CalculationResults | null;
  setCurrentStep: (step: number) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateGeometry: (data: Partial<BuildingGeometry>) => void;
  updateSPTData: (data: SPTData[]) => void;
  updateManualSiteClass: (siteClass: SiteClass | null) => void;
  updateSiteSpecificData: (data: SiteSpecificData | null) => void;
  updateSeismicSystem: (system: SeismicSystemType) => void;
  updateLoads: (data: Partial<LoadData>) => void;
  buildingHeight: number;
  geometry: BuildingGeometry;
}

const defaultProjectData: ProjectData = {
  projectName: '',
  location: 'Dhaka',
  occupancyCategory: 'IV',
  exposureCategory: 'B',
};

const defaultGeometry: BuildingGeometry = {
  numberOfStories: 5,
  floorHeight: 3.0,
  slabArea: 200,
  planLength: 15,
  planWidth: 12,
};

const defaultLoads: LoadData = {
  deadLoad: 12,
  liveLoad: 3,
  additionalDeadLoad: 2,
};

const initialFormData: SeismicFormData = {
  project: defaultProjectData,
  geometry: defaultGeometry,
  sptData: DEFAULT_SPT_DATA,
  manualSiteClass: null,
  siteSpecificData: null,
  seismicSystem: 'SMF',
  loads: defaultLoads,
};

const SeismicContext = createContext<SeismicContextType | undefined>(undefined);

export function SeismicProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<SeismicFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const buildingHeight = formData.geometry.numberOfStories * formData.geometry.floorHeight;

  const updateProject = useCallback((data: Partial<ProjectData>) => {
    setFormData(prev => ({
      ...prev,
      project: { ...prev.project, ...data },
    }));
  }, []);

  const updateGeometry = useCallback((data: Partial<BuildingGeometry>) => {
    setFormData(prev => ({
      ...prev,
      geometry: { ...prev.geometry, ...data },
    }));
  }, []);

  const updateSPTData = useCallback((data: SPTData[]) => {
    setFormData(prev => ({
      ...prev,
      sptData: data,
    }));
  }, []);

  const updateManualSiteClass = useCallback((siteClass: SiteClass | null) => {
    setFormData(prev => ({
      ...prev,
      manualSiteClass: siteClass,
    }));
  }, []);

  const updateSiteSpecificData = useCallback((data: SiteSpecificData | null) => {
    setFormData(prev => ({
      ...prev,
      siteSpecificData: data,
    }));
  }, []);

  const updateSeismicSystem = useCallback((system: SeismicSystemType) => {
    setFormData(prev => ({
      ...prev,
      seismicSystem: system,
    }));
  }, []);

  const updateLoads = useCallback((data: Partial<LoadData>) => {
    setFormData(prev => ({
      ...prev,
      loads: { ...prev.loads, ...data },
    }));
  }, []);

  const results = useMemo(() => {
    const siteSpecificCoeffs = formData.siteSpecificData?.enabled
      ? formData.siteSpecificData.coefficients
      : undefined;
    return calculateSeismicParameters(formData, buildingHeight, siteSpecificCoeffs);
  }, [formData, buildingHeight]);

  const value: SeismicContextType = {
    formData,
    currentStep,
    results,
    setCurrentStep,
    updateProject,
    updateGeometry,
    updateSPTData,
    updateManualSiteClass,
    updateSiteSpecificData,
    updateSeismicSystem,
    updateLoads,
    buildingHeight,
    geometry: formData.geometry,
  };

  return (
    <SeismicContext.Provider value={value}>
      {children}
    </SeismicContext.Provider>
  );
}

export function useSeismic() {
  const context = useContext(SeismicContext);
  if (context === undefined) {
    throw new Error('useSeismic must be used within a SeismicProvider');
  }
  return context;
}