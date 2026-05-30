import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super-secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, portfolioSlug } = req.body;

    if (!name || !email || !password || !portfolioSlug) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { portfolioSlug }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      if (existingUser.portfolioSlug === portfolioSlug) {
        return res.status(400).json({ message: 'Portfolio slug already taken' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user along with an empty portfolio profile
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'PORTFOLIO_USER';
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        portfolioSlug,
        profile: {
          create: {
            headline: 'Hi, I am ' + name,
            bio: 'Welcome to my engineering playground. This profile is waiting to be detailed.',
          }
        }
      },
      include: {
        profile: true
      }
    });

    const token = signToken(newUser.id, newUser.role);

    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          portfolioSlug: newUser.portfolioSlug,
          profile: newUser.profile
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        theme: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.role);

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          portfolioSlug: user.portfolioSlug,
          profile: user.profile,
          theme: user.theme
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        theme: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          portfolioSlug: user.portfolioSlug,
          profile: user.profile,
          theme: user.theme
        }
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
