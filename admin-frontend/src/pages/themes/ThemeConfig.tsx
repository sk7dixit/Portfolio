import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import { Palette, Eye } from 'lucide-react';

export default function ThemeConfig() {
  const user = useStore((state) => state.user);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  const [themeName, setThemeName] = useState('Default Dark');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [backgroundType, setBackgroundType] = useState('dark');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [animationType, setAnimationType] = useState('fade');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.theme) {
      setThemeName(user.theme.themeName || 'Default Dark');
      setPrimaryColor(user.theme.primaryColor || '#3b82f6');
      setBackgroundType(user.theme.backgroundType || 'dark');
      setFontFamily(user.theme.fontFamily || 'Inter');
      setAnimationType(user.theme.animationType || 'fade');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/themes', {
        themeName,
        primaryColor,
        backgroundType,
        fontFamily,
        animationType,
      });
      setSuccess('Visual theme layout synced!');
      await fetchEverything();
    } catch (err: any) {
      console.error('Update Theme Error:', err);
      setError(err.response?.data?.message || 'Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl animate-fade-in select-none">
      <div className="bg-[#0a0a0a] border border-neutral-900 rounded-2xl p-8 space-y-6 shadow-lg relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-900 pb-3 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-400" />
          <span>Active Styling Registry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Theme Preset Layout
            </label>
            <select
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 focus:border-indigo-500 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-white font-semibold cursor-pointer"
            >
              <option value="Software Developer Cockpit">Software Developer Cockpit (Workspace 3001)</option>
              <option value="Multi-Stack Deluxe Glass">Multi-Stack Deluxe Glass (Workspace 3002)</option>
              <option value="Retro Brutalist News">Retro Brutalist News (Workspace 3003)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Accent Identity Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-11 bg-transparent border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="#3b82f6"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full bg-[#111] border border-neutral-800 focus:border-indigo-500 focus:outline-none px-4 py-3 rounded-xl text-sm font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Branding Palette Type
            </label>
            <select
              value={backgroundType}
              onChange={(e) => setBackgroundType(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 focus:border-indigo-500 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-white cursor-pointer font-semibold"
            >
              <option value="dark">Deep Minimal Dark Mode</option>
              <option value="light">High-Contrast Paper Light Mode</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Global Typography
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 focus:border-indigo-500 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-white cursor-pointer font-semibold"
            >
              <option value="Inter">Inter (Sleek Tech)</option>
              <option value="Geist">Geist (Modern Monospace)</option>
              <option value="Outfit">Outfit (Fluid Display)</option>
              <option value="Courier New">Courier New (Legacy Brutalist)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Transition Curves
            </label>
            <select
              value={animationType}
              onChange={(e) => setAnimationType(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 focus:border-indigo-500 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-white cursor-pointer font-semibold"
            >
              <option value="fade">Micro-Fade Interpolation</option>
              <option value="slide">Framer Fluid Slide</option>
              <option value="bounce">Snappy Spring Bounce</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Updates sync to standard frontends in real time.</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer"
          >
            {loading ? 'SYNCING STYLE...' : 'Publish Visual Theme'}
          </button>
        </div>
      </div>
    </form>
  );
}
