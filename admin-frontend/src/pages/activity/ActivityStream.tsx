import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  Activity,
  Trash2,
  Eye,
  Award,
  ExternalLink,
  Download,
  Flame,
  Check,
  Archive,
  Sparkles,
  AlertTriangle,
  Cpu,
  UserCheck,
  Globe,
  Search,
  RefreshCw,
  Smartphone,
  Laptop,
  Chrome,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Inbox,
  Filter,
  CheckSquare
} from 'lucide-react';

export default function ActivityStream() {
  const notifications = useStore((state) => state.notifications) || [];
  const fetchNotifications = useStore((state) => state.fetchNotifications);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead);
  const deleteNotification = useStore((state) => state.deleteNotification);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Helper to parse metadata
  const parseMetadata = (meta: any) => {
    if (!meta) return {};
    if (typeof meta === 'string') {
      try {
        return JSON.parse(meta);
      } catch (e) {
        return {};
      }
    }
    return meta;
  };

  // Classify categories based on notification fields
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Apply Search Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        notif.title.toLowerCase().includes(searchLower) ||
        notif.message.toLowerCase().includes(searchLower) ||
        (notif.type && notif.type.toLowerCase().includes(searchLower)) ||
        (notif.priority && notif.priority.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Apply Category Tab Filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !notif.read;
      if (activeFilter === 'lead') return notif.type === 'lead';
      if (activeFilter === 'visitor') return notif.type === 'visitor';
      if (activeFilter === 'ai') return notif.type === 'ai';
      if (activeFilter === 'engagement') return notif.type === 'engagement';
      if (activeFilter === 'system') return notif.type === 'system';

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  // Compute analytics from active notifications list
  const metrics = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const leads = notifications.filter((n) => n.type === 'lead').length;
    const highValueVisitors = notifications.filter((n) => {
      if (n.type !== 'visitor') return false;
      const meta = parseMetadata(n.metadata);
      return meta.engagementScore && meta.engagementScore >= 80;
    }).length;
    const aiAlerts = notifications.filter((n) => n.type === 'ai').length;

    return { total, unread, leads, highValueVisitors, aiAlerts };
  }, [notifications]);

  // Map category to styles, badges and icons
  const getCategoryDetails = (type: string, priority: string = 'MEDIUM') => {
    const cleanType = (type || 'system').toLowerCase();
    const cleanPriority = (priority || 'MEDIUM').toUpperCase();

    let icon = Cpu;
    let label = 'System Alert';
    let gradient = 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400';
    let dotColor = 'bg-cyan-400';

    if (cleanType === 'lead') {
      icon = UserCheck;
      label = 'Collab Signal';
      if (cleanPriority === 'HIGH') {
        gradient = 'from-rose-500/20 to-red-500/20 border-rose-500/55 text-rose-400';
        dotColor = 'bg-rose-500';
      } else if (cleanPriority === 'LOW') {
        gradient = 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400';
        dotColor = 'bg-emerald-400';
      } else {
        gradient = 'from-amber-500/15 to-orange-500/15 border-amber-500/40 text-amber-400';
        dotColor = 'bg-amber-400';
      }
    } else if (cleanType === 'visitor') {
      icon = Eye;
      label = 'Visitor Telemetry';
      if (cleanPriority === 'HIGH') {
        gradient = 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/50 text-fuchsia-400';
        dotColor = 'bg-fuchsia-400';
      } else {
        gradient = 'from-purple-500/10 to-violet-500/10 border-purple-500/30 text-purple-400';
        dotColor = 'bg-purple-400';
      }
    } else if (cleanType === 'ai') {
      icon = Sparkles;
      label = 'Neural Analysis';
      gradient = 'from-violet-500/20 to-indigo-500/20 border-violet-500/50 text-violet-400';
      dotColor = 'bg-violet-400';
    } else if (cleanType === 'engagement') {
      icon = Award;
      label = 'Engagement Link';
      gradient = 'from-emerald-500/10 to-teal-500/10 border-emerald-500/35 text-emerald-400';
      dotColor = 'bg-emerald-400';
    }

    return { icon, label, gradient, dotColor };
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* ── HEADER BLOCK ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 bg-card/45 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-wider text-foreground">
              Neural Activity Stream
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 tracking-tight">
            Cybernetic signal intelligence and live visitor telemetry center.
          </p>
        </div>

        <div className="grid grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full md:w-auto px-3.5 py-2 bg-card/60 hover:bg-card border border-border/80 text-xs font-semibold rounded-xl tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
          
          <button
            onClick={markAllNotificationsRead}
            className="w-full md:w-auto px-3.5 py-2 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary text-xs font-bold rounded-xl tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* ── OVERVIEW BENTO METRICS ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          { label: 'Total Telemetry', count: metrics.total, color: 'text-foreground border-border/50 bg-card/10' },
          { label: 'Unread Signals', count: metrics.unread, color: 'text-amber-400 border-amber-500/25 bg-amber-500/5', icon: AlertTriangle },
          { label: 'Collab Signals', count: metrics.leads, color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5', icon: UserCheck },
          { label: 'Elite Visitors (≥80)', count: metrics.highValueVisitors, color: 'text-fuchsia-400 border-fuchsia-500/25 bg-fuchsia-500/5', icon: Flame },
          { label: 'AI Score Insights', count: metrics.aiAlerts, color: 'text-violet-400 border-violet-500/25 bg-violet-500/5', icon: Sparkles }
        ].map((m, idx) => {
          const MIcon = m.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border backdrop-blur-md shadow-sm flex flex-col justify-between relative overflow-hidden select-none ${m.color} ${idx === 4 ? 'col-span-2 lg:col-span-1' : 'col-span-1'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">{m.label}</span>
                {MIcon && <MIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />}
              </div>
              <div className="text-2xl font-black mt-2 font-mono tracking-tight">{m.count}</div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-foreground/5 rounded-full blur-xl pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* ── OPERATIONAL SPLIT LAYOUT ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-start">
        {/* Left Sidebar Category Filters */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-card/40 border border-border/40 rounded-2xl p-4 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest pb-2 border-b border-border/30">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search telemetry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border/70 rounded-xl py-2 pl-9 pr-3 text-xs placeholder:text-muted-foreground/60 text-foreground focus:outline-none focus:border-primary/60 transition-all font-medium"
              />
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3.5 top-3" />
            </div>

            {/* Category tabs */}
            <div className="flex flex-col gap-1">
              {[
                { id: 'all', label: 'All Signals', count: notifications.length },
                { id: 'unread', label: 'Unread Only', count: notifications.filter(n => !n.read).length },
                { id: 'lead', label: 'Collab Signals', count: notifications.filter(n => n.type === 'lead').length },
                { id: 'visitor', label: 'Visitor Telemetry', count: notifications.filter(n => n.type === 'visitor').length },
                { id: 'ai', label: 'AI Score Insights', count: notifications.filter(n => n.type === 'ai').length },
                { id: 'engagement', label: 'Engagement Logs', count: notifications.filter(n => n.type === 'engagement').length },
                { id: 'system', label: 'System Telemetry', count: notifications.filter(n => n.type === 'system').length }
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 border border-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chronological Signals Timeline Feed */}
        <div className="lg:col-span-3 space-y-3 md:space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-card/20 border border-border/40 rounded-2xl py-16 px-6 text-center backdrop-blur-md">
              <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">No Signals Recorded</h3>
              <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto mt-1">
                Your system environment has not detected any telemetry signal logs matching these criteria.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const meta = parseMetadata(notif.metadata);
              const isExpanded = !!expandedCards[notif.id];
              const isLead = notif.type === 'lead';
              const isVisitor = notif.type === 'visitor';
              const isAI = notif.type === 'ai';
              const isEngagement = notif.type === 'engagement';

              const { icon: CategoryIcon, label: categoryLabel, gradient: cardStyles, dotColor } = getCategoryDetails(
                notif.type,
                notif.priority
              );

              return (
                <div
                  key={notif.id}
                  className={`border bg-card/25 hover:bg-card/35 backdrop-blur-md rounded-2xl transition-all duration-300 shadow-sm relative overflow-hidden select-text ${
                    !notif.read ? 'border-l-[4px]' : 'border-l-[1px]'
                  } ${
                    !notif.read ? 'border-primary/40' : 'border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none -z-10" />

                  {/* Header Row */}
                  <div className="p-3.5 md:p-5 flex flex-col md:flex-row justify-between items-start gap-3 md:gap-4">
                    <div className="flex gap-3.5 items-start">
                      {/* Floating Category Icon Container */}
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${cardStyles}`}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>

                      {/* Header content details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full select-none ${cardStyles}`}>
                            {categoryLabel}
                          </span>
                          {notif.priority && (
                            <span className={`text-[8.5px] font-mono uppercase tracking-widest font-black ${
                              notif.priority === 'HIGH' ? 'text-rose-400' : notif.priority === 'LOW' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              // {notif.priority}
                            </span>
                          )}
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                          )}
                        </div>

                        <h3 className="text-[13px] font-black tracking-tight text-foreground uppercase mt-0.5">
                          {notif.title}
                        </h3>

                        {/* Geo Location / Info Badges */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground/80 font-medium">
                          {meta.country && meta.country !== 'Unknown' && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 shrink-0" />
                              <span>{meta.country}</span>
                            </span>
                          )}
                          {meta.visitorIp && (
                            <span className="font-mono break-all text-xs">
                              IP: <span className="text-foreground/80">{meta.visitorIp}</span>
                            </span>
                          )}
                          {meta.device && (
                            <span className="flex items-center gap-1 font-mono">
                              {meta.device.toLowerCase() === 'desktop' ? (
                                <Laptop className="w-3 h-3 shrink-0" />
                              ) : (
                                <Smartphone className="w-3 h-3 shrink-0" />
                              )}
                              <span>{meta.device}</span>
                            </span>
                          )}
                          {meta.browser && (
                            <span className="flex items-center gap-1 font-mono">
                              <Chrome className="w-3 h-3 shrink-0" />
                              <span>{meta.browser}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions and Timestamp */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto shrink-0 border-t border-border/30 md:border-none pt-2 md:pt-0">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 mr-0.5 shrink-0 text-primary" />
                        <span>
                          {notif.createdAt 
                            ? `${new Date(notif.createdAt).toLocaleDateString()} • ${new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                            : 'Today • Now'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 cursor-pointer transition-all"
                            title="Mark as Read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 cursor-pointer transition-all"
                          title="Archive & Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleExpand(notif.id)}
                          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Snippet if Collapsed */}
                  {!isExpanded && (
                    <div className="px-4 md:px-5 pb-4 text-xs text-muted-foreground border-t border-border/20 pt-2 bg-black/10 select-text">
                      <p className="line-clamp-1 italic">
                        {notif.message.split('\n').join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-5 pt-3 border-t border-border/30 bg-black/20 text-xs space-y-4 animate-fade-in select-text">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Summary Message */}
                        <div className="space-y-1.5">
                          <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                            Signal Payload Message
                          </h4>
                          <div className="p-3 bg-background/60 border border-border/45 rounded-xl font-medium text-foreground whitespace-pre-line leading-relaxed shadow-inner">
                            {notif.message}
                          </div>
                        </div>

                        {/* Telemetry Visualizations & Extra Details */}
                        <div className="space-y-3">
                          <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                            Telemetry Insights
                          </h4>

                          {/* 1. Engagement Score Progress Bar for High Value Visitor */}
                          {isVisitor && meta.engagementScore && (
                            <div className="p-3.5 bg-background/60 border border-border/45 rounded-xl space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">Engagement Score</span>
                                <span className="text-fuchsia-400 font-mono">{meta.engagementScore}/100</span>
                              </div>
                              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-border/50">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full"
                                  style={{ width: `${meta.engagementScore}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-muted-foreground/75 block font-medium">
                                Triggered by intense site interactions: visiting deep routes, viewing resumes, or inspecting project detail nodes.
                              </span>
                            </div>
                          )}

                          {/* 2. Potential Client Probability Gauge for AI Alerts */}
                          {isAI && meta.probability !== undefined && (
                            <div className="p-3.5 bg-background/60 border border-border/45 rounded-xl space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">Client Probability</span>
                                <span className="text-violet-400 font-mono">{meta.probability}%</span>
                              </div>
                              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-border/50">
                                <div
                                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
                                  style={{ width: `${meta.probability}%` }}
                                />
                              </div>
                              <div className="text-[9px] text-muted-foreground/80 space-y-1">
                                <div>
                                  <strong>Lead Classification:</strong> <span className="text-violet-400 uppercase font-bold">{meta.category || 'GENERAL'}</span>
                                </div>
                                <p className="italic leading-normal">
                                  "{meta.explanation}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* 3. Inbound Lead Score Gauge for new leads */}
                          {isLead && meta.leadScore !== undefined && (
                            <div className="p-3.5 bg-background/60 border border-border/45 rounded-xl space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-muted-foreground uppercase">AI Lead Score</span>
                                <span className="text-amber-400 font-mono">{meta.leadScore}/100</span>
                              </div>
                              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-border/50">
                                <div
                                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                                  style={{ width: `${meta.leadScore}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                                <span>Sender: <strong className="text-foreground">{meta.senderName}</strong></span>
                                <span className="uppercase font-mono text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded font-black">
                                  {meta.category || 'Lead'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 4. Details for Outbound Engagement Clicks & Cert verification */}
                          {isEngagement && (
                            <div className="p-3.5 bg-background/60 border border-border/45 rounded-xl text-[10px] space-y-1.5 text-muted-foreground leading-relaxed">
                              <div>
                                <strong>Interaction Model:</strong>{' '}
                                <span className="text-emerald-400 font-bold uppercase">
                                  {meta.type || 'outbound click'}
                                </span>
                              </div>
                              {meta.certificateTitle && (
                                <div>
                                  <strong>Certificate Inspected:</strong>{' '}
                                  <span className="text-foreground font-semibold">
                                    {meta.certificateTitle}
                                  </span>
                                </div>
                              )}
                              {meta.projectTitle && (
                                <div>
                                  <strong>Project Nodes Visited:</strong>{' '}
                                  <span className="text-foreground font-semibold">
                                    {meta.projectTitle}
                                  </span>
                                </div>
                              )}
                              {meta.interactionsCount && (
                                <div>
                                  <strong>Interaction Heat Level:</strong>{' '}
                                  <span className="text-rose-400 font-mono font-bold">
                                    {meta.interactionsCount} visits in 60m
                                  </span>
                                </div>
                              )}
                              {meta.platform && (
                                <div>
                                  <strong>Social Link Redirect:</strong>{' '}
                                  <span className="text-foreground font-bold">
                                    {meta.platform} Profile Outbound
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
