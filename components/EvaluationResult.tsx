import React from 'react';
import { EvaluationResponse } from '@/lib/types';

interface EvaluationResultProps {
  evaluation: EvaluationResponse;
  onNext: () => void;
  onRetry: () => void;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({ evaluation, onNext, onRetry }) => {
  const isCorrect = evaluation.correct;
  
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
      
      <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-800">
        <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-2">Pro Tip</h4>
        <p className="text-slate-400 text-sm">{evaluation.tip}</p>
      </div>
      
      <p className="text-slate-300 italic mb-6">{evaluation.encouragement}</p>
      
      <div className="flex justify-end">
        {isCorrect ? (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Next Challenge
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
