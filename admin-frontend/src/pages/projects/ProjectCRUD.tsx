import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, Star, FolderKanban, Save, 
  ArrowUp, ArrowDown, Eye, EyeOff, X, Code, Cpu, Cloud, Database, 
  Layers, Zap, ChevronRight, Layout, Link2, ExternalLink, Activity, 
  Info, BarChart2, Globe, HelpCircle, Server, Radio, CheckCircle2, Github, Sparkles, Terminal, Upload
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import { usePortfolio } from '../../context/PortfolioContext';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & PRESETS
   ───────────────────────────────────────────────────────────── */

const ICON_OPTIONS = [
  { id: 'Globe', label: 'Globe / Web', icon: Globe },
  { id: 'Zap', label: 'Zap / Speed', icon: Zap },
  { id: 'Cpu', label: 'CPU / AI', icon: Cpu },
  { id: 'Server', label: 'Server / Backend', icon: Server },
  { id: 'Layers', label: 'Layers / Architecture', icon: Layers },
  { id: 'Database', label: 'Database / DB', icon: Database },
  { id: 'Radio', label: 'Radio / Broadcast', icon: Radio },
];

const COLOR_OPTIONS = [
  { id: 'purple', label: 'Purple', hex: '#8B5CF6', text: 'text-purple-400', dot: 'bg-purple-500' },
  { id: 'cyan',   label: 'Cyan',   hex: '#06B6D4', text: 'text-cyan-400',   dot: 'bg-cyan-500'   },
  { id: 'amber',  label: 'Amber',  hex: '#F59E0B', text: 'text-amber-400',  dot: 'bg-amber-500'  },
  { id: 'emerald',label: 'Emerald',hex: '#10B981', text: 'text-emerald-400',dot: 'bg-emerald-500' },
  { id: 'blue',   label: 'Blue',   hex: '#3B82F6', text: 'text-blue-400',   dot: 'bg-blue-500'   },
];

