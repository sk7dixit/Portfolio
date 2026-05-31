import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles, Mail, MessageSquare, ShieldCheck, Sliders, Plus, Trash2,
  ExternalLink, FileText, Globe, Calendar, ChevronRight, Search, Eye,
  Save, X, Layers, Clock, ArrowUpRight, ShieldAlert, Check, Archive,
  Info, Quote, Github, Linkedin, Twitter, AlertCircle, EyeOff, Layout, ArrowLeft
} from 'lucide-react';

export default function KSCommunicationStudio() {
  const { activePortfolio } = usePortfolio();
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);
  const user = useStore((state) => state.user);

  // --- Navigation & Core states ---
  const [activeSubTab, setActiveSubTab] = useState<'cms' | 'inbox'>('cms');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  // --- 1. CONTACT CMS STATE ---
  const [cmsHero, setCmsHero] = useState({
    badgeText: "LET'S CONNECT",
    mainHeadingLine1: "Let's Create Something",
    gradientHeadingLine2: "That People Remember.",
    description: "I enjoy building modern digital experiences that combine clean engineering with thoughtful design."
  });

  const [cmsQuote, setCmsQuote] = useState({
    quoteText: "Great products are built through collaboration, iteration, and curiosity.",
    quoteIconStyle: "Quote",
    floatingCardEnabled: true
  });

  const [cmsFormSettings, setCmsFormSettings] = useState({
    formTitle: "What are you building?",
    submitButtonText: "Send Message",
    successMessage: "Message sent successfully. I'll get back to you soon!",
    errorMessage: "Something went wrong. Please try again or email me directly.",
    autoReplyEnabled: false
  });

  const [cmsFooterInfo, setCmsFooterInfo] = useState({
    locationLabel: "Based In",
    locationValue: "India (UTC+5:30)",
    responseTime: "Within 24 Hours",
    currentFocus: "Interactive Web & MERN"
  });

  const [cmsSocialLinks, setCmsSocialLinks] = useState<any[]>([
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/khushaboo-saini", enabled: true },
    { platform: "GitHub", url: "https://github.com/Khushboo-Saini", enabled: true },
    { platform: "Mail", url: "mailto:khushboosaini066@gmail.com", enabled: true }
  ]);

  const [cmsVisualSettings, setCmsVisualSettings] = useState({
    gradientStart: "#a855f7",
    gradientEnd: "#22d3ee",
    overlayOpacity: 0.28,
    glassBlurStrength: 10,
    statusText: "SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES",
    statusEnabled: true,
    statusAccentColor: "#10b981"
  });

  const [isSavingCMS, setIsSavingCMS] = useState(false);

  // --- 2. INBOX STATE ---
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [isMobileMessageOpen, setIsMobileMessageOpen] = useState(false);

  // Load Everything on Mount
  const loadCMS = async () => {
    try {
      const res = await api.get('/ks/communication/contact-cms');
      if (res.data.data.contactCMS) {
        const doc = res.data.data.contactCMS;
        if (doc.hero) setCmsHero(doc.hero);
        if (doc.quoteCard) setCmsQuote(doc.quoteCard);
        if (doc.footerInfo) setCmsFooterInfo(doc.footerInfo);
        if (doc.socialLinks) setCmsSocialLinks(doc.socialLinks);
        if (doc.visualSettings) setCmsVisualSettings(doc.visualSettings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      // If we are showing archived messages, we pass archived=true. By default pass all/archived=false.
      const isArchivedQuery = inboxFilter === 'archived' ? 'true' : 'false';
      const isUnreadQuery = inboxFilter === 'unread' ? 'true' : 'false';
      
      const res = await api.get(`/ks/communication/messages?archived=${isArchivedQuery}&unread=${isUnreadQuery}`);
      const list = res.data.data.messages || [];
      setMessages(list);

      // Auto select first message if none is selected
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
    const targetSlug = activePortfolio || user?.portfolioSlug || 'khushaboo';
    const s = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
    s.emit('portfolio:join', targetSlug);
    setSocket(s);

    s.on('communication_ks:updated', (payload) => {
      // Reload on updates
      if (payload.contactCMS) {
        const doc = payload.contactCMS;
        if (doc.hero) setCmsHero(doc.hero);
        if (doc.quoteCard) setCmsQuote(doc.quoteCard);
        if (doc.footerInfo) setCmsFooterInfo(doc.footerInfo);
        if (doc.socialLinks) setCmsSocialLinks(doc.socialLinks);
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
    const targetSlug = activePortfolio || user?.portfolioSlug || 'khushaboo';
    if (socket) {
      socket.emit('communication_ks:update', {
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
        quoteCard: cmsQuote,
        footerInfo: cmsFooterInfo,
        socialLinks: cmsSocialLinks,
        visualSettings: cmsVisualSettings
      };
      const res = await api.post('/ks/communication/contact-cms', data);
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
      const res = await api.put(`/ks/communication/messages/${msg.id}`, { read: readStatus });
      const updatedList = messages.map((m) =>
        m.id === msg.id ? res.data.data.message : m
      );
      setMessages(updatedList);
      if (socket) {
        socket.emit('communication_ks:update', {
          slug: activePortfolio || 'khushaboo',
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
      const res = await api.put(`/ks/communication/messages/${msg.id}`, { archived: archiveStatus });
      // Remove from list if it no longer matches filter
      const updatedList = messages.filter((m) => m.id !== msg.id);
      setMessages(updatedList);
      
      if (selectedMessageId === msg.id) {
        setSelectedMessageId(updatedList.length > 0 ? updatedList[0].id : null);
      }
      
      if (socket) {
        socket.emit('communication_ks:update', {
          slug: activePortfolio || 'khushaboo',
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
      await api.delete(`/ks/communication/messages/${id}`);
      const updatedList = messages.filter((m) => m.id !== id);
      setMessages(updatedList);
      
      if (selectedMessageId === id) {
        setSelectedMessageId(updatedList.length > 0 ? updatedList[0].id : null);
      }

      if (socket) {
        socket.emit('communication_ks:update', {
          slug: activePortfolio || 'khushaboo',
          messages: updatedList
        });
      }
      setSuccess('Message deleted successfully.');
    } catch (err) {
      setError('Failed to delete message.');
    }
  };

  // Social repeater edits helper
  const handleSocialUrlChange = (index: number, val: string) => {
    const list = [...cmsSocialLinks];
    list[index].url = val;
    setCmsSocialLinks(list);
  };

  const handleSocialToggle = (index: number, val: boolean) => {
    const list = [...cmsSocialLinks];
    list[index].enabled = val;
    setCmsSocialLinks(list);
  };

  // Social icons helper
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'mail': default: return <Mail className="w-4 h-4" />;
    }
  };

  // Inbox search filter
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, searchQuery]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card/40 border border-border/40 p-3.5 sm:p-4 mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-[10px] tracking-wider uppercase mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>KS Portfolio Hub</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Communication Studio V2</h1>
          <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5">
            Manage Contact CMS and read customer messages.
          </p>
        </div>
        
        <div className="w-full h-px bg-border/20 sm:hidden my-0.5" />
        
        <div className="flex items-center gap-1.5 bg-muted/30 border border-border/30 p-1 rounded-xl w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveSubTab('cms')}
            type="button"
            className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
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
            type="button"
            className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 relative ${
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
        <form onSubmit={handleSaveCMS} className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left panel: form editors */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            
            {/* HERO CONTENT */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Section A — Hero Content</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={cmsHero.badgeText}
                    onChange={(e) => setCmsHero({ ...cmsHero, badgeText: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                    placeholder="LET'S CONNECT"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Main Heading Line 1</label>
                  <input
                    type="text"
                    value={cmsHero.mainHeadingLine1}
                    onChange={(e) => setCmsHero({ ...cmsHero, mainHeadingLine1: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Gradient Heading Line 2</label>
                  <input
                    type="text"
                    value={cmsHero.gradientHeadingLine2}
                    onChange={(e) => setCmsHero({ ...cmsHero, gradientHeadingLine2: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Description Teaser</label>
                  <textarea
                    value={cmsHero.description}
                    onChange={(e) => setCmsHero({ ...cmsHero, description: e.target.value })}
                    rows={3}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* QUOTE CARD */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Quote className="w-4 h-4 text-primary" />
                <span>Section B — Quote Card</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                  <div>
                    <span className="block text-xs font-semibold text-foreground">Floating Card Enabled</span>
                    <span className="block text-[10px] text-muted-foreground">Expose quote graphic overlays on form</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cmsQuote.floatingCardEnabled}
                    onChange={(e) => setCmsQuote({ ...cmsQuote, floatingCardEnabled: e.target.checked })}
                    className="rounded border-border text-primary"
                  />
                </div>
                {cmsQuote.floatingCardEnabled && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Quote Description</label>
                    <textarea
                      value={cmsQuote.quoteText}
                      onChange={(e) => setCmsQuote({ ...cmsQuote, quoteText: e.target.value })}
                      rows={2}
                      className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* FORM SETTINGS */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Section C — Contact Form Settings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Form Title</label>
                  <input
                    type="text"
                    value={cmsFormSettings.formTitle}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, formTitle: e.target.value })}
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
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Success Alert Text</label>
                  <input
                    type="text"
                    value={cmsFormSettings.successMessage}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, successMessage: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Error Alert Text</label>
                  <input
                    type="text"
                    value={cmsFormSettings.errorMessage}
                    onChange={(e) => setCmsFormSettings({ ...cmsFormSettings, errorMessage: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER INFO & AVAILABILITY STRIP */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Globe className="w-4 h-4 text-primary" />
                <span>Section D & E — Footer Info & Status Strip</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Location Label</label>
                  <input
                    type="text"
                    value={cmsFooterInfo.locationLabel}
                    onChange={(e) => setCmsFooterInfo({ ...cmsFooterInfo, locationLabel: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Location Value</label>
                  <input
                    type="text"
                    value={cmsFooterInfo.locationValue}
                    onChange={(e) => setCmsFooterInfo({ ...cmsFooterInfo, locationValue: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Response Time Value</label>
                  <input
                    type="text"
                    value={cmsFooterInfo.responseTime}
                    onChange={(e) => setCmsFooterInfo({ ...cmsFooterInfo, responseTime: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Currently Focus Value</label>
                  <input
                    type="text"
                    value={cmsFooterInfo.currentFocus}
                    onChange={(e) => setCmsFooterInfo({ ...cmsFooterInfo, currentFocus: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>

                {/* Status online strip */}
                <div className="md:col-span-2 h-px bg-border/20 my-2" />

                <div className="md:col-span-2 flex items-center justify-between bg-muted/10 p-3.5 border border-border/10 rounded-xl">
                  <div>
                    <span className="block text-xs font-bold text-foreground">Status Online Strip</span>
                    <span className="block text-[10px] text-muted-foreground">Expose online counter badge in footer page</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cmsVisualSettings.statusEnabled}
                    onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, statusEnabled: e.target.checked })}
                    className="rounded border-border text-primary"
                  />
                </div>

                {cmsVisualSettings.statusEnabled && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Online Status Label</label>
                      <input
                        type="text"
                        value={cmsVisualSettings.statusText}
                        onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, statusText: e.target.value })}
                        className="w-full bg-background border border-border/60 rounded-xl px-3.5 py-2 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Status Dot Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={cmsVisualSettings.statusAccentColor}
                          onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, statusAccentColor: e.target.value })}
                          className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cmsVisualSettings.statusAccentColor}
                          onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, statusAccentColor: e.target.value })}
                          className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Globe className="w-4 h-4 text-primary" />
                <span>Section F — Social Links Repeater</span>
              </h3>
              <div className="space-y-3">
                {cmsSocialLinks.map((link, index) => (
                  <div key={link.platform} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-stretch sm:items-center bg-background/40 border border-border/30 p-3 sm:p-4 px-4 rounded-xl text-xs">
                    <div className="col-span-3 flex items-center gap-2 font-semibold text-foreground">
                      {renderSocialIcon(link.platform)}
                      <span>{link.platform}</span>
                    </div>
                    <div className="col-span-7 w-full">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleSocialUrlChange(index, e.target.value)}
                        className="w-full bg-background border border-border/60 rounded-lg px-2.5 py-1.5 text-xs text-foreground"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between sm:justify-end gap-2 border-t border-border/10 pt-2 sm:border-0 sm:pt-0">
                      <span className="sm:hidden text-[10px] text-muted-foreground">Enabled:</span>
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        onChange={(e) => handleSocialToggle(index, e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISUAL SETTINGS */}
            <div className="bg-card/40 border border-border/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/10">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Section G — Visual Controls & Theme</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Glow Start Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={cmsVisualSettings.gradientStart}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, gradientStart: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cmsVisualSettings.gradientStart}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, gradientStart: e.target.value })}
                      className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Glow End Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={cmsVisualSettings.gradientEnd}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, gradientEnd: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cmsVisualSettings.gradientEnd}
                      onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, gradientEnd: e.target.value })}
                      className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">Form Overlay Opacity: {cmsVisualSettings.overlayOpacity}</label>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={cmsVisualSettings.overlayOpacity}
                    onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-primary bg-background rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-muted-foreground">Glass Blur Strength: {cmsVisualSettings.glassBlurStrength}px</label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={cmsVisualSettings.glassBlurStrength}
                    onChange={(e) => setCmsVisualSettings({ ...cmsVisualSettings, glassBlurStrength: parseInt(e.target.value) })}
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
          <div className="hidden xl:block xl:col-span-1">
            <div className="sticky top-[120px] space-y-4">
              
              <div className="flex justify-between items-center bg-card/40 border border-border/40 px-4 py-3 rounded-2xl backdrop-blur-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-primary" />
                  <span>Typography-focused CMS Preview</span>
                </span>
              </div>

              {/* LIVE LAYOUT CONTAINER */}
              <div className="p-6 bg-zinc-950 border border-border/30 rounded-3xl text-left select-none relative min-h-[460px] overflow-hidden flex flex-col justify-between">
                
                {/* Radial Glow Overlay */}
                <div
                  className="absolute inset-0 opacity-40 blur-[80px] pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle, ${cmsVisualSettings.gradientStart}20 0%, ${cmsVisualSettings.gradientEnd}10 50%, transparent 80%)`
                  }}
                ></div>

                {/* Subtitle Badge */}
                <div className="inline-flex self-center items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white/80">{cmsHero.badgeText || 'LET\'S CONNECT'}</span>
                </div>

                {/* Splitted Titles */}
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-black text-white leading-tight uppercase">
                    {cmsHero.mainHeadingLine1 || 'Let\'s Create Something'}
                  </h4>
                  <h4
                    className="text-lg font-black bg-gradient-to-r bg-clip-text text-transparent uppercase"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${cmsVisualSettings.gradientStart}, ${cmsVisualSettings.gradientEnd})`
                    }}
                  >
                    {cmsHero.gradientHeadingLine2 || 'That People Remember.'}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-light leading-relaxed max-w-xs mx-auto">
                    {cmsHero.description}
                  </p>
                </div>

                {/* Form container mockup */}
                <div
                  className="my-6 p-4 rounded-xl border border-white/5 space-y-3 relative"
                  style={{
                    backgroundColor: `rgba(8, 10, 25, ${cmsVisualSettings.overlayOpacity})`,
                    backdropFilter: `blur(${cmsVisualSettings.glassBlurStrength}px)`,
                    WebkitBackdropFilter: `blur(${cmsVisualSettings.glassBlurStrength}px)`
                  }}
                >
                  {/* Floating quote card */}
                  {cmsQuote.floatingCardEnabled && (
                    <div className="absolute -top-6 -right-4 p-2 bg-zinc-950/80 border border-white/10 rounded-lg max-w-[120px]">
                      <span className="text-[7.5px] text-neutral-300 italic block leading-snug">"{cmsQuote.quoteText}"</span>
                    </div>
                  )}

                  <span className="block text-[9px] font-bold text-muted-foreground">{cmsFormSettings.formTitle || 'What are you building?'}</span>
                  <div className="w-full h-px bg-white/10" />
                  <div className="w-full h-px bg-white/10" />
                  <div className="w-full h-5 rounded bg-white text-black text-[9px] font-extrabold flex items-center justify-center">
                    {cmsFormSettings.submitButtonText || 'Send Message'}
                  </div>
                </div>

                {/* Footer details row */}
                <div className="grid grid-cols-3 gap-2 text-center text-neutral-400 border-t border-white/5 pt-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-mono text-neutral-500 uppercase">{cmsFooterInfo.locationLabel}</span>
                    <span className="text-[8px] text-neutral-300 truncate w-full">{cmsFooterInfo.locationValue}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-mono text-neutral-500 uppercase">Response Time</span>
                    <span className="text-[8px] text-neutral-300 truncate w-full">{cmsFooterInfo.responseTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-mono text-neutral-500 uppercase">Current Focus</span>
                    <span className="text-[8px] text-neutral-300 truncate w-full">{cmsFooterInfo.currentFocus}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </form>
      )}

      {/* VIEW B: KS INBOX SYSTEM */}
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
                  placeholder="Search sender, email, content..."
                  className="w-full bg-background border border-border/50 rounded-lg pl-8 pr-4 py-1.5 text-xs text-foreground"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">Filter Desk:</span>
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
                          ? 'bg-secondary text-secondary-foreground border border-border/50'
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
                  <Sparkles className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
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
                      setIsMobileMessageOpen(true);
                      // Auto mark read if clicked
                      if (!msg.read) {
                        handleMarkRead(msg, true);
                      }
                    }}
                    className={`w-full text-left p-3.5 transition relative flex items-start gap-2.5 hover:bg-muted/20 ${
                      selectedMessageId === msg.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.7)]"></span>
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
                      <span className="text-[10px] text-neutral-400 block truncate mb-1">{msg.email}</span>
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
          <div className="hidden md:flex md:col-span-7 flex-col h-full bg-background/25">
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
                  <div className="bg-card/30 border border-border/30 p-4 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{selectedMessage.name}</h3>
                      <a href={`mailto:${selectedMessage.email}`} className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-0.5">
                        <span>{selectedMessage.email}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-muted-foreground block">RECEIVED TIMESTAMP</span>
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
                </div>

                {/* Message Body Content */}
                <div className="flex-1 my-6 overflow-y-auto max-h-[260px] bg-background/5 border border-border/10 p-5 rounded-2xl">
                  <p className="text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Footer notes */}
                <div className="border-t border-border/10 pt-4 flex gap-2 text-[10px] text-muted-foreground items-center bg-transparent">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
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

      {/* Gmail-like Full Screen Message Drawer for Mobile viewports */}
      {isMobileMessageOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 bg-background/98 flex flex-col md:hidden animate-slide-up select-text text-left">
          {/* Drawer Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/65 backdrop-blur-md shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMessageOpen(false)}
              className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Inbound Message</span>
              <h4 className="text-xs font-black text-foreground uppercase tracking-wider mt-0.5 truncate max-w-[200px]">{selectedMessage.name}</h4>
            </div>
          </div>

          {/* Scrollable Message Details */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Sender Specs Card */}
            <div className="bg-card/45 border border-border/30 p-4 rounded-2xl flex flex-col gap-2.5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{selectedMessage.name}</h3>
                  <a href={`mailto:${selectedMessage.email}`} className="text-[10px] text-primary hover:underline flex items-center gap-0.5 mt-0.5 break-all">
                    <span>{selectedMessage.email}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[7.5px] font-mono text-muted-foreground block">RECEIVED TIMESTAMP</span>
                  <span className="text-[9px] text-neutral-400">
                    {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Geographic IP details if exist */}
              {(() => {
                let meta: any = {};
                if (selectedMessage.metadata) {
                  try {
                    meta = typeof selectedMessage.metadata === 'string' ? JSON.parse(selectedMessage.metadata) : selectedMessage.metadata;
                  } catch (e) {}
                }
                return meta.country && meta.country !== 'Unknown' ? (
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8.5px] text-muted-foreground/75 font-mono select-none border-t border-border/10 pt-2 leading-relaxed">
                    <Globe className="w-3 h-3 shrink-0 text-primary/80" />
                    <span>{meta.country}</span>
                    {meta.visitorIp && (
                      <span className="opacity-80 break-all">• IP: {meta.visitorIp}</span>
                    )}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Message Narrative Body */}
            <div className="bg-card/20 border border-border/20 p-4.5 rounded-2xl min-h-[160px]">
              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-3 pb-1 border-b border-border/10">Message Narrative</span>
              <p className="text-[11.5px] text-neutral-200 font-light leading-relaxed whitespace-pre-wrap select-text break-words">
                {selectedMessage.message}
              </p>
            </div>
          </div>

          {/* Drawer Actions Toolbar (Sticky Bottom) */}
          <div className="p-4 border-t border-border/40 bg-card/65 backdrop-blur-md shrink-0 flex gap-2">
            <button
              type="button"
              onClick={() => {
                handleMarkRead(selectedMessage, !selectedMessage.read);
                setIsMobileMessageOpen(false);
              }}
              className="flex-1 px-3 py-2.5 border border-border/50 hover:bg-muted rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 text-zinc-300"
            >
              {selectedMessage.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{selectedMessage.read ? 'Mark Unread' : 'Mark Read'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleArchive(selectedMessage, !selectedMessage.archived);
                setIsMobileMessageOpen(false);
              }}
              className="flex-1 px-3 py-2.5 border border-border/50 hover:bg-muted rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 text-zinc-300"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{selectedMessage.archived ? 'To Inbox' : 'Archive'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleDeleteMessage(selectedMessage.id);
                setIsMobileMessageOpen(false);
              }}
              className="px-3.5 py-2.5 border border-destructive/20 hover:bg-destructive/15 text-destructive rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
