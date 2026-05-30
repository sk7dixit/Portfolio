import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles, Mail, MessageSquare, ShieldCheck, Sliders, Plus, Trash2,
  ExternalLink, FileText, Globe, Calendar, ChevronRight, Search, Eye,
  Save, X, Layers, Clock, ArrowUpRight, ShieldAlert, Check, Archive,
  Info, Quote, Github, Linkedin, Phone, Copy, EyeOff, Layout, MapPin, Upload
} from 'lucide-react';

export default function SDCommunicationStudio() {
  const { activePortfolio } = usePortfolio();
  const setSuccess = useStore((state) => state.success);
  const setError = useStore((state) => state.setError);
  const user = useStore((state) => state.user);

  // --- Navigation & Core states ---
  const [activeSubTab, setActiveSubTab] = useState<'cms' | 'inbox'>('cms');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  // --- 1. CONTACT CMS STATE ---
  const [cmsHero, setCmsHero] = useState({
    badgeText: "START A CONVERSATION",
    mainHeading: "Let’s Build Something Amazing",
    subtitle: "Whether you have a project, startup idea, collaboration opportunity, or just want to connect — I’d love to hear from you."
  });

  const [cmsProfileCard, setCmsProfileCard] = useState({
    name: "Shashwat Dixit",
    role: "AI-focused Product Builder & System Engineer",
    profileImage: "",
    statusTitle: "Available for Projects",
    statusDescription: "Open for freelance contracts, internships, and deep engineering collaborations."
  });

  const [cmsContactDetails, setCmsContactDetails] = useState({
    phone: "+91 7317649942",
    location: "Delhi, India // Available Globally",
    email: "shashwat.dixit@example.com",
    responseMetric: "REPLIES IN < 24H"
  });

  const [cmsSocialCards, setCmsSocialCards] = useState<any[]>([
    { platform: "LinkedIn", url: "https://linkedin.com", label: "Professional Profile", enabled: true },
    { platform: "GitHub", url: "https://github.com", label: "Source Code", enabled: true },
    { platform: "Resume", url: "#", label: "Qualifications Document", enabled: true },
    { platform: "WhatsApp", url: "https://wa.me/917317649942", label: "Direct Chat", enabled: true }
  ]);

  const [cmsFormSettings, setCmsFormSettings] = useState({
    formHeading: "Start a Conversation",
    namePlaceholder: "e.g. Elon Musk",
    emailPlaceholder: "e.g. elon@spacex.com",
    subjectPlaceholder: "-- Select Subject Preset --",
    messagePlaceholder: "Tell me about your project, idea, or questions...",
    submitButtonText: "Let’s Connect",
    subjectPresets: [
      "Startup Collaboration",
      "Freelance Project",
      "Hiring Opportunity",
      "AI Consultation",
      "Internship Inquiry",
      "General Conversation"
    ]
  });

  const [cmsVisualSettings, setCmsVisualSettings] = useState({
    primaryGradient: "#8b5cf6",
    secondaryGradient: "#6366f1",
    glowIntensity: 0.08,
    backgroundBlur: 10
  });

  const [isSavingCMS, setIsSavingCMS] = useState(false);
  const [newPreset, setNewPreset] = useState('');
  const [copiedPreviewEmail, setCopiedPreviewEmail] = useState(false);
  const [uploadingProfileImg, setUploadingProfileImg] = useState(false);

  // --- 2. INBOX STATE ---
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'archived'>('all');

  // Load Everything on Mount
  const loadCMS = async () => {
    try {
      const res = await api.get('/sd/communication/contact-cms');
      if (res.data.data.contactCMS) {
        const doc = res.data.data.contactCMS;
        if (doc.hero) setCmsHero(doc.hero);
        if (doc.profileCard) setCmsProfileCard(doc.profileCard);
        if (doc.contactDetails) setCmsContactDetails(doc.contactDetails);
        if (doc.socialCards) setCmsSocialCards(doc.socialCards);
        if (doc.formSettings) setCmsFormSettings(doc.formSettings);
        if (doc.visualSettings) setCmsVisualSettings(doc.visualSettings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const isArchivedQuery = inboxFilter === 'archived' ? 'true' : 'false';
      const isUnreadQuery = inboxFilter === 'unread' ? 'true' : 'false';
      
      const res = await api.get(`/sd/communication/messages?archived=${isArchivedQuery}&unread=${isUnreadQuery}`);
      const list = res.data.data.messages || [];
      setMessages(list);

      if (list.length > 0 && !selectedMessageId) {
        setSelectedMessageId(list[0].id);
      }
    } catch (err) {
      setError('Failed to fetch inbox messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCMS();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [inboxFilter]);

  // Connect Socket.IO
  useEffect(() => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'shashwat';
    const s = io('http://localhost:5000');
    s.emit('portfolio:join', targetSlug);
    setSocket(s);

    s.on('communication_sd:updated', (payload) => {
      if (payload.contactCMS) {
        const doc = payload.contactCMS;
        if (doc.hero) setCmsHero(doc.hero);
        if (doc.profileCard) setCmsProfileCard(doc.profileCard);
        if (doc.contactDetails) setCmsContactDetails(doc.contactDetails);
        if (doc.socialCards) setCmsSocialCards(doc.socialCards);
        if (doc.formSettings) setCmsFormSettings(doc.formSettings);
        if (doc.visualSettings) setCmsVisualSettings(doc.visualSettings);
      }
      if (payload.messages) {
        setMessages(payload.messages);
      } else {
        loadMessages();
      }
    });

    return () => {
      s.disconnect();
    };
  }, [activePortfolio, user?.portfolioSlug]);

  const emitSocketCMSUpdate = (cmsDoc: any) => {
    const targetSlug = activePortfolio || user?.portfolioSlug || 'shashwat';
    if (socket) {
      socket.emit('communication_sd:update', {
        slug: targetSlug,
        contactCMS: cmsDoc
      });
    }
  };

  // --- CMS Submit ---
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCMS(true);
    try {
      const data = {
        hero: cmsHero,
        profileCard: cmsProfileCard,
        contactDetails: cmsContactDetails,
        socialCards: cmsSocialCards,
        formSettings: cmsFormSettings,
        visualSettings: cmsVisualSettings
      };
      const res = await api.post('/sd/communication/contact-cms', data);
      setSuccess('Contact CMS updated successfully.');
      emitSocketCMSUpdate(res.data.data.contactCMS);
    } catch (err) {
      setError('Failed to save Contact CMS configurations.');
    } finally {
      setIsSavingCMS(false);
    }
  };

  // --- Inbox Operations ---
  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId);
  }, [messages, selectedMessageId]);

  const handleMarkRead = async (msg: any, readStatus: boolean) => {
    try {
      const res = await api.put(`/sd/communication/messages/${msg.id}`, { read: readStatus });
      const updatedList = messages.map((m) =>
        m.id === msg.id ? res.data.data.message : m
      );
      setMessages(updatedList);
      if (socket) {
        socket.emit('communication_sd:update', {
          slug: activePortfolio || 'shashwat',
          messages: updatedList
        });
      }
      setSuccess(readStatus ? 'Marked read.' : 'Marked unread.');
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleArchive = async (msg: any, archiveStatus: boolean) => {
    try {
      const res = await api.put(`/sd/communication/messages/${msg.id}`, { archived: archiveStatus });
      const updatedList = messages.filter((m) => m.id !== msg.id);
      setMessages(updatedList);
      
      if (selectedMessageId === msg.id) {
        setSelectedMessageId(updatedList.length > 0 ? updatedList[0].id : null);
      }
      
      if (socket) {
        socket.emit('communication_sd:update', {
          slug: activePortfolio || 'shashwat',
          messages: updatedList
        });
      }
      setSuccess(archiveStatus ? 'Message archived.' : 'Message unarchived.');
    } catch (err) {
      setError('Failed to archive message.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message forever?')) return;
    try {
      await api.delete(`/sd/communication/messages/${id}`);
      const updatedList = messages.filter((m) => m.id !== id);
      setMessages(updatedList);
      
      if (selectedMessageId === id) {
        setSelectedMessageId(updatedList.length > 0 ? updatedList[0].id : null);
      }

      if (socket) {
        socket.emit('communication_sd:update', {
          slug: activePortfolio || 'shashwat',
          messages: updatedList
        });
      }
      setSuccess('Message deleted successfully.');
    } catch (err) {
      setError('Failed to delete message.');
    }
  };

  // Image Upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingProfileImg(true);

    try {
      // Reuse certificates uploader since it saves locally
      const res = await api.post('/ks/certificates/upload/modal-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCmsProfileCard({ ...cmsProfileCard, profileImage: res.data.data.url });
      setSuccess('Profile image uploaded successfully.');
    } catch (err) {
      setError('Failed to upload profile image.');
    } finally {
      setUploadingProfileImg(false);
    }
  };

  // Preset subject list changes
  const addSubjectPreset = () => {
    const val = newPreset.trim();
    if (val && !cmsFormSettings.subjectPresets.includes(val)) {
      const updated = [...cmsFormSettings.subjectPresets, val];
      setCmsFormSettings({ ...cmsFormSettings, subjectPresets: updated });
      setNewPreset('');
    }
  };

  const removeSubjectPreset = (preset: string) => {
    const updated = cmsFormSettings.subjectPresets.filter(p => p !== preset);
    setCmsFormSettings({ ...cmsFormSettings, subjectPresets: updated });
  };

  // Platform icon helper
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin className="w-4 h-4 text-purple-400" />;
      case 'github': return <Github className="w-4 h-4 text-neutral-300" />;
      case 'whatsapp': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'resume': default: return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  // Social repeater edits helper
  const handleSocialUrlChange = (index: number, val: string) => {
    const list = [...cmsSocialCards];
    list[index].url = val;
    setCmsSocialCards(list);
  };

  const handleSocialLabelChange = (index: number, val: string) => {
    const list = [...cmsSocialCards];
    list[index].label = val;
    setCmsSocialCards(list);
  };

  const handleSocialToggle = (index: number, val: boolean) => {
    const list = [...cmsSocialCards];
    list[index].enabled = val;
    setCmsSocialCards(list);
  };

  // Inbox search filter
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, searchQuery]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 bg-card/40 border border-border/40 p-4 md:p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase mb-0.5 md:mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SD Portfolio Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Communication Studio V2</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Manage the frontend Contact CMS layout and read customer messages securely.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/30 border border-border/30 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('cms')}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'cms'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Contact CMS</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 relative ${
              activeSubTab === 'inbox'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inbox Desk</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW A: CONTACT CMS STUDIO */}
      {activeSubTab === 'cms' && (
        <form onSubmit={handleSaveCMS} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: form editors */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* HERO CONTENT */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Section A — Hero Header</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={cmsHero.badgeText}
                    onChange={(e) => setCmsHero({ ...cmsHero, badgeText: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                    placeholder="START A CONVERSATION"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={cmsHero.mainHeading}
                    onChange={(e) => setCmsHero({ ...cmsHero, mainHeading: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Subtitle</label>
                  <textarea
                    value={cmsHero.subtitle}
                    onChange={(e) => setCmsHero({ ...cmsHero, subtitle: e.target.value })}
                    rows={3}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none min-h-[80px] max-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Layers className="w-4 h-4 text-primary" />
                <span>Section B — Profile Card</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                  <input
                    type="text"
                    value={cmsProfileCard.name}
                    onChange={(e) => setCmsProfileCard({ ...cmsProfileCard, name: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Role/Tagline</label>
                  <input
                    type="text"
                    value={cmsProfileCard.role}
                    onChange={(e) => setCmsProfileCard({ ...cmsProfileCard, role: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Profile Image URL</label>
                  <input
                    type="text"
                    value={cmsProfileCard.profileImage}
                    onChange={(e) => setCmsProfileCard({ ...cmsProfileCard, profileImage: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground mb-2"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg cursor-pointer max-w-xs">
                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{uploadingProfileImg ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status Title</label>
                  <input
                    type="text"
                    value={cmsProfileCard.statusTitle}
                    onChange={(e) => setCmsProfileCard({ ...cmsProfileCard, statusTitle: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status Description</label>
                  <textarea
                    value={cmsProfileCard.statusDescription}
                    onChange={(e) => setCmsProfileCard({ ...cmsProfileCard, statusDescription: e.target.value })}
                    rows={2}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Globe className="w-4 h-4 text-primary" />
                <span>Section C — Contact Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={cmsContactDetails.phone}
                    onChange={(e) => setCmsContactDetails({ ...cmsContactDetails, phone: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Location Value</label>
                  <input
                    type="text"
                    value={cmsContactDetails.location}
                    onChange={(e) => setCmsContactDetails({ ...cmsContactDetails, location: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Fallback Email</label>
                  <input
                    type="email"
                    value={cmsContactDetails.email}
                    onChange={(e) => setCmsContactDetails({ ...cmsContactDetails, email: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Response Metric Value</label>
                  <input
                    type="text"
                    value={cmsContactDetails.responseMetric}
                    onChange={(e) => setCmsContactDetails({ ...cmsContactDetails, responseMetric: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* SOCIAL CARDS REPEATER */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Layers className="w-4 h-4 text-primary" />
                <span>Section D — Social Cards Repeater</span>
              </h3>
              <div className="space-y-3">
                {cmsSocialCards.map((card, index) => (
                  <div key={card.platform} className="bg-background/40 border border-border/30 p-4 rounded-2xl text-xs flex flex-col gap-3">
                    <div className="flex justify-between items-center font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        {renderPlatformIcon(card.platform)}
                        <span>{card.platform}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={card.enabled}
                        onChange={(e) => handleSocialToggle(index, e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground mb-1">Target URL</label>
                        <input
                          type="text"
                          value={card.url}
                          onChange={(e) => handleSocialUrlChange(index, e.target.value)}
                          className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground mb-1">Descriptive Label</label>
                        <input
                          type="text"
                          value={card.label}
                          onChange={(e) => handleSocialLabelChange(index, e.target.value)}
                          className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT FORM SETTINGS */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Section E — Contact Form Fields</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Form Heading</label>
                  <input
                    type="text"
                    value={cmsFormSettings.formHeading}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, formHeading: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Submit Button Text</label>
                  <input
                    type="text"
                    value={cmsFormSettings.submitButtonText}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, submitButtonText: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Name Input Placeholder</label>
                  <input
                    type="text"
                    value={cmsFormSettings.namePlaceholder}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, namePlaceholder: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email Input Placeholder</label>
                  <input
                    type="text"
                    value={cmsFormSettings.emailPlaceholder}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, emailPlaceholder: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Subject Input Placeholder</label>
                  <input
                    type="text"
                    value={cmsFormSettings.subjectPlaceholder}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, subjectPlaceholder: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Message Textarea Placeholder</label>
                  <textarea
                    value={cmsFormSettings.messagePlaceholder}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, messagePlaceholder: e.target.value })}
                    rows={2}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SUBJECT PRESETS DROP-DOWN */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Section F — Subject Presets</span>
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                  <input
                    type="text"
                    value={newPreset}
                    onChange={(e) => setNewPreset(e.target.value)}
                    placeholder="e.g. Hiring Consultation"
                    className="w-full sm:flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={addSubjectPreset}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-xl hover:bg-secondary/80 cursor-pointer flex items-center justify-center"
                  >
                    Add Preset
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cmsFormSettings.subjectPresets.map((preset) => (
                    <div
                      key={preset}
                      className="px-2.5 py-1 bg-muted/50 text-foreground border border-border/30 rounded-xl text-[10px] flex items-center gap-1.5"
                    >
                      <span>{preset}</span>
                      <button
                        type="button"
                        onClick={() => removeSubjectPreset(preset)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VISUAL CONTROLS */}
            <div className="bg-card/40 border border-border/40 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Section G — Visual Controls</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Primary Accent Gradient</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={cmsVisualSettings.primaryGradient}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, primaryGradient: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cmsVisualSettings.primaryGradient}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, primaryGradient: e.target.value })}
                      className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Secondary Accent Gradient</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={cmsVisualSettings.secondaryGradient}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, secondaryGradient: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cmsVisualSettings.secondaryGradient}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, secondaryGradient: e.target.value })}
                      className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">Shadow Glow Intensity: {cmsVisualSettings.glowIntensity}</label>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.3"
                    step="0.01"
                    value={cmsVisualSettings.glowIntensity}
                    onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, glowIntensity: parseFloat(e.target.value) })}
                    className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">Background Blur Strength: {cmsVisualSettings.backgroundBlur}px</label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={cmsVisualSettings.backgroundBlur}
                    onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, backgroundBlur: parseInt(e.target.value) })}
                    className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SAVE ACTION */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSavingCMS}
                className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingCMS ? 'Saving Configurations...' : 'Save CMS Configuration'}</span>
              </button>
            </div>

          </div>

          {/* Right panel: visual rendering preview */}
          <div className="lg:col-span-1 border-t border-border/30 pt-6 mt-6 lg:border-t-0 lg:pt-0 lg:mt-0">
            <div className="sticky top-[120px] space-y-4">
              
              <div className="flex justify-between items-center bg-card/40 border border-border/40 px-4 py-3 rounded-2xl backdrop-blur-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-primary" />
                  <span>SD Startup Grid Preview</span>
                </span>
              </div>

              {/* LIVE LAYOUT CONTAINER */}
              <div className="p-4 bg-zinc-950 border border-border/30 rounded-3xl text-left select-none relative min-h-[460px] overflow-hidden space-y-4 flex flex-col">
                
                {/* Radial Glow Overlay */}
                <div
                  className="absolute inset-0 opacity-20 blur-[90px] pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle, ${cmsVisualSettings.primaryGradient} 0%, ${cmsVisualSettings.secondaryGradient} 40%, transparent 70%)`
                  }}
                ></div>

                {/* Subtitle Badge */}
                <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono tracking-wider text-white">
                  <Mail className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>{cmsHero.badgeText || 'START A CONVERSATION'}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white leading-tight uppercase">
                    {cmsHero.mainHeading || 'Let’s Build Something Amazing'}
                  </h4>
                  <p className="text-[9px] text-neutral-400 font-light leading-relaxed">
                    {cmsHero.subtitle}
                  </p>
                </div>

                {/* Profile Card Mockup */}
                <div
                  className="p-3 border rounded-2xl flex flex-col justify-between transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(8, 10, 25, 0.28)',
                    backdropFilter: `blur(${cmsVisualSettings.backgroundBlur}px)`,
                    borderColor: 'rgba(255,255,255,0.05)',
                    boxShadow: `0 0 30px ${cmsVisualSettings.primaryGradient}${Math.floor(cmsVisualSettings.glowIntensity * 255).toString(16).padStart(2, '0')}`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-neutral-400 overflow-hidden">
                        {cmsProfileCard.profileImage ? (
                          <img src={cmsProfileCard.profileImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          <Layout className="w-5 h-5" />
                        )}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-white truncate">{cmsProfileCard.name || 'Shashwat Dixit'}</span>
                      <span className="block text-[8px] text-neutral-400 truncate">{cmsProfileCard.role}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 flex items-start gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-emerald-400 font-bold tracking-tight">{cmsProfileCard.statusTitle}</p>
                      <p className="text-[7.5px] text-neutral-400 leading-normal font-light line-clamp-1">{cmsProfileCard.statusDescription}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 text-[8px] text-neutral-400 border-t border-white/5 mt-2.5">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{cmsContactDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{cmsContactDetails.location}</span>
                    </div>
                  </div>
                </div>

                {/* Form settings preview */}
                <div className="p-3 border border-white/5 rounded-2xl bg-black/40 space-y-2">
                  <span className="block text-[9px] font-bold text-white">{cmsFormSettings.formHeading || 'Start a Conversation'}</span>
                  <div className="w-full h-px bg-white/10" />
                  <div className="flex items-center justify-between text-[8px] text-neutral-400 pt-1">
                    <span>Presets count: {cmsFormSettings.subjectPresets.length}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                  </div>
                </div>

              </div>

            </div>
          </div>
        </form>
      )}

      {/* VIEW B: SD INBOX SYSTEM */}
      {activeSubTab === 'inbox' && (
        <div className="bg-card/50 border border-border/40 rounded-3xl backdrop-blur-xl overflow-hidden min-h-[500px] grid grid-cols-1 md:grid-cols-12">
          
          {/* LEFT PANEL: MESSAGES LIST (col-span-5) */}
          <div className="md:col-span-5 border-r border-border/30 flex flex-col h-full">
            
            {/* SEARCH & FILTERS BAR */}
            <div className="p-4 border-b border-border/20 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sender, email, subject, content..."
                  className="w-full bg-background border border-border/50 rounded-lg pl-8 pr-4 py-1.5 text-xs text-foreground"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">Filter:</span>
                <div className="flex gap-1.5">
                  {[
                    { id: 'all', label: 'All Inbound' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'archived', label: 'Archived' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setInboxFilter(f.id as any)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer transition ${
                        inboxFilter === f.id
                          ? 'bg-[#8b5cf6]/20 text-[#c084fc] border border-[#8b5cf6]/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIST OF GLASS CARDS */}
            <div className="flex-1 overflow-y-auto max-h-[460px] divide-y divide-border/10">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  <Sparkles className="w-5 h-5 animate-spin mx-auto text-purple-400 mb-2" />
                  <span>Scanning messages list...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs">
                  <Mail className="w-6 h-6 mx-auto text-muted-foreground/35 mb-2" />
                  <span>No matching messages in registry.</span>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessageId(msg.id);
                      if (!msg.read) {
                        handleMarkRead(msg, true);
                      }
                    }}
                    className={`w-full text-left p-3.5 transition relative flex items-start gap-2.5 hover:bg-muted/20 ${
                      selectedMessageId === msg.id ? 'bg-[#8b5cf6]/5' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(139,92,246,0.7)]"></span>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-0.5">
                        <span className={`text-xs truncate ${!msg.read ? 'font-bold text-foreground' : 'text-muted-foreground font-medium'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[8px] text-muted-foreground shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#c084fc] font-semibold block truncate mb-0.5">{msg.subject}</span>
                      <span className="text-[9px] text-neutral-400 block truncate mb-1">{msg.email}</span>
                      <p className="text-[10px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

          </div>

          {/* RIGHT PANEL: MESSAGE VIEWER (col-span-7) */}
          <div className="md:col-span-7 flex flex-col h-full bg-background/25">
            {selectedMessage ? (
              <div className="p-6 flex flex-col h-full justify-between min-h-[460px]">
                
                {/* Message Header */}
                <div className="space-y-4">
                  
                  {/* Actions toolbar */}
                  <div className="flex justify-between items-center border-b border-border/20 pb-4">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">Message Details</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkRead(selectedMessage, !selectedMessage.read)}
                        className="px-2.5 py-1.5 border border-border/40 hover:bg-muted rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                        title={selectedMessage.read ? "Mark Unread" : "Mark Read"}
                      >
                        {selectedMessage.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{selectedMessage.read ? 'Unread' : 'Read'}</span>
                      </button>
                      <button
                        onClick={() => handleArchive(selectedMessage, !selectedMessage.archived)}
                        className="px-2.5 py-1.5 border border-border/40 hover:bg-muted rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                        title={selectedMessage.archived ? "Unarchive" : "Archive"}
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{selectedMessage.archived ? 'Inbox' : 'Archive'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="px-2.5 py-1.5 border border-destructive/20 hover:bg-destructive/15 text-destructive rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex items-center gap-1"
                        title="Delete Forever"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Sender Specs */}
                  <div className="bg-card/30 border border-border/30 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{selectedMessage.name}</h3>
                        <a href={`mailto:${selectedMessage.email}`} className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-0.5">
                          <span>{selectedMessage.email}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-muted-foreground block text-right">TIMESTAMP</span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 my-1" />
                    <div>
                      <span className="text-[8px] font-mono text-muted-foreground block">SUBJECT PRESCRIPTION</span>
                      <span className="text-xs font-bold text-[#c084fc]">{selectedMessage.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="flex-1 my-6 overflow-y-auto max-h-[240px] bg-background/5 border border-border/10 p-5 rounded-2xl">
                  <p className="text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Footer notes */}
                <div className="border-t border-border/10 pt-4 flex gap-2 text-[10px] text-muted-foreground items-center bg-transparent">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Secure local communication desk. Real-time Socket sync enabled.</span>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-3 min-h-[460px]">
                <MessageSquare className="w-8 h-8 text-muted-foreground/35 animate-pulse" />
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">No Message Selected</h4>
                <p className="text-[10px] max-w-xs">Select an inbound message from the desk list to review message narrative.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
