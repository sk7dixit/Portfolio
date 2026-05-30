import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';


import Navbar from './components/layout/Navbar';
import CommandPalette from './components/layout/CommandPalette';
import HomeTab from './components/tabs/HomeTab';
import ProjectsTab from './components/tabs/ProjectsTab';
import AboutTab from './components/tabs/AboutTab';
import ContactTab from './components/tabs/ContactTab';
import SkillsTab from './components/tabs/SkillsTab';
import CertificatesTab from './components/tabs/CertificatesTab';
import InternshipsTab from './components/tabs/InternshipsTab';
import { CoreSpinLoader } from './components/ui/core-spin-loader';
import { BackgroundSystem } from './components/ui/BackgroundSystem';


const API_BASE = 'http://localhost:5000/api';

const LOCAL_FALLBACK_DATA = {
  user: {
    name: "Shashwat Dixit",
    email: "shashwat.dixit@example.com",
  },
  profile: {
    title: "AI-focused Product Builder & System Engineer",
    bio: "I focus on creating AI-integrated applications, automation systems, and scalable digital platforms that improve workflows and user experiences.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resume: "#"
  },
  theme: {
    accentColor: "#8B5CF6",
  },
  projects: [
    {
      id: "swarm-gateway-v4",
      title: "AI Agent Collaboration Gateway",
      description: "A high-performance API platform coordinating real-time tasks, fast message routing, and reliable state synchronization across distributed agents.",
      techStack: ["Node.js", "Express", "FastAPI", "Redis", "OpenAI SDK"],
      featured: true,
      githubUrl: "https://github.com/shashwat",
      liveUrl: "https://swarm.core.systems",
    },
    {
      id: "db-scale-engine",
      title: "PostgreSQL Database Performance Layer",
      description: "A secure connection pooling and caching optimizer designed to accelerate database queries and manage high-volume application data.",
      techStack: ["PostgreSQL", "Prisma", "TypeScript", "Redis"],
      featured: false,
      githubUrl: "https://github.com/shashwat",
      liveUrl: "https://postgres.core.systems",
    },
    {
      id: "stateless-upload-buffer",
      title: "Real-Time Media & File Streaming API",
      description: "An elegant service that manages instant media uploads and secure streaming directly to CDN storage with zero server buffering.",
      techStack: ["Node.js", "Cloudinary", "Docker", "Express"],
      featured: false,
      githubUrl: "https://github.com/shashwat",
      liveUrl: "https://cdn.core.systems",
    }
  ],
  skills: [
    { id: "1", skillName: "AI Orchestration", skillLevel: 9, category: "Backend" },
    { id: "2", skillName: "Next.js & React", skillLevel: 9, category: "Frontend" },
    { id: "3", skillName: "Node.js & Express", skillLevel: 9, category: "Backend" },
    { id: "4", skillName: "PostgreSQL & Prisma", skillLevel: 8, category: "Database" },
    { id: "5", skillName: "Platform Engineering", skillLevel: 8, category: "Backend" },
    { id: "6", skillName: "Tailwind CSS", skillLevel: 9, category: "Frontend" }
  ]
};

