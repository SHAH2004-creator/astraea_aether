import { useEffect, useState, useRef } from 'react';
import { Activity, Zap, Cloud, Users, AlertCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { ThreatIndicator, MetricCard, SectorCard, AlertBanner, ProgressBar, DataGrid } from '@/components/AetherComponents';
import { Button } from '@/components/ui/button';

/**
 * AETHER Dashboard
 * Neo-Operational Intelligence Command Center
 * 
 * Design Philosophy:
 * - Information hierarchy through contrast and scale
 * - Precision over decoration
 * - Operational clarity for high-stress scenarios
 * - Premium restraint with sophisticated use of space
 */

interface AetherState {
  ssi: number;
  social_signal: string;
  weather_condition: string;
  siege_mode_active: boolean;
  traffic_reroute: string;
  grid_isolate: string;
}

export default function Home() {
  const [stateData, setStateData] = useState<AetherState>({ ssi: 0.5, social_signal: "Normal", weather_condition: "Clear", siege_mode_active: false, traffic_reroute: "pending", grid_isolate: "pending" });
const [offline, setOffline] = useState(false);
const [loading, setLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const systemStatusRef = useRef<HTMLDivElement>(null);

  // Scroll to results section
  const scrollToResults = () => {
    setTimeout(() => {
      systemStatusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  const handleButtonPress = async (buttonName: string, apiEndpoint: string) => {
    setButtonPressed(buttonName);
    try {
      await fetch(`http://127.0.0.1:8080${apiEndpoint}`, { method: 'POST' });
      scrollToResults();
    } catch (e) {
      console.error(`Failed to call ${buttonName}`, e);
    } finally {
      setTimeout(() => setButtonPressed(null), 500);
    }
  };

  // Poll state every 1.5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetch('http://127.0.0.1:8080/state');
        if (stateRes.ok) {
          const state = await stateRes.json();
          setStateData(state);
          setOffline(false);
        } else {
          setOffline(true);
        }
      } catch (error) {
        setOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, []);

  const getThreatStatus = () => {
    if (stateData?.siege_mode_active) return 'critical';
    if (stateData?.ssi && stateData.ssi < 0.5) return 'warning';
    return 'operational';
  };

  const getSectorStatus = (sectorName: string) => {
    if (stateData?.siege_mode_active) return 'critical';
    if (stateData?.ssi && stateData.ssi < 0.5) return 'warning';
    return 'operational';
  };

  const threatStatus = getThreatStatus();

  // Mock data for decision logs
  const decisionLogs = [
    { timestamp: '18:42:15', agent: 'Agent Ares', action: 'Threat Detection', confidence: '0.97' },
    { timestamp: '18:42:10', agent: 'Agent Athena', action: 'Route Optimization', confidence: '0.92' },
    { timestamp: '18:42:05', agent: 'System', action: 'Signal Fusion', confidence: '0.95' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Advanced Styling */}
      <div 
        className="relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, rgb(15,20,25) 0%, rgb(25,35,45) 50%, rgb(35,45,55) 100%)',
        }}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0,255,200,0.1) 25%, rgba(0,255,200,0.1) 26%, transparent 27%, transparent 74%, rgba(0,255,200,0.1) 75%, rgba(0,255,200,0.1) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(0,255,200,0.1) 25%, rgba(0,255,200,0.1) 26%, transparent 27%, transparent 74%, rgba(0,255,200,0.1) 75%, rgba(0,255,200,0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px'
          }}/>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
        
        {/* Floating Tech Elements */}
        <div className="hidden md:block absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-green-500/40 overflow-hidden shadow-xl shadow-green-500/20 pointer-events-none" style={{animation: 'float 6s ease-in-out infinite'}}>
          <img src="/pakistan_flag.jpg" alt="Pakistan" className="w-full h-full object-cover object-center scale-110" />
        </div>
        <div className="hidden md:block absolute bottom-20 left-10 w-24 h-24 rounded-lg border border-accent/10 group-hover:border-accent/30 transition-all duration-500 pointer-events-none" style={{animation: 'float 8s ease-in-out infinite 1s'}} />
        
        {/* Hero Content */}
        <div className="relative flex flex-col px-4 py-5 sm:px-6 md:px-8 lg:px-10 pb-8">

          {/* Logo + Title Row */}
          <div className="flex items-center gap-3 mb-2">
            {/* Circular Logo */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-accent/60 overflow-hidden bg-background/60 backdrop-blur-sm shadow-lg shadow-accent/20">
              <img
                src="/logo.png"
                alt="Astrae logo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pakistan Flag — always visible, small on mobile */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:hidden rounded-full border-2 border-green-500/50 overflow-hidden shadow-md">
              <img
                src="/pakistan_flag.jpg"
                alt="Pakistan flag"
                className="w-full h-full object-cover object-center scale-110"
              />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-accent/70 uppercase tracking-[0.3em] mb-0.5">ASTRAE</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-white leading-none">AETHER</h1>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-accent font-mono font-light tracking-wide max-w-3xl mb-3">
            Autonomous Emergency Threat &amp; Hazard Evaluation Responder
          </p>

          <div className="flex flex-row flex-wrap gap-2 items-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-accent/30 bg-accent/5 text-xs sm:text-sm">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="font-mono text-accent">SYSTEM LIVE</span>
            </div>
            <div className="text-xs sm:text-sm text-foreground/70">Connected • Monitoring • Operational</div>
          </div>

          {/* Status Cards — always fully visible, no fixed height clipping */}
          <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
            <div className="glass-panel glass-panel-hover border border-white/10 bg-background/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Threat Matrix</p>
                  <h3 className="text-xl font-semibold text-white">Operational Readiness</h3>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300 text-xs font-semibold">Stable</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">SSI</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{Math.round((stateData?.ssi ?? 1) * 100)}%</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Siege</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stateData?.siege_mode_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weather</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stateData?.weather_condition || 'Clear'}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Social</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stateData?.social_signal || 'Normal'}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel glass-panel-hover border border-white/10 bg-background/70 p-5 backdrop-blur-xl">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Command Visibility</p>
                <h3 className="text-xl font-semibold text-white">Threat Scan</h3>
              </div>
              <div className="h-32 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-violet-500/10 p-4">
                <div className="h-full w-full rounded-3xl bg-background/50 border border-white/10" />
              </div>
            </div>

            <div className="glass-panel glass-panel-hover border border-white/10 bg-background/70 p-5 backdrop-blur-xl">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Network Status</p>
                <h3 className="text-xl font-semibold text-white">Connectivity</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Latency</p>
                  <p className="mt-2 text-2xl font-semibold text-white">42ms</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Data Fusion</p>
                  <p className="mt-2 text-2xl font-semibold text-white">99.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Banner */}
        {offline && (
          <AlertBanner
            type="warning"
            title="Backend Offline"
            message="Unable to connect to AETHER backend. Displaying mock data for demonstration."
          />
        )}

        {stateData?.siege_mode_active && (
          <AlertBanner
            type="critical"
            title="SIEGE MODE ACTIVE"
            message="Critical threat detected. Emergency protocols engaged. Immediate action required."
          />
        )}

        {stateData && stateData.ssi < 0.5 && !stateData.siege_mode_active && (
          <AlertBanner
            type="warning"
            title="System Stability Compromised"
            message="Sovereign Stability Index below threshold. Enhanced monitoring activated."
          />
        )}

        {/* Primary Metrics Section */}
        <section className="mb-12" ref={systemStatusRef}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">System Status</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Threat Indicator - Prominent */}
            <div className="lg:col-span-1 glass-panel glass-panel-hover p-8 flex flex-col items-center justify-center">
              <ThreatIndicator 
                ssi={stateData?.ssi ?? 0.75} 
                label="Sovereign Stability Index"
                animated={threatStatus !== 'operational'}
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                label="System Status"
                value={threatStatus.toUpperCase()}
                status={threatStatus as any}
                icon={threatStatus === 'operational' ? <CheckCircle /> : threatStatus === 'warning' ? <AlertTriangle /> : <AlertCircle />}
              />

              <MetricCard
                label="Siege Mode"
                value={stateData?.siege_mode_active ? 'ACTIVE' : 'INACTIVE'}
                status={stateData?.siege_mode_active ? 'critical' : 'operational'}
              />

              <MetricCard
                label="Weather Condition"
                value={stateData?.weather_condition || 'CLEAR'}
                icon={<Cloud className="w-4 h-4" />}
                status="operational"
              />

              <MetricCard
                label="Social Signal"
                value={stateData?.social_signal || 'NORMAL'}
                icon={<Users className="w-4 h-4" />}
                status={stateData?.social_signal === 'Flood' ? 'warning' : 'operational'}
              />
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Traffic Reroute"
              value={stateData?.traffic_reroute?.toUpperCase() || 'PENDING'}
              status={stateData?.traffic_reroute === 'executed' ? 'warning' : 'operational'}
              icon={<Zap className="w-4 h-4" />}
              trend={stateData?.traffic_reroute === 'executed' ? 'up' : 'stable'}
            />

            <MetricCard
              label="Grid Isolation"
              value={stateData?.grid_isolate?.toUpperCase() || 'PENDING'}
              status={stateData?.grid_isolate === 'executed' ? 'warning' : 'operational'}
              icon={<Activity className="w-4 h-4" />}
              trend={stateData?.grid_isolate === 'executed' ? 'up' : 'stable'}
            />

            <MetricCard
              label="Response Time"
              value="2.1s"
              unit="avg"
              status="operational"
              icon={<TrendingUp className="w-4 h-4" />}
              trend="stable"
            />

            <MetricCard
              label="System Load"
              value="42%"
              status="operational"
              icon={<Activity className="w-4 h-4" />}
              trend="stable"
            />
          </div>
        </section>

        {/* Sector Analysis */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Urban Sectors</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SectorCard
              name="Downtown"
              status={getSectorStatus('downtown')}
              sectorId="SECTOR-01"
              metric="Commercial Hub"
            />
            <SectorCard
              name="Industrial"
              status={getSectorStatus('industrial')}
              sectorId="SECTOR-02"
              metric="Manufacturing Zone"
            />
            <SectorCard
              name="Residential"
              status={getSectorStatus('residential')}
              sectorId="SECTOR-03"
              metric="Population: 45K"
            />
            <SectorCard
              name="Hospital District"
              status={getSectorStatus('hospital')}
              sectorId="SECTOR-04"
              metric="Critical Infrastructure"
            />
          </div>
        </section>

        {/* System Health & Agent Status */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Infrastructure & Agents</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Infrastructure Health */}
            <div className="lg:col-span-2 glass-panel glass-panel-hover p-6">
              <h3 className="metric-label mb-6">Infrastructure Health</h3>
              <div className="space-y-6">
                <div>
                  <ProgressBar
                    label="Water Grid Pressure"
                    value={stateData?.ssi ? stateData.ssi * 100 : 75}
                    max={100}
                    status={threatStatus as any}
                  />
                </div>
                <div>
                  <ProgressBar
                    label="Power Distribution"
                    value={85}
                    max={100}
                    status="operational"
                  />
                </div>
                <div>
                  <ProgressBar
                    label="Traffic Flow"
                    value={92}
                    max={100}
                    status="operational"
                  />
                </div>
                <div>
                  <ProgressBar
                    label="Communication Network"
                    value={98}
                    max={100}
                    status="operational"
                  />
                </div>
              </div>
            </div>

            {/* Agent Status */}
            <div className="glass-panel glass-panel-hover p-6">
              <h3 className="metric-label mb-4">Agentic Reasoning</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="font-semibold text-sm">Agent Ares</div>
                    <div className="text-xs text-muted-foreground">Threat Detection</div>
                  </div>
                  <div className="status-badge status-operational">ACTIVE</div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="font-semibold text-sm">Agent Athena</div>
                    <div className="text-xs text-muted-foreground">Strategic Routing</div>
                  </div>
                  <div className="status-badge status-operational">ACTIVE</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Signal Fusion</div>
                    <div className="text-xs text-muted-foreground">Data Integration</div>
                  </div>
                  <div className="status-badge status-operational">ACTIVE</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Logs */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Recent Decisions</h2>
            <div className="accent-line" />
          </div>

          <DataGrid
            columns={[
              { key: 'timestamp', label: 'Timestamp', width: '25%' },
              { key: 'agent', label: 'Agent/System', width: '25%' },
              { key: 'action', label: 'Action', width: '35%' },
              { key: 'confidence', label: 'Confidence', width: '15%' },
            ]}
            data={decisionLogs}
          />
        </section>

        {/* Control Panel */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Simulation Controls</h2>
            <div className="accent-line" />
          </div>

          <div className="glass-panel glass-panel-hover p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Use these controls to simulate emergency scenarios and test AETHER's response mechanisms.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Button
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 ${buttonPressed === 'water' ? 'scale-95 shadow-lg shadow-red-600/50' : 'scale-100'}`}
                onClick={() => handleButtonPress('water', '/api/override/alert')}
                disabled={buttonPressed !== null}
              >
                🔴 Initiate Water Burst
              </Button>
              <Button
                className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-200 ${buttonPressed === 'panic' ? 'scale-95 shadow-lg shadow-amber-600/50' : 'scale-100'}`}
                onClick={() => handleButtonPress('panic', '/api/override/alert')}
                disabled={buttonPressed !== null}
              >
                🟡 Trigger Social Panic
              </Button>
              <Button
                className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 ${buttonPressed === 'lazarus' ? 'scale-95 shadow-lg shadow-emerald-600/50' : 'scale-100'}`}
                onClick={() => handleButtonPress('lazarus', '/api/override/lazarus')}
                disabled={buttonPressed !== null}
              >
                💚 Deploy Lazarus Reset
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>AETHER Command Center v1.0 | Powered by Neo-Operational Intelligence</p>
          <p className="mt-2">For emergency support, contact your local emergency management authority.</p>
        </footer>
      </div>
    </div>
  );
}
