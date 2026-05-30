import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  ArrowLeft,
  Activity,
  Server,
  CheckCircle,
  Database,
  Zap,
  Globe,
  Sparkles,
  Workflow,
  Wrench,
  Boxes,
  Users,
  Clock,
  Cpu,
  Layout,
  ChevronRight,
  Radio,
  TrendingUp,
  Code2,
  GitBranch,
  Layers,
} from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { MagneticButton } from '../ui/MagneticButton';
import { projectsCaseStudies } from '../../data/projectsData';
import type { ProjectCaseStudy, SystemNode } from '../../data/projectsData';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface ProjectsTabProps {
  projects: any[];
  profile: any;
}

type FilterCategory = 'All' | 'Live' | 'In Development' | 'Prototype' | 'Experimental';

// ─────────────────────────────────────────────
//  EMOJI RATING CONFIG
// ─────────────────────────────────────────────
const emojiRatings: Record<string, { emojis: string[]; score: string; tag: string; color: string }> = {
  credvia:  { emojis: ['🔥','🚀','💎'], score: '4.9', tag: 'High Impact',      color: 'rgba(249,115,22,0.6)' },
  orinotes: { emojis: ['🧠','📈','⚡'], score: '4.8', tag: 'Smart System',     color: 'rgba(59,130,246,0.6)' },
  shoplens: { emojis: ['🤖','🛠','⚡'], score: '4.7', tag: 'AI-Powered',       color: 'rgba(139,92,246,0.6)' },
  trinovex: { emojis: ['💎','🚀','🧠'], score: '4.9', tag: 'Premium UX',       color: 'rgba(236,72,153,0.6)' },
};

// ─────────────────────────────────────────────
//  BUILD PROGRESS CONFIG
// ─────────────────────────────────────────────
const buildProgress: Record<string, { build: number; deploy: number; ai: number; label: string }> = {
  credvia:  { build: 100, deploy: 99, ai: 88, label: 'Production' },
  orinotes: { build: 100, deploy: 97, ai: 0,  label: 'Stable'     },
  shoplens: { build: 72,  deploy: 65, ai: 94, label: 'Prototype'  },
  trinovex: { build: 60,  deploy: 45, ai: 0,  label: 'Building'   },
};

// ─────────────────────────────────────────────
//  LIVE STATUS CONFIG
// ─────────────────────────────────────────────
const liveLabels: Record<string, { label: string; badge: string; color: string; pulse: string }> = {
  Live:           { label: 'LIVE',        badge: 'Users Active',      color: '#22c55e', pulse: 'bg-emerald-500' },
  'In Development':{ label: 'BUILDING',   badge: 'Shipping Soon',     color: '#a855f7', pulse: 'bg-purple-500' },
  Prototype:      { label: 'PROTOTYPE',   badge: 'In Testing',        color: '#f59e0b', pulse: 'bg-amber-500'  },
  Experimental:   { label: 'RESEARCH',    badge: 'Exploring Concepts', color: '#ef4444', pulse: 'bg-red-500'    },
};

// ─────────────────────────────────────────────
//  ANIMATED GRADIENT PROGRESS BAR
// ─────────────────────────────────────────────
function ProgressBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  TILT CARD WRAPPER
// ─────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5));
    y.set(((e.clientY - rect.top) / rect.height - 0.5));
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  NODE ICON RESOLVER (reused in detail view)
// ─────────────────────────────────────────────
function NodeIcon({ type }: { type: string }) {
  switch (type) {
    case 'client': return <Layout className="w-4 h-4 text-neutral-300" />;
    case 'api':    return <Workflow className="w-4 h-4 text-[#4D7CFE]" />;
    case 'db':     return <Database className="w-4 h-4 text-[#00F5B4]" />;
    case 'cdn':    return <Globe className="w-4 h-4 text-purple-400" />;
    case 'worker': return <Zap className="w-4 h-4 text-amber-400" />;
    default:       return <Cpu className="w-4 h-4 text-neutral-400" />;
  }
}
function nodeColors(type: string) {
  switch (type) {
    case 'client': return 'bg-neutral-900 border-white/10';
    case 'api':    return 'bg-[#4D7CFE]/10 border-[#4D7CFE]/30';
    case 'db':     return 'bg-[#00F5B4]/10 border-[#00F5B4]/30';
    case 'cdn':    return 'bg-purple-500/10 border-purple-500/30';
    case 'worker': return 'bg-amber-500/10 border-amber-500/30';
    default:       return 'bg-neutral-900 border-white/5';
  }
}
function getNodeCoords(index: number, total: number) {
  if (total === 3) {
    return [{ x: 160, y: 150 }, { x: 400, y: 150 }, { x: 640, y: 150 }][index];
  }
  return [{ x: 120, y: 150 }, { x: 360, y: 150 }, { x: 600, y: 85 }, { x: 600, y: 215 }][index] || { x: 400, y: 150 };
}

