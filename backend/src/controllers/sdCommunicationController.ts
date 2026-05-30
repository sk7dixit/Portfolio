import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

// Default dynamic fallback configuration matching standard frontend expectations
const DEFAULT_CONTACT_CMS = {
  hero: {
    badgeText: "START A CONVERSATION",
    mainHeading: "Let’s Build Something Amazing",
    subtitle: "Whether you have a project, startup idea, collaboration opportunity, or just want to connect — I’d love to hear from you."
  },
  profileCard: {
    name: "Shashwat Dixit",
    role: "AI-focused Product Builder & System Engineer",
    profileImage: "",
    statusTitle: "Available for Projects",
    statusDescription: "Open for freelance contracts, internships, and deep engineering collaborations."
  },
  contactDetails: {
    phone: "+91 7317649942",
    location: "Delhi, India // Available Globally",
    email: "shashwat.dixit@example.com",
    responseMetric: "REPLIES IN < 24H"
  },
  socialCards: [
    { platform: "LinkedIn", url: "https://linkedin.com", label: "Professional Profile", enabled: true },
    { platform: "GitHub", url: "https://github.com", label: "Source Code", enabled: true },
    { platform: "Resume", url: "#", label: "Qualifications Document", enabled: true },
    { platform: "WhatsApp", url: "https://wa.me/917317649942", label: "Direct Chat", enabled: true }
  ],
  formSettings: {
    formHeading: "Start a Conversation",
    namePlaceholder: "e.g. Elon Musk",
    emailPlaceholder: "e.g. elon@spacex.com",
    subjectPlaceholder: "-- Select Subject Preset --",
    messagePlaceholder: "Tell me about your project, idea, or questions...",
    submitButtonText: "Let’s Connect",
    subjectPresets: [
      "Startup Collaboration",
      "Freelance Project",
      "Hiring Opportunity",
      "AI Consultation",
      "Internship Inquiry",
      "General Conversation"
    ]
  },
  visualSettings: {
    primaryGradient: "#8b5cf6",
    secondaryGradient: "#6366f1",
    glowIntensity: 0.08,
    backgroundBlur: 10
  }
};

// --- CONTACT CMS CONTROLLERS ---

export const getSDContactCMS = async (req: Request, res: Response) => {
  try {
    const record = await prisma.sDContactCMS.findFirst({
      where: { tenant: 'SD' }
    });
    
    if (!record) {
      return res.status(200).json({ status: 'success', data: { contactCMS: DEFAULT_CONTACT_CMS } });
    }
    
    return res.status(200).json({ status: 'success', data: { contactCMS: record } });
  } catch (error) {
    console.error('getSDContactCMS error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const upsertSDContactCMS = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { hero, profileCard, contactDetails, socialCards, formSettings, visualSettings } = req.body;

    const existing = await prisma.sDContactCMS.findFirst({
      where: { tenant: 'SD' }
    });

    let record;
    if (existing) {
      record = await prisma.sDContactCMS.update({
        where: { id: existing.id },
        data: {
          hero: hero !== undefined ? hero : existing.hero,
          profileCard: profileCard !== undefined ? profileCard : existing.profileCard,
          contactDetails: contactDetails !== undefined ? contactDetails : existing.contactDetails,
          socialCards: socialCards !== undefined ? socialCards : existing.socialCards,
          formSettings: formSettings !== undefined ? formSettings : existing.formSettings,
          visualSettings: visualSettings !== undefined ? visualSettings : existing.visualSettings
        }
      });
    } else {
      record = await prisma.sDContactCMS.create({
        data: {
          tenant: 'SD',
          hero: hero || DEFAULT_CONTACT_CMS.hero,
          profileCard: profileCard || DEFAULT_CONTACT_CMS.profileCard,
          contactDetails: contactDetails || DEFAULT_CONTACT_CMS.contactDetails,
          socialCards: socialCards || DEFAULT_CONTACT_CMS.socialCards,
          formSettings: formSettings || DEFAULT_CONTACT_CMS.formSettings,
          visualSettings: visualSettings || DEFAULT_CONTACT_CMS.visualSettings
        }
      });
    }

    return res.status(200).json({ status: 'success', data: { contactCMS: record } });
  } catch (error) {
    console.error('upsertSDContactCMS error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- INBOX MESSAGES CONTROLLERS ---

export const getSDMessages = async (req: Request, res: Response) => {
  try {
    const { unread, archived } = req.query;
    const whereClause: any = { tenant: 'SD' };

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

    const messages = await prisma.sDMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: { messages } });
  } catch (error) {
    console.error('getSDMessages error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createSDMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required message parameters' });
    }

    const record = await prisma.sDMessage.create({
      data: {
        tenant: 'SD',
        name,
        email,
        subject: subject || 'General Conversation',
        message,
        read: false,
        archived: false
      }
    });

    // Broadcast via Socket.IO to room portfolio:shashwat
    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.sDMessage.findMany({
        where: { tenant: 'SD', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:shashwat').emit('communication_sd:updated', { messages: activeMessages });
    }

    return res.status(201).json({ status: 'success', data: { message: record } });
  } catch (error) {
    console.error('createSDMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateSDMessageStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { read, archived } = req.body;

    const existing = await prisma.sDMessage.findFirst({
      where: { id, tenant: 'SD' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = await prisma.sDMessage.update({
      where: { id },
      data: {
        read: read !== undefined ? (read === 'true' || read === true) : existing.read,
        archived: archived !== undefined ? (archived === 'true' || archived === true) : existing.archived
      }
    });

    // Broadcast via Socket.IO
    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.sDMessage.findMany({
        where: { tenant: 'SD', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:shashwat').emit('communication_sd:updated', { messages: activeMessages });
    }

    return res.status(200).json({ status: 'success', data: { message: updated } });
  } catch (error) {
    console.error('updateSDMessageStatus error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteSDMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.sDMessage.findFirst({
      where: { id, tenant: 'SD' }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await prisma.sDMessage.delete({
      where: { id }
    });

    // Broadcast via Socket.IO
    const ioInstance = req.app.get('io');
    if (ioInstance) {
      const activeMessages = await prisma.sDMessage.findMany({
        where: { tenant: 'SD', archived: false },
        orderBy: { createdAt: 'desc' }
      });
      ioInstance.to('portfolio:shashwat').emit('communication_sd:updated', { messages: activeMessages });
    }

    return res.status(200).json({ status: 'success', message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteSDMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
