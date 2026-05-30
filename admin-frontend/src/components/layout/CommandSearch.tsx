import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Search,
  Terminal,
  User,
  Sparkles,
  FolderKanban,
  MessageSquare,
  Shield,
  Activity,
  Settings,
  Cpu,
  LogOut,
  CornerDownLeft,
  SearchCode,
  Sliders,
  Folder,
  Layers
} from 'lucide-react';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: any) => void;
}

export default function CommandSearch({ isOpen, onClose, setActiveTab }: CommandSearchProps) {
  const projects = useStore((state) => state.projects) || [];
  const messages = useStore((state) => state.messages) || [];
  const logout = useStore((state) => state.logout);
  const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead);

  const { activePortfolio, setActivePortfolio } = usePortfolio();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Command items compiled dynamically
  const commands = useMemo(() => {
    const items: Array<{
      category: 'Workspace / Tenants' | 'System Navigation' | 'Quick Commands' | 'Developer Projects' | 'Inbound Leads';
      id: string;
      label: string;
      sub: string;
      icon: any;
      action: () => void;
    }> = [
      // Tenant switching
      {
        category: 'Workspace / Tenants',
        id: 'switch-sd',
        label: 'Switch to Shashwat Dixit Workspace',
        sub: 'Tenant Profile (SD) • Amber Glow Accent',
        icon: Cpu,
        action: () => { setActivePortfolio('shashwat'); onClose(); }
      },
      {
        category: 'Workspace / Tenants',
        id: 'switch-ms',
        label: 'Switch to Mahi Singh Workspace',
        sub: 'Tenant Profile (MS) • Cyan Glow Accent',
        icon: Cpu,
        action: () => { setActivePortfolio('mahi'); onClose(); }
      },
      {
        category: 'Workspace / Tenants',
        id: 'switch-ks',
        label: 'Switch to Khushboo Saini Workspace',
        sub: 'Tenant Profile (KS) • Fuchsia Glow Accent',
        icon: Cpu,
        action: () => { setActivePortfolio('khushaboo'); onClose(); }
      },
      // System navigation
      {
        category: 'System Navigation',
        id: 'nav-dashboard',
        label: 'Open Dashboard Hub',
        sub: 'Overview Telemetry & Visitor Stats',
        icon: Sliders,
        action: () => { setActiveTab('dashboard'); onClose(); }
      },
      {
        category: 'System Navigation',
        id: 'nav-profile',
        label: 'Open Profile Hub',
        sub: 'Identity Control Center & DevOps Health',
        icon: User,
        action: () => { setActiveTab('profile'); onClose(); }
      },
      {
        category: 'System Navigation',
        id: 'nav-dev-info',
        label: 'Open Developer Info',
        sub: 'Portfolio Content CMS Form Panel',
        icon: Layers,
        action: () => { setActiveTab('developer-info'); onClose(); }
      },
      {
        category: 'System Navigation',
        id: 'nav-experience',
        label: 'Open Experience Studio',
        sub: 'Frontend Orchestrator & Snapshot Engine',
        icon: Sparkles,
        action: () => { setActiveTab('experience'); onClose(); }
      },
      {
        category: 'System Navigation',
        id: 'nav-activity',
        label: 'Open Neural Activity Stream',
        sub: 'Full Chronological Cyber Signal Logs Feed',
        icon: Activity,
        action: () => { setActiveTab('activity'); onClose(); }
      },
      {
        category: 'System Navigation',
        id: 'nav-settings',
        label: 'Open System Settings',
        sub: 'Platform configurations, SMTP & storage bucket keys',
        icon: Settings,
        action: () => { setActiveTab('settings'); onClose(); }
      },
      // Quick Operations
      {
        category: 'Quick Commands',
        id: 'cmd-mark-all-read',
        label: 'Mark All Notifications Read',
        sub: 'Clear unread signal triggers in PostgreSQL',
        icon: Shield,
        action: () => { markAllNotificationsRead(); onClose(); }
      },
      {
        category: 'Quick Commands',
        id: 'cmd-logout',
        label: 'Logout Platform Console',
        sub: 'Revoke local JWT credential tokens',
        icon: LogOut,
        action: () => { logout(); onClose(); }
      }
    ];

    // Append developer projects dynamically
    projects.forEach((proj: any) => {
      items.push({
        category: 'Developer Projects',
        id: `proj-${proj.id}`,
        label: `View Project Node: "${proj.title}"`,
        sub: `Stack: ${proj.techStack ? proj.techStack.join(', ') : 'Tech'}`,
        icon: Folder,
        action: () => { setActiveTab('projects'); onClose(); }
      });
    });

    // Append recent messages/leads dynamically
    messages.slice(0, 5).forEach((msg: any) => {
      items.push({
        category: 'Inbound Leads',
        id: `lead-${msg.id}`,
        label: `Inspect Lead: "${msg.senderName}"`,
        sub: `Sub: "${msg.subject}" • Score: ${msg.leadScore}/100`,
        icon: MessageSquare,
        action: () => { setActiveTab('messages'); onClose(); }
      });
    });

    // Filter based on search query
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(lowerQuery) ||
        it.category.toLowerCase().includes(lowerQuery) ||
        it.sub.toLowerCase().includes(lowerQuery)
    );
  }, [query, projects, messages, setActivePortfolio, setActiveTab, onClose, markAllNotificationsRead, logout]);

  // Handle Keyboard Navigation inside lists
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (commands[selectedIndex]) {
          commands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, commands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Search Container Box */}
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-[#121212]/95 border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[480px] animate-scale-up"
      >
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* Input Header Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 bg-card/40">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search record..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground/60 font-medium"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono text-muted-foreground select-none shadow-sm">
            ESC
          </kbd>
        </div>

        {/* List of matched items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3 max-h-[360px] scrollbar-thin">
          {commands.length === 0 ? (
            <div className="text-center py-10">
              <SearchCode className="w-8 h-8 text-muted-foreground/45 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-mono">No matching records or commands found.</p>
            </div>
          ) : (
            // Group command list by category headers
            Object.entries(
              commands.reduce<Record<string, typeof commands>>((acc, item) => {
                acc[item.category] = acc[item.category] || [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="space-y-1">
                {/* Category Header Label */}
                <h3 className="px-2.5 text-[8.5px] font-black uppercase tracking-widest text-muted-foreground/80 py-1 select-none">
                  {category}
                </h3>
                
                {/* Category items list */}
                <div className="space-y-0.5">
                  {items.map((cmd) => {
                    // Match absolute command selected index globally
                    const globalIndex = commands.findIndex((c) => c.id === cmd.id);
                    const isSelected = selectedIndex === globalIndex;

                    const CmdIcon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border border-primary/20 text-primary'
                            : 'bg-transparent border border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3 select-text">
                          <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-primary/15 border-primary/20 text-primary' : 'bg-card border-border/50 text-muted-foreground'
                          }`}>
                            <CmdIcon className="w-3.5 h-3.5" />
                          </div>
                          
                          <div className="space-y-0.5 truncate">
                            <span className="text-xs font-semibold block truncate leading-tight">
                              {cmd.label}
                            </span>
                            <span className="text-[9.5px] text-muted-foreground block font-medium truncate">
                              {cmd.sub}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 font-mono text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase select-none">
                            <span>Execute</span>
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer command prompt hint */}
        <div className="px-4 py-2 border-t border-border/30 bg-card/25 flex justify-between items-center text-[9px] font-mono text-muted-foreground select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Enter to Select</span>
          </div>
          <span>Operating Command Prompt v1.0</span>
        </div>

      </div>
    </div>
  );
}
