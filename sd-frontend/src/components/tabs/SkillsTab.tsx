import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Code, Cpu, Cloud, Sparkles, Database,
  Layers, CheckCircle, ArrowRight, Zap, Play
} from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';

interface Skill {
  id: string;
  skillName: string;
  skillLevel: number;
  category: string;
}

interface DomainConfig {
  id: string;
  title: string;
  keywords: string[];
  defaultChips: string[];
  metric: string;
  focusDetails: string[];
  workflowDetails: string[];
  archDetails: string[];
  tools: string[];
  icon: React.ComponentType<any>;
  colorClass: 'purple' | 'amber' | 'emerald' | 'blue';
  glowColor: string;
  accentHex: string;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Terminal: Terminal,
  Code: Code,
  Cpu: Cpu,
  Cloud: Cloud,
  Database: Database,
  Layers: Layers,
  Zap: Zap,
};

const DOMAINS: DomainConfig[] = [
  {
    id: 'backend',
    title: 'Backend Architecture',
    keywords: ['backend', 'database', 'node', 'express', 'postgres', 'prisma', 'redis', 'api', 'sql', 'db', 'graphql', 'ledger'],
    defaultChips: ["Node.js", "PostgreSQL", "Redis", "Express", "Prisma", "REST APIs"],
    metric: "12+ Production Builds",
    focusDetails: [
      "High-throughput REST & GraphQL API microservices",
      "Database connection pooling & complex query optimization",
      "Double-entry ledgers & transactional consistency models"
    ],
    workflowDetails: [
      "Automated migrations via Prisma schemas",
      "Stateful Redis caching & intelligent invalidation policies",
      "Robust OAuth2 & JWT-based authentication gateways"
    ],
    archDetails: [
      "Modular monolith & clean architecture design patterns",
      "Event-driven broker services (RabbitMQ, Redis streams)",
      "High availability databases with master-replica setups"
    ],
    tools: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis"],
    icon: Terminal,
    colorClass: 'purple',
    glowColor: "rgba(139, 92, 246, 0.25)",
    accentHex: "#8B5CF6",
  },
  {
    id: 'frontend',
    title: 'Frontend Systems',
    keywords: ['frontend', 'react', 'next', 'tailwind', 'framer', 'vite', 'ts', 'typescript', 'js', 'javascript', 'css', 'html', 'ui', 'ux'],
    defaultChips: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    metric: "Primary Engineering Stack",
    focusDetails: [
      "Immersive, interactive web dashboards & SaaS workspaces",
      "Cinematic micro-animations & state-bound layout transitions",
      "Fluid responsive adapters for mobile/tablet layout consistency"
    ],
    workflowDetails: [
      "Design systems based on highly reusable core layout blocks",
      "Global state machines & context pipelines (Zustand, React Context)",
      "Vite & Next.js production bundler size & asset optimizations"
    ],
    archDetails: [
      "Atomic design structure & strict typing boundaries",
      "Declarative UI flow representing deterministic app states",
      "SEO best practices & semantic document layout trees"
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    icon: Code,
    colorClass: 'amber',
    glowColor: "rgba(245, 158, 11, 0.25)",
    accentHex: "#F59E0B",
  },
  {
    id: 'ai',
    title: 'AI Engineering',
    keywords: ['ai', 'data', 'llm', 'agent', 'langchain', 'vector', 'openai', 'gemini', 'automation', 'ml', 'machine', 'python', 'flask'],
    defaultChips: ["LangChain", "AI Agents", "Gemini / OpenAI", "Vector DBs", "LLM Chains", "Automation"],
    metric: "Focused Since 2024",
    focusDetails: [
      "Multi-agent task routing & collaborative supervisor patterns",
      "Retrieval-Augmented Generation (RAG) context inject strategies",
      "LLM chain orchestration, fine-tuning, & model telemetry"
    ],
    workflowDetails: [
      "Prompt parsing, telemetry logs & prompt version controllers",
      "Strict structured JSON outputs via OpenAI/Gemini parser schemas",
      "Automated system task loops with tool call integration"
    ],
    archDetails: [
      "Semantic memory systems & long-term database storage",
      "Vector search index structures (Pinecone, pgvector)",
      "Failover orchestrations & request rate-limit mitigations"
    ],
    tools: ["LangChain", "OpenAI SDK", "Pinecone", "Python", "Gemini API"],
    icon: Cpu,
    colorClass: 'emerald',
    glowColor: "rgba(16, 185, 129, 0.25)",
    accentHex: "#10B981",
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps',
    keywords: ['devops', 'cloud', 'docker', 'aws', 'ci', 'cd', 'git', 'github', 'vercel', 'nginx', 'linux', 'deploy', 'infrastructure'],
    defaultChips: ["Docker", "AWS", "CI/CD", "Vercel", "GitHub Actions", "Linux"],
    metric: "Modern Infrastructure",
    focusDetails: [
      "Containerized server setups & localized Docker environments",
      "Automated Git-triggered pipeline integrations & build stages",
      "Edge routing platforms, asset CDNs, & serverless setups"
    ],
    workflowDetails: [
      "Multi-stage slim container builds with layer caching",
      "Automatic branch preview deployments & release validation",
      "Domain records, SSL certification, & reverse proxy maps"
    ],
    archDetails: [
      "Infrastructure automation & declarative server definitions",
      "High reliability zero-downtime rolling service releases",
      "Secure production environment configuration & secret isolation"
    ],
    tools: ["Docker", "AWS S3/EC2", "GitHub Actions", "Vercel", "Linux"],
    icon: Cloud,
    colorClass: 'blue',
    glowColor: "rgba(59, 130, 246, 0.25)",
    accentHex: "#3B82F6",
  }
];

const COLOR_MAP = {
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-400",
    border: "border-purple-500/10 hover:border-purple-500/35",
    glow: "shadow-purple-500/10",
    accentLight: "rgba(168, 85, 247, 0.15)",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/10 hover:border-amber-500/35",
    glow: "shadow-amber-500/10",
    accentLight: "rgba(245, 158, 11, 0.15)",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    border: "border-emerald-500/10 hover:border-emerald-500/35",
    glow: "shadow-emerald-500/10",
    accentLight: "rgba(16, 185, 129, 0.15)",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500/10 hover:border-blue-500/35",
    glow: "shadow-blue-500/10",
    accentLight: "rgba(59, 130, 246, 0.15)",
  }
};

