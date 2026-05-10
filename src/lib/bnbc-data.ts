import {
  Location,
  LocationData,
  SiteClass,
  SeismicSystemType,
  SeismicSystem,
  OccupancyCategory,
  SiteCoefficients,
} from '@/types';

// BNBC 2020 Seismic Zones (Table 6.2.14) - Updated per PRD
export const LOCATION_DATA: Record<Location, LocationData> = {
  Dhaka: { name: 'Dhaka', z: 0.20, zone: 2, description: 'Zone 2 - Capital City' },
  Chittagong: { name: 'Chittagong', z: 0.28, zone: 3, description: 'Zone 3 - Port City' },
  Sylhet: { name: 'Sylhet', z: 0.36, zone: 4, description: 'Zone 4 - Northeastern Region' },
  Khulna: { name: 'Khulna', z: 0.15, zone: 2, description: 'Zone 2 - Southwestern Region' },
  Barisal: { name: 'Barisal', z: 0.12, zone: 1, description: 'Zone 1 - Southern Region' },
  Rangpur: { name: 'Rangpur', z: 0.12, zone: 1, description: 'Zone 1 - Northwestern Region' },
  Mymensingh: { name: 'Mymensingh', z: 0.20, zone: 2, description: 'Zone 2 - Central Region' },
};

// BNBC 2020 Table 6.4.1 - Site Coefficient Fa (Short Period)
export const SITE_COEFFICIENT_FA: Record<SiteClass, { ss: Record<number, number> }> = {
  A: { ss: { 0.25: 0.8, 0.5: 0.8, 0.75: 0.8, 1.0: 0.8, 1.25: 0.8, 1.5: 0.8, 2.0: 0.8 } },
  B: { ss: { 0.25: 1.0, 0.5: 1.0, 0.75: 1.0, 1.0: 1.0, 1.25: 1.0, 1.5: 1.0, 2.0: 1.0 } },
  C: { ss: { 0.25: 1.2, 0.5: 1.2, 0.75: 1.3, 1.0: 1.3, 1.25: 1.4, 1.5: 1.5, 2.0: 1.7 } },
  D: { ss: { 0.25: 1.6, 0.5: 1.7, 0.75: 1.8, 1.0: 1.9, 1.25: 2.0, 1.5: 2.2, 2.0: 2.5 } },
  E: { ss: { 0.25: 2.5, 0.5: 2.7, 0.75: 3.0, 1.0: 3.2, 1.25: 3.5, 1.5: 3.8, 2.0: 4.2 } },
  F: { ss: { 0.25: 0, 0.5: 0, 0.75: 0, 1.0: 0, 1.25: 0, 1.5: 0, 2.0: 0 } }, // Requires site-specific analysis
};

// BNBC 2020 Table 6.4.2 - Site Coefficient Fv (1-Second Period)
export const SITE_COEFFICIENT_FV: Record<SiteClass, { s1: Record<number, number> }> = {
  A: { s1: { 0.1: 0.8, 0.2: 0.8, 0.3: 0.8, 0.4: 0.8, 0.5: 0.8, 0.6: 0.8 } },
  B: { s1: { 0.1: 1.0, 0.2: 1.0, 0.3: 1.0, 0.4: 1.0, 0.5: 1.0, 0.6: 1.0 } },
  C: { s1: { 0.1: 1.5, 0.2: 1.7, 0.3: 1.9, 0.4: 2.0, 0.5: 2.1, 0.6: 2.2 } },
  D: { s1: { 0.1: 2.4, 0.2: 2.8, 0.3: 3.0, 0.4: 3.2, 0.5: 3.4, 0.6: 3.5 } },
  E: { s1: { 0.1: 4.0, 0.2: 4.5, 0.3: 4.8, 0.4: 5.0, 0.5: 5.2, 0.6: 5.4 } },
  F: { s1: { 0.1: 0, 0.2: 0, 0.3: 0, 0.4: 0, 0.5: 0, 0.6: 0 } },
};

