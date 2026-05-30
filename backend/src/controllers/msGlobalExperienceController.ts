import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const DEFAULT_GLOBAL_EXPERIENCE = {
  header: {
    brandName: "Mahi Singh",
    navItems: [
      { label: "ABOUT", route: "/", enabled: true, order: 1 },
      { label: "SKILLS", route: "/skills", enabled: true, order: 2 },
      { label: "PROJECTS", route: "/projects", enabled: true, order: 3 },
      { label: "ACHIEVEMENTS", route: "/achievements", enabled: true, order: 4 },
      { label: "CERTIFICATES", route: "/certificates", enabled: true, order: 5 },
      { label: "JOURNEY", route: "/journey", enabled: true, order: 6 },
      { label: "CONTACT", route: "/contact", enabled: true, order: 7 }
    ],
    resumeButton: {
      text: "Resume",
      url: "http://localhost:5000/api/portfolio/resume"
    },
    visuals: {
      headerGlassOpacity: 60,
      blurStrength: 20,
      borderGlow: "glow-pink",
      activeNavGlow: "glow-pink",
      stickyEnabled: true,
      shrinkOnScroll: true,
      blurOnScroll: true
    }
  },
  footer: {
    heading: "Designed & Developed by Mahi Singh",
    techStackText: "BUILT WITH REACT, TAILWIND CSS & FRAMER MOTION",
    visuals: {
      footerEnabled: true,
      footerGlassEffect: true,
      footerBlur: 20,
      footerTextColor: "#ffffff",
      footerAccentColor: "#f97316",
      footerOpacity: 90
    }
  },
  sections: [
    { name: "About", route: "/", enabled: true, order: 1 },
    { name: "Skills", route: "/skills", enabled: true, order: 2 },
    { name: "Projects", route: "/projects", enabled: true, order: 3 },
    { name: "Achievements", route: "/achievements", enabled: true, order: 4 },
    { name: "Certificates", route: "/certificates", enabled: true, order: 5 },
    { name: "Journey", route: "/journey", enabled: true, order: 6 },
    { name: "Contact", route: "/contact", enabled: true, order: 7 }
  ],
  theme: {
    primaryAccent: "#f97316",
    secondaryAccent: "#fb923c",
    gradientOverlay: "rgba(245, 158, 11, 0.15)",
    glowIntensity: 75,
    cinematicDarkness: 28
  },
  layout: {
    sectionGap: 48,
    maxWidth: 1280,
    animationSpeed: 0.8,
    scrollSmoothness: 1
  }
};

export const getMSGlobalExperience = async (req: Request, res: Response) => {
  try {
    const record = await prisma.mSGlobalExperience.findFirst({
      where: { tenant: 'MS' }
    });

    if (!record) {
      return res.status(200).json({
        status: 'success',
        data: { globalExperience: DEFAULT_GLOBAL_EXPERIENCE }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { globalExperience: record }
    });
  } catch (error) {
    console.error('getMSGlobalExperience error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const upsertMSGlobalExperience = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { header, footer, sections, theme, layout } = req.body;

    const existing = await prisma.mSGlobalExperience.findFirst({
      where: { tenant: 'MS' }
    });

    let record;
    if (existing) {
      record = await prisma.mSGlobalExperience.update({
        where: { id: existing.id },
        data: {
          header: header !== undefined ? header : existing.header,
          footer: footer !== undefined ? footer : existing.footer,
          sections: sections !== undefined ? sections : existing.sections,
          theme: theme !== undefined ? theme : existing.theme,
          layout: layout !== undefined ? layout : existing.layout
        }
      });
    } else {
      record = await prisma.mSGlobalExperience.create({
        data: {
          tenant: 'MS',
          header: header || DEFAULT_GLOBAL_EXPERIENCE.header,
          footer: footer || DEFAULT_GLOBAL_EXPERIENCE.footer,
          sections: sections || DEFAULT_GLOBAL_EXPERIENCE.sections,
          theme: theme || DEFAULT_GLOBAL_EXPERIENCE.theme,
          layout: layout || DEFAULT_GLOBAL_EXPERIENCE.layout
        }
      });
    }

    // Broadcast via Socket.IO
    const ioInstance = req.app.get('io');
    if (ioInstance) {
      console.log('⚡ Socket emitting global_experience_ms:updated to room portfolio:mahi');
      ioInstance.to('portfolio:mahi').emit('global_experience_ms:updated', { globalExperience: record });
    }

    return res.status(200).json({
      status: 'success',
      data: { globalExperience: record }
    });
  } catch (error) {
    console.error('upsertMSGlobalExperience error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const saveLocalGlobalExperienceFile = (file: Express.Multer.File): string => {
  const targetDir = path.join(process.cwd(), 'uploads', 'ms', 'global-experience');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const targetPath = path.join(targetDir, fileName);
  fs.writeFileSync(targetPath, file.buffer);
  return `/uploads/ms/global-experience/${fileName}`;
};

export const uploadMSGlobalExperienceMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const relativeUrl = saveLocalGlobalExperienceFile(file);

    return res.status(200).json({
      status: 'success',
      data: { url: relativeUrl }
    });
  } catch (error) {
    console.error('uploadMSGlobalExperienceMedia error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
