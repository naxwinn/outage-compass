import { useState } from 'react';
import { ZoneInput } from '@/types/electrowizard';
import { getAvailableZones } from '@/lib/intelligence-engine';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Battery } from 'lucide-react';

interface ZoneInputPanelProps {
  onAnalyze: (input: ZoneInput) => void;
  isAnalyzing: boolean;
}

export const ZoneInputPanel = ({ onAnalyze, isAnalyzing }: ZoneInputPanelProps) => {
  const [zoneId, setZoneId] = useState<string>('');
  const [duration, setDuration] = useState<number>(4);
  const [backupHours, setBackupHours] = useState<number>(24);

  const zones = getAvailableZones();

  const handleAnalyze = () => {
    if (zoneId) {
      onAnalyze({
        zoneId,
        expectedOutageDuration: duration,
        hospitalBackupHours: backupHours
      });
    }
  };

  return (
    <div className="card-elevated rounded-lg p-6 space-y-6 fade-in">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Zone Input</h2>
          <p className="text-xs text-muted-foreground">Minimal operator inputs</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="stat-label flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Zone Identifier
          </label>
          <Select value={zoneId} onValueChange={setZoneId}>
            <SelectTrigger className="bg-secondary border-border h-12 font-mono">
              <SelectValue placeholder="Select zone..." />
            </SelectTrigger>
            <SelectContent>
              {zones.map(zone => (
                <SelectItem key={zone} value={zone} className="font-mono">
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="stat-label flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Expected Outage Duration
            </label>
            <span className="data-display text-primary">{duration}h</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([v]) => setDuration(v)}
            min={1}
            max={48}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 hour</span>
            <span>48 hours</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="stat-label flex items-center gap-2">
              <Battery className="h-3 w-3" />
              Hospital Backup Capacity
            </label>
            <span className="data-display text-primary">{backupHours}h</span>
          </div>
          <Slider
            value={[backupHours]}
            onValueChange={([v]) => setBackupHours(v)}
            min={4}
            max={72}
            step={2}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4 hours</span>
            <span>72 hours</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleAnalyze}
        disabled={!zoneId || isAnalyzing}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary transition-all"
      >
        {isAnalyzing ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Run Impact Analysis
          </span>
        )}
      </Button>
    </div>
  );
};
