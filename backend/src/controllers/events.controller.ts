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
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Your session is invalid. Please log in again.' },
      });
      return;
    }

    const existing = await prisma.eventRSVP.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (existing && existing.status === 'CONFIRMED') {
      res.status(400).json({
        success: false,
        error: { code: 'ALREADY_RSVPD', message: 'You have already RSVP\u2019d to this event' },
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
    const userId = req.user!.id;

    const existing = await prisma.eventRSVP.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!existing || existing.status !== 'CONFIRMED') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'You have not RSVP\u2019d to this event' },
      });
      return;
    }

    await prisma.eventRSVP.update({
      where: { userId_eventId: { userId, eventId } },
      data: { status: 'CANCELLED' },
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
