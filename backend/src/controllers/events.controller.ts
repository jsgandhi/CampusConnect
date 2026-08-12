import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { EventRsvpSchema } from '@campusconnect/shared';

const prisma = new PrismaClient();

export const getAllEvents = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.campusEvent.findMany({
      orderBy: { startTime: 'asc' },
    });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const rsvpEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = EventRsvpSchema.parse(req.body);
    const userId = req.user?.id || 'demo-student-id';

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
      });
      return;
    }

    const rsvp = await prisma.eventRSVP.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
      update: { status: 'CONFIRMED' },
      create: {
        userId: user.id,
        eventId,
        status: 'CONFIRMED',
      },
      include: { event: true },
    });

    await prisma.campusEvent.update({
      where: { id: eventId },
      data: { rsvpCount: { increment: 1 } },
    });

    res.json({
      success: true,
      data: rsvp,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRsvp = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id || 'demo-student-id';

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
      });
      return;
    }

    await prisma.eventRSVP.delete({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
    });

    await prisma.campusEvent.update({
      where: { id: eventId },
      data: { rsvpCount: { decrement: 1 } },
    });

    res.json({
      success: true,
      data: { message: 'Successfully cancelled event RSVP' },
    });
  } catch (error) {
    next(error);
  }
};
