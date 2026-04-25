import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const sessionSchema = z.object({
  subject: z.string(),
  finalLevel: z.number(),
  totalXp: z.number(),
  challengesCompleted: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sessionSchema.parse(body);

    const db = getFirestoreAdmin();
    
    // Server-side write to Firestore using Admin SDK
    const docRef = await db.collection('codequest_sessions').add({
      ...validated,
      timestamp: new Date().toISOString(),
      source: 'Server API'
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: unknown) {
    console.error('Save Session Error:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
