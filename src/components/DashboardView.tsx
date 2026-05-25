import React, { useState } from 'react';
import { 
  Server, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Activity, 
  Wifi, 
  TrendingUp, 
  Clock, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { DashboardMetrics, ActivityFeedItem } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  onNavigateToClone: () => void;
  recentActivity: ActivityFeedItem[];
}

export default function DashboardView({ metrics, onNavigateToClone, recentActivity }: DashboardViewProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Elegant mock chart dataset tracking visual deployments over a 7-day scale
  const chartData = [
    { day: 'Mon', count: 12, speed: 44, load: 'Low' },
    { day: 'Tue', count: 22, speed: 41, load: 'Low' },
    { day: 'Wed', count: 18, speed: 45, load: 'Medium' },
    { day: 'Thu', count: 35, speed: 38, load: 'High' },
    { day: 'Fri', count: 28, speed: 42, load: 'Medium' },
    { day: 'Sat', count: 42, speed: 40, load: 'High' },
    { day: 'Sun', count: 31, speed: 43, load: 'Medium' }
  ];

  // Render variables for custom glowing SVG spline
  const width = 500;
  const height = 150;
  const padding = 20;
  const maxVal = Math.max(...chartData.map(d => d.count)) + 5;

  const points = chartData.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (chartData.length - 1);
    const y = height - padding - (d.count / maxVal) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300">
      
      {/* Page Header banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#14102c]/50 p-6 rounded-2xl border border-[#231b4b] backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-[#bf55ec]/5 rounded-full filter blur-xl pointer-events-none" />
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Discord Template Gateway
            <span className="inline-flex items-center rounded-full bg-[#5865F2]/20 px-2.5 py-0.5 text-xs font-mono font-bold text-[#a2aaff] animate-pulse">
              LIVE GATEWAY
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Replicate Discord structures securely using standard OAuth2 mechanisms. Fully compliant with Discord Policies.
          </p>
        </div>
        <button
          onClick={onNavigateToClone}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#5865F2] to-[#bf55ec] hover:opacity-90 shadow-[0_0_20px_rgba(88,101,242,0.3)] transition-all flex items-center gap-2 cursor-pointer grow-0 select-none"
        >
          <span>Clone Server Now</span>
          <ArrowUpRight className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* SaaS Cockpit Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1 */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#110d26]/40 p-5 relative overflow-hidden group hover:border-[#5865F2]/30 transition-all">
          <div className="absolute top-2 right-2 rounded-lg bg-[#5865F2]/10 p-2 text-[#5865F2]">
            <Server className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Deployments</p>
          <p className="text-3xl font-extrabold text-white mt-1.5 font-sans tracking-tight">{metrics.totalDeployments}</p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
            <span className="font-bold">➔</span>
            <span>+12 New This Week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#110d26]/40 p-5 relative overflow-hidden group hover:border-[#bf55ec]/30 transition-all">
          <div className="absolute top-2 right-2 rounded-lg bg-[#bf55ec]/10 p-2 text-[#bf55ec]">
            <Layers className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Active Templates</p>
          <p className="text-3xl font-extrabold text-white mt-1.5 font-sans tracking-tight">{metrics.activeTemplates}</p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] text-purple-400 font-mono">
            <span className="font-bold">➔</span>
            <span>2 Custom layout clones</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#110d26]/40 p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-2 right-2 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Success Ratio</p>
          <p className="text-3xl font-extrabold text-white mt-1.5 font-sans tracking-tight">{metrics.successfulClones}</p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
            <span className="font-bold">➔</span>
            <span>98.4% deploy complete</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#110d26]/40 p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-2 right-2 rounded-lg bg-amber-500/10 p-2 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Deploy Speed</p>
          <p className="text-3xl font-extrabold text-white mt-1.5 font-sans tracking-tight">{metrics.deploymentSpeed}</p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] text-amber-400 font-mono">
            <span className="font-bold">➔</span>
            <span>Optimized throttling</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#110d26]/40 p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-2 right-2 rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
            <Wifi className="h-5 w-5 animate-pulse" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Rate Limit Queue</p>
          <p className="text-3xl font-extrabold text-white mt-1.5 font-sans tracking-tight">{metrics.rateLimitStatus}</p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] text-cyan-400 font-mono">
            <span className="font-bold">➔</span>
            <span>0 pending operations</span>
          </div>
        </div>

      </div>

      {/* Main Row: Activity chart + Websocket telemetry indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph section */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1e1940] bg-[#0c091a]/80 p-6 flex flex-col justify-between backdrop-blur-md relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5865F2]/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-[#5865F2]" />
              <h3 className="text-sm font-bold text-white tracking-wide">Deployment Velocity Dashboard</h3>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#bf55ec]" />Deploy count</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#5865F2]" />Speed (s)</span>
            </div>
          </div>

          <div className="relative h-44 w-full">
            {/* SVG spline layout container */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bf55ec" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5865F2" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Fill background gradient area */}
              <path
                d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                fill="url(#gradient-glow)"
              />

              {/* Grid Lines */}
              <line x1={padding} y1={height - padding} x2={width + padding} y2={height - padding} stroke="#211b40" strokeWidth="1" />
              <line x1={padding} y1={padding} x2={width + padding} y2={padding} stroke="#211b40" strokeWidth="1" strokeDasharray="4 4" />

              {/* Smooth Spline Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#line-glow)"
                strokeWidth="3.5"
                className="drop-shadow-[0_0_8px_rgba(191,85,236,0.6)]"
              />
              <linearGradient id="line-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5865F2" />
                <stop offset="100%" stopColor="#bf55ec" />
              </linearGradient>

              {/* Intersect Interactive Circles */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredNode === i ? 7 : 4}
                    fill="#150e2b"
                    stroke={hoveredNode === i ? '#bf55ec' : '#5865F2'}
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredNode(i)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Interactive Custom Floating Tooltip */}
            {hoveredNode !== null && (
              <div 
                className="absolute z-10 p-3 rounded-lg bg-[#181335] border border-fuchsia-500/40 text-[11px] font-mono shadow-2xl space-y-1 text-slate-300 backdrop-blur-md"
                style={{ 
                  left: `${points[hoveredNode].x - 60}px`,
                  bottom: `${height - points[hoveredNode].y + 10}px` 
                }}
              >
                <div className="font-bold text-white">📅 {points[hoveredNode].day} Metrics</div>
                <div>Server clones: <span className="text-fuchsia-400 font-extrabold">{points[hoveredNode].count}</span></div>
                <div>Clone speed: <span className="text-[#a2aaff]">{points[hoveredNode].speed}s</span></div>
              </div>
            )}
          </div>

          <div className="flex justify-between px-3 text-slate-400 font-semibold font-mono text-[10px] mt-2">
            {chartData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* Real-time sync status section */}
        <div className="rounded-2xl border border-[#1e1940] bg-[#0c091a]/80 p-6 flex flex-col justify-between backdrop-blur-md relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#bf55ec]/20 to-transparent" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Websocket Diagnostics</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Synced / Syn
              </span>
            </div>

            <div className="space-y-3.5 bg-[#140f2e]/55 p-4 rounded-xl border border-[#211949]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Gateway Service:</span>
                <span className="text-white font-mono font-bold">Discord API v10</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Heartbeat Ping:</span>
                <span className="text-emerald-400 font-mono font-bold">28ms latency</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Shard Index:</span>
                <span className="text-purple-300 font-mono">SHARD_0_OF_1</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">WebSocket state:</span>
                <span className="text-[#bf55ec] font-mono font-bold">CONNECTED_STABLE</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Queue Priority Flags</h4>
            <div className="flex gap-2">
              <span className="text-[9px] px-2 py-1 rounded bg-[#211a4a] text-[#a2aaff] font-mono border border-indigo-500/10">THROTTLE_OFF</span>
              <span className="text-[9px] px-2 py-1 rounded bg-[#211a4a] text-purple-300 font-mono border border-indigo-500/10">AUTO_EST_ON</span>
              <span className="text-[9px] px-2 py-1 rounded bg-[#33112d] text-fuchsia-400 font-mono border border-fuchsia-500/15 animate-pulse">AI-ENHANCED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Mini Log Table */}
      <div className="rounded-2xl border border-[#1e1940] bg-[#0c091a]/80 p-6 backdrop-blur-md relative overflow-hidden">
        <h3 className="text-sm font-bold text-white tracking-wide mb-4">Latest System Audit Trail</h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#211a4a] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">User Principal</th>
                <th className="pb-3 font-semibold">Action Target</th>
                <th className="pb-3 font-semibold">Payload Entity</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1940]/40 text-xs text-slate-300">
              {recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-[#161131]/30 transition-colors">
                  <td className="py-3 font-mono text-[#a2aaff]">{activity.user}</td>
                  <td className="py-3 font-semibold">{activity.action}</td>
                  <td className="py-3 text-purple-300 font-medium">{activity.target}</td>
                  <td className="py-3 text-right text-slate-500 font-mono">{new Date(activity.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500 italic">No historical activities yet recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
