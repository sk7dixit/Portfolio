import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getMySkills = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { category: 'asc' },
    });

    return res.status(200).json({ status: 'success', data: { skills } });
  } catch (error) {
    console.error('getMySkills error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { skillName, skillLevel, category } = req.body;

    if (!skillName || !category) {
      return res.status(400).json({ message: 'Skill name and category are required' });
    }

    const skill = await prisma.skill.create({
      data: {
        userId,
        skillName,
        skillLevel: skillLevel ? parseInt(skillLevel) : 5,
        category,
      },
    });

    return res.status(201).json({ status: 'success', data: { skill } });
  } catch (error) {
    console.error('createSkill error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { skillName, skillLevel, category } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const existingSkill = await prisma.skill.findUnique({ where: { id } });
    if (!existingSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (existingSkill.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to edit this skill' });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        skillName: skillName || existingSkill.skillName,
        skillLevel: skillLevel !== undefined ? parseInt(skillLevel) : existingSkill.skillLevel,
        category: category || existingSkill.category,
      },
    });

    return res.status(200).json({ status: 'success', data: { skill: updated } });
  } catch (error) {
    console.error('updateSkill error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const existingSkill = await prisma.skill.findUnique({ where: { id } });
    if (!existingSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (existingSkill.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }

    await prisma.skill.delete({ where: { id } });

    return res.status(200).json({ status: 'success', message: 'Skill deleted' });
  } catch (error) {
    console.error('deleteSkill error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Public endpoint to fetch all skills by username (slug)
 */
export const getSkillsByUsername = async (req: any, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { portfolioSlug: username },
      include: {
        skills: {
          orderBy: { category: 'asc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('getSkillsByUsername error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

