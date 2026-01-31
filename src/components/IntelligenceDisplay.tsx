import { DerivedIntelligence } from '@/types/electrowizard';
import { 
  Users, Building2, Wifi, Droplets, TrafficCone, 
  Sun, Cloud, Thermometer, Shield 
} from 'lucide-react';

interface IntelligenceDisplayProps {
  intelligence: DerivedIntelligence;
}

export const IntelligenceDisplay = ({ intelligence }: IntelligenceDisplayProps) => {
  const getResilienceColor = (value: number) => {
    if (value >= 70) return 'text-success';
    if (value >= 40) return 'text-warning';
    return 'text-critical';
  };

  const getDependencyColor = (value: number) => {
    if (value <= 30) return 'text-success';
    if (value <= 60) return 'text-warning';
    return 'text-critical';
  };

  return (
    <div className="card-elevated rounded-lg p-6 space-y-6 fade-in">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-info" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI-Derived Intelligence</h2>
          <p className="text-xs text-muted-foreground">Automatically computed metrics</p>
        </div>
      </div>

      {/* Resilience Score - Primary Metric */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="stat-label">System Resilience</span>
          <span className={`stat-value ${getResilienceColor(intelligence.resilience)}`}>
            {intelligence.resilience}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              intelligence.resilience >= 70 ? 'bg-success' :
              intelligence.resilience >= 40 ? 'bg-warning' : 'bg-critical'
            }`}
            style={{ width: `${intelligence.resilience}%` }}
          />
        </div>
      </div>

      {/* Population Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="stat-label">Population Density</span>
          </div>
          <p className="stat-value text-xl text-foreground">
            {intelligence.populationDensity.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">per km²</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="stat-label">Population Exposed</span>
          </div>
          <p className="stat-value text-xl text-foreground">
            {intelligence.populationExposed.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">affected residents</p>
        </div>
      </div>

      {/* Hospital Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-critical" />
            <span className="stat-label">Hospitals</span>
          </div>
          <p className="stat-value text-xl text-foreground">{intelligence.hospitalCount}</p>
          <p className="text-xs text-muted-foreground">in zone</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-critical" />
            <span className="stat-label">Hospital Score</span>
          </div>
          <p className="stat-value text-xl text-foreground">{intelligence.hospitalTypeScore.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">criticality index</p>
        </div>
      </div>

      {/* Dependency Scores */}
      <div className="space-y-3">
        <span className="stat-label">Infrastructure Dependencies</span>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrafficCone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Traffic Systems</span>
            </div>
            <span className={`data-display ${getDependencyColor(intelligence.trafficDependencyScore)}`}>
              {intelligence.trafficDependencyScore}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                intelligence.trafficDependencyScore <= 30 ? 'bg-success' :
                intelligence.trafficDependencyScore <= 60 ? 'bg-warning' : 'bg-critical'
              }`}
              style={{ width: `${intelligence.trafficDependencyScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Water Systems</span>
            </div>
            <span className={`data-display ${getDependencyColor(intelligence.waterDependencyScore)}`}>
              {intelligence.waterDependencyScore}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                intelligence.waterDependencyScore <= 30 ? 'bg-success' :
                intelligence.waterDependencyScore <= 60 ? 'bg-warning' : 'bg-critical'
              }`}
              style={{ width: `${intelligence.waterDependencyScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Telecom Systems</span>
            </div>
            <span className={`data-display ${getDependencyColor(intelligence.telecomDependencyScore)}`}>
              {intelligence.telecomDependencyScore}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                intelligence.telecomDependencyScore <= 30 ? 'bg-success' :
                intelligence.telecomDependencyScore <= 60 ? 'bg-warning' : 'bg-critical'
              }`}
              style={{ width: `${intelligence.telecomDependencyScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Context Factors */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/30 rounded-lg p-3 text-center">
          <Sun className="h-4 w-4 mx-auto mb-1 text-warning" />
          <p className="text-xs text-muted-foreground">Time</p>
          <p className="data-display text-sm capitalize">{intelligence.timeOfDay}</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-3 text-center">
          <Cloud className="h-4 w-4 mx-auto mb-1 text-info" />
          <p className="text-xs text-muted-foreground">Day</p>
          <p className="data-display text-sm capitalize">{intelligence.dayType}</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-3 text-center">
          <Thermometer className="h-4 w-4 mx-auto mb-1 text-warning" />
          <p className="text-xs text-muted-foreground">Weather Risk</p>
          <p className="data-display text-sm">{intelligence.weatherRiskIndex}%</p>
        </div>
      </div>
    </div>
  );
};
