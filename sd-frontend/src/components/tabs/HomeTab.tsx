import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { InfiniteSlider } from '../ui/infinite-slider';
import { Sparkles } from '../ui/sparkles';
import { CardStack } from '../ui/card-stack';
import shashwatPortrait from '../../assets/shashwat_portrait.jpg';
import { Clock, Layers, Cpu, Sparkles as SparkleIcon, Shield, Zap, Globe, Heart, HelpCircle } from 'lucide-react';
import { GlowCard } from '../ui/spotlight-card';

interface HomeTabProps {
  user: any;
  profile: any;
  setActiveTab: (tab: any) => void;
}

const ROLES = [
  "AI Systems",
  "Full-Stack Products",
  "Modern Web Apps",
  "Backend Architectures",
  "Immersive UIs",
  "Automation Platforms"
];

const identityCards = [
  {
    id: "full-stack",
    label: "CORE STACK",
    title: "Full-Stack Engineering",
    description: "Building scalable applications using Next.js, Node.js, Express, PostgreSQL, TypeScript, and cloud-based infrastructure.",
    tags: ["API", "DATABASE", "AUTH", "CLOUD"],
  },
  {
    id: "ai-systems",
    label: "AI SYSTEMS",
    title: "AI & Automation",
    description: "Developing intelligent workflows, AI-powered tools, PDF-based systems, and automation platforms that improve productivity and user interaction.",
    tags: ["LLM", "AUTOMATION", "ML", "WORKFLOWS"],
  },
  {
    id: "frontend",
    label: "FRONTEND",
    title: "Modern UI Experiences",
    description: "Crafting immersive interfaces with smooth animations, responsive layouts, glassmorphism, and modern interaction design principles.",
    tags: ["MOTION", "RESPONSIVE", "DESIGN", "UX"],
  },
  {
    id: "product-builder",
    label: "PRODUCT BUILDER",
    title: "Startup & Product Thinking",
    description: "Focused on solving real-world problems through fast execution, scalable systems, and user-first product development.",
    tags: ["STRATEGY", "EXECUTION", "SCALE", "USERS"],
  }
];

const techStack = [
  "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Express", "Tailwind", "Cloudinary", "AI/ML"
];

const metrics = [
  { 
    icon: Clock,
    value: "01+", 
    label: "Years Building",
    subtext: "Modern web applications",
    color: "purple"
  },
  { 
    icon: Layers,
    value: "10+", 
    label: "Projects Built",
    subtext: "Full-stack & AI systems",
    color: "purple"
  },
  { 
    icon: Cpu,
    value: "Full-Stack", 
    label: "Specialization",
    subtext: "Frontend + Backend Architecture",
    color: "purple"
  },
  { 
    icon: SparkleIcon,
    value: "AI Products", 
    label: "Current Focus",
    subtext: "Automation & intelligent systems",
    color: "purple"
  }
];

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Clock,
  Layers,
  Cpu,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Heart
};

const hoverGlowClasses: Record<string, string> = {
  purple: 'group-hover:bg-purple-500/40',
  cyan: 'group-hover:bg-cyan-500/40',
  amber: 'group-hover:bg-amber-500/40',
  green: 'group-hover:bg-emerald-500/40'
};

const iconBgClasses: Record<string, string> = {
  purple: 'group-hover:bg-purple-500/10 group-hover:border-purple-500/30',
  cyan: 'group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30',
  amber: 'group-hover:bg-amber-500/10 group-hover:border-amber-500/30',
  green: 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30'
};

const iconTextClasses: Record<string, string> = {
  purple: 'group-hover:text-purple-400',
  cyan: 'group-hover:text-cyan-400',
  amber: 'group-hover:text-amber-400',
  green: 'group-hover:text-emerald-400'
};

