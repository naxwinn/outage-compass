import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ZoneInputPanel } from '@/components/ZoneInputPanel';
import { IntelligenceDisplay } from '@/components/IntelligenceDisplay';
import { HospitalStatusPanel } from '@/components/HospitalStatusPanel';
import { SeverityDashboard } from '@/components/SeverityDashboard';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { analyzeZone } from '@/lib/intelligence-engine';
import { ZoneInput, ZoneAnalysis } from '@/types/electrowizard';
import { Shield, Zap } from 'lucide-react';

const Index = () => {
  const [analysis, setAnalysis] = useState<ZoneAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback((input: ZoneInput) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const result = analyzeZone(input);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Inputs */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <ZoneInputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            {analysis && (
              <IntelligenceDisplay intelligence={analysis.derived} />
            )}
          </div>

          {/* Center Column - Main Dashboard */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {!analysis ? (
              <div className="card-elevated rounded-lg p-12 text-center fade-in">
                <div className="relative inline-block mb-6">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center mx-auto">
                    <Zap className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-success" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to ElectroWizard
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  AI-powered decision support for power outage impact prediction and restoration planning.
                </p>
                
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="stat-value text-lg text-primary">AI</p>
                    <p className="text-xs text-muted-foreground">Intelligence</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="stat-value text-lg text-warning">Real-time</p>
                    <p className="text-xs text-muted-foreground">Analysis</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="stat-value text-lg text-success">Priority</p>
                    <p className="text-xs text-muted-foreground">Planning</p>
                  </div>
                </div>

                <div className="mt-8 text-sm text-muted-foreground">
                  <p>Select a zone and set parameters to begin analysis</p>
                </div>
              </div>
            ) : (
              <>
                <SeverityDashboard analysis={analysis} />
                <RecommendationsPanel analysis={analysis} />
              </>
            )}
          </div>

          {/* Right Column - Hospital Status */}
          <div className="col-span-12 lg:col-span-3">
            {analysis && (
              <HospitalStatusPanel hospitals={analysis.hospitals} />
            )}
            
            {!analysis && (
              <div className="card-elevated rounded-lg p-6 text-center fade-in">
                <div className="h-16 w-16 rounded-xl bg-critical/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-critical/50" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Hospital Monitoring</h3>
                <p className="text-xs text-muted-foreground">
                  Run analysis to view hospital status and patient impact assessment
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <span>ElectroWizard v1.0</span>
              <span>•</span>
              <span>Decision Support System</span>
              <span>•</span>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
