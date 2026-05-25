import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  Sliders, 
  HelpCircle, 
  Flame, 
  Zap, 
  Lock, 
  Key, 
  Info,
  ExternalLink,
  Bot
} from 'lucide-react';

export default function SettingsView() {
  const [apiKey, setApiKey] = useState('●●●●●●●●●●●●●●●●●●●●●●●●');
  const [speed, setSpeed] = useState('normal');
  const [autoRetry, setAutoRetry] = useState(true);
  const [logsThrottle, setLogsThrottle] = useState(2);
  const [webhookUrl, setWebhookUrl] = useState('https://discord.com/api/webhooks/110903827/a38f3jB18...');

  const permissionList = [
    { name: 'Manage Channels', code: 'MANAGE_CHANNELS', requiredFor: 'Creating structural text guidelines, voice sandboxes, and structural category layouts.' },
    { name: 'Manage Roles', code: 'MANAGE_ROLES', requiredFor: 'Provisioning customized administrative hierarchies and beautiful neon color tags.' },
    { name: 'View Channels', code: 'VIEW_CHANNELS', requiredFor: 'Scanning template structures and indexing metadata cleanly.' },
    { name: 'Manage Emojis', code: 'MANAGE_EMOJIS_AND_STICKERS', requiredFor: 'Exporting/importing custom emote packs securely.' },
    { name: 'Manage Webhooks', code: 'MANAGE_WEBHOOKS', requiredFor: 'Generating github action bridges and alert routers.' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300">
      
      {/* Settings Banner */}
      <div className="bg-[#110d21] p-6 rounded-2xl border border-[#211a43] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-sans tracking-tight">Deployment & Profile Cockpit</h2>
          <p className="text-slate-400 text-xs mt-1">
            Configure system execution parameters, OAuth tokens, API keys, and run diagnostic integrity tests.
          </p>
        </div>
        <Settings className="h-9 w-9 text-purple-400/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER PARTS: Settings Form parameters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Velocity parameters */}
          <div className="rounded-2xl border border-[#1e193c] bg-[#0c0919] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 font-mono text-[#bf55ec] uppercase">
              <Sliders className="h-4 w-4" />
              API Throttle Controls
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-sans font-semibold">Deployment Throttle Speed</label>
                <div className="grid grid-cols-3 gap-3 select-none">
                  {['slow', 'normal', 'ultra'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSpeed(v)}
                      className={`py-3.5 rounded-xl border font-bold text-xs font-mono cursor-pointer transition-all ${
                        speed === v
                          ? 'bg-[#5865F2]/20 border-[#5865F2] text-white shadow-[0_0_15px_rgba(88,101,242,0.15)]'
                          : 'bg-[#14102d] border-[#231a4c] text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {v.toUpperCase()} {v === 'normal' && '(API Safe)'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed mt-1">
                  Discord has a standard rate limit of 5 channel creations per 10 seconds. <strong>Normal</strong> inserts appropriate artificial delays to avoid 429 status locks.
                </p>
              </div>

              {/* Automatic Retries toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#110e25] border border-[#1e193c] text-xs font-sans">
                <div>
                  <p className="font-bold text-white">Auto-Retry rate-limited calls</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Automatically re-queues blocked channel calls after retry-after timer completes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRetry(!autoRetry)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoRetry ? 'bg-[#bf55ec]' : 'bg-[#29224d]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                      autoRetry ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Console log latency adjustments */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans font-semibold">Websocket Log Sync Latency</span>
                  <span className="font-mono font-bold text-[#bf55ec]">{logsThrottle}s delay</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={logsThrottle}
                  onChange={(e) => setLogsThrottle(parseFloat(e.target.value))}
                  className="w-full accent-[#bf55ec] h-1.5 rounded-lg bg-[#211a43]"
                />
              </div>

            </div>
          </div>

          {/* Credentials Storage panel */}
          <div className="rounded-2xl border border-[#1e193c] bg-[#0c0919] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 font-mono text-[#bf55ec] uppercase">
              <Key className="h-4 w-4" />
              API Key Setup
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-sans">Gemini AI Engine Secret key</label>
                <div className="relative">
                  <input
                    type="password"
                    disabled
                    value={apiKey}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14102c]/50 border border-[#231a4c] text-slate-500 text-xs font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Configured in Settings
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  The gemini-3.5-flash LLM model handles the AI-assisted layout generation. Defined via standard environment secrets securely.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs text-slate-400 font-sans">Discord Webhook Target URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-xs font-mono"
                />
                <p className="text-[10px] text-slate-500 font-sans">
                  Optional: Sync active deploy results and error diagnostics logs straight to a private Discord channel.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PART: Dedicated Permission diagnostic cards */}
        <div className="space-y-6">
          
          {/* Audit Check list card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-[#0e0a25] p-6 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-[#5865F2]/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-[#5865F2]" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-widest">Required Bot Scope</h3>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-2">
              Ensure your custom Discord application bot is granted these permissions using the <strong>OAuth2 URL Generator</strong> client payload:
            </p>

            <div className="space-y-3 mt-4">
              {permissionList.map((perm) => (
                <div key={perm.code} className="p-3 rounded-lg bg-[#070512] border border-[#231a4a]/80 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                    <span className="text-indigo-300">{perm.name}</span>
                    <span className="text-[#bf55ec] bg-[#bf55ec]/10 px-1.5 py-0.2 rounded border border-purple-500/10 font-bold uppercase">{perm.code}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    {perm.requiredFor}
                  </p>
                </div>
              ))}
            </div>

            {/* Diagnostic Action */}
            <div className="pt-2">
              <a 
                href="https://discord.com/developers/applications" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full py-2.5 rounded-xl bg-[#181335] hover:bg-[#201944] border border-[#332a68] text-[#a2aaff] font-bold text-[11px] font-sans flex items-center justify-center space-x-1.5"
              >
                <span>Discord Developers portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* Secure ToS compliance notice */}
          <div className="rounded-2xl border border-[#241d49]/80 bg-[#0c0919] p-5 text-slate-400 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ToS Compliance Standards
            </h4>
            <p className="text-[10.5px] leading-relaxed font-sans">
              Self-bots and collecting user Discord account tokens violate Discord terms of service and lead to instant account ban. This platform uses only official server-side bot gateway libraries.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
