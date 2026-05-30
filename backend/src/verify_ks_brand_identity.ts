import { PrismaClient } from '@prisma/client';

const API_BASE = 'http://localhost:5000/api';

async function request(url: string, options: any = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

async function verify() {
  console.log('🧪 Starting KS Brand Identity & Creative Experience Studio Verification...\n');
  
  // 1. Authenticate KS user
  console.log('🔑 Authenticating khushboosaini066@gmail.com...');
  const authRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: { email: 'khushboosaini066@gmail.com', password: 'khushaboo123' }
  });
  
  const token = authRes.token;
  console.log('✅ Authenticated successfully! Token captured.\n');
  
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 2. Fetch Active KS Profile Configs
  console.log('📡 Fetching active KS profile configurations...');
  const meRes = await request(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: authHeaders
  });
  const originalProfile = meRes.data.user.profile;
  console.log(`✅ Current Headline: "${originalProfile.headline}"`);
  console.log(`✅ Current Bio length: ${originalProfile.bio.length} characters\n`);

  // 3. Perform Experience Studio Save
  console.log('✍️ Composing brand-identity layout changes (Fuchsia Cinematic Preset)...');
  
  const ksHero = {
    title: "Hi, I'm Khushaboo Saini",
    introParagraph: "I am a creative visual engineer and premium UI designer.",
    rotatingLines: ["Creative Architect", "Interaction Specialist"],
    ctaLabel: "EXPLORE STUDIO",
    highlightGradients: "Creative, Visual",
    ambientGlow: "#ec4899",
    ambientIntensity: 85,
    storyBlocks: {
      headline: "Crafting High-Fidelity Spaces",
      subheadline: "Visual interactions & modular design",
      emotionalHook: "Every pixel shapes an emotion.",
      designPhilosophy: "Visual delight and structure.",
      engineeringPhilosophy: "Hardware-accelerated rendering."
    }
  };

  const ksTheme = {
    visualIdentity: {
      accentColor: "#ec4899",
      glowIntensity: 85,
      glassBlur: 25,
      gradientPreset: "Sunset Neon",
      typographyStyle: "Outfit",
      floatingParticles: { enabled: true, count: 50, speed: 2.0 }
    },
    motionSystem: {
      transitionSpeed: 0.3,
      scrollInterpolation: 60,
      hoverBehavior: "Magnetic Pull",
      cardRevealStyle: "Spring Rise",
      mouseTracking: true,
      backgroundBlurMotion: true
    },
    cinematicMedia: {
      mediaType: "video",
      mediaUrl: "/uploads/portfolio/ks/cinematic-bg.mp4",
      overlayDarkness: 75,
      motionBlur: 12,
      opacity: 85,
      focusPoint: "Center"
    },
    resumeControl: {
      publicPdfUrl: "https://drive.google.com/ks-resume",
      directDownload: true,
      openModalPreview: false,
      animatedIntro: "Inspect my premium CV containing over 4 years of visual engineering expertise.",
      customCta: "INSPECT CURRICULUM VITAE"
    },
    responsiveControls: {
      mobileHeroOffset: 25,
      fontScaling: 105,
      mobileBlurReduction: true,
      animationDisable: false
    }
  };

  const updateRes = await request(`${API_BASE}/portfolio/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: {
      headline: "Creative Frontend & UI Architect",
      bio: "Visual interface specialist who designs immersive, animation-heavy portfolios.",
      heroSection: ksHero,
      themeSection: ksTheme
    }
  });
  
  console.log('✅ Visual Studio specifications written to PostgreSQL!');
  const savedProfile = updateRes.data.profile;

  // 4. Verification assertions
  console.log('🧐 Auditing saved configuration values in DB response...');
  if (savedProfile.headline === "Creative Frontend & UI Architect" &&
      savedProfile.heroSection.ctaLabel === "EXPLORE STUDIO" &&
      savedProfile.themeSection.visualIdentity.gradientPreset === "Sunset Neon" &&
      savedProfile.themeSection.motionSystem.hoverBehavior === "Magnetic Pull") {
    console.log('✅ Assertions passed! Multi-tenant brand identity variables stored and mapped flawlessly!');
  } else {
    throw new Error('Database response does not contain the updated visual config settings.');
  }

  // 5. Revert back to original profile state so database remains clean
  console.log('\n🧹 Restoring original KS profile configurations...');
  await request(`${API_BASE}/portfolio/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: {
      headline: originalProfile.headline,
      bio: originalProfile.bio,
      heroSection: originalProfile.heroSection,
      themeSection: originalProfile.themeSection,
      statsCards: originalProfile.statsCards,
      expertiseCards: originalProfile.expertiseCards
    }
  });
  console.log('✅ KS database profile state cleaned successfully.\n');
  console.log('🎉 E2E Brand Identity Studio integration verification successful! Excellent work!');
}

verify().catch(err => {
  console.error('\n❌ E2E Brand Identity Verification Failed:');
  console.error(err.message || err);
  process.exit(1);
});
