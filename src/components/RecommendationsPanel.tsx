import { ZoneAnalysis } from '@/types/electrowizard';
import { Lightbulb, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface RecommendationsPanelProps {
  analysis: ZoneAnalysis;
}

export const RecommendationsPanel = ({ analysis }: RecommendationsPanelProps) => {
  const getPriorityLevel = (rec: string): 'immediate' | 'urgent' | 'standard' => {
    if (rec.startsWith('IMMEDIATE') || rec.startsWith('CRITICAL')) return 'immediate';
    if (rec.startsWith('URGENT')) return 'urgent';
    return 'standard';
  };

  const getPriorityStyles = (priority: 'immediate' | 'urgent' | 'standard') => {
    switch (priority) {
      case 'immediate':
        return { bg: 'bg-critical/10', border: 'border-critical/30', icon: 'text-critical', badge: 'bg-critical' };
      case 'urgent':
        return { bg: 'bg-warning/10', border: 'border-warning/30', icon: 'text-warning', badge: 'bg-warning' };
      default:
        return { bg: 'bg-info/10', border: 'border-info/30', icon: 'text-info', badge: 'bg-info' };
    }
  };

  return (
    <div className="card-elevated rounded-lg p-6 space-y-4 fade-in">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
          <p className="text-xs text-muted-foreground">Priority-based restoration planning</p>
        </div>
      </div>

      {analysis.recommendations.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success opacity-50" />
          <p className="text-muted-foreground">No critical actions required</p>
          <p className="text-xs text-muted-foreground mt-1">Zone is within acceptable resilience parameters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => {
            const priority = getPriorityLevel(rec);
            const styles = getPriorityStyles(priority);
            const displayText = rec.replace(/^(IMMEDIATE|CRITICAL|URGENT):\s*/, '');
            
            return (
              <div 
                key={idx}
                className={`${styles.bg} border ${styles.border} rounded-lg p-4 slide-up`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${styles.bg}`}>
                    <AlertCircle className={`h-4 w-4 ${styles.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${styles.badge} text-white`}>
                        {priority}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{displayText}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Actions</span>
          <span className="font-mono text-foreground">{analysis.recommendations.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Immediate Priority</span>
          <span className="font-mono text-critical">
            {analysis.recommendations.filter(r => getPriorityLevel(r) === 'immediate').length}
          </span>
        </div>
      </div>
    </div>
  );
};
