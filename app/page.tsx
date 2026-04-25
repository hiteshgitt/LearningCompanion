"use client";

import React, { useEffect, useCallback } from 'react';
import { useGameSession } from '@/hooks/useGameSession';
import { Dashboard } from '@/components/Dashboard';
import { ChallengeCard } from '@/components/ChallengeCard';
import { CodeEditor } from '@/components/CodeEditor';
import { LivePreview } from '@/components/LivePreview';
import { FillInBlankChallenge } from '@/components/FillInBlankChallenge';
import { DragDropChallenge } from '@/components/DragDropChallenge';
import { EvaluationResult } from '@/components/EvaluationResult';
import { XPBar } from '@/components/XPBar';
import { LevelUpScreen } from '@/components/LevelUpScreen';
import { CompletionScreen } from '@/components/CompletionScreen';

export default function CodeQuest() {
  const {
    state,
    selectSubject,
    setChallenge,
    setCode,
    setEvaluation,
    nextChallenge,
    levelUp,
    setLoading,
    setError,
    completeGame
  } = useGameSession();

  const fetchChallenge = useCallback(async () => {
    if (!state.subject) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: state.subject,
          level: state.level,
          difficulty: state.difficulty,
          completedChallenges: state.history,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch challenge');
      const data = await res.json();
      setChallenge(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading challenge');
    }
  }, [state.subject, state.level, state.difficulty, state.history, setLoading, setChallenge, setError]);

  // Handle phase transitions
  useEffect(() => {
    if (state.phase === 'playing' && !state.currentChallenge) {
      fetchChallenge();
    }
  }, [state.phase, state.currentChallenge, fetchChallenge]);

  const handleEvaluate = async () => {
    if (!state.subject || !state.currentChallenge) return;
    
    // Local evaluation for gamified challenge types (faster, no API hit required)
    if (state.currentChallenge.type === 'fill-in-blank') {
      try {
        const answers = JSON.parse(state.userCode || '[]');
        const isCorrect = JSON.stringify(answers) === JSON.stringify(state.currentChallenge.blanks);
        setEvaluation({
          correct: isCorrect,
          score: isCorrect ? 100 : 0,
          feedback: isCorrect ? 'Perfect! You filled in the blanks correctly.' : 'Not quite right. Double check your answers.',
          tip: state.currentChallenge.hint,
          encouragement: isCorrect ? 'Keep it up!' : 'Try again, you got this!'
        });
      } catch {
        setError('Invalid answer format');
      }
      return;
    }

    if (state.currentChallenge.type === 'drag-drop') {
      try {
        const slots = JSON.parse(state.userCode || '[]');
        const isCorrect = JSON.stringify(slots) === JSON.stringify(state.currentChallenge.correctOrder);
        setEvaluation({
          correct: isCorrect,
          score: isCorrect ? 100 : 0,
          feedback: isCorrect ? 'Spot on! You arranged everything correctly.' : 'Some items are in the wrong place.',
          tip: state.currentChallenge.hint,
          encouragement: isCorrect ? 'Excellent logic!' : 'Keep dragging, you will get it!'
        });
      } catch {
        setError('Invalid answer format');
      }
      return;
    }

    // API evaluation for 'code' type
    setLoading(true);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: state.subject,
          challenge: state.currentChallenge,
          userCode: state.userCode,
        }),
      });

      if (!res.ok) throw new Error('Failed to evaluate code');
      const data = await res.json();
      setEvaluation(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error evaluating code');
    }
  };

  const handleNextAction = () => {
    if (state.xp >= state.level * 100) {
      levelUp();
    } else if (state.history.length >= 10) { 
      completeGame();
    } else {
      nextChallenge();
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter cursor-pointer transition-transform hover:scale-105" onClick={() => window.location.reload()}>
          CodeQuest
        </h1>
        {(state.phase !== 'subject-select' && state.phase !== 'complete') && (
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <XPBar level={state.level} xp={state.xp} nextLevelXp={state.level * 100} />
          </div>
        )}
      </header>

      {/* Mobile XP Bar */}
      {(state.phase !== 'subject-select' && state.phase !== 'complete') && (
        <div className="md:hidden mb-6 w-full">
          <XPBar level={state.level} xp={state.xp} nextLevelXp={state.level * 100} />
        </div>
      )}

      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center">
        {state.error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6 flex justify-between items-center" aria-live="assertive">
            <p>{state.error}</p>
            <button onClick={() => setError('')} className="hover:text-rose-300">✕</button>
          </div>
        )}

        {state.phase === 'subject-select' && (
          <Dashboard 
            onSelect={selectSubject} 
            level={state.level} 
            xp={state.xp} 
            streak={state.streak} 
            totalCompleted={state.history.length} 
          />
        )}

        {state.phase === 'playing' && state.isLoading && (
          <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        )}

        {(state.phase === 'playing' || state.phase === 'evaluating') && state.currentChallenge && !state.isLoading && (
          <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <ChallengeCard challenge={state.currentChallenge} />
              
              {state.phase === 'evaluating' && state.evaluation ? (
                <EvaluationResult 
                  evaluation={state.evaluation} 
                  onNext={handleNextAction} 
                  onRetry={() => {
                    nextChallenge();
                  }} 
                />
              ) : (
                <button
                  onClick={handleEvaluate}
                  disabled={state.isLoading}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {state.isLoading ? 'Evaluating...' : 'Check Answer'}
                </button>
              )}
            </div>
            
            {state.currentChallenge.type === 'code' && (
              <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6 animate-fade-in">
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="bg-slate-800 rounded-t-xl px-4 py-2 border-t border-l border-r border-slate-700 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Editor ({state.subject})
                  </div>
                  <div className="flex-1 min-h-[300px]">
                    <CodeEditor 
                      code={state.userCode} 
                      onChange={setCode} 
                      disabled={state.phase === 'evaluating'} 
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="bg-slate-800 rounded-t-xl px-4 py-2 border-t border-l border-r border-slate-700 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Live Preview
                  </div>
                  <div className="flex-1 min-h-[300px]">
                    <LivePreview code={state.userCode} subject={state.subject!} />
                  </div>
                </div>
              </div>
            )}

            {state.currentChallenge.type === 'fill-in-blank' && (
              <div className="w-full lg:w-2/3 flex flex-col gap-6 animate-fade-in">
                <div className="bg-slate-800 rounded-t-xl px-4 py-2 border-t border-l border-r border-slate-700 text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Fill in the Blanks
                </div>
                <div className="flex-1 min-h-[300px]">
                  <FillInBlankChallenge 
                    challenge={state.currentChallenge} 
                    onChange={setCode} 
                    disabled={state.phase === 'evaluating'} 
                  />
                </div>
              </div>
            )}

            {state.currentChallenge.type === 'drag-drop' && (
              <div className="w-full lg:w-2/3 flex flex-col gap-6 animate-fade-in">
                <div className="bg-slate-800 rounded-t-xl px-4 py-2 border-t border-l border-r border-slate-700 text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Drag and Drop Snippets
                </div>
                <div className="flex-1 min-h-[300px]">
                  <DragDropChallenge 
                    challenge={state.currentChallenge} 
                    onChange={setCode} 
                    disabled={state.phase === 'evaluating'} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {state.phase === 'levelup' && (
          <LevelUpScreen level={state.level} onContinue={nextChallenge} />
        )}

        {state.phase === 'complete' && (
          <CompletionScreen 
            subject={state.subject} 
            level={state.level} 
            xp={state.xp} 
            history={state.history} 
          />
        )}
      </div>
    </main>
  );
}
