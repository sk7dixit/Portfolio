import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Helper to save file locally for KS certificates segmented by type (thumbnails, proofs, modal-images)
const saveLocalCertificateFile = (file: Express.Multer.File, type: string): string => {
  const targetDir = path.join(process.cwd(), 'uploads', 'ks', 'certificates', type);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const targetPath = path.join(targetDir, fileName);
  fs.writeFileSync(targetPath, file.buffer);
  return `/uploads/ks/certificates/${type}/${fileName}`;
};

export const getKSCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await prisma.kSCertificate.findMany({
      where: { tenant: 'KS' },
      orderBy: { displayOrder: 'asc' },
    });
    return res.status(200).json({ status: 'success', data: { certificates } });
  } catch (error) {
    console.error('getKSCertificates error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createKSCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      issuer,
      credentialId,
      issueDate,
      expiryDate,
      neverExpires,
      shortDescription,
      detailedDescription,
      artwork,
      modalImage,
      accentColor,
      glowColor,
      themeStyle,
      skills,
      verificationEnabled,
      verificationUrl,
      verifiedProofBadge,
      certificatePdf,
      modalLearningOutcomes,
      modalSkillDomainsHeading,
      modalExtraNotes,
      modalAchievementLevel,
      featured,
      published,
      displayOrder,
      showInHero,
      enableModal,
    } = req.body;

    const isFeatured = featured === 'true' || featured === true;

    // Enforce featured rule: Only one featured certificate for tenant = KS
    if (isFeatured) {
      await prisma.kSCertificate.updateMany({
        where: { tenant: 'KS', featured: true },
        data: { featured: false },
      });
    }

    let parsedSkills: string[] = [];
    if (typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(skills)) {
      parsedSkills = skills;
    }

    const certificate = await prisma.kSCertificate.create({
      data: {
        tenant: 'KS',
        title: title || '',
        issuer: issuer || '',
        credentialId: credentialId || '',
        issueDate: issueDate || '',
        expiryDate: expiryDate || null,
        neverExpires: neverExpires === 'true' || neverExpires === true,
        shortDescription: shortDescription || '',
        detailedDescription: detailedDescription || '',
        artwork: artwork || null,
        modalImage: modalImage || null,
        accentColor: accentColor || '#a855f7',
        glowColor: glowColor || 'rgba(168, 85, 247, 0.15)',
        themeStyle: themeStyle || 'glass-dark',
        skills: parsedSkills,
        verificationEnabled: verificationEnabled === 'true' || verificationEnabled === true,
        verificationUrl: verificationUrl || null,
        verifiedProofBadge: verifiedProofBadge === 'true' || verifiedProofBadge === true,
        certificatePdf: certificatePdf || null,
        modalLearningOutcomes: modalLearningOutcomes || '',
        modalSkillDomainsHeading: modalSkillDomainsHeading || 'Skills Mastered',
        modalExtraNotes: modalExtraNotes || '',
        modalAchievementLevel: modalAchievementLevel || 'Intermediate',
        featured: isFeatured,
        published: published !== 'false' && published !== false,
        displayOrder: Number(displayOrder) || 0,
        showInHero: showInHero !== 'false' && showInHero !== false,
        enableModal: enableModal !== 'false' && enableModal !== false,
      },
    });

    return res.status(201).json({ status: 'success', data: { certificate } });
  } catch (error) {
    console.error('createKSCertificate error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateKSCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      issuer,
      credentialId,
      issueDate,
      expiryDate,
      neverExpires,
      shortDescription,
      detailedDescription,
      artwork,
      modalImage,
      accentColor,
      glowColor,
      themeStyle,
      skills,
      verificationEnabled,
      verificationUrl,
      verifiedProofBadge,
      certificatePdf,
      modalLearningOutcomes,
      modalSkillDomainsHeading,
      modalExtraNotes,
      modalAchievementLevel,
      featured,
      published,
      displayOrder,
      showInHero,
      enableModal,
    } = req.body;

    const existing = await prisma.kSCertificate.findFirst({
      where: { id, tenant: 'KS' },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const isFeatured = featured === 'true' || featured === true;

    // Enforce featured rule: Only one featured certificate for tenant = KS
    if (isFeatured && !existing.featured) {
      await prisma.kSCertificate.updateMany({
        where: { tenant: 'KS', featured: true, NOT: { id } },
        data: { featured: false },
      });
    }

    let parsedSkills = existing.skills;
    if (skills !== undefined) {
      if (typeof skills === 'string') {
        try {
          parsedSkills = JSON.parse(skills);
        } catch {
          parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(skills)) {
        parsedSkills = skills;
      }
    }

    const updated = await prisma.kSCertificate.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        issuer: issuer !== undefined ? issuer : existing.issuer,
        credentialId: credentialId !== undefined ? credentialId : existing.credentialId,
        issueDate: issueDate !== undefined ? issueDate : existing.issueDate,
        expiryDate: expiryDate !== undefined ? expiryDate : existing.expiryDate,
        neverExpires: neverExpires !== undefined ? (neverExpires === 'true' || neverExpires === true) : existing.neverExpires,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        detailedDescription: detailedDescription !== undefined ? detailedDescription : existing.detailedDescription,
        artwork: artwork !== undefined ? artwork : existing.artwork,
        modalImage: modalImage !== undefined ? modalImage : existing.modalImage,
        accentColor: accentColor !== undefined ? accentColor : existing.accentColor,
        glowColor: glowColor !== undefined ? glowColor : existing.glowColor,
        themeStyle: themeStyle !== undefined ? themeStyle : existing.themeStyle,
        skills: parsedSkills,
        verificationEnabled: verificationEnabled !== undefined ? (verificationEnabled === 'true' || verificationEnabled === true) : existing.verificationEnabled,
        verificationUrl: verificationUrl !== undefined ? verificationUrl : existing.verificationUrl,
        verifiedProofBadge: verifiedProofBadge !== undefined ? (verifiedProofBadge === 'true' || verifiedProofBadge === true) : existing.verifiedProofBadge,
        certificatePdf: certificatePdf !== undefined ? certificatePdf : existing.certificatePdf,
        modalLearningOutcomes: modalLearningOutcomes !== undefined ? modalLearningOutcomes : existing.modalLearningOutcomes,
        modalSkillDomainsHeading: modalSkillDomainsHeading !== undefined ? modalSkillDomainsHeading : existing.modalSkillDomainsHeading,
        modalExtraNotes: modalExtraNotes !== undefined ? modalExtraNotes : existing.modalExtraNotes,
        modalAchievementLevel: modalAchievementLevel !== undefined ? modalAchievementLevel : existing.modalAchievementLevel,
        featured: isFeatured,
        published: published !== undefined ? (published !== 'false' && published !== false) : existing.published,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
        showInHero: showInHero !== undefined ? (showInHero !== 'false' && showInHero !== false) : existing.showInHero,
        enableModal: enableModal !== undefined ? (enableModal !== 'false' && enableModal !== false) : existing.enableModal,
      },
    });

    return res.status(200).json({ status: 'success', data: { certificate: updated } });
  } catch (error) {
    console.error('updateKSCertificate error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteKSCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.kSCertificate.findFirst({
      where: { id, tenant: 'KS' },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await prisma.kSCertificate.delete({ where: { id } });
    return res.status(200).json({ status: 'success', message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('deleteKSCertificate error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const uploadKSCertificateMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    if (!['thumbnails', 'proofs', 'modal-images'].includes(type)) {
      return res.status(400).json({ message: 'Invalid media upload segment type' });
    }

    const relativeUrl = saveLocalCertificateFile(file, type);

    return res.status(200).json({
      status: 'success',
      data: { url: relativeUrl },
    });
  } catch (error) {
    console.error('uploadKSCertificateMedia error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getKSCertificateHero = async (req: Request, res: Response) => {
  try {
    const hero = await prisma.kSCertificateHeroCMS.findFirst({
      where: { tenant: 'KS' },
    });
    return res.status(200).json({ status: 'success', data: { hero } });
  } catch (error) {
    console.error('getKSCertificateHero error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const upsertKSCertificateHero = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { badgeText, mainHeading, subtitle, accentColor, bgOverlayStrength } = req.body;

    const existing = await prisma.kSCertificateHeroCMS.findFirst({
      where: { tenant: 'KS' },
    });

    let hero;
    if (existing) {
      hero = await prisma.kSCertificateHeroCMS.update({
        where: { id: existing.id },
        data: {
          badgeText: badgeText !== undefined ? badgeText : existing.badgeText,
          mainHeading: mainHeading !== undefined ? mainHeading : existing.mainHeading,
          subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
          accentColor: accentColor !== undefined ? accentColor : existing.accentColor,
          bgOverlayStrength: bgOverlayStrength !== undefined ? Number(bgOverlayStrength) : existing.bgOverlayStrength,
        },
      });
    } else {
      hero = await prisma.kSCertificateHeroCMS.create({
        data: {
          tenant: 'KS',
          badgeText: badgeText || 'CERTIFICATIONS',
          mainHeading: mainHeading || 'Showcasing Professional Excellence',
          subtitle: subtitle || 'Verifiable credentials, technical competencies, and professional achievements.',
          accentColor: accentColor || '#a855f7',
          bgOverlayStrength: bgOverlayStrength !== undefined ? Number(bgOverlayStrength) : 0.5,
        },
      });
    }

    return res.status(200).json({ status: 'success', data: { hero } });
  } catch (error) {
    console.error('upsertKSCertificateHero error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
