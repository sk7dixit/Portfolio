import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../config/cloudinary';

/**
 * Get all certificates for authenticated user
 */
export const getMyCertificates = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: certificates });
  } catch (error) {
    console.error('getMyCertificates error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Create a new certificate record
 */
export const createCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, organization, issueDate, credentialLink } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!title || !organization || !issueDate) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        title,
        organization,
        issueDate,
        credentialLink
      }
    });

    return res.status(201).json({ status: 'success', data: certificate });
  } catch (error) {
    console.error('createCertificate error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Upload certificate credentials image/pdf
 */
export const uploadCertificateImage = async (req: AuthenticatedRequest, res: Response) => {
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

    // Verify certificate belongs to user
    const existing = await prisma.certificate.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Stream directly to Cloudinary
    const certificateImage = await uploadToCloudinary(file.buffer, 'certificates');

    const updated = await prisma.certificate.update({
      where: { id },
      data: { certificateImage }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('uploadCertificateImage error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Delete certificate
 */
export const deleteCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.certificate.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await prisma.certificate.delete({
      where: { id }
    });

    return res.status(200).json({ status: 'success', message: 'Certificate deleted' });
  } catch (error) {
    console.error('deleteCertificate error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
