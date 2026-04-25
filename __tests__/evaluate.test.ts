import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/evaluate/route';
import { NextRequest } from 'next/server';

// Create a mock model object
const mockModel = {
  generateContent: vi.fn(),
};

// Mock the Gemini API module
vi.mock('@/lib/gemini', () => {
  return {
    getGeminiModel: vi.fn(() => mockModel)
  };
});

describe('POST /api/evaluate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    subject: 'CSS',
    challenge: {
      id: '123',
      title: 'Test',
      instruction: 'Make it red',
      expectedBehaviour: 'Text is red'
    },
    userCode: 'color: red;'
  };

  it('Parses correct Gemini evaluation response', async () => {
    mockModel.generateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          correct: true,
          score: 100,
          feedback: 'Great job!',
          tip: 'Use hex codes next time',
          encouragement: 'Keep going!'
        })
      }
    });

    const req = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.correct).toBe(true);
    expect(data.score).toBe(100);
  });

  it('Parses wrong answer response', async () => {
    mockModel.generateContent.mockResolvedValueOnce({
      response: {
        text: () => '```json\n{"correct":false,"score":0,"feedback":"Not quite.","tip":"Check syntax.","encouragement":"Try again!"}\n```'
      }
    });

    const req = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, userCode: 'color: blue;' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.correct).toBe(false);
    expect(data.score).toBe(0);
  });

  it('Handles malformed JSON gracefully', async () => {
    mockModel.generateContent.mockResolvedValueOnce({
      response: {
        text: () => 'This is not JSON'
      }
    });

    const req = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to evaluate code');
  });

  it('Validates code input length limit', async () => {
    const req = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        ...validPayload,
        userCode: 'a'.repeat(2001) // Max is 2000
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid request parameters');
  });
});