export default function App() {
  const [slug, setSlug] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'skills' | 'certificates' | 'internships' | 'about' | 'contact'>('home');
  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const themePresets: Record<string, { primary: string; accent: string; glow: string }> = {
    'Purple Nebula': { primary: '#8B5CF6', accent: '#a78bfa', glow: 'rgba(139,92,246,0.35)' },
    'Cyber Emerald': { primary: '#10B981', accent: '#34d399', glow: 'rgba(16,185,129,0.35)' },
    'Deep Space': { primary: '#3B82F6', accent: '#60a5fa', glow: 'rgba(59,130,246,0.35)' },
    'Sunset AI': { primary: '#F59E0B', accent: '#fbbf24', glow: 'rgba(245,158,11,0.35)' },
    'Matrix Signal': { primary: '#00F5B4', accent: '#33ffc4', glow: 'rgba(0,245,180,0.35)' }
  };

  const activePreset = profile?.themeSection?.activePreset || 'Purple Nebula';
  const themeAccent = themePresets[activePreset] || themePresets['Purple Nebula'];

  const dockItems = [
    {
      name: "GitHub",
      href: profile?.github || "https://github.com",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: profile?.linkedin || "https://linkedin.com",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: user?.email ? `mailto:${user.email}` : "mailto:shashwat.dixit@example.com",
      icon: Mail,
    },
    {
      name: "Resume",
      href: profile?.resumeUrl || "#",
      icon: FileText,
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const proj = e.detail;
      if (proj && proj.title) {
        try {
          const current = JSON.parse(localStorage.getItem('sd_viewed_projects') || '[]');
          if (!current.includes(proj.title)) {
            current.push(proj.title);
            localStorage.setItem('sd_viewed_projects', JSON.stringify(current));
          }
        } catch (err) {}
      }
    };
    window.addEventListener('select-portfolio-project', handler);
    return () => window.removeEventListener('select-portfolio-project', handler);
  }, []);

  useEffect(() => {
    setMounted(true);
    const querySlug = new URLSearchParams(window.location.search).get('slug') || 'shashwat';
    setSlug(querySlug);
    loadPortfolioData(querySlug);

    // Establish Socket.IO synchronization connection
    const socket = io('http://localhost:5000');
    
    socket.emit('portfolio:join', querySlug);

    socket.on('skills:updated', (updatedSkillsSection) => {
      console.log('⚡ Real-time skills update received:', updatedSkillsSection);
      setProfile((prev: any) => prev ? { ...prev, skillsSection: updatedSkillsSection } : null);
    });

    socket.on('philosophy:updated', (updatedPhilosophyStrip) => {
      console.log('⚡ Real-time philosophy strip update received:', updatedPhilosophyStrip);
      setProfile((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          skillsSection: {
            ...(prev.skillsSection || {}),
            philosophyStrip: updatedPhilosophyStrip
          }
        };
      });
    });

    socket.on('profile:updated', (updatedProfile) => {
      console.log('⚡ Real-time profile update received:', updatedProfile);
      setProfile((prev: any) => prev ? { ...prev, ...updatedProfile } : null);
    });

    socket.on('projects:updated', (payload) => {
      console.log('⚡ Real-time projects update received:', payload);
      if (payload.projectsSection) {
        setProfile((prev: any) => prev ? { ...prev, projectsSection: payload.projectsSection } : null);
      }
      if (payload.projects) {
        setProjects(payload.projects);
      }
    });

    socket.on('certificates:updated', (payload) => {
      console.log('⚡ Real-time certificates update received:', payload);
      if (payload.certificatesSection) {
        setProfile((prev: any) => prev ? { ...prev, certificatesSection: payload.certificatesSection } : null);
      }
    });

    socket.on('internships:updated', (payload) => {
      console.log('⚡ Real-time internships update received:', payload);
      if (payload.internshipsSection) {
        setProfile((prev: any) => prev ? { ...prev, internshipsSection: payload.internshipsSection } : null);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadPortfolioData = async (targetSlug: string) => {
    try {
      setLoading(true);
      // Fetch with a 10-second timeout to support first cold database connection loading
      const res = await axios.get(`${API_BASE}/portfolio/slug/${targetSlug}`, { timeout: 10000 });
      const payload = res.data.data;
      
      setUser(payload.user);
      setProfile(payload.profile);
      setTheme(payload.theme);
      setProjects(payload.projects || []);
      setSkills(payload.skills || []);

      // Dynamic geolocated IP, country, and browser tracking instead of static/fake India defaults
      const getBrowserName = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Unknown';
      };

      const fireTelemetry = async () => {
        let country = 'Unknown';
        let visitorIp = '';
        try {
          const geoRes = await axios.get('https://ipapi.co/json/', { timeout: 2200 });
          if (geoRes.data) {
            country = geoRes.data.country_name || 'Unknown';
            visitorIp = geoRes.data.ip || '';
          }
        } catch (e) {
          console.warn('Dynamic GeoIP lookup failed. Relying on backend fallback geolocator.');
        }

        axios.post(`${API_BASE}/analytics/log`, {
          portfolioSlug: targetSlug,
          country,
          visitorIp,
          browser: getBrowserName(),
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        }).catch(err => console.log('Background telemetry logged'));
      };

      fireTelemetry();

    } catch (error) {
      console.warn('Network request exceeded 1.2 seconds or is offline. Falling back to high-performance local database instantly.', error);
      
      // Instant fail-safe load
      setUser(LOCAL_FALLBACK_DATA.user);
      setProfile(LOCAL_FALLBACK_DATA.profile);
      setTheme(LOCAL_FALLBACK_DATA.theme);
      setProjects(LOCAL_FALLBACK_DATA.projects);
      setSkills(LOCAL_FALLBACK_DATA.skills);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center select-none relative">
        {/* Glowing spotlights on loading */}
        <div className="absolute w-72 h-72 rounded-full spotlight-purple opacity-20 blur-3xl pointer-events-none" />
        <CoreSpinLoader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#070708] text-red-400 font-mono flex flex-col justify-center items-center gap-4 select-none">
        <p className="text-xs uppercase tracking-widest font-black">❌ Port Error: Portfolio Slug Not Registered</p>
        <span className="text-[9px] text-neutral-500">Slug path checked: "/slug/{slug}"</span>
        <a href="http://localhost:3000" className="px-4 py-2 border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 rounded-xl hover:bg-red-500/10 mt-2 font-bold transition-all uppercase tracking-wider">
          Setup profile in Admin Panel
        </a>
      </div>
    );
  }

  // Define dynamic tab views
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab user={user} profile={profile} setActiveTab={setActiveTab} />;
      case 'projects':
        return <ProjectsTab projects={projects} profile={profile} />;
      case 'skills':
        return <SkillsTab skills={skills} profile={profile} />;
      case 'certificates':
        return <CertificatesTab profile={profile} />;
      case 'internships':
        return <InternshipsTab profile={profile} />;
      case 'about':
        return <AboutTab user={user} profile={profile} skills={skills} />;
      case 'contact':
        return <ContactTab user={user} slug={slug} profile={profile} />;
      default:
        return <HomeTab user={user} profile={profile} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden pb-0 pt-[76px]">
      
      {/* Dynamic Background Spotlights & Grid lines */}
      {activeTab === 'projects' ? (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#020617]">
          {/* Orange Radial Glow Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(249,115,22,0.4), transparent)`,
            }}
          />
        </div>
      ) : activeTab === 'skills' ? (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#020617]">
          {/* Gold Radial Glow Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(251,191,36,0.4), transparent)`,
            }}
          />
        </div>
      ) : activeTab === 'certificates' ? (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#020617]">
          {/* Purple/Indigo Radial Glow Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.35), transparent)`,
            }}
          />
        </div>
      ) : activeTab === 'internships' ? (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#020617]">
          {/* Cyan/Teal Radial Glow Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(6,182,212,0.35), transparent)`,
            }}
          />
        </div>
      ) : activeTab === 'contact' ? (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#020617]">
          {/* Fuchsia/Violet Radial Glow Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(168,85,247,0.35), transparent)`,
            }}
          />
        </div>
      ) : (
        <>
          <BackgroundSystem />
          {/* Dynamic Theme Brand Glow Override */}
          <div
            className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-75"
            style={{
              backgroundImage: `radial-gradient(circle 600px at 50% 50%, ${themeAccent.glow}, transparent)`,
            }}
          />
        </>
      )}

      {/* Floating Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        profile={profile}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Command Palette Registry */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        projects={projects}
        onSelectProject={(proj) => {
          setActiveTab('projects');
          // Fire custom event so ProjectsTab can capture and display this specific project details immediately
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('select-portfolio-project', { detail: proj }));
          }, 50);
        }}
        profileLinks={{
          github: profile.github,
          linkedin: profile.linkedin,
          resumeUrl: profile.resumeUrl
        }}
      />

      {/* Main Workspace Frame */}
      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cinematic Signature Footer */}
      <footer className="w-full border-t border-white/10 mt-20 md:mt-[120px] pt-12 md:pt-[120px] pb-12 relative z-10 bg-black/35 backdrop-blur-md">
        {/* Soft glowing line beam at the top of the footer for deliberate visual closure */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center gap-10">
          
          {/* Top: Minimal Statement */}
          <div className="max-w-2xl text-center">
            <h3 className="text-xl md:text-2xl font-medium tracking-wide text-white leading-relaxed font-sans">
              {profile?.footerSection?.slogan || "Building scalable AI systems, backend platforms, and modern digital experiences."}
            </h3>
          </div>

          {/* Middle: Floating Premium Action Dock */}
          <div className="relative flex items-center justify-center py-2">
            <div className="flex items-center gap-4 px-6 py-3.5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-full shadow-2xl relative">
              {dockItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={idx}
                    href={item.href}
                    onClick={() => {
                      if (item.name === 'Resume') {
                        try {
                          localStorage.setItem('sd_resume_downloaded', 'true');
                        } catch (e) {}
                      } else if (item.name === 'GitHub' || item.name === 'LinkedIn') {
                        try {
                          const current = JSON.parse(localStorage.getItem('sd_viewed_projects') || '[]');
                          const label = `${item.name} Opened`;
                          if (!current.includes(label)) {
                            current.push(label);
                            localStorage.setItem('sd_viewed_projects', JSON.stringify(current));
                          }
                        } catch (e) {}
                      }
                    }}
                    target={item.name !== "Email" ? "_blank" : undefined}
                    rel={item.name !== "Email" ? "noopener noreferrer" : undefined}
                    className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-400/[0.02] transition-all duration-300 shadow-md hover:shadow-emerald-400/5 cursor-pointer z-10"
                    whileHover={{ 
                      scale: 1.15, 
                      y: -6,
                      transition: { type: "spring", stiffness: 400, damping: 10 } 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Ambient soft glow */}
                    <span className="absolute inset-0 rounded-2xl bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />

                    {/* Tooltip Label */}
                    <span className="absolute bottom-full mb-3.5 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#09090b]/95 border border-white/10 rounded-lg text-[9px] font-mono uppercase tracking-widest text-zinc-300 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-2xl z-20">
                      {item.name}
                    </span>

                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Bottom: Subtle Copyright */}
          <div className="text-center mt-2">
            <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
              {profile?.footerSection?.copyright || `© ${new Date().getFullYear()} ${user?.name?.toUpperCase() || 'SHASHWAT DIXIT'}`}
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
