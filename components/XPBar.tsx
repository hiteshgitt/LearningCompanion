import React from 'react';

interface XPBarProps {
  level: number;
  xp: number;
  nextLevelXp?: number;
}

const XPBarComponent: React.FC<XPBarProps> = ({ level, xp, nextLevelXp = level * 100 }) => {
  const percentage = Math.min(Math.round((xp / nextLevelXp) * 100), 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-violet-600 text-white font-bold rounded flex items-center justify-center w-8 h-8 text-sm">
            L{level}
          </div>
          <span className="text-slate-300 font-medium text-sm">Level {level}</span>
        </div>
        <div className="text-violet-400 font-bold text-sm">
          {xp} <span className="text-slate-500 font-normal">/ {nextLevelXp} XP</span>
        </div>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
        <div
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={xp}
          aria-valuemin={0}
          aria-valuemax={nextLevelXp}
          aria-label={`Experience progress: ${percentage}%`}
        />
      </div>
    </div>
  );
};

export const XPBar = React.memo(XPBarComponent);
