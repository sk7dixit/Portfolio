import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, Star, Trophy, Save, 
  ArrowUp, ArrowDown, Eye, EyeOff, X, Code, Sparkles, Activity,
  Info, BarChart2, Globe, Search, Filter, ShieldCheck, Cpu, Layers, CheckCircle2,
  Terminal, ArrowUpRight, Sliders, Settings, Award, Flame, Zap, Layout
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & PRESETS
   ───────────────────────────────────────────────────────────── */

const HIGHLIGHT_COLORS = [
  { id: 'orange', label: 'Orange', text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', hex: '#fb923c' },
  { id: 'blue',   label: 'Blue',   text: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/5',   hex: '#3b82f6' },
  { id: 'purple', label: 'Purple', text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', hex: '#a855f7' },
  { id: 'green',  label: 'Green',  text: 'text-emerald-400',border: 'border-emerald-500/20',bg: 'bg-emerald-500/5',hex: '#10b981' }
];

const TYPE_OPTIONS = [
  'Competition', 'Certification', 'Programming', 'Academic', 'Leadership', 'Research'
];

export default function AchievementsCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  // ── Tab Management ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'spotlight' | 'registry'>('registry');

  // ── Socket pipeline ─────────────────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Tab 1: Showcase Hero Settings ───────────────────────────
  const [badge, setBadge] = useState('AWARDS • PEER MILESTONES');
  const [heading, setHeading] = useState('MILESTONES & COMPETITIVE WINS');
  const [description, setDescription] = useState('Recognized achievements across competitive programming, hackathons and certifications.');

  // ── Tab 2: Statistics Strip Metrics ─────────────────────────
  const [stats, setStats] = useState<any[]>([
    { label: 'Problems Solved', value: '500+', subtitle: 'LeetCode' },
    { label: 'Vadodara Rank', value: '2nd / 100+', subtitle: 'Hackathon' },
    { label: 'Integrated Builds', value: '15+', subtitle: 'Projects' }
  ]);

  // ── Tab 3: Spotlight Achievement ────────────────────────────
  const [spotlightTitle, setSpotlightTitle] = useState('VADODARA HACKATHON RUNNER-UP WIN');
  const [spotlightSubtitle, setSpotlightSubtitle] = useState('HACKATHON WINNER // Vadodara Hackathon');
  const [spotlightOrganization, setSpotlightOrganization] = useState('Vadodara Hackathon');
  const [spotlightYear, setSpotlightYear] = useState('2024');
  const [spotlightDescription, setSpotlightDescription] = useState('Runner-up finish in the city-level hackathon out of 100+ competing developer teams...');
  const [spotlightResult, setSpotlightResult] = useState('🥈 2nd Place / 100+ Teams');
  const [spotlightLocation, setSpotlightLocation] = useState('Vadodara, India');
  const [spotlightBadge, setSpotlightBadge] = useState('Vadodara Rank 2nd');
  const [spotlightIcon, setSpotlightIcon] = useState('Trophy');
  const [spotlightCertLink, setSpotlightCertLink] = useState('');
  const [spotlightProofLink, setSpotlightProofLink] = useState('');
  const [spotlightGalleryImage, setSpotlightGalleryImage] = useState('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80');

  // ── Tab 4: Achievement Registry ─────────────────────────────
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [selectedAchId, setSelectedAchId] = useState<string | null>(null);

  // Form Fields for Achievements Registry
  const [formTitle, setFormTitle] = useState('');
  const [formOrganization, setFormOrganization] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formCategory, setFormCategory] = useState('Programming');
  const [formSummary, setFormSummary] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formType, setFormType] = useState('Programming');
  const [formHighlightColor, setFormHighlightColor] = useState('orange');

  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [achToDeleteId, setAchToDeleteId] = useState<string | null>(null);

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
    if (profile?.achievementsSection) {
      const sec = typeof profile.achievementsSection === 'string'
        ? JSON.parse(profile.achievementsSection)
        : profile.achievementsSection;

      setBadge(sec.badge || 'AWARDS • PEER MILESTONES');
      setHeading(sec.heading || 'MILESTONES & COMPETITIVE WINS');
      setDescription(sec.description || 'Recognized achievements across competitive programming, hackathons and certifications.');
      
      if (sec.stats) setStats(sec.stats);

      const spot = sec.spotlight || {};
      setSpotlightTitle(spot.title || 'VADODARA HACKATHON RUNNER-UP WIN');
      setSpotlightSubtitle(spot.subtitle || 'HACKATHON WINNER // Vadodara Hackathon');
      setSpotlightOrganization(spot.organization || 'Vadodara Hackathon');
      setSpotlightYear(spot.year || '2024');
      setSpotlightDescription(spot.description || 'Runner-up finish in the city-level hackathon out of 100+ competing developer teams...');
      setSpotlightResult(spot.result || '🥈 2nd Place / 100+ Teams');
      setSpotlightLocation(spot.location || 'Vadodara, India');
      setSpotlightBadge(spot.badge || 'Vadodara Rank 2nd');
      setSpotlightIcon(spot.icon || 'Trophy');
      setSpotlightCertLink(spot.certLink || '');
      setSpotlightProofLink(spot.proofLink || '');
      setSpotlightGalleryImage(spot.galleryImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80');

      setAchievementsList(sec.achievements || []);

      if (sec.achievements && sec.achievements.length > 0 && !selectedAchId) {
        selectAchievement(sec.achievements[0]);
      }
    } else {
      // Setup some default mock achievements if empty in database
      const defaultAchs = [
        { id: 'leetcode-streak', title: 'LeetCode Daily Active Streak', organization: 'LeetCode', year: '2024', category: 'Programming', summary: 'Solved 500+ coding problems focusing on optimization, memory efficiency and DSA.', badgeText: '500+ Solved', type: 'Programming', highlightColor: 'orange', order: 1 },
        { id: 'aws-practitioner', title: 'AWS Cloud Practitioner', organization: 'AWS Academy', year: '2024', category: 'Certification', summary: 'Validated architectural knowledge of cloud infrastructure, serverless deployments, securely partitioned subnets, and CDN caching layers.', badgeText: 'AWS Certified', type: 'Certification', highlightColor: 'blue', order: 2 },
        { id: 'networks-elite', title: 'Network Engineering Elite + Silver', organization: 'IIT Kharagpur / NPTEL', year: '2023', category: 'Academic', summary: 'Acquired formal engineering certification in routers, network protocols, switching topologies, and network performance optimizations.', badgeText: 'Top Percentile', type: 'Academic', highlightColor: 'purple', order: 3 }
      ];
      setAchievementsList(defaultAchs);
      if (defaultAchs.length > 0) {
        selectAchievement(defaultAchs[0]);
      }
    }
  }, [profile]);

  const selectAchievement = (ach: any) => {
    setSelectedAchId(ach.id);
    setFormTitle(ach.title || '');
    setFormOrganization(ach.organization || '');
    setFormYear(ach.year || '');
    setFormCategory(ach.category || 'Programming');
    setFormSummary(ach.summary || '');
    setFormBadgeText(ach.badgeText || '');
    setFormType(ach.type || 'Programming');
    setFormHighlightColor(ach.highlightColor || 'orange');
  };

  const getCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      badge,
      heading,
      description,
      stats,
      spotlight: {
        title: spotlightTitle,
        subtitle: spotlightSubtitle,
        organization: spotlightOrganization,
        year: spotlightYear,
        description: spotlightDescription,
        result: spotlightResult,
        location: spotlightLocation,
        badge: spotlightBadge,
        icon: spotlightIcon,
        certLink: spotlightCertLink,
        proofLink: spotlightProofLink,
        galleryImage: spotlightGalleryImage
      },
      achievements: achievementsList,
      ...overrides
    };
  };

  const emitSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('achievements:update', {
        slug: user.portfolioSlug,
        achievementsSection: newSec
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

  const handleSpotlightFieldChange = (field: string, val: string) => {
    let updated = getCombinedSection();
    if (field === 'title') { setSpotlightTitle(val); updated.spotlight.title = val; }
    else if (field === 'subtitle') { setSpotlightSubtitle(val); updated.spotlight.subtitle = val; }
    else if (field === 'organization') { setSpotlightOrganization(val); updated.spotlight.organization = val; }
    else if (field === 'year') { setSpotlightYear(val); updated.spotlight.year = val; }
    else if (field === 'description') { setSpotlightDescription(val); updated.spotlight.description = val; }
    else if (field === 'result') { setSpotlightResult(val); updated.spotlight.result = val; }
    else if (field === 'location') { setSpotlightLocation(val); updated.spotlight.location = val; }
    else if (field === 'badge') { setSpotlightBadge(val); updated.spotlight.badge = val; }
    else if (field === 'icon') { setSpotlightIcon(val); updated.spotlight.icon = val; }
    else if (field === 'certLink') { setSpotlightCertLink(val); updated.spotlight.certLink = val; }
    else if (field === 'proofLink') { setSpotlightProofLink(val); updated.spotlight.proofLink = val; }
    else if (field === 'galleryImage') { setSpotlightGalleryImage(val); updated.spotlight.galleryImage = val; }
    emitSectionUpdate(updated);
  };

  // ── Tab 2: Stats strip editor ──────────────────────────────
  const handleStatFieldChange = (index: number, field: string, val: string) => {
    const nextStats = stats.map((s, idx) => {
      if (idx === index) {
        return { ...s, [field]: val };
      }
      return s;
    });
    setStats(nextStats);
    emitSectionUpdate(getCombinedSection({ stats: nextStats }));
  };

  const addStatCard = () => {
    const nextStats = [...stats, { label: 'New Metric', value: '100+', subtitle: 'Score' }];
    setStats(nextStats);
    emitSectionUpdate(getCombinedSection({ stats: nextStats }));
  };

  const deleteStatCard = (index: number) => {
    const nextStats = stats.filter((_, idx) => idx !== index);
    setStats(nextStats);
    emitSectionUpdate(getCombinedSection({ stats: nextStats }));
  };

  const handleStatReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stats.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextStats = [...stats];
    const temp = nextStats[index];
    nextStats[index] = nextStats[targetIdx];
    nextStats[targetIdx] = temp;

    setStats(nextStats);
    emitSectionUpdate(getCombinedSection({ stats: nextStats }));
  };

  // ── Tab 4: Registry functions ──────────────────────────────
  const createNewAchievement = () => {
    const nextId = `ach-${Date.now()}`;
    const newEntry = {
      id: nextId,
      title: 'New Award Achievement',
      organization: 'Issuer Body',
      year: '2025',
      category: 'Competition',
      summary: 'Acquired prestigious competitive placement validating core problem-solving capability...',
      badgeText: 'Award Winner',
      type: 'Competition',
      highlightColor: 'orange',
      order: achievementsList.length + 1
    };

    const nextList = [...achievementsList, newEntry];
    setAchievementsList(nextList);
    selectAchievement(newEntry);
    emitSectionUpdate(getCombinedSection({ achievements: nextList }));
    setSuccess('New achievement registered in timeline registry!');
  };

  const updateActiveAchievement = (updatedFields: Partial<any>) => {
    if (!selectedAchId) return;
    const nextList = achievementsList.map((item) => {
      if (item.id === selectedAchId) {
        return { ...item, ...updatedFields };
      }
      return item;
    });

    setAchievementsList(nextList);
    emitSectionUpdate(getCombinedSection({ achievements: nextList }));
  };

  const startDeleteAchievement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAchToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeleteAchievement = () => {
    if (!achToDeleteId) return;
    const nextList = achievementsList.filter(item => item.id !== achToDeleteId);
    setAchievementsList(nextList);
    setIsConfirmOpen(false);
    setAchToDeleteId(null);
    if (selectedAchId === achToDeleteId) {
      if (nextList.length > 0) {
        selectAchievement(nextList[0]);
      } else {
        setSelectedAchId(null);
      }
    }
    emitSectionUpdate(getCombinedSection({ achievements: nextList }));
    setSuccess('Timeline achievement deleted successfully.');
  };

  const handleRegistryReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === achievementsList.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextList = [...achievementsList];
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;

    const finalized = nextList.map((ach, idx) => ({ ...ach, order: idx + 1 }));
    setAchievementsList(finalized);
    emitSectionUpdate(getCombinedSection({ achievements: finalized }));
  };

  const saveAchievementsSection = async () => {
    setSaving(true);
    try {
      const dbPayload = getCombinedSection();
      await api.patch('/portfolio/profile', {
        achievementsSection: dbPayload
      });
      setSuccess('Achievements synced successfully with PostgreSQL!');
      await fetchEverything();
    } catch (err: any) {
      console.error('SaveAchievementsSection Error:', err);
      setError(err.response?.data?.message || 'Failed to sync achievements to database.');
    } finally {
      setSaving(false);
    }
  };

  const activeAch = achievementsList.find(a => a.id === selectedAchId) || null;

  return (
    <div className="space-y-6 animate-fade-in pr-2 pb-6">
      
      {/* CMS Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Achievements CMS Operating System</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage professional competitive awards, hackathon highlights, and telemetry active metrics.</p>
        </div>

        <button
          onClick={saveAchievementsSection}
          disabled={saving}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SYNCING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      {/* Mobile Tab Select Dropdown */}
      <div className="block md:hidden mb-4 relative animate-fade-in w-full">
        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Select Section
        </label>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className="w-full bg-[#0a0a0c] border border-border/80 focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-white font-mono cursor-pointer appearance-none shadow-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            backgroundSize: '16px'
          }}
        >
          {[
            { id: 'registry', label: '1. Achievement Registry' },
            { id: 'hero', label: '2. Showcase Hero' },
            { id: 'stats', label: '3. Statistics Strip' },
            { id: 'spotlight', label: '4. Spotlight Achievement' }
          ].map((t) => (
            <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs Control Row */}
      <div className="hidden md:flex flex-wrap gap-1 bg-background/50 border border-border/60 p-1 rounded-xl">
        {[
          { id: 'registry', label: 'Achievement Registry', icon: <Trophy className="w-3.5 h-3.5" /> },
          { id: 'hero', label: 'Showcase Hero', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'stats', label: 'Statistics Strip', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          { id: 'spotlight', label: 'Spotlight Achievement', icon: <Sparkles className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border-none ${
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
        
        {/* LEFT PANEL: CMS Tab Editor contents */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: SHOWCASE HERO */}
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
                    placeholder="e.g. AWARDS • PEER MILESTONES"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Main Heading</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => handleGlobalHeroChange('heading', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white uppercase"
                    placeholder="e.g. MILESTONES & COMPETITIVE WINS"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Showcase Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => handleGlobalHeroChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                    placeholder="Recognized achievements across competitive programming, hackathons and certifications..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATISTICS STRIP */}
          {activeTab === 'stats' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Telemetry Metrics Strip Cards ({stats.length})</span>
                </h4>

                <button
                  onClick={addStatCard}
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD METRIC</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {stats.length === 0 ? (
                  <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
                    <span className="text-xs text-muted-foreground">No metrics set. Add cards to display stats on top of achievements.</span>
                  </div>
                ) : (
                  stats.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-background border border-border rounded-2xl space-y-3 relative group">
                      
                      <div className="flex justify-between items-center pb-2 border-b border-white/[0.03]">
                        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Metric Card #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleStatReorder(idx, 'up')}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-white rounded disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === stats.length - 1}
                            onClick={() => handleStatReorder(idx, 'down')}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-white rounded disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteStatCard(idx)}
                            className="p-1 hover:bg-red-950/20 text-muted-foreground hover:text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[8px] font-bold text-zinc-400 uppercase mb-1">Metric Value</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatFieldChange(idx, 'value', e.target.value)}
                            className="w-full bg-background border border-border focus:outline-none px-2 py-1.5 rounded text-xs text-white font-mono font-bold"
                            placeholder="e.g. 500+"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-zinc-400 uppercase mb-1">Metric Name</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleStatFieldChange(idx, 'label', e.target.value)}
                            className="w-full bg-background border border-border focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                            placeholder="e.g. Problems Solved"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-zinc-400 uppercase mb-1">Metric Subtitle</label>
                          <input
                            type="text"
                            value={stat.subtitle}
                            onChange={(e) => handleStatFieldChange(idx, 'subtitle', e.target.value)}
                            className="w-full bg-background border border-border focus:outline-none px-2 py-1.5 rounded text-xs text-white"
                            placeholder="e.g. LeetCode"
                          />
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SPOTLIGHT ACHIEVEMENT */}
          {activeTab === 'spotlight' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Victory Wall Flagship Spotlight Configuration</span>
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Spotlight Title</label>
                    <input
                      type="text"
                      value={spotlightTitle}
                      onChange={(e) => handleSpotlightFieldChange('title', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Spotlight Subtitle</label>
                    <input
                      type="text"
                      value={spotlightSubtitle}
                      onChange={(e) => handleSpotlightFieldChange('subtitle', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Organization</label>
                    <input
                      type="text"
                      value={spotlightOrganization}
                      onChange={(e) => handleSpotlightFieldChange('organization', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Location</label>
                    <input
                      type="text"
                      value={spotlightLocation}
                      onChange={(e) => handleSpotlightFieldChange('location', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Year Date</label>
                    <input
                      type="text"
                      value={spotlightYear}
                      onChange={(e) => handleSpotlightFieldChange('year', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Spotlight Badge Text</label>
                    <input
                      type="text"
                      value={spotlightBadge}
                      onChange={(e) => handleSpotlightFieldChange('badge', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Award Result Placement</label>
                    <input
                      type="text"
                      value={spotlightResult}
                      onChange={(e) => handleSpotlightFieldChange('result', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={spotlightDescription}
                    onChange={(e) => handleSpotlightFieldChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Certificate Link URL (Optional)</label>
                    <input
                      type="url"
                      value={spotlightCertLink}
                      onChange={(e) => handleSpotlightFieldChange('certLink', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Official Proof URL (Optional)</label>
                    <input
                      type="url"
                      value={spotlightProofLink}
                      onChange={(e) => handleSpotlightFieldChange('proofLink', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                      placeholder="https://hackathon.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Spotlight Artwork/Gallery Image</label>
                  <input
                    type="text"
                    value={spotlightGalleryImage}
                    onChange={(e) => handleSpotlightFieldChange('galleryImage', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACHIEVEMENT REGISTRY (TIMELINE) */}
          {activeTab === 'registry' && (
            <div className="space-y-6 text-left">
              
              {/* Timeline Registry Index */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Timeline Achievements Registry ({achievementsList.length})</span>
                  </h4>

                  <button
                    onClick={createNewAchievement}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD ACHIEVEMENT</span>
                  </button>
                </div>

                {/* Compact List layout */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {achievementsList.length === 0 ? (
                    <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
                      <span className="text-xs text-muted-foreground">No timeline achievements registered yet.</span>
                    </div>
                  ) : (
                    achievementsList
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((ach, idx) => {
                        const isSelected = ach.id === selectedAchId;
                        return (
                          <div
                            key={ach.id}
                            onClick={() => selectAchievement(ach)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-primary/20 ${
                              isSelected 
                                ? 'bg-neutral-900 border-primary text-white shadow-sm' 
                                : 'bg-background border-border text-muted-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 truncate">
                              <Trophy className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-neutral-500'}`} />
                              <div className="truncate text-left">
                                <h5 className={`text-xs font-bold truncate uppercase ${isSelected ? 'text-primary' : 'text-white'}`}>{ach.title}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">{ach.organization}</span>
                                  <span className="text-neutral-700 text-[8px]">•</span>
                                  <span className="text-[9px] font-mono text-zinc-400 font-bold">{ach.category} ({ach.year})</span>
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
                                disabled={idx === achievementsList.length - 1}
                                onClick={() => handleRegistryReorder(idx, 'down')}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => startDeleteAchievement(ach.id, e)}
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

              {/* Form specs editor */}
              {activeAch && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-left animate-fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Registry Editor Profile: {formTitle || 'Active Item'}</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Achievement Title</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => { setFormTitle(e.target.value); updateActiveAchievement({ title: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Organization / Issuer</label>
                        <input
                          type="text"
                          value={formOrganization}
                          onChange={(e) => { setFormOrganization(e.target.value); updateActiveAchievement({ organization: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Year Date</label>
                        <input
                          type="text"
                          value={formYear}
                          onChange={(e) => { setFormYear(e.target.value); updateActiveAchievement({ year: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                          placeholder="e.g. 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Category Section</label>
                        <input
                          type="text"
                          value={formCategory}
                          onChange={(e) => { setFormCategory(e.target.value); updateActiveAchievement({ category: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Achievement Badge Text</label>
                        <input
                          type="text"
                          value={formBadgeText}
                          onChange={(e) => { setFormBadgeText(e.target.value); updateActiveAchievement({ badgeText: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                          placeholder="e.g. 500+ Solved"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Achievement Type Category</label>
                        <select
                          value={formType}
                          onChange={(e) => { setFormType(e.target.value); updateActiveAchievement({ type: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          {TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Timeline Color Highlight</label>
                        <select
                          value={formHighlightColor}
                          onChange={(e) => { setFormHighlightColor(e.target.value); updateActiveAchievement({ highlightColor: e.target.value }); }}
                          className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3 py-2 rounded-xl text-xs text-white cursor-pointer"
                        >
                          {HIGHLIGHT_COLORS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Achievement Description Summary</label>
                      <textarea
                        rows={3}
                        value={formSummary}
                        onChange={(e) => { setFormSummary(e.target.value); updateActiveAchievement({ summary: e.target.value }); }}
                        className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                        placeholder="Solved 500+ coding problems focusing on optimization, memory efficiency and DSA..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* =============================================================
           RIGHT STICKY PANEL: High-Fidelity Split Pane Real-Time Live Preview
           ============================================================= */}
        <div className="lg:col-span-5 h-full lg:sticky lg:top-0 space-y-4">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase border-b border-border/40 pb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>🏆 LIVE SPOTLIGHT PREVIEW</span>
          </div>

          {/* Simulated Spotlight Card Render (Victory Wall) */}
          <div className="w-full rounded-[28px] border border-amber-500/25 bg-gradient-to-br from-amber-500/5 via-neutral-950/80 to-neutral-950 p-6 flex flex-col items-center justify-between gap-6 hover:border-amber-500/40 transition-all duration-500 relative group shadow-2xl overflow-hidden text-left">
            <div className="absolute -inset-1 rounded-[29px] bg-gradient-to-br from-amber-500/10 to-transparent blur-xl opacity-50 pointer-events-none" />

            <div className="space-y-4 flex-1 text-left relative z-10 w-full">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                </span>
                <span className="text-[8px] font-mono tracking-widest text-amber-400 font-bold uppercase truncate max-w-[80%]">
                  {spotlightSubtitle || 'SPOTLIGHT WIN'}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-tight leading-snug font-display leading-tight line-clamp-2">
                  {spotlightTitle || 'VADODARA HACKATHON WIN'}
                </h3>
                <p className="text-neutral-400 text-[10.5px] font-light leading-relaxed font-sans line-clamp-3">
                  {spotlightDescription || 'Winner specifications...'}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-3.5 border-t border-white/5 text-[9px] font-mono">
                <div>
                  <span className="text-[7.5px] tracking-widest text-neutral-500 font-bold uppercase block leading-none mb-1">Result</span>
                  <span className="font-bold text-amber-400 leading-none">{spotlightResult || '🥇 1st Place'}</span>
                </div>
                <div>
                  <span className="text-[7.5px] tracking-widest text-neutral-500 font-bold uppercase block leading-none mb-1">Location</span>
                  <span className="text-neutral-300 leading-none">{spotlightLocation || 'Vadodara'} ({spotlightYear})</span>
                </div>
              </div>
            </div>

            {/* Simulated floating orbit trophy */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/5 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] relative shrink-0">
              <Trophy className="w-6 h-6 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] animate-bounce" style={{ animationDuration: '4s' }} />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            </div>

          </div>

          {/* Quick Registry Card Design Preview */}
          {activeAch && (
            <div className="p-4 rounded-xl border border-white/5 bg-neutral-950 text-left space-y-2 shadow">
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">// Registry Compact Card Preview</span>
              <div className="flex items-center justify-between gap-3 p-2 bg-neutral-900/40 border border-white/5 rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <Trophy className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="truncate font-mono">
                    <span className="text-xs font-bold text-white uppercase block truncate">{formTitle}</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">{formOrganization} ({formYear})</span>
                  </div>
                </div>
                {formBadgeText && (
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase tracking-wider shrink-0 leading-none">
                    {formBadgeText}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-4 bg-[#0c1220]/50 border border-blue-500/10 rounded-2xl text-[10px] text-blue-300 font-light font-sans leading-relaxed text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>轻量 (Lightweight) design:</strong> Renders top stats strips, cinematic victories wall, and registry lists without nested bloated states.
            </span>
          </div>

        </div>

      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteAchievement}
        title="Delete Registered Achievement Profile"
        message="Are you absolutely sure you want to permanently delete this timeline achievement? All verified descriptions and badges will be lost."
        confirmText="DELETE PERMANENTLY"
        loading={saving}
      />

    </div>
  );
}
