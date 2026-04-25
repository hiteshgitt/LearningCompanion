import React from 'react';
import { Subject } from '@/lib/types';

interface SubjectSelectorProps {
  onSelect: (subject: Subject) => void;
}

const subjects: { id: Subject; name: string; color: string; icon: React.ReactNode }[] = [
  {
    id: 'HTML',
    name: 'HTML',
    color: 'hover:border-orange-500 hover:text-orange-500',
    icon: (
      <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.212-2.776H6.368l.412 5.518 5.2 1.488 5.215-1.488.75-8.83H8.531z"/>
      </svg>
    ),
  },
  {
    id: 'CSS',
    name: 'CSS',
    color: 'hover:border-blue-500 hover:text-blue-500',
    icon: (
      <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.41H5.41l.23 2.622h10.059l-.232 2.718H6.34l.23 2.62h8.895l-.326 3.426-2.91.804-2.955-.81-.212-2.776H6.368l.412 5.518 5.2 1.488 5.215-1.488.75-8.83L18.59 4.41z"/>
      </svg>
    ),
  },
  {
    id: 'JavaScript',
    name: 'JavaScript',
    color: 'hover:border-yellow-500 hover:text-yellow-500',
    icon: (
      <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M3 3h18v18H3V3zm11.353 14.542c-.521.464-1.229.694-2.126.694-1.284 0-2.316-.481-3.096-1.442l1.62-1.411c.42.482.906.723 1.46.723.385 0 .684-.094.898-.282.213-.188.32-.429.32-.723 0-.306-.115-.55-.344-.731-.23-.182-.693-.4-1.391-.655-1.077-.384-1.834-.82-2.272-1.309-.439-.488-.658-1.09-.658-1.806 0-.84.34-1.545 1.021-2.115.68-.57 1.546-.855 2.597-.855 1.135 0 2.062.365 2.781 1.096l-1.503 1.512c-.415-.418-.881-.627-1.398-.627-.373 0-.663.097-.868.29-.205.194-.308.435-.308.723 0 .265.105.485.316.658.21.174.654.382 1.332.624 1.127.404 1.916.85 2.368 1.337.452.487.678 1.118.678 1.892 0 .862-.352 1.583-1.057 2.158zM8.136 17.618h2.622V9.691H8.136v7.927z"/>
      </svg>
    ),
  },
];

const SubjectSelectorComponent: React.FC<SubjectSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-12">Select your Subject</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-700 transition-all duration-300 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:-translate-y-2 ${s.color}`}
            aria-label={`Select ${s.name}`}
          >
            {s.icon}
            <span className="text-xl font-bold">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SubjectSelector = React.memo(SubjectSelectorComponent);
