import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  Mail, Send, CheckCircle, AlertCircle, 
  Linkedin, Github, FileText, Phone, MapPin, 
  Sparkles, ArrowUpRight, Copy, Check, Globe
} from 'lucide-react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { typography } from '../../styles/tokens';
import shashwatPortrait from '../../assets/shashwat_portrait.jpg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api');

const DEFAULT_CMS = {
  hero: {
    badgeText: "START A CONVERSATION",
    mainHeading: "Let’s Build Something Amazing",
    subtitle: "Whether you have a project, startup idea, collaboration opportunity, or just want to connect — I’d love to hear from you."
  },
  profileCard: {
    name: "Shashwat Dixit",
    role: "AI-focused Product Builder & System Engineer",
    profileImage: "",
    statusTitle: "Available for Projects",
    statusDescription: "Open for freelance contracts, internships, and deep engineering collaborations."
  },
  contactDetails: {
    phone: "+91 7317649942",
    location: "Delhi, India // Available Globally",
    email: "shashwat.dixit@example.com",
    responseMetric: "REPLIES IN < 24H"
  },
  socialCards: [
    { platform: "LinkedIn", url: "https://linkedin.com", label: "Professional Profile", enabled: true },
    { platform: "GitHub", url: "https://github.com", label: "Source Code", enabled: true },
    { platform: "Resume", url: "#", label: "Qualifications Document", enabled: true },
    { platform: "WhatsApp", url: "https://wa.me/917317649942", label: "Direct Chat", enabled: true }
  ],
  formSettings: {
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
  },
  visualSettings: {
    primaryGradient: "#8b5cf6",
    secondaryGradient: "#6366f1",
    glowIntensity: 0.08,
    backgroundBlur: 10
  }
};

interface ContactTabProps {
  user: any;
  slug: string;
  profile: any;
}

