import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Timer, 
  Activity, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface AnalyticsViewProps {
  metrics: DashboardMetrics;
}

export default function AnalyticsView({ metrics }: AnalyticsViewProps) {
  const analyticsHighlights = [
    { name: 'Average Template Build Speed', val: '42.5s', status: 'Optimal', change: '8.4% faster' },
    { name: 'Gateway System Health Index', val: '98.8%', status: 'Excellent', change: 'Stable' },
    { name: 'OAuth Callback Latency', val: '14.5ms', status: 'Fast', change: '-1.2ms offset' },
    { name: 'Active API Queue Load', val: 'Low', status: 'Nominal', change: '0 queued operations' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300">
      
      {/* Banner */}
      <div className="bg-[#110d21] p-6 rounded-2xl border border-[#211a43] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-sans tracking-tight">System Analytics & Diagnostics</h2>
          <p className="text-slate-400 text-xs mt-1">
            Analyze Discord API payload distribution metrics, real-time throttles, and template downloads performance logs.
          </p>
        </div>
        <BarChart3 className="h-9 w-9 text-[#bf55ec]/50" />
      </div>

      {/* Grid Highlights cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {analyticsHighlights.map((it) => (
          <div key={it.name} className="rounded-xl border border-[#1e1940] bg-[#0c0919] p-5 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-[#bf55ec]/5 rounded-bl-full pointer-events-none" />
            <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest leading-normal">
              {it.name}
            </p>
            <p className="text-2xl font-black text-white tracking-tight">{it.val}</p>
            <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-1 border-t border-[#1a143b]/40">
              <span className="text-emerald-400 font-bold">{it.status}</span>
              <span className="text-indigo-400">{it.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Insights Dashboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Deployment Load Breakdown */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#0c0919] p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 font-mono text-[#bf55ec] uppercase">
              <Activity className="h-4 w-4" />
              Daily Deployment Heatmap
            </h3>
            <p className="text-xs text-slate-400 mt-1">Estimations computed on client-side background threads.</p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { day: 'Monday', rate: '12 Deploys', perc: 40 },
              { day: 'Tuesday', rate: '22 Deploys', perc: 75 },
              { day: 'Wednesday', rate: '18 Deploys', perc: 60 },
              { day: 'Thursday', rate: '35 Deploys', perc: 95 },
              { day: 'Friday', rate: '28 Deploys', perc: 82 },
              { day: 'Saturday', rate: '42 Deploys', perc: 100 },
              { day: 'Sunday', rate: '31 Deploys', perc: 85 }
            ].map((d) => (
              <div key={d.day} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300 font-sans font-bold">
                  <span>{d.day}</span>
                  <span className="text-[#a2aaff] font-mono">{d.rate}</span>
                </div>
                <div className="w-full h-2 rounded bg-[#150f2f] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#5865F2] to-[#bf55ec] rounded"
                    style={{ width: `${d.perc}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Inspection Check */}
        <div className="rounded-2xl border border-indigo-500/10 bg-[#0e0a25] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-[#5865F2]" />
                Server Health Diagnostic Score
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Measures the health configuration of cloned Discord environments.</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#070512]">
                <span className="text-slate-300 font-sans">Verification Level Enforcement</span>
                <span className="text-emerald-400 font-bold font-mono">SECURE_MEDIUM</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#070512]">
                <span className="text-slate-300 font-sans">Explicit Content Filter Flag</span>
                <span className="text-emerald-400 font-bold font-mono">ENABLED_ALL</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#070512]">
                <span className="text-slate-300 font-sans">Welcome Notifications Ping</span>
                <span className="text-[#a2aaff] font-mono">SYSTEM_ONLY</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#070512]">
                <span className="text-slate-300 font-sans">Average API Rate Limit Buffer</span>
                <span className="text-purple-300 font-mono font-bold">Safe delays enforced</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-[#1e173e] flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 leading-normal">
              For complete deployment history logs, navigate straight to the general **Activity Logs** view dashboard screen.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
