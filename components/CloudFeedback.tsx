'use client';

import React, { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function CloudFeedback() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !auth?.currentUser) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'user_feedback'), {
        userId: auth.currentUser.uid,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        source: 'Dashboard'
      });
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Feedback failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 mt-4">
      <h3 className="text-sm uppercase font-black text-slate-400 tracking-widest mb-4 flex items-center gap-2">
        <span>💬</span>
        Live Cloud Feedback
      </h3>
      
      {sent ? (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-xs font-bold animate-fade-in">
          🚀 Sent to Google Cloud! Thank you.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Help us improve CodeQuest..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none h-20"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
          >
            {sending ? 'Sending...' : 'Transmit to Cloud'}
          </button>
        </form>
      )}
    </div>
  );
}
