import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Advanced Lead Categorization & Scoring Engine
 */
const classifyInquiry = (text: string, subject: string) => {
  const content = `${subject} ${text}`.toLowerCase();
  
  if (/\b(funding|startup|investor|equity|seed|series\s*[a-d]|venture|founder|pitch)\b/.test(content)) {
    return 'STARTUP';
  }
  if (/\b(hiring|recruit|job|offer|salary|interview|full-time|position|careers|headhunter)\b/.test(content)) {
    return 'HIRING';
  }
  if (/\b(freelance|contract|gigs|project|build|develop|hourly|consulting|retainer)\b/.test(content)) {
    return 'FREELANCE';
  }
  if (/\b(consult|advise|session|expertise|workshop|ai\s*consult|architecture)\b/.test(content)) {
    return 'AI_CONSULTATION';
  }
  if (/\b(internship|intern|co-op|placement|apprenticeship)\b/.test(content)) {
    return 'INTERN_INQUIRY';
  }
  return 'GENERAL';
};

const detectPriority = (text: string, subject: string) => {
  const content = `${subject} ${text}`.toLowerCase();
  
  if (/\b(urgent|asap|funding|budget|hiring|contract|partnership|immediate|proposal)\b/.test(content)) {
    return 'HIGH';
  }
  if (/\b(seo|crypto|viagra|earn\s*money|bitcoin|forex|wealth|free\s*traffic|marketing\s*agency)\b/.test(content)) {
    return 'LOW';
  }
  return 'MEDIUM';
};

const calculateLeadScore = (payload: {
  priority: string;
  category: string;
  message: string;
  device?: string;
  browser?: string;
  sourcePage?: string;
  hasReferrer?: boolean;
}) => {
  let score = 40;

  if (payload.priority === 'HIGH') score += 20;
  if (payload.priority === 'LOW') score -= 25;

  if (['STARTUP', 'HIRING', 'FREELANCE', 'AI_CONSULTATION'].includes(payload.category)) {
    score += 20;
  }

  if (payload.message.length > 250) {
    score += 15;
  } else if (payload.message.length < 50) {
    score -= 10;
  }

  if (payload.sourcePage) score += 5;
  if (payload.device === 'Desktop') score += 5;
  if (payload.hasReferrer) score += 10;

  return Math.min(Math.max(score, 10), 100);
};

