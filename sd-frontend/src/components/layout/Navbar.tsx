import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Menu, X, ArrowUpRight } from 'lucide-react';


interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  profile: any;
  onOpenCommandPalette: () => void;
}

export default function Navbar({ activeTab, setActiveTab, profile, onOpenCommandPalette }: NavbarProps) {

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'About' },
    { id: 'projects', label: 'Projects' },
    ...(profile?.skillsSection?.visible !== false ? [{ id: 'skills', label: 'Skills' }] : []),
    ...(profile?.certificatesSection?.visible !== false ? [{ id: 'certificates', label: 'Certificates' }] : []),
    ...(profile?.internshipsSection?.visible !== false ? [{ id: 'internships', label: 'Internships' }] : []),
    { id: 'contact', label: 'Contact' }
  ];

  const userName = profile?.heroSection?.title || "DEV";
  const logoText = profile?.headerSection?.logoText || userName.split(' ')[0] || 'DEV';
  const ctaText = profile?.headerSection?.ctaText || 'Connect';
  const githubUrl = profile?.github || "https://github.com";
  const linkedinUrl = profile?.linkedin || "https://linkedin.com";

  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -16 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };


  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4 pointer-events-none">
        <motion.div 
          className={`mx-auto max-w-[1400px] w-full rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-between px-[18px] md:px-6 h-[60px] md:h-auto border border-white/5 backdrop-blur-xl ${
            scrolled 
              ? 'bg-neutral-950/80 shadow-2xl scale-[0.98] py-2 md:py-2.5' 
              : 'bg-white/[0.03] py-2 md:py-3'
          }`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Futuristic SD Orange Brand Logo */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
            <svg className="h-[26px] w-auto select-none opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" viewBox="0 0 555 270" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stylized Modern S */}
              <path d="M 95 15 H 310 L 230 95 H 80 L 0 175 H 360 L 280 255 H 90 L 10 175 H 150 L 230 95 H 15 Z" fill="#FFA700" />
              {/* Stylized Modern D */}
              <path fillRule="evenodd" clipRule="evenodd" d="M 330 15 H 435 A 120 120 0 0 1 555 135 A 120 120 0 0 1 435 255 H 295 L 375 175 V 95 Z M 435 95 H 455 A 40 40 0 0 1 495 135 A 40 40 0 0 1 455 175 H 435 V 95 Z" fill="#FFA700" />
            </svg>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 bg-white/[0.06] rounded-full border border-white/10 shadow-inner"
                      layoutId="activeNavTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Socials & Menu Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {githubUrl && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>

            <button 
              onClick={() => setActiveTab('contact')}
              className="hidden md:flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500/30 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.03] transition-all"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-3xl md:hidden flex flex-col justify-between px-6 pt-24 pb-6 overflow-y-auto"
          >
            {/* Top Identity Block */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col mb-2 text-left"
            >
              <div className="h-[2px] w-6 bg-[#FFA700] mb-2" />
              <h2 className="text-lg font-bold tracking-tight text-white font-heading leading-tight">
                Shashwat Dixit
              </h2>
              <p className="text-[10px] text-neutral-400 font-mono font-medium tracking-wider uppercase mt-0.5">
                Full-Stack Developer & AI Builder
              </p>
            </motion.div>

            {/* Navigation Items (Staggered) */}
            <motion.nav 
              variants={menuContainerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col space-y-1 py-4"
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    variants={menuItemVariants}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-[18px] font-extrabold font-heading tracking-tight w-full flex items-center transition-all ${
                      isActive 
                        ? 'text-white pl-4 py-2 bg-purple-500/8 border-l-[3px] border-purple-500 rounded-r-xl shadow-[inset_6px_0_12px_-6px_rgba(168,85,247,0.15)]' 
                        : 'text-neutral-500 hover:text-neutral-300 pl-4 py-2'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </motion.nav>
            
            {/* Bottom Actions Block */}
            <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-white/5">
              {/* Social Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-3 gap-2"
              >
                {githubUrl && (
                  <a 
                    href={githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-1 px-2 py-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-300 transition-all active:scale-[0.97]"
                  >
                    GitHub
                  </a>
                )}
                {linkedinUrl && (
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-1 px-2 py-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-300 transition-all active:scale-[0.97]"
                  >
                    LinkedIn
                  </a>
                )}
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 px-2 py-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-300 transition-all active:scale-[0.97]"
                >
                  Email
                </a>
              </motion.div>

              {/* LET'S CHAT Glowing Button */}
              <motion.button 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setActiveTab('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500/30 text-white font-mono text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] active:scale-[0.98] transition-all relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">LET'S CHAT</span>
                <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