// BNBC 2020 - Site Coefficients for Normalized Response Spectrum (S, TB, TC, TD)
export const SITE_COEFFICIENTS: Record<SiteClass, SiteCoefficients> = {
  A: { s: 1.0, tb: 0.15, tc: 0.40, td: 2.0 },  // Hard Rock (SA)
  B: { s: 1.2, tb: 0.15, tc: 0.50, td: 2.0 },  // Rock (SB)
  C: { s: 1.15, tb: 0.20, tc: 0.60, td: 2.0 }, // Very Dense Soil (SC)
  D: { s: 1.35, tb: 0.20, tc: 0.80, td: 2.0 }, // Stiff Soil (SD)
  E: { s: 1.4, tb: 0.15, tc: 0.50, td: 2.0 },  // Soft Clay (SE)
  F: { s: 0, tb: 0, tc: 0, td: 0 }, // Requires site-specific evaluation
};

// Get site coefficients for normalized response spectrum
export function getSiteCoefficients(siteClass: SiteClass): SiteCoefficients {
  if (siteClass === 'F') {
    return { s: 0, tb: 0, tc: 0, td: 0 };
  }
  return SITE_COEFFICIENTS[siteClass];
}

// BNBC 2020 Table 6.3.1 - Site Class from SPT N-values
export interface SiteClassCriteria {
  class: SiteClass;
  condition: string;
  navgMin: number;
  navgMax: number;
}

export const SITE_CLASS_CRITERIA: SiteClassCriteria[] = [
  { class: 'A', condition: 'Hard Rock', navgMin: 50, navgMax: Infinity },
  { class: 'B', condition: 'Rock', navgMin: 16, navgMax: 50 },
  { class: 'C', condition: 'Very Dense Soil / Soft Rock', navgMin: 8, navgMax: 16 },
  { class: 'D', condition: 'Stiff Soil', navgMin: 0, navgMax: 8 },
  { class: 'E', condition: 'Soft Clay', navgMin: -Infinity, navgMax: Infinity }, // Special handling
  { class: 'F', condition: 'Special Soils', navgMin: -Infinity, navgMax: Infinity },
];

// BNBC 2020 Seismic Force-Resisting Systems (Table 6.5.1)
export const SEISMIC_SYSTEMS: Record<SeismicSystemType, SeismicSystem> = {
  SMF: {
    code: 'SMF',
    name: 'Special Moment Resisting Frame',
    r: 8,
    omega: 3,
    cd: 5.5,
  },
  OMF: {
    code: 'OMF',
    name: 'Ordinary Moment Resisting Frame',
    r: 3,
    omega: 3,
    cd: 2.5,
  },
  SCBF: {
    code: 'SCBF',
    name: 'Special Concentric Braced Frame',
    r: 6,
    omega: 2,
    cd: 5,
  },
  OCBF: {
    code: 'OCBF',
    name: 'Ordinary Concentric Braced Frame',
    r: 3.5,
    omega: 3,
    cd: 3,
  },
  EBF: {
    code: 'EBF',
    name: 'Eccentric Braced Frame',
    r: 7,
    omega: 2.5,
    cd: 4,
  },
  'SW-S': {
    code: 'SW-S',
    name: 'Special Shear Wall',
    r: 6,
    omega: 2.5,
    cd: 5,
  },
  'SW-O': {
    code: 'SW-O',
    name: 'Ordinary Shear Wall',
    r: 4,
    omega: 2.5,
    cd: 4,
  },
  'Dual-SMF': {
    code: 'Dual-SMF',
    name: 'Dual System with SMF',
    r: 8,
    omega: 2.5,
    cd: 5.5,
  },
};

// BNBC 2020 Table 6.4.1 & 6.4.2 - Get Fa and Fv values
export function getFa(siteClass: SiteClass, ss: number): number {
  if (siteClass === 'F') return 0;

  const faTable = SITE_COEFFICIENT_FA[siteClass].ss;
  const ssValues = Object.keys(faTable).map(Number).sort((a, b) => a - b);

  let key = ssValues[0];
  for (const s of ssValues) {
    if (ss >= s) key = s;
  }

  return faTable[key];
}