// ─────────────────────────────────────────────
//  PROJECT CARD
// ─────────────────────────────────────────────
function ProjectCard({
  proj,
  index,
  onClick,
}: {
  proj: ProjectCaseStudy;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [imgHovered, setImgHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const rating = emojiRatings[proj.id] || { emojis: ['🔥'], score: '4.5', tag: 'Project', color: 'rgba(255,255,255,0.4)' };
  const progress = buildProgress[proj.id] || { build: 80, deploy: 70, ai: 0, label: 'Active' };
  
  // Custom premium status badge mapper
  const getLiveBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return { label: 'LIVE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5', pulse: 'bg-emerald-400 shadow-[0_0_10px_#10b981]' };
      case 'In Development':
        return { label: 'IN DEVELOPMENT', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5', pulse: 'bg-purple-400 shadow-[0_0_10px_#a855f7]' };
      case 'Prototype':
        return { label: 'PROTOTYPE', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5', pulse: 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' };
      case 'Experimental':
      default:
        return { label: 'PROTOTYPE', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5', pulse: 'bg-rose-400 shadow-[0_0_10px_#f43f5e]' };
    }
  };

  const liveBadge = getLiveBadge(proj.status);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <TiltCard className="h-full">
        <motion.div
          onClick={onClick}
          onMouseMove={handleMouseMove}
          className="group relative cursor-pointer rounded-[32px] overflow-hidden border border-white/[0.06] bg-[#070709]/80 backdrop-blur-3xl transition-all duration-500 flex flex-col h-full select-none"
          whileHover={{ 
            y: -10,
            transition: { type: 'spring', stiffness: 280, damping: 22 }
          }}
          style={{ 
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.03)'
          }}
        >
          {/* Custom Glow Follow Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 rounded-[32px]"
            style={{
              background: `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, ${proj.accentColor.replace('0.4','0.15')}, transparent 65%)`,
            }}
          />

          {/* Glowing Outline Ring on Hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-[32px]"
            style={{ 
              boxShadow: `inset 0 0 0 1.5px ${rating.color.replace('0.6','0.35')}` 
            }}
          />

          {/* ── TOP PREVIEW IMAGE CONTAINER ────────────────── */}
          <div
            className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[30px] border-b border-white/[0.05]"
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
          >
            {/* Ambient Base Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${proj.accentColor.replace('0.4','0.28')} 0%, #070709 100%)`,
              }}
            />

            {/* High-res project thumbnail */}
            <motion.img
              src={proj.imageSrc}
              alt={proj.title}
              className="w-full h-full object-cover object-top"
              animate={{ scale: imgHovered ? 1.08 : 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'brightness(0.72) contrast(1.05)' }}
            />

            {/* Cinematic Gradient Masking */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Top Left Floating Status Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full ${liveBadge.pulse} animate-pulse`} />
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-white">
                {liveBadge.label}
              </span>
            </div>

            {/* Floating Action Button (Shows on Hover) */}
            <motion.div
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              whileHover={{ scale: 1.12, rotate: 45 }}
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* ── CARD BODY ───────────────────────── */}
          <div className="p-5 md:p-6 flex-1 flex flex-col justify-between relative z-10">
            
            {/* Title & Tagline Area */}
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-heading group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                  {proj.title}
                </h3>
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.02] group-hover:border-white/25 group-hover:bg-white/[0.08] transition-all duration-300"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <p className="text-[12.5px] text-zinc-400 leading-relaxed font-light line-clamp-2">
                {proj.tagline}
              </p>
            </div>

            {/* Emoji Rating right below description - hidden on mobile */}
            <div className="hidden md:flex mt-3.5 flex items-center gap-2">
              <span className="text-sm tracking-tight">{rating.emojis.join('')}</span>
              <span className="text-[11px] font-mono font-bold text-zinc-300">{rating.score}/5</span>
            </div>

            {/* Technical stack highlights */}
            <div className="flex flex-wrap gap-1.5 my-4">
              {proj.techStack.map(tech => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[8.5px] font-mono border border-white/[0.06] rounded-lg text-zinc-400 bg-white/[0.01] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Small Build progress loaders - hidden on mobile */}
            <div className="hidden md:block space-y-3 pb-5 border-b border-white/[0.05]">
              <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>Build Status</span>
                <span
                  className="font-black"
                  style={{ color: proj.accentColor.replace('0.4','1') }}
                >
                  {progress.label}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Build progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-zinc-500 w-14 shrink-0 uppercase tracking-wider">Build</span>
                  <div className="flex-1">
                    <ProgressBar value={progress.build} color={proj.accentColor.replace('0.4','1')} delay={0.1} />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 w-7 text-right shrink-0">{progress.build}%</span>
                </div>
                {/* UI progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-zinc-500 w-14 shrink-0 uppercase tracking-wider">UI</span>
                  <div className="flex-1">
                    <ProgressBar value={progress.deploy} color="#3b82f6" delay={0.2} />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 w-7 text-right shrink-0">{progress.deploy}%</span>
                </div>
                {/* Backend progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-zinc-500 w-14 shrink-0 uppercase tracking-wider">Backend</span>
                  <div className="flex-1">
                    <ProgressBar value={progress.ai > 0 ? progress.ai : 94} color={progress.ai > 0 ? "#a855f7" : "#00F5B4"} delay={0.3} />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 w-7 text-right shrink-0">{progress.ai > 0 ? progress.ai : 94}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Explicit Action Buttons */}
            <div className="pt-4 flex items-center justify-between gap-3">
              {proj.githubUrl && (
                <motion.a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-md"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </motion.a>
              )}
              {proj.liveUrl && (
                <motion.a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-300 shadow-md"
                  style={{
                    background: proj.accentColor.replace('0.4', '0.15'),
                    border: `1px solid ${proj.accentColor.replace('0.4', '0.35')}`,
                    color: proj.accentColor.replace('0.4', '1'),
                  }}
                  whileHover={{ 
                    y: -2,
                    boxShadow: `0 5px 15px -5px ${proj.accentColor.replace('0.4', '0.4')}`
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </motion.a>
              )}
            </div>

          </div>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  DETAIL VIEW (unchanged structure, visually upgraded)
// ─────────────────────────────────────────────
function DetailView({
  proj,
  onBack,
}: {
  proj: ProjectCaseStudy;
  onBack: () => void;
}) {
  const [hoveredNode, setHoveredNode] = useState<SystemNode | null>(null);
  const rating = emojiRatings[proj.id] || { emojis: ['🔥'], score: '4.5', tag: 'Project', color: 'rgba(255,255,255,0.4)' };
  const progress = buildProgress[proj.id] || { build: 80, deploy: 70, ai: 0, label: 'Active' };
  const liveStatus = liveLabels[proj.status] || liveLabels['Prototype'];

  const getNodePercent = (index: number, total: number) => {
    const c = getNodeCoords(index, total);
    return { left: `${(c.x / 800) * 100}%`, top: `${(c.y / 300) * 100}%` };
  };

  return (
    <SectionWrapper key="detail" delay={0.05} className="space-y-5 md:space-y-10 pt-20 pb-10 md:py-10 scroll-mt-28">
      {/* Back nav */}
      <div className="flex justify-between items-center gap-2 border-b border-white/5 pb-3">
        <MagneticButton>
          <GlowButton onClick={onBack} variant="secondary" className="px-4 py-2 rounded-full !min-h-0">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold">Back</span>
          </GlowButton>
        </MagneticButton>
        <div className="flex items-center gap-2 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-1" style={{ color: liveStatus.color }}>
            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: liveStatus.color }} />
            {liveStatus.label}
          </span>
          <span>|</span>
          <span>Details</span>
        </div>
      </div>

      {/* Cinematic hero */}
      <div
        className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 bg-neutral-950/20 p-6 md:p-12 lg:p-16 flex flex-col justify-end min-h-[360px] max-h-[70vh] md:max-h-none md:min-h-[520px]"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl -z-10"
          style={{ background: `radial-gradient(circle 500px at 50% 50%, ${proj.accentColor}, transparent)` }}
        />
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent z-10" />
          <img
            src={proj.imageSrc}
            alt={proj.title}
            className="w-full h-full object-cover object-top opacity-50 contrast-[1.08] brightness-[0.8]"
          />
        </div>
        <div className="space-y-4 md:space-y-6 max-w-4xl relative z-10 text-left">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span
              className="text-[8px] font-mono font-black px-2.5 py-1 rounded-full w-max uppercase tracking-widest"
              style={{
                color: liveStatus.color,
                background: `${liveStatus.color}18`,
                border: `1px solid ${liveStatus.color}30`,
              }}
            >
              {liveStatus.label}
            </span>
            <span className="text-[8px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
              {proj.year}
            </span>
            <span className="text-[8px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
              {proj.role}
            </span>
            {/* Emoji cluster */}
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              {rating.emojis.join('')}
            </span>
          </div>
          <div>
            <h2 
              style={{ fontSize: 'clamp(1.6rem, 7vw, 2.4rem)', lineHeight: 0.95, maxWidth: '100%' }}
              className="font-black text-white font-heading uppercase tracking-tighter break-words block md:hidden"
            >
              {(() => {
                const title = proj.title;
                if (title === "PostgreSQL Database Performance Layer") return "PostgreSQL Performance Layer";
                if (title === "AI Agent Collaboration Gateway") return "AI Agent Gateway";
                if (title === "Real-Time Media & File Streaming API") return "Media Streaming API";
                return title;
              })()}
            </h2>
            <h2 
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', lineHeight: 0.95 }}
              className="font-black text-white font-heading uppercase tracking-tighter max-w-full break-words hidden md:block"
            >
              {proj.title}
            </h2>
          </div>
          <p className="text-sm md:text-xl text-zinc-300 font-light max-w-3xl leading-relaxed">
            {proj.tagline}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-4 border-t border-white/5 w-full">
            {proj.metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className={`bg-white/[0.01] border border-white/5 p-2 rounded-xl text-left ${idx === 2 ? 'hidden md:block' : ''}`}
              >
                <span className="text-[7px] text-zinc-500 font-mono block uppercase mb-0.5 tracking-wider">Metric 0{idx + 1}</span>
                <span className="text-[10px] sm:text-xs font-black text-white uppercase font-heading line-clamp-1">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROJECT SNAPSHOT STRIP ────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full bg-white/[0.01] border border-white/5 rounded-[24px] p-5 text-left relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-[0.3em] block mb-4">
          PROJECT SNAPSHOT
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "UI Score", value: rating.score === "4.9" ? "98%" : "95%", desc: "Accessibility & Design", color: "#00F5B4" },
            { label: "Backend Speed", value: progress.deploy === 99 ? "97%" : "88%", desc: "Stateless Edge Latency", color: "#3B82F6" },
            { label: "Developer Rating", value: `${rating.score}/5`, desc: "Codebase & Review", color: "#FFA700" },
            { label: "Requests Tested", value: rating.score === "4.9" ? "100K+" : "10K+", desc: "Load Testing Load", color: "#8B5CF6" }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-3.5 text-left relative overflow-hidden group hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
            >
              {/* Custom ambient spot */}
              <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-[20px] opacity-10 pointer-events-none" style={{ background: item.color }} />
              
              <span className="text-[18px] md:text-2xl font-black text-white font-heading tracking-tight leading-none block">
                {item.value}
              </span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider block mt-2" style={{ color: item.color }}>
                {item.label}
              </span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-normal leading-normal block mt-1">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Story */}
          <GlassCard hoverEffect={false} className="p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /><span>Product Story</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">{proj.description}</p>
          </GlassCard>

          {/* Challenge + Solution */}
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5 md:gap-6">
            <GlassCard hoverEffect={false} spotlightGlow spotlightColor="rgba(239,68,68,0.05)" className="p-5 md:p-6 rounded-3xl border border-red-500/10">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-red-400 uppercase tracking-widest mb-3">
                <Activity className="w-4 h-4" /><span>Challenge</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">{proj.challenges}</p>
            </GlassCard>
            <GlassCard hoverEffect={false} spotlightGlow spotlightColor="rgba(52,211,153,0.05)" className="p-5 md:p-6 rounded-3xl border border-emerald-500/10">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-400 uppercase tracking-widest mb-3">
                <CheckCircle className="w-4 h-4" /><span>Solution</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">{proj.solution}</p>
            </GlassCard>
          </div>

          {/* Progress panel */}
          <GlassCard hoverEffect={false} className="p-5 md:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-zinc-300 uppercase tracking-widest">
                <TrendingUp className="w-4 h-4 text-emerald-400" /><span>Progress</span>
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md border"
                style={{
                  color: proj.accentColor.replace('0.4','0.9'),
                  borderColor: proj.accentColor.replace('0.4','0.3'),
                  background: proj.accentColor.replace('0.4','0.08'),
                }}>
                {progress.label}
              </span>
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'Build', value: progress.build, color: proj.accentColor.replace('0.4','0.9') },
                { label: 'UI', value: progress.deploy, color: '#3b82f6' },
                { label: 'Backend', value: progress.ai > 0 ? progress.ai : 94, color: progress.ai > 0 ? "#a855f7" : "#00F5B4" },
              ].map((item, i) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-zinc-500 uppercase tracking-wider">{item.label}</span>
                    <span style={{ color: item.color }} className="font-black">{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} delay={i * 0.1} />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Architecture Overview */}
          <GlassCard hoverEffect={false} spotlightGlow spotlightColor={proj.accentColor} className="p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-zinc-300 uppercase tracking-widest">
                <Server className="w-4 h-4 text-[#4D7CFE]" /><span>Architecture Overview</span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase hidden md:inline">Hover nodes</span>
              <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase inline md:hidden">Tap nodes</span>
            </div>

            {/* Desktop Diagram */}
            <div className="hidden md:flex relative w-full h-[280px] border border-white/5 bg-neutral-950/40 rounded-2xl overflow-hidden items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01),transparent_70%)] pointer-events-none" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none fill-none stroke-[1.5]">
                {proj.systemConnections.map((conn, idx) => {
                  const fi = proj.systemNodes.findIndex(n => n.id === conn.from);
                  const ti = proj.systemNodes.findIndex(n => n.id === conn.to);
                  if (fi === -1 || ti === -1) return null;
                  const fc = getNodeCoords(fi, proj.systemNodes.length);
                  const tc = getNodeCoords(ti, proj.systemNodes.length);
                  let d = `M ${fc.x} ${fc.y} L ${tc.x} ${tc.y}`;
                  if (proj.systemNodes.length === 4) {
                    if (fi === 1 && ti === 2) d = `M 360 150 Q 480 85, 600 85`;
                    if (fi === 1 && ti === 3) d = `M 360 150 Q 480 215, 600 215`;
                  }
                  return (
                    <g key={idx}>
                      <path d={d} stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                      <motion.path
                        d={d}
                        stroke={conn.dash ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)'}
                        strokeWidth="1.5"
                        strokeDasharray={conn.dash ? '6 6' : '8 6'}
                        animate={{ strokeDashoffset: conn.dash ? [0, -20] : [0, -28] }}
                        transition={{ ease: 'linear', duration: conn.dash ? 4 : 3, repeat: Infinity }}
                      />
                    </g>
                  );
                })}
              </svg>
              {proj.systemNodes.map((node, idx) => {
                const p = getNodePercent(idx, proj.systemNodes.length);
                const isH = hoveredNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
                    style={{ left: p.left, top: p.top }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg ${nodeColors(node.type)} ${isH ? 'ring-4 ring-white/10' : ''}`}
                      whileHover={{ scale: 1.15 }}
                    >
                      <NodeIcon type={node.type} />
                    </motion.div>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold whitespace-nowrap bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {node.label}
                    </span>
                  </div>
                );
              })}
              <AnimatePresence>
                {hoveredNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-4 left-4 right-4 bg-[#0A0A0C]/95 border border-white/10 rounded-xl p-3.5 backdrop-blur-md shadow-2xl z-30 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#00F5B4] font-black">
                        {hoveredNode.type.toUpperCase()} ONLINE
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase mt-1">{hoveredNode.label}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-light leading-relaxed">{hoveredNode.details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Vertical Diagram */}
            <div className="block md:hidden w-full space-y-3">
              {proj.systemNodes.map((node, idx) => {
                const isLast = idx === proj.systemNodes.length - 1;
                const isH = hoveredNode?.id === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <div 
                      onClick={() => setHoveredNode(hoveredNode?.id === node.id ? null : node)}
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        isH 
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.12)]' 
                          : 'border-white/5 bg-[#070709]/80'
                      } flex items-center justify-between cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${nodeColors(node.type)}`}>
                          <NodeIcon type={node.type} />
                        </div>
                        <div className="text-left">
                          <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider block leading-none">{node.type}</span>
                          <span className="text-xs font-bold text-white uppercase mt-1 block leading-none">{node.label}</span>
                          <span className="text-[9px] text-zinc-400 mt-1 block font-light leading-none">{node.details}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex justify-center py-0.5">
                        <motion.div
                          animate={{ y: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="text-neutral-600 text-[10px]"
                        >
                          │
                          <br />
                          ▼
                        </motion.div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              <AnimatePresence>
                {hoveredNode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="p-3 bg-neutral-900/95 border border-white/10 rounded-xl text-left shadow-xl"
                  >
                    <span className="font-mono text-[8px] text-[#00F5B4] font-black uppercase tracking-widest block mb-1">
                      {hoveredNode.label} DETAILS
                    </span>
                    <p className="text-[10px] text-zinc-400 leading-normal">{hoveredNode.details} — Executing live edge syncing and high-security handshakes.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Capabilities */}
          <GlassCard hoverEffect={false} className="p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-zinc-300 uppercase tracking-widest pb-2 border-b border-white/5">
              <Boxes className="w-4 h-4 text-purple-400" /><span>Core Capabilities</span>
            </div>
            <div className="space-y-3 pt-1">
              {proj.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] font-mono text-zinc-400">0{idx + 1}</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Tech stack */}
          <GlassCard hoverEffect={false} spotlightGlow spotlightColor={proj.accentColor} className="p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-zinc-300 uppercase tracking-widest pb-2 border-b border-white/5">
              <Wrench className="w-4 h-4 text-amber-400" /><span>Tech Stack</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {proj.techStack.map((tech, i) => (
                <motion.div
                  key={tech}
                  className="bg-white/[0.01] border border-white/5 px-4 py-3 min-h-[44px] rounded-xl flex items-center gap-2.5 group/tech hover:border-white/15 hover:bg-white/[0.03] transition-all duration-200"
                  whileHover={{ x: 2 }}
                >
                  <Code2 className="w-3.5 h-3.5 text-zinc-500 group-hover/tech:text-zinc-300 transition-colors" />
                  <span className="text-[10.5px] font-heading font-black text-white uppercase tracking-wide">{tech}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Team / Creator */}
          <GlassCard hoverEffect={false} className="p-4 rounded-2xl">
            {proj.team.length === 1 && proj.team[0] === 'Shashwat Dixit' ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 shrink-0">
                  SD
                </div>
                <div className="text-left">
                  <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider block leading-none">Created By</span>
                  <span className="text-xs font-bold text-white mt-1 block leading-none">Shashwat Dixit</span>
                  <span className="text-[9.5px] text-[#FFA700] font-bold block mt-1 leading-none">Full Stack Developer</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs font-heading font-bold text-zinc-300 uppercase tracking-widest pb-2 border-b border-white/5">
                  <Users className="w-4 h-4 text-emerald-400" /><span>Team Members</span>
                </div>
                <div className="space-y-2 pt-1">
                  {proj.team.map((member, i) => (
                    <div key={member} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                          style={{ background: `hsl(${i * 80 + 200}, 60%, 35%)` }}
                        >
                          {member.charAt(0)}
                        </div>
                        <span className="text-xs text-white font-medium">{member}</span>
                      </div>
                      <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded text-zinc-400 uppercase">
                        {member === 'Shashwat Dixit' ? 'Lead Author' : 'Collaborator'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 w-full">
            {proj.liveUrl && (
              <MagneticButton className="w-full !block">
                <GlowButton variant="primary" onClick={() => window.open(proj.liveUrl, '_blank')} className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl">
                  <ExternalLink className="w-4 h-4 text-neutral-950" />
                  <span className="text-xs font-black text-neutral-950 uppercase tracking-wider">Launch Application</span>
                </GlowButton>
              </MagneticButton>
            )}
            {proj.githubUrl && (
              <MagneticButton className="w-full !block">
                <GlowButton variant="secondary" onClick={() => window.open(proj.githubUrl, '_blank')} className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl">
                  <Github className="w-4 h-4" />
                  <span className="text-xs font-medium">Explore Codebase</span>
                </GlowButton>
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────
//  SECTION HEADER
// ─────────────────────────────────────────────
const ICON_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  Globe, Zap, Cpu, Server, Layers, Database, Radio, Workflow
};

function DynIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Comp = ICON_COMPONENT_MAP[name] || Globe;
  return <Comp className={className} style={style} />;
}

interface SectionHeaderProps {
  badge?: string;
  heading?: string;
  description?: string;
  statsCards: any[];
}

function SectionHeader({ badge, heading, description, statsCards }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const colorMap: Record<string, string> = {
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    amber: '#F59E0B',
    emerald: '#10B981',
    green: '#10B981',
    blue: '#3B82F6',
  };

  const resolvedBadge = badge || "FEATURED WORK · SELECTED PROJECTS";
  const resolvedHeading = heading || "Building Digital Products That Matter";
  const resolvedDescription = description || "A curated showcase of modern full-stack applications, built with clean code and a focus on exceptional user experiences.";

  const headingWords = resolvedHeading.split(' ');
  const splitIndex = Math.ceil(headingWords.length / 2);
  const firstHalf = headingWords.slice(0, splitIndex).join(' ');
  const secondHalf = headingWords.slice(splitIndex).join(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative space-y-8"
    >
      {/* Ambient glow behind header */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-25 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, rgba(77,124,254,0.2) 50%, transparent 80%)' }}
      />
 
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[9px] font-mono text-purple-300 font-black uppercase tracking-[0.2em]">
              {resolvedBadge}
            </span>
          </motion.div>
 
          {/* Headline */}
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl md:text-6xl font-black tracking-tight uppercase font-heading text-white leading-[0.9]"
            >
              {firstHalf}{' '}
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #00F5B4 0%, #4D7CFE 50%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {secondHalf}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-sm text-zinc-400 font-light max-w-xl leading-relaxed text-left"
            >
              {resolvedDescription}
            </motion.p>
          </div>
        </div>
 
        {/* Current Activity Status Pill */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-xl shrink-0"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-ping" />
          </div>
          <div className="text-left">
            <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Current Activity</div>
            <div className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <span>Available:</span>
              <span className="text-emerald-400 font-black">Open to Collaborate</span>
            </div>
          </div>
        </motion.div>
      </div>
  
      {/* Cinematic Metric Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-2"
      >
        {statsCards.map((card, i) => {
          const colorHex = colorMap[card.color] || '#8B5CF6';
          const isLast = i === statsCards.length - 1;
          return (
            <GlassCard
              key={card.id || card.label}
              hoverEffect={true}
              spotlightGlow={true}
              spotlightColor={colorHex}
              className={`p-4 md:p-5 rounded-[24px] border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 relative group overflow-hidden ${
                isLast ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              {/* Soft decorative background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-10 pointer-events-none" style={{ background: colorHex }} />
              
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{card.label}</span>
                <DynIcon name={card.icon} className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" style={{ color: colorHex }} />
              </div>
              
              <div className="mt-3 space-y-0.5 text-left">
                <div className="text-xl font-black font-heading text-white leading-tight">{card.value}</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorHex }} />
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">{card.trend || 'Performance Indicator'}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  FILTER TABS
// ─────────────────────────────────────────────
const filterCategories: FilterCategory[] = ['All', 'Live', 'In Development', 'Prototype', 'Experimental'];

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: FilterCategory;
  onChange: (f: FilterCategory) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2.5 p-1.5 bg-neutral-950/45 border border-white/5 rounded-full w-fit backdrop-blur-xl">
      {filterCategories.map(cat => {
        const isActive = active === cat;
        const count = counts[cat] || 0;
        
        // Match status colors for indicator points
        let bulletColor = '#4D7CFE';
        if (cat === 'Live') bulletColor = '#22c55e';
        if (cat === 'In Development') bulletColor = '#a855f7';
        if (cat === 'Prototype') bulletColor = '#f59e0b';
        if (cat === 'Experimental') bulletColor = '#ef4444';

        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-300 ${
              isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            
            {/* Status light bullet */}
            <span
              className="w-1.5 h-1.5 rounded-full relative z-10 transition-transform duration-300"
              style={{
                backgroundColor: bulletColor,
                boxShadow: isActive ? `0 0 10px ${bulletColor}` : 'none',
              }}
            />
            
            <span className="relative z-10">{cat}</span>
            
            {/* Glass badge count */}
            <span
              className={`relative z-10 text-[8px] px-2 py-0.5 rounded-md font-mono transition-all ${
                isActive ? 'bg-white/10 text-white font-bold border border-white/5' : 'bg-white/5 text-zinc-600'
              }`}
            >
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  CTA BANNER
// ─────────────────────────────────────────────
function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [tickerTime, setTickerTime] = useState('');

  useEffect(() => {
    setTickerTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[32px] overflow-hidden border border-white/[0.06] p-6 md:p-12 bg-neutral-950/40 backdrop-blur-xl"
    >
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00F5B4 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
      
      {/* Animated glowing border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4D7CFE]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        {/* Core CTA Content */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6 text-left">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-emerald-400">
              AVAILABLE FOR WORK
            </span>
          </div>

          <h3
            className="text-3xl md:text-5xl font-black uppercase tracking-tight font-heading leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ready to Build Your Next Product?
          </h3>

          <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
            I build modern full-stack applications with clean UI, scalable backend systems, 
            and smooth user experiences. Let's turn your idea into reality.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
            <MagneticButton className="w-full sm:w-auto">
              <GlowButton
                variant="primary"
                onClick={() => window.location.href = 'mailto:shashwat.dixit@example.com'}
                className="w-full px-8 py-4.5 rounded-2xl flex items-center justify-center gap-2.5 relative overflow-hidden group/btn"
              >
                <span className="text-xs font-black text-neutral-950 uppercase tracking-wider relative z-10">
                  Start a Conversation
                </span>
                <ArrowUpRight className="w-4 h-4 text-neutral-950 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </GlowButton>
            </MagneticButton>

            <MagneticButton className="w-full sm:w-auto">
              <GlowButton
                variant="secondary"
                onClick={() => window.open('https://github.com/shashwat', '_blank')}
                className="w-full px-8 py-4.5 rounded-2xl flex items-center justify-center gap-2.5 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
              >
                <Github className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  View GitHub
                </span>
              </GlowButton>
            </MagneticButton>
          </div>
        </div>

        {/* Dynamic Telemetry Panel */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-neutral-950/60 border border-white/[0.05] rounded-3xl p-6 space-y-5 backdrop-blur-md relative overflow-hidden">
            {/* Header / Network Status */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#4D7CFE]" />
                <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Current Status
                </span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black min-h-[12px]">
                {tickerTime}
              </span>
            </div>

            {/* Metrics List */}
            <div className="space-y-4 text-left">
              {[
                { label: 'Availability', value: 'Open for Collaboration', desc: 'Starting June 2026', badge: 'Active', badgeColor: '#22c55e' },
                { label: 'Location & Timezone', value: 'Remote / Hybrid', desc: 'Available worldwide', badge: 'Online', badgeColor: '#4D7CFE' },
                { label: 'Response Time', value: '< 24 Hours', desc: 'Direct communication', badge: 'Fast', badgeColor: '#8B5CF6' }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{item.label}</div>
                    <div className="text-sm sm:text-base text-white font-bold font-heading mt-1">{item.value}</div>
                    <div className="text-[9px] font-mono text-zinc-400 mt-0.5">{item.desc}</div>
                  </div>
                  <span
                    className="text-[7px] font-mono font-black uppercase px-2 py-0.5 rounded border tracking-wider"
                    style={{
                      borderColor: `${item.badgeColor}30`,
                      color: item.badgeColor,
                      backgroundColor: `${item.badgeColor}08`
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* Heartbeat simulation */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-zinc-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Actively Open to Opportunities</span>
              </div>
              <span>Status: Online</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ProjectsTab({ projects: apiProjects, profile }: ProjectsTabProps) {
  const [selectedProj, setSelectedProj] = useState<ProjectCaseStudy | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const projectsSec = profile?.projectsSection 
    ? (typeof profile.projectsSection === 'string' ? JSON.parse(profile.projectsSection) : profile.projectsSection)
    : null;

  // Draw active projects dynamically from projectsSection.projects list, filtered by visible and sorted by order
  const activeProjects = React.useMemo(() => {
    if (projectsSec?.projects && projectsSec.projects.length > 0) {
      return projectsSec.projects
        .filter((p: any) => p.visible !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    
    // Fallback 1: existing apiProjects prop
    if (apiProjects && apiProjects.length > 0) {
      return apiProjects;
    }

    // Fallback 2: Statically imported projectsCaseStudies
    return projectsCaseStudies;
  }, [projectsSec, apiProjects]);

  // Normalize projects to matching ProjectCaseStudy structures so everything renders flawlessly
  const normalizedProjects = React.useMemo(() => {
    return activeProjects.map((p: any) => {
      // If it is already a normalized ProjectCaseStudy
      if (p.imageSrc && !p.image) {
        return p;
      }
      
      // Map color name to hex/rgb
      const colorMap: Record<string, string> = {
        purple: "rgba(139, 92, 246, 0.4)",
        cyan: "rgba(6, 182, 212, 0.4)",
        amber: "rgba(245, 158, 11, 0.4)",
        emerald: "rgba(16, 185, 129, 0.4)",
        blue: "rgba(59, 130, 246, 0.4)"
      };

      const accentColor = colorMap[p.color] || colorMap.purple;

      // Map dynamic metrics array to string array
      const mappedMetrics = p.metrics && p.metrics.length > 0
        ? p.metrics.map((m: any) => `${m.label} ${m.value}%`)
        : ["UI/UX Score 95%", "Backend Speed 88%"];

      // Map status badge
      const statusMap: Record<string, string> = {
        LIVE: "Live",
        BUILDING: "In Development",
        PROTOTYPE: "Prototype",
        RESEARCH: "Experimental"
      };
      const mappedStatus = statusMap[p.type] || "Prototype";

      return {
        id: p.id,
        title: p.title,
        tagline: p.description.slice(0, 85) + (p.description.length > 85 ? '...' : ''),
        description: p.description,
        imageSrc: p.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        status: mappedStatus as any,
        year: '2026',
        role: p.featured ? 'Flagship Developer' : 'Developer',
        metrics: mappedMetrics,
        team: ["Shashwat Dixit"],
        techStack: p.technologies || p.techStack || [],
        features: ["Production ready deployment", "Cinematic responsive interface", "Optimized queries"],
        challenges: "Ensuring zero-latency rendering under heavy data load while executing dynamic asset updates.",
        solution: "Configured direct pre-signed direct upload pipelines alongside stateless background job worker threads.",
        githubUrl: p.githubUrl || undefined,
        liveUrl: p.demoUrl || p.liveUrl || undefined,
        accentColor,
        stats: {
          latency: "12ms avg",
          throughput: "18.5k ops/s",
          health: "100% Active"
        },
        systemNodes: [
          { id: "client", label: "Web Client", type: "client", details: "Responsive Next.js UI" },
          { id: "api", label: "Core API", type: "api", details: "Express Serverless Gateway" },
          { id: "db", label: "Neon Postgres", type: "db", details: "Prisma Database Layer" }
        ],
        systemConnections: [
          { from: "client", to: "api" },
          { from: "api", to: "db" }
        ]
      };
    });
  }, [activeProjects]);

  // Sync selection from Command Palette / Navbar
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        const matched = normalizedProjects.find(
          p =>
            p.id.toLowerCase() === custom.detail.id?.toLowerCase() ||
            p.title.toLowerCase() === custom.detail.title?.toLowerCase()
        );
        setSelectedProj(matched || normalizedProjects[0] || null);
      }
    };
    window.addEventListener('select-portfolio-project', handler);
    return () => window.removeEventListener('select-portfolio-project', handler);
  }, [normalizedProjects]);

  const filtered = normalizedProjects;

  const statsCards = projectsSec?.statsCards && projectsSec.statsCards.length > 0
    ? projectsSec.statsCards.filter((c: any) => c.visible !== false)
    : [
        { id: '1', value: '10+ Live', label: 'Projects Shipped', trend: 'Actively maintained', icon: 'Server', color: 'emerald' },
        { id: '2', value: 'Modern Stack', label: 'Technologies', trend: 'React, Node, Next.js', icon: 'Workflow', color: 'blue' },
        { id: '3', value: 'Production', label: 'Code Quality', trend: 'Clean & Scalable', icon: 'Radio', color: 'purple' },
      ];

  return (
    <AnimatePresence mode="wait">
      {selectedProj ? (
        <DetailView key="detail" proj={selectedProj} onBack={() => setSelectedProj(null)} />
      ) : (
        <SectionWrapper key="catalog" delay={0.05} className="space-y-14 pt-24 pb-12 md:py-12 scroll-mt-28">

          {/* ── SECTION HEADER */}
          <SectionHeader 
            badge={projectsSec?.badge}
            heading={projectsSec?.heading}
            description={projectsSec?.description}
            statsCards={statsCards}
          />

          {/* ── PROJECT GRID */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.length > 0 ? (
                filtered.map((proj, idx) => (
                  <ProjectCard
                    key={proj.id}
                    proj={proj}
                    index={idx}
                    onClick={() => {
                      try {
                        const current = JSON.parse(localStorage.getItem('sd_viewed_projects') || '[]');
                        if (!current.includes(proj.title)) {
                          current.push(proj.title);
                          localStorage.setItem('sd_viewed_projects', JSON.stringify(current));
                        }
                      } catch (e) {}
                      setSelectedProj(proj);
                    }}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                    No projects configured yet.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── CTA BANNER */}
          <CTABanner />

        </SectionWrapper>
      )}
    </AnimatePresence>
  );
}
