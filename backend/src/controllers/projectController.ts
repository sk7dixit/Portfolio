import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

export const getMyProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ status: 'success', data: { projects } });
  } catch (error) {
    console.error('getMyProjects error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, description, techStack, githubUrl, liveUrl, featured } = req.body;
    const file = req.file;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    let thumbnailUrl = null;
    if (file) {
      thumbnailUrl = await uploadToCloudinary(file.buffer, 'projects');
    }

    // techStack might come as a stringified JSON array or comma-separated values from FormData
    let techStackArray: string[] = [];
    if (typeof techStack === 'string') {
      try {
        techStackArray = JSON.parse(techStack);
      } catch (e) {
        techStackArray = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(techStack)) {
      techStackArray = techStack;
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
        techStack: techStackArray,
        githubUrl,
        liveUrl,
        thumbnail: thumbnailUrl,
        featured: featured === 'true' || featured === true,
      },
    });

    return res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, techStack, githubUrl, liveUrl, featured } = req.body;
    const file = req.file;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Ensure user owns this project or is Admin
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    let thumbnailUrl = existingProject.thumbnail;
    if (file) {
      thumbnailUrl = await uploadToCloudinary(file.buffer, 'projects');
    }

    let techStackArray = existingProject.techStack;
    if (techStack !== undefined) {
      if (typeof techStack === 'string') {
        try {
          techStackArray = JSON.parse(techStack);
        } catch (e) {
          techStackArray = techStack.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(techStack)) {
        techStackArray = techStack;
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        techStack: techStackArray,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
        thumbnail: thumbnailUrl,
        featured: featured !== undefined ? (featured === 'true' || featured === true) : existingProject.featured,
      },
    });

    return res.status(200).json({ status: 'success', data: { project: updated } });
  } catch (error) {
    console.error('updateProject error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.project.delete({ where: { id } });

    return res.status(200).json({ status: 'success', message: 'Project deleted' });
  } catch (error) {
    console.error('deleteProject error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Public endpoint to fetch all projects by username (slug)
 */
export const getProjectsByUsername = async (req: any, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { portfolioSlug: username },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        projects: user.projects,
      },
    });
  } catch (error) {
    console.error('getProjectsByUsername error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

