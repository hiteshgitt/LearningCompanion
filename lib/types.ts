export type Subject = 'HTML' | 'CSS' | 'JavaScript';
export type Difficulty = 'easier' | 'normal' | 'harder';
export type GamePhase = 'subject-select' | 'playing' | 'evaluating' | 'levelup' | 'complete';

export interface Challenge {
  id: string;
  title: string;
  instruction: string;
  starterCode: string;
  expectedBehaviour: string;
  hint: string;
  xp: number;
}

export interface EvaluationResponse {
  correct: boolean;
  score: number;
  feedback: string;
  tip: string;
  encouragement: string;
}

export interface GameState {
  subject: Subject | null;
  level: number;
  difficulty: Difficulty;
  currentChallenge: Challenge | null;
  xp: number;
  streak: number;
  wrongStreak: number;
  correctStreak: number;
  phase: GamePhase;
  userCode: string;
  evaluation: EvaluationResponse | null;
  history: string[]; // Challenge IDs
  isLoading: boolean;
  error: string | null;
}

export type GameAction =
  | { type: 'SELECT_SUBJECT'; subject: Subject }
  | { type: 'SET_CHALLENGE'; challenge: Challenge }
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_EVALUATION'; evaluation: EvaluationResponse }
  | { type: 'NEXT_CHALLENGE' }
  | { type: 'LEVEL_UP' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET_STREAKS' }
  | { type: 'COMPLETE_GAME' };
