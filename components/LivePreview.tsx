import React, { useState, useEffect } from 'react';
import { Subject } from '@/lib/types';

interface LivePreviewProps {
  code: string;
  subject: Subject;
}

const LivePreviewComponent: React.FC<LivePreviewProps> = ({ code, subject }) => {
  const [debouncedCode, setDebouncedCode] = useState(code);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 500);

    return () => clearTimeout(timer);
  }, [code]);

  if (!debouncedCode.trim()) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p>Start typing to see live preview</p>
        </div>
      </div>
    );
  }

  const getSrcDoc = () => {
    const sanitizedCode = debouncedCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
      if (match.includes('src=')) return '';
      return match;
    });

    if (subject === 'HTML') {
      return sanitizedCode;
    }
    
    if (subject === 'CSS') {
      return `
        <html>
          <head>
            <style>${sanitizedCode}</style>
          </head>
          <body>
            <div id="preview-container" class="preview-element">
              <h1>Preview Header</h1>
              <p>This is a paragraph to test your CSS styles.</p>
              <button>A Button</button>
            </div>
          </body>
        </html>
      `;
    }
    
    if (subject === 'JavaScript') {
      return `
        <html>
          <body style="font-family: sans-serif; color: #fff; background: #0f172a; padding: 20px;">
            <div id="output"></div>
            <script>
              const log = (...args) => {
                const output = document.getElementById('output');
                output.innerHTML += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '<br>';
              };
              const originalConsoleLog = console.log;
              console.log = (...args) => {
                log(...args);
                originalConsoleLog(...args);
              };
              
              try {
                ${sanitizedCode}
              } catch (e) {
                document.getElementById('output').innerHTML = '<span style="color: #fb7185;">Error: ' + e.message + '</span>';
              }
            </script>
          </body>
        </html>
      `;
    }

    return '';
  };

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-700 bg-white">
      <iframe
        title="Live preview"
        srcDoc={getSrcDoc()}
        sandbox="allow-scripts"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export const LivePreview = React.memo(LivePreviewComponent);
