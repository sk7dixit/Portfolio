import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Plus, Trash2, Edit3, Save, ArrowUp, ArrowDown, Eye, EyeOff, 
  X, Code, Sparkles, Info, Globe, Trophy, GraduationCap, 
  Server, Cpu, Rocket, Target, ToggleLeft, ToggleRight, CheckCircle2, Zap
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & COLOR MAPPINGS
   ───────────────────────────────────────────────────────────── */

const ICON_OPTIONS = [
  { id: 'GraduationCap', label: 'Academic / Cap', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'Code', label: 'Code Bracket', icon: <Code className="w-4 h-4" /> },
  { id: 'Server', label: 'Server / Backend', icon: <Server className="w-4 h-4" /> },
  { id: 'Cpu', label: 'AI / CPU Core', icon: <Cpu className="w-4 h-4" /> },
  { id: 'Rocket', label: 'Rocket Launch', icon: <Rocket className="w-4 h-4" /> },
  { id: 'Target', label: 'Target / Goal', icon: <Target className="w-4 h-4" /> }
];

const THEME_COLORS = [
  { id: 'blue', label: 'Cyan / Blue', text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', hex: '#3b82f6' },
  { id: 'orange', label: 'Glow / Orange', text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', hex: '#fb923c' },
  { id: 'purple', label: 'Royal / Purple', text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', hex: '#a855f7' },
  { id: 'green', label: 'Emerald / Green', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', hex: '#10b981' }
];

export default function JourneyCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  // ── Tab Management ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'hero' | 'registry' | 'destination'>('registry');

  // ── Socket pipeline ─────────────────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Tab 1: Journey Hero Settings ────────────────────────────
  const [badge, setBadge] = useState('ASCENDING JOURNEY');
  const [heading, setHeading] = useState('MY TECHNICAL EVOLUTION');
  const [description, setDescription] = useState('A roadmap of growth from programming fundamentals to AI-powered systems.');

  // ── Tab 2: Timeline Registry Milestones ──────────────────────
  const [milestones, setMilestones] = useState<any[]>([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Milestone Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formPhaseName, setFormPhaseName] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSkillsText, setFormSkillsText] = useState('');
  const [formAchievementId, setFormAchievementId] = useState('none');
  const [formIcon, setFormIcon] = useState('GraduationCap');
  const [formColorTheme, setFormColorTheme] = useState('blue');

  // List of Achievements for attached dropdown binding
  const [achievementsDropdown, setAchievementsDropdown] = useState<any[]>([]);

  // ── Tab 3: Current Destination (The Summit) ──────────────────
  const [summitShow, setSummitShow] = useState(true);
  const [summitStatusLabel, setSummitStatusLabel] = useState('THE SUMMIT / GOAL');
  const [summitMainGoal, setSummitMainGoal] = useState('AI + FULL STACK SYSTEMS');
  const [summitDescription, setSummitDescription] = useState('Scaling expertise in cloud, distributed systems and AI.');
  const [summitSkillsText, setSummitSkillsText] = useState('AWS Infrastructure, Docker, Distributed Systems, AI Agents');

  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [milestoneToDeleteId, setMilestoneToDeleteId] = useState<string | null>(null);

  // Socket sync setup
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

  // Load achievements list dynamically from profile achievementsSection to populate dropdown options
  useEffect(() => {
    if (profile?.achievementsSection) {
      const achSec = typeof profile.achievementsSection === 'string'
        ? JSON.parse(profile.achievementsSection)
        : profile.achievementsSection;
      
      if (achSec.achievements) {
        setAchievementsDropdown(achSec.achievements);
      }
    }
  }, [profile]);

  // Sync data from database profile on boot
  useEffect(() => {
    if (profile?.journeySection) {
      const sec = typeof profile.journeySection === 'string'
        ? JSON.parse(profile.journeySection)
        : profile.journeySection;

      setBadge(sec.badge || 'ASCENDING JOURNEY');
      setHeading(sec.heading || 'MY TECHNICAL EVOLUTION');
      setDescription(sec.description || 'A roadmap of growth from programming fundamentals to AI-powered systems.');
      
      const dest = sec.destination || {};
      setSummitShow(dest.show !== false);
      setSummitStatusLabel(dest.statusLabel || 'THE SUMMIT / GOAL');
      setSummitMainGoal(dest.mainGoal || 'AI + FULL STACK SYSTEMS');
      setSummitDescription(dest.description || 'Scaling expertise in cloud, distributed systems and AI.');
      
      if (Array.isArray(dest.skills)) {
        setSummitSkillsText(dest.skills.join(', '));
      } else {
        setSummitSkillsText(dest.skills || 'AWS Infrastructure, Docker, Distributed Systems, AI Agents');
      }

      const list = sec.milestones || [];
      setMilestones(list);

      if (list.length > 0 && !selectedMilestoneId) {
        selectMilestone(list[0]);
      }
    } else {
      // Seed fallback mock items
      const mockMilestones = [
        { 
          id: 'm-1', 
          year: '2023', 
          phaseName: 'FOUNDATION PHASE', 
          title: 'B.Tech CSE Academics & DSA', 
          badgeText: '★ Core Architecture', 
          description: 'Started B.Tech in Computer Science. Focused on DSA, DBMS, Algorithms and Programming.', 
          skills: ['C/C++', 'DBMS', 'SQL', 'Data Structures', 'Algorithms'], 
          achievementId: 'networks-elite', 
          icon: 'GraduationCap', 
          colorTheme: 'blue', 
          order: 1 
        },
        { 
          id: 'm-2', 
          year: '2024', 
          phaseName: 'DEVELOPMENT PHASE', 
          title: 'Full Stack Engineering', 
          badgeText: '🏆 Hackathon Silver', 
          description: 'Transitioned to modular web development. Designed stateless full stack platforms and secure database queries.', 
          skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'TypeScript'], 
          achievementId: 'hackathon-runner-up', 
          icon: 'Code', 
          colorTheme: 'orange', 
          order: 2 
        },
        { 
          id: 'm-3', 
          year: '2025', 
          phaseName: 'AI PHASE', 
          title: 'AI Systems & Spatial Engines', 
          badgeText: '⚡ Real-Time Analytics', 
          description: 'Designed travel schedulers and geospatial cluster maps backed by AI APIs.', 
          skills: ['Next.js', 'Gemini Pro', 'PostgreSQL', 'Leaflet', 'Prisma'], 
          achievementId: 'none', 
          icon: 'Cpu', 
          colorTheme: 'purple', 
          order: 3 
        }
      ];
      setMilestones(mockMilestones);
      if (mockMilestones.length > 0) {
        selectMilestone(mockMilestones[0]);
      }
    }
  }, [profile]);

  const selectMilestone = (m: any) => {
    setSelectedMilestoneId(m.id);
    setFormTitle(m.title || '');
    setFormYear(m.year || '');
    setFormPhaseName(m.phaseName || '');
    setFormBadgeText(m.badgeText || '');
    setFormDescription(m.description || '');
    setFormSkillsText(Array.isArray(m.skills) ? m.skills.join(', ') : (m.skills || ''));
    setFormAchievementId(m.achievementId || 'none');
    setFormIcon(m.icon || 'GraduationCap');
    setFormColorTheme(m.colorTheme || 'blue');
  };

  const getCombinedSection = (overrides: Partial<any> = {}) => {
    const summitSkills = summitSkillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return {
      badge,
      heading,
      description,
      destination: {
        show: summitShow,
        statusLabel: summitStatusLabel,
        mainGoal: summitMainGoal,
        description: summitDescription,
        skills: summitSkills
      },
      milestones: milestones,
      ...overrides
    };
  };

  const emitSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('journey:update', {
        slug: user.portfolioSlug,
        journeySection: newSec
      });
    }
  };

  const handleGlobalHeroChange = (field: string, val: string) => {
    let updated = getCombinedSection();
    if (field === 'badge') { setBadge(val); updated.badge = val; }
    else if (field === 'heading') { setHeading(val); updated.heading = val; }
    else if (field === 'description') { setDescription(val); updated.description = val; }
    emitSectionUpdate(updated);
  };

  const handleSummitChange = (field: string, val: any) => {
    let updated = getCombinedSection();
    if (field === 'show') { setSummitShow(val); updated.destination.show = val; }
    else if (field === 'statusLabel') { setSummitStatusLabel(val); updated.destination.statusLabel = val; }
    else if (field === 'mainGoal') { setSummitMainGoal(val); updated.destination.mainGoal = val; }
    else if (field === 'description') { setSummitDescription(val); updated.destination.description = val; }
    else if (field === 'skills') { 
      setSummitSkillsText(val); 
      updated.destination.skills = val.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0); 
    }
    emitSectionUpdate(updated);
  };

  // ── Tab 2: Milestone Registry Actions ───────────────────────
  const createNewMilestone = () => {
    const nextId = `milestone-${Date.now()}`;
    const newEntry = {
      id: nextId,
      year: '2025',
      phaseName: 'NEW PHASE',
      title: 'Dynamic Growth Milestone',
      badgeText: '★ Evolution Spark',
      description: 'Document your technical expansion, frameworks adopted, and team architectures coordinated.',
      skills: ['TypeScript', 'Cloud Systems'],
      achievementId: 'none',
      icon: 'Rocket',
      colorTheme: 'blue',
      order: milestones.length + 1
    };

    const nextList = [...milestones, newEntry];
    setMilestones(nextList);
    selectMilestone(newEntry);
    emitSectionUpdate(getCombinedSection({ milestones: nextList }));
    setSuccess('New growth milestone added to registry timeline!');
  };

  const updateActiveMilestone = (updatedFields: Partial<any>) => {
    if (!selectedMilestoneId) return;
    const nextList = milestones.map((item) => {
      if (item.id === selectedMilestoneId) {
        return { ...item, ...updatedFields };
      }
      return item;
    });

    setMilestones(nextList);
    emitSectionUpdate(getCombinedSection({ milestones: nextList }));
  };

  const handleSkillsTextChange = (text: string) => {
    setFormSkillsText(text);
    const parsedTags = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    updateActiveMilestone({ skills: parsedTags });
  };

  const startDeleteMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMilestoneToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeleteMilestone = () => {
    if (!milestoneToDeleteId) return;
    const nextList = milestones.filter(item => item.id !== milestoneToDeleteId);
    setMilestones(nextList);
    setIsConfirmOpen(false);
    setMilestoneToDeleteId(null);
    if (selectedMilestoneId === milestoneToDeleteId) {
      if (nextList.length > 0) {
        selectMilestone(nextList[0]);
      } else {
        setSelectedMilestoneId(null);
      }
    }
    emitSectionUpdate(getCombinedSection({ milestones: nextList }));
    setSuccess('Timeline growth milestone deleted.');
  };

  const handleRegistryReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === milestones.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextList = [...milestones];
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;

    const finalized = nextList.map((m, idx) => ({ ...m, order: idx + 1 }));
    setMilestones(finalized);
    emitSectionUpdate(getCombinedSection({ milestones: finalized }));
  };

  const saveJourneySection = async () => {
    setSaving(true);
    try {
      const dbPayload = getCombinedSection();
      await api.patch('/portfolio/profile', {
        journeySection: dbPayload
      });
      setSuccess('Journey roadmap synced successfully with PostgreSQL!');
      await fetchEverything();
    } catch (err: any) {
      console.error('SaveJourneySection Error:', err);
      setError(err.response?.data?.message || 'Failed to sync journey timeline to database.');
    } finally {
      setSaving(false);
    }
  };

  const activeMilestone = milestones.find(m => m.id === selectedMilestoneId) || null;

  // Resolve matching attached achievement text details
  const getAttachedAchievementText = (id: string) => {
    if (id === 'none') return '';
    const match = achievementsDropdown.find(a => a.id === id);
    return match ? `${match.title} (${match.organization})` : 'Attached Milestone Credential';
  };

  return (
    <div className="space-y-6 animate-fade-in pr-2 pb-6">
      
      {/* CMS Header Row */}
      <div className="flex justify-between items-center border-b border-border/60 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Journey Roadmap OS</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage professional growth timelines, adopted technologies, and summit destination objectives.</p>
        </div>

        <button
          onClick={saveJourneySection}
          disabled={saving}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SYNCING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-1 bg-background/50 border border-border/60 p-1 rounded-xl">
        {[
          { id: 'registry', label: 'Timeline Registry', icon: <Target className="w-3.5 h-3.5" /> },
          { id: 'hero', label: 'Journey Hero', icon: <Info className="w-3.5 h-3.5" /> },
          { id: 'destination', label: 'Current Destination', icon: <Rocket className="w-3.5 h-3.5" /> }
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
        
        {/* LEFT COMPONENT: CMS Configuration Editor */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: HERO CONFIG */}
          {activeTab === 'hero' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Showcase Hero Header Configuration</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Badge Text</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => handleGlobalHeroChange('badge', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    placeholder="e.g. ASCENDING JOURNEY"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Main Heading</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => handleGlobalHeroChange('heading', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white uppercase"
                    placeholder="e.g. MY TECHNICAL EVOLUTION"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Roadmap Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => handleGlobalHeroChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                    placeholder="A roadmap of growth from programming fundamentals to AI-powered systems..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES REGISTRY */}
          {activeTab === 'registry' && (
            <div className="space-y-6 text-left">
              
              {/* Timeline Milestones Index */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    <span>Roadmap Growth Registry ({milestones.length})</span>
                  </h4>

                  <button
                    onClick={createNewMilestone}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD MILESTONE</span>
                  </button>
                </div>

                {/* Milestones Compact List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {milestones.length === 0 ? (
                    <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
                      <span className="text-xs text-muted-foreground">No growth milestones configured. Click Add above.</span>
                    </div>
                  ) : (
                    milestones
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((m, idx) => {
                        const isSelected = m.id === selectedMilestoneId;
                        const matchingColor = THEME_COLORS.find(c => c.id === m.colorTheme) || THEME_COLORS[0];
                        return (
                          <div
                            key={m.id}
                            onClick={() => selectMilestone(m)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-primary/20 ${
                              isSelected 
                                ? 'bg-neutral-900 border-primary text-white shadow-sm' 
                                : 'bg-background border-border text-muted-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate text-left">
                              <span className="shrink-0" style={{ color: matchingColor.hex }}>
                                {ICON_OPTIONS.find(i => i.id === m.icon)?.icon || <GraduationCap className="w-4 h-4" />}
                              </span>
                              <div className="truncate">
                                <h5 className={`text-xs font-bold truncate uppercase ${isSelected ? 'text-primary' : 'text-white'}`}>{m.title}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">{m.phaseName}</span>
                                  <span className="text-neutral-700 text-[8px]">•</span>
                                  <span className="text-[9px] font-mono text-zinc-400 font-bold">{m.year}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                disabled={idx === 0}
                                onClick={() => handleRegistryReorder(idx, 'up')}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === milestones.length - 1}
                                onClick={() => handleRegistryReorder(idx, 'down')}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => startDeleteMilestone(m.id, e)}
                                className="p-1 hover:bg-red-950/20 text-muted-foreground hover:text-red-400 rounded cursor-pointer"
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

              {/* Milestone Details Form */}
              {activeMilestone && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Registry Editor Profile: {formTitle || 'Active Milestone'}</span>
                  </h4>

                  <div className="space-y-4">
                    
                    {/* Row 1: Title & Phase Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Milestone Title</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => { setFormTitle(e.target.value); updateActiveMilestone({ title: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Growth Phase Name</label>
                        <input
                          type="text"
                          value={formPhaseName}
                          onChange={(e) => { setFormPhaseName(e.target.value); updateActiveMilestone({ phaseName: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white uppercase"
                          placeholder="e.g. FOUNDATION PHASE"
                        />
                      </div>
                    </div>

                    {/* Row 2: Year Date & Badge Tag */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Milestone Year</label>
                        <input
                          type="text"
                          value={formYear}
                          onChange={(e) => { setFormYear(e.target.value); updateActiveMilestone({ year: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                          placeholder="e.g. 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Timeline Badge Text</label>
                        <input
                          type="text"
                          value={formBadgeText}
                          onChange={(e) => { setFormBadgeText(e.target.value); updateActiveMilestone({ badgeText: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                          placeholder="e.g. ★ Core Architecture"
                        />
                      </div>
                    </div>

                    {/* Description Text */}
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Milestone Description</label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => { setFormDescription(e.target.value); updateActiveMilestone({ description: e.target.value }); }}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Detail growth, course modules, or platforms build..."
                      />
                    </div>

                    {/* Skills Tag Input */}
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Skills Unlocked (Comma Separated)</label>
                      <input
                        type="text"
                        value={formSkillsText}
                        onChange={(e) => handleSkillsTextChange(e.target.value)}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                        placeholder="React, Next, Prisma, C++"
                      />
                    </div>

                    {/* Attached Achievement Dropdown */}
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Attached Achievement Credential</label>
                      <select
                        value={formAchievementId}
                        onChange={(e) => { setFormAchievementId(e.target.value); updateActiveMilestone({ achievementId: e.target.value, achievementText: getAttachedAchievementText(e.target.value) }); }}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                      >
                        <option value="none">None (No Badge Link)</option>
                        {achievementsDropdown.map((ach) => (
                          <option key={ach.id} value={ach.id}>
                            🏆 {ach.title} ({ach.organization})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Icon Selector & Timeline Theme */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Vector Icon Node</label>
                        <select
                          value={formIcon}
                          onChange={(e) => { setFormIcon(e.target.value); updateActiveMilestone({ icon: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Timeline Accent Theme</label>
                        <select
                          value={formColorTheme}
                          onChange={(e) => { setFormColorTheme(e.target.value); updateActiveMilestone({ colorTheme: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          {THEME_COLORS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRENT SUMMIT DESTINATION */}
          {activeTab === 'destination' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span>Mahi's Current Summit & Objectives</span>
                </h4>

                <button
                  onClick={() => handleSummitChange('show', !summitShow)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    summitShow 
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/25' 
                      : 'bg-muted border border-border text-muted-foreground hover:text-white'
                  }`}
                >
                  {summitShow ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{summitShow ? 'SHOW IN FRONTEND' : 'HIDDEN'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Status Goal Badge Label</label>
                    <input
                      type="text"
                      value={summitStatusLabel}
                      onChange={(e) => handleSummitChange('statusLabel', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                      placeholder="e.g. 🥇 THE SUMMIT / GOAL"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Target Focus</label>
                    <input
                      type="text"
                      value={summitMainGoal}
                      onChange={(e) => handleSummitChange('mainGoal', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white uppercase"
                      placeholder="e.g. AI + FULL STACK SYSTEMS"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Summit Description</label>
                  <textarea
                    rows={3}
                    value={summitDescription}
                    onChange={(e) => handleSummitChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Skills In Focus (Comma Separated)</label>
                  <input
                    type="text"
                    value={summitSkillsText}
                    onChange={(e) => handleSummitChange('skills', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    placeholder="AWS Infrastructure, Docker, Distributed Systems"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* =============================================================
           RIGHT COMPONENT: Center-Aligned Premium Vertical Timeline Preview
           ============================================================= */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-0 space-y-4">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-orange-400 font-black tracking-widest uppercase border-b border-border/40 pb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>🧗 REAL-TIME ROADMAP PREVIEW</span>
          </div>

          {/* Centered Single-Column Timeline simulated container */}
          <div className="w-full rounded-[28px] border border-white/5 bg-neutral-950 p-6 space-y-8 max-h-[600px] overflow-y-auto relative text-left">
            
            {/* START node */}
            <div className="w-full flex flex-col items-center select-none text-center">
              <div className="px-2.5 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-full">
                START
              </div>
              <div className="w-1 h-1 bg-neutral-800 mt-1" />
            </div>

            {/* Simulating centered list cards */}
            <div className="relative border-l border-white/10 pl-6 space-y-6 max-w-md mx-auto">
              
              {milestones
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((m) => {
                  const color = THEME_COLORS.find(c => c.id === m.colorTheme) || THEME_COLORS[0];
                  const iconMatch = ICON_OPTIONS.find(i => i.id === m.icon);
                  const isSelected = m.id === selectedMilestoneId;

                  return (
                    <div key={m.id} className="relative text-left">
                      {/* Timeline Dot with matching color */}
                      <div 
                        className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border bg-neutral-950"
                        style={{ borderColor: color.hex, boxShadow: `0 0 8px ${color.hex}40` }}
                      />

                      {/* Card rendering */}
                      <div className={`p-4 rounded-xl border bg-neutral-900/30 text-xs space-y-2 relative transition-all ${
                        isSelected ? 'border-primary shadow' : 'border-white/5'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-neutral-950 border border-white/5 text-zinc-400 uppercase tracking-widest leading-none">
                            {m.badgeText || 'Badge'}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-zinc-500">{m.year}</span>
                        </div>

                        <div>
                          <h5 className="font-bold text-white uppercase tracking-tight text-[11px] leading-tight flex items-center gap-1">
                            <span style={{ color: color.hex }}>
                              {iconMatch?.icon || <GraduationCap className="w-3.5 h-3.5" />}
                            </span>
                            <span>{m.title}</span>
                          </h5>
                          <span className="block text-[8px] font-mono text-zinc-500 uppercase mt-0.5">{m.phaseName}</span>
                        </div>

                        <p className="text-[10px] text-zinc-400 font-light font-sans leading-relaxed line-clamp-2">
                          {m.description}
                        </p>

                        {/* Unlocked tags */}
                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {m.skills.map((tag: string, tIdx: number) => (
                              <span key={tIdx} className="px-1.5 py-0.5 rounded text-[7.5px] font-mono bg-neutral-950 text-zinc-400 border border-white/5 leading-none">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Achievement attached chip preview */}
                        {m.achievementId && m.achievementId !== 'none' && (
                          <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-white/5 rounded text-[7.5px] text-zinc-400 leading-none">
                            <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="truncate">{m.achievementText || getAttachedAchievementText(m.achievementId)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

            </div>

            {/* Simulated Summit Destination Goal Card */}
            {summitShow && (
              <div className="mt-8 pt-4 border-t border-white/5 text-xs text-left max-w-md mx-auto">
                <div className="p-4 rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/5 to-neutral-950 space-y-2 relative shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase tracking-widest leading-none">
                      {summitStatusLabel}
                    </span>
                    <span className="text-[7.5px] font-mono text-neutral-500 uppercase font-black">ACTIVE NOW</span>
                  </div>

                  <h5 className="font-bold text-white uppercase text-[11px] leading-tight">
                    CURRENTLY BUILDING:<br />
                    <span className="text-orange-400">{summitMainGoal}</span>
                  </h5>

                  <p className="text-[10px] text-zinc-400 font-light font-sans leading-relaxed line-clamp-2">
                    {summitDescription}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {summitSkillsText.split(',').map(s => s.trim()).filter(s => s.length > 0).map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded text-[7.5px] font-mono bg-orange-500/5 text-orange-400 border border-orange-400/20 leading-none">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="p-4 bg-[#0c1220]/50 border border-blue-500/10 rounded-2xl text-[10px] text-blue-300 font-light font-sans leading-relaxed text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Centered timeline design:</strong> Aligns cards in a clean, vertical centered single-column layout for enhanced scannability, mobility optimization, and database fidelity.
            </span>
          </div>

        </div>

      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteMilestone}
        title="Delete Timeline Growth Milestone"
        message="Are you absolutely sure you want to permanently delete this milestones timeline card? Unlocked skills references and achievements bindings will be lost."
        confirmText="DELETE PERMANENTLY"
        loading={saving}
      />

    </div>
  );
}
