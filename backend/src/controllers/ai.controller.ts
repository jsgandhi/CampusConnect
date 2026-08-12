import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AiQuerySchema } from '@campusconnect/shared';
import { GoogleGenAI } from '@google/genai';

export const handleAiChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt, context } = AiQuerySchema.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY;

    let assistantResponse = '';

    if (apiKey && apiKey !== 'your-gemini-api-key-here') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are CampusConnect AI, an intelligent, friendly campus assistant for CSTU students. Provide helpful advice regarding ${context}, degree planning, campus events, and registration guidelines.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        assistantResponse = response.text || 'I could not process your query at this moment. Please try asking in a different way.';
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to mock assistant:', geminiErr);
        assistantResponse = generateFallbackResponse(prompt, context);
      }
    } else {
      assistantResponse = generateFallbackResponse(prompt, context);
    }

    res.json({
      success: true,
      data: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString(),
        category: context,
      },
    });
  } catch (error) {
    next(error);
  }
};

function generateFallbackResponse(prompt: string, context: string): string {
  const query = prompt.toLowerCase();

  if (query.includes('course') || query.includes('register') || context === 'courses') {
    return 'For Spring 2026 registration, make sure to check prerequisites for CS-401 (Advanced Full-Stack) and CS-480 (Artificial Intelligence). You can manage your course enrollments directly from the Courses tab on your CampusConnect dashboard!';
  }

  if (query.includes('event') || query.includes('fair') || context === 'events') {
    return 'Don\'t miss the Spring 2026 Tech & AI Career Fair on August 20 in the Campus Center Great Hall! Over 50 tech companies will be present. Be sure to RSVP in the Events tab to receive reminders and fast-track check-in.';
  }

  if (query.includes('advisor') || query.includes('appointment') || context === 'advising') {
    return 'You can schedule an advising session with Dr. Robert Chen (CS Department Chair) or Prof. Amanda Taylor (Career Counselor) using our Advisor Scheduler. Appointments are available Mon-Fri between 9:00 AM and 4:00 PM.';
  }

  return `Thanks for reaching out! As your CampusConnect AI Assistant for ${context}, I am here to help you navigate courses, campus events, degree requirements, and academic advising. Let me know what specific information you need!`;
}
