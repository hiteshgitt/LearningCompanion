import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Subject, Challenge, EvaluationResponse } from '@/lib/types';

const initialState: GameState = {
  subject: null,
  level: 1,
  difficulty: 'normal',
  currentChallenge: null,
  xp: 0,
  streak: 0,
  wrongStreak: 0,
  correctStreak: 0,
  phase: 'subject-select',
  userCode: '',
  evaluation: null,
  history: [],
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_SUBJECT':
      return {
        ...state,
        subject: action.subject,
        phase: 'playing',
        error: null,
      };
      
    case 'SET_CHALLENGE':
      return {
        ...state,
        currentChallenge: action.challenge,
        userCode: action.challenge.type === 'code' ? action.challenge.starterCode : '',
        phase: 'playing',
        evaluation: null,
        isLoading: false,
        error: null,
        history: [...state.history, action.challenge.id],
      };

    case 'SET_CODE':
      return {
        ...state,
        userCode: action.code,
      };

    case 'SET_EVALUATION': {
      const isCorrect = action.evaluation.correct;
      let newCorrectStreak = isCorrect ? state.correctStreak + 1 : 0;
      let newWrongStreak = isCorrect ? 0 : state.wrongStreak + 1;
      let newDifficulty = state.difficulty;
      
      if (newCorrectStreak >= 3) {
        newDifficulty = 'harder';
        newCorrectStreak = 0;
      } else if (newWrongStreak >= 3) {
        newDifficulty = 'easier';
        newWrongStreak = 0;
      }

      return {
        ...state,
        evaluation: action.evaluation,
        phase: 'evaluating',
        xp: isCorrect && state.currentChallenge ? state.xp + state.currentChallenge.xp : state.xp,
        streak: isCorrect ? state.streak + 1 : 0,
        correctStreak: newCorrectStreak,
        wrongStreak: newWrongStreak,
        difficulty: newDifficulty,
        isLoading: false,
        error: null,
      };
    }

    case 'NEXT_CHALLENGE':
      return {
        ...state,
        phase: 'playing',
        currentChallenge: null,
        evaluation: null,
      };

    case 'LEVEL_UP':
      return {
        ...state,
        phase: 'levelup',
        level: state.level + 1,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
        error: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case 'RESET_STREAKS':
      return {
        ...state,
        correctStreak: 0,
        wrongStreak: 0,
        streak: 0,
      };

    case 'COMPLETE_GAME':
      return {
        ...state,
        phase: 'complete',
      };

    default:
      return state;
  }
}

export function useGameSession() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const selectSubject = useCallback((subject: Subject) => {
    dispatch({ type: 'SELECT_SUBJECT', subject });
  }, []);

  const setChallenge = useCallback((challenge: Challenge) => {
    dispatch({ type: 'SET_CHALLENGE', challenge });
  }, []);

  const setCode = useCallback((code: string) => {
    dispatch({ type: 'SET_CODE', code });
  }, []);

  const setEvaluation = useCallback((evaluation: EvaluationResponse) => {
    dispatch({ type: 'SET_EVALUATION', evaluation });
  }, []);

  const nextChallenge = useCallback(() => {
    dispatch({ type: 'NEXT_CHALLENGE' });
  }, []);

  const levelUp = useCallback(() => {
    dispatch({ type: 'LEVEL_UP' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', isLoading });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  const completeGame = useCallback(() => {
    dispatch({ type: 'COMPLETE_GAME' });
  }, []);

  return {
    state,
    selectSubject,
    setChallenge,
    setCode,
    setEvaluation,
    nextChallenge,
    levelUp,
    setLoading,
    setError,
    completeGame,
  };
}
