import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const challengeRequestSchema = z.object({
  subject: z.enum(['HTML', 'CSS', 'JavaScript']),
  level: z.number().min(1),
  difficulty: z.enum(['easier', 'normal', 'harder']),
  completedChallenges: z.array(z.string()).default([]),
});

// Server-side in-memory cache for efficiency (avoids redundant Gemini API calls)
interface CacheEntry { data: unknown; expiresAt: number; }
const challengeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(subject: string, level: number, difficulty: string): string {
  return `${subject}:${level}:${difficulty}:${Date.now() % CACHE_TTL_MS}`;
}

function getFromCache(key: string): unknown | null {
  const entry = challengeCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { challengeCache.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  // Evict entries if cache grows too large
  if (challengeCache.size > 50) {
    const firstKey = challengeCache.keys().next().value;
    if (firstKey) challengeCache.delete(firstKey);
  }
  challengeCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = challengeRequestSchema.parse(body);
    
    // Check cache first (efficiency optimization)
    const cacheKey = getCacheKey(validated.subject, validated.level, validated.difficulty);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const { getVertexAIModel } = await import('@/lib/vertexai');
    const model = getVertexAIModel();
    
    const systemInstruction = `
You are an expert coding instructor. Generate a coding challenge for a user learning ${validated.subject}.
The user is at Level ${validated.level} out of 10. The difficulty should be "${validated.difficulty}".
Do not repeat any of these challenge IDs: ${validated.completedChallenges.join(', ')}.

First, randomly pick ONE of the following challenge types: 'code', 'fill-in-blank', or 'drag-drop'.
Then generate the challenge according to the chosen type.

Return ONLY a single JSON object (no markdown, no backticks).
If type is 'code':
{
  "type": "code",
  "id": "string (unique identifier for this challenge)",
  "title": "string (short, catchy title)",
  "instruction": "string (clear instruction of what to build)",
  "starterCode": "string (initial code for the user to start with)",
  "expectedBehaviour": "string (what the final code should do)",
  "hint": "string (one helpful tip)",
  "xp": number (between 10 and 50 based on difficulty)
}

If type is 'fill-in-blank':
{
  "type": "fill-in-blank",
  "id": "string",
  "title": "string",
  "instruction": "string",
  "template": "string (code with exactly three underscores '___' for each blank)",
  "blanks": ["string (correct answer for blank 1)", "string (answer 2)"],
  "hint": "string",
  "xp": number
}

If type is 'drag-drop':
{
  "type": "drag-drop",
  "id": "string",
  "title": "string",
  "instruction": "string",
  "droppableZones": ["string (static code)", "___", "string (static code)", "___"],
  "draggableItems": ["string (draggable item 1)", "string (item 2)", "string (distractor item)"],
  "correctOrder": ["string (item 1)", "string (item 2)"],
  "hint": "string",
  "xp": number
}
    `.trim();

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    // Store in cache
    setCache(cacheKey, JSON.parse(cleanedText));
    
    return NextResponse.json(JSON.parse(cleanedText), {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error: unknown) {
    console.error('Challenge API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate challenge', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

