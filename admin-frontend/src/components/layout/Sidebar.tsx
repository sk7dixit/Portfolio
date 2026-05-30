import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Award,
  Briefcase,
  MessageSquare,
  Users,
  Sparkles,
  Database,
  Milestone
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sidebarExpanded: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, sidebarExpanded }: SidebarProps) {
  const { activePortfolio, setActivePortfolio } = usePortfolio();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(activePortfolio === 'mahi'
      ? [{ id: 'brand-identity-ms', label: 'Brand Identity', icon: Database }]
      : [{ id: 'developer-info', label: (activePortfolio === 'shashwat' || activePortfolio === 'khushaboo') ? 'Developer Info' : 'Brand Identity', icon: Database }]
    ),
    { id: 'experience', label: activePortfolio === 'mahi' ? 'Global Experience' : 'Experience Studio', icon: Sparkles },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    ...(activePortfolio === 'mahi' ? [{ id: 'achievements', label: 'Achievements', icon: Award }] : []),
    ...(activePortfolio === 'mahi' ? [{ id: 'journey', label: 'Journey', icon: Milestone }] : []),
    ...(activePortfolio === 'khushaboo' ? [{ id: 'certificates-ks', label: 'Certificates Studio', icon: Award }] : []),
    ...(activePortfolio !== 'khushaboo' ? [{ id: 'certificates', label: 'Certificates', icon: Award }] : []),
    { id: 'internships', label: 'Internships', icon: Briefcase },
    ...(activePortfolio === 'khushaboo' ? [{ id: 'communication-ks', label: 'Communication Studio', icon: MessageSquare }] : activePortfolio === 'shashwat' ? [{ id: 'communication-sd', label: 'Communication Studio', icon: MessageSquare }] : activePortfolio === 'mahi' ? [{ id: 'messages', label: 'Messages CMS', icon: MessageSquare }] : [{ id: 'messages', label: 'Messages', icon: MessageSquare }]),
    { id: 'visitors', label: 'Visitors', icon: Users },
  ];

  return (
    <aside
      className={`fixed top-[80px] md:top-[116px] left-3 md:left-[24px] bottom-3 md:bottom-[24px] z-30 bg-card/70 backdrop-blur-xl border border-border/40 rounded-[28px] shadow-2xl flex flex-col justify-between py-5 px-2.5 transition-all duration-300 ease-in-out select-none ${
        sidebarExpanded
          ? 'w-[260px] max-w-[75vw] translate-x-0 md:w-[220px]'
          : '-translate-x-[calc(100%+48px)] md:translate-x-0 w-[260px] max-w-[75vw] md:w-[64px]'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Switcher Option Card at top of Sidebar Drawer on mobile */}
        {sidebarExpanded && (
          <div className="md:hidden mb-4 p-3 bg-muted/40 border border-border/50 rounded-2xl flex flex-col gap-2 mx-1 shadow-sm">
            <span className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-muted-foreground">
              Editing Workspace
            </span>
            <div className="flex items-center gap-1 bg-card/85 p-1 rounded-xl border border-border/40 shadow-inner justify-between">
              {[
                { id: 'shashwat', short: 'SD' },
                { id: 'khushaboo', short: 'KS' },
                { id: 'mahi', short: 'MS' },
              ].map((p) => {
                const isSelected = activePortfolio === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePortfolio(p.id)}
                    className={`flex-1 relative py-1.5 rounded-lg text-[9px] font-mono font-black tracking-widest transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border border-primary/50 text-primary'
                        : 'bg-transparent border border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isSelected && (
                      <span className="relative flex h-1 w-1 shrink-0">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-1 w-1 bg-primary"></span>
                      </span>
                    )}
                    <span>{p.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav
          className="space-y-1 flex-1 overflow-y-auto no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navigation.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                title={!sidebarExpanded ? tab.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                } ${
                  sidebarExpanded
                    ? 'px-3 py-2 md:px-4 md:py-2.5 justify-start gap-3'
                    : 'p-2 md:p-3 justify-center'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {sidebarExpanded && (
                  <span className="animate-fade-in truncate">{tab.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
