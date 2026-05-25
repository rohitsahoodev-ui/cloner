import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Grid, 
  Activity, 
  BarChart3, 
  Settings, 
  Moon, 
  ShieldCheck, 
  TrendingUp,
  Radio
} from 'lucide-react';
import { ActivityFeedItem } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  recentActivity: ActivityFeedItem[];
  savedCount: number;
}

export default function Sidebar({ activeView, setActiveView, recentActivity, savedCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clone', label: 'Clone & Analyze', icon: Sparkles },
    { id: 'templates', label: 'Template Marketplace', icon: Grid },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-80 border-r border-[#1e1a38] bg-[#0c0919] p-6 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5865F2] to-[#bf55ec] shadow-[0_0_15px_rgba(88,101,242,0.4)]">
            <Radio className="h-5 w-5 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0c0919] bg-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-sans bg-clip-text">
              Discord Cloner
            </h1>
            <p className="text-[10px] text-purple-400/80 font-semibold font-mono tracking-wider">
              AUTO-DEPLOY v2.5
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-widest text-[#564e7a] uppercase font-mono mb-2">
            Control Center
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-sm font-medium font-sans border transition-all duration-300 relative group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#5865F2]/20 to-[#bf55ec]/10 border-[#5865F2]/40 text-white shadow-[0_0_20px_rgba(88,101,242,0.08)]'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-[#151128] hover:border-[#ffffff]/05'
                }`}
              >
                {/* Visual Active Marker */}
                {isSelected && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-[4px] rounded-rbg rounded-r bg-[#5865F2]" />
                )}
                
                <Icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${
                  isSelected ? 'text-[#a2aaff]' : 'text-slate-400 group-hover:text-[#a2aaff]'
                }`} />
                <span>{item.label}</span>
                
                {item.id === 'templates' && savedCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center rounded-md bg-[#5865F2]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Live Feed Widget & Heartbeat */}
      <div className="mt-8 space-y-6 pt-6 border-t border-[#1e1a38]/80">
        <div className="rounded-xl border border-[#221c44] bg-[#120e25]/60 p-4 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#5865F2]/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#564e7a] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Deployment Feed
            </span>
            <span className="text-[9px] text-[#a2aaff] font-mono">Real-time</span>
          </div>

          <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
            {recentActivity.slice(0, 3).map((act, idx) => (
              <div key={act.id || idx} className="text-[11px] leading-relaxed border-b border-[#1e1a38]/30 pb-2 last:border-b-0 last:pb-0">
                <p className="text-slate-300 font-medium">
                  <span className="text-[#a2aaff] font-mono font-semibold">User</span> {act.action}
                </p>
                <p className="text-[#bf55ec] text-[10px] font-semibold truncate">
                  ↳ {act.target}
                </p>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-[11px] text-slate-500 italic py-1 text-center font-sans">
                Silent feed queue
              </p>
            )}
          </div>
        </div>

        {/* Security / ToS Compliance Stamp */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#5865F2]" />
            <span>ToS Compliant API</span>
          </div>
          <span className="hover:text-slate-300 transition-colors">v2.5.0</span>
        </div>
      </div>
    </aside>
  );
}
