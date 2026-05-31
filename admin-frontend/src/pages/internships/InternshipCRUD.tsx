import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, Star, Briefcase, Save, 
  ArrowUp, ArrowDown, Eye, EyeOff, X, Code, Sparkles, Activity,
  Info, BarChart2, Globe, Search, Filter, ShieldCheck, Cpu, Layers, CheckCircle2,
  Terminal, ArrowUpRight, Settings, Sliders, Layout, List, Orbit
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & PRESETS
   ───────────────────────────────────────────────────────────── */

const COLOR_OPTIONS = [
  { id: 'blue',    label: 'Blue',     hex: '#3B82F6', text: 'text-blue-400',    dot: 'bg-blue-500'    },
  { id: 'cyan',    label: 'Cyan',     hex: '#06B6D4', text: 'text-cyan-400',    dot: 'bg-cyan-500'    },
  { id: 'green',   label: 'Green',    hex: '#10B981', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  { id: 'purple',  label: 'Purple',   hex: '#8B5CF6', text: 'text-purple-400',  dot: 'bg-purple-500'  },
];

const PRESET_ACCENTS: Record<string, string> = {
  blue: 'rgba(59, 130, 246, 0.4)',
  cyan: 'rgba(6, 182, 212, 0.4)',
  green: 'rgba(16, 185, 129, 0.4)',
  purple: 'rgba(139, 92, 246, 0.4)',
};

const CONTRIBUTION_PRESETS = [
  'Frontend', 'Backend', 'AI', 'DevOps', 'Architecture', 'Data Systems', 'Cloud Security'
];

export default function InternshipCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  // ── Tab Management ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'hero' | 'registry' | 'timeline' | 'contributions' | 'footprint' | 'analytics'>('registry');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ── Socket pipeline ─────────────────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Tab 1: Showcase Hero Settings ───────────────────────────
  const [badge, setBadge] = useState('PROFESSIONAL EXPERIENCE');
  const [heading, setHeading] = useState('BUILDING REAL PRODUCTS IN REAL TEAMS');
  const [description, setDescription] = useState('Hands-on engineering experience across product development...');

  // ── Tab 6: Global Experience Metrics ────────────────────────
  const [totalDuration, setTotalDuration] = useState('2+ Years Building');
  const [verifiedCount, setVerifiedCount] = useState('3 Organizations');
  const [performanceBoost, setPerformanceBoost] = useState('15+ Features Delivered');
  const [radarTitle, setRadarTitle] = useState('8 Production Deployments');

  // ── Timeline Engine Settings ───────────────────────────────
  const [timelineSortOrder, setTimelineSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timelineGrouping, setTimelineGrouping] = useState<boolean>(true);
  const [timelineStyle, setTimelineStyle] = useState<'Milestone' | 'Classic' | 'Radar'>('Milestone');

  // ── Experiences Registry ────────────────────────────────────
  const [internshipsList, setInternshipsList] = useState<any[]>([]);

  // ── Search & Filter Registry list ───────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  
  // ── Registry Form Editor Pane ───────────────────────────────
  const [selectedInternId, setSelectedInternId] = useState<string | null>(null);
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formWorkMode, setFormWorkMode] = useState('Remote');
  const [formEmploymentType, setFormEmploymentType] = useState('Internship');
  const [formSummary, setFormSummary] = useState('');
  const [formBannerImage, setFormBannerImage] = useState('https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop');
  const [formOfferLetterUrl, setFormOfferLetterUrl] = useState('');
  const [formCaseStudyUrl, setFormCaseStudyUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [formAccentColor, setFormAccentColor] = useState('cyan');
  
  // Custom Impact Accomplishments (Achievements 1, 2, 3)
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState('');

  // Contribution chips selected per experience
  const [contributions, setContributions] = useState<string[]>([]);

  // Technologies footprints compiled per experience
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);

  // Deletion confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [internToDeleteId, setInternToDeleteId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  // Socket sync setup
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

  // Sync data from database
  useEffect(() => {
    if (profile?.internshipsSection) {
      const sec = typeof profile.internshipsSection === 'string'
        ? JSON.parse(profile.internshipsSection)
        : profile.internshipsSection;

      setBadge(sec.badge || 'PROFESSIONAL EXPERIENCE');
      setHeading(sec.heading || 'BUILDING REAL PRODUCTS IN REAL TEAMS');
      setDescription(sec.description || 'Hands-on engineering experience across product development...');
      
      setTotalDuration(sec.totalDuration || '2+ Years Building');
      setVerifiedCount(sec.verifiedCount || '3 Organizations');
      setPerformanceBoost(sec.performanceBoost || '15+ Features Delivered');
      setRadarTitle(sec.radarTitle || '8 Production Deployments');

      setTimelineSortOrder(sec.timelineSortOrder || 'desc');
      setTimelineGrouping(sec.timelineGrouping !== false);
      setTimelineStyle(sec.timelineStyle || 'Milestone');

      setInternshipsList(sec.internships || []);

      if (sec.internships && sec.internships.length > 0 && !selectedInternId) {
        selectInternship(sec.internships[0]);
      }
    }
  }, [profile]);

  const selectInternship = (intern: any) => {
    setSelectedInternId(intern.id);
    setFormCompany(intern.company || '');
    setFormRole(intern.role || '');
    setFormDuration(intern.duration || '');
    setFormLocation(intern.location || '');
    setFormWorkMode(intern.workMode || 'Remote');
    setFormEmploymentType(intern.employmentType || 'Internship');
    setFormSummary(intern.summary || '');
    setFormBannerImage(intern.bannerImage || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop');
    setFormOfferLetterUrl(intern.offerLetterUrl || '');
    setFormCaseStudyUrl(intern.caseStudyUrl || '');
    setFormFeatured(intern.featured || false);
    setFormVisible(intern.visible !== false);
    setFormAccentColor(intern.accentColor || 'cyan');
    setAchievements(intern.metrics || []);
    setContributions(intern.contributions || []);
    setTechnologies(intern.technologies || []);
  };

  const getCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge,
      heading,
      description,
      totalDuration,
      verifiedCount,
      performanceBoost,
      radarTitle,
      timelineSortOrder,
      timelineGrouping,
      timelineStyle,
      internships: internshipsList,
      ...overrides
    };
  };

  const emitSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('internships:update', {
        slug: user.portfolioSlug,
        internshipsSection: newSec,
        internships: newSec.internships || []
      });
    }
  };

  const handleGlobalTextChange = (field: string, val: string) => {
    let updated = getCombinedSection();
    if (field === 'badge') { setBadge(val); updated.badge = val; }
    else if (field === 'heading') { setHeading(val); updated.heading = val; }
    else if (field === 'description') { setDescription(val); updated.description = val; }
    else if (field === 'totalDuration') { setTotalDuration(val); updated.totalDuration = val; }
    else if (field === 'verifiedCount') { setVerifiedCount(val); updated.verifiedCount = val; }
    else if (field === 'performanceBoost') { setPerformanceBoost(val); updated.performanceBoost = val; }
    else if (field === 'radarTitle') { setRadarTitle(val); updated.radarTitle = val; }
    emitSectionUpdate(updated);
  };

  // Add a new blank experience
  const createNewExperience = () => {
    const nextId = `intern-${Date.now()}`;
    const newEntry = {
      id: nextId,
      company: 'NEW ORGANIZATION',
      role: 'Software Engineer Intern',
      duration: 'May 2026 - Present',
      location: 'Remote',
      workMode: 'Remote',
      employmentType: 'Internship',
      summary: 'Collaborated with cross-functional development teams to deploy scalable systems...',
      bannerImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop',
      metrics: ['Integrated AI workflows', 'Developed reusable UI components'],
      contributions: ['Frontend', 'Backend'],
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      featured: false,
      visible: true,
      accentColor: 'cyan',
      offerLetterUrl: '',
      caseStudyUrl: '',
      order: internshipsList.length + 1
    };

    const nextList = [...internshipsList, newEntry];
    setInternshipsList(nextList);
    selectInternship(newEntry);
    emitSectionUpdate(getCombinedSection({ internships: nextList }));
    setSuccess('New experience instance registered in registry!');
  };

  // Sync currently edited experience form values to the active registry index
  const updateActiveExperience = (updatedFields: Partial<any>) => {
    if (!selectedInternId) return;
    const nextList = internshipsList.map((item) => {
      if (item.id === selectedInternId) {
        const payload = { ...item, ...updatedFields };
        // Auto-unfeature others if this is featured
        if (updatedFields.featured) {
          return payload;
        }
        return payload;
      }
      if (updatedFields.featured) {
        return { ...item, featured: false };
      }
      return item;
    });

    setInternshipsList(nextList);
    emitSectionUpdate(getCombinedSection({ internships: nextList }));
  };

  // Save full configurations to database
  const saveExperienceStudio = async () => {
    setSaving(true);
    try {
      const dbPayload = getCombinedSection();
      await api.patch('/portfolio/profile', {
        internshipsSection: dbPayload
      });
      setSuccess('Experience Studio database configurations synced with PostgreSQL!');
      await fetchEverything();
    } catch (err: any) {
      console.error('SaveExperienceStudio Error:', err);
      setError(err.response?.data?.message || 'Failed to sync Experience Studio to database.');
    } finally {
      setSaving(false);
    }
  };

  // Trigger deletion
  const startDeleteExperience = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInternToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeleteExperience = () => {
    if (!internToDeleteId) return;
    const nextList = internshipsList.filter(item => item.id !== internToDeleteId);
    setInternshipsList(nextList);
    setIsConfirmOpen(false);
    setInternToDeleteId(null);
    if (selectedInternId === internToDeleteId) {
      if (nextList.length > 0) {
        selectInternship(nextList[0]);
      } else {
        setSelectedInternId(null);
      }
    }
    emitSectionUpdate(getCombinedSection({ internships: nextList }));
    setSuccess('Experience log deleted successfully.');
  };

  // Custom Image Upload handler
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('internshipImage', file);

    try {
      const res = await api.post('/portfolio/profile/internship-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.data.imageUrl;
      setFormBannerImage(uploadedUrl);
      updateActiveExperience({ bannerImage: uploadedUrl });
      setSuccess('Showcase cover illustration uploaded successfully!');
    } catch (err: any) {
      console.error('Internship cover upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload preview image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Helpers for registry filters
  const filteredList = internshipsList.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.company.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query)
    );
  });

  const activeIntern = internshipsList.find((i) => i.id === selectedInternId) || null;

  return (
    <div className="space-y-6 animate-fade-in pr-2 pb-6 text-left">
      
      {/* CMS Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Experience Studio Operating System</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage high-fidelity logbooks, cinematic timelines, contribution chips, and aggregated orbit radars.</p>
        </div>

        <button
          onClick={saveExperienceStudio}
          disabled={saving}
          className="w-full md:w-auto justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SYNCING...' : <><span className="hidden sm:inline">SAVE CHANGES</span><span className="inline sm:hidden">PUBLISH</span></>}</span>
        </button>
      </div>

      {/* Dynamic Telemetry context bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-card/50 border border-border/40 rounded-2xl animate-fade-in">
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Experience Registry</span>
          <span className="text-base font-black text-primary font-mono">{internshipsList.length} Internships</span>
        </div>
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Key Outcomes</span>
          <span className="text-base font-black text-foreground font-mono">
            {Array.from(new Set(internshipsList.flatMap(i => i.highlights || i.contributions || []))).length} Contributions
          </span>
        </div>
        <div className="flex flex-col text-left space-y-0.5">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tech Footprint</span>
          <span className="text-base font-black text-foreground font-mono">
            {Array.from(new Set(internshipsList.flatMap(i => i.technologies || []))).length} Techs
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

      {/* Tabs Control Row */}
      <div className="flex flex-wrap gap-1 bg-background/50 border border-border/60 p-1 rounded-xl">
        {[
          { id: 'registry', label: 'Experience Registry', icon: <List className="w-3.5 h-3.5" /> },
          { id: 'hero', label: 'Showcase Hero', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'timeline', label: 'Timeline Engine', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'contributions', label: 'Contributions', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'footprint', label: 'Tech Footprint', icon: <Orbit className="w-3.5 h-3.5" /> },
          { id: 'analytics', label: 'Analytics Strip', icon: <BarChart2 className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-neutral-900 border border-white/5 text-primary shadow' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT editorial parameters pane based on activeTab */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: SHOWCASE HERO */}
          {activeTab === 'hero' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Showcase Hero Header Configuration</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Badge Pill Text</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => handleGlobalTextChange('badge', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. PROFESSIONAL EXPERIENCE"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Heading</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => handleGlobalTextChange('heading', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white uppercase"
                    placeholder="e.g. BUILDING REAL PRODUCTS IN REAL TEAMS"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Showcase Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => handleGlobalTextChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                    placeholder="Hands-on engineering experience across product development, backend systems, AI workflows..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE REGISTRY */}
          {activeTab === 'registry' && (
            <div className="space-y-6 text-left">
              {/* Registry List Grid */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-border/40 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Registered Experiences ({internshipsList.length})</span>
                  </h4>

                  <button
                    onClick={createNewExperience}
                    className="w-full md:w-auto justify-center px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>REGISTER NEW</span>
                  </button>
                </div>

                {/* Registry cards list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {filteredList.length === 0 ? (
                    <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
                      <p className="text-xs text-muted-foreground">No experiences registered. Click "REGISTER NEW" to seed your studio.</p>
                    </div>
                  ) : (
                    filteredList.map((item) => {
                      const isSelected = item.id === selectedInternId;
                      return (
                        <div
                          key={item.id}
                          onClick={() => selectInternship(item)}
                          className={`p-3 rounded-xl border grid grid-cols-[32px_1fr_auto] items-center gap-3 cursor-pointer transition-all hover:border-primary/20 ${
                            isSelected 
                              ? 'bg-neutral-900 border-primary text-white' 
                              : 'bg-background border-border text-muted-foreground'
                          }`}
                        >
                          <div className="w-8 h-8 rounded border border-border overflow-hidden bg-neutral-900 shrink-0">
                            <img src={item.bannerImage} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="min-w-0 text-left">
                            <h5 className={`text-xs font-bold truncate uppercase ${isSelected ? 'text-primary' : 'text-white'}`} title={item.role}>
                              {item.role}
                            </h5>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold block truncate">{item.company}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.featured && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}
                            <button
                              onClick={(e) => startDeleteExperience(item.id, e)}
                              className="p-1 hover:bg-red-950/20 text-muted-foreground hover:text-red-400 rounded transition-all cursor-pointer"
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

              {/* Form specifications pane */}
              {activeIntern && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Active Editor Profile: {formCompany || 'Creative Blueprint'}</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={formCompany}
                          onChange={(e) => { setFormCompany(e.target.value); updateActiveExperience({ company: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Role Title</label>
                        <input
                          type="text"
                          value={formRole}
                          onChange={(e) => { setFormRole(e.target.value); updateActiveExperience({ role: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Duration</label>
                        <input
                          type="text"
                          value={formDuration}
                          onChange={(e) => { setFormDuration(e.target.value); updateActiveExperience({ duration: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Location</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={(e) => { setFormLocation(e.target.value); updateActiveExperience({ location: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Employment Type</label>
                        <select
                          value={formEmploymentType}
                          onChange={(e) => { setFormEmploymentType(e.target.value); updateActiveExperience({ employmentType: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          <option value="Internship">Internship</option>
                          <option value="Apprenticeship">Apprenticeship</option>
                          <option value="Contract">Contract</option>
                          <option value="Research">Research</option>
                          <option value="Full-time">Full-time</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Work Mode</label>
                        <select
                          value={formWorkMode}
                          onChange={(e) => { setFormWorkMode(e.target.value); updateActiveExperience({ workMode: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Theme Accent Color</label>
                        <select
                          value={formAccentColor}
                          onChange={(e) => { setFormAccentColor(e.target.value); updateActiveExperience({ accentColor: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          <option value="cyan">Cyan Spotlight</option>
                          <option value="blue">Blue Corporate</option>
                          <option value="green">Green Agile</option>
                          <option value="purple">Purple Cyber</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Case Study Summary Narrative</label>
                      <textarea
                        rows={3}
                        value={formSummary}
                        onChange={(e) => { setFormSummary(e.target.value); updateActiveExperience({ summary: e.target.value }); }}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Coordinated next-generation interactive dashboards and micro-frontend structures..."
                      />
                    </div>

                    {/* Banner cover uploader */}
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Showcase Banner Artwork</label>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="col-span-1 sm:col-span-8 relative border border-dashed border-border hover:border-primary/50 bg-background rounded-xl p-4 text-center flex flex-col items-center justify-center transition-all cursor-pointer h-20">
                          <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground font-mono">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-[9px] text-zinc-400 font-bold uppercase">Upload 16:9 illustration</span>
                          </div>
                        </div>
                        <div className="col-span-1 sm:col-span-4 h-20 bg-background border border-border rounded-xl overflow-hidden shadow flex items-center justify-center">
                          {uploadingImage ? (
                            <span className="text-[9px] font-mono text-zinc-400 animate-pulse">UPLOADING...</span>
                          ) : (
                            <img src={formBannerImage} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Impact strip achievements */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Verified Telemetry Metrics / Impact Achievements (Max 3)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = newAchievement.trim();
                              if (val && !achievements.includes(val)) {
                                const next = [...achievements, val];
                                setAchievements(next);
                                setNewAchievement('');
                                updateActiveExperience({ metrics: next });
                              }
                            }
                          }}
                          className="flex-grow bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                          placeholder="Type achievement & press enter (e.g. Reduced bundle size by 35%)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = newAchievement.trim();
                            if (val && !achievements.includes(val)) {
                              const next = [...achievements, val];
                              setAchievements(next);
                              setNewAchievement('');
                              updateActiveExperience({ metrics: next });
                            }
                          }}
                          className="px-3 bg-primary text-primary-foreground font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                        >
                          ADD
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 p-3 bg-background border border-border rounded-xl min-h-[40px] items-center">
                        {achievements.length === 0 ? (
                          <span className="text-[9px] text-zinc-550 font-mono">No achievements configured yet.</span>
                        ) : (
                          achievements.map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-neutral-900 text-[9px] text-zinc-300 font-mono rounded border border-border flex items-center gap-1.5">
                              <span>{item}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = achievements.filter((a) => a !== item);
                                  setAchievements(next);
                                  updateActiveExperience({ metrics: next });
                                }}
                                className="text-muted-foreground hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Offer Letter/Reference URL</label>
                        <input
                          type="url"
                          value={formOfferLetterUrl}
                          onChange={(e) => { setFormOfferLetterUrl(e.target.value); updateActiveExperience({ offerLetterUrl: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Project Case Study URL</label>
                        <input
                          type="url"
                          value={formCaseStudyUrl}
                          onChange={(e) => { setFormCaseStudyUrl(e.target.value); updateActiveExperience({ caseStudyUrl: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-background border border-border/80 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="formFeatured"
                          checked={formFeatured}
                          onChange={(e) => { setFormFeatured(e.target.checked); updateActiveExperience({ featured: e.target.checked }); }}
                          className="rounded bg-background border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="formFeatured" className="text-xs font-bold text-white uppercase tracking-wider cursor-pointer flex items-center gap-1 select-none">
                          <Star className={`w-3.5 h-3.5 ${formFeatured ? 'text-cyan-400 fill-cyan-400' : ''}`} />
                          Flagship Experience
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5 sm:ml-6">
                        <input
                          type="checkbox"
                          id="formVisible"
                          checked={formVisible}
                          onChange={(e) => { setFormVisible(e.target.checked); updateActiveExperience({ visible: e.target.checked }); }}
                          className="rounded bg-background border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="formVisible" className="text-xs font-bold text-white uppercase tracking-wider cursor-pointer flex items-center gap-1 select-none">
                          {formVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-destructive" />}
                          Public Visible
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TIMELINE ENGINE */}
          {activeTab === 'timeline' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Timeline Render Specifications Engine</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Timeline Style Variant</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Milestone', 'Classic', 'Radar'].map((style) => (
                      <button
                        key={style}
                        onClick={() => { setTimelineStyle(style as any); emitSectionUpdate(getCombinedSection({ timelineStyle: style })); }}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          timelineStyle === style
                            ? 'bg-neutral-900 border-primary text-white'
                            : 'bg-background border-border text-muted-foreground hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Chronology Sort Order</label>
                    <select
                      value={timelineSortOrder}
                      onChange={(e) => { setTimelineSortOrder(e.target.value as any); emitSectionUpdate(getCombinedSection({ timelineSortOrder: e.target.value })); }}
                      className="w-full bg-background border border-border focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="desc">Recent Experience First (Desc)</option>
                      <option value="asc">Oldest Experience First (Asc)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Year stamps Grouping</label>
                    <select
                      value={timelineGrouping ? 'true' : 'false'}
                      onChange={(e) => { const val = e.target.value === 'true'; setTimelineGrouping(val); emitSectionUpdate(getCombinedSection({ timelineGrouping: val })); }}
                      className="w-full bg-background border border-border focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="true">Enable Chronological Year Stamp Nodes</option>
                      <option value="false">Disable stamps / Linear chronology</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTRIBUTION SYSTEM */}
          {activeTab === 'contributions' && activeIntern && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Engineering Contributions System: {formCompany || 'Active Profile'}</span>
              </h4>

              <p className="text-[11px] text-muted-foreground">Select applicable technical domains. Frontend will render contribution grids based on active chip selections.</p>

              <div className="flex flex-wrap gap-2.5">
                {CONTRIBUTION_PRESETS.map((preset) => {
                  const isChecked = contributions.includes(preset);
                  return (
                    <button
                      key={preset}
                      onClick={() => {
                        const next = isChecked
                          ? contributions.filter((c) => c !== preset)
                          : [...contributions, preset];
                        setContributions(next);
                        updateActiveExperience({ contributions: next });
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-neutral-900 border-primary text-white shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:text-zinc-200'
                      }`}
                    >
                      <span>{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: TECH FOOTPRINT */}
          {activeTab === 'footprint' && activeIntern && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Orbit className="w-4 h-4" />
                <span>Accumulated Technology Footprints: {formCompany || 'Active Profile'}</span>
              </h4>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newTech.trim();
                        if (val && !technologies.includes(val)) {
                          const next = [...technologies, val];
                          setTechnologies(next);
                          setNewTech('');
                          updateActiveExperience({ technologies: next });
                        }
                      }
                    }}
                    className="flex-grow bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    placeholder="Type technology & press enter (e.g. Next.js)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newTech.trim();
                      if (val && !technologies.includes(val)) {
                        const next = [...technologies, val];
                        setTechnologies(next);
                        setNewTech('');
                        updateActiveExperience({ technologies: next });
                      }
                    }}
                    className="px-3 bg-primary text-primary-foreground font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                  >
                    ADD PILL
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 bg-background border border-border rounded-xl min-h-[50px] items-center">
                  {technologies.length === 0 ? (
                    <span className="text-[9px] text-zinc-550 font-mono">No tech stack chips configured.</span>
                  ) : (
                    technologies.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-neutral-900 border border-border text-[9.5px] text-zinc-350 font-mono rounded flex items-center gap-1.5">
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = technologies.filter((x) => x !== t);
                            setTechnologies(next);
                            updateActiveExperience({ technologies: next });
                          }}
                          className="text-muted-foreground hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS STRIP */}
          {activeTab === 'analytics' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                <span>Global Experience Metrics Strip Settings</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Years Experience Counter</label>
                  <input
                    type="text"
                    value={totalDuration}
                    onChange={(e) => handleGlobalTextChange('totalDuration', e.target.value)}
                    className="w-full bg-background border border-border focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. 2+ Years Building"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Organizations Counter</label>
                  <input
                    type="text"
                    value={verifiedCount}
                    onChange={(e) => handleGlobalTextChange('verifiedCount', e.target.value)}
                    className="w-full bg-background border border-border focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. 3 Organizations"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Systems Built Counter</label>
                  <input
                    type="text"
                    value={performanceBoost}
                    onChange={(e) => handleGlobalTextChange('performanceBoost', e.target.value)}
                    className="w-full bg-background border border-border focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. 15+ Features Delivered"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Deployments Counter</label>
                  <input
                    type="text"
                    value={radarTitle}
                    onChange={(e) => handleGlobalTextChange('radarTitle', e.target.value)}
                    className="w-full bg-background border border-border focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. 8 Production Deployments"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* =============================================================
           RIGHT STICKY PANEL: High-Fidelity Split Pane Real-Time Live Preview
           ============================================================= */}
        <div className="hidden lg:block lg:col-span-5 h-full lg:sticky lg:top-0 space-y-4">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase border-b border-border/40 pb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Studio Split Live Preview (Mahi Portfolio)</span>
          </div>

          {activeIntern ? (
            <div className="relative group rounded-3xl overflow-hidden p-0.5 bg-zinc-900/60 border border-zinc-800 text-left shadow-2xl">
              {/* Radial glow accent */}
              <div 
                className="absolute -inset-10 opacity-70 blur-[50px] pointer-events-none -z-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${PRESET_ACCENTS[formAccentColor || 'cyan']}, transparent 70%)`
                }}
              />

              {/* 16:9 Banner preview */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative border-b border-white/5 bg-zinc-950">
                <img src={formBannerImage} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                {/* Verified Pill */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 bg-black/60 border border-white/10 rounded-lg text-[7px] font-mono text-zinc-350">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="font-bold tracking-wider uppercase">{formEmploymentType || 'Internship'}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight leading-none">{formCompany || 'Creative Blueprint'}</h4>
                    <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">{formLocation || 'Remote'} • {formWorkMode}</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-200 bg-white/10 border border-white/10 px-2 py-0.5 rounded uppercase">{formDuration}</span>
                </div>
              </div>

              {/* Specs body details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-cyan-400 flex items-center justify-center shrink-0">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none">{formRole || 'Software Engineer Intern'}</h3>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mt-0.5">at {formCompany || 'Active Org'}</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 font-light leading-relaxed font-sans line-clamp-3">
                  {formSummary || 'Details describing technical systems, workflows, integrations, and modular APIs...'}
                </p>

                {/* Verified achievements metrics */}
                <div className="space-y-1">
                  {achievements.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-[9px] font-mono text-neutral-350">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-white/[0.04] text-[8.5px] font-mono text-neutral-400 uppercase font-bold">
                  <div className="flex flex-wrap gap-1">
                    {technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[7.5px] text-zinc-500 bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-cyan-400 font-black cursor-pointer hover:underline flex items-center gap-0.5">
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-900/10 border border-dashed border-border rounded-2xl">
              <p className="text-xs text-muted-foreground">Select an experience to see dynamic live Split preview.</p>
            </div>
          )}

          <div className="p-4 bg-[#0c1220]/50 border border-blue-500/10 rounded-2xl text-[10px] text-blue-300 font-light font-sans leading-relaxed text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Real-Time Broadcast:</strong> Changes are immediately broadcasted to portfolio tabs using WebSockets, so you can preview modifications in real-time before syncing to PostgreSQL.
            </span>
          </div>

        </div>

      </div>

      {/* Mobile Floating Preview Trigger */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-black uppercase tracking-widest rounded-full shadow-2xl border border-cyan-400/50 animate-bounce cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Open Live Preview</span>
        </button>
      </div>

      {/* Mobile Live Preview Modal */}
      {isPreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-zinc-950 border border-border rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase">Live Mobile Preview</span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Card */}
            {activeIntern ? (
              <div className="relative group rounded-3xl overflow-hidden p-0.5 bg-zinc-900/60 border border-zinc-800 text-left shadow-xl">
                {/* Radial glow accent */}
                <div 
                  className="absolute -inset-10 opacity-70 blur-[50px] pointer-events-none -z-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${PRESET_ACCENTS[formAccentColor || 'cyan']}, transparent 70%)`
                  }}
                />

                {/* 16:9 Banner preview */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative border-b border-white/5 bg-zinc-950">
                  <img src={formBannerImage} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Verified Pill */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 bg-black/60 border border-white/10 rounded-lg text-[7px] font-mono text-zinc-350">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="font-bold tracking-wider uppercase">{formEmploymentType || 'Internship'}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight leading-none">{formCompany || 'Creative Blueprint'}</h4>
                      <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">{formLocation || 'Remote'} • {formWorkMode}</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-200 bg-white/10 border border-white/10 px-2 py-0.5 rounded uppercase">{formDuration}</span>
                  </div>
                </div>

                {/* Specs body details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-cyan-400 flex items-center justify-center shrink-0">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none">{formRole || 'Software Engineer Intern'}</h3>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mt-0.5">at {formCompany || 'Active Org'}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-light leading-relaxed font-sans line-clamp-3">
                    {formSummary || 'Details describing technical systems, workflows, integrations, and modular APIs...'}
                  </p>

                  {/* Verified achievements metrics */}
                  <div className="space-y-1">
                    {achievements.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-[9px] font-mono text-neutral-350">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-white/[0.04] text-[8.5px] font-mono text-neutral-400 uppercase font-bold">
                    <div className="flex flex-wrap gap-1">
                      {technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[7.5px] text-zinc-500 bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="text-cyan-400 font-black cursor-pointer hover:underline flex items-center gap-0.5">
                      <span>Case Study</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">Select an experience to see live preview.</p>
            )}

            <button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-3 bg-neutral-900 border border-border hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteExperience}
        title="Delete Registered Experience Profile"
        message="Are you absolutely sure you want to permanently delete this professional log? All verified telemetry metrics, footprint chips, and layout sequences will be lost."
        confirmText="DELETE PERMANENTLY"
        loading={saving}
      />

    </div>
  );
}
