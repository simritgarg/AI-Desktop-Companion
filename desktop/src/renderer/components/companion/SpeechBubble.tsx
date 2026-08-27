'use client';

import React, { useState } from 'react';
import { Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { sendAIChat } from '@/lib/api';
import { useCompanionStore } from '@/lib/store';

interface SpeechBubbleProps {
  message: string;
  buttons?: string[];
  onActionSelect?: (action: string) => void;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, buttons = [], onActionSelect }) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCompanionResponse, accountabilityMode } = useCompanionStore();

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    setLoading(true);
    try {
      const response = await sendAIChat(inputPrompt, accountabilityMode);
      setCompanionResponse(response);
      setInputPrompt('');
    } catch {
      // Graceful fallback if backend is initializing
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-2 w-72 bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-2xl p-3.5 shadow-2xl text-white transition-all duration-300">
      {/* Speech bubble pointer tip */}
      <div className="absolute -bottom-2 right-10 w-4 h-4 bg-gray-900 border-b border-r border-purple-500/30 rotate-45"></div>

      {/* Message text */}
      <p className="text-xs font-medium text-gray-100 leading-relaxed mb-2.5">
        {message}
      </p>

      {/* Action Buttons */}
      {buttons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => onActionSelect && onActionSelect(btn)}
              className="text-[11px] font-semibold bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 border border-purple-500/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              {btn.includes('Done') && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {btn.includes('Remind') && <Clock className="w-3 h-3 text-cyan-400" />}
              {btn.includes('Skip') && <XCircle className="w-3 h-3 text-rose-400" />}
              {btn}
            </button>
          ))}
        </div>
      )}

      {/* Natural Language Prompt Input */}
      <form onSubmit={handleSendPrompt} className="relative mt-2 flex items-center">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask or tell Aria something..."
          className="w-full bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 pr-7"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 p-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
