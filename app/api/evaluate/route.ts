import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { z } from 'zod';

const evaluateRequestSchema = z.object({
  subject: z.enum(['HTML', 'CSS', 'JavaScript']),
  challenge: z.object({
    id: z.string(),
    title: z.string(),
    instruction: z.string(),
    expectedBehaviour: z.string(),
  }),
  userCode: z.string().max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = evaluateRequestSchema.parse(body);
    
    const model = getGeminiModel();
    
    const systemInstruction = `
You are an expert coding instructor evaluating a student's code.
Subject: ${validated.subject}
Challenge: ${validated.challenge.title}
Instruction: ${validated.challenge.instruction}
Expected Behaviour: ${validated.challenge.expectedBehaviour}

Student's Code:
\`\`\`
${validated.userCode}
\`\`\`

Evaluate if the code achieves the expected behaviour. Evaluate intent, not exact matches.
For example, "color:red" and "color: red" are both correct. If the code solves the problem fundamentally, mark it correct.

Return ONLY a JSON object (no markdown, no backticks).
Schema:
{
  "correct": boolean,
  "score": number (0 to 100),
  "feedback": "string (specific feedback on their code, max 2 sentences)",
  "tip": "string (one specific tip for improvement)",
  "encouragement": "string (one short motivating sentence)"
}
    `.trim();

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error: unknown) {
    console.error('Evaluate API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to evaluate code' }, { status: 500 });
  }
}
