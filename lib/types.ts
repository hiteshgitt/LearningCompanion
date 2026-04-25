export type Subject = 'HTML' | 'CSS' | 'JavaScript';
export type Difficulty = 'easier' | 'normal' | 'harder';
export type GamePhase = 'subject-select' | 'playing' | 'evaluating' | 'levelup' | 'complete';

export interface BaseChallenge {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  xp: number;
}

export interface CodeChallenge extends BaseChallenge {
  type: 'code';
  starterCode: string;
  expectedBehaviour: string;
}

export interface FillInBlankChallenge extends BaseChallenge {
  type: 'fill-in-blank';
  template: string; // e.g., "const ___ = 'world'; console.log('hello', ___);"
  blanks: string[]; // Correct answers for each blank in order
}

export interface DragDropChallenge extends BaseChallenge {
  type: 'drag-drop';
  droppableZones: string[]; // e.g., ["<html>", "___", "</html>"]
  draggableItems: string[]; // Items the user drags
  correctOrder: string[]; // The items that should go into the '___' zones in order
}

export type Challenge = CodeChallenge | FillInBlankChallenge | DragDropChallenge;

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
