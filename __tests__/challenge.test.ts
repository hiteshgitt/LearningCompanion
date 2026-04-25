import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/challenge/route';
import { NextRequest } from 'next/server';

const mockModel = {
  generateContent: vi.fn(),
};

vi.mock('@/lib/gemini', () => {
  return {
    getGeminiModel: vi.fn(() => mockModel)
  };
});

describe('POST /api/challenge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    subject: 'HTML',
    level: 1,
    difficulty: 'normal',
    completedChallenges: []
  };

  it('Parses correct Gemini challenge response', async () => {
    mockModel.generateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          id: 'test-id',
          title: 'Hello World',
          instruction: 'Create an h1 tag',
          starterCode: '<!-- code here -->',
          expectedBehaviour: 'Shows a heading',
          hint: 'Use <h1>',
          xp: 10
        })
      }
    });

    const req = new NextRequest('http://localhost/api/challenge', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe('test-id');
    expect(data.title).toBe('Hello World');
  });

  it('Handles malformed JSON gracefully', async () => {
    mockModel.generateContent.mockResolvedValueOnce({
      response: {
        text: () => 'Invalid JSON'
      }
    });

    const req = new NextRequest('http://localhost/api/challenge', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to generate challenge');
  });

  it('Validates input parameters correctly (missing subject)', async () => {
    const req = new NextRequest('http://localhost/api/challenge', {
      method: 'POST',
      body: JSON.stringify({
        level: 1,
        difficulty: 'normal'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid request parameters');
  });

  it('Validates input parameters correctly (invalid difficulty)', async () => {
    const req = new NextRequest('http://localhost/api/challenge', {
      method: 'POST',
      body: JSON.stringify({
        ...validPayload,
        difficulty: 'impossible'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid request parameters');
  });
});
