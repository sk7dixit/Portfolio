import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Award, ExternalLink, ShieldCheck, 
  Cpu, ArrowUpRight, GraduationCap, 
  BookOpen, Star, Sparkles, Cloud,
  Layers, Lock, CheckCircle2, Activity,
  Globe, Calendar
} from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { MagneticButton } from '../ui/MagneticButton';
import { typography } from '../../styles/tokens';
import { TubesCursor } from '../ui/tube-cursor';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface CertificateEntity {
  id: string;
  issuer: string;
  title: string;
  description: string;
  issueDate: string;
  tags: string[];
  credentialUrl: string;
  certificateImage: string;
  featured?: boolean;
  accentColor?: string; // 'blue' | 'amber' | 'emerald' | 'cyan' | 'purple'
  visible?: boolean;
  order?: number;
}

interface CertificatesTabProps {
  profile: any;
}

// Issuer-based color styling configurations
const colorStyles: Record<string, {
  hex: string;
  text: string;
  bg: string;
  border: string;
  glow: string;
  dot: string;
  pulse: string;
}> = {
  blue: {
    hex: '#3B82F6',
    text: 'text-blue-400',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20 group-hover:border-blue-500/40',
    glow: 'rgba(59, 130, 246, 0.4)',
    dot: 'bg-blue-400',
    pulse: 'bg-blue-400 shadow-[0_0_12px_#3b82f6]',
  },
  amber: {
    hex: '#F59E0B',
    text: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20 group-hover:border-amber-500/40',
    glow: 'rgba(245, 158, 11, 0.4)',
    dot: 'bg-amber-400',
    pulse: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
  },
  emerald: {
    hex: '#10B981',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20 group-hover:border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.4)',
    dot: 'bg-emerald-400',
    pulse: 'bg-emerald-400 shadow-[0_0_12px_#10b981]',
  },
  cyan: {
    hex: '#06B6D4',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20 group-hover:border-cyan-500/40',
    glow: 'rgba(6, 182, 212, 0.4)',
    dot: 'bg-cyan-400',
    pulse: 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]',
  },
  purple: {
    hex: '#8B5CF6',
    text: 'text-purple-400',
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/20 group-hover:border-purple-500/40',
    glow: 'rgba(139, 92, 246, 0.4)',
    dot: 'bg-purple-400',
    pulse: 'bg-purple-400 shadow-[0_0_12px_#8b5cf6]',
  }
};

const getPlatformIcon = (issuer: string) => {
  const norm = issuer.toLowerCase();
  if (norm.includes('google')) return <Cpu className="w-4 h-4 text-blue-400" />;
  if (norm.includes('aws') || norm.includes('amazon')) return <Cloud className="w-4 h-4 text-amber-400" />;
  if (norm.includes('cisco')) return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
  if (norm.includes('microsoft')) return <Award className="w-4 h-4 text-cyan-400" />;
  return <BookOpen className="w-4 h-4 text-purple-400" />;
};

