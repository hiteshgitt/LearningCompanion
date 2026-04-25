"use client";

import React, { useEffect, useCallback } from 'react';
import { useGameSession } from '@/hooks/useGameSession';
import { SubjectSelector } from '@/components/SubjectSelector';
import { ChallengeCard } from '@/components/ChallengeCard';
import { CodeEditor } from '@/components/CodeEditor';
import { LivePreview } from '@/components/LivePreview';
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
    } catch (err: any) {
      setError(err.message || 'Error loading challenge');
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
    } catch (err: any) {
      setError(err.message || 'Error evaluating code');
    }
  };

  const handleNextAction = () => {
    if (state.xp >= state.level * 100) {
      levelUp();
    } else if (state.history.length >= 10) { // arbitrary completion condition
      completeGame();
    } else {
      nextChallenge();
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter">
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
          <SubjectSelector onSelect={selectSubject} />
        )}

        {state.phase === 'playing' && state.isLoading && (
          <div className="flex justify-center items-center h-64">
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
                    // Just clear evaluation to go back to editing
                    nextChallenge();
                  }} 
                />
              ) : (
                <button
                  onClick={handleEvaluate}
                  disabled={state.isLoading || !state.userCode.trim()}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {state.isLoading ? 'Evaluating...' : 'Run Code'}
                </button>
              )}
            </div>
            
            <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6">
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
