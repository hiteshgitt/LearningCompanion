import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { z } from 'zod';

const challengeRequestSchema = z.object({
  subject: z.enum(['HTML', 'CSS', 'JavaScript']),
  level: z.number().min(1),
  difficulty: z.enum(['easier', 'normal', 'harder']),
  completedChallenges: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = challengeRequestSchema.parse(body);
    
    const model = getGeminiModel();
    
    const systemInstruction = `
You are an expert coding instructor. Generate a coding challenge for a user learning ${validated.subject}.
The user is at Level ${validated.level} out of 10. The difficulty should be "${validated.difficulty}".
Do not repeat any of these challenge IDs: ${validated.completedChallenges.join(', ')}.

Return ONLY a JSON object (no markdown, no backticks).
Schema:
{
  "id": "string (unique identifier for this challenge)",
  "title": "string (short, catchy title)",
  "instruction": "string (clear instruction of what to build)",
  "starterCode": "string (initial code for the user to start with)",
  "expectedBehaviour": "string (what the final code should do)",
  "hint": "string (one helpful tip)",
  "xp": number (between 10 and 50 based on difficulty)
}
    `.trim();

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error: any) {
    console.error('Challenge API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 });
  }
}
