import React from 'react';
import { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-fade-in-right">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
        <span className="bg-violet-500/20 text-violet-400 text-xs font-bold px-3 py-1 rounded-full border border-violet-500/30">
          +{challenge.xp} XP
        </span>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Instruction</h4>
        <p className="text-slate-300 leading-relaxed">{challenge.instruction}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Expected Behaviour</h4>
        <p className="text-slate-300 leading-relaxed">{challenge.expectedBehaviour}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <details className="group">
          <summary className="text-violet-400 cursor-pointer font-medium hover:text-violet-300 transition-colors list-none flex items-center">
            <svg className="w-5 h-5 mr-2 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Need a hint?
          </summary>
          <p className="mt-3 text-slate-400 text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            {challenge.hint}
          </p>
        </details>
      </div>
    </div>
  );
};
