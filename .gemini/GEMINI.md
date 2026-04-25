# Developer Profile
- Senior fullstack developer, 10+ years experience
- Expert in Next.js 14 App Router, TypeScript, Tailwind CSS, Firebase
- Do NOT explain basics. No beginner comments. No unnecessary questions.
- Make decisions independently. One-line note, then build.

# Project: CodeQuest — PromptWars 2026

## Concept
A gamified coding learning platform for HTML, CSS, and JavaScript.
AI generates challenges, user writes code, live preview shows output,
AI evaluates and adapts difficulty based on performance.

## Scoring Criteria (all must be satisfied)
1. Code Quality — strict TS, clean structure, typed everything
2. Security — all Gemini calls server-side, sanitize code input
3. Efficiency — debounce live preview, stream where possible
4. Testing — Vitest tests for evaluation logic
5. Accessibility — full keyboard nav, WCAG AA, aria labels
6. Problem Alignment — adaptive difficulty = adapts to pace
7. Google Services — Gemini API + Firebase + Google Fonts

## Stack
- Next.js 14 App Router, TypeScript strict mode
- Tailwind CSS only
- Firebase Firestore — anonymous session + score saving
- Gemini API — challenge generation + code evaluation
- next/font/google — Fira Code for editor, Inter for UI

## Game State (useReducer)
phases: subject-select → playing → evaluating → levelup → complete
track: subject, level, currentChallenge, xp, streak, 
       wrongStreak, correctStreak, history[]

## Adaptive Difficulty Rules
- wrongStreak >= 3 → set difficulty to 'easier', reset streak
- correctStreak >= 3 → set difficulty to 'harder', reset streak
- Pass this difficulty hint to /api/challenge on every call

## API Routes

### /app/api/challenge/route.ts
POST { subject, level, difficulty, completedChallenges[] }
Gemini returns JSON only:
{
  "id": "string",
  "title": "string",
  "instruction": "string",
  "starterCode": "string",
  "expectedBehaviour": "string",
  "hint": "string",
  "xp": "number"
}

### /app/api/evaluate/route.ts
POST { subject, challenge, userCode }
Gemini returns JSON only:
{
  "correct": boolean,
  "score": number (0-100),
  "feedback": "string (specific, max 2 sentences)",
  "tip": "string (one improvement tip)",
  "encouragement": "string"
}
IMPORTANT: Gemini must evaluate intent, not exact match.
"color:red" and "color: red" are both correct.

## Security Rules
- Sanitize all user code input — strip script tags with src attributes
- Max code input: 2000 chars
- Never execute user code server-side — only evaluate via Gemini
- Live preview uses sandboxed iframe: sandbox="allow-scripts"
- Zod validation on all API inputs

## Live Preview Rules
- Debounce preview rendering by 500ms after user stops typing
- HTML subject: render directly in sandboxed iframe
- CSS subject: wrap in <div> with user styles in <style> tag
- JS subject: wrap in try/catch, show runtime errors in preview panel
- Never show blank iframe — show placeholder if code is empty

## UI Design
- Dark theme (slate-900 background) — looks like a real code editor
- Editor panel: left 50%, Preview panel: right 50%
- On mobile: stacked, editor top, preview bottom
- Accent: violet-500 (more game-like than blue)
- XP bar: violet gradient, animated fill on XP gain
- Correct feedback: emerald-400, Wrong: rose-400
- Font: Fira Code for editor (monospace), Inter for UI text
- Challenge card slides in from right on each new challenge

## Accessibility
- Code editor textarea must have aria-label="Code editor"
- Live preview iframe must have title="Live preview"
- XP bar: role=progressbar, aria-valuenow, aria-valuemin, aria-valuemax
- All buttons keyboard accessible, visible focus ring
- Feedback messages use aria-live="polite"
- Colour + icon together for correct/wrong — never colour alone

## Component Build Order
1. SubjectSelector — HTML/CSS/JS cards with icons
2. ChallengeCard — instruction + starter code
3. CodeEditor — styled textarea, monospace, line numbers optional
4. LivePreview — sandboxed iframe with debounced render
5. EvaluationResult — correct/wrong with feedback
6. XPBar — animated progress bar
7. LevelUpScreen — celebration + next level button
8. CompletionScreen — final score + Firebase save + share

## Testing
__tests__/evaluate.test.ts:
- Parses correct Gemini evaluation response
- Parses wrong answer response
- Handles malformed JSON gracefully
- Validates code input length limit
