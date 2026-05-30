import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Calendar, MapPin, Sparkles, 
  ExternalLink, ArrowUpRight, Cpu, Layers, 
  Database, Award, CheckCircle, Terminal, HelpCircle,
  X, ShieldCheck, Zap
} from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { typography } from '../../styles/tokens';

interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  workMode: string; // Remote, Hybrid, On-site
  summary: string; // 2-3 lines of impact summary
  metrics: string[]; // metrics strip array (max 3)
  technologies: string[]; // tech pills (max 5)
  bannerImage: string; // 16:9 cinematic cover
  galleryImages?: string[]; // screenshots / previews
  featured?: boolean;
  visible?: boolean;
  accentColor: 'blue' | 'cyan' | 'green' | 'purple';
  offerLetterUrl?: string;
  caseStudyUrl?: string;
  order: number;
}

interface InternshipsTabProps {
  profile?: any;
}

const colorThemes = {
  blue: {
    glow: "rgba(59, 130, 246, 0.25)",
    glowColor: "rgba(59, 130, 246, 0.08)",
    border: "group-hover:border-blue-500/40",
    text: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    bullet: "bg-blue-400",
    shadow: "shadow-blue-500/25",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent"
  },
  cyan: {
    glow: "rgba(6, 182, 212, 0.25)",
    glowColor: "rgba(6, 182, 212, 0.08)",
    border: "group-hover:border-cyan-500/40",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    bullet: "bg-cyan-400",
    shadow: "shadow-cyan-500/25",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent"
  },
  green: {
    glow: "rgba(16, 185, 129, 0.25)",
    glowColor: "rgba(16, 185, 129, 0.08)",
    border: "group-hover:border-emerald-500/40",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    bullet: "bg-emerald-400",
    shadow: "shadow-emerald-500/25",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent"
  },
  purple: {
    glow: "rgba(139, 92, 246, 0.25)",
    glowColor: "rgba(139, 92, 246, 0.08)",
    border: "group-hover:border-purple-500/40",
    text: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    bullet: "bg-purple-400",
    shadow: "shadow-purple-500/25",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent"
  }
};

