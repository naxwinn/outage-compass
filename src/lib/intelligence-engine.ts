import { ZoneInput, DerivedIntelligence, Hospital, ZoneAnalysis, CascadeRisk, SeverityLevel } from '@/types/electrowizard';

// Simulated zone database
const zoneDatabase: Record<string, Partial<DerivedIntelligence> & { hospitals: Omit<Hospital, 'currentStatus'>[] }> = {
  'ZONE-001': {
    populationDensity: 8500,
    populationExposed: 125000,
    hospitalCount: 3,
    hospitalTypeScore: 8.5,
    trafficDependencyScore: 75,
    waterDependencyScore: 60,
    telecomDependencyScore: 85,
    hospitals: [
      { id: 'H001', name: 'Metro General Hospital', type: 'Level I Trauma', backupHours: 48, patientCount: 450, icuPatients: 45, ventilatorPatients: 22 },
      { id: 'H002', name: 'St. Mary\'s Medical Center', type: 'General', backupHours: 24, patientCount: 280, icuPatients: 18, ventilatorPatients: 8 },
      { id: 'H003', name: 'Children\'s Regional', type: 'Children', backupHours: 36, patientCount: 180, icuPatients: 25, ventilatorPatients: 12 },
    ]
  },
  'ZONE-002': {
    populationDensity: 3200,
    populationExposed: 45000,
    hospitalCount: 1,
    hospitalTypeScore: 5.0,
    trafficDependencyScore: 45,
    waterDependencyScore: 70,
    telecomDependencyScore: 55,
    hospitals: [
      { id: 'H004', name: 'Suburban Community Hospital', type: 'General', backupHours: 18, patientCount: 120, icuPatients: 8, ventilatorPatients: 3 },
    ]
  },
  'ZONE-003': {
    populationDensity: 12000,
    populationExposed: 210000,
    hospitalCount: 5,
    hospitalTypeScore: 9.2,
    trafficDependencyScore: 90,
    waterDependencyScore: 80,
    telecomDependencyScore: 95,
    hospitals: [
      { id: 'H005', name: 'University Medical Center', type: 'Level I Trauma', backupHours: 72, patientCount: 650, icuPatients: 80, ventilatorPatients: 45 },
      { id: 'H006', name: 'Downtown Emergency', type: 'Level II Trauma', backupHours: 36, patientCount: 320, icuPatients: 35, ventilatorPatients: 18 },
      { id: 'H007', name: 'Heart & Vascular Institute', type: 'Specialty', backupHours: 48, patientCount: 180, icuPatients: 40, ventilatorPatients: 15 },
      { id: 'H008', name: 'Pediatric Care Center', type: 'Children', backupHours: 42, patientCount: 140, icuPatients: 20, ventilatorPatients: 10 },
      { id: 'H009', name: 'Memorial Hospital', type: 'General', backupHours: 24, patientCount: 380, icuPatients: 22, ventilatorPatients: 9 },
    ]
  },
  'ZONE-004': {
    populationDensity: 1500,
    populationExposed: 22000,
    hospitalCount: 0,
    hospitalTypeScore: 0,
    trafficDependencyScore: 25,
    waterDependencyScore: 40,
    telecomDependencyScore: 30,
    hospitals: []
  },
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getDayType = (): 'weekday' | 'weekend' => {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
};

const getWeatherRiskIndex = (): number => {
  // Simulated weather API response
  return Math.floor(Math.random() * 40) + 10; // 10-50 range
};

const calculateResilience = (
  derived: DerivedIntelligence,
  hospitals: Hospital[],
  outageHours: number,
  backupHours: number
): number => {
  let resilience = 100;

  // Hospital backup factor
  const avgBackup = hospitals.length > 0
    ? hospitals.reduce((sum, h) => sum + h.backupHours, 0) / hospitals.length
    : backupHours;
  
  if (outageHours > avgBackup) {
    resilience -= Math.min(40, (outageHours - avgBackup) * 5);
  }

  // Dependency factors
  resilience -= derived.trafficDependencyScore * 0.15;
  resilience -= derived.waterDependencyScore * 0.15;
  resilience -= derived.telecomDependencyScore * 0.1;

  // Time factors
  if (derived.timeOfDay === 'night') resilience += 5;
  if (derived.dayType === 'weekend') resilience += 5;

  // Weather factor
  resilience -= derived.weatherRiskIndex * 0.1;

  return Math.max(0, Math.min(100, resilience));
};

const getHospitalStatus = (hospital: Omit<Hospital, 'currentStatus'>, outageHours: number): Hospital['currentStatus'] => {
  if (outageHours === 0) return 'operational';
  if (outageHours < hospital.backupHours * 0.5) return 'backup';
  if (outageHours < hospital.backupHours) return 'backup';
  return 'critical';
};

const calculateSeverityScore = (
  derived: DerivedIntelligence,
  hospitals: Hospital[],
  outageHours: number
): number => {
  let score = 0;

  // Population exposure (0-25 points)
  score += Math.min(25, (derived.populationExposed / 10000) * 1.5);

  // Hospital criticality (0-35 points) - HOSPITALS ALWAYS MATTER
  if (hospitals.length > 0) {
    const criticalHospitals = hospitals.filter(h => h.currentStatus === 'critical').length;
    const backupHospitals = hospitals.filter(h => h.currentStatus === 'backup').length;
    
    // Ventilator patients are highest priority
    const totalVentilator = hospitals.reduce((sum, h) => sum + h.ventilatorPatients, 0);
    const totalICU = hospitals.reduce((sum, h) => sum + h.icuPatients, 0);
    
    score += criticalHospitals * 10;
    score += backupHospitals * 3;
    score += Math.min(15, totalVentilator * 0.5);
    score += Math.min(10, totalICU * 0.15);
    score += derived.hospitalTypeScore * 1.5;
  }

  // Dependency cascade risk (0-20 points)
  score += (derived.trafficDependencyScore + derived.waterDependencyScore + derived.telecomDependencyScore) / 15;

  // Duration factor (0-15 points)
  score += Math.min(15, outageHours * 1.5);

  // Inverse resilience (0-5 points)
  score += (100 - derived.resilience) * 0.05;

  return Math.min(100, Math.round(score));
};

const getSeverityLevel = (score: number): SeverityLevel => {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
};

const generateCascadeRisks = (derived: DerivedIntelligence, outageHours: number): CascadeRisk[] => {
  const risks: CascadeRisk[] = [];

  if (derived.trafficDependencyScore > 60) {
    risks.push({
      type: 'Traffic Signal Failure',
      severity: outageHours > 2 ? 'high' : 'moderate',
      description: 'Traffic management systems offline. Emergency vehicle routing compromised.',
      timeToImpact: 0.5
    });
  }

  if (derived.waterDependencyScore > 50 && outageHours > 4) {
    risks.push({
      type: 'Water Pressure Loss',
      severity: outageHours > 8 ? 'critical' : 'high',
      description: 'Electric pumping stations affected. Potential boil-water advisory.',
      timeToImpact: 4
    });
  }

  if (derived.telecomDependencyScore > 70) {
    risks.push({
      type: 'Communication Degradation',
      severity: outageHours > 6 ? 'high' : 'moderate',
      description: 'Cell tower backup depleting. 911 service at risk.',
      timeToImpact: 6
    });
  }

  if (derived.populationDensity > 5000 && outageHours > 4) {
    risks.push({
      type: 'Public Safety Concern',
      severity: derived.timeOfDay === 'night' ? 'high' : 'moderate',
      description: 'Street lighting offline. Increased accident and security risks.',
      timeToImpact: 0
    });
  }

  return risks;
};

const generateRecommendations = (analysis: Omit<ZoneAnalysis, 'recommendations'>): string[] => {
  const recommendations: string[] = [];

  // Hospital-specific recommendations - ALWAYS PRIORITIZE
  const criticalHospitals = analysis.hospitals.filter(h => h.currentStatus === 'critical');
  const nearCriticalHospitals = analysis.hospitals.filter(h => 
    h.currentStatus === 'backup' && h.backupHours < analysis.input.expectedOutageDuration * 1.2
  );

  if (criticalHospitals.length > 0) {
    recommendations.push(`IMMEDIATE: Deploy mobile generators to ${criticalHospitals.map(h => h.name).join(', ')}`);
  }

  if (nearCriticalHospitals.length > 0) {
    recommendations.push(`URGENT: Pre-position backup power for ${nearCriticalHospitals.map(h => h.name).join(', ')}`);
  }

  // Patient-specific
  const totalVentilator = analysis.hospitals.reduce((sum, h) => sum + h.ventilatorPatients, 0);
  if (totalVentilator > 20) {
    recommendations.push(`CRITICAL: ${totalVentilator} ventilator-dependent patients at risk. Coordinate with medical transport.`);
  }

  // Cascade-specific
  if (analysis.cascadeRisks.some(r => r.type === 'Water Pressure Loss')) {
    recommendations.push('Notify water utility for coordinated response. Consider public advisory.');
  }

  if (analysis.cascadeRisks.some(r => r.type === 'Communication Degradation')) {
    recommendations.push('Activate emergency communication protocols. Deploy mobile cell units.');
  }

  // General restoration
  if (analysis.severityScore >= 75) {
    recommendations.push('Allocate maximum restoration crews. Request mutual aid if needed.');
  } else if (analysis.severityScore >= 50) {
    recommendations.push('Prioritize feeder lines serving critical facilities.');
  }

  return recommendations;
};

export const analyzeZone = (input: ZoneInput): ZoneAnalysis => {
  const zoneData = zoneDatabase[input.zoneId] || {
    populationDensity: 2000,
    populationExposed: 30000,
    hospitalCount: 0,
    hospitalTypeScore: 0,
    trafficDependencyScore: 40,
    waterDependencyScore: 40,
    telecomDependencyScore: 40,
    hospitals: []
  };

  const timeOfDay = getTimeOfDay();
  const dayType = getDayType();
  const weatherRiskIndex = getWeatherRiskIndex();

  const hospitals: Hospital[] = zoneData.hospitals.map(h => ({
    ...h,
    currentStatus: getHospitalStatus(h, input.expectedOutageDuration)
  }));

  const derivedPartial: Omit<DerivedIntelligence, 'resilience'> = {
    populationDensity: zoneData.populationDensity!,
    populationExposed: zoneData.populationExposed!,
    hospitalCount: zoneData.hospitalCount!,
    hospitalTypeScore: zoneData.hospitalTypeScore!,
    trafficDependencyScore: zoneData.trafficDependencyScore!,
    waterDependencyScore: zoneData.waterDependencyScore!,
    telecomDependencyScore: zoneData.telecomDependencyScore!,
    timeOfDay,
    dayType,
    weatherRiskIndex,
  };

  const derived: DerivedIntelligence = {
    ...derivedPartial,
    resilience: calculateResilience(derivedPartial as DerivedIntelligence, hospitals, input.expectedOutageDuration, input.hospitalBackupHours)
  };

  const severityScore = calculateSeverityScore(derived, hospitals, input.expectedOutageDuration);
  const impactSeverity = getSeverityLevel(severityScore);
  const cascadeRisks = generateCascadeRisks(derived, input.expectedOutageDuration);

  const analysisWithoutRecs: Omit<ZoneAnalysis, 'recommendations'> = {
    zoneId: input.zoneId,
    input,
    derived,
    hospitals,
    impactSeverity,
    severityScore,
    restorationPriority: severityScore >= 75 ? 1 : severityScore >= 50 ? 2 : severityScore >= 25 ? 3 : 4,
    cascadeRisks,
  };

  return {
    ...analysisWithoutRecs,
    recommendations: generateRecommendations(analysisWithoutRecs)
  };
};

export const getAvailableZones = (): string[] => Object.keys(zoneDatabase);
