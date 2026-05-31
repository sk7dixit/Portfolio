import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import {
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
  Eye,
  Award,
  Sparkles,
  UserCheck,
  Cpu,
  Trash2,
  Check,
  Activity,
  Globe,
  Clock,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { io } from 'socket.io-client';

interface TopbarProps {
  activeTab: string;
  setActiveTab?: (tab: any) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

export default function Topbar({ activeTab, setActiveTab, sidebarExpanded, setSidebarExpanded }: TopbarProps) {
  const user = useStore((state) => state.user);
  const notifications = useStore((state) => state.notifications) || [];
  const addNotification = useStore((state) => state.addNotification);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead);
  const deleteNotification = useStore((state) => state.deleteNotification);
  const logout = useStore((state) => state.logout);

  const { activePortfolio, setActivePortfolio } = usePortfolio();

  const [isDark, setIsDark] = useState(true);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Zero-Asset premium browser synthesizer
  const playSignalSound = (type: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const cleanType = (type || '').toLowerCase();

      if (cleanType === 'ai') {
        // Dual sweeping soft radar ping
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.45);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
        
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 0.6);
      } else if (cleanType === 'visitor') {
        // Holographic liquid click
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (cleanType === 'lead') {
        // Dual cyber alarm telemetry beep
        const playBeep = (delay: number) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1100, ctx.currentTime + delay);
          
          osc.frequency.setValueAtTime(987.77, ctx.currentTime + delay);
          
          gainNode.gain.setValueAtTime(0.0, ctx.currentTime + delay);
          gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.16);
          
          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.16);
        };
        
        playBeep(0);
        playBeep(0.18);
      } else {
        // Default telemetry tick
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      console.error('AudioContext synth error', e);
    }
  };

  // Real-time socket sync connection
  useEffect(() => {
    if (user?.portfolioSlug) {
      const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
      socket.emit('portfolio:join', user.portfolioSlug);

      socket.on('notification:received', (notif: any) => {
        addNotification(notif);
        playSignalSound(notif.type);
      });

      return () => {
        socket.off('notification:received');
        socket.disconnect();
      };
    }
  }, [user?.portfolioSlug, addNotification]);

  // Initialize and check saved theme preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    const isLight = savedTheme === 'light';
    setIsDark(!isLight);
    applyTheme(!isLight);
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('admin_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('admin_theme', 'light');
    }
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    applyTheme(nextDark);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeNotifs = notifications || [];
  const unreadCount = activeNotifs.filter((n) => !n.read).length;
  const hasHighPriorityUnread = activeNotifs.some((n) => !n.read && n.priority === 'HIGH');

  // Parse custom metadata fields safely
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

  // Map category to styles, badges and icons
  const getCategoryDetails = (type: string, priority: string = 'MEDIUM') => {
    const cleanType = (type || 'system').toLowerCase();
    const cleanPriority = (priority || 'MEDIUM').toUpperCase();

    let icon = Cpu;
    let label = 'System Alert';
    let gradient = 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400';

    if (cleanType === 'lead') {
      icon = UserCheck;
      label = 'Collab Signal';
      if (cleanPriority === 'HIGH') {
        gradient = 'from-rose-500/20 to-red-500/20 border-rose-500/50 text-rose-400';
      } else if (cleanPriority === 'LOW') {
        gradient = 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400';
      } else {
        gradient = 'from-amber-500/15 to-orange-500/15 border-amber-500/40 text-amber-400';
      }
    } else if (cleanType === 'visitor') {
      icon = Eye;
      label = 'Visitor Telemetry';
      if (cleanPriority === 'HIGH') {
        gradient = 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/40 text-fuchsia-400';
      } else {
        gradient = 'from-purple-500/10 to-violet-500/10 border-purple-500/30 text-purple-400';
      }
    } else if (cleanType === 'ai') {
      icon = Sparkles;
      label = 'Neural Analysis';
      gradient = 'from-violet-500/20 to-indigo-500/20 border-violet-500/40 text-violet-400';
    } else if (cleanType === 'engagement') {
      icon = Award;
      label = 'Engagement Link';
      gradient = 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400';
    }

    return { icon, label, gradient };
  };

  const renderActionControls = () => {
    return (
      <div className="flex items-center gap-2.5 md:gap-3">
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-white rounded-xl text-[9px] font-mono font-bold tracking-wider cursor-pointer shadow-sm hover:bg-amber-500/20 transition-all select-none duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>INSTALL APP</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-mono font-bold tracking-wider select-none shrink-0 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <span>LIVE TRACKING ACTIVE</span>
        </div>

        {/* 1. Theme Switch direct one-click toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-9 h-9 rounded-xl bg-card border border-border hover:border-primary/45 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm shrink-0 font-semibold"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-500 hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-primary hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* 2. Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className={`w-9 h-9 rounded-xl bg-card border flex items-center justify-center transition-all cursor-pointer shadow-sm relative shrink-0 ${
              hasHighPriorityUnread
                ? 'border-rose-500/60 text-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/45'
            }`}
            title="Telemetry Inbox"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse ${
                hasHighPriorityUnread ? 'bg-rose-500' : 'bg-primary'
              }`} />
            )}
          </button>

          {showNotifMenu && (
            <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-[68px] md:top-full mt-0 md:mt-3 w-auto md:w-96 max-w-none md:max-w-sm bg-card/95 border border-border/80 rounded-xl shadow-xl z-50 p-4 backdrop-blur-md animate-fade-in max-h-[520px] overflow-hidden flex flex-col gap-3">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              
              <div className="flex justify-between items-center pb-2 border-b border-border/40 select-none shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Neural Telemetry Tray</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[8.5px] text-primary hover:text-primary-focus transition-all font-black uppercase tracking-widest cursor-pointer bg-primary/10 border border-primary/20 px-2 py-0.5 rounded"
                    >
                      Mark All Read
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <span className="text-[9px] bg-primary/10 text-primary border border-primary/25 px-1.5 py-0.5 rounded font-mono font-black animate-pulse">
                      {unreadCount} SIGNAL
                    </span>
                  )}
                </div>
              </div>

              {activeNotifs.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-8 select-none shrink-0">
                  Your system environment has no active telemetry signals.
                </p>
              ) : (
                <div className="flex-1 overflow-y-auto max-h-[360px] pr-0.5 space-y-2.5">
                  {activeNotifs.slice(0, 10).map((notif: any) => {
                    const meta = parseMetadata(notif.metadata);
                    const { icon: CategoryIcon, label: catLabel, gradient: cardStyles } = getCategoryDetails(
                      notif.type,
                      notif.priority
                    );

                    return (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl bg-background border leading-relaxed relative overflow-hidden transition-all duration-300 text-left ${
                          !notif.read ? 'border-l-[3px]' : 'border-l-[1px]'
                        } ${
                          !notif.read ? 'border-primary/40' : 'border-border/50 hover:border-primary/15'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`p-1 rounded-lg border text-[9px] ${cardStyles}`}>
                              <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest border px-1.5 py-0.2 rounded-full ${cardStyles}`}>
                              {catLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-muted-foreground/70 font-mono flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5" />
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {!notif.read && (
                                <button
                                  onClick={() => markNotificationRead(notif.id)}
                                  className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 cursor-pointer transition-all flex items-center justify-center"
                                  title="Mark as Read"
                                >
                                  <Check className="w-2.5 h-2.5" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 cursor-pointer transition-all flex items-center justify-center"
                                title="Delete"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <h4 className="text-[11.5px] font-black text-foreground uppercase tracking-tight mb-1 select-text">
                          {notif.title}
                        </h4>
                        
                        <p className="text-[10px] text-muted-foreground leading-relaxed select-text italic break-words">
                          {notif.message}
                        </p>

                        {/* Location footer badge */}
                        {meta.country && meta.country !== 'Unknown' && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[8.5px] text-muted-foreground/75 font-medium select-none">
                            <Globe className="w-2.5 h-2.5 shrink-0" />
                            <span>{meta.country}</span>
                            {meta.visitorIp && (
                              <span className="font-mono opacity-80 break-all">• IP: {meta.visitorIp}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View Neural Stream footer link */}
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('activity');
                  setShowNotifMenu(false);
                }}
                className="w-full mt-1.5 py-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-[0_0_8px_rgba(245,158,11,0.15)] select-none shrink-0"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Open Full Neural Stream</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* 3. Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-xl bg-card border border-border hover:border-primary/45 flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 font-semibold"
            title="Profile Menu"
          >
            <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs uppercase text-primary text-center select-none">
              {user ? user.name[0] : 'S'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-card/95 border border-border/80 rounded-xl shadow-xl z-50 py-2 backdrop-blur-md animate-fade-in text-left">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              
              {/* Header info */}
              <div className="px-4 py-2 border-b border-border/40 select-none">
                <div className="text-[10px] font-black tracking-widest text-foreground uppercase truncate">
                  {user ? user.name : 'Shashwat Dixit'}
                </div>
                <div className="text-[8.5px] text-muted-foreground/80 font-mono uppercase truncate mt-0.5">
                  {user?.profile?.headline || 'System Architect'}
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted hover:text-primary transition-all flex items-center gap-2.5 cursor-pointer font-semibold"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Profile Hub</span>
                </button>

                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted hover:text-primary transition-all flex items-center gap-2.5 cursor-pointer font-semibold"
                >
                  <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>System Settings</span>
                </button>
              </div>

              <div className="border-t border-border/40 my-1"></div>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-all flex items-center gap-2.5 cursor-pointer font-black uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400/80" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSwitcher = () => {
    return (
      <div className="flex flex-col items-center gap-1 select-none">
        <div className="flex items-center gap-1 bg-[#171717] dark:bg-neutral-900 border border-border/45 p-1 rounded-xl shadow-inner relative">
          {[
            { id: 'shashwat', short: 'SD', fullName: 'SHASHWAT DIXIT' },
            { id: 'khushaboo', short: 'KS', fullName: 'KHUSHABOO SAINI' },
            { id: 'mahi', short: 'MS', fullName: 'MAHI SINGH' },
          ].map((p) => {
            const isSelected = activePortfolio === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePortfolio(p.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-black tracking-widest transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border border-primary/60 text-primary scale-105 shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-active-pulse'
                    : 'bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {isSelected && (
                  <span className="relative flex h-1.5 w-1.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                )}
                <span>{p.short}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[7.5px] font-mono font-black uppercase tracking-[0.2em] text-muted-foreground/75 select-none">
          Currently Editing: <span className="text-foreground">{[
            { id: 'shashwat', fullName: 'SHASHWAT DIXIT' },
            { id: 'khushaboo', fullName: 'KHUSHABOO SAINI' },
            { id: 'mahi', fullName: 'MAHI SINGH' },
          ].find(p => p.id === activePortfolio)?.fullName}</span>
        </span>
      </div>
    );
  };

  return (
    <header className="fixed top-3 md:top-6 left-3 md:left-6 right-3 md:right-6 z-40 bg-card/70 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl px-4 md:px-6 h-[60px] md:h-auto py-0 md:py-3.5 flex justify-between items-center select-none">
      
      {/* LEFT SIDE: Hamburger & MSK Logo */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl hover:bg-muted/65 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer font-semibold"
          title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center pl-1">
          <img
            src="/logo.png"
            alt="MSK Logo"
            className="h-6 w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity duration-300"
            draggable={false}
          />
        </div>
      </div>

      {/* DYNAMIC PORTFOLIO SWITCHER (Desktop-Only Center) */}
      <div className="hidden md:block">
        {renderSwitcher()}
      </div>

      {/* RIGHT SIDE ACTION CONTROLS */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {renderActionControls()}
      </div>
    </header>
  );
}
