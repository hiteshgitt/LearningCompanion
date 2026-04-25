import React, { useState, useEffect } from 'react';
import { FillInBlankChallenge as FillInBlankType } from '@/lib/types';

interface FillInBlankChallengeProps {
  challenge: FillInBlankType;
  onChange: (answers: string) => void;
  disabled?: boolean;
}

const FillInBlankChallengeComponent: React.FC<FillInBlankChallengeProps> = ({ challenge, onChange, disabled }) => {
  const parts = challenge.template.split('___');
  const [answers, setAnswers] = useState<string[]>(Array(challenge.blanks.length).fill(''));

  useEffect(() => {
    onChange(JSON.stringify(answers));
  }, [answers, onChange]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="w-full h-full min-h-[300px] flex rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group transition-all p-8 flex-col justify-center">
      <div className="font-mono text-xl leading-10 text-slate-300 fira-code break-words whitespace-pre-wrap">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < parts.length - 1 && (
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={disabled}
                className="mx-2 px-2 py-1 bg-slate-800 border-b-2 border-violet-500 focus:border-fuchsia-500 focus:bg-slate-700 focus:outline-none text-center text-violet-300 transition-colors w-24 sm:w-32 rounded-t disabled:opacity-50"
                aria-label={`Blank ${index + 1}`}
                autoComplete="off"
                spellCheck="false"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const FillInBlankChallenge = React.memo(FillInBlankChallengeComponent);
