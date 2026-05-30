import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Github, Linkedin, Twitter, Upload, Crop, Smartphone, Tablet, Monitor, 
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Check, X, 
  Clock, Layers, Cpu, Sparkles, Shield, Zap, Globe, Heart, Save, Film, HelpCircle, 
  Settings2, Activity, Play, Sliders, FileText, LayoutTemplate, Share2,
  Target, Palette, Code2, Code, Terminal, Database, Award, Trophy, ShieldCheck, Users, MessageSquare, Briefcase
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Clock', label: 'Clock / Time' },
  { name: 'Layers', label: 'Layers / Projects' },
  { name: 'Cpu', label: 'Cpu / Tech' },
  { name: 'Sparkles', label: 'Sparkles / AI' },
  { name: 'Shield', label: 'Shield / Security' },
  { name: 'Zap', label: 'Zap / Speed' },
  { name: 'Globe', label: 'Globe / Web' },
  { name: 'Heart', label: 'Heart / Focus' },
  { name: 'Code', label: 'Code' },
  { name: 'Terminal', label: 'Terminal / CLI' },
  { name: 'Database', label: 'Database' }
];

const AVAILABLE_COLORS = [
  { name: 'purple', label: 'Purple Accent', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'rgba(139, 92, 246, 0.25)', bg: 'bg-purple-500/10' },
  { name: 'cyan', label: 'Cyan Accent', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.25)', bg: 'bg-cyan-500/10' },
  { name: 'amber', label: 'Amber Accent', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.25)', bg: 'bg-amber-500/10' },
  { name: 'green', label: 'Green Accent', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.25)', bg: 'bg-emerald-500/10' }
];

const KS_GRADIENT_PRESETS = [
  { name: 'Fuchsia Twilight', style: 'from-fuchsia-600 via-pink-600 to-rose-700' },
  { name: 'Deep Purple Glow', style: 'from-violet-600 via-purple-600 to-fuchsia-700' },
  { name: 'Sunset Neon', style: 'from-pink-500 via-rose-500 to-amber-500' },
  { name: 'Emerald Matrix', style: 'from-emerald-500 via-teal-500 to-cyan-600' }
];

const getIconComponent = (iconName: string) => {
  const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Clock, Layers, Cpu, Sparkles, Shield, Zap, Globe, Heart, Save, Film, HelpCircle, 
    Settings2, Activity, Play, Sliders, FileText, LayoutTemplate, Share2, Target, Palette, Code2, Code, Terminal, Database, Award, Trophy, ShieldCheck, Users, MessageSquare, Briefcase
  };
  return ICON_MAP[iconName] || Sparkles;
};

