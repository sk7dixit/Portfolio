import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, Star, Award, Save, 
  ArrowUp, ArrowDown, Eye, EyeOff, X, Code, Sparkles, Activity,
  Info, BarChart2, Globe, Search, Filter, ShieldCheck, Cpu, Cloud, CheckCircle2,
  ChevronRight, Upload, Monitor, Smartphone, Download, Layers, Link2, ExternalLink, Lock, Unlock
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import { usePortfolio } from '../../context/PortfolioContext';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & PRESETS
   ───────────────────────────────────────────────────────────── */

const COLOR_OPTIONS = [
  { id: 'amber',   label: 'Gold / Amber', hex: '#F59E0B', text: 'text-amber-400',  dot: 'bg-amber-500'  },
  { id: 'cyan',    label: 'Cyan / Web',   hex: '#06B6D4', text: 'text-cyan-400',   dot: 'bg-cyan-500'   },
  { id: 'purple',  label: 'Purple / AI',  hex: '#8B5CF6', text: 'text-purple-400', dot: 'bg-purple-500'  },
  { id: 'emerald', label: 'Emerald',      hex: '#10B981', text: 'text-emerald-400',dot: 'bg-emerald-500' },
  { id: 'blue',    label: 'Blue / Systems',hex: '#3B82F6', text: 'text-blue-400',  dot: 'bg-blue-500'   },
];

const PRESET_ACCENTS: Record<string, string> = {
  amber: 'rgba(245, 158, 11, 0.4)',
  cyan: 'rgba(6, 182, 212, 0.4)',
  purple: 'rgba(139, 92, 246, 0.4)',
  emerald: 'rgba(16, 185, 129, 0.4)',
  blue: 'rgba(59, 130, 246, 0.4)'
};

