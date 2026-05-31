import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles, Save, Upload, Plus, Trash2, ArrowUp, ArrowDown, X, Layers,
  Globe, Info, Laptop, Tablet, Smartphone, Code2, GraduationCap, Trophy,
  Activity, Sliders, ChevronDown, ChevronUp, Link as LinkIcon
} from 'lucide-react';

export default function MSBrandIdentityStudio() {
  const { activePortfolio } = usePortfolio();
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);
  const user = useStore((state) => state.user);

  // Preview Mode State (Desktop, Tablet, Mobile)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>('navbar');

  // --- MS BRAND IDENTITY STATES ---
  
  // Section 1: Navbar
  const [navbar, setNavbar] = useState({
    brandName: "Mahi Singh",
    statusDotColor: "#f97316",
    resumeButtonText: "Resume",
    resumeUrl: ""
  });

  // Section 2: Hero Intro
  const [hero, setHero] = useState({
    introHeadingLine1: "Hi, I'm",
    mainName: "Mahi Singh",
    accentGradientStart: "#fb923c",
    accentGradientEnd: "#f59e0b",
    availabilityBadge: "B.Tech CSE Student // AVAILABLE FOR ROLES",
    subtitleLine1: "Building Digital Experiences",
    subtitleLine2: "For Modern Businesses"
  });

  // Section 4: Biography
  const [biography, setBiography] = useState({
    biography: "I’m a Computer Science Engineering student passionate about crafting clean interfaces, AI-driven automations, and robust MERN systems that combine fluid design with powerful frontend logic."
  });

  // Section 5: CTA Buttons
  const [ctas, setCtas] = useState({
    primaryCTAText: "View My Work",
    primaryCTAUrl: "projects",
    secondaryCTAText: "Let's Connect",
    secondaryCTAUrl: "contact"
  });

  // Section 6: Background Media
  const [backgroundMedia, setBackgroundMedia] = useState({
    heroBackgroundImage: "/mahi.mp4",
    overlayStrength: 0.28,
    blurIntensity: 0,
    darkGradientOpacity: 0.12
  });

  // Section 7: About Section
  const [aboutSection, setAboutSection] = useState({
    aboutHeading: "ABOUT",
    aboutMainText: "Building modern web applications with clean code, smart AI features, and user-friendly designs.",
    leftAccentLineColor: "#f97316"
  });

  // Section 8: Timeline Milestones
  const [timeline, setTimeline] = useState<any[]>([
    {
      year: "2023",
      label: "College Start",
      title: "Started B.Tech CSE",
      description: "Began my Computer Science degree. Focused on the basics of programming in C and C++, learning how databases work, and solving simple logic challenges.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "2024",
      label: "Building Websites",
      title: "Web Development",
      description: "Dived into web development. Learned how to build complete websites using React, Node.js, Express, and database systems with simple and clear designs.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "2025",
      label: "Smart Tools",
      title: "AI & Mapping Apps",
      description: "Started connecting AI models and maps to my web projects. Built a smart Accident Hotspot app that maps out high-risk traffic intersections in real time.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "Current",
      label: "Daily Practice",
      title: "Algorithms & Practice",
      description: "Currently practicing coding algorithms in Java, learning how to design solid systems, and building helpful projects.",
      activeDotColor: "#f97316",
      currentStage: true
    }
  ]);

  // Section 9: About Overview Card
  const [overviewCard, setOverviewCard] = useState({
    education: {
      degree: "B.Tech in Computer Science",
      university: "Parul University",
      duration: "2023 — 2027",
      grade: "8.37 CGPA"
    },
    focus: {
      focusHeading: "Current Focus",
      focusDescription: "Building responsive websites, studying AI integrations, and learning to write clean, efficient code."
    },
    techStack: ["Python", "React.js", "Next.js", "MongoDB", "AWS"],
    highlights: [
      { label: "College CGPA", value: "8.37" },
      { label: "Hackathon Rank", value: "Top 6%" },
      { label: "AWS Certified", value: "AWS" },
      { label: "Core Focus", value: "AI + Web" }
    ],
    availability: {
      availabilityText: "Available for projects and collaboration",
      availabilityEnabled: true
    }
  });

  // Section 10: Visual Settings
  const [visualSettings, setVisualSettings] = useState({
    primaryAccent: "#f97316",
    secondaryAccent: "#fb923c",
    glowColor: "rgba(251, 146, 60, 0.15)",
    cardGlassOpacity: 0.1
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Temporary States for repeaters
  const [newTechTag, setNewTechTag] = useState('');
  const [newHighlightLabel, setNewHighlightLabel] = useState('');
  const [newHighlightValue, setNewHighlightValue] = useState('');
  
  // Timeline entry additions
  const [newYear, setNewYear] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDotColor, setNewDotColor] = useState('#f97316');
  const [newCurrentStage, setNewCurrentStage] = useState(false);

  // Load Brand Identity on Mount
  const loadBrandIdentity = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ms/brand-identity');
      if (res.data.data.brandIdentity) {
        const doc = res.data.data.brandIdentity;
        if (doc.navbar) setNavbar({ ...navbar, ...doc.navbar });
        if (doc.hero) setHero({ ...hero, ...doc.hero });
        if (doc.biography) setBiography({ ...biography, ...doc.biography });
        if (doc.ctas) setCtas({ ...ctas, ...doc.ctas });
        if (doc.backgroundMedia) setBackgroundMedia({ ...backgroundMedia, ...doc.backgroundMedia });
        if (doc.aboutSection) setAboutSection({ ...aboutSection, ...doc.aboutSection });
        if (doc.timeline) setTimeline(doc.timeline);
        if (doc.overviewCard) setOverviewCard({ ...overviewCard, ...doc.overviewCard });
        if (doc.visualSettings) setVisualSettings({ ...visualSettings, ...doc.visualSettings });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Mahi Brand Identity specifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrandIdentity();
  }, []);

  // Connect Socket.IO for Live Refresh
  useEffect(() => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'mahi';
    const s = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
    s.emit('portfolio:join', targetSlug);
    setSocket(s);

    s.on('brand_identity_ms:updated', (payload: any) => {
      if (payload.brandIdentity) {
        const doc = payload.brandIdentity;
        if (doc.navbar) setNavbar(doc.navbar);
        if (doc.hero) setHero(doc.hero);
        if (doc.biography) setBiography(doc.biography);
        if (doc.ctas) setCtas(doc.ctas);
        if (doc.backgroundMedia) setBackgroundMedia(doc.backgroundMedia);
        if (doc.aboutSection) setAboutSection(doc.aboutSection);
        if (doc.timeline) setTimeline(doc.timeline);
        if (doc.overviewCard) setOverviewCard(doc.overviewCard);
        if (doc.visualSettings) setVisualSettings(doc.visualSettings);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [activePortfolio, user?.portfolioSlug]);

  const emitLiveUpdate = (updatedDoc: any) => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'mahi';
    if (socket) {
      socket.emit('brand_identity_ms:update', {
        slug: targetSlug,
        brandIdentity: updatedDoc
      });
    }
  };

  // --- SAVE OPERATION ---
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        navbar,
        hero,
        biography,
        ctas,
        backgroundMedia,
        aboutSection,
        timeline,
        overviewCard,
        visualSettings
      };

      const res = await api.post('/ms/brand-identity', payload);
      setSuccess('MS Brand Identity specifications updated successfully.');
      emitLiveUpdate(res.data.data.brandIdentity);
    } catch (err) {
      console.error(err);
      setError('Failed to save MS Brand Identity configurations.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOCAL UPLOAD HANDLERS ---
  const handleBgMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingBg(true);

    try {
      const res = await api.post('/ms/brand-identity/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBackgroundMedia({ ...backgroundMedia, heroBackgroundImage: res.data.data.url });
      setSuccess('Background Media asset uploaded successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to upload Background Media asset.');
    } finally {
      setUploadingBg(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);

    try {
      const res = await api.post('/ms/brand-identity/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNavbar({ ...navbar, resumeUrl: res.data.data.url });
      setSuccess('Resume document uploaded successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to upload Resume document.');
    } finally {
      setUploadingResume(false);
    }
  };

  // --- REPEATERS LOGIC ---

  // Tech Stack Tags
  const addTechTag = () => {
    const tag = newTechTag.trim();
    if (tag && !overviewCard.techStack.includes(tag)) {
      const updatedList = [...overviewCard.techStack, tag];
      setOverviewCard({
        ...overviewCard,
        techStack: updatedList
      });
      setNewTechTag('');
    }
  };

  const removeTechTag = (tag: string) => {
    const updatedList = overviewCard.techStack.filter(t => t !== tag);
    setOverviewCard({
      ...overviewCard,
      techStack: updatedList
    });
  };

  // Key Highlights Stats
  const addHighlight = () => {
    const lbl = newHighlightLabel.trim();
    const val = newHighlightValue.trim();
    if (lbl && val) {
      const updatedList = [...overviewCard.highlights, { label: lbl, value: val }];
      setOverviewCard({
        ...overviewCard,
        highlights: updatedList
      });
      setNewHighlightLabel('');
      setNewHighlightValue('');
    }
  };

  const removeHighlight = (idx: number) => {
    const updatedList = overviewCard.highlights.filter((_, i) => i !== idx);
    setOverviewCard({
      ...overviewCard,
      highlights: updatedList
    });
  };

  // Timeline entry addition
  const addTimelineEntry = () => {
    const yr = newYear.trim();
    const ttl = newTitle.trim();
    const lbl = newLabel.trim();
    const desc = newDesc.trim();

    if (yr && ttl && desc) {
      const newEntry = {
        year: yr,
        label: lbl || "Milestone",
        title: ttl,
        description: desc,
        activeDotColor: newDotColor,
        currentStage: newCurrentStage
      };

      const updated = [...timeline, newEntry];
      setTimeline(updated);

      // Reset Form fields
      setNewYear('');
      setNewLabel('');
      setNewTitle('');
      setNewDesc('');
      setNewDotColor('#f97316');
      setNewCurrentStage(false);
    }
  };

  const removeTimelineEntry = (idx: number) => {
    const updated = timeline.filter((_, i) => i !== idx);
    setTimeline(updated);
  };

  const moveTimelineEntry = (index: number, direction: 'up' | 'down') => {
    const updated = [...timeline];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      setTimeline(updated);
    }
  };

  // Auto Sort timeline chronologically
  const autoSortTimeline = () => {
    const sorted = [...timeline].sort((a, b) => {
      if (a.year.toLowerCase() === 'current') return 1;
      if (b.year.toLowerCase() === 'current') return -1;
      return a.year.localeCompare(b.year);
    });
    setTimeline(sorted);
    setSuccess('Timeline sorted chronologically.');
  };

  // Accordion Toggle helper
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Dynamic preview helper values
  const textGradStyle = {
    backgroundImage: `linear-gradient(to right, ${hero.accentGradientStart}, ${hero.accentGradientEnd})`
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>MS Portfolio Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Brand Identity Studio (About Engine)</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Configure Mahi's cinematic storytelling hero, narrative biography, journey timelines, and responsive visual settings.
          </p>
        </div>
        <div>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Brand Identity'}</span>
          </button>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: EDITING ACCORDIONS (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3.5">

          {/* SECTION 1: NAVBAR IDENTITY */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('navbar')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>Section 1 — Navigation Identity</span>
              </span>
              {activeSection === 'navbar' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'navbar' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Brand Logo Name</label>
                    <input
                      type="text"
                      value={navbar.brandName}
                      onChange={(e) => setNavbar({ ...navbar, brandName: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Status Indicator Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={navbar.statusDotColor}
                        onChange={(e) => setNavbar({ ...navbar, statusDotColor: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={navbar.statusDotColor}
                        onChange={(e) => setNavbar({ ...navbar, statusDotColor: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Resume Button Text</label>
                    <input
                      type="text"
                      value={navbar.resumeButtonText}
                      onChange={(e) => setNavbar({ ...navbar, resumeButtonText: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Resume PDF URL</label>
                    <input
                      type="text"
                      value={navbar.resumeUrl}
                      onChange={(e) => setNavbar({ ...navbar, resumeUrl: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground mb-2"
                      placeholder="/uploads/portfolio/ms/resume.pdf"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground font-semibold rounded-lg cursor-pointer max-w-xs">
                      <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{uploadingResume ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: HERO INTRO */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('heroIntro')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Section 2 — Hero Introduction</span>
              </span>
              {activeSection === 'heroIntro' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'heroIntro' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Intro Salutation</label>
                    <input
                      type="text"
                      value={hero.introHeadingLine1}
                      onChange={(e) => setHero({ ...hero, introHeadingLine1: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Developer Main Name</label>
                    <input
                      type="text"
                      value={hero.mainName}
                      onChange={(e) => setHero({ ...hero, mainName: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Accent Gradient Start</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={hero.accentGradientStart}
                        onChange={(e) => setHero({ ...hero, accentGradientStart: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.accentGradientStart}
                        onChange={(e) => setHero({ ...hero, accentGradientStart: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Accent Gradient End</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={hero.accentGradientEnd}
                        onChange={(e) => setHero({ ...hero, accentGradientEnd: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.accentGradientEnd}
                        onChange={(e) => setHero({ ...hero, accentGradientEnd: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-neutral-400 font-medium mb-1.5">Availability Badge Text</label>
                    <input
                      type="text"
                      value={hero.availabilityBadge}
                      onChange={(e) => setHero({ ...hero, availabilityBadge: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: HERO SUBTITLE */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('heroSubtitle')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Section 3 — Hero Subtitles</span>
              </span>
              {activeSection === 'heroSubtitle' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'heroSubtitle' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Fixed Subtitle Line</label>
                    <input
                      type="text"
                      value={hero.subtitleLine1}
                      onChange={(e) => setHero({ ...hero, subtitleLine1: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Interactive Subtitle Line (Live Rotate)</label>
                    <input
                      type="text"
                      value={hero.subtitleLine2}
                      onChange={(e) => setHero({ ...hero, subtitleLine2: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: BIOGRAPHY */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('biography')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Section 4 — Biography</span>
              </span>
              {activeSection === 'biography' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'biography' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Main Biography Paragraph</label>
                  <textarea
                    value={biography.biography}
                    onChange={(e) => setBiography({ ...biography, biography: e.target.value })}
                    rows={4}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: CTA BUTTONS */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('ctas')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-orange-400" />
                <span>Section 5 — CTA Action Buttons</span>
              </span>
              {activeSection === 'ctas' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'ctas' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Primary CTA Label</label>
                    <input
                      type="text"
                      value={ctas.primaryCTAText}
                      onChange={(e) => setCtas({ ...ctas, primaryCTAText: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Primary CTA Link Target (anchor/ID)</label>
                    <input
                      type="text"
                      value={ctas.primaryCTAUrl}
                      onChange={(e) => setCtas({ ...ctas, primaryCTAUrl: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Secondary CTA Label</label>
                    <input
                      type="text"
                      value={ctas.secondaryCTAText}
                      onChange={(e) => setCtas({ ...ctas, secondaryCTAText: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Secondary CTA Link Target (anchor/ID)</label>
                    <input
                      type="text"
                      value={ctas.secondaryCTAUrl}
                      onChange={(e) => setCtas({ ...ctas, secondaryCTAUrl: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: BACKGROUND MEDIA */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('bgMedia')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>Section 6 — Background Media & Opacities</span>
              </span>
              {activeSection === 'bgMedia' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'bgMedia' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Background Image/Video URL</label>
                  <input
                    type="text"
                    value={backgroundMedia.heroBackgroundImage}
                    onChange={(e) => setBackgroundMedia({ ...backgroundMedia, heroBackgroundImage: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground mb-2"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground font-semibold rounded-lg cursor-pointer max-w-xs">
                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{uploadingBg ? 'Uploading...' : 'Upload Media'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleBgMediaUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Overlay Strength: {backgroundMedia.overlayStrength}</label>
                    <input
                      type="range"
                      min="0"
                      max="0.9"
                      step="0.05"
                      value={backgroundMedia.overlayStrength}
                      onChange={(e) => setBackgroundMedia({ ...backgroundMedia, overlayStrength: parseFloat(e.target.value) })}
                      className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Blur Intensity: {backgroundMedia.blurIntensity}px</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={backgroundMedia.blurIntensity}
                      onChange={(e) => setBackgroundMedia({ ...backgroundMedia, blurIntensity: parseInt(e.target.value) })}
                      className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Center Glow Strength: {backgroundMedia.darkGradientOpacity}</label>
                    <input
                      type="range"
                      min="0"
                      max="0.4"
                      step="0.02"
                      value={backgroundMedia.darkGradientOpacity}
                      onChange={(e) => setBackgroundMedia({ ...backgroundMedia, darkGradientOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 7: ABOUT SECTION */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('aboutSection')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-400" />
                <span>Section 7 — About Narratives</span>
              </span>
              {activeSection === 'aboutSection' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'aboutSection' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">About Section Title</label>
                    <input
                      type="text"
                      value={aboutSection.aboutHeading}
                      onChange={(e) => setAboutSection({ ...aboutSection, aboutHeading: e.target.value })}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Left Accent Line Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={aboutSection.leftAccentLineColor}
                        onChange={(e) => setAboutSection({ ...aboutSection, leftAccentLineColor: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={aboutSection.leftAccentLineColor}
                        onChange={(e) => setAboutSection({ ...aboutSection, leftAccentLineColor: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-neutral-400 font-medium mb-1.5">About Narrative Heading Statement</label>
                    <textarea
                      value={aboutSection.aboutMainText}
                      onChange={(e) => setAboutSection({ ...aboutSection, aboutMainText: e.target.value })}
                      rows={2}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-foreground resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 8: JOURNEY TIMELINE */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('timeline')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <span>Section 8 — Journey Timeline CMS</span>
              </span>
              {activeSection === 'timeline' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'timeline' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                {/* Timeline Sort Tools */}
                <div className="flex justify-between items-center bg-muted/20 border border-border/30 p-3 rounded-xl">
                  <span className="text-[10px] text-muted-foreground font-mono">Milestones: {timeline.length} items</span>
                  <button
                    type="button"
                    onClick={autoSortTimeline}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 cursor-pointer text-[10px]"
                  >
                    Auto Chronological Sort
                  </button>
                </div>

                {/* Timeline Repeater list */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {timeline.map((entry, idx) => (
                    <div key={idx} className="bg-background border border-border/40 p-4 rounded-xl flex gap-4 justify-between items-start">
                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md font-bold font-mono text-[10px]">{entry.year}</span>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">{entry.label}</span>
                          {entry.currentStage && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">Current Stage</span>}
                        </div>
                        <h5 className="font-bold text-foreground text-xs">{entry.title}</h5>
                        <p className="text-muted-foreground text-[10px] leading-relaxed italic">{entry.description}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 justify-center items-center shrink-0">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveTimelineEntry(idx, 'up')}
                            className="p-1.5 bg-muted/40 border border-border hover:bg-muted text-foreground rounded cursor-pointer disabled:opacity-40"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === timeline.length - 1}
                            onClick={() => moveTimelineEntry(idx, 'down')}
                            className="p-1.5 bg-muted/40 border border-border hover:bg-muted text-foreground rounded cursor-pointer disabled:opacity-40"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimelineEntry(idx)}
                          className="p-1.5 bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 text-destructive rounded cursor-pointer w-full flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Timeline Entry Form */}
                <div className="border border-border/30 bg-muted/5 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider">Add Journey Milestone</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2024"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Sub-label</label>
                      <input
                        type="text"
                        placeholder="e.g. Building Websites"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Web Development"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Description</label>
                    <textarea
                      placeholder="Detail of the milestone..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none"
                    />
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1">Dot Color</label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={newDotColor}
                            onChange={(e) => setNewDotColor(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={newDotColor}
                            onChange={(e) => setNewDotColor(e.target.value)}
                            className="w-20 bg-background border border-border/60 rounded px-1.5 py-0.5 text-[10px]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pt-4">
                        <input
                          type="checkbox"
                          id="currentstage-chk"
                          checked={newCurrentStage}
                          onChange={(e) => setNewCurrentStage(e.target.checked)}
                          className="rounded border-border text-primary"
                        />
                        <label htmlFor="currentstage-chk" className="text-neutral-400 cursor-pointer">Current Stage</label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addTimelineEntry}
                      className="px-3.5 py-1.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Milestone</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SECTION 9: ABOUT OVERVIEW CARD */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('overviewCard')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                <span>Section 9 — About Overview Cards</span>
              </span>
              {activeSection === 'overviewCard' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'overviewCard' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-5 text-xs text-left">
                
                {/* SUBSECTION A: Education */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-1 pb-1 border-b border-border/10">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education block</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={overviewCard.education.degree}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          education: { ...overviewCard.education, degree: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">University</label>
                      <input
                        type="text"
                        value={overviewCard.education.university}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          education: { ...overviewCard.education, university: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Duration Range</label>
                      <input
                        type="text"
                        value={overviewCard.education.duration}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          education: { ...overviewCard.education, duration: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Grade / Score</label>
                      <input
                        type="text"
                        value={overviewCard.education.grade}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          education: { ...overviewCard.education, grade: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* SUBSECTION B: Focus Area */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-1 pb-1 border-b border-border/10">
                    <Sparkles className="w-4 h-4" />
                    <span>Focus area block</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">Focus Area Heading</label>
                      <input
                        type="text"
                        value={overviewCard.focus.focusHeading}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          focus: { ...overviewCard.focus, focusHeading: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Focus Description</label>
                      <textarea
                        value={overviewCard.focus.focusDescription}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          focus: { ...overviewCard.focus, focusDescription: e.target.value }
                        })}
                        rows={2}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SUBSECTION C: Tech Stack Tags */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-1 pb-1 border-b border-border/10">
                    <Code2 className="w-4 h-4" />
                    <span>Tech Stack Tags</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechTag}
                        onChange={(e) => setNewTechTag(e.target.value)}
                        placeholder="e.g. Next.js"
                        className="flex-1 bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                      <button
                        type="button"
                        onClick={addTechTag}
                        className="px-3.5 py-1.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {overviewCard.techStack.map((tech) => (
                        <div
                          key={tech}
                          className="px-2.5 py-1 bg-muted/40 text-foreground border border-border/30 rounded-full flex items-center gap-1.5 text-[10px]"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(tech)}
                            className="text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUBSECTION D: Key Highlights Stats */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-1 pb-1 border-b border-border/10">
                    <Trophy className="w-4 h-4" />
                    <span>Stats Highlights</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newHighlightLabel}
                        onChange={(e) => setNewHighlightLabel(e.target.value)}
                        placeholder="Label (e.g. College CGPA)"
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newHighlightValue}
                          onChange={(e) => setNewHighlightValue(e.target.value)}
                          placeholder="Value (e.g. 8.37)"
                          className="flex-1 bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                        />
                        <button
                          type="button"
                          onClick={addHighlight}
                          className="px-3.5 py-1.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 cursor-pointer shrink-0"
                        >
                          Add Stat
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {overviewCard.highlights.map((highlight, index) => (
                        <div key={index} className="px-3 py-2 bg-muted/20 border border-border/35 rounded-xl flex justify-between items-center">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 font-mono block uppercase">{highlight.label}</span>
                            <span className="font-bold text-foreground text-xs">{highlight.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="p-1 hover:bg-destructive/15 text-muted-foreground hover:text-destructive rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUBSECTION E: Availability parameters */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-1 pb-1 border-b border-border/10">
                    <Activity className="w-4 h-4" />
                    <span>Availability Status</span>
                  </h4>
                  <div className="flex justify-between items-center bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-foreground mb-1">Availability Subtitle</label>
                      <input
                        type="text"
                        value={overviewCard.availability.availabilityText}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          availability: { ...overviewCard.availability, availabilityText: e.target.value }
                        })}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div className="pl-4">
                      <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1 font-mono">Status Toggle</span>
                      <input
                        type="checkbox"
                        checked={overviewCard.availability.availabilityEnabled}
                        onChange={(e) => setOverviewCard({
                          ...overviewCard,
                          availability: { ...overviewCard.availability, availabilityEnabled: e.target.checked }
                        })}
                        className="rounded border-border text-primary w-4.5 h-4.5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SECTION 10: VISUAL SYSTEM */}
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('visuals')}
              type="button"
              className="w-full flex justify-between items-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted/30 text-left"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Section 10 — Visual System & Accent Themes</span>
              </span>
              {activeSection === 'visuals' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {activeSection === 'visuals' && (
              <div className="p-5 border-t border-border/10 bg-background/20 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Primary Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={visualSettings.primaryAccent}
                        onChange={(e) => setVisualSettings({ ...visualSettings, primaryAccent: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={visualSettings.primaryAccent}
                        onChange={(e) => setVisualSettings({ ...visualSettings, primaryAccent: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Secondary Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={visualSettings.secondaryAccent}
                        onChange={(e) => setVisualSettings({ ...visualSettings, secondaryAccent: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={visualSettings.secondaryAccent}
                        onChange={(e) => setVisualSettings({ ...visualSettings, secondaryAccent: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1.5">Shadow Glow Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={visualSettings.glowColor.startsWith('rgba') ? '#f97316' : visualSettings.glowColor}
                        onChange={(e) => setVisualSettings({ ...visualSettings, glowColor: e.target.value })}
                        className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={visualSettings.glowColor}
                        onChange={(e) => setVisualSettings({ ...visualSettings, glowColor: e.target.value })}
                        className="flex-1 bg-background border border-border/60 rounded-xl px-3 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Card Glass Opacity: {visualSettings.cardGlassOpacity}</label>
                    <input
                      type="range"
                      min="0.02"
                      max="0.4"
                      step="0.02"
                      value={visualSettings.cardGlassOpacity}
                      onChange={(e) => setVisualSettings({ ...visualSettings, cardGlassOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RESPONSIVE PORTFOLIO PREVIEW (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-[120px] space-y-4">
            
            {/* PREVIEW CONTROLLER */}
            <div className="flex justify-between items-center bg-card/45 border border-border/40 px-4 py-3 rounded-2xl backdrop-blur-xl">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-orange-400" />
                <span>Responsive Live About Preview</span>
              </span>
              <div className="flex items-center bg-neutral-900 border border-border/30 p-0.5 rounded-lg">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  type="button"
                  className={`p-1.5 rounded transition ${previewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-neutral-500 hover:text-foreground'}`}
                  title="Desktop Preview"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  type="button"
                  className={`p-1.5 rounded transition ${previewMode === 'tablet' ? 'bg-primary text-primary-foreground' : 'text-neutral-500 hover:text-foreground'}`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  type="button"
                  className={`p-1.5 rounded transition ${previewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-neutral-500 hover:text-foreground'}`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            <div className="flex justify-center items-center w-full">
              <div
                className={`transition-all duration-300 bg-black border border-border/30 rounded-3xl select-none relative overflow-y-auto max-h-[640px] text-left ${
                  previewMode === 'desktop'
                    ? 'w-full h-[580px]'
                    : previewMode === 'tablet'
                    ? 'w-[440px] h-[580px]'
                    : 'w-[300px] h-[520px]'
                }`}
              >
                
                {/* Simulated Navbar */}
                <div className="border-b border-white/5 bg-neutral-950/70 p-3 flex justify-between items-center text-[10px] uppercase font-bold sticky top-0 z-30 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: navbar.statusDotColor }} />
                    <span className="text-white tracking-widest">{navbar.brandName || "Mahi Singh"}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8.5px] scale-90">
                    {navbar.resumeButtonText || "Resume"}
                  </div>
                </div>

                {/* Simulated Content Area */}
                <div className="p-4 space-y-12 relative pb-16">
                  
                  {/* Backdrop Glow */}
                  <div
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none -z-10"
                    style={{
                      background: `radial-gradient(circle, ${visualSettings.primaryAccent}15 0%, ${visualSettings.secondaryAccent}05 50%, transparent 70%)`
                    }}
                  />

                  {/* HERO SPEC */}
                  <div className="text-center pt-8 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full scale-90">
                      <span className="w-1 h-1 bg-orange-400 rounded-full animate-ping" />
                      <span className="text-[7.5px] uppercase tracking-wider text-neutral-300 font-mono truncate max-w-[200px]">{hero.availabilityBadge}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-white leading-none uppercase pt-2">
                      {hero.introHeadingLine1 || "Hi, I'm"} <br />
                      <span className="bg-gradient-to-r bg-clip-text text-transparent uppercase" style={textGradStyle}>
                        {hero.mainName || "Mahi Singh"}
                      </span>
                    </h2>

                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">
                      {hero.subtitleLine1}
                    </div>

                    <p className="text-[9.5px] text-neutral-400 font-light leading-relaxed max-w-xs mx-auto pt-2">
                      {biography.biography}
                    </p>

                    <div className="flex gap-2 justify-center pt-4 scale-90">
                      <div className="px-3.5 py-1.5 bg-white text-black font-extrabold text-[8.5px] rounded-full uppercase tracking-wider">
                        {ctas.primaryCTAText}
                      </div>
                      <div className="px-3.5 py-1.5 bg-white/10 border border-white/15 text-white font-extrabold text-[8.5px] rounded-full uppercase tracking-wider">
                        {ctas.secondaryCTAText}
                      </div>
                    </div>
                  </div>

                  {/* ABOUT SECTION SPEC */}
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="border-l-2 pl-3" style={{ borderColor: aboutSection.leftAccentLineColor }}>
                      <span className="text-[8.5px] text-neutral-500 font-bold tracking-widest uppercase font-mono">{aboutSection.aboutHeading}</span>
                      <h4 className="text-[11px] font-black text-white uppercase leading-snug pt-1">{aboutSection.aboutMainText}</h4>
                    </div>

                    {/* TimelineMilestones Visual */}
                    <div className="space-y-4 pt-2">
                      <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-mono font-black">My Timeline</span>
                      <div className="relative pl-4 space-y-4 border-l border-white/10">
                        {timeline.map((entry, idx) => (
                          <div key={idx} className="relative group text-left">
                            {/* Dot */}
                            <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full border border-black" style={{ backgroundColor: entry.activeDotColor || '#f97316' }} />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono font-black text-orange-400">{entry.year}</span>
                              <span className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider block">{entry.label}</span>
                              <h6 className="text-[10px] font-bold text-white leading-tight">{entry.title}</h6>
                              <p className="text-[8.5px] text-neutral-400 font-light leading-snug">{entry.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overview Card Visual */}
                    <div
                      className="p-4 border border-white/10 rounded-2xl space-y-4 text-[9.5px]"
                      style={{
                        backgroundColor: `rgba(255, 255, 255, ${visualSettings.cardGlassOpacity})`,
                        boxShadow: `0 8px 32px 0 ${visualSettings.glowColor}`
                      }}
                    >
                      <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-mono font-bold block">About Overview Card</span>
                      
                      {/* Edu */}
                      <div className="space-y-1">
                        <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Education</span>
                        <div className="pl-1">
                          <h6 className="font-bold text-white text-[9.5px]">{overviewCard.education.degree}</h6>
                          <span className="text-neutral-400 text-[8px] block">{overviewCard.education.university}</span>
                          <span className="text-neutral-500 text-[7.5px] font-mono block pt-0.5">{overviewCard.education.duration} • Grade: {overviewCard.education.grade}</span>
                        </div>
                      </div>

                      {/* Focus */}
                      <div className="space-y-1">
                        <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider font-mono">My Focus</span>
                        <div className="pl-1">
                          <h6 className="font-bold text-white text-[9.5px]">{overviewCard.focus.focusHeading}</h6>
                          <p className="text-neutral-400 text-[8.5px] font-light leading-snug">{overviewCard.focus.focusDescription}</p>
                        </div>
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="space-y-1.5">
                        <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Tech Stack</span>
                        <div className="flex flex-wrap gap-1">
                          {overviewCard.techStack.map((tech) => (
                            <span key={tech} className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded-full text-white text-[7.5px] font-mono">{tech}</span>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 border-t border-white/5 pt-2">
                        <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Key Highlights</span>
                        <div className="grid grid-cols-2 gap-2">
                          {overviewCard.highlights.map((highlight, index) => (
                            <div key={index} className="border-l border-white/10 pl-2">
                              <span className="text-[7px] text-neutral-500 uppercase font-mono block">{highlight.label}</span>
                              <span className="text-white font-bold text-[8.5px]">{highlight.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      {overviewCard.availability.availabilityEnabled && (
                        <div className="border-t border-white/5 pt-2 flex items-center gap-1.5 text-orange-400 font-bold text-[8.5px]">
                          <span className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                          <span>{overviewCard.availability.availabilityText}</span>
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
