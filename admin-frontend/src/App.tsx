import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Login from './pages/auth/Login';
import Overview from './pages/dashboard/Overview';
import ProfileEdit from './pages/profiles/ProfileEdit';
import ProfileHub from './pages/profiles/ProfileHub';
import SettingsHub from './pages/settings/SettingsHub';
import CommandSearch from './components/layout/CommandSearch';
import ProjectCRUD from './pages/projects/ProjectCRUD';
import SkillsModuleAdmin from './pages/skills/SkillsModuleAdmin';
import CertificateCRUD from './pages/certificates/CertificateCRUD';
import InternshipCRUD from './pages/internships/InternshipCRUD';
import ExperienceStudioKS from './pages/experience-ks/ExperienceStudioKS';
import KSCertificatesStudio from './pages/certificates-ks/KSCertificatesStudio';
import KSCommunicationStudio from './pages/communication-ks/KSCommunicationStudio';
import SDCommunicationStudio from './pages/communication-sd/SDCommunicationStudio';
import MSBrandIdentityStudio from './pages/brand-identity-ms/MSBrandIdentityStudio';
import MessageInbox from './pages/messages/MessageInbox';
import VisitorLogs from './pages/visitors/VisitorLogs';
import ExperienceStudio from './pages/experience/ExperienceStudio';
import ActivityStream from './pages/activity/ActivityStream';
import AchievementsCRUD from './pages/achievements/AchievementsCRUD';
import JourneyCRUD from './pages/journey/JourneyCRUD';
import ContactCRUD from './pages/contact/ContactCRUD';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { usePortfolio } from './context/PortfolioContext';

export default function App() {
  const { activePortfolio } = usePortfolio();
  const token = useStore((state) => state.token);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const errorMsg = useStore((state) => state.error);
  const successMsg = useStore((state) => state.success);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'skills' | 'projects' | 'certificates' | 'certificates-ks' | 'internships' | 'messages' | 'communication-ks' | 'communication-sd' | 'brand-identity-ms' | 'visitors' | 'experience' | 'activity' | 'developer-info' | 'settings' | 'achievements' | 'journey'>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showCommandSearch, setShowCommandSearch] = useState(false);

  // Trigger sync on boot or when authenticated token shifts
  useEffect(() => {
    if (token) {
      fetchEverything();
    }
  }, [token, fetchEverything]);

  // Auto-redirect between standard, KS, and SD studios when portfolio shifts
  useEffect(() => {
    if (activePortfolio === 'khushaboo') {
      if (activeTab === 'certificates') {
        setActiveTab('certificates-ks');
      } else if (activeTab === 'messages' || activeTab === 'communication-sd') {
        setActiveTab('communication-ks');
      } else if (activeTab === 'brand-identity-ms') {
        setActiveTab('developer-info');
      }
    } else if (activePortfolio === 'shashwat') {
      if (activeTab === 'certificates-ks') {
        setActiveTab('certificates');
      } else if (activeTab === 'messages' || activeTab === 'communication-ks') {
        setActiveTab('communication-sd');
      } else if (activeTab === 'brand-identity-ms') {
        setActiveTab('developer-info');
      }
    } else if (activePortfolio === 'mahi') {
      if (activeTab === 'certificates-ks') {
        setActiveTab('certificates');
      } else if (activeTab === 'developer-info') {
        setActiveTab('brand-identity-ms');
      }
    } else {
      if (activeTab === 'certificates-ks') {
        setActiveTab('certificates');
      } else if (activeTab === 'communication-ks' || activeTab === 'communication-sd') {
        setActiveTab('messages');
      } else if (activeTab === 'brand-identity-ms') {
        setActiveTab('developer-info');
      }
    }
  }, [activePortfolio, activeTab]);

  // Keyboard shortcut listener for Global Spotlight Command search (CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandSearch((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If token is absent, lock route and present authentication panel
  const user = useStore((state) => state.user);

  if (!token) {
    return <Login />;
  }

  // If token is present but user profile is not fetched yet, show verifying splash
  if (token && !user) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Choose the active operational panel view
  const renderPanel = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview setActiveTab={setActiveTab} activePortfolio={activePortfolio} />;
      case 'experience':
        return <ExperienceStudio />;
      case 'profile':
        return <ProfileHub />;
      case 'developer-info':
        return <ProfileEdit />;
      case 'brand-identity-ms':
        return <MSBrandIdentityStudio />;
      case 'settings':
        return <SettingsHub />;
      case 'skills':
        return <SkillsModuleAdmin />;
      case 'projects':
        return <ProjectCRUD />;
      case 'achievements':
        return <AchievementsCRUD />;
      case 'journey':
        return <JourneyCRUD />;
      case 'certificates':
        return activePortfolio === 'khushaboo' ? <Overview /> : <CertificateCRUD />;
      case 'certificates-ks':
        return <KSCertificatesStudio />;
      case 'internships':
        return activePortfolio === 'khushaboo' ? <ExperienceStudioKS /> : <InternshipCRUD />;
      case 'messages':
        return activePortfolio === 'mahi' 
          ? <ContactCRUD /> 
          : ((activePortfolio === 'khushaboo' || activePortfolio === 'shashwat') ? <Overview /> : <MessageInbox />);
      case 'communication-ks':
        return <KSCommunicationStudio />;
      case 'communication-sd':
        return <SDCommunicationStudio />;
      case 'visitors':
        return <VisitorLogs />;
      case 'activity':
        return <ActivityStream />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden relative">
      {/* 1. Global Floating Header (Translucent Layer) */}
      <Topbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />

      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarExpanded && (
        <div
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 z-25 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden cursor-pointer"
        />
      )}

      {/* 2. Floating Collapsible Sidebar (Left Navigation) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarExpanded={sidebarExpanded}
      />

      {/* 3. Main Operational Panel Workspace */}
      <main
        className={`flex-1 overflow-y-auto relative h-screen transition-all duration-300 ease-in-out pt-[68px] md:pt-[116px] pr-[24px] pb-[24px] ${
          sidebarExpanded
            ? 'pl-[24px] md:pl-[268px]'
            : 'pl-[24px] md:pl-[112px]'
        }`}
      >
        {/* Glowing Ambient Mesh Backdrop */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Global Floating Notifications Panel */}
        <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
          {errorMsg && (
            <div className="p-4 bg-destructive/10 backdrop-blur border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-xs shadow-lg animate-slide-up select-text">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-primary/10 backdrop-blur border border-primary/20 rounded-xl flex items-center gap-3 text-primary text-xs shadow-lg animate-slide-up select-text">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Workspace Page View */}
        <div className="max-w-[420px] md:max-w-[1400px] mx-auto w-full mt-4 select-text px-4 md:px-0">
          {renderPanel()}
        </div>
      </main>

      {/* 4. Global Spotlight Command Search modal (CTRL+K) */}
      <CommandSearch
        isOpen={showCommandSearch}
        onClose={() => setShowCommandSearch(false)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
