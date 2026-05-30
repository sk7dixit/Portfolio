import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

interface DecodedToken {
  id: string;
  role: string;
}

// Extend Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PORTFOLIO_USER';
    portfolioSlug: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret') as DecodedToken;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        portfolioSlug: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user as any;

    // Multi-tenant active portfolio context switcher
    const activeSlug = req.headers['x-portfolio-slug'] as string;
    if (activeSlug && activeSlug !== user.portfolioSlug) {
      const targetUser = await prisma.user.findUnique({
        where: { portfolioSlug: activeSlug },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          portfolioSlug: true,
        },
      });
      if (targetUser) {
        req.user = targetUser as any;
      }
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export const restrictTo = (...roles: Array<'ADMIN' | 'PORTFOLIO_USER'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission' });
    }
    next();
  };
};
