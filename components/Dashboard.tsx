import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subject } from '@/lib/types';
import { XPBar } from './XPBar';
import { LearningHub } from './LearningHub';

interface DashboardProps {
  onSelect: (subject: Subject) => void;
  level: number;
  xp: number;
  streak: number;
  totalCompleted: number;
}

const subjects: { id: Subject; name: string; color: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'HTML',
    name: 'HTML',
    description: 'Learn the structure of the web.',
    color: 'from-orange-500 to-orange-600 shadow-orange-500/20',
    icon: (
      <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.212-2.776H6.368l.412 5.518 5.2 1.488 5.215-1.488.75-8.83H8.531z"/>
      </svg>
    ),
  },
  {
    id: 'CSS',
    name: 'CSS',
    description: 'Style your web pages beautifully.',
    color: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    icon: (
      <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.41H5.41l.23 2.622h10.059l-.232 2.718H6.34l.23 2.62h8.895l-.326 3.426-2.91.804-2.955-.81-.212-2.776H6.368l.412 5.518 5.2 1.488 5.215-1.488.75-8.83L18.59 4.41z"/>
      </svg>
    ),
  },
  {
    id: 'JavaScript',
    name: 'JavaScript',
    description: 'Make your websites interactive.',
    color: 'from-yellow-400 to-yellow-500 shadow-yellow-500/20 text-slate-900',
    icon: (
      <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M3 3h18v18H3V3zm11.353 14.542c-.521.464-1.229.694-2.126.694-1.284 0-2.316-.481-3.096-1.442l1.62-1.411c.42.482.906.723 1.46.723.385 0 .684-.094.898-.282.213-.188.32-.429.32-.723 0-.306-.115-.55-.344-.731-.23-.182-.693-.4-1.391-.655-1.077-.384-1.834-.82-2.272-1.309-.439-.488-.658-1.09-.658-1.806 0-.84.34-1.545 1.021-2.115.68-.57 1.546-.855 2.597-.855 1.135 0 2.062.365 2.781 1.096l-1.503 1.512c-.415-.418-.881-.627-1.398-.627-.373 0-.663.097-.868.29-.205.194-.308.435-.308.723 0 .265.105.485.316.658.21.174.654.382 1.332.624 1.127.404 1.916.85 2.368 1.337.452.487.678 1.118.678 1.892 0 .862-.352 1.583-1.057 2.158zM8.136 17.618h2.622V9.691H8.136v7.927z"/>
      </svg>
    ),
  },
];

const DashboardComponent: React.FC<DashboardProps> = ({ onSelect, level, xp, streak, totalCompleted }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      
      {/* Left Sidebar: Account & Stats */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-20"></div>
          
          <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center relative z-10 mb-4 shadow-xl">
            <span className="text-4xl">🧑‍💻</span>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {level}
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-1 relative z-10">Coder Explorer</h2>
          <p className="text-slate-400 text-sm mb-6 relative z-10">Ready for the next challenge!</p>
          
          <div className="w-full flex justify-between gap-4 relative z-10">
            <div className="flex-1 bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
              <div className="text-2xl font-black text-emerald-400">{streak}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Day Streak</div>
            </div>
            <div className="flex-1 bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
              <div className="text-2xl font-black text-fuchsia-400">{totalCompleted}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
          <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-4">Experience Path</h3>
          <XPBar level={level} xp={xp} nextLevelXp={level * 100} />
          <p className="text-xs text-slate-500 text-center mt-4">Keep going to reach Level {level + 1}!</p>
        </div>

        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-violet-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
          <span>Learning Library</span>
        </button>

        <button 
          onClick={() => router.push('/learn-ai')}
          className="w-full py-4 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 hover:from-violet-900/70 hover:to-fuchsia-900/70 border-2 border-violet-500/30 hover:border-violet-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
          <span>Learn with AI</span>
        </button>
      </div>

      {/* Right Content: Subject Paths */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">

        {/* Hero Tagline - 5-second clarity */}
        <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 rounded-2xl p-6 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xs font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/30">AI-Powered Learning</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">Your personal coding tutor</h2>
          <p className="text-slate-300 text-sm leading-relaxed">Generates unique challenges, adapts difficulty to your pace, and gives real-time AI feedback — all personalized just for you.</p>
          <div className="flex gap-4 mt-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1">⚡ Adapts in real-time</span>
            <span className="flex items-center gap-1">🎯 Tracks your progress</span>
            <span className="flex items-center gap-1">🏆 Earn XP & level up</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm">Select a track to jump in. AI difficulty adjusts automatically as you improve.</p>

        <div className="flex flex-col gap-4">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="group flex items-center p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-left relative overflow-hidden"
            >
              <div className={`w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color} text-white shadow-lg shrink-0 mr-6`}>
                {s.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{s.name} Basics</h3>
                <p className="text-slate-400 text-sm">{s.description}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isLibraryOpen && <LearningHub onClose={() => setIsLibraryOpen(false)} />}
    </div>
  );
};

export const Dashboard = React.memo(DashboardComponent);
