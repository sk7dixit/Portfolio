import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Default dynamic fallback configuration matching Mahi's cinematic About/Hero sections
const DEFAULT_BRAND_IDENTITY = {
  navbar: {
    brandName: "Mahi Singh",
    statusDotColor: "#f97316", // orange-500
    resumeButtonText: "Resume",
    resumeUrl: "/uploads/portfolio/ms/resume.pdf"
  },
  hero: {
    introHeadingLine1: "Hi, I'm",
    mainName: "Mahi Singh",
    accentGradientStart: "#fb923c", // orange-400
    accentGradientEnd: "#f59e0b", // amber-500
    availabilityBadge: "B.Tech CSE Student // AVAILABLE FOR ROLES",
    subtitleLine1: "Building Digital Experiences",
    subtitleLine2: "For Modern Businesses"
  },
  biography: {
    biography: "I’m a Computer Science Engineering student passionate about crafting clean interfaces, AI-driven automations, and robust MERN systems that combine fluid design with powerful frontend logic."
  },
  ctas: {
    primaryCTAText: "View My Work",
    primaryCTAUrl: "projects",
    secondaryCTAText: "Let's Connect",
    secondaryCTAUrl: "contact"
  },
  backgroundMedia: {
    heroBackgroundImage: "/mahi.mp4",
    overlayStrength: 0.28,
    blurIntensity: 0,
    darkGradientOpacity: 0.12
  },
  aboutSection: {
    aboutHeading: "ABOUT",
    aboutMainText: "Building modern web applications with clean code, smart AI features, and user-friendly designs.",
    leftAccentLineColor: "#f97316"
  },
  timeline: [
    {
      year: "2023",
      label: "College Start",
      title: "Started B.Tech CSE",
      description: "Began my Computer Science degree. Focused on the basics of programming in C and C++, learning how databases work, and solving simple logic challenges.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "2024",
      label: "Building Websites",
      title: "Web Development",
      description: "Dived into web development. Learned how to build complete websites using React, Node.js, Express, and database systems with simple and clear designs.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "2025",
      label: "Smart Tools",
      title: "AI & Mapping Apps",
      description: "Started connecting AI models and maps to my web projects. Built a smart Accident Hotspot app that maps out high-risk traffic intersections in real time.",
      activeDotColor: "#f97316",
      currentStage: false
    },
    {
      year: "Current",
      label: "Daily Practice",
      title: "Algorithms & Practice",
      description: "Currently practicing coding algorithms in Java, learning how to design solid systems, and building helpful projects.",
      activeDotColor: "#f97316",
      currentStage: true
    }
  ],
  overviewCard: {
    education: {
      degree: "B.Tech in Computer Science",
      university: "Parul University",
      duration: "2023 — 2027",
      grade: "8.37 CGPA"
    },
    focus: {
      focusHeading: "Current Focus",
      focusDescription: "Building responsive websites, studying AI integrations, and learning to write clean, efficient code."
    },
    techStack: ["Python", "React.js", "Next.js", "MongoDB", "AWS"],
    highlights: [
      { label: "College CGPA", value: "8.37" },
      { label: "Hackathon Rank", value: "Top 6%" },
      { label: "AWS Certified", value: "AWS" },
      { label: "Core Focus", value: "AI + Web" }
    ],
    availability: {
      availabilityText: "Available for projects and collaboration",
      availabilityEnabled: true
    }
  },
  visualSettings: {
    primaryAccent: "#f97316", // orange-500
    secondaryAccent: "#fb923c", // orange-400
    glowColor: "rgba(251, 146, 60, 0.15)",
    cardGlassOpacity: 0.1
  }
};

// Helper to save file locally for Mahi's brand media assets
const saveLocalBrandFile = (file: Express.Multer.File): string => {
  const targetDir = path.join(process.cwd(), 'uploads', 'ms', 'brand');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const targetPath = path.join(targetDir, fileName);
  fs.writeFileSync(targetPath, file.buffer);
  return `/uploads/ms/brand/${fileName}`;
};

export const getMSBrandIdentity = async (req: Request, res: Response) => {
  try {
    const record = await prisma.mSBrandIdentity.findFirst({
      where: { tenant: 'MS' }
    });

    if (!record) {
      return res.status(200).json({ status: 'success', data: { brandIdentity: DEFAULT_BRAND_IDENTITY } });
    }

    return res.status(200).json({ status: 'success', data: { brandIdentity: record } });
  } catch (error) {
    console.error('getMSBrandIdentity error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const upsertMSBrandIdentity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      navbar,
      hero,
      biography,
      ctas,
      backgroundMedia,
      aboutSection,
      timeline,
      overviewCard,
      visualSettings
    } = req.body;

    const existing = await prisma.mSBrandIdentity.findFirst({
      where: { tenant: 'MS' }
    });

    let record;
    if (existing) {
      record = await prisma.mSBrandIdentity.update({
        where: { id: existing.id },
        data: {
          navbar: navbar !== undefined ? navbar : existing.navbar,
          hero: hero !== undefined ? hero : existing.hero,
          biography: biography !== undefined ? biography : existing.biography,
          ctas: ctas !== undefined ? ctas : existing.ctas,
          backgroundMedia: backgroundMedia !== undefined ? backgroundMedia : existing.backgroundMedia,
          aboutSection: aboutSection !== undefined ? aboutSection : existing.aboutSection,
          timeline: timeline !== undefined ? timeline : existing.timeline,
          overviewCard: overviewCard !== undefined ? overviewCard : existing.overviewCard,
          visualSettings: visualSettings !== undefined ? visualSettings : existing.visualSettings
        }
      });
    } else {
      record = await prisma.mSBrandIdentity.create({
        data: {
          tenant: 'MS',
          navbar: navbar || DEFAULT_BRAND_IDENTITY.navbar,
          hero: hero || DEFAULT_BRAND_IDENTITY.hero,
          biography: biography || DEFAULT_BRAND_IDENTITY.biography,
          ctas: ctas || DEFAULT_BRAND_IDENTITY.ctas,
          backgroundMedia: backgroundMedia || DEFAULT_BRAND_IDENTITY.backgroundMedia,
          aboutSection: aboutSection || DEFAULT_BRAND_IDENTITY.aboutSection,
          timeline: timeline || DEFAULT_BRAND_IDENTITY.timeline,
          overviewCard: overviewCard || DEFAULT_BRAND_IDENTITY.overviewCard,
          visualSettings: visualSettings || DEFAULT_BRAND_IDENTITY.visualSettings
        }
      });
    }

    // Broadcast via Socket.IO
    const ioInstance = req.app.get('io');
    if (ioInstance) {
      console.log('⚡ Socket emitting brand_identity_ms:updated to room portfolio:mahi');
      ioInstance.to('portfolio:mahi').emit('brand_identity_ms:updated', { brandIdentity: record });
    }

    return res.status(200).json({ status: 'success', data: { brandIdentity: record } });
  } catch (error) {
    console.error('upsertMSBrandIdentity error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const uploadMSBrandMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const relativeUrl = saveLocalBrandFile(file);

    return res.status(200).json({
      status: 'success',
      data: { url: relativeUrl }
    });
  } catch (error) {
    console.error('uploadMSBrandMedia error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