export default function SkillsTab({ skills = [], profile }: { skills?: Skill[]; profile?: any }) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'focus' | 'workflow' | 'architecture'>>({});

  const skillsSec = React.useMemo(() => {
    if (!profile?.skillsSection) return {};
    return typeof profile.skillsSection === 'string'
      ? JSON.parse(profile.skillsSection)
      : profile.skillsSection;
  }, [profile?.skillsSection]);

  // Dynamic mapping of database skills to our capabilities system
  const mappedDomains = React.useMemo(() => {
    // If the database profile has a saved visual skillsSection, load it directly
    if (skillsSec?.capabilityCards) {
      const cards = skillsSec.capabilityCards;
      const sorted = [...cards]
        .filter((c: any) => c.visible !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      return sorted.map((c: any) => {
        return {
          id: c.id,
          title: c.title,
          icon: ICON_MAP[c.icon] || Terminal,
          colorClass: c.accentColor || 'purple',
          glowColor: COLOR_MAP[c.accentColor as keyof typeof COLOR_MAP]?.accentLight || "rgba(139, 92, 246, 0.25)",
          accentHex: c.accentColor === 'purple' ? '#8B5CF6' : c.accentColor === 'amber' ? '#F59E0B' : c.accentColor === 'emerald' ? '#10B981' : '#3B82F6',
          level: c.experienceLevel || 8,
          metric: c.metricIndicator || "Active capability",
          chips: c.technologies || [],
          focusDetails: c.focusDetails || [],
          workflowDetails: c.workflowDetails || [],
          archDetails: c.archDetails || []
        };
      });
    }

    // Fallback: Dynamic keyword matching from simple skill categories
    return DOMAINS.map(dom => {
      // Filter database items that fall under this capability's keywords
      const matched = skills.filter(s => {
        const nameLower = (s.skillName || '').toLowerCase();
        const catLower = (s.category || '').toLowerCase();
        return dom.keywords.some(k => nameLower.includes(k) || catLower.includes(k));
      });

      // Calculate average level (1-10 scale), default to 8/10 if none seeded
      let avgLevel = 8;
      if (matched.length > 0) {
        const sum = matched.reduce((acc, s) => acc + s.skillLevel, 0);
        avgLevel = Math.round(sum / matched.length);
      }

      // Determine tech stack chips to render (db entries fallback to static defaults)
      const chips = matched.length > 0
        ? matched.map(s => s.skillName)
        : dom.defaultChips;

      return {
        ...dom,
        level: avgLevel,
        chips: chips.slice(0, 6) // limit to top 6 chips for clean styling
      };
    });
  }, [skills, profile]);

  const badgeText = skillsSec.badge || "ENGINEERING CAPABILITIES";
  const headingText = skillsSec.heading || "SYSTEM CAPABILITIES";
  const descriptionText = skillsSec.description || "Production systems built on modular backend architecture, AI-native workflows, scalable frontend state, and automated cloud deployments.";
  
  const philosophyVisible = skillsSec.philosophyVisible !== false;
  
  const philosophyItems = React.useMemo(() => {
    if (skillsSec.philosophyStrip) {
      return skillsSec.philosophyStrip.filter((item: any) => item.visible !== false);
    }
    // Fallback/Migration: convert tags to structured list
    const tags = skillsSec.philosophyTags || ["SCALABLE ARCHITECTURE", "AI-NATIVE DEVELOPMENT", "PERFORMANCE FIRST", "PRODUCT THINKING"];
    const colors = ['purple', 'amber', 'emerald', 'blue'];
    return tags.map((t: string, i: number) => ({
      id: `philosophy-${i}-${Date.now()}`,
      text: t,
      color: colors[i % colors.length],
      visible: true,
      order: i + 1
    }));
  }, [skillsSec]);

  // Set default tabs inside expanded views on first hover
  const getActiveTab = (domId: string) => {
    return activeTabMap[domId] || 'focus';
  };

  const handleTabChange = (domId: string, tab: 'focus' | 'workflow' | 'architecture') => {
    setActiveTabMap(prev => ({ ...prev, [domId]: tab }));
  };

  return (
    <SectionWrapper delay={0.05} className="space-y-16 py-10 max-w-7xl mx-auto select-none">
      
      {/* SECTION 1: Capability Header (Minimal and Cinematic) */}
      <div className="space-y-4 text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-black text-neutral-300">
            {badgeText}
          </span>
        </div>
        
        <h2 className="text-[32px] md:text-[52px] font-bold text-white font-heading tracking-tight leading-none uppercase">
          {headingText}
        </h2>
        
        <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base max-w-2xl">
          {descriptionText}
        </p>
      </div>

      {/* SECTION 2: Core Expertise Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {mappedDomains.map((dom) => {
          const styles = COLOR_MAP[dom.colorClass as keyof typeof COLOR_MAP] || COLOR_MAP.purple;
          const Icon = dom.icon;
          const isHovered = hoveredCardId === dom.id;
          const currentTab = getActiveTab(dom.id);

          return (
            <div
              key={dom.id}
              onMouseEnter={() => setHoveredCardId(dom.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => setHoveredCardId(hoveredCardId === dom.id ? null : dom.id)} // Toggles on mobile tap
              className="relative cursor-pointer transition-all duration-300"
            >
              <GlassCard
                hoverEffect={false}
                spotlightGlow={true}
                spotlightColor={styles.accentLight}
                className={`p-6 md:p-8 rounded-[32px] border transition-all duration-500 bg-[#09090b]/80 backdrop-blur-2xl flex flex-col justify-between h-full select-text ${
                  isHovered 
                    ? `${styles.border} shadow-[0_20px_50px_-12px_${dom.accentHex}1a] -translate-y-1.5`
                    : "border-white/[0.04]"
                }`}
              >
                <div className="space-y-6">
                  {/* Card Header: Title & Icon */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-500">
                        CAPABILITY DOMAIN
                      </span>
                      <h3 className="text-lg md:text-xl font-heading font-black text-white tracking-tight uppercase">
                        {dom.title}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent ${
                      isHovered ? `border-white/15 text-white` : "border-white/[0.04] text-neutral-400"
                    } transition-all duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stack Chips with custom glow */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {dom.chips.map((chip) => (
                      <span
                        key={chip}
                        className={`px-3 py-1 bg-white/[0.01] border rounded-lg text-[10px] font-mono tracking-wide text-neutral-300 transition-all duration-300 ${
                          isHovered 
                            ? 'border-white/10 text-white bg-white/[0.04]' 
                            : 'border-white/[0.04]'
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Experience Block Meter */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                      <span>EXPERIENCE LEVEL</span>
                      <span className="font-bold text-neutral-400">{dom.level} / 10</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const isActive = i < dom.level;
                        return (
                          <div
                            key={i}
                            className={`h-2.5 flex-1 rounded-sm transition-all duration-500 ${
                              isActive 
                                ? `${styles.bg} ${styles.glow}`
                                : 'bg-neutral-900 border border-white/[0.02]'
                            }`}
                            style={{
                              opacity: isActive ? (isHovered ? 1 : 0.65) : 0.15,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded Disclosure Panel (Reveals detail tabs on hover) */}
                  <div className="relative overflow-hidden pt-2">
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isHovered ? "auto" : "0px",
                        opacity: isHovered ? 1 : 0,
                        marginTop: isHovered ? "16px" : "0px"
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-white/[0.04]"
                    >
                      {/* Sub-navigation Tabs inside expansion */}
                      <div className="flex gap-2.5 py-3.5 select-none">
                        {[
                          { id: 'focus', label: 'CORE FOCUS' },
                          { id: 'workflow', label: 'WORKFLOW' },
                          { id: 'architecture', label: 'ARCHITECTURE' }
                        ].map((tab) => {
                          const isTabActive = currentTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid card click toggle
                                handleTabChange(dom.id, tab.id as any);
                              }}
                              className={`text-[8.5px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded transition-all cursor-pointer ${
                                isTabActive
                                  ? `${styles.bg} text-neutral-950 font-bold shadow-sm`
                                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]'
                              }`}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Content panel based on active detail tab */}
                      <div className="min-h-[105px] flex flex-col justify-center pb-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentTab}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-2.5"
                          >
                            {(currentTab === 'focus' ? dom.focusDetails : 
                              currentTab === 'workflow' ? dom.workflowDetails : 
                              dom.archDetails).map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-400 font-sans leading-relaxed">
                                <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${styles.bg}`} />
                                <p>{detail}</p>
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Metric Strip */}
                <div className="flex justify-between items-center text-[8px] font-mono text-neutral-500 uppercase tracking-widest pt-4 mt-6 border-t border-white/[0.03]">
                  <span>METRIC INDICATOR</span>
                  <span className={`flex items-center gap-1.5 font-bold ${styles.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${styles.bg} animate-pulse`} />
                    {dom.metric}
                  </span>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: Bottom Engineering Philosophy Strip */}
      {philosophyVisible && philosophyItems.length > 0 && (
        <div className="max-w-4xl mx-auto rounded-full bg-[#050508]/40 border border-white/[0.08] py-4.5 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.03)] backdrop-blur-md overflow-hidden relative select-none mt-16 hover:border-white/[0.12] transition-all duration-300">
          {/* Soft shadow gradients on edges for seamless look */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />
          
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: [0, "-50%"] }}
              transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 40 // Ultra-slow luxurious movement
              }}
              className="flex gap-10 items-center px-4 text-[9.5px] md:text-[10px] font-mono font-black tracking-[0.25em] text-neutral-500 uppercase"
            >
              {/* Loop twice for seamless scroll */}
              {[...philosophyItems, ...philosophyItems].map((item, idx) => {
                const colorClass = item.color || 'purple';
                const dotGlow =
                  colorClass === 'purple' ? 'bg-purple-500 shadow-[0_0_10px_#a855f7] text-purple-400' :
                  colorClass === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4] text-cyan-400' :
                  colorClass === 'amber' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b] text-amber-400' :
                  colorClass === 'emerald' || colorClass === 'green' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] text-emerald-400' :
                  'bg-blue-500 shadow-[0_0_10px_#3b82f6] text-blue-400';

                return (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    className="inline-flex items-center gap-3.5 cursor-pointer"
                    whileHover="hover"
                    initial="initial"
                  >
                    {/* Glowing status dot with interactive pulsing scaling */}
                    <motion.span
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.4 }
                      }}
                      className={`w-2 h-2 rounded-full ${dotGlow} transition-colors duration-300`}
                    />
                    
                    {/* Glowing typography item */}
                    <motion.span
                      variants={{
                        initial: { color: 'rgba(163, 163, 163, 0.75)' },
                        hover: { color: '#ffffff', textShadow: '0 0 12px rgba(255,255,255,0.75)' }
                      }}
                      className="transition-all duration-300"
                    >
                      {item.text}
                    </motion.span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}

    </SectionWrapper>
  );
}
