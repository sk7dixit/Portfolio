import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import { 
  Mail, MailOpen, Trash2, Calendar, User, MessageSquare, 
  Star, Archive, ShieldAlert, Sparkles, Send, MapPin, 
  Laptop, Compass, ExternalLink, BookOpen, AlertCircle, 
  CheckCircle, FileText, PlusCircle, Check
} from 'lucide-react';

export default function MessageInbox() {
  const messages = useStore((state) => state.messages);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  const [activeTab, setActiveTab] = useState<'all' | 'priority' | 'starred' | 'replied' | 'archive' | 'spam'>('all');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note and Reply state
  const [notes, setNotes] = useState('');
  const [replyText, setReplyText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Quick Template Presets
  const replyTemplates = [
    {
      label: 'Collaboration Acceptance',
      text: 'Hi [Name],\n\nThank you for reaching out! Your proposal sounds exciting. I\'d love to jump on a brief call next week to discuss this further. Let me know what times work best for you.\n\nBest,\nShashwat'
    },
    {
      label: 'Freelance Inquiry Callback',
      text: 'Hi [Name],\n\nThanks for inquiring about a freelance collaboration! I\'ve reviewed your project outline. Let\'s schedule a deep-dive AI consultation session to lock in specs and deliverable milestones.\n\nLooking forward to building this,\nShashwat'
    },
    {
      label: 'Hiring/Interview Schedule',
      text: 'Hi [Name],\n\nThank you for this hiring opportunity! I\'d be absolutely thrilled to schedule an interview with your team. Please share a Calendly link or a few time slots next week.\n\nKind regards,\nShashwat'
    }
  ];

  // Reload data periodically or on focus
  useEffect(() => {
    fetchEverything();
  }, []);

  const selectedMsg = messages.find((m) => m.id === selectedMsgId);

  // Sync notes when active message changes
  useEffect(() => {
    if (selectedMsg) {
      setNotes(selectedMsg.notes || '');
      setIsNotesSaved(false);
      // Auto-mark message as read if opened
      if (selectedMsg.status === 'unread') {
        handleStatusChange(selectedMsg.id, 'opened');
      }
    }
  }, [selectedMsgId]);

  // Action: Toggle Starred, Archived, Spam status
  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      await api.patch(`/messages/${id}/status`, { status: newStatus });
      await fetchEverything();
      setSuccess(`Inquiry updated to: ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      console.error('Update status error:', err);
      setError(err.response?.data?.message || 'Failed to update opportunity status');
    } finally {
      setLoadingId(null);
    }
  };

  // Action: Toggle Priority Escalation
  const handlePriorityChange = async (id: string, newPriority: string) => {
    setLoadingId(id);
    try {
      await api.patch(`/messages/${id}/status`, { priority: newPriority });
      await fetchEverything();
      setSuccess(`Opportunity priority updated to: ${newPriority}`);
    } catch (err: any) {
      console.error('Update priority error:', err);
      setError(err.response?.data?.message || 'Failed to escalate priority');
    } finally {
      setLoadingId(null);
    }
  };

  // Action: Save private admin notes
  const handleSaveNotes = async () => {
    if (!selectedMsgId) return;
    setSavingNotes(true);
    try {
      await api.patch(`/messages/${selectedMsgId}/notes`, { notes });
      await fetchEverything();
      setIsNotesSaved(true);
      setSuccess('Private notes synced successfully.');
      setTimeout(() => setIsNotesSaved(false), 2000);
    } catch (err: any) {
      console.error('Save notes error:', err);
      setError(err.response?.data?.message || 'Failed to save admin notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Action: Submit reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsgId || !replyText.trim()) return;
    setSubmittingReply(true);
    try {
      await api.post(`/messages/${selectedMsgId}/reply`, { text: replyText });
      await fetchEverything();
      setReplyText('');
      setSuccess('Reply logged in conversation timeline.');
    } catch (err: any) {
      console.error('Send reply error:', err);
      setError(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Action: Delete Message
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this opportunity from records?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setSelectedMsgId(null);
      setSuccess('Signal permanently deleted.');
      await fetchEverything();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to purge opportunity');
    }
  };

  const handleApplyTemplate = (templateText: string) => {
    if (!selectedMsg) return;
    const filled = templateText.replace('[Name]', selectedMsg.senderName);
    setReplyText(filled);
  };

  // PDF Export simulator
  const handleExportPDF = () => {
    if (!selectedMsg) return;
    window.print();
  };

  // Filters logic
  const filteredMessages = messages.filter((msg) => {
    // 1. Tab filter
    if (activeTab === 'priority' && msg.priority !== 'HIGH') return false;
    if (activeTab === 'starred' && msg.status !== 'starred') return false;
    if (activeTab === 'replied' && msg.status !== 'replied') return false;
    if (activeTab === 'archive' && msg.status !== 'archived') return false;
    if (activeTab === 'spam' && msg.status !== 'spam') return false;
    if (activeTab !== 'archive' && activeTab !== 'spam' && (msg.status === 'archived' || msg.status === 'spam')) return false;

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        msg.senderName.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        (msg.subject || '').toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.category || '').toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Analytics top row counters
  const totalLeads = messages.filter(m => m.status !== 'spam').length;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const starredCount = messages.filter((m) => m.status === 'starred').length;
  const highPriorityCount = messages.filter((m) => m.priority === 'HIGH').length;
  const repliedRatio = totalLeads > 0 
    ? Math.round((messages.filter(m => m.status === 'replied').length / totalLeads) * 100) 
    : 0;

  const avgLeadScore = totalLeads > 0
    ? Math.round(messages.filter(m => m.status !== 'spam').reduce((acc, m) => acc + (m.leadScore || 50), 0) / totalLeads)
    : 50;

  // Category Color Map helper
  const getCategoryTag = (cat: string) => {
    const map: Record<string, { label: string; style: string }> = {
      STARTUP: { label: 'Startup Lead', style: 'bg-red-500/10 border-red-500/20 text-red-400' },
      HIRING: { label: 'Hiring Opp', style: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
      FREELANCE: { label: 'Freelance Gigs', style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
      AI_CONSULTATION: { label: 'AI Consulting', style: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
      INTERN_INQUIRY: { label: 'Internship', style: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
      GENERAL: { label: 'General Signal', style: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400' }
    };
    return map[cat] || { label: cat, style: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400' };
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Dynamic Cyber Header & Top Row Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Core Deck Label Card */}
        <div className="col-span-2 bg-[#0C0C0E] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="space-y-1">
            <h2 className="text-md font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Communication Control Deck</span>
            </h2>
            <p className="text-[10px] text-zinc-500 leading-normal">Session telemetry tracker, automatic AI priority grading, and inbound opportunity management console.</p>
          </div>
          <div className="flex gap-2 items-center mt-3 pt-3 border-t border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">● {unreadCount} Live Signals Buffer</span>
          </div>
        </div>

        {/* Analytic Dial 1 */}
        <div className="bg-[#0C0C0E] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Avg Lead Intent</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black font-heading text-white">{avgLeadScore}</span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">/100</span>
          </div>
          <span className="text-[9px] text-zinc-400 mt-1 font-mono uppercase tracking-wider">Quality Score Metric</span>
        </div>

        {/* Analytic Dial 2 */}
        <div className="bg-[#0C0C0E] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Priority Escalations</span>
          <div className="mt-3">
            <span className="text-2xl font-black font-heading text-red-400">{highPriorityCount}</span>
          </div>
          <span className="text-[9px] text-zinc-400 mt-1 font-mono uppercase tracking-wider">High Agency Opportunity</span>
        </div>

        {/* Analytic Dial 3 */}
        <div className="bg-[#0C0C0E] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden font-mono">
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Replied Ratio</span>
          <div className="mt-3">
            <span className="text-2xl font-black font-heading text-emerald-400">{repliedRatio}%</span>
          </div>
          <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-wider">Outbound Velocity</span>
        </div>

      </div>

      {/* Cyber CRM Command Split View Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[640px]">
        
        {/* Left Side Panel: Opportunity Inbound Stream */}
        <div className="lg:col-span-5 bg-[#0C0C0E] border border-white/5 rounded-3xl p-5 flex flex-col shadow-2xl space-y-4">
          
          {/* Header & Search Bar */}
          <div className="space-y-3.5">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, tags, or message..."
              className="w-full bg-[#070709] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/30 transition-all font-mono"
            />

            {/* Filter Tabs grid */}
            <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2.5">
              {[
                { id: 'all', label: 'All Inbound' },
                { id: 'priority', label: 'Priority' },
                { id: 'starred', label: 'Starred' },
                { id: 'replied', label: 'Replied' },
                { id: 'archive', label: 'Archived' },
                { id: 'spam', label: 'Spam' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-md' 
                      : 'bg-transparent border border-transparent text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Stream list */}
          <div className="flex-1 overflow-y-auto max-h-[580px] space-y-3 pr-1.5 no-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <MailOpen className="w-10 h-10 text-zinc-700 mx-auto" />
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">No signals buffer match</p>
                <p className="text-[9px] text-zinc-600">Modify filters or queries to scan historical logs.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMsgId === msg.id;
                const isUnread = msg.status === 'unread';
                const tagInfo = getCategoryTag(msg.category || 'GENERAL');
                const initials = msg.senderName.slice(0, 2).toUpperCase();
                
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer group select-none hover:shadow-xl ${
                      isSelected 
                        ? 'bg-purple-500/[0.03] border-purple-500/30 shadow-inner' 
                        : isUnread 
                        ? 'bg-white/[0.01] border-white/[0.08]' 
                        : 'bg-[#070709]/40 border-white/[0.03] opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Left Priority Accent Border */}
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 rounded-r-md transition-all ${
                      msg.priority === 'HIGH' 
                        ? 'bg-red-400 shadow-[0_0_8px_#f87171]' 
                        : isUnread 
                        ? 'bg-purple-400' 
                        : 'bg-transparent group-hover:bg-zinc-700'
                    }`} />

                    {/* Sender Profile Initials Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                      msg.priority === 'HIGH'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                        : 'bg-white/5 border border-white/10 text-zinc-400'
                    }`}>
                      {initials}
                    </div>

                    {/* Meta & Info details */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-white truncate">{msg.senderName}</span>
                        <span className="text-[9px] font-mono text-zinc-500 shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-zinc-400 truncate tracking-wide font-light">{msg.subject || '(No Subject)'}</p>
                      
                      {/* Tags row */}
                      <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-mono uppercase tracking-wider font-extrabold ${tagInfo.style}`}>
                          {tagInfo.label}
                        </span>
                        {msg.priority === 'HIGH' && (
                          <span className="px-2 py-0.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest animate-pulse">
                            HIGH PRIORITY
                          </span>
                        )}
                        {msg.status === 'starred' && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                        {msg.status === 'replied' && (
                          <span className="px-2 py-0.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono uppercase font-bold">
                            replied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side Panel: Active Lead Command view */}
        <div className="lg:col-span-7 bg-[#0C0C0E] border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl items-stretch relative min-h-[580px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
          
          {selectedMsg ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Header: Sender details and lead score */}
              <div className="space-y-3 pb-4 border-b border-white/5">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-black text-white">{selectedMsg.senderName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        Slug: sd
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 hover:text-white select-all cursor-pointer transition-colors block mt-0.5">({selectedMsg.email})</span>
                  </div>

                  {/* High fidelity lead score dial badge */}
                  <div className="flex flex-col items-end">
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Lead intent score</div>
                    <div className="flex items-center gap-2 mt-1 bg-white/[0.02] border border-white/5 rounded-2xl px-3.5 py-2 shadow-inner">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#a78bfa]" />
                      <span className="text-xl font-black font-heading text-white">{selectedMsg.leadScore || 50}</span>
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">/100</span>
                    </div>
                  </div>
                </div>

                {/* Subject and Action buttons toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2.5">
                  <p className="text-xs font-extrabold text-purple-300 font-heading bg-purple-500/5 px-3.5 py-1.5 rounded-xl border border-purple-500/10">
                    Subject: {selectedMsg.subject || '(No Subject)'}
                  </p>
                  
                  {/* Option controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedMsg.id, selectedMsg.status === 'starred' ? 'opened' : 'starred')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedMsg.status === 'starred' 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-transparent border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Star Opportunity"
                    >
                      <Star className={`w-4 h-4 ${selectedMsg.status === 'starred' ? 'fill-amber-400' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => handleStatusChange(selectedMsg.id, selectedMsg.status === 'archived' ? 'opened' : 'archived')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedMsg.status === 'archived' 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                          : 'bg-transparent border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Archive Lead"
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStatusChange(selectedMsg.id, selectedMsg.status === 'spam' ? 'opened' : 'spam')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedMsg.status === 'spam' 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                          : 'bg-transparent border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Spam Filter toggle"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="p-2.5 rounded-xl border border-white/5 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      title="Print Opportunity Details"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-2.5 rounded-xl border border-red-500/10 bg-red-950/20 text-red-400 hover:text-red-300 hover:border-red-500/30 transition-all cursor-pointer"
                      title="Purge Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Session Timeline Telemetry grid */}
              <div className="bg-[#070709] border border-white/5 rounded-2xl p-4.5 space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black">Visitor Telemetry Report</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500">Live logs buffer</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Origin */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Sent From</span>
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate max-w-[120px] font-light">{selectedMsg.sourcePage || 'Contact Desk'}</span>
                    </div>
                  </div>
                  {/* Location */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Location</span>
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate font-light">{selectedMsg.location || 'India'}</span>
                    </div>
                  </div>
                  {/* Client system */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Device Classification</span>
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Laptop className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate font-light">{selectedMsg.device || 'Desktop'} ({selectedMsg.browser || 'Chrome'})</span>
                    </div>
                  </div>
                  {/* Lead Categorization */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Lead Category</span>
                    <div className="flex items-center gap-1.5 text-xs text-white font-extrabold uppercase">
                      <span className="text-[10px] text-purple-300 font-mono tracking-widest">{selectedMsg.category || 'GENERAL'}</span>
                    </div>
                  </div>
                </div>

                {/* Viewed projects timeline array */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block text-left">Telemetry Actions Timeline ({selectedMsg.viewedProjects?.length || 0} hits)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMsg.viewedProjects && selectedMsg.viewedProjects.length > 0 ? (
                      selectedMsg.viewedProjects.map((act: string, idx: number) => {
                        const isAction = act.includes('Opened') || act.includes('Downloaded');
                        return (
                          <span 
                            key={idx} 
                            className={`px-2.5 py-1 text-[8.5px] font-mono border rounded-lg flex items-center gap-1 ${
                              isAction 
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                : 'bg-purple-500/5 border-purple-500/20 text-purple-400'
                            }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-current" />
                            <span>{act}</span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider italic">No interactions captured in session before submission</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message content block */}
              <div className="bg-[#070709] border border-white/5 rounded-2xl p-5 relative">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-10 bg-purple-500 pointer-events-none" />
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line select-text pl-4 border-l-2 border-purple-500/30 text-left">
                  {selectedMsg.message}
                </p>
              </div>

              {/* Private administrative notes editor */}
              <div className="space-y-2.5 border-t border-white/5 pt-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">private developer scratchpad (admin notes)</span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 text-[9px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    {isNotesSaved ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-black">Synced</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3 h-3" />
                        <span>{savingNotes ? 'Syncing...' : 'Sync Note'}</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record strategic private notes here. Useful for hiring statuses, call schedules, founder details (autosaved in workspace)..."
                  rows={2}
                  className="w-full bg-[#070709] border border-white/5 rounded-2xl p-4.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/30 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Interactive Markdown Reply Suite */}
              <div className="space-y-4 border-t border-white/5 pt-4 text-left flex-1 flex flex-col justify-end">
                
                {/* Reply Timeline history list (if any replies exist) */}
                {selectedMsg.replies && selectedMsg.replies.length > 0 && (
                  <div className="space-y-3.5 mb-2 max-h-[140px] overflow-y-auto no-scrollbar border-b border-white/5 pb-4">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Reply log history timeline</span>
                    {selectedMsg.replies.map((rep: any, idx: number) => (
                      <div key={idx} className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-4 flex gap-3">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          SD
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-[10px] font-extrabold text-white">Shashwat Dixit</span>
                            <span className="text-[9px] font-mono text-zinc-500">{new Date(rep.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-normal whitespace-pre-line text-left pl-3.5 border-l-2 border-emerald-500/20">
                            {rep.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Templates Quick selector row */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-extrabold">quick presets:</span>
                  {replyTemplates.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => handleApplyTemplate(t.text)}
                      className="px-3 py-1.5 rounded-xl border border-white/5 bg-transparent hover:bg-white/5 text-[9px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Reply textbox */}
                <form onSubmit={handleSendReply} className="relative w-full">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply directly to ${selectedMsg.senderName}... (Markdown supported)`}
                    rows={3}
                    className="w-full bg-[#070709] border border-white/5 rounded-3xl pl-5 pr-14 py-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/30 resize-none font-sans leading-relaxed shadow-inner"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingReply || !replyText.trim()}
                    className="absolute right-4 bottom-4.5 p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer flex items-center justify-center shadow-lg hover:shadow-purple-500/25 active:scale-[0.97]"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>
          ) : (
            
            /* High Fidelity Cyber Holographic Empty State */
            <div className="flex-1 flex flex-col justify-center items-center gap-5 text-center min-h-[580px]">
              
              {/* Hologram Pulse Box */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Glowing ring borders */}
                <span className="absolute inset-0 rounded-full border border-purple-500/10 animate-pulse scale-125" />
                <span className="absolute inset-2 rounded-full border border-purple-500/5 animate-pulse" />
                
                {/* Pulsing focal nodes */}
                <div className="w-16 h-16 rounded-full bg-purple-500/5 border border-purple-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.1)] relative">
                  <Compass className="w-7 h-7 text-purple-400 animate-spin-slow" />
                  <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>

              <div className="space-y-2.5 max-w-sm">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-[0.2em] font-heading">Awaiting New Signals</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light font-sans px-4">Your portfolio communication telemetry links are active. Potential inbound collaborations, startup inquiries, and hiring proposals will display here.</p>
              </div>

              {/* Console logs ticker */}
              <div className="mt-4 font-mono text-[8px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 select-none bg-white/[0.01] border border-white/5 px-4 py-2 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>TERMINAL BUFFER IS ONLINE · NO ERROR CODES SHIPPED</span>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
