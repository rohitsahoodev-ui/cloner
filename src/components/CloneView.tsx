import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bot, 
  AlertTriangle, 
  Layers, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Save, 
  Download, 
  MessageSquare,
  Shield,
  HelpCircle,
  Copy,
  FolderDot
} from 'lucide-react';
import { DiscordTemplate, DiscordCategory, DiscordChannel, DiscordRole, DiscordEmoji, CloneOptions } from '../types';

interface CloneViewProps {
  onSaveTemplate: (template: any) => Promise<any>;
  onDeployTemplate: (payload: any) => Promise<string>;
  onAddActivity: (action: string, target: string) => void;
}

export default function CloneView({ onSaveTemplate, onDeployTemplate, onAddActivity }: CloneViewProps) {
  // Input states
  const [inviteOrId, setInviteOrId] = useState('');
  const [simulationHasBot, setSimulationHasBot] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Loaded/Created Template
  const [template, setTemplate] = useState<DiscordTemplate | null>(null);
  const [isLimitedPreview, setIsLimitedPreview] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [typingLogs, setTypingLogs] = useState<string[]>([]);

  // Editing state
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [editingChannelName, setEditingChannelName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Clone Options
  const [options, setOptions] = useState<CloneOptions>({
    roles: true,
    categories: true,
    textChannels: true,
    voiceChannels: true,
    stageChannels: true,
    emojis: true,
    webhooks: false,
    welcomeSettings: true
  });

  // AI generator prompt states
  const [aiTheme, setAiTheme] = useState('');
  const [aiAudience, setAiAudience] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Deployment wizard trigger states
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployGuildName, setDeployGuildName] = useState('');
  const [deploySpeed, setDeploySpeed] = useState<'normal' | 'ultra' | 'slow'>('normal');
  const [activeDeploymentId, setActiveDeploymentId] = useState<string | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<any[]>([]);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployStatus, setDeployStatus] = useState<string>('');

  // Interactive node structure updates
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');
  const [newChannelName, setNewChannelName] = useState('');
  const [activeNewChannelCatId, setActiveNewChannelCatId] = useState<string | null>(null);

  // Typing effect inside scanning window
  useEffect(() => {
    if (scanLogs.length === 0) return;
    setTypingLogs([]);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < scanLogs.length) {
        setTypingLogs(prev => [...prev, scanLogs[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, [scanLogs]);

  // Deployment Poller
  useEffect(() => {
    if (!activeDeploymentId) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/deployment-status?id=${activeDeploymentId}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        
        setDeployProgress(data.progress);
        setDeploymentLogs(data.logs || []);
        setDeployStatus(data.status);

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(poll);
          if (data.status === 'completed') {
            setIsDeploying(false);
            onAddActivity('Deploys completely setup', data.targetGuildName);
          }
        }
      } catch (err) {
        clearInterval(poll);
      }
    }, 1200);

    return () => clearInterval(poll);
  }, [activeDeploymentId]);

  // Action methods
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteOrId.trim()) {
      setErrorText('Please specify a Discord Invite URL (e.g. discord.gg/design) or standard guild ID.');
      return;
    }
    setErrorText('');
    setIsScanning(true);
    setTemplate(null);

    try {
      const res = await fetch('/api/analyze-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteOrId, simulationHasBot })
      });
      if (!res.ok) throw new Error('Failed to resolve server code.');
      const data = await res.json();
      
      setScanLogs(data.logs || []);
      
      // Delay mounting template object until typing simulation starts nicely
      setTimeout(() => {
        setIsLimitedPreview(!data.hasBot);
        setTemplate({
          id: `custom-${Date.now()}`,
          name: data.serverMetadata.name,
          description: `Imported template from invite path ${inviteOrId}`,
          iconUrl: data.serverMetadata.iconUrl,
          bannerUrl: data.serverMetadata.bannerUrl,
          memberCount: data.serverMetadata.memberCount,
          onlineCount: data.serverMetadata.onlineCount,
          isPublic: false,
          categories: data.categories || [],
          roles: data.roles || [],
          emojis: data.emojis || [],
          likes: 0,
          downloads: 0,
          creator: 'Community#1337',
          tags: ['Imported', data.hasBot ? 'Verified-Bot' : 'Smart-Simulation']
        });
        setIsScanning(false);
      }, 2000);

    } catch (err: any) {
      setErrorText(err.message || 'Verification timed out.');
      setIsScanning(false);
    }
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTheme.trim()) return;
    setIsAiGenerating(true);
    setTemplate(null);
    setErrorText('');

    try {
      const res = await fetch('/api/ai-generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: aiTheme, targetAudience: aiAudience })
      });
      if (!res.ok) throw new Error('AI Generator throttled.');
      const data = await res.json();
      
      setIsLimitedPreview(false);
      setScanLogs([
        `[INFO] Infiltrating AI Core Brain engines...`,
        `[INFO] Theme processed: "${aiTheme}" for deep audiences: "${aiAudience || 'Any'}"`,
        `[OK] Standardizing channel nodes, building specific customized emojis...`,
        `[OK] Layout completely synthesized perfectly using Gemini AI.`
      ]);

      setTemplate(data);
    } catch (err: any) {
      setErrorText('AI synthesis is taking longer than expected. Using offline smart outline fallback.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const startDeployment = async () => {
    if (!template) return;
    if (!deployGuildName.trim()) {
      setErrorText('Please type a destination server name to clone structure into.');
      return;
    }

    setIsDeploying(true);
    setDeployProgress(0);
    setDeploymentLogs([]);
    setErrorText('');

    try {
      const deploymentId = await onDeployTemplate({
        templateId: template.id,
        templateName: template.name,
        targetGuildName: deployGuildName,
        speedModifier: deploySpeed
      });
      setActiveDeploymentId(deploymentId);
    } catch (err: any) {
      setErrorText('Could not start build. Check your token setup in general configuration.');
      setIsDeploying(false);
    }
  };

  // Live Structure Editing utils
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const deleteChannel = (catId: string, channelId: string) => {
    if (!template) return;
    const nextCats = template.categories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          channels: cat.channels.filter(ch => ch.id !== channelId)
        };
      }
      return cat;
    });
    setTemplate({ ...template, categories: nextCats });
  };

  const renameChannel = (catId: string, channelId: string, newName: string) => {
    if (!template) return;
    const nextCats = template.categories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          channels: cat.channels.map(ch => {
            if (ch.id === channelId) {
              return { ...ch, name: newName };
            }
            return ch;
          })
        };
      }
      return cat;
    });
    setTemplate({ ...template, categories: nextCats });
    setEditingChannelId(null);
  };

  const addChannel = (catId: string) => {
    if (!template || !newChannelName.trim()) return;
    
    // Normalize text channel to follow lower-case-with-hyphens pattern
    const formattedName = newChannelType === 'text' 
      ? newChannelName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : newChannelName.trim();

    const newChan: DiscordChannel = {
      id: `chan-${Date.now()}`,
      name: newChannelType === 'text' ? `💬-${formattedName}` : `🔊 ${formattedName}`,
      type: newChannelType,
      topic: 'Custom interactive layout channel added via platform portal.'
    };

    const nextCats = template.categories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          channels: [...cat.channels, newChan]
        };
      }
      return cat;
    });

    setTemplate({ ...template, categories: nextCats });
    setNewChannelName('');
    setActiveNewChannelCatId(null);
  };

  // Save current modifications
  const handleSave = async () => {
    if (!template) return;
    try {
      await onSaveTemplate(template);
      alert(`Success: "${template.name}" cloned state stored inside of Template Marketplace.`);
    } catch (err) {
      alert('Failed saving configurations');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300 select-none pb-12">
      
      {/* Visual Header */}
      <div className="border-[#231b4b] bg-gradient-to-r from-[#170e30]/80 via-[#21163e]/50 to-[#0e0921] p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-44 w-44 bg-[#5865F2]/10 rounded-full filter blur-2xl pointer-events-none animate-pulse" />
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#bf55ec] bg-[#bf55ec]/10 px-2.5 py-1 rounded-full border border-purple-500/20 mb-3">
            <Sparkles className="h-3 w-3" />
            AI CLONE LABORATORY
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">Discord Structure replicator</h2>
          <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
            Replicate layout structures, custom voice channels, emojis and sophisticated role hierarchies. Customize the templates interactively before final safe deployment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT SECTION: Paste ID or Invite URL, OR AI generator */}
        <div className="space-y-6">
          
          {/* Main analyzer card panel */}
          <div className="rounded-2xl border border-[#1e1a3d] bg-[#0c0919] p-6 relative">
            <h3 className="text-sm font-bold text-white tracking-wider font-mono uppercase mb-4 text-[#bf55ec]">Method 1: Scan Existing Server</h3>
            
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 font-sans">Discord Server Invite link or Server ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inviteOrId}
                    onChange={(e) => setInviteOrId(e.target.value)}
                    placeholder="e.g. discord.gg/developers OR 1092837210982"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] font-mono transition-all"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                </div>
              </div>

              {/* Bot simulation setup toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#110e25] border border-[#1e193c]">
                <div className="flex items-start space-x-3">
                  <Bot className="h-5 w-5 text-[#5865F2] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white font-sans">Simulate Bot Access</p>
                    <p className="text-[10px] text-slate-400 font-sans">Will fetch full structures instead of limited preview mode.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulationHasBot(!simulationHasBot)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    simulationHasBot ? 'bg-[#5865F2]' : 'bg-[#29224d]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      simulationHasBot ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs select-none uppercase tracking-widest transition-colors shadow-[0_4px_15px_rgba(88,101,242,0.3)] flex items-center justify-center space-x-2"
              >
                {isScanning ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analyze & Scan Target</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Layout Synthesizer */}
          <div className="rounded-2xl border border-[#1e1a3d] bg-[#0c0919]/60 p-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#bf55ec]/5 rounded-bl-full pointer-events-none" />
            <h3 className="text-sm font-bold text-white tracking-wider font-mono uppercase mb-4 text-[#bf55ec] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Method 2: AI-Generated Layout (Gemini)
            </h3>

            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 font-sans">Server Theme / Concept Focus</label>
                <input
                  type="text"
                  value={aiTheme}
                  onChange={(e) => setAiTheme(e.target.value)}
                  placeholder="e.g. Competitive Overwatch Sandbox Team"
                  className="w-full px-4 py-3 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#bf55ec] focus:ring-1 focus:ring-[#bf55ec] font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 font-sans">Target Audience / Persona</label>
                <input
                  type="text"
                  value={aiAudience}
                  onChange={(e) => setAiAudience(e.target.value)}
                  placeholder="e.g. Esports coaches and collegiate gamers (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#bf55ec] focus:ring-1 focus:ring-[#bf55ec] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isAiGenerating || !aiTheme.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#bf55ec] to-[#5865F2] hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(191,85,236,0.3)] flex items-center justify-center space-x-2"
              >
                {isAiGenerating ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Structure with AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Validation Diagnostics & Warnings */}
          {errorText && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3 animate-fadeIn">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="font-sans leading-relaxed">{errorText}</p>
            </div>
          )}

          {/* Retro Shell Scanner Logger */}
          {typingLogs.length > 0 && (
            <div className="rounded-2xl border border-[#1e1a3c] bg-[#070512] p-5 font-mono text-[11px] text-purple-200/90 space-y-2 relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-slate-500 border-b border-[#1b1535] pb-2 mb-3 select-none">
                <span className="flex items-center gap-1.5 font-bold tracking-widest text-[#564e7a] uppercase text-[9px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Terminal Gateway Scans
                </span>
                <span>ttyS1</span>
              </div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono scrollbar-thin">
                {typingLogs.map((log, i) => {
                  const isOk = log.includes('[OK]');
                  const isWarn = log.includes('[WARN]');
                  return (
                    <div 
                      key={i} 
                      className={`leading-relaxed animate-fadeIn ${
                        isOk ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SECTION: Interactive Preview Hierarchy */}
        <div className="space-y-6">
          
          {template ? (
            <div className="space-y-6">
              
              {/* Limited Alert Banner */}
              {isLimitedPreview && (
                <div className="p-4 rounded-xl bg-orange-600/15 border border-orange-500/30 text-orange-200 space-y-1 text-xs animate-pulse">
                  <div className="flex items-center space-x-2 font-bold font-mono">
                    <AlertTriangle className="h-4.5 w-4.5 text-orange-400" />
                    <span>⚠️ LIMITED PREVIEW Fallback</span>
                  </div>
                  <p className="font-sans text-[11px] leading-relaxed text-orange-300">
                    The bot does not have access to the source server context. Generating an estimated, customizable layout preview instead.
                  </p>
                </div>
              )}

              {/* Server Preview Frame mimicking Discord */}
              <div className="rounded-2xl border border-[#211a4a] bg-[#110d21] overflow-hidden shadow-2xl relative">
                
                {/* Banner & Header */}
                <div className="h-24 bg-gradient-to-r from-[#17122a] to-[#251e44] relative flex items-end p-4">
                  {template.bannerUrl && (
                    <img 
                      src={template.bannerUrl} 
                      alt="Banner" 
                      className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" 
                    />
                  )}
                  <div className="flex items-center space-x-3.5 z-10">
                    <img 
                      src={template.iconUrl || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100'} 
                      alt="Guild Icon" 
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#5865F2]" 
                    />
                    <div>
                      <h3 className="text-base font-black text-white leading-none font-sans flex items-center gap-1.5">
                        {template.name}
                        <Shield className="h-4 w-4 text-[#5865F2]" />
                      </h3>
                      <p className="text-[11px] font-mono text-[#a2aaff] mt-1 font-semibold">
                        {template.memberCount?.toLocaleString() || '1,240'} Members • {template.onlineCount?.toLocaleString() || '432'} Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub Menu / Category controls */}
                <div className="bg-[#0b0817] px-4 py-2 border-b border-[#1b1535] flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="font-sans font-bold flex items-center gap-1"><FolderPlus className="h-4 w-4 text-[#5865F2]" /> Layout Elements</span>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => {
                        // Quick toggle expand
                        const next: Record<string, boolean> = {};
                        template.categories.forEach(c => next[c.id] = true);
                        setExpandedCategories(next);
                      }}
                      className="text-[10px] hover:text-white"
                    >
                      Expand All
                    </button>
                    <button 
                      onClick={() => setExpandedCategories({})}
                      className="text-[10px] hover:text-white"
                    >
                      Collapse
                    </button>
                  </div>
                </div>

                {/* Categories & Channel Tree */}
                <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin">
                  {template.categories.map((category) => {
                    const isExpanded = expandedCategories[category.id] !== false;
                    const isCurrentAdding = activeNewChannelCatId === category.id;

                    return (
                      <div key={category.id} className="space-y-1.5">
                        {/* Category Row */}
                        <div className="flex items-center justify-between group py-1">
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="flex items-center space-x-1.5 text-[11px] font-extrabold text-[#756f96] hover:text-white uppercase font-mono tracking-wider cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <span>{category.name}</span>
                          </button>
                          
                          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 duration-200 transition-all">
                            <button
                              onClick={() => {
                                setActiveNewChannelCatId(isCurrentAdding ? null : category.id);
                                setNewChannelName('');
                              }}
                              title="Create channel inside category"
                              className="p-1 rounded hover:bg-[#201944] text-slate-400 hover:text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Expandable Channel Add Form */}
                        {isCurrentAdding && (
                          <div className="p-3 rounded-lg bg-[#14102c] border border-[#231a4c] space-y-2 animate-fadeIn">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-bold font-sans">New Node Type:</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setNewChannelType('text')}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    newChannelType === 'text' ? 'bg-[#5865F2] text-white' : 'bg-[#1b1539] text-slate-400'
                                  }`}
                                >
                                  💬 Text
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewChannelType('voice')}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    newChannelType === 'voice' ? 'bg-[#5865F2] text-white' : 'bg-[#1b1539] text-slate-400'
                                  }`}
                                >
                                  🔊 Voice
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                placeholder="name-tag"
                                className="flex-1 px-2.5 py-1 text-xs rounded bg-[#0b0818] text-white border border-[#231a4a] focus:outline-none"
                              />
                              <button
                                onClick={() => addChannel(category.id)}
                                className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold font-sans hover:bg-emerald-500"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setActiveNewChannelCatId(null)}
                                className="p-1 rounded bg-[#1b1539] text-slate-400 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Channels Map */}
                        {isExpanded && (
                          <div className="pl-3.5 space-y-1 border-l border-[#1f1a3f]/70 ml-1.5">
                            {category.channels.map((chan) => {
                              const isEditing = editingChannelId === chan.id;
                              return (
                                <div 
                                  key={chan.id} 
                                  className="flex items-center justify-between group px-2 py-1.5 rounded-lg hover:bg-[#181335]/70 text-slate-300 hover:text-white text-xs font-sans transition-all"
                                >
                                  {isEditing ? (
                                    <div className="flex items-center gap-1.5 w-full">
                                      <input
                                        type="text"
                                        value={editingChannelName}
                                        onChange={(e) => setEditingChannelName(e.target.value)}
                                        className="bg-[#0b0c16] text-white text-xs px-2.5 py-0.5 rounded border border-[#5865F2] focus:outline-none outline-none w-full font-mono"
                                      />
                                      <button 
                                        onClick={() => renameChannel(category.id, chan.id, editingChannelName)}
                                        className="p-1 rounded bg-emerald-600 font-bold hover:bg-emerald-500"
                                      >
                                        <Check className="h-3 w-3" />
                                      </button>
                                      <button 
                                        onClick={() => setEditingChannelId(null)}
                                        className="p-1 rounded bg-slate-700 hover:bg-slate-600"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-2 truncate">
                                        <span className="text-[11px] font-semibold text-slate-500 font-mono">
                                          {chan.type === 'voice' ? '🔊' : '💬'}
                                        </span>
                                        <span className="truncate text-[11px] select-all font-mono text-slate-200 group-hover:text-white">
                                          {chan.name}
                                        </span>
                                        {chan.topic && (
                                          <span className="hidden md:inline text-[9px] text-slate-400 bg-[#251e44]/40 px-1.5 py-0.5 rounded truncate max-w-[130px]" title={chan.topic}>
                                            {chan.topic}
                                          </span>
                                        )}
                                      </div>

                                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1.5 duration-200">
                                        <button
                                          onClick={() => {
                                            setEditingChannelId(chan.id);
                                            setEditingChannelName(chan.name);
                                          }}
                                          title="Rename channel"
                                          className="p-0.5 rounded text-slate-400 hover:text-[#bf55ec] transition"
                                        >
                                          <Edit3 className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() => deleteChannel(category.id, chan.id)}
                                          title="Delete channel"
                                          className="p-0.5 rounded text-slate-400 hover:text-red-400 transition"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                            {category.channels.length === 0 && (
                              <p className="text-[10px] text-slate-500 italic py-1 pl-2">No nodes found.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Role & Emojis Panel display tabs */}
                <div className="border-t border-[#1e173e] bg-[#0c0919]/50 p-4 space-y-4">
                  
                  {/* Role badges map */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">Role Tree Hierarchy</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {template.roles.map((role) => (
                        <span 
                          key={role.id}
                          className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold font-sans tracking-wide"
                          style={{ backgroundColor: `${role.color}15`, color: role.color, border: `1px solid ${role.color}40` }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ backgroundColor: role.color }} />
                          {role.name}
                        </span>
                      ))}
                      {template.roles.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic">No roles configured.</span>
                      )}
                    </div>
                  </div>

                  {/* Emojis preview inside panel */}
                  {template.emojis && template.emojis.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">Emote Archives</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.emojis.map((emoji) => (
                          <span 
                            key={emoji.id}
                            title={emoji.name}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-[#17122a] border border-[#231a4a] text-[#bf55ec]"
                          >
                            <span>⚜️</span>
                            <span>:{emoji.name}:</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar for layout templates */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 border border-[#211a4c] bg-[#14102d] text-white hover:bg-[#1b153c] rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5 text-purple-300" />
                      <span>Cache template</span>
                    </button>

                    <button
                      onClick={() => {
                        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(template, null, 2))}`;
                        const link = document.createElement('a');
                        link.setAttribute('href', jsonString);
                        link.setAttribute('download', `${template.name.toLowerCase().replace(/\s+/g, '-')}-backup.json`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      className="px-3.5 py-2 border border-[#211a4c] bg-[#14102d] text-slate-300 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1 cursor-pointer"
                      title="Download template configuration as raw JSON file"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>

              </div>

              {/* CLONE OPTIONS CHECKBOX PANEL */}
              <div className="rounded-2xl border border-[#1d173c] bg-[#0c0919] p-5 space-y-4">
                <h4 className="text-xs font-bold text-[#bf55ec] font-mono uppercase tracking-wider">Configure Extraction Options</h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs font-sans text-slate-300 select-none">
                  {[
                    { key: 'roles', label: 'Roles & Permissions' },
                    { key: 'categories', label: 'Categories Layout' },
                    { key: 'textChannels', label: 'Text Channels' },
                    { key: 'voiceChannels', label: 'Voice Channels' },
                    { key: 'stageChannels', label: 'Stage Channels' },
                    { key: 'emojis', label: 'Custom Emojis' },
                    { key: 'webhooks', label: 'Active Webhooks Status' },
                    { key: 'welcomeSettings', label: 'Welcome Messages' }
                  ].map((it) => (
                    <label key={it.key} className="flex items-center space-x-2.5 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={(options as any)[it.key]}
                        onChange={(e) => {
                          setOptions(prev => ({ ...prev, [it.key]: e.target.checked }));
                        }}
                        className="h-4 w-4 bg-[#14102d] border-[#251f49] text-[#5865F2] rounded focus:ring-0 checked:bg-[#5865F2]"
                      />
                      <span>{it.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* INTEGRATED DEPLOYMENT SYSTEMS BUILDER */}
              <div className="rounded-2xl border border-indigo-500/30 bg-[#0e0a25] p-6 space-y-5 relative overflow-hidden shadow-[0_0_20px_rgba(88,101,242,0.1)]">
                <div className="absolute top-0 right-0 h-20 w-20 bg-[#5865F2]/10 rounded-bl-full pointer-events-none" />
                
                <div>
                  <h4 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                    <Play className="h-4 w-4 text-[#5865F2] fill-[#5865F2]" />
                    Safe Deployer Engine
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    Clone the selected layout automatically into a target server. The bot is strictly required inside the destination Discord target server to operate.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 font-mono">1. Destination Server Name</label>
                    <input
                      type="text"
                      value={deployGuildName}
                      onChange={(e) => setDeployGuildName(e.target.value)}
                      placeholder="e.g. Neon Cyber-Club Hub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 select-none">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 font-mono">2. Velocity Control</label>
                      <select 
                        value={deploySpeed}
                        onChange={(e: any) => setDeploySpeed(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#14102c] border border-[#231a4c] text-white text-xs focus:outline-none"
                      >
                        <option value="normal">Normal (API Safe)</option>
                        <option value="ultra">Ultra (Throttled High-Speed)</option>
                        <option value="slow">Slow (Max Consistency)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 font-mono">3. Execute Deploy</label>
                      <button
                        onClick={startDeployment}
                        disabled={isDeploying || !deployGuildName.trim()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#bf55ec] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all select-none cursor-pointer hover:shadow-[0_0_15px_rgba(88,101,242,0.4)]"
                      >
                        {isDeploying ? 'Deploying...' : 'Start Clone Build'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Visual Tracker */}
                {isDeploying && (
                  <div className="space-y-3 pt-3 border-t border-[#231a4c] animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                      <span>Live Setup pipeline</span>
                      <span className="text-[#a2aaff]">{deployProgress}%</span>
                    </div>
                    
                    <div className="w-full h-2 rounded-full bg-[#1b153d] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#5865F2] via-[#bf55ec] to-teal-400 transition-all duration-500 rounded-full"
                        style={{ width: `${deployProgress}%` }}
                      />
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-[#070512] p-4 font-mono text-[11px] text-emerald-300/90 leading-relaxed max-h-[140px] overflow-y-auto">
                      {deploymentLogs.map((log, i) => (
                        <p key={i} className={log.level === 'warn' ? 'text-amber-400' : log.level === 'ok' ? 'text-emerald-400' : 'text-slate-300'}>
                          {log.message}
                        </p>
                      ))}
                      {deploymentLogs.length === 0 && (
                        <p className="text-slate-500 italic">Waiting for pipeline synchronization...</p>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2b2554] bg-[#0c0919]/20 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-[#bf55ec]/5 border border-[#bf55ec]/20 flex items-center justify-center text-[#bf55ec]">
                <Layers className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Ready for Code Extraction</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                  Provide custom parameters inside Method 1 or generate a themed Discord framework instantly using Method 2 to unlock interactive previews.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
