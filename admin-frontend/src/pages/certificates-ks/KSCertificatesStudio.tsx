import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles, Award, ShieldCheck, Sliders, Plus, Trash2, Edit3, Copy,
  ExternalLink, FileText, Globe, Calendar, ChevronRight, Search, Eye,
  EyeOff, Save, Upload, X, Layers, ArrowUp, ArrowDown, ArrowUpRight,
  GraduationCap, Info, Palette, Shield, Laptop
} from 'lucide-react';

const PRESET_SKILLS = [
  'AI', 'Prompt Engineering', 'LLMs', 'GPT-4', 'RAG', 'Fine-tuning',
  'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js',
  'Python', 'Machine Learning', 'Deep Learning', 'PyTorch',
  'Vector Databases', 'LangChain', 'LlamaIndex', 'API Design'
];

const THEME_STYLES = [
  { id: 'glass-dark', label: 'Frosted Glass Dark', class: 'bg-black/40 border-white/10 text-white backdrop-blur-md shadow-2xl' },
  { id: 'neon', label: 'Cyber Neon Glow', class: 'bg-zinc-950 border-purple-500/30 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
  { id: 'gold', label: 'Imperial Gold', class: 'bg-stone-950 border-amber-500/30 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.1)]' },
  { id: 'cyan', label: 'Techno Cyan', class: 'bg-slate-950 border-cyan-500/30 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.15)]' },
  { id: 'violet', label: 'Mystic Violet', class: 'bg-neutral-950 border-fuchsia-500/30 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.15)]' }
];

export default function KSCertificatesStudio() {
  const { activePortfolio } = usePortfolio();
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);
  const user = useStore((state) => state.user);

  // --- Core States ---
  const [certificates, setCertificates] = useState<any[]>([]);
  const [heroCMS, setHeroCMS] = useState<any>({
    badgeText: 'CERTIFICATIONS',
    mainHeading: 'Showcasing Professional Excellence',
    subtitle: 'Verifiable credentials, technical competencies, and professional achievements.',
    accentColor: '#a855f7',
    bgOverlayStrength: 0.5
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<string>('all'); // all, featured, regular
  const [filterPublished, setFilterPublished] = useState<string>('all'); // all, published, draft
  
  // --- Form & Editor States ---
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'visual' | 'skills' | 'verification' | 'modal' | 'display'>('basic');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Hero Editor State ---
  const [isHeroEditorOpen, setIsHeroEditorOpen] = useState(false);
  const [heroBadgeText, setHeroBadgeText] = useState('');
  const [heroMainHeading, setHeroMainHeading] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroAccentColor, setHeroAccentColor] = useState('#a855f7');
  const [heroBgOverlayStrength, setHeroBgOverlayStrength] = useState(0.5);
  const [isSavingHero, setIsSavingHero] = useState(false);

  // --- Form Fields ---
  const [formTitle, setFormTitle] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formCredentialId, setFormCredentialId] = useState('');
  const [formIssueDate, setFormIssueDate] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formNeverExpires, setFormNeverExpires] = useState(true);
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formDetailedDescription, setFormDetailedDescription] = useState('');

  // Tab 2: Visual Branding
  const [formArtwork, setFormArtwork] = useState('');
  const [formModalImage, setFormModalImage] = useState('');
  const [formAccentColor, setFormAccentColor] = useState('#a855f7');
  const [formGlowColor, setFormGlowColor] = useState('rgba(168, 85, 247, 0.15)');
  const [formThemeStyle, setFormThemeStyle] = useState('glass-dark');

  // Tab 3: Skills
  const [formSkills, setFormSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');

  // Tab 4: Verification System
  const [formVerificationEnabled, setFormVerificationEnabled] = useState(false);
  const [formVerificationUrl, setFormVerificationUrl] = useState('');
  const [formVerifiedProofBadge, setFormVerifiedProofBadge] = useState(false);
  const [formCertificatePdf, setFormCertificatePdf] = useState('');

  // Tab 5: Modal Content
  const [formModalLearningOutcomes, setFormModalLearningOutcomes] = useState('');
  const [formModalSkillDomainsHeading, setFormModalSkillDomainsHeading] = useState('Skills Mastered');
  const [formModalExtraNotes, setFormModalExtraNotes] = useState('');
  const [formModalAchievementLevel, setFormModalAchievementLevel] = useState('Intermediate');

  // Tab 6: Display Controls
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formShowInHero, setFormShowInHero] = useState(true);
  const [formEnableModal, setFormEnableModal] = useState(true);

  // Upload loading states
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadingModalImg, setUploadingModalImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Socket state
  const [socket, setSocket] = useState<any>(null);

  // Connect Socket.IO
  useEffect(() => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'khushaboo';
    const s = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
    s.emit('portfolio:join', targetSlug);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [activePortfolio, user?.portfolioSlug]);

  // Load Initial Data
  const loadData = async () => {
    setLoading(true);
    try {
      const certsRes = await api.get('/ks/certificates');
      setCertificates(certsRes.data.data.certificates || []);
      
      const heroRes = await api.get('/ks/certificates/hero');
      if (heroRes.data.data.hero) {
        setHeroCMS(heroRes.data.data.hero);
        // Sync Hero Editor state
        setHeroBadgeText(heroRes.data.data.hero.badgeText || 'CERTIFICATIONS');
        setHeroMainHeading(heroRes.data.data.hero.mainHeading || 'Showcasing Professional Excellence');
        setHeroSubtitle(heroRes.data.data.hero.subtitle || '');
        setHeroAccentColor(heroRes.data.data.hero.accentColor || '#a855f7');
        setHeroBgOverlayStrength(heroRes.data.data.hero.bgOverlayStrength ?? 0.5);
      } else {
        // Defaults
        setHeroBadgeText('CERTIFICATIONS');
        setHeroMainHeading('Showcasing Professional Excellence');
        setHeroSubtitle('Verifiable credentials, technical competencies, and professional achievements.');
        setHeroAccentColor('#a855f7');
        setHeroBgOverlayStrength(0.5);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load certificates data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const emitSocketUpdate = (updatedList: any[], updatedHero?: any) => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'khushaboo';
    if (socket) {
      socket.emit('certificates_ks:update', {
        slug: targetSlug,
        certificates: updatedList,
        hero: updatedHero || heroCMS
      });
    }
  };

  // Color generator for tags
  const getBadgeStyle = (tech: string) => {
    const hash = tech.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    ];
    return colors[hash % colors.length];
  };

  // --- CRUD Functions ---
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormIssuer('');
    setFormCredentialId('');
    setFormIssueDate('');
    setFormExpiryDate('');
    setFormNeverExpires(true);
    setFormShortDescription('');
    setFormDetailedDescription('');
    setFormArtwork('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop');
    setFormModalImage('');
    setFormAccentColor('#a855f7');
    setFormGlowColor('rgba(168, 85, 247, 0.15)');
    setFormThemeStyle('glass-dark');
    setFormSkills([]);
    setFormVerificationEnabled(false);
    setFormVerificationUrl('');
    setFormVerifiedProofBadge(false);
    setFormCertificatePdf('');
    setFormModalLearningOutcomes('');
    setFormModalSkillDomainsHeading('Skills Mastered');
    setFormModalExtraNotes('');
    setFormModalAchievementLevel('Intermediate');
    setFormFeatured(false);
    setFormPublished(true);
    setFormDisplayOrder(certificates.length + 1);
    setFormShowInHero(true);
    setFormEnableModal(true);

    setActiveTab('basic');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (cert: any) => {
    setEditingId(cert.id);
    setFormTitle(cert.title || '');
    setFormIssuer(cert.issuer || '');
    setFormCredentialId(cert.credentialId || '');
    setFormIssueDate(cert.issueDate || '');
    setFormExpiryDate(cert.expiryDate || '');
    setFormNeverExpires(cert.neverExpires ?? true);
    setFormShortDescription(cert.shortDescription || '');
    setFormDetailedDescription(cert.detailedDescription || '');
    setFormArtwork(cert.artwork || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop');
    setFormModalImage(cert.modalImage || '');
    setFormAccentColor(cert.accentColor || '#a855f7');
    setFormGlowColor(cert.glowColor || 'rgba(168, 85, 247, 0.15)');
    setFormThemeStyle(cert.themeStyle || 'glass-dark');
    setFormSkills(cert.skills || []);
    setFormVerificationEnabled(cert.verificationEnabled ?? false);
    setFormVerificationUrl(cert.verificationUrl || '');
    setFormVerifiedProofBadge(cert.verifiedProofBadge ?? false);
    setFormCertificatePdf(cert.certificatePdf || '');
    setFormModalLearningOutcomes(cert.modalLearningOutcomes || '');
    setFormModalSkillDomainsHeading(cert.modalSkillDomainsHeading || 'Skills Mastered');
    setFormModalExtraNotes(cert.modalExtraNotes || '');
    setFormModalAchievementLevel(cert.modalAchievementLevel || 'Intermediate');
    setFormFeatured(cert.featured || false);
    setFormPublished(cert.published ?? true);
    setFormDisplayOrder(cert.displayOrder ?? 0);
    setFormShowInHero(cert.showInHero ?? true);
    setFormEnableModal(cert.enableModal ?? true);

    setActiveTab('basic');
    setIsEditorOpen(true);
  };

  const handleDuplicate = async (cert: any) => {
    try {
      const duplicatedData = {
        ...cert,
        id: undefined,
        title: `${cert.title} (Copy)`,
        featured: false,
        displayOrder: certificates.length + 1,
      };
      const res = await api.post('/ks/certificates', duplicatedData);
      setSuccess('Duplicated certificate successfully.');
      loadData();
      const updated = [...certificates, res.data.data.certificate];
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to duplicate certificate.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this KS certificate?')) return;
    try {
      await api.delete(`/ks/certificates/${id}`);
      setSuccess('Certificate deleted successfully.');
      const updated = certificates.filter((c) => c.id !== id);
      setCertificates(updated);
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to delete certificate.');
    }
  };

  // Drag reordering helpers (Arrows up/down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;

    const list = [...certificates];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update display orders locally
    const updated = list.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));
    setCertificates(updated);

    try {
      // Async database saves
      await Promise.all(
        updated.map((item) =>
          api.put(`/ks/certificates/${item.id}`, { displayOrder: item.displayOrder })
        )
      );
      setSuccess('Reordered certificates.');
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to save display order updates.');
      loadData();
    }
  };

  // Handle media uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnails' | 'proofs' | 'modal-images') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (type === 'thumbnails') setUploadingArtwork(true);
    if (type === 'modal-images') setUploadingModalImg(true);
    if (type === 'proofs') setUploadingPdf(true);

    try {
      const res = await api.post(`/ks/certificates/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.data.url;

      if (type === 'thumbnails') setFormArtwork(uploadedUrl);
      if (type === 'modal-images') setFormModalImage(uploadedUrl);
      if (type === 'proofs') setFormCertificatePdf(uploadedUrl);

      setSuccess('File uploaded successfully to local storage.');
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setUploadingArtwork(false);
      setUploadingModalImg(false);
      setUploadingPdf(false);
    }
  };

  // Form Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        title: formTitle,
        issuer: formIssuer,
        credentialId: formCredentialId,
        issueDate: formIssueDate,
        expiryDate: formNeverExpires ? null : formExpiryDate,
        neverExpires: formNeverExpires,
        shortDescription: formShortDescription,
        detailedDescription: formDetailedDescription,
        artwork: formArtwork,
        modalImage: formModalImage,
        accentColor: formAccentColor,
        glowColor: formGlowColor,
        themeStyle: formThemeStyle,
        skills: formSkills,
        verificationEnabled: formVerificationEnabled,
        verificationUrl: formVerificationUrl,
        verifiedProofBadge: formVerifiedProofBadge,
        certificatePdf: formCertificatePdf,
        modalLearningOutcomes: formModalLearningOutcomes,
        modalSkillDomainsHeading: formModalSkillDomainsHeading,
        modalExtraNotes: formModalExtraNotes,
        modalAchievementLevel: formModalAchievementLevel,
        featured: formFeatured,
        published: formPublished,
        displayOrder: Number(formDisplayOrder),
        showInHero: formShowInHero,
        enableModal: formEnableModal,
      };

      let updatedList = [];
      if (editingId) {
        const res = await api.put(`/ks/certificates/${editingId}`, data);
        setSuccess('Certificate updated successfully.');
        updatedList = certificates.map((c) =>
          c.id === editingId ? res.data.data.certificate : c
        );
      } else {
        const res = await api.post('/ks/certificates', data);
        setSuccess('Certificate created successfully.');
        updatedList = [...certificates, res.data.data.certificate];
      }

      // If this was saved as featured, unset the previous featured locally to sync state
      if (formFeatured) {
        updatedList = updatedList.map((c) => ({
          ...c,
          featured: c.id === (editingId || updatedList[updatedList.length - 1].id) ? true : false
        }));
      }

      setCertificates(updatedList);
      emitSocketUpdate(updatedList);
      setIsEditorOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save certificate record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Global Hero Save
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    try {
      const data = {
        badgeText: heroBadgeText,
        mainHeading: heroMainHeading,
        subtitle: heroSubtitle,
        accentColor: heroAccentColor,
        bgOverlayStrength: Number(heroBgOverlayStrength),
      };
      const res = await api.post('/ks/certificates/hero', data);
      setHeroCMS(res.data.data.hero);
      setSuccess('Global Hero CMS saved.');
      setIsHeroEditorOpen(false);
      emitSocketUpdate(certificates, res.data.data.hero);
    } catch (err) {
      setError('Failed to save Hero CMS.');
    } finally {
      setIsSavingHero(false);
    }
  };

  // Quick feature toggle inside list
  const handleToggleFeatured = async (cert: any) => {
    const newFeatured = !cert.featured;
    try {
      const res = await api.put(`/ks/certificates/${cert.id}`, { featured: newFeatured });
      let updated = certificates.map((c) =>
        c.id === cert.id ? res.data.data.certificate : c
      );
      if (newFeatured) {
        updated = updated.map((c) => ({
          ...c,
          featured: c.id === cert.id ? true : false
        }));
      }
      setCertificates(updated);
      setSuccess(newFeatured ? 'Certificate featured!' : 'Removed featured status.');
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to update featured setting.');
    }
  };

  // Quick publish toggle inside list
  const handleTogglePublished = async (cert: any) => {
    const newPublished = !cert.published;
    try {
      const res = await api.put(`/ks/certificates/${cert.id}`, { published: newPublished });
      const updated = certificates.map((c) =>
        c.id === cert.id ? res.data.data.certificate : c
      );
      setCertificates(updated);
      setSuccess(newPublished ? 'Certificate published!' : 'Certificate set to draft.');
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to update publish status.');
    }
  };

  // Skill domains lists functions
  const addSkill = (skill: string) => {
    const cleaned = skill.trim();
    if (cleaned && !formSkills.includes(cleaned)) {
      setFormSkills([...formSkills, cleaned]);
      setSkillSearch('');
    }
  };

  const removeSkill = (index: number) => {
    setFormSkills(formSkills.filter((_, i) => i !== index));
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formSkills.length) return;
    const list = [...formSkills];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormSkills(list);
  };

  // Filter and Search logic
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFeatured =
        filterFeatured === 'all' ||
        (filterFeatured === 'featured' && c.featured) ||
        (filterFeatured === 'regular' && !c.featured);

      const matchesPublished =
        filterPublished === 'all' ||
        (filterPublished === 'published' && c.published) ||
        (filterPublished === 'draft' && !c.published);

      return matchesSearch && matchesFeatured && matchesPublished;
    });
  }, [certificates, searchQuery, filterFeatured, filterPublished]);

  // Skill Suggestions Filter
  const filteredSuggestions = useMemo(() => {
    if (!skillSearch) return [];
    return PRESET_SKILLS.filter(
      (s) =>
        s.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !formSkills.includes(s)
    );
  }, [skillSearch, formSkills]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card/40 border border-border/40 p-3.5 sm:p-4 mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-[10px] tracking-wider uppercase mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>KS Portfolio Hub</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">Certificates Studio</h1>
          <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5">
            Manage premium credentials, achievement flows, and timeline.
          </p>
        </div>
        
        <div className="w-full h-px bg-border/20 sm:hidden my-0.5" />
        
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsHeroEditorOpen(!isHeroEditorOpen)}
            className="w-full sm:w-auto justify-center px-4 py-2 border border-border/50 hover:bg-muted/40 text-foreground text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <Laptop className="w-4 h-4 text-muted-foreground" />
            <span>HERO CMS</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-2 animate-pulse border-none"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* GLOBAL HERO CMS BLOCK */}
      {isHeroEditorOpen && (
        <form onSubmit={handleSaveHero} className="bg-card/50 border border-border/40 p-6 rounded-3xl backdrop-blur-xl animate-slide-up space-y-4 max-w-3xl">
          <div className="flex justify-between items-center pb-2 border-b border-border/20">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Edit Global Certificates Hero CMS</span>
            </h3>
            <button type="button" onClick={() => setIsHeroEditorOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Badge Text</label>
              <input
                type="text"
                value={heroBadgeText}
                onChange={(e) => setHeroBadgeText(e.target.value)}
                placeholder="CERTIFICATIONS"
                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Accent Underline Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={heroAccentColor}
                  onChange={(e) => setHeroAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={heroAccentColor}
                  onChange={(e) => setHeroAccentColor(e.target.value)}
                  className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Cinematic Main Heading</label>
              <input
                type="text"
                value={heroMainHeading}
                onChange={(e) => setHeroMainHeading(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Subtitle</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={2}
                className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-muted-foreground">Background Overlay Strength: {heroBgOverlayStrength}</label>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={heroBgOverlayStrength}
                onChange={(e) => setHeroBgOverlayStrength(parseFloat(e.target.value))}
                className="w-full accent-primary bg-background rounded-lg cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsHeroEditorOpen(false)}
              className="px-3.5 py-2 hover:bg-muted text-foreground text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingHero}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingHero ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* SPLIT LIVE WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {/* LEFT COMPONENT: CATALOG OR FORM EDITOR */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {isEditorOpen ? (
            /* PAGE 2 — CREATE/EDIT CERTIFICATE FORM */
            <form onSubmit={handleSave} className="bg-card/50 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl animate-fade-in relative">
              <div className="flex justify-between items-start border-b border-border/20 pb-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span>{editingId ? 'Edit Certificate Record' : 'Create New Certificate'}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Segmented properties builder</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingId(null);
                  }}
                  className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex overflow-x-auto gap-1 border-b border-border/10 pb-2 mb-6 scrollbar-hide">
                {[
                  { id: 'basic', label: 'Basic Info', icon: Info },
                  { id: 'visual', label: 'Visual Branding', icon: Palette },
                  { id: 'skills', label: 'Skill Domains', icon: Layers },
                  { id: 'verification', label: 'Verification', icon: Shield },
                  { id: 'modal', label: 'Modal Content', icon: GraduationCap },
                  { id: 'display', label: 'Display Controls', icon: Sliders }
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                        isActive
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate Title *</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Prompt Engineering Expert"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Issuing Organization *</label>
                      <input
                        type="text"
                        required
                        value={formIssuer}
                        onChange={(e) => setFormIssuer(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                        placeholder="e.g. DeepLearning.AI"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Credential ID</label>
                      <input
                        type="text"
                        value={formCredentialId}
                        onChange={(e) => setFormCredentialId(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                        placeholder="e.g. DL-98319X"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Issue Date *</label>
                      <input
                        type="text"
                        required
                        value={formIssueDate}
                        onChange={(e) => setFormIssueDate(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                        placeholder="e.g. May 2026"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-muted/20 p-4 rounded-2xl border border-border/10">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formNeverExpires}
                            onChange={(e) => setFormNeverExpires(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-xs font-medium text-foreground">Credential never expires</span>
                        </label>
                      </div>
                      {!formNeverExpires && (
                        <div className="animate-fade-in">
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={formExpiryDate}
                            onChange={(e) => setFormExpiryDate(e.target.value)}
                            className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                            placeholder="e.g. May 2029"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Short Description (Card layout)</label>
                    <textarea
                      value={formShortDescription}
                      onChange={(e) => setFormShortDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                      placeholder="Brief teaser for the main listing card..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Detailed Description (Modal layout)</label>
                    <textarea
                      value={formDetailedDescription}
                      onChange={(e) => setFormDetailedDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground font-mono"
                      placeholder="Detailed markdown / summary description of the coursework and key parameters..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: VISUAL BRANDING */}
              {activeTab === 'visual' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Artwork Upload */}
                    <div className="border border-border/40 p-4 rounded-2xl bg-muted/10 space-y-2">
                      <label className="block text-xs font-bold text-foreground">Certificate Showcase Artwork</label>
                      <p className="text-[10px] text-muted-foreground">Appears as card background. Absolute URL or upload below.</p>
                      <input
                        type="text"
                        value={formArtwork}
                        onChange={(e) => setFormArtwork(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{uploadingArtwork ? 'Uploading...' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'thumbnails')}
                            className="hidden"
                          />
                        </label>
                        {formArtwork && (
                          <img src={formArtwork} alt="artwork preview" className="w-10 h-10 object-cover rounded-lg border border-border/30" />
                        )}
                      </div>
                    </div>

                    {/* Modal Image Upload */}
                    <div className="border border-border/40 p-4 rounded-2xl bg-muted/10 space-y-2">
                      <label className="block text-xs font-bold text-foreground">Expanded Modal Preview Image</label>
                      <p className="text-[10px] text-muted-foreground">High resolution image shown in the popup dialog.</p>
                      <input
                        type="text"
                        value={formModalImage}
                        onChange={(e) => setFormModalImage(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{uploadingModalImg ? 'Uploading...' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'modal-images')}
                            className="hidden"
                          />
                        </label>
                        {formModalImage && (
                          <img src={formModalImage} alt="modal preview" className="w-10 h-10 object-cover rounded-lg border border-border/30" />
                        )}
                      </div>
                    </div>

                    {/* Theme Accent Color */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Brand Accent Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formAccentColor}
                          onChange={(e) => setFormAccentColor(e.target.value)}
                          className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formAccentColor}
                          onChange={(e) => setFormAccentColor(e.target.value)}
                          className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                        />
                      </div>
                    </div>

                    {/* Glow Color */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Card Glow Color</label>
                      <input
                        type="text"
                        value={formGlowColor}
                        onChange={(e) => setFormGlowColor(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                        placeholder="rgba(168, 85, 247, 0.15)"
                      />
                    </div>

                    {/* Theme Style Option */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Theme Style Preset</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {THEME_STYLES.map((ts) => (
                          <button
                            key={ts.id}
                            type="button"
                            onClick={() => setFormThemeStyle(ts.id)}
                            className={`p-3 border text-xs font-semibold rounded-xl text-center transition cursor-pointer flex flex-col justify-between h-20 ${
                              formThemeStyle === ts.id
                                ? 'border-primary bg-primary/10 shadow-lg text-primary'
                                : 'border-border/40 bg-background text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span className="block truncate w-full text-[10px]">{ts.label}</span>
                            <div className="flex gap-1 justify-center mt-2">
                              <span className={`w-3.5 h-3.5 rounded-full ${
                                ts.id === 'gold' ? 'bg-amber-500' :
                                ts.id === 'cyan' ? 'bg-cyan-400' :
                                ts.id === 'violet' ? 'bg-fuchsia-500' :
                                ts.id === 'neon' ? 'bg-purple-500' : 'bg-zinc-600'
                              }`}></span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SKILL DOMAINS REPEATER */}
              {activeTab === 'skills' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-muted/10 p-4 border border-border/30 rounded-2xl">
                    <label className="block text-xs font-bold text-foreground mb-1">Add Skill Tags</label>
                    <p className="text-[10px] text-muted-foreground mb-3">Press Enter or click a suggestion below to add chips.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(skillSearch);
                          }
                        }}
                        placeholder="Search or type a new tag..."
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(skillSearch)}
                        className="px-3.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-xl hover:bg-secondary/80 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {/* Preset Suggest Pool */}
                    {filteredSuggestions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 p-2 bg-background/50 rounded-xl border border-border/20">
                        {filteredSuggestions.slice(0, 8).map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => addSkill(preset)}
                            className="px-2 py-0.5 bg-muted/60 text-foreground hover:bg-primary hover:text-white rounded text-[10px] cursor-pointer transition"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Skill Chips with Reordering */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Active Skill Domains ({formSkills.length}):</span>
                    {formSkills.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground text-xs bg-muted/5 border border-dashed border-border/30 rounded-2xl">
                        No skill domains added yet.
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                        {formSkills.map((skill, index) => (
                          <div
                            key={skill}
                            className="flex items-center justify-between p-2 bg-card border border-border/30 rounded-xl text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getBadgeStyle(skill)}`}>
                                {skill}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveSkill(index, 'up')}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === formSkills.length - 1}
                                onClick={() => moveSkill(index, 'down')}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer rounded ml-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: VERIFICATION SYSTEM */}
              {activeTab === 'verification' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex items-center justify-between bg-muted/20 p-4 border border-border/10 rounded-2xl">
                      <div>
                        <label className="block text-xs font-bold text-foreground">Enable Verification</label>
                        <p className="text-[10px] text-muted-foreground">Expose external links and verification credentials badge.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formVerificationEnabled}
                          onChange={(e) => setFormVerificationEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {formVerificationEnabled && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Verification Authority URL</label>
                          <input
                            type="url"
                            value={formVerificationUrl}
                            onChange={(e) => setFormVerificationUrl(e.target.value)}
                            className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                            placeholder="https://coursera.org/verify/..."
                          />
                        </div>

                        <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                          <div>
                            <span className="block text-xs font-semibold text-foreground">Verified Badge Indicator</span>
                            <span className="block text-[10px] text-muted-foreground">Show official checkmark icon on the card</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formVerifiedProofBadge}
                            onChange={(e) => setFormVerifiedProofBadge(e.target.checked)}
                            className="rounded border-border text-primary"
                          />
                        </div>

                        {/* Certificate PDF Upload */}
                        <div className="border border-border/40 p-4 rounded-xl bg-muted/10 space-y-2">
                          <label className="block text-xs font-bold text-foreground">Certificate PDF Proof</label>
                          <p className="text-[10px] text-muted-foreground">Host local PDF file on target server uploads.</p>
                          <input
                            type="text"
                            value={formCertificatePdf}
                            onChange={(e) => setFormCertificatePdf(e.target.value)}
                            className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                          />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg cursor-pointer">
                              <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileUpload(e, 'proofs')}
                                className="hidden"
                              />
                            </label>
                            {formCertificatePdf && (
                              <a href={formCertificatePdf} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                                <FileText className="w-3 h-3" />
                                <span>View PDF</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: MODAL CONTENT */}
              {activeTab === 'modal' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Skills Domains Section Heading</label>
                      <input
                        type="text"
                        value={formModalSkillDomainsHeading}
                        onChange={(e) => setFormModalSkillDomainsHeading(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                        placeholder="Skills Mastered"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Achievement Difficulty Level</label>
                      <select
                        value={formModalAchievementLevel}
                        onChange={(e) => setFormModalAchievementLevel(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                      >
                        <option value="Beginner">Beginner Milestone</option>
                        <option value="Intermediate">Intermediate Professional</option>
                        <option value="Advanced">Advanced Mastery</option>
                        <option value="Expert">Expert / Legendary</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Key Learning Outcomes (HTML / Bullet List)</label>
                    <textarea
                      value={formModalLearningOutcomes}
                      onChange={(e) => setFormModalLearningOutcomes(e.target.value)}
                      rows={4}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground font-mono"
                      placeholder="<li>Outcome 1</li><li>Outcome 2</li>..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Extra Notes / Syllabus Detail</label>
                    <textarea
                      value={formModalExtraNotes}
                      onChange={(e) => setFormModalExtraNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                      placeholder="Detailed topics covered, dates, exam scores, syllabus outlines..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: DISPLAY CONTROLS */}
              {activeTab === 'display' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Featured Certificate */}
                    <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Featured Cinematic Showcase</span>
                        <span className="block text-[10px] text-muted-foreground">Places card prominently at the top of layout</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="rounded border-border text-primary"
                      />
                    </div>

                    {/* Published status */}
                    <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Published Status</span>
                        <span className="block text-[10px] text-muted-foreground">Visible on active frontend website</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formPublished}
                        onChange={(e) => setFormPublished(e.target.checked)}
                        className="rounded border-border text-primary"
                      />
                    </div>

                    {/* Show in Hero */}
                    <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Show in Hero Timeline</span>
                        <span className="block text-[10px] text-muted-foreground">Sync timeline tracker flows</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formShowInHero}
                        onChange={(e) => setFormShowInHero(e.target.checked)}
                        className="rounded border-border text-primary"
                      />
                    </div>

                    {/* Enable Detail Modal */}
                    <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Enable Detail Modal Popup</span>
                        <span className="block text-[10px] text-muted-foreground">Clicking cards triggers detail modal overlay</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formEnableModal}
                        onChange={(e) => setFormEnableModal(e.target.checked)}
                        className="rounded border-border text-primary"
                      />
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Timeline Sorting Display Order</label>
                      <input
                        type="number"
                        value={formDisplayOrder}
                        onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE / CANCEL BUTTONS */}
              <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 hover:bg-muted text-foreground text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Record...' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* PAGE 1 — CATALOG DASHBOARD LIST */
            <div className="space-y-4">
              {/* FILTERS & SEARCH ROW */}
              <div className="flex flex-col md:flex-row gap-3 bg-card/40 border border-border/40 p-4 rounded-2xl backdrop-blur-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search certificates, organizations, skills..."
                    className="w-full bg-background/50 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterFeatured}
                    onChange={(e) => setFilterFeatured(e.target.value)}
                    className="bg-background border border-border/50 rounded-xl px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Showcase</option>
                    <option value="featured">Featured Only</option>
                    <option value="regular">Regular Only</option>
                  </select>
                  <select
                    value={filterPublished}
                    onChange={(e) => setFilterPublished(e.target.value)}
                    className="bg-background border border-border/50 rounded-xl px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>
              </div>

              {/* LISTING CARDS */}
              {loading ? (
                <div className="text-center py-20 text-muted-foreground text-sm bg-card/30 rounded-3xl border border-border/30">
                  <Sparkles className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                  <span>Loading certificates database...</span>
                </div>
              ) : filteredCertificates.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm bg-card/30 rounded-3xl border border-border/30 border-dashed">
                  <Award className="w-8 h-8 mx-auto text-muted-foreground/45 mb-2" />
                  <span>No certificates matching criteria found.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCertificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="p-4 bg-card/50 border border-border/40 hover:border-primary/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 backdrop-blur-md relative overflow-hidden group shadow-sm"
                    >
                      {/* Glow Backing */}
                      <div
                        className="absolute -inset-0.5 opacity-0 group-hover:opacity-10 transition duration-300 blur-xl pointer-events-none -z-10"
                        style={{ background: cert.accentColor || '#a855f7' }}
                      ></div>

                      <div className="flex items-center gap-4">
                        <img
                          src={cert.artwork || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop'}
                          alt={cert.title}
                          className="w-16 h-12 object-cover rounded-lg border border-border/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-foreground">{cert.title}</span>
                            {cert.featured && (
                              <span className="bg-primary/20 text-primary border border-primary/25 rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground block">{cert.issuer} • {cert.issueDate}</span>
                          
                          {/* Skills chips */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {cert.skills.slice(0, 3).map((s: string) => (
                              <span key={s} className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-muted text-muted-foreground border border-border/10">
                                {s}
                              </span>
                            ))}
                            {cert.skills.length > 3 && (
                              <span className="text-[8px] text-muted-foreground px-1 py-0.5">+{cert.skills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS ROW */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Quick Switch controls */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(cert)}
                          className={`p-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                            cert.featured
                              ? 'bg-primary/15 text-primary border-primary/30'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border/40'
                          }`}
                          title="Toggle Featured"
                        >
                          Star
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(cert)}
                          className={`p-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                            cert.published
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border/40'
                          }`}
                          title="Toggle Published"
                        >
                          {cert.published ? 'Live' : 'Draft'}
                        </button>

                        <div className="h-6 w-px bg-border/20 mx-1"></div>

                        {/* Reordering display order buttons */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleReorder(index, 'up')}
                          className="p-1.5 bg-background border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === filteredCertificates.length - 1}
                          onClick={() => handleReorder(index, 'down')}
                          className="p-1.5 bg-background border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit commands */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cert)}
                          className="p-1.5 bg-background border border-border/40 hover:border-primary/40 hover:text-primary rounded-lg text-muted-foreground cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(cert)}
                          className="p-1.5 bg-background border border-border/40 hover:bg-muted text-muted-foreground rounded-lg cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cert.id)}
                          className="p-1.5 bg-background border border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-lg text-muted-foreground cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: LIVE PORTFOLIO RENDER PREVIEW */}
        <div className="hidden xl:block xl:col-span-1 space-y-4">
          <div className="sticky top-[120px] space-y-4">
            
            {/* Live Certificate Preview Header */}
            <div className="flex justify-between items-center bg-card/40 border border-border/40 px-4 py-3 rounded-2xl backdrop-blur-xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-primary" />
                <span>Cinematic Preview Frame</span>
              </span>
              {isEditorOpen && (
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(!previewModalOpen)}
                  className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-lg text-[10px] font-bold hover:bg-secondary/80 cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>{previewModalOpen ? 'Show Card' : 'Preview Modal'}</span>
                </button>
              )}
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="relative min-h-[360px] p-4 bg-zinc-950/90 border border-border/30 rounded-3xl flex items-center justify-center overflow-hidden">
              
              {/* Starry Grid Backdrop mock */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] -z-10"></div>
              
              {previewModalOpen && isEditorOpen ? (
                /* MODAL OVERLAY PREVIEW */
                <div className="w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3 relative text-left select-none animate-scale-up">
                  <div className="absolute top-2 right-2 text-white/50">
                    <X className="w-4 h-4" />
                  </div>
                  <img
                    src={formModalImage || formArtwork || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop'}
                    alt="Modal Artwork"
                    className="w-full h-32 object-cover rounded-lg border border-white/5"
                  />
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/40 tracking-wider uppercase block">{formIssuer || 'ISSUING ORGANIZATION'}</span>
                    <h4 className="text-sm font-bold text-white leading-tight">{formTitle || 'Certificate Title'}</h4>
                    <span className="text-[10px] text-white/60 block">Issued: {formIssueDate || 'Date'} • Credential ID: {formCredentialId || 'N/A'}</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  
                  {/* Detailed Description */}
                  <div className="text-[10px] text-white/70 space-y-1.5 max-h-36 overflow-y-auto font-sans leading-relaxed">
                    <p>{formDetailedDescription || formShortDescription || 'Detailed certificate syllabus notes...'}</p>
                  </div>

                  {/* Learning Outcomes Bullet Points */}
                  {formModalLearningOutcomes && (
                    <div className="space-y-1 bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="block text-[9px] font-bold text-white/50 uppercase">Key Deliverables</span>
                      <ul
                        className="text-[9px] text-white/80 list-disc list-inside space-y-0.5"
                        dangerouslySetInnerHTML={{ __html: formModalLearningOutcomes }}
                      ></ul>
                    </div>
                  )}

                  {/* Skills mastered */}
                  {formSkills.length > 0 && (
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-white/50 uppercase">{formModalSkillDomainsHeading || 'Skills Mastered'}</span>
                      <div className="flex flex-wrap gap-1">
                        {formSkills.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-white/5 text-white/80 rounded text-[8px] border border-white/5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification proofs */}
                  {formVerificationEnabled && (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-bold text-primary">Verifiable Credential Verified</span>
                      </div>
                      {formVerificationUrl && (
                        <a href={formVerificationUrl} target="_blank" rel="noreferrer" className="text-[9px] text-primary flex items-center gap-0.5 hover:underline">
                          <span>Verify</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* CARD PREVIEW */
                <div
                  className={`w-64 p-4 border rounded-2xl relative overflow-hidden transition-all duration-500 text-left select-none ${
                    formThemeStyle === 'neon' ? 'bg-zinc-950 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]' :
                    formThemeStyle === 'gold' ? 'bg-stone-950 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' :
                    formThemeStyle === 'cyan' ? 'bg-slate-950 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]' :
                    formThemeStyle === 'violet' ? 'bg-neutral-950 border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)]' :
                    'bg-black/40 border-white/10 backdrop-blur-md shadow-2xl' // glass-dark
                  }`}
                  style={{
                    boxShadow: formGlowColor ? `0 0 25px ${formGlowColor}` : undefined
                  }}
                >
                  {/* Glowing background circles for visuals */}
                  <div
                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20"
                    style={{ background: formAccentColor || '#a855f7' }}
                  ></div>

                  {/* Artwork Thumbnail */}
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-white/5 mb-3">
                    <img
                      src={isEditorOpen ? (formArtwork || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop') : 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop'}
                      alt="artwork placeholder"
                      className="w-full h-full object-cover"
                    />
                    {isEditorOpen && formVerifiedProofBadge && formVerificationEnabled && (
                      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur border border-white/10 p-1 rounded-full text-primary" title="Verified Badge">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Issuer and Date */}
                  <div className="flex justify-between items-start text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    <span className="truncate w-3/4">{isEditorOpen ? (formIssuer || 'Issuer Organization') : 'Issuer Corp'}</span>
                    <span className="shrink-0">{isEditorOpen ? (formIssueDate || 'Date') : 'May 2026'}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xs font-black tracking-tight mb-2 line-clamp-1"
                    style={{ color: formAccentColor || '#ffffff' }}
                  >
                    {isEditorOpen ? (formTitle || 'Certificate Title') : 'Select certificate to preview'}
                  </h3>

                  {/* Short Description */}
                  <p className="text-[10px] text-muted-foreground/80 line-clamp-2 leading-relaxed mb-3">
                    {isEditorOpen ? (formShortDescription || 'Teaser description of credential outcomes...') : 'Select or create a certificate on the left panel to review layout.'}
                  </p>

                  {/* Skill Chips */}
                  {isEditorOpen && formSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formSkills.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-white/5 border border-white/10 text-white/70">
                          {s}
                        </span>
                      ))}
                      {formSkills.length > 3 && (
                        <span className="text-[7px] text-muted-foreground">+ {formSkills.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* CTA button */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-auto">
                    <span className="text-[7px] text-muted-foreground uppercase font-mono tracking-wider">
                      {isEditorOpen ? (formCredentialId || 'Credential ID') : 'VERIFIABLE'}
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[8px] font-black uppercase rounded tracking-wider flex items-center gap-0.5 text-white/90 border border-white/10 hover:bg-white/5"
                    >
                      <span>Show Details</span>
                      <ChevronRight className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Layout Notice Card */}
            <div className="bg-card/30 border border-border/30 p-4 rounded-2xl backdrop-blur-md flex gap-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-foreground mb-0.5">Live Sync active</span>
                Any modifications made here are updated instantly on the KS front-end using WebSocket sync events.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
