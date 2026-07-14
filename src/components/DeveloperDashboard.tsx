import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Terminal, 
  Sliders, 
  Coins, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Database, 
  Check, 
  Plus, 
  User, 
  FileText,
  BarChart,
  Settings,
  Flame,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { AppUser } from '../types/index.ts';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Bar } from 'recharts';

interface DeveloperDashboardProps {
  currentUser: AppUser | null;
  onLogout: () => void;
}

export default function DeveloperDashboard({ currentUser, onLogout }: DeveloperDashboardProps) {
  // Stats telemetry
  const [cpuLoad, setCpuLoad] = useState(12.4);
  const [ramUsage, setRamUsage] = useState(3.8);
  const [activeThreads, setActiveThreads] = useState(2);
  const [apiCalls, setApiCalls] = useState(32492);

  // Operational Feature Gates
  const [featureGates, setFeatureGates] = useState({
    disableGpuWorkloads: false,
    enforceHardBillingGates: true,
    experimentalBiRefNet: true,
    developerSandboxMode: false
  });

  // Sandbox User Credits Ledger
  const [ledgerUsers, setLedgerUsers] = useState([
    { email: 'guest@vision.ai', subscription: 'Free', credits: 15 },
    { email: 'useforfun03@gmail.com', subscription: 'Pro', credits: 1000 },
    { email: 'enterprise@vision.ai', subscription: 'Enterprise', credits: 50000 },
    { email: 'developer@vision.ai', subscription: 'Pro', credits: 2450 },
  ]);

  // Logs terminal
  const [logs, setLogs] = useState([
    { time: '14:25:01', type: 'SYS', text: 'Vite app developer dev-server fallback route active.' },
    { time: '14:25:12', type: 'GPU', text: 'Neural Engine initialized on physical device cuda:0.' },
    { time: '14:25:35', type: 'DB', text: 'SQL schema verified with 0 pending migrations.' },
    { time: '14:26:01', type: 'API', text: 'Auth session verified for developer node.' },
  ]);

  // Simulated metrics data
  const chartData = [
    { time: '10:00', requests: 1200, latency: 142 },
    { time: '11:00', requests: 1800, latency: 135 },
    { time: '12:00', requests: 2400, latency: 156 },
    { time: '13:00', requests: 1900, latency: 148 },
    { time: '14:00', requests: 3100, latency: 182 },
    { time: '15:00', requests: 2800, latency: 165 },
  ];

  // Randomize stats to feel real & live
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.min(100, Math.max(5, parseFloat((prev + (Math.random() - 0.5) * 3).toFixed(1)))));
      setRamUsage(prev => Math.min(96, Math.max(1, parseFloat((prev + (Math.random() - 0.5) * 0.2).toFixed(1)))));
      if (Math.random() > 0.8) {
        setActiveThreads(prev => Math.max(1, Math.min(8, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
      setApiCalls(prev => prev + Math.floor(Math.random() * 3));
      
      // Rolling logs
      const logTypes = ['SYS', 'GPU', 'DB', 'API', 'BILLING'];
      const logTexts = [
        'Heartbeat telemetry check completed.',
        'GPU background queue task flushed successfully.',
        'Inference buffer allocation optimized.',
        'Billing check: Quotas checked under enterprise API route.',
        'Webhook callback delivered with status: 200 OK.',
      ];
      const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
      const randomText = logTexts[Math.floor(Math.random() * logTexts.length)];
      const now = new Date().toTimeString().split(' ')[0];
      
      setLogs(prev => [
        { time: now, type: randomType, text: randomText },
        ...prev.slice(0, 15)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const adjustCredits = (email: string, amount: number) => {
    setLedgerUsers(prev => prev.map(u => {
      if (u.email === email) {
        return { ...u, credits: Math.max(0, u.credits + amount) };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30">
      
      {/* Dev Header */}
      <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Cpu className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Vision Studio <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-900 text-brand-400 border border-brand-500/20 uppercase tracking-widest">Developer Portal</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">Gateway Console v1.0.4</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Node Cluster:</span>
            <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Primary-Live</span>
          </div>

          <button 
            onClick={onLogout}
            className="px-4 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-xs font-bold font-mono text-slate-300 flex items-center gap-2 smooth-all cursor-pointer"
          >
            Exit Portal
          </button>
        </div>
      </header>

      {/* Main Dev Layout */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans">Administrative Cockpit</h2>
            <p className="text-xs text-slate-400 mt-0.5">Control live GPU-heavy workloads, operational limit gates, and user credit scores.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setCpuLoad(12.4);
                setRamUsage(3.8);
                setActiveThreads(2);
                alert('Telemetry caches cleared and reset.');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Cache
            </button>
          </div>
        </div>

        {/* 1. Telemetry Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CPU Cores Load', val: `${cpuLoad}%`, desc: 'System level logical threads', icon: Cpu, color: 'text-blue-500 bg-blue-500/5 border-blue-500/10' },
            { label: 'Neural vRAM', val: `${ramUsage} GB / 96GB`, desc: 'Hardware segment buffer', icon: Flame, color: 'text-indigo-500 bg-indigo-500/5 border-indigo-500/10' },
            { label: 'Active GPU Threads', val: `${activeThreads} active`, desc: 'Parallel execution tasks', icon: Layers, color: 'text-violet-500 bg-violet-500/5 border-violet-500/10' },
            { label: 'API Requests (24h)', val: apiCalls.toLocaleString(), desc: 'Asynchronous gateway triggers', icon: Activity, color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between ${stat.color}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-black/40 border border-white/5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold tracking-tight text-white font-mono">{stat.val}</h3>
                  <p className="text-[9px] text-slate-500 mt-0.5">{stat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Main Analytics & Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Charts panel - Col 8 */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Realtime Performance Graph */}
            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Gateway Traffic & Latency Realtime Metrics</h3>
                </div>
                <span className="text-[9px] font-mono text-slate-500">POLLING SPEED: 1000MS</span>
              </div>
              
              <div className="h-56 w-full text-slate-400">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" name="API Requests" />
                    <Area type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" name="Inference Latency (ms)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Credit Ledger / Arbitrage Center */}
            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Sandbox User Credit Arbitrage Ledger</h3>
                </div>
                <span className="text-[9px] font-mono text-slate-500">LIVE STORAGE ENGINE</span>
              </div>

              <div className="space-y-2">
                {ledgerUsers.map((usr) => (
                  <div key={usr.email} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{usr.email}</span>
                      <span className="inline-flex text-[8px] font-mono px-1.5 py-0.2 bg-slate-900 text-slate-400 uppercase font-bold border border-slate-800 rounded">
                        {usr.subscription}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400 mr-2">{usr.credits} Credits</span>
                      <button 
                        onClick={() => adjustCredits(usr.email, -5)}
                        className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center font-bold font-mono text-xs cursor-pointer active:scale-95 smooth-all"
                      >
                        -5
                      </button>
                      <button 
                        onClick={() => adjustCredits(usr.email, 5)}
                        className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center font-bold font-mono text-xs cursor-pointer active:scale-95 smooth-all"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Feature Gates & Terminal - Col 4 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Operational Gates */}
            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Global Operational Gates</h3>
              </div>

              <div className="space-y-3.5">
                {[
                  { key: 'disableGpuWorkloads' as const, title: 'Disable GPU-heavy workloads', desc: 'Force safe CPU fallbacks' },
                  { key: 'enforceHardBillingGates' as const, title: 'Enforce hard billing limit gates', desc: 'Suspend API calls at 0 credits' },
                  { key: 'experimentalBiRefNet' as const, title: 'Experimental BiRefNet weights', desc: 'Activate experimental model masks' },
                  { key: 'developerSandboxMode' as const, title: 'Developer Sandbox Mode', desc: 'Simulate instant mocks for APIs' },
                ].map((gate) => (
                  <div key={gate.key} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs">
                    <div>
                      <span className="font-bold block text-white">{gate.title}</span>
                      <span className="text-[10px] text-slate-500">{gate.desc}</span>
                    </div>
                    <button 
                      onClick={() => setFeatureGates({ ...featureGates, [gate.key]: !featureGates[gate.key] })}
                      className={`w-10 h-6 rounded-full relative smooth-all cursor-pointer ${featureGates[gate.key] ? 'bg-blue-600' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${featureGates[gate.key] ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gateway Console Logs */}
            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">Live API Gateway Logs</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="bg-black/95 rounded-2xl p-4 border border-slate-800 text-[10px] font-mono text-left max-h-56 overflow-y-auto space-y-2 text-slate-300 scrollbar-thin">
                {logs.map((lg, i) => (
                  <div key={i} className="flex gap-2 text-left leading-normal">
                    <span className="text-slate-500 shrink-0">[{lg.time}]</span>
                    <span className="text-blue-400 font-semibold shrink-0">[{lg.type}]</span>
                    <span className="text-slate-200 break-all">{lg.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
