import { ZoneAnalysis, SeverityLevel } from '@/types/electrowizard';
import { AlertTriangle, ArrowUp, Target, Clock, TrendingUp, Zap } from 'lucide-react';

interface SeverityDashboardProps {
  analysis: ZoneAnalysis;
}

export const SeverityDashboard = ({ analysis }: SeverityDashboardProps) => {
  const getSeverityStyles = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return { 
          bg: 'bg-critical/10', 
          border: 'border-critical', 
          text: 'text-critical', 
          glow: 'glow-critical pulse-critical',
          gradient: 'from-critical to-destructive'
        };
      case 'high':
        return { 
          bg: 'bg-warning/10', 
          border: 'border-warning', 
          text: 'text-warning', 
          glow: 'glow-warning',
          gradient: 'from-warning to-orange-600'
        };
      case 'moderate':
        return { 
          bg: 'bg-info/10', 
          border: 'border-info', 
          text: 'text-info', 
          glow: '',
          gradient: 'from-info to-blue-600'
        };
      default:
        return { 
          bg: 'bg-success/10', 
          border: 'border-success', 
          text: 'text-success', 
          glow: '',
          gradient: 'from-success to-emerald-600'
        };
    }
  };

  const styles = getSeverityStyles(analysis.impactSeverity);

  return (
    <div className={`card-elevated rounded-lg p-6 border-2 ${styles.border} ${styles.glow} fade-in`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${styles.gradient} flex items-center justify-center shadow-lg`}>
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Impact Severity</h2>
            <p className="text-xs text-muted-foreground">{analysis.zoneId}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-4xl font-bold font-mono ${styles.text} text-glow-${analysis.impactSeverity === 'critical' ? 'critical' : analysis.impactSeverity === 'high' ? 'warning' : 'primary'}`}>
            {analysis.severityScore}
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Severity Score</p>
        </div>
      </div>

      {/* Severity Level Badge */}
      <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="stat-label">Classification</span>
            <p className={`text-2xl font-bold uppercase ${styles.text}`}>{analysis.impactSeverity}</p>
          </div>
          <div className="text-right">
            <span className="stat-label">Restoration Priority</span>
            <div className="flex items-center gap-2 justify-end">
              <Target className={`h-5 w-5 ${styles.text}`} />
              <span className={`text-2xl font-bold font-mono ${styles.text}`}>P{analysis.restorationPriority}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="stat-label">Outage Duration</span>
          </div>
          <p className="stat-value">{analysis.input.expectedOutageDuration}h</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="stat-label">Population at Risk</span>
          </div>
          <p className="stat-value">{analysis.derived.populationExposed.toLocaleString()}</p>
        </div>
      </div>

      {/* Cascade Risks */}
      {analysis.cascadeRisks.length > 0 && (
        <div className="space-y-3">
          <span className="stat-label flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Cascade Risks Detected
          </span>
          
          <div className="space-y-2">
            {analysis.cascadeRisks.map((risk, idx) => {
              const riskStyles = getSeverityStyles(risk.severity);
              
              return (
                <div 
                  key={idx}
                  className={`${riskStyles.bg} border ${riskStyles.border}/30 rounded-lg p-3`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">{risk.type}</span>
                    <span className={`text-xs uppercase ${riskStyles.text}`}>{risk.severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Impact in {risk.timeToImpact}h
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <ArrowUp className={`h-5 w-5 ${styles.text}`} />
          <span className="text-sm text-muted-foreground">
            {analysis.restorationPriority === 1 ? 'Highest restoration priority - immediate action required' :
             analysis.restorationPriority === 2 ? 'High priority - expedite restoration crews' :
             analysis.restorationPriority === 3 ? 'Standard priority - schedule restoration' :
             'Lower priority - routine scheduling'}
          </span>
        </div>
      </div>
    </div>
  );
};
