import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Public endpoint to log a new visitor visit
 */
export const logVisit = async (req: Request, res: Response) => {
  try {
    const { portfolioSlug, visitorIp, country, device, clickedProject, browser: bodyBrowser } = req.body;

    if (!portfolioSlug) {
      return res.status(400).json({ message: 'Portfolio slug is required' });
    }

    // Find the portfolio profile by slug
    const user = await prisma.user.findUnique({
      where: { portfolioSlug },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const ip = visitorIp || req.ip || '127.0.0.1';

    // Resolve visitor's browser from User-Agent if absent in post body
    let browser = bodyBrowser;
    if (!browser) {
      const userAgent = req.headers['user-agent'] || '';
      if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Edg')) browser = 'Edge';
      else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
      else browser = 'Unknown';
    }

    const newLog = await prisma.analytics.create({
      data: {
        portfolioId: user.profile.id,
        visitorIp: ip,
        country: country || 'Unknown',
        device: device || 'Desktop',
        browser: browser,
        clickedProject: clickedProject || null,
      },
    });

    // ── INTELLIGENT SIGNAL ENGINE TRiggers ───────────────────────
    const io = req.app.get('io');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 1. Returning Visitor Alert
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const previousVisit = await prisma.analytics.findFirst({
      where: {
        portfolioId: user.profile.id,
        visitorIp: ip,
        visitTime: {
          lt: tenMinutesAgo,
          gt: sevenDaysAgo
        }
      },
      orderBy: { visitTime: 'desc' }
    });

    if (previousVisit) {
      const sessionDepth = await prisma.analytics.count({
        where: { portfolioId: user.profile.id, visitorIp: ip }
      });
      const daysAgo = Math.max(1, Math.round((Date.now() - new Date(previousVisit.visitTime).getTime()) / (24 * 60 * 60 * 1000)));

      const returningNotif = await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'RETURNING SIGNAL DETECTED',
          message: `Last Visit: ${daysAgo} days ago\nSession Depth Increased: ${sessionDepth}`,
          type: 'visitor',
          priority: 'MEDIUM',
          metadata: {
            visitorIp: ip,
            country: country || 'Unknown',
            device: device || 'Desktop',
            browser: browser,
            sessionDepth,
            type: 'RETURNING_VISITOR'
          }
        }
      });

      if (io) {
        io.to(`portfolio:${portfolioSlug}`).emit('notification:received', returningNotif);
      }
    }

    // 2. Resume Export Initiated Alert
    if (clickedProject === 'Resume' || clickedProject === 'Resume Download') {
      const resumeNotif = await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'RESUME EXPORT INITIATED',
          message: `Device: ${device || 'Desktop'}\nRegion: ${country || 'Unknown'}\nIP: ${ip}`,
          type: 'engagement',
          priority: 'HIGH',
          metadata: {
            visitorIp: ip,
            country: country || 'Unknown',
            device: device || 'Desktop',
            browser: browser,
            type: 'RESUME_DOWNLOAD'
          }
        }
      });

      if (io) {
        io.to(`portfolio:${portfolioSlug}`).emit('notification:received', resumeNotif);
      }
    }

    // 3. Credential Validation Triggered Alert
    else if (clickedProject && (clickedProject.startsWith('Verify:') || clickedProject.includes('Certificate'))) {
      const certTitle = clickedProject.replace('Verify:', '').trim();
      const certNotif = await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'CREDENTIAL VALIDATION TRIGGERED',
          message: `${certTitle} Viewed\nRegion: ${country || 'Unknown'}\nDevice: ${device || 'Desktop'}`,
          type: 'engagement',
          priority: 'MEDIUM',
          metadata: {
            visitorIp: ip,
            country: country || 'Unknown',
            device: device || 'Desktop',
            browser: browser,
            certificateTitle: certTitle,
            type: 'CERTIFICATE_VERIFY'
          }
        }
      });

      if (io) {
        io.to(`portfolio:${portfolioSlug}`).emit('notification:received', certNotif);
      }
    }

    // 4. Social Click Signal Alert
    else if (clickedProject && (clickedProject.includes('LinkedIn') || clickedProject.includes('GitHub'))) {
      const platform = clickedProject.includes('LinkedIn') ? 'LinkedIn' : 'GitHub';
      const socialNotif = await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'SOCIAL CLICK SIGNAL',
          message: `${platform} outbound initiated\nRegion: ${country || 'Unknown'}`,
          type: 'engagement',
          priority: 'LOW',
          metadata: {
            visitorIp: ip,
            country: country || 'Unknown',
            device: device || 'Desktop',
            browser: browser,
            platform,
            type: 'SOCIAL_CLICK'
          }
        }
      });

      if (io) {
        io.to(`portfolio:${portfolioSlug}`).emit('notification:received', socialNotif);
      }
    }

    // 5. Project Heat Alert
    else if (clickedProject) {
      const projectClicksCount = await prisma.analytics.count({
        where: {
          portfolioId: user.profile.id,
          clickedProject,
          visitTime: { gt: oneHourAgo }
        }
      });

      if (projectClicksCount === 5) {
        const heatNotif = await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'PROJECT HEAT DETECTED',
            message: `"${clickedProject}" received ${projectClicksCount} interactions\nRegion: ${country || 'Unknown'}\nIP: ${ip}`,
            type: 'engagement',
            priority: 'MEDIUM',
            metadata: {
              visitorIp: ip,
              country: country || 'Unknown',
              device: device || 'Desktop',
              browser: browser,
              projectTitle: clickedProject,
              interactionsCount: projectClicksCount,
              type: 'PROJECT_HEAT'
            }
          }
        });

        if (io) {
          io.to(`portfolio:${portfolioSlug}`).emit('notification:received', heatNotif);
        }
      }
    }

    // 6. High Value / Intent Visitor Scorer
    const recentLogs = await prisma.analytics.findMany({
      where: {
        portfolioId: user.profile.id,
        visitorIp: ip,
        visitTime: { gt: oneHourAgo }
      }
    });

    let engagementScore = 30; // base score
    const distinctPages = new Set(recentLogs.map(l => l.clickedProject || 'Home')).size;
    engagementScore += (distinctPages - 1) * 20;

    const hasResume = recentLogs.some(l => l.clickedProject === 'Resume' || l.clickedProject === 'Resume Download');
    if (hasResume) engagementScore += 25;

    const clickedProjectsCount = recentLogs.filter(l => l.clickedProject && !l.clickedProject.includes('Resume') && !l.clickedProject.includes('LinkedIn') && !l.clickedProject.includes('GitHub')).length;
    engagementScore += clickedProjectsCount * 15;

    engagementScore = Math.min(engagementScore, 100);

    if (engagementScore >= 80) {
      const alreadyAlertedList = await prisma.notification.findMany({
        where: {
          userId: user.id,
          title: 'HIGH INTENT VISITOR DETECTED',
          createdAt: { gt: oneHourAgo }
        }
      });

      const alreadyAlerted = alreadyAlertedList.some((n: any) => {
        try {
          const meta = typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata;
          return meta && meta.visitorIp === ip;
        } catch (e) {
          return false;
        }
      });

      if (!alreadyAlerted) {
        const visitedDetails = Array.from(new Set(recentLogs.map(l => l.clickedProject || 'Home')));
        const highValueNotif = await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'HIGH INTENT VISITOR DETECTED',
            message: `Engagement Score: ${engagementScore}/100\nVisited: ${visitedDetails.join(' + ')}`,
            type: 'visitor',
            priority: 'HIGH',
            metadata: {
              visitorIp: ip,
              country: country || 'Unknown',
              device: device || 'Desktop',
              browser: browser,
              engagementScore,
              visitedPages: visitedDetails,
              type: 'HIGH_VALUE_VISITOR'
            }
          }
        });

        if (io) {
          io.to(`portfolio:${portfolioSlug}`).emit('notification:received', highValueNotif);
        }
      }
    }

    return res.status(201).json({ status: 'success', data: { log: newLog } });
  } catch (error) {
    console.error('logVisit error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Fetch analytics data for the logged-in user
 */
export const getMyAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch the profile
    const profile = await prisma.portfolioProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Portfolio profile not found' });
    }

    // Fetch logs
    const logs = await prisma.analytics.findMany({
      where: { portfolioId: profile.id },
      orderBy: { visitTime: 'desc' },
    });

    // Compute basic statistics
    const totalViews = logs.length;
    
    // Country metrics
    const countryCount: Record<string, number> = {};
    // Device metrics
    const deviceCount: Record<string, number> = {};
    // Project click metrics
    const projectClicks: Record<string, number> = {};

    logs.forEach((log) => {
      countryCount[log.country] = (countryCount[log.country] || 0) + 1;
      deviceCount[log.device] = (deviceCount[log.device] || 0) + 1;
      if (log.clickedProject) {
        projectClicks[log.clickedProject] = (projectClicks[log.clickedProject] || 0) + 1;
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {
        totalViews,
        stats: {
          countries: countryCount,
          devices: deviceCount,
          projectClicks,
        },
        logs: logs.slice(0, 100), // Limit raw logs to latest 100
      },
    });
  } catch (error) {
    console.error('getMyAnalytics error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
