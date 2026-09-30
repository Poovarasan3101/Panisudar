import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled || !input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 rounded-b-2xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Job Assistant anything..."
        disabled={disabled}
        aria-label="Ask Job Assistant message"
        className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        aria-label="Send message"
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
