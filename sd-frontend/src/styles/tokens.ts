// Design Tokens System for Cinematic Portfolio Redesign (Phase 3)

export const colors = {
  background: {
    primary: "#070707",
    secondary: "#0B0B0F",
    tertiary: "#101014",
  },

  accent: {
    emerald: "#00F5B4",
    blue: "#4D7CFE",
    purple: "#8B5CF6",
    danger: "#FF5D73",
    amber: "#FBBF24",
  },

  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    muted: "#52525B",
  },
};

export const spacing = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "48px",
  xxl: "64px",
  section: "120px",
};

export const typography = {
  hero: "text-5xl md:text-8xl font-black tracking-tighter uppercase font-heading",
  heading: "text-3xl md:text-5xl font-black tracking-tighter uppercase font-heading",
  subheading: "text-xl md:text-2xl font-bold tracking-tight font-heading",
  body: "text-sm md:text-base font-light leading-relaxed",
  caption: "text-[10px] font-mono uppercase tracking-widest text-[#52525B]",
};

export const glass = {
  primary: `
    bg-[#0A0A0C]/90
    backdrop-blur-2xl
    border border-white/[0.08]
    shadow-2xl
  `,
  primaryHover: `
    hover:bg-[#0F0F12]/95
    hover:border-white/[0.16]
    hover:shadow-2xl
  `
};

// Physics-based Spring and Transition Presets for Framer Motion
export const motionPresets = {
  springGentle: {
    type: "spring",
    stiffness: 260,
    damping: 26,
  },
  springBouncy: {
    type: "spring",
    stiffness: 300,
    damping: 18,
  },
  transitionFast: {
    duration: 0.2,
    ease: "easeOut",
  },
  transitionSlow: {
    duration: 0.65,
    ease: [0.16, 1, 0.3, 1], // Custom Cubic Bezier curve
  },
};

export const animations = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  },
  staggerContainer: {
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
};
