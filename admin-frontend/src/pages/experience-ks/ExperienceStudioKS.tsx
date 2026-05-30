import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Sparkles, Layers, Sliders, Palette, Save, 
  Trash2, Eye, EyeOff, Edit3, Plus, ArrowUp, ArrowDown, 
  Copy, Image as ImageIcon, Briefcase, AlertTriangle, 
  Check, Calendar, MapPin, ExternalLink, HelpCircle, 
  Search, Filter, Laptop, Grid, Globe, FileText, ChevronRight, MoreVertical, X
} from 'lucide-react';

const PRESET_TAGS = [
  'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 
  'Express', 'Prisma', 'PostgreSQL', 'GraphQL', 'Docker', 
  'AWS', 'Python', 'Flask', 'FastAPI', 'MongoDB', 'Redis', 
  'Socket.io', 'Three.js', 'GSAP', 'Framer Motion', 'WebSockets',
  'Three.js / R3F', 'Material UI', 'Redux Toolkit', 'Zustand'
];

const EMPLOYMENT_TYPES = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'
];

const THEME_VARIANTS = [
  { id: 'dark', label: 'Cinematic Matte Dark' },
  { id: 'neon', label: 'Cyberpunk Neon Glow' },
  { id: 'glass', label: 'Frosted Glassmorphism' }
];

