import { Response } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

export const getPortfolioBySlug = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;

    const user = await prisma.user.findUnique({
      where: { portfolioSlug: slug },
      select: {
        id: true,
        name: true,
        email: true,
        portfolioSlug: true,
        role: true,
        theme: true,
        profile: true,
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        skills: {
          orderBy: { category: 'asc' },
        },
        certificates: {
          orderBy: { createdAt: 'desc' },
        },
        internships: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Extract dynamic projects array from projectsSection JSON if active
    let activeProjects = user.projects;
    if (user.profile?.projectsSection) {
      const sec = typeof user.profile.projectsSection === 'string'
        ? JSON.parse(user.profile.projectsSection)
        : user.profile.projectsSection;
      
      if (sec.projects && sec.projects.length > 0) {
        activeProjects = sec.projects.map((p: any) => ({
          id: p.id,
          userId: user.id,
          title: p.title,
          description: p.description,
          techStack: p.technologies || p.techStack || [],
          githubUrl: p.githubUrl || null,
          liveUrl: p.demoUrl || p.liveUrl || null,
          thumbnail: p.image || null,
          featured: p.featured || false,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }
    }

    // Extract dynamic certificates array from certificatesSection JSON if active
    let activeCertificates = user.certificates;
    if (user.profile?.certificatesSection) {
      const sec = typeof user.profile.certificatesSection === 'string'
        ? JSON.parse(user.profile.certificatesSection)
        : user.profile.certificatesSection;

      if (sec.certificates && sec.certificates.length > 0) {
        activeCertificates = sec.certificates.map((c: any) => ({
          id: c.id,
          userId: user.id,
          title: c.title,
          organization: c.issuer,
          issueDate: c.issueDate,
          credentialLink: c.credentialUrl || null,
          certificateImage: c.certificateImage || null,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }
    }

    // Extract dynamic internships array from internshipsSection JSON if active
    let activeInternships = user.internships;
    if (user.profile?.internshipsSection) {
      const sec = typeof user.profile.internshipsSection === 'string'
        ? JSON.parse(user.profile.internshipsSection)
        : user.profile.internshipsSection;

      if (sec.internships && sec.internships.length > 0) {
        activeInternships = sec.internships.map((intern: any) => ({
          id: intern.id,
          userId: user.id,
          companyName: intern.company,
          role: intern.role,
          duration: intern.duration,
          responsibilities: typeof intern.summary === 'string' ? [intern.summary] : (intern.summary || []),
          technologiesUsed: intern.technologies || intern.technologiesUsed || [],
          internshipDocument: intern.offerLetterUrl || intern.internshipDocument || null,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      }
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          portfolioSlug: user.portfolioSlug,
        },
        profile: user.profile,
        theme: user.theme || {
          themeName: 'Default Dark',
          primaryColor: '#3b82f6',
          backgroundType: 'dark',
          fontFamily: 'Inter',
          animationType: 'fade',
        },
        projects: activeProjects,
        skills: user.skills,
        certificates: activeCertificates,
        internships: activeInternships,
      },
    });
  } catch (error) {
    console.error('getPortfolioBySlug error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Private endpoint to update own profile details
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { 
      headline, 
      bio, 
      github, 
      linkedin, 
      twitter, 
      location, 
      availabilityStatus,
      heroSection,
      techStack,
      statsCards,
      expertiseCards,
      skillsSection,
      projectsSection,
      certificatesSection,
      internshipsSection,
      achievementsSection,
      journeySection,
      contactSection,
      headerSection,
      footerSection,
      themeSection
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: {
        headline,
        bio,
        github,
        linkedin,
        twitter,
        location: location || "India",
        availabilityStatus: availabilityStatus || "Available",
        heroSection: heroSection !== undefined ? heroSection : undefined,
        techStack: techStack !== undefined ? techStack : undefined,
        statsCards: statsCards !== undefined ? statsCards : undefined,
        expertiseCards: expertiseCards !== undefined ? expertiseCards : undefined,
        skillsSection: skillsSection !== undefined ? skillsSection : undefined,
        projectsSection: projectsSection !== undefined ? projectsSection : undefined,
        certificatesSection: certificatesSection !== undefined ? certificatesSection : undefined,
        internshipsSection: internshipsSection !== undefined ? internshipsSection : undefined,
        achievementsSection: achievementsSection !== undefined ? achievementsSection : undefined,
        journeySection: journeySection !== undefined ? journeySection : undefined,
        contactSection: contactSection !== undefined ? contactSection : undefined,
        headerSection: headerSection !== undefined ? headerSection : undefined,
        footerSection: footerSection !== undefined ? footerSection : undefined,
        themeSection: themeSection !== undefined ? themeSection : undefined,
      },
    });

    // Create Content Edit Alert Notification
    let editTitle = 'EXPERIENCE RE-BUILT';
    if (headerSection && !footerSection && !themeSection) editTitle = 'CONTACT HEADER UPDATED';
    else if (footerSection && !headerSection && !themeSection) editTitle = 'CONTACT FOOTER UPDATED';
    else if (themeSection && !headerSection && !footerSection) editTitle = 'THEME CONFIG UPDATED';

    const editNotif = await prisma.notification.create({
      data: {
        userId,
        title: editTitle,
        message: 'Published to production',
        type: 'system',
        priority: 'MEDIUM',
        metadata: {
          editor: 'Experience Studio',
          timestamp: new Date().toISOString(),
          type: 'CONTENT_EDIT'
        }
      }
    });

    const io = req.app.get('io');
    if (io && req.user?.portfolioSlug) {
      io.to(`portfolio:${req.user.portfolioSlug}`).emit('notification:received', editNotif);
      io.to(`portfolio:${req.user.portfolioSlug}`).emit('profile:updated', updatedProfile);
      
      if (skillsSection !== undefined) {
        io.to(`portfolio:${req.user.portfolioSlug}`).emit('skills:updated', skillsSection);
      }
      if (projectsSection !== undefined) {
        io.to(`portfolio:${req.user.portfolioSlug}`).emit('projects:updated', { projectsSection });
      }
      if (certificatesSection !== undefined) {
        io.to(`portfolio:${req.user.portfolioSlug}`).emit('certificates:updated', { certificatesSection });
      }
      if (internshipsSection !== undefined) {
        io.to(`portfolio:${req.user.portfolioSlug}`).emit('internships:updated', { internshipsSection });
      }
    }

    return res.status(200).json({
      status: 'success',
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Custom file upload endpoint storing hero image on local disk under /uploads/portfolio/:slug/hero-image.webp
 */
export const uploadHeroImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId || !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Determine target folder based on slug
    const slug = req.user.portfolioSlug;
    let folder = slug;
    if (slug === 'shashwat') folder = 'sd';
    else if (slug === 'khushaboo') folder = 'ks';
    else if (slug === 'mahi') folder = 'ms';

    // Target directory: S:\Portfolio\backend\uploads\portfolio\<folder>
    const targetDir = path.join(process.cwd(), 'uploads', 'portfolio', folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, 'hero-image.webp');
    
    // Save file buffer to local disk
    fs.writeFileSync(filePath, file.buffer);

    // Get the existing profile to update it
    const profile = await prisma.portfolioProfile.findUnique({
      where: { userId }
    });

    let heroSectionObj: any = {};
    if (profile?.heroSection) {
      heroSectionObj = typeof profile.heroSection === 'string' 
        ? JSON.parse(profile.heroSection) 
        : profile.heroSection;
    }

    // Update relative image path
    const relativeUrl = `/uploads/portfolio/${folder}/hero-image.webp`;
    heroSectionObj.image = relativeUrl;

    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: {
        heroSection: heroSectionObj
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {
        imageUrl: relativeUrl,
        profile: updatedProfile
      }
    });
  } catch (error) {
    console.error('uploadHeroImage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Upload resume file to Cloudinary and update profile
 */
export const uploadResume = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload to Cloudinary under folder 'resumes'
    const resumeUrl = await uploadToCloudinary(file.buffer, 'resumes');

    // Update in database
    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: { resumeUrl },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        resumeUrl,
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error('uploadResume error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Upload profile avatar/image to Cloudinary
 */
export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload to Cloudinary under folder 'avatars'
    const profileImage = await uploadToCloudinary(file.buffer, 'avatars');

    // Update in database
    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: { profileImage },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        profileImage,
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Public endpoint to fetch profile data by username (slug)
 */
export const getProfileByUsername = async (req: any, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { portfolioSlug: username },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('getProfileByUsername error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Helper to stream a PDF securely from Cloudinary inline with redirect support
 */
const streamPdfFromUrl = (url: string, res: Response) => {
  https.get(url, (cloudinaryRes) => {
    // Handle temporary redirects (301 or 302)
    if (cloudinaryRes.statusCode === 301 || cloudinaryRes.statusCode === 302) {
      const redirectUrl = cloudinaryRes.headers.location;
      if (redirectUrl) {
        return streamPdfFromUrl(redirectUrl, res);
      }
    }

    if (cloudinaryRes.statusCode !== 200) {
      return res.status(cloudinaryRes.statusCode || 500).json({ message: 'Error retrieving resume from storage' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Mahi_Singh_Resume.pdf"');
    
    cloudinaryRes.pipe(res);
  }).on('error', (err) => {
    console.error('Cloudinary fetch error:', err);
    return res.status(500).json({ message: 'Failed to retrieve resume document' });
  });
};

/**
 * Public endpoint to view a user's resume inline by slug
 */
export const getResumeBySlug = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;

    const user = await prisma.user.findUnique({
      where: { portfolioSlug: slug },
      include: { profile: true },
    });

    if (!user || !user.profile || !user.profile.resumeUrl) {
      // Fallback to the known uploaded Cloudinary raw resume URL
      return streamPdfFromUrl('https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0', res);
    }

    return streamPdfFromUrl(user.profile.resumeUrl, res);
  } catch (error) {
    console.error('getResumeBySlug error:', error);
    // Fallback to the known uploaded Cloudinary raw resume URL on DB failure
    return streamPdfFromUrl('https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0', res);
  }
};

/**
 * Public fallback endpoint to view the active developer's resume dynamically
 */
export const getResumeDynamic = async (req: any, res: Response) => {
  try {
    // Get the first portfolio user's profile
    const profile = await prisma.portfolioProfile.findFirst({
      where: {
        resumeUrl: { not: null }
      }
    });

    if (!profile || !profile.resumeUrl) {
      // Fallback to the known uploaded Cloudinary raw resume URL
      return streamPdfFromUrl('https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0', res);
    }

    return streamPdfFromUrl(profile.resumeUrl, res);
  } catch (error) {
    console.error('getResumeDynamic error:', error);
    // Fallback to the known uploaded Cloudinary raw resume URL on DB failure
    return streamPdfFromUrl('https://res.cloudinary.com/dcicmdzja/raw/upload/v1779380819/resumes/de2rslfarmqs8zq2jpn0', res);
  }
};

/**
 * Custom file upload endpoint storing project cover images on Cloudinary
 */
export const uploadProjectImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const imageUrl = await uploadToCloudinary(file.buffer, 'projects');

    return res.status(200).json({
      status: 'success',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('uploadProjectImage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Custom file upload endpoint storing certificate credential preview images on Cloudinary
 */
export const uploadCertificateImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const imageUrl = await uploadToCloudinary(file.buffer, 'certificates');

    return res.status(200).json({
      status: 'success',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('uploadCertificateImage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Custom file upload endpoint storing internship preview images on Cloudinary
 */
export const uploadInternshipImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const imageUrl = await uploadToCloudinary(file.buffer, 'internships');

    return res.status(200).json({
      status: 'success',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('uploadInternshipImage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Commit a design snapshot backup log
 */
export const saveDesignSnapshot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { label } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await prisma.portfolioProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const snapshotData = {
      heroSection: profile.heroSection,
      statsCards: profile.statsCards,
      expertiseCards: profile.expertiseCards,
      skillsSection: profile.skillsSection,
      projectsSection: profile.projectsSection,
      certificatesSection: profile.certificatesSection,
      internshipsSection: profile.internshipsSection,
      achievementsSection: profile.achievementsSection,
      journeySection: profile.journeySection,
      contactSection: profile.contactSection,
      headerSection: profile.headerSection,
      footerSection: profile.footerSection,
      themeSection: profile.themeSection,
      techStack: profile.techStack,
      headline: profile.headline,
      bio: profile.bio
    };

    const currentHistory = Array.isArray(profile.versionHistory) 
      ? (profile.versionHistory as any[]) 
      : [];

    const newSnapshot = {
      id: `version-${Date.now()}`,
      label: label || `Backup Snapshot (${new Date().toLocaleString()})`,
      data: snapshotData,
      createdAt: new Date().toISOString()
    };

    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: {
        versionHistory: [...currentHistory, newSnapshot]
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {
        snapshot: newSnapshot,
        history: updatedProfile.versionHistory
      }
    });
  } catch (error) {
    console.error('saveDesignSnapshot error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Restore a specific design snapshot backup config
 */
export const restoreDesignSnapshot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { versionId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await prisma.portfolioProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const history = Array.isArray(profile.versionHistory) 
      ? (profile.versionHistory as any[]) 
      : [];

    const matched = history.find(h => h.id === versionId);
    if (!matched) {
      return res.status(404).json({ message: 'Snapshot version not found' });
    }

    const s = matched.data;

    const restoredProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: {
        headline: s.headline !== undefined ? s.headline : undefined,
        bio: s.bio !== undefined ? s.bio : undefined,
        techStack: s.techStack !== undefined ? s.techStack : undefined,
        heroSection: s.heroSection !== undefined ? s.heroSection : undefined,
        statsCards: s.statsCards !== undefined ? s.statsCards : undefined,
        expertiseCards: s.expertiseCards !== undefined ? s.expertiseCards : undefined,
        skillsSection: s.skillsSection !== undefined ? s.skillsSection : undefined,
        projectsSection: s.projectsSection !== undefined ? s.projectsSection : undefined,
        certificatesSection: s.certificatesSection !== undefined ? s.certificatesSection : undefined,
        internshipsSection: s.internshipsSection !== undefined ? s.internshipsSection : undefined,
        achievementsSection: s.achievementsSection !== undefined ? s.achievementsSection : undefined,
        journeySection: s.journeySection !== undefined ? s.journeySection : undefined,
        contactSection: s.contactSection !== undefined ? s.contactSection : undefined,
        headerSection: s.headerSection !== undefined ? s.headerSection : undefined,
        footerSection: s.footerSection !== undefined ? s.footerSection : undefined,
        themeSection: s.themeSection !== undefined ? s.themeSection : undefined
      }
    });

    // Create Restore Content Edit Alert Notification
    const restoreNotif = await prisma.notification.create({
      data: {
        userId,
        title: 'DESIGN SNAPSHOT RESTORED',
        message: `Restored: "${matched.label}"`,
        type: 'system',
        priority: 'MEDIUM',
        metadata: {
          editor: 'Experience Studio',
          timestamp: new Date().toISOString(),
          snapshotLabel: matched.label,
          type: 'CONTENT_EDIT'
        }
      }
    });

    const io = req.app.get('io');
    if (io && req.user?.portfolioSlug) {
      io.to(`portfolio:${req.user.portfolioSlug}`).emit('notification:received', restoreNotif);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        profile: restoredProfile
      }
    });
  } catch (error) {
    console.error('restoreDesignSnapshot error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Retrieve version history list
 */
export const getDesignVersions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await prisma.portfolioProfile.findUnique({
      where: { userId },
      select: { versionHistory: true }
    });

    return res.status(200).json({
      status: 'success',
      data: {
        history: profile?.versionHistory || []
      }
    });
  } catch (error) {
    console.error('getDesignVersions error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateIdentity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      name,
      email,
      portfolioSlug,
      headline,
      bio,
      profileImage,
      location,
      aiSection
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email address is already in use by another tenant.' });
      }
    }

    if (portfolioSlug && portfolioSlug !== user.portfolioSlug) {
      const existingSlug = await prisma.user.findUnique({ where: { portfolioSlug } });
      if (existingSlug) {
        return res.status(400).json({ message: 'Portfolio slug is already in use by another tenant.' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        portfolioSlug: portfolioSlug || undefined
      }
    });

    const updatedProfile = await prisma.portfolioProfile.update({
      where: { userId },
      data: {
        headline: headline !== undefined ? headline : undefined,
        bio: bio !== undefined ? bio : undefined,
        profileImage: profileImage !== undefined ? profileImage : undefined,
        location: location !== undefined ? location : undefined,
        aiSection: aiSection !== undefined ? aiSection : undefined
      }
    });

    const io = req.app.get('io');
    if (io && updatedUser.portfolioSlug) {
      io.to(`portfolio:${updatedUser.portfolioSlug}`).emit('profile:update', {
        profile: updatedProfile,
        user: updatedUser
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          portfolioSlug: updatedUser.portfolioSlug,
          profile: updatedProfile
        }
      }
    });
  } catch (error) {
    console.error('updateIdentity error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


