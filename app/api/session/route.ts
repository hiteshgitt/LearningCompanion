import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sessionSchema = z.object({
  subject: z.enum(['HTML', 'CSS', 'JavaScript']),
  level: z.number().min(1).max(10),
  xp: z.number().min(0),
  streak: z.number().min(0),
  completedChallenges: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sessionSchema.parse(body);

    const docRef = await addDoc(collection(db, 'sessions'), {
      ...validated,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ sessionId: docRef.id }, { status: 201 });
  } catch (error: unknown) {
    console.error('Session API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'CodeQuest session API. Use POST to save a session.' },
    { status: 200 }
  );
}
