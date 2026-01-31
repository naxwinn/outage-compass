import { Hospital } from '@/types/electrowizard';
import { Building2, Heart, Baby, Stethoscope, Activity, Wind } from 'lucide-react';

interface HospitalStatusPanelProps {
  hospitals: Hospital[];
}

export const HospitalStatusPanel = ({ hospitals }: HospitalStatusPanelProps) => {
  const getStatusStyles = (status: Hospital['currentStatus']) => {
    switch (status) {
      case 'operational':
        return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', glow: '' };
      case 'backup':
        return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', glow: 'pulse-warning' };
      case 'critical':
        return { bg: 'bg-critical/10', border: 'border-critical/30', text: 'text-critical', glow: 'pulse-critical' };
    }
  };

  const getTypeIcon = (type: Hospital['type']) => {
    switch (type) {
      case 'Level I Trauma':
      case 'Level II Trauma':
        return <Activity className="h-4 w-4" />;
      case 'Children':
        return <Baby className="h-4 w-4" />;
      case 'Specialty':
        return <Heart className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  if (hospitals.length === 0) {
    return (
      <div className="card-elevated rounded-lg p-6 fade-in">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-critical/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-critical" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Hospital Status</h2>
            <p className="text-xs text-muted-foreground">Critical facility monitoring</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No hospitals in this zone</p>
          <p className="text-xs mt-1">Lower medical infrastructure risk</p>
        </div>
      </div>
    );
  }

  const totalPatients = hospitals.reduce((sum, h) => sum + h.patientCount, 0);
  const totalICU = hospitals.reduce((sum, h) => sum + h.icuPatients, 0);
  const totalVentilator = hospitals.reduce((sum, h) => sum + h.ventilatorPatients, 0);
  const criticalCount = hospitals.filter(h => h.currentStatus === 'critical').length;

  return (
    <div className="card-elevated rounded-lg p-6 space-y-4 fade-in">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className={`h-10 w-10 rounded-lg bg-critical/10 flex items-center justify-center ${criticalCount > 0 ? 'pulse-critical' : ''}`}>
          <Building2 className="h-5 w-5 text-critical" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Hospital Status</h2>
          <p className="text-xs text-muted-foreground">Critical facility monitoring</p>
        </div>
        {criticalCount > 0 && (
          <div className="px-3 py-1 bg-critical/20 border border-critical/30 rounded-full">
            <span className="text-xs font-medium text-critical">{criticalCount} CRITICAL</span>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/30 rounded-lg p-3 text-center">
          <Stethoscope className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="stat-value text-lg">{totalPatients.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Patients</p>
        </div>
        <div className="bg-warning/10 rounded-lg p-3 text-center border border-warning/20">
          <Activity className="h-4 w-4 mx-auto mb-1 text-warning" />
          <p className="stat-value text-lg text-warning">{totalICU}</p>
          <p className="text-xs text-muted-foreground">ICU Patients</p>
        </div>
        <div className="bg-critical/10 rounded-lg p-3 text-center border border-critical/20">
          <Wind className="h-4 w-4 mx-auto mb-1 text-critical" />
          <p className="stat-value text-lg text-critical">{totalVentilator}</p>
          <p className="text-xs text-muted-foreground">On Ventilator</p>
        </div>
      </div>

      {/* Hospital List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {hospitals.map(hospital => {
          const styles = getStatusStyles(hospital.currentStatus);
          
          return (
            <div 
              key={hospital.id}
              className={`${styles.bg} border ${styles.border} rounded-lg p-4 ${styles.glow} transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${styles.bg}`}>
                    {getTypeIcon(hospital.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{hospital.name}</h3>
                    <p className="text-xs text-muted-foreground">{hospital.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold uppercase ${styles.text} px-2 py-1 rounded ${styles.bg}`}>
                  {hospital.currentStatus}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="data-display text-sm">{hospital.patientCount}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div>
                  <p className="data-display text-sm text-warning">{hospital.icuPatients}</p>
                  <p className="text-xs text-muted-foreground">ICU</p>
                </div>
                <div>
                  <p className="data-display text-sm text-critical">{hospital.ventilatorPatients}</p>
                  <p className="text-xs text-muted-foreground">Ventilator</p>
                </div>
                <div>
                  <p className={`data-display text-sm ${hospital.backupHours < 24 ? 'text-warning' : 'text-success'}`}>
                    {hospital.backupHours}h
                  </p>
                  <p className="text-xs text-muted-foreground">Backup</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
