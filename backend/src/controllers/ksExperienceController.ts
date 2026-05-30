import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Helper to save file locally for KS experience tenant
const saveLocalFile = (file: Express.Multer.File): string => {
  const targetDir = path.join(process.cwd(), 'uploads', 'ks', 'experience');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const targetPath = path.join(targetDir, fileName);
  fs.writeFileSync(targetPath, file.buffer);
  return `/uploads/ks/experience/${fileName}`;
};

export const getKSExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.kSExperienceEntry.findMany({
      where: { tenant: 'KS' },
      orderBy: { timelineOrder: 'asc' },
    });
    return res.status(200).json({ status: 'success', data: { experiences } });
  } catch (error) {
    console.error('getKSExperiences error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createKSExperience = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      companyName,
      roleTitle,
      employmentType,
      location,
      workMode,
      startDate,
      endDate,
      currentWorking,
      tagline,
      description,
      techStack,
      metrics,
      coverImage,
      backgroundImage,
      logo,
      accentColor,
      themeVariant,
      buttonText,
      buttonUrl,
      openInNewTab,
      timelineOrder,
      timelineVisible,
      timelineHighlight,
      timelineDotColor,
      featured,
      published
    } = req.body;

    const isFeatured = featured === 'true' || featured === true;

    // Only one featured entry logic for KS
    if (isFeatured) {
      await prisma.kSExperienceEntry.updateMany({
        where: { tenant: 'KS', featured: true },
        data: { featured: false }
      });
    }

    let parsedTechStack: string[] = [];
    if (typeof techStack === 'string') {
      try {
        parsedTechStack = JSON.parse(techStack);
      } catch {
        parsedTechStack = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(techStack)) {
      parsedTechStack = techStack;
    }

    let parsedMetrics: any[] = [];
    if (typeof metrics === 'string') {
      try {
        parsedMetrics = JSON.parse(metrics);
      } catch {
        parsedMetrics = [];
      }
    } else if (Array.isArray(metrics)) {
      parsedMetrics = metrics;
    }

    const experience = await prisma.kSExperienceEntry.create({
      data: {
        tenant: 'KS',
        companyName: companyName || '',
        roleTitle: roleTitle || '',
        employmentType: employmentType || 'Full-time',
        location: location || '',
        workMode: workMode || 'Remote',
        startDate: startDate || '',
        endDate: endDate || '',
        currentWorking: currentWorking === 'true' || currentWorking === true,
        tagline: tagline || '',
        description: description || '',
        techStack: parsedTechStack,
        metrics: parsedMetrics,
        coverImage: coverImage || null,
        backgroundImage: backgroundImage || null,
        logo: logo || null,
        accentColor: accentColor || '#ec4899',
        themeVariant: themeVariant || 'glass',
        buttonText: buttonText || null,
        buttonUrl: buttonUrl || null,
        openInNewTab: openInNewTab === 'true' || openInNewTab === true,
        timelineOrder: Number(timelineOrder) || 0,
        timelineVisible: timelineVisible !== 'false' && timelineVisible !== false,
        timelineHighlight: timelineHighlight === 'true' || timelineHighlight === true,
        timelineDotColor: timelineDotColor || null,
        featured: isFeatured,
        published: published !== 'false' && published !== false,
      }
    });

    return res.status(201).json({ status: 'success', data: { experience } });
  } catch (error) {
    console.error('createKSExperience error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateKSExperience = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      roleTitle,
      employmentType,
      location,
      workMode,
      startDate,
      endDate,
      currentWorking,
      tagline,
      description,
      techStack,
      metrics,
      coverImage,
      backgroundImage,
      logo,
      accentColor,
      themeVariant,
      buttonText,
      buttonUrl,
      openInNewTab,
      timelineOrder,
      timelineVisible,
      timelineHighlight,
      timelineDotColor,
      featured,
      published
    } = req.body;

    const existing = await prisma.kSExperienceEntry.findFirst({
      where: { id, tenant: 'KS' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    const isFeatured = featured === 'true' || featured === true;

    // Only one featured entry logic for KS
    if (isFeatured && !existing.featured) {
      await prisma.kSExperienceEntry.updateMany({
        where: { tenant: 'KS', featured: true, NOT: { id } },
        data: { featured: false }
      });
    }

    let parsedTechStack = existing.techStack;
    if (techStack !== undefined) {
      if (typeof techStack === 'string') {
        try {
          parsedTechStack = JSON.parse(techStack);
        } catch {
          parsedTechStack = techStack.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(techStack)) {
        parsedTechStack = techStack;
      }
    }

    let parsedMetrics = existing.metrics;
    if (metrics !== undefined) {
      if (typeof metrics === 'string') {
        try {
          parsedMetrics = JSON.parse(metrics);
        } catch {
          parsedMetrics = [];
        }
      } else if (Array.isArray(metrics)) {
        parsedMetrics = metrics;
      }
    }

    const updated = await prisma.kSExperienceEntry.update({
      where: { id },
      data: {
        companyName: companyName !== undefined ? companyName : existing.companyName,
        roleTitle: roleTitle !== undefined ? roleTitle : existing.roleTitle,
        employmentType: employmentType !== undefined ? employmentType : existing.employmentType,
        location: location !== undefined ? location : existing.location,
        workMode: workMode !== undefined ? workMode : existing.workMode,
        startDate: startDate !== undefined ? startDate : existing.startDate,
        endDate: endDate !== undefined ? endDate : existing.endDate,
        currentWorking: currentWorking !== undefined ? (currentWorking === 'true' || currentWorking === true) : existing.currentWorking,
        tagline: tagline !== undefined ? tagline : existing.tagline,
        description: description !== undefined ? description : existing.description,
        techStack: parsedTechStack,
        metrics: parsedMetrics ?? [],
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        backgroundImage: backgroundImage !== undefined ? backgroundImage : existing.backgroundImage,
        logo: logo !== undefined ? logo : existing.logo,
        accentColor: accentColor !== undefined ? accentColor : existing.accentColor,
        themeVariant: themeVariant !== undefined ? themeVariant : existing.themeVariant,
        buttonText: buttonText !== undefined ? buttonText : existing.buttonText,
        buttonUrl: buttonUrl !== undefined ? buttonUrl : existing.buttonUrl,
        openInNewTab: openInNewTab !== undefined ? (openInNewTab === 'true' || openInNewTab === true) : existing.openInNewTab,
        timelineOrder: timelineOrder !== undefined ? Number(timelineOrder) : existing.timelineOrder,
        timelineVisible: timelineVisible !== undefined ? (timelineVisible !== 'false' && timelineVisible !== false) : existing.timelineVisible,
        timelineHighlight: timelineHighlight !== undefined ? (timelineHighlight === 'true' || timelineHighlight === true) : existing.timelineHighlight,
        timelineDotColor: timelineDotColor !== undefined ? timelineDotColor : existing.timelineDotColor,
        featured: isFeatured,
        published: published !== undefined ? (published !== 'false' && published !== false) : existing.published,
      }
    });

    return res.status(200).json({ status: 'success', data: { experience: updated } });
  } catch (error) {
    console.error('updateKSExperience error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteKSExperience = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.kSExperienceEntry.findFirst({
      where: { id, tenant: 'KS' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    await prisma.kSExperienceEntry.delete({ where: { id } });
    return res.status(200).json({ status: 'success', message: 'Experience entry deleted successfully' });
  } catch (error) {
    console.error('deleteKSExperience error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const uploadKSExperienceMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Save file buffer locally
    const relativeUrl = saveLocalFile(file);

    return res.status(200).json({
      status: 'success',
      data: { imageUrl: relativeUrl }
    });
  } catch (error) {
    console.error('uploadKSExperienceMedia error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
