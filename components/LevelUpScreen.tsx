import React, { useEffect, useState } from 'react';

interface LevelUpScreenProps {
  level: number;
  onContinue: () => void;
}

const LevelUpScreenComponent: React.FC<LevelUpScreenProps> = ({ level, onContinue }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-800 rounded-3xl border-2 border-violet-500/50 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden animate-fade-in-up">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-800 to-slate-800 pointer-events-none" />
      
      {showConfetti && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-6 z-10">
        LEVEL UP!
      </h2>

      <div className="relative mb-8 z-10">
        <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full" />
        <div className="w-32 h-32 bg-slate-900 rounded-full border-4 border-violet-500 flex items-center justify-center relative shadow-xl">
          <span className="text-5xl font-black text-white">{level}</span>
        </div>
      </div>

      <p className="text-slate-300 text-lg mb-8 text-center max-w-md z-10">
        You've mastered the basics and are ready for more complex challenges. Keep coding!
      </p>

      <button
        onClick={onContinue}
        className="z-10 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Continue Quest
      </button>
    </div>
  );
};

export const LevelUpScreen = React.memo(LevelUpScreenComponent);