/**
 * Public endpoint to submit contact signals with session tracking
 */
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { 
      portfolioSlug, 
      senderName, 
      email, 
      subject, 
      message,
      sourcePage,
      location,
      device,
      browser,
      viewedProjects
    } = req.body;

    if (!portfolioSlug || !senderName || !email || !message) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const user = await prisma.user.findUnique({
      where: { portfolioSlug }
    });

    if (!user) {
      return res.status(404).json({ message: 'Developer profile not found' });
    }

    const category = classifyInquiry(message, subject || '');
    const priority = detectPriority(message, subject || '');
    
    let status = 'unread';
    if (priority === 'LOW') {
      status = 'spam';
    }

    const leadScore = calculateLeadScore({
      priority,
      category,
      message,
      device,
      browser,
      sourcePage,
      hasReferrer: !!req.headers.referer
    });

    const parsedViewedProjects = Array.isArray(viewedProjects) ? viewedProjects : [];

    const msg = await prisma.message.create({
      data: {
        userId: user.id,
        senderName,
        email,
        subject: subject || 'No Subject',
        message,
        category,
        priority,
        status,
        read: status === 'spam',
        sourcePage: sourcePage || 'Contact Tab',
        location: location || 'Unknown',
        device: device || 'Desktop',
        browser: browser || 'Unknown',
        viewedProjects: parsedViewedProjects,
        leadScore,
        replies: [],
        tags: [category, priority]
      }
    });

    // AI Interpretation Engine mapping potential client probability & intents
    const interpretSignal = (
      sender: string,
      msgContent: string,
      cat: string,
      projectsCount: number,
      score: number
    ) => {
      let probability = score; // Base probability matches lead score
      if (projectsCount >= 2) probability = Math.min(probability + 8, 98);
      
      let explanation = '';
      switch (cat) {
        case 'STARTUP':
          explanation = `Highly engaged visitor resembling a startup founder seeking fast-track execution for seed-stage or pre-seed software systems.`;
          break;
        case 'HIRING':
          explanation = `Enterprise recruitment representative or headhunter evaluating core developer capabilities for direct placement or technical roles.`;
          break;
        case 'FREELANCE':
          explanation = `Direct business client looking to sponsor high-value projects, seeking immediate architectural consultancy or custom software engineering.`;
          break;
        case 'AI_CONSULTATION':
          explanation = `Tech stakeholder looking to optimize system efficiency or integrate complex large language model (LLM) agents and vector search systems.`;
          break;
        case 'INTERN_INQUIRY':
          explanation = `Technical candidate showing active learning interest and seeking professional mentorship or growth opportunities.`;
          break;
        default:
          explanation = `Casual system visitor or general inquiry exploring active portfolio layout states and technical capabilities.`;
          break;
      }
      
      if (score < 30) {
        probability = Math.max(probability - 15, 5);
        explanation = `System flagged contact form submission as automated search spam, commercial solicitation, or cryptocurrency advertisement.`;
      }

      return {
        probability,
        explanation
      };
    };

    const aiAnalysis = interpretSignal(senderName, message, category, parsedViewedProjects.length, leadScore);

    // 1. Create Inbound Lead Signal Notification
    const leadNotif = await prisma.notification.create({
      data: {
        userId: user.id,
        title: `NEW COLLAB SIGNAL`,
        message: `Lead Intent: ${priority === 'HIGH' ? 'HIGH' : priority === 'LOW' ? 'LOW' : 'MEDIUM'}\nOrigin: ${location || 'Unknown'}\nSubject: ${subject || 'No Subject'}`,
        type: 'lead',
        priority: priority,
        metadata: {
          leadScore,
          category,
          country: location || 'Unknown',
          subject: subject || 'No Subject',
          senderName,
          type: 'INBOUND_LEAD'
        }
      }
    });

    // 2. Create AI Lead Scoring Alert Notification
    const aiNotif = await prisma.notification.create({
      data: {
        userId: user.id,
        title: `AI LEAD SCORING ALERT`,
        message: `Potential Client Probability: ${aiAnalysis.probability}%\n${aiAnalysis.explanation}`,
        type: 'ai',
        priority: priority,
        metadata: {
          probability: aiAnalysis.probability,
          explanation: aiAnalysis.explanation,
          senderName,
          category,
          type: 'AI_INSIGHT'
        }
      }
    });

    // Real-time Socket broadcasting to keep admin synchronized without refreshes
    const io = req.app.get('io');
    if (io && portfolioSlug) {
      io.to(`portfolio:${portfolioSlug}`).emit('notification:received', leadNotif);
      setTimeout(() => {
        io.to(`portfolio:${portfolioSlug}`).emit('notification:received', aiNotif);
      }, 750);
    }

    return res.status(201).json({ status: 'success', data: msg });
  } catch (error) {
    console.error('createMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Get all messages for authenticated developer inbox
 */
export const getMyMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    console.error('getMyMessages error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark a message as read/unread (legacy compat)
 */
export const markMessageRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { read } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.message.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { 
        read: read ?? true,
        status: (read ?? true) ? 'opened' : 'unread'
      }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('markMessageRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Star, archive, spam or customize priority/category of a lead
 */
export const updateMessageStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status, priority, category } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.message.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const data: any = {};
    if (status !== undefined) {
      data.status = status;
      if (status === 'opened' || status === 'replied' || status === 'archived') {
        data.read = true;
      } else if (status === 'unread') {
        data.read = false;
      }
    }
    if (priority !== undefined) {
      data.priority = priority;
    }
    if (category !== undefined) {
      data.category = category;
    }

    const updated = await prisma.message.update({
      where: { id },
      data
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('updateMessageStatus error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Save private administrative notes for a lead
 */
export const updateMessageNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { notes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.message.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { notes }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('updateMessageNotes error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Record a new reply sent to a lead
 */
export const createMessageReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.message.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const currentReplies = Array.isArray(existing.replies) ? existing.replies : [];
    const newReply = {
      sender: 'admin',
      text,
      createdAt: new Date().toISOString()
    };

    const updatedReplies = [...currentReplies, newReply];

    const updated = await prisma.message.update({
      where: { id },
      data: { 
        replies: updatedReplies,
        status: 'replied',
        read: true
      }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('createMessageReply error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.message.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await prisma.message.delete({
      where: { id }
    });

    return res.status(200).json({ status: 'success', message: 'Message deleted' });
  } catch (error) {
    console.error('deleteMessage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
