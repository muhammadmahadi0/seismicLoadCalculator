// BNBC 2020 Seismic Calculator Types

export type Location = 'Dhaka' | 'Chittagong' | 'Sylhet' | 'Khulna' | 'Barisal' | 'Rangpur' | 'Mymensingh';

export type OccupancyCategory = 'I' | 'II' | 'III' | 'IV' | 'V';

export type ExposureCategory = 'A' | 'B' | 'C' | 'D';

export type SiteClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type SeismicSystemType =
  | 'SMF'       // Special Moment Resisting Frame
  | 'OMF'       // Ordinary Moment Resisting Frame
  | 'SCBF'      // Special Concentric Braced Frame
  | 'OCBF'      // Ordinary Concentric Braced Frame
  | 'EBF'       // Eccentric Braced Frame
  | 'SW-S'      // Special Shear Wall
  | 'SW-O'      // Ordinary Shear Wall
  | 'Dual-SMF'; // Dual System with SMF

export interface SPTData {
  depth: number;
  nValue: number;
}

export interface LocationData {
  name: Location;
  z: number;
  zone: number;
  description: string;
}

// Site coefficients for normalized response spectrum (BNBC 2020)
export interface SiteCoefficients {
  s: number;   // Spectral acceleration coefficient
  tb: number;  // Beginning of constant acceleration region (s)
  tc: number;  // End of constant acceleration region (s)
  td: number;  // Beginning of constant displacement region (s)
}

// Optional site-specific coefficients for Site Class F
export interface SiteSpecificData {
  enabled: boolean;
  coefficients: SiteCoefficients;
}

export interface SeismicSystem {
  code: SeismicSystemType;
  name: string;
  r: number;
  omega: number;
  cd: number;
}

export interface ProjectData {
  projectName: string;
  location: Location;
  occupancyCategory: OccupancyCategory;
  exposureCategory: ExposureCategory;
}

export interface BuildingGeometry {
  numberOfStories: number;
  floorHeight: number;
  slabArea: number;
  planLength: number;
  planWidth: number;
}

export interface LoadData {
  deadLoad: number;
  liveLoad: number;
  additionalDeadLoad: number;
}

export interface CalculationResults {
  // Site Classification
  siteClass: SiteClass;
  navg: number;

  // Seismic Coefficients
  z: number;
  zone: number;
  fa: number;
  fv: number;
  sds: number;
  sd1: number;

  // System factors
  r: number;
  omega: number;
  cd: number;
  i: number;

  // Spectral Accelerations
  ss: number;
  s1: number;
  cs: number;  // Normalized acceleration response spectrum
  sa: number;  // Design spectral acceleration S_a = (2/3) * Z * I * C_s

  // Design parameters
  sdc: string;
  v: number;
  ta: number;
  totalWeight: number;
}

export interface SeismicFormData {
  project: ProjectData;
  geometry: BuildingGeometry;
  sptData: SPTData[];
  manualSiteClass: SiteClass | null;
  siteSpecificData: SiteSpecificData | null;
  seismicSystem: SeismicSystemType;
  loads: LoadData;
}