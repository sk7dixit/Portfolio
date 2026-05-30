import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldAlert, Globe, Monitor, Compass, Database, Clock } from 'lucide-react';

export default function VisitorLogs() {
  const analytics = useStore((state) => state.analytics);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all visitor records
  const logs = analytics.logs || [];

  // Filter logs by search term (country, IP, device, visited page)
  const filteredLogs = logs.filter((log: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (log.visitorIp || '').toLowerCase().includes(term) ||
      (log.country || '').toLowerCase().includes(term) ||
      (log.device || '').toLowerCase().includes(term) ||
      (log.browser || '').toLowerCase().includes(term) ||
      (log.clickedProject || '').toLowerCase().includes(term) ||
      (log.visitedPage || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Overview Block */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Visitor Tracking Console</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time system observability records detailing portfolio visitors, browser parameters, and click events.</p>
        </div>

        <div className="flex gap-2 w-full mt-4 md:mt-0 md:w-fit">
          <input
            type="text"
            placeholder="Search country, IP, device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-background border border-border focus:border-primary focus:outline-none px-4 py-2 rounded-lg text-xs text-foreground transition-all"
          />
        </div>
      </div>

      {/* Observability Dash Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-3 text-primary/10">
            <Globe className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Global IP Anchors</p>
          <h3 className="text-2xl font-black text-foreground">
            {Object.keys(analytics.stats?.countries || {}).length}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Unique countries registered</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-3 text-primary/10">
            <Monitor className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mobiles tracked</p>
          <h3 className="text-2xl font-black text-foreground">
            {analytics.stats?.devices?.['Mobile'] || 0}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Mobile viewports registered</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-3 text-primary/10">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Hits Observed</p>
          <h3 className="text-2xl font-black text-primary">
            {analytics.totalViews}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Telemetry packet updates</p>
        </div>
      </div>

      {/* Logs Table Sheet */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-3 mb-4">
          Telemetry Observability Feed
        </h3>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Compass className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-xs font-semibold">No observability records matched your criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop Observability Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left text-xs font-mono select-text">
                <thead className="select-none">
                  <tr className="border-b border-border/80 text-muted-foreground uppercase text-[10px] font-extrabold tracking-wider bg-background/50">
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">IP Address</th>
                    <th className="py-2.5 px-4">Geography</th>
                    <th className="py-2.5 px-4">Device</th>
                    <th className="py-2.5 px-4">Browser</th>
                    <th className="py-2.5 px-4">Route / clicked event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-primary/[0.02] border-l border-transparent hover:border-primary/40 transition-all">
                      <td className="py-2.5 px-4 text-muted-foreground text-[10px]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{new Date(log.visitTime).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-foreground font-semibold font-mono tracking-tight">{log.visitorIp}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[9px]">
                          {log.country || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-foreground font-sans text-xs">{log.device || 'Desktop'}</td>
                      <td className="py-2.5 px-4 text-muted-foreground font-sans text-xs">{log.browser || 'N/A'}</td>
                      <td className="py-2.5 px-4">
                        {log.clickedProject ? (
                          <span className="text-primary font-bold">
                            Clicked: &quot;{log.clickedProject}&quot;
                          </span>
                        ) : (
                          <span className="text-muted-foreground/80 font-sans text-xs">Visited Landing Route</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked logs cards */}
            <div className="md:hidden space-y-3">
              {filteredLogs.map((log: any) => (
                <div key={log.id} className="bg-background/40 border border-border p-3.5 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{new Date(log.visitTime).toLocaleString()}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 shrink-0">
                      🌍 {log.country || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-border/20">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-sans font-bold">IP Address</span>
                      <span className="block text-foreground font-semibold break-all text-[11px]">{log.visitorIp}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-sans font-bold">Device</span>
                      <span className="block text-foreground font-sans">{log.device || 'Desktop'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-border/20">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-sans font-bold">Browser</span>
                      <span className="block text-muted-foreground font-sans">{log.browser || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-sans font-bold">Country</span>
                      <span className="block text-foreground font-sans">🌍 {log.country || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-sans font-bold">Event</span>
                    {log.clickedProject ? (
                      <span className="text-primary font-bold block text-[11px] leading-relaxed">
                        Clicked: &quot;{log.clickedProject}&quot;
                      </span>
                    ) : (
                      <span className="text-muted-foreground/80 font-sans text-[11px] block leading-relaxed">Visited Landing Route</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
