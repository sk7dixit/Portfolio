import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import {
  Plus, Trash2, Award, Save, ArrowUp, ArrowDown, Eye, EyeOff,
  Terminal, Code, Cpu, Cloud, Database, Layers, Zap, X,
  ChevronDown, ChevronRight, GripVertical, Settings2, Type,
  AlignLeft, Star, List, Tag, Palette, Sparkles, Activity,
  Code2, FolderGit2, BadgeAlert, Laptop, Smartphone, Sliders
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { usePortfolio } from '../../context/PortfolioContext';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const ICON_OPTIONS = [
  { id: 'Terminal', label: 'Terminal', icon: Terminal },
  { id: 'Code', label: 'Code', icon: Code },
  { id: 'Cpu', label: 'CPU / AI', icon: Cpu },
  { id: 'Cloud', label: 'Cloud', icon: Cloud },
  { id: 'Database', label: 'Database', icon: Database },
  { id: 'Layers', label: 'Layers', icon: Layers },
  { id: 'Zap', label: 'Zap', icon: Zap },
];

const COLOR_OPTIONS = [
  { id: 'purple', label: 'Purple', hex: '#8B5CF6', bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', dot: 'bg-purple-500' },
  { id: 'amber',  label: 'Amber',  hex: '#F59E0B', bg: 'bg-amber-500/20',  border: 'border-amber-500/50',  text: 'text-amber-400',  dot: 'bg-amber-500'  },
  { id: 'emerald',label: 'Emerald',hex: '#10B981', bg: 'bg-emerald-500/20',border: 'border-emerald-500/50',text: 'text-emerald-400',dot: 'bg-emerald-500' },
  { id: 'blue',   label: 'Blue',   hex: '#3B82F6', bg: 'bg-blue-500/20',   border: 'border-blue-500/50',   text: 'text-blue-400',   dot: 'bg-blue-500'   },
];

const DEFAULT_CAPABILITY_CARD = {
  id: 'new-card',
  title: 'NEW DOMAIN',
  icon: 'Terminal',
  accentColor: 'purple',
  experienceLevel: 8,
  metricIndicator: 'Active capability',
  technologies: ['Technology A', 'Technology B'],
  focusDetails: ['Core focus description one.', 'Core focus description two.'],
  workflowDetails: ['Workflow detail one.', 'Workflow detail two.'],
  archDetails: ['Architecture detail one.', 'Architecture detail two.'],
  visible: true,
  order: 0,
};

const DEFAULT_SKILLS_SECTION = {
  badge: 'ENGINEERING CAPABILITIES',
  heading: 'SYSTEM CAPABILITIES',
  description: 'Production systems built on modular backend architecture, AI-native workflows, scalable frontend state, and automated cloud deployments.',
  capabilityCards: [
    { ...DEFAULT_CAPABILITY_CARD, id: 'backend', title: 'Backend Architecture', icon: 'Terminal', accentColor: 'purple', order: 0 },
    { ...DEFAULT_CAPABILITY_CARD, id: 'frontend', title: 'Frontend Systems', icon: 'Code', accentColor: 'amber', order: 1 },
    { ...DEFAULT_CAPABILITY_CARD, id: 'ai', title: 'AI Engineering', icon: 'Cpu', accentColor: 'emerald', order: 2 },
    { ...DEFAULT_CAPABILITY_CARD, id: 'devops', title: 'Cloud & DevOps', icon: 'Cloud', accentColor: 'blue', order: 3 },
  ],
  philosophyVisible: true,
  philosophyTags: ['SCALABLE ARCHITECTURE', 'AI-NATIVE DEVELOPMENT', 'PERFORMANCE FIRST', 'PRODUCT THINKING'],
};

/* ─────────────────────────────────────────────────────────────
   ICON MAP RENDERER
───────────────────────────────────────────────────────────── */
const ICON_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  Terminal, Code, Cpu, Cloud, Database, Layers, Zap, Sparkles, Activity, Code2, FolderGit2, BadgeAlert
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const Comp = ICON_COMPONENT_MAP[name] || Terminal;
  return <Comp className={className} />;
}

const KS_DEFAULT_CAPABILITIES = [
  {
    id: 0,
    title: "Frontend Engineering",
    shortDesc: "Creating immersive, high-performance UI systems",
    detailedDesc: "Designing rich modular systems, responsive layout structures, premium micro-animations, and reusable components using modern frameworks.",
    icon: "Layers",
    technologies: ["React.js", "Tailwind CSS", "Framer Motion", "Responsive UI", "Component Systems", "HTML5 & CSS3"],
    skills: [
      { name: "Component Architecture", level: 92 },
      { name: "Responsive Layouts", level: 96 },
      { name: "Fluid Motion & CSS", level: 88 }
    ],
    gradientClass: "from-cyan-400 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.15)",
    accentColor: "text-cyan-400"
  },
  {
    id: 1,
    title: "Backend Development",
    shortDesc: "Architecting modular routes, servers, and controllers",
    detailedDesc: "Constructing scalable server-side systems, RESTful API endpoints, secure JSON Web Token (JWT) authorization gates, and clean middleware flows.",
    icon: "Terminal",
    technologies: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Secure Middleware", "JSON Handling"],
    skills: [
      { name: "Server Architectures", level: 88 },
      { name: "API Logic & Security", level: 85 },
      { name: "Database Integration", level: 90 }
    ],
    gradientClass: "from-purple-400 to-pink-500",
    glowColor: "rgba(192, 132, 252, 0.15)",
    accentColor: "text-purple-400"
  },
  {
    id: 2,
    title: "Database Systems",
    shortDesc: "Modeling schemas and optimizing relational storage",
    detailedDesc: "Handling persistent data models, designing document schemas, structural query indexing, and optimizing low-latency full-stack database aggregations.",
    icon: "Database",
    technologies: ["MongoDB", "MySQL", "Data Modeling", "Query Optimization", "Aggregation Layers", "Schema Design"],
    skills: [
      { name: "Data Modeling", level: 86 },
      { name: "Query Performance", level: 82 },
      { name: "MERN Interconnectivity", level: 94 }
    ],
    gradientClass: "from-emerald-400 to-cyan-500",
    glowColor: "rgba(52, 211, 153, 0.15)",
    accentColor: "text-emerald-400"
  },
  {
    id: 3,
    title: "Problem Solving",
    shortDesc: "Structuring clean algorithms and logic concepts",
    detailedDesc: "Formulating optimal algorithms utilizing core Data Structures (DSA), solid Object-Oriented Patterns (OOPs), and writing clean, scalable software.",
    icon: "Cpu",
    technologies: ["Java", "JavaScript", "OOPs Core", "DSA Patterns", "Logic Structuring", "Complexity Analysis"],
    skills: [
      { name: "Data Structures (DSA)", level: 82 },
      { name: "OOP Principles & Design", level: 86 },
      { name: "Time/Space Efficiencies", level: 80 }
    ],
    gradientClass: "from-orange-400 to-red-500",
    glowColor: "rgba(251, 146, 60, 0.15)",
    accentColor: "text-orange-400"
  }
];

const KS_DEFAULT_TECH_STRIP = [
  { name: "React.js", color: "#61DAFB", enabled: true },
  { name: "Node.js", color: "#339933", enabled: true },
  { name: "Express.js", color: "#CCCCCC", enabled: true },
  { name: "MongoDB", color: "#47A248", enabled: true },
  { name: "MySQL", color: "#4479A1", enabled: true },
  { name: "Java", color: "#007396", enabled: true },
  { name: "JavaScript", color: "#F7DF1E", enabled: true },
  { name: "Tailwind CSS", color: "#38BDF8", enabled: true },
  { name: "REST APIs", color: "#C084FC", enabled: true },
  { name: "Framer Motion", color: "#F472B6", enabled: true },
  { name: "GitHub", color: "#E5E5E5", enabled: true },
  { name: "Postman", color: "#FF6C37", enabled: true }
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function SkillsModuleAdmin() {
  const { activePortfolio } = usePortfolio();
  const isKS = activePortfolio === 'khushaboo';

  const profile = useStore((s) => s.profile);
  const skills = useStore((s) => s.skills);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);
  const user = useStore((s) => s.user);

  // ── Socket synchronization state ────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Tab state ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'hero' | 'cards' | 'philosophy' | 'grid'>('hero');

  // ── Skills Section CMS state ───────────────────────────────
  const [badge, setBadge] = useState(DEFAULT_SKILLS_SECTION.badge);
  const [heading, setHeading] = useState(DEFAULT_SKILLS_SECTION.heading);
  const [description, setDescription] = useState(DEFAULT_SKILLS_SECTION.description);
  const [capabilityCards, setCapabilityCards] = useState<any[]>(DEFAULT_SKILLS_SECTION.capabilityCards);
  const [philosophyVisible, setPhilosophyVisible] = useState(true);
  const [philosophyTags, setPhilosophyTags] = useState<string[]>(DEFAULT_SKILLS_SECTION.philosophyTags);
  const [philosophyStrip, setPhilosophyStrip] = useState<any[]>([]);

  // ── KS Specific States ──────────────────────────────────────
  const [ksHeroTitle, setKsHeroTitle] = useState('SKILLS');
  const [ksHeroIntro, setKsHeroIntro] = useState('');
  const [ksUnderlineColor, setKsUnderlineColor] = useState('#06B6D4');
  const [ksUnderlineWidth, setKsUnderlineWidth] = useState(100);
  const [ksUnderlineGlow, setKsUnderlineGlow] = useState(true);

  const [ksStats, setKsStats] = useState<any[]>([
    { value: '10+', label: 'Projects Completed', color: 'text-cyan-400' },
    { value: 'MERN', label: 'Core Stack Focus', color: 'text-purple-400' },
    { value: 'Frontend', label: 'UI Specialist', color: 'text-pink-400' }
  ]);

  const [ksPipelineTitle, setKsPipelineTitle] = useState('Developer Pipeline');
  const [ksPipelineSubtitle, setKsPipelineSubtitle] = useState('MERN WORKFLOW INTEGRATION');
  const [ksPipelineStatus, setKsPipelineStatus] = useState('ACTIVE');

  const [ksCapabilities, setKsCapabilities] = useState<any[]>([]);
  const [ksTechStrip, setKsTechStrip] = useState<any[]>([]);

  // ── MS Specific States ──────────────────────────────────────
  const isMS = activePortfolio === 'mahi';
  const [msActiveTab, setMsActiveTab] = useState<'hero' | 'orbit' | 'matrix' | 'grid'>('hero');
  const [msBadge, setMsBadge] = useState('SKILLS & TECHNOLOGIES');
  const [msHeading, setMsHeading] = useState('SYSTEM CAPABILITIES');
  const [msDescription, setMsDescription] = useState('A combination of modern development tools, problem-solving skills, and continuously evolving technologies.');
  
  const [msOrbitTitle, setMsOrbitTitle] = useState('Mahi Singh');
  const [msOrbitSubtitle, setMsOrbitSubtitle] = useState('Full Stack + AI');
  const [msOrbitDescription, setMsOrbitDescription] = useState('Creating premium user interfaces, analytical backend architectures, and intelligent systems.');
  const [msOrbitRadius, setMsOrbitRadius] = useState(185);
  const [msGlowIntensity, setMsGlowIntensity] = useState(75);
  const [msRotationSpeed, setMsRotationSpeed] = useState(25);
  const [msOrbitSkills, setMsOrbitSkills] = useState<any[]>([]);
  
  const [msCapabilities, setMsCapabilities] = useState<any[]>([]);
  const [msTechStacks, setMsTechStacks] = useState<any[]>([]);

  // Temporary item creation states for MS Orbit/Matrix/Grid
  const [newOrbitSkillName, setNewOrbitSkillName] = useState('');
  const [newOrbitSkillAngle, setNewOrbitSkillAngle] = useState(0);
  const [newOrbitSkillRing, setNewOrbitSkillRing] = useState<1 | 2>(1);
  const [newOrbitSkillHex, setNewOrbitSkillHex] = useState('#fb923c');
  const [newOrbitSkillBgGrad, setNewOrbitSkillBgGrad] = useState('from-[#fb923c]/10 via-[#7c2d12]/5 to-black/60');
  const [newOrbitSkillBorder, setNewOrbitSkillBorder] = useState('border-[#fb923c]/25 hover:border-[#fb923c]/60');
  
  const [newCapabilityTitle, setNewCapabilityTitle] = useState('');
  const [newCapabilityShortDesc, setNewCapabilityShortDesc] = useState('');
  const [newCapabilityIcon, setNewCapabilityIcon] = useState('Layers');
  const [newCapabilityAccent, setNewCapabilityAccent] = useState('purple');
  const [newCapabilityTags, setNewCapabilityTags] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySkills, setNewCategorySkills] = useState('');

  // ── Card editor state ──────────────────────────────────────
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Establish real-time socket link
  useEffect(() => {
    if (user?.portfolioSlug) {
      const s = io('http://localhost:5000');
      s.emit('portfolio:join', user.portfolioSlug);
      setSocket(s);
      return () => {
        s.disconnect();
      };
    }
  }, [user?.portfolioSlug]);

  // ── Tech Grid state (legacy) ───────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(7);
  const [category, setCategory] = useState('Frontend');

  // ── Loading ────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [gridLoading, setGridLoading] = useState(false);

  // ── Initialize from profile ────────────────────────────────
  useEffect(() => {
    if (profile?.skillsSection) {
      const sec = typeof profile.skillsSection === 'string'
        ? JSON.parse(profile.skillsSection)
        : profile.skillsSection;

      setBadge(sec.badge || DEFAULT_SKILLS_SECTION.badge);
      setHeading(sec.heading || DEFAULT_SKILLS_SECTION.heading);
      setDescription(sec.description || DEFAULT_SKILLS_SECTION.description);
      setCapabilityCards(sec.capabilityCards || DEFAULT_SKILLS_SECTION.capabilityCards);
      setPhilosophyVisible(sec.philosophyVisible !== false);
      
      const tags = sec.philosophyTags || DEFAULT_SKILLS_SECTION.philosophyTags;
      setPhilosophyTags(tags);

      if (sec.philosophyStrip) {
        setPhilosophyStrip(sec.philosophyStrip);
      } else {
        // Fallback/Migration: convert tags to structured list
        const colors = ['purple', 'amber', 'emerald', 'blue'];
        const fallbackStrip = tags.map((t: string, i: number) => ({
          id: `philosophy-${i}-${Date.now()}`,
          text: t,
          color: colors[i % colors.length],
          visible: true,
          order: i + 1
        }));
        setPhilosophyStrip(fallbackStrip);
      }

      // Populate KS States
      const ksHero = sec.hero || {};
      setKsHeroTitle(ksHero.title || 'SKILLS');
      setKsHeroIntro(ksHero.intro || '');
      setKsUnderlineColor(ksHero.underlineColor || '#06B6D4');
      setKsUnderlineWidth(ksHero.underlineWidth ?? 100);
      setKsUnderlineGlow(ksHero.underlineGlow !== false);

      const ksProf = sec.profile || {};
      setKsStats(ksProf.stats || [
        { value: '10+', label: 'Projects Completed', color: 'text-cyan-400' },
        { value: 'MERN', label: 'Core Stack Focus', color: 'text-purple-400' },
        { value: 'Frontend', label: 'UI Specialist', color: 'text-pink-400' }
      ]);

      const ksPipe = sec.pipelineCard || {};
      setKsPipelineTitle(ksPipe.title || 'Developer Pipeline');
      setKsPipelineSubtitle(ksPipe.subtitle || 'MERN WORKFLOW INTEGRATION');
      setKsPipelineStatus(ksPipe.status || 'ACTIVE');

      setKsCapabilities(sec.capabilities || KS_DEFAULT_CAPABILITIES);
      setKsTechStrip(sec.techStrip || KS_DEFAULT_TECH_STRIP);

      // Populate MS States
      if (isMS) {
        setMsBadge(sec.badge || 'SKILLS & TECHNOLOGIES');
        setMsHeading(sec.heading || 'SYSTEM CAPABILITIES');
        setMsDescription(sec.description || 'A combination of modern development tools, problem-solving skills, and continuously evolving technologies.');
        
        setMsOrbitTitle(sec.orbitTitle || 'Mahi Singh');
        setMsOrbitSubtitle(sec.orbitSubtitle || 'Full Stack + AI');
        setMsOrbitDescription(sec.orbitDescription || 'Creating premium user interfaces, analytical backend architectures, and intelligent systems.');
        setMsOrbitRadius(sec.orbitRadius ?? 185);
        setMsGlowIntensity(sec.orbitGlow ?? 75);
        setMsRotationSpeed(sec.orbitSpeed ?? 25);
        setMsOrbitSkills(sec.orbitSkills || [
          { name: "React.js", angle: 0, ring: 1, bgGradient: "from-[#00d8ff]/10 via-[#00517c]/5 to-black/60", borderClass: "border-[#00d8ff]/25 hover:border-[#00d8ff]/60", glowColor: "rgba(0, 216, 255, 0.35)", glowHex: "#00d8ff", bulletBg: "bg-[#00d8ff]", textColor: "text-[#bfefff] group-hover:text-[#00d8ff]" },
          { name: "Python", angle: 90, ring: 1, bgGradient: "from-[#ffd43b]/10 via-[#306998]/5 to-black/60", borderClass: "border-[#ffd43b]/25 hover:border-[#ffd43b]/60", glowColor: "rgba(255, 212, 59, 0.25)", glowHex: "#ffd43b", bulletBg: "bg-[#ffd43b]", textColor: "text-[#fff2b2] group-hover:text-[#ffd43b]" },
          { name: "Java", angle: 180, ring: 1, bgGradient: "from-[#f89820]/15 via-[#7a4c16]/5 to-black/60", borderClass: "border-[#f89820]/25 hover:border-[#f89820]/60", glowColor: "rgba(248, 152, 32, 0.3)", glowHex: "#f89820", bulletBg: "bg-[#f89820]", textColor: "text-[#ffe2bf] group-hover:text-[#f89820]" },
          { name: "MongoDB", angle: 270, ring: 1, bgGradient: "from-[#13aa52]/10 via-[#0a381c]/5 to-black/60", borderClass: "border-[#13aa52]/25 hover:border-[#13aa52]/60", glowColor: "rgba(19, 170, 82, 0.3)", glowHex: "#13aa52", bulletBg: "bg-[#13aa52]", textColor: "text-[#c2ffd9] group-hover:text-[#13aa52]" },
          { name: "AWS", angle: 45, ring: 2, bgGradient: "from-[#ff9900]/15 via-[#54360b]/5 to-black/60", borderClass: "border-[#ff9900]/25 hover:border-[#ff9900]/60", glowColor: "rgba(255, 153, 0, 0.3)", glowHex: "#ff9900", bulletBg: "bg-[#ff9900]", textColor: "text-[#ffe9cc] group-hover:text-[#ff9900]" },
          { name: "DSA", angle: 135, ring: 2, bgGradient: "from-[#fb923c]/10 via-[#7c2d12]/5 to-black/60", borderClass: "border-[#fb923c]/25 hover:border-[#fb923c]/60", glowColor: "rgba(251, 146, 60, 0.3)", glowHex: "#fb923c", bulletBg: "bg-[#fb923c]", textColor: "text-[#ffedd5] group-hover:text-[#fb923c]" },
          { name: "Next.js", angle: 225, ring: 2, bgGradient: "from-white/10 via-white/5 to-black/60", borderClass: "border-white/20 hover:border-white/50", glowColor: "rgba(255, 255, 255, 0.2)", glowHex: "#ffffff", bulletBg: "bg-white", textColor: "text-[#e5e5e5] group-hover:text-white" },
          { name: "UI/UX", angle: 315, ring: 2, bgGradient: "from-[#a855f7]/10 via-[#5c2196]/5 to-black/60", borderClass: "border-[#a855f7]/25 hover:border-[#ec4899]/60", glowColor: "rgba(168, 85, 247, 0.3)", glowHex: "#a855f7", bulletBg: "bg-[#ec4899]", textColor: "text-[#fcd4ff] group-hover:text-[#ec4899]" }
        ]);
        setMsCapabilities(sec.capabilityCards || [
          { id: "01", title: "Frontend Development", shortDescription: "Responsive React interfaces, Tailwind systems, animations, and modern UI architecture.", icon: "Layout", tags: ["React", "Tailwind", "Motion", "UI/UX"], accentColor: "purple", order: 1, enabled: true },
          { id: "02", title: "AI & Data", shortDescription: "Exploring AI-driven systems, structured datasets, and analytical problem solving.", icon: "Database", tags: ["Gemini API", "Python", "Data Structures"], accentColor: "cyan", order: 2, enabled: true },
          { id: "03", title: "Backend Systems", shortDescription: "Building APIs, database logic, and scalable backend integrations.", icon: "Cpu", tags: ["Node.js", "Express", "MongoDB", "REST APIs"], accentColor: "emerald", order: 3, enabled: true },
          { id: "04", title: "Problem Solving", shortDescription: "Building strong logical foundations through DSA, systems thinking, and scalable architecture exploration.", icon: "Terminal", tags: ["Java", "Algorithms", "DSA Core", "Complexity Tuning"], accentColor: "amber", order: 4, enabled: true }
        ]);
        setMsTechStacks(sec.techStacks || [
          { category: "Frontend", skills: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"] },
          { category: "Backend", skills: ["Node.js", "Express.js", "REST APIs", "FastAPI"] },
          { category: "Databases", skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis"] },
          { category: "Languages & Tools", skills: ["Python", "Java", "TypeScript", "Git", "GitHub", "AWS"] }
        ]);
      }
    } else {
      // Direct defaults fallback if skillsSection is entirely blank
      setKsCapabilities(KS_DEFAULT_CAPABILITIES);
      setKsTechStrip(KS_DEFAULT_TECH_STRIP);
    }
  }, [profile, isKS, isMS]);

  /* ── REAL-TIME SOCKET BROADCASTER ────────────────────────── */
  const emitPhilosophyStripUpdate = (updatedStrip: any[]) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('philosophy:update', {
        slug: user.portfolioSlug,
        philosophyStrip: updatedStrip.map((item, idx) => ({ ...item, order: idx + 1 }))
      });
    }
  };

  /* ── SAVE skillsSection ─────────────────────────────────── */
  const saveSkillsSection = async () => {
    setSaving(true);
    try {
      let payload = {};
      if (isKS) {
        payload = {
          skillsSection: {
            hero: {
              title: ksHeroTitle,
              intro: ksHeroIntro,
              underlineColor: ksUnderlineColor,
              underlineWidth: ksUnderlineWidth,
              underlineGlow: ksUnderlineGlow
            },
            profile: {
              stats: ksStats
            },
            pipelineCard: {
              title: ksPipelineTitle,
              subtitle: ksPipelineSubtitle,
              status: ksPipelineStatus
            },
            capabilities: ksCapabilities,
            techStrip: ksTechStrip,
            visible: true
          }
        };
      } else if (isMS) {
        payload = {
          skillsSection: {
            badge: msBadge,
            heading: msHeading,
            description: msDescription,
            orbitTitle: msOrbitTitle,
            orbitSubtitle: msOrbitSubtitle,
            orbitDescription: msOrbitDescription,
            orbitRadius: msOrbitRadius,
            orbitGlow: msGlowIntensity,
            orbitSpeed: msRotationSpeed,
            orbitSkills: msOrbitSkills,
            capabilityCards: msCapabilities.map((c, i) => ({ ...c, order: i + 1 })),
            techStacks: msTechStacks,
            visible: true
          }
        };
      } else {
        const savedStrip = philosophyStrip.map((item, i) => ({ ...item, order: i + 1 }));
        payload = {
          skillsSection: {
            badge,
            heading,
            description,
            capabilityCards: capabilityCards.map((c, i) => ({ ...c, order: i })),
            philosophyVisible,
            philosophyStrip: savedStrip,
            // Sync tags for fallback compatibility
            philosophyTags: savedStrip.filter(item => item.visible).map(item => item.text),
          }
        };
      }
      await api.patch('/portfolio/profile', payload);
      
      // Emit absolute final update state via sockets to synchronize
      if (socket && user?.portfolioSlug) {
        if (!isKS) {
          const savedStrip = philosophyStrip.map((item, i) => ({ ...item, order: i + 1 }));
          socket.emit('philosophy:update', {
            slug: user.portfolioSlug,
            philosophyStrip: savedStrip
          });
        }
        socket.emit('skills:update', {
          slug: user.portfolioSlug,
          skillsSection: (payload as any).skillsSection
        });
      }

      setSuccess('Skills module updated live! 🚀');
      await fetchEverything();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── CAPABILITY CARDS helpers ───────────────────────────── */
  const updateCard = (id: string, field: string, value: any) => {
    setCapabilityCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateCardDetailList = (id: string, field: string, index: number, value: string) => {
    setCapabilityCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      const list = [...(c[field] || [])];
      list[index] = value;
      return { ...c, [field]: list };
    }));
  };

  const addDetailToCard = (id: string, field: string) => {
    setCapabilityCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, [field]: [...(c[field] || []), 'New detail item'] };
    }));
  };

  const removeDetailFromCard = (id: string, field: string, index: number) => {
    setCapabilityCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, [field]: (c[field] || []).filter((_: any, i: number) => i !== index) };
    }));
  };

  const addChipToCard = (id: string, chip: string) => {
    if (!chip.trim()) return;
    setCapabilityCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      const existing = c.technologies || [];
      if (existing.includes(chip.trim())) return c;
      return { ...c, technologies: [...existing, chip.trim()] };
    }));
  };

  const removeChipFromCard = (id: string, chip: string) => {
    setCapabilityCards(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, technologies: (c.technologies || []).filter((t: string) => t !== chip) };
    }));
  };

  const moveCard = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= capabilityCards.length) return;
    const copy = [...capabilityCards];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setCapabilityCards(copy);
  };

  const addCapabilityCard = () => {
    const newCard = {
      ...DEFAULT_CAPABILITY_CARD,
      id: `card-${Date.now()}`,
      order: capabilityCards.length,
    };
    setCapabilityCards(prev => [...prev, newCard]);
    setExpandedCardId(newCard.id);
  };

  const removeCapabilityCard = (id: string) => {
    setCapabilityCards(prev => prev.filter(c => c.id !== id));
    if (expandedCardId === id) setExpandedCardId(null);
  };

  /* ── PHILOSOPHY STRIP helpers ────────────────────────────── */
  const addPhilosophyItem = () => {
    const newItem = {
      id: `philosophy-${Date.now()}`,
      text: 'NEW BRAND PHILOSOPHY',
      color: 'purple',
      visible: true,
      order: philosophyStrip.length + 1
    };
    const updated = [...philosophyStrip, newItem];
    setPhilosophyStrip(updated);
    emitPhilosophyStripUpdate(updated);
  };

  const removePhilosophyItem = (id: string) => {
    const updated = philosophyStrip.filter(item => item.id !== id);
    setPhilosophyStrip(updated);
    emitPhilosophyStripUpdate(updated);
  };

  const updatePhilosophyItem = (id: string, field: string, value: any) => {
    const updated = philosophyStrip.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setPhilosophyStrip(updated);
    emitPhilosophyStripUpdate(updated);
  };

  const movePhilosophyItem = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= philosophyStrip.length) return;
    const copy = [...philosophyStrip];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setPhilosophyStrip(copy);
    emitPhilosophyStripUpdate(copy);
  };

  /* ── TECH GRID (legacy skill CRUD) ─────────────────────── */
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGridLoading(true);
    try {
      await api.post('/skills', { skillName, skillLevel, category });
      setSuccess('Technical skill added!');
      setSkillName(''); setSkillLevel(7); setIsFormOpen(false);
      await fetchEverything();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally { setGridLoading(false); }
  };

  const handleSkillDelete = async () => {
    if (!selectedSkillId) return;
    setGridLoading(true);
    try {
      await api.delete(`/skills/${selectedSkillId}`);
      setSuccess('Skill removed!');
      setIsConfirmOpen(false); setSelectedSkillId(null);
      await fetchEverything();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete skill');
    } finally { setGridLoading(false); }
  };

  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  /* ──────────────────────────────────────────────────────────
     CARD EDITOR COMPONENT (inline)
  ────────────────────────────────────────────────────────── */
  const CardEditor = ({ card, index }: { card: any; index: number }) => {
    const isExpanded = expandedCardId === card.id;
    const color = COLOR_OPTIONS.find(c => c.id === card.accentColor) || COLOR_OPTIONS[0];
    const [chipInput, setChipInput] = useState('');

    const detailSections = [
      { field: 'focusDetails', label: 'Core Focus Details' },
      { field: 'workflowDetails', label: 'Workflow Details' },
      { field: 'archDetails', label: 'Architecture Details' },
    ];

    return (
      <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isExpanded ? `${color.border} bg-card` : 'border-border bg-card hover:border-border/80'
      }`}>
        {/* Card Header Row */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer select-none"
          onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />

          {/* Color dot + icon */}
          <div className={`p-2 rounded-lg ${color.bg} shrink-0`}>
            <DynIcon name={card.icon} className={`w-4 h-4 ${color.text}`} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{card.title}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Level {card.experienceLevel}/10 · {card.accentColor} · {(card.technologies || []).length} chips
            </p>
          </div>

          {/* Visibility toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); updateCard(card.id, 'visible', !card.visible); }}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              card.visible ? 'text-primary/80 hover:text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'
            }`}
          >
            {card.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Order controls */}
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); moveCard(index, 'up'); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ArrowUp className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); moveCard(index, 'down'); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); removeCapabilityCard(card.id); }}
            className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/20 text-red-400/60 hover:text-red-400 border border-red-500/0 hover:border-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand chevron */}
          <div className="text-muted-foreground/50">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* Expanded Edit Panel */}
        {isExpanded && (
          <div className="border-t border-border px-4 md:px-5 pb-5 md:pb-6 pt-4 md:pt-5 space-y-3.5 md:space-y-5">

            {/* Row 1: Title + Metric */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  <Type className="w-3 h-3 inline mr-1" />Domain Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-sm text-foreground transition-all"
                  placeholder="e.g. Backend Architecture"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  <Star className="w-3 h-3 inline mr-1" />Metric Indicator
                </label>
                <input
                  type="text"
                  value={card.metricIndicator}
                  onChange={(e) => updateCard(card.id, 'metricIndicator', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-sm text-foreground transition-all"
                  placeholder="e.g. 12+ Production Builds"
                />
              </div>
            </div>

            {/* Row 2: Icon + Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
              {/* Icon Picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <Settings2 className="w-3 h-3 inline mr-1" />Domain Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => updateCard(card.id, 'icon', opt.id)}
                      title={opt.label}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        card.icon === opt.id
                          ? 'bg-primary/20 border-primary/40 text-primary'
                          : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                      }`}
                    >
                      <DynIcon name={opt.id} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <Palette className="w-3 h-3 inline mr-1" />Accent Color
                </label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => updateCard(card.id, 'accentColor', opt.id)}
                      title={opt.label}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        card.accentColor === opt.id
                          ? `${opt.bg} ${opt.border} ${opt.text}`
                          : 'bg-background border-border text-muted-foreground hover:border-border/80'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Experience Level */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Experience Level
                </label>
                <span className={`text-xs font-black font-mono ${color.text}`}>{card.experienceLevel} / 10</span>
              </div>
              {/* Block meter visual */}
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateCard(card.id, 'experienceLevel', i + 1)}
                    className={`h-2.5 flex-1 rounded-sm transition-all cursor-pointer ${
                      i < card.experienceLevel ? color.dot : 'bg-muted border border-border/20'
                    }`}
                  />
                ))}
              </div>
              <input
                type="range" min="1" max="10"
                value={card.experienceLevel}
                onChange={(e) => updateCard(card.id, 'experienceLevel', parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Row 4: Technology Chips */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <Tag className="w-3 h-3 inline mr-1" />Technology Chips
              </label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                {(card.technologies || []).map((chip: string) => (
                  <span
                    key={chip}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold ${color.bg} ${color.text} border ${color.border}`}
                  >
                    {chip}
                    <button
                      onClick={() => removeChipFromCard(card.id, chip)}
                      className="hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chipInput}
                  onChange={(e) => setChipInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChipToCard(card.id, chipInput); setChipInput(''); } }}
                  placeholder="Add technology chip (Enter to add)..."
                  className="flex-1 bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-xs text-foreground transition-all"
                />
                <button
                  onClick={() => { addChipToCard(card.id, chipInput); setChipInput(''); }}
                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-lg font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Row 5: Focus / Workflow / Architecture detail lists */}
            {detailSections.map(({ field, label }) => (
              <div key={field}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <List className="w-3 h-3 inline mr-1" />{label}
                </label>
                <div className="space-y-2">
                  {(card[field] || []).map((detail: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className={`mt-2.5 h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => updateCardDetailList(card.id, field, idx, e.target.value)}
                        className="flex-1 bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-xs text-foreground transition-all"
                      />
                      <button
                        onClick={() => removeDetailFromCard(card.id, field, idx)}
                        className="p-2 text-muted-foreground/40 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addDetailToCard(card.id, field)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add {label.split(' ')[0]} item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────────── */
  if (isKS) {
    // ── KS cms inline action helpers ──────────────────────────
    const addKsCap = () => {
      const newCap = {
        id: Date.now(),
        title: "New Capability Domain",
        shortDesc: "Immersive system description",
        detailedDesc: "Detailed engineering specifications regarding this dynamic technical layer.",
        icon: "Code",
        technologies: ["React", "JavaScript"],
        skills: [
          { name: "Engineering Logic", level: 85 },
          { name: "System Stability", level: 90 }
        ],
        gradientClass: "from-cyan-400 to-blue-500",
        glowColor: "rgba(34, 211, 238, 0.15)",
        accentColor: "text-cyan-400"
      };
      setKsCapabilities([...ksCapabilities, newCap]);
    };

    const removeKsCap = (id: number) => {
      setKsCapabilities(ksCapabilities.filter(c => c.id !== id));
      if (expandedCardId === String(id)) setExpandedCardId(null);
    };

    const updateKsCap = (id: number, field: string, value: any) => {
      setKsCapabilities(ksCapabilities.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const updateKsCapSkill = (capId: number, skillIdx: number, field: string, value: any) => {
      setKsCapabilities(ksCapabilities.map(c => {
        if (c.id !== capId) return c;
        const copySkills = [...c.skills];
        copySkills[skillIdx] = { ...copySkills[skillIdx], [field]: value };
        return { ...c, skills: copySkills };
      }));
    };

    const addKsCapSkill = (capId: number) => {
      setKsCapabilities(ksCapabilities.map(c => {
        if (c.id !== capId) return c;
        return { ...c, skills: [...c.skills, { name: "New Proficiency Indicator", level: 80 }] };
      }));
    };

    const removeKsCapSkill = (capId: number, skillIdx: number) => {
      setKsCapabilities(ksCapabilities.map(c => {
        if (c.id !== capId) return c;
        return { ...c, skills: c.skills.filter((_: any, idx: number) => idx !== skillIdx) };
      }));
    };

    const addKsCapTech = (capId: number, tech: string) => {
      if (!tech.trim()) return;
      setKsCapabilities(ksCapabilities.map(c => {
        if (c.id !== capId) return c;
        if (c.technologies.includes(tech.trim())) return c;
        return { ...c, technologies: [...c.technologies, tech.trim()] };
      }));
    };

    const removeKsCapTech = (capId: number, tech: string) => {
      setKsCapabilities(ksCapabilities.map(c => {
        if (c.id !== capId) return c;
        return { ...c, technologies: c.technologies.filter((t: string) => t !== tech) };
      }));
    };

    const moveKsCap = (idx: number, direction: 'up' | 'down') => {
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= ksCapabilities.length) return;
      const copy = [...ksCapabilities];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      setKsCapabilities(copy);
    };

    // Marquee helpers
    const addKsMarqueeItem = (name: string, color: string) => {
      if (!name.trim()) return;
      setKsTechStrip([...ksTechStrip, { name: name.trim(), color: color || '#CCCCCC', enabled: true }]);
    };

    const removeKsMarqueeItem = (idx: number) => {
      setKsTechStrip(ksTechStrip.filter((_, i) => i !== idx));
    };

    const updateKsMarqueeItem = (idx: number, field: string, value: any) => {
      setKsTechStrip(ksTechStrip.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    const moveKsMarqueeItem = (idx: number, direction: 'up' | 'down') => {
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= ksTechStrip.length) return;
      const copy = [...ksTechStrip];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      setKsTechStrip(copy);
    };

    const GRADIENT_PRESETS = [
      { label: 'Cyan to Blue', value: 'from-cyan-400 to-blue-500', glow: 'rgba(34, 211, 238, 0.15)', text: 'text-cyan-400' },
      { label: 'Purple to Pink', value: 'from-purple-400 to-pink-500', glow: 'rgba(192, 132, 252, 0.15)', text: 'text-purple-400' },
      { label: 'Emerald to Cyan', value: 'from-emerald-400 to-cyan-500', glow: 'rgba(52, 211, 153, 0.15)', text: 'text-emerald-400' },
      { label: 'Orange to Red', value: 'from-orange-400 to-red-500', glow: 'rgba(251, 146, 60, 0.15)', text: 'text-orange-400' },
      { label: 'Blue to Indigo', value: 'from-blue-400 to-indigo-500', glow: 'rgba(59, 130, 246, 0.15)', text: 'text-blue-400' }
    ];

    return (
      <div className="min-h-[85vh] flex flex-col relative select-text text-left">
        <style>{`
          .coordinate-grid {
            background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .custom-range::-webkit-slider-runnable-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            height: 4px;
          }
          .custom-range::-webkit-slider-thumb {
            background: #06B6D4;
            border-radius: 9999px;
            width: 14px;
            height: 14px;
            margin-top: -5px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .custom-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-slow {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        
        {/* Top Sync / Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-4 sm:mb-6 relative z-25 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest leading-none heading-font">KS SKILLS MANAGER</h1>
              <span className="text-[7px] sm:text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">VISUAL CMS & DYNAMIC ECOSYSTEM BUILDER</span>
            </div>
          </div>
          
          <div className="w-full h-px bg-neutral-800/40 sm:hidden my-0.5" />
          
          <div className="w-full sm:w-auto">
            <button
              onClick={saveSkillsSection}
              disabled={saving}
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-cyan-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Publishing Matrix..." : "SYNC LIVE"}</span>
            </button>
          </div>
        </div>

        {/* Split screen content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start relative z-10 animate-fade-in">
          
          {/* ======================================================= */}
          {/* ============ LEFT SIDE: EDITABLE CONTROLS ============= */}
          {/* ======================================================= */}
          <div className="xl:col-span-7 space-y-3.5 md:space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-none pb-12">
            
            {/* 1. HERO CONTROLS CARD */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                <Type className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white heading-font">Section Hero Headings</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Hero Section Title</label>
                  <input
                    type="text"
                    value={ksHeroTitle}
                    onChange={(e) => setKsHeroTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white transition-all font-bold"
                    placeholder="e.g. SKILLS"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Hero Introduction Subtitle</label>
                  <textarea
                    value={ksHeroIntro}
                    onChange={(e) => setKsHeroIntro(e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white transition-all resize-none leading-relaxed"
                    placeholder="Brief description of the tech workspace..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-900 pt-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Underline Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={ksUnderlineColor}
                        onChange={(e) => setKsUnderlineColor(e.target.value)}
                        className="w-8 h-8 bg-transparent border-0 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={ksUnderlineColor}
                        onChange={(e) => setKsUnderlineColor(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-2.5 py-1.5 rounded-lg text-[10px] text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Underline Width ({ksUnderlineWidth}px)</label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={ksUnderlineWidth}
                      onChange={(e) => setKsUnderlineWidth(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-cyan-400 mt-3"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Glow Overlay Effect</label>
                    <button
                      onClick={() => setKsUnderlineGlow(!ksUnderlineGlow)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[9px] font-bold tracking-widest uppercase transition-all w-fit cursor-pointer ${
                        ksUnderlineGlow 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{ksUnderlineGlow ? "Glow ON" : "Glow OFF"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BENTO STATS CARD */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                <Layers className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white heading-font">Profile Overview Stats Cards</h3>
              </div>

              <div className="space-y-4">
                {ksStats.map((stat, sIdx) => (
                  <div key={sIdx} className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Card {sIdx + 1} Big Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...ksStats];
                          updated[sIdx].value = e.target.value;
                          setKsStats(updated);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-black"
                        placeholder="e.g. 10+"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Card {sIdx + 1} Descriptive Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...ksStats];
                          updated[sIdx].label = e.target.value;
                          setKsStats(updated);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. Projects Completed"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Color Theme Preset</label>
                      <select
                        value={stat.color}
                        onChange={(e) => {
                          const updated = [...ksStats];
                          updated[sIdx].color = e.target.value;
                          setKsStats(updated);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                      >
                        <option value="text-cyan-400">Cyan Neon</option>
                        <option value="text-purple-400">Purple Galactic</option>
                        <option value="text-pink-400">Fuchsia Spotlight</option>
                        <option value="text-amber-400">Molten Orange</option>
                        <option value="text-emerald-400">Digital Emerald</option>
                        <option value="text-blue-400">Deep Blue</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PIPELINE STRIP CARD */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                <Activity className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white heading-font">Pipeline Status Card</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Pipeline Label</label>
                  <input
                    type="text"
                    value={ksPipelineTitle}
                    onChange={(e) => setKsPipelineTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    placeholder="Developer Pipeline"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Stack Pipeline Info</label>
                  <input
                    type="text"
                    value={ksPipelineSubtitle}
                    onChange={(e) => setKsPipelineSubtitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    placeholder="MERN WORKFLOW INTEGRATION"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">Active Status Label</label>
                  <input
                    type="text"
                    value={ksPipelineStatus}
                    onChange={(e) => setKsPipelineStatus(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-mono font-bold"
                    placeholder="ACTIVE"
                  />
                </div>
              </div>
            </div>

            {/* 4. CAPABILITY ACCORDIONS BUILDER */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-2xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4.5 h-4.5 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white heading-font">Capability Cards</h3>
                </div>
                <button
                  onClick={addKsCap}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-600 hover:bg-cyan-950/70 text-cyan-400 text-[10px] font-mono tracking-widest font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Domain</span>
                </button>
              </div>

              <div className="space-y-4">
                {ksCapabilities.map((cap, cIdx) => {
                  const isExpanded = expandedCardId === String(cap.id);
                  const activePreset = GRADIENT_PRESETS.find(p => p.value === cap.gradientClass) || GRADIENT_PRESETS[0];
                  
                  return (
                    <div key={cap.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? `border-neutral-750 bg-neutral-900/20` : 'border-neutral-900 bg-neutral-950/20 hover:border-neutral-850'
                    }`}>
                      {/* Accordion header */}
                      <div
                        onClick={() => setExpandedCardId(isExpanded ? null : String(cap.id))}
                        className="flex items-center gap-3 p-4 cursor-pointer select-none"
                      >
                        <GripVertical className="w-4 h-4 text-neutral-600 shrink-0" />
                        <div className={`p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 shrink-0`}>
                          <DynIcon name={cap.icon || 'Code'} className="w-4 h-4 text-cyan-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{cap.title}</p>
                          <p className="text-[9px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wide">
                            <span className="hidden sm:inline">{cap.shortDesc ? `${cap.shortDesc} · ` : ''}</span>
                            {(cap.technologies || []).length} Chips · {(cap.skills || []).length} Meters
                          </p>
                        </div>

                        {/* Order Actions */}
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => moveKsCap(cIdx, 'up')} className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all cursor-pointer">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => moveKsCap(cIdx, 'down')} className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all cursor-pointer">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Delete Action */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeKsCap(cap.id); }}
                          className="p-1.5 rounded-lg bg-red-950/10 hover:bg-red-950/30 text-red-500/55 hover:text-red-400 border border-red-500/0 transition-all cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-neutral-600 shrink-0">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Accordion content */}
                      {isExpanded && (
                        <div className="border-t border-neutral-900 px-4 md:px-5 pb-5 md:pb-6 pt-4 md:pt-5 space-y-3.5 md:space-y-5 bg-neutral-950/40">
                          
                          {/* Row 1: Title & Short Desc */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Domain Title</label>
                              <input
                                type="text"
                                value={cap.title}
                                onChange={(e) => updateKsCap(cap.id, 'title', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-850 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                                placeholder="Frontend Engineering"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Sub-label (Short Desc)</label>
                              <input
                                type="text"
                                value={cap.shortDesc}
                                onChange={(e) => updateKsCap(cap.id, 'shortDesc', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-850 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                                placeholder="Creating immersive, high-performance UI systems"
                              />
                            </div>
                          </div>

                          {/* Row 2: Detailed Textarea */}
                          <div>
                            <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Detailed Spec Narrative</label>
                            <textarea
                              value={cap.detailedDesc}
                              onChange={(e) => updateKsCap(cap.id, 'detailedDesc', e.target.value)}
                              rows={3}
                              className="w-full bg-neutral-900 border border-neutral-850 focus:border-cyan-500 focus:outline-none px-3 py-2 rounded-xl text-xs text-white resize-none leading-relaxed"
                              placeholder="Describe the specialized tools, systems, and structures engineered..."
                            />
                          </div>

                          {/* Row 3: Icon & Visual Preset */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-2">Domain Icon (Lucide)</label>
                              <div className="flex flex-wrap gap-1.5">
                                {['Layers', 'Terminal', 'Database', 'Cpu', 'Sparkles', 'Activity', 'Code2', 'FolderGit2', 'BadgeAlert'].map(ico => (
                                  <button
                                    key={ico}
                                    onClick={() => updateKsCap(cap.id, 'icon', ico)}
                                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                      cap.icon === ico 
                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                        : 'bg-neutral-900 border-neutral-850 text-neutral-500 hover:text-white'
                                    }`}
                                  >
                                    <DynIcon name={ico} className="w-3.5 h-3.5" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-2">Gradient Accent Preset</label>
                              <div className="flex flex-wrap gap-2">
                                {GRADIENT_PRESETS.map((preset, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      updateKsCap(cap.id, 'gradientClass', preset.value);
                                      updateKsCap(cap.id, 'glowColor', preset.glow);
                                      updateKsCap(cap.id, 'accentColor', preset.text);
                                    }}
                                    className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                                      cap.gradientClass === preset.value
                                        ? 'bg-neutral-850 border-cyan-500 text-cyan-400 shadow-sm'
                                        : 'bg-neutral-900 border-neutral-850 text-neutral-500 hover:text-white'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${preset.value}`} />
                                    <span>{preset.label.split(' ')[0]}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Row 4: Dynamic Proficiency Progress Bars */}
                          <div className="border-t border-neutral-900 pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500">Skill Proficiency Meters</label>
                              <button
                                onClick={() => addKsCapSkill(cap.id)}
                                className="text-[9px] font-mono tracking-widest uppercase text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 border-none bg-transparent cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Meter</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(cap.skills || []).map((skill: any, skIdx: number) => (
                                <div key={skIdx} className="bg-neutral-900/30 border border-neutral-850/60 p-3 rounded-xl flex flex-col md:flex-row gap-3 items-center">
                                  <div className="w-full md:w-3/5">
                                    <input
                                      type="text"
                                      value={skill.name}
                                      onChange={(e) => updateKsCapSkill(cap.id, skIdx, 'name', e.target.value)}
                                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-2.5 py-1 rounded-lg text-xs text-white"
                                      placeholder="e.g. Component Architecture"
                                    />
                                  </div>

                                  <div className="w-full md:w-2/5 flex items-center gap-3">
                                    <input
                                      type="range"
                                      min="10"
                                      max="100"
                                      value={skill.level}
                                      onChange={(e) => updateKsCapSkill(cap.id, skIdx, 'level', parseInt(e.target.value))}
                                      className="w-full h-1 bg-neutral-850 rounded appearance-none cursor-pointer accent-cyan-400"
                                    />
                                    <span className="text-[10px] font-mono font-bold text-neutral-400 w-10 text-right shrink-0">{skill.level}%</span>
                                    
                                    <button
                                      onClick={() => removeKsCapSkill(cap.id, skIdx)}
                                      className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Row 5: Capability Technology Chips */}
                          <div className="border-t border-neutral-900 pt-4 space-y-3">
                            <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Capability Tech Stack Chips</label>
                            
                            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                              {(cap.technologies || []).map((t: string) => (
                                <span
                                  key={t}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5"
                                >
                                  <span>{t}</span>
                                  <button
                                    onClick={() => removeKsCapTech(cap.id, t)}
                                    className="p-0 border-none bg-transparent text-neutral-500 hover:text-white cursor-pointer"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter custom tech chip..."
                                className="flex-1 bg-neutral-900 border border-neutral-850 focus:border-cyan-500 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                                onKeyDown={(e: any) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addKsCapTech(cap.id, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. TECHNOLOGY MARQUEE STRIP EDITOR */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
                <Tag className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white heading-font">Bottom Tech Stack Marquee Strip</h3>
              </div>

              {/* Add Custom Marquee Item Input Form */}
              <div className="bg-neutral-900/40 p-4 border border-neutral-850 rounded-2xl space-y-3">
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">Add New Technology Keyword</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    id="new-marquee-name"
                    placeholder="e.g. Tailwind CSS"
                    className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-cyan-500 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      id="new-marquee-color"
                      defaultValue="#38BDF8"
                      className="w-8 h-8 bg-transparent border-0 rounded cursor-pointer shrink-0"
                    />
                    <button
                      onClick={() => {
                        const nameEl = document.getElementById('new-marquee-name') as HTMLInputElement;
                        const colorEl = document.getElementById('new-marquee-color') as HTMLInputElement;
                        if (nameEl && nameEl.value.trim()) {
                          addKsMarqueeItem(nameEl.value, colorEl.value);
                          nameEl.value = '';
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-550 text-cyan-400 text-xs font-bold font-mono tracking-widest uppercase transition-all cursor-pointer"
                    >
                      Add Strip
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {ksTechStrip.map((item, idx) => (
                  <div key={idx} className="bg-neutral-900/20 border border-neutral-900 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 border border-neutral-700/50"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-mono font-bold text-white truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateKsMarqueeItem(idx, 'enabled', !item.enabled)}
                        className={`p-1 rounded hover:bg-neutral-800 transition-all cursor-pointer ${item.enabled ? 'text-cyan-400' : 'text-neutral-600'}`}
                        title={item.enabled ? "Disable Marquee Display" : "Enable Marquee Display"}
                      >
                        {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      
                      <div className="flex gap-0.5">
                        <button onClick={() => moveKsMarqueeItem(idx, 'up')} className="p-0.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all cursor-pointer">
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveKsMarqueeItem(idx, 'down')} className="p-0.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all cursor-pointer">
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeKsMarqueeItem(idx)}
                        className="p-1 rounded hover:bg-red-950/20 text-neutral-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= ================= ================= */}
          {/* ============ RIGHT SIDE: LIVE SIMULATED PREVIEW ======= */}
          {/* ================= ================= ================= */}
          <div className="hidden xl:block xl:col-span-5 space-y-4 sticky top-6">
            <div className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative coordinate-grid pb-6 pt-4 px-4 flex flex-col justify-between min-h-[75vh]">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              
              {/* Simulated Device Frame Top */}
              <div className="flex justify-between items-center pb-3 border-b border-neutral-900 text-neutral-500 select-none px-2 mb-4">
                <span className="text-[7.5px] font-mono tracking-widest uppercase">LIVE PREVIEW INTERACTIVE MATRIX</span>
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                </div>
              </div>

              {/* simulated centered hero */}
              <div className="flex flex-col items-center justify-center text-center w-full mx-auto pb-6">
                <h2 className="text-xl font-black uppercase text-white tracking-widest leading-none bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent heading-font">
                  {ksHeroTitle}
                </h2>
                
                {ksHeroIntro && (
                  <p className="text-neutral-500 text-[8.5px] max-w-[280px] mt-2 font-medium text-center leading-normal">
                    {ksHeroIntro}
                  </p>
                )}

                <div 
                  className="h-[1.5px] mt-2.5 rounded-full"
                  style={{
                    width: `${ksUnderlineWidth * 0.7}px`,
                    background: `linear-gradient(to right, transparent, ${ksUnderlineColor}, transparent)`,
                    boxShadow: ksUnderlineGlow ? `0 0 8px ${ksUnderlineColor}` : 'none'
                  }}
                />
              </div>

              {/* simulated split section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start flex-1 px-1">
                
                {/* simulated bento identity */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-3 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-[45px] h-[45px] rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0">
                        <Code2 className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="heading-font font-bold text-white text-[11px] tracking-wide truncate">
                          {profile?.user?.name || "Khushaboo Saini"}
                        </h3>
                        <p className="text-neutral-500 text-[8px] truncate">
                          {profile?.headline || "Full Stack Developer"}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-neutral-400 text-[8px] leading-relaxed border-t border-white/[0.04] pt-2">
                      {profile?.bio || "Building scalable web applications..."}
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 border-t border-white/[0.04] pt-2">
                      {ksStats.map((stat, idx) => (
                        <div key={idx} className="bg-white/[0.01] border border-white/[0.03] p-1.5 rounded-lg flex flex-col justify-center text-center">
                          <span className={`text-[10px] font-black heading-font ${stat.color}`}>
                            {stat.value}
                          </span>
                          <span className="text-[6px] font-mono text-neutral-500 uppercase tracking-tight mt-0.5 leading-none truncate">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* simulated pipeline strip */}
                  <div className="bg-neutral-900/30 border border-white/5 p-2.5 rounded-xl flex items-center justify-between gap-2 backdrop-blur-md">
                    <div className="flex items-center gap-2 min-w-0">
                      <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-white text-[8px] font-mono font-bold uppercase truncate">{ksPipelineTitle}</h4>
                        <span className="text-neutral-500 text-[6.5px] font-mono uppercase block mt-0.5 truncate">{ksPipelineSubtitle}</span>
                      </div>
                    </div>
                    <span className="text-[7px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 bg-emerald-500/5 rounded-full border border-emerald-500/10 shrink-0">
                      {ksPipelineStatus}
                    </span>
                  </div>
                </div>

                {/* simulated capability accordion stack */}
                <div className="md:col-span-7 space-y-2">
                  {ksCapabilities.map((cap, capIdx) => {
                    const isSelected = expandedCardId === String(cap.id);
                    const gradientClass = cap.gradientClass || 'from-cyan-400 to-blue-500';
                    const accentColor = cap.accentColor || 'text-cyan-400';
                    
                    return (
                      <div
                        key={cap.id}
                        onClick={() => setExpandedCardId(isSelected ? null : String(cap.id))}
                        className={`bg-neutral-900/40 border transition-all rounded-xl cursor-pointer overflow-hidden relative ${
                          isSelected ? 'border-white/10 bg-neutral-950/60 shadow-lg' : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
                        }`}
                        style={{
                          boxShadow: isSelected ? `0 4px 15px -4px ${cap.glowColor || 'rgba(6,182,212,0.1)'}` : 'none'
                        }}
                      >
                        <div className={`absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b ${gradientClass} transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <div className="p-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-6 h-6 rounded-md bg-neutral-800 border border-neutral-750 flex items-center justify-center shrink-0 ${accentColor}`}>
                              <DynIcon name={cap.icon || 'Code'} className="w-3 h-3" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="heading-font font-bold text-white text-[9.5px] truncate">{cap.title}</h4>
                              <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest block truncate mt-0.5">{cap.shortDesc}</span>
                            </div>
                          </div>
                          <ChevronRight className={`w-3 h-3 text-neutral-500 shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                        </div>

                        {isSelected && (
                          <div className="px-2.5 pb-2.5 pt-1.5 border-t border-white/[0.03] space-y-3">
                            <p className="text-neutral-400 text-[8px] leading-relaxed">{cap.detailedDesc}</p>
                            
                            <div className="space-y-1.5">
                              {(cap.skills || []).map((skill: any, skIdx: number) => (
                                <div key={skIdx} className="space-y-0.5">
                                  <div className="flex justify-between items-center text-[7px] font-mono text-neutral-400">
                                    <span>{skill.name}</span>
                                    <span className={accentColor}>{skill.level}%</span>
                                  </div>
                                  <div className="w-full h-0.5 rounded-full bg-white/5 overflow-hidden">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`} style={{ width: `${skill.level}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {(cap.technologies || []).map((t: string, tIdx: number) => (
                                <span key={tIdx} className="px-1.5 py-0.5 text-[6.5px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-md">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* simulated sliding tape ticker */}
              <div className="border border-white/5 rounded-xl bg-neutral-950 p-2.5 relative overflow-hidden backdrop-blur-md mt-4 select-none">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />
                
                <div className="flex whitespace-nowrap overflow-hidden">
                  <div className="flex items-center animate-marquee-slow">
                    {ksTechStrip.filter(item => item.enabled !== false).map((item, i) => {
                      const isTailwind = item.color && (item.color.startsWith('text-') || item.color.startsWith('text-['));
                      return (
                        <div key={i} className="flex items-center gap-1.5 shrink-0 px-3 select-none">
                          <Sparkles className="w-2.5 h-2.5 text-neutral-500" />
                          <span 
                            className={`text-[8px] font-mono font-bold uppercase ${isTailwind ? item.color : ''}`}
                            style={!isTailwind ? { color: item.color } : {}}
                          >
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                    {/* duplicate */}
                    {ksTechStrip.filter(item => item.enabled !== false).map((item, i) => {
                      const isTailwind = item.color && (item.color.startsWith('text-') || item.color.startsWith('text-['));
                      return (
                        <div key={`dup-${i}`} className="flex items-center gap-1.5 shrink-0 px-3 select-none">
                          <Sparkles className="w-2.5 h-2.5 text-neutral-500" />
                          <span 
                            className={`text-[8px] font-mono font-bold uppercase ${isTailwind ? item.color : ''}`}
                            style={!isTailwind ? { color: item.color } : {}}
                          >
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
  if (isMS) {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        <style>{`
          .coordinate-grid-ms {
            background-image: radial-gradient(rgba(249, 115, 22, 0.04) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .custom-range-ms::-webkit-slider-runnable-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            height: 4px;
          }
          .custom-range-ms::-webkit-slider-thumb {
            background: #f97316;
            border-radius: 9999px;
            width: 14px;
            height: 14px;
            margin-top: -5px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .custom-range-ms::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
          }
        `}</style>

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 mb-6 relative z-20 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none heading-font">MS SKILLS ENGINE</h1>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">Dynamic Core Orbit & Compact Capability Matrix</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
            <button
              onClick={saveSkillsSection}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-orange-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Publishing Stack..." : "Publish Realtime Sync"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Select Dropdown */}
        <div className="block md:hidden mb-4 relative animate-fade-in w-full">
          <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Select Editing Tab
          </label>
          <select
            value={msActiveTab}
            onChange={(e) => setMsActiveTab(e.target.value as any)}
            className="w-full bg-[#070709] border border-neutral-800 focus:border-orange-500/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-white font-mono cursor-pointer appearance-none shadow-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            {[
              { id: 'hero', label: '1. Section Header' },
              { id: 'orbit', label: '2. Core Skill Orbit' },
              { id: 'matrix', label: '3. Capability Matrix' },
              { id: 'grid', label: '4. Tech Stack Grid' }
            ].map((t) => (
              <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Sub-navigation Tabs ─────────────────────────────── */}
        <div className="hidden md:flex flex-wrap gap-1 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-1.5 w-fit">
          {[
            { id: 'hero', label: 'Section Header', icon: Type },
            { id: 'orbit', label: 'Core Skill Orbit', icon: Activity },
            { id: 'matrix', label: 'Capability Matrix', icon: Layers },
            { id: 'grid', label: 'Tech Stack Grid', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isAct = msActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMsActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border-none ${
                  isAct 
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                    : 'bg-transparent text-zinc-500 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Split screen content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* LEFT COLUMN: EDITABLE CONTROLS */}
          <div className="lg:col-span-7 space-y-3.5 md:space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-none pb-12 no-scrollbar">
            
            {/* TAB 1: SECTION HEADER */}
            {msActiveTab === 'hero' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Type className="w-4 h-4 text-orange-400" />
                    <span>SECTION HEADER CONFIG</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Configure standard section headings and taglines.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Badge Label</label>
                    <input
                      type="text"
                      value={msBadge}
                      onChange={(e) => setMsBadge(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Main Heading</label>
                    <input
                      type="text"
                      value={msHeading}
                      onChange={(e) => setMsHeading(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Description Paragraph</label>
                    <textarea
                      value={msDescription}
                      onChange={(e) => setMsDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-sans resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CORE SKILL ORBIT */}
            {msActiveTab === 'orbit' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span>CORE SKILL ORBIT (RADAR COMPOSER)</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Configure Mahi's signature interactive skill graph, orbit rings, speed multipliers, and floating technology nodes.
                  </p>
                </div>

                {/* Section A: Hub Core Content */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION A — HUB CENTER CONTENT</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Center Title (Heading)</label>
                      <input
                        type="text"
                        value={msOrbitTitle}
                        onChange={(e) => setMsOrbitTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Center Subtitle</label>
                      <input
                        type="text"
                        value={msOrbitSubtitle}
                        onChange={(e) => setMsOrbitSubtitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Center Description</label>
                    <textarea
                      value={msOrbitDescription}
                      onChange={(e) => setMsOrbitDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-sans resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section B: Orbit Parameters */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION B — RADIAL GRAPH VARIABLES</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Orbit Radius</span>
                        <span className="text-orange-400 font-bold">{msOrbitRadius}px</span>
                      </div>
                      <input
                        type="range" min="120" max="240"
                        value={msOrbitRadius}
                        onChange={(e) => setMsOrbitRadius(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Glow intensity</span>
                        <span className="text-orange-400 font-bold">{msGlowIntensity}%</span>
                      </div>
                      <input
                        type="range" min="30" max="100"
                        value={msGlowIntensity}
                        onChange={(e) => setMsGlowIntensity(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Rotation Speed</span>
                        <span className="text-orange-400 font-bold">{msRotationSpeed}s</span>
                      </div>
                      <input
                        type="range" min="10" max="60"
                        value={msRotationSpeed}
                        onChange={(e) => setMsRotationSpeed(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Orbit Nodes Repeater */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION C — ORBIT SKILL NODES ({msOrbitSkills.length})</span>
                  
                  {/* Creation Form */}
                  <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-2xl space-y-3">
                    <span className="text-[7.5px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Add Orbit Skill Node</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text" placeholder="Skill Name"
                        value={newOrbitSkillName}
                        onChange={(e) => setNewOrbitSkillName(e.target.value)}
                        className="bg-black border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                      <input
                        type="number" placeholder="Angle (0-360)"
                        value={newOrbitSkillAngle}
                        onChange={(e) => setNewOrbitSkillAngle(parseInt(e.target.value) || 0)}
                        className="bg-black border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                      />
                      <select
                        value={newOrbitSkillRing}
                        onChange={(e) => setNewOrbitSkillRing(parseInt(e.target.value) as 1|2)}
                        className="bg-black border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white cursor-pointer font-mono"
                      >
                        <option value="1">Ring 1 (Inner)</option>
                        <option value="2">Ring 2 (Outer)</option>
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="color" value={newOrbitSkillHex}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewOrbitSkillHex(val);
                            setNewOrbitSkillBgGrad(`from-[${val}]/10 via-[${val}]/5 to-black/60`);
                            setNewOrbitSkillBorder(`border-[${val}]/25 hover:border-[${val}]/60`);
                          }}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newOrbitSkillName.trim()) return;
                            const newSkill = {
                              name: newOrbitSkillName,
                              angle: newOrbitSkillAngle,
                              ring: newOrbitSkillRing,
                              bgGradient: newOrbitSkillBgGrad,
                              borderClass: newOrbitSkillBorder,
                              glowColor: `${newOrbitSkillHex}40`,
                              glowHex: newOrbitSkillHex,
                              bulletBg: `bg-[${newOrbitSkillHex}]`,
                              textColor: `text-[${newOrbitSkillHex}] group-hover:text-[${newOrbitSkillHex}]`
                            };
                            setMsOrbitSkills([...msOrbitSkills, newSkill]);
                            setNewOrbitSkillName('');
                          }}
                          className="flex-1 bg-orange-600 hover:bg-orange-500 border-none text-white text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {msOrbitSkills.map((skill, idx) => (
                      <div key={idx} className="bg-neutral-900/40 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: skill.glowHex }} />
                          <div className="text-left">
                            <span className="text-xs font-bold text-white block">{skill.name}</span>
                            <span className="text-[7px] font-mono text-zinc-500 uppercase">Ring {skill.ring} • {skill.angle}°</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMsOrbitSkills(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded hover:bg-red-950/20 text-neutral-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CAPABILITY MATRIX */}
            {msActiveTab === 'matrix' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>CAPABILITY MATRIX COMPOSER</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Configure the clean 2x2 capability matrix replacing old tall cards. Heights are constrained to 240px-280px.
                  </p>
                </div>

                {/* Section A: Creation */}
                <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-2xl space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">Add Capability Card</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Domain Title</label>
                      <input
                        type="text" placeholder="e.g. Frontend Development"
                        value={newCapabilityTitle}
                        onChange={(e) => setNewCapabilityTitle(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Lucide Icon name</label>
                      <input
                        type="text" placeholder="e.g. Layout, Cpu, Database, Terminal"
                        value={newCapabilityIcon}
                        onChange={(e) => setNewCapabilityIcon(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Short Description</label>
                    <textarea
                      placeholder="Brief specification narrative in 1 sentence..."
                      value={newCapabilityShortDesc}
                      onChange={(e) => setNewCapabilityShortDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Stack Tags (comma separated)</label>
                      <input
                        type="text" placeholder="React, Tailwind, Motion"
                        value={newCapabilityTags}
                        onChange={(e) => setNewCapabilityTags(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Accent Color</label>
                      <div className="flex gap-2">
                        <select
                          value={newCapabilityAccent}
                          onChange={(e) => setNewCapabilityAccent(e.target.value)}
                          className="flex-1 bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white cursor-pointer font-mono"
                        >
                          <option value="purple">Purple Accent</option>
                          <option value="cyan">Cyan Accent</option>
                          <option value="emerald">Green Accent</option>
                          <option value="amber">Amber Accent</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCapabilityTitle.trim()) return;
                            const idx = msCapabilities.length + 1;
                            const formattedId = idx < 10 ? `0${idx}` : `${idx}`;
                            const newCap = {
                              id: formattedId,
                              title: newCapabilityTitle,
                              shortDescription: newCapabilityShortDesc,
                              icon: newCapabilityIcon,
                              tags: newCapabilityTags.split(',').map(t => t.trim()).filter(Boolean),
                              accentColor: newCapabilityAccent,
                              order: idx,
                              enabled: true
                            };
                            setMsCapabilities([...msCapabilities, newCap]);
                            setNewCapabilityTitle('');
                            setNewCapabilityShortDesc('');
                            setNewCapabilityTags('');
                          }}
                          className="px-4 bg-orange-600 hover:bg-orange-500 border-none text-white text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          + ADD CARD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Matrix List Accordion */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION B — COMPACT CARD LIST</span>
                  
                  {msCapabilities.map((card, idx) => (
                    <div key={card.id} className="border border-neutral-800 rounded-2xl bg-neutral-900/30 overflow-hidden">
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-extrabold text-orange-500 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">Card {card.id}</span>
                          <span className="text-xs font-bold text-white">{card.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* ordering */}
                          <button
                            type="button" disabled={idx === 0}
                            onClick={() => {
                              const copy = [...msCapabilities];
                              [copy[idx], copy[idx - 1]] = [copy[idx - 1], copy[idx]];
                              setMsCapabilities(copy);
                            }}
                            className="p-1 rounded hover:bg-neutral-805 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                          >
                            ▲
                          </button>
                          <button
                            type="button" disabled={idx === msCapabilities.length - 1}
                            onClick={() => {
                              const copy = [...msCapabilities];
                              [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
                              setMsCapabilities(copy);
                            }}
                            className="p-1 rounded hover:bg-neutral-805 text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => setMsCapabilities(prev => prev.filter(c => c.id !== card.id))}
                            className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/20 text-red-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-1 border-t border-white/[0.02] grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Edit Title</label>
                          <input
                            type="text" value={card.title}
                            onChange={(e) => {
                              const copy = [...msCapabilities];
                              copy[idx].title = e.target.value;
                              setMsCapabilities(copy);
                            }}
                            className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-1.5 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Edit Description</label>
                          <input
                            type="text" value={card.shortDescription}
                            onChange={(e) => {
                              const copy = [...msCapabilities];
                              copy[idx].shortDescription = e.target.value;
                              setMsCapabilities(copy);
                            }}
                            className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-1.5 rounded-xl text-xs text-white font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TECH STACK GRID */}
            {msActiveTab === 'grid' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-4 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span>CATEGORIZED TECH STACK GRID</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Group technical skills into cohesive stacks (Languages, Frontend, Databases) matching premium neon visual grids.
                  </p>
                </div>

                {/* Create Category */}
                <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-2xl space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">Add Categorized Stack Group</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Category Name</label>
                      <input
                        type="text" placeholder="e.g. Databases"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase text-neutral-500">Skills (comma separated)</label>
                      <div className="flex gap-2">
                        <input
                          type="text" placeholder="MongoDB, Redis, PostgreSQL"
                          value={newCategorySkills}
                          onChange={(e) => setNewCategorySkills(e.target.value)}
                          className="flex-1 bg-black border border-neutral-800 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCategoryName.trim()) return;
                            const newCat = {
                              category: newCategoryName,
                              skills: newCategorySkills.split(',').map(s => s.trim()).filter(Boolean)
                            };
                            setMsTechStacks([...msTechStacks, newCat]);
                            setNewCategoryName('');
                            setNewCategorySkills('');
                          }}
                          className="px-4 bg-orange-600 hover:bg-orange-500 border-none text-white text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          + Add Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech lists repeater */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION B — STACK GROUPS</span>
                  
                  <div className="space-y-4">
                    {msTechStacks.map((group, idx) => (
                      <div key={idx} className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                          <input
                            type="text" value={group.category}
                            onChange={(e) => {
                              const copy = [...msTechStacks];
                              copy[idx].category = e.target.value;
                              setMsTechStacks(copy);
                            }}
                            className="bg-transparent border-none text-xs font-bold text-orange-400 focus:outline-none font-mono tracking-wider uppercase shrink-0"
                          />
                          <button
                            type="button"
                            onClick={() => setMsTechStacks(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1 rounded hover:bg-red-950/20 text-neutral-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* tags display */}
                        <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                          {group.skills.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold bg-black border border-neutral-800 text-zinc-400 flex items-center gap-1.5"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...msTechStacks];
                                  copy[idx].skills = copy[idx].skills.filter((s: string) => s !== skill);
                                  setMsTechStacks(copy);
                                }}
                                className="p-0 border-none bg-transparent text-neutral-500 hover:text-white cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add tag in-place */}
                        <div className="flex gap-2">
                          <input
                            type="text" placeholder="Add custom skill tag..."
                            className="flex-1 bg-black border border-neutral-800 focus:outline-none px-3.5 py-1 rounded-xl text-[10px] text-white font-mono"
                            onKeyDown={(e: any) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.target.value.trim();
                                if (val && !group.skills.includes(val)) {
                                  const copy = [...msTechStacks];
                                  copy[idx].skills.push(val);
                                  setMsTechStacks(copy);
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: REAL-TIME PREMIUM MOCKUP PREVIEW */}
          <div className="lg:col-span-5 h-[85vh] sticky top-0 rounded-3xl border border-neutral-900 bg-[#070709] overflow-hidden flex flex-col justify-between shadow-2xl relative select-none">
            
            {/* Matte background simulated grids */}
            <div className="absolute inset-0 z-0 pointer-events-none coordinate-grid-ms opacity-80" />

            {/* Orbit Glow Overlay */}
            <div
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle 350px at 50% 280px, rgba(249, 115, 22, 0.18), transparent)`,
              }}
            />

            {/* Device frame content wrapper */}
            <div className="relative z-10 w-full flex-1 p-5 flex flex-col justify-between h-full overflow-y-auto no-scrollbar scrollbar-none">
              
              {/* Header simulator */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5 text-neutral-500 font-mono text-[7px] uppercase tracking-widest mb-4">
                <span>SIMULATED WORKSPACE PREVIEW</span>
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
              </div>

              {/* simulated Section Header */}
              <div className="text-center space-y-1 mb-8 pt-4">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/5 border border-orange-500/10 text-[7px] font-mono font-bold text-orange-400 uppercase tracking-widest inline-block">
                  {msBadge || 'SKILLS & TECHNOLOGIES'}
                </span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider heading-font">{msHeading || 'SYSTEM CAPABILITIES'}</h2>
                <p className="text-neutral-500 text-[8px] max-w-[280px] mx-auto font-sans leading-relaxed">{msDescription}</p>
              </div>

              {/* centerpiece orbital simulation */}
              <div className="relative w-full h-[200px] flex items-center justify-center border border-white/[0.02] rounded-3xl bg-neutral-950/20 backdrop-blur-md mb-8">
                {/* Orbit rings */}
                <div className="absolute rounded-full border border-orange-500/5 w-[80px] h-[80px]" />
                <div className="absolute rounded-full border border-orange-500/5 w-[140px] h-[140px]" />
                
                {/* Center Hub */}
                <div className="absolute z-20 w-[65px] h-[65px] rounded-full border border-orange-500/20 bg-neutral-950 flex flex-col items-center justify-center p-1 text-center scale-95">
                  <h4 className="text-white font-black text-[6.5px] font-display uppercase tracking-widest">{msOrbitTitle}</h4>
                  <span className="text-[5.5px] font-mono text-orange-400 font-bold tracking-tight block uppercase mt-0.5">{msOrbitSubtitle}</span>
                </div>

                {/* Nodes positioning mockup */}
                {msOrbitSkills.slice(0, 8).map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const r = node.ring === 1 ? 40 : 70;
                  const x = r * Math.cos(rad);
                  const y = r * Math.sin(rad);

                  return (
                    <div
                      key={i}
                      className="absolute z-25 flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 px-2 py-0.5 rounded-full text-[6.5px] font-mono scale-[0.85]"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: node.glowHex }} />
                      <span className="text-neutral-300 truncate max-w-[40px]">{node.name}</span>
                    </div>
                  );
                })}
              </div>


              {/* simulated Tech Stack groups */}
              <div className="space-y-2 pb-6">
                <span className="text-[7px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-1 block text-left">Grouped stack categories</span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {msTechStacks.slice(0, 4).map((group, idx) => (
                    <div key={idx} className="bg-neutral-950/40 border border-neutral-850 p-2 rounded-xl space-y-1 flex flex-col justify-between h-[65px]">
                      <span className="text-[7px] font-mono font-bold text-orange-400 uppercase tracking-wide truncate">{group.category}</span>
                      <div className="flex flex-wrap gap-0.5 overflow-hidden max-h-[35px]">
                        {group.skills.slice(0, 4).map((skill: string) => (
                          <span key={skill} className="px-1 py-0.5 bg-neutral-900 border border-neutral-850 text-neutral-400 rounded text-[5px] font-mono font-bold truncate max-w-[40px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3.5 md:space-y-6 animate-fade-in">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-black uppercase tracking-wider text-foreground">Skills Module</h2>
          </div>
          <p className="text-[11px] text-muted-foreground ml-[42px]">
            Live CMS for the engineering capabilities system on your portfolio.
          </p>
        </div>

        <button
          onClick={saveSkillsSection}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'SAVING...' : 'SAVE & PUBLISH'}
        </button>
      </div>

      {/* Mobile Tab Select Dropdown */}
      <div className="block md:hidden mb-4 relative animate-fade-in w-full">
        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Select Editing Tab
        </label>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className="w-full bg-card border border-border focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-foreground font-mono cursor-pointer appearance-none shadow-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '16px'
          }}
        >
          {[
            { id: 'hero', label: '1. Section Header' },
            { id: 'cards', label: '2. Capability Cards' },
            { id: 'philosophy', label: '3. Philosophy Strip' },
            { id: 'grid', label: '4. Tech Grid' }
          ].map((t) => (
            <option key={t.id} value={t.id} className="bg-card text-foreground py-2">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Sub-navigation Tabs ─────────────────────────────── */}
      <div className="hidden md:flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {([
          { id: 'hero', label: 'Section Header', icon: Type },
          { id: 'cards', label: 'Capability Cards', icon: Layers },
          { id: 'philosophy', label: 'Philosophy Strip', icon: AlignLeft },
          { id: 'grid', label: 'Tech Grid', icon: Award },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1: SECTION HEADER
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div className="space-y-3.5 md:space-y-5">
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-3.5 md:space-y-5 shadow-md">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Type className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Section Header Content</h3>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Badge Label
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. ENGINEERING CAPABILITIES"
                className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-sm text-foreground transition-all"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Appears as a small pill badge above the main heading. Keep uppercase, short.</p>
            </div>

            {/* Main Heading */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Main Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. SYSTEM CAPABILITIES"
                className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-sm text-foreground transition-all font-bold"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Large cinematic heading. Renders uppercase. Keep concise and impactful.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Description Paragraph
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of your engineering system..."
                className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-sm text-foreground transition-all resize-none leading-relaxed"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Shown below the heading in muted tone. 1-2 sentences covering your engineering philosophy.
              </p>
            </div>
          </div>

          {/* Live preview pill */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3.5 md:mb-4">Live Preview</p>
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full">
                <span className="w-3 h-3 text-purple-400">✦</span>
                <span className="text-[9px] font-mono font-black tracking-[0.25em] text-neutral-300 uppercase">{badge}</span>
              </div>
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{heading}</h2>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl">{description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2: CAPABILITY CARDS
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-muted-foreground">
              Edit each engineering domain card. Drag to reorder, click to expand fields.
            </p>
            <button
              onClick={addCapabilityCard}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold rounded-xl border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD DOMAIN CARD
            </button>
          </div>

          {capabilityCards.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-xs">No capability cards defined. Add your first engineering domain.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {capabilityCards.map((card, index) => (
                <CardEditor key={card.id} card={card} index={index} />
              ))}
            </div>
          )}

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <p className="text-[10px] text-primary/70 font-mono">
              💡 Cards render in a 2-column grid on the frontend. Each card has hover-reveal detail tabs (Focus, Workflow, Architecture). Click a block in the meter to set experience level interactively.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3: PHILOSOPHY STRIP
      ══════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════
          TAB 3: PHILOSOPHY STRIP
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'philosophy' && (
        <div className="space-y-3.5 md:space-y-5">
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-3.5 md:space-y-5 shadow-md">
            {/* Visibility Toggle */}
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Engineering Philosophy Strip</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Infinite scrolling marquee at bottom of skills section.</p>
              </div>
              <button
                onClick={() => {
                  const newVis = !philosophyVisible;
                  setPhilosophyVisible(newVis);
                  if (socket && user?.portfolioSlug) {
                    socket.emit('skills:update', {
                      slug: user.portfolioSlug,
                      skillsSection: {
                        badge,
                        heading,
                        description,
                        capabilityCards,
                        philosophyVisible: newVis,
                        philosophyStrip,
                        philosophyTags: philosophyStrip.filter(item => item.visible).map(item => item.text),
                      }
                    });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  philosophyVisible
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-muted border-border text-muted-foreground'
                }`}
              >
                {philosophyVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {philosophyVisible ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>

            {/* Philosophy Strip Items Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Philosophy Items
                </label>
                <button
                  onClick={addPhilosophyItem}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded-xl border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + ADD PHILOSOPHY
                </button>
              </div>

              {philosophyStrip.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No philosophy items added. Click "+ Add Philosophy" to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {philosophyStrip.map((item, idx) => {
                    const colors = [
                      { id: 'purple', label: 'Purple', dot: 'bg-purple-500' },
                      { id: 'cyan',   label: 'Cyan',   dot: 'bg-cyan-500' },
                      { id: 'amber',  label: 'Amber',  dot: 'bg-amber-500' },
                      { id: 'emerald',label: 'Green',  dot: 'bg-emerald-500' },
                      { id: 'blue',   label: 'Blue',   dot: 'bg-blue-500' },
                    ];

                    return (
                      <div
                        key={item.id || idx}
                        className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-background/50 hover:bg-background/80 transition-all ${
                          item.visible ? 'border-border' : 'border-border/30 opacity-60'
                        }`}
                      >
                        {/* Up/Down ordering */}
                        <div className="flex sm:flex-col gap-1 items-center justify-center shrink-0">
                          <button
                            onClick={() => movePhilosophyItem(idx, 'up')}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => movePhilosophyItem(idx, 'down')}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Text editing */}
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updatePhilosophyItem(item.id, 'text', e.target.value.toUpperCase())}
                            className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-foreground uppercase transition-all"
                            placeholder="e.g. AI-NATIVE DEVELOPMENT"
                          />

                          {/* Accent Color picker */}
                          <div className="flex flex-wrap gap-2 items-center pt-1">
                            <span className="text-[9px] font-mono text-muted-foreground uppercase mr-1">Dot Color:</span>
                            {colors.map(col => {
                              const isSelected = item.color === col.id || (col.id === 'emerald' && item.color === 'green');
                              return (
                                <button
                                  key={col.id}
                                  onClick={() => updatePhilosophyItem(item.id, 'color', col.id)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary/10 border-primary/30 text-primary'
                                      : 'bg-background border-border text-muted-foreground hover:border-border/80'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${col.dot} ${isSelected ? 'shadow-[0_0_6px_currentColor]' : ''}`} />
                                  {col.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Item actions */}
                        <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border/40 pt-2 sm:pt-0 sm:pl-4">
                          {/* Visibility Toggle */}
                          <button
                            onClick={() => updatePhilosophyItem(item.id, 'visible', !item.visible)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              item.visible ? 'text-primary bg-primary/5 hover:bg-primary/10' : 'text-muted-foreground/30 hover:text-muted-foreground/50'
                            }`}
                            title={item.visible ? 'Hide from strip' : 'Show on strip'}
                          >
                            {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => removePhilosophyItem(item.id)}
                            className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/20 text-red-400/60 hover:text-red-400 border border-red-500/0 hover:border-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Premium Visual Preview */}
            <div className="border-t border-border pt-6 mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Live Preview (Parity View)</p>
              {philosophyVisible ? (
                <div className="max-w-2xl mx-auto border border-white/[0.08] bg-neutral-950/40 rounded-full py-4 px-6 flex items-center justify-center gap-6 overflow-hidden shadow-lg select-none backdrop-blur-md">
                  <div className="flex gap-8 items-center px-4 whitespace-nowrap animate-pulse">
                    {philosophyStrip.filter(item => item.visible).map((item, idx) => {
                      const colorClass = item.color || 'purple';
                      const dotColor =
                        colorClass === 'purple' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] text-purple-400' :
                        colorClass === 'cyan' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] text-cyan-400' :
                        colorClass === 'amber' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] text-amber-400' :
                        colorClass === 'emerald' || colorClass === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] text-emerald-400' :
                        'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] text-blue-400';
                      return (
                        <span key={item.id || idx} className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          <span className="text-[9px] font-mono font-black tracking-[0.25em] text-neutral-300 uppercase">{item.text}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-[11px] text-muted-foreground border border-dashed border-border rounded-xl">
                  Philosophy strip is hidden from the portfolio.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4: TECH GRID (legacy CRUD)
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'grid' && (
        <div className="space-y-3.5 md:space-y-5">
          <div className="flex justify-between items-center border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Technical Grid</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Raw skill database — used as fallback mapping if no capability cards are configured.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              ADD SKILL
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-md">
              <p className="text-muted-foreground text-xs py-4">Tech grid is empty. Add your first technical skill.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(groupedSkills).map(([cat, list]: any) => (
                <div key={cat} className="bg-card border border-border rounded-2xl p-5 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-4 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    {cat}
                  </h4>
                  <div className="space-y-2.5">
                    {list.map((skill: any) => (
                      <div key={skill.id} className="p-3 bg-background border border-border hover:border-primary/25 rounded-xl flex items-center justify-between group shadow-sm transition-all">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-foreground font-semibold">{skill.skillName}</span>
                            <span className="font-mono text-muted-foreground text-[10px]">{skill.skillLevel}/10</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-1.5 border border-border/20">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-700"
                              style={{ width: `${(skill.skillLevel / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedSkillId(skill.id); setIsConfirmOpen(true); }}
                          className="p-1.5 rounded bg-red-950/20 hover:bg-red-900/20 text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer opacity-40 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skill Form Modal */}
          <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Technical Skill" size="sm">
            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Technology Name</label>
                <input
                  type="text" required
                  placeholder="e.g. Node.js or PostgreSQL"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-sm text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Stack Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-sm text-foreground transition-all cursor-pointer"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">Cloud & DevOps</option>
                  <option value="Database">Database</option>
                  <option value="AI">AI & ML</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proficiency Level</label>
                  <span className="text-xs font-bold text-primary font-mono">{skillLevel} / 10</span>
                </div>
                <input
                  type="range" min="1" max="10"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-1/2 py-2.5 rounded-lg bg-background border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={gridLoading} className="w-1/2 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> SAVE SKILL
                </button>
              </div>
            </form>
          </Modal>

          {/* Confirm Delete Modal */}
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleSkillDelete}
            title="Delete Technical Skill"
            message="Are you sure you want to remove this skill from the database?"
            confirmText="REMOVE SKILL"
            loading={gridLoading}
          />
        </div>
      )}
    </div>
  );
}
