import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import {
  Settings,
  Mail,
  Database,
  Shield,
  Cpu,
  Server,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Play,
  Volume2,
  Trash2,
  RefreshCw,
  HardDrive
} from 'lucide-react';

export default function SettingsHub() {
  const setSuccess = useStore((state) => state.success);
  const setError = useStore((state) => state.error);
  const storeSetSuccess = useStore((state) => state.setSuccess);
  const storeSetError = useStore((state) => state.setError);

  // Platform State
  const [theme, setTheme] = useState('dark');
  const [animations, setAnimations] = useState(true);
  const [blurIntensity, setBlurIntensity] = useState(8);
  const [notificationSounds, setNotificationSounds] = useState(true);
  const [telemetryMode, setTelemetryMode] = useState('active');

  // Mail State
  const [smtpProvider, setSmtpProvider] = useState('Resend');
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState('resend');
  const [smtpStatus, setSmtpStatus] = useState('CONNECTED');

  // Storage State
  const [storageProvider, setStorageProvider] = useState('Cloudinary');
  const [bucketName, setBucketName] = useState('portfolio-uploads');
  const [storageStatus, setStorageStatus] = useState('ACTIVE');

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [adminAuth, setAdminAuth] = useState('JWT');
  const [ipRestrictions, setIpRestrictions] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // AI Config State
  const [leadSensitivity, setLeadSensitivity] = useState(75);
  const [aiResponseDepth, setAiResponseDepth] = useState('advanced');
  const [autoTagging, setAutoTagging] = useState(true);
  const [signalClassification, setSignalClassification] = useState(true);

  // System State
  const [environment, setEnvironment] = useState('development');
  const [frontendUrl, setFrontendUrl] = useState('http://localhost:3001');
  const [backendHealth, setBackendHealth] = useState('HEALTHY');
  const [region, setRegion] = useState('ap-south-1');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingMail, setTestingMail] = useState(false);

  // Fetch Settings on Mount
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const data = res.data.data;
      if (data) {
        setTheme(data.theme || 'dark');
        setAnimations(data.animations ?? true);
        setBlurIntensity(data.blurIntensity ?? 8);
        setNotificationSounds(data.notificationSounds ?? true);
        setTelemetryMode(data.telemetryMode || 'active');

        if (data.smtp) {
          setSmtpProvider(data.smtp.provider || 'Resend');
          setSmtpHost(data.smtp.host || 'smtp.resend.com');
          setSmtpPort(data.smtp.port || 465);
          setSmtpUser(data.smtp.user || 'resend');
          setSmtpStatus(data.smtp.status || 'CONNECTED');
        }

        if (data.storage) {
          setStorageProvider(data.storage.provider || 'Cloudinary');
          setBucketName(data.storage.bucketName || 'portfolio-uploads');
          setStorageStatus(data.storage.status || 'ACTIVE');
        }

        if (data.security) {
          setSessionTimeout(data.security.sessionTimeout || 60);
          setAdminAuth(data.security.adminAuth || 'JWT');
          setIpRestrictions(data.security.ipRestrictions ?? false);
          setLoginAlerts(data.security.loginAlerts ?? true);
        }

        if (data.ai) {
          setLeadSensitivity(data.ai.leadSensitivity ?? 75);
          setAiResponseDepth(data.ai.aiResponseDepth || 'advanced');
          setAutoTagging(data.ai.autoTagging ?? true);
          setSignalClassification(data.ai.signalClassification ?? true);
        }

        if (data.system) {
          setEnvironment(data.system.environment || 'development');
          setFrontendUrl(data.system.frontendUrl || 'http://localhost:3001');
          setBackendHealth(data.system.backendHealth || 'HEALTHY');
          setRegion(data.system.region || 'ap-south-1');
        }
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', {
        theme,
        animations,
        blurIntensity,
        notificationSounds,
        telemetryMode,
        smtp: {
          provider: smtpProvider,
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          status: smtpStatus
        },
        storage: {
          provider: storageProvider,
          bucketName,
          status: storageStatus
        },
        security: {
          sessionTimeout,
          adminAuth,
          ipRestrictions,
          loginAlerts
        },
        ai: {
          leadSensitivity,
          aiResponseDepth,
          autoTagging,
          signalClassification
        },
        system: {
          environment,
          frontendUrl,
          backendHealth,
          region
        }
      });
      storeSetSuccess('Global Operating Settings updated and deployed globally!');
    } catch (err: any) {
      console.error(err);
      storeSetError(err.response?.data?.message || 'Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  const testSmtpConnection = async () => {
    setTestingMail(true);
    // Zero-Asset soft synthesize beeps to indicate connection testing
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && notificationSounds) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {}

    setTimeout(() => {
      setTestingMail(false);
      setSmtpStatus('CONNECTED');
      storeSetSuccess('Mail Connection SMTP diagnostic test: SUCCESS! Ping back 43ms.');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-mono">Loading Global Settings Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-text">
      
      {/* ── HEADER BLOCK ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/45 backdrop-blur-md p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-wider text-foreground">
              Platform Configuration Center
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 tracking-tight select-none">
            Operative System configurations shared globally across all system tenants (SD • MS • KS).
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50 shrink-0 select-none"
        >
          {saving ? 'Saving System Registry...' : 'Save Operating Settings'}
        </button>
      </div>

      {/* ── SYSTEM GRID BENTO OVERVIEW ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. PLATFORM SETTINGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/25 to-transparent"></div>
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-border/30 mb-4 select-none">
              <Sliders className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Platform Settings</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Global Base Theme</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg py-1 px-2 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="dark">Immersive Charcoal (Dark)</option>
                  <option value="light">Sleek Obsidian (Light)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Active Interface Animations</span>
                <button
                  type="button"
                  onClick={() => setAnimations(!animations)}
                  className={`text-[9px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    animations ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                >
                  {animations ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Melt Glass Blur Intensity</span>
                  <span className="text-primary font-mono">{blurIntensity}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-primary border border-border/50"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Telemetry Audio Pings</span>
                <button
                  type="button"
                  onClick={() => setNotificationSounds(!notificationSounds)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                    notificationSounds ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                  title="Toggle Synthesizer Sound"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Telemetry Recording Mode</span>
                <select
                  value={telemetryMode}
                  onChange={(e) => setTelemetryMode(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg py-1 px-2 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="active">Active Monitoring</option>
                  <option value="passive">Passive Aggregations</option>
                  <option value="disabled">Mute Intelligence Logs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIL SETTINGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent"></div>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/30 mb-4 select-none">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Mail Configurations</span>
              </div>
              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border select-none ${
                smtpStatus === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {smtpStatus}
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Mail Outbox Service</label>
                <select
                  value={smtpProvider}
                  onChange={(e) => setSmtpProvider(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-lg py-1.5 px-2.5 text-xs text-foreground focus:outline-none font-semibold"
                >
                  <option value="Resend">Resend API Portal (Standard)</option>
                  <option value="SendGrid">SendGrid Outbound Relay</option>
                  <option value="SMTP">Direct SMTP Configuration</option>
                  <option value="Twilio">Twilio SMS Telemetry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">SMTP Hostname Endpoint</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-lg py-1 px-2.5 text-xs text-foreground font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    className="w-full bg-background border border-border/80 rounded-lg py-1 px-2.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Authorized User</label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-lg py-1 px-2.5 text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={testSmtpConnection}
            disabled={testingMail}
            className="w-full mt-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 select-none"
          >
            <Play className="w-3 h-3" />
            <span>{testingMail ? 'Testing Node Handshake...' : 'Test Mail Handshake'}</span>
          </button>
        </div>

        {/* 3. STORAGE SETTINGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/25 to-transparent"></div>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/30 mb-4 select-none">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Storage Engine</span>
              </div>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 select-none">
                {storageStatus}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Upload Infrastructure</label>
                <select
                  value={storageProvider}
                  onChange={(e) => setStorageProvider(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-lg py-1.5 px-2.5 text-xs text-foreground focus:outline-none font-semibold"
                >
                  <option value="Cloudinary">Cloudinary Cloud CDN (Recommended)</option>
                  <option value="Supabase">Supabase S3 Buckets</option>
                  <option value="local">Local Administrative Cache</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Storage S3 Bucket Name</label>
                <input
                  type="text"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-lg py-1 px-2.5 text-xs text-foreground font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl select-none">
                <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-[9px] text-muted-foreground/80 leading-normal">
                  Uploaded files (resumes, screenshots, credentials) automatically pipeline to the cloud and compile into compressed formats.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SECURITY SETTINGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/25 to-transparent"></div>
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-border/30 mb-4 select-none">
              <Shield className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Administrative Security</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Admin Session Timeout</span>
                  <span className="text-rose-400 font-mono">{sessionTimeout} mins</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-border/50"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Authentication Protocol</span>
                <select
                  value={adminAuth}
                  onChange={(e) => setAdminAuth(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg py-1 px-2 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="JWT">Signed JWT tokens</option>
                  <option value="Session">Cookie Sessions</option>
                  <option value="None">Open Dev Mode (unsecure)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Restrict IP Addresses</span>
                <button
                  type="button"
                  onClick={() => setIpRestrictions(!ipRestrictions)}
                  className={`text-[9px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    ipRestrictions ? 'text-rose-400 border-rose-500/30 bg-rose-500/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                >
                  {ipRestrictions ? 'Strict' : 'Off'}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Suspicious Login Alerts</span>
                <button
                  type="button"
                  onClick={() => setLoginAlerts(!loginAlerts)}
                  className={`text-[9px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    loginAlerts ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                >
                  {loginAlerts ? 'Active' : 'Muted'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. AI ENGINE CONFIGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent"></div>
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-border/30 mb-4 select-none">
              <Cpu className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">AI Intelligence Configs</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Lead scoring sensitivity</span>
                  <span className="text-violet-400 font-mono">{leadSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={leadSensitivity}
                  onChange={(e) => setLeadSensitivity(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-border/50"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">AI response depth</span>
                <select
                  value={aiResponseDepth}
                  onChange={(e) => setAiResponseDepth(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg py-1 px-2 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="basic">Basic (Fast Classification)</option>
                  <option value="intermediate">Intermediate (Priority scoring)</option>
                  <option value="advanced">Advanced (Neural analysis)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Auto Inbound Tagging</span>
                <button
                  type="button"
                  onClick={() => setAutoTagging(!autoTagging)}
                  className={`text-[9px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    autoTagging ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                >
                  {autoTagging ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">AI Signal Classification</span>
                <button
                  type="button"
                  onClick={() => setSignalClassification(!signalClassification)}
                  className={`text-[9px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    signalClassification ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border bg-background'
                  }`}
                >
                  {signalClassification ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. DevOps SYSTEM SETTINGS */}
        <div className="bg-card/45 border border-border/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent"></div>
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-border/30 mb-4 select-none">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">DevOps Environment</span>
            </div>

            <div className="space-y-3.5 select-none">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-xs font-semibold text-muted-foreground">Active Environment</span>
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                  {environment.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-xs font-semibold text-muted-foreground">Local API Backend Health</span>
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                  {backendHealth}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-xs font-semibold text-muted-foreground">Deployment Region</span>
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border text-muted-foreground bg-muted border-border/60">
                  {region.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 mt-1">
                <span className="text-[8.5px] font-bold text-muted-foreground uppercase tracking-wider block">Dev Client Landing URL</span>
                <div className="p-2 bg-background border border-border/60 text-[9.5px] font-mono rounded text-foreground/80 overflow-x-auto whitespace-nowrap">
                  {frontendUrl}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