export default function ExperienceStudioKS() {
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);
  const user = useStore((state) => state.user);

  // --- Core States ---
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<string>('all'); // all, featured, regular
  const [filterPublished, setFilterPublished] = useState<string>('all'); // all, published, draft
  const [showTimelinePreview, setShowTimelinePreview] = useState(true);
  const [activeMobileMenuExp, setActiveMobileMenuExp] = useState<{ exp: any; index: number } | null>(null);

  // --- Form & Editor Mode ---
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'branding' | 'tech' | 'metrics' | 'cta' | 'timeline'>('basic');

  // --- Form Fields ---
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formEmploymentType, setFormEmploymentType] = useState('Internship');
  const [formLocation, setFormLocation] = useState('');
  const [formWorkMode, setFormWorkMode] = useState('Remote'); // Remote, Hybrid, On-site
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formCurrentWorking, setFormCurrentWorking] = useState(false);
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Tab 2 Branding
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formBackgroundImage, setFormBackgroundImage] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formAccentColor, setFormAccentColor] = useState('#ec4899');
  const [formThemeVariant, setFormThemeVariant] = useState('glass');

  // Tab 3 Tech
  const [formTechStack, setFormTechStack] = useState<string[]>([]);
  const [techSearch, setTechSearch] = useState('');

  // Tab 4 Metrics
  const [formMetrics, setFormMetrics] = useState<{ label: string; value: string }[]>([]);
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');

  // Tab 5 CTA
  const [formButtonText, setFormButtonText] = useState('');
  const [formButtonUrl, setFormButtonUrl] = useState('');
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(true);

  // Tab 6 Timeline
  const [formTimelineVisible, setFormTimelineVisible] = useState(true);
  const [formTimelineOrder, setFormTimelineOrder] = useState(0);
  const [formTimelineHighlight, setFormTimelineHighlight] = useState(false);
  const [formTimelineDotColor, setFormTimelineDotColor] = useState('#ec4899');

  // Meta
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);

  // Uploader loading states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Socket
  const [socket, setSocket] = useState<any>(null);

  // Connect Socket
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

  // Load Experiences
  const loadExperiences = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ks/experience');
      setExperiences(res.data.data.experiences || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load KS experience records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  // Sync to frontend real-time
  const emitSocketUpdate = (updatedList: any[]) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('experience_ks:update', {
        slug: user.portfolioSlug,
        experiences: updatedList
      });
    }
  };

  // Color tag auto-generation helper
  const getBadgeStyle = (tech: string) => {
    const hash = tech.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    ];
    return colors[hash % colors.length];
  };

  // --- CRUD Functions ---
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormCompany('');
    setFormRole('');
    setFormEmploymentType('Internship');
    setFormLocation('');
    setFormWorkMode('Remote');
    setFormStartDate('');
    setFormEndDate('');
    setFormCurrentWorking(false);
    setFormTagline('');
    setFormDescription('');
    setFormCoverImage('https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop');
    setFormBackgroundImage('');
    setFormLogo('');
    setFormAccentColor('#ec4899');
    setFormThemeVariant('glass');
    setFormTechStack([]);
    setFormMetrics([]);
    setFormButtonText('');
    setFormButtonUrl('');
    setFormOpenInNewTab(true);
    setFormTimelineVisible(true);
    setFormTimelineOrder(experiences.length + 1);
    setFormTimelineHighlight(false);
    setFormTimelineDotColor('#ec4899');
    setFormFeatured(false);
    setFormPublished(true);
    
    setActiveTab('basic');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormCompany(exp.companyName || '');
    setFormRole(exp.roleTitle || '');
    setFormEmploymentType(exp.employmentType || 'Internship');
    setFormLocation(exp.location || '');
    setFormWorkMode(exp.workMode || 'Remote');
    setFormStartDate(exp.startDate || '');
    setFormEndDate(exp.endDate || '');
    setFormCurrentWorking(exp.currentWorking || false);
    setFormTagline(exp.tagline || '');
    setFormDescription(exp.description || '');
    setFormCoverImage(exp.coverImage || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop');
    setFormBackgroundImage(exp.backgroundImage || '');
    setFormLogo(exp.logo || '');
    setFormAccentColor(exp.accentColor || '#ec4899');
    setFormThemeVariant(exp.themeVariant || 'glass');
    setFormTechStack(exp.techStack || []);
    setFormMetrics(exp.metrics || []);
    setFormButtonText(exp.buttonText || '');
    setFormButtonUrl(exp.buttonUrl || '');
    setFormOpenInNewTab(exp.openInNewTab ?? true);
    setFormTimelineVisible(exp.timelineVisible ?? true);
    setFormTimelineOrder(exp.timelineOrder ?? 1);
    setFormTimelineHighlight(exp.timelineHighlight || false);
    setFormTimelineDotColor(exp.timelineDotColor || exp.accentColor || '#ec4899');
    setFormFeatured(exp.featured || false);
    setFormPublished(exp.published ?? true);

    setActiveTab('basic');
    setIsEditorOpen(true);
  };

  // Duplicate entry locally
  const handleDuplicate = async (exp: any) => {
    try {
      const duplicatedData = {
        ...exp,
        id: undefined,
        companyName: `${exp.companyName} (Copy)`,
        featured: false,
        timelineOrder: experiences.length + 1,
      };
      const res = await api.post('/ks/experience', duplicatedData);
      setSuccess('Duplicated entry successfully.');
      loadExperiences();
      // Emit socket update
      const updated = [...experiences, res.data.data.experience];
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to duplicate experience.');
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this KS experience entry?')) return;
    try {
      await api.delete(`/ks/experience/${id}`);
      setSuccess('Experience entry deleted.');
      const updated = experiences.filter(e => e.id !== id);
      setExperiences(updated);
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to delete experience.');
    }
  };

  // Reordering handler
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === experiences.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...experiences];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Rescale order indexes
    const updated = reordered.map((item, idx) => ({
      ...item,
      timelineOrder: idx + 1
    }));

    setExperiences(updated);

    try {
      // Save changes back to DB
      await Promise.all(
        updated.map(item => api.put(`/ks/experience/${item.id}`, { timelineOrder: item.timelineOrder }))
      );
      setSuccess('Timeline sequence reordered.');
      emitSocketUpdate(updated);
    } catch (err) {
      setError('Failed to save updated reorder queue.');
    }
  };

  // Toggle quick controls
  const handleTogglePublish = async (exp: any) => {
    const nextVal = !exp.published;
    try {
      const res = await api.put(`/ks/experience/${exp.id}`, { published: nextVal });
      const updated = experiences.map(e => e.id === exp.id ? res.data.data.experience : e);
      setExperiences(updated);
      emitSocketUpdate(updated);
      setSuccess(nextVal ? 'Published to live portfolio!' : 'Reverted entry to draft.');
    } catch (err) {
      setError('Failed to update published state.');
    }
  };

  const handleToggleFeatured = async (exp: any) => {
    const nextVal = !exp.featured;
    try {
      const res = await api.put(`/ks/experience/${exp.id}`, { featured: nextVal });
      // Reload since featured toggles might have turned off another entry
      loadExperiences();
      setSuccess(nextVal ? 'Pinned experience as Featured!' : 'Unfeatured experience.');
    } catch (err) {
      setError('Failed to update featured state.');
    }
  };

  // File Upload Handlers
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'bg' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cover') setUploadingCover(true);
    if (type === 'bg') setUploadingBg(true);
    if (type === 'logo') setUploadingLogo(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/ks/experience/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const relativeUrl = res.data.data.imageUrl;
      // Absolute path for live server
      const fullUrl = `http://localhost:5000${relativeUrl}`;

      if (type === 'cover') setFormCoverImage(fullUrl);
      if (type === 'bg') setFormBackgroundImage(fullUrl);
      if (type === 'logo') setFormLogo(fullUrl);

      setSuccess('Media uploaded to tenant-wise directory!');
    } catch (err) {
      setError('Failed to upload media locally.');
    } finally {
      if (type === 'cover') setUploadingCover(false);
      if (type === 'bg') setUploadingBg(false);
      if (type === 'logo') setUploadingLogo(false);
    }
  };

  // Form Submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCompany.trim() || !formRole.trim()) {
      setError('Company Name and Role Title are required.');
      return;
    }

    const payload = {
      companyName: formCompany,
      roleTitle: formRole,
      employmentType: formEmploymentType,
      location: formLocation,
      workMode: formWorkMode,
      startDate: formStartDate,
      endDate: formEndDate,
      currentWorking: formCurrentWorking,
      tagline: formTagline,
      description: formDescription,
      coverImage: formCoverImage,
      backgroundImage: formBackgroundImage,
      logo: formLogo,
      accentColor: formAccentColor,
      themeVariant: formThemeVariant,
      techStack: formTechStack,
      metrics: formMetrics,
      buttonText: formButtonText,
      buttonUrl: formButtonUrl,
      openInNewTab: formOpenInNewTab,
      timelineVisible: formTimelineVisible,
      timelineOrder: Number(formTimelineOrder),
      timelineHighlight: formTimelineHighlight,
      timelineDotColor: formTimelineDotColor || formAccentColor,
      featured: formFeatured,
      published: formPublished,
    };

    try {
      if (editingId) {
        const res = await api.put(`/ks/experience/${editingId}`, payload);
        setSuccess('Experience entry updated.');
        setIsEditorOpen(false);
        loadExperiences();
      } else {
        const res = await api.post('/ks/experience', payload);
        setSuccess('New experience entry created.');
        setIsEditorOpen(false);
        loadExperiences();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save experience entry.');
    }
  };

  // Tech stack tags
  const addTechTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formTechStack.includes(trimmed)) {
      setFormTechStack([...formTechStack, trimmed]);
      setTechSearch('');
    }
  };

  const removeTechTag = (tag: string) => {
    setFormTechStack(formTechStack.filter(t => t !== tag));
  };

  // Metrics
  const addMetricCard = () => {
    if (!newMetricLabel.trim() || !newMetricValue.trim()) return;
    if (formMetrics.length >= 4) {
      setError('Maximum of 4 metrics cards allowed.');
      return;
    }
    setFormMetrics([...formMetrics, { label: newMetricLabel.trim(), value: newMetricValue.trim() }]);
    setNewMetricLabel('');
    setNewMetricValue('');
  };

  const removeMetricCard = (idx: number) => {
    setFormMetrics(formMetrics.filter((_, i) => i !== idx));
  };

  // Live preview matching styling
  const previewAccentStyle = {
    color: formAccentColor,
  };

  // Filtered entries
  const processedList = useMemo(() => {
    return experiences
      .filter((exp) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          exp.companyName.toLowerCase().includes(query) || 
          exp.roleTitle.toLowerCase().includes(query) || 
          (exp.techStack || []).some((t: string) => t.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        if (filterFeatured === 'featured' && !exp.featured) return false;
        if (filterFeatured === 'regular' && exp.featured) return false;

        if (filterPublished === 'published' && !exp.published) return false;
        if (filterPublished === 'draft' && exp.published) return false;

        return true;
      })
      .sort((a, b) => (a.timelineOrder || 0) - (b.timelineOrder || 0));
  }, [experiences, searchQuery, filterFeatured, filterPublished]);

  // Handle Duplicates
  const handleDuplicateClick = (e: React.MouseEvent, exp: any) => {
    e.stopPropagation();
    handleDuplicate(exp);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pr-2 pb-6 text-left">
      <style>{`
        .custom-range-slider::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          height: 6px;
        }
        .custom-range-slider::-webkit-slider-thumb {
          background: #ec4899;
          border-radius: 9999px;
          width: 16px;
          height: 16px;
          margin-top: -5px;
          cursor: pointer;
        }
      `}</style>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-[#0b0b0c]/80 border border-white/5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 mb-4 sm:mb-6 relative backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/10 shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest leading-none">Experience Studio (KS)</h1>
            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-pink-400 uppercase tracking-widest mt-1 block">Isolated Tenant Workspaces // V2 chronologies</span>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800/40 sm:hidden my-0.5" />

        <div className="w-full sm:w-auto">
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-pink-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {!isEditorOpen ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Filters card */}
          <div className="bg-[#0b0b0c]/40 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search experiences by company, role, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#121214] border border-white/5 px-3 py-1.5 rounded-xl">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer border-none"
                >
                  <option value="all">All Features</option>
                  <option value="featured">Featured Only</option>
                  <option value="regular">Standard Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#121214] border border-white/5 px-3 py-1.5 rounded-xl">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={filterPublished}
                  onChange={(e) => setFilterPublished(e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer border-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>

              <button
                onClick={() => setShowTimelinePreview(prev => !prev)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  showTimelinePreview 
                    ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-md shadow-pink-500/5' 
                    : 'bg-transparent text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                Timeline Preview
              </button>
            </div>
          </div>

          {/* List View */}
          <div className="grid grid-cols-1 gap-4">
            {processedList.length === 0 ? (
              <div className="py-20 text-center bg-[#0b0b0c]/40 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-4">
                <Briefcase className="w-10 h-10 text-zinc-600 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No professional records registered</h3>
                <p className="text-xs text-zinc-500 max-w-sm">No KS experiences found matching current filters. Click "Add Experience" to compose a new showcase node.</p>
              </div>
            ) : (
              processedList.map((exp, index) => (
                <div
                  key={exp.id}
                  onClick={() => handleOpenEdit(exp)}
                  className="bg-[#0b0b0c]/60 border border-white/5 hover:border-pink-500/25 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 group cursor-pointer relative"
                >
                  {/* Left branding */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#121214] border border-white/5 flex items-center justify-center shadow shrink-0">
                      {exp.logo ? (
                        <img src={exp.logo} alt="logo" className="w-8 h-8 object-contain" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wide group-hover:text-pink-400 transition-colors">{exp.roleTitle}</h3>
                        {exp.featured && (
                          <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded">Featured</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wide">
                        {exp.companyName} • {exp.startDate} - {exp.currentWorking ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Actions Row */}
                  <div className="hidden md:flex items-center gap-2.5 w-full md:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === experiences.length - 1}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(exp)}
                      className={`p-2 rounded-lg cursor-pointer ${
                        exp.featured ? 'bg-pink-500/10 text-pink-400 border border-pink-500/25' : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                      title={exp.featured ? 'Remove featured' : 'Pin featured'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleTogglePublish(exp)}
                      className={`p-2 rounded-lg cursor-pointer ${
                        exp.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'
                      }`}
                      title={exp.published ? 'Retract to draft' : 'Publish live'}
                    >
                      {exp.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={(e) => handleDuplicateClick(e, exp)}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 hover:bg-red-950/20 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mobile Actions Row */}
                  <div className="flex md:hidden items-center gap-2 w-full mt-2 pt-2 border-t border-white/5 justify-end" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(exp)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-pink-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMobileMenuExp({ exp, index })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/5 text-zinc-300 hover:text-white rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5 text-zinc-400" />
                      <span>More</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Timeline Node strip */}
          {showTimelinePreview && experiences.length > 0 && (
            <div className="hidden md:block bg-[#0b0b0c]/30 border border-white/5 p-6 rounded-3xl space-y-4">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block text-center">Progression Chronology strip</span>
              <div className="relative flex items-center justify-between px-6 py-4">
                <div className="absolute left-10 right-10 h-[1px] bg-white/5 top-1/2 -translate-y-1/2 z-0" />
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="relative z-10 flex flex-col items-center gap-1 group/node">
                    <div 
                      className="w-7 h-7 rounded-full bg-[#121214] border flex items-center justify-center transition-all duration-300"
                      style={{ borderColor: exp.timelineHighlight ? (exp.timelineDotColor || exp.accentColor || '#ec4899') : 'rgba(255,255,255,0.08)' }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: exp.timelineDotColor || exp.accentColor || '#ec4899' }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider block truncate max-w-[80px]">{exp.companyName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Split pane Layout Editor
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start">
          {/* Left panel: Editor */}
          <form onSubmit={handleFormSubmit} className="xl:col-span-7 bg-[#0b0b0c]/80 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xs font-black text-white uppercase tracking-widest">
                  {editingId ? 'Edit Experience Entry' : 'Create Experience Entry'}
                </h2>
                <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Isolated node config workspace</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[9px] font-mono uppercase tracking-widest cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-[9px] font-mono uppercase tracking-widest shadow-md shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Node</span>
                </button>
              </div>
            </div>

            {/* Tab selection */}
            <div className="flex flex-wrap gap-1.5 bg-[#121214] p-1 rounded-xl">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'branding', label: '2. Branding' },
                { id: 'tech', label: '3. Tech Stack' },
                { id: 'metrics', label: '4. Metrics' },
                { id: 'cta', label: '5. CTA Link' },
                { id: 'timeline', label: '6. Timeline' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-grow md:flex-grow-0 px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer border-none ${
                    activeTab === tab.id 
                      ? 'bg-pink-500/10 text-pink-400 font-bold' 
                      : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'basic' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Parul University"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Role Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Full-Stack Developer Intern"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Employment Type</label>
                    <select
                      value={formEmploymentType}
                      onChange={(e) => setFormEmploymentType(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white cursor-pointer"
                    >
                      {EMPLOYMENT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Vadodara, India"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Work Mode</label>
                    <select
                      value={formWorkMode}
                      onChange={(e) => setFormWorkMode(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2024"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">End Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Present or Dec 2024"
                      disabled={formCurrentWorking}
                      value={formCurrentWorking ? 'Present' : formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white disabled:opacity-40"
                    />
                  </div>

                  <div className="flex items-center pl-2 pt-6">
                    <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formCurrentWorking}
                        onChange={(e) => setFormCurrentWorking(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Currently working here</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Commanding large-scale student registry portals with zero latency"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Narrative Description (Rich/HTML allowed)</label>
                  <textarea
                    rows={4}
                    placeholder="Outline your detailed achievements, milestones, and challenges resolved."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-sans"
                  />
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">Tenant-wise Media Assets</span>

                {/* Cover Image */}
                <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-white/5 bg-black overflow-hidden flex items-center justify-center shrink-0">
                    {formCoverImage ? (
                      <img src={formCoverImage} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Cover Illustration Image</label>
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={formCoverImage}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      className="w-full bg-[#0b0b0c] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="file"
                        id="cover-upload"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, 'cover')}
                        accept="image/*"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer hover:bg-pink-500/20 transition-all select-none"
                      >
                        {uploadingCover ? 'Uploading...' : 'Upload Locally'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Background Image */}
                <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-white/5 bg-black overflow-hidden flex items-center justify-center shrink-0">
                    {formBackgroundImage ? (
                      <img src={formBackgroundImage} alt="bg" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Glow Background Overlay (Optional)</label>
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={formBackgroundImage}
                      onChange={(e) => setFormBackgroundImage(e.target.value)}
                      className="w-full bg-[#0b0b0c] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="file"
                        id="bg-upload"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, 'bg')}
                        accept="image/*"
                      />
                      <label
                        htmlFor="bg-upload"
                        className="px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer hover:bg-pink-500/20 transition-all select-none"
                      >
                        {uploadingBg ? 'Uploading...' : 'Upload Locally'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Company Logo */}
                <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  <div className="w-24 h-16 rounded-xl border border-white/5 bg-black overflow-hidden flex items-center justify-center shrink-0">
                    {formLogo ? (
                      <img src={formLogo} alt="logo" className="w-10 h-10 object-contain" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Company Logo / Tag</label>
                    <input
                      type="text"
                      placeholder="Logo URL..."
                      value={formLogo}
                      onChange={(e) => setFormLogo(e.target.value)}
                      className="w-full bg-[#0b0b0c] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, 'logo')}
                        accept="image/*"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer hover:bg-pink-500/20 transition-all select-none"
                      >
                        {uploadingLogo ? 'Uploading...' : 'Upload Locally'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Accent and Variant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Branding Accent Color</label>
                    <div className="flex items-center gap-3 bg-[#121214] border border-white/5 p-2 rounded-xl">
                      <input
                        type="color"
                        value={formAccentColor}
                        onChange={(e) => {
                          setFormAccentColor(e.target.value);
                          setFormTimelineDotColor(e.target.value);
                        }}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                      />
                      <input
                        type="text"
                        value={formAccentColor}
                        onChange={(e) => {
                          setFormAccentColor(e.target.value);
                          setFormTimelineDotColor(e.target.value);
                        }}
                        className="bg-transparent text-xs text-white focus:outline-none font-mono flex-1 border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Branding Theme Variant</label>
                    <select
                      value={formThemeVariant}
                      onChange={(e) => setFormThemeVariant(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white cursor-pointer"
                    >
                      {THEME_VARIANTS.map(v => (
                        <option key={v.id} value={v.id}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">Tech Stack Tags repeater</span>
                
                {/* Search / Add tags */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search preset tags or type custom tag..."
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechTag(techSearch);
                        }
                      }}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                    {techSearch.trim() && (
                      <button
                        type="button"
                        onClick={() => addTechTag(techSearch)}
                        className="absolute right-2 top-1.5 px-3 py-1 bg-pink-500 text-white font-mono text-[8px] uppercase tracking-widest rounded-lg cursor-pointer border-none"
                      >
                        Add Custom
                      </button>
                    )}
                  </div>

                  {/* Suggestion list */}
                  {techSearch.trim() && (
                    <div className="bg-[#121214] border border-white/5 max-h-32 overflow-y-auto rounded-xl p-1.5 flex flex-wrap gap-1">
                      {PRESET_TAGS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase()) && !formTechStack.includes(t)).map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTechTag(tag)}
                          className="px-2.5 py-1 bg-[#1a1a1e] hover:bg-pink-500/20 text-[10px] text-zinc-300 rounded-lg cursor-pointer border-none"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Stack */}
                <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl space-y-2">
                  <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Active Tags (Drag to reorder or click to remove)</label>
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
                    {formTechStack.length === 0 ? (
                      <span className="text-[9px] font-mono text-zinc-500">No technology tags added yet. Search above.</span>
                    ) : (
                      formTechStack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded-lg flex items-center gap-1.5 ${getBadgeStyle(tech)}`}
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(tech)}
                            className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer bg-transparent border-none text-[8px] font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest">Metrics Cards (Max 4)</span>
                  <span className="text-[8px] font-mono text-zinc-500">{formMetrics.length}/4 Cards</span>
                </div>

                {/* Add metrics */}
                {formMetrics.length < 4 && (
                  <div className="bg-[#121214] border border-white/5 p-3 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Metric Value (e.g. 40%)</label>
                      <input
                        type="text"
                        placeholder="e.g. 40%"
                        value={newMetricValue}
                        onChange={(e) => setNewMetricValue(e.target.value)}
                        className="w-full bg-[#0b0b0c] border border-white/5 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Metric Label (e.g. Faster Rendering)</label>
                      <input
                        type="text"
                        placeholder="e.g. Faster Rendering"
                        value={newMetricLabel}
                        onChange={(e) => setNewMetricLabel(e.target.value)}
                        className="w-full bg-[#0b0b0c] border border-white/5 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addMetricCard}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-mono text-[9px] uppercase tracking-widest rounded-xl cursor-pointer border-none h-[38px]"
                    >
                      Add Metric
                    </button>
                  </div>
                )}

                {/* Current Metrics */}
                <div className="space-y-2">
                  {formMetrics.map((met, idx) => (
                    <div key={idx} className="bg-[#121214]/60 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-pink-400 font-mono block">{met.value}</span>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider block mt-0.5">{met.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMetricCard(idx)}
                        className="text-zinc-500 hover:text-red-400 p-2 cursor-pointer bg-transparent border-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {formMetrics.length === 0 && (
                    <div className="py-6 border border-dashed border-white/5 text-center text-xs text-zinc-500 font-mono rounded-2xl">
                      No metrics added yet. Max 3 or 4 metric highlights.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'cta' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">CTA Button Section</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Button Label Text</label>
                    <input
                      type="text"
                      placeholder="e.g. VIEW CASE STUDY"
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Redirect Link URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/..."
                      value={formButtonUrl}
                      onChange={(e) => setFormButtonUrl(e.target.value)}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center pl-2 pt-2">
                  <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formOpenInNewTab}
                      onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                      className="accent-pink-500"
                    />
                    <span>Open in new browser tab</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">Timeline Sequence Controls</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Timeline sequence Order</label>
                    <input
                      type="number"
                      value={formTimelineOrder}
                      onChange={(e) => setFormTimelineOrder(Number(e.target.value))}
                      className="w-full bg-[#121214] border border-white/5 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">Timeline Node Dot Color</label>
                    <div className="flex items-center gap-3 bg-[#121214] border border-white/5 p-2 rounded-xl">
                      <input
                        type="color"
                        value={formTimelineDotColor}
                        onChange={(e) => setFormTimelineDotColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                      />
                      <input
                        type="text"
                        value={formTimelineDotColor}
                        onChange={(e) => setFormTimelineDotColor(e.target.value)}
                        className="bg-transparent text-xs text-white focus:outline-none font-mono flex-1 border-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center pl-2">
                    <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formTimelineVisible}
                        onChange={(e) => setFormTimelineVisible(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Visible in progression track</span>
                    </label>
                  </div>

                  <div className="flex items-center pl-2">
                    <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formTimelineHighlight}
                        onChange={(e) => setFormTimelineHighlight(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Highlight node in progression line</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center pl-2">
                    <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Star as Featured flagship internship</span>
                    </label>
                  </div>

                  <div className="flex items-center pl-2">
                    <label className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formPublished}
                        onChange={(e) => setFormPublished(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Publish Node (Visible on Live Portfolio)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Right panel: Live Preview */}
          <div className="hidden xl:block xl:col-span-5 space-y-6 sticky top-24">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest">Real-time Live Preview</span>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Interactive simulation</span>
            </div>

            {/* Simulated Frontend Card */}
            <div 
              className={`rounded-[32px] border border-white/[0.04] p-6 text-left relative overflow-hidden select-none transition-all duration-500 min-h-[380px] flex flex-col justify-between ${
                formThemeVariant === 'neon' 
                  ? 'bg-black shadow-[0_0_50px_rgba(236,72,153,0.15)] border-pink-500/20' 
                  : formThemeVariant === 'glass' 
                    ? 'bg-white/[0.01] backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                    : 'bg-[#0c0c0e] shadow-[0_15px_40px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Cover/BG container */}
              <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none -z-10" style={{ backgroundImage: `url(${formCoverImage})` }} />

              <div className="space-y-4">
                {/* Branding row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-2.5 py-1 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: formAccentColor }} />
                    <span className="text-[8.5px] font-mono font-bold text-white uppercase tracking-wider">
                      {formCompany || 'Company Name'}
                    </span>
                  </div>

                  <span className="text-[8px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                    {formStartDate || 'Start'} - {formCurrentWorking ? 'Present' : (formEndDate || 'End')}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest font-bold" style={{ color: formAccentColor }}>
                    {formWorkMode} • {formLocation || 'Location'}
                  </span>
                  <h3 className="text-md font-black text-white uppercase tracking-tight leading-tight">{formRole || 'Role Title'}</h3>
                  <p className="text-[10px] text-zinc-400 leading-normal font-light">{formTagline || 'Tagline description'}</p>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {formTechStack.map((tech) => (
                    <span 
                      key={tech} 
                      className={`px-2 py-0.5 text-[7.5px] font-mono uppercase rounded ${getBadgeStyle(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {formTechStack.length === 0 && (
                    <span className="text-[7.5px] font-mono text-zinc-600 uppercase">No tech stack specified</span>
                  )}
                </div>
              </div>

              {/* Bottom section (Metrics & CTA) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {formMetrics.slice(0, 3).map((met, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center">
                      <span className="text-[10px] font-mono font-bold block" style={{ color: formAccentColor }}>{met.value}</span>
                      <span className="text-[7px] text-zinc-500 uppercase block truncate leading-none mt-0.5">{met.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {formButtonText && (
                  <div className="flex justify-end pt-1">
                    <a
                      href={formButtonUrl || '#'}
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-2 border rounded-xl text-[8px] font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1 cursor-pointer"
                      style={{
                        borderColor: `${formAccentColor}35`,
                        color: formAccentColor,
                        backgroundColor: `${formAccentColor}0a`
                      }}
                    >
                      <span>{formButtonText}</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Timeline dot */}
            <div className="bg-[#0b0b0c]/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full bg-[#121214] border flex items-center justify-center shadow"
                style={{ borderColor: formTimelineHighlight ? formTimelineDotColor : 'rgba(255,255,255,0.08)' }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: formTimelineDotColor }}
                />
              </div>
              <div className="text-left font-mono">
                <span className="text-[9px] font-bold text-white block uppercase">Timeline Node order: #{formTimelineOrder}</span>
                <span className="text-[7.5px] text-zinc-500 block uppercase">
                  Dot color: {formTimelineDotColor} • {formTimelineVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Bottom Sheet Menu for Mobile viewports */}
      {activeMobileMenuExp && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in md:hidden" 
          onClick={() => setActiveMobileMenuExp(null)}
        >
          <div 
            className="w-full bg-[#0b0b0c] border-t border-white/10 rounded-t-3xl p-6 space-y-4 animate-slide-up max-w-md select-none text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header of Bottom Sheet */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Experience Node</span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">{activeMobileMenuExp.exp.companyName}</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveMobileMenuExp(null)} 
                className="p-1.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleReorder(activeMobileMenuExp.index, 'up');
                  setActiveMobileMenuExp(null);
                }}
                disabled={activeMobileMenuExp.index === 0}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 disabled:opacity-30 text-xs font-semibold cursor-pointer border-none"
              >
                <ArrowUp className="w-4 h-4 text-pink-400" />
                <span>Move Up</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleReorder(activeMobileMenuExp.index, 'down');
                  setActiveMobileMenuExp(null);
                }}
                disabled={activeMobileMenuExp.index === experiences.length - 1}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 disabled:opacity-30 text-xs font-semibold cursor-pointer border-none"
              >
                <ArrowDown className="w-4 h-4 text-pink-400" />
                <span>Move Down</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleFeatured(activeMobileMenuExp.exp);
                  setActiveMobileMenuExp(null);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                  activeMobileMenuExp.exp.featured 
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' 
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{activeMobileMenuExp.exp.featured ? 'Unpin Featured' : 'Pin Featured'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleTogglePublish(activeMobileMenuExp.exp);
                  setActiveMobileMenuExp(null);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                  activeMobileMenuExp.exp.published 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {activeMobileMenuExp.exp.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{activeMobileMenuExp.exp.published ? 'Retract Draft' : 'Publish Live'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleDuplicateClick(e, activeMobileMenuExp.exp);
                  setActiveMobileMenuExp(null);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 text-xs font-semibold cursor-pointer border-none"
              >
                <Copy className="w-4 h-4 text-pink-400" />
                <span>Duplicate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDelete(activeMobileMenuExp.exp.id);
                  setActiveMobileMenuExp(null);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/20 hover:bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-semibold cursor-pointer border-none"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Delete Node</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
