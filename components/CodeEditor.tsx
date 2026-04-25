import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

const CodeEditorComponent: React.FC<CodeEditorProps> = ({ code, onChange, disabled = false }) => {
  return (
    <div className="relative w-full h-full min-h-[300px] flex rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
      <div className="absolute top-0 left-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 select-none text-slate-500 font-mono text-sm z-10">
        {code.split('\n').map((_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Code editor"
        spellCheck={false}
        className="w-full h-full pl-16 pr-4 py-4 bg-transparent text-slate-200 font-mono text-sm leading-6 resize-none focus:outline-none disabled:opacity-50 fira-code"
      />
    </div>
  );
};

export const CodeEditor = React.memo(CodeEditorComponent);