export default function ContactTab({ user, slug, profile }: ContactTabProps) {
  const [cms, setCms] = useState<any>(DEFAULT_CMS);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Load Contact CMS configuration
  const loadCMS = async () => {
    try {
      const res = await axios.get(`${API_BASE}/sd/communication/contact-cms`);
      if (res.data.data.contactCMS) {
        setCms(res.data.data.contactCMS);
      }
    } catch (err) {
      console.warn('Failed to load SD Contact CMS on frontend. Falling back to default settings.');
    }
  };

  useEffect(() => {
    loadCMS();

    // Hook up real-time socket updates for CMS configurations
    const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.emit('portfolio:join', 'shashwat');

    socket.on('communication_sd:updated', (payload) => {
      if (payload.contactCMS) {
        setCms(payload.contactCMS);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message details.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess(false);
      
      await axios.post(`${API_BASE}/sd/communication/messages`, {
        name,
        email,
        subject: subject || 'General Conversation',
        message
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setError('Message delivery failed. The system seems offline.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    const targetEmail = cms.contactDetails?.email || user?.email || "shashwat.dixit@example.com";
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'whatsapp':
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'portfolio':
      case 'globe':
      case 'website': return <Globe className="w-4 h-4" />;
      case 'resume': default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPlatformColors = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5";
      case 'github': return "hover:text-neutral-200 hover:border-white/20 hover:bg-white/5";
      case 'whatsapp':
      case 'phone': return "hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-400/5";
      case 'portfolio':
      case 'globe':
      case 'website': return "hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5";
      case 'resume': default: return "hover:text-purple-400 hover:border-purple-400/30 hover:bg-purple-400/5";
    }
  };

  const activeSocialCards = (cms.socialSocialLinks || cms.socialCards || DEFAULT_CMS.socialCards).filter((s: any) => s.enabled);

  return (
    <SectionWrapper delay={0.05} className="space-y-12 py-10 max-w-7xl mx-auto text-left relative">
      
      {/* Editorial Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-xs text-neutral-400 w-max">
          <Mail className="w-3.5 h-3.5" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }} />
          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-neutral-300">
            {cms.hero?.badgeText || 'START A CONVERSATION'}
          </span>
        </div>
        
        <h2 className={`${typography.heading} leading-tight tracking-tight text-white`}>
          {cms.hero?.mainHeading || 'Let’s Build Something Amazing'}
        </h2>
        
        <p className={`${typography.body} text-[#A1A1AA] font-light leading-relaxed max-w-xl`}>
          {cms.hero?.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Premium Contact Profile & Socials */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Avatar Profile Card */}
          <GlassCard
            hoverEffect={false}
            spotlightGlow={true}
            spotlightColor={`${cms.visualSettings?.primaryGradient || '#8b5cf6'}0e`}
            className="p-6 rounded-[32px] border border-white/[0.04] space-y-6 flex-1 flex flex-col justify-between"
            style={{
              boxShadow: `0 0 30px ${(cms.visualSettings?.primaryGradient || '#8b5cf6')}${Math.floor((cms.visualSettings?.glowIntensity ?? 0.08) * 255).toString(16).padStart(2, '0')}`,
              backdropFilter: `blur(${(cms.visualSettings?.backgroundBlur ?? 10)}px)`,
              WebkitBackdropFilter: `blur(${(cms.visualSettings?.backgroundBlur ?? 10)}px)`
            }}
          >
            <div className="space-y-5">
              {/* Profile Top Area */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={cms.profileCard?.profileImage || shashwatPortrait} 
                    alt="Shashwat Dixit Portrait" 
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                  />
                  {/* Glowing active indicator dot */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#070708] border border-white/5 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading text-white tracking-tight">
                    {cms.profileCard?.name || 'Shashwat Dixit'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light font-sans mt-0.5">
                    {cms.profileCard?.role}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-pulse" />
                <div className="space-y-0.5">
                  <p className="text-xs text-emerald-400 font-bold tracking-tight">{cms.profileCard?.statusTitle || 'Available for Projects'}</p>
                  <p className="text-[10px] text-neutral-400 leading-normal font-light">{cms.profileCard?.statusDescription}</p>
                </div>
              </div>

              {/* Core Info details */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }} />
                  <span>{cms.contactDetails?.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }} />
                  <span>{cms.contactDetails?.location}</span>
                </div>
                
                {/* Copyable Email field */}
                <div 
                  onClick={copyToClipboard}
                  className="flex items-center justify-between gap-3 p-3 bg-white/[0.01] border border-white/[0.03] rounded-2xl text-xs text-neutral-300 hover:bg-white/[0.03] hover:border-white/[0.08] cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail className="w-4 h-4 shrink-0" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }} />
                    <span className="truncate select-all">{cms.contactDetails?.email || targetEmail}</span>
                  </div>
                  <button className="text-neutral-500 hover:text-white transition-colors shrink-0">
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="border-t border-white/[0.03] pt-4 mt-6 flex justify-between items-center text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>RESPONSE METRIC</span>
              <span className="font-bold animate-pulse" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }}>
                {cms.contactDetails?.responseMetric || 'REPLIES IN < 24H'}
              </span>
            </div>
          </GlassCard>

          {/* Social Contact Grid */}
          <div className="grid grid-cols-2 gap-4">
            {activeSocialCards.map((social: any) => (
              <a
                key={social.platform}
                href={social.url}
                target={social.platform !== "WhatsApp" && social.platform !== "Resume" ? "_blank" : undefined}
                rel={social.platform !== "WhatsApp" && social.platform !== "Resume" ? "noopener noreferrer" : undefined}
                className={`p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex flex-col justify-between h-[100px] text-left transition-all duration-300 group ${getPlatformColors(
                  social.platform
                )}`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="p-2 bg-white/[0.02] border border-white/[0.05] rounded-xl text-neutral-400 group-hover:text-inherit group-hover:bg-white/[0.03] transition-colors">
                    {renderSocialIcon(social.platform)}
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {social.platform}
                  </span>
                  <p className="text-[8px] text-neutral-500 truncate uppercase tracking-wider font-mono">
                    {social.label}
                  </p>
                </div>
              </a>
            ))}
          </div>

        </div>

        {/* Right Side: Luxury Glassmorphic Contact Form */}
        <GlassCard
          hoverEffect={false}
          spotlightGlow={true}
          spotlightColor={`${cms.visualSettings?.primaryGradient || '#8b5cf6'}0e`}
          className="lg:col-span-7 rounded-[32px] border border-white/[0.04] p-8 flex flex-col space-y-6"
          style={{
            boxShadow: `0 0 30px ${(cms.visualSettings?.primaryGradient || '#8b5cf6')}${Math.floor((cms.visualSettings?.glowIntensity ?? 0.08) * 255).toString(16).padStart(2, '0')}`,
            backdropFilter: `blur(${(cms.visualSettings?.backgroundBlur ?? 10)}px)`,
            WebkitBackdropFilter: `blur(${(cms.visualSettings?.backgroundBlur ?? 10)}px)`
          }}
        >
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
            <h3 className="text-lg font-bold font-heading text-white tracking-tight">
              {cms.formSettings?.formHeading || 'Start a Conversation'}
            </h3>
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: cms.visualSettings?.primaryGradient || '#8b5cf6' }} />
          </div>

          <form onSubmit={handleConnect} className="space-y-6">
            
            {/* Split row: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sender Name */}
              <div className="space-y-2 relative group text-left">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">
                  Sender Name <span className="text-purple-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={cms.formSettings?.namePlaceholder || "e.g. Elon Musk"}
                  className="w-full bg-white/[0.01] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(139,92,246,0.08)] transition-all duration-300"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2 relative group text-left">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">
                  Email Address <span className="text-purple-400">*</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={cms.formSettings?.emailPlaceholder || "e.g. elon@spacex.com"}
                  className="w-full bg-white/[0.01] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(139,92,246,0.08)] transition-all duration-300"
                  required
                />
              </div>

            </div>

            {/* Subject Preset Selection */}
            <div className="space-y-2 relative group text-left">
              <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">
                Collaboration Category / Subject <span className="text-purple-400">*</span>
              </label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(139,92,246,0.08)] transition-all duration-300 select-dropdown"
                required
              >
                <option value="" disabled className="bg-[#0A0A0C]">{cms.formSettings?.subjectPlaceholder || '-- Select Subject Preset --'}</option>
                {(cms.formSettings?.subjectPresets || DEFAULT_CMS.formSettings.subjectPresets).map((preset: string) => (
                  <option key={preset} value={preset} className="bg-[#0A0A0C]">{preset}</option>
                ))}
              </select>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2 relative group text-left">
              <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">
                Your Message <span className="text-purple-400">*</span>
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={cms.formSettings?.messagePlaceholder || "Tell me about your project..."}
                rows={5}
                className="w-full bg-white/[0.01] border border-white/[0.06] rounded-2xl p-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(139,92,246,0.08)] transition-all duration-300 resize-none font-sans leading-relaxed"
                required
              />
            </div>

            {/* Error / Success Display Panel */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-400 text-xs font-sans text-left"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <div className="space-y-0.5">
                    <p className="font-bold tracking-tight">Signal Error</p>
                    <p className="text-[11px] text-neutral-400 leading-normal font-light">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3 text-emerald-400 text-xs font-sans text-left"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="space-y-0.5">
                    <p className="font-bold tracking-tight">Transmission Complete</p>
                    <p className="text-[11px] text-neutral-400 leading-normal font-light">Message sent successfully! I will reach out to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA SEND BUTTON WITH SWEEP SHINE */}
            <div className="relative rounded-2xl overflow-hidden p-0.5 group w-full">
              {/* Continuous border glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" 
                style={{
                  backgroundImage: `linear-gradient(to right, ${(cms.visualSettings?.primaryGradient || '#8b5cf6')}, ${(cms.visualSettings?.secondaryGradient || '#6366f1')})`
                }}
              />
              
              <button
                type="submit"
                disabled={submitting}
                className="relative w-full py-4 px-6 text-white rounded-2xl text-xs font-bold font-heading uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(to right, ${(cms.visualSettings?.primaryGradient || '#8b5cf6')}, ${(cms.visualSettings?.secondaryGradient || '#6366f1')})`
                }}
              >
                {/* Sweep shine overlay */}
                <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                
                <span>{submitting ? 'Sending Signal...' : (cms.formSettings?.submitButtonText || 'Let’s Connect')}</span>
                <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </button>
            </div>

          </form>
        </GlassCard>
 
      </div>
    </SectionWrapper>
  );
}