export default function InternshipsTab({ profile }: InternshipsTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<InternshipItem | null>(null);

  // Extract from profile with deep fallback
  const section = profile?.internshipsSection || {
    badge: "PROFESSIONAL JOURNEY",
    heading: "INTERNSHIPS & EXPERIENCE",
    description: "Hands-on experience building modern applications, collaborating with high-performance engineering teams, and solving real-world scale problems.",
    radarTitle: "Current Focus: Scalable Systems & AI Tooling",
    exploringTracks: ["Scalable Systems", "AI Tooling", "Product Engineering", "Real-Time Architectures"],
    totalDuration: "1.5 Years Total",
    verifiedCount: "3+ Verified",
    performanceBoost: "40% Performance Boost",
    internships: [
      {
        id: "google-frontend",
        company: "Google",
        role: "Frontend Systems Intern",
        duration: "May 2025 - July 2025",
        location: "Mountain View, CA",
        workMode: "Remote",
        summary: "Engineered next-generation interactive user interfaces and micro-frontend client ecosystems for experimental dashboard platforms.",
        metrics: ["40% Faster Rendering", "15+ Engineers", "Low Latency Systems"],
        technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "WebGL"],
        bannerImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
        ],
        featured: true,
        accentColor: "blue",
        visible: true,
        offerLetterUrl: "https://google.com",
        caseStudyUrl: "https://google.com",
        order: 1
      },
      {
        id: "startup-backend",
        company: "Tech-Scale AI",
        role: "Backend Architect Intern",
        duration: "November 2024 - March 2025",
        location: "Bangalore, India",
        workMode: "Hybrid",
        summary: "Designed and scaled high-throughput database connection adapters and event broker systems for real-time agent streams.",
        metrics: ["500k+ Event Streams", "99.9% Route Uptime", "Sub-15ms Syncs"],
        technologies: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis"],
        bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
        ],
        featured: false,
        accentColor: "cyan",
        visible: true,
        offerLetterUrl: "",
        caseStudyUrl: "",
        order: 2
      },
      {
        id: "agency-fullstack",
        company: "PixelCraft Agency",
        role: "Full-Stack Engineer Intern",
        duration: "July 2024 - October 2024",
        location: "Delhi, India",
        workMode: "On-site",
        summary: "Coordinated client-facing dashboard portals, automated secure email dispatch gateways, and optimized static asset delivery systems.",
        metrics: ["8+ Client Portals", "95+ Lighthouse Score", "30% Fast Loading"],
        technologies: ["React", "Tailwind CSS", "MongoDB", "Express", "Vercel"],
        bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
        galleryImages: [],
        featured: false,
        accentColor: "green",
        visible: true,
        offerLetterUrl: "",
        caseStudyUrl: "",
        order: 3
      }
    ]
  };

  const internships: InternshipItem[] = (section.internships || [])
    .filter((i: any) => i.visible !== false)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const featuredExperience = internships.find(i => i.featured) || internships[0];
  const remainingExperiences = internships.filter(i => i.id !== featuredExperience?.id);

  const getIcon = (company: string, color: string) => {
    const name = company.toLowerCase();
    if (name.includes('google')) return <Terminal className={`w-5 h-5 ${color}`} />;
    if (name.includes('scale') || name.includes('ai')) return <Cpu className={`w-5 h-5 ${color}`} />;
    return <Layers className={`w-5 h-5 ${color}`} />;
  };

  return (
    <SectionWrapper delay={0.05} className="py-12 max-w-7xl mx-auto relative px-4">
      
      {/* SECTION 1: HERO EDITORIAL HEADER & EXPERIENCE RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Left Side: Header & Floating Metrics Strip */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-xs text-neutral-400">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[9px] uppercase tracking-widest font-black text-neutral-300">
              {section.badge || "PROFESSIONAL JOURNEY"}
            </span>
          </div>
          
          <h2 className={`${typography.heading} leading-tight tracking-tight text-white`}>
            {section.heading || "INTERNSHIPS & EXPERIENCE"}
          </h2>
          
          <p className={`${typography.body} text-[#A1A1AA] font-light leading-relaxed max-w-xl`}>
            {section.description || "Hands-on experience building modern applications, collaborating with high-performance engineering teams, and solving real-world scale problems."}
          </p>

          {/* Floating Experience Metrics Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <div className="px-4 py-3 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex flex-col justify-center min-w-[120px] backdrop-blur-md">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Total Duration</span>
              <span className="text-sm font-bold text-white mt-0.5">{section.totalDuration || "1.5 Years Total"}</span>
            </div>
            <div className="px-4 py-3 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex flex-col justify-center min-w-[120px] backdrop-blur-md">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Credibility</span>
              <span className="text-sm font-bold text-white mt-0.5">{section.verifiedCount || "3+ Verified"}</span>
            </div>
            <div className="px-4 py-3 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex flex-col justify-center min-w-[120px] backdrop-blur-md">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Core Impact</span>
              <span className="text-sm font-bold text-cyan-400 mt-0.5">{section.performanceBoost || "40% Performance Boost"}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Pulse Experience Radar */}
        <div className="lg:col-span-5 w-full">
          <div className="relative w-full h-[240px] rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden p-6 flex flex-col justify-between text-left">
            
            {/* Concentric radar rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-white/[0.02] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] border border-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] border border-white/[0.04] rounded-full pointer-events-none" />

            {/* Glowing sweep effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -ml-[150px] -mt-[150px] w-[300px] h-[300px] rounded-full origin-center pointer-events-none z-0"
              style={{
                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.15) 0deg, transparent 90deg, transparent 360deg)'
              }}
            />

            {/* Radar Sweeping Target Pulsing coordinates */}
            <div className="absolute top-[25%] left-[30%] z-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div className="absolute top-[65%] left-[75%] z-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">EXPERIENCE RADAR</span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                {section.radarTitle || "Currently Working With"}
              </h4>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2 pt-4">
              {(section.exploringTracks || ["Scalable Systems", "AI Tooling", "Product Engineering", "Real-Time Architectures"]).map((track: string, i: number) => {
                const colors = ['bg-blue-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-purple-400'];
                const dotColor = colors[i % colors.length];
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] text-neutral-300 backdrop-blur-md">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
                    <span className="font-medium">{track}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FEATURED HERO EXPERIENCE PANEL */}
      {featuredExperience && (
        <div className="mb-20 text-left">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase">FLAGSHIP EXPERIENCE</span>
            <div className="h-[1px] bg-gradient-to-r from-cyan-400/20 to-transparent flex-1" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => setSelectedInternship(featuredExperience)}
            className="group relative rounded-[32px] overflow-hidden p-0.5 w-full bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all duration-500 cursor-pointer shadow-2xl"
          >
            {/* Ambient Accent Color Glow */}
            <div 
              className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] -z-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 50%, ${colorThemes[featuredExperience.accentColor || 'cyan'].glow}, transparent 60%)`
              }}
            />

            <div className="relative z-10 bg-black/40 backdrop-blur-3xl rounded-[30px] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Side: Giant 16:9 Visual Preview */}
              <div className="lg:col-span-6 rounded-2xl overflow-hidden relative aspect-video w-full border border-white/5 shadow-lg group-hover:border-white/10 transition-colors duration-300">
                <img 
                  src={featuredExperience.bannerImage || "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop"} 
                  alt={featuredExperience.company}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Shiny sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Dark Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Visual authenticity verified stamp overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-white/10 rounded-xl text-[9px] font-mono text-neutral-300 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold tracking-wider">VERIFIED ROLE</span>
                </div>

                {/* Meta details inside image */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h4 className="text-xl font-black text-white font-heading leading-none uppercase tracking-wide">
                      {featuredExperience.company}
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-neutral-500" /> {featuredExperience.location} • {featuredExperience.workMode}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-300 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
                    {featuredExperience.duration}
                  </span>
                </div>
              </div>

              {/* Right Side: Role specs & key impact strip */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${colorThemes[featuredExperience.accentColor || 'cyan'].bg}`}>
                      {getIcon(featuredExperience.company, colorThemes[featuredExperience.accentColor || 'cyan'].text)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-white uppercase font-heading group-hover:text-cyan-400 transition-colors duration-300">
                        {featuredExperience.role}
                      </h3>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">At {featuredExperience.company}</p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-xl font-sans">
                    {featuredExperience.summary}
                  </p>

                  {/* Impact metrics pill strip */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredExperience.metrics.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono text-neutral-300">
                        <span className={`w-1 h-1 rounded-full ${colorThemes[featuredExperience.accentColor || 'cyan'].bullet}`} />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.04]">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {featuredExperience.technologies.slice(0, 5).map((tech) => (
                      <span 
                        key={tech}
                        className="text-[9px] font-mono text-neutral-400 bg-white/[0.02] border border-white/[0.05] px-2.5 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Case study CTA button */}
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-mono text-neutral-200 uppercase tracking-wider font-bold group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all duration-300 shrink-0 self-end sm:self-auto">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* SECTION 3: CAREER PROGRESSION JOURNEY STORIES */}
      {remainingExperiences.length > 0 && (
        <div className="text-left">
          <div className="mb-10 flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400 font-black tracking-widest uppercase">CAREER TIMELINE STORY</span>
            <div className="h-[1px] bg-gradient-to-r from-white/5 to-transparent flex-1" />
          </div>

          <div className="space-y-16 relative">
            {remainingExperiences.map((intern, index) => {
              const theme = colorThemes[intern.accentColor || 'cyan'];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={intern.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  onClick={() => setSelectedInternship(intern)}
                  className="group relative rounded-3xl overflow-hidden p-0.5 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500 cursor-pointer shadow-lg"
                >
                  {/* Subtle Accent Glow */}
                  <div 
                    className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] -z-10 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at ${isEven ? '30%' : '70%'} 50%, ${theme.glow}, transparent 55%)`
                    }}
                  />

                  <div className="relative z-10 bg-black/40 backdrop-blur-3xl rounded-[22px] p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Visual Banner */}
                    <div className={`lg:col-span-5 rounded-xl overflow-hidden aspect-video relative border border-white/5 ${!isEven ? 'lg:order-last' : ''}`}>
                      <img 
                        src={intern.bannerImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"} 
                        alt={intern.company}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      
                      {/* Meta overlay inside banner */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider block font-heading">
                            {intern.company}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-mono mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> {intern.location}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-neutral-300 bg-black/55 px-2 py-0.5 rounded-full uppercase border border-white/5">
                          {intern.duration}
                        </span>
                      </div>
                    </div>

                    {/* Description Content */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${theme.bg}`}>
                            {getIcon(intern.company, theme.text)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold tracking-tight text-white uppercase font-heading group-hover:text-white transition-colors duration-300">
                              {intern.role}
                            </h3>
                            <p className="text-[10px] text-neutral-500 font-mono leading-none mt-0.5">At {intern.company} • {intern.workMode}</p>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-300 font-light leading-relaxed font-sans">
                          {intern.summary}
                        </p>

                        {/* Impact Metrics strip */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {intern.metrics.map((m, idx) => (
                            <span key={idx} className="text-[9px] font-mono text-neutral-400 bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded-full">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/[0.04]">
                        {/* Stack pills */}
                        <div className="flex flex-wrap gap-1">
                          {intern.technologies.slice(0, 4).map((tech) => (
                            <span 
                              key={tech}
                              className="text-[8px] font-mono text-neutral-500 bg-white/[0.01] border border-white/[0.05] px-2 py-0.5 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <button className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-mono text-neutral-300 uppercase tracking-wider font-medium group-hover:bg-white/[0.05] transition-all duration-300 shrink-0">
                          <span>Case Study</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: DYNAMIC DOCUMENTARY CASE STUDY MODAL LIGHTBOX */}
      <AnimatePresence>
        {selectedInternship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#070708]/85 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedInternship(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0d0d11] border border-white/10 rounded-[32px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 flex flex-col space-y-6 text-left shadow-2xl custom-scrollbar"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedInternship(null)}
                className="absolute top-4 right-4 z-30 p-2 bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-full text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Verified Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 backdrop-blur-md shadow-lg font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="uppercase tracking-widest font-black text-[9px]">VERIFIED CREDENTIAL</span>
              </div>

              {/* Large 16:9 Banner Image */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden relative border border-white/5">
                <img 
                  src={selectedInternship.bannerImage} 
                  alt={selectedInternship.company}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Meta details bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black">
                      {selectedInternship.company}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white font-heading uppercase leading-tight mt-0.5">
                      {selectedInternship.role}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-neutral-300 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      {selectedInternship.duration}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm font-bold">
                      {selectedInternship.workMode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company & Role specifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{selectedInternship.location}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{selectedInternship.duration}</span>
                </div>

                <div className="p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-heading">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed font-sans">
                    {selectedInternship.summary}
                  </p>
                </div>
              </div>

              {/* Technical Contributions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Technical Solutions & Impact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedInternship.metrics.map((m: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-xs text-neutral-300 font-light leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Applied */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Engineered Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.technologies.map((tech: string) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Gallery Screens */}
              {selectedInternship.galleryImages && selectedInternship.galleryImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                    Work Screenshots & Artifacts
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInternship.galleryImages.map((img: string, idx: number) => (
                      <div key={idx} className="rounded-xl overflow-hidden aspect-video border border-white/5 relative group/gal cursor-zoom-in">
                        <img 
                          src={img} 
                          alt={`Gallery ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/gal:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Action attachments */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.04]">
                {selectedInternship.offerLetterUrl && (
                  <a
                    href={selectedInternship.offerLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300"
                  >
                    <span>View Credentials</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedInternship.caseStudyUrl && (
                  <a
                    href={selectedInternship.caseStudyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.02] border border-white/5 text-neutral-300 hover:bg-white/5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300"
                  >
                    <span>View Case Study</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </SectionWrapper>
  );
}