export default function HomeTab({ user, profile, setActiveTab }: HomeTabProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedExpertiseCard, setSelectedExpertiseCard] = useState<any | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  // Helper properties reading from custom Visual DB Profile
  const heroData = profile?.heroSection 
    ? (typeof profile.heroSection === 'string' ? JSON.parse(profile.heroSection) : profile.heroSection)
    : null;

  const heroTitle = heroData?.title || "Hi, I'm Shashwat Dixit";
  const heroDescOne = heroData?.descOne || "I’m a full-stack developer and product builder focused on creating modern web applications, AI-powered tools, and scalable backend systems.";
  const heroDescTwo = heroData?.descTwo || "My work combines clean architecture, interactive frontend experiences, and performance-driven engineering to transform ideas into production-ready products.";
  
  // Portfolios backend base image url resolving
  const heroImg = heroData?.image
    ? (heroData.image.startsWith('http') ? heroData.image : `http://localhost:5000${heroData.image}`)
    : shashwatPortrait;

  const activeTechStack = profile?.techStack && profile.techStack.length > 0 
    ? profile.techStack 
    : techStack;

  const rawStats = profile?.statsCards 
    ? (typeof profile.statsCards === 'string' ? JSON.parse(profile.statsCards) : profile.statsCards)
    : null;

  const activeMetrics = rawStats && rawStats.length > 0
    ? rawStats.filter((m: any) => m.visible).map((m: any) => ({
        value: m.value,
        label: m.title,
        subtext: m.subtitle,
        icon: ICON_MAP[m.icon] || HelpCircle,
        color: m.color || 'purple'
      }))
    : metrics;

  const rawExpertise = profile?.expertiseCards 
    ? (typeof profile.expertiseCards === 'string' ? JSON.parse(profile.expertiseCards) : profile.expertiseCards)
    : null;

  const activeExpertiseCards = rawExpertise && rawExpertise.length > 0
    ? rawExpertise.map((c: any, index: number) => ({
        id: c.id || `exp-card-${index}`,
        label: c.label || 'CORE STACK',
        title: c.title || '',
        description: c.description || '',
        tags: c.tags || [],
      }))
    : identityCards;

  return (
    <SectionWrapper delay={0.05} className="space-y-8 md:space-y-16 pb-12 md:pb-24 pt-4 md:pt-20">
      {/* Background Effects - reduced opacity behind text */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full blur-[80px] transition-colors duration-1000"
          style={{
            backgroundColor: roleIndex % 2 === 0 ? 'rgba(139, 92, 246, 0.08)' : 'rgba(99, 102, 241, 0.08)' // Shifts color when role changes
          }}
        />
        <Sparkles
          density={80}
          speed={0.4}
          size={1.0}
          color="#8B5CF6"
          className="w-full h-full"
        />
      </div>

      <div className="w-full relative z-10 max-w-6xl mx-auto">
        
        {/* NEW HERO SECTION WITH IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <motion.div variants={itemVariants} className="text-left space-y-6 mt-0 lg:col-span-7 xl:col-span-8 flex flex-col items-start">
            <div className="inline-block mb-2">
              <span className="text-[10px] md:text-[12px] font-mono font-black text-purple-400 uppercase tracking-[0.3em]">
                ABOUT ME
              </span>
            </div>
            
            <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-bold text-white font-heading tracking-tight leading-[0.92]">
              {heroTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 text-[28px] md:text-[40px] lg:text-[56px] font-black text-white font-heading tracking-tighter leading-[0.92] pb-2">
              <span className="text-neutral-400">I build</span>
              <div className="relative inline-flex min-w-[320px] md:min-w-[600px] lg:min-w-[750px] h-[40px] md:h-[64px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 whitespace-nowrap"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
                {/* Dynamic beam underline */}
                <motion.div 
                  key={`beam-${roleIndex}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-transparent origin-left rounded-full"
                />
              </div>
            </div>

            {/* Mobile Portrait — Rendered immediately below rotating roles on mobile viewports */}
            <div className="block lg:hidden w-[260px] h-[320px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative my-6 mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-70" />
              <img 
                src={heroImg} 
                alt="Developer Portrait" 
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = shashwatPortrait;
                }}
              />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay z-20" />
            </div>
            
            <p className="text-[15px] md:text-[20px] text-neutral-400 leading-[1.7] font-light mt-4 md:mt-8 max-w-[750px]">
              {heroDescOne}
              <br /><br />
              {heroDescTwo}
            </p>
          </motion.div>

          {/* Desktop Portrait Showcase Column */}
          <motion.div variants={itemVariants} className="hidden lg:flex lg:col-span-5 xl:col-span-4 relative justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
              <img 
                src={heroImg} 
                alt="Developer Portrait" 
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = shashwatPortrait;
                }}
              />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-20" />
              
              {/* Futuristic Floating Brand Showcase Badges */}
              <div className="absolute inset-0 pointer-events-none z-30">
                {/* Active Online Pulse status badge (Top Left) */}
                <motion.div 
                  className="absolute -top-3.5 -left-5 px-3 py-1.5 bg-neutral-950/90 border border-emerald-500/30 rounded-xl flex items-center gap-2 shadow-2xl backdrop-blur-md"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-[8px] font-black uppercase tracking-widest text-emerald-400">STATUS: ONLINE</span>
                </motion.div>

                {/* Experience counter badge (Middle Left) */}
                <motion.div 
                  className="absolute bottom-16 -left-8 px-3 py-2 bg-neutral-950/90 border border-purple-500/30 rounded-xl flex flex-col items-start shadow-2xl backdrop-blur-md"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.4 }}
                >
                  <span className="text-[10px] font-black font-heading text-purple-400">02+ YEARS</span>
                  <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-neutral-500">EXPERIENCE</span>
                </motion.div>

                {/* AI Specialization Badge (Bottom Right) */}
                <motion.div 
                  className="absolute -bottom-4 -right-4 px-3.5 py-2 bg-neutral-950/90 border border-indigo-500/30 rounded-xl flex flex-col items-start shadow-2xl backdrop-blur-md"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.8 }}
                >
                  <span className="text-[9px] font-black font-heading text-white leading-none mb-0.5">AI SYSTEM</span>
                  <span className="font-mono text-[7px] font-black uppercase tracking-widest text-indigo-400 leading-none">ORCHESTRATION</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Marquee immediately below paragraph */}
        <motion.div variants={itemVariants} className="mt-12 py-6 border-y border-white/5 overflow-hidden">
          <InfiniteSlider className="flex items-center" duration={60} gap={64}>
            {activeTechStack.map((tech, i) => (
              <div key={i} className="text-sm font-mono font-bold text-neutral-300 uppercase tracking-widest whitespace-nowrap">
                {tech} <span className="mx-6 text-neutral-600">•</span>
              </div>
            ))}
          </InfiniteSlider>
        </motion.div>

        {/* CardStack Implementation */}
        <motion.div variants={itemVariants} className="mt-12 md:mt-24 flex justify-center items-center w-full min-h-[260px] md:min-h-[400px]">
          <CardStack
            items={activeExpertiseCards}
            initialIndex={0}
            autoAdvance={true}
            intervalMs={4000}
            pauseOnHover={true}
            showDots={true}
            cardWidth={isMobile ? 290 : 380}
            cardHeight={isMobile ? 180 : 320}
            renderCard={(card: any, state: { active: boolean }) => {
              const visibleTags = isMobile ? card.tags.slice(0, 3) : card.tags;
              return (
                <div 
                  className="group w-full h-full relative flex flex-col justify-between p-5 md:p-8 bg-neutral-900/80 backdrop-blur-md border border-white/5 overflow-hidden text-left"
                >
                  {/* Subtle internal gradient shift */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-transparent transition-colors duration-500 pointer-events-none ${state.active ? 'from-purple-500/10' : ''}`} />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="mb-2 md:mb-6 inline-flex items-center">
                        <span className={`text-[9px] font-mono font-black uppercase tracking-widest transition-colors duration-300 ${state.active ? 'text-[#FFA700]' : 'text-neutral-500'}`}>
                          {card.label}
                        </span>
                      </div>
                      
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 tracking-tight leading-tight">{card.title}</h3>
                      {!isMobile && <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light line-clamp-3 md:line-clamp-none">{card.description}</p>}
                    </div>

                    {isMobile && state.active && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExpertiseCard(card);
                        }}
                        className="mt-2 text-[9px] font-mono font-black tracking-widest text-[#FFA700] hover:text-[#FFA700]/80 transition-colors self-start uppercase cursor-pointer"
                      >
                        [ LEARN MORE ]
                      </button>
                    )}
                  </div>

                  <div className="relative z-10 mt-3 md:mt-10 pt-2.5 md:pt-5 border-t border-white/5 flex flex-wrap gap-2">
                    {visibleTags.map((tag: string, i: number) => (
                      <span key={i} className="text-[8px] md:text-[10px] font-mono text-neutral-500 font-medium tracking-widest">
                        {tag} {i < visibleTags.length - 1 && <span className="mx-1 opacity-40">•</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }}
          />
        </motion.div>

        {/* Section Title for Metrics */}
        <div className="w-full text-left mt-10 md:mt-24 mb-5 md:mb-8">
          <span className="text-[10px] md:text-[12px] font-mono font-black text-purple-400 uppercase tracking-[0.3em]">
            EXPERIENCE SNAPSHOT
          </span>
        </div>

        {/* Metrics Row */}
        <div className="pb-16 grid grid-cols-2 lg:grid-cols-4 gap-[14px] md:gap-6">
          {activeMetrics.map((metric: any, i: number) => {
            const Icon = metric.icon;
            const glowColor = metric.color || 'purple';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="w-full"
              >
                <GlowCard
                  customSize={true}
                  glowColor={glowColor}
                  className="group flex flex-col justify-between h-[190px] p-5 transition-all duration-500 hover:-translate-y-1.5"
                >
                  {/* Hover Glow Effect */}
                  <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-transparent ${hoverGlowClasses[glowColor] || hoverGlowClasses.purple} blur-xl transition-all duration-500 rounded-full pointer-events-none`} />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-between h-full text-left">
                    <div className="flex flex-col gap-1.5">
                      <div className={`p-1.5 bg-white/5 rounded-lg border border-white/10 ${iconBgClasses[glowColor] || iconBgClasses.purple} transition-colors duration-500 shrink-0 w-fit`}>
                        <Icon className={`w-3.5 h-3.5 text-neutral-400 ${iconTextClasses[glowColor] || iconTextClasses.purple} transition-colors duration-500`} />
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <div className="text-[22px] xs:text-[26px] md:text-[32px] lg:text-[36px] font-black text-white font-heading tracking-tighter leading-none mb-1">
                          {metric.value}
                        </div>
                        <div className="text-[11px] md:text-[13px] font-mono text-[#FFA700] font-bold uppercase tracking-wide md:tracking-widest leading-none">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-relaxed font-light mt-auto text-left line-clamp-2 md:line-clamp-none">
                      {metric.subtext}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Premium Skill Details Expansion Modal for Mobile */}
      <AnimatePresence>
        {selectedExpertiseCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            {/* Backdrop Close Click area */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setSelectedExpertiseCard(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[340px] rounded-3xl bg-neutral-900/95 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl z-10 overflow-hidden text-left"
            >
              {/* Internal ambient glowing blur */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FFA700]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button Top Right */}
              <button 
                onClick={() => setSelectedExpertiseCard(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full bg-white/5 border border-white/5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#FFA700] mb-2 inline-block">
                {selectedExpertiseCard.label}
              </span>
              
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight leading-tight">
                {selectedExpertiseCard.title}
              </h3>
              
              <p className="text-xs text-neutral-300 leading-relaxed font-light mb-6">
                {selectedExpertiseCard.description}
              </p>

              <div className="border-t border-white/5 pt-4">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-2.5 block">
                  ASSOCIATED CORE TECHNOLOGIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExpertiseCard.tags.map((tag: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-[8px] font-mono font-bold text-white/90 bg-white/5 border border-white/10 rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedExpertiseCard(null)}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-[#FFA700] to-orange-500 text-neutral-950 font-mono text-[9px] font-black tracking-widest uppercase rounded-xl hover:shadow-lg hover:shadow-[#FFA700]/10 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Acknowledge & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
