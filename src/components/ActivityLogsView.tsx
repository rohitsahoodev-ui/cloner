import React from 'react';
import { Activity, Clock, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { ActivityFeedItem } from '../types';

interface ActivityLogsViewProps {
  activityLogs: ActivityFeedItem[];
}

export default function ActivityLogsView({ activityLogs }: ActivityLogsViewProps) {
  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300">
      
      {/* Header Info Banner */}
      <div className="bg-[#110d21] p-6 rounded-2xl border border-[#211a43] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-sans tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-400" />
            Audit Database Logs
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Real-time telemetry and indexing logs for standard OAuth API transactions. Clean audit compliance trails.
          </p>
        </div>
        <Clock className="h-9 w-9 text-purple-400/50" />
      </div>

      {/* Main logs display board */}
      <div className="bg-[#0c0919] rounded-2xl border border-[#1f1a3f] overflow-hidden">
        <div className="bg-[#0f0b22] px-6 py-4.5 border-b border-[#211a48] flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Event Feed
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Synced to cloud run agent</span>
        </div>

        <div className="p-6 divide-y divide-[#1f1a3f]/50">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-[#161131]/20 px-3 rounded-xl transition-all duration-300">
              
              <div className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-lg bg-[#5865F2]/10 flex items-center justify-center text-[#5865F2] shrink-0 mt-0.5">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-100 font-sans">{log.action}</span>
                    <span className="text-[10px] font-mono text-[#a2aaff] bg-[#a2aaff]/10 px-2 py-0.5 rounded">
                      {log.user}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    Target Object: <span className="text-purple-300 font-sans font-bold">{log.target}</span>
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-[#1f1a3f] sm:pl-5 shrink-0 select-none">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 justify-end">
                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 rounded px-1.5 ml-1 inline-block uppercase mt-1">
                  SECURE_COM_OK
                </span>
              </div>

            </div>
          ))}

          {activityLogs.length === 0 && (
            <div className="p-12 text-center text-slate-500 italic font-sans">
              Audit trail queue currently empty. Initialize a server scan to record logs.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
