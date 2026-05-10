import {
  SeismicFormData,
  CalculationResults,
  SiteClass,
  SPTData,
  SiteCoefficients,
} from '@/types';
import {
  LOCATION_DATA,
  getFa,
  getFv,
  getDefaultSpectralAccelerations,
  getSDC,
  calculateTa,
  calculateSiteClass,
  SEISMIC_SYSTEMS,
  IMPORTANCE_FACTORS,
  getSiteCoefficients,
} from './bnbc-data';

// Calculate average SPT-N value
export function calculateNavg(sptData: SPTData[]): number {
  if (sptData.length === 0) return 0;
  const sum = sptData.reduce((acc, row) => acc + row.nValue, 0);
  return sum / sptData.length;
}

// Calculate Normalized Acceleration Response Spectrum (C_s) per BNBC 2020
// For 0 ≤ T ≤ TB: C_s = S * [1 + (T/TB) * (η * 2.5 - 1)]
// For TB ≤ T ≤ TC: C_s = S * η * 2.5
// For TC ≤ T ≤ TD: C_s = S * η * 2.5 * (TC/T)
// For T > TD: C_s = S * η * 2.5 * (TC * TD) / T²
// η = damping correction factor (default 1.0 for 5% damping)
export function calculateCs(period: number, siteCoeffs: SiteCoefficients, eta: number = 1.0): number {
  const { s, tb, tc, td } = siteCoeffs;

  if (s === 0) return 0; // Site Class F with no coefficients

  if (period <= tb) {
    return s * (1 + (period / tb) * (eta * 2.5 - 1));
  } else if (period <= tc) {
    return s * eta * 2.5;
  } else if (period <= td) {
    return s * eta * 2.5 * (tc / period);
  } else {
    return s * eta * 2.5 * (tc * td) / (period * period);
  }
}

// Calculate Design Spectral Acceleration (S_a) per BNBC 2020
// S_a = (2/3) * Z * I * C_s
export function calculateSa(z: number, i: number, cs: number): number {
  return (2 / 3) * z * i * cs;
}

// Main calculation function - BNBC 2020 Compliant
export function calculateSeismicParameters(
  formData: SeismicFormData,
  buildingHeight: number,
  siteSpecificCoeffs?: SiteCoefficients // For Site Class F manual entry
): CalculationResults {
  const { project, sptData, manualSiteClass, seismicSystem, loads, geometry } = formData;

  // Get location data
  const locationData = LOCATION_DATA[project.location];
  const z = locationData.z;
  const zone = locationData.zone;

  // Determine Site Class
  let siteClass: SiteClass;
  if (manualSiteClass) {
    siteClass = manualSiteClass;
  } else if (sptData.length > 0) {
    const navg = calculateNavg(sptData);
    siteClass = calculateSiteClass(navg);
  } else {
    siteClass = 'D'; // Default
  }

  // Get spectral accelerations
  const { ss, s1 } = getDefaultSpectralAccelerations(project.location);

  // Get site coefficients (Fa, Fv for SDS/SD1)
  const fa = siteClass !== 'F' || !siteSpecificCoeffs ? getFa(siteClass, ss) : siteSpecificCoeffs.s;
  const fv = siteClass !== 'F' || !siteSpecificCoeffs ? getFv(siteClass, s1) : siteSpecificCoeffs.s;

  // Get normalized response spectrum coefficients (S, TB, TC, TD)
  let siteCoeffs: SiteCoefficients;
  if (siteClass === 'F' && siteSpecificCoeffs) {
    siteCoeffs = siteSpecificCoeffs;
  } else {
    siteCoeffs = getSiteCoefficients(siteClass);
  }

  // Calculate SDS and SD1 (BNBC 6.4.2)
  const sds = (2 / 3) * fa * z;
  const sd1 = (2 / 3) * fv * z;

  // Get system parameters
  const system = SEISMIC_SYSTEMS[seismicSystem];
  const r = system.r;
  const omega = system.omega;
  const cd = system.cd;

  // Get importance factor
  const i = IMPORTANCE_FACTORS[project.occupancyCategory];

  // Calculate Seismic Design Category
  const sdc = getSDC(sds, sd1, project.occupancyCategory);

  // Calculate approximate period (Ta)
  const ta = calculateTa(buildingHeight, seismicSystem);

  // Calculate total seismic weight (W)
  // W = Total Dead Load + 25% of Live Load (per BNBC 6.4.2)
  const totalDeadLoad = loads.deadLoad * geometry.slabArea;
  const additionalDead = loads.additionalDeadLoad * geometry.slabArea;
  const liveLoadComponent = loads.liveLoad * geometry.slabArea * 0.25;
  const totalWeight = totalDeadLoad + additionalDead + liveLoadComponent;

  // Calculate Normalized Response Spectrum (C_s) at period Ta
  const cs = calculateCs(ta, siteCoeffs);

  // Calculate Design Spectral Acceleration (S_a) per BNBC 2020
  // S_a = (2/3) * Z * I * C_s
  const sa = calculateSa(z, i, cs);

  // Calculate Base Shear (V) per BNBC 2020
  // V = S_a * W
  const v = siteClass === 'F' && !siteSpecificCoeffs ? 0 : sa * totalWeight;

  // Calculate navg for display
  const navg = calculateNavg(sptData);

  return {
    siteClass,
    navg,
    z,
    zone,
    fa,
    fv,
    sds,
    sd1,
    r,
    omega,
    cd,
    i,
    ss,
    s1,
    sdc,
    cs,
    sa,
    v,
    ta,
    totalWeight,
  };
}