export default function CertificateCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  const { activePortfolio } = usePortfolio();
  const isMS = activePortfolio === 'mahi';

  // ── Socket synchronization state ────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Section Header settings ───────────────────────────────
  const [badge, setBadge] = useState('LEARNING JOURNEY');
  const [heading, setHeading] = useState('CERTIFICATIONS & ACHIEVEMENTS');
  const [description, setDescription] = useState('Continuous learning through certifications...');

  // ── Telemetry Stats Strip details ───────────────────────────
  const [certificationsCount, setCertificationsCount] = useState('12 Certifications');
  const [activeTracksCount, setActiveTracksCount] = useState('4 Active Tracks');
  const [platformsCount, setPlatformsCount] = useState('3 Cloud Platforms');
  const [specialization, setSpecialization] = useState('AI/ML Specialization');

  // ── Learning Radar settings ───────────────────────────────
  const [radarTitle, setRadarTitle] = useState('Currently Learning: AI/ML & Advanced Backend Systems');
  const [radarDescription, setRadarDescription] = useState('Deepening skills in neural networks architectures...');
  const [exploringTracks, setExploringTracks] = useState<string[]>([]);
  const [newTrackText, setNewTrackText] = useState('');

  // ── Certificates Catalogue ──────────────────────────────────
  const [certificatesList, setCertificatesList] = useState<any[]>([]);

  // ── Selected Certificate workspace ──────────────────────────
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [openBentoSection, setOpenBentoSection] = useState<string | null>('preview');
  const [uploadingCertImage, setUploadingCertImage] = useState(false);

  // ── Search & Filter indices ─────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [filterVisible, setFilterVisible] = useState<string>('all');

  // ── Deletion state ──────────────────────────────────────────
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [certToDeleteId, setCertToDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Mahi Singh REDESIGN Specific States ────────────────────────
  const [msActiveTab, setMsActiveTab] = useState<'hero' | 'registry' | 'verification' | 'taxonomy' | 'layout' | 'analytics'>('hero');
  const [msBadge, setMsBadge] = useState('CREDENTIAL SHOWCASE');
  const [msHeading, setMsHeading] = useState('CERTIFICATIONS & LEARNING');
  const [msDescription, setMsDescription] = useState('Industry-recognized credentials validating cloud, networking, and software systems engineering expertise.');
  const [msBlurIntensity, setMsBlurIntensity] = useState(12);
  const [msOverlayDarkness, setMsOverlayDarkness] = useState(85);
  const [msGlassTransparency, setMsGlassTransparency] = useState(20);
  const [msWarmTint, setMsWarmTint] = useState(true);

  const [msVerificationBadgeStyle, setMsVerificationBadgeStyle] = useState<'glow' | 'outline' | 'pulse' | 'static'>('glow');
  const [msVerificationColorMode, setMsVerificationColorMode] = useState<'green' | 'blue' | 'orange' | 'academy'>('orange');
  const [msVerificationAnimation, setMsVerificationAnimation] = useState<'shimmer' | 'pulse' | 'hover glow'>('shimmer');
  const [msTrustIndicators, setMsTrustIndicators] = useState({
    verified: true,
    ranked: true,
    institutionBacked: true,
    academyIssued: true
  });

  const [msSkillTaxonomy, setMsSkillTaxonomy] = useState<any[]>([
    { name: 'AWS', category: 'Cloud', color: '#f59e0b', priority: 1, glowType: 'pulse' },
    { name: 'IAM', category: 'Cloud', color: '#f59e0b', priority: 2, glowType: 'static' },
    { name: 'EC2', category: 'Cloud', color: '#f59e0b', priority: 2, glowType: 'static' },
    { name: 'Routing', category: 'Networking', color: '#3b82f6', priority: 1, glowType: 'shimmer' },
    { name: 'OSI Model', category: 'Networking', color: '#3b82f6', priority: 2, glowType: 'static' }
  ]);

  const [msLayout, setMsLayout] = useState({
    gridColumnsDesktop: 2,
    gridColumnsMobile: 1,
    cardMinHeight: 320,
    integratedBadge: true
  });

  const [msAnalytics, setMsAnalytics] = useState({
    totalCertifications: 4,
    activeLearningTracks: 3,
    completionScore: 92,
    platformCount: 2,
    radarTracks: {
      Cloud: 85,
      AI: 75,
      Networking: 90,
      Backend: 80,
      Security: 70
    }
  });

  const [msCertificatesList, setMsCertificatesList] = useState<any[]>([]);
  const [selectedMsCertId, setSelectedMsCertId] = useState<string | null>(null);
  const [simulatedViewport, setSimulatedViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [simulatedSelectedCert, setSimulatedSelectedCert] = useState<any | null>(null);

  // New Skill Input states inside registry and taxonomy
  const [newSkillText, setNewSkillText] = useState('');
  const [taxonomySkillName, setTaxonomySkillName] = useState('');
  const [taxonomySkillCategory, setTaxonomySkillCategory] = useState<'Cloud' | 'Networking' | 'AI' | 'Security' | 'Backend' | 'Data Systems'>('Cloud');
  const [taxonomySkillPriority, setTaxonomySkillPriority] = useState<number>(1);
  const [taxonomySkillGlow, setTaxonomySkillGlow] = useState<'none' | 'pulse' | 'shimmer' | 'glow'>('glow');
  const [taxonomySkillColor, setTaxonomySkillColor] = useState('#f59e0b');

  // Connect socket.io pipeline
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

  // Load from database profile JSON
  useEffect(() => {
    if (profile?.certificatesSection) {
      const sec = typeof profile.certificatesSection === 'string'
        ? JSON.parse(profile.certificatesSection)
        : profile.certificatesSection;

      setBadge(sec.badge || 'LEARNING JOURNEY');
      setHeading(sec.heading || 'CERTIFICATIONS & ACHIEVEMENTS');
      setDescription(sec.description || 'Continuous learning through certifications, workshops...');
      
      setCertificationsCount(sec.certificationsCount || '12 Certifications');
      setActiveTracksCount(sec.activeTracksCount || '4 Active Tracks');
      setPlatformsCount(sec.platformsCount || '3 Cloud Platforms');
      setSpecialization(sec.specialization || 'AI/ML Specialization');

      setRadarTitle(sec.radarTitle || 'Currently Learning: AI/ML & Advanced Backend Systems');
      setRadarDescription(sec.radarDescription || 'Deepening skills in neural networks...');
      setExploringTracks(sec.exploringTracks || []);

      setCertificatesList(sec.certificates || []);

      // Load MS specific properties if it's Mahi's workspace
      if (isMS) {
        setMsBadge(sec.badge || 'CREDENTIAL SHOWCASE');
        setMsHeading(sec.heading || 'CERTIFICATIONS & LEARNING');
        setMsDescription(sec.description || 'Industry-recognized credentials validating cloud, networking, and software systems engineering expertise.');
        setMsBlurIntensity(sec.blurIntensity !== undefined ? sec.blurIntensity : 12);
        setMsOverlayDarkness(sec.overlayDarkness !== undefined ? sec.overlayDarkness : 85);
        setMsGlassTransparency(sec.glassTransparency !== undefined ? sec.glassTransparency : 20);
        setMsWarmTint(sec.warmTint !== undefined ? sec.warmTint : true);

        const v = sec.verification || {};
        setMsVerificationBadgeStyle(v.badgeStyle || 'glow');
        setMsVerificationColorMode(v.colorMode || 'orange');
        setMsVerificationAnimation(v.animation || 'shimmer');
        setMsTrustIndicators(v.trustIndicators || { verified: true, ranked: true, institutionBacked: true, academyIssued: true });

        setMsSkillTaxonomy(sec.skillTaxonomy || [
          { name: 'AWS', category: 'Cloud', color: '#f59e0b', priority: 1, glowType: 'pulse' },
          { name: 'IAM', category: 'Cloud', color: '#f59e0b', priority: 2, glowType: 'static' },
          { name: 'EC2', category: 'Cloud', color: '#f59e0b', priority: 2, glowType: 'static' },
          { name: 'Routing', category: 'Networking', color: '#3b82f6', priority: 1, glowType: 'shimmer' },
          { name: 'OSI Model', category: 'Networking', color: '#3b82f6', priority: 2, glowType: 'static' }
        ]);

        const l = sec.layout || {};
        setMsLayout({
          gridColumnsDesktop: l.gridColumnsDesktop || 2,
          gridColumnsMobile: l.gridColumnsMobile || 1,
          cardMinHeight: l.cardMinHeight || 320,
          integratedBadge: l.integratedBadge !== false
        });

        const a = sec.analytics || {};
        setMsAnalytics({
          totalCertifications: a.totalCertifications || 4,
          activeLearningTracks: a.activeLearningTracks || 3,
          completionScore: a.completionScore || 92,
          platformCount: a.platformCount || 2,
          radarTracks: a.radarTracks || { Cloud: 85, AI: 75, Networking: 90, Backend: 80, Security: 70 }
        });

        setMsCertificatesList(sec.certificates || []);
      }
    }
  }, [profile, isMS]);

  // Emit socket synchronizations
  const emitCertificatesSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('certificates:update', {
        slug: user.portfolioSlug,
        certificatesSection: newSec,
        certificates: newSec.certificates || []
      });
    }
  };

  const getCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge,
      heading,
      description,
      certificationsCount,
      activeTracksCount,
      platformsCount,
      specialization,
      radarTitle,
      radarDescription,
      exploringTracks,
      certificates: certificatesList,
      ...overrides
    };
  };

  const getMsCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge: msBadge,
      heading: msHeading,
      description: msDescription,
      blurIntensity: msBlurIntensity,
      overlayDarkness: msOverlayDarkness,
      glassTransparency: msGlassTransparency,
      warmTint: msWarmTint,
      verification: {
        badgeStyle: msVerificationBadgeStyle,
        colorMode: msVerificationColorMode,
        animation: msVerificationAnimation,
        trustIndicators: msTrustIndicators
      },
      skillTaxonomy: msSkillTaxonomy,
      layout: msLayout,
      analytics: msAnalytics,
      certificates: msCertificatesList,
      ...overrides
    };
  };

  /* ─────────────────────────────────────────────────────────────
     CMS CHANGE VALUE METRICS
     ───────────────────────────────────────────────────────────── */

  const handleGlobalTextChange = (field: string, val: string) => {
    let updated = getCombinedSection();
    if (field === 'badge') { setBadge(val); updated.badge = val; }
    else if (field === 'heading') { setHeading(val); updated.heading = val; }
    else if (field === 'description') { setDescription(val); updated.description = val; }
    else if (field === 'certificationsCount') { setCertificationsCount(val); updated.certificationsCount = val; }
    else if (field === 'activeTracksCount') { setActiveTracksCount(val); updated.activeTracksCount = val; }
    else if (field === 'platformsCount') { setPlatformsCount(val); updated.platformsCount = val; }
    else if (field === 'specialization') { setSpecialization(val); updated.specialization = val; }
    else if (field === 'radarTitle') { setRadarTitle(val); updated.radarTitle = val; }
    else if (field === 'radarDescription') { setRadarDescription(val); updated.radarDescription = val; }
    emitCertificatesSectionUpdate(updated);
  };

  const addExploringTrack = () => {
    const text = newTrackText.trim();
    if (text && !exploringTracks.includes(text)) {
      const nextTracks = [...exploringTracks, text];
      setExploringTracks(nextTracks);
      setNewTrackText('');
      emitCertificatesSectionUpdate(getCombinedSection({ exploringTracks: nextTracks }));
    }
  };

  const deleteExploringTrack = (track: string) => {
    const nextTracks = exploringTracks.filter(t => t !== track);
    setExploringTracks(nextTracks);
    emitCertificatesSectionUpdate(getCombinedSection({ exploringTracks: nextTracks }));
  };

  // ── Selected Certificate modifications ───────────────────────
  const updateSelectedCertificateDetails = (updatedCert: any) => {
    const nextList = certificatesList.map(c => c.id === updatedCert.id ? updatedCert : c);
    setCertificatesList(nextList);
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: nextList }));
  };

  const toggleVisibility = (id: string) => {
    const nextList = certificatesList.map(c => c.id === id ? { ...c, visible: c.visible === false ? true : false } : c);
    setCertificatesList(nextList);
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: nextList }));
  };

  const toggleFeaturedState = (id: string) => {
    const nextList = certificatesList.map(c => c.id === id ? { ...c, featured: !c.featured } : { ...c, featured: false });
    setCertificatesList(nextList);
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: nextList }));
  };

  const handleArrowReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === certificatesList.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextList = [...certificatesList];
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;

    const finalized = nextList.map((c, idx) => ({ ...c, order: idx + 1 }));
    setCertificatesList(finalized);
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: finalized }));
  };

  const createCertificateEntity = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      issuer: 'GOOGLE CAREER CERTIFICATIONS',
      title: 'GOOGLE DESIGN BLUEPRINT',
      description: 'Cinematic visual design systems, dynamic prototyping structures, and accessibility standards.',
      issueDate: 'Jan 2026',
      tags: ['UI Systems', 'Accessibility', 'Interaction Design'],
      credentialUrl: 'https://coursera.org',
      certificateImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop',
      featured: false,
      verified: true,
      visible: true,
      accentColor: 'amber',
      order: certificatesList.length + 1
    };

    const nextList = [...certificatesList, newCert];
    setCertificatesList(nextList);
    setSelectedCertificateId(newCert.id);
    setOpenBentoSection('preview');
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: nextList }));
    setSuccess('New credential showcase draft registered!');
  };

  const confirmDeleteCert = (id: string) => {
    setCertToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const deleteCertEntity = () => {
    if (!certToDeleteId) return;
    const nextList = certificatesList.filter(c => c.id !== certToDeleteId);
    setCertificatesList(nextList);
    if (selectedCertificateId === certToDeleteId) {
      setSelectedCertificateId(null);
    }
    setIsConfirmOpen(false);
    setCertToDeleteId(null);
    emitCertificatesSectionUpdate(getCombinedSection({ certificates: nextList }));
    setSuccess('Credential permanently deleted!');
  };

  // Drag and Drop certificate cover upload using Cloudinary router
  const handleCertificateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertImage(true);
    const formData = new FormData();
    formData.append('certificateImage', file);

    try {
      const res = await api.post('/portfolio/profile/certificate-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.data.imageUrl;
      const targetCert = certificatesList.find((c) => c.id === certId);
      if (targetCert) {
        updateSelectedCertificateDetails({ ...targetCert, certificateImage: uploadedUrl });
        setSuccess('Certificate showcase preview image uploaded!');
      }
    } catch (err: any) {
      console.error('Certificate cover upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload preview image.');
    } finally {
      setUploadingCertImage(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     PERSIST DATA TO DATABASE
     ───────────────────────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────────────
     PERSIST DATA TO DATABASE
     ───────────────────────────────────────────────────────────── */
  const saveCertificatesSection = async () => {
    setSaving(true);
    try {
      const dbPayload = isMS ? getMsCombinedSection() : getCombinedSection();
      await api.patch('/portfolio/profile', {
        certificatesSection: dbPayload
      });
      setSuccess('Verified credentials database sync successful!');
      await fetchEverything();
    } catch (err: any) {
      console.error('saveCertificatesSection Error:', err);
      setError(err.response?.data?.message || 'Failed to sync modifications to Postgres.');
    } finally {
      setSaving(false);
    }
  };

  // Filter index calculations
  const processedList = React.useMemo(() => {
    return certificatesList
      .filter((cert) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          cert.title.toLowerCase().includes(q) || 
          cert.issuer.toLowerCase().includes(q) || 
          cert.tags.some((t: string) => t.toLowerCase().includes(q));

        if (!matchesQuery) return false;
        if (filterFeatured === 'featured' && !cert.featured) return false;
        if (filterFeatured === 'normal' && cert.featured) return false;
        if (filterVerified === 'verified' && cert.verified === false) return false;
        if (filterVerified === 'unverified' && cert.verified !== false) return false;
        if (filterVisible === 'visible' && cert.visible === false) return false;
        if (filterVisible === 'hidden' && cert.visible !== false) return false;

        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [certificatesList, searchQuery, filterFeatured, filterVerified, filterVisible]);

  // Resolve current active certificate workspace
  const selectedCert = certificatesList.find((c) => c.id === selectedCertificateId);
  const isKS = user?.portfolioSlug === 'khushaboo';

  if (isKS) {
    const safeCert = selectedCert ? {
      id: selectedCert.id,
      title: selectedCert.title || '',
      issuer: selectedCert.issuer || selectedCert.organization || '',
      issueDate: selectedCert.issueDate || '2026',
      description: selectedCert.description || '',
      tags: selectedCert.tags || [],
      credentialUrl: selectedCert.credentialUrl || '',
      certificateImage: selectedCert.certificateImage || '',
      featured: selectedCert.featured || false,
      verified: selectedCert.verified !== false,
      visible: selectedCert.visible !== false,
      accentColor: selectedCert.accentColor || 'amber'
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
              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">{title}</span>
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
      <div className="space-y-6 animate-fade-in text-left">
        
        {/* Page Title Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-4 gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Credential Showcase CMS</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Manage verified certifications, engineering credentials, and learning outcomes.</p>
          </div>

          <button
            onClick={saveCertificatesSection}
            disabled={saving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SYNCING...' : <><span className="hidden sm:inline">SAVE CHANGES</span><span className="inline sm:hidden">PUBLISH</span></>}</span>
          </button>
        </div>

        {/* Dynamic Telemetry context bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card/50 border border-border/40 rounded-2xl animate-fade-in">
          <div className="flex flex-col text-left space-y-0.5">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Showcase Registry</span>
            <span className="text-base font-black text-primary font-mono">{certificatesList.length} Credentials</span>
          </div>
          <div className="flex flex-col text-left space-y-0.5">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Tracks</span>
            <span className="text-base font-black text-foreground font-mono">{exploringTracks.length || 3} Pathways</span>
          </div>
          <div className="flex flex-col text-left space-y-0.5">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Platforms Stacked</span>
            <span className="text-base font-black text-foreground font-mono">{platformsCount || '3 Cloud'}</span>
          </div>
          <div className="flex flex-col text-left space-y-0.5 justify-center">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Database Sync</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <span>ACTIVE SECURE</span>
            </span>
          </div>
        </div>

        {/* Global Section Header Settings */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>Global Certificates Header Config</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Badge Pill Text</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => handleGlobalTextChange('badge', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                placeholder="e.g. CERTIFICATIONS"
              />
            </div>
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Main Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => handleGlobalTextChange('heading', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white uppercase"
                placeholder="e.g. Verified Credentials"
              />
            </div>
            <div>
              <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Sub Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => handleGlobalTextChange('description', e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                placeholder="e.g. Industry certifications and engineering programs..."
              />
            </div>
          </div>
        </div>

        {/* Two-Pane Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Editorial Catalogue & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1.5">
            
            {/* Create dashed glass card */}
            <div
              onClick={createCertificateEntity}
              className="border border-dashed border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 text-center text-amber-400 font-bold uppercase text-[9.5px] tracking-wider transition-all duration-300 min-h-[90px] shadow-sm shrink-0"
            >
              <Plus className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>+ Add New Verified Certification</span>
            </div>

            {/* Filter Search index bar */}
            <div className="p-4 bg-card border border-border rounded-2xl space-y-3 shrink-0 text-[9.5px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                placeholder="Search by Issuer or Title..."
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value)}
                  className="bg-background border border-border focus:outline-none text-[9px] text-white px-2 py-1 rounded-lg"
                >
                  <option value="all">All Cards</option>
                  <option value="featured">Pinned</option>
                </select>
                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="bg-background border border-border focus:outline-none text-[9px] text-white px-2 py-1 rounded-lg"
                >
                  <option value="all">All Verified</option>
                  <option value="verified">Verified Only</option>
                </select>
              </div>
            </div>

            {/* Grid of Miniature certificates */}
            {processedList.length === 0 ? (
              <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl shrink-0">
                <p className="text-xs text-neutral-500">No credentials found matching your parameters.</p>
              </div>
            ) : (
              processedList.map((c, index) => {
                const isActive = selectedCertificateId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedCertificateId(c.id); setOpenBentoSection('preview'); }}
                    className={`border rounded-2xl overflow-hidden flex items-center justify-between p-3.5 group transition-all duration-300 cursor-pointer relative select-none shrink-0 ${
                      isActive
                        ? 'bg-amber-500/5 border-amber-500 shadow-[0_4px_25px_rgba(245,158,11,0.08)]'
                        : 'bg-card border-border hover:border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      {/* Visual Cover art */}
                      <div className="w-12 h-10 rounded-lg border border-border/40 overflow-hidden shrink-0 bg-neutral-900 flex items-center justify-center">
                        <img
                          src={c.certificateImage}
                          alt={c.title}
                          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1 text-left">
                        <h5 className="text-xs font-bold text-white line-clamp-2 whitespace-normal break-words uppercase group-hover:text-amber-400 transition-colors leading-tight">
                          {c.title}
                        </h5>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none truncate">
                            {c.issuer}
                          </span>
                          {c.verified && (
                            <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded px-1 leading-none shrink-0 font-bold">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operations controls */}
                    <div className="hidden sm:flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleArrowReorder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArrowReorder(index, 'down')}
                          disabled={index === certificatesList.length - 1}
                          className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleVisibility(c.id)}
                        className="p-1 hover:bg-muted rounded text-neutral-500 cursor-pointer"
                      >
                        {c.visible !== false ? <Eye className="w-3.5 h-3.5 text-amber-500" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />}
                      </button>
                      <button
                        onClick={() => confirmDeleteCert(c.id)}
                        className="p-1 hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mobile Edit Button */}
                    <div className="flex sm:hidden px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold uppercase rounded-lg shrink-0 select-none">
                      [ Edit ]
                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* RIGHT COLUMN: Cinematic Bento Config Panels & Live Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {!safeCert ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                <div className="p-4 bg-muted border border-border rounded-[24px]">
                  <Award className="w-12 h-12 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">No Certificate Selected</h4>
                <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                  Select a verified learning card from your catalog on the left to configure live credentials, skills covered, and CDN preview cover visuals.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col justify-start h-full text-left">
                
                {/* Active Edit Header */}
                <div className="bg-card border border-border/80 rounded-2xl p-4.5 flex flex-col gap-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-amber-500">Currently Editing //</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight font-mono leading-tight">{safeCert.title}</h4>
                    </div>
                    <span className="text-[8.5px] font-mono bg-muted border border-border px-2 py-0.5 rounded text-neutral-400 shrink-0">
                      ID: {safeCert.id.slice(0, 8)}
                    </span>
                  </div>
                  {/* Mobile Actions inside Edit Form container */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 sm:hidden w-full">
                    <button
                      type="button"
                      onClick={() => handleArrowReorder(processedList.findIndex(x => x.id === safeCert.id), 'up')}
                      disabled={processedList.findIndex(x => x.id === safeCert.id) === 0}
                      className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" /> Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArrowReorder(processedList.findIndex(x => x.id === safeCert.id), 'down')}
                      disabled={processedList.findIndex(x => x.id === safeCert.id) === processedList.length - 1}
                      className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" /> Move Down
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(safeCert.id)}
                      className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {safeCert.visible !== false ? <Eye className="w-3 h-3 text-amber-500" /> : <EyeOff className="w-3 h-3 text-destructive" />} Visibility
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDeleteCert(safeCert.id)}
                      className="flex-1 py-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>

                {/* 1. CINEMATIC LIVE PREVIEW ACCORDION */}
                <BentoAccordion id="preview" title="1. Cinematic Live Preview Card" icon={Globe}>
                  <div className="space-y-4 text-left">
                    <span className="text-[8.5px] font-mono uppercase tracking-widest text-amber-500 font-bold block mb-1">Direct Screen Sync //</span>
                    
                    {/* Live Cinematic Card representation */}
                    <div className="grid grid-cols-1 md:grid-cols-12 w-full min-h-[200px] rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/60 transition-all duration-300 relative overflow-hidden text-left relative group/live border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.03)] select-none pointer-events-none">
                      <div className="md:col-span-4 relative w-full h-[140px] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.04] bg-black shrink-0">
                        <img 
                          src={safeCert.certificateImage} 
                          alt={safeCert.title} 
                          className="w-full h-full object-cover grayscale opacity-75"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/30 to-transparent z-10" />
                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md z-20 flex items-center gap-1.5 leading-none">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span className="text-[7.5px] font-mono font-bold text-white uppercase tracking-widest">{safeCert.issuer.split(' ')[0] || "CRED"}</span>
                        </div>
                        {safeCert.verified && (
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded backdrop-blur-md z-20 flex items-center gap-1 leading-none text-emerald-400">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span className="text-[7px] font-mono uppercase tracking-wider font-extrabold">Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-8 p-5 flex flex-col justify-between space-y-4 text-left relative z-10">
                        <div className="space-y-2">
                          <span className="text-[8px] font-mono font-bold text-amber-500 uppercase tracking-widest block leading-none">
                            {safeCert.issuer || "ACADEMIC ISSUER"} • Issued {safeCert.issueDate}
                          </span>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight font-heading">
                            {safeCert.title || "UNTITLED CERTIFICATION"}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-light leading-relaxed truncate">
                            {safeCert.description || "Credential showcasing verified engineering competence."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {safeCert.tags?.slice(0, 3).map((tag: string, tIdx: number) => (
                            <span key={tIdx} className="text-[7.5px] font-mono uppercase bg-white/5 border border-white/5 rounded px-1.5 py-0.5 text-zinc-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoAccordion>

                {/* 2. BASIC METADATA CONFIG ACCORDION */}
                <BentoAccordion id="metadata" title="2. Basic Credential Specs" icon={Info}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Certification Title</label>
                      <input
                        type="text"
                        value={safeCert.title}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, title: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. Google UX Professional Cert"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Organization / Issuer</label>
                      <input
                        type="text"
                        value={safeCert.issuer}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, issuer: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. Google Career Certifications"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Issue Date</label>
                      <input
                        type="text"
                        value={safeCert.issueDate}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, issueDate: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        placeholder="e.g. Issued Jan 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Verification Redirect URL</label>
                      <input
                        type="url"
                        value={safeCert.credentialUrl}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, credentialUrl: e.target.value })}
                        className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Learning Outcomes Summary</label>
                    <textarea
                      rows={3}
                      value={safeCert.description}
                      onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, description: e.target.value })}
                      className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-sans leading-relaxed"
                      placeholder="Explain detailed outcomes, accessibility standards covered, neural nets, or cloud Cost-models..."
                    />
                  </div>
                </BentoAccordion>

                {/* 3. MEDIA UPLOADER ACCORDION */}
                <BentoAccordion id="media" title="3. Certificate Cover & Visuals" icon={ImageIcon}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-[4/3] border border-border bg-background rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative shrink-0">
                      <img 
                        src={safeCert.certificateImage} 
                        alt="Preview Visual" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>

                    <div className="flex flex-col justify-between space-y-4 text-left">
                      <div className="space-y-1">
                        <span className="text-[8.5px] font-mono tracking-widest uppercase text-amber-500 font-bold block">Preview Upload //</span>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Select a high-quality capture or visual screenshot of your credential certificate. Deploys instantly to Cloudinary.
                        </p>
                      </div>

                      <div className="relative w-full cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCertificateImageUpload(e, safeCert.id)}
                          disabled={uploadingCertImage}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                        />
                        <button
                          type="button"
                          disabled={uploadingCertImage}
                          className="w-full px-4 py-2.5 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-[9.5px] font-mono font-bold uppercase rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingCertImage ? 'UPLOADING...' : 'REPLACE VIA UPLOAD'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Custom Image URL Override</label>
                        <input
                          type="url"
                          value={safeCert.certificateImage}
                          onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, certificateImage: e.target.value })}
                          className="w-full bg-background border border-border focus:border-amber-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </BentoAccordion>

                {/* 4. SKILLS CHIPS MANAGER ACCORDION */}
                <BentoAccordion id="tags" title="4. Covered Skill Tag Domains" icon={Code}>
                  <div>
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Add Covered Skill Domain</label>
                    <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border rounded-xl min-h-[48px] items-center">
                      {safeCert.tags?.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-muted text-[10px] text-zinc-300 font-mono rounded border border-border flex items-center gap-1">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextTags = safeCert.tags.filter((t: string) => t !== tag);
                              updateSelectedCertificateDetails({ ...safeCert, tags: nextTags });
                            }}
                            className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer animate-fade-in"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Type skill & press enter"
                        className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-white ml-2 flex-grow min-w-[120px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const val = input.value.trim();
                            if (val && !safeCert.tags?.includes(val)) {
                              const nextTags = [...(safeCert.tags || []), val];
                              updateSelectedCertificateDetails({ ...safeCert, tags: nextTags });
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </BentoAccordion>

                {/* 5. METRIC FLAGS ACCORDION */}
                <BentoAccordion id="flags" title="5. Certificate Showcase Flags" icon={Activity}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left select-none select-none">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                        <span>Pin Featured</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={safeCert.featured}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, featured: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left select-none">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Verify Proof</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={safeCert.verified}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, verified: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left select-none">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-500" />
                        <span>Show Public</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={safeCert.visible}
                        onChange={(e) => updateSelectedCertificateDetails({ ...safeCert, visible: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 select-none">
                    <span className="text-[8.5px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">Visual Accent Glow Color Selection</span>
                    <div className="flex flex-wrap gap-2.5">
                      {COLOR_OPTIONS.map((c) => {
                        const isSelected = safeCert.accentColor === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => updateSelectedCertificateDetails({ ...safeCert, accentColor: c.id })}
                            className={`px-3 py-1.5 border rounded-xl flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.12)]' 
                                : 'bg-background border-border text-muted-foreground hover:text-white'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                            <span>{c.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </BentoAccordion>

              </div>
            )}

          </div>

        </div>

        {/* Confirmation deletion modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={deleteCertEntity}
          title="Delete Certificate Showcase Card"
          message="Are you absolutely sure you want to delete this credential card? Verification ID credentials and Cloudinary preview links will be lost."
          confirmText="DELETE CREDENTIAL"
        />
      </div>
    );
  }

  if (isMS) {
    const selectedMsCert = msCertificatesList.find((c) => c.id === selectedMsCertId);
    
    // Filter index calculations for MS compact list
    const filteredMsCerts = msCertificatesList
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          c.title.toLowerCase().includes(q) || 
          c.issuer.toLowerCase().includes(q) || 
          c.skills?.some((s: string) => s.toLowerCase().includes(q));

        if (!matchesQuery) return false;
        if (filterFeatured === 'featured' && !c.featured) return false;
        if (filterFeatured === 'normal' && c.featured) return false;
        if (filterVisible === 'visible' && c.visible === false) return false;
        if (filterVisible === 'hidden' && c.visible !== false) return false;
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Mahi Singh Specific operations helper wrappers
    const updateMsCertificate = (updatedCert: any) => {
      const nextList = msCertificatesList.map(c => c.id === updatedCert.id ? updatedCert : c);
      setMsCertificatesList(nextList);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: nextList }));
    };

    const toggleMsVisibility = (id: string) => {
      const nextList = msCertificatesList.map(c => c.id === id ? { ...c, visible: c.visible === false ? true : false } : c);
      setMsCertificatesList(nextList);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: nextList }));
    };

    const toggleMsFeatured = (id: string) => {
      const nextList = msCertificatesList.map(c => c.id === id ? { ...c, featured: !c.featured } : c);
      setMsCertificatesList(nextList);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: nextList }));
    };

    const handleMsArrowReorder = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === msCertificatesList.length - 1) return;

      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      const nextList = [...msCertificatesList];
      const temp = nextList[index];
      nextList[index] = nextList[targetIdx];
      nextList[targetIdx] = temp;

      const finalized = nextList.map((c, idx) => ({ ...c, order: idx + 1 }));
      setMsCertificatesList(finalized);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: finalized }));
    };

    const createMsCertificate = () => {
      const newCert = {
        id: `cert-${Date.now()}`,
        issuer: 'AWS Academy',
        title: 'AWS Certified Cloud Practitioner',
        date: '2026',
        description: 'Learned cloud computing fundamentals including AWS core services, IAM, EC2, S3, pricing, deployment models, and security best practices.',
        skills: ['AWS', 'Cloud Computing', 'IAM', 'EC2'],
        issuerLogoText: 'AWS',
        logoBg: 'bg-amber-500/10 border-amber-500/20',
        logoColor: 'text-amber-500',
        verifyCode: `AWS-${Date.now().toString().slice(-6)}`,
        credentialUrl: 'https://aws.amazon.com/verification',
        certificateImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
        featured: false,
        visible: true,
        accentColor: 'amber',
        glowColor: '#f59e0b',
        status: 'Verified',
        achievementTag: 'Elite Tier',
        showAchievementTag: false,
        showCredentialBtn: true,
        externalVerification: true,
        downloadToggle: false,
        order: msCertificatesList.length + 1
      };

      const nextList = [...msCertificatesList, newCert];
      setMsCertificatesList(nextList);
      setSelectedMsCertId(newCert.id);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: nextList }));
      setSuccess('New cinematic credential draft registered!');
    };

    const confirmDeleteMsCert = (id: string) => {
      setCertToDeleteId(id);
      setIsConfirmOpen(true);
    };

    const deleteMsCertEntity = () => {
      if (!certToDeleteId) return;
      const nextList = msCertificatesList.filter(c => c.id !== certToDeleteId);
      setMsCertificatesList(nextList);
      if (selectedMsCertId === certToDeleteId) {
        setSelectedMsCertId(null);
      }
      setIsConfirmOpen(false);
      setCertToDeleteId(null);
      emitCertificatesSectionUpdate(getMsCombinedSection({ certificates: nextList }));
      setSuccess('Cinematic credential deleted.');
    };

    const handleMsCertificateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingCertImage(true);
      const formData = new FormData();
      formData.append('certificateImage', file);

      try {
        const res = await api.post('/portfolio/profile/certificate-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const uploadedUrl = res.data.data.imageUrl;
        const targetCert = msCertificatesList.find((c) => c.id === certId);
        if (targetCert) {
          const updated = { ...targetCert, certificateImage: uploadedUrl };
          updateMsCertificate(updated);
          setSuccess('Certificate preview image uploaded!');
        }
      } catch (err: any) {
        console.error('Certificate cover upload error:', err);
        setError(err.response?.data?.message || 'Failed to upload preview image.');
      } finally {
        setUploadingCertImage(false);
      }
    };

    // Color Styles for fallback preview rendering
    const msColorStyles: Record<string, any> = {
      purple: { border: 'border-purple-500/20 bg-purple-500/5 text-purple-400', hex: '#8B5CF6' },
      blue:   { border: 'border-blue-500/20 bg-blue-500/5 text-blue-400',   hex: '#3B82F6' },
      amber:  { border: 'border-amber-500/20 bg-amber-500/5 text-amber-400',  hex: '#F59E0B' },
      emerald:{ border: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',hex: '#10B981' },
      cyan:   { border: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',   hex: '#06B6D4' },
    };

    return (
      <div className="space-y-6 select-none animate-fade-in text-left text-neutral-300 font-sans pb-12">
        {/* TOP CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Mahi Singh Portfolio Module</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              Credential Showcase Operating System
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Refined configuration workflow with side-by-side simulator viewports and instant socket hydration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-mono text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>SOCKET SYNC ACTIVE</span>
            </div>
            <button
              onClick={saveCertificatesSection}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xs font-bold uppercase rounded-xl tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.2)] disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'SYNCING DATA...' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </div>

        {/* CMS SPLIT PANES */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONFIGURATION SPACE */}
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
                  { id: 'registry', label: '2. Registry Workspace' },
                  { id: 'verification', label: '3. Verification System' },
                  { id: 'taxonomy', label: '4. Skill Taxonomy' },
                  { id: 'layout', label: '5. Display Engine' },
                  { id: 'analytics', label: '6. Analytics Strip' }
                ].map((t) => (
                  <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6-Tab Selector */}
            <div className="hidden md:flex bg-neutral-950 border border-neutral-800 rounded-2xl p-1.5 flex-wrap gap-1">
              {[
                { id: 'hero', label: 'Showcase Hero', icon: Info },
                { id: 'registry', label: 'Registry Workspace', icon: Award },
                { id: 'verification', label: 'Verification System', icon: ShieldCheck },
                { id: 'taxonomy', label: 'Skill Taxonomy', icon: Code },
                { id: 'layout', label: 'Display Engine', icon: Layers },
                { id: 'analytics', label: 'Analytics Strip', icon: BarChart2 }
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

            {/* CONFIG PANEL HEIGHT BOUNDED */}
            <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-3xl p-6 min-h-[550px] max-h-[82vh] overflow-y-auto space-y-6">
              
              {/* TAB 1: SHOWCASE HERO */}
              {msActiveTab === 'hero' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-4 h-4 text-orange-500" />
                      <span>Showcase Hero Controls</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500">Configure cinematic overlays, headings, and description overlays.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">BADGE PILL TEXT</label>
                      <input
                        type="text"
                        value={msBadge}
                        onChange={(e) => {
                          setMsBadge(e.target.value);
                          emitCertificatesSectionUpdate(getMsCombinedSection({ badge: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white tracking-widest font-mono font-bold"
                        placeholder="CREDENTIAL SHOWCASE"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">MAIN HEADING</label>
                      <input
                        type="text"
                        value={msHeading}
                        onChange={(e) => {
                          setMsHeading(e.target.value);
                          emitCertificatesSectionUpdate(getMsCombinedSection({ heading: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-black"
                        placeholder="CERTIFICATIONS & LEARNING"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">SHOWCASE DESCRIPTION</label>
                      <textarea
                        rows={3}
                        value={msDescription}
                        onChange={(e) => {
                          setMsDescription(e.target.value);
                          emitCertificatesSectionUpdate(getMsCombinedSection({ description: e.target.value }));
                        }}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-orange-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white leading-relaxed font-sans"
                        placeholder="Explain detailed focus..."
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-900 space-y-4">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block font-mono">Cinematic Background Controls</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                            <span>BLUR INTENSITY</span>
                            <span>{msBlurIntensity}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="24"
                            value={msBlurIntensity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setMsBlurIntensity(val);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ blurIntensity: val }));
                            }}
                            className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                            <span>OVERLAY DARKNESS</span>
                            <span>{msOverlayDarkness}%</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="95"
                            value={msOverlayDarkness}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setMsOverlayDarkness(val);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ overlayDarkness: val }));
                            }}
                            className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                            <span>GLASS TRANSPARENCY</span>
                            <span>{msGlassTransparency}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="60"
                            value={msGlassTransparency}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setMsGlassTransparency(val);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ glassTransparency: val }));
                            }}
                            className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl select-none">
                          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">WARM / ORANGE GLOW TINT</div>
                          <input
                            type="checkbox"
                            checked={msWarmTint}
                            onChange={(e) => {
                              setMsWarmTint(e.target.checked);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ warmTint: e.target.checked }));
                            }}
                            className="w-4 h-4 accent-orange-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDENTIAL REGISTRY */}
              {msActiveTab === 'registry' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in text-left">
                  
                  {/* Inventory compact side list (5 cols) */}
                  <div className="md:col-span-5 flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                    <button
                      onClick={createMsCertificate}
                      className="border border-dashed border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5 hover:bg-orange-500/10 cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center text-orange-400 font-bold uppercase text-[9px] tracking-wider transition-all shrink-0 select-none"
                    >
                      <Plus className="w-4 h-4 text-orange-400" />
                      <span>Register Cinematic Credential</span>
                    </button>

                    <div className="relative shrink-0">
                      <Search className="absolute left-3 top-2.5 w-3 h-3 text-neutral-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:outline-none pl-8 pr-3 py-1.5 rounded-xl text-[10px] text-white"
                        placeholder="Search credentials..."
                      />
                    </div>

                    {filteredMsCerts.map((c, idx) => {
                      const isActive = selectedMsCertId === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => { setSelectedMsCertId(c.id); setSimulatedSelectedCert(c); }}
                          className={`border rounded-xl p-3 flex items-center justify-between group transition-all cursor-pointer relative shrink-0 select-none ${
                            isActive
                              ? 'bg-orange-500/5 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.06)]'
                              : 'bg-neutral-900/40 border-neutral-850 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                            <div className="w-10 h-8 rounded border border-neutral-800 overflow-hidden bg-black shrink-0 flex items-center justify-center">
                              <img src={c.certificateImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h5 className="text-[10px] font-bold text-white line-clamp-2 whitespace-normal break-words uppercase group-hover:text-orange-400 transition-colors leading-tight">
                                {c.title}
                              </h5>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase">{c.issuer}</span>
                                {c.status && (
                                  <span className="text-[6.5px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1">
                                    {c.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleMsArrowReorder(idx, 'up')}
                              disabled={idx === 0}
                              className="p-0.5 hover:bg-neutral-800 rounded text-neutral-500 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMsArrowReorder(idx, 'down')}
                              disabled={idx === msCertificatesList.length - 1}
                              className="p-0.5 hover:bg-neutral-800 rounded text-neutral-500 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => toggleMsVisibility(c.id)}
                              className="p-0.5 hover:bg-neutral-800 rounded text-neutral-500 cursor-pointer"
                            >
                              {c.visible !== false ? <Eye className="w-3.5 h-3.5 text-orange-400" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />}
                            </button>
                            <button
                              onClick={() => confirmDeleteMsCert(c.id)}
                              className="p-0.5 hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Mobile Edit Button */}
                          <div className="flex sm:hidden px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-mono font-bold uppercase rounded-lg shrink-0 select-none">
                            [ Edit ]
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected editor workspace (7 cols) */}
                  <div className="md:col-span-7 space-y-4">
                    {!selectedMsCert ? (
                      <div className="bg-neutral-900/10 border border-neutral-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-[350px]">
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl">
                          <Award className="w-8 h-8 text-orange-500/50" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">No Credential Selected</h4>
                        <p className="text-[10px] text-neutral-500 max-w-xs leading-relaxed">
                          Choose a card from your inventory strip on the left to activate visual styling, covers, skills covered, and badge outputs.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        {/* Editor Header info */}
                        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-3.5 flex flex-col gap-3 select-none">
                          <div className="flex justify-between items-center w-full">
                            <div className="space-y-0.5">
                              <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-orange-500">Currently Editing //</span>
                              <h4 className="text-[10px] font-black text-white uppercase tracking-tight leading-none truncate max-w-[200px]">
                                {selectedMsCert.title}
                              </h4>
                            </div>
                            <span className="text-[7.5px] font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 shrink-0">
                              ID: {selectedMsCert.id.slice(0, 8)}
                            </span>
                          </div>
                          {/* Mobile Actions inside Edit Form container */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80 sm:hidden w-full">
                            <button
                              type="button"
                              onClick={() => handleMsArrowReorder(filteredMsCerts.findIndex(x => x.id === selectedMsCert.id), 'up')}
                              disabled={filteredMsCerts.findIndex(x => x.id === selectedMsCert.id) === 0}
                              className="flex-1 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                            >
                              <ArrowUp className="w-3 h-3" /> Move Up
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMsArrowReorder(filteredMsCerts.findIndex(x => x.id === selectedMsCert.id), 'down')}
                              disabled={filteredMsCerts.findIndex(x => x.id === selectedMsCert.id) === filteredMsCerts.length - 1}
                              className="flex-1 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                            >
                              <ArrowDown className="w-3 h-3" /> Move Down
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleMsVisibility(selectedMsCert.id)}
                              className="flex-1 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {selectedMsCert.visible !== false ? <Eye className="w-3.5 h-3.5 text-orange-400" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />} Visibility
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDeleteMsCert(selectedMsCert.id)}
                              className="flex-1 py-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>

                        {/* Basic settings form */}
                        <div className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Certificate Title</label>
                              <input
                                type="text"
                                value={selectedMsCert.title}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, title: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Organization / Issuer</label>
                              <input
                                type="text"
                                value={selectedMsCert.issuer}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, issuer: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Year / Date</label>
                              <input
                                type="text"
                                value={selectedMsCert.date}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, date: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Credential Secure ID</label>
                              <input
                                type="text"
                                value={selectedMsCert.verifyCode}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, verifyCode: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Academy Logo BG</label>
                              <input
                                type="text"
                                value={selectedMsCert.logoBg || 'bg-amber-500/10 border-amber-500/20'}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, logoBg: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Verification URL</label>
                              <input
                                type="url"
                                value={selectedMsCert.credentialUrl}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, credentialUrl: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Academy Logo Color</label>
                              <input
                                type="text"
                                value={selectedMsCert.logoColor || 'text-amber-500'}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, logoColor: e.target.value })}
                                className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Cover Preview Thumbnail Override URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={selectedMsCert.certificateImage}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, certificateImage: e.target.value })}
                                className="flex-grow bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-mono"
                              />
                              <div className="relative shrink-0 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleMsCertificateImageUpload(e, selectedMsCert.id)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                />
                                <button className="px-3 py-1.5 border border-neutral-800 bg-neutral-900 text-neutral-300 text-[10px] font-bold uppercase rounded-lg hover:text-white">
                                  UPLOAD
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 select-none">
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">STATUS ENGINE</label>
                              <select
                                value={selectedMsCert.status || 'Verified'}
                                onChange={(e) => updateMsCertificate({ ...selectedMsCert, status: e.target.value as any })}
                                className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg font-mono font-bold"
                              >
                                <option value="Verified">Verified</option>
                                <option value="Elite">Elite</option>
                                <option value="Professional">Professional</option>
                                <option value="Foundation">Foundation</option>
                                <option value="Academic">Academic</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">ACHIEVEMENT TAG</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={selectedMsCert.achievementTag || ''}
                                  onChange={(e) => updateMsCertificate({ ...selectedMsCert, achievementTag: e.target.value })}
                                  className="flex-grow bg-neutral-900/60 border border-neutral-800 focus:outline-none px-2.5 py-1.5 rounded-lg text-[10px] text-white"
                                  placeholder="e.g. Top 5%"
                                />
                                <div className="flex items-center gap-1 bg-neutral-900/60 border border-neutral-800 rounded-lg px-2 shrink-0">
                                  <span className="text-[7.5px] font-mono font-bold text-zinc-500">SHOW</span>
                                  <input
                                    type="checkbox"
                                    checked={selectedMsCert.showAchievementTag !== false}
                                    onChange={(e) => updateMsCertificate({ ...selectedMsCert, showAchievementTag: e.target.checked })}
                                    className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono font-bold">Covered Skill tag repeater</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkillText}
                                onChange={(e) => setNewSkillText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = newSkillText.trim();
                                    if (val && !selectedMsCert.skills?.includes(val)) {
                                      const nextSkills = [...(selectedMsCert.skills || []), val];
                                      updateMsCertificate({ ...selectedMsCert, skills: nextSkills });
                                      setNewSkillText('');
                                    }
                                  }
                                }}
                                className="flex-grow bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                                placeholder="Type skill name & press Enter..."
                              />
                              <button
                                onClick={() => {
                                  const val = newSkillText.trim();
                                  if (val && !selectedMsCert.skills?.includes(val)) {
                                    const nextSkills = [...(selectedMsCert.skills || []), val];
                                    updateMsCertificate({ ...selectedMsCert, skills: nextSkills });
                                    setNewSkillText('');
                                  }
                                }}
                                className="px-3 bg-orange-600 text-white font-bold text-[9px] uppercase rounded-lg hover:bg-orange-500"
                              >
                                ADD
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1 p-2 bg-neutral-950 border border-neutral-900 rounded-xl min-h-[40px] items-center mt-1.5">
                              {(!selectedMsCert.skills || selectedMsCert.skills.length === 0) ? (
                                <span className="text-[8px] text-zinc-500 font-mono">No skills specified yet.</span>
                              ) : (
                                selectedMsCert.skills.map((s: string) => (
                                  <span key={s} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-mono text-zinc-300 flex items-center gap-1 select-none">
                                    <span>{s}</span>
                                    <button
                                      onClick={() => {
                                        const next = selectedMsCert.skills.filter((sk: string) => sk !== s);
                                        updateMsCertificate({ ...selectedMsCert, skills: next });
                                      }}
                                      className="text-neutral-500 hover:text-red-400 cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono font-bold">Learning outcomes summary</label>
                            <textarea
                              rows={2}
                              value={selectedMsCert.description}
                              onChange={(e) => updateMsCertificate({ ...selectedMsCert, description: e.target.value })}
                              className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white font-sans leading-relaxed"
                            />
                          </div>

                          <div className="pt-2.5 border-t border-neutral-900 space-y-3">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">Action buttons controls</span>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                                <span className="text-[8px] font-mono text-neutral-500 font-bold">SHOW CREDENTIAL BTN</span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsCert.showCredentialBtn !== false}
                                  onChange={(e) => updateMsCertificate({ ...selectedMsCert, showCredentialBtn: e.target.checked })}
                                  className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                                />
                              </div>
                              <div className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                                <span className="text-[8px] font-mono text-neutral-500 font-bold">EXTERNAL VERIFICATION</span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsCert.externalVerification !== false}
                                  onChange={(e) => updateMsCertificate({ ...selectedMsCert, externalVerification: e.target.checked })}
                                  className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                                />
                              </div>
                              <div className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                                <span className="text-[8px] font-mono text-neutral-500 font-bold">DOWNLOAD TOGGLE</span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsCert.downloadToggle === true}
                                  onChange={(e) => updateMsCertificate({ ...selectedMsCert, downloadToggle: e.target.checked })}
                                  className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 select-none">
                              <div className="flex items-center justify-between p-2.5 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                                <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase">Pin Featured</span>
                                <input
                                  type="checkbox"
                                  checked={selectedMsCert.featured === true}
                                  onChange={(e) => toggleMsFeatured(selectedMsCert.id)}
                                  className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-[7.5px] font-mono font-bold text-zinc-500 mb-0.5 uppercase">Visual Glow accent color</label>
                                <div className="flex gap-1">
                                  {COLOR_OPTIONS.map((co) => (
                                    <button
                                      key={co.id}
                                      onClick={() => updateMsCertificate({ ...selectedMsCert, accentColor: co.id, glowColor: co.hex })}
                                      className={`w-4 h-4 rounded-full border ${co.dot} ${
                                        selectedMsCert.accentColor === co.id ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFICATION SYSTEM */}
              {msActiveTab === 'verification' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      <span>Verification System Config</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans">Fine-tune the security status badges, trust markers, and hover transitions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[8.5px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">Verification Badge Style</label>
                        <div className="grid grid-cols-2 gap-2 font-mono">
                          {['glow', 'outline', 'pulse', 'static'].map((style) => (
                            <button
                              key={style}
                              onClick={() => {
                                setMsVerificationBadgeStyle(style as any);
                                emitCertificatesSectionUpdate(getMsCombinedSection({
                                  verification: {
                                    badgeStyle: style,
                                    colorMode: msVerificationColorMode,
                                    animation: msVerificationAnimation,
                                    trustIndicators: msTrustIndicators
                                  }
                                }));
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                msVerificationBadgeStyle === style
                                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-extrabold shadow-inner'
                                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">Color Mode Selection</label>
                        <div className="grid grid-cols-2 gap-2 font-mono">
                          {['green', 'blue', 'orange', 'academy'].map((cm) => (
                            <button
                              key={cm}
                              onClick={() => {
                                setMsVerificationColorMode(cm as any);
                                emitCertificatesSectionUpdate(getMsCombinedSection({
                                  verification: {
                                    badgeStyle: msVerificationBadgeStyle,
                                    colorMode: cm,
                                    animation: msVerificationAnimation,
                                    trustIndicators: msTrustIndicators
                                  }
                                }));
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                msVerificationColorMode === cm
                                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-extrabold shadow-inner'
                                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {cm}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[8.5px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">Verification Animations</label>
                        <div className="grid grid-cols-1 gap-2 font-mono">
                          {['shimmer', 'pulse', 'hover glow'].map((anim) => (
                            <button
                              key={anim}
                              onClick={() => {
                                setMsVerificationAnimation(anim as any);
                                emitCertificatesSectionUpdate(getMsCombinedSection({
                                  verification: {
                                    badgeStyle: msVerificationBadgeStyle,
                                    colorMode: msVerificationColorMode,
                                    animation: anim,
                                    trustIndicators: msTrustIndicators
                                  }
                                }));
                              }}
                              className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                                msVerificationAnimation === anim
                                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-extrabold shadow-inner'
                                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {anim}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 space-y-3 select-none">
                        <span className="text-[8.5px] font-mono font-bold text-orange-400 uppercase tracking-wider">Document Trust Indicators</span>
                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                          {[
                            { id: 'verified', label: 'Verified Proof' },
                            { id: 'ranked', label: 'Ranked Placement' },
                            { id: 'institutionBacked', label: 'Backed Inst' },
                            { id: 'academyIssued', label: 'Academy Issued' }
                          ].map((t) => {
                            const isChecked = (msTrustIndicators as any)[t.id] !== false;
                            return (
                              <label key={t.id} className="flex items-center justify-between p-2 bg-neutral-900 border border-neutral-800/80 rounded-xl cursor-pointer">
                                <span className="text-neutral-400 font-bold">{t.label}</span>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const nextIndicators = { ...msTrustIndicators, [t.id]: e.target.checked };
                                    setMsTrustIndicators(nextIndicators);
                                    emitCertificatesSectionUpdate(getMsCombinedSection({
                                      verification: {
                                        badgeStyle: msVerificationBadgeStyle,
                                        colorMode: msVerificationColorMode,
                                        animation: msVerificationAnimation,
                                        trustIndicators: nextIndicators
                                      }
                                    }));
                                  }}
                                  className="w-3.5 h-3.5 accent-orange-500"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SKILL TAXONOMY */}
              {msActiveTab === 'taxonomy' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-orange-500" />
                      <span>Skill Taxonomy System</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans">Establish categories mapping directly to the orbital systems and tags.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Add taxonomy item (5 cols) */}
                    <div className="md:col-span-5 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-4.5 space-y-4 text-left">
                      <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest block">Register Skill Domain</span>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Skill Name</label>
                          <input
                            type="text"
                            value={taxonomySkillName}
                            onChange={(e) => setTaxonomySkillName(e.target.value)}
                            className="w-full bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                            placeholder="e.g. AWS"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono font-bold">Category Group</label>
                          <select
                            value={taxonomySkillCategory}
                            onChange={(e) => setTaxonomySkillCategory(e.target.value as any)}
                            className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg font-mono"
                          >
                            <option value="Cloud">Cloud</option>
                            <option value="Networking">Networking</option>
                            <option value="AI">AI</option>
                            <option value="Security">Security</option>
                            <option value="Backend">Backend</option>
                            <option value="Data Systems">Data Systems</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Priority</label>
                            <select
                              value={taxonomySkillPriority}
                              onChange={(e) => setTaxonomySkillPriority(parseInt(e.target.value))}
                              className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg font-mono"
                            >
                              <option value="1">1 (High)</option>
                              <option value="2">2 (Mid)</option>
                              <option value="3">3 (Low)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono font-bold">Glow Type</label>
                            <select
                              value={taxonomySkillGlow}
                              onChange={(e) => setTaxonomySkillGlow(e.target.value as any)}
                              className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none text-[10px] text-white px-2 py-1.5 rounded-lg font-mono"
                            >
                              <option value="none">None</option>
                              <option value="pulse">Pulse</option>
                              <option value="shimmer">Shimmer</option>
                              <option value="glow">Glow</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase font-mono">Glow / Tag hex color</label>
                          <input
                            type="color"
                            value={taxonomySkillColor}
                            onChange={(e) => setTaxonomySkillColor(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const name = taxonomySkillName.trim();
                            if (name) {
                              const newTax = {
                                name,
                                category: taxonomySkillCategory,
                                color: taxonomySkillColor,
                                priority: taxonomySkillPriority,
                                glowType: taxonomySkillGlow
                              };
                              const nextList = [...msSkillTaxonomy, newTax];
                              setMsSkillTaxonomy(nextList);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ skillTaxonomy: nextList }));
                              setTaxonomySkillName('');
                              setSuccess(`Taxonomy skill "${name}" registered!`);
                            }
                          }}
                          className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-[9px] uppercase rounded-xl transition-all font-mono"
                        >
                          REGISTER TAXONOMY
                        </button>
                      </div>
                    </div>

                    {/* Taxonomy list (7 cols) */}
                    <div className="md:col-span-7 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                      {['Cloud', 'Networking', 'AI', 'Security', 'Backend', 'Data Systems'].map((cat) => {
                        const skillsInCat = msSkillTaxonomy.filter((s) => s.category === cat);
                        return (
                          <div key={cat} className="space-y-1.5 text-left bg-neutral-900/20 border border-neutral-800/80 rounded-2xl p-3">
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest font-mono">{cat} ({skillsInCat.length})</span>
                            {skillsInCat.length === 0 ? (
                              <p className="text-[7.5px] text-zinc-600 font-mono italic">No registered tags inside category</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {skillsInCat.map((s) => (
                                  <span
                                    key={s.name}
                                    style={{ borderLeft: `2.5px solid ${s.color}` }}
                                    className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-mono text-zinc-300 flex items-center gap-1.5 select-none"
                                  >
                                    <span>{s.name}</span>
                                    <span className="text-[6px] bg-neutral-800 px-0.5 rounded text-neutral-500">{s.glowType}</span>
                                    <button
                                      onClick={() => {
                                        const next = msSkillTaxonomy.filter((sk) => sk.name !== s.name);
                                        setMsSkillTaxonomy(next);
                                        emitCertificatesSectionUpdate(getMsCombinedSection({ skillTaxonomy: next }));
                                      }}
                                      className="text-neutral-500 hover:text-red-400 cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DISPLAY LAYOUT ENGINE */}
              {msActiveTab === 'layout' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-orange-500" />
                      <span>Display Layout Engine</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans">Establish card min-height configurations, responsive column scales, and alignment controls.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] font-mono">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                          <span>DESKTOP COLUMNS COUNT</span>
                          <span>{msLayout.gridColumnsDesktop} columns</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={msLayout.gridColumnsDesktop}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const next = { ...msLayout, gridColumnsDesktop: val };
                            setMsLayout(next);
                            emitCertificatesSectionUpdate(getMsCombinedSection({ layout: next }));
                          }}
                          className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                          <span>MOBILE COLUMNS COUNT</span>
                          <span>{msLayout.gridColumnsMobile} columns</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          value={msLayout.gridColumnsMobile}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const next = { ...msLayout, gridColumnsMobile: val };
                            setMsLayout(next);
                            emitCertificatesSectionUpdate(getMsCombinedSection({ layout: next }));
                          }}
                          className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-neutral-400 mb-1">
                          <span>CARD MINIMUM HEIGHT</span>
                          <span>{msLayout.cardMinHeight}px</span>
                        </div>
                        <input
                          type="range"
                          min="240"
                          max="480"
                          value={msLayout.cardMinHeight}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const next = { ...msLayout, cardMinHeight: val };
                            setMsLayout(next);
                            emitCertificatesSectionUpdate(getMsCombinedSection({ layout: next }));
                          }}
                          className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-neutral-900/40 border border-neutral-800 rounded-2xl select-none">
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block leading-tight">INTEGRATED COMPACT SIDEBAR</span>
                          <span className="text-[7.5px] text-neutral-500 font-sans italic mt-0.5 block leading-none">Forces integrated side panel vs floating banner.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={msLayout.integratedBadge}
                          onChange={(e) => {
                            const next = { ...msLayout, integratedBadge: e.target.checked };
                            setMsLayout(next);
                            emitCertificatesSectionUpdate(getMsCombinedSection({ layout: next }));
                          }}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CREDENTIAL ANALYTICS */}
              {msActiveTab === 'analytics' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1 pb-3 border-b border-neutral-900">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-orange-500" />
                      <span>Telemetry Stats Configuration</span>
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans">Configure live stats display cards and advanced learning percentage meters.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-[10px] font-mono">
                    {/* Stats strip inputs (5 cols) */}
                    <div className="md:col-span-5 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-4.5 space-y-4">
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">Stats cards values</span>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Total certifications</label>
                          <input
                            type="number"
                            value={msAnalytics.totalCertifications}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const next = { ...msAnalytics, totalCertifications: val };
                              setMsAnalytics(next);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ analytics: next }));
                            }}
                            className="w-full bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono font-bold font-mono">Active Tracks count</label>
                          <input
                            type="number"
                            value={msAnalytics.activeLearningTracks}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const next = { ...msAnalytics, activeLearningTracks: val };
                              setMsAnalytics(next);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ analytics: next }));
                            }}
                            className="w-full bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Completion Score (%)</label>
                          <input
                            type="number"
                            value={msAnalytics.completionScore}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const next = { ...msAnalytics, completionScore: val };
                              setMsAnalytics(next);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ analytics: next }));
                            }}
                            className="w-full bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-neutral-400 uppercase mb-1 font-mono">Platform Count</label>
                          <input
                            type="number"
                            value={msAnalytics.platformCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const next = { ...msAnalytics, platformCount: val };
                              setMsAnalytics(next);
                              emitCertificatesSectionUpdate(getMsCombinedSection({ analytics: next }));
                            }}
                            className="w-full bg-neutral-900/60 border border-neutral-800 focus:outline-none px-3 py-1.5 rounded-lg text-[10px] text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Radar tracking levels (7 cols) */}
                    <div className="md:col-span-7 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-4.5 space-y-4">
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block font-mono">Radar percentage controllers</span>
                      
                      <div className="space-y-4">
                        {['Cloud', 'AI', 'Networking', 'Backend', 'Security'].map((track) => {
                          const val = (msAnalytics.radarTracks as any)[track] || 0;
                          return (
                            <div key={track}>
                              <div className="flex justify-between text-[8.5px] font-bold text-neutral-400 mb-1">
                                <span>{track.toUpperCase()} FOCUS LEVEL</span>
                                <span>{val}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={val}
                                onChange={(e) => {
                                  const trackVal = parseInt(e.target.value);
                                  const nextRadar = { ...msAnalytics.radarTracks, [track]: trackVal };
                                  const next = { ...msAnalytics, radarTracks: nextRadar };
                                  setMsAnalytics(next);
                                  emitCertificatesSectionUpdate(getMsCombinedSection({ analytics: next }));
                                }}
                                className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ==========================================
             RIGHT COLUMN: LIVE INTERACTIVE PREVIEW SIMULATION
             ========================================== */}
          <div className="xl:col-span-6 space-y-4 relative">
            
            {/* Viewport header simulation bar */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3 flex justify-between items-center select-none shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest ml-2">SIMULATED PORTFOLIO BROWSER</span>
              </div>
              
              <div className="flex gap-1 bg-neutral-900/60 p-0.5 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setSimulatedViewport('desktop')}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${simulatedViewport === 'desktop' ? 'bg-neutral-800 text-orange-400 font-extrabold shadow' : 'text-neutral-500 hover:text-white'}`}
                  title="Simulate Desktop Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSimulatedViewport('mobile')}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${simulatedViewport === 'mobile' ? 'bg-neutral-800 text-orange-400 font-extrabold shadow' : 'text-neutral-500 hover:text-white'}`}
                  title="Simulate Mobile Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SIMULATED VIEWPORT CONTAINER */}
            <div className="w-full flex justify-center items-start transition-all duration-500">
              <div
                style={{
                  width: simulatedViewport === 'mobile' ? '375px' : '100%',
                  minHeight: '620px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
                className="bg-black/90 p-6 relative overflow-hidden transition-all duration-300 shadow-[0_15px_50px_rgba(0,0,0,0.85)] max-h-[80vh] overflow-y-auto"
              >
                {/* Dynamic Cinematic background layer blur/opacities */}
                <div
                  style={{
                    filter: `blur(${msBlurIntensity}px)`,
                    opacity: 1.0 - (msGlassTransparency / 100.0),
                    background: msWarmTint
                      ? 'radial-gradient(circle at 50% 30%, rgba(249,115,22,0.1) 0%, transparent 60%)'
                      : 'radial-gradient(circle at 50% 30%, rgba(62,62,62,0.2) 0%, transparent 60%)'
                  }}
                  className="absolute inset-0 pointer-events-none z-0"
                />

                <div className="relative z-10 space-y-6">
                  {/* TOP HEADER SECTION */}
                  <div className="text-left space-y-2 select-none border-b border-white/[0.04] pb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 tracking-wider font-mono">
                      {msBadge || 'CREDENTIAL SHOWCASE'}
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                      {msHeading || 'CERTIFICATIONS & LEARNING'}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-light max-w-sm leading-relaxed">
                      {msDescription || 'Industry-recognized credentials...'}
                    </p>
                  </div>

                  {/* TELEMETRY STRIP AND RADAR SIMULATION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    {/* Stats details */}
                    <div className="bg-[#0b0b0c] border border-white/[0.04] rounded-2xl p-4.5 space-y-2 text-left">
                      <span className="text-[7.5px] font-mono text-zinc-600 font-bold uppercase block tracking-wider">Showcase statistics telemetry</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        <div className="bg-[#121214] border border-white/[0.02] p-2 rounded-xl">
                          <span className="text-[10px] font-extrabold text-orange-400 font-mono block leading-none">{msAnalytics.totalCertifications}</span>
                          <span className="text-[6.5px] text-zinc-500 font-mono uppercase">Certifications</span>
                        </div>
                        <div className="bg-[#121214] border border-white/[0.02] p-2 rounded-xl">
                          <span className="text-[10px] font-extrabold text-orange-400 font-mono block leading-none">{msAnalytics.activeLearningTracks}</span>
                          <span className="text-[6.5px] text-zinc-500 font-mono uppercase">Active tracks</span>
                        </div>
                        <div className="bg-[#121214] border border-white/[0.02] p-2 rounded-xl">
                          <span className="text-[10px] font-extrabold text-orange-400 font-mono block leading-none">{msAnalytics.completionScore}%</span>
                          <span className="text-[6.5px] text-zinc-500 font-mono uppercase">Completion Score</span>
                        </div>
                        <div className="bg-[#121214] border border-white/[0.02] p-2 rounded-xl">
                          <span className="text-[10px] font-extrabold text-orange-400 font-mono block leading-none">{msAnalytics.platformCount}</span>
                          <span className="text-[6.5px] text-zinc-500 font-mono uppercase">Cloud platforms</span>
                        </div>
                      </div>
                    </div>

                    {/* Radar tracking levels */}
                    <div className="bg-[#0b0b0c] border border-white/[0.04] rounded-2xl p-4.5 space-y-2.5">
                      <span className="text-[7.5px] font-mono text-zinc-600 font-bold uppercase block tracking-wider">Radar Track focus meter</span>
                      <div className="space-y-1.5 font-mono text-[7px] text-zinc-500">
                        {['Cloud', 'AI', 'Networking', 'Backend', 'Security'].map((k) => {
                          const percent = (msAnalytics.radarTracks as any)[k] || 0;
                          return (
                            <div key={k} className="space-y-0.5">
                              <div className="flex justify-between font-bold">
                                <span>{k.toUpperCase()}</span>
                                <span className="text-orange-400">{percent}%</span>
                              </div>
                              <div className="w-full h-1 bg-[#161619] rounded-full overflow-hidden">
                                <div style={{ width: `${percent}%` }} className="h-full bg-orange-500 rounded-full" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* CERTIFICATIONS SHOWCASE ADAPTIVE GRID */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: (simulatedViewport === 'mobile' || msLayout.gridColumnsDesktop === 1)
                        ? '1fr'
                        : `repeat(${msLayout.gridColumnsDesktop}, minmax(0, 1fr))`,
                      gap: '16px'
                    }}
                  >
                    {msCertificatesList.filter(c => c.visible !== false).length === 0 ? (
                      <div className="col-span-full p-8 text-center bg-neutral-950 border border-dashed border-neutral-800 rounded-2xl select-none">
                        <span className="text-[10px] text-neutral-600 font-mono block">No credentials visible in simulated register.</span>
                      </div>
                    ) : (
                      msCertificatesList.filter(c => c.visible !== false).map((c) => {
                        const style = msColorStyles[c.accentColor || 'amber'] || msColorStyles.amber;
                        return (
                          <div
                            key={c.id}
                            onClick={() => { setSimulatedSelectedCert(c); }}
                            style={{ minHeight: `${msLayout.cardMinHeight}px` }}
                            className="bg-[#0b0b0c]/85 border border-white/[0.04] hover:border-neutral-700/60 rounded-2xl flex flex-col justify-between p-4.5 relative overflow-hidden transition-all duration-300 cursor-pointer shadow-lg relative group/simcard"
                          >
                            {/* Accent Glow backdrop */}
                            <div style={{ background: `radial-gradient(circle at 100% 0%, ${c.glowColor || style.hex}15 0%, transparent 50%)` }} className="absolute inset-0 z-0 pointer-events-none" />
                            
                            {/* Card Inner Split */}
                            {msLayout.integratedBadge ? (
                              <div className="flex gap-4 h-full relative z-10 items-stretch">
                                {/* Left Content */}
                                <div className="flex-grow flex flex-col justify-between text-left space-y-3">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <div className={`px-1.5 py-0.5 text-[7px] font-bold font-mono rounded border ${c.logoBg || 'bg-amber-500/10 border-amber-500/20'} ${c.logoColor || 'text-amber-500'}`}>
                                        {c.issuerLogoText || 'CRED'}
                                      </div>
                                      <span className="text-[7.5px] font-extrabold text-zinc-500 uppercase tracking-wider truncate max-w-[80px]">{c.issuer}</span>
                                    </div>
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-snug line-clamp-2">{c.title}</h4>
                                    <p className="text-[8.5px] text-zinc-400 font-light leading-normal line-clamp-2">{c.description}</p>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(c.skills || c.tags || []).slice(0, 3).map((sk: string) => (
                                      <span key={sk} className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[6.5px] font-mono text-zinc-500 rounded">
                                        {sk}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Right Verification Sidebar */}
                                <div className="w-[90px] shrink-0 border-l border-white/[0.04] pl-3 flex flex-col justify-between text-right items-end py-1">
                                  <div className="space-y-1">
                                    <span className="text-[6.5px] font-mono text-zinc-500 uppercase block tracking-wider">Date</span>
                                    <span className="text-[8px] font-bold text-white block">{c.date || c.issueDate || ''}</span>
                                  </div>

                                  {/* Verification Badge */}
                                  <div className="space-y-1">
                                    <span className="text-[6px] font-mono text-zinc-500 uppercase block tracking-wider">Status</span>
                                    <span
                                      style={{
                                        boxShadow: msVerificationBadgeStyle === 'glow' ? `0 0 10px ${c.glowColor || style.hex}25` : 'none',
                                        borderColor: msVerificationBadgeStyle === 'outline' ? `${c.glowColor || style.hex}30` : 'transparent'
                                      }}
                                      className={`inline-flex items-center gap-0.5 text-[6.5px] font-mono font-extrabold uppercase px-1 py-0.5 rounded leading-none shrink-0 ${
                                        msVerificationColorMode === 'orange' ? 'text-orange-400 bg-orange-500/10' :
                                        msVerificationColorMode === 'green' ? 'text-emerald-400 bg-emerald-500/10' :
                                        msVerificationColorMode === 'blue' ? 'text-blue-400 bg-blue-500/10' :
                                        'text-orange-400 bg-orange-500/10'
                                      }`}
                                    >
                                      {msVerificationBadgeStyle === 'pulse' && <span className="w-1 h-1 rounded-full bg-current animate-pulse shrink-0" />}
                                      <span>{c.status || 'Verified'}</span>
                                    </span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="text-[5.5px] font-mono text-zinc-600 block font-bold">ID: {(c.verifyCode || c.id || '').slice(-5)}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Classic card rendering if integratedBadge is disabled
                              <div className="space-y-3 relative z-10 text-left">
                                <div className="flex justify-between items-start">
                                  <div className={`px-2 py-0.5 text-[7px] font-bold font-mono rounded border ${c.logoBg || 'bg-amber-500/10 border-amber-500/20'} ${c.logoColor || 'text-amber-500'}`}>
                                    {c.issuerLogoText || 'CRED'}
                                  </div>
                                  <span className="text-[8px] text-zinc-500 font-bold font-mono">{c.date || c.issueDate || ''}</span>
                                </div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-snug line-clamp-2">{c.title}</h4>
                                <p className="text-[8.5px] text-zinc-400 font-light leading-normal line-clamp-2">{c.description}</p>
                              </div>
                            )}

                            {/* Zoom overlay simulated */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/75 opacity-0 group-hover/simcard:opacity-100 transition-opacity duration-200 z-20 rounded-2xl select-none">
                              <span className="text-[9px] font-bold tracking-widest text-neutral-200 uppercase flex items-center gap-1">
                                Click to Verify →
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Lightbox / Document Mockup modal simulated inside browser */}
                {simulatedSelectedCert && (
                  <div className="absolute inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4 animate-fade-in">
                    <div className="w-full max-w-sm bg-[#0c0c0e] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl relative select-none">
                      <button
                        onClick={() => setSimulatedSelectedCert(null)}
                        className="absolute top-3 right-3 text-neutral-500 hover:text-white p-1 rounded-md cursor-pointer z-30"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-1 text-left">
                        <span className="text-[7.5px] text-orange-500 font-extrabold uppercase tracking-widest font-mono">Official Document Verification</span>
                        <h4 className="text-xs font-bold text-white tracking-tight leading-tight">{simulatedSelectedCert.title}</h4>
                      </div>

                      {/* Certificate Document Mockup */}
                      <div className="relative border border-neutral-800 rounded-xl p-4 bg-gradient-to-br from-neutral-900/60 to-neutral-950/80 flex flex-col justify-between aspect-[1.414] overflow-hidden">
                        <div className="absolute inset-1.5 border border-neutral-800/40 pointer-events-none rounded-lg" />
                        
                        <div className="absolute top-2 right-2 text-neutral-700 font-mono text-[7px] uppercase tracking-wider">
                          SECURE VERIFIED ID: {simulatedSelectedCert.verifyCode || simulatedSelectedCert.id || ''}
                        </div>

                        <div className="space-y-2 relative z-10 text-left pt-1">
                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                            <Award className="w-4 h-4 text-orange-500" />
                            <span>{simulatedSelectedCert.issuer}</span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[7px] italic text-neutral-500 font-serif leading-none">This credential certifies that</p>
                            <h5 className="text-[12px] font-bold font-serif text-white tracking-wide leading-none">Mahi Singh</h5>
                          </div>
                          <p className="text-[7.5px] text-zinc-500 leading-normal max-w-[190px]">
                            {simulatedSelectedCert.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-end relative z-10 border-t border-neutral-900/80 pt-2">
                          <div>
                            <p className="text-[6px] text-neutral-500 font-extrabold uppercase font-mono">Issued Date</p>
                            <p className="text-[7.5px] font-bold text-neutral-300 leading-none">{simulatedSelectedCert.date || simulatedSelectedCert.issueDate || ''}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-[6px] text-neutral-500 font-extrabold uppercase font-mono">Status</p>
                            <span className="inline-flex items-center gap-0.5 text-[7px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Verification links simulated */}
                      <div className="space-y-2 select-none border-t border-neutral-900 pt-3">
                        <p className="text-[8px] text-zinc-500 text-left leading-relaxed">
                          Linked directly to the official credential register of {simulatedSelectedCert.issuer}. Unique validation secure ID: <code className="text-zinc-400 font-mono bg-neutral-950 px-1 py-0.5 rounded">{simulatedSelectedCert.verifyCode || simulatedSelectedCert.id || ''}</code>.
                        </p>
                        
                        <div className="flex justify-end gap-2 pt-1.5 text-[8.5px] font-mono">
                          <button className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold uppercase rounded-lg hover:text-white flex items-center gap-1 cursor-pointer">
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Register</span>
                          </button>
                          <button className="px-3 py-1.5 bg-neutral-200 text-neutral-950 font-black uppercase rounded-lg hover:bg-white flex items-center gap-1 cursor-pointer">
                            <ShieldCheck className="w-2.5 h-2.5 text-neutral-950" />
                            <span>Verify Registry</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

        {/* Confirmation deletion modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={deleteMsCertEntity}
          title="Delete Credential"
          message="Are you absolutely sure you want to delete this verified credential showcase card? All metadata, taxonomy cover bindings, and secure validation logs will be purged."
          confirmText="DELETE CREDENTIAL"
        />
      </div>
    );
  }

  // Fallback default style layout for other portfolios (sd, ms)
  const colorStyles: Record<string, any> = {
    purple: { text: 'text-purple-400', border: 'border-purple-500/30 bg-purple-500/5', bg: 'bg-purple-500', hex: '#8B5CF6' },
    blue:   { text: 'text-blue-400',   border: 'border-blue-500/30 bg-blue-500/5',   bg: 'bg-blue-500',   hex: '#3B82F6' },
    amber:  { text: 'text-amber-400',  border: 'border-amber-500/30 bg-amber-500/5',  bg: 'bg-amber-500',  hex: '#F59E0B' },
    emerald:{ text: 'text-emerald-400',border: 'border-emerald-500/30 bg-emerald-500/5',bg: 'bg-emerald-500',hex: '#10B981' },
    cyan:   { text: 'text-cyan-400',   border: 'border-cyan-500/30 bg-cyan-500/5',   bg: 'bg-cyan-500',   hex: '#06B6D4' },
  };

  return (
    <div className="space-y-6 animate-fade-in pr-2 pb-6">
      
      {/* Operating System header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Achievements CMS Operating System</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Configure certified credentials, exploring radar tracks, and verified statistics counters.</p>
        </div>

        <button
          onClick={saveCertificatesSection}
          disabled={saving}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SYNCING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-5 space-y-6">
          
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
                  onChange={(e) => handleGlobalTextChange('badge', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-xs text-foreground transition-all"
                  placeholder="e.g. LEARNING JOURNEY"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Main Heading</label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleGlobalTextChange('heading', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-xs text-foreground transition-all uppercase"
                  placeholder="e.g. CERTIFICATIONS & ACHIEVEMENTS"
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Showcase Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => handleGlobalTextChange('description', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-lg text-xs text-foreground transition-all font-sans"
                  placeholder="Continuous learning through certifications..."
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>2. Telemetry Stats Strip</span>
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Certifications count</label>
                <input
                  type="text"
                  value={certificationsCount}
                  onChange={(e) => handleGlobalTextChange('certificationsCount', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                  placeholder="e.g. 12 Certifications"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Active Tracks count</label>
                <input
                  type="text"
                  value={activeTracksCount}
                  onChange={(e) => handleGlobalTextChange('activeTracksCount', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                  placeholder="e.g. 4 Active Tracks"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Platforms count</label>
                <input
                  type="text"
                  value={platformsCount}
                  onChange={(e) => handleGlobalTextChange('platformsCount', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                  placeholder="e.g. 3 Cloud Platforms"
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">Specialization Focus</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => handleGlobalTextChange('specialization', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                  placeholder="e.g. AI/ML Specialization"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              <span>3. Learning Radar Panel Settings</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Radar Title</label>
                <input
                  type="text"
                  value={radarTitle}
                  onChange={(e) => handleGlobalTextChange('radarTitle', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-lg text-xs text-foreground transition-all"
                  placeholder="Currently Learning: AI/ML..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Radar Description</label>
                <textarea
                  rows={2}
                  value={radarDescription}
                  onChange={(e) => handleGlobalTextChange('radarDescription', e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-lg text-xs text-foreground transition-all font-sans"
                  placeholder="Deepening skills in neural networks architectures..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Active Exploring Radar Topics</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTrackText}
                    onChange={(e) => setNewTrackText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExploringTrack(); } }}
                    className="flex-grow bg-background border border-border focus:border-primary focus:outline-none px-3 py-1.5 rounded-lg text-xs text-white"
                    placeholder="Type topic & press enter"
                  />
                  <button 
                    onClick={addExploringTrack}
                    className="px-3 bg-primary text-primary-foreground font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                  >
                    ADD
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2.5 bg-background border border-border rounded-xl min-h-[40px] items-center">
                  {exploringTracks.length === 0 ? (
                    <span className="text-[9px] text-muted-foreground font-mono">No radar tracks added yet.</span>
                  ) : (
                    exploringTracks.map((track) => (
                      <span key={track} className="px-2 py-0.5 bg-muted text-[10px] text-zinc-300 font-mono rounded border border-border flex items-center gap-1">
                        <span>{track}</span>
                        <button onClick={() => deleteExploringTrack(track)} className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL (Legacy fallback form layout for sd, ms) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/40 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>4. Verified Credentials Gallery ({processedList.length})</span>
              </h4>
              <button
                type="button"
                onClick={createCertificateEntity}
                className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-primary/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certificate</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none pl-9 pr-4 py-2 rounded-xl text-xs text-white"
                  placeholder="Search credentials..."
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {processedList.map((cert, index) => {
                const style = colorStyles[cert.accentColor || 'purple'] || colorStyles.purple;

                return (
                  <div 
                    key={cert.id}
                    onClick={() => setSelectedCertificateId(cert.id)}
                    className="p-3 bg-background border border-border hover:border-primary/30 rounded-2xl flex items-center justify-between gap-3 group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div className="w-14 h-11 rounded-lg border border-border/40 overflow-hidden shrink-0 bg-neutral-900 flex items-center justify-center shadow">
                        <img src={cert.certificateImage} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1 text-left">
                        <h5 className="text-xs font-bold text-white line-clamp-2 whitespace-normal break-words group-hover:text-primary transition-all uppercase">{cert.title}</h5>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">{cert.issuer}</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleArrowReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleArrowReorder(index, 'down')}
                        disabled={index === certificatesList.length - 1}
                        className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => confirmDeleteCert(cert.id)}
                        className="p-1.5 hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mobile Edit Button */}
                    <div className="flex sm:hidden px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase rounded-lg shrink-0 select-none">
                      [ Edit ]
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteCertEntity}
        title="Delete Showcase Project"
        message="Are you absolutely sure you want to delete this showcase item?"
        confirmText="DELETE CERTIFICATE"
      />

      <Modal
        isOpen={selectedCertificateId !== null}
        onClose={() => setSelectedCertificateId(null)}
        title={selectedCert?.title ? "Edit Certificate Details" : "Add New Certificate"}
        size="lg"
      >
        {selectedCert && (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Certification Title</label>
                <input
                  type="text"
                  value={selectedCert.title || ''}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, title: e.target.value })}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                  placeholder="e.g. AWS Cloud Practitioner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Organization / Issuer</label>
                <input
                  type="text"
                  value={selectedCert.issuer || selectedCert.organization || ''}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, issuer: e.target.value })}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Issue Date</label>
                <input
                  type="text"
                  value={selectedCert.issueDate || ''}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, issueDate: e.target.value })}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                  placeholder="e.g. January 2026"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Verification Redirect URL</label>
                <input
                  type="url"
                  value={selectedCert.credentialUrl || ''}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, credentialUrl: e.target.value })}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Description / Learning Outcomes</label>
              <textarea
                rows={3}
                value={selectedCert.description || ''}
                onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, description: e.target.value })}
                className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white leading-relaxed"
                placeholder="Explain detailed outcomes, services mastered, or engineering principles covered..."
              />
            </div>

            {/* Cover Image Uploader and URL Override */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 aspect-[4/3] border border-border bg-background rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative shrink-0">
                <img 
                  src={selectedCert.certificateImage || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop'} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Custom Image URL Override</label>
                  <input
                    type="url"
                    value={selectedCert.certificateImage || ''}
                    onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, certificateImage: e.target.value })}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    placeholder="https://..."
                  />
                </div>
                <div className="relative w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCertificateImageUpload(e, selectedCert.id)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                  />
                  <button
                    type="button"
                    className="w-full px-4 py-2 border border-primary/20 hover:border-primary/45 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image Override</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tags/Skills section */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Associated Skills / Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newCertTagInput"
                  placeholder="Type tag & press enter"
                  className="flex-grow bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      const val = target.value.trim();
                      if (val && !selectedCert.tags?.includes(val)) {
                        const nextTags = [...(selectedCert.tags || []), val];
                        updateSelectedCertificateDetails({ ...selectedCert, tags: nextTags });
                        target.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const inputEl = document.getElementById('newCertTagInput') as HTMLInputElement;
                    const val = inputEl?.value.trim();
                    if (val && !selectedCert.tags?.includes(val)) {
                      const nextTags = [...(selectedCert.tags || []), val];
                      updateSelectedCertificateDetails({ ...selectedCert, tags: nextTags });
                      inputEl.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border rounded-xl min-h-[45px] items-center">
                {(!selectedCert.tags || selectedCert.tags.length === 0) ? (
                  <span className="text-[10px] text-muted-foreground font-mono">No tags associated yet.</span>
                ) : (
                  selectedCert.tags.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-muted text-[10px] text-zinc-300 font-mono rounded-lg border border-border flex items-center gap-1.5">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextTags = selectedCert.tags.filter((t: string) => t !== tag);
                          updateSelectedCertificateDetails({ ...selectedCert, tags: nextTags });
                        }}
                        className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Status Settings Checkboxes */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <label className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left cursor-pointer">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Featured Pin</span>
                <input
                  type="checkbox"
                  checked={selectedCert.featured || false}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, featured: e.target.checked })}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left cursor-pointer">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verified Proof</span>
                <input
                  type="checkbox"
                  checked={selectedCert.verified !== false}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, verified: e.target.checked })}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-left cursor-pointer">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Visibility Status</span>
                <input
                  type="checkbox"
                  checked={selectedCert.visible !== false}
                  onChange={(e) => updateSelectedCertificateDetails({ ...selectedCert, visible: e.target.checked })}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </label>
            </div>

            {/* Accent Color picker */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Visual Accent Glow Color Selection</span>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = selectedCert.accentColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateSelectedCertificateDetails({ ...selectedCert, accentColor: c.id })}
                      className={`px-3 py-1.5 border rounded-xl flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(245,158,11,0.12)]' 
                          : 'bg-background border-border text-muted-foreground hover:text-white'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Actions inside Edit Modal */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40 sm:hidden">
              <button
                type="button"
                onClick={() => handleArrowReorder(processedList.findIndex(c => c.id === selectedCert.id), 'up')}
                disabled={processedList.findIndex(c => c.id === selectedCert.id) === 0}
                className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <ArrowUp className="w-3 h-3" /> Move Up
              </button>
              <button
                type="button"
                onClick={() => handleArrowReorder(processedList.findIndex(c => c.id === selectedCert.id), 'down')}
                disabled={processedList.findIndex(c => c.id === selectedCert.id) === processedList.length - 1}
                className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <ArrowDown className="w-3 h-3" /> Move Down
              </button>
              <button
                type="button"
                onClick={() => toggleVisibility(selectedCert.id)}
                className="flex-1 py-2 bg-neutral-900 border border-border/60 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                {selectedCert.visible !== false ? <Eye className="w-3 h-3 text-amber-500" /> : <EyeOff className="w-3 h-3 text-destructive" />} Visibility
              </button>
              <button
                type="button"
                onClick={() => { confirmDeleteCert(selectedCert.id); setSelectedCertificateId(null); }}
                className="flex-1 py-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex gap-3 pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => setSelectedCertificateId(null)}
                className="flex-1 py-3 bg-muted border border-border text-zinc-300 text-xs font-mono font-bold uppercase rounded-xl hover:bg-muted/70 transition-all cursor-pointer"
              >
                DISMISS
              </button>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}
