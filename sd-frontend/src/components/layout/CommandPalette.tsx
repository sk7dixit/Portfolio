import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Terminal, Shield, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: any) => void;
  projects: any[];
  onSelectProject: (proj: any) => void;
  profileLinks: {
    github?: string;
    linkedin?: string;
    resumeUrl?: string;
  };
}

export default function CommandPalette({
  isOpen,
  onClose,
  setActiveTab,
  projects,
  onSelectProject,
  profileLinks
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles it
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredProjects = query === '' 
    ? [] 
    : projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  const navigationCommands = [
    { id: 'home', label: 'Go to Home Workspace', tab: 'home', icon: Compass },
    { id: 'projects', label: 'Go to Projects Bento Grid', tab: 'projects', icon: Terminal },
    { id: 'systems', label: 'Go to Systems Diagram', tab: 'systems', icon: Shield },
    { id: 'labs', label: 'Go to Labs Playground', tab: 'labs', icon: Compass },
    { id: 'about', label: 'Go to Narrative About', tab: 'about', icon: FileText },
    { id: 'contact', label: 'Go to Secure Contact Console', tab: 'contact', icon: Compass }
  ];

  const handleCommandClick = (tab: string) => {
    setActiveTab(tab);
    onClose();
    setQuery('');
  };

  const handleProjectSelect = (proj: any) => {
    onSelectProject(proj);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Translucent Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Centered Command Palette Glass Box */}
          <motion.div 
            className="glass-card w-full max-w-xl rounded-[28px] border border-white/10 overflow-hidden bg-neutral-900/90 shadow-2xl relative"
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            {/* Search Input field */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-neutral-950/20">
              <Search className="w-5 h-5 text-neutral-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search system registry commands or projects..."
                className="w-full bg-transparent text-sm text-white focus:outline-none focus:ring-0 placeholder-neutral-500 font-tech"
              />
              <span className="text-[9px] font-mono text-neutral-600 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">ESC</span>
            </div>

            {/* Content list */}
            <div className="p-4 max-h-[300px] overflow-y-auto no-scrollbar space-y-4 text-left">
              
              {/* Dynamic Project Search Results */}
              {query !== '' && (
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest px-3 block">
                    PROJECT REGISTRY SEARCH ({filteredProjects.length})
                  </span>
                  {filteredProjects.length === 0 ? (
                    <p className="text-xs text-neutral-500 px-3 font-light">No matching projects detected.</p>
                  ) : (
                    filteredProjects.map(proj => (
                      <button
                        key={proj.id}
                        onClick={() => handleProjectSelect(proj)}
                        className="w-full text-left px-3 py-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] flex items-center justify-between text-xs text-white group cursor-pointer transition-colors"
                      >
                        <span className="font-semibold uppercase">{proj.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Navigation Commands */}
              {query === '' && (
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest px-3 block">
                    NAVIGATE WORKSPACE
                  </span>
                  {navigationCommands.map(cmd => {
                    const CmdIcon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleCommandClick(cmd.tab)}
                        className="w-full text-left px-3 py-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] flex items-center justify-between text-xs text-neutral-300 hover:text-white group cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <CmdIcon className="w-4 h-4 text-[#00F5B4]" />
                          <span className="font-semibold">{cmd.label}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Actions Links */}
              {query === '' && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest px-3 block">
                    EXTERNAL SHORTCUTS
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1">
                    {profileLinks.github && (
                      <a 
                        href={profileLinks.github} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-[11px] text-neutral-300 hover:text-white flex items-center justify-between"
                      >
                        <span>GitHub Repository</span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    )}
                    {profileLinks.resumeUrl && (
                      <a 
                        href={profileLinks.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-[11px] text-neutral-300 hover:text-white flex items-center justify-between"
                      >
                        <span>Resume Document</span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
