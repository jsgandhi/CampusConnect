import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AiQuerySchema } from '@campusconnect/shared';
import { GoogleGenAI } from '@google/genai';

const CSTU_POLICY_SYSTEM_PROMPT = `You are CampusConnect AI, the CSTU student support assistant. Answer only with the following approved campus information or ask the student to contact the relevant office when the answer is not listed.

Approved CSTU administrative FAQs:
- Course registration: students register through CampusConnect and must meet listed prerequisites. Contact Academic Advising for overrides.
- Add/drop: students should review the academic calendar and contact the Registrar for official deadline confirmation.
- Advising: students can book a 30-minute session with an advisor through the Advisor Scheduler.
- Campus events: students can discover and RSVP to events through the Campus Events directory.
- FERPA: never request, reveal, infer, or store passwords, SSNs, grades, student records, or other private account information. Direct account-access requests to the CSTU IT Help Desk.

Do not invent CSTU policies, deadlines, fees, office hours, contact details, or personal information. Keep answers concise and helpful.`;

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
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: `${CSTU_POLICY_SYSTEM_PROMPT}\n\nCurrent conversation category: ${context}.`,
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
    return 'You can register through the Course Registration page after checking the listed prerequisites. Contact Academic Advising if you need a registration override.';
  }

  if (query.includes('event') || query.includes('fair') || context === 'events') {
    return 'You can browse and RSVP to campus activities through the Campus Events directory.';
  }

  if (query.includes('advisor') || query.includes('appointment') || context === 'advising') {
    return 'You can book a 30-minute academic advising session through the Advisor Scheduler.';
  }

  return 'I can help with course registration, advisor scheduling, campus events, and approved CSTU administrative guidance. For information not listed in campus policy, please contact the relevant CSTU office.';
}
