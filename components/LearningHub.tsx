import React, { useState } from 'react';
import { Subject } from '@/lib/types';
import { learningResources } from '@/lib/resources';

interface LearningHubProps {
  onClose: () => void;
}

const LearningHubComponent: React.FC<LearningHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Subject>('HTML');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-3xl">📚</span> Learning Library
            </h2>
            <p className="text-slate-400 text-sm mt-1">Curated documentation and video tutorials.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Close Learning Library"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-4 bg-slate-800/20 border-b border-slate-700">
          {(['HTML', 'CSS', 'JavaScript'] as Subject[]).map(subject => (
            <button
              key={subject}
              onClick={() => setActiveTab(subject)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === subject 
                  ? 'border-violet-500 text-violet-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningResources[activeTab].map(resource => (
              <a 
                key={resource.id} 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                    resource.type === 'video' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {resource.type === 'video' ? '▶ Video' : '📖 Docs'}
                  </div>
                  <div className="text-slate-500 group-hover:text-violet-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">{resource.title}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-1">{resource.description}</p>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-auto">
                  By {resource.author}
                </div>
              </a>
            ))}
          </div>
          {learningResources[activeTab].length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No resources available for this subject yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export const LearningHub = React.memo(LearningHubComponent);
