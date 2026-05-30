import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllThemes = async (req: Request, res: Response) => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { themeName: 'asc' },
    });
    return res.status(200).json({ status: 'success', data: { themes } });
  } catch (error) {
    console.error('getAllThemes error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTheme = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { themeName, primaryColor, backgroundType, fontFamily, animationType } = req.body;

    if (!themeName || !primaryColor || !backgroundType || !fontFamily || !animationType) {
      return res.status(400).json({ message: 'All theme fields are required' });
    }

    const theme = await prisma.theme.create({
      data: {
        themeName,
        primaryColor,
        backgroundType,
        fontFamily,
        animationType,
      },
    });

    return res.status(201).json({ status: 'success', data: { theme } });
  } catch (error) {
    console.error('createTheme error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const selectThemeForUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { themeId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!themeId) return res.status(400).json({ message: 'Theme ID is required' });

    // Verify theme exists
    const themeExists = await prisma.theme.findUnique({ where: { id: themeId } });
    if (!themeExists) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { themeId },
      include: { theme: true },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          portfolioSlug: updatedUser.portfolioSlug,
          theme: updatedUser.theme,
        },
      },
    });
  } catch (error) {
    console.error('selectThemeForUser error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
