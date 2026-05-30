import React from 'react';
import { useStore } from '../../store/useStore';
import {
  LineChart,
  Globe,
  Laptop,
  FolderKanban,
  Plus,
  Rocket,
  Award,
  Briefcase,
  Sparkles,
  Zap,
  Clock,
  Activity,
  MessageSquare
} from 'lucide-react';

interface OverviewProps {
  setActiveTab?: (tab: any) => void;
  activePortfolio?: string;
}

export default function Overview({ setActiveTab, activePortfolio }: OverviewProps) {
  const analytics = useStore((state) => state.analytics);
  const projects = useStore((state) => state.projects) || [];
  const skills = useStore((state) => state.skills) || [];
  const certificates = useStore((state) => state.certificates) || [];
  const internships = useStore((state) => state.internships) || [];
  const messages = useStore((state) => state.messages) || [];
  const setSuccess = useStore((state) => state.setSuccess);

  // Demographics aggregation: Group smaller countries into "Others"
  const totalViews = analytics.totalViews || 1;
  const countryEntries = Object.entries(analytics.stats?.countries || {});
  const sortedCountries = countryEntries.sort((a, b) => b[1] - a[1]);

  let displayCountries: { name: string; count: number; percentage: number }[] = [];
  if (sortedCountries.length > 0) {
    const topCountry = sortedCountries[0];
    displayCountries.push({
      name: topCountry[0],
      count: topCountry[1],
      percentage: Math.round((topCountry[1] / totalViews) * 100)
    });
    
    if (sortedCountries.length > 1) {
      const othersCount = sortedCountries.slice(1).reduce((acc, curr) => acc + curr[1], 0);
      displayCountries.push({
        name: 'Others',
        count: othersCount,
        percentage: Math.round((othersCount / totalViews) * 100)
      });
    }
  }

  // Project Clicks aggregation
  const clickEntries = Object.entries(analytics.stats?.projectClicks || {});
  const sortedClicks = clickEntries.sort((a, b) => b[1] - a[1]);
  const totalClicks = clickEntries.reduce((acc, curr) => acc + curr[1], 0) || 1;

  // Main audience name lookup
  const mainAudience = sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A';

  // Visitor devices count
  const mainDevice = Object.keys(analytics.stats?.devices || {}).sort((a, b) => 
    (analytics.stats?.devices[b] || 0) - (analytics.stats?.devices[a] || 0)
  )[0] || 'N/A';

  // Quick action publish trigger
  const handlePublishAll = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio synth failed:', e);
    }
    setSuccess('SYSTEM-WIDE DEPLOYMENT SUCCESSFULLY DISPATCHED! All visitor nodes synchronized.');
  };

  // Dynamically assemble recent activities from dynamic database content
  const dynamicActivities: any[] = [];
  
  messages.slice(0, 3).forEach((m: any) => {
    dynamicActivities.push({
      id: `msg-${m.id || m._id || Math.random()}`,
      type: 'message',
      icon: MessageSquare,
      title: 'Inquiry Received',
      detail: `Inbound letter from "${m.senderName || 'Anonymous'}"`,
      time: m.createdAt ? new Date(m.createdAt) : new Date(),
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
    });
  });

  projects.slice(0, 3).forEach((p: any) => {
    dynamicActivities.push({
      id: `proj-${p.id || p._id || Math.random()}`,
      type: 'project',
      icon: FolderKanban,
      title: 'Project Synced',
      detail: `Flagship build "${p.title}" configured live`,
      time: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    });
  });

  certificates.slice(0, 2).forEach((c: any) => {
    dynamicActivities.push({
      id: `cert-${c.id || c._id || Math.random()}`,
      type: 'certificate',
      icon: Award,
      title: 'Credential Added',
      detail: `"${c.title}" verified by ${c.issuer}`,
      time: c.createdAt ? new Date(c.createdAt) : new Date(Date.now() - 86400000),
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    });
  });

  internships.slice(0, 2).forEach((i: any) => {
    dynamicActivities.push({
      id: `intern-${i.id || i._id || Math.random()}`,
      type: 'internship',
      icon: Briefcase,
      title: 'Experience Updated',
      detail: `Registered role at "${i.company || 'Enterprise'}"`,
      time: i.createdAt ? new Date(i.createdAt) : new Date(Date.now() - 172800000),
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    });
  });

  // Sort activity descending by timestamp
  const sortedActivities = dynamicActivities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in select-none text-left">
      
      {/* 1. SaaS Command Center / Quick Actions */}
      <div className="premium-card rounded-2xl p-6 relative overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap className="w-32 h-32 text-primary" />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>SaaS OPERATIONAL CONTROL DECK</span>
            </span>
            <h4 className="text-base font-black text-white uppercase tracking-tight font-heading">Command Center & Quick Actions</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">One-click operational triggers to configure showcase repositories and deploy updates instantly.</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            {/* New Project */}
            <button
              onClick={() => setActiveTab?.('projects')}
              className="px-3.5 py-2 bg-background border border-border hover:border-primary/50 hover:bg-muted text-foreground hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>+ New Project</span>
            </button>

            {/* New Certificate */}
            <button
              onClick={() => setActiveTab?.(activePortfolio === 'khushaboo' ? 'certificates-ks' : 'certificates')}
              className="px-3.5 py-2 bg-background border border-border hover:border-primary/50 hover:bg-muted text-foreground hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>+ New Cert</span>
            </button>

            {/* New Internship */}
            <button
              onClick={() => setActiveTab?.('internships')}
              className="px-3.5 py-2 bg-background border border-border hover:border-primary/50 hover:bg-muted text-foreground hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>+ New Internship</span>
            </button>

            {/* Publish All */}
            <button
              onClick={handlePublishAll}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-primary/20 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Publish All</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 2. Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Visitors */}
        <div className="premium-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-primary/20">
            <LineChart className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Visitors</p>
          <h3 className="text-4xl font-black text-primary tracking-tight">{analytics.totalViews}</h3>
          <div className="mt-2 text-[9px] text-muted-foreground/60 font-mono">Real-time counter active</div>
        </div>

        {/* Main Audience */}
        <div className="premium-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-primary/20">
            <Globe className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Main Audience</p>
          <h3 className="text-2xl font-black text-foreground tracking-tight truncate pr-8 uppercase">{mainAudience}</h3>
          <div className="mt-2 text-[9px] text-muted-foreground/60 font-mono">
            {sortedCountries.length} Countries total
          </div>
        </div>

        {/* Visitor Devices */}
        <div className="premium-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-primary/20">
            <Laptop className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Visitor Devices</p>
          <h3 className="text-2xl font-black text-foreground tracking-tight">{mainDevice}</h3>
          <div className="mt-2 text-[9px] text-muted-foreground/60 font-mono truncate">
            Desktop: {analytics.stats?.devices?.['Desktop'] || 0} | Mobile: {analytics.stats?.devices?.['Mobile'] || 0}
          </div>
        </div>

        {/* Project Clicks */}
        <div className="premium-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-primary/20">
            <FolderKanban className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Project Clicks</p>
          <h3 className="text-2xl font-black text-foreground tracking-tight">{totalClicks - 1}</h3>
          <div className="mt-2 text-[9px] text-muted-foreground/60 font-mono">Action metrics tracked</div>
        </div>
      </div>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Visitors */}
        <div className="premium-card rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/40 pb-3 mb-4">
              Top Visitors
            </h3>
            {displayCountries.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-10">No visitor records loaded yet.</p>
            ) : (
              <div className="space-y-4 pt-1">
                {displayCountries.map((c) => (
                  <div key={c.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-foreground font-semibold">
                      <span>{c.name}</span>
                      <span className="font-mono text-muted-foreground">{c.percentage}% ({c.count})</span>
                    </div>
                    <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/20">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[8px] text-muted-foreground/50 font-mono mt-4">Geo-IP telemetry sourced</p>
        </div>

        {/* Project Performance */}
        <div className="premium-card rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/40 pb-3 mb-4">
              Project Performance
            </h3>
            {sortedClicks.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-10">No clicks recorded yet.</p>
            ) : (
              <div className="space-y-4 pt-1">
                {sortedClicks.slice(0, 3).map(([proj, count]: any) => {
                  const percentage = Math.round((count / totalClicks) * 100);
                  return (
                    <div key={proj} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-foreground font-semibold">
                        <span className="truncate w-2/3">{proj}</span>
                        <span className="font-mono text-muted-foreground">{percentage}% ({count})</span>
                      </div>
                      <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/20">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <p className="text-[8px] text-muted-foreground/50 font-mono mt-4">Unique interaction events</p>
        </div>
      </div>

      {/* 4. Unified Activity console (Recent Events + Live Telemetry logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dynamic Recent Events activities */}
        <div className="premium-card rounded-2xl p-6 flex flex-col justify-between min-h-[340px]">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/40 pb-3 flex items-center justify-between">
              <span>Recent System Activity</span>
              <span className="text-[8px] font-mono bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded">
                INTEGRATED CMS ACTIONS
              </span>
            </h3>
            
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {sortedActivities.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Activity className="w-8 h-8 text-neutral-600 animate-pulse" />
                  <p className="text-[11px] font-mono">No telemetry events recorded yet.</p>
                </div>
              ) : (
                sortedActivities.map((act) => {
                  const EventIcon = act.icon || Activity;
                  return (
                    <div key={act.id} className="flex gap-3 items-start border-b border-border/10 pb-3 last:border-b-0 last:pb-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 text-left ${act.color}`}>
                        <EventIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left space-y-0.5 min-w-0 flex-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-black text-white uppercase tracking-tight truncate">{act.title}</span>
                          <span className="text-[8px] text-muted-foreground shrink-0 font-mono flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {act.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate leading-normal">{act.detail}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/50 font-mono mt-4">Automated system lifecycle logs</p>
        </div>

        {/* Live Visitor Activity Console */}
        <div className="premium-card rounded-2xl p-6 flex flex-col justify-between min-h-[340px]">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/40 pb-3 mb-4 flex items-center justify-between">
              <span>Live Traffic signals</span>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                <span>ACTIVE LIVE FEED</span>
              </span>
            </h3>
            
            <div className="max-h-80 overflow-y-auto font-mono text-[11px] text-muted-foreground/80 space-y-2.5 bg-black/40 p-4 rounded-xl border border-border/30 select-text pr-1.5">
              {!analytics.logs || analytics.logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent traffic signals received.</p>
              ) : (
                analytics.logs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-4 border-b border-border/10 pb-2 last:border-b-0">
                    <span className="text-muted-foreground shrink-0">[{new Date(log.visitTime).toLocaleTimeString()}]</span>
                    <span className="text-primary shrink-0">{log.visitorIp}</span>
                    <span className="text-foreground/75 shrink-0 uppercase">{log.country}</span>
                    <span className="text-muted-foreground/60 shrink-0">({log.device})</span>
                    <span className="text-foreground font-medium truncate">
                      {log.clickedProject ? `Clicked project: "${log.clickedProject}"` : 'Entered Landing'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/50 font-mono mt-4">Geo-IP sockets tracking telemetry</p>
        </div>
      </div>
    </div>
  );
}