export default function CertificatesTab({ profile }: CertificatesTabProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateEntity | null>(null);
  const [isHoveredId, setIsHoveredId] = useState<string | null>(null);

  // Parsing CMS certificatesSection if present
  const certsSec = React.useMemo(() => {
    if (!profile?.certificatesSection) return null;
    return typeof profile.certificatesSection === 'string'
      ? JSON.parse(profile.certificatesSection)
      : profile.certificatesSection;
  }, [profile]);

  // Fallback defaults if database isn't populated yet
  const activeCertificates: CertificateEntity[] = React.useMemo(() => {
    if (certsSec?.certificates && certsSec.certificates.length > 0) {
      return certsSec.certificates
        .filter((c: any) => c.visible !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    return [
      {
        id: "cert-google-ai",
        issuer: "Google",
        title: "Google AI Essentials",
        description: "Mastered prompt engineering strategies, neural network mechanics, and safe AI implementation principles using modern LLMs.",
        issueDate: "April 2026",
        tags: ["AI", "Prompt Engineering", "LLMs"],
        credentialUrl: "https://coursera.org/verify/google-ai",
        certificateImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        featured: true,
        accentColor: "blue",
        visible: true,
        order: 1
      },
      {
        id: "cert-aws-cloud",
        issuer: "AWS",
        title: "AWS Certified Cloud Practitioner",
        description: "Comprehensive validation of AWS Cloud fundamentals, core services, security compliance standards, and global infrastructure layers.",
        issueDate: "January 2026",
        tags: ["AWS", "Cloud Computing", "IAM Security"],
        credentialUrl: "https://aws.amazon.com/verification",
        certificateImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop",
        featured: false,
        accentColor: "amber",
        visible: true,
        order: 2
      },
      {
        id: "cert-cisco-net",
        issuer: "Cisco",
        title: "Cisco Networking Foundations",
        description: "Hands-on expertise in TCP/IP addressing subnets, routing protocols, switches, virtual LAN network topologies, and network secure gateways.",
        issueDate: "November 2025",
        tags: ["Networking", "TCP/IP", "Gateways"],
        credentialUrl: "https://cisco.com",
        certificateImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop",
        featured: false,
        accentColor: "emerald",
        visible: true,
        order: 3
      },
      {
        id: "cert-ms-azure",
        issuer: "Microsoft",
        title: "Microsoft Azure Fundamentals",
        description: "Architectural mastery of Azure cloud compute pools, storage containers, virtual networking topologies, and core tenant security governance.",
        issueDate: "September 2025",
        tags: ["Azure", "Cloud Compute", "Governance"],
        credentialUrl: "https://microsoft.com",
        certificateImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        featured: false,
        accentColor: "cyan",
        visible: true,
        order: 4
      }
    ];
  }, [certsSec]);

  // Extract featured vs normal grid items
  const featuredCertificate = React.useMemo(() => {
    return activeCertificates.find(c => c.featured) || activeCertificates[0] || null;
  }, [activeCertificates]);

  const gridCertificates = React.useMemo(() => {
    if (!featuredCertificate) return activeCertificates;
    return activeCertificates.filter(c => c.id !== featuredCertificate.id);
  }, [activeCertificates, featuredCertificate]);

  // Dynamic values parsed from certsSec configuration
  const resolvedBadge = certsSec?.badge || "LEARNING JOURNEY";
  const resolvedHeading = certsSec?.heading || "CERTIFICATIONS & ACHIEVEMENTS";
  const resolvedDescription = certsSec?.description || "Continuous learning through certifications, workshops, and hands-on development experience.";
  const resolvedRadarTitle = certsSec?.radarTitle || "Currently Learning: AI/ML & Advanced Backend Systems";
  const resolvedRadarDesc = certsSec?.radarDescription || "Deepening skills in neural networks architectures, transformer modeling pipelines, and high-concurrency database horizontal scaling protocols.";
  const resolvedExploringTracks = certsSec?.exploringTracks || ["AI Systems", "Distributed Backend", "LLM Architecture", "DevOps Infrastructure"];
  
  const stats = {
    certs: certsSec?.certificationsCount || "12 Certifications",
    tracks: certsSec?.activeTracksCount || "4 Active Tracks",
    platforms: certsSec?.platformsCount || "3 Cloud Platforms",
    spec: certsSec?.specialization || "AI/ML Specialization"
  };

  return (
    <SectionWrapper delay={0.05} className="space-y-16 py-10 max-w-7xl mx-auto select-none">
      
      {/* ── BACKGROUND CANVAS EFFORT ────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[32px] overflow-hidden opacity-25 bg-transparent">
        <TubesCursor 
          hideText={true} 
          initialColors={["#3b82f6", "#f59e0b", "#06b6d4"]}
          lightColors={["#3b82f6", "#f59e0b", "#06b6d4", "#ffffff"]}
          lightIntensity={180}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =============================================================
           SECTION 1 LEFT: Cinematic Editorial Header & Dynamic Stats Strip
           ============================================================= */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-[9px] font-mono text-purple-300 font-black uppercase tracking-[0.2em]">
                {resolvedBadge}
              </span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase font-heading text-white leading-tight">
              {resolvedHeading}
            </h2>
            
            <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
              {resolvedDescription}
            </p>
          </div>

          {/* FUTURISTIC FLOATING STATS STRIP */}
          <div className="flex flex-wrap gap-2.5 p-2 bg-neutral-950/40 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
            {[
              { val: stats.certs, color: '#3b82f6' },
              { val: stats.tracks, color: '#8b5cf6' },
              { val: stats.platforms, color: '#f59e0b' },
              { val: stats.spec, color: '#06b6d4' }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 px-4 py-2 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-xl"
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
                <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wide">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* =============================================================
           SECTION 1 RIGHT: Pulse Glassmorphic Exploring Radar Panel
           ============================================================= */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-[32px] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
          
          <GlassCard hoverEffect={true} className="p-6 md:p-8 rounded-[32px] border-white/[0.04] bg-neutral-950/40 backdrop-blur-3xl text-left relative overflow-hidden flex flex-col justify-between h-full space-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-10 bg-purple-500 pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-mono font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20">
                  <Activity className="w-2.5 h-2.5 animate-pulse" />
                  <span>Learning Radar</span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400/80 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-black font-heading text-white leading-tight uppercase">
                {resolvedRadarTitle}
              </h3>
              
              <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans">
                {resolvedRadarDesc}
              </p>
            </div>

            {/* Radar Tracks Bullet List Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {resolvedExploringTracks.map((track: string, idx: number) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] flex items-center gap-2 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 group/track"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover/track:text-white transition-colors truncate">
                    {track}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* =============================================================
         SECTION 2: HIGHLIGHTED FEATURED FLAGSHIP CREDENTIAL HERO
         ============================================================= */}
      {featuredCertificate && (
        <div className="relative pt-6">
          <div className="absolute inset-0 bg-radial-glow opacity-10 pointer-events-none" />
          
          <div className="text-left space-y-4 mb-6">
            <span className="text-[9px] font-mono font-black uppercase text-amber-400 tracking-widest flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500 animate-pulse" />
              <span>Flagship Achievement</span>
            </span>
            <h3 className="text-xl md:text-2xl font-black font-heading uppercase text-white tracking-tight leading-none">
              Featured Hero Credential
            </h3>
          </div>

          {/* Large Horizontal Interactive Showcase card */}
          {(() => {
            const style = colorStyles[featuredCertificate.accentColor || 'purple'] || colorStyles.purple;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-[32px] overflow-hidden p-[1px] cursor-pointer"
                onClick={() => setSelectedCert(featuredCertificate)}
              >
                {/* Visual border neon halo overlay */}
                <div 
                  className="absolute inset-0 opacity-15 group-hover:opacity-35 transition-all duration-500 pointer-events-none -z-10 rounded-[32px] filter blur-sm"
                  style={{ backgroundColor: style.hex }}
                />

                <div className="relative z-10 bg-[#070709]/85 backdrop-blur-3xl rounded-[32px] border border-white/5 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                  
                  {/* Left: Certificate large immersive visual proof */}
                  <div className="w-full md:w-[45%] aspect-[16/11] rounded-2xl overflow-hidden relative border border-white/10 shrink-0 bg-neutral-950 shadow-inner group-hover:border-white/20 transition-all duration-500">
                    <img 
                      src={featuredCertificate.certificateImage} 
                      alt={featuredCertificate.title}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Hover Glow Scan line */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[8.5px] font-mono font-black uppercase text-white backdrop-blur-md tracking-wider">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>SECURE PREVIEW</span>
                    </div>
                  </div>

                  {/* Right: Flagship Specs Details */}
                  <div className="flex-grow space-y-6 text-left w-full">
                    <div className="space-y-3.5">
                      
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${style.bg} ${style.border}`}>
                          {getPlatformIcon(featuredCertificate.issuer)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-black">
                            {featuredCertificate.issuer}
                          </span>
                          <span className="text-[8.5px] font-mono font-bold uppercase mt-0.5" style={{ color: style.hex }}>
                            ACCUMULATED DATE // {featuredCertificate.issueDate}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-3xl font-black text-white font-heading leading-tight uppercase tracking-tight group-hover:text-amber-300 transition-colors duration-300">
                        {featuredCertificate.title}
                      </h3>

                      <p className="text-xs md:text-sm text-zinc-400 font-light font-sans leading-relaxed max-w-xl">
                        {featuredCertificate.description}
                      </p>

                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {featuredCertificate.tags.map((tag: string) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 text-[8.5px] font-mono font-bold border border-white/[0.06] bg-white/[0.01] rounded-full text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                      <span className="text-[8.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Registry Verified & Validated</span>
                      </span>

                      <a 
                        href={featuredCertificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-mono text-zinc-300 uppercase tracking-wider font-bold hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                      >
                        <span>View Credential</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* =============================================================
         SECTION 3: Dynamic Masonry / Grid of Visual Credentials Cards
         ============================================================= */}
      <div className="relative pt-6">
        <div className="text-left space-y-4 mb-6">
          <span className="text-[9px] font-mono font-black uppercase text-purple-400 tracking-widest">
            Credential Index
          </span>
          <h3 className="text-xl md:text-2xl font-black font-heading uppercase text-white tracking-tight leading-none">
            Verified Achievements Gallery
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {gridCertificates.map((cert) => {
            const style = colorStyles[cert.accentColor || 'purple'] || colorStyles.purple;
            const isHovered = isHoveredId === cert.id;

            return (
              <GlassCard
                key={cert.id}
                hoverEffect={true}
                spotlightGlow={true}
                spotlightColor={style.hex}
                className="rounded-3xl flex flex-col justify-between min-h-[360px] space-y-4 border border-white/[0.04] bg-[#070709]/75 backdrop-blur-md relative overflow-hidden group cursor-pointer"
                onMouseEnter={() => setIsHoveredId(cert.id)}
                onMouseLeave={() => setIsHoveredId(null)}
                onClick={() => setSelectedCert(cert)}
              >
                {/* ── TOP PREVIEW IMAGE CONTAINER ────────────────── */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-white/[0.05]">
                  <img 
                    src={cert.certificateImage} 
                    alt={cert.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  {/* Pulse active dot in image top left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                    <span className={`w-1.5 h-1.5 rounded-full ${style.pulse}`} />
                    <span className="text-[8px] font-mono font-black uppercase tracking-wider text-white">
                      Verified
                    </span>
                  </div>
                </div>

                {/* ── CARD BODY ───────────────────────── */}
                <div className="px-6 pb-6 flex-grow flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-black text-neutral-500 uppercase tracking-widest">
                        {cert.issuer}
                      </span>
                      <span className="text-[8.5px] font-mono text-zinc-400 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded uppercase">
                        {cert.issueDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white font-heading tracking-tight leading-snug group-hover:text-white transition-colors duration-300 uppercase line-clamp-2">
                      {cert.title}
                    </h4>

                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed font-sans line-clamp-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-3 border-t border-white/[0.03]">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {cert.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="text-[8px] font-mono font-bold text-neutral-500 bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View Credential CTA */}
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white/[0.01] border border-white/[0.05] rounded-xl text-[9px] font-mono text-zinc-300 uppercase tracking-wider font-black hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                    >
                      <span>View Credential</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* =============================================================
         SECTION 4: Cinematic Detailed Document Preview Lightbox Modal
         ============================================================= */}
      <AnimatePresence>
        {selectedCert && (() => {
          const style = colorStyles[selectedCert.accentColor || 'purple'] || colorStyles.purple;
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] overflow-y-auto p-4 bg-black/85 backdrop-blur-md flex justify-center items-start cursor-pointer"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="my-auto max-w-xl w-full bg-[#080c14]/95 border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col gap-6 cursor-default text-left shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Vercel active lighting trail */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

                {/* Decorative radial glows */}
                <div 
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-25 filter blur-3xl"
                  style={{ backgroundColor: style.hex }}
                />

                {/* Modal Title bar */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono tracking-widest text-[#00F5B4] font-black uppercase">
                      SECURED CREDENTIAL RECORD
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-white/45 tracking-widest uppercase">
                    AUTHORITY // TIMELOCK // 2026
                  </span>
                </div>

                {/* Image & Stamp Layer */}
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative border border-white/10 bg-neutral-950 shadow-inner flex items-center justify-center">
                  <img 
                    src={selectedCert.certificateImage} 
                    alt={selectedCert.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black pointer-events-none" />

                  {/* holographic certificate watermark layout */}
                  <div className="absolute inset-6 flex flex-col justify-between text-left">
                    
                    {/* Watermark logo & seal */}
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-xl bg-black/65 border border-white/10">
                        {getPlatformIcon(selectedCert.issuer)}
                      </div>
                      
                      {/* Glowing rotating verification stamp/seal */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center relative p-1.5 bg-black/45"
                      >
                        <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-pulse" />
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                    </div>

                    {/* Stamp texts */}
                    <div>
                      <h4 className="text-base font-extrabold text-white uppercase tracking-wider font-mono line-clamp-2">
                        {selectedCert.title}
                      </h4>
                      <span className="text-[8.5px] font-mono text-white/50 uppercase tracking-widest block mt-1">
                        Authorized Registry // {selectedCert.issueDate}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Details text block */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-white/40 border-b border-white/5 pb-4">
                    <div>
                      <span className="block text-neutral-600 font-extrabold text-[8px] tracking-wider uppercase">ISSUING AUTHORITY</span>
                      <span className="text-white mt-1 block font-bold">{selectedCert.issuer}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-600 font-extrabold text-[8px] tracking-wider uppercase">SYSTEM SECURITY KEY</span>
                      <span className="mt-1 block font-mono font-bold" style={{ color: style.hex }}>
                        SEC-{selectedCert.id.slice(0, 10).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider uppercase block">TECHNICAL IMPACT SUMMARY</span>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      This authorized security token certifies absolute mastery and successful evaluation of standard domain expertise, computational patterns, and low-latency architectural definitions mapped by {selectedCert.issuer}.
                    </p>
                  </div>
                </div>

                {/* Footer close button */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-mono tracking-widest rounded-2xl transition-all cursor-pointer uppercase"
                  >
                    DISMISS PREVIEW
                  </button>

                  <a 
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 text-center text-xs font-mono font-black tracking-widest rounded-2xl transition-all cursor-pointer uppercase"
                    style={{
                      backgroundColor: style.hex + '18',
                      border: `1px solid ${style.hex}40`,
                      color: style.hex
                    }}
                  >
                    VERIFY ONLINE
                  </a>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </SectionWrapper>
  );
}
