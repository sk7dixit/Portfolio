import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api';
import {
  User,
  Shield,
  Clock,
  Globe,
  Settings,
  Activity,
  Flame,
  CheckCircle,
  ExternalLink,
  Download,
  Copy,
  Terminal,
  Cpu,
  Sparkles,
  Lock,
  RefreshCw,
  Eye,
  Key,
  Database,
  Mail,
  Server
} from 'lucide-react';

export default function ProfileHub() {
  const storeUser = useStore((state) => state.user);
  const storeProfile = useStore((state) => state.profile);
  const notifications = useStore((state) => state.notifications) || [];
  const fetchProfile = useStore((state) => state.fetchProfile);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  const { activePortfolio, setActivePortfolio } = usePortfolio();

  // Local state for forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioSlug, setPortfolioSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('India');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [avatar, setAvatar] = useState('');

  // AI Personality states
  const [writingTone, setWritingTone] = useState('Technical & Premium');
  const [responseStyle, setResponseStyle] = useState('Founder Friendly');
  const [publicPositioning, setPublicPositioning] = useState('AI-first');

  // Security password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Sync state values on profile change
  useEffect(() => {
    if (storeUser) {
      setName(storeUser.name || '');
      setEmail(storeUser.email || '');
      setPortfolioSlug(storeUser.portfolioSlug || '');
    }
    if (storeProfile) {
      setHeadline(storeProfile.headline || '');
      setBio(storeProfile.bio || '');
      setAvatar(storeProfile.profileImage || '');
      setLocation(storeProfile.location || 'India');
      
      const ai = storeProfile.aiSection || {};
      setWritingTone(ai.writingTone || 'Technical & Premium');
      setResponseStyle(ai.responseStyle || 'Founder Friendly');
      setPublicPositioning(ai.publicPositioning || 'AI-first');
    }
  }, [storeUser, storeProfile]);

  // Tenant styles mapping
  const tenantStyles: Record<string, {
    primary: string;
    accent: string;
    glow: string;
    fullName: string;
    role: string;
  }> = {
    shashwat: {
      primary: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400',
      accent: 'amber-400',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.2)]',
      fullName: 'SHASHWAT DIXIT',
      role: 'System Architect & AI Product Engineer'
    },
    mahi: {
      primary: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400',
      accent: 'cyan-400',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.2)]',
      fullName: 'MAHI SINGH',
      role: 'Creative UI Designer & Brand Strategist'
    },
    khushaboo: {
      primary: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/40 text-fuchsia-400',
      accent: 'fuchsia-400',
      glow: 'shadow-[0_0_24px_rgba(217,70,239,0.2)]',
      fullName: 'KHUSHABOO SAINI',
      role: 'Senior Frontend Architect & Web Optimizer'
    }
  };

  const currentStyles = tenantStyles[activePortfolio] || tenantStyles.shashwat;

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile/identity', {
        name,
        email,
        portfolioSlug,
        headline,
        bio,
        location,
        profileImage: avatar,
        aiSection: {
          writingTone,
          responseStyle,
          publicPositioning
        }
      });
      await fetchProfile();
      setSuccess('Identity Core & AI Personality Engine configurations updated!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update Identity Core.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setUpdatingPassword(true);
    try {
      // Endpoint is authenticated user patch
      await api.patch('/auth/profile', {
        password: newPassword
      });
      setSuccess('Administrative credentials updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const copyPublicLink = () => {
    const link = `http://localhost:3001`; // Local public link
    navigator.clipboard.writeText(link);
    setSuccess('Public portfolio link copied to clipboard!');
  };

  // Extract recent stream
  const recentActivities = notifications.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* ── HERO SECTION: Cinematic Profile Panel ────────────────── */}
      <div className={`p-6 md:p-8 rounded-2xl border bg-gradient-to-r relative overflow-hidden backdrop-blur-md transition-all duration-500 ${currentStyles.primary} ${currentStyles.glow}`}>
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] bg-primary/10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar AI Identity Card */}
            <div className="relative shrink-0 select-none">
              <div className={`w-20 h-20 rounded-2xl bg-neutral-900 border-2 flex items-center justify-center font-black text-3xl overflow-hidden ${
                activePortfolio === 'shashwat' ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.35)]' :
                activePortfolio === 'mahi' ? 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.35)]' :
                'border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.35)]'
              }`}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-${currentStyles.accent}`}>{name ? name[0] : 'S'}</span>
                )}
              </div>
              <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-neutral-900 border select-none ${
                activePortfolio === 'shashwat' ? 'text-amber-400 border-amber-500/35' :
                activePortfolio === 'mahi' ? 'text-cyan-400 border-cyan-500/35' :
                'text-fuchsia-400 border-fuchsia-500/35'
              }`}>
                {activePortfolio.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black uppercase tracking-wider text-foreground">
                  {currentStyles.fullName}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-xs text-foreground font-semibold tracking-tight">
                {currentStyles.role}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                <span>● ACTIVE SESSION</span>
                <span className="opacity-40">|</span>
                <span>{location}</span>
                <span className="opacity-40">|</span>
                <span>Admin Level</span>
              </div>
            </div>
          </div>

          {/* Quick cinematic action buttons */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto shrink-0 select-none">
            <button
              onClick={() => {
                const el = document.getElementById('identity-core');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-card/70 hover:bg-card border border-border text-xs font-semibold rounded-xl tracking-tight transition-all flex items-center gap-2 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Identity</span>
            </button>

            <button
              onClick={copyPublicLink}
              className="px-3.5 py-2 bg-card/70 hover:bg-card border border-border text-xs font-semibold rounded-xl tracking-tight transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Portfolio</span>
            </button>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold rounded-xl tracking-tight transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── BENTO OPERATIONAL SPLIT LAYOUT ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Identity Core & AI Personality */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. IDENTITY CORE PANEL */}
          <div id="identity-core" className="bg-card/45 border border-border/40 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-4 border-b border-border/30 mb-5 select-none">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Identity Core</h2>
            </div>

            <form onSubmit={handleSaveIdentity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">System Username / Slug</label>
                  <input
                    type="text"
                    required
                    value={portfolioSlug}
                    onChange={(e) => setPortfolioSlug(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground font-mono focus:outline-none focus:border-primary/60 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Public Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Public Banner Title</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bio / Persona Statement</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Region / Country</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-2 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC / GMT</option>
                    <option value="America/New_York">EST (New York)</option>
                    <option value="Europe/Berlin">CET (Germany)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avatar Url</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-medium"
                  />
                </div>
              </div>

              {/* ── 2. AI PERSONALITY ENGINE ──────────────────────── */}
              <div className="bg-background/45 border border-border/50 rounded-xl p-4 mt-6 space-y-4">
                <div className="flex items-center gap-1.5 pb-2 border-b border-border/30">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-foreground">AI Personality Configurator</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Writing Tone</label>
                    <select
                      value={writingTone}
                      onChange={(e) => setWritingTone(e.target.value)}
                      className="w-full bg-card border border-border/70 rounded-lg py-1.5 px-2 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                    >
                      <option value="Technical & Premium">Technical & Premium</option>
                      <option value="Creative & Conversational">Creative & Conversational</option>
                      <option value="Scientific & Detailed">Scientific & Detailed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Response Style</label>
                    <select
                      value={responseStyle}
                      onChange={(e) => setResponseStyle(e.target.value)}
                      className="w-full bg-card border border-border/70 rounded-lg py-1.5 px-2 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                    >
                      <option value="Founder Friendly">Founder Friendly</option>
                      <option value="Minimalist & Direct">Minimalist & Direct</option>
                      <option value="Expert Deep-dive">Expert Deep-dive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Public Positioning</label>
                    <select
                      value={publicPositioning}
                      onChange={(e) => setPublicPositioning(e.target.value)}
                      className="w-full bg-card border border-border/70 rounded-lg py-1.5 px-2 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-semibold"
                    >
                      <option value="AI-first">AI-first</option>
                      <option value="Enterprise Infrastructure">Enterprise Infrastructure</option>
                      <option value="Indie-Hacker Product">Indie-Hacker Product</option>
                    </select>
                  </div>
                </div>

                <span className="text-[8.5px] text-muted-foreground block leading-relaxed italic">
                  * Dynamic credentials loaded directly into system LLM context models when drafting dynamic response templates or auto-generating portfolio highlights.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Writing Database...' : 'Save Dynamic Core'}
                </button>
              </div>
            </form>
          </div>

          {/* 3. ACCOUNT SECURITY COMMAND PANEL */}
          <div className="bg-card/45 border border-border/40 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-4 border-b border-border/30 mb-5 select-none">
              <Shield className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Security Command Panel</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Credentials reset form */}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  <span>Update Password Credentials</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Current Admin Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-1.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-1.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl py-1.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/60 transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-4.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {updatingPassword ? 'Updating...' : 'Commit Credentials'}
                </button>
              </form>

              {/* Login history / sessions visual list */}
              <div className="space-y-3.5">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Current verified session</span>
                </h3>

                <div className="p-3.5 bg-background border border-border/70 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded">
                      ACTIVE SESSION VERIFIED
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    Chrome • Windows 11
                  </div>
                  <div className="text-[9.5px] text-muted-foreground/80 font-mono mt-1 space-y-0.5">
                    <div>Location: India (Ahmedabad Access Node)</div>
                    <div>IP Endpoint: <span className="text-foreground/85">185.190.140.22</span></div>
                  </div>
                </div>

                <div className="space-y-1.5 select-none">
                  <div className="text-[8.5px] font-bold text-muted-foreground uppercase tracking-wider">Device Auth History</div>
                  <div className="space-y-1.5 text-[10px] text-muted-foreground/85">
                    <div className="flex justify-between items-center py-1 border-b border-border/30">
                      <span>Desktop Access (Chrome • Win)</span>
                      <span className="font-mono text-[9px]">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/30">
                      <span>Mobile Auth Pinned (Safari • iOS)</span>
                      <span className="font-mono text-[9px]">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Workspace switches, Devops panel, Presence Analytics */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* A. WORKSPACE IDENTITY / TENANT SWITCHING MODULE */}
          <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border/30 mb-4 select-none">
              <Cpu className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Workspace Control</h2>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { id: 'shashwat', fullName: 'Shashwat Dixit', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5', dot: 'bg-amber-400' },
                { id: 'mahi', fullName: 'Mahi Singh', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5', dot: 'bg-cyan-400' },
                { id: 'khushaboo', fullName: 'Khushboo Saini', color: 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/5', dot: 'bg-fuchsia-400' }
              ].map((p) => {
                const isSelected = activePortfolio === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePortfolio(p.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      isSelected
                        ? `${p.color} border-l-[4px] scale-[1.02] shadow-[0_0_12px_rgba(245,158,11,0.15)]`
                        : 'bg-background/40 hover:bg-background border-border/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase text-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full ${p.dot} ${isSelected ? 'animate-ping' : ''}`} />
                        <span>{p.fullName}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/80 block font-mono uppercase">
                        slug: {p.id} • Active Profile
                      </span>
                    </div>

                    <div className="text-right font-mono text-[9px] space-y-0.5 select-none">
                      <div className="text-emerald-400 font-bold uppercase">Online</div>
                      <div className="text-muted-foreground">Sync Active</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. DevOps STATUS INDICATORS */}
          <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border/30 mb-4 select-none">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">DevOps Health Panel</h2>
            </div>

            <div className="space-y-3.5 select-none">
              {[
                { label: 'Frontend Client', status: 'ONLINE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Backend API Server', status: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'SMTP Email Service', status: 'ACTIVE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Global CDN Cache', status: 'ACTIVE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between items-center py-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
                  <span className={`text-[8.5px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${s.color}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* C. PUBLIC PRESENCE GLASS PANELS */}
          <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border/30 mb-4 select-none">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Public Presence</h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { label: 'Portfolio Views', value: '1.2k', change: '+12% w/w', color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/20' },
                { label: 'Resume Exports', value: '142', change: '+8% w/w', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' },
                { label: 'Social Redirects', value: '389', change: '+24% w/w', color: 'text-purple-400 bg-purple-500/5 border-purple-500/20' },
                { label: 'Lead Conversion', value: '4.8%', change: '+0.5% w/w', color: 'text-amber-400 bg-amber-500/5 border-amber-500/20' }
              ].map((p, idx) => (
                <div key={idx} className={`p-3 rounded-xl border backdrop-blur shadow-sm ${p.color}`}>
                  <span className="text-[8.5px] font-bold text-muted-foreground/80 block uppercase select-none">{p.label}</span>
                  <div className="text-lg font-black font-mono tracking-tight mt-1">{p.value}</div>
                  <span className="text-[8px] text-muted-foreground block font-mono select-none">{p.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* D. RECENT ACTIVITY TIMELINE */}
          <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-border/30 mb-4 select-none">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Recent Activity</h2>
            </div>

            {recentActivities.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic text-center py-4 select-none">Your activity log timeline is clean.</p>
            ) : (
              <div className="space-y-3.5">
                {recentActivities.map((act: any, idx: number) => (
                  <div key={idx} className="flex gap-2.5 items-start text-[10px]">
                    <div className="p-1 rounded bg-background border border-border/50 shrink-0 text-primary mt-0.5">
                      <Terminal className="w-3 h-3" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block uppercase text-[9px] tracking-tight truncate max-w-44">
                        {act.title}
                      </span>
                      <span className="text-muted-foreground block italic leading-normal truncate max-w-48">
                        {act.message.split('\n')[0]}
                      </span>
                      <span className="text-[8px] text-muted-foreground/75 font-mono select-none">
                        {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