export default function ProfileEdit() {
  const { activePortfolio } = usePortfolio();
  const isKS = activePortfolio === 'khushaboo';

  const profile = useStore((state) => state.profile);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  // Profile basic text info
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Visual CMS Fields state
  const [heroSection, setHeroSection] = useState<any>({
    title: '',
    descOne: '',
    descTwo: '',
    image: '',
    rotatingLines: [],
    ctaLabel: '',
    highlightGradients: '',
    ambientGlow: '#ec4899',
    ambientIntensity: 80,
    storyBlocks: {
      headline: '',
      subheadline: '',
      emotionalHook: '',
      designPhilosophy: '',
      engineeringPhilosophy: ''
    }
  });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [statsCards, setStatsCards] = useState<any[]>([]);
  const [expertiseCards, setExpertiseCards] = useState<any[]>([]);

  // Theme section state
  const [themeSection, setThemeSection] = useState<any>({
    visualIdentity: {
      accentColor: "#ec4899",
      glowIntensity: 75,
      glassBlur: 20,
      gradientPreset: "Fuchsia Twilight",
      typographyStyle: "Outfit",
      floatingParticles: { enabled: true, count: 40, speed: 1.5 }
    },
    motionSystem: {
      transitionSpeed: 0.4,
      scrollInterpolation: 50,
      hoverBehavior: "Magnetic Pull",
      cardRevealStyle: "Spring Rise",
      mouseTracking: true,
      backgroundBlurMotion: true
    },
    cinematicMedia: {
      mediaType: "video",
      mediaUrl: "/uploads/portfolio/ks/cinematic-bg.mp4",
      overlayDarkness: 80,
      motionBlur: 10,
      opacity: 90,
      focusPoint: "Center"
    },
    resumeControl: {
      publicPdfUrl: "",
      directDownload: true,
      openModalPreview: false,
      animatedIntro: "Inspect my dynamic resume containing over 4 years of visual engineering expertise.",
      customCta: "INSPECT CURRICULUM VITAE"
    },
    responsiveControls: {
      mobileHeroOffset: 20,
      fontScaling: 100,
      mobileBlurReduction: true,
      animationDisable: false
    }
  });

  // Local helper states
  const [newTag, setNewTag] = useState('');
  const [newRotatingLine, setNewRotatingLine] = useState('');
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);

  // Portrait Cropper drag states
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Carousel & live preview timers
  const [previewRoleIndex, setPreviewRoleIndex] = useState(0);
  const [previewExpIndex, setPreviewExpIndex] = useState(0);

  // Set default tab when active portfolio slug toggles
  useEffect(() => {
    if (isKS) {
      setActiveTab('landing');
    } else {
      setActiveTab('hero');
    }
  }, [activePortfolio, isKS]);

  // Load and parse profile parameters
  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setGithub(profile.github || '');
      setLinkedin(profile.linkedin || '');
      setTwitter(profile.twitter || '');

      const parsedHero = profile.heroSection 
        ? (typeof profile.heroSection === 'string' ? JSON.parse(profile.heroSection) : profile.heroSection)
        : { title: '', descOne: '', descTwo: '', image: '' };

      const parsedStats = profile.statsCards
        ? (typeof profile.statsCards === 'string' ? JSON.parse(profile.statsCards) : profile.statsCards)
        : [];

      const parsedExpertise = profile.expertiseCards
        ? (typeof profile.expertiseCards === 'string' ? JSON.parse(profile.expertiseCards) : profile.expertiseCards)
        : [];

      const parsedTheme = profile.themeSection
        ? (typeof profile.themeSection === 'string' ? JSON.parse(profile.themeSection) : profile.themeSection)
        : null;

      // Handle portfolio specific presets & schemas
      if (isKS) {
        const ksHero = {
          ...parsedHero,
          title: parsedHero.title || "Hi, I'm Khushaboo Saini",
          descOne: parsedHero.descOne || "I'm a creative frontend developer and UI/UX specialist who crafts highly interactive, responsive, and robust web applications.",
          descTwo: parsedHero.descTwo || "I enjoy structuring reusable components, clean layouts, and integrating them with solid Express and MongoDB backends.",
          image: parsedHero.image || '',
          rotatingLines: parsedHero.rotatingLines || ["Creative Frontend Engineer", "Visual Interaction Specialist", "Premium UI Architect", "Experience-Focused Builder"],
          ctaLabel: parsedHero.ctaLabel || "EXPLORE EXPERIENCE",
          highlightGradients: parsedHero.highlightGradients || "Frontend Systems, Creative Engineering, Visual Interaction",
          ambientGlow: parsedHero.ambientGlow || "#ec4899",
          ambientIntensity: parsedHero.ambientIntensity || 80,
          heroBadge: parsedHero.heroBadge || {
            text: "FULL-STACK WEB DEVELOPER",
            icon: "Sparkles",
            glowStyle: "Holographic"
          },
          heroTitleLines: parsedHero.heroTitleLines || [
            { text: "Building Digital Products", isGradient: true, highlightWords: "Digital Products" },
            { text: "Architecting Clean UI Systems", isGradient: false, highlightWords: "" }
          ],
          ctaButton1: parsedHero.ctaButton1 || {
            text: "EXPLORE EXPERIENCE",
            link: "#projects",
            style: "solid-pink"
          },
          ctaButton2: parsedHero.ctaButton2 || {
            text: "INSPECT RESUME",
            link: "#resume",
            style: "outline-neon"
          },
          heroAlignment: parsedHero.heroAlignment || "center",
          heroHeight: parsedHero.heroHeight || "fullscreen",
          storyBlocks: (() => {
            const sb = (parsedHero.storyBlocks && parsedHero.storyBlocks.sections) ? { ...parsedHero.storyBlocks } : {
              sections: {
                skills: { enabled: true, title: "SYSTEM CAPABILITIES", subtitle: "Continuous learning and robust architectures", intro: "Explore technologies and backend capabilities." },
                projects: { enabled: true, title: "PORTFOLIO PROJECTS", subtitle: "High impact production assets", intro: "A showcase of responsive and robust custom apps." },
                experience: { enabled: true, title: "PROFESSIONAL EXPERIENCE", subtitle: "Journey through tech", intro: "Summary of roles and contributions." },
                certificates: { enabled: true, title: "VERIFIED CREDENTIALS", subtitle: "Achievements & Accolades", intro: "Verified academic and tech milestones." },
                contact: { enabled: true, title: "INBOUND COLLABORATION", subtitle: "Let's connect", intro: "Submit a message below or contact direct." }
              },
              sectionOrder: ["skills", "projects", "experience", "certificates", "contact"],
              spacingPreset: "balanced",
              headline: parsedHero.storyBlocks?.headline || "Crafting High-Fidelity Interactive Spaces",
              subheadline: parsedHero.storyBlocks?.subheadline || "Bridging visual architecture and visual interactions",
              emotionalHook: parsedHero.storyBlocks?.emotionalHook || "Every pixel tells a story, every micro-interaction shapes an emotion.",
              designPhilosophy: parsedHero.storyBlocks?.designPhilosophy || "Form does not just follow function; it celebrates visual delight.",
              engineeringPhilosophy: parsedHero.storyBlocks?.engineeringPhilosophy || "Performant, hardware-accelerated animations backed by clean architecture."
            };
            
            // Ensure experience is present if sections exists in the parsed layout (Self-correction)
            if (sb.sections && !sb.sections.experience) {
              sb.sections.experience = { enabled: true, title: "PROFESSIONAL EXPERIENCE", subtitle: "Journey through tech", intro: "Summary of roles and contributions." };
            }
            if (sb.sectionOrder && !sb.sectionOrder.includes("experience")) {
              const pIdx = sb.sectionOrder.indexOf("projects");
              if (pIdx !== -1) {
                sb.sectionOrder.splice(pIdx + 1, 0, "experience");
              } else {
                sb.sectionOrder.push("experience");
              }
            }
            return sb;
          })()
        };

        const ksStats = parsedStats.length > 0 ? parsedStats.map((card: any) => ({
          ...card,
          orbitalSpeed: card.orbitalSpeed || 8,
          glowColor: card.glowColor || "#ec4899",
          position: card.position || "orbit-1"
        })) : [
          { title: "Research", subtitle: "User empathy mapping, performance profiling, and tech design", icon: "Globe", color: "purple", visible: true, orbitalSpeed: 12, glowColor: "#a855f7", position: "orbit-1" },
          { title: "UI/UX", subtitle: "High-fidelity mockups, premium micro-animations, glass presets", icon: "Sparkles", color: "cyan", visible: true, orbitalSpeed: 8, glowColor: "#06b6d4", position: "orbit-2" },
          { title: "Frontend", subtitle: "Next.js, Tailwind CSS, hardware accelerated animation structures", icon: "Cpu", color: "purple", visible: true, orbitalSpeed: 6, glowColor: "#ec4899", position: "orbit-3" },
          { title: "Backend APIs", subtitle: "Safe Prisma/PostgreSQL telemetry and robust JWT session security", icon: "Database", color: "green", visible: true, orbitalSpeed: 10, glowColor: "#10b981", position: "orbit-4" },
          { title: "Optimization", subtitle: "FPS auditing, asset compression, caching strategies", icon: "Zap", color: "amber", visible: true, orbitalSpeed: 7, glowColor: "#f59e0b", position: "orbit-1" },
          { title: "Deployment", subtitle: "Vercel edge functions, dynamic DNS mapping, SSL tunnels", icon: "Layers", color: "cyan", visible: true, orbitalSpeed: 14, glowColor: "#06b6d4", position: "orbit-2" }
        ];

        const ksExpertise = parsedExpertise.length > 0 ? parsedExpertise : [
          { title: "Frontend Systems", percentage: 98, glowIntensity: 90, graphStyle: "Neon Pulse Wave", visible: true },
          { title: "Creative Engineering", percentage: 95, glowIntensity: 85, graphStyle: "Quantum Grid Bar", visible: true },
          { title: "Animation Systems", percentage: 92, glowIntensity: 95, graphStyle: "Radial Glow Arc", visible: true },
          { title: "Backend APIs", percentage: 85, glowIntensity: 70, graphStyle: "Neon Pulse Wave", visible: true }
        ];

        const loadedTheme = parsedTheme || {};
        const ksTheme = {
          ...loadedTheme,
          visualIdentity: {
            accentColor: "#ec4899",
            glowIntensity: 75,
            glassBlur: 20,
            gradientPreset: "Fuchsia Twilight",
            typographyStyle: "Outfit",
            floatingParticles: { enabled: true, count: 40, speed: 1.5 },
            ...loadedTheme.visualIdentity,
            videoBackground: loadedTheme.visualIdentity?.videoBackground || {
              videoUrl: loadedTheme.cinematicMedia?.mediaUrl || "/uploads/portfolio/ks/cinematic-bg.mp4",
              mobileVideoUrl: ""
            },
            overlayControl: loadedTheme.visualIdentity?.overlayControl || {
              darkness: loadedTheme.cinematicMedia?.overlayDarkness || 80,
              blur: loadedTheme.cinematicMedia?.motionBlur || 10,
              gradientOpacity: loadedTheme.cinematicMedia?.opacity || 90
            },
            textGradients: loadedTheme.visualIdentity?.textGradients || {
              primaryGradient: loadedTheme.visualIdentity?.gradientPreset || "from-fuchsia-600 via-pink-600 to-rose-700",
              hoverGlow: loadedTheme.visualIdentity?.accentColor || "#ec4899",
              accentColor: loadedTheme.visualIdentity?.accentColor || "#ec4899"
            },
            typography: loadedTheme.visualIdentity?.typography || {
              titleSize: "Cinematic",
              subtitleWidth: "Balanced",
              spacing: 50,
              mobileScale: 100
            },
            glowEffects: loadedTheme.visualIdentity?.glowEffects || {
              enabled: true,
              intensity: loadedTheme.visualIdentity?.glowIntensity || 75,
              neonRadius: 40
            }
          },
          motionSystem: {
            transitionSpeed: 0.4,
            scrollInterpolation: 50,
            hoverBehavior: "Magnetic Pull",
            cardRevealStyle: "Spring Rise",
            mouseTracking: true,
            backgroundBlurMotion: true,
            ...loadedTheme.motionSystem,
            parallaxControls: loadedTheme.motionSystem?.parallaxControls || {
              heroMovement: 50,
              nodeFloatingSpeed: 50,
              blurTransition: 50
            },
            buttonAnimations: loadedTheme.motionSystem?.buttonAnimations || {
              hoverScale: 110,
              magneticEffect: true,
              glowPulse: true
            },
            scrollEffects: loadedTheme.motionSystem?.scrollEffects || {
              fade: true,
              blurReveal: true,
              gradientShift: true
            }
          },
          cinematicMedia: loadedTheme.cinematicMedia || {
            mediaType: "video",
            mediaUrl: "/uploads/portfolio/ks/cinematic-bg.mp4",
            overlayDarkness: 80,
            motionBlur: 10,
            opacity: 90,
            focusPoint: "Center"
          },
          resumeControl: loadedTheme.resumeControl || {
            publicPdfUrl: "",
            directDownload: true,
            openModalPreview: false,
            animatedIntro: "Inspect my dynamic resume containing over 4 years of visual engineering expertise.",
            customCta: "INSPECT CURRICULUM VITAE"
          },
          responsiveControls: loadedTheme.responsiveControls || {
            mobileHeroOffset: 20,
            fontScaling: 100,
            mobileBlurReduction: true,
            animationDisable: false
          }
        };

        setHeroSection(ksHero);
        setStatsCards(ksStats);
        setExpertiseCards(ksExpertise);
        setThemeSection(ksTheme);
      } else {
        // SD or Mahi fallback loading
        setHeroSection(parsedHero);
        setStatsCards(parsedStats);
        setExpertiseCards(parsedExpertise);
        if (parsedTheme) {
          setThemeSection(parsedTheme);
        }
      }

      setTechStack(profile.techStack || []);
    }
  }, [profile, activePortfolio]);

  // Timers for rotating hero texts in preview
  useEffect(() => {
    const rolesCount = isKS ? (heroSection.rotatingLines || []).length || 4 : 4;
    if (rolesCount === 0) return;
    const interval = setInterval(() => {
      setPreviewRoleIndex((prev) => (prev + 1) % rolesCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [isKS, heroSection.rotatingLines]);

  // Timers for skill visuals
  useEffect(() => {
    const interval = setInterval(() => {
      if (expertiseCards.length > 0) {
        setPreviewExpIndex((prev) => (prev + 1) % expertiseCards.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [expertiseCards]);

  // Upload crop handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result as string);
        setZoom(1.1);
        setCropPos({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const performUploadAndCrop = async () => {
    if (!fileUrl) return;
    setUploadingImage(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        const image = new Image();
        image.src = fileUrl;
        image.crossOrigin = "anonymous";
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const width = 640;
          const height = 800;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas 2D context not available"));
            return;
          }

          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.scale(zoom, zoom);
          const scaleFactor = 640 / 200;
          ctx.translate(cropPos.x * scaleFactor / zoom, cropPos.y * scaleFactor / zoom);

          const imgAspect = image.width / image.height;
          const cropAspect = width / height;
          let drawW = width;
          let drawH = height;
          if (imgAspect > cropAspect) {
            drawH = height;
            drawW = height * imgAspect;
          } else {
            drawW = width;
            drawH = width / imgAspect;
          }

          ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas toBlob failed"));
          }, "image/webp", 0.9);
        };
        image.onerror = (err) => reject(err);
      });

      const formData = new FormData();
      formData.append('heroImage', blob, 'hero-image.webp');

      const res = await api.post('/portfolio/profile/hero-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setHeroSection((prev: any) => ({
        ...prev,
        image: res.data.data.imageUrl
      }));
      setFileUrl(null);
      setSuccess("Portrait cropped and updated!");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Cropping failed");
    } finally {
      setUploadingImage(false);
    }
  };

  // Tag system helpers (For SD)
  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      if (techStack.length >= 15) {
        setError("Max limit of 15 technologies reached");
        return;
      }
      setTechStack(prev => [...prev, trimmed]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTechStack(prev => prev.filter(t => t !== tag));
  };

  const moveTag = (idx: number, direction: 'left' | 'right') => {
    const nextIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= techStack.length) return;
    const copy = [...techStack];
    const temp = copy[idx];
    copy[idx] = copy[nextIdx];
    copy[nextIdx] = temp;
    setTechStack(copy);
  };

  // Rotating lines helper (For KS)
  const addRotatingLine = () => {
    const trimmed = newRotatingLine.trim();
    if (trimmed) {
      setHeroSection((prev: any) => ({
        ...prev,
        rotatingLines: [...(prev.rotatingLines || []), trimmed]
      }));
      setNewRotatingLine('');
    }
  };

  const removeRotatingLine = (idx: number) => {
    setHeroSection((prev: any) => ({
      ...prev,
      rotatingLines: (prev.rotatingLines || []).filter((_: any, i: number) => i !== idx)
    }));
  };

  // Dynamic Title lines helpers (For KS Redesign)
  const addHeroTitleLine = () => {
    setHeroSection((prev: any) => ({
      ...prev,
      heroTitleLines: [...(prev.heroTitleLines || []), { text: "New Title Line", isGradient: false, highlightWords: "" }]
    }));
  };

  const removeHeroTitleLine = (idx: number) => {
    setHeroSection((prev: any) => ({
      ...prev,
      heroTitleLines: (prev.heroTitleLines || []).filter((_: any, i: number) => i !== idx)
    }));
  };

  const moveHeroTitleLine = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const lines = heroSection.heroTitleLines || [];
    if (targetIdx < 0 || targetIdx >= lines.length) return;
    const copy = [...lines];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setHeroSection((prev: any) => ({ ...prev, heroTitleLines: copy }));
  };

  const updateHeroTitleLine = (idx: number, field: string, val: any) => {
    const lines = heroSection.heroTitleLines || [];
    const copy = lines.map((line: any, i: number) => {
      if (i === idx) return { ...line, [field]: val };
      return line;
    });
    setHeroSection((prev: any) => ({ ...prev, heroTitleLines: copy }));
  };

  // Theme section updates (For KS)
  const updateVisualIdentity = (field: string, val: any) => {
    setThemeSection((prev: any) => ({
      ...prev,
      visualIdentity: {
        ...(prev.visualIdentity || {}),
        [field]: val
      }
    }));
  };

  const updateVisualIdentityNested = (category: string, field: string, val: any) => {
    setThemeSection((prev: any) => {
      const visualIdentity = prev.visualIdentity || {};
      const subCategory = visualIdentity[category] || {};
      return {
        ...prev,
        visualIdentity: {
          ...visualIdentity,
          [category]: {
            ...subCategory,
            [field]: val
          }
        }
      };
    });
  };

  const updateMotionSystem = (field: string, val: any) => {
    setThemeSection((prev: any) => ({
      ...prev,
      motionSystem: {
        ...(prev.motionSystem || {}),
        [field]: val
      }
    }));
  };

  const updateMotionSystemNested = (category: string, field: string, val: any) => {
    setThemeSection((prev: any) => {
      const motionSystem = prev.motionSystem || {};
      const subCategory = motionSystem[category] || {};
      return {
        ...prev,
        motionSystem: {
          ...motionSystem,
          [category]: {
            ...subCategory,
            [field]: val
          }
        }
      };
    });
  };

  const updateCinematicMedia = (field: string, val: any) => {
    setThemeSection((prev: any) => ({
      ...prev,
      cinematicMedia: {
        ...(prev.cinematicMedia || {}),
        [field]: val
      }
    }));
  };

  const updateResumeControl = (field: string, val: any) => {
    setThemeSection((prev: any) => ({
      ...prev,
      resumeControl: {
        ...(prev.resumeControl || {}),
        [field]: val
      }
    }));
  };

  const updateResponsiveControls = (field: string, val: any) => {
    setThemeSection((prev: any) => ({
      ...prev,
      responsiveControls: {
        ...(prev.responsiveControls || {}),
        [field]: val
      }
    }));
  };

  // Homepage Section Manager helpers (For KS Section Manager)
  const moveSectionOrder = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const order = heroSection.storyBlocks?.sectionOrder || ["skills", "projects", "experience", "certificates", "contact"];
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const copy = [...order];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setHeroSection((prev: any) => ({
      ...prev,
      storyBlocks: {
        ...(prev.storyBlocks || {}),
        sectionOrder: copy
      }
    }));
  };

  const toggleSection = (sectionKey: string) => {
    setHeroSection((prev: any) => {
      const storyBlocks = prev.storyBlocks || {};
      const sections = storyBlocks.sections || {};
      const targetSec = sections[sectionKey] || {};
      return {
        ...prev,
        storyBlocks: {
          ...storyBlocks,
          sections: {
            ...sections,
            [sectionKey]: {
              ...targetSec,
              enabled: !targetSec.enabled
            }
          }
        }
      };
    });
  };

  const updateSectionDetail = (sectionKey: string, field: string, val: any) => {
    setHeroSection((prev: any) => {
      const storyBlocks = prev.storyBlocks || {};
      const sections = storyBlocks.sections || {};
      const targetSec = sections[sectionKey] || {};
      return {
        ...prev,
        storyBlocks: {
          ...storyBlocks,
          sections: {
            ...sections,
            [sectionKey]: {
              ...targetSec,
              [field]: val
            }
          }
        }
      };
    });
  };

  const setSpacingPreset = (val: string) => {
    setHeroSection((prev: any) => ({
      ...prev,
      storyBlocks: {
        ...(prev.storyBlocks || {}),
        spacingPreset: val
      }
    }));
  };

  // Stats / Orbital nodes helpers (Shared database backend `statsCards`)
  const updateStatCard = (index: number, field: string, val: any) => {
    setStatsCards(prev => prev.map((card, i) => {
      if (i === index) return { ...card, [field]: val };
      return card;
    }));
  };

  const addStatCard = () => {
    if (statsCards.length >= 8) {
      setError(isKS ? "Max experience nodes reached" : "Max stats card limit reached");
      return;
    }
    const newCard = isKS ? {
      title: "New Node",
      subtitle: "Hover detail explanation text describing design logic",
      icon: "Cpu",
      color: "purple",
      visible: true,
      orbitalSpeed: 8,
      glowColor: "#ec4899"
    } : {
      value: "10+",
      title: "NEW STAT",
      subtitle: "Brief description",
      icon: "Layers",
      color: "purple",
      visible: true
    };
    setStatsCards(prev => [...prev, newCard]);
  };

  const deleteStatCard = (index: number) => {
    setStatsCards(prev => prev.filter((_, i) => i !== index));
  };

  const moveStatCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= statsCards.length) return;
    const copy = [...statsCards];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setStatsCards(copy);
  };

  // Expertise / Skills helpers (Shared database backend `expertiseCards`)
  const updateExpertiseCard = (index: number, field: string, val: any) => {
    setExpertiseCards(prev => prev.map((card, i) => {
      if (i === index) return { ...card, [field]: val };
      return card;
    }));
  };

  const addExpertiseCard = () => {
    if (expertiseCards.length >= 6) {
      setError("Max card limit reached");
      return;
    }
    const newCard = isKS ? {
      title: "New Skill Arc",
      percentage: 85,
      glowIntensity: 80,
      graphStyle: "Neon Pulse Wave",
      visible: true
    } : {
      label: "NEW SPECIALTY",
      title: "Core engineering title",
      description: "Describe what projects or tech stack are used here...",
      tags: ["REACT", "NODE", "SQL"],
      position: "center",
      opacity: 100,
      accentColor: "purple"
    };
    setExpertiseCards(prev => [...prev, newCard]);
  };

  const deleteExpertiseCard = (index: number) => {
    setExpertiseCards(prev => prev.filter((_, i) => i !== index));
  };

  const moveExpertiseCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= expertiseCards.length) return;
    const copy = [...expertiseCards];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setExpertiseCards(copy);
  };

  // Save core profile updates
  const saveAllChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/portfolio/profile', {
        headline,
        bio,
        github,
        linkedin,
        twitter,
        heroSection,
        techStack,
        statsCards,
        expertiseCards,
        themeSection
      });

      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await api.post('/portfolio/profile/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResumeFile(null);
      }

      setSuccess('Developer profile CMS saved successfully!');
      await fetchEverything();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update configurations.');
    } finally {
      setLoading(false);
    }
  };

  // Portrait drag hooks
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPos.x,
      y: e.clientY - cropPos.y
    });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCropPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Live preview falling back to defaults if properties are empty
  const previewTitle = heroSection.title || (isKS ? "Hi, I'm Khushaboo Saini" : "Hi, I'm Shashwat Dixit");
  const previewDescOne = isKS 
    ? heroSection.introParagraph || "I'm a creative frontend developer and UI/UX specialist who crafts highly interactive web applications."
    : heroSection.descOne || "I'm a full-stack developer specializing in scalable distributed architectures.";
  
  const previewSlug = activePortfolio;
  let defaultFolder = previewSlug === 'shashwat' ? 'sd' : (previewSlug === 'khushaboo' ? 'ks' : 'ms');
  const previewImg = heroSection.image 
    ? (heroSection.image.startsWith('http') ? heroSection.image : `http://localhost:5000${heroSection.image}`)
    : `/uploads/portfolio/${defaultFolder}/hero-image.webp`;

  const fallbackUrl = previewSlug === 'shashwat'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const previewTech = techStack.length > 0 ? techStack : ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL"];
  const previewStats = statsCards.filter(c => c.visible);

  // Custom KS tab renderer
  const renderKSTabs = () => {
    const tabs = [
      { id: 'landing', label: '1. Landing Experience', icon: LayoutTemplate },
      { id: 'visual-identity', label: '2. Visual Styling', icon: Sparkles },
      { id: 'motion-system', label: '3. Motion System', icon: Sliders },
      { id: 'story-blocks', label: '4. Section Manager', icon: FileText }
    ];

    return (
      <>
        {/* Mobile Tab Select Dropdown */}
        <div className="block md:hidden mb-6 relative animate-fade-in">
          <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-2">
            Select Editing Tab
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-white font-mono cursor-pointer appearance-none shadow-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            {tabs.map((t) => (
              <option key={t.id} value={t.id} className="bg-neutral-950 text-white py-2">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Horizontal Tabs */}
        <div className="hidden md:flex bg-neutral-900/60 border border-neutral-800 rounded-2xl p-1 shadow-inner overflow-x-auto gap-0.5 animate-fade-in scrollbar-none mb-6">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-xl text-[9px] font-mono font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isActive 
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)] font-black' 
                    : 'text-neutral-400 hover:text-white bg-transparent border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  };

  if (isKS) {
    return (
      <div className="min-h-[85vh] flex flex-col relative select-text text-left">
        {/* CSS for KS visual control panel */}
        <style>{`
          .coordinate-grid {
            background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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
        
        {/* Save/Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-4 sm:mb-6 relative z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg animate-pulse shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest leading-none heading-font">KS HOMEPAGE CONTROLLER</h1>
              <span className="text-[7px] sm:text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">DIRECT 1:1 VISUAL MIRROR EDITOR</span>
            </div>
          </div>
          
          <div className="w-full h-px bg-neutral-800/40 sm:hidden my-0.5" />
          
          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="xl:hidden w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-[9px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>
            <button
              onClick={saveAllChanges}
              disabled={loading}
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md shadow-pink-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Syncing..." : "SYNC LIVE"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Split Screen Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-start relative z-10">
          
          {/* ======================================================= */}
          {/* ============= LEFT SIDE: EDITABLE CONTROLS ============ */}
          {/* ======================================================= */}
          <div className="xl:col-span-7 space-y-4 sm:space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-none pb-12">
            
            {/* 1. HERO TYPOGRAPHY SYSTEM */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-pink-400" />
                  <span>Hero Typography</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Control cinematic headlines, highlighted gradients, and homepage messaging.
                </p>
              </div>

              {/* 1.1 HERO BADGE */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">1. HERO BADGE</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Badge Text</label>
                    <input
                      type="text"
                      placeholder="FULL-STACK WEB DEVELOPER"
                      value={heroSection.heroBadge?.text || ""}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        heroBadge: { ...(prev.heroBadge || {}), text: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs transition-all text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Icon Name (Lucide)</label>
                    <select
                      value={heroSection.heroBadge?.icon || "Sparkles"}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        heroBadge: { ...(prev.heroBadge || {}), icon: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs transition-all text-white font-mono cursor-pointer"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic.name} value={ic.name}>{ic.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Glow Style</label>
                    <select
                      value={heroSection.heroBadge?.glowStyle || "holographic-neon"}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        heroBadge: { ...(prev.heroBadge || {}), glowStyle: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs transition-all text-white font-mono cursor-pointer"
                    >
                      <option value="holographic-neon">Holographic Neon Glow</option>
                      <option value="solid-cyan">Solid Cyan Aura</option>
                      <option value="subtle-dim">Subtle Dim / Soft</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Border Style</label>
                    <select
                      value={heroSection.heroBadge?.borderStyle || "glow-pink"}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        heroBadge: { ...(prev.heroBadge || {}), borderStyle: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs transition-all text-white font-mono cursor-pointer"
                    >
                      <option value="glow-pink">Glowing Pink Border</option>
                      <option value="dashed-cyan">Dashed Cyan Border</option>
                      <option value="minimal">Minimal Thin White</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 1.2 MAIN TITLE LINES */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest">2. MAIN TITLE LINES (Rotating Deck)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentLines = heroSection.heroTitleLines || [];
                      setHeroSection((prev: any) => ({
                        ...prev,
                        heroTitleLines: [...currentLines, { text: "New Headline Line", gradient: true, fontStyle: "extrabold", colorPreset: "Fuchsia Twilight" }]
                      }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[8px] font-mono text-pink-400 hover:text-white cursor-pointer hover:border-pink-500/30 transition-all"
                  >
                    + Add New Line
                  </button>
                </div>

                <div className="space-y-3">
                  {(heroSection.heroTitleLines || []).map((line: any, idx: number) => (
                    <div key={idx} className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3">
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const lines = [...(heroSection.heroTitleLines || [])];
                            const temp = lines[idx];
                            lines[idx] = lines[idx - 1];
                            lines[idx - 1] = temp;
                            setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                          }}
                          className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer border-none text-[8px]"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === (heroSection.heroTitleLines || []).length - 1}
                          onClick={() => {
                            const lines = [...(heroSection.heroTitleLines || [])];
                            const temp = lines[idx];
                            lines[idx] = lines[idx + 1];
                            lines[idx + 1] = temp;
                            setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                          }}
                          className="p-1 rounded bg-black text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer border-none text-[8px]"
                        >
                          ▼
                        </button>
                      </div>
                      
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <input
                          type="text"
                          value={line.text || ""}
                          onChange={(e) => {
                            const lines = [...(heroSection.heroTitleLines || [])];
                            lines[idx].text = e.target.value;
                            setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                          }}
                          className="w-full bg-black border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                        />
                        
                        <div className="flex flex-wrap gap-2.5">
                          <label className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={line.gradient ?? true}
                              onChange={(e) => {
                                const lines = [...(heroSection.heroTitleLines || [])];
                                lines[idx].gradient = e.target.checked;
                                setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                              }}
                              className="accent-pink-500"
                            />
                            <span>Gradient</span>
                          </label>

                          <select
                            value={line.colorPreset || "Fuchsia Twilight"}
                            onChange={(e) => {
                              const lines = [...(heroSection.heroTitleLines || [])];
                              lines[idx].colorPreset = e.target.value;
                              setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                            }}
                            className="bg-black border border-neutral-800 text-[8px] font-mono px-2 py-0.5 rounded text-neutral-400 focus:outline-none cursor-pointer"
                          >
                            {KS_GRADIENT_PRESETS.map(gp => (
                              <option key={gp.name} value={gp.name}>{gp.name}</option>
                            ))}
                          </select>

                          <select
                            value={line.fontStyle || "extrabold"}
                            onChange={(e) => {
                              const lines = [...(heroSection.heroTitleLines || [])];
                              lines[idx].fontStyle = e.target.value;
                              setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                            }}
                            className="bg-black border border-neutral-800 text-[8px] font-mono px-2 py-0.5 rounded text-neutral-400 focus:outline-none cursor-pointer"
                          >
                            <option value="light">Light</option>
                            <option value="normal">Normal</option>
                            <option value="semibold">Semibold</option>
                            <option value="bold">Bold</option>
                            <option value="extrabold">Extrabold</option>
                            <option value="black">Black</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              const lines = (heroSection.heroTitleLines || []).filter((_: any, i: number) => i !== idx);
                              setHeroSection((prev: any) => ({ ...prev, heroTitleLines: lines }));
                            }}
                            className="text-[8px] font-mono text-red-500 hover:text-red-400 cursor-pointer bg-transparent border-none ml-auto"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(heroSection.heroTitleLines || []).length === 0 && (
                    <div className="p-6 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500 font-mono">
                      No Title Lines Deck added yet. Click "+ Add New Line" to begin!
                    </div>
                  )}
                </div>
              </div>

              {/* 1.3 DESCRIPTION TEXT */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">3. DESCRIPTION TEXT</span>
                
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    placeholder="Enter homepage narrative biography..."
                    value={heroSection.introParagraph || ""}
                    onChange={(e) => setHeroSection((prev: any) => ({ ...prev, introParagraph: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-4 py-3 rounded-xl text-xs transition-all text-white font-sans leading-relaxed"
                  />
                  
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-neutral-500">
                    <span>CHARACTERS: {(heroSection.introParagraph || "").length}</span>
                    <div className="flex items-center gap-2">
                      <span>WIDTH CONTROL:</span>
                      <select
                        value={heroSection.contentWidth || "max-w-xl"}
                        onChange={(e) => setHeroSection((prev: any) => ({ ...prev, contentWidth: e.target.value }))}
                        className="bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-neutral-400 focus:outline-none cursor-pointer"
                      >
                        <option value="max-w-md">Slim (Max Width MD)</option>
                        <option value="max-w-xl">Balanced (Max Width XL)</option>
                        <option value="max-w-3xl">Extended (Max Width 3XL)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. CTA SYSTEM */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-pink-400" />
                  <span>ACTION BUTTON CONTROLS</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure target links, styles, and neon triggers for primary and secondary actions.
                </p>
              </div>

              {/* BUTTON 1 */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">BUTTON 1</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Button Text</label>
                    <input
                      type="text"
                      value={heroSection.ctaButton1?.text || ""}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton1: { ...(prev.ctaButton1 || {}), text: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Route Link / Tab</label>
                    <input
                      type="text"
                      value={heroSection.ctaButton1?.link || ""}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton1: { ...(prev.ctaButton1 || {}), link: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Icon Component</label>
                    <select
                      value={heroSection.ctaButton1?.icon || "Play"}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton1: { ...(prev.ctaButton1 || {}), icon: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="Play">Play / Action</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="ArrowRight">Arrow Right</option>
                      <option value="Code">Code Bracket</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Glow Preset</label>
                    <select
                      value={heroSection.ctaButton1?.style || "solid-pink"}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton1: { ...(prev.ctaButton1 || {}), style: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="solid-pink">Solid Fuchsia Sunset</option>
                      <option value="solid-cyan">Solid Cyber Cyan</option>
                      <option value="outline-neon">Outline Neon Border</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BUTTON 2 */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest block">BUTTON 2</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Button Text</label>
                    <input
                      type="text"
                      value={heroSection.ctaButton2?.text || ""}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton2: { ...(prev.ctaButton2 || {}), text: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Route Link / Tab</label>
                    <input
                      type="text"
                      value={heroSection.ctaButton2?.link || ""}
                      onChange={(e) => setHeroSection((prev: any) => ({
                        ...prev,
                        ctaButton2: { ...(prev.ctaButton2 || {}), link: e.target.value }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Glow Preset</label>
                  <select
                    value={heroSection.ctaButton2?.style || "outline-neon"}
                    onChange={(e) => setHeroSection((prev: any) => ({
                      ...prev,
                      ctaButton2: { ...(prev.ctaButton2 || {}), style: e.target.value }
                    }))}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                  >
                    <option value="solid-pink">Solid Fuchsia Sunset</option>
                    <option value="solid-cyan">Solid Cyber Cyan</option>
                    <option value="outline-neon">Outline Neon Border</option>
                    <option value="minimal-text">Minimal Translucent Text</option>
                  </select>
                </div>
              </div>

            </div>

            {/* 3. FLOATING EXPERTISE SYSTEM (EXPERTISE NODE MATRIX) */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-400" />
                  <span>Expertise Node Matrix</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure coordinate positions, orbit speeds, and thought lines for the concentric motion path nodes.
                </p>
              </div>

              {/* LIST OF NODES */}
              <div className="space-y-5 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-bold text-pink-400 uppercase tracking-widest">EDITABLE ORBITAL NODES</span>
                  <button
                    type="button"
                    onClick={addStatCard}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[8px] font-mono text-pink-400 hover:text-white cursor-pointer hover:border-pink-500/30 transition-all"
                  >
                    + Add New Node
                  </button>
                </div>

                <div className="space-y-4">
                  {statsCards.map((node: any, idx: number) => (
                    <div key={node.id || idx} className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl space-y-4">
                      
                      {/* Node Header Row */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-extrabold text-neutral-400">NODE 0{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded bg-pink-500/10 text-[7.5px] font-mono text-pink-400 font-bold uppercase">{node.title || "Untiled"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-[8px] font-mono text-neutral-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={node.visible ?? true}
                              onChange={(e) => updateStatCard(idx, "visible", e.target.checked)}
                              className="accent-pink-500"
                            />
                            <span>Active</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => deleteStatCard(idx)}
                            className="text-[8px] font-mono text-red-500 hover:text-red-400 bg-transparent border-none cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Main Node Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Node Title</label>
                          <input
                            type="text"
                            value={node.title || ""}
                            onChange={(e) => updateStatCard(idx, "title", e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Node Icon</label>
                          <select
                            value={node.icon || "Globe"}
                            onChange={(e) => updateStatCard(idx, "icon", e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono cursor-pointer"
                          >
                            {AVAILABLE_ICONS.map(ic => (
                              <option key={ic.name} value={ic.name}>{ic.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Thought tooltip message */}
                      <div className="space-y-1.5">
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Hover Tooltip Message</label>
                        <input
                          type="text"
                          placeholder="What details display on hover..."
                          value={node.subtitle || node.value || ""}
                          onChange={(e) => {
                            updateStatCard(idx, "subtitle", e.target.value);
                            updateStatCard(idx, "value", e.target.value);
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white"
                        />
                      </div>

                      {/* Positioning coordinate parameters (X & Y spacing ratios) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                            <span>Grid X ({node.xCoord ?? 50}%)</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={node.xCoord ?? 50}
                            onChange={(e) => updateStatCard(idx, "xCoord", parseInt(e.target.value))}
                            className="w-full custom-range cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                            <span>Grid Y ({node.yCoord ?? 50}%)</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={node.yCoord ?? 50}
                            onChange={(e) => updateStatCard(idx, "yCoord", parseInt(e.target.value))}
                            className="w-full custom-range cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Orbital speed & glow color preset */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                            <span>ORBITAL SPIN DAMPING</span>
                            <span className="text-pink-400 font-bold">{node.orbitalSpeed ?? 8}s</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="30"
                            value={node.orbitalSpeed ?? 8}
                            onChange={(e) => updateStatCard(idx, "orbitalSpeed", parseInt(e.target.value))}
                            className="w-full custom-range cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Glow Accent Color</label>
                          <select
                            value={node.color || "purple"}
                            onChange={(e) => {
                              updateStatCard(idx, "color", e.target.value);
                              const col = AVAILABLE_COLORS.find(c => c.name === e.target.value);
                              if (col) updateStatCard(idx, "glowColor", col.glow);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-pink-500/20 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono cursor-pointer"
                          >
                            {AVAILABLE_COLORS.map(c => (
                              <option key={c.name} value={c.name}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}

                  {statsCards.length === 0 && (
                    <div className="p-8 border border-dashed border-neutral-850 rounded-2xl text-center text-xs text-neutral-500 font-mono">
                      No orbital nodes added yet. Click "+ Add New Node" to begin!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 4. BACKGROUND SYSTEM */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span>Background Experience</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure full-bleed loop paths, blur indices, darkness modifiers, and cinematic vignette levels.
                </p>
              </div>

              {/* VIDEO INPUTS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Desktop Background Video URL</label>
                    <input
                      type="text"
                      value={themeSection.visualIdentity?.videoBackground?.videoUrl || ""}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          videoBackground: { ...(prev.visualIdentity?.videoBackground || {}), videoUrl: e.target.value }
                        }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Mobile Video Loop URL</label>
                    <input
                      type="text"
                      value={themeSection.visualIdentity?.videoBackground?.mobileVideoUrl || ""}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          videoBackground: { ...(prev.visualIdentity?.videoBackground || {}), mobileVideoUrl: e.target.value }
                        }
                      }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* OVERLAYS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>OVERLAY DARKNESS</span>
                      <span className="text-pink-400 font-bold">{themeSection.visualIdentity?.overlayControl?.darkness ?? 75}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={themeSection.visualIdentity?.overlayControl?.darkness ?? 75}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          overlayControl: { ...(prev.visualIdentity?.overlayControl || {}), darkness: parseInt(e.target.value) }
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>AMBIENT BLUR AMOUNT</span>
                      <span className="text-pink-400 font-bold">{themeSection.visualIdentity?.overlayControl?.blur ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={themeSection.visualIdentity?.overlayControl?.blur ?? 0}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          overlayControl: { ...(prev.visualIdentity?.overlayControl || {}), blur: parseInt(e.target.value) }
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>CINEMATIC VIGNETTE INTENSITY</span>
                      <span className="text-pink-400 font-bold">{themeSection.visualIdentity?.overlayControl?.vignette ?? 80}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={themeSection.visualIdentity?.overlayControl?.vignette ?? 80}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          overlayControl: { ...(prev.visualIdentity?.overlayControl || {}), vignette: parseInt(e.target.value) }
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* 5. TYPOGRAPHY ENGINE */}
            <div className="bg-neutral-950/70 border border-neutral-900 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/35 to-transparent"></div>
              
              <div className="space-y-1">
                <h3 className="heading-font font-black text-white text-xs tracking-widest flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-pink-400" />
                  <span>Typography Engine</span>
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wide">
                  Configure line heights, dynamic text ratios, and content spacing.
                </p>
              </div>

              {/* SLIDERS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>HERO FONT SIZE</span>
                      <span className="text-pink-400 font-bold">{themeSection.visualIdentity?.heroFontSize ?? 80}px</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      value={themeSection.visualIdentity?.heroFontSize ?? 80}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          heroFontSize: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>MOBILE TYPOGRAPHY SCALING</span>
                      <span className="text-pink-400 font-bold">{(themeSection.visualIdentity?.mobileScale ?? 65) / 100}x</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="90"
                      value={themeSection.visualIdentity?.mobileScale ?? 65}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          mobileScale: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>LINE HEIGHT SPACING</span>
                      <span className="text-pink-400 font-bold">{(themeSection.visualIdentity?.lineSpacing ?? 110) / 100}</span>
                    </div>
                    <input
                      type="range"
                      min="95"
                      max="140"
                      value={themeSection.visualIdentity?.lineSpacing ?? 110}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          lineSpacing: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500">
                      <span>GRADIENT CONTRAST INTENSITY</span>
                      <span className="text-pink-400 font-bold">{themeSection.visualIdentity?.gradientIntensity ?? 90}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={themeSection.visualIdentity?.gradientIntensity ?? 90}
                      onChange={(e) => setThemeSection((prev: any) => ({
                        ...prev,
                        visualIdentity: {
                          ...(prev.visualIdentity || {}),
                          gradientIntensity: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full custom-range cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Hero Section Alignment</label>
                    <select
                      value={heroSection.heroAlignment || "center"}
                      onChange={(e) => setHeroSection((prev: any) => ({ ...prev, heroAlignment: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="center">Center-Aligned Grid</option>
                      <option value="left">Left-Aligned Split</option>
                      <option value="cinematic-center">Cinematic Center Frame</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">Hero Canvas Height</label>
                    <select
                      value={heroSection.heroHeight || "fullscreen"}
                      onChange={(e) => setHeroSection((prev: any) => ({ ...prev, heroHeight: e.target.value }))}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-pink-500/30 focus:outline-none px-3.5 py-2.5 rounded-xl text-xs text-white font-mono cursor-pointer"
                    >
                      <option value="70vh">Comfortable (70vh Height)</option>
                      <option value="80vh">Aesthetic (80vh Height)</option>
                      <option value="fullscreen">Cinematic Fullscreen (100vh)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================= */}
          {/* ============= RIGHT SIDE: REALTIME PREVIEW ============ */}
          {/* ======================================================= */}
          <div className={`xl:col-span-5 h-[80vh] sticky top-0 rounded-3xl border border-neutral-900 bg-black overflow-hidden flex flex-col justify-between shadow-2xl relative select-none transition-all duration-300 ${showPreviewMobile ? 'flex' : 'hidden xl:flex'}`}>
            
            {/* Realtime Video Background Simulation */}
            {(() => {
              const rawVideo = themeSection.visualIdentity?.videoBackground?.videoUrl || "/khushboo-trim.mp4";
              const actualVideoUrl = rawVideo.startsWith('/uploads') ? `http://localhost:5000${rawVideo}` : rawVideo;
              const overlayDarkness = themeSection.visualIdentity?.overlayControl?.darkness ?? 75;
              const overlayBlur = themeSection.visualIdentity?.overlayControl?.blur ?? 0;
              const vignetteIntensity = themeSection.visualIdentity?.overlayControl?.vignette ?? 80;

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
                  {/* Cinematic layered overlay for better text legibility & exact darkness mapping */}
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

            {/* Ambient shader backings */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-[70px] pointer-events-none z-10" />
            <div className="absolute bottom-[-100px] left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[70px] pointer-events-none z-10" />

            {/* Bounding retro crosshairs */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/10" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/10" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/10" />
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/10" />

            {/* Address Bar simulation */}
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

            {/* CANVAS WORKSPACE */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden z-10 text-center select-none">
              
              {/* Concentric Node Matrix Simulation (Floating nodes coordinate math!) */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden coordinate-grid">
                
                {/* Orbital nodes rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-white/[0.02]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed border-white/[0.02]" />
                
                {/* Dynamically positioned interactive nodes */}
                {statsCards.filter(c => c.visible).map((node, i) => {
                  const glowColor = node.glowColor || "#a855f7";
                  const x = node.xCoord ?? 50;
                  const y = node.yCoord ?? 50;
                  return (
                    <div 
                      key={node.id || i}
                      className="absolute w-8 h-8 rounded-full bg-neutral-950/80 border border-white/10 shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2 animate-pulse group cursor-default transition-all duration-300"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        borderColor: `${glowColor}30`,
                        boxShadow: `0 0 15px ${glowColor}20`
                      }}
                      title={node.title}
                    >
                      {React.createElement(getIconComponent(node.icon || "Globe"), {
                        className: "w-3.5 h-3.5",
                        style: { color: glowColor }
                      })}
                      
                      {/* Bouncing tooltip detail */}
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-black border border-neutral-800 text-[6.5px] text-neutral-300 px-1.5 py-0.5 rounded font-mono truncate max-w-[90px] shadow-2xl opacity-80 pointer-events-none select-none">
                        {node.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top Row: Empty Spacer */}
              <div />

              {/* Center Row: Typography Cinematic Text */}
              <div className="space-y-4 relative z-10 my-auto text-center w-full">
                
                {/* Badge */}
                {heroSection.heroBadge?.text && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-neutral-800 backdrop-blur-md shadow-md mx-auto">
                    {React.createElement(getIconComponent(heroSection.heroBadge.icon || "Sparkles"), {
                      className: "w-3 h-3 text-pink-400 animate-pulse"
                    })}
                    <span className="text-[7.5px] font-mono tracking-widest text-neutral-300 uppercase font-black">{heroSection.heroBadge.text}</span>
                  </div>
                )}

                {/* Rotating Title Deck Lines */}
                <div className="space-y-1.5 py-2">
                  {(heroSection.heroTitleLines || []).slice(0, 3).map((line: any, idx: number) => {
                    const preset = KS_GRADIENT_PRESETS.find(p => p.name === line.colorPreset) || KS_GRADIENT_PRESETS[0];
                    const gradientClass = line.gradient ? `bg-gradient-to-r ${preset.style} bg-clip-text text-transparent` : "text-white";
                    const fontClass = line.fontStyle === 'light' ? 'font-light' : (line.fontStyle === 'semibold' ? 'font-semibold' : (line.fontStyle === 'bold' ? 'font-bold' : (line.fontStyle === 'black' ? 'font-black' : 'font-extrabold')));
                    
                    return (
                      <h2 
                        key={idx}
                        className={`text-lg md:text-xl tracking-tight leading-none ${fontClass} ${gradientClass}`}
                      >
                        {line.text}
                      </h2>
                    );
                  })}

                  {(heroSection.heroTitleLines || []).length === 0 && (
                    <h2 className="text-xl font-extrabold text-neutral-600 font-mono animate-pulse">
                      Live Title Lines Area
                    </h2>
                  )}
                </div>

                {/* Bio paragraph description */}
                {heroSection.introParagraph && (
                  <p className="text-[9.5px] text-neutral-400 leading-relaxed font-light font-sans max-w-xs mx-auto text-center">
                    {heroSection.introParagraph}
                  </p>
                )}

                {/* CTAs Action Simulation */}
                <div className="flex justify-center gap-3 pt-3">
                  {heroSection.ctaButton1?.text && (
                    <div className="px-3.5 py-1.5 rounded-lg bg-pink-500 text-white font-extrabold text-[8px] uppercase tracking-widest shadow-md shadow-pink-500/20 flex items-center gap-1.5">
                      {React.createElement(getIconComponent(heroSection.ctaButton1.icon || "Play"), {
                        className: "w-2.5 h-2.5"
                      })}
                      <span>{heroSection.ctaButton1.text}</span>
                    </div>
                  )}

                  {heroSection.ctaButton2?.text && (
                    <div className="px-3 py-1.5 rounded-lg bg-black border border-neutral-850 text-neutral-300 font-bold text-[7.5px] uppercase tracking-widest">
                      <span>{heroSection.ctaButton2.text}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Row: Dynamic Rotator text block simulation */}
              <div className="relative z-10 pt-4 border-t border-white/[0.02]">
                <span className="text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                  <span>1:1 LIVE FRONTEND PREVIEW FRAME</span>
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative select-text">
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* LEFT SIDE: CMS CONFIGURATION FORMS (7 columns) */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Dynamic Multi-tenant Tabs navigation */}
        {isKS ? renderKSTabs() : (
          <>
            {/* Mobile Tab Select Dropdown */}
            <div className="block md:hidden mb-6 relative animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Select Editing Tab
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreviewMobile(!showPreviewMobile)}
                  className="px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreviewMobile ? "Hide Preview" : "Show Preview"}</span>
                </button>
              </div>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-card border border-border focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-xs text-foreground font-mono cursor-pointer appearance-none shadow-lg"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px'
                }}
              >
                {[
                  { id: 'hero', label: '1. Hero Section' },
                  { id: 'tech', label: '2. Tech Stack Strip' },
                  { id: 'stats', label: '3. Stats Cards' },
                  { id: 'expertise', label: '4. Core Expertise' }
                ].map((t) => (
                  <option key={t.id} value={t.id} className="bg-card text-foreground py-2">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Horizontal Tabs */}
            <div className="hidden md:flex bg-muted border border-border/80 rounded-xl p-1 shadow-inner overflow-x-auto gap-0.5 animate-fade-in scrollbar-none mb-6">
              {[
                { id: 'hero', label: '1. Hero Section' },
                { id: 'tech', label: '2. Tech Stack Strip' },
                { id: 'stats', label: '3. Stats Cards' },
                { id: 'expertise', label: '4. Core Expertise' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 rounded-lg text-[10px] font-mono font-black tracking-widest uppercase transition-all shrink-0 cursor-pointer ${
                    activeTab === t.id 
                      ? 'bg-primary/10 border border-primary/45 text-primary' 
                      : 'text-muted-foreground hover:text-foreground bg-transparent border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* EDITOR PANELS */}
        <form onSubmit={saveAllChanges} className="space-y-3.5 md:space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 pb-32 md:pb-8 space-y-3.5 md:space-y-6 shadow-xl relative">
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${isKS ? 'via-pink-500/40' : 'via-primary/20'} to-transparent`}></div>

            {/* ========================================================================= */}
            {/* ======================= ORIGINAL SD SECTION EDITOR ====================== */}
            {/* ========================================================================= */}
            
            {!isKS && activeTab === 'hero' && (
              <div className="space-y-3.5 md:space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Hero Section Content</h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">Configure heading titles, biography paragraphs, and crop uploads.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Main Heading Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Hi, I'm Shashwat Dixit"
                    value={heroSection.title}
                    onChange={(e) => setHeroSection((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-background border border-border focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-foreground font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Biography Paragraph 1</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your primary development role..."
                      value={heroSection.descOne}
                      onChange={(e) => setHeroSection((prev: any) => ({ ...prev, descOne: e.target.value }))}
                      className="w-full bg-background border border-border focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-foreground font-sans font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Biography Paragraph 2</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your design and engineering philosophies..."
                      value={heroSection.descTwo}
                      onChange={(e) => setHeroSection((prev: any) => ({ ...prev, descTwo: e.target.value }))}
                      className="w-full bg-background border border-border focus:border-primary/50 focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-foreground font-sans font-normal"
                    />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Developer Portrait Image</label>
                  {fileUrl ? (
                    <div className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col items-center gap-4">
                      <p className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest flex items-center gap-1.5 animate-pulse">
                        <Crop className="w-3.5 h-3.5" /> Drag image to adjust focus, then slide zoom
                      </p>
                      <div 
                        className="w-[200px] h-[250px] border border-border rounded-2xl overflow-hidden relative bg-black select-none cursor-move"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                      >
                        <img
                          ref={imageRef}
                          src={fileUrl}
                          alt="Crop Source"
                          draggable={false}
                          className="absolute pointer-events-none origin-center"
                          style={{
                            transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${zoom})`,
                            left: '50%',
                            top: '50%',
                            marginLeft: imageRef.current ? -imageRef.current.naturalWidth / 2 : 0,
                            marginTop: imageRef.current ? -imageRef.current.naturalHeight / 2 : 0
                          }}
                        />
                        <div className="absolute inset-0 border-[2px] border-dashed border-primary/40 pointer-events-none rounded-2xl"></div>
                      </div>
                      <div className="w-full max-w-[320px] flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-mono text-muted-foreground">1.0x</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">3.0x</span>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setFileUrl(null)}
                          className="px-4 py-2 border border-border bg-background hover:bg-muted text-muted-foreground rounded-xl text-xs font-mono font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={performUploadAndCrop}
                          className="px-5 py-2 bg-primary/20 border border-primary/60 text-primary hover:bg-primary/30 rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
                        >
                          {uploadingImage ? 'Cropping...' : <><Check className="w-3.5 h-3.5" /> Apply & Save Crop</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1 flex justify-center">
                        <div className="w-[120px] h-[150px] border border-border rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
                          <img 
                            src={previewImg} 
                            alt="Current portrait" 
                            className="w-full h-full object-cover grayscale brightness-90"
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="relative border border-dashed border-border hover:border-muted-foreground/30 bg-muted/30 rounded-xl px-6 py-6 text-center flex flex-col items-center justify-center transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-6 h-6 text-muted-foreground/80 mb-2" />
                          <span className="text-xs text-foreground font-semibold mb-1">Drag & Drop portrait image</span>
                          <span className="text-[9px] text-muted-foreground font-mono">Supports PNG, JPG, or WEBP. Max size 5MB.</span>
                        </div>
                        {heroSection.image && (
                          <button
                            type="button"
                            onClick={() => setHeroSection((prev: any) => ({ ...prev, image: '' }))}
                            className="text-[10px] font-mono text-red-500 hover:text-red-400 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove image (Fallback to defaults)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Metadata & Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Short Subtitle (Headline)</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full bg-background border border-border focus:border-primary/50 focus:outline-none px-4 py-2.5 rounded-xl text-sm transition-all text-foreground font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Professional Resume (PDF)</label>
                      <div className="relative border border-dashed border-border hover:border-muted-foreground/30 bg-muted/30 rounded-xl px-4 py-2 text-center flex flex-col items-center justify-center transition-all h-[42px]">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">
                            {resumeFile ? resumeFile.name : profile?.resumeUrl ? '✅ Resume Attached' : 'Upload PDF'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isKS && activeTab === 'tech' && (
              <div className="space-y-3.5 md:space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Tech Stack strip</h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">Add, delete, and reorder technology tags. Max limit 15 tags.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 bg-background border border-border focus:border-primary/50 focus:outline-none px-4 py-2.5 rounded-xl text-sm transition-all text-foreground font-mono"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="bg-muted/30 rounded-2xl p-6 border border-border min-h-[160px] flex flex-wrap gap-3 items-start content-start">
                  {techStack.length === 0 ? (
                    <p className="text-muted-foreground font-mono text-xs text-center w-full py-10">No technologies added.</p>
                  ) : (
                    techStack.map((tag, idx) => (
                      <div key={idx} className="group flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-mono font-semibold text-foreground relative hover:border-muted-foreground/30 hover:-translate-y-0.5 transition-all shadow-sm">
                        <span>{tag}</span>
                        <div className="flex items-center gap-1.5 md:border-l md:border-border md:pl-1.5 md:ml-1">
                          <button type="button" disabled={idx === 0} onClick={() => moveTag(idx, 'left')} className="hidden md:block text-muted-foreground hover:text-primary transition-colors bg-transparent border-0 p-0 disabled:opacity-30 cursor-pointer"><ArrowUp className="-rotate-90 w-3.5 h-3.5" /></button>
                          <button type="button" disabled={idx === techStack.length - 1} onClick={() => moveTag(idx, 'right')} className="hidden md:block text-muted-foreground hover:text-primary transition-colors bg-transparent border-0 p-0 disabled:opacity-30 cursor-pointer"><ArrowDown className="-rotate-90 w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-red-500 transition-colors bg-transparent border-0 p-0 ml-1 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!isKS && activeTab === 'stats' && (
              <div className="space-y-3.5 md:space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Metrics Cards</h3>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Configure stats, choose Lucide icons, toggle visibility, and drag & reorder.</p>
                  </div>
                  <button type="button" onClick={addStatCard} className="px-2.5 py-1.5 md:px-4 md:py-2 bg-primary/20 border border-primary/60 text-primary hover:bg-primary/30 rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline"> Add Card</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {statsCards.length === 0 ? (
                    <div className="text-center py-10 bg-muted/30 rounded-2xl border border-border">
                      <p className="text-muted-foreground font-mono text-xs">No stats cards added yet.</p>
                    </div>
                  ) : (
                    statsCards.map((card, idx) => (
                      <div key={idx} className={`bg-muted/30 border border-border/80 rounded-2xl p-5 relative transition-all ${!card.visible ? 'opacity-50' : ''}`}>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground font-bold">#{idx + 1}</span>
                            <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">{card.title || 'UNNAMED CARD'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => updateStatCard(idx, 'visible', !card.visible)} className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${card.visible ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-border bg-card text-muted-foreground'}`}>{card.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                            <div className="flex gap-1.5 border-l border-border pl-3">
                              <button type="button" disabled={idx === 0} onClick={() => moveStatCard(idx, 'up')} className="p-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" disabled={idx === statsCards.length - 1} onClick={() => moveStatCard(idx, 'down')} className="p-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                            </div>
                            <button type="button" onClick={() => deleteStatCard(idx)} className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors ml-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Value</label>
                            <input type="text" value={card.value} onChange={(e) => updateStatCard(idx, 'value', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground font-bold focus:outline-none" />
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Title</label>
                            <input type="text" value={card.title} onChange={(e) => updateStatCard(idx, 'title', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none" />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Icon Shape</label>
                            <select value={card.icon} onChange={(e) => updateStatCard(idx, 'icon', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none">
                              {AVAILABLE_ICONS.map(ic => <option key={ic.name} value={ic.name}>{ic.label}</option>)}
                            </select>
                          </div>
                          <div className="md:col-span-8">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Subtitle / Subtext</label>
                            <input type="text" value={card.subtitle} onChange={(e) => updateStatCard(idx, 'subtitle', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none font-sans" />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Accent Color</label>
                            <select value={card.color} onChange={(e) => updateStatCard(idx, 'color', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none capitalize">
                              {AVAILABLE_COLORS.map(c => <option key={c.name} value={c.name}>{c.label}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!isKS && activeTab === 'expertise' && (
              <div className="space-y-3.5 md:space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Expertise Rotating Cards</h3>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Manage rotating stack panels. Renders live interactive cards side-by-side.</p>
                  </div>
                  <button type="button" onClick={addExpertiseCard} className="px-2.5 py-1.5 md:px-4 md:py-2 bg-primary/20 border border-primary/60 text-primary hover:bg-primary/30 rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline"> Add Card</span>
                  </button>
                </div>
                <div className="space-y-3.5 md:space-y-6">
                  {expertiseCards.length === 0 ? (
                    <div className="text-center py-10 bg-muted/30 rounded-2xl border border-border">
                      <p className="text-muted-foreground font-mono text-xs">No expertise stack cards configured.</p>
                    </div>
                  ) : (
                    expertiseCards.map((card, idx) => (
                      <div key={idx} className="bg-muted/30 border border-border/80 rounded-2xl p-5 relative transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground font-bold">#{idx + 1}</span>
                            <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">{card.title || 'UNNAMED EXPERTISE'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              <button type="button" disabled={idx === 0} onClick={() => moveExpertiseCard(idx, 'up')} className="p-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" disabled={idx === expertiseCards.length - 1} onClick={() => moveExpertiseCard(idx, 'down')} className="p-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                            </div>
                            <button type="button" onClick={() => deleteExpertiseCard(idx)} className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors ml-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          <div className="lg:col-span-7 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Small Label Tag</label>
                                <input type="text" value={card.label} onChange={(e) => updateExpertiseCard(idx, 'label', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground font-bold focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Main Card Title</label>
                                <input type="text" value={card.title} onChange={(e) => updateExpertiseCard(idx, 'title', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</label>
                              <textarea rows={3} value={card.description} onChange={(e) => updateExpertiseCard(idx, 'description', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground font-sans focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Bottom Tags (Comma separated)</label>
                                <input type="text" value={(card.tags || []).join(', ')} onChange={(e) => { const tagsArr = e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(s => s); updateExpertiseCard(idx, 'tags', tagsArr); }} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground font-mono focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Rotation Position</label>
                                <select value={card.position || 'center'} onChange={(e) => updateExpertiseCard(idx, 'position', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none">
                                  <option value="left">Left (-8deg)</option>
                                  <option value="center">Center (0deg)</option>
                                  <option value="right">Right (8deg)</option>
                                  <option value="far-right">Far-Right (15deg)</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Opacity (%)</label>
                                <input type="number" min="10" max="100" value={card.opacity || 100} onChange={(e) => updateExpertiseCard(idx, 'opacity', parseInt(e.target.value) || 100)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground font-mono focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Accent Color Theme</label>
                                <select value={card.accentColor || 'purple'} onChange={(e) => updateExpertiseCard(idx, 'accentColor', e.target.value)} className="w-full bg-background border border-border px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none">
                                  {AVAILABLE_COLORS.map(col => <option key={col.name} value={col.name}>{col.label}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="lg:col-span-5 flex items-center justify-center bg-neutral-950 border border-neutral-900 rounded-2xl p-4 min-h-[220px]">
                            <div className={`w-full max-w-[240px] rounded-xl border border-white/5 bg-[#171718] p-5 shadow-lg select-none flex flex-col justify-between h-[210px] relative overflow-hidden transition-all duration-300 opacity-${card.opacity || 100}`} style={{ transform: card.position === 'left' ? 'rotate(-6deg)' : (card.position === 'right' ? 'rotate(6deg)' : (card.position === 'far-right' ? 'rotate(12deg)' : 'none')) }}>
                              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                              <div className="text-[8px] font-mono font-bold tracking-widest text-primary uppercase mb-2">{card.label || 'CORE STACK'}</div>
                              <h4 className="text-sm font-bold text-white mb-2 leading-tight">{card.title || 'Untitled Stack'}</h4>
                              <p className="text-[10px] text-neutral-400 font-light leading-relaxed mb-auto overflow-hidden line-clamp-3 font-sans">{card.description || 'Provide some description details.'}</p>
                              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                                {(card.tags || []).slice(0, 3).map((tg: string, i: number) => <span key={i} className="text-[7.5px] font-mono text-neutral-500 tracking-wider">{tg} {i < Math.min((card.tags || []).length, 3) - 1 && '•'}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ======================= KS PREMIUM CINEMATIC CMS ======================== */}
            {/* ========================================================================= */}

            {isKS && activeTab === 'landing' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-pink-400" /> Homepage Hero Editor
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1">Design your premium layout-centric landing section, typography bounds, badge styles, CTA buttons, and alignment presets.</p>
                </div>

                {/* 1. HERO BADGE CONFIG */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Hero Section Badge</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Badge Text</label>
                      <input
                        type="text"
                        placeholder="e.g. FULL-STACK WEB DEVELOPER"
                        value={heroSection.heroBadge?.text || ''}
                        onChange={(e) => setHeroSection((prev: any) => ({
                          ...prev,
                          heroBadge: { ...(prev.heroBadge || {}), text: e.target.value }
                        }))}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Badge Icon</label>
                      <select
                        value={heroSection.heroBadge?.icon || 'Sparkles'}
                        onChange={(e) => setHeroSection((prev: any) => ({
                          ...prev,
                          heroBadge: { ...(prev.heroBadge || {}), icon: e.target.value }
                        }))}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                      >
                        {AVAILABLE_ICONS.map(ic => <option key={ic.name} value={ic.name}>{ic.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Badge Glow Style</label>
                      <select
                        value={heroSection.heroBadge?.glowStyle || 'Holographic'}
                        onChange={(e) => setHeroSection((prev: any) => ({
                          ...prev,
                          heroBadge: { ...(prev.heroBadge || {}), glowStyle: e.target.value }
                        }))}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono"
                      >
                        <option value="Holographic">Holographic Neon</option>
                        <option value="Solid Glow">Solid Cyan/Pink Glow</option>
                        <option value="Subtle Amber">Subtle Amber Outline</option>
                        <option value="Silent Plain">No Glow Border</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. DYNAMIC HERO TITLE LINES */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Hero Title Lines Deck</h4>
                    <button
                      type="button"
                      onClick={addHeroTitleLine}
                      className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer"
                    >
                      + Add Line
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(heroSection.heroTitleLines || []).length === 0 ? (
                      <p className="text-[10px] text-neutral-500 font-mono text-center py-4 bg-neutral-900/20 border border-neutral-850 rounded-xl">No title lines added yet. Click "+ Add Line" to begin!</p>
                    ) : (
                      (heroSection.heroTitleLines || []).map((line: any, idx: number) => (
                        <div key={idx} className="bg-neutral-900/40 border border-neutral-800 p-3 rounded-xl space-y-3 relative">
                          <div className="flex items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                            <span className="text-[9px] font-mono font-bold text-neutral-400">LINE #{idx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              <button type="button" disabled={idx === 0} onClick={() => moveHeroTitleLine(idx, 'up')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" disabled={idx === (heroSection.heroTitleLines || []).length - 1} onClick={() => moveHeroTitleLine(idx, 'down')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => removeHeroTitleLine(idx)} className="p-1 rounded border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 cursor-pointer ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-6">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Text Content</label>
                              <input
                                type="text"
                                value={line.text}
                                onChange={(e) => updateHeroTitleLine(idx, 'text', e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white"
                              />
                            </div>
                            <div className="md:col-span-3 flex flex-col justify-center">
                              <label className="relative inline-flex items-center cursor-pointer select-none mt-3.5">
                                <input
                                  type="checkbox"
                                  checked={line.isGradient || false}
                                  onChange={(e) => updateHeroTitleLine(idx, 'isGradient', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400"></div>
                                <span className="ml-2 text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Gradient</span>
                              </label>
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Highlight Word</label>
                              <input
                                type="text"
                                placeholder="e.g. Products"
                                value={line.highlightWords || ''}
                                onChange={(e) => updateHeroTitleLine(idx, 'highlightWords', e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. HERO DESCRIPTION */}
                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Description Paragraph (Visual Lead)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your visual engineering background and design capabilities..."
                    value={heroSection.introParagraph || heroSection.descOne || ''}
                    onChange={(e) => setHeroSection((prev: any) => ({ ...prev, introParagraph: e.target.value, descOne: e.target.value }))}
                    className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-4 py-3 rounded-xl text-xs transition-all text-white font-sans font-light leading-relaxed"
                  />
                </div>

                {/* 4. CTA BUTTONS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Call To Action Buttons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* BUTTON 1 */}
                    <div className="bg-neutral-900/40 border border-neutral-800 p-3 rounded-xl space-y-3">
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Primary CTA (Button 1)</span>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={heroSection.ctaButton1?.text || ''}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton1: { ...(prev.ctaButton1 || {}), text: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Link</label>
                        <input
                          type="text"
                          value={heroSection.ctaButton1?.link || ''}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton1: { ...(prev.ctaButton1 || {}), link: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Style Preset</label>
                        <select
                          value={heroSection.ctaButton1?.style || 'solid-pink'}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton1: { ...(prev.ctaButton1 || {}), style: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                        >
                          <option value="solid-pink">Solid Accent Gradient</option>
                          <option value="outline-neon">Neon Ghost Border</option>
                          <option value="glow-glass">Translucent Glass</option>
                          <option value="plain-text">Subtle Link Arrow</option>
                        </select>
                      </div>
                    </div>

                    {/* BUTTON 2 */}
                    <div className="bg-neutral-900/40 border border-neutral-800 p-3 rounded-xl space-y-3">
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Secondary CTA (Button 2)</span>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={heroSection.ctaButton2?.text || ''}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton2: { ...(prev.ctaButton2 || {}), text: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Link</label>
                        <input
                          type="text"
                          value={heroSection.ctaButton2?.link || ''}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton2: { ...(prev.ctaButton2 || {}), link: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Button Style Preset</label>
                        <select
                          value={heroSection.ctaButton2?.style || 'outline-neon'}
                          onChange={(e) => setHeroSection((prev: any) => ({
                            ...prev,
                            ctaButton2: { ...(prev.ctaButton2 || {}), style: e.target.value }
                          }))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-white font-mono"
                        >
                          <option value="solid-pink">Solid Accent Gradient</option>
                          <option value="outline-neon">Neon Ghost Border</option>
                          <option value="glow-glass">Translucent Glass</option>
                          <option value="plain-text">Subtle Link Arrow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. HERO ALIGNMENT & HEIGHT PRESETS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-4">
                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Hero Layout Alignment</label>
                    <div className="flex bg-neutral-950/60 p-1 border border-neutral-850 rounded-xl justify-between">
                      {['left', 'center', 'cinematic-center'].map((align) => {
                        const isSelected = heroSection.heroAlignment === align;
                        return (
                          <button
                            key={align}
                            type="button"
                            onClick={() => setHeroSection((prev: any) => ({ ...prev, heroAlignment: align }))}
                            className={`flex-1 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400'
                                : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            {align === 'cinematic-center' ? 'Cinematic' : align}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Hero Layout Height</label>
                    <div className="flex bg-neutral-950/60 p-1 border border-neutral-850 rounded-xl justify-between">
                      {['70vh', '80vh', 'fullscreen'].map((height) => {
                        const isSelected = heroSection.heroHeight === height;
                        return (
                          <button
                            key={height}
                            type="button"
                            onClick={() => setHeroSection((prev: any) => ({ ...prev, heroHeight: height }))}
                            className={`flex-1 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400'
                                : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            {height === 'fullscreen' ? '100vh / Full' : height}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Developer portrait (Reused canvas uploader) */}
                <div className="border-t border-neutral-800 pt-6">
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Experience Studio Portrait</label>
                  {fileUrl ? (
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                      <p className="text-[10px] font-mono text-pink-400 uppercase font-black tracking-widest flex items-center gap-1.5 animate-pulse">
                        <Crop className="w-3.5 h-3.5" /> Adjust and Crop Cinematic Avatar Focus
                      </p>
                      <div 
                        className="w-[200px] h-[250px] border border-pink-500/30 rounded-2xl overflow-hidden relative bg-black select-none cursor-move"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                      >
                        <img
                          ref={imageRef}
                          src={fileUrl}
                          alt="Crop Source"
                          draggable={false}
                          className="absolute pointer-events-none origin-center"
                          style={{
                            transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${zoom})`,
                            left: '50%',
                            top: '50%',
                            marginLeft: imageRef.current ? -imageRef.current.naturalWidth / 2 : 0,
                            marginTop: imageRef.current ? -imageRef.current.naturalHeight / 2 : 0
                          }}
                        />
                        <div className="absolute inset-0 border-[2px] border-dashed border-pink-500/40 pointer-events-none rounded-2xl"></div>
                      </div>
                      <div className="w-full max-w-[320px] flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-mono text-neutral-500">1.0x</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <span className="text-[10px] font-mono text-neutral-500">3.0x</span>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <button type="button" onClick={() => setFileUrl(null)} className="px-4 py-2 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 rounded-xl text-xs font-mono font-bold cursor-pointer">Cancel</button>
                        <button type="button" disabled={uploadingImage} onClick={performUploadAndCrop} className="px-5 py-2 bg-pink-500/20 border border-pink-500/60 text-pink-400 hover:bg-pink-500/30 rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5">{uploadingImage ? 'Cropping...' : <><Check className="w-3.5 h-3.5" /> Apply Portrait</>}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1 flex justify-center">
                        <div className="w-[120px] h-[150px] border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
                          <img 
                            src={previewImg} 
                            alt="Current portrait" 
                            className="w-full h-full object-cover grayscale brightness-95"
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="relative border border-dashed border-neutral-800 hover:border-pink-500/30 bg-neutral-900/40 rounded-xl px-6 py-6 text-center flex flex-col items-center justify-center transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-6 h-6 text-neutral-500 mb-2" />
                          <span className="text-xs text-white font-semibold mb-1">Drag & Drop portrait avatar image</span>
                          <span className="text-[9px] text-neutral-500 font-mono">Supports PNG, JPG, or WEBP. Max size 5MB.</span>
                        </div>
                        {heroSection.image && (
                          <button
                            type="button"
                            onClick={() => setHeroSection((prev: any) => ({ ...prev, image: '' }))}
                            className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove image (Fallback to defaults)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. RESUME EXPERIENCE CONTROL */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4 border-t pt-4 mt-6">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Resume Document & CTA Delivery</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Professional PDF Document File</label>
                      <div className="relative border border-dashed border-neutral-850 hover:border-pink-500/35 bg-neutral-900/40 rounded-xl px-4 py-2.5 text-center flex flex-col items-center justify-center transition-all h-[44px]">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-pink-400" />
                          <span className="text-[11px] font-mono text-neutral-300">
                            {resumeFile ? resumeFile.name : profile?.resumeUrl ? '✅ PDF Attached (Click to update)' : 'Upload PDF'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Public PDF Link Fallback (Google Drive/etc)</label>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={themeSection.resumeControl?.publicPdfUrl || ''}
                        onChange={(e) => updateResumeControl('publicPdfUrl', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-3">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Custom Resume Button CTA Text</label>
                      <input
                        type="text"
                        placeholder="INSPECT CURRICULUM VITAE"
                        value={themeSection.resumeControl?.customCta || ''}
                        onChange={(e) => updateResumeControl('customCta', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3.5">
                      <div className="flex items-center justify-between bg-neutral-950/40 p-2.5 border border-neutral-900 rounded-xl">
                        <span className="text-[9px] font-mono font-bold text-neutral-400">Direct Download</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={themeSection.resumeControl?.directDownload ?? true}
                            onChange={(e) => updateResumeControl('directDownload', e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between bg-neutral-950/40 p-2.5 border border-neutral-900 rounded-xl">
                        <span className="text-[9px] font-mono font-bold text-neutral-400">Open Modal Preview</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={themeSection.resumeControl?.openModalPreview ?? false}
                            onChange={(e) => updateResumeControl('openModalPreview', e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Animated Resume Subtext</label>
                    <textarea
                      rows={2}
                      value={themeSection.resumeControl?.animatedIntro || ''}
                      onChange={(e) => updateResumeControl('animatedIntro', e.target.value)}
                      className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {isKS && activeTab === 'visual-identity' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" /> Visual Styling Editor
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1">Configure background video loops, overlay dimensions, custom text gradients, HSL accent presets, typography constraints, and neon glow radius.</p>
                </div>

                {/* 1. BACKGROUND VIDEO */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Background Video Loops</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Desktop Video Loop URL / Path</label>
                      <input
                        type="text"
                        placeholder="e.g. /uploads/portfolio/ks/cinematic-bg.mp4"
                        value={themeSection.visualIdentity?.videoBackground?.videoUrl || ''}
                        onChange={(e) => updateVisualIdentityNested('videoBackground', 'videoUrl', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Mobile Video Fallback URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /uploads/portfolio/ks/mobile-bg.mp4"
                        value={themeSection.visualIdentity?.videoBackground?.mobileVideoUrl || ''}
                        onChange={(e) => updateVisualIdentityNested('videoBackground', 'mobileVideoUrl', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-pink-500/50 focus:outline-none px-3 py-2 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. OVERLAY CONTROL */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Ambient Overlay Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Darkness Opacity ({themeSection.visualIdentity?.overlayControl?.darkness || 80}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={themeSection.visualIdentity?.overlayControl?.darkness || 80}
                        onChange={(e) => updateVisualIdentityNested('overlayControl', 'darkness', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Motion Blur Strength ({themeSection.visualIdentity?.overlayControl?.blur || 10}px)</label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={themeSection.visualIdentity?.overlayControl?.blur || 10}
                        onChange={(e) => updateVisualIdentityNested('overlayControl', 'blur', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Fluid Gradient Opacity ({themeSection.visualIdentity?.overlayControl?.gradientOpacity || 90}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={themeSection.visualIdentity?.overlayControl?.gradientOpacity || 90}
                        onChange={(e) => updateVisualIdentityNested('overlayControl', 'gradientOpacity', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. TEXT GRADIENTS & Presets */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Fluid Gradients & Accent Presets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Active Primary Gradient Preset</label>
                      <div className="grid grid-cols-2 gap-2">
                        {KS_GRADIENT_PRESETS.map((preset) => {
                          const isSelected = themeSection.visualIdentity?.textGradients?.primaryGradient === preset.style || themeSection.visualIdentity?.gradientPreset === preset.name;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                updateVisualIdentityNested('textGradients', 'primaryGradient', preset.style);
                                updateVisualIdentity('gradientPreset', preset.name);
                                // Sync base colors matching presets
                                if (preset.name === 'Fuchsia Twilight') {
                                  updateVisualIdentityNested('textGradients', 'accentColor', '#ec4899');
                                  updateVisualIdentityNested('textGradients', 'hoverGlow', '#ec4899');
                                  updateVisualIdentity('accentColor', '#ec4899');
                                } else if (preset.name === 'Deep Purple Glow') {
                                  updateVisualIdentityNested('textGradients', 'accentColor', '#8b5cf6');
                                  updateVisualIdentityNested('textGradients', 'hoverGlow', '#8b5cf6');
                                  updateVisualIdentity('accentColor', '#8b5cf6');
                                } else if (preset.name === 'Sunset Neon') {
                                  updateVisualIdentityNested('textGradients', 'accentColor', '#f43f5e');
                                  updateVisualIdentityNested('textGradients', 'hoverGlow', '#f43f5e');
                                  updateVisualIdentity('accentColor', '#f43f5e');
                                } else if (preset.name === 'Emerald Matrix') {
                                  updateVisualIdentityNested('textGradients', 'accentColor', '#10b981');
                                  updateVisualIdentityNested('textGradients', 'hoverGlow', '#10b981');
                                  updateVisualIdentity('accentColor', '#10b981');
                                }
                              }}
                              className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase flex flex-col gap-2 items-center text-center cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-sm' 
                                  : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                              }`}
                            >
                              <span className={`w-8 h-4 rounded bg-gradient-to-r ${preset.style} block`} />
                              <span>{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Accent Solid Hex Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={themeSection.visualIdentity?.textGradients?.accentColor || '#ec4899'}
                            onChange={(e) => {
                              updateVisualIdentityNested('textGradients', 'accentColor', e.target.value);
                              updateVisualIdentity('accentColor', e.target.value);
                            }}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeSection.visualIdentity?.textGradients?.accentColor || '#ec4899'}
                            onChange={(e) => {
                              updateVisualIdentityNested('textGradients', 'accentColor', e.target.value);
                              updateVisualIdentity('accentColor', e.target.value);
                            }}
                            className="flex-1 bg-[#121212] border border-neutral-850 px-3 py-1.5 rounded-lg text-xs font-mono text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Interactive Hover Glow Hue</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={themeSection.visualIdentity?.textGradients?.hoverGlow || '#ec4899'}
                            onChange={(e) => updateVisualIdentityNested('textGradients', 'hoverGlow', e.target.value)}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeSection.visualIdentity?.textGradients?.hoverGlow || '#ec4899'}
                            onChange={(e) => updateVisualIdentityNested('textGradients', 'hoverGlow', e.target.value)}
                            className="flex-1 bg-[#121212] border border-neutral-850 px-3 py-1.5 rounded-lg text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. TYPOGRAPHY */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Typography Scale & Bounds</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Title Layout Size</label>
                      <select
                        value={themeSection.visualIdentity?.typography?.titleSize || 'Cinematic'}
                        onChange={(e) => updateVisualIdentityNested('typography', 'titleSize', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="Small">Small (Compact Header)</option>
                        <option value="Medium">Medium (Balanced Desktop)</option>
                        <option value="Large">Large (Impact Headline)</option>
                        <option value="Cinematic">Cinematic (Oversized Hero)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Subtitle Max Paragraph Width</label>
                      <select
                        value={themeSection.visualIdentity?.typography?.subtitleWidth || 'Balanced'}
                        onChange={(e) => updateVisualIdentityNested('typography', 'subtitleWidth', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="Narrow">Narrow bounds (Max read speed)</option>
                        <option value="Balanced">Balanced width (Default standard)</option>
                        <option value="Wide">Wide viewport (Full stretch)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-3">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Global Font Line Spacing ({themeSection.visualIdentity?.typography?.spacing || 50}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={themeSection.visualIdentity?.typography?.spacing || 50}
                        onChange={(e) => updateVisualIdentityNested('typography', 'spacing', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Mobile Typography Scaling ({themeSection.visualIdentity?.typography?.mobileScale || 100}%)</label>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={themeSection.visualIdentity?.typography?.mobileScale || 100}
                        onChange={(e) => updateVisualIdentityNested('typography', 'mobileScale', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. GLOW EFFECTS & Background Particle Systems */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Global Cyber Glow Effects</h4>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={themeSection.visualIdentity?.glowEffects?.enabled ?? true}
                        onChange={(e) => updateVisualIdentityNested('glowEffects', 'enabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-8 h-4 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400"></div>
                    </label>
                  </div>

                  {(themeSection.visualIdentity?.glowEffects?.enabled ?? true) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-3 animate-fade-in">
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Glow Shader Intensity ({themeSection.visualIdentity?.glowEffects?.intensity || themeSection.visualIdentity?.glowIntensity || 75}%)</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={themeSection.visualIdentity?.glowEffects?.intensity || themeSection.visualIdentity?.glowIntensity || 75}
                          onChange={(e) => {
                            updateVisualIdentityNested('glowEffects', 'intensity', parseInt(e.target.value));
                            updateVisualIdentity('glowIntensity', parseInt(e.target.value));
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Neon Glow Blur Radius ({themeSection.visualIdentity?.glowEffects?.neonRadius || 40}px)</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={themeSection.visualIdentity?.glowEffects?.neonRadius || 40}
                          onChange={(e) => updateVisualIdentityNested('glowEffects', 'neonRadius', parseInt(e.target.value))}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating particle systems */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Floating Particle System (GPU Accel)</h4>
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Spawns fine background ambient stars floating upward across layouts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={themeSection.visualIdentity?.floatingParticles?.enabled ?? true}
                        onChange={(e) => {
                          const enabled = e.target.checked;
                          const current = themeSection.visualIdentity?.floatingParticles || { count: 40, speed: 1.5 };
                          updateVisualIdentity('floatingParticles', { ...current, enabled });
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                    </label>
                  </div>

                  {(themeSection.visualIdentity?.floatingParticles?.enabled ?? true) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Particle Density Count ({themeSection.visualIdentity?.floatingParticles?.count || 40} stars)</label>
                        <input
                          type="range"
                          min="10"
                          max="120"
                          value={themeSection.visualIdentity?.floatingParticles?.count || 40}
                          onChange={(e) => {
                            const count = parseInt(e.target.value);
                            const current = themeSection.visualIdentity?.floatingParticles || { enabled: true, speed: 1.5 };
                            updateVisualIdentity('floatingParticles', { ...current, count });
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Interpolated Velocity ({themeSection.visualIdentity?.floatingParticles?.speed || 1.5}x)</label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={(themeSection.visualIdentity?.floatingParticles?.speed || 1.5) * 10}
                          onChange={(e) => {
                            const speed = parseFloat(e.target.value) / 10;
                            const current = themeSection.visualIdentity?.floatingParticles || { enabled: true, count: 40 };
                            updateVisualIdentity('floatingParticles', { ...current, speed });
                          }}
                          className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. MOBILE VIEWPORT STYLING & SAFETY */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-5 relative overflow-hidden mt-6">
                  <div className="border-b border-neutral-800 pb-3 mb-4">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Mobile Viewport Styling & Safety</h4>
                    <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Control layout offsets and rendering performance targets on mobile devices.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Mobile Hero Y-Offset ({themeSection.responsiveControls?.mobileHeroOffset || 20}px)</label>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-mono text-neutral-500">-100px</span>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={themeSection.responsiveControls?.mobileHeroOffset || 20}
                          onChange={(e) => updateResponsiveControls('mobileHeroOffset', parseInt(e.target.value))}
                          className="flex-1 h-1 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <span className="text-[9px] font-mono text-neutral-500">+100px</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Viewport Font Scaling ({themeSection.responsiveControls?.fontScaling || 100}%)</label>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-mono text-neutral-500">50%</span>
                        <input
                          type="range"
                          min="50"
                          max="130"
                          value={themeSection.responsiveControls?.fontScaling || 100}
                          onChange={(e) => updateResponsiveControls('fontScaling', parseInt(e.target.value))}
                          className="flex-1 h-1 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <span className="text-[9px] font-mono text-neutral-500">130%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-4 mt-4">
                    <div className="flex items-center justify-between bg-neutral-950/40 p-3.5 border border-neutral-900 rounded-xl">
                      <div>
                        <h5 className="text-[10px] font-mono font-bold text-white uppercase">Mobile Blur Reduction</h5>
                        <p className="text-[8px] text-neutral-500 font-mono mt-0.5">Turns off heavy blurs on mobile screen widths to protect frame rates.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.responsiveControls?.mobileBlurReduction ?? true}
                          onChange={(e) => updateResponsiveControls('mobileBlurReduction', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-neutral-950/40 p-3.5 border border-neutral-900 rounded-xl">
                      <div>
                        <h5 className="text-[10px] font-mono font-bold text-white uppercase">Disable Animations</h5>
                        <p className="text-[8px] text-neutral-500 font-mono mt-0.5">Locks orbits and floating particles entirely on mobile devices for safety.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.responsiveControls?.animationDisable ?? false}
                          onChange={(e) => updateResponsiveControls('animationDisable', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isKS && activeTab === 'motion-system' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-pink-400" /> Interactive Motion Studio
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1">Fine-tune CSS transition physics, viewport parallax weights, magnetic button animations, and custom orbital experience nodes.</p>
                </div>

                {/* 1. FLOATING NODES MAP STUDIO */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Floating Nodes Studio</h4>
                      <p className="text-[8.5px] font-mono text-neutral-500">Configure concentric orbital experience nodes floating in real-time space.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addStatCard} 
                      className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer"
                    >
                      + Add Node
                    </button>
                  </div>

                  <div className="space-y-3">
                    {statsCards.length === 0 ? (
                      <p className="text-[10px] text-neutral-500 font-mono text-center py-4 bg-neutral-900/20 border border-neutral-850 rounded-xl">No orbital nodes created yet. Click "+ Add Node" to begin!</p>
                    ) : (
                      statsCards.map((card, idx) => (
                        <div key={idx} className={`bg-neutral-900/40 border border-neutral-800 p-3 rounded-xl space-y-3 relative ${!card.visible ? 'opacity-50' : ''}`}>
                          <div className="flex items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-bold text-neutral-500">NODE #{idx + 1}</span>
                              <span className="text-[9px] font-mono font-bold text-pink-400 uppercase">{card.title || 'UNNAMED NODE'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button" 
                                onClick={() => updateStatCard(idx, 'visible', !card.visible)} 
                                className={`p-1 rounded border transition-all cursor-pointer ${
                                  card.visible 
                                    ? 'border-pink-500/30 bg-pink-500/5 text-pink-400' 
                                    : 'border-neutral-800 bg-neutral-950 text-neutral-500'
                                }`}
                              >
                                {card.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                              <button type="button" disabled={idx === 0} onClick={() => moveStatCard(idx, 'up')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3 h-3" /></button>
                              <button type="button" disabled={idx === statsCards.length - 1} onClick={() => moveStatCard(idx, 'down')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3 h-3" /></button>
                              <button type="button" onClick={() => deleteStatCard(idx)} className="p-1 rounded border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 cursor-pointer ml-1"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-4">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Node Title</label>
                              <input 
                                type="text" 
                                value={card.title} 
                                onChange={(e) => updateStatCard(idx, 'title', e.target.value)} 
                                className="w-full bg-neutral-950 border border-neutral-850 px-2.5 py-1 rounded-lg text-xs text-white font-sans font-bold" 
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Icon Visual Shape</label>
                              <select 
                                value={card.icon} 
                                onChange={(e) => updateStatCard(idx, 'icon', e.target.value)} 
                                className="w-full bg-neutral-950 border border-neutral-850 px-2 py-1 rounded-lg text-xs text-white"
                              >
                                {AVAILABLE_ICONS.map(ic => <option key={ic.name} value={ic.name}>{ic.label}</option>)}
                              </select>
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Concentric Orbit Level</label>
                              <select 
                                value={card.position || 'orbit-1'} 
                                onChange={(e) => updateStatCard(idx, 'position', e.target.value)} 
                                className="w-full bg-neutral-950 border border-neutral-850 px-2 py-1 rounded-lg text-xs text-white font-mono"
                              >
                                <option value="orbit-1">Orbit Level 1 (Inner)</option>
                                <option value="orbit-2">Orbit Level 2</option>
                                <option value="orbit-3">Orbit Level 3</option>
                                <option value="orbit-4">Orbit Level 4 (Outer)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-8">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Hover Detail Description</label>
                              <input 
                                type="text" 
                                placeholder="Explain this node concept in a short sentence..."
                                value={card.subtitle} 
                                onChange={(e) => updateStatCard(idx, 'subtitle', e.target.value)} 
                                className="w-full bg-neutral-950 border border-neutral-850 px-2.5 py-1 rounded-lg text-xs text-white font-sans" 
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Orbit Velocity ({card.orbitalSpeed || 8}s)</label>
                              <input 
                                type="range" 
                                min="2" 
                                max="24" 
                                value={card.orbitalSpeed || 8} 
                                onChange={(e) => updateStatCard(idx, 'orbitalSpeed', parseInt(e.target.value))} 
                                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-t border-neutral-850 pt-2.5">
                            <div className="md:col-span-6">
                              <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Custom Glow Flare Hue</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={card.glowColor || '#ec4899'}
                                  onChange={(e) => updateStatCard(idx, 'glowColor', e.target.value)}
                                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={card.glowColor || '#ec4899'}
                                  onChange={(e) => updateStatCard(idx, 'glowColor', e.target.value)}
                                  className="flex-1 bg-neutral-950 border border-neutral-850 px-2 py-0.5 rounded text-[10px] font-mono text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. PARALLAX WEIGHTS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Layout Parallax Weights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Hero Shift Weight ({themeSection.motionSystem?.parallaxControls?.heroMovement ?? 50}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={themeSection.motionSystem?.parallaxControls?.heroMovement ?? 50}
                        onChange={(e) => updateMotionSystemNested('parallaxControls', 'heroMovement', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Node Float Speed ({themeSection.motionSystem?.parallaxControls?.nodeFloatingSpeed ?? 50}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={themeSection.motionSystem?.parallaxControls?.nodeFloatingSpeed ?? 50}
                        onChange={(e) => updateMotionSystemNested('parallaxControls', 'nodeFloatingSpeed', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Blur Transition Ease ({themeSection.motionSystem?.parallaxControls?.blurTransition ?? 50}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={themeSection.motionSystem?.parallaxControls?.blurTransition ?? 50}
                        onChange={(e) => updateMotionSystemNested('parallaxControls', 'blurTransition', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. BUTTON PHYSICS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Interactive Button Physics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="block text-[8.5px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Hover Elastic Scale ({themeSection.motionSystem?.buttonAnimations?.hoverScale ?? 110}%)</label>
                      <input
                        type="range"
                        min="100"
                        max="125"
                        value={themeSection.motionSystem?.buttonAnimations?.hoverScale ?? 110}
                        onChange={(e) => updateMotionSystemNested('buttonAnimations', 'hoverScale', parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-2.5"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-neutral-900/40 p-2.5 border border-neutral-850 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-neutral-400">Magnetic Pull</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.buttonAnimations?.magneticEffect ?? true}
                          onChange={(e) => updateMotionSystemNested('buttonAnimations', 'magneticEffect', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-neutral-900/40 p-2.5 border border-neutral-850 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-neutral-400">Radial Glow Pulse</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.buttonAnimations?.glowPulse ?? true}
                          onChange={(e) => updateMotionSystemNested('buttonAnimations', 'glowPulse', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. SCROLL REVEAL EFFECTS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Viewport Scroll Reveal Effects</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between bg-neutral-900/40 p-2.5 border border-neutral-850 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-neutral-400">Fade Rise Reveal</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.scrollEffects?.fade ?? true}
                          onChange={(e) => updateMotionSystemNested('scrollEffects', 'fade', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-neutral-900/40 p-2.5 border border-neutral-850 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-neutral-400">Blur Reveal Focus</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.scrollEffects?.blurReveal ?? true}
                          onChange={(e) => updateMotionSystemNested('scrollEffects', 'blurReveal', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-neutral-900/40 p-2.5 border border-neutral-850 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-neutral-400">Fluid Gradient Shift</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.scrollEffects?.gradientShift ?? true}
                          onChange={(e) => updateMotionSystemNested('scrollEffects', 'gradientShift', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 5. MOTION STUDIO GENERAL SETTINGS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Base Motion Speeds & Tracking</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Transition Response Duration ({themeSection.motionSystem?.transitionSpeed || 0.4}s)</label>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-mono text-neutral-500">0.1s</span>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={(themeSection.motionSystem?.transitionSpeed || 0.4) * 10}
                          onChange={(e) => updateMotionSystem('transitionSpeed', parseFloat(e.target.value) / 10)}
                          className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <span className="text-[9px] font-mono text-neutral-500">2.0s</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Scroll Parallax Weight ({themeSection.motionSystem?.scrollInterpolation || 50}%)</label>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-mono text-neutral-500">0 (Fixed)</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={themeSection.motionSystem?.scrollInterpolation || 50}
                          onChange={(e) => updateMotionSystem('scrollInterpolation', parseInt(e.target.value))}
                          className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <span className="text-[9px] font-mono text-neutral-500">100</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-900 pt-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Interactive Hover Physics</label>
                      <select
                        value={themeSection.motionSystem?.hoverBehavior || 'Magnetic Pull'}
                        onChange={(e) => updateMotionSystem('hoverBehavior', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500/50"
                      >
                        <option value="Magnetic Pull">Magnetic Pull (Target follows cursor)</option>
                        <option value="Holographic Tilt">Holographic Tilt (3D hover rotation)</option>
                        <option value="Glow Pulse">Glow Pulse (Radial flare pulse)</option>
                        <option value="Scale Lift">Scale Lift (Standard elastic rise)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Card Reveal Style (Scroll Triggered)</label>
                      <select
                        value={themeSection.motionSystem?.cardRevealStyle || 'Spring Rise'}
                        onChange={(e) => updateMotionSystem('cardRevealStyle', e.target.value)}
                        className="w-full bg-neutral-900/60 border border-neutral-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500/50"
                      >
                        <option value="Spring Rise">Spring Rise (Bounce up & fade)</option>
                        <option value="Blur Fade">Blur Fade (Holographic focus sharpen)</option>
                        <option value="Slide Zoom">Slide Zoom (Slight slide elastic scaling)</option>
                        <option value="Holographic Split">Holographic Split (Left-Right alternate slide)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-4">
                    <div className="flex items-center justify-between bg-neutral-950/40 p-3.5 border border-neutral-900 rounded-xl">
                      <div>
                        <h5 className="text-[10px] font-mono font-bold text-white uppercase">Dynamic Mouse Tracking</h5>
                        <p className="text-[8px] text-neutral-500 font-mono mt-0.5">Drives ambient backglow positions based on cursor X/Y coordinates.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.mouseTracking ?? true}
                          onChange={(e) => updateMotionSystem('mouseTracking', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between bg-neutral-950/40 p-3.5 border border-neutral-900 rounded-xl">
                      <div>
                        <h5 className="text-[10px] font-mono font-bold text-white uppercase">Background Blur Motion</h5>
                        <p className="text-[8px] text-neutral-500 font-mono mt-0.5">Triggers hardware-accelerated transitions on blur parameters.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={themeSection.motionSystem?.backgroundBlurMotion ?? true}
                          onChange={(e) => updateMotionSystem('backgroundBlurMotion', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-400 peer-checked:after:border-pink-500/35"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isKS && activeTab === 'story-blocks' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-5 h-5 text-pink-400" /> Homepage Section Manager
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1">Enable, disable, reorder, and customize subtitles and intro copy for all primary homepage sections.</p>
                </div>

                {/* 1. SECTION VISIBILITY & CONTROLS */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest">Section Visibility & Order</h4>
                  <div className="space-y-3">
                    {(heroSection.storyBlocks?.sectionOrder || ["skills", "projects", "experience", "certificates", "contact"]).map((secKey: string, idx: number) => {
                      const secInfo = heroSection.storyBlocks?.sections?.[secKey] || { enabled: true, title: secKey.toUpperCase(), subtitle: "", intro: "" };
                      return (
                        <div key={secKey} className={`bg-neutral-900/40 border border-neutral-800 p-3.5 rounded-xl space-y-3 relative transition-all ${!secInfo.enabled ? 'opacity-50' : ''}`}>
                          <div className="flex items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[9px] font-mono font-bold text-neutral-500">INDEX #{idx + 1}</span>
                              <span className="text-xs font-mono font-black text-pink-400 uppercase tracking-wider">{secKey}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button" 
                                onClick={() => toggleSection(secKey)} 
                                className={`px-2.5 py-1 rounded border text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                  secInfo.enabled 
                                    ? 'border-pink-500/30 bg-pink-500/5 text-pink-400' 
                                    : 'border-neutral-800 bg-neutral-950 text-neutral-500'
                                }`}
                              >
                                {secInfo.enabled ? 'Enabled' : 'Disabled'}
                              </button>
                              <button type="button" disabled={idx === 0} onClick={() => moveSectionOrder(idx, 'up')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" disabled={idx === (heroSection.storyBlocks?.sectionOrder || ["skills", "projects", "experience", "certificates", "contact"]).length - 1} onClick={() => moveSectionOrder(idx, 'down')} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>

                          {secInfo.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 animate-fade-in">
                              <div className="md:col-span-4">
                                <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Section Display Title</label>
                                <input
                                  type="text"
                                  value={secInfo.title || ''}
                                  onChange={(e) => updateSectionDetail(secKey, 'title', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-lg text-xs text-white"
                                />
                              </div>
                              <div className="md:col-span-4">
                                <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Display Subtitle</label>
                                <input
                                  type="text"
                                  value={secInfo.subtitle || ''}
                                  onChange={(e) => updateSectionDetail(secKey, 'subtitle', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-lg text-xs text-white font-sans"
                                />
                              </div>
                              <div className="md:col-span-4">
                                <label className="block text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-1">Intro Narrative Paragraph</label>
                                <input
                                  type="text"
                                  value={secInfo.intro || ''}
                                  onChange={(e) => updateSectionDetail(secKey, 'intro', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-lg text-xs text-white font-sans"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SPACING PRESET */}
                <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-2xl space-y-3.5">
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">Global Homepage Layout Grid Spacing</label>
                  <div className="flex bg-neutral-950/60 p-1 border border-neutral-850 rounded-xl justify-between">
                    {['compact', 'balanced', 'cinematic'].map((preset) => {
                      const isSelected = (heroSection.storyBlocks?.spacingPreset || 'balanced') === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setSpacingPreset(preset)}
                          className={`flex-1 px-3 py-2 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400 shadow-md'
                              : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          {preset} Layout
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SAVE BUTTON BAR */}
            <div className="pt-4 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4
              sticky bottom-0 z-20 bg-background/95 backdrop-blur-lg px-6 py-4 -mx-6 md:-mx-8 rounded-b-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] 
              md:static md:bg-transparent md:border-none md:p-0 md:shadow-none w-[calc(100%+48px)] md:w-full animate-fade-in mt-6"
            >
              <span className="text-[9px] font-mono text-muted-foreground uppercase hidden md:inline">
                Save changes to publish live to {previewSlug}.dev
              </span>
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-6 py-3.5 ${isKS ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-primary text-primary-foreground'} font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] border-0 cursor-pointer flex items-center justify-center gap-2`}
              >
                {loading ? (
                  'Saving Changes...'
                ) : (
                  <><Save className="w-4 h-4 animate-pulse" /> Save Brand Profile Specs</>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* ======================= LIVE INTERACTIVE PREVIEW PANEL ================== */}
      {/* ========================================================================= */}
      
      <div className={`xl:col-span-5 sticky top-[100px] space-y-4 text-left ${showPreviewMobile ? 'block' : 'hidden xl:block'}`}>
        
        {/* Figma viewport style border wrapper */}
        <div className={`bg-[#0b0b0c] border ${isKS ? 'border-neutral-800 hover:border-pink-500/30' : 'border-neutral-900'} rounded-2xl overflow-hidden shadow-2xl relative select-none transition-all duration-300`}>
          <div className={`absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent ${isKS ? 'via-pink-500/50' : 'via-primary/20'} to-transparent`}></div>

          {/* Browser Chrome Header */}
          <div className="bg-neutral-950 border-b border-neutral-900/85 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>

            <div className="bg-[#121213] border border-neutral-850 px-4 py-1.5 rounded-lg text-[9px] font-mono text-neutral-500 w-[55%] text-center truncate select-text">
              https://{previewSlug}.dev/{isKS ? 'experience-studio' : ''}
            </div>

            {/* Device switch controls */}
            <div className="flex bg-[#121213] border border-neutral-850 rounded-lg p-0.5">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone }
              ].map(d => {
                const Icon = d.icon;
                const active = devicePreview === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDevicePreview(d.id as any)}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors border-0 ${
                      active 
                        ? (isKS ? 'bg-pink-500/20 text-pink-400' : 'bg-primary/25 text-primary') 
                        : 'text-neutral-500 hover:text-neutral-300 bg-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Viewport content area */}
          <div className="bg-neutral-950 p-6 flex justify-center items-center min-h-[480px]">
            <div 
              className={`border border-neutral-900 rounded-3xl bg-[#03000a] overflow-hidden transition-all duration-500 shadow-2xl relative w-full h-[580px] max-h-[580px] flex flex-col`}
              style={{
                maxWidth: devicePreview === 'mobile' ? '300px' : (devicePreview === 'tablet' ? '460px' : '100%'),
                fontFamily: isKS ? (themeSection.visualIdentity?.typographyStyle || 'Outfit') : 'inherit'
              }}
            >
              
              {/* Dynamic scrollable screen content */}
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scrollbar-none relative">
                
                {/* ----------------------------------------------------------- */}
                {/* ----------------- KS STUDIO VISUAL PREVIEW ---------------- */}
                {/* ----------------------------------------------------------- */}
                
                {isKS ? (
                  <div className="space-y-10 relative z-10 text-left">
                    
                    {/* Inject custom dynamic animations in pure CSS */}
                    <style>{`
                      @keyframes orbit-cw {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                      @keyframes orbit-ccw {
                        0% { transform: rotate(360deg); }
                        100% { transform: rotate(0deg); }
                      }
                      .nucleus-orbiter {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform-origin: 0 0;
                        animation: orbit-cw linear infinite;
                      }
                      .node-anchor {
                        animation: orbit-ccw linear infinite;
                      }
                      .glow-flare {
                        box-shadow: 0 0 calc(var(--glow-val) * 0.25px) var(--glow-color);
                      }
                      .neon-bar-pulse {
                        position: relative;
                        overflow: hidden;
                      }
                      .neon-bar-pulse::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                        animation: sparkwave-pulse 2s linear infinite;
                      }
                      @keyframes sparkwave-pulse {
                        0% { left: -100%; }
                        100% { left: 100%; }
                      }
                    `}</style>

                    {/* Ambient Glow Aura Simulator */}
                    <div 
                      className="absolute inset-0 z-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${heroSection.ambientGlow || '#ec4899'}1a, transparent 70%)`,
                        opacity: (heroSection.ambientIntensity || 80) / 100
                      }}
                    />

                    {/* LIVE SYNC FIGMA FLOATING INDICATOR */}
                    <div className="absolute top-0 right-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 font-mono text-[7px] tracking-widest select-none animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                      <span>LIVE SYNC ACTIVE</span>
                    </div>

                    {/* HERO LANDING PREVIEW */}
                    <div className="space-y-4 relative z-10 pt-2">
                      <span className="text-[7.5px] font-mono font-black text-pink-400 tracking-[0.3em] uppercase">LANDING EXPERIENCE</span>
                      <h2 
                        className="text-xl font-black text-white tracking-tight leading-none"
                        style={{
                          fontSize: devicePreview === 'mobile' ? '17px' : '22px'
                        }}
                      >
                        {previewTitle}
                      </h2>

                      {/* Rotating word deck simulation */}
                      <div className="text-xs font-mono font-bold flex flex-wrap items-center gap-1">
                        <span className="text-neutral-500 text-[10px]">I am a</span>
                        <span className="text-pink-400 tracking-wide text-[10px] py-0.5 px-2 bg-pink-500/5 border border-pink-500/25 rounded-md animate-pulse">
                          {(heroSection.rotatingLines || [])[previewRoleIndex] || "Visual Specialist"}
                        </span>
                      </div>

                      {/* Cinematic intro paragraph */}
                      <p 
                        className="text-[10px] text-neutral-400 leading-relaxed font-light font-sans pr-2"
                        style={{
                          fontSize: devicePreview === 'mobile' ? '9px' : '10.5px'
                        }}
                      >
                        {previewDescOne}
                      </p>

                      {/* Accent colors and typography demo card */}
                      <div className="flex flex-wrap gap-2 pt-2 items-center">
                        <button 
                          type="button" 
                          className="px-4 py-2 text-[9px] font-bold font-mono tracking-wider rounded-xl border transition-all text-white bg-pink-600/90 hover:bg-pink-500 select-none cursor-pointer border-0"
                          style={{
                            backgroundColor: themeSection.visualIdentity?.accentColor || '#ec4899',
                            boxShadow: `0 0 ${themeSection.visualIdentity?.glowIntensity || 75}px -5px ${themeSection.visualIdentity?.accentColor || '#ec4899'}`
                          }}
                        >
                          {heroSection.ctaLabel || 'EXPLORE EXPERIENCE'}
                        </button>

                        <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase tracking-widest pl-2">
                          Preset: {themeSection.visualIdentity?.gradientPreset || 'Fuchsia Twilight'}
                        </span>
                      </div>
                    </div>

                    {/* CINEMATIC NARRATIVE BLOCK */}
                    <div 
                      className="border border-neutral-850/80 bg-[#09070f]/80 rounded-2xl p-4 space-y-3 relative z-10 transition-all duration-300"
                      style={{
                        backdropFilter: `blur(${themeSection.visualIdentity?.glassBlur || 20}px)`
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/25 to-transparent"></div>
                      <span className="text-[7px] font-mono font-bold tracking-widest text-pink-400 uppercase">STORY PHILOSOPHY</span>
                      <h4 className="text-xs font-black text-white leading-tight">{heroSection.storyBlocks?.headline || 'Story Blocks Narrative'}</h4>
                      <p className="text-[9px] text-neutral-400 font-light leading-relaxed font-sans italic">"{heroSection.storyBlocks?.emotionalHook || 'Philosophical Hook'}"</p>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-850/50 text-[8.5px] leading-relaxed">
                        <div>
                          <span className="text-[7.5px] font-mono font-bold text-neutral-400 block uppercase mb-0.5">Design</span>
                          <span className="text-neutral-500 font-light font-sans line-clamp-3">{heroSection.storyBlocks?.designPhilosophy || 'Design Philosophy'}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] font-mono font-bold text-neutral-400 block uppercase mb-0.5">Engineering</span>
                          <span className="text-neutral-500 font-light font-sans line-clamp-3">{heroSection.storyBlocks?.engineeringPhilosophy || 'Engineering Philosophy'}</span>
                        </div>
                      </div>
                    </div>

                    {/* SKILL VISUALIZATION PROGRESS BARS */}
                    {expertiseCards.length > 0 && (
                      <div className="space-y-3 relative z-10">
                        <span className="text-[7.5px] font-mono font-black text-pink-400 tracking-[0.3em] uppercase">SKILL VISUALIZATIONS</span>
                        <div className="space-y-2">
                          {expertiseCards.map((skill, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 font-bold">
                                <span>{skill.title || 'Skill Arc'}</span>
                                <span className="text-pink-400">{skill.percentage || 80}%</span>
                              </div>
                              <div className="h-2 w-full bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full neon-bar-pulse transition-all duration-1000`}
                                  style={{
                                    width: `${skill.percentage || 80}%`,
                                    background: `linear-gradient(90deg, ${themeSection.visualIdentity?.accentColor || '#ec4899'}88, ${themeSection.visualIdentity?.accentColor || '#ec4899'})`,
                                    boxShadow: `0 0 ${skill.glowIntensity || 75}px ${themeSection.visualIdentity?.accentColor || '#ec4899'}`
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EXPERIENCE MAP ORBITING NODES DEMO */}
                    {statsCards.length > 0 && (
                      <div className="space-y-4 relative z-10 pt-2">
                        <span className="text-[7.5px] font-mono font-black text-pink-400 tracking-[0.3em] uppercase">EXPERIENCE RADIAL ORBITS</span>
                        
                        <div className="h-[210px] w-full border border-neutral-900 bg-neutral-950/70 rounded-2xl flex items-center justify-center relative overflow-hidden">
                          {/* Core badge */}
                          <div 
                            className="w-16 h-16 rounded-full bg-[#120718] border border-pink-500/25 flex flex-col items-center justify-center text-[8px] font-mono font-black text-white tracking-widest text-center shadow-lg relative z-20"
                            style={{
                              borderColor: themeSection.visualIdentity?.accentColor || '#ec4899',
                              boxShadow: `0 0 20px -5px ${themeSection.visualIdentity?.accentColor || '#ec4899'}`
                            }}
                          >
                            <span>KS</span>
                            <span className="text-[5.5px] text-pink-400 mt-0.5 leading-none">CORE</span>
                          </div>

                          {/* Render revolving nodes */}
                          {statsCards.slice(0, 4).map((node, i) => {
                            const radius = 55 + i * 15; // concentric orbital paths
                            const speed = node.orbitalSpeed || 10;
                            const glow = node.glowColor || '#ec4899';
                            return (
                              <div 
                                key={i}
                                className="absolute rounded-full border border-neutral-900 pointer-events-none"
                                style={{
                                  width: `${radius * 2}px`,
                                  height: `${radius * 2}px`,
                                }}
                              >
                                {/* Radial rotating wrapper */}
                                <div 
                                  className="nucleus-orbiter"
                                  style={{
                                    width: `${radius * 2}px`,
                                    height: `${radius * 2}px`,
                                    animationDuration: `${speed}s`,
                                    left: '0',
                                    top: '0',
                                    marginTop: `-${radius}px`,
                                    marginLeft: `-${radius}px`
                                  }}
                                >
                                  {/* Pulsing orbital node ball */}
                                  <div 
                                    className="w-5 h-5 rounded-full bg-[#17111d] border border-pink-500/40 absolute flex items-center justify-center shadow-md node-anchor pointer-events-auto cursor-help"
                                    style={{
                                      right: '-10px',
                                      top: '50%',
                                      marginTop: '-10px',
                                      borderColor: glow,
                                      boxShadow: `0 0 10px ${glow}`,
                                      animationDuration: `${speed}s`
                                    }}
                                    title={node.subtitle}
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-white" />
                                    {/* Small label offset */}
                                    <div className="absolute left-6 text-[6px] font-mono text-neutral-400 bg-neutral-950/80 px-1 py-0.5 rounded border border-neutral-850 whitespace-nowrap leading-none select-none font-bold uppercase">{node.title}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  /* ----------------------------------------------------------- */
                  /* ----------------- SD REGISTRY VIEW PREVIEW ---------------- */
                  /* ----------------------------------------------------------- */
                  <div className="space-y-12 relative z-10 text-left">
                    
                    {/* Background lighting simulation */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 [mask-image:radial-gradient(50%_50%,white,transparent_80%)]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/25 rounded-full blur-[60px]" />
                    </div>

                    {/* Hero section screen contents */}
                    <div className="space-y-4 relative z-10 text-left">
                      <span className="text-[8px] font-mono font-black text-primary tracking-[0.3em] uppercase">ABOUT ME</span>
                      <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{previewTitle}</h2>
                      
                      {/* Dynamic Roles carousel strip */}
                      <div className="text-xs font-mono font-bold flex flex-wrap items-center gap-1">
                        <span className="text-neutral-500">I build</span>
                        <span className="text-primary tracking-wide">
                          {["AI Systems", "Full-Stack Products", "Modern Web Apps", "Backend Architectures"][previewRoleIndex]}
                        </span>
                      </div>

                      {/* Bio descriptions */}
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-light font-sans pr-4">{previewDescOne}</p>
                      
                      {/* Visual Portrait Image Box */}
                      <div className="flex justify-center mt-6">
                        <div className="relative w-[150px] h-[190px] rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
                          <img 
                            src={previewImg} 
                            alt="Developer profile" 
                            className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tech Ticker strip simulation */}
                    <div className="py-3 border-y border-white/5 overflow-hidden relative z-10">
                      <style>{`
                        @keyframes visualMarquee {
                          0% { transform: translateX(0); }
                          100% { transform: translateX(-50%); }
                        }
                        .visual-marquee-container {
                          display: flex;
                          overflow: hidden;
                          white-space: nowrap;
                          width: 100%;
                        }
                        .visual-marquee-inner {
                          display: flex;
                          width: max-content;
                          animation: visualMarquee 15s linear infinite;
                        }
                      `}</style>
                      <div className="visual-marquee-container">
                        <div className="visual-marquee-inner">
                          {previewTech.concat(previewTech).map((tech, i) => (
                            <span key={i} className="text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-widest mx-4 inline-block">
                              {tech} <span className="text-neutral-700 ml-3">•</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rotating cards deck simulation */}
                    {expertiseCards.length > 0 && (
                      <div className="relative z-10 h-[220px] flex items-center justify-center">
                        {expertiseCards.map((card, i) => {
                          const isActive = previewExpIndex === i;
                          const isNext = (previewExpIndex + 1) % expertiseCards.length === i;
                          
                          let stackStyle = "z-0 scale-90 opacity-0 pointer-events-none";
                          if (isActive) {
                            stackStyle = "z-30 scale-100 opacity-100 translate-y-0";
                          } else if (isNext) {
                            stackStyle = "z-20 scale-95 opacity-55 translate-y-4";
                          }
                          
                          return (
                            <div 
                              key={i}
                              className={`absolute w-full max-w-[200px] h-[190px] rounded-xl border border-white/5 bg-neutral-900 p-4 shadow-2xl flex flex-col justify-between transition-all duration-500 ease-in-out ${stackStyle}`}
                              style={{
                                borderColor: card.accentColor === 'cyan' ? 'rgba(6, 182, 212, 0.25)' : (card.accentColor === 'amber' ? 'rgba(245, 158, 11, 0.25)' : (card.accentColor === 'green' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.25)'))
                              }}
                            >
                              <div className="text-[7px] font-mono font-bold tracking-widest text-primary uppercase">{card.label || 'CORE SPECIALTY'}</div>
                              <h4 className="text-[11px] font-bold text-white leading-tight mt-1 truncate">{card.title || 'Expertise Title'}</h4>
                              <p className="text-[9px] text-neutral-400 font-light leading-relaxed my-2 overflow-hidden line-clamp-3 font-sans">{card.description || 'Stack info details...'}</p>
                              
                              <div className="flex flex-wrap gap-1 border-t border-white/5 pt-1.5">
                                {(card.tags || []).slice(0, 3).map((tg: string, idx: number) => (
                                  <span key={idx} className="text-[7px] font-mono text-neutral-500">{tg} {idx < Math.min((card.tags || []).length, 3) - 1 && '•'}</span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Metrics stats row simulation */}
                    {previewStats.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 relative z-10 pt-4 pb-8">
                        {previewStats.slice(0, 4).map((m, idx) => {
                          const borderCol = m.color === 'cyan' ? 'border-cyan-500/20' : (m.color === 'amber' ? 'border-amber-500/20' : (m.color === 'green' ? 'border-emerald-500/20' : 'border-purple-500/20'));
                          return (
                            <div key={idx} className={`border ${borderCol} bg-[#121213]/40 rounded-xl p-3 flex flex-col justify-between h-[85px] shadow-md`}>
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/75 inline-block shrink-0" />
                                <span className="text-[9px] font-mono font-black text-white leading-none tracking-tight truncate">{m.value}</span>
                              </div>
                              
                              <div className="flex flex-col mt-1">
                                <span className="text-[7.5px] font-mono text-neutral-400 leading-none uppercase tracking-wider">{m.title}</span>
                                <span className="text-[7.5px] text-neutral-500 font-light font-sans truncate leading-normal mt-0.5">{m.subtitle}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
