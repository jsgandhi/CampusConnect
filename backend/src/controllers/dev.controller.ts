import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resetData = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Delete transactional user data for demo reset
    await prisma.chatMessage.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.eventRSVP.deleteMany();
    await prisma.enrollment.deleteMany();

    res.json({
      success: true,
      data: { message: 'Developer panel: Reset user activity & transactional data successfully.' },
    });
  } catch (error) {
    next(error);
  }
};
