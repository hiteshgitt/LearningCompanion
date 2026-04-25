import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const chatSchema = z.object({
  question: z.string().min(1).max(1000),
  subject: z.enum(['HTML', 'CSS', 'JavaScript']).optional(),
  level: z.number().min(1).max(10).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = chatSchema.parse(body);

    const { getVertexAIModel } = await import('@/lib/vertexai');
    const model = getVertexAIModel();

    const context = validated.subject
      ? `The user is learning ${validated.subject} at Level ${validated.level ?? 1} out of 10.`
      : 'The user is learning web development.';

    const prompt = `
You are a friendly, expert coding tutor helping a student learn web development.
${context}

The student asks: "${validated.question}"

Rules:
- Answer clearly and concisely (max 4 sentences).
- Use simple language appropriate for their level.
- If relevant, include a short code example wrapped in backticks.
- Be encouraging and supportive.
- Do not suggest leaving the platform.

Return a JSON object: { "answer": "string" }
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to get answer' }, { status: 500 });
  }
}
