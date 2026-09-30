import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  CheckCircle2,
  Copy,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { aiResumeService } from '@/api/aiResumeService';

const QUICK_PROMPTS = [
  { label: 'Improve Summary', prompt: 'Please write a high-impact, ATS-optimized summary based on my resume.' },
  { label: 'Suggest In-Demand Skills', prompt: 'What high-demand tech skills or keywords should I add to strengthen my resume?' },
  { label: 'Analyze Weak Spots', prompt: 'Critique my resume. Where can I improve formatting, quantification, and impact?' },
  { label: 'Check ATS Compatibility', prompt: 'How ATS-friendly is my resume and what are the main formatting or keyword risks?' },
  { label: 'Action Verbs for Experience', prompt: 'Give me 5 strong action-verb bullet points tailored to my projects/experience.' },
];

export default function AIChatDrawer({ resume, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I'm your **Panisudar AI Resume Assistant**. I've loaded your resume details. Ask me anything—from polishing bullet points to ATS optimization and skill recommendations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiResumeService.chatWithAssistant(textToSend, resume, resume.id);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.reply || 'Here are my suggestions based on your resume profile.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue connecting to the AI engine. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Panisudar AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400">Context-aware resume coaching</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Prompts:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(qp.prompt)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-900/40 border border-slate-700/80 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-indigo-200 transition-all disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-cyan-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`relative max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none'
              }`}
            >
              {/* Copy button for assistant responses */}
              {msg.sender === 'assistant' && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(msg.text, msg.id)}
                  title="Copy message"
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded bg-slate-900/50 transition-colors"
                >
                  {copiedId === msg.id ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}

              <div className="whitespace-pre-wrap font-sans pr-4">{msg.text}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Panisudar AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI: 'Enhance this summary' or 'Find missing keywords'..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
