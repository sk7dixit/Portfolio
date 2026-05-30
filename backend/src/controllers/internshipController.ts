import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

/**
 * Get all internships / experiences for authenticated user
 */
export const getMyInternships = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const internships = await prisma.internship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: internships });
  } catch (error) {
    console.error('getMyInternships error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Create a new timeline event
 */
export const createInternship = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { companyName, role, duration, responsibilities, technologiesUsed } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!companyName || !role || !duration) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const internship = await prisma.internship.create({
      data: {
        userId,
        companyName,
        role,
        duration,
        responsibilities: responsibilities || [],
        technologiesUsed: technologiesUsed || []
      }
    });

    return res.status(201).json({ status: 'success', data: internship });
  } catch (error) {
    console.error('createInternship error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Upload associated timelines document
 */
export const uploadInternshipDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Verify timeline matches user
    const existing = await prisma.internship.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Timeline item not found' });
    }

    // Upload document/recommendation letter
    const internshipDocument = await uploadToCloudinary(file.buffer, 'experience_docs');

    const updated = await prisma.internship.update({
      where: { id },
      data: { internshipDocument }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('uploadInternshipDocument error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Delete experience item
 */
export const deleteInternship = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.internship.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Timeline item not found' });
    }

    await prisma.internship.delete({
      where: { id }
    });

    return res.status(200).json({ status: 'success', message: 'Timeline event deleted' });
  } catch (error) {
    console.error('deleteInternship error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
