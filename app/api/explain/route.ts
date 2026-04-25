import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { z } from 'zod';

const explainSchema = z.object({
  topic: z.string().min(1).max(200),
  feedback: z.string().max(500),
  tip: z.string().max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = explainSchema.parse(body);

    const model = getGeminiModel();

    const prompt = `
A student just completed a coding challenge about "${validated.topic}".
They received this feedback: "${validated.feedback}"
And this tip: "${validated.tip}"

Please give a MUCH simpler, beginner-friendly re-explanation of this concept.
Use an analogy or real-world example. Max 3 sentences. 
No jargon. Write like you are explaining to a complete beginner.

Return a JSON object: { "explanation": "string" }
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Explain API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
