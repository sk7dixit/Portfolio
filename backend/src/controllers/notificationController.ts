import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Get all notifications for authenticated admin
 */
export const getMyNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('markNotificationRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });

    return res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllNotificationsRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id }
    });

    return res.status(200).json({ status: 'success', message: 'Notification deleted' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
