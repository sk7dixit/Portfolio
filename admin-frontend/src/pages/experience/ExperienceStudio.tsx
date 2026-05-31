import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { io } from 'socket.io-client';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Sparkles, Layers, Sliders, Palette, History, Shield, 
  Eye, Laptop, Smartphone, Save, RotateCcw, AlertTriangle, 
  Check, Play, ArrowRight, ToggleLeft, ToggleRight, Trash2, 
  Layers3, Layout, Settings, Compass, HelpCircle,
  Linkedin, Github, Mail, Instagram, FileText, Award, Briefcase,
  Upload
} from 'lucide-react';

export default function ExperienceStudio() {
  const { activePortfolio } = usePortfolio();
  const isKS = activePortfolio === 'khushaboo';

  const getIconComponent = (iconName: string) => {
    const MAP: Record<string, React.ComponentType<any>> = {
      Linkedin, Github, Mail, Instagram, FileText, Award, Briefcase, Sparkles, Layers, Sliders, Palette
    };
    return MAP[iconName] || Sparkles;
  };
  
  const profile = useStore((state) => state.profile);
  const user = useStore((state) => state.user);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  const [socket, setSocket] = useState<any>(null);

  // Hook up websockets for live-experience sync updates
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

  const [activeSubTab, setActiveSubTab] = useState<'header-footer' | 'home-hero' | 'section-toggles' | 'theme-presets' | 'version-history'>('header-footer');
  const [msSubTab, setMsSubTab] = useState<'header-exp' | 'footer-exp' | 'section-toggles-exp' | 'theme-exp' | 'layout-exp'>('header-exp');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const isMS = activePortfolio === 'mahi';

  // MS Specific states
  const [msBrandName, setMsBrandName] = useState('Mahi Singh');
  const [msNavMenu, setMsNavMenu] = useState<any[]>([
    { label: "ABOUT", route: "/", enabled: true, order: 1 },
    { label: "SKILLS", route: "/skills", enabled: true, order: 2 },
    { label: "PROJECTS", route: "/projects", enabled: true, order: 3 },
    { label: "ACHIEVEMENTS", route: "/achievements", enabled: true, order: 4 },
    { label: "CERTIFICATES", route: "/certificates", enabled: true, order: 5 },
    { label: "JOURNEY", route: "/journey", enabled: true, order: 6 },
    { label: "CONTACT", route: "/contact", enabled: true, order: 7 }
  ]);
  const [msResumeText, setMsResumeText] = useState('Resume');
  const [msResumeUrl, setMsResumeUrl] = useState('');
  const [msUploadingResume, setMsUploadingResume] = useState(false);
  
  const [msHeaderGlassOpacity, setMsHeaderGlassOpacity] = useState(60);
  const [msBlurStrength, setMsBlurStrength] = useState(20);
  const [msBorderGlow, setMsBorderGlow] = useState('glow-pink');
  const [msActiveNavGlow, setMsActiveNavGlow] = useState('glow-pink');
  const [msStickyEnabled, setMsStickyEnabled] = useState(true);
  const [msShrinkOnScroll, setMsShrinkOnScroll] = useState(true);
  const [msBlurOnScroll, setMsBlurOnScroll] = useState(true);

  const [msFooterHeading, setMsFooterHeading] = useState('Designed & Developed by Mahi Singh');
  const [msFooterTechStackText, setMsFooterTechStackText] = useState('BUILT WITH REACT, TAILWIND CSS & FRAMER MOTION');
  const [msFooterEnabled, setMsFooterEnabled] = useState(true);
  const [msFooterGlassEffect, setMsFooterGlassEffect] = useState(true);
  const [msFooterBlur, setMsFooterBlur] = useState(20);
  const [msFooterTextColor, setMsFooterTextColor] = useState('#ffffff');
  const [msFooterAccentColor, setMsFooterAccentColor] = useState('#f97316');
  const [msFooterOpacity, setMsFooterOpacity] = useState(90);

  const [msSections, setMsSections] = useState<any[]>([
    { name: "About", route: "/", enabled: true, order: 1 },
    { name: "Skills", route: "/skills", enabled: true, order: 2 },
    { name: "Projects", route: "/projects", enabled: true, order: 3 },
    { name: "Achievements", route: "/achievements", enabled: true, order: 4 },
    { name: "Certificates", route: "/certificates", enabled: true, order: 5 },
    { name: "Journey", route: "/journey", enabled: true, order: 6 },
    { name: "Contact", route: "/contact", enabled: true, order: 7 }
  ]);
  
  const [msPrimaryAccent, setMsPrimaryAccent] = useState('#f97316');
  const [msSecondaryAccent, setMsSecondaryAccent] = useState('#fb923c');
  const [msGradientOverlay, setMsGradientOverlay] = useState('rgba(245, 158, 11, 0.15)');
  const [msGlowIntensity, setMsGlowIntensity] = useState(75);
  const [msCinematicDarkness, setMsCinematicDarkness] = useState(28);

  const [msSectionGap, setMsSectionGap] = useState(48);
  const [msMaxWidth, setMsMaxWidth] = useState(1280);
  const [msAnimationSpeed, setMsAnimationSpeed] = useState(0.8);
  const [msScrollSmoothness, setMsScrollSmoothness] = useState(1);

  // Input states (populated dynamically from profile)
  const [logoText, setLogoText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [sloganText, setSloganText] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescOne, setHeroDescOne] = useState('');
  const [heroDescTwo, setHeroDescTwo] = useState('');

  const [showSkills, setShowSkills] = useState(true);
  const [showCertificates, setShowCertificates] = useState(true);
  const [showInternships, setShowInternships] = useState(true);

  const [activePreset, setActivePreset] = useState('Purple Nebula');

  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // KS Specific Header/Footer visual layout states
  const [accentDotColor, setAccentDotColor] = useState('#ec4899');
  const [mobileLogoScale, setMobileLogoScale] = useState(100);
  const [navMenu, setNavMenu] = useState<any[]>([
    { label: 'HOME', route: '#home', enabled: true },
    { label: 'SKILLS', route: '#skills', enabled: true },
    { label: 'PROJECTS', route: '#projects', enabled: true },
    { label: 'EXPERIENCE', route: '#experience', enabled: true },
    { label: 'CERTIFICATES', route: '#certificates', enabled: true },
    { label: 'CONTACT', route: '#contact', enabled: true }
  ]);
  const [ctaLink, setCtaLink] = useState('/resume.pdf');
  const [ctaIcon, setCtaIcon] = useState('FileText');
  const [ctaNewTab, setCtaNewTab] = useState(true);
  const [headerBlur, setHeaderBlur] = useState(20);
  const [headerTransparency, setHeaderTransparency] = useState(40);
  const [headerBorderGlow, setHeaderBorderGlow] = useState('glow-pink');
  const [headerSticky, setHeaderSticky] = useState(true);
  const [headerMobileCollapse, setHeaderMobileCollapse] = useState(true);

  const [footerName, setFooterName] = useState('KHUSHABOO SAINI');
  const [statusText, setStatusText] = useState('SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES');
  const [creditsText, setCreditsText] = useState('Designed & Engineered by Khushaboo Saini');
  const [socialLinks, setSocialLinks] = useState<any[]>([
    { icon: 'Linkedin', url: 'https://linkedin.com', enabled: true },
    { icon: 'Github', url: 'https://github.com', enabled: true },
    { icon: 'Mail', url: 'mailto:khushboosaini066@gmail.com', enabled: true },
    { icon: 'Instagram', url: 'https://instagram.com', enabled: false }
  ]);
  const [footerGlow, setFooterGlow] = useState(80);
  const [footerDivider, setFooterDivider] = useState(true);
  const [footerSpacing, setFooterSpacing] = useState(40);
  const [footerBlur, setFooterBlur] = useState(20);
  const [footerOpacity, setFooterOpacity] = useState(90);

  // Sync state values on initial profile load
  useEffect(() => {
    if (profile) {
      // Header Section
      const hs = profile.headerSection || {};
      setLogoText(hs.logoText || (isKS ? 'KHUSHABOO' : ''));
      setCtaText(hs.ctaText || (isKS ? 'INSPECT CURRICULUM VITAE' : 'Connect'));

      // Footer Section
      const fs = profile.footerSection || {};
      setSloganText(fs.slogan || '');
      setCopyrightText(fs.copyright || (isKS ? '© 2026 KHUSHABOO SAINI' : ''));

      // Home Hero Section
      const hHero = profile.heroSection || {};
      setHeroTitle(hHero.title || '');
      setHeroDescOne(hHero.descOne || '');
      setHeroDescTwo(hHero.descTwo || '');

      // Section Toggles
      setShowSkills(profile.skillsSection?.visible !== false);
      setShowCertificates(profile.certificatesSection?.visible !== false);
      setShowInternships(profile.internshipsSection?.visible !== false);

      // Theme Preset
      setActivePreset(profile.themeSection?.activePreset || 'Purple Nebula');

      // Version History
      setHistoryList(profile.versionHistory || []);

      // KS Specific fields
      if (isKS) {
        setAccentDotColor(hs.accentDotColor || '#ec4899');
        setMobileLogoScale(hs.mobileLogoScale ?? 100);
        setNavMenu(hs.navMenu || [
          { label: 'HOME', route: '#home', enabled: true },
          { label: 'SKILLS', route: '#skills', enabled: true },
          { label: 'PROJECTS', route: '#projects', enabled: true },
          { label: 'EXPERIENCE', route: '#experience', enabled: true },
          { label: 'CERTIFICATES', route: '#certificates', enabled: true },
          { label: 'CONTACT', route: '#contact', enabled: true }
        ]);
        setCtaLink(hs.ctaLink || '/resume.pdf');
        setCtaIcon(hs.ctaIcon || 'FileText');
        setCtaNewTab(hs.ctaNewTab ?? true);
        setHeaderBlur(hs.headerBlur ?? 20);
        setHeaderTransparency(hs.headerTransparency ?? 40);
        setHeaderBorderGlow(hs.headerBorderGlow || 'glow-pink');
        setHeaderSticky(hs.headerSticky ?? true);
        setHeaderMobileCollapse(hs.headerMobileCollapse ?? true);

        // Footer Section
        setFooterName(fs.footerName || 'KHUSHABOO SAINI');
        setStatusText(fs.statusText || 'SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES');
        setCreditsText(fs.creditsText || 'Designed & Engineered by Khushaboo Saini');
        setSocialLinks(fs.socialLinks || [
          { icon: 'Linkedin', url: 'https://linkedin.com', enabled: true },
          { icon: 'Github', url: 'https://github.com', enabled: true },
          { icon: 'Mail', url: 'mailto:khushboosaini066@gmail.com', enabled: true },
          { icon: 'Instagram', url: 'https://instagram.com', enabled: false }
        ]);
        setFooterGlow(fs.footerGlow ?? 80);
        setFooterDivider(fs.footerDivider ?? true);
        setFooterSpacing(fs.footerSpacing ?? 40);
        setFooterBlur(fs.footerBlur ?? 20);
        setFooterOpacity(fs.footerOpacity ?? 90);
      }
    }
  }, [profile, isKS]);

  // MS Fetching and Websockets effects
  useEffect(() => {
    if (isMS) {
      const fetchMsExperience = async () => {
        try {
          const res = await api.get('/ms/global-experience');
          if (res.data && res.data.data && res.data.data.globalExperience) {
            const ge = res.data.data.globalExperience;
            setMsBrandName(ge.header?.brandName || 'Mahi Singh');
            setMsNavMenu(ge.header?.navItems || []);
            setMsResumeText(ge.header?.resumeButton?.text || 'Resume');
            setMsResumeUrl(ge.header?.resumeButton?.url || '');
            
            setMsHeaderGlassOpacity(ge.header?.visuals?.headerGlassOpacity ?? 60);
            setMsBlurStrength(ge.header?.visuals?.blurStrength ?? 20);
            setMsBorderGlow(ge.header?.visuals?.borderGlow || 'glow-pink');
            setMsActiveNavGlow(ge.header?.visuals?.activeNavGlow || 'glow-pink');
            setMsStickyEnabled(ge.header?.visuals?.stickyEnabled ?? true);
            setMsShrinkOnScroll(ge.header?.visuals?.shrinkOnScroll ?? true);
            setMsBlurOnScroll(ge.header?.visuals?.blurOnScroll ?? true);

            setMsFooterHeading(ge.footer?.heading || 'Designed & Developed by Mahi Singh');
            setMsFooterTechStackText(ge.footer?.techStackText || 'BUILT WITH REACT, TAILWIND CSS & FRAMER MOTION');
            setMsFooterEnabled(ge.footer?.visuals?.footerEnabled ?? true);
            setMsFooterGlassEffect(ge.footer?.visuals?.footerGlassEffect ?? true);
            setMsFooterBlur(ge.footer?.visuals?.footerBlur ?? 20);
            setMsFooterTextColor(ge.footer?.visuals?.footerTextColor || '#ffffff');
            setMsFooterAccentColor(ge.footer?.visuals?.footerAccentColor || '#f97316');
            setMsFooterOpacity(ge.footer?.visuals?.footerOpacity ?? 90);

            setMsSections(ge.sections || []);

            setMsPrimaryAccent(ge.theme?.primaryAccent || '#f97316');
            setMsSecondaryAccent(ge.theme?.secondaryAccent || '#fb923c');
            setMsGradientOverlay(ge.theme?.gradientOverlay || 'rgba(245, 158, 11, 0.15)');
            setMsGlowIntensity(ge.theme?.glowIntensity ?? 75);
            setMsCinematicDarkness(ge.theme?.cinematicDarkness ?? 28);

            setMsSectionGap(ge.layout?.sectionGap ?? 48);
            setMsMaxWidth(ge.layout?.maxWidth ?? 1280);
            setMsAnimationSpeed(ge.layout?.animationSpeed ?? 0.8);
            setMsScrollSmoothness(ge.layout?.scrollSmoothness ?? 1);
          }
        } catch (err) {
          console.error("Failed to load Mahi's experience settings:", err);
        }
      };
      fetchMsExperience();
    }
  }, [isMS, activePortfolio]);

  useEffect(() => {
    if (isMS && socket) {
      const handleUpdatedEvent = (payload: any) => {
        if (payload.globalExperience) {
          console.log("⚡ Received live global experience update:", payload.globalExperience);
          const ge = payload.globalExperience;
          setMsBrandName(ge.header?.brandName || 'Mahi Singh');
          setMsNavMenu(ge.header?.navItems || []);
          setMsResumeText(ge.header?.resumeButton?.text || 'Resume');
          setMsResumeUrl(ge.header?.resumeButton?.url || '');
          
          setMsHeaderGlassOpacity(ge.header?.visuals?.headerGlassOpacity ?? 60);
          setMsBlurStrength(ge.header?.visuals?.blurStrength ?? 20);
          setMsBorderGlow(ge.header?.visuals?.borderGlow || 'glow-pink');
          setMsActiveNavGlow(ge.header?.visuals?.activeNavGlow || 'glow-pink');
          setMsStickyEnabled(ge.header?.visuals?.stickyEnabled ?? true);
          setMsShrinkOnScroll(ge.header?.visuals?.shrinkOnScroll ?? true);
          setMsBlurOnScroll(ge.header?.visuals?.blurOnScroll ?? true);

          setMsFooterHeading(ge.footer?.heading || 'Designed & Developed by Mahi Singh');
          setMsFooterTechStackText(ge.footer?.techStackText || 'BUILT WITH REACT, TAILWIND CSS & FRAMER MOTION');
          setMsFooterEnabled(ge.footer?.visuals?.footerEnabled ?? true);
          setMsFooterGlassEffect(ge.footer?.visuals?.footerGlassEffect ?? true);
          setMsFooterBlur(ge.footer?.visuals?.footerBlur ?? 20);
          setMsFooterTextColor(ge.footer?.visuals?.footerTextColor || '#ffffff');
          setMsFooterAccentColor(ge.footer?.visuals?.footerAccentColor || '#f97316');
          setMsFooterOpacity(ge.footer?.visuals?.footerOpacity ?? 90);

          setMsSections(ge.sections || []);

          setMsPrimaryAccent(ge.theme?.primaryAccent || '#f97316');
          setMsSecondaryAccent(ge.theme?.secondaryAccent || '#fb923c');
          setMsGradientOverlay(ge.theme?.gradientOverlay || 'rgba(245, 158, 11, 0.15)');
          setMsGlowIntensity(ge.theme?.glowIntensity ?? 75);
          setMsCinematicDarkness(ge.theme?.cinematicDarkness ?? 28);

          setMsSectionGap(ge.layout?.sectionGap ?? 48);
          setMsMaxWidth(ge.layout?.maxWidth ?? 1280);
          setMsAnimationSpeed(ge.layout?.animationSpeed ?? 0.8);
          setMsScrollSmoothness(ge.layout?.scrollSmoothness ?? 1);
        }
      };

      socket.on('global_experience_ms:updated', handleUpdatedEvent);
      return () => {
        socket.off('global_experience_ms:updated', handleUpdatedEvent);
      };
    }
  }, [isMS, socket]);

  const handleMsResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setMsUploadingResume(true);

    try {
      const res = await api.post('/ms/global-experience/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsResumeUrl(res.data.data.url);
      setSuccess('Resume document/image uploaded successfully.');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload Resume document/image.');
    } finally {
      setMsUploadingResume(false);
    }
  };

  const handleSaveMSGlobalExperience = async () => {
    setLoading(true);
    try {
      const payload = {
        header: {
          brandName: msBrandName,
          navItems: msNavMenu,
          resumeButton: {
            text: msResumeText,
            url: msResumeUrl
          },
          visuals: {
            headerGlassOpacity: msHeaderGlassOpacity,
            blurStrength: msBlurStrength,
            borderGlow: msBorderGlow,
            activeNavGlow: msActiveNavGlow,
            stickyEnabled: msStickyEnabled,
            shrinkOnScroll: msShrinkOnScroll,
            blurOnScroll: msBlurOnScroll
          }
        },
        footer: {
          heading: msFooterHeading,
          techStackText: msFooterTechStackText,
          visuals: {
            footerEnabled: msFooterEnabled,
            footerGlassEffect: msFooterGlassEffect,
            footerBlur: msFooterBlur,
            footerTextColor: msFooterTextColor,
            footerAccentColor: msFooterAccentColor,
            footerOpacity: msFooterOpacity
          }
        },
        sections: msSections,
        theme: {
          primaryAccent: msPrimaryAccent,
          secondaryAccent: msSecondaryAccent,
          gradientOverlay: msGradientOverlay,
          glowIntensity: msGlowIntensity,
          cinematicDarkness: msCinematicDarkness
        },
        layout: {
          sectionGap: msSectionGap,
          maxWidth: msMaxWidth,
          animationSpeed: msAnimationSpeed,
          scrollSmoothness: msScrollSmoothness
        }
      };

      await api.post('/ms/global-experience', payload);
      await fetchEverything();

      if (socket) {
        socket.emit('global_experience_ms:update', {
          slug: 'mahi',
          globalExperience: payload
        });
      }

      setSuccess('MS Global Experience layers synchronized successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync MS Global Experience configurations.');
    } finally {
      setLoading(false);
    }
  };

  // Load versions history list
  const loadHistory = async () => {
    try {
      const res = await api.get('/profile/versions');
      setHistoryList(res.data.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Save layout block configurations
  const handleSaveBlocks = async () => {
    setLoading(true);
    try {
      const payload = isKS ? {
        headerSection: {
          logoText,
          accentDotColor,
          mobileLogoScale,
          navMenu,
          ctaText,
          ctaLink,
          ctaIcon,
          ctaNewTab,
          headerBlur,
          headerTransparency,
          headerBorderGlow,
          headerSticky,
          headerMobileCollapse
        },
        footerSection: {
          slogan: sloganText,
          copyright: copyrightText,
          footerName,
          statusText,
          creditsText,
          socialLinks,
          footerGlow,
          footerDivider,
          footerSpacing,
          footerBlur,
          footerOpacity
        }
      } : {
        headerSection: { logoText, ctaText },
        footerSection: { slogan: sloganText, copyright: copyrightText },
        heroSection: {
          title: heroTitle,
          descOne: heroDescOne,
          descTwo: heroDescTwo,
          image: profile?.heroSection?.image || '/uploads/portfolio/sd/hero-image.webp'
        },
        skillsSection: {
          ...(profile?.skillsSection || {}),
          visible: showSkills
        },
        certificatesSection: {
          ...(profile?.certificatesSection || {}),
          visible: showCertificates
        },
        internshipsSection: {
          ...(profile?.internshipsSection || {}),
          visible: showInternships
        },
        themeSection: {
          activePreset
        }
      };

      await api.put('/profile', payload);
      await fetchEverything();
      
      // Real-time socket sync emission
      const updatedProfile = useStore.getState().profile;
      if (socket && user?.portfolioSlug && updatedProfile) {
        socket.emit('profile:update', {
          slug: user.portfolioSlug,
          profile: updatedProfile
        });
      }

      setSuccess('Digital experience composed & synchronized successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync Experience Studio configurations.');
    } finally {
      setLoading(false);
    }
  };

  // Action: Commit dynamic Figma snapshot
  const handleCommitSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotLabel.trim()) return;
    setLoading(true);
    try {
      await api.post('/profile/snapshot', { label: snapshotLabel });
      setSnapshotLabel('');
      await fetchEverything();
      await loadHistory();
      setSuccess('Figma-style design snapshot committed to record timeline!');
    } catch (err: any) {
      setError('Failed to commit design snapshot.');
    } finally {
      setLoading(false);
    }
  };

  // Action: Restore previous snapshot state
  const handleRestoreSnapshot = async (versionId: string) => {
    if (!window.confirm('Are you sure you want to restore this snapshot? This will overwrite your active visible layout sections.')) return;
    setLoading(true);
    try {
      await api.post('/profile/restore', { versionId });
      await fetchEverything();

      // Real-time socket sync emission
      const restoredProfile = useStore.getState().profile;
      if (socket && user?.portfolioSlug && restoredProfile) {
        socket.emit('profile:update', {
          slug: user.portfolioSlug,
          profile: restoredProfile
        });
      }

      setSuccess('Design snapshot restored successfully!');
    } catch (err: any) {
      setError('Failed to restore selected snapshot.');
    } finally {
      setLoading(false);
    }
  };

  // Theme Preset Options Config
  const themePresets = [
    {
      name: 'Purple Nebula',
      colors: 'from-violet-600 via-indigo-600 to-purple-800',
      glow: 'shadow-purple-500/25',
      desc: 'Immersive violet spotlights, galactic neon flares, and rich dark glass headers.'
    },
    {
      name: 'Cyber Emerald',
      colors: 'from-emerald-600 via-teal-600 to-emerald-800',
      glow: 'shadow-emerald-500/25',
      desc: 'Glowing digital green accents, matrix coding terminals, and high visibility metrics.'
    },
    {
      name: 'Deep Space',
      colors: 'from-blue-600 via-sky-600 to-indigo-800',
      glow: 'shadow-blue-500/25',
      desc: 'Deep oceanic blue spotlights, titanium borders, and starry responsive text glows.'
    },
    {
      name: 'Sunset AI',
      colors: 'from-amber-600 via-orange-600 to-rose-700',
      glow: 'shadow-orange-500/25',
      desc: 'Warm cybernetic orange horizons, molten gold indicators, and organic bento layouts.'
    },
    {
      name: 'Matrix Signal',
      colors: 'from-emerald-500 via-green-600 to-teal-500',
      glow: 'shadow-green-400/20',
      desc: 'High-contrast signal green glows, retro digital console widgets, and terminal lines.'
    }
  ];

  if (isKS) {
    return (
      <div className="min-h-[85vh] flex flex-col relative select-text text-left">
        <style>{`
          .coordinate-grid {
            background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .custom-range::-webkit-slider-runnable-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            height: 4px;
          }
          .custom-range::-webkit-slider-thumb {
            background: #ec4899;
            border-radius: 9999px;
            width: 14px;
            height: 14px;
            margin-top: -5px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .custom-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
          }
        `}</style>
        
        {/* Top Sync / Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 mb-6 relative z-20 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Layers3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none heading-font">KS EXPERIENCE STUDIO</h1>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">GLOBAL SITE SHELL & SITE NAVIGATION</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-[9px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreviewMobile ? "Hide Preview" : "Show Preview"}</span>
            </button>
            <button
              onClick={handleSaveBlocks}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-pink-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Publishing Shell..." : "Publish Realtime Sync"}</span>
            </button>
          </div>
        </div>

        {/* Split screen content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 animate-fade-in">
          
          {/* ======================================================= */}
          {/* ============ LEFT SIDE: EDITABLE CONTROLS ============= */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-none pb-12">
            
            {/* 1. HEADER CONTROLS CARD */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest flex items-center gap-2">
                  <Layout className="w-4 h-4 text-pink-400" />
                  <span>Header Composer</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure brand logo identity, active navigation buttons, resume action delivery, and glass blur indexes.
                </p>
              </div>

              {/* BRAND IDENTITIES */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">1. BRAND IDENTITY</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Logo Branding Text</label>
                    <input
                      type="text"
                      placeholder="KHUSHABOO"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Dot Accent Color</label>
                    <select
                      value={accentDotColor}
                      onChange={(e) => setAccentDotColor(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="#ec4899">Fuchsia Pink</option>
                      <option value="#06b6d4">Cyber Cyan</option>
                      <option value="#10b981">Matrix Green</option>
                      <option value="#f59e0b">Molten Amber</option>
                      <option value="#8b5cf6">Galactic Purple</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                    <span>MOBILE LOGO DISPLAY SCALE</span>
                    <span className="text-pink-400 font-bold">{mobileLogoScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={mobileLogoScale}
                    onChange={(e) => setMobileLogoScale(parseInt(e.target.value))}
                    className="w-full custom-range cursor-pointer"
                  />
                </div>
              </div>

              {/* NAVIGATION MENU (Dynamic Array) */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest">2. NAVIGATION MENU BUTTONS</span>
                  <button
                    type="button"
                    onClick={() => setNavMenu(prev => [...prev, { label: 'NEW PATH', route: '#new', enabled: true }])}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[8px] font-mono text-pink-400 hover:text-white cursor-pointer hover:border-pink-500/30 transition-all"
                  >
                    + Add Menu Item
                  </button>
                </div>

                <div className="space-y-3">
                  {navMenu.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3">
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const copy = [...navMenu];
                            const temp = copy[idx];
                            copy[idx] = copy[idx - 1];
                            copy[idx - 1] = temp;
                            setNavMenu(copy);
                          }}
                          className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === navMenu.length - 1}
                          onClick={() => {
                            const copy = [...navMenu];
                            const temp = copy[idx];
                            copy[idx] = copy[idx + 1];
                            copy[idx + 1] = temp;
                            setNavMenu(copy);
                          }}
                          className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const copy = [...navMenu];
                            copy[idx].label = e.target.value.toUpperCase();
                            setNavMenu(copy);
                          }}
                          placeholder="LABEL"
                          className="bg-black border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white font-mono uppercase"
                        />
                        <input
                          type="text"
                          value={item.route}
                          onChange={(e) => {
                            const copy = [...navMenu];
                            copy[idx].route = e.target.value;
                            setNavMenu(copy);
                          }}
                          placeholder="ROUTE / ID"
                          className="bg-black border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                        />
                        
                        <div className="flex items-center justify-between pl-2">
                          <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.enabled ?? true}
                              onChange={(e) => {
                                const copy = [...navMenu];
                                copy[idx].enabled = e.target.checked;
                                setNavMenu(copy);
                              }}
                              className="accent-pink-500"
                            />
                            <span>Active</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setNavMenu(prev => prev.filter((_, i) => i !== idx))}
                            className="text-[8px] font-mono text-red-500 hover:text-red-400 cursor-pointer bg-transparent border-none"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {navMenu.length === 0 && (
                    <div className="p-6 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500 font-mono">
                      No Navigation Menu buttons configured yet. Click "+ Add Menu Item" to begin!
                    </div>
                  )}
                </div>
              </div>

              {/* RESUME BUTTON */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">3. RESUME CTA BUTTON</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">CTA Label Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Redirect Link URL</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Button Icon Shape</label>
                    <select
                      value={ctaIcon}
                      onChange={(e) => setCtaIcon(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="FileText">File Document Icon</option>
                      <option value="Award">Award Badge Icon</option>
                      <option value="Briefcase">Professional Case Icon</option>
                      <option value="Layers">Stacked Layers Icon</option>
                    </select>
                  </div>

                  <div className="space-y-2.5 pl-1 pt-1.5">
                    <span className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Delivery Tab preset</span>
                    <label className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ctaNewTab}
                        onChange={(e) => setCtaNewTab(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Open in New Browser Tab</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* HEADER VISUAL CONTROLS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">4. HEADER VISUAL STYLING</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>GLASS GLASSMORPHISM TRANSPARENCY</span>
                      <span className="text-pink-400 font-bold">{headerTransparency}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={headerTransparency}
                      onChange={(e) => setHeaderTransparency(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>GLASS BACKDROP BLUR STRIPS</span>
                      <span className="text-pink-400 font-bold">{headerBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      value={headerBlur}
                      onChange={(e) => setHeaderBlur(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Border Glow Preset</label>
                    <select
                      value={headerBorderGlow}
                      onChange={(e) => setHeaderBorderGlow(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="glow-pink">Glowing Pink Border</option>
                      <option value="glow-cyan">Glowing Cyan Border</option>
                      <option value="subtle-aura">Subtle Translucent Edge</option>
                      <option value="plain-white">Plain Minimal Border</option>
                    </select>
                  </div>

                  <div className="flex items-center pl-2 pt-4">
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={headerSticky}
                        onChange={(e) => setHeaderSticky(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Sticky Navigation bar</span>
                    </label>
                  </div>

                  <div className="flex items-center pl-2 pt-4">
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={headerMobileCollapse}
                        onChange={(e) => setHeaderMobileCollapse(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Collapse Mobile Hamburger</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. FOOTER CONTROLS CARD */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                  <Layout className="w-4 h-4 text-pink-400" />
                  <span>FOOTER SYSTEM COMPOSER</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure visual copyright alignments, credits text paragraphs, professional status tags, and social anchors.
                </p>
              </div>

              {/* FOOTER IDENTITIES */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">1. FOOTER IDENTITY</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Footer Display Name</label>
                    <input
                      type="text"
                      value={footerName}
                      onChange={(e) => setFooterName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Professional Opportunity Status</label>
                    <input
                      type="text"
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Design Credits & Paragraph</label>
                    <input
                      type="text"
                      value={creditsText}
                      onChange={(e) => setCreditsText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Copyright Slogan Label</label>
                    <input
                      type="text"
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">2. SOCIAL REDIRECT ENGINES</span>
                
                <div className="space-y-3">
                  {socialLinks.map((social, idx) => (
                    <div key={idx} className="bg-neutral-950 border border-neutral-900 p-3 sm:p-4 px-4 sm:px-5 rounded-2xl flex flex-col sm:flex-row sm:items-stretch justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {React.createElement(getIconComponent(social.icon), {
                          className: "w-4 h-4 text-pink-400 shrink-0"
                        })}
                        <span className="text-[10px] font-bold text-white tracking-wide">{social.icon}</span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-4">
                        <input
                          type="text"
                          value={social.url}
                          onChange={(e) => {
                            const copy = [...socialLinks];
                            copy[idx].url = e.target.value;
                            setSocialLinks(copy);
                          }}
                          placeholder="Target URL Path..."
                          className="bg-black border border-neutral-850 px-3 py-1.5 rounded-xl text-xs text-white font-mono w-full"
                        />

                        <div className="flex items-center justify-end">
                          <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={social.enabled ?? true}
                              onChange={(e) => {
                                const copy = [...socialLinks];
                                copy[idx].enabled = e.target.checked;
                                setSocialLinks(copy);
                              }}
                              className="accent-pink-500"
                            />
                            <span>Active Visibility</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER VISUALS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">3. FOOTER VISUAL STYLING</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>FOOTER AMBIENT NEON GLOW SHADOWS</span>
                      <span className="text-pink-400 font-bold">{footerGlow}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={footerGlow}
                      onChange={(e) => setFooterGlow(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>BOTTOM TIMELINE VERTICAL SPACING</span>
                      <span className="text-pink-400 font-bold">{footerSpacing}px</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={footerSpacing}
                      onChange={(e) => setFooterSpacing(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>FOOTER ACCENT BLUR AMOUNT</span>
                      <span className="text-pink-400 font-bold">{footerBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={footerBlur}
                      onChange={(e) => setFooterBlur(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>OVERALL SHELL OPACITY LAYERS</span>
                      <span className="text-pink-400 font-bold">{footerOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={footerOpacity}
                      onChange={(e) => setFooterOpacity(parseInt(e.target.value))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center pl-2 pt-4">
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={footerDivider}
                        onChange={(e) => setFooterDivider(e.target.checked)}
                        className="accent-pink-500"
                      />
                      <span>Divider Border Visibility</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================= */}
          {/* ============ RIGHT SIDE: SITE SHELL PREVIEW ============ */}
          {/* ======================================================= */}
          <div className={`lg:col-span-5 h-[85vh] sticky top-0 rounded-3xl border border-neutral-900 bg-black overflow-hidden flex flex-col justify-between shadow-2xl relative select-none ${showPreviewMobile ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Realtime Video Background Simulation */}
            {(() => {
              const rawVideo = profile?.themeSection?.visualIdentity?.videoBackground?.videoUrl || "/khushboo-trim.mp4";
              const actualVideoUrl = rawVideo.startsWith('/uploads') ? `${import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rawVideo}` : rawVideo;
              const overlayDarkness = profile?.themeSection?.visualIdentity?.overlayControl?.darkness ?? 75;
              const overlayBlur = profile?.themeSection?.visualIdentity?.overlayControl?.blur ?? 0;
              const vignetteIntensity = profile?.themeSection?.visualIdentity?.overlayControl?.vignette ?? 80;

              return (
                <>
                  <video
                    key={actualVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none z-0"
                    style={{ 
                      filter: `blur(${overlayBlur}px)`
                    }}
                  >
                    <source src={actualVideoUrl} type="video/mp4" />
                  </video>
                  {/* Cinematic layered overlay */}
                  <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(to bottom, rgba(0,0,0,${overlayDarkness / 100}), rgba(0,0,0,${overlayDarkness / 200}), rgba(0,0,0,${overlayDarkness / 100}))`,
                      boxShadow: `inset 0 0 ${vignetteIntensity * 1.5}px rgba(0, 0, 0, ${vignetteIntensity / 100})`
                    }}
                  />
                </>
              );
            })()}

            {/* Bounding retro crosshairs */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/10" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/10" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/10" />
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/10" />

            {/* Mock browser Address bar */}
            <div className="px-4 py-2 border-b border-neutral-900 flex justify-between items-center z-20 bg-neutral-950/40 relative">
              <div className="flex gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
              </div>
              <div className="px-4 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[7px] text-neutral-400 font-mono tracking-wide truncate max-w-[170px]">
                https://khushaboo-saini.dev
              </div>
              <div className="w-6 shrink-0" />
            </div>

            {/* MOCK LAYOUT CANVAS VIEW */}
            <div className="flex-1 flex flex-col justify-between relative overflow-hidden z-10 p-5 select-none font-sans">
              
              {/* 1. MOCK SITE HEADER (LIVE SIMULATION) */}
              <div 
                className="w-full px-4 py-3 rounded-2xl border flex items-center justify-between backdrop-blur-xl relative transition-all duration-300"
                style={{
                  backgroundColor: `rgba(12, 12, 14, ${headerTransparency / 100})`,
                  backdropFilter: `blur(${headerBlur}px)`,
                  borderColor: headerBorderGlow === 'glow-pink' ? 'rgba(236, 72, 153, 0.25)' : (headerBorderGlow === 'glow-cyan' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)'),
                  boxShadow: headerBorderGlow === 'glow-pink' ? '0 0 10px rgba(236, 72, 153, 0.1)' : (headerBorderGlow === 'glow-cyan' ? '0 0 10px rgba(6, 182, 212, 0.1)' : 'none')
                }}
              >
                {/* Logo Text with custom dot accent */}
                <div className="flex items-center gap-0.5 font-sans font-black text-[9px] uppercase tracking-wider text-white">
                  <span>{logoText || "KHUSHABOO"}</span>
                  <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: accentDotColor }} />
                </div>

                {/* Nav Links */}
                <div className="hidden sm:flex items-center gap-2.5 text-[6.5px] font-mono text-neutral-400 font-bold uppercase">
                  {navMenu.filter(item => item.enabled).slice(0, 5).map((item, i) => (
                    <span key={i} className="hover:text-white cursor-pointer transition-colors">{item.label}</span>
                  ))}
                </div>

                {/* Resume button */}
                {ctaText && (
                  <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:border-pink-500/20 text-[6.5px] font-mono text-white flex items-center gap-1 cursor-default scale-95 origin-right">
                    {React.createElement(getIconComponent(ctaIcon), {
                      className: "w-2.5 h-2.5 text-pink-400"
                    })}
                    <span>{ctaText}</span>
                  </div>
                )}
              </div>

              {/* 2. DYNAMIC LAYOUT SHELL CONTENT VOID */}
              <div className="flex-1 flex flex-col justify-center items-center relative coordinate-grid rounded-3xl border border-white/[0.01] my-4 min-h-[220px]">
                {/* Orbital concentric rings to represent spatial void */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-dashed border-white/[0.01] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-white/[0.01] pointer-events-none" />
                
                <div className="text-center space-y-1 relative z-10">
                  <span className="text-[7.5px] font-mono tracking-widest text-neutral-500 uppercase flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                    <span>REALTIME WEBSITE SHELL</span>
                  </span>
                  <p className="text-[8px] font-sans font-light text-neutral-400 max-w-[170px] leading-relaxed mx-auto">
                    Central content void showing header and footer shell. Editable live from the left dashboard.
                  </p>
                </div>
              </div>

              {/* 3. MOCK SITE FOOTER (LIVE SIMULATION) */}
              <div 
                className="w-full text-center flex flex-col gap-2 relative transition-all duration-300"
                style={{
                  marginTop: `${footerSpacing / 2}px`,
                  opacity: footerOpacity / 100
                }}
              >
                {/* Mock horizontal divider line */}
                {footerDivider && (
                  <div className="w-full h-[1px] bg-neutral-900" />
                )}

                {/* Slogan and Active Status row */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1 font-mono text-[7px] text-neutral-400">
                  <span className="font-extrabold text-white text-[7.5px] tracking-wide">{footerName}</span>
                  
                  {statusText && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-neutral-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-[6px] tracking-wide text-neutral-400 font-bold uppercase truncate max-w-[130px]">{statusText}</span>
                    </div>
                  )}
                </div>

                {/* Bottom credits & copyright row */}
                <div className="flex justify-between items-center text-[6px] text-neutral-600 font-mono">
                  <span>{creditsText}</span>
                  <span>{copyrightText}</span>
                </div>

                {/* Active Social icons grid */}
                <div className="flex justify-center gap-3 pt-1 border-t border-white/[0.01]">
                  {socialLinks.filter(s => s.enabled).map((social, i) => (
                    <div key={i} className="p-1 rounded bg-[#0c0c0e] border border-neutral-900 text-neutral-500 hover:text-white transition-colors">
                      {React.createElement(getIconComponent(social.icon), {
                        className: "w-2.5 h-2.5"
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  if (isMS) {
    return (
      <div className="min-h-[85vh] flex flex-col relative select-text text-left">
        <style>{`
          .coordinate-grid-ms {
            background-image: radial-gradient(rgba(249, 115, 22, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .custom-range-ms::-webkit-slider-runnable-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            height: 4px;
          }
          .custom-range-ms::-webkit-slider-thumb {
            background: #f97316;
            border-radius: 9999px;
            width: 14px;
            height: 14px;
            margin-top: -5px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .custom-range-ms::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
          }
        `}</style>

        {/* Top Sync / Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 mb-6 relative z-20 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
              <Layers3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none heading-font">MS GLOBAL EXPERIENCE STUDIO</h1>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">GLOBAL EXPERIENCE LAYERS & BRANDING CONTROLLER</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/20 text-[9px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreviewMobile ? "Hide Preview" : "Show Preview"}</span>
            </button>
            <button
              onClick={handleSaveMSGlobalExperience}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-orange-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Publishing Shell..." : "Publish Realtime Sync"}</span>
            </button>
          </div>
        </div>

        {/* Split screen content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 animate-fade-in">
          
          {/* LEFT SIDE: EDITABLE CONTROLS */}
          <div className="lg:col-span-7 space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-none pb-12 no-scrollbar">
            
            {/* Mobile Tab Select Dropdown */}
            <div className="block md:hidden mb-4 relative animate-fade-in w-full">
              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Select Editing Tab
              </label>
              <select
                value={msSubTab}
                onChange={(e) => setMsSubTab(e.target.value as any)}
                className="w-full bg-[#070709] border border-neutral-800 focus:border-orange-500/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-white font-mono cursor-pointer appearance-none shadow-lg"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px'
                }}
              >
                {[
                  { id: 'header-exp', label: '1. Header Experience' },
                  { id: 'footer-exp', label: '2. Footer Experience' },
                  { id: 'section-toggles-exp', label: '3. Section Toggles' },
                  { id: 'theme-exp', label: '4. Theme Experience' },
                  { id: 'layout-exp', label: '5. Layout Experience' }
                ].map((t) => (
                  <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Tabs Picker */}
            <div className="hidden md:flex flex-wrap gap-1 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-1.5">
              {[
                { id: 'header-exp', label: 'Header Experience', icon: Layout },
                { id: 'footer-exp', label: 'Footer Experience', icon: Layout },
                { id: 'section-toggles-exp', label: 'Section Toggles', icon: Settings },
                { id: 'theme-exp', label: 'Theme Experience', icon: Palette },
                { id: 'layout-exp', label: 'Layout Experience', icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                const isAct = msSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMsSubTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border-none ${
                      isAct 
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                        : 'bg-transparent text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Header Experience */}
            {msSubTab === 'header-exp' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent"></div>
                
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Layout className="w-4 h-4 text-orange-400" />
                    <span>HEADER IDENTITY & CONTROLS</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Configure MS brand logo identity, active navigation buttons, resume action delivery, and glass blur indexes.
                  </p>
                </div>

                {/* Section A: Brand Identity */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION A — BRAND IDENTITY</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Brand Name</label>
                      <input
                        type="text"
                        value={msBrandName}
                        onChange={(e) => setMsBrandName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Resume Button Text</label>
                      <input
                        type="text"
                        value={msResumeText}
                        onChange={(e) => setMsResumeText(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Resume URL / File path</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={msResumeUrl}
                        onChange={(e) => setMsResumeUrl(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                        placeholder="Click upload on the right to attach a PDF or Image"
                      />
                      <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500/35 text-neutral-300 hover:text-white font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-xl cursor-pointer select-none transition-all active:scale-[0.98]">
                        <Upload className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{msUploadingResume ? 'Uploading...' : 'Upload PDF/Image'}</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleMsResumeUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section B: Navigation Links */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest">SECTION B — NAVIGATION LINKS</span>
                    <button
                      type="button"
                      onClick={() => setMsNavMenu(prev => [...prev, { label: 'NEW PATH', route: '#new', enabled: true, order: prev.length + 1 }])}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[8px] font-mono text-orange-400 hover:text-white cursor-pointer hover:border-orange-500/30 transition-all"
                    >
                      + Add Menu Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {msNavMenu.map((item, idx) => (
                      <div key={idx} className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3">
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const copy = [...msNavMenu];
                              const temp = copy[idx];
                              copy[idx] = copy[idx - 1];
                              copy[idx - 1] = temp;
                              setMsNavMenu(copy);
                            }}
                            className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === msNavMenu.length - 1}
                            onClick={() => {
                              const copy = [...msNavMenu];
                              const temp = copy[idx];
                              copy[idx] = copy[idx + 1];
                              copy[idx + 1] = temp;
                              setMsNavMenu(copy);
                            }}
                            className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer text-[8px] border-none"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const copy = [...msNavMenu];
                              copy[idx].label = e.target.value.toUpperCase();
                              setMsNavMenu(copy);
                            }}
                            placeholder="LABEL"
                            className="bg-black border border-neutral-800 focus:border-orange-500/20 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white font-mono uppercase"
                          />
                          <input
                            type="text"
                            value={item.route}
                            onChange={(e) => {
                              const copy = [...msNavMenu];
                              copy[idx].route = e.target.value;
                              setMsNavMenu(copy);
                            }}
                            placeholder="ROUTE"
                            className="bg-black border border-neutral-800 focus:border-orange-500/20 focus:outline-none px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                          />
                          
                          <div className="flex items-center justify-between pl-2">
                            <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.enabled ?? true}
                                onChange={(e) => {
                                  const copy = [...msNavMenu];
                                  copy[idx].enabled = e.target.checked;
                                  setMsNavMenu(copy);
                                }}
                                className="accent-orange-500"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => setMsNavMenu(prev => prev.filter((_, i) => i !== idx))}
                              className="text-[8px] font-mono text-red-500 hover:text-red-400 cursor-pointer bg-transparent border-none"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Header Visual System */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION C — HEADER VISUAL SYSTEM</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Header Glass Opacity</span>
                        <span className="text-orange-400 font-bold">{msHeaderGlassOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={msHeaderGlassOpacity}
                        onChange={(e) => setMsHeaderGlassOpacity(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Blur Strength</span>
                        <span className="text-orange-400 font-bold">{msBlurStrength}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={msBlurStrength}
                        onChange={(e) => setMsBlurStrength(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Border Glow Preset</label>
                      <select
                        value={msBorderGlow}
                        onChange={(e) => setMsBorderGlow(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono cursor-pointer"
                      >
                        <option value="glow-pink">Glowing Orange Border</option>
                        <option value="glow-cyan">Glowing Blue Border</option>
                        <option value="subtle-aura">Subtle Translucent Edge</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Active Nav Glow</label>
                      <select
                        value={msActiveNavGlow}
                        onChange={(e) => setMsActiveNavGlow(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2 rounded-xl text-xs text-white font-mono cursor-pointer"
                      >
                        <option value="glow-pink">Glowing Orange Pill</option>
                        <option value="glow-cyan">Glowing Blue Pill</option>
                        <option value="subtle-aura">Standard Gray Border</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section D: Sticky Header Controls */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION D — STICKY HEADER CONTROLS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={msStickyEnabled}
                        onChange={(e) => setMsStickyEnabled(e.target.checked)}
                        className="accent-orange-500"
                      />
                      <span>Sticky Enabled</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={msShrinkOnScroll}
                        onChange={(e) => setMsShrinkOnScroll(e.target.checked)}
                        className="accent-orange-500"
                      />
                      <span>Shrink On Scroll</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={msBlurOnScroll}
                        onChange={(e) => setMsBlurOnScroll(e.target.checked)}
                        className="accent-orange-500"
                      />
                      <span>Blur On Scroll</span>
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Footer Experience */}
            {msSubTab === 'footer-exp' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent"></div>
                
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Layout className="w-4 h-4 text-orange-400" />
                    <span>FOOTER EXPERIENCE COMPOSER</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Configure copyright information, visual slogans, layout alignment indexes, and footer accenting.
                  </p>
                </div>

                {/* Section A: Footer Main Text */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION A — FOOTER MAIN TEXT</span>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Footer Heading</label>
                      <input
                        type="text"
                        value={msFooterHeading}
                        onChange={(e) => setMsFooterHeading(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Footer Tech Stack Text</label>
                      <input
                        type="text"
                        value={msFooterTechStackText}
                        onChange={(e) => setMsFooterTechStackText(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Footer Visibility */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION B — FOOTER VISIBILITY</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={msFooterEnabled}
                        onChange={(e) => setMsFooterEnabled(e.target.checked)}
                        className="accent-orange-500"
                      />
                      <span>Footer Enabled</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={msFooterGlassEffect}
                        onChange={(e) => setMsFooterGlassEffect(e.target.checked)}
                        className="accent-orange-500"
                      />
                      <span>Footer Glass Effect</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>Footer Blur strength</span>
                      <span className="text-orange-400 font-bold">{msFooterBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={msFooterBlur}
                      onChange={(e) => setMsFooterBlur(parseInt(e.target.value))}
                      className="w-full custom-range-ms cursor-pointer"
                    />
                  </div>
                </div>

                {/* Section C: Footer Styling */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">SECTION C — FOOTER STYLING</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Footer Text Color</label>
                      <input
                        type="color"
                        value={msFooterTextColor}
                        onChange={(e) => setMsFooterTextColor(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none p-1.5 h-10 rounded-xl cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Footer Accent Color</label>
                      <input
                        type="color"
                        value={msFooterAccentColor}
                        onChange={(e) => setMsFooterAccentColor(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none p-1.5 h-10 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>Footer Overall Opacity</span>
                      <span className="text-orange-400 font-bold">{msFooterOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={msFooterOpacity}
                      onChange={(e) => setMsFooterOpacity(parseInt(e.target.value))}
                      className="w-full custom-range-ms cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: Section Toggles */}
            {msSubTab === 'section-toggles-exp' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent"></div>
                
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Settings className="w-4 h-4 text-orange-400" />
                    <span>GLOBAL SECTION VISIBILITY</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Toggle visibility & order of dynamic subpages.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  {msSections.map((item, idx) => (
                    <div 
                      key={item.name}
                      className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {/* Up/Down buttons */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const copy = [...msSections];
                              const temp = copy[idx];
                              copy[idx] = copy[idx - 1];
                              copy[idx - 1] = temp;
                              setMsSections(copy);
                            }}
                            className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 text-[7px]"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === msSections.length - 1}
                            onClick={() => {
                              const copy = [...msSections];
                              const temp = copy[idx];
                              copy[idx] = copy[idx + 1];
                              copy[idx + 1] = temp;
                              setMsSections(copy);
                            }}
                            className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 text-[7px]"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="text-left space-y-0.5">
                          <span className="text-xs font-extrabold text-white uppercase tracking-wider">{item.name} Page</span>
                          <span className="text-[7.5px] font-mono text-zinc-500 block">ROUTE: {item.route} • ORDER INDEX: {idx + 1}</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          const copy = [...msSections];
                          copy[idx].enabled = !copy[idx].enabled;
                          setMsSections(copy);
                        }}
                        className="cursor-pointer select-none"
                      >
                        {item.enabled ? (
                          <ToggleRight className="w-8 h-8 text-orange-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-700" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: Theme Experience */}
            {msSubTab === 'theme-exp' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent"></div>
                
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-400" />
                    <span>THEME EXPERIENCE PRESETS</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Tweak specific background meshes, radial glow overlay factors, and border accents.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">THEME FIELDS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Primary Accent</label>
                      <input
                        type="color"
                        value={msPrimaryAccent}
                        onChange={(e) => setMsPrimaryAccent(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none p-1.5 h-10 rounded-xl cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Secondary Accent</label>
                      <input
                        type="color"
                        value={msSecondaryAccent}
                        onChange={(e) => setMsSecondaryAccent(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none p-1.5 h-10 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Gradient Mesh Overlay Accent</label>
                    <input
                      type="text"
                      value={msGradientOverlay}
                      onChange={(e) => setMsGradientOverlay(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-neutral-800 focus:border-orange-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Glow Intensity scale</span>
                        <span className="text-orange-400 font-bold">{msGlowIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={msGlowIntensity}
                        onChange={(e) => setMsGlowIntensity(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Cinematic darkness</span>
                        <span className="text-orange-400 font-bold">{msCinematicDarkness}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={msCinematicDarkness}
                        onChange={(e) => setMsCinematicDarkness(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: Layout Experience */}
            {msSubTab === 'layout-exp' && (
              <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-3.5 md:space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent"></div>
                
                <div className="space-y-1">
                  <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-orange-400" />
                    <span>LAYOUT EXPERIENCE TUNER</span>
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                    Scale section gaps, overall maximum display layouts, and horizontal grid alignment.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest block">LAYOUT PARAMETERS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Section Spacing Gap</span>
                        <span className="text-orange-400 font-bold">{msSectionGap}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="96"
                        value={msSectionGap}
                        onChange={(e) => setMsSectionGap(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Max Display Width</span>
                        <span className="text-orange-400 font-bold">{msMaxWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="1600"
                        value={msMaxWidth}
                        onChange={(e) => setMsMaxWidth(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Framer Animation Speed</span>
                        <span className="text-orange-400 font-bold">{msAnimationSpeed}s</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="20"
                        value={msAnimationSpeed * 10}
                        onChange={(e) => setMsAnimationSpeed(parseInt(e.target.value) / 10)}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                        <span>Scroll Smoothness Index</span>
                        <span className="text-orange-400 font-bold">{msScrollSmoothness}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={msScrollSmoothness}
                        onChange={(e) => setMsScrollSmoothness(parseInt(e.target.value))}
                        className="w-full custom-range-ms cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT SIDE: LIVE MOCKUP PREVIEW */}
          <div className={`lg:col-span-5 h-[85vh] sticky top-0 rounded-3xl border border-neutral-900 bg-[#070709] overflow-hidden flex flex-col justify-between shadow-2xl relative select-none ${showPreviewMobile ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Realtime Video Background Simulation */}
            <video
              key="/mahi.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ 
                opacity: 1 - (msCinematicDarkness / 100)
              }}
            >
              <source src={`${import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"}/uploads/portfolio/ms/mahi.mp4`} type="video/mp4" />
              <source src="/mahi.mp4" type="video/mp4" />
            </video>
            {/* Cinematic layered overlay */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
              style={{ 
                background: `linear-gradient(to bottom, rgba(0,0,0,${msCinematicDarkness / 100}), rgba(0,0,0,${msCinematicDarkness / 200}), rgba(0,0,0,${msCinematicDarkness / 100}))`
              }}
            />

            {/* Premium subtle deep-violet radial gradient glow */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle 300px at 50% 120px, ${msGradientOverlay}, transparent)`,
              }}
            />

            {/* Bounding retro crosshairs */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/10" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/10" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/10" />
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/10" />

            {/* Mock browser Address bar */}
            <div className="px-4 py-2 border-b border-neutral-900 flex justify-between items-center z-20 bg-neutral-950/40 relative">
              <div className="flex gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
              </div>
              <div className="px-4 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[7px] text-neutral-400 font-mono tracking-wide truncate max-w-[170px]">
                https://mahi-singh.dev
              </div>
              <div className="w-6 shrink-0" />
            </div>

            {/* MOCK LAYOUT CANVAS VIEW */}
            <div className="flex-1 flex flex-col justify-between relative overflow-hidden z-10 p-5 select-none font-sans">
              
              {/* 1. MOCK SITE HEADER */}
              <div 
                className="w-full px-4 py-2.5 rounded-full border flex items-center justify-between backdrop-blur-xl relative transition-all duration-300"
                style={{
                  backgroundColor: `rgba(12, 12, 14, ${msHeaderGlassOpacity / 100})`,
                  backdropFilter: `blur(${msBlurStrength}px)`,
                  borderColor: msBorderGlow === 'glow-pink' ? `${msPrimaryAccent}44` : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: msBorderGlow === 'glow-pink' ? `0 0 12px ${msPrimaryAccent}22` : 'none'
                }}
              >
                {/* Logo Text with custom dot accent */}
                <div className="flex items-center gap-0.5 font-sans font-black text-[9px] uppercase tracking-wider text-white">
                  <span>{msBrandName}</span>
                  <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: msFooterAccentColor }} />
                </div>

                {/* Nav Links */}
                <div className="hidden sm:flex items-center gap-2.5 text-[6px] font-mono text-neutral-400 font-bold uppercase">
                  {msNavMenu.filter(item => item.enabled).slice(0, 4).map((item, i) => (
                    <span 
                      key={i} 
                      className="hover:text-white cursor-pointer transition-colors"
                      style={{
                        color: i === 0 ? msFooterAccentColor : undefined
                      }}
                    >{item.label}</span>
                  ))}
                </div>

                {/* Resume button */}
                {msResumeText && (
                  <div 
                    className="px-2.5 py-0.5 rounded-full bg-white/5 border text-[6.5px] font-mono text-white flex items-center gap-1 cursor-default scale-95 origin-right"
                    style={{
                      borderColor: `${msFooterAccentColor}33`,
                      color: msFooterAccentColor
                    }}
                  >
                    <FileText className="w-2.5 h-2.5" />
                    <span>{msResumeText}</span>
                  </div>
                )}
              </div>

              {/* 2. CENTRAL LAYOUT SHELL CONTENT */}
              <div className="flex-1 flex flex-col justify-center items-center relative coordinate-grid-ms rounded-3xl border border-white/[0.01] my-4 min-h-[220px]">
                <div className="text-center space-y-1 relative z-10">
                  <span className="text-[7.5px] font-mono tracking-widest text-orange-400 uppercase flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                    <span>MS LIVE SITE PREVIEW</span>
                  </span>
                  <p className="text-[8px] font-sans font-light text-neutral-400 max-w-[170px] leading-relaxed mx-auto">
                    Layout gaps: <strong className="text-white">{msSectionGap}px</strong>, max display layout width: <strong className="text-white">{msMaxWidth}px</strong>.
                  </p>
                </div>
              </div>

              {/* 3. MOCK SITE FOOTER */}
              {msFooterEnabled && (
                <div 
                  className="w-full text-center flex flex-col gap-1.5 relative transition-all duration-300"
                  style={{
                    opacity: msFooterOpacity / 100
                  }}
                >
                  {/* Slogan and Active Status row */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1.5 border-t border-white/5 font-mono text-[7px] text-neutral-400">
                    <span className="font-extrabold text-white text-[7.5px] tracking-wide uppercase">{msBrandName}</span>
                    <span className="text-[6.5px] text-zinc-500 uppercase tracking-widest font-black">{msFooterTechStackText}</span>
                  </div>

                  {/* Bottom credits & copyright row */}
                  <div className="flex justify-between items-center text-[6px] text-neutral-600 font-mono">
                    <span style={{ color: msFooterTextColor }}>{msFooterHeading}</span>
                    <span>© 2026 {msBrandName.toUpperCase()}</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Experience Header */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers3 className="w-5 h-5 text-primary" />
            <span>Visual Experience Studio</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Compose digital layouts, switch design presets, and restore historical snapshots in real-time.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
            className="xl:hidden px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/25 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreviewMobile ? "Hide Preview" : "Show Preview"}</span>
          </button>
          <button
            onClick={handleSaveBlocks}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Synchronizing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main CRM Studio Split Panel Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch min-h-[640px]">
        
        {/* Left Side: Blocks Composer Panel */}
        <div className="xl:col-span-7 bg-[#0C0C0E] border border-white/5 rounded-3xl p-5 flex flex-col shadow-2xl space-y-5">
          
          {/* Mobile Tab Select Dropdown */}
          <div className="block md:hidden mb-4 relative animate-fade-in">
            <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Select Editing Tab
            </label>
            <select
              value={activeSubTab}
              onChange={(e) => setActiveSubTab(e.target.value as any)}
              className="w-full bg-[#070709] border border-white/5 focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-white font-mono cursor-pointer appearance-none shadow-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px'
              }}
            >
              {[
                { id: 'header-footer', label: '1. Header & Footer' },
                { id: 'home-hero', label: '2. Hero Block' },
                { id: 'section-toggles', label: '3. Section Toggles' },
                { id: 'theme-presets', label: '4. Theme Presets' },
                { id: 'version-history', label: '5. Version Snapshots' }
              ].map((t) => (
                <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="hidden md:flex flex-wrap gap-1 border-b border-white/5 pb-3">
            {[
              { id: 'header-footer', label: 'Header & Footer', icon: Layout },
              { id: 'home-hero', label: 'Hero Block', icon: Sliders },
              { id: 'section-toggles', label: 'Section Toggles', icon: Settings },
              { id: 'theme-presets', label: 'Theme Presets', icon: Palette },
              { id: 'version-history', label: 'Version Snapshots', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === tab.id 
                      ? 'bg-primary/10 border border-primary/20 text-primary shadow-md' 
                      : 'bg-transparent border border-transparent text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub Tab View Panels */}
          <div className="flex-1 overflow-y-auto max-h-[580px] pr-1.5 space-y-3.5 md:space-y-6 text-left no-scrollbar">
            
            {/* Header & Footer Module */}
            {activeSubTab === 'header-footer' && (
              <div className="space-y-3.5 md:space-y-6">
                
                {/* Header Sub Block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Global Navigation Header Block</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Navigation Brand Logo</label>
                      <input 
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="e.g. SHASHWAT"
                        className="w-full bg-[#070709] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Action Button Label</label>
                      <input 
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="e.g. Connect"
                        className="w-full bg-[#070709] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Sub Block */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Global Slogan Footer Block</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Footer Slogan tag</label>
                      <textarea 
                        value={sloganText}
                        onChange={(e) => setSloganText(e.target.value)}
                        placeholder="e.g. Building scalable AI systems, backend platforms, and modern digital experiences."
                        rows={2}
                        className="w-full bg-[#070709] border border-white/5 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Footer Copyright text</label>
                      <input 
                        type="text"
                        value={copyrightText}
                        onChange={(e) => setCopyrightText(e.target.value)}
                        placeholder="e.g. © 2026 SHASHWAT DIXIT"
                        className="w-full bg-[#070709] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Home Hero Module */}
            {activeSubTab === 'home-hero' && (
              <div className="space-y-3.5 md:space-y-6">
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Home Landing Hero Block</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Primary Greeting Header</label>
                    <input 
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="e.g. Hi, I'm Shashwat Dixit"
                      className="w-full bg-[#070709] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/40 font-heading"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Narrative Description (Paragraph One)</label>
                    <textarea 
                      value={heroDescOne}
                      onChange={(e) => setHeroDescOne(e.target.value)}
                      placeholder="e.g. I'm a full-stack developer focused on creating..."
                      rows={3}
                      className="w-full bg-[#070709] border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-primary/40 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Narrative Description (Paragraph Two)</label>
                    <textarea 
                      value={heroDescTwo}
                      onChange={(e) => setHeroDescTwo(e.target.value)}
                      placeholder="e.g. My work combines clean architecture and premium UI..."
                      rows={3}
                      className="w-full bg-[#070709] border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-primary/40 resize-none font-sans leading-relaxed"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Section Toggles Module */}
            {activeSubTab === 'section-toggles' && (
              <div className="space-y-3.5 md:space-y-6">
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Section Toggles & Visibility Control</h3>
                </div>

                <p className="text-[10px] text-zinc-500 leading-normal">Instantly toggle visible pages and layout blocks on or off across your developer portfolio. Toggled modules automatically slide out from navigation links.</p>

                <div className="space-y-3 pt-2">
                  {/* Skills Section Toggle */}
                  <div 
                    onClick={() => setShowSkills(!showSkills)}
                    className="p-4 bg-[#070709] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/20 transition-all select-none"
                  >
                    <div className="space-y-0.5 text-left">
                      <span className="text-xs font-extrabold text-white">Show Technical Skills Panel</span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">skills and capability metrics block</p>
                    </div>
                    {showSkills ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-700" />
                    )}
                  </div>

                  {/* Certificates Section Toggle */}
                  <div 
                    onClick={() => setShowCertificates(!showCertificates)}
                    className="p-4 bg-[#070709] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/20 transition-all select-none"
                  >
                    <div className="space-y-0.5 text-left">
                      <span className="text-xs font-extrabold text-white">Show Featured Certificates Grid</span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">certified learning radar and credentials list</p>
                    </div>
                    {showCertificates ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-700" />
                    )}
                  </div>

                  {/* Internships Section Toggle */}
                  <div 
                    onClick={() => setShowInternships(!showInternships)}
                    className="p-4 bg-[#070709] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/20 transition-all select-none"
                  >
                    <div className="space-y-0.5 text-left">
                      <span className="text-xs font-extrabold text-white">Show Internships Timeline Block</span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">professional timeline credentials</p>
                    </div>
                    {showInternships ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-700" />
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Theme Preset Engine Module */}
            {activeSubTab === 'theme-presets' && (
              <div className="space-y-3.5 md:space-y-6">
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Global Brand Accent Preset Engine</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themePresets.map((preset) => {
                    const isActive = activePreset === preset.name;
                    return (
                      <div
                        key={preset.name}
                        onClick={() => setActivePreset(preset.name)}
                        className={`p-4 bg-[#070709] border rounded-2xl flex flex-col justify-between gap-4 cursor-pointer hover:border-primary/30 group transition-all duration-300 shadow-md hover:shadow-xl ${
                          isActive 
                            ? 'border-primary/40 shadow-lg' 
                            : 'border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-white">{preset.name}</span>
                            <p className="text-[10px] text-zinc-400 font-light leading-normal">{preset.desc}</p>
                          </div>
                          {isActive && (
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
                            </span>
                          )}
                        </div>

                        {/* Interactive gradient strip bar */}
                        <div className="relative rounded-lg overflow-hidden h-4 w-full">
                          <div className={`absolute inset-0 bg-gradient-to-r ${preset.colors}`} />
                          <div className={`absolute inset-0 opacity-20 bg-grid`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Version Snapshot Module */}
            {activeSubTab === 'version-history' && (
              <div className="space-y-3.5 md:space-y-6">
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Figma-Style Version Snapshots</h3>
                </div>

                {/* Save snapshot form */}
                <form onSubmit={handleCommitSnapshot} className="p-4 bg-[#070709] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-3.5 md:items-end items-stretch">
                  <div className="flex-1 space-y-2 text-left">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Save Current Design Snapshot</label>
                    <input 
                      type="text"
                      value={snapshotLabel}
                      onChange={(e) => setSnapshotLabel(e.target.value)}
                      placeholder="e.g. Green Theme Layout Redesign"
                      className="w-full bg-[#0C0C0E] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/40 font-mono"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !snapshotLabel.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 text-xs font-mono font-bold uppercase cursor-pointer shrink-0 shadow-md"
                  >
                    Commit
                  </button>
                </form>

                {/* Snapshots history list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Historical Design Backup Logs</span>
                  {historyList.length === 0 ? (
                    <div className="p-8 border border-white/5 rounded-2xl bg-[#070709] text-center text-zinc-500 text-xs font-mono">
                      No design snapshots committed yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar pr-1.5">
                      {historyList.map((hist: any) => (
                        <div
                          key={hist.id}
                          className="p-4 bg-[#070709] border border-white/5 rounded-2xl flex justify-between items-center hover:border-white/10 transition-all select-none"
                        >
                          <div className="space-y-0.5 text-left">
                            <span className="text-xs font-extrabold text-white">{hist.label}</span>
                            <span className="text-[9px] font-mono text-zinc-500 block">Committed: {new Date(hist.createdAt).toLocaleString()}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRestoreSnapshot(hist.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-md"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Side: Visual Device Live Mockup Preview */}
        <div className={`xl:col-span-5 bg-[#0C0C0E] border border-white/5 rounded-3xl p-5 flex flex-col shadow-2xl justify-between relative overflow-hidden ${showPreviewMobile ? 'block' : 'hidden xl:block'}`}>
          
          {/* Header toolbar */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">Experience Live Mockup</span>
            </div>

            {/* Screen selectors */}
            <div className="flex gap-1.5 bg-[#070709] border border-white/5 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === 'desktop' ? 'bg-white/5 text-white' : 'text-zinc-500'}`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === 'mobile' ? 'bg-white/5 text-white' : 'text-zinc-500'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive responsive mockup canvas */}
          <div className="flex-1 flex items-center justify-center p-4 bg-[#070709]/50 border border-white/5 rounded-2xl my-4 relative min-h-[380px]">
            
            {/* Device wrapper */}
            <div 
              className={`border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col bg-[#070709] transition-all duration-500 ${
                previewDevice === 'desktop' ? 'w-full max-w-sm aspect-[4/3]' : 'w-48 aspect-[9/16]'
              }`}
            >
              
              {/* Dynamic Preset Backdrop Spotlights */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25 blur-2xl z-0 transition-all duration-700" 
                style={{
                  background: activePreset === 'Purple Nebula' 
                    ? 'radial-gradient(circle at center, rgba(139,92,246,0.5), transparent 70%)'
                    : activePreset === 'Cyber Emerald'
                    ? 'radial-gradient(circle at center, rgba(16,185,129,0.5), transparent 70%)'
                    : activePreset === 'Deep Space'
                    ? 'radial-gradient(circle at center, rgba(59,130,246,0.5), transparent 70%)'
                    : activePreset === 'Sunset AI'
                    ? 'radial-gradient(circle at center, rgba(245,158,11,0.5), transparent 70%)'
                    : 'radial-gradient(circle at center, rgba(0,245,180,0.5), transparent 70%)'
                }}
              />
              <div className="absolute inset-0 bg-grid opacity-10 z-0" />

              {/* Mock Nav Header */}
              <header className="px-4 py-3 bg-white/[0.02] border-b border-white/5 backdrop-blur-xl flex items-center justify-between relative z-10 select-none">
                <span className="text-[10px] font-black tracking-widest text-white uppercase">{logoText || 'DEV'}</span>
                
                {previewDevice === 'desktop' && (
                  <div className="flex gap-2 text-[8px] font-mono text-zinc-500 font-bold uppercase">
                    <span>About</span>
                    <span>Projects</span>
                    {showSkills && <span>Skills</span>}
                  </div>
                )}

                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-[8px] font-mono font-black text-white uppercase scale-90">{ctaText || 'Connect'}</span>
              </header>

              {/* Mock Landing Hero Body */}
              <div className="flex-1 p-5 flex flex-col justify-center gap-3 relative z-10 text-left select-none overflow-hidden">
                <span className="px-2.5 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-[7px] font-mono text-purple-300 font-black uppercase tracking-widest w-max">
                  PORTFOLIO BUFFER ONLINE
                </span>
                
                <h3 className="text-sm md:text-md font-black uppercase text-white tracking-tight leading-tight max-w-xs">{heroTitle || "Hi, I'm Shashwat Dixit"}</h3>
                
                <p className="text-[9px] text-zinc-400 font-light leading-relaxed line-clamp-3">{heroDescOne || "Building scalable systems and modern web interfaces..."}</p>
                
                {previewDevice === 'desktop' && (
                  <div className="flex gap-2 pt-1.5">
                    <span className="px-2 py-1 border border-white/5 bg-[#0A0A0C] text-[8px] font-mono rounded text-zinc-500">React</span>
                    <span className="px-2 py-1 border border-white/5 bg-[#0A0A0C] text-[8px] font-mono rounded text-zinc-500">Node</span>
                  </div>
                )}
              </div>

              {/* Mock Footer */}
              <footer className="px-4 py-3.5 bg-black/45 border-t border-white/5 flex flex-col gap-1.5 relative z-10 select-none text-center">
                <p className="text-[7.5px] text-zinc-400 leading-normal line-clamp-1">{sloganText || "Scalable backend systems and premium AI interfaces."}</p>
                <span className="text-[6.5px] font-mono text-zinc-600 uppercase tracking-widest">{copyrightText || "© 2026 SHASHWAT DIXIT"}</span>
              </footer>

            </div>
          </div>

          {/* Preset Active Badge Info */}
          <div className="bg-[#070709] border border-white/5 rounded-2xl p-4.5 font-mono text-[9px] flex items-center justify-between text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Theme Override active preset: <strong className="text-white">{activePreset}</strong></span>
            </div>
            <span>Vite HMR Active</span>
          </div>

        </div>

      </div>

    </div>
  );
}
