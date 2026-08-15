import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { EventRsvpSchema } from '@campusconnect/shared';
import { mockEvents, mockRsvps } from '../data/mock-data.js';

export const getAllEvents = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ success: true, data: mockEvents });
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
    const event = mockEvents.find((item) => item.id === eventId);
    if (!event) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Event not found' } });
      return;
    }
    const existing = mockRsvps.find((item) => item.userId === userId && item.eventId === eventId);
    if (existing) {
      res.status(400).json({ success: false, error: { code: 'ALREADY_RSVPED', message: 'You have already joined this event' } });
      return;
    }
    const rsvp = { id: `rsvp-${Date.now()}`, userId, eventId, status: 'CONFIRMED' as const, createdAt: new Date().toISOString(), event };
    mockRsvps.push(rsvp);
    event.rsvpCount += 1;

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
    const index = mockRsvps.findIndex((item) => item.userId === userId && item.eventId === eventId);
    if (index === -1) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'RSVP not found' } });
      return;
    }
    mockRsvps.splice(index, 1);
    const event = mockEvents.find((item) => item.id === eventId);
    if (event && event.rsvpCount > 0) event.rsvpCount -= 1;

    res.json({
      success: true,
      data: { message: 'Successfully cancelled event RSVP' },
    });
  } catch (error) {
    next(error);
  }
};
