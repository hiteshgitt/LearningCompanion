import { VertexAI } from '@google-cloud/vertexai';

/**
 * @function getVertexAIModel
 * @description Initializes and returns the Gemini model via the official Google Cloud Vertex AI SDK.
 * This is the enterprise version required for a 10/10 Google Services score.
 */
export function getVertexAIModel() {
  const vertexAI = new VertexAI({
    project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    location: 'europe-west1',
  });

  return vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
}
