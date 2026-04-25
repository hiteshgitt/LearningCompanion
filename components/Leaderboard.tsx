'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface LeaderboardEntry {
  id: string;
  subject: string;
  totalXp: number;
  finalLevel: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // REAL-TIME FIRESTORE INTEGRATION
    const q = query(
      collection(db, 'codequest_sessions'),
      orderBy('totalXp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-slate-800/50 rounded-xl"></div>;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🏆</span>
        <h3 className="text-sm uppercase font-black text-slate-400 tracking-widest">Global Leaderboard</h3>
      </div>
      
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No entries yet. Be the first!</p>
        ) : (
          entries.map((entry, idx) => (
            <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  idx === 0 ? 'bg-yellow-500 text-slate-900' : 
                  idx === 1 ? 'bg-slate-300 text-slate-900' : 
                  idx === 2 ? 'bg-orange-500 text-slate-900' : 'bg-slate-700 text-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">{entry.subject} Master</div>
                  <div className="text-[10px] text-slate-500">Level {entry.finalLevel}</div>
                </div>
              </div>
              <div className="text-xs font-black text-emerald-400">{entry.totalXp} XP</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
