import { Zap, Radio, Shield, Activity } from 'lucide-react';

export const Header = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center glow-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Electro<span className="text-primary">Wizard</span>
              </h1>
              <p className="text-xs text-muted-foreground">AI-Based Power Outage Impact Prediction</p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Radio className="h-4 w-4 text-success animate-pulse" />
              <span className="text-muted-foreground">System</span>
              <span className="text-success font-medium">Online</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">AI Engine</span>
              <span className="text-primary font-medium">Active</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-info" />
              <span className="text-muted-foreground">Grid Monitor</span>
              <span className="text-info font-medium">Connected</span>
            </div>

            <div className="border-l border-border pl-6">
              <p className="text-xs text-muted-foreground">System Time</p>
              <p className="font-mono text-lg text-foreground tracking-wider">{currentTime}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