// Generate ETABS-compatible parameter string
export function generateETABSOutput(results: CalculationResults, formData: SeismicFormData): string {
  const { project, geometry, loads } = formData;

  const lines = [
    '======================================',
    'BNBC 2020 SEISMIC PARAMETERS',
    'ETABS Import Format',
    '======================================',
    `Project: ${project.projectName}`,
    `Location: ${project.location}`,
    `Seismic Zone: ${results.zone} (Z = ${results.z.toFixed(3)})`,
    '',
    '--- SEISMIC COEFFICIENTS ---',
    `Site Class: ${results.siteClass}`,
    `Fa: ${results.fa.toFixed(3)}`,
    `Fv: ${results.fv.toFixed(3)}`,
    `SDS: ${results.sds.toFixed(4)}`,
    `SD1: ${results.sd1.toFixed(4)}`,
    '',
    '--- BNBC 2020 DESIGN SPECTRAL ACCELERATION ---',
    `Normalized Response Spectrum (Cs): ${results.cs.toFixed(4)}`,
    `Design Spectral Accel (Sa): ${results.sa.toFixed(4)}g`,
    `Formula: Sa = (2/3) × Z × I × Cs`,
    '',
    '--- SYSTEM FACTORS ---',
    `Response Modification (R): ${results.r}`,
    `Overstrength Factor (Omega): ${results.omega}`,
    `Deflection Amplification (Cd): ${results.cd}`,
    `Importance Factor (I): ${results.i}`,
    '',
    '--- DESIGN PARAMETERS ---',
    `Seismic Design Category: ${results.sdc}`,
    `Base Shear (V): ${results.v.toFixed(2)} kN`,
    `Formula: V = Sa × W`,
    `Total Seismic Weight (W): ${results.totalWeight.toFixed(2)} kN`,
    `Approximate Period (Ta): ${results.ta.toFixed(3)} s`,
    '',
    '--- BUILDING DATA ---',
    `Number of Stories: ${geometry.numberOfStories}`,
    `Floor Height: ${geometry.floorHeight} m`,
    `Total Building Height: ${geometry.floorHeight * geometry.numberOfStories} m`,
    `Floor Area: ${geometry.slabArea} m²`,
    '',
    '--- LOADS ---',
    `Dead Load: ${loads.deadLoad} kN/m²`,
    `Live Load: ${loads.liveLoad} kN/m²`,
    `Additional Dead Load: ${loads.additionalDeadLoad} kN/m²`,
    '',
    '======================================',
    'Generated by BNBC Seismic Calculator',
    '======================================',
  ];

  return lines.join('\n');
}

// Generate short copy string for a single value
export function generateSingleValueCopy(key: string, value: number | string): string {
  return `${key}: ${value}`;
}