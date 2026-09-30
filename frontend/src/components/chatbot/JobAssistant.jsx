import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Bot, Sparkles, Trash2, ChevronDown, Minimize2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatbotService } from '@/services/chatbotService';

export default function JobAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm your **Job Assistant**. How can I help you find your dream job, prepare your resume, or hire top talent today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const suggestedQuestions = chatbotService.getSuggestedQuestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(text, messages);
      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: `e-${Date.now()}`,
        sender: 'bot',
        text: "I'm having a brief issue connecting right now. Please try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Chat history cleared. What else would you like assistance with?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Job Assistant Chatbot"
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm h-[520px] max-h-[80vh] bg-slate-50 border border-slate-200/90 rounded-2xl shadow-chat flex flex-col overflow-hidden animate-slideUp"
        >
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-tight">Job Assistant</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100/90">Instant AI Job Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 my-2 animate-fadeIn">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Section */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-full text-slate-600 transition-colors shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Job Assistant' : 'Open Job Assistant'}
        className="group flex items-center gap-2.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </div>
        <span className="text-sm tracking-wide">
          {isOpen ? 'Close Assistant' : 'Job Assistant'}
        </span>
      </button>
    </div>
  );
}
