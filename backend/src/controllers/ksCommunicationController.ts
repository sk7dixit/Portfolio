import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// Default dynamic fallback configuration matching standard frontend expectations
const DEFAULT_CONTACT_CMS = {
  hero: {
    badgeText: "LET'S CONNECT",
    mainHeadingLine1: "Let's Create Something",
    gradientHeadingLine2: "That People Remember.",
    description: "I enjoy building modern digital experiences that combine clean engineering with thoughtful design. Whether it's a startup idea, freelance collaboration, or an ambitious product vision — I'm always open to meaningful conversations."
  },
  quoteCard: {
    quoteText: "Great products are built through collaboration, iteration, and curiosity.",
    quoteIconStyle: "Quote",
    floatingCardEnabled: true
  },
  contactFormSettings: {
    formTitle: "What are you building?",
    submitButtonText: "Send Message",
    successMessage: "Message sent successfully. I'll get back to you soon!",
    errorMessage: "Something went wrong. Please try again or email me directly.",
    autoReplyEnabled: false
  },
  footerInfo: {
    locationLabel: "Based In",
    locationValue: "India (UTC+5:30)",
    responseTime: "Within 24 Hours",
    currentFocus: "Interactive Web & MERN"
  },
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/khushaboo-saini", enabled: true },
    { platform: "GitHub", url: "https://github.com/Khushboo-Saini", enabled: true },
    { platform: "Mail", url: "mailto:khushboosaini066@gmail.com", enabled: true }
  ],
  visualSettings: {
    gradientStart: "#a855f7",
    gradientEnd: "#22d3ee",
    overlayOpacity: 0.28,
    glassBlurStrength: 10,
    statusText: "SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES",
    statusEnabled: true,
    statusAccentColor: "#10b981"
  }
};

// --- CONTACT CMS CONTROLLERS ---

export const getKSContactCMS = async (req: Request, res: Response) => {
  try {
    const record = await prisma.kSContactCMS.findFirst({
      where: { tenant: 'KS' }
    });
    
    if (!record) {
      return res.status(200).json({ status: 'success', data: { contactCMS: DEFAULT_CONTACT_CMS } });
    }
    
    return res.status(200).json({ status: 'success', data: { contactCMS: record } });
  } catch (error) {
    console.error('getKSContactCMS error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const upsertKSContactCMS = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { hero, quoteCard, footerInfo, socialLinks, visualSettings } = req.body;

    const existing = await prisma.kSContactCMS.findFirst({
      where: { tenant: 'KS' }
    });

    let record;
    if (existing) {
      record = await prisma.kSContactCMS.update({
        where: { id: existing.id },
        data: {
          hero: hero !== undefined ? hero : existing.hero,
          quoteCard: quoteCard !== undefined ? quoteCard : existing.quoteCard,
          footerInfo: footerInfo !== undefined ? footerInfo : existing.footerInfo,
          socialLinks: socialLinks !== undefined ? socialLinks : existing.socialLinks,
          visualSettings: visualSettings !== undefined ? visualSettings : existing.visualSettings
        }
      });
    } else {
      record = await prisma.kSContactCMS.create({
        data: {
          tenant: 'KS',
          hero: hero || DEFAULT_CONTACT_CMS.hero,
          quoteCard: quoteCard || DEFAULT_CONTACT_CMS.quoteCard,
          footerInfo: footerInfo || DEFAULT_CONTACT_CMS.footerInfo,
          socialLinks: socialLinks || DEFAULT_CONTACT_CMS.socialLinks,
          visualSettings: visualSettings || DEFAULT_CONTACT_CMS.visualSettings
        }
      });
    }

    return res.status(200).json({ status: 'success', data: { contactCMS: record } });
  } catch (error) {
    console.error('upsertKSContactCMS error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- INBOX MESSAGES CONTROLLERS ---

export const getKSMessages = async (req: Request, res: Response) => {
  try {
    const { unread, archived } = req.query;
    const whereClause: any = { tenant: 'KS' };

    if (unread === 'true') {
      whereClause.read = false;
    }
    
    if (archived === 'true') {
      whereClause.archived = true;
    } else if (archived === 'false') {
      whereClause.archived = false;
    } else {
      // Default to non-archived inbox items
      whereClause.archived = false;
    }

    const messages = await prisma.kSMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: { messages } });
  } catch (error) {
    console.error('getKSMessages error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createKSMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required message parameters' });
    }

    const record = await prisma.kSMessage.create({
      data: {
        tenant: 'KS',
        name,
        email,
        message,
        read: false,
        archived: false
      }
    });

    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.kSMessage.findMany({
        where: { tenant: 'KS', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:khushaboo').emit('communication_ks:updated', { messages: activeMessages });
    }

    return res.status(201).json({ status: 'success', data: { message: record } });
  } catch (error) {
    console.error('createKSMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateKSMessageStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { read, archived } = req.body;

    const existing = await prisma.kSMessage.findFirst({
      where: { id, tenant: 'KS' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = await prisma.kSMessage.update({
      where: { id },
      data: {
        read: read !== undefined ? (read === 'true' || read === true) : existing.read,
        archived: archived !== undefined ? (archived === 'true' || archived === true) : existing.archived
      }
    });

    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.kSMessage.findMany({
        where: { tenant: 'KS', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:khushaboo').emit('communication_ks:updated', { messages: activeMessages });
    }

    return res.status(200).json({ status: 'success', data: { message: updated } });
  } catch (error) {
    console.error('updateKSMessageStatus error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteKSMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.kSMessage.findFirst({
      where: { id, tenant: 'KS' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await prisma.kSMessage.delete({
      where: { id }
    });

    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.kSMessage.findMany({
        where: { tenant: 'KS', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:khushaboo').emit('communication_ks:updated', { messages: activeMessages });
    }

    return res.status(200).json({ status: 'success', message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteKSMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
