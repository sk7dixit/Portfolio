import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import { AlertCircle, CheckCircle, LogIn, Eye, EyeOff, Shield, Download, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const loginStore = useStore((state) => state.login);
  const setError = useStore((state) => state.setError);
  const setSuccess = useStore((state) => state.setSuccess);
  const errorMsg = useStore((state) => state.error);
  const successMsg = useStore((state) => state.success);

  const [entered, setEntered] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if the event was already captured globally by index.html early handler
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // 2. Listen for standard event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };

    // 3. Listen for custom event dispatched by index.html early interceptor
    const handleCustomPromptAvailable = () => {
      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-install-prompt-available', handleCustomPromptAvailable);

    // Make the install button visible as long as it's not already installed as standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setShowInstallBtn(!isStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-install-prompt-available', handleCustomPromptAvailable);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        loginStore(res.data.token, res.data.user);
        setSuccess('Logged in successfully!');
      } else {
        const res = await api.post('/auth/register', {
          name,
          email,
          password,
          portfolioSlug: slug,
          role: 'PORTFOLIO_USER',
        });
        loginStore(res.data.token, res.data.user);
        setSuccess('Account registered successfully!');
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setError(err.response?.data?.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">

      {/* Base Background */}
      <div className="absolute inset-0 bg-[#030303] -z-30 pointer-events-none" />

      {/* Video Background */}
      <video
        src="/xyz.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none opacity-50"
      />

      {/* Dark overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/50 -z-10 pointer-events-none" />

      {/* ── ENTER BUTTON ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="enter-btn"
            className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              onClick={() => setEntered(true)}
              className="group relative px-10 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-sm font-semibold tracking-[0.2em] uppercase overflow-hidden cursor-pointer hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_0.6s_ease_forwards] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Enter
              </span>
            </motion.button>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LUXURY LOGIN CARD ── */}
      <AnimatePresence>
        {entered && (
          <motion.div
            key="login-card"
            className="w-full max-w-sm relative z-10"
            initial={{ opacity: 0, y: 70, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Outer glow ring ── */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-400/30 via-neutral-700/10 to-amber-600/20 blur-sm pointer-events-none" />

            {/* ── Main card ── */}
            <div className="relative bg-[#0c0c0c]/90 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              {/* ── Header ── */}
              <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
                    <Shield className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-amber-400/80 uppercase tracking-[0.25em] leading-none">Admin Portal</p>
                    <h2 className="text-lg font-bold text-white tracking-tight leading-tight mt-0.5">
                      {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                  </div>
                </div>
              </div>

              {/* ── Form body ── */}
              <div className="px-8 py-7">

                {/* Error / Success */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-5 p-3.5 bg-red-950/40 border border-red-500/20 rounded-2xl flex items-center gap-2.5 text-red-400 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-5 p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-emerald-400 text-xs"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleAuth} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Shashwat Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/20 focus:border-amber-400/50 focus:outline-none px-4 py-3 rounded-xl text-sm text-white placeholder:text-neutral-600 transition-all duration-300 focus:bg-white/[0.05]"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="developer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/20 focus:border-amber-400/50 focus:outline-none px-4 py-3 rounded-xl text-sm text-white placeholder:text-neutral-600 transition-all duration-300 focus:bg-white/[0.05]"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/20 focus:border-amber-400/50 focus:outline-none px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder:text-neutral-600 transition-all duration-300 focus:bg-white/[0.05]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Portfolio Slug</label>
                      <div className="flex rounded-xl overflow-hidden border border-white/[0.08] hover:border-amber-400/20 focus-within:border-amber-400/50 transition-all duration-300">
                        <span className="bg-white/[0.02] px-3 py-3 text-xs text-neutral-600 border-r border-white/[0.06] font-mono">/slug/</span>
                        <input
                          type="text"
                          required
                          placeholder="shashwat"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="w-full bg-white/[0.03] focus:outline-none px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:bg-white/[0.05] transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── CTA Button ── */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer transition-all duration-300 disabled:opacity-60"
                    >
                      {/* Gold gradient fill */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transition-all duration-300 group-hover:from-amber-400 group-hover:to-yellow-300" />
                      {/* Shine sweep */}
                      <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                      {/* Bottom shadow glow */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-amber-400/40 blur-lg rounded-full" />
                      <span className="relative z-10 text-black font-bold tracking-wide">
                        {loading ? 'Authenticating…' : isLogin ? 'Access Dashboard' : 'Create Account'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Footer ── */}
              <div className="px-8 pb-7 flex flex-col items-center gap-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[11px] text-neutral-500 hover:text-amber-400 font-medium transition-all cursor-pointer tracking-wide"
                >
                  {isLogin ? 'No account? Register here' : 'Already registered? Sign in'}
                </button>

                {showInstallBtn && (
                  <motion.button
                    type="button"
                    onClick={handleInstallClick}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-white rounded-xl text-[10px] font-mono font-bold tracking-wider cursor-pointer shadow-sm hover:bg-amber-500/20 transition-all select-none duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                    <span>DOWNLOAD PORTAL APP</span>
                  </motion.button>
                )}
              </div>

              {/* Bottom shimmer line */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MANUAL INSTALLATION INSTRUCTIONS MODAL ── */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md bg-[#0c0c0c] border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Gold glow top border */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                    <Info className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wider text-white uppercase">How to Install App</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstructions(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-neutral-400 text-xs leading-relaxed">
                <p>
                  Installing the app allows you to launch the MSK Admin Portal directly from your desktop or home screen, with support for offline access and native desktop notifications.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Google Chrome & Microsoft Edge:
                    </p>
                    <p className="pl-3">
                      Look for the <strong className="text-white">Install App</strong> icon in the address bar (top right), or click the browser menu (<strong className="text-white">⋮</strong>) and select <strong className="text-white">"Install app..."</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Safari (iOS & macOS):
                    </p>
                    <p className="pl-3">
                      Tap the <strong className="text-white">Share button (⎋)</strong> on your browser navigation bar, then select <strong className="text-white">"Add to Home Screen"</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInstructions(false)}
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold tracking-wider text-xs uppercase cursor-pointer transition-all duration-300"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
