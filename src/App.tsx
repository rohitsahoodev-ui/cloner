import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CloneView from './components/CloneView';
import TemplateMarketplace from './components/TemplateMarketplace';
import SettingsView from './components/SettingsView';
import ActivityLogsView from './components/ActivityLogsView';
import AnalyticsView from './components/AnalyticsView';
import { DiscordTemplate, DashboardMetrics, ActivityFeedItem } from './types';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalDeployments: 42,
    activeTemplates: 5,
    successfulClones: 38,
    deploymentSpeed: '42.5s avg',
    rateLimitStatus: '100% Stable'
  });
  const [templates, setTemplates] = useState<DiscordTemplate[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial backend database state on mount
  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.templates) setTemplates(data.templates);
        if (data.recentActivity) setRecentActivity(data.recentActivity);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Sync Activity Helper function
  const handleAddActivity = (action: string, target: string) => {
    const newAct: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      user: 'ahalyasahoo195@gmail.com',
      action,
      target,
      timestamp: new Date().toISOString()
    };
    setRecentActivity((prev) => [newAct, ...prev]);
  };

  // 1. Save and Publish layout
  const handleSaveTemplate = async (template: any) => {
    try {
      const res = await fetch('/api/save-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      
      // Refresh state locally
      if (result.success) {
        setTemplates((prev) => {
          const index = prev.findIndex((t) => t.id === result.template.id);
          if (index !== -1) {
            const copy = [...prev];
            copy[index] = result.template;
            return copy;
          } else {
            return [result.template, ...prev];
          }
        });
        handleAddActivity('Saved & Cached customized template configuration', template.name);
        // Refresh local analytics
        setMetrics(prev => ({
          ...prev,
          activeTemplates: prev.activeTemplates + 1
        }));
      }
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 2. Start deployment
  const handleDeployTemplate = async (payload: any) => {
    try {
      const res = await fetch('/api/deploy-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      handleAddActivity('Started automated build deployment workflow', payload.targetGuildName);
      
      return data.deploymentId;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 3. Like template action
  const handleLikeTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
        const nextLikes = t.likes + 1;
        handleAddActivity('Liked public template', t.name);
        return { ...t, likes: nextLikes };
      }
      return t;
    }));
  };

  // 4. Import action click
  const handleImportToClone = (template: DiscordTemplate) => {
    // Dynamically inject imported state parameters and switch view to the interactive model
    setActiveView('clone');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060410] text-[#eae7f8] font-sans selection:bg-[#5865F2]/40">
      
      {/* Sidebar Controller */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        recentActivity={recentActivity}
        savedCount={templates.length}
      />

      {/* Main Content Workspace viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-radial from-[#120d2d]/30 via-[#0a071a] to-[#04030d] overflow-y-auto relative">
        
        {/* Animated Particles Top Glow Background element */}
        <div className="absolute top-0 left-1/4 right-1/4 h-80 bg-gradient-to-b from-[#5865F2]/5 to-transparent filter blur-3xl pointer-events-none select-none" />

        {/* Global Nav indicators */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#1b1539] bg-[#070513]/80 px-8 backdrop-blur-md select-none">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold text-[#564e7a] uppercase tracking-widest">
              WORKSPACE GATEPORT/
            </span>
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase">
              {activeView === 'dashboard' ? 'Saas Control Console' : activeView}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 font-mono text-[10px] text-indigo-300/85 bg-[#5865F2]/10 border border-indigo-500/10 px-2.5 py-1 rounded-full font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PRINCIPAL CLIENT: USER</span>
            </div>
          </div>
        </header>

        {/* Loading overlay panel */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <span className="animate-spin rounded-full h-8 w-8 border-4 border-[#bf55ec] border-t-transparent" />
            <p className="text-xs text-purple-400 font-mono tracking-wider animate-pulse uppercase">Syncing server state metrics...</p>
          </div>
        ) : (
          <div className="flex-1 px-8 py-8 relative">
            
            {activeView === 'dashboard' && (
              <DashboardView 
                metrics={metrics} 
                onNavigateToClone={() => setActiveView('clone')}
                recentActivity={recentActivity}
              />
            )}

            {activeView === 'clone' && (
              <CloneView 
                onSaveTemplate={handleSaveTemplate}
                onDeployTemplate={handleDeployTemplate}
                onAddActivity={handleAddActivity}
              />
            )}

            {activeView === 'templates' && (
              <TemplateMarketplace 
                templates={templates}
                onImportToClone={handleImportToClone}
                onLikeTemplate={handleLikeTemplate}
              />
            )}

            {activeView === 'activity' && (
              <ActivityLogsView 
                activityLogs={recentActivity}
              />
            )}

            {activeView === 'analytics' && (
              <AnalyticsView 
                metrics={metrics}
              />
            )}

            {activeView === 'settings' && (
              <SettingsView />
            )}

          </div>
        )}

      </main>

    </div>
  );
}
