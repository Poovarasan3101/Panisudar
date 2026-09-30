import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  // Format simple markdown bold and numbered lists for clean readability
  const renderFormattedText = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold text handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <span key={idx} className="block leading-relaxed">
          {formattedParts}
          {idx < lines.length - 1 && <span className="block h-1" />}
        </span>
      );
    });
  };

  return (
    <div
      className={`flex items-start gap-2.5 my-3 ${
        isBot ? 'flex-row' : 'flex-row-reverse'
      } animate-fadeIn`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
          isBot
            ? 'bg-indigo-600 text-white shadow-indigo-200'
            : 'bg-slate-700 text-white'
        }`}
      >
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
          isBot
            ? 'bg-white text-slate-700 border border-slate-200/80 rounded-tl-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-100'
        }`}
      >
        <div className="break-words">
          {isBot ? renderFormattedText(message.text) : message.text}
        </div>
        {message.timestamp && (
          <p
            className={`text-[10px] mt-1.5 ${
              isBot ? 'text-slate-400' : 'text-indigo-200 text-right'
            }`}
          >
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
