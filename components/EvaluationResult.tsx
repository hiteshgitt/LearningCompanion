import React, { useState } from 'react';
import { EvaluationResponse } from '@/lib/types';

interface EvaluationResultProps {
  evaluation: EvaluationResponse;
  onNext: () => void;
  onRetry: () => void;
  challengeTitle?: string;
}

const EvaluationResultComponent: React.FC<EvaluationResultProps> = ({ evaluation, onNext, onRetry, challengeTitle }) => {
  const isCorrect = evaluation.correct;
  const [simplerExplanation, setSimplerExplanation] = useState<string | null>(null);
  const [isLoadingSimpler, setIsLoadingSimpler] = useState(false);

  const handleExplainSimpler = async () => {
    setIsLoadingSimpler(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: challengeTitle || 'this coding concept',
          feedback: evaluation.feedback,
          tip: evaluation.tip,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSimplerExplanation(data.explanation || null);
    } catch {
      setSimplerExplanation('Sorry, could not fetch a simpler explanation right now. Try reading the tip above!');
    } finally {
      setIsLoadingSimpler(false);
    }
  };

  return (
    <div 
      className={`p-6 rounded-xl border ${isCorrect ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'} animate-fade-in-up`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3 mb-4">
        {isCorrect ? (
          <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="bg-rose-500/20 p-2 rounded-full text-rose-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <h3 className={`text-xl font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isCorrect ? 'Awesome job!' : 'Not quite right'}
        </h3>
      </div>
      
      <p className="text-slate-200 mb-4">{evaluation.feedback}</p>
      
      <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-800">
        <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-2">Pro Tip</h4>
        <p className="text-slate-400 text-sm">{evaluation.tip}</p>
      </div>

      {/* Explain Simpler - Wow Feature */}
      {!simplerExplanation && (
        <button
          onClick={handleExplainSimpler}
          disabled={isLoadingSimpler}
          className="w-full mb-4 py-2 px-4 bg-slate-800 hover:bg-violet-900/40 border border-slate-700 hover:border-violet-500 text-slate-300 hover:text-violet-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
        >
          <span>{isLoadingSimpler ? '⏳' : '💡'}</span>
          {isLoadingSimpler ? 'Getting simpler explanation...' : 'Explain it simpler'}
        </button>
      )}

      {simplerExplanation && (
        <div className="mb-4 p-4 bg-violet-900/20 border border-violet-500/30 rounded-lg animate-fade-in">
          <h4 className="text-sm font-bold text-violet-400 mb-2">💡 Simpler Explanation</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{simplerExplanation}</p>
        </div>
      )}
      
      <p className="text-slate-300 italic mb-6">{evaluation.encouragement}</p>
      
      <div className="flex justify-end">
        {isCorrect ? (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Next Challenge →
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-rose-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export const EvaluationResult = React.memo(EvaluationResultComponent);
