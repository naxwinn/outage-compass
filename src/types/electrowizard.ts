export interface ZoneInput {
  zoneId: string;
  expectedOutageDuration: number; // hours
  hospitalBackupHours: number;
}

export interface DerivedIntelligence {
  populationDensity: number; // people per sq km
  populationExposed: number;
  hospitalCount: number;
  hospitalTypeScore: number; // 1-10 based on types
  trafficDependencyScore: number; // 0-100
  waterDependencyScore: number; // 0-100
  telecomDependencyScore: number; // 0-100
  timeOfDay: string;
  dayType: 'weekday' | 'weekend';
  weatherRiskIndex: number; // 0-100
  resilience: number; // 0-100
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Level I Trauma' | 'Level II Trauma' | 'General' | 'Specialty' | 'Children';
  backupHours: number;
  currentStatus: 'operational' | 'backup' | 'critical';
  patientCount: number;
  icuPatients: number;
  ventilatorPatients: number;
}

export interface ZoneAnalysis {
  zoneId: string;
  input: ZoneInput;
  derived: DerivedIntelligence;
  hospitals: Hospital[];
  impactSeverity: 'low' | 'moderate' | 'high' | 'critical';
  severityScore: number; // 0-100
  restorationPriority: number; // 1 = highest priority
  cascadeRisks: CascadeRisk[];
  recommendations: string[];
}

export interface CascadeRisk {
  type: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  timeToImpact: number; // hours
}

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';