export function getFv(siteClass: SiteClass, s1: number): number {
  if (siteClass === 'F') return 0;

  const fvTable = SITE_COEFFICIENT_FV[siteClass].s1;
  const s1Values = Object.keys(fvTable).map(Number).sort((a, b) => a - b);

  let key = s1Values[0];
  for (const s of s1Values) {
    if (s1 >= s) key = s;
  }

  return fvTable[key];
}

// BNBC 2020 Importance Factors by Occupancy Category
export const IMPORTANCE_FACTORS: Record<OccupancyCategory, number> = {
  I: 1.50, // Essential Facilities
  II: 1.25, // Hazardous Facilities
  III: 1.25, // Special Structures
  IV: 1.00, // Standard Structures
  V: 1.00, // Miscellaneous Structures
};

// Occupancy Category Descriptions
export const OCCUPANCY_DESCRIPTIONS: Record<OccupancyCategory, string> = {
  I: 'Essential Facilities (Hospitals, Fire stations, etc.)',
  II: 'Hazardous Facilities (Chemical plants, power plants, etc.)',
  III: 'Special Structures (Towers, monuments, etc.)',
  IV: 'Standard Structures (Residential, commercial, etc.)',
  V: 'Miscellaneous Structures (Fences, signs, etc.)',
};

// BNBC 2020 Table 6.6.1 & 6.6.2 - Seismic Design Category
export function getSDC(sds: number, sd1: number, occupancy: OccupancyCategory): string {
  // Based on SDS for Category A, B, D, E, F
  // Based on SD1 for Category C
  // Simplified approach for BNBC

  let sdcBySds: string;
  if (sds < 0.167) sdcBySds = 'A';
  else if (sds < 0.33) sdcBySds = 'B';
  else if (sds < 0.50) sdcBySds = 'C';
  else sdcBySds = 'D';

  let sdcBySd1: string;
  if (sd1 < 0.067) sdcBySd1 = 'A';
  else if (sd1 < 0.133) sdcBySd1 = 'B';
  else if (sd1 < 0.20) sdcBySd1 = 'C';
  else sdcBySd1 = 'D';

  // Higher of the two is controlling
  let sdc = sdcBySds > sdcBySd1 ? sdcBySds : sdcBySd1;

  // Check if higher due to occupancy
  if (occupancy === 'I' || occupancy === 'II') {
    if (sds >= 0.50 || sd1 >= 0.20) sdc = 'D';
    else if (sds >= 0.33 || sd1 >= 0.133) sdc = 'C';
    else if (sds >= 0.167 || sd1 >= 0.067) sdc = 'B';
    else sdc = 'A';
  }

  return sdc;
}

// Default spectral accelerations for Bangladesh (Dhaka example)
export function getDefaultSpectralAccelerations(location: Location): { ss: number; s1: number } {
  // For Bangladesh, use conservative estimates
  const z = LOCATION_DATA[location].z;
  // Simplified: Ss = 1.0g for all, S1 = 0.4g (typical for Bangladesh)
  return { ss: 1.0, s1: 0.4 };
}

// Default SPT Data
export const DEFAULT_SPT_DATA = [
  { depth: 1.5, nValue: 15 },
  { depth: 3.0, nValue: 18 },
  { depth: 4.5, nValue: 22 },
  { depth: 6.0, nValue: 25 },
  { depth: 7.5, nValue: 28 },
];

// Calculate approximate fundamental period (Ta)
export function calculateTa(buildingHeight: number, systemType: SeismicSystemType): number {
  // BNBC 6.4.3.1 Approximate Method
  let constCt = 0.028; // For moment frames
  let constx = 0.8;

  if (systemType === 'SMF' || systemType === 'OMF' || systemType === 'Dual-SMF') {
    return constCt * Math.pow(buildingHeight, constx);
  } else if (systemType.includes('SW')) {
    return 0.019 * Math.pow(buildingHeight, 0.9);
  } else {
    // Braced frames
    return 0.02 * Math.pow(buildingHeight, 0.75);
  }
}

// Convert SPT N-value to Site Class
export function calculateSiteClass(navg: number): SiteClass {
  if (navg >= 50) return 'A';
  if (navg >= 16) return 'B';
  if (navg >= 8) return 'C';
  if (navg > 0) return 'D';
  return 'E'; // Default to E if no data
}