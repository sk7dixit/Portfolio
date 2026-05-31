import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { 
  Mail, MailOpen, Trash2, Calendar, User, Star, Save, Plus, 
  MapPin, Clock, Github, Linkedin, Eye, EyeOff, Globe, Sparkles, 
  ArrowUpRight, AlertCircle, CheckCircle, Info, BookOpen, Quote, X, Settings
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function ContactCRUD() {
  const profile = useStore((s) => s.profile);
  const user = useStore((s) => s.user);
  const messages = useStore((s) => s.messages);
  const fetchEverything = useStore((s) => s.fetchEverything);
  const setSuccess = useStore((s) => s.setSuccess);
  const setError = useStore((s) => s.setError);

  // ── Tab Management ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');

  // ── Socket pipeline ─────────────────────────────────────────
  const [socket, setSocket] = useState<any>(null);

  // ── Tab 1: Messages Inbox ───────────────────────────────────
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [savingMsgAction, setSavingMsgAction] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [msgToDeleteId, setMsgToDeleteId] = useState<string | null>(null);

  // ── Tab 2: Contact Settings (CMS) ───────────────────────────
  const [heading, setHeading] = useState("Let's Work Together");
  const [description, setDescription] = useState("Open to internships, freelance projects, collaborations, and software development opportunities.");
  const [quote, setQuote] = useState("Interested in building scalable, thoughtful digital experiences.");
  const [quoteAuthor, setQuoteAuthor] = useState("Mahi Singh");
  
  // Availability List
  const [availabilityList, setAvailabilityList] = useState<string[]>([
    "Frontend Development",
    "Full Stack Projects",
    "AI-Powered Systems",
    "Internship Opportunities"
  ]);
  const [newAvailText, setNewAvailText] = useState('');

  // Location & Response Time
  const [locationText, setLocationText] = useState("India (GMT +5:30)");
  const [responseTimeText, setResponseTimeText] = useState("Usually within 24 Hours");

  // Social Links
  const [socialGithub, setSocialGithub] = useState("https://github.com/mahisngh");
  const [socialLinkedin, setSocialLinkedin] = useState("https://linkedin.com/in/mahi-singh");
  const [socialEmail, setSocialEmail] = useState("mahi@example.com");

  // Form Config
  const [formEnabled, setFormEnabled] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState("admin@email.com");

  const [savingSettings, setSavingSettings] = useState(false);

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

  // Load settings data from database profile on boot
  useEffect(() => {
    if (profile?.contactSection) {
      const sec = typeof profile.contactSection === 'string'
        ? JSON.parse(profile.contactSection)
        : profile.contactSection;

      setHeading(sec.heading || "Let's Work Together");
      setDescription(sec.description || "Open to internships, freelance projects, collaborations, and software development opportunities.");
      setQuote(sec.quote || "Interested in building scalable, thoughtful digital experiences.");
      setQuoteAuthor(sec.quoteAuthor || "Mahi Singh");
      
      if (Array.isArray(sec.availability)) {
        setAvailabilityList(sec.availability);
      }

      setLocationText(sec.location || "India (GMT +5:30)");
      setResponseTimeText(sec.responseTime || "Usually within 24 Hours");

      const socials = sec.socials || {};
      setSocialGithub(socials.github || "");
      setSocialLinkedin(socials.linkedin || "");
      setSocialEmail(socials.email || "");

      const fConfig = sec.form || {};
      setFormEnabled(fConfig.enabled !== false);
      setNotificationEmail(fConfig.notificationEmail || "");
    }
  }, [profile]);

  // Selected message state binding
  const selectedMsg = messages.find(m => m.id === selectedMsgId) || null;

  // Auto-mark message as read if opened
  useEffect(() => {
    if (selectedMsg && selectedMsg.status === 'unread') {
      handleStatusChange(selectedMsg.id, 'opened');
    }
  }, [selectedMsgId]);

  // ── Inbox Actions ──────────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: string) => {
    setSavingMsgAction(true);
    try {
      await api.patch(`/messages/${id}/status`, { status: newStatus });
      await fetchEverything();
    } catch (err: any) {
      console.error('Update message status error:', err);
      setError(err.response?.data?.message || 'Failed to update read/starred status.');
    } finally {
      setSavingMsgAction(false);
    }
  };

  const startDeleteMsg = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMsgToDeleteId(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteMsg = async () => {
    if (!msgToDeleteId) return;
    setSavingMsgAction(true);
    try {
      await api.delete(`/messages/${msgToDeleteId}`);
      setSelectedMsgId(null);
      setSuccess('Message permanently deleted from database.');
      await fetchEverything();
    } catch (err: any) {
      console.error('Delete message error:', err);
      setError(err.response?.data?.message || 'Failed to delete message.');
    } finally {
      setSavingMsgAction(false);
      setIsConfirmDeleteOpen(false);
      setMsgToDeleteId(null);
    }
  };

  // ── Settings Actions ────────────────────────────────────────
  const getCombinedSection = (overrides: Partial<any> = {}) => {
    return {
      heading,
      description,
      quote,
      quoteAuthor,
      availability: availabilityList,
      location: locationText,
      responseTime: responseTimeText,
      socials: {
        github: socialGithub,
        linkedin: socialLinkedin,
        email: socialEmail
      },
      form: {
        enabled: formEnabled,
        notificationEmail: notificationEmail
      },
      ...overrides
    };
  };

  const emitSectionUpdate = (newSec: any) => {
    if (socket && user?.portfolioSlug) {
      socket.emit('contact:update', {
        slug: user.portfolioSlug,
        contactSection: newSec
      });
    }
  };

  const handleGlobalFieldChange = (field: string, val: any) => {
    let updated = getCombinedSection();
    if (field === 'heading') { setHeading(val); updated.heading = val; }
    else if (field === 'description') { setDescription(val); updated.description = val; }
    else if (field === 'quote') { setQuote(val); updated.quote = val; }
    else if (field === 'quoteAuthor') { setQuoteAuthor(val); updated.quoteAuthor = val; }
    else if (field === 'location') { setLocationText(val); updated.location = val; }
    else if (field === 'responseTime') { setResponseTimeText(val); updated.responseTime = val; }
    else if (field === 'github') { setSocialGithub(val); updated.socials.github = val; }
    else if (field === 'linkedin') { setSocialLinkedin(val); updated.socials.linkedin = val; }
    else if (field === 'email') { setSocialEmail(val); updated.socials.email = val; }
    else if (field === 'formEnabled') { setFormEnabled(val); updated.form.enabled = val; }
    else if (field === 'notificationEmail') { setNotificationEmail(val); updated.form.notificationEmail = val; }
    emitSectionUpdate(updated);
  };

  const addAvailabilityItem = () => {
    if (!newAvailText.trim()) return;
    const nextList = [...availabilityList, newAvailText.trim()];
    setAvailabilityList(nextList);
    setNewAvailText('');
    emitSectionUpdate(getCombinedSection({ availability: nextList }));
  };

  const deleteAvailabilityItem = (index: number) => {
    const nextList = availabilityList.filter((_, idx) => idx !== index);
    setAvailabilityList(nextList);
    emitSectionUpdate(getCombinedSection({ availability: nextList }));
  };

  const saveContactSection = async () => {
    setSavingSettings(true);
    try {
      const dbPayload = getCombinedSection();
      await api.patch('/portfolio/profile', {
        contactSection: dbPayload
      });
      setSuccess('Contact details synced successfully with PostgreSQL!');
      await fetchEverything();
    } catch (err: any) {
      console.error('SaveContactSection Error:', err);
      setError(err.response?.data?.message || 'Failed to sync contact settings to database.');
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Metrics Strip Calculations ──────────────────────────────
  const totalCount = messages.filter(m => m.status !== 'spam').length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const starredCount = messages.filter(m => m.status === 'starred').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthCount = messages.filter(m => {
    const d = new Date(m.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && m.status !== 'spam';
  }).length;

  return (
    <div className="space-y-6 animate-fade-in pr-2 pb-6 text-left">
      
      {/* CMS Header Row */}
      <div className="flex justify-between items-center border-b border-border/60 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact & Inquiry CMS</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage visitor direct communications, inbox opportunities, availability slots, and custom credentials channels.</p>
        </div>

        {activeTab === 'settings' && (
          <button
            onClick={saveContactSection}
            disabled={savingSettings}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'SYNCING...' : 'SAVE CHANGES'}</span>
          </button>
        )}
      </div>

      {/* Tabs Menu Selection */}
      <div className="flex gap-1 bg-background/50 border border-border/60 p-1 rounded-xl w-fit">
        {[
          { id: 'inbox', label: 'Inbox Stream', icon: <Mail className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Contact Settings', icon: <Settings className="w-3.5 h-3.5" /> }
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

      {/* TAB 1: INBOX STREAM WORKSPACE */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Strip Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Inquiries', value: totalCount, border: 'border-white/5', text: 'text-white' },
              { label: 'Unread Signals', value: unreadCount, border: 'border-purple-500/10 bg-purple-500/5', text: 'text-purple-400 font-extrabold' },
              { label: 'Starred Opportunities', value: starredCount, border: 'border-amber-500/10 bg-amber-500/5', text: 'text-amber-400' },
              { label: 'This Month', value: thisMonthCount, border: 'border-white/5', text: 'text-neutral-300' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-center ${stat.border} shadow-sm font-mono`}>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className={`text-xl font-black ${stat.text}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
            
            {/* INBOX LEFT LIST COLUMN */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-4 flex flex-col space-y-3">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-extrabold block border-b border-border/40 pb-2">// Incoming Messages Timeline</span>
              
              <div className="overflow-y-auto max-h-[480px] space-y-2 pr-1.5 no-scrollbar flex-1">
                {messages.length === 0 ? (
                  <div className="text-center py-20 space-y-2">
                    <MailOpen className="w-8 h-8 text-zinc-700 mx-auto" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block font-mono">Terminal Inbox Empty</span>
                  </div>
                ) : (
                  messages
                    .filter(m => m.status !== 'spam')
                    .map((msg) => {
                      const isSelected = selectedMsgId === msg.id;
                      const isUnread = msg.status === 'unread';
                      
                      return (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMsgId(msg.id)}
                          className={`p-3.5 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-neutral-900 border-primary shadow-sm' 
                              : isUnread 
                              ? 'bg-neutral-900/40 border-white/10 text-white font-bold' 
                              : 'bg-background border-border text-muted-foreground opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-bold ${isSelected ? 'text-primary' : isUnread ? 'text-white' : 'text-neutral-300'}`}>
                              {msg.senderName}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-500">
                              {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-light truncate max-w-[80%] leading-relaxed">{msg.subject || '(No Subject)'}</span>
                            <div className="flex gap-1 shrink-0">
                              {msg.status === 'starred' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                              {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_6px_#fb923c]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* INBOX RIGHT DETAILS COLUMN */}
            <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-5 flex flex-col justify-between min-h-[480px]">
              {selectedMsg ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Subject & Simple Toolbar */}
                  <div className="space-y-3 pb-3 border-b border-border/40 text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-base font-black text-white uppercase tracking-tight">{selectedMsg.subject || '(No Subject)'}</h4>
                        <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
                          Received: {new Date(selectedMsg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Tool Actions Row */}
                      <div className="flex items-center gap-1.5">
                        {/* Star */}
                        <button
                          onClick={() => handleStatusChange(selectedMsg.id, selectedMsg.status === 'starred' ? 'opened' : 'starred')}
                          className={`p-2 rounded-lg border cursor-pointer transition-all ${
                            selectedMsg.status === 'starred' 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                              : 'bg-background border-border text-zinc-400 hover:text-white'
                          }`}
                          title="Star Message"
                        >
                          <Star className={`w-3.5 h-3.5 ${selectedMsg.status === 'starred' ? 'fill-amber-400' : ''}`} />
                        </button>
                        
                        {/* Read Toggle */}
                        <button
                          onClick={() => handleStatusChange(selectedMsg.id, selectedMsg.status === 'unread' ? 'opened' : 'unread')}
                          className={`p-2 rounded-lg border cursor-pointer transition-all ${
                            selectedMsg.status === 'unread' 
                              ? 'bg-primary/10 border-primary/30 text-primary' 
                              : 'bg-background border-border text-zinc-400 hover:text-white'
                          }`}
                          title={selectedMsg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                        >
                          {selectedMsg.status === 'unread' ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => startDeleteMsg(selectedMsg.id)}
                          className="p-2 rounded-lg border border-red-500/10 bg-red-950/15 text-red-400 hover:text-red-300 hover:border-red-500/30 transition-all cursor-pointer"
                          title="Purge Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sender Metadata Block */}
                  <div className="p-4 bg-background border border-border rounded-xl space-y-2 text-left font-sans text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Sender Name</span>
                        <span className="font-bold text-white uppercase">{selectedMsg.senderName}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Email Address</span>
                        <span className="font-mono text-primary font-bold break-all select-all">{selectedMsg.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Full message body */}
                  <div className="p-5 bg-background border border-border rounded-xl relative flex-1 flex flex-col justify-start min-h-[160px] text-left">
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line select-text pl-4 border-l-2 border-primary/30 font-sans">
                      {selectedMsg.message}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-zinc-600 relative">
                    <Mail className="w-5 h-5" />
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Awaiting Message Select</h5>
                    <p className="text-[10px] text-zinc-500 mt-1 max-w-xs leading-normal">Choose any active collaboration card in the timeline stream to preview full inquiry texts.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CONTACT SETTINGS CMS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SETTINGS LEFT PANEL FORM */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* HERO SETTINGS CARD */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>Contact Hero & Branding Details</span>
              </span>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Headline</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => handleGlobalFieldChange('heading', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Roadmap Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => handleGlobalFieldChange('description', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-sans leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Connect Quote Card Text</label>
                    <input
                      type="text"
                      value={quote}
                      onChange={(e) => handleGlobalFieldChange('quote', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white italic"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Quote Author Name</label>
                    <input
                      type="text"
                      value={quoteAuthor}
                      onChange={(e) => handleGlobalFieldChange('quoteAuthor', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CURRENTLY AVAILABLE FOR REGISTRY */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Currently Available For Registry</span>
              </span>

              <div className="space-y-3">
                {/* Compact tags list */}
                <div className="flex flex-wrap gap-1.5 p-3.5 bg-background border border-border rounded-xl">
                  {availabilityList.length === 0 ? (
                    <span className="text-[10px] text-zinc-600 font-mono italic">No availability tags configured. Add items below.</span>
                  ) : (
                    availabilityList.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-neutral-900 border border-white/5 text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 select-none animate-fade-in">
                        <span>{tag}</span>
                        <X 
                          onClick={() => deleteAvailabilityItem(idx)}
                          className="w-3 h-3 text-zinc-500 hover:text-red-400 cursor-pointer" 
                        />
                      </span>
                    ))
                  )}
                </div>

                {/* Add Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAvailText}
                    onChange={(e) => setNewAvailText(e.target.value)}
                    placeholder="e.g. AI-Powered Systems"
                    className="flex-1 bg-background border border-border focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    onKeyDown={(e) => { if (e.key === 'Enter') addAvailabilityItem(); }}
                  />
                  <button
                    onClick={addAvailabilityItem}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD ITEM</span>
                  </button>
                </div>
              </div>
            </div>

            {/* LOCATION & TELEMETRY RESPONSE */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Location & Response Speed Settings</span>
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Based Location / Timezone</label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => handleGlobalFieldChange('location', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    placeholder="India (GMT +5:30)"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Expected Response Speed</label>
                  <input
                    type="text"
                    value={responseTimeText}
                    onChange={(e) => handleGlobalFieldChange('responseTime', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white"
                    placeholder="Usually within 24 Hours"
                  />
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS CARD */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Direct Personal Social Channels</span>
              </span>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">GitHub Profile Link</label>
                    <input
                      type="url"
                      value={socialGithub}
                      onChange={(e) => handleGlobalFieldChange('github', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">LinkedIn Profile Link</label>
                    <input
                      type="url"
                      value={socialLinkedin}
                      onChange={(e) => handleGlobalFieldChange('linkedin', e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Verified Contact Email</label>
                  <input
                    type="email"
                    value={socialEmail}
                    onChange={(e) => handleGlobalFieldChange('email', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* FORM CONFIG CARD */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Form Submission & Configurations</span>
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3.5 bg-background border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight block">Enable Contact form submissions</span>
                    <span className="text-[9px] text-zinc-500 block leading-none">Toggle the public Send Message form container ON/OFF.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGlobalFieldChange('formEnabled', !formEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      formEnabled 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25' 
                        : 'bg-muted border border-border text-muted-foreground hover:text-white'
                    }`}
                  >
                    {formEnabled ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{formEnabled ? 'FORM ONLINE' : 'FORM OFFLINE'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Inbound Notifications Email</label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => handleGlobalFieldChange('notificationEmail', e.target.value)}
                    className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white font-mono"
                    placeholder="mahi.inquiries@email.com"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* SETTINGS RIGHT PANEL LIVE PREVIEW */}
          <div className="lg:col-span-5 h-full lg:sticky lg:top-0 space-y-4">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-black tracking-widest uppercase border-b border-border/40 pb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>🧗 LIVE CONTACT PREVIEW</span>
            </div>

            {/* Simulated Live Contact Page rendering */}
            <div className="w-full rounded-[28px] border border-white/10 bg-neutral-950 p-6 md:p-8 space-y-6 max-h-[680px] overflow-y-auto relative text-left">
              
              <div className="space-y-2 pb-4 border-b border-white/5">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none font-display">
                  {heading}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-light font-sans leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                
                {/* Left Side: Quote, availability, based location */}
                <div className="space-y-5">
                  
                  {/* Quote block */}
                  {quote && (
                    <div className="pb-4 border-b border-white/5 space-y-1">
                      <p className="text-zinc-300 italic font-sans text-xs leading-relaxed">
                        "{quote}"
                      </p>
                      <p className="text-zinc-500 font-extrabold text-[8px] tracking-widest uppercase font-mono">
                        — {quoteAuthor}
                      </p>
                    </div>
                  )}

                  {/* Availability lists */}
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">// Currently Available For</span>
                    <ul className="space-y-1.5 font-sans text-[11px] text-zinc-300">
                      {availabilityList.map((tag, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 shrink-0" />
                          <span>{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Location speed */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 text-[9px] font-sans">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase block leading-none">Based In</span>
                      <span className="text-white font-bold block">{locationText}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase block leading-none">Response Speed</span>
                      <span className="text-white font-bold block">{responseTimeText}</span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">// Connect Directly</span>
                    <div className="flex flex-wrap gap-2 text-[9px]">
                      {socialGithub && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 bg-neutral-900 text-zinc-300">
                          <Github className="w-3 h-3" />
                          <span>GitHub</span>
                          <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                        </div>
                      )}
                      {socialLinkedin && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 bg-neutral-900 text-zinc-300">
                          <Linkedin className="w-3 h-3" />
                          <span>LinkedIn</span>
                          <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                        </div>
                      )}
                      {socialEmail && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 bg-neutral-900 text-zinc-350">
                          <Mail className="w-3 h-3" />
                          <span>Email Address</span>
                          <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Side: Simulated Form */}
                <div className="pt-4 border-t border-white/5">
                  {formEnabled ? (
                    <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 text-zinc-400 space-y-4">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold">// Send Inbound Inquiry Form</span>
                      
                      <div className="space-y-3 font-sans text-xs">
                        <div className="border-b border-white/5 pb-2 text-zinc-500 font-bold block">Your Name</div>
                        <div className="border-b border-white/5 pb-2 text-zinc-500 font-bold block">Email Address</div>
                        <div className="border-b border-white/5 pb-2 text-zinc-500 font-bold block">Outline project scope...</div>
                      </div>

                      <div className="w-fit px-4 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider shadow">
                        Send Message
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl border border-dashed border-red-500/20 bg-red-950/5 text-center text-red-400 font-sans text-[10px] space-y-1.5">
                      <AlertCircle className="w-5 h-5 mx-auto" />
                      <span className="font-bold uppercase tracking-wider block">Form submissions offline</span>
                      <p className="text-zinc-500 px-2 leading-relaxed">Direct messaging form is currently deactivated. Please connect directly via the social channel buttons above.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* Confirmation Purge Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteMsg}
        title="Purge Opportunity Signal Record"
        message="Are you absolutely sure you want to permanently delete this visitor message opportunity from your database? This inquiry cannot be recovered."
        confirmText="PURGE PERMANENTLY"
        loading={savingMsgAction}
      />

    </div>
  );
}