const TYPE_BADGE_OPTIONS = [
  { id: 'LIVE', label: 'LIVE / PRODUCTION', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
  { id: 'BUILDING', label: 'IN DEVELOPMENT', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
  { id: 'PROTOTYPE', label: 'PROTOTYPE / MVP', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
  { id: 'RESEARCH', label: 'RESEARCH / CONCEPT', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5' },
];

const ICON_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  Globe, Zap, Cpu, Server, Layers, Database, Radio
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const Comp = ICON_COMPONENT_MAP[name] || HelpCircle;
  return <Comp className={className} />;
}

export default function ProjectCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  const { activePortfolio } = usePortfolio();
  const isMS = activePortfolio === 'mahi';

  // MS custom states
  const [msActiveTab, setMsActiveTab] = useState<'hero' | 'inventory' | 'modal' | 'tech' | 'live' | 'layout'>('hero');
  const [msBadge, setMsBadge] = useState('BUILDS + SCALABLE DEPLOYMENTS');
  const [msHeading, setMsHeading] = useState('PROJECTS THAT SOLVE REAL PROBLEMS');
  const [msSubtext, setMsSubtext] = useState('AI systems, scalable platforms, and interactive experiences engineered to solve real-world problems.');
  const [msCategories, setMsCategories] = useState<any[]>([
    { id: 'ALL', label: 'ALL', active: true, accentColor: '#f97316' },
    { id: 'FULL STACK', label: 'FULL STACK', active: true, accentColor: '#3b82f6' },
    { id: 'AI/PYTHON', label: 'AI/PYTHON', active: true, accentColor: '#10b981' },
    { id: 'BACKEND', label: 'BACKEND', active: true, accentColor: '#8b5cf6' },
    { id: 'DATA SYSTEMS', label: 'DATA SYSTEMS', active: true, accentColor: '#ec4899' }
  ]);
  const [msProjectsList, setMsProjectsList] = useState<any[]>([]);
  
  // Selected project state for MS config
  const [selectedMsProjectId, setSelectedMsProjectId] = useState<string | null>(null);

  // Modal configuration
  const [msModalLayout, setMsModalLayout] = useState<any>({
    layoutType: 'split',
    enabledSections: { overview: true, kpi: true, challenges: true, stack: true, architecture: true, gallery: true },
    behavior: { animationSpeed: 0.35, blurIntensity: 12, borderGlow: true, openTransition: 'spring', closeTransition: 'ease' }
  });

  // Tech Orbit
  const [msTechOrbit, setMsTechOrbit] = useState<any[]>([
    { id: 'tech-1', label: 'Next.js', icon: 'Globe', glowColor: '#3b82f6', expertiseLevel: 95, category: 'Frontend' },
    { id: 'tech-2', label: 'React.js', icon: 'Layers', glowColor: '#06b6d4', expertiseLevel: 98, category: 'Frontend' },
    { id: 'tech-3', label: 'Python', icon: 'Cpu', glowColor: '#f59e0b', expertiseLevel: 90, category: 'AI/Data' },
    { id: 'tech-4', label: 'MongoDB', icon: 'Database', glowColor: '#10b981', expertiseLevel: 88, category: 'Backend' },
    { id: 'tech-5', label: 'AWS Cloud', icon: 'Server', glowColor: '#ff9900', expertiseLevel: 85, category: 'DevOps' }
  ]);

  // Hover and background options
  const [msLivePreviewControls, setMsLivePreviewControls] = useState<any>({
    cardHover: { blurIntensity: 8, scale: 1.02, imageZoom: 1.05, shadowGlow: true },
    background: { overlayOpacity: 0.08, glassBlur: 16, lightingGradient: 'radial-gradient(circle_800px_at_50%_-100px,rgba(251,146,60,0.08),transparent)', cardTransparency: 0.3 }
  });

  // Animation and spacing options
  const [msAnimationLayout, setMsAnimationLayout] = useState<any>({
    cardSpacing: 24,
    modalRadius: 32,
    cardGlow: 15,
    hoverSpeed: 300,
    transitionCurve: 'cubic-bezier(0.16, 1, 0.3, 1)',
    layoutDensity: 'cozy'
  });

  // Right-pane interactive simulation states
  const [simulatedViewport, setSimulatedViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [simulatedSelectedProject, setSimulatedSelectedProject] = useState<any | null>(null);
  const [simulatedFilter, setSimulatedFilter] = useState<string>('ALL');

  // ── Socket synchronization state ────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Projects Section CMS states ──────────────────────────────
  const [badge, setBadge] = useState('FEATURED WORK • SELECTED PROJECTS');
  const [heading, setHeading] = useState('BUILDING DIGITAL PRODUCTS THAT MATTER');
  const [description, setDescription] = useState('A curated showcase of modern builds.');
  const [statsCards, setStatsCards] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  // ── Right pane active state ──────────────────────────────────
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<'specs' | 'media' | 'progress' | 'links'>('specs');
  
  // ── Interactive uploads ──────────────────────────────────────
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // ── Deletion state ──────────────────────────────────────────
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  
  // ── Save status ─────────────────────────────────────────────
  const [saving, setSaving] = useState(false);

  // ── Mobile preview collapse state ───────────────────────────
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // ── Bento expanded edit state for KS ────────────────────────
  const [openBentoSection, setOpenBentoSection] = useState<string | null>('hero');

  // Establish socket pipeline
  useEffect(() => {
    if (user?.portfolioSlug) {
      const s = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
      s.emit('portfolio:join', user.portfolioSlug);
      setSocket(s);
      return () => {
        s.disconnect();
      };
    }
  }, [user?.portfolioSlug]);

  // Load from database profile
  useEffect(() => {
    if (profile?.projectsSection) {
      const sec = typeof profile.projectsSection === 'string'
        ? JSON.parse(profile.projectsSection)
        : profile.projectsSection;

      setBadge(sec.badge || 'FEATURED WORK • SELECTED PROJECTS');
      setHeading(sec.heading || 'BUILDING DIGITAL PRODUCTS THAT MATTER');
      setDescription(sec.description || 'A curated showcase of modern builds.');
      setStatsCards(sec.statsCards || []);
      setProjectsList(sec.projects || []);

      // Hydrate MS-specific
      setMsBadge(sec.badge || 'BUILDS + SCALABLE DEPLOYMENTS');
      setMsHeading(sec.heading || 'PROJECTS THAT SOLVE REAL PROBLEMS');
      setMsSubtext(sec.description || 'AI systems, scalable platforms, and interactive experiences engineered to solve real-world problems.');
      
      if (sec.categories && sec.categories.length > 0) {
        setMsCategories(sec.categories);
      } else {
        setMsCategories([
          { id: 'ALL', label: 'ALL', active: true, accentColor: '#f97316' },
          { id: 'FULL STACK', label: 'FULL STACK', active: true, accentColor: '#3b82f6' },
          { id: 'AI/PYTHON', label: 'AI/PYTHON', active: true, accentColor: '#10b981' },
          { id: 'BACKEND', label: 'BACKEND', active: true, accentColor: '#8b5cf6' },
          { id: 'DATA SYSTEMS', label: 'DATA SYSTEMS', active: true, accentColor: '#ec4899' }
        ]);
      }

      const mappedMsProjects = (sec.projects || []).map((p: any) => ({
        id: p.id,
        title: p.title || 'NEW SHOWCASE PROJECT',
        slug: p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'creative-blueprint'),
        category: p.category || 'FULL STACK',
        status: p.status || (p.featured ? 'Featured' : 'Live'),
        image: p.image || p.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        heroBanner: p.heroBanner || p.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        modalPreviewMedia: p.modalPreviewMedia || p.videoPreview || p.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        gradientAccent: p.gradientAccent || '#f97316',
        description: p.description || 'A brief conversational summary of the project.',
        architectureDescription: p.architectureDescription || p.technicalBreakdown?.architecture || 'Built upon modular full-stack schemas, isolated client states, secure authorization middlewares, optimized multi-layer database queries, and automatic serverless deployment pipelines to maintain high horizontal scalability.',
        engineeringChallenges: p.engineeringChallenges || p.technicalBreakdown?.optimization || 'Optimized database query performance using relational schema indexes, resolved memory leaks under socket events, engineered premium fluid animations running cleanly at 60fps, and established dynamic data synchronization loops.',
        outcomes: p.outcomes || (Array.isArray(p.highlights) ? p.highlights.join('\n') : p.outcomes || 'Detail bulleted outcomes or performance KPI parameters.'),
        scalabilityNotes: p.scalabilityNotes || p.technicalBreakdown?.apis || 'Explain horizontal indexing patterns, edge networks, or database clustering.',
        kpis: p.kpis || [
          { icon: 'Zap', title: 'Sub-12ms Latency', description: 'Engineered sub-12ms param routing caches' },
          { icon: 'Shield', title: 'Zero Session Faults', description: 'Zero core session failures during peak queries' }
        ],
        technologies: p.technologies || p.techStack || ['React', 'Node.js', 'PostgreSQL'],
        actionButtons: p.actionButtons || {
          sourceCode: { enabled: true, url: p.githubUrl || 'https://github.com' },
          livePreview: { enabled: true, url: p.demoUrl || 'https://google.com' },
          caseStudy: { enabled: true }
        },
        visible: p.visible !== false,
        order: p.order || 1
      }));
      setMsProjectsList(mappedMsProjects);
      
      if (mappedMsProjects.length > 0 && !selectedMsProjectId) {
        setSelectedMsProjectId(mappedMsProjects[0].id);
      }

      setMsModalLayout(sec.modalLayout || {
        layoutType: 'split',
        enabledSections: { overview: true, kpi: true, challenges: true, stack: true, architecture: true, gallery: true },
        behavior: { animationSpeed: 0.35, blurIntensity: 12, borderGlow: true, openTransition: 'spring', closeTransition: 'ease' }
      });

      setMsTechOrbit(sec.techOrbit || [
        { id: 'tech-1', label: 'Next.js', icon: 'Globe', glowColor: '#3b82f6', expertiseLevel: 95, category: 'Frontend' },
        { id: 'tech-2', label: 'React.js', icon: 'Layers', glowColor: '#06b6d4', expertiseLevel: 98, category: 'Frontend' },
        { id: 'tech-3', label: 'Python', icon: 'Cpu', glowColor: '#f59e0b', expertiseLevel: 90, category: 'AI/Data' },
        { id: 'tech-4', label: 'MongoDB', icon: 'Database', glowColor: '#10b981', expertiseLevel: 88, category: 'Backend' },
        { id: 'tech-5', label: 'AWS Cloud', icon: 'Server', glowColor: '#ff9900', expertiseLevel: 85, category: 'DevOps' }
      ]);

      setMsLivePreviewControls(sec.livePreviewControls || {
        cardHover: { blurIntensity: 8, scale: 1.02, imageZoom: 1.05, shadowGlow: true },
        background: { overlayOpacity: 0.08, glassBlur: 16, lightingGradient: 'radial-gradient(circle_800px_at_50%_-100px,rgba(251,146,60,0.08),transparent)', cardTransparency: 0.3 }
      });

      setMsAnimationLayout(sec.animationLayout || {
        cardSpacing: 24,
        modalRadius: 32,
        cardGlow: 15,
        hoverSpeed: 300,
        transitionCurve: 'cubic-bezier(0.16, 1, 0.3, 1)',
        layoutDensity: 'cozy'
      });
    }
  }, [profile]);

  // Real-time broadcasing emitter
  const emitProjectsSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('projects:update', {
        slug: user.portfolioSlug,
        projectsSection: newSec,
        projects: newSec.projects || []
      });
    }
  };

  const getCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge,
      heading,
      description,
      statsCards,
      projects: projectsList,
      ...overrides
    };
  };

  const getMsCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge: msBadge,
      heading: msHeading,
      description: msSubtext,
      categories: msCategories,
      projects: msProjectsList,
      modalLayout: msModalLayout,
      techOrbit: msTechOrbit,
      livePreviewControls: msLivePreviewControls,
      animationLayout: msAnimationLayout,
      ...overrides
    };
  };

  /* ─────────────────────────────────────────────────────────────
     CMS VALUE MODIFICATION HANDLERS (Emitter triggers)
     ───────────────────────────────────────────────────────────── */

  const handleSectionTextChange = (field: 'badge' | 'heading' | 'description', val: string) => {
    let updated = getCombinedSection();
    if (field === 'badge') { setBadge(val); updated.badge = val; }
    if (field === 'heading') { setHeading(val); updated.heading = val; }
    if (field === 'description') { setDescription(val); updated.description = val; }
    emitProjectsSectionUpdate(updated);
  };

  // ── Stats Cards (Section 2) handlers ─────────────────────────
  const updateStatCard = (index: number, updatedCard: any) => {
    const nextCards = [...statsCards];
    nextCards[index] = updatedCard;
    setStatsCards(nextCards);
    emitProjectsSectionUpdate(getCombinedSection({ statsCards: nextCards }));
  };

  const toggleStatVisibility = (index: number) => {
    const nextCards = [...statsCards];
    nextCards[index] = { ...nextCards[index], visible: !nextCards[index].visible };
    setStatsCards(nextCards);
    emitProjectsSectionUpdate(getCombinedSection({ statsCards: nextCards }));
  };

  const addStatCard = () => {
    const newCard = {
      id: `stat-${Date.now()}`,
      label: 'New Metric',
      value: '99% Perfect',
      trend: 'Auto-updating',
      icon: 'Globe',
      color: 'purple',
      visible: true
    };
    const nextCards = [...statsCards, newCard];
    setStatsCards(nextCards);
    emitProjectsSectionUpdate(getCombinedSection({ statsCards: nextCards }));
  };

  const deleteStatCard = (index: number) => {
    const nextCards = statsCards.filter((_, idx) => idx !== index);
    setStatsCards(nextCards);
    emitProjectsSectionUpdate(getCombinedSection({ statsCards: nextCards }));
  };

  // ── Project entities (Section 3) handlers ────────────────────
  const updateSelectedProjectDetails = (updatedProj: any) => {
    const nextProjs = projectsList.map((p) => p.id === updatedProj.id ? updatedProj : p);
    setProjectsList(nextProjs);
    emitProjectsSectionUpdate(getCombinedSection({ projects: nextProjs }));
  };

  const toggleProjectVisibility = (id: string) => {
    const nextProjs = projectsList.map((p) => p.id === id ? { ...p, visible: !p.visible } : p);
    setProjectsList(nextProjs);
    emitProjectsSectionUpdate(getCombinedSection({ projects: nextProjs }));
  };

  const toggleProjectFeatured = (id: string) => {
    const nextProjs = projectsList.map((p) => p.id === id ? { ...p, featured: !p.featured } : p);
    setProjectsList(nextProjs);
    emitProjectsSectionUpdate(getCombinedSection({ projects: nextProjs }));
  };

  const handleProjectReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projectsList.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextProjs = [...projectsList];
    const temp = nextProjs[index];
    nextProjs[index] = nextProjs[targetIndex];
    nextProjs[targetIndex] = temp;

    // Recalculate order indices
    const finalized = nextProjs.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjectsList(finalized);
    emitProjectsSectionUpdate(getCombinedSection({ projects: finalized }));
  };

  const createProjectEntity = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'CREATIVE BLUEPRINT',
      description: 'Cinematic distributed architecture providing real-time data persistence, edge caching, and gorgeous glassmorphic frontend layouts.',
      type: 'PROTOTYPE',
      featured: false,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      metrics: [
        { label: 'UI/UX Score', value: 95, color: 'blue' },
        { label: 'Backend Speed', value: 88, color: 'purple' }
      ],
      githubUrl: 'https://github.com',
      demoUrl: 'https://google.com',
      visible: true,
      order: projectsList.length + 1
    };

    const nextProjs = [...projectsList, newProj];
    setProjectsList(nextProjs);
    setSelectedProjectId(newProj.id);
    setEditorTab('specs');
    setShowPreviewMobile(true);
    emitProjectsSectionUpdate(getCombinedSection({ projects: nextProjs }));
    setSuccess('New showcase project draft registered!');
  };

  const confirmDeleteProject = (id: string) => {
    setProjectToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const deleteProjectEntity = () => {
    if (!projectToDeleteId) return;
    const nextProjs = projectsList.filter((p) => p.id !== projectToDeleteId);
    setProjectsList(nextProjs);
    if (selectedProjectId === projectToDeleteId) {
      setSelectedProjectId(null);
    }
    setProjectToDeleteId(null);
    setIsConfirmOpen(false);
    emitProjectsSectionUpdate(getCombinedSection({ projects: nextProjs }));
    setSuccess('Project permanently removed!');
  };

  // ── Cover Art Upload Handler ────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, projId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('projectImage', file);

    try {
      const res = await api.post('/portfolio/profile/project-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res.data.data.imageUrl;
      const targetProj = projectsList.find((p) => p.id === projId);
      if (targetProj) {
        updateSelectedProjectDetails({ ...targetProj, image: uploadedUrl });
        setSuccess('Cover image uploaded successfully!');
      }
    } catch (err: any) {
      console.error('Project Cover upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload project cover image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Screenshots Gallery Upload Handler ────────────────────────
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>, projId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingScreenshot(true);
    let successCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('projectImage', file);

        const res = await api.post('/portfolio/profile/project-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const uploadedUrl = res.data.data.imageUrl;
        
        // Functional update of projects list to avoid stale closure state
        setProjectsList((prevProjs) => {
          const next = prevProjs.map((p) => {
            if (p.id === projId) {
              const gallery = p.mediaGallery || [];
              return { ...p, mediaGallery: [...gallery, uploadedUrl] };
            }
            return p;
          });

          // Instantly sync changes via socket.io broadcast
          const target = next.find((p) => p.id === projId);
          if (target) {
            const updatedSection = {
              badge,
              heading,
              description,
              statsCards,
              projects: next
            };
            if (socket && user?.portfolioSlug) {
              socket.emit('projects:update', {
                slug: user.portfolioSlug,
                projectsSection: updatedSection,
                projects: next
              });
            }
          }
          return next;
        });
        successCount++;
      }

      setSuccess(`Successfully uploaded ${successCount} screenshot(s) to media gallery!`);
    } catch (err: any) {
      console.error('Screenshot upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload project screenshot.');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     PERSISTENT DATA STORE (DATABASE WRITE)
     ───────────────────────────────────────────────────────────── */
  const saveProjectsSection = async () => {
    setSaving(true);
    try {
      const dbPayload = isMS ? getMsCombinedSection() : getCombinedSection();
      await api.patch('/portfolio/profile', {
        projectsSection: dbPayload
      });
      setSuccess('Projects module database sync successful!');
      await fetchEverything();
    } catch (err: any) {
      console.error('saveProjectsSection Error:', err);
      setError(err.response?.data?.message || 'Failed to synchronize projects changes to database.');
    } finally {
      setSaving(false);
    }
  };

  // Retrieve current active project
  const selectedProj = projectsList.find((p) => p.id === selectedProjectId);

  // MS Custom operations
  const updateSelectedMsProjectDetails = (updatedProj: any) => {
    const nextProjs = msProjectsList.map((p) => p.id === updatedProj.id ? updatedProj : p);
    setMsProjectsList(nextProjs);
    emitProjectsSectionUpdate(getMsCombinedSection({ projects: nextProjs }));
  };

  const toggleMsProjectVisibility = (id: string) => {
    const nextProjs = msProjectsList.map((p) => p.id === id ? { ...p, visible: !p.visible } : p);
    setMsProjectsList(nextProjs);
    emitProjectsSectionUpdate(getMsCombinedSection({ projects: nextProjs }));
  };

  const handleMsProjectReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === msProjectsList.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextProjs = [...msProjectsList];
    const temp = nextProjs[index];
    nextProjs[index] = nextProjs[targetIndex];
    nextProjs[targetIndex] = temp;

    const finalized = nextProjs.map((p, idx) => ({ ...p, order: idx + 1 }));
    setMsProjectsList(finalized);
    emitProjectsSectionUpdate(getMsCombinedSection({ projects: finalized }));
  };

  const createMsProjectEntity = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'INTELLIGENT ROUTING BUILD',
      slug: `intelligent-routing-${Date.now()}`,
      category: msCategories[0]?.id || 'ALL',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      heroBanner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      modalPreviewMedia: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      gradientAccent: '#f97316',
      description: 'A cinematic high-throughput travel routing automation module delivering sub-12ms queries.',
      architectureDescription: 'Built upon modular full-stack schemas, isolated client states, secure authorization middlewares, optimized multi-layer database queries, and automatic serverless deployment pipelines to maintain high horizontal scalability.',
      engineeringChallenges: 'Optimized database query performance using relational schema indexes, resolved memory leaks under socket events, engineered premium fluid animations running cleanly at 60fps, and established dynamic data synchronization loops.',
      outcomes: 'Engineered sub-12ms query routing latency.\nAchieved zero core session route failures.',
      scalabilityNotes: 'Utilized parameter queries index caching to support up to 5,000 requests per minute.',
      kpis: [
        { icon: 'Zap', title: 'Sub-12ms Latency', description: 'Engineered sub-12ms param routing caches' },
        { icon: 'Shield', title: 'Zero Session Faults', description: 'Zero core session failures during peak queries' }
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      actionButtons: {
        sourceCode: { enabled: true, url: 'https://github.com' },
        livePreview: { enabled: true, url: 'https://google.com' },
        caseStudy: { enabled: true }
      },
      visible: true,
      order: msProjectsList.length + 1
    };

    const nextProjs = [...msProjectsList, newProj];
    setMsProjectsList(nextProjs);
    setSelectedMsProjectId(newProj.id);
    setShowPreviewMobile(true);
    emitProjectsSectionUpdate(getMsCombinedSection({ projects: nextProjs }));
    setSuccess('New Mahi portfolio project registered!');
  };

  const confirmDeleteMsProject = (id: string) => {
    setProjectToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const deleteMsProjectEntity = () => {
    if (!projectToDeleteId) return;
    const nextProjs = msProjectsList.filter((p) => p.id !== projectToDeleteId);
    setMsProjectsList(nextProjs);
    if (selectedMsProjectId === projectToDeleteId) {
      setSelectedMsProjectId(nextProjs[0]?.id || null);
    }
    setProjectToDeleteId(null);
    setIsConfirmOpen(false);
    emitProjectsSectionUpdate(getMsCombinedSection({ projects: nextProjs }));
    setSuccess('Project permanently removed!');
  };

  const handleMsCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, projId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('projectImage', file);

    try {
      const res = await api.post('/portfolio/profile/project-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res.data.data.imageUrl;
      const targetProj = msProjectsList.find((p) => p.id === projId);
      if (targetProj) {
        updateSelectedMsProjectDetails({ ...targetProj, image: uploadedUrl });
        setSuccess('MS Cover image uploaded successfully!');
      }
    } catch (err: any) {
      console.error('MS Project Cover upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload project cover image.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (isMS) {
    const selectedMsProj = msProjectsList.find((p) => p.id === selectedMsProjectId);

    return (
      <div className="space-y-6 select-none animate-fade-in text-left text-neutral-300 font-sans pb-12">
        {/* TOP BAR / CONTROL STATION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Mahi Singh Portfolio Module</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              Cinematic Project Control System
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Visual-first page builder: Configure real-time layouts, hover glows, orbit stacks, and narrative modals.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-mono text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>SOCKET SYNC ACTIVE</span>
            </div>
            {/* Mobile Preview Toggle */}
            <button
              type="button"
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="flex md:hidden items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreviewMobile ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
            <button
              onClick={saveProjectsSection}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xs font-bold uppercase rounded-xl tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.2)] disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'SYNCING DATA...' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </div>

        {/* TWO-COLUMN GRID: CONFIGURATION vs LIVE VIEWPORT SIMULATION */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* ==========================================
             LEFT COLUMN: CONFIGURATION SPACE (12 cols to 6 cols)
             ========================================== */}
          <div className="xl:col-span-6 space-y-6">
            
            {/* Mobile Tab Select Dropdown */}
            <div className="block md:hidden mb-4 relative animate-fade-in w-full">
              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Select Section
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
                  { id: 'hero', label: '1. Showcase Hero' },
                  { id: 'inventory', label: '2. Inventory Builder' },
                  { id: 'modal', label: '3. Modal System' },
                  { id: 'tech', label: '4. Orbit Engine' },
                  { id: 'live', label: '5. Hover & Blurs' },
                  { id: 'layout', label: '6. Layout Grid' }
                ].map((t) => (
                  <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6-Tab Navigation Workspace */}
            <div className="hidden md:flex bg-neutral-950 border border-neutral-800 rounded-2xl p-1.5 flex-wrap gap-1">
              {[
                { id: 'hero', label: 'Showcase Hero', icon: Info },
                { id: 'inventory', label: 'Inventory Builder', icon: FolderKanban },
                { id: 'modal', label: 'Modal System', icon: Layout },
                { id: 'tech', label: 'Orbit Engine', icon: Cpu },
                { id: 'live', label: 'Hover & Blurs', icon: Eye },
                { id: 'layout', label: 'Layout Grid', icon: BarChart2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = msActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMsActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[110px] px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border-none ${
                      isActive
                        ? 'bg-neutral-900 border border-neutral-800 text-orange-400 font-extrabold shadow-inner'
                        : 'text-neutral-500 hover:text-white hover:bg-neutral-900/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANEL WORKSPACE CONTAINER */}
            <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-3xl p-6 min-h-[550px] max-h-[82vh] overflow-y-auto space-y-6">
              
              {/* TAB 1: SHOWCASE HERO */}
              {msActiveTab === 'hero' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-4 h-4 text-orange-500" />
                      <span>Showcase Hero Configuration</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500">Configure top hero texts and interactive categories repeater filters.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">SECTION BADGE</label>
                      <input
                        type="text"
                        value={msBadge}
                        onChange={(e) => {
                          setMsBadge(e.target.value);
                          emitProjectsSectionUpdate(getMsCombinedSection({ badge: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white tracking-widest font-mono"
                        placeholder="e.g. BUILDS + SCALABLE DEPLOYMENTS"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">MAIN CINEMATIC HEADING</label>
                      <input
                        type="text"
                        value={msHeading}
                        onChange={(e) => {
                          setMsHeading(e.target.value);
                          emitProjectsSectionUpdate(getMsCombinedSection({ heading: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white uppercase tracking-tight font-black"
                        placeholder="e.g. PROJECTS THAT SOLVE REAL PROBLEMS"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">SUBTEXT / SUB-DESCRIPTOR</label>
                      <textarea
                        rows={3}
                        value={msSubtext}
                        onChange={(e) => {
                          setMsSubtext(e.target.value);
                          emitProjectsSectionUpdate(getMsCombinedSection({ description: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Configure paragraph context subtext descriptive highlights..."
                      />
                    </div>
                  </div>

                  {/* DYNAMIC CATEGORY REPEATER */}
                  <div className="space-y-4 pt-4 border-t border-neutral-900">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">DYNAMIC CATEGORY REPEATERS</span>
                      <button
                        onClick={() => {
                          const newCat = {
                            id: `cat-${Date.now()}`,
                            label: 'NEW FILTER',
                            active: true,
                            accentColor: '#f97316'
                          };
                          const nextCats = [...msCategories, newCat];
                          setMsCategories(nextCats);
                          emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                        }}
                        className="text-[9px] font-mono font-bold text-orange-500 hover:text-orange-400 border border-orange-500/20 hover:border-orange-500/40 px-2.5 py-1 rounded-xl bg-orange-500/5 transition-all cursor-pointer"
                      >
                        + ADD FILTER
                      </button>
                    </div>

                    <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                      {msCategories.length === 0 ? (
                        <p className="text-[10px] text-neutral-500 text-center py-4 font-mono">No custom filters configured. Add filters to dynamic list.</p>
                      ) : (
                        msCategories.map((cat, idx) => (
                          <div key={cat.id} className="p-3.5 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex flex-col md:flex-row items-center gap-3">
                            <div className="flex items-center gap-2 flex-grow w-full md:w-auto">
                              <span className="text-[9px] font-mono text-neutral-500">#{idx+1}</span>
                              <input
                                type="text"
                                value={cat.label}
                                onChange={(e) => {
                                  const nextCats = [...msCategories];
                                  nextCats[idx] = { ...cat, label: e.target.value, id: e.target.value.toUpperCase() };
                                  setMsCategories(nextCats);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                }}
                                className="bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:outline-none px-2.5 py-1.5 rounded-lg text-xs text-white flex-grow font-bold uppercase"
                                placeholder="e.g. DATA STRUCTURES"
                              />
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono text-neutral-500">Color</span>
                                <input
                                  type="color"
                                  value={cat.accentColor || '#f97316'}
                                  onChange={(e) => {
                                    const nextCats = [...msCategories];
                                    nextCats[idx] = { ...cat, accentColor: e.target.value };
                                    setMsCategories(nextCats);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                  }}
                                  className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  const nextCats = [...msCategories];
                                  nextCats[idx] = { ...cat, active: !cat.active };
                                  setMsCategories(nextCats);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                }}
                                className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase transition-all ${
                                  cat.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                }`}
                              >
                                {cat.active ? 'Active' : 'Disabled'}
                              </button>

                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const nextCats = [...msCategories];
                                    const temp = nextCats[idx];
                                    nextCats[idx] = nextCats[idx - 1];
                                    nextCats[idx - 1] = temp;
                                    setMsCategories(nextCats);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                  }}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (idx === msCategories.length - 1) return;
                                    const nextCats = [...msCategories];
                                    const temp = nextCats[idx];
                                    nextCats[idx] = nextCats[idx + 1];
                                    nextCats[idx + 1] = temp;
                                    setMsCategories(nextCats);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                  }}
                                  disabled={idx === msCategories.length - 1}
                                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    const nextCats = msCategories.filter((c) => c.id !== cat.id);
                                    setMsCategories(nextCats);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ categories: nextCats }));
                                  }}
                                  className="p-1 hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY BUILDER */}
              {msActiveTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-orange-500" />
                        <span>Project Inventory System</span>
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-sans">Build individual project cards, content outlines, and outcomes metrics.</p>
                    </div>
                    <button
                      onClick={createMsProjectEntity}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer uppercase shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Compact scrolling list of projects */}
                    <div className="md:col-span-4 flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {msProjectsList.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-neutral-800 rounded-xl">
                          <p className="text-[10px] text-neutral-500">No projects found. Add project.</p>
                        </div>
                      ) : (
                        msProjectsList.map((p, idx) => {
                          const isSel = selectedMsProjectId === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => { setSelectedMsProjectId(p.id); setShowPreviewMobile(true); }}
                              className={`p-2.5 border rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-all duration-300 relative overflow-hidden select-none ${
                                isSel
                                  ? 'bg-orange-950/15 border-orange-500 shadow-md shadow-orange-500/5'
                                  : 'bg-neutral-900/40 border-neutral-850 hover:border-neutral-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate w-[75%]">
                                <div className="w-8 h-8 rounded border border-neutral-800 overflow-hidden shrink-0 bg-neutral-950 flex items-center justify-center">
                                  <img
                                    src={p.image}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                                    }}
                                  />
                                </div>
                                <div className="space-y-0.5 truncate text-left">
                                  <span className="text-[10px] font-bold text-white uppercase tracking-tight block truncate">{p.title}</span>
                                  <span className="text-[7.5px] font-mono text-neutral-500 tracking-wider block font-semibold uppercase">{p.category} • {p.status}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleMsProjectReorder(idx, 'up')}
                                  disabled={idx === 0}
                                  className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-neutral-800 rounded text-neutral-500 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMsProjectReorder(idx, 'down')}
                                  disabled={idx === msProjectsList.length - 1}
                                  className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-neutral-800 rounded text-neutral-500 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => confirmDeleteMsProject(p.id)}
                                  className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Configuration details for selected project */}
                    <div className="md:col-span-8 bg-neutral-900/20 border border-neutral-850 rounded-2xl p-5 space-y-5">
                      {!selectedMsProj ? (
                        <div className="py-24 text-center">
                          <FolderKanban className="w-10 h-10 text-neutral-700 mx-auto mb-2" />
                          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Select Project to configure</p>
                        </div>
                      ) : (
                        <div className="space-y-5 text-left text-xs">
                          {/* Selected Active Header */}
                          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                            <div>
                              <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-orange-500">Currently Editing Project workspace</span>
                              <h5 className="text-xs font-black uppercase text-white tracking-wider mt-0.5">{selectedMsProj.title}</h5>
                            </div>
                            <span className="text-[8px] font-mono bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-neutral-500 font-extrabold uppercase">
                              SLUG: {selectedMsProj.slug}
                            </span>
                          </div>

                          {/* SECTION A: BASIC INFO */}
                          <div className="space-y-4">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">A. Basic Specs</span>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">PROJECT TITLE</label>
                                <input
                                  type="text"
                                  value={selectedMsProj.title}
                                  onChange={(e) => updateSelectedMsProjectDetails({
                                    ...selectedMsProj,
                                    title: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                  })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[11px] text-white font-bold"
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">PROJECT SLUG</label>
                                <input
                                  type="text"
                                  value={selectedMsProj.slug}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, slug: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[11px] text-white font-mono"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">SHOWCASE CATEGORY</label>
                                <select
                                  value={selectedMsProj.category}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, category: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[11px] text-white font-bold cursor-pointer"
                                >
                                  {msCategories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">DEPLOYMENT STATUS</label>
                                <select
                                  value={selectedMsProj.status}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, status: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[11px] text-white font-bold cursor-pointer"
                                >
                                  <option value="Live">Live / Active</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Private">Private / CONCEPT</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* SECTION B: VISUAL SYSTEM */}
                          <div className="space-y-4 pt-3 border-t border-neutral-900">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">B. Visual System Settings</span>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">THUMBNAIL URL</label>
                                <input
                                  type="url"
                                  value={selectedMsProj.image}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, image: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-mono"
                                  placeholder="https://..."
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">HERO BANNER URL</label>
                                <input
                                  type="url"
                                  value={selectedMsProj.heroBanner}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, heroBanner: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-mono"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">MODAL PREVIEW MEDIA</label>
                                <input
                                  type="text"
                                  value={selectedMsProj.modalPreviewMedia}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, modalPreviewMedia: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-mono"
                                  placeholder="Paste image or mp4 URL"
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">ACCENT GRADIENT COLOR (HEX)</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedMsProj.gradientAccent || '#f97316'}
                                    onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, gradientAccent: e.target.value })}
                                    className="w-8 h-8 rounded border border-neutral-800 bg-transparent overflow-hidden cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedMsProj.gradientAccent}
                                    onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, gradientAccent: e.target.value })}
                                    className="flex-grow bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-mono"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1.5">REPLACE THUMBNAIL VIA UPLOAD</label>
                              <div className="relative inline-block cursor-pointer w-full">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleMsCoverUpload(e, selectedMsProj.id)}
                                  disabled={uploadingImage}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                <button
                                  type="button"
                                  disabled={uploadingImage}
                                  className="w-full px-4 py-2 border border-neutral-800 hover:border-orange-500/40 bg-neutral-950 hover:bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>{uploadingImage ? 'Uploading image...' : 'Browse Cover File'}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* SECTION C: CONTENT SYSTEM */}
                          <div className="space-y-4 pt-3 border-t border-neutral-900">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">C. Engineering Storytelling</span>
                            
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">1. DESCRIPTION / OVERVIEW</label>
                              <textarea
                                rows={2}
                                value={selectedMsProj.description}
                                onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, description: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-sans"
                                placeholder="Overview description..."
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">2. SYSTEM ARCHITECTURE DETAILS</label>
                              <textarea
                                rows={3}
                                value={selectedMsProj.architectureDescription}
                                onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, architectureDescription: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-sans"
                                placeholder="Modular structures, API mappings, server controllers..."
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">3. KEY ENGINEERING CHALLENGES</label>
                              <textarea
                                rows={3}
                                value={selectedMsProj.engineeringChallenges}
                                onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, engineeringChallenges: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-sans"
                                placeholder="Latency bottlenecks, socket memory optimization, scroll leaks..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">4. OUTCOMES / METRICS (ONE PER LINE)</label>
                                <textarea
                                  rows={3}
                                  value={selectedMsProj.outcomes}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, outcomes: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-sans font-medium"
                                  placeholder="Sub-12ms query routing latency..."
                                />
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-neutral-450 uppercase mb-1">5. SCALABILITY NOTES & CLOUD</label>
                                <textarea
                                  rows={3}
                                  value={selectedMsProj.scalabilityNotes}
                                  onChange={(e) => updateSelectedMsProjectDetails({ ...selectedMsProj, scalabilityNotes: e.target.value })}
                                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-2 rounded-lg text-[10px] text-white font-sans"
                                  placeholder="Dynamic index querying, horizontal setups, cache speeds..."
                                />
                              </div>
                            </div>
                          </div>

                          {/* SECTION D: KPI SYSTEM */}
                          <div className="space-y-4 pt-3 border-t border-neutral-900">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest border-l-2 border-orange-500 pl-1.5">D. Custom KPI Repeaters</span>
                              <button
                                onClick={() => {
                                  const newKpi = { icon: 'Activity', title: 'Metric', description: 'Parameter description details' };
                                  const nextKpis = [...(selectedMsProj.kpis || []), newKpi];
                                  updateSelectedMsProjectDetails({ ...selectedMsProj, kpis: nextKpis });
                                }}
                                className="text-[8px] font-mono text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded bg-orange-500/5 hover:bg-orange-500/10 cursor-pointer"
                              >
                                + ADD KPI
                              </button>
                            </div>

                            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                              {!selectedMsProj.kpis || selectedMsProj.kpis.length === 0 ? (
                                <p className="text-[9.5px] text-neutral-500 text-center font-mono">No custom KPIs configured. Add a KPI card.</p>
                              ) : (
                                selectedMsProj.kpis.map((k, kIdx) => (
                                  <div key={kIdx} className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-2 relative">
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="block text-[7px] font-bold text-neutral-500 uppercase mb-0.5">Icon</label>
                                        <select
                                          value={k.icon}
                                          onChange={(e) => {
                                            const nextKpis = [...selectedMsProj.kpis];
                                            nextKpis[kIdx] = { ...k, icon: e.target.value };
                                            updateSelectedMsProjectDetails({ ...selectedMsProj, kpis: nextKpis });
                                          }}
                                          className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[9px] text-white p-1 rounded font-bold cursor-pointer"
                                        >
                                          {['Activity', 'Zap', 'Cpu', 'Server', 'Database', 'Radio', 'Layers', 'Shield', 'Globe'].map((ico) => (
                                            <option key={ico} value={ico}>{ico}</option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-span-2">
                                        <label className="block text-[7px] font-bold text-neutral-500 uppercase mb-0.5">Metric Title</label>
                                        <input
                                          type="text"
                                          value={k.title}
                                          onChange={(e) => {
                                            const nextKpis = [...selectedMsProj.kpis];
                                            nextKpis[kIdx] = { ...k, title: e.target.value };
                                            updateSelectedMsProjectDetails({ ...selectedMsProj, kpis: nextKpis });
                                          }}
                                          className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[9px] text-white px-2 py-1 rounded font-bold"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[7px] font-bold text-neutral-500 uppercase mb-0.5">KPI Description</label>
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          value={k.description}
                                          onChange={(e) => {
                                            const nextKpis = [...selectedMsProj.kpis];
                                            nextKpis[kIdx] = { ...k, description: e.target.value };
                                            updateSelectedMsProjectDetails({ ...selectedMsProj, kpis: nextKpis });
                                          }}
                                          className="flex-grow bg-neutral-900 border border-neutral-800 focus:outline-none text-[9px] text-white px-2 py-1 rounded"
                                        />
                                        <button
                                          onClick={() => {
                                            const nextKpis = selectedMsProj.kpis.filter((_: any, idx: number) => idx !== kIdx);
                                            updateSelectedMsProjectDetails({ ...selectedMsProj, kpis: nextKpis });
                                          }}
                                          className="p-1.5 hover:bg-red-950/20 text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* SECTION E: TECH STACK tags */}
                          <div className="space-y-4 pt-3 border-t border-neutral-900">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">E. Tech Stack Tags</span>
                            
                            <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-950 border border-neutral-800 rounded-xl min-h-[48px] items-center">
                              {selectedMsProj.technologies?.map((tech: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono rounded flex items-center gap-1 font-bold">
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextTechs = selectedMsProj.technologies.filter((t: string) => t !== tech);
                                      updateSelectedMsProjectDetails({ ...selectedMsProj, technologies: nextTechs });
                                    }}
                                    className="text-neutral-500 hover:text-red-400 p-0.5 rounded cursor-pointer"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                              <input
                                type="text"
                                placeholder="Type stack tag & press Enter"
                                className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-white ml-2 flex-grow min-w-[120px]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const val = input.value.trim();
                                    if (val && !selectedMsProj.technologies?.includes(val)) {
                                      const nextTechs = [...(selectedMsProj.technologies || []), val];
                                      updateSelectedMsProjectDetails({ ...selectedMsProj, technologies: nextTechs });
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* SECTION F: ACTION BUTTONS */}
                          <div className="space-y-4 pt-3 border-t border-neutral-900">
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">F. Action CTA Buttons</span>
                            
                            {/* Source Code */}
                            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl space-y-2">
                              <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5">
                                <span className="text-[9px] font-mono font-bold text-white uppercase flex items-center gap-1">
                                  <Github className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Source Code Button</span>
                                </span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsProj.actionButtons?.sourceCode?.enabled !== false}
                                  onChange={(e) => {
                                    const actionButtons = { ...selectedMsProj.actionButtons };
                                    actionButtons.sourceCode = { ...actionButtons.sourceCode, enabled: e.target.checked };
                                    updateSelectedMsProjectDetails({ ...selectedMsProj, actionButtons });
                                  }}
                                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                                />
                              </div>
                              <input
                                type="url"
                                value={selectedMsProj.actionButtons?.sourceCode?.url || ''}
                                onChange={(e) => {
                                  const actionButtons = { ...selectedMsProj.actionButtons };
                                  actionButtons.sourceCode = { ...actionButtons.sourceCode, url: e.target.value };
                                  updateSelectedMsProjectDetails({ ...selectedMsProj, actionButtons, githubUrl: e.target.value });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[9.5px] px-2.5 py-1.5 rounded-lg text-white font-mono"
                                placeholder="GitHub URL link (https://...)"
                              />
                            </div>

                            {/* Live Preview */}
                            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl space-y-2">
                              <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5">
                                <span className="text-[9px] font-mono font-bold text-white uppercase flex items-center gap-1">
                                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Live Demo button</span>
                                </span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsProj.actionButtons?.livePreview?.enabled !== false}
                                  onChange={(e) => {
                                    const actionButtons = { ...selectedMsProj.actionButtons };
                                    actionButtons.livePreview = { ...actionButtons.livePreview, enabled: e.target.checked };
                                    updateSelectedMsProjectDetails({ ...selectedMsProj, actionButtons });
                                  }}
                                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                                />
                              </div>
                              <input
                                type="url"
                                value={selectedMsProj.actionButtons?.livePreview?.url || ''}
                                onChange={(e) => {
                                  const actionButtons = { ...selectedMsProj.actionButtons };
                                  actionButtons.livePreview = { ...actionButtons.livePreview, url: e.target.value };
                                  updateSelectedMsProjectDetails({ ...selectedMsProj, actionButtons, demoUrl: e.target.value });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[9.5px] px-2.5 py-1.5 rounded-lg text-white font-mono"
                                placeholder="Live demo URL (https://...)"
                              />
                            </div>

                            {/* Case Study */}
                            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-white uppercase flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                                <span>Narrative Case Study Button Trigger</span>
                              </span>
                              <input
                                type="checkbox"
                                checked={selectedMsProj.actionButtons?.caseStudy?.enabled !== false}
                                onChange={(e) => {
                                  const actionButtons = { ...selectedMsProj.actionButtons };
                                  actionButtons.caseStudy = { ...actionButtons.caseStudy, enabled: e.target.checked };
                                  updateSelectedMsProjectDetails({ ...selectedMsProj, actionButtons });
                                }}
                                className="w-4 h-4 accent-orange-500 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* SECTION G: VISIBILITY TOGGLE */}
                          <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl flex justify-between items-center pt-3 border-t border-neutral-900">
                            <span className="text-[9px] font-mono font-bold text-white uppercase flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-orange-500" />
                              <span>Visible on Portfolio Showcase</span>
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedMsProj.visible !== false}
                              onChange={(e) => toggleMsProjectVisibility(selectedMsProj.id)}
                              className="w-4 h-4 accent-orange-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXPANDED MODAL SYSTEM */}
              {msActiveTab === 'modal' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layout className="w-4 h-4 text-orange-500" />
                      <span>Expanded Modal Configurator</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500">Configure layout types, active narrative sections, and spring overlay speeds.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Layout type */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest">MODAL LAYOUT STYLE</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'split', label: 'Split Workspace', desc: 'Overview / narrative on left, sticky visuals on right side.' },
                          { id: 'centered', label: 'Centered Spotlight', desc: 'Centered flowing chronological engineering case study.' }
                        ].map((lay) => {
                          const isSel = msModalLayout.layoutType === lay.id;
                          return (
                            <div
                              key={lay.id}
                              onClick={() => {
                                const nextModal = { ...msModalLayout, layoutType: lay.id };
                                setMsModalLayout(nextModal);
                                emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                              }}
                              className={`p-4 border rounded-2xl cursor-pointer text-left transition-all duration-300 ${
                                isSel
                                  ? 'bg-orange-950/10 border-orange-500 shadow-md shadow-orange-500/5'
                                  : 'bg-neutral-900/30 border-neutral-850 hover:border-neutral-700'
                              }`}
                            >
                              <span className="block text-xs font-bold text-white uppercase tracking-wider">{lay.label}</span>
                              <span className="block text-[9.5px] text-neutral-500 mt-1 leading-relaxed">{lay.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section toggles */}
                    <div className="space-y-3 pt-3 border-t border-neutral-900">
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">ENABLED NARRATIVE SECTIONS</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: 'overview', label: 'Overview Intro' },
                          { key: 'kpi', label: 'Metric KPIs' },
                          { key: 'challenges', label: 'Engineering Challenges' },
                          { key: 'stack', label: 'Technology Stack' },
                          { key: 'architecture', label: 'System Architecture' },
                          { key: 'gallery', label: 'Visual Gallery' }
                        ].map((sec) => {
                          const val = msModalLayout.enabledSections?.[sec.key] !== false;
                          return (
                            <div
                              key={sec.key}
                              onClick={() => {
                                const enabledSections = { ...msModalLayout.enabledSections, [sec.key]: !val };
                                const nextModal = { ...msModalLayout, enabledSections };
                                setMsModalLayout(nextModal);
                                emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                              }}
                              className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer select-none transition-all duration-300 ${
                                val ? 'bg-neutral-900 border-neutral-750 text-orange-400' : 'bg-neutral-950 border-neutral-850 text-neutral-600'
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wide">{sec.label}</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                val ? 'border-orange-500 bg-orange-500/20 text-orange-400' : 'border-neutral-800 text-transparent'
                              }`}>
                                {val && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Behavior Sliders */}
                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">SPRING TRANSITIONS & VELOCITIES</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Open Transition Speed</span>
                            <span className="text-white font-bold">{msModalLayout.behavior?.animationSpeed || 0.35}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.5"
                            step="0.05"
                            value={msModalLayout.behavior?.animationSpeed || 0.35}
                            onChange={(e) => {
                              const nextModal = { ...msModalLayout, behavior: { ...msModalLayout.behavior, animationSpeed: Number(e.target.value) } };
                              setMsModalLayout(nextModal);
                              emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Blur Intensity</span>
                            <span className="text-white font-bold">{msModalLayout.behavior?.blurIntensity || 12}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={msModalLayout.behavior?.blurIntensity || 12}
                            onChange={(e) => {
                              const nextModal = { ...msModalLayout, behavior: { ...msModalLayout.behavior, blurIntensity: Number(e.target.value) } };
                              setMsModalLayout(nextModal);
                              emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <label className="block text-[8px] font-bold text-neutral-500 uppercase mb-1">Open Transition</label>
                          <select
                            value={msModalLayout.behavior?.openTransition || 'spring'}
                            onChange={(e) => {
                              const nextModal = { ...msModalLayout, behavior: { ...msModalLayout.behavior, openTransition: e.target.value } };
                              setMsModalLayout(nextModal);
                              emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg cursor-pointer font-bold"
                          >
                            <option value="spring">Spring Curve</option>
                            <option value="ease">Ease Out</option>
                            <option value="fade">Fade Spotlight</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-500 uppercase mb-1">Close Transition</label>
                          <select
                            value={msModalLayout.behavior?.closeTransition || 'ease'}
                            onChange={(e) => {
                              const nextModal = { ...msModalLayout, behavior: { ...msModalLayout.behavior, closeTransition: e.target.value } };
                              setMsModalLayout(nextModal);
                              emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg cursor-pointer font-bold"
                          >
                            <option value="spring">Spring Curve</option>
                            <option value="ease">Ease In</option>
                            <option value="fade">Fade Spotlight</option>
                          </select>
                        </div>

                        <div className="flex flex-col justify-end">
                          <div className="flex justify-between items-center p-1.5 bg-neutral-950 border border-neutral-850 rounded-lg">
                            <span className="text-[8px] font-bold text-neutral-450 uppercase pl-1">Border Neon Glow</span>
                            <input
                              type="checkbox"
                              checked={msModalLayout.behavior?.borderGlow !== false}
                              onChange={(e) => {
                                const nextModal = { ...msModalLayout, behavior: { ...msModalLayout.behavior, borderGlow: e.target.checked } };
                                setMsModalLayout(nextModal);
                                emitProjectsSectionUpdate(getMsCombinedSection({ modalLayout: nextModal }));
                              }}
                              className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TECH & STACK ENGINE */}
              {msActiveTab === 'tech' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        <span>Visual Tech Stack Engine</span>
                      </h4>
                      <p className="text-[10px] text-neutral-500">Configure visual tech orbit rings, neon glows, and custom expertise index levels.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newTech = {
                          id: `tech-${Date.now()}`,
                          label: 'NEW TECH',
                          icon: 'Globe',
                          glowColor: '#f97316',
                          expertiseLevel: 90,
                          category: 'Tools'
                        };
                        const nextOrbit = [...msTechOrbit, newTech];
                        setMsTechOrbit(nextOrbit);
                        emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                      }}
                      className="text-[9px] font-mono font-bold text-orange-500 border border-orange-500/20 px-2.5 py-1.5 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 cursor-pointer uppercase shadow-sm shrink-0"
                    >
                      + ADD TECH NODE
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                    {msTechOrbit.length === 0 ? (
                      <p className="text-[10px] text-neutral-500 text-center py-4 font-mono">No custom technologies active. Add a technology node.</p>
                    ) : (
                      msTechOrbit.map((tech, idx) => (
                        <div key={tech.id} className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl space-y-3 text-xs">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                            <div>
                              <label className="block text-[7.5px] font-bold text-neutral-500 uppercase mb-0.5">Technology Label</label>
                              <input
                                type="text"
                                value={tech.label}
                                onChange={(e) => {
                                  const nextOrbit = [...msTechOrbit];
                                  nextOrbit[idx] = { ...tech, label: e.target.value };
                                  setMsTechOrbit(nextOrbit);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2.5 py-1.5 rounded-lg font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[7.5px] font-bold text-neutral-500 uppercase mb-0.5">Category Group</label>
                              <input
                                type="text"
                                value={tech.category}
                                onChange={(e) => {
                                  const nextOrbit = [...msTechOrbit];
                                  nextOrbit[idx] = { ...tech, category: e.target.value };
                                  setMsTechOrbit(nextOrbit);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2.5 py-1.5 rounded-lg font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[7.5px] font-bold text-neutral-500 uppercase mb-0.5">Icon Pill</label>
                              <select
                                value={tech.icon}
                                onChange={(e) => {
                                  const nextOrbit = [...msTechOrbit];
                                  nextOrbit[idx] = { ...tech, icon: e.target.value };
                                  setMsTechOrbit(nextOrbit);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white p-1.5 rounded-lg cursor-pointer font-bold"
                              >
                                {['Globe', 'Cpu', 'Layers', 'Server', 'Database', 'Radio', 'Zap', 'Activity'].map((ico) => (
                                  <option key={ico} value={ico}>{ico}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[7.5px] font-bold text-neutral-500 uppercase mb-0.5">Glow Accent</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={tech.glowColor || '#3b82f6'}
                                  onChange={(e) => {
                                    const nextOrbit = [...msTechOrbit];
                                    nextOrbit[idx] = { ...tech, glowColor: e.target.value };
                                    setMsTechOrbit(nextOrbit);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                  }}
                                  className="w-6 h-6 rounded border border-neutral-800 bg-transparent overflow-hidden cursor-pointer shrink-0"
                                />
                                <input
                                  type="text"
                                  value={tech.glowColor}
                                  onChange={(e) => {
                                    const nextOrbit = [...msTechOrbit];
                                    nextOrbit[idx] = { ...tech, glowColor: e.target.value };
                                    setMsTechOrbit(nextOrbit);
                                    emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                  }}
                                  className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1 rounded font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-1.5 border-t border-neutral-900/60">
                            <div className="flex-grow space-y-1">
                              <div className="flex justify-between text-[7px] font-mono text-neutral-500 uppercase">
                                <span>Expertise Level Indicator</span>
                                <span className="text-white font-bold">{tech.expertiseLevel || 90}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={tech.expertiseLevel || 90}
                                onChange={(e) => {
                                  const nextOrbit = [...msTechOrbit];
                                  nextOrbit[idx] = { ...tech, expertiseLevel: Number(e.target.value) };
                                  setMsTechOrbit(nextOrbit);
                                  emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                                }}
                                className="w-full accent-orange-500 h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <button
                              onClick={() => {
                                const nextOrbit = msTechOrbit.filter((t) => t.id !== tech.id);
                                setMsTechOrbit(nextOrbit);
                                emitProjectsSectionUpdate(getMsCombinedSection({ techOrbit: nextOrbit }));
                              }}
                              className="p-2 border border-neutral-800 hover:border-red-500/40 bg-neutral-950 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-xl transition-all cursor-pointer shadow-inner mt-2.5 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: HOVER & BLURS (LIVE PREVIEW CONTROLS) */}
              {msActiveTab === 'live' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-500" />
                      <span>Live Preview & Showcase Filters</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500">Configure visual showcase card zoom parameters, transparency, and background overlays.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Hover zooms */}
                    <div className="space-y-4">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">Card Hover Interactions</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Image Scale Factor</span>
                            <span className="text-white font-bold">{msLivePreviewControls.cardHover?.scale || 1.02}x</span>
                          </div>
                          <input
                            type="range"
                            min="1.00"
                            max="1.10"
                            step="0.01"
                            value={msLivePreviewControls.cardHover?.scale || 1.02}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, cardHover: { ...msLivePreviewControls.cardHover, scale: Number(e.target.value) } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Image Zoom Zoom</span>
                            <span className="text-white font-bold">{msLivePreviewControls.cardHover?.imageZoom || 1.05}x</span>
                          </div>
                          <input
                            type="range"
                            min="1.00"
                            max="1.20"
                            step="0.01"
                            value={msLivePreviewControls.cardHover?.imageZoom || 1.05}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, cardHover: { ...msLivePreviewControls.cardHover, imageZoom: Number(e.target.value) } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Spotlight Blur Intensity</span>
                            <span className="text-white font-bold">{msLivePreviewControls.cardHover?.blurIntensity || 8}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={msLivePreviewControls.cardHover?.blurIntensity || 8}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, cardHover: { ...msLivePreviewControls.cardHover, blurIntensity: Number(e.target.value) } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-850 rounded-xl mt-3.5">
                          <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase pl-1.5">Shadow Glow Spotlight</span>
                          <input
                            type="checkbox"
                            checked={msLivePreviewControls.cardHover?.shadowGlow !== false}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, cardHover: { ...msLivePreviewControls.cardHover, shadowGlow: e.target.checked } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-4 h-4 accent-orange-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Background System */}
                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">Matte & Background Overlays</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Grid Overlay Opacity</span>
                            <span className="text-white font-bold">{msLivePreviewControls.background?.overlayOpacity || 0.08}</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="0.5"
                            step="0.01"
                            value={msLivePreviewControls.background?.overlayOpacity || 0.08}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, background: { ...msLivePreviewControls.background, overlayOpacity: Number(e.target.value) } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Glassmorphic Card Opacity</span>
                            <span className="text-white font-bold">{msLivePreviewControls.background?.cardTransparency || 0.3}</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={msLivePreviewControls.background?.cardTransparency || 0.3}
                            onChange={(e) => {
                              const nextControls = { ...msLivePreviewControls, background: { ...msLivePreviewControls.background, cardTransparency: Number(e.target.value) } };
                              setMsLivePreviewControls(nextControls);
                              emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                          <span>Glass Back Blurs</span>
                          <span className="text-white font-bold">{msLivePreviewControls.background?.glassBlur || 16}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="1"
                          value={msLivePreviewControls.background?.glassBlur || 16}
                          onChange={(e) => {
                            const nextControls = { ...msLivePreviewControls, background: { ...msLivePreviewControls.background, glassBlur: Number(e.target.value) } };
                            setMsLivePreviewControls(nextControls);
                            emitProjectsSectionUpdate(getMsCombinedSection({ livePreviewControls: nextControls }));
                          }}
                          className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ANIMATION & LAYOUT */}
              {msActiveTab === 'layout' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-orange-500" />
                      <span>Grid Animation & Layout Spacings</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500">Configure global card layout radius parameters, spacing grids, and ease spring velocities.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Grids and spacings */}
                    <div className="space-y-4">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">Showcase Grid Metrics</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Card Spacing Spreads</span>
                            <span className="text-white font-bold">{msAnimationLayout.cardSpacing || 24}px</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="48"
                            step="2"
                            value={msAnimationLayout.cardSpacing || 24}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, cardSpacing: Number(e.target.value) };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Border Corners Radius</span>
                            <span className="text-white font-bold">{msAnimationLayout.modalRadius || 32}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="48"
                            step="4"
                            value={msAnimationLayout.modalRadius || 32}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, modalRadius: Number(e.target.value) };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Hover Glow Brightness</span>
                            <span className="text-white font-bold">{msAnimationLayout.cardGlow || 15}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={msAnimationLayout.cardGlow || 15}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, cardGlow: Number(e.target.value) };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase">
                            <span>Hover Animation Velocity</span>
                            <span className="text-white font-bold">{msAnimationLayout.hoverSpeed || 300}ms</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={msAnimationLayout.hoverSpeed || 300}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, hoverSpeed: Number(e.target.value) };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full accent-orange-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Presets and options */}
                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block border-l-2 border-orange-500 pl-1.5">Preset Easing Metrics</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-bold text-neutral-500 uppercase mb-1">Grid Layout Density</label>
                          <select
                            value={msAnimationLayout.layoutDensity || 'cozy'}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, layoutDensity: e.target.value };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg cursor-pointer font-bold"
                          >
                            <option value="compact">Dense / Compact</option>
                            <option value="cozy">Cozy / Balanced</option>
                            <option value="spacious">Spacious / Breathable</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-500 uppercase mb-1">Transition ease Curve</label>
                          <select
                            value={msAnimationLayout.transitionCurve || 'cubic-bezier(0.16, 1, 0.3, 1)'}
                            onChange={(e) => {
                              const nextLayout = { ...msAnimationLayout, transitionCurve: e.target.value };
                              setMsAnimationLayout(nextLayout);
                              emitProjectsSectionUpdate(getMsCombinedSection({ animationLayout: nextLayout }));
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg cursor-pointer font-mono text-[9px] font-bold"
                          >
                            <option value="cubic-bezier(0.16, 1, 0.3, 1)">Cubic Smooth (Out)</option>
                            <option value="cubic-bezier(0.25, 1, 0.5, 1)">Quart (Out)</option>
                            <option value="linear">Linear Easing</option>
                            <option value="spring">Spring Velocity</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ==========================================
             RIGHT COLUMN: LIVE INTERACTIVE PREVIEW VIEWPORT
             ========================================== */}
          <div className={`xl:col-span-6 space-y-4 lg:sticky lg:top-5 ${showPreviewMobile ? 'block' : 'hidden xl:block'}`}>
            
            {/* Simulated Frame Top Controls */}
            <div className="flex justify-between items-center bg-neutral-950 border border-neutral-850 p-2 rounded-2xl">
              <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-500 pl-2 uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span>Simulated Showcase Viewport</span>
              </span>

              <div className="flex gap-1.5">
                {[
                  { id: 'desktop', label: 'Desktop', size: 'w-full' },
                  { id: 'tablet', label: 'Tablet', size: 'max-w-[768px]' },
                  { id: 'mobile', label: 'Mobile', size: 'max-w-[375px]' }
                ].map((sizeOpt) => {
                  const isSel = simulatedViewport === sizeOpt.id;
                  return (
                    <button
                      key={sizeOpt.id}
                      onClick={() => setSimulatedViewport(sizeOpt.id as any)}
                      className={`px-3 py-1 border rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        isSel
                          ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-extrabold shadow-sm'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white'
                      }`}
                    >
                      {sizeOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIMULATION CONTAINER FRAME */}
            <div className="w-full flex justify-center bg-neutral-900/30 border border-neutral-850 rounded-[32px] p-4.5 overflow-hidden min-h-[580px] relative">
              {/* Subtle background grids */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[32px]"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_0px,rgba(249,115,22,0.06),transparent)] rounded-[32px] pointer-events-none" />

              {/* Viewport Frame Box with dynamic resizing */}
              <div
                className={`bg-neutral-950 border border-neutral-850 rounded-[28px] overflow-hidden flex flex-col justify-start select-none relative shadow-2xl transition-all duration-500 ${
                  simulatedViewport === 'desktop' ? 'w-full' : simulatedViewport === 'tablet' ? 'w-[480px] sm:w-[580px]' : 'w-[320px] sm:w-[350px]'
                }`}
                style={{
                  minHeight: '520px',
                  borderRadius: `${msAnimationLayout.modalRadius || 32}px`
                }}
              >
                {/* Simulated URL Address Bar */}
                <div className="px-4 py-2 border-b border-neutral-900 bg-neutral-900/30 shrink-0 flex items-center justify-between text-[8.5px] font-mono text-neutral-500">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/60"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/60"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500/60"></span>
                  </div>
                  <span className="bg-neutral-950/80 px-4 py-0.5 rounded border border-neutral-850 truncate max-w-[70%]">
                    https://mahi-singh.dev/projects
                  </span>
                  <span className="text-[7px]">⚡ INSTANT MOCK</span>
                </div>

                {/* SIMULATED CONTENT VIEWPORTS SCREEN */}
                <div 
                  className="flex-1 overflow-y-auto p-4.5 space-y-6 text-left"
                  style={{
                    padding: msAnimationLayout.layoutDensity === 'compact' ? '12px' : msAnimationLayout.layoutDensity === 'spacious' ? '28px' : '18px'
                  }}
                >
                  
                  {/* Category and Header section */}
                  <div className="space-y-3 pb-4 border-b border-neutral-900 flex flex-col gap-2">
                    <div>
                      <span className="text-[7.5px] font-mono tracking-widest text-orange-500 font-extrabold uppercase">{msBadge || 'BUILDS + SCALABLE DEPLOYMENTS'}</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight mt-0.5 font-heading">
                        {msHeading || 'PROJECTS THAT SOLVE REAL PROBLEMS'}
                      </h4>
                      <p className="text-[9.5px] text-neutral-400 font-light font-sans mt-1 leading-relaxed">
                        {msSubtext || 'AI systems and scalable platform showcases.'}
                      </p>
                    </div>

                    {/* Filter categories pills */}
                    <div className="flex flex-wrap gap-1 items-center pt-1.5">
                      {msCategories.filter(c => c.active).map(cat => {
                        const isS = simulatedFilter === cat.id;
                        return (
                          <span
                            key={cat.id}
                            onClick={() => setSimulatedFilter(cat.id)}
                            className="px-2.5 py-1 rounded-full text-[7.5px] font-bold tracking-widest uppercase cursor-pointer border transition-all duration-300"
                            style={{
                              borderColor: isS ? `${cat.accentColor}30` : 'rgba(255,255,255,0.05)',
                              backgroundColor: isS ? `${cat.accentColor}10` : 'rgba(255,255,255,0.02)',
                              color: isS ? cat.accentColor : '#a3a3a3'
                            }}
                          >
                            {cat.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Simulated Cards Grid Layout */}
                  <div
                    className={`grid gap-4 items-stretch ${
                      simulatedViewport === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'
                    }`}
                    style={{
                      gap: `${msAnimationLayout.cardSpacing || 24}px`
                    }}
                  >
                    {msProjectsList
                      .filter((p) => p.visible !== false)
                      .filter((p) => {
                        if (simulatedFilter === 'ALL') return true;
                        if (simulatedFilter === 'FULL STACK') return p.technologies?.includes('React') || p.technologies?.includes('Next.js');
                        if (simulatedFilter === 'AI/PYTHON') return p.technologies?.includes('Python') || p.technologies?.includes('Gemini LLM');
                        if (simulatedFilter === 'BACKEND') return p.technologies?.includes('Node.js') || p.technologies?.includes('PostgreSQL');
                        return p.category === simulatedFilter;
                      })
                      .map((p) => {
                        const cardAccent = p.gradientAccent || '#f97316';
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSimulatedSelectedProject(p)}
                            className="flex flex-col overflow-hidden border border-white/5 rounded-2xl bg-neutral-900/35 hover:bg-neutral-900/60 transition-all duration-300 relative group cursor-pointer text-left"
                            style={{
                              height: '430px',
                              borderRadius: `${msAnimationLayout.modalRadius || 32}px`,
                              borderColor: 'rgba(255, 255, 255, 0.05)'
                            }}
                          >
                            {/* Accent Glow Spotlights */}
                            <div
                              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 opacity-0 group-hover:opacity-100"
                              style={{
                                background: `radial-gradient(120px circle at 50% 20%, ${cardAccent}10, transparent 80%)`,
                              }}
                            />

                            {/* Image Visual (Strictly 160px height) */}
                            <div className="relative w-full h-[160px] overflow-hidden shrink-0 border-b border-white/5 bg-neutral-950">
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform pointer-events-none"
                                style={{
                                  backgroundImage: `url(${p.image})`,
                                  transform: `scale(1)`
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/10 to-transparent" />
                              
                              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[7px] font-mono border font-extrabold uppercase tracking-widest bg-neutral-950/80"
                                    style={{ borderColor: `${cardAccent}40`, color: cardAccent }}>
                                {p.status}
                              </span>
                            </div>

                            {/* Middle specs details content */}
                            <div className="p-4 flex flex-col justify-between flex-grow relative z-10 space-y-2">
                              <div className="space-y-1.5">
                                <span className="text-[7.5px] font-mono tracking-widest font-extrabold uppercase"
                                      style={{ color: cardAccent }}>
                                  {p.category}
                                </span>
                                <h5 className="text-[12px] font-black text-white uppercase tracking-tight truncate group-hover:text-white transition-colors">
                                  {p.title}
                                </h5>
                                <p className="text-neutral-400 text-[10px] font-light leading-relaxed font-sans line-clamp-3">
                                  {p.description}
                                </p>
                              </div>

                              {/* Footer stack elements and button shortcuts */}
                              <div className="pt-2 border-t border-white/5 flex justify-between items-center mt-auto">
                                <div className="flex flex-wrap gap-1 max-w-[70%]">
                                  {p.technologies?.slice(0, 2).map((t: string) => (
                                    <span key={t} className="px-1.5 py-0.5 rounded bg-neutral-950 border border-white/5 text-neutral-400 font-mono text-[7px] font-extrabold uppercase">
                                      {t}
                                    </span>
                                  ))}
                                  {p.technologies?.length > 2 && (
                                    <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-white/5 text-neutral-500 font-mono text-[7px] font-bold uppercase">
                                      +{p.technologies.length - 2} MORE
                                    </span>
                                  )}
                                </div>

                                <div className="flex gap-1">
                                  {p.actionButtons?.sourceCode?.enabled !== false && (
                                    <span className="p-1 rounded bg-neutral-950 border border-white/5 text-neutral-500 hover:text-white transition-all text-[8px] font-mono">
                                      <Github className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                  {p.actionButtons?.livePreview?.enabled !== false && (
                                    <span className="p-1 rounded bg-orange-600 text-neutral-950 transition-all text-[8px] font-mono font-bold flex items-center justify-center">
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* SIMULATED DYNAMIC VIEWPORT DETAILS MODAL OVERLAYS */}
                {simulatedSelectedProject && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center p-3 animate-fade-in select-none">
                    {/* Simulated modal backdrop */}
                    <div
                      onClick={() => setSimulatedSelectedProject(null)}
                      className="absolute inset-0 bg-black/90 z-0 cursor-pointer"
                      style={{
                        backdropFilter: `blur(${msModalLayout.behavior?.blurIntensity || 12}px)`
                      }}
                    />

                    {/* Simulated Modal Box */}
                    <div
                      className="relative w-full max-h-[90%] bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-left"
                      style={{
                        borderColor: msModalLayout.behavior?.borderGlow ? `${simulatedSelectedProject.gradientAccent || '#f97316'}40` : 'rgba(255,255,255,0.08)',
                        borderRadius: `${msAnimationLayout.modalRadius || 32}px`
                      }}
                    >
                      {/* Modal Header */}
                      <div className="px-4 py-3 bg-neutral-900/40 border-b border-neutral-900 shrink-0 flex justify-between items-center relative z-20">
                        <div>
                          <span className="text-[7px] font-mono uppercase bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-2 py-0.5"
                                style={{ color: simulatedSelectedProject.gradientAccent, borderColor: `${simulatedSelectedProject.gradientAccent}30` }}>
                            {simulatedSelectedProject.category}
                          </span>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-tight mt-0.5 leading-tight">{simulatedSelectedProject.title}</h4>
                        </div>

                        <button
                          onClick={() => setSimulatedSelectedProject(null)}
                          className="p-1 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Modal Scroll Content */}
                      <div className="flex-grow overflow-y-auto p-4 space-y-4 text-[9.5px]">
                        
                        {/* Dynamic layout split vs centered */}
                        {msModalLayout.layoutType === 'split' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Col Overview */}
                            <div className="space-y-4">
                              {msModalLayout.enabledSections?.overview !== false && (
                                <div className="space-y-1">
                                  <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Project Overview</span>
                                  <p className="text-neutral-300 leading-relaxed font-sans font-light">{simulatedSelectedProject.description}</p>
                                </div>
                              )}

                              {msModalLayout.enabledSections?.kpi !== false && simulatedSelectedProject.kpis && (
                                <div className="space-y-2">
                                  <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Key Outcomes Metrics</span>
                                  <div className="space-y-1.5">
                                    {simulatedSelectedProject.kpis.map((k: any, i: number) => (
                                      <div key={i} className="flex gap-2 p-2 bg-neutral-900 border border-white/5 rounded-lg items-center">
                                        <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                        <div className="text-left font-mono">
                                          <span className="block text-[8px] font-extrabold text-white uppercase">{k.title}</span>
                                          <span className="block text-[7.5px] text-neutral-400">{k.description}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Col Media & Details */}
                            <div className="space-y-4">
                              {msModalLayout.enabledSections?.gallery !== false && (
                                <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video shrink-0 relative">
                                  <img src={simulatedSelectedProject.image} className="w-full h-full object-cover" />
                                </div>
                              )}

                              {msModalLayout.enabledSections?.stack !== false && (
                                <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl space-y-2">
                                  <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Stack Applied</span>
                                  <div className="flex flex-wrap gap-1">
                                    {simulatedSelectedProject.technologies?.map((tech: string) => (
                                      <span key={tech} className="px-1.5 py-0.5 rounded bg-neutral-950 border border-white/5 text-[7px] font-mono font-bold uppercase text-neutral-300">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Centered layout
                          <div className="space-y-4 max-w-lg mx-auto">
                            {msModalLayout.enabledSections?.overview !== false && (
                              <div className="space-y-1 text-center pb-2 border-b border-neutral-900">
                                <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Overview Narrative</span>
                                <p className="text-neutral-350 leading-relaxed font-sans font-light max-w-sm mx-auto">{simulatedSelectedProject.description}</p>
                              </div>
                            )}

                            {msModalLayout.enabledSections?.architecture !== false && (
                              <div className="space-y-1">
                                <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Orchestrated Architecture Layout</span>
                                <p className="text-neutral-450 leading-relaxed font-sans font-light">{simulatedSelectedProject.architectureDescription}</p>
                              </div>
                            )}

                            {msModalLayout.enabledSections?.challenges !== false && (
                              <div className="space-y-1">
                                <span className="text-[7.5px] font-mono uppercase text-neutral-500 font-bold block">Challenges Engaged & Caches Fixed</span>
                                <p className="text-neutral-450 leading-relaxed font-sans font-light">{simulatedSelectedProject.engineeringChallenges}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className="px-4 py-3 bg-neutral-950 border-t border-neutral-900 shrink-0 flex justify-end gap-2 relative z-20">
                        {simulatedSelectedProject.actionButtons?.sourceCode?.enabled !== false && (
                          <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 text-[8.5px] font-mono font-bold uppercase tracking-wider">
                            Source Repo
                          </span>
                        )}
                        {simulatedSelectedProject.actionButtons?.livePreview?.enabled !== false && (
                          <span className="px-3 py-1.5 rounded-lg bg-orange-600 text-neutral-950 text-[8.5px] font-mono font-black uppercase tracking-wider"
                                style={{ backgroundColor: simulatedSelectedProject.gradientAccent }}>
                            Live View
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="bg-neutral-950/40 border border-neutral-850 p-4.5 rounded-3xl text-left space-y-1.5">
              <span className="text-[8px] font-mono font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Simulated Preview Studio Tips</span>
              </span>
              <p className="text-[10px] text-neutral-500 leading-relaxed leading-snug">
                Clicking a project card in the simulated browser on the right will dynamically pop open the Apple TV viewport modal. All changes on the left are bound React states: adjustments instantly propagate with **0ms latency**!
              </p>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={deleteMsProjectEntity}
          title="Delete Showcase Project"
          message="Are you absolutely sure you want to delete this showcase item? All data, cover links, and telemetry parameters will be lost."
          confirmText="DELETE PROJECT"
        />
      </div>
    );
  }

  const isKS = user?.portfolioSlug === 'khushaboo';

  if (isKS) {
    const safeProj = selectedProj ? {
      id: selectedProj.id,
      title: selectedProj.title || '',
      description: selectedProj.description || '',
      type: selectedProj.type || 'PROTOTYPE',
      featured: selectedProj.featured || false,
      image: selectedProj.image || '',
      technologies: selectedProj.technologies || selectedProj.techStack || [],
      metrics: selectedProj.metrics || [],
      githubUrl: selectedProj.githubUrl || '',
      demoUrl: selectedProj.demoUrl || '',
      visible: selectedProj.visible !== false,
      order: selectedProj.order || 1,
      // Rich fields
      desktopImage: selectedProj.desktopImage || selectedProj.image || '',
      mobileImage: selectedProj.mobileImage || selectedProj.image || '',
      videoPreview: selectedProj.videoPreview || '',
      smallLabel: selectedProj.smallLabel || (selectedProj.featured ? 'Pinned Build' : 'Independent Work'),
      highlights: selectedProj.highlights || selectedProj.outcomes || [],
      actionButtons: selectedProj.actionButtons || {
        liveDemo: { label: 'Live Demo', enabled: true, url: selectedProj.demoUrl || selectedProj.liveUrl || '' },
        github: { label: 'GitHub', enabled: true, url: selectedProj.githubUrl || '' },
        caseStudy: { label: 'View Details', enabled: true }
      },
      technicalBreakdown: selectedProj.technicalBreakdown || {
        architecture: selectedProj.architecture || '',
        apis: selectedProj.apis || '',
        optimization: selectedProj.optimization || '',
        animations: selectedProj.animations || '',
        backendLogic: selectedProj.backendLogic || ''
      },
      mediaGallery: selectedProj.mediaGallery || [],
      status: selectedProj.status || (selectedProj.featured ? 'Featured' : 'Live')
    } : null;

    const BentoAccordion = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
      const isOpen = openBentoSection === id;
      return (
        <div className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.04)]' : 'border-border/60 hover:border-border/80'
        }`}>
          <button
            type="button"
            onClick={() => setOpenBentoSection(isOpen ? null : id)}
            className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-white/[0.01]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg border ${isOpen ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-muted border-border text-muted-foreground'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">{title}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90 text-white' : ''}`} />
          </button>
          {isOpen && (
            <div className="p-5 border-t border-border/40 space-y-4 bg-white/[0.005]">
              {children}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4 sm:space-y-6 select-none animate-fade-in text-left">
        {/* CMS Page Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-3.5 gap-3 mb-4">
          <div className="text-left w-full sm:w-auto">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground heading-font leading-none">Project Experience CMS</h3>
            <p className="text-[9.5px] sm:text-[11px] text-muted-foreground mt-1.5 leading-snug">Showcase real products beautifully with outcome highlights and visual mockups.</p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="xl:hidden w-full sm:w-auto justify-center flex items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>

            <button
              onClick={saveProjectsSection}
              disabled={saving}
              className="w-full sm:w-auto justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0 border-none"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'SYNCING...' : 'SAVE'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Header Badge Text fields */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>Global Projects Header Showcase Settings</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Badge Pill Text</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => handleSectionTextChange('badge', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                placeholder="e.g. SELECTED WORK"
              />
            </div>
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Main Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => handleSectionTextChange('heading', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white uppercase"
                placeholder="e.g. SELECTED EXPERIENCES"
              />
            </div>
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Showcase Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => handleSectionTextChange('description', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                placeholder="A curated showcase of custom designs..."
              />
            </div>
          </div>
        </div>

        {/* Two-Pane Split Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start">
          
          {/* LEFT COLUMN: Visual Project Inventory List */}
          <div className="xl:col-span-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1.5">
            
            {/* Create Project Glass Card */}
            <div
              onClick={createProjectEntity}
              className="border border-dashed border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 text-center text-amber-400 font-bold uppercase text-[9.5px] tracking-wider transition-all duration-300 min-h-[100px] shadow-sm shrink-0"
            >
              <Plus className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>+ Add New Product Showcase</span>
            </div>

            {projectsList.length === 0 ? (
              <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl">
                <p className="text-xs text-muted-foreground">No showcase builds configured. Add your first build draft!</p>
              </div>
            ) : (
              projectsList.map((p, index) => {
                const isActive = selectedProjectId === p.id;
                const statusName = p.status || (p.featured ? 'Featured' : 'Live');
                const pTechs = p.technologies || p.techStack || [];
                return (
                  <div
                    key={p.id}
                    onClick={() => { setSelectedProjectId(p.id); setOpenBentoSection('hero'); setShowPreviewMobile(true); }}
                    className={`border rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 cursor-pointer relative select-none shrink-0 ${
                      isActive
                        ? 'bg-amber-500/5 border-amber-500 shadow-[0_4px_30px_rgba(245,158,11,0.08)]'
                        : 'bg-card border-border hover:border-amber-500/20'
                    }`}
                  >
                    {/* Visual Cover image */}
                    <div className="w-full h-32 overflow-hidden border-b border-border/60 bg-neutral-950 flex items-center justify-center relative">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {/* Floating status badge */}
                      <span className="absolute top-3 left-3 text-[8.5px] font-mono font-extrabold uppercase px-2 py-0.5 border bg-neutral-950/80 rounded leading-none shrink-0 border-amber-500/30 text-amber-400 z-10 shadow-sm">
                        {statusName}
                      </span>
                    </div>

                    {/* Content specs */}
                    <div className="p-4 space-y-2 text-left">
                      <h5 className="text-xs font-bold text-white uppercase truncate group-hover:text-amber-400 transition-all leading-tight">
                        {p.title}
                      </h5>
                      <div className="flex flex-wrap gap-1 items-center">
                        {/* Mobile view: single line text separated by dots */}
                        <div className="sm:hidden text-[8px] font-mono uppercase text-neutral-400 font-bold select-none py-0.5">
                          {pTechs.slice(0, 2).join(' • ')}
                          {pTechs.length > 2 ? ` • +${pTechs.length - 2}` : ''}
                        </div>

                        {/* Desktop view: clean individual pills */}
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {pTechs.slice(0, 3).map((tech: string, i: number) => (
                            <span key={i} className="text-[8px] font-mono uppercase bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-neutral-400">
                              {tech}
                            </span>
                          ))}
                          {pTechs.length > 3 && (
                            <span className="text-[8px] font-mono uppercase bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-neutral-500">
                              +{pTechs.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Control Bar */}
                    <div className="px-4 py-2 border-t border-border/60 bg-neutral-950/30 flex justify-between items-center text-[8.5px] font-mono" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProjectReorder(index, 'up')}
                          disabled={index === 0}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleProjectReorder(index, 'down')}
                          disabled={index === projectsList.length - 1}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleProjectVisibility(p.id)}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                          {p.visible ? <Eye className="w-3.5 h-3.5 text-amber-500" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />}
                        </button>
                        <button
                          onClick={() => confirmDeleteProject(p.id)}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* RIGHT COLUMN: Cinematic Bento Config Panels */}
          <div className={`xl:col-span-7 flex flex-col gap-4 ${showPreviewMobile ? 'block' : 'hidden xl:block'}`}>
            
            {!safeProj ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                <div className="p-4 bg-muted border border-border rounded-[24px]">
                  <FolderKanban className="w-12 h-12 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">No Showcase Build Selected</h4>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Select a flagship product card from your catalog on the left to configure real outcomes, technical deep dives, and screenshots.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col justify-start h-full">
                
                {/* Active Edit Header */}
                <div className="bg-card border border-border/80 rounded-2xl p-4.5 flex justify-between items-center">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-amber-500">Currently Configured Workspace //</span>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight font-heading leading-tight">{safeProj.title}</h4>
                  </div>
                  <span className="text-[8.5px] font-mono bg-muted border border-border px-2 py-0.5 rounded text-neutral-400">
                    ID: {safeProj.id.slice(0, 8)}
                  </span>
                </div>

                {/* 1. PROJECT HERO ACCORDION */}
                <BentoAccordion id="hero" title="1. Project Hero Visuals" icon={Globe}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Project Name</label>
                      <input
                        type="text"
                        value={safeProj.title}
                        onChange={(e) => updateSelectedProjectDetails({ ...safeProj, title: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. ShopLens Marketplace"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Small Sub-Label</label>
                      <input
                        type="text"
                        value={safeProj.smallLabel}
                        onChange={(e) => updateSelectedProjectDetails({ ...safeProj, smallLabel: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. LIVE PORTAL • PINNED BUILD"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Short Conversational Description (Human-Readable)</label>
                    <textarea
                      rows={3}
                      value={safeProj.description}
                      onChange={(e) => updateSelectedProjectDetails({ ...safeProj, description: e.target.value })}
                      className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                      placeholder="e.g. A localized peer-to-peer marketplace system helping local vendors sell products online."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Desktop Cover URL</label>
                      <input
                        type="url"
                        value={safeProj.desktopImage}
                        onChange={(e) => updateSelectedProjectDetails({ ...safeProj, desktopImage: e.target.value, image: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mobile Cover URL (Optional)</label>
                      <input
                        type="url"
                        value={safeProj.mobileImage}
                        onChange={(e) => updateSelectedProjectDetails({ ...safeProj, mobileImage: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Video Loop URL (Optional)</label>
                      <input
                        type="url"
                        value={safeProj.videoPreview}
                        onChange={(e) => updateSelectedProjectDetails({ ...safeProj, videoPreview: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="flex flex-col justify-end">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Interactive Upload (Replace Desktop cover)</label>
                      <div className="relative inline-block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCoverUpload(e, safeProj.id)}
                          disabled={uploadingImage}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          className="w-full px-4 py-2 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-[9.5px] font-bold uppercase rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading image...' : 'REPLACE VIA UPLOAD'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Technologies Stack tags</label>
                    <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border rounded-xl min-h-[48px] items-center">
                      {safeProj.technologies?.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-muted text-[10px] text-zinc-300 font-mono rounded border border-border flex items-center gap-1">
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextTechs = safeProj.technologies.filter((t: string) => t !== tech);
                              updateSelectedProjectDetails({ ...safeProj, technologies: nextTechs });
                            }}
                            className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Type tag & press Enter"
                        className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-white ml-2 flex-grow min-w-[120px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const val = input.value.trim();
                            if (val && !safeProj.technologies?.includes(val)) {
                              const nextTechs = [...(safeProj.technologies || []), val];
                              updateSelectedProjectDetails({ ...safeProj, technologies: nextTechs });
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </BentoAccordion>

                {/* 2. PROJECT OUTCOMES ACCORDION */}
                <BentoAccordion id="outcomes" title="2. Project Outcomes & Highlights" icon={CheckCircle2}>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-border/20 pb-1">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Outcome Bullet Highlights list</label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextHighlights = [...safeProj.highlights, 'New Key Highlight Outcome Bullet'];
                          updateSelectedProjectDetails({ ...safeProj, highlights: nextHighlights });
                        }}
                        className="text-[9px] font-bold text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 px-2 py-0.5 rounded bg-amber-500/5 transition-all cursor-pointer"
                      >
                        + ADD BULLET
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {safeProj.highlights.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center py-4 font-mono">No outcomes loaded. Add your first key result bullet.</p>
                      ) : (
                        safeProj.highlights.map((hl: string, hIdx: number) => (
                          <div key={hIdx} className="flex gap-2 items-center">
                            <span className="text-amber-500 font-bold text-xs select-none">•</span>
                            <input
                              type="text"
                              value={hl}
                              onChange={(e) => {
                                const nextHighlights = [...safeProj.highlights];
                                nextHighlights[hIdx] = e.target.value;
                                updateSelectedProjectDetails({ ...safeProj, highlights: nextHighlights });
                              }}
                              className="flex-grow bg-background border border-border focus:border-amber-500 focus:outline-none px-3 py-1.5 rounded-lg text-xs text-white"
                              placeholder="e.g. Real-time geospatial location clustering maps"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextHighlights = safeProj.highlights.filter((_: string, idx: number) => idx !== hIdx);
                                updateSelectedProjectDetails({ ...safeProj, highlights: nextHighlights });
                              }}
                              className="p-1.5 border border-border hover:border-red-500/40 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-400 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </BentoAccordion>

                {/* 3. ACTION BUTTONS ACCORDION */}
                <BentoAccordion id="actions" title="3. Action Buttons Configuration" icon={Layout}>
                  <div className="space-y-4">
                    {/* Live Demo Config */}
                    <div className="p-4 border border-border bg-background/50 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>1. Live Demo Launch Button</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={safeProj.actionButtons.liveDemo.enabled}
                          onChange={(e) => {
                            const nextButtons = { ...safeProj.actionButtons };
                            nextButtons.liveDemo.enabled = e.target.checked;
                            updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                          }}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Button Label</label>
                          <input
                            type="text"
                            value={safeProj.actionButtons.liveDemo.label}
                            onChange={(e) => {
                              const nextButtons = { ...safeProj.actionButtons };
                              nextButtons.liveDemo.label = e.target.value;
                              updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                            }}
                            className="w-full bg-background border border-border focus:outline-none focus:border-amber-500 px-2 py-1 rounded text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Redirect Target URL</label>
                          <input
                            type="url"
                            value={safeProj.actionButtons.liveDemo.url || safeProj.demoUrl || ''}
                            onChange={(e) => {
                              const nextButtons = { ...safeProj.actionButtons };
                              nextButtons.liveDemo.url = e.target.value;
                              updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons, demoUrl: e.target.value });
                            }}
                            className="w-full bg-background border border-border focus:outline-none focus:border-amber-500 px-2 py-1 rounded text-xs text-white font-mono"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* GitHub Config */}
                    <div className="p-4 border border-border bg-background/50 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5 text-purple-400" />
                          <span>2. GitHub Repository Button</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={safeProj.actionButtons.github.enabled}
                          onChange={(e) => {
                            const nextButtons = { ...safeProj.actionButtons };
                            nextButtons.github.enabled = e.target.checked;
                            updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                          }}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Button Label</label>
                          <input
                            type="text"
                            value={safeProj.actionButtons.github.label}
                            onChange={(e) => {
                              const nextButtons = { ...safeProj.actionButtons };
                              nextButtons.github.label = e.target.value;
                              updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                            }}
                            className="w-full bg-background border border-border focus:outline-none focus:border-amber-500 px-2 py-1 rounded text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Redirect Target URL</label>
                          <input
                            type="url"
                            value={safeProj.actionButtons.github.url || safeProj.githubUrl || ''}
                            onChange={(e) => {
                              const nextButtons = { ...safeProj.actionButtons };
                              nextButtons.github.url = e.target.value;
                              updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons, githubUrl: e.target.value });
                            }}
                            className="w-full bg-background border border-border focus:outline-none focus:border-amber-500 px-2 py-1 rounded text-xs text-white font-mono"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Case Study Trigger Config */}
                    <div className="p-4 border border-border bg-background/50 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>3. Technical Case Study Trigger Button</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={safeProj.actionButtons.caseStudy.enabled}
                          onChange={(e) => {
                            const nextButtons = { ...safeProj.actionButtons };
                            nextButtons.caseStudy.enabled = e.target.checked;
                            updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                          }}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Button Label</label>
                        <input
                          type="text"
                          value={safeProj.actionButtons.caseStudy.label}
                          onChange={(e) => {
                            const nextButtons = { ...safeProj.actionButtons };
                            nextButtons.caseStudy.label = e.target.value;
                            updateSelectedProjectDetails({ ...safeProj, actionButtons: nextButtons });
                          }}
                          className="w-full bg-background border border-border focus:outline-none focus:border-amber-500 px-2 py-1 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </BentoAccordion>

                {/* 4. TECHNICAL BREAKDOWN ACCORDION */}
                <BentoAccordion id="breakdown" title="4. Technical Breakdown Specs" icon={Terminal}>
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">1. Decoupled System Architecture Layout</label>
                      <textarea
                        rows={3}
                        value={safeProj.technicalBreakdown.architecture}
                        onChange={(e) => {
                          const nextTB = { ...safeProj.technicalBreakdown };
                          nextTB.architecture = e.target.value;
                          updateSelectedProjectDetails({ ...safeProj, technicalBreakdown: nextTB });
                        }}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Explain MERN decoupling, geospatial coordinate query limits, database aggregated queries..."
                      />
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">2. Custom Data Pipelines & Routing APIs</label>
                      <textarea
                        rows={3}
                        value={safeProj.technicalBreakdown.apis}
                        onChange={(e) => {
                          const nextTB = { ...safeProj.technicalBreakdown };
                          nextTB.apis = e.target.value;
                          updateSelectedProjectDetails({ ...safeProj, technicalBreakdown: nextTB });
                        }}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Explain route controllers, Express auth middlewares, parameter validations..."
                      />
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">3. Challenges Faced & Index Optimizations</label>
                      <textarea
                        rows={3}
                        value={safeProj.technicalBreakdown.optimization}
                        onChange={(e) => {
                          const nextTB = { ...safeProj.technicalBreakdown };
                          nextTB.optimization = e.target.value;
                          updateSelectedProjectDetails({ ...safeProj, technicalBreakdown: nextTB });
                        }}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Explain search index caching, Fuse algorithms, sub-12ms queries setups..."
                      />
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">4. Interactive Animations & Springs (Optional)</label>
                      <textarea
                        rows={2}
                        value={safeProj.technicalBreakdown.animations}
                        onChange={(e) => {
                          const nextTB = { ...safeProj.technicalBreakdown };
                          nextTB.animations = e.target.value;
                          updateSelectedProjectDetails({ ...safeProj, technicalBreakdown: nextTB });
                        }}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Framer Motion spring models, 3D browser tilt degrees..."
                      />
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">5. Backend Core Logic (Optional)</label>
                      <textarea
                        rows={2}
                        value={safeProj.technicalBreakdown.backendLogic}
                        onChange={(e) => {
                          const nextTB = { ...safeProj.technicalBreakdown };
                          nextTB.backendLogic = e.target.value;
                          updateSelectedProjectDetails({ ...safeProj, technicalBreakdown: nextTB });
                        }}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Inheritance trees, aggregators, custom NoSQL structures..."
                      />
                    </div>
                  </div>
                </BentoAccordion>

                {/* 5. PROJECT MEDIA GALLERY ACCORDION */}
                <BentoAccordion id="gallery" title="5. Screenshots Media Gallery" icon={ImageIcon}>
                  <div className="space-y-4 text-left">
                    
                    {/* Direct Image Drag & Drop Upload Zone */}
                    <div className="relative border-2 border-dashed border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 text-center transition-all duration-300 shadow-sm shrink-0 min-h-[120px] group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleScreenshotUpload(e, safeProj.id)}
                        disabled={uploadingScreenshot}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                      />
                      
                      {uploadingScreenshot ? (
                        <div className="flex flex-col items-center gap-2">
                          <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider animate-pulse">Uploading to Cloudinary...</span>
                        </div>
                      ) : (
                        <>
                          <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300 border border-amber-500/20">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 select-none">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Direct Image Upload</p>
                            <p className="text-[9.5px] text-muted-foreground">Drag and drop screenshots here or <span className="text-amber-400 underline decoration-dotted">browse device files</span></p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Secondary Collapsible URL input toggle */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                        className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showManualUrlInput ? '[-] Hide Manual Entry' : '[+] Paste URL Instead'}</span>
                      </button>
                    </div>

                    {showManualUrlInput && (
                      <div className="flex gap-2 p-3 bg-neutral-900/40 border border-border/60 rounded-xl animate-fade-in">
                        <input
                          type="url"
                          id="newScreenshotInput"
                          placeholder="Paste image web link (https://...)"
                          className="flex-grow bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-1.5 rounded-lg text-xs text-white font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const val = input.value.trim();
                              if (val) {
                                const nextGallery = [...(safeProj.mediaGallery || []), val];
                                updateSelectedProjectDetails({ ...safeProj, mediaGallery: nextGallery });
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('newScreenshotInput') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) {
                              const nextGallery = [...(safeProj.mediaGallery || []), val];
                              updateSelectedProjectDetails({ ...safeProj, mediaGallery: nextGallery });
                              input.value = '';
                            }
                          }}
                          className="px-3.5 py-1.5 bg-amber-500 text-black text-[9.5px] font-bold uppercase rounded-lg tracking-wider hover:bg-amber-400 transition-all cursor-pointer shrink-0"
                        >
                          Add Link
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
                      {safeProj.mediaGallery.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center py-4 font-mono col-span-3">No screenshots added to media gallery yet.</p>
                      ) : (
                        safeProj.mediaGallery.map((imgUrl: string, imgIdx: number) => (
                          <div key={imgIdx} className="relative rounded-xl overflow-hidden border border-border bg-neutral-950 aspect-[4/3] group/img shrink-0">
                            <img src={imgUrl} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} />
                            <button
                              type="button"
                              onClick={() => {
                                const nextGallery = safeProj.mediaGallery.filter((_: string, idx: number) => idx !== imgIdx);
                                updateSelectedProjectDetails({ ...safeProj, mediaGallery: nextGallery });
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-white/5 rounded-lg opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </BentoAccordion>

                {/* 6. PROJECT STATUS ACCORDION */}
                <BentoAccordion id="status" title="6. Showcase Status & Placement" icon={Activity}>
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Showcase status tags</label>
                      <div className="flex flex-wrap gap-2">
                        {['Live', 'In Progress', 'Archived', 'Private', 'Featured'].map((stName) => {
                          const isSelected = safeProj.status === stName;
                          return (
                            <button
                              key={stName}
                              type="button"
                              onClick={() => {
                                const isFeat = stName === 'Featured';
                                updateSelectedProjectDetails({ ...safeProj, status: stName, featured: isFeat });
                              }}
                              className={`px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-extrabold'
                                  : 'bg-background border-border text-muted-foreground hover:text-white'
                              }`}
                            >
                              {stName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </BentoAccordion>

              </div>
            )}

          </div>

        </div>

        {/* 2. Deletion Confirmation Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={deleteProjectEntity}
          title="Delete Showcase Project"
          message="Are you absolutely sure you want to delete this showcase item? All data, cover links, and telemetry parameters will be lost."
          confirmText="DELETE PROJECT"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* CMS Page Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Projects Showcase System</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Configure flagship builds, status cards, and layout narratives.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
            className="flex sm:hidden items-center gap-1.5 px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreviewMobile ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            onClick={saveProjectsSection}
            disabled={saving}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SYNCING...' : <><span className="hidden sm:inline">SAVE PROJECTS MODULE</span><span className="inline sm:hidden">PUBLISH</span></>}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Telemetry context bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-card/50 border border-border/40 rounded-2xl">
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Showcase Registry</span>
          <span className="text-base font-black text-primary font-mono">{projectsList.length} Projects</span>
        </div>
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Priority Showcase</span>
          <span className="text-base font-black text-foreground font-mono">{projectsList.filter(p => p.featured).length} Pinned</span>
        </div>
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Stack Integrations</span>
          <span className="text-base font-black text-foreground font-mono">
            {Array.from(new Set(projectsList.flatMap(p => p.technologies || []))).length} Techs
          </span>
        </div>
        <div className="flex flex-col text-left space-y-0.5 justify-center">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Database Sync</span>
          <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span>ACTIVE SECURE</span>
          </span>
        </div>
      </div>

      {/* Main Two-Pane Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =============================================================
           LEFT PANEL: Showcase Inventory & Global Spacing Options
           ============================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Hero Setup */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              <span>1. Showcase Header Settings</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Badge Pill Text</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => handleSectionTextChange('badge', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-lg text-xs text-foreground transition-all"
                  placeholder="e.g. SELECTED WORK"
                />
              </div>
              
              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Main Heading</label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleSectionTextChange('heading', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-lg text-xs text-foreground transition-all uppercase"
                  placeholder="e.g. BUILDING DIGITAL WORK"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Showcase Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => handleSectionTextChange('description', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-lg text-xs text-foreground transition-all font-sans"
                  placeholder="e.g. A curated showcase of custom designs..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Status Cards Setup */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>2. Showcase Metrics Cards</span>
              </h4>
              <button
                onClick={addStatCard}
                className="p-1 text-[9px] font-bold text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40 bg-primary/5 rounded flex items-center gap-1 uppercase transition-all cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-4">
              {statsCards.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-2 font-mono">No metric cards active. Add card to showcase metrics.</p>
              ) : (
                statsCards.map((card, idx) => (
                  <div key={card.id} className="p-3 bg-background border border-border/50 rounded-xl space-y-3 relative group">
                    <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider font-bold">Metric #{idx+1}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleStatVisibility(idx)}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          title="Toggle visibility"
                        >
                          {card.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-destructive" />}
                        </button>
                        <button
                          onClick={() => deleteStatCard(idx)}
                          className="p-1 hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                          title="Remove card"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Card Heading</label>
                        <input
                          type="text"
                          value={card.value}
                          onChange={(e) => updateStatCard(idx, { ...card, value: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1 rounded text-xs text-white"
                          placeholder="e.g. 10+ Live"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Card Subheading</label>
                        <input
                          type="text"
                          value={card.label}
                          onChange={(e) => updateStatCard(idx, { ...card, label: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1 rounded text-xs text-white"
                          placeholder="e.g. Actively Maintained"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Accent Color</label>
                        <select
                          value={card.color}
                          onChange={(e) => updateStatCard(idx, { ...card, color: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1 rounded text-[10px] text-white"
                        >
                          {COLOR_OPTIONS.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Card Icon</label>
                        <select
                          value={card.icon}
                          onChange={(e) => updateStatCard(idx, { ...card, icon: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1 rounded text-[10px] text-white"
                        >
                          {ICON_OPTIONS.map((i) => (
                            <option key={i.id} value={i.id}>{i.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 3: Showcase Inventory */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>3. Showcase Builds Catalog</span>
              </h4>
              
              <button
                onClick={createProjectEntity}
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>NEW PROJECT</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {projectsList.length === 0 ? (
                <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
                  <p className="text-xs text-muted-foreground">No showcase builds configured. Add your first build draft!</p>
                </div>
              ) : (
                projectsList.map((p, index) => {
                  const isActive = selectedProjectId === p.id;
                  const typeBadge = TYPE_BADGE_OPTIONS.find((t) => t.id === p.type) || TYPE_BADGE_OPTIONS[2];
                  
                  return (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedProjectId(p.id); setEditorTab('specs'); setShowPreviewMobile(true); }}
                      className={`p-3 border rounded-2xl flex items-center justify-between gap-3 group transition-all cursor-pointer relative overflow-hidden select-none ${
                        isActive
                          ? 'bg-primary/10 border-primary shadow-[0_4px_20px_rgba(139,92,246,0.1)]'
                          : 'bg-background border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-[70%]">
                        {/* Cover image thumbnail */}
                        <div className="w-12 h-12 rounded-lg border border-border/40 overflow-hidden shrink-0 bg-neutral-900 flex items-center justify-center">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>

                        {/* Title specs */}
                        <div className="space-y-0.5 truncate">
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-primary transition-all uppercase">{p.title}</h5>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[7.5px] font-black uppercase px-1 py-0.5 border rounded leading-none shrink-0 ${typeBadge.color}`}>
                              {p.type}
                            </span>
                            {p.featured && (
                              <span className="text-[7.5px] font-bold uppercase text-amber-400 bg-amber-500/5 border border-amber-500/20 px-1 py-0.5 rounded leading-none">
                                Pinned
                              </span>
                            )}
                            <span className="text-[7.5px] font-mono text-muted-foreground truncate leading-none">
                              {p.technologies?.length || 0} stack elements
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Operations: reordering, visibility */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleProjectReorder(index, 'up')}
                          disabled={index === 0}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-30"
                          title="Move project up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleProjectReorder(index, 'down')}
                          disabled={index === projectsList.length - 1}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-30"
                          title="Move project down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleProjectVisibility(p.id)}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          title="Toggle draft visible state"
                        >
                          {p.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />}
                        </button>

                        <button
                          onClick={() => confirmDeleteProject(p.id)}
                          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-red-950/20 rounded text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                          title="Delete build"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* =============================================================
           RIGHT PANEL: Selected Showcase Specs Editor
           ============================================================= */}
        <div className={`lg:col-span-7 bg-card border border-border rounded-3xl p-6 min-h-[500px] flex flex-col justify-between relative overflow-hidden shadow-md ${showPreviewMobile ? 'flex' : 'hidden lg:flex'}`}>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          
          {!selectedProj ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 my-auto">
              <div className="p-4 bg-muted border border-border rounded-[24px]">
                <FolderKanban className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">No Flagship Build Selected</h4>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Click any registered showcase build card in the left inventory panel, or click "+ NEW PROJECT" to start designing an interactive engineering experience.
              </p>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col justify-start h-full">
              {/* Header Title specs */}
              <div className="flex justify-between items-start border-b border-border/40 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    <span>Selected Build Specs Editor</span>
                  </span>
                  <h4 className="text-base font-black text-white uppercase tracking-tight font-heading">{selectedProj.title}</h4>
                </div>
                
                <span className="text-[9px] font-mono bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground">
                  BUILD ID: {selectedProj.id.slice(0, 8)}
                </span>
              </div>

              {/* Editor Tabs Navigation */}
              <div className="flex gap-1.5 border-b border-border/20 pb-2">
                {[
                  { id: 'specs', label: '1. Basic Specs', icon: Info },
                  { id: 'media', label: '2. Cover Art', icon: ImageIcon },
                  { id: 'progress', label: '3. Stack & Progress', icon: Code },
                  { id: 'links', label: '4. Target Links', icon: Link2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = editorTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setEditorTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Workspace panels */}
              <div className="flex-1 min-h-[300px]">
                
                {/* ── TAB 1: BASIC SPECS ── */}
                {editorTab === 'specs' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Project Title</label>
                        <input
                          type="text"
                          value={selectedProj.title}
                          onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, title: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all"
                          placeholder="e.g. CREDVIA CORE"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Project Status / Type Badge</label>
                        <select
                          value={selectedProj.type}
                          onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, type: e.target.value })}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all"
                        >
                          {TYPE_BADGE_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Description</label>
                      <textarea
                        rows={5}
                        value={selectedProj.description}
                        onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, description: e.target.value })}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all font-sans"
                        placeholder="Detailed highlight narrative of technical problems solved..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                          <span>Pin as Featured / Pinned</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedProj.featured || false}
                          onChange={(e) => toggleProjectFeatured(selectedProj.id)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>Visible to Public Showcase</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedProj.visible !== false}
                          onChange={(e) => toggleProjectVisibility(selectedProj.id)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: COVER ART ── */}
                {editorTab === 'media' && (
                  <div className="space-y-4 animate-fade-in flex flex-col justify-center">
                    <div className="border border-dashed border-border/80 bg-background rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-center">
                      
                      {/* Big Preview Cover container */}
                      <div className="w-48 h-32 rounded-xl border border-border overflow-hidden bg-neutral-950 flex items-center justify-center shrink-0 shadow-lg relative group">
                        <img
                          src={selectedProj.image}
                          alt="Cover Art Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                          <span className="text-[9px] font-mono text-white uppercase tracking-widest">Active Preview</span>
                        </div>
                      </div>

                      <div className="space-y-3 text-center md:text-left">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Deploy Flagship Cover Art</h5>
                        <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                          Choose a visually striking screenshot of your application. The system automatically uploads and compresses to Cloudinary.
                        </p>
                        
                        <div className="relative inline-block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCoverUpload(e, selectedProj.id)}
                            disabled={uploadingImage}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <button
                            type="button"
                            disabled={uploadingImage}
                            className="px-4 py-2 border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-lg tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? 'UPLOADING...' : 'REPLACE IMAGE'}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Custom Image URL Override</label>
                      <input
                        type="url"
                        value={selectedProj.image}
                        onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, image: e.target.value })}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {/* ── TAB 3: STACK & PROGRESS ── */}
                {editorTab === 'progress' && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Tech Stack List */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Technologies Stack Tags</label>
                      
                      <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border rounded-xl min-h-[48px] items-center">
                        {selectedProj.technologies?.map((tech: string, i: number) => (
                          <span
                            key={`${tech}-${i}`}
                            className="px-2 py-0.5 bg-muted text-[10px] text-zinc-300 font-mono rounded border border-border flex items-center gap-1"
                          >
                            <span>{tech}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextTechs = selectedProj.technologies.filter((t: string) => t !== tech);
                                updateSelectedProjectDetails({ ...selectedProj, technologies: nextTechs });
                              }}
                              className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          placeholder="Type tag & press enter"
                          className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-white ml-2 flex-grow min-w-[120px]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const val = input.value.trim();
                              if (val && !selectedProj.technologies?.includes(val)) {
                                const nextTechs = [...(selectedProj.technologies || []), val];
                                updateSelectedProjectDetails({ ...selectedProj, technologies: nextTechs });
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Build Progress Metrics */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-border/20 pb-1">
                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Flagship Build Metrics Sliders</label>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newMetric = { label: 'New Metric', value: 85, color: 'blue' };
                            const nextMetrics = [...(selectedProj.metrics || []), newMetric];
                            updateSelectedProjectDetails({ ...selectedProj, metrics: nextMetrics });
                          }}
                          className="text-[9px] font-bold text-primary hover:text-primary/80 border border-primary/10 hover:border-primary/30 px-2 py-0.5 rounded bg-primary/5 transition-all cursor-pointer"
                        >
                          + ADD METRIC
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                        {!selectedProj.metrics || selectedProj.metrics.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground text-center py-2 font-mono">No build metrics active. Add metric slider.</p>
                        ) : (
                          selectedProj.metrics.map((metric: any, mIdx: number) => (
                            <div key={`${metric.label}-${mIdx}`} className="p-3 bg-background border border-border/50 rounded-xl space-y-3">
                              <div className="flex justify-between items-center gap-3">
                                
                                <input
                                  type="text"
                                  value={metric.label}
                                  onChange={(e) => {
                                    const nextMetrics = [...selectedProj.metrics];
                                    nextMetrics[mIdx] = { ...metric, label: e.target.value };
                                    updateSelectedProjectDetails({ ...selectedProj, metrics: nextMetrics });
                                  }}
                                  className="bg-transparent border-none text-xs font-bold text-white focus:outline-none uppercase w-[40%] tracking-wide"
                                  placeholder="e.g. Backend Speed"
                                />

                                <div className="flex items-center gap-2">
                                  <select
                                    value={metric.color || 'blue'}
                                    onChange={(e) => {
                                      const nextMetrics = [...selectedProj.metrics];
                                      nextMetrics[mIdx] = { ...metric, color: e.target.value };
                                      updateSelectedProjectDetails({ ...selectedProj, metrics: nextMetrics });
                                    }}
                                    className="bg-background border border-border focus:outline-none text-[9px] text-white px-1.5 py-0.5 rounded cursor-pointer"
                                  >
                                    {COLOR_OPTIONS.map((c) => (
                                      <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                  </select>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextMetrics = selectedProj.metrics.filter((_: any, idx: number) => idx !== mIdx);
                                      updateSelectedProjectDetails({ ...selectedProj, metrics: nextMetrics });
                                    }}
                                    className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                              </div>

                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={metric.value}
                                  onChange={(e) => {
                                    const nextMetrics = [...selectedProj.metrics];
                                    nextMetrics[mIdx] = { ...metric, value: Number(e.target.value) };
                                    updateSelectedProjectDetails({ ...selectedProj, metrics: nextMetrics });
                                  }}
                                  className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-[10px] font-mono font-bold text-white shrink-0 w-8 text-right">
                                  {metric.value}%
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 4: REPO & DEPLOYMENT ── */}
                {editorTab === 'links' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">GitHub Repository Link</label>
                      <input
                        type="url"
                        value={selectedProj.githubUrl}
                        onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, githubUrl: e.target.value })}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all"
                        placeholder="https://github.com/..."
                      />
                      <p className="text-[9px] text-muted-foreground mt-1">If this URL is empty, the repository button will auto-hide on the showcase card.</p>
                    </div>

                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Live Launch Link</label>
                      <input
                        type="url"
                        value={selectedProj.demoUrl}
                        onChange={(e) => updateSelectedProjectDetails({ ...selectedProj, demoUrl: e.target.value })}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-xs text-foreground transition-all"
                        placeholder="https://..."
                      />
                      <p className="text-[9px] text-muted-foreground mt-1">If this URL is empty, the launch external link button will auto-hide on the showcase card.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

      </div>

      {/* 2. Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteProjectEntity}
        title="Delete Showcase Project"
        message="Are you absolutely sure you want to delete this showcase item? All data, cover links, and telemetry parameters will be lost."
        confirmText="DELETE PROJECT"
      />
    </div>
  );
}
