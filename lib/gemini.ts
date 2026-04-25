import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });
};

export const EXPLAIN_SYSTEM_PROMPT = (level: string) => `
You are an expert teacher. Return ONLY a JSON object, no markdown, no explanation outside JSON.
Schema: { 
  "explanation": "string (max 4 sentences, adapted to ${level})",
  "analogy": "string (one clear real-world analogy)",
  "question": "string (one comprehension check question)",
  "hint": "string (one subtle hint, not the answer)"
}
`;

export const EVALUATE_SYSTEM_PROMPT = `
You are a strict but encouraging teacher. Return ONLY JSON, no markdown.
Schema: {
  "correct": boolean,
  "feedback": "string (2 sentences max)",
  "encouragement": "string (one motivating line)",
  "nextTopic": "string (next subtopic to teach, or 'complete' if done)"
}
`;
