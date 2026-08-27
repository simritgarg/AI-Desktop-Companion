'use client';

import React, { useState } from 'react';
import { Send, Clock, CheckCircle2, XCircle, X } from 'lucide-react';
import { sendAIChat } from '@/lib/api';
import { useCompanionStore } from '@/lib/store';

interface SpeechBubbleProps {
  message: string;
  buttons?: string[];
  onActionSelect?: (action: string) => void;
  onClose?: () => void;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  buttons = [],
  onActionSelect,
  onClose,
}) => {
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
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-3 w-72 bg-gray-950/95 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-4 shadow-2xl text-white transition-all duration-300 animate-in fade-in zoom-in-95">
      {/* Pointer/tail pointing to Aira */}
      <div className="absolute -bottom-2 right-12 w-4 h-4 bg-gray-950 border-b border-r border-purple-500/40 rotate-45"></div>

      {/* Top row with message title & X close button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-gray-100 leading-relaxed pr-2">
          {message}
        </p>

        {/* Explicit X Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-rose-500/20 transition-colors flex-shrink-0"
            title="Close message & send Aira away"
          >
            <X className="w-4 h-4 text-rose-400" />
          </button>
        )}
      </div>

      {/* Interactive Action Buttons */}
      {buttons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 my-2.5">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => onActionSelect && onActionSelect(btn)}
              className="text-[11px] font-bold bg-purple-600/30 hover:bg-purple-600/70 text-purple-200 border border-purple-500/50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
            >
              {(btn.includes('Done') || btn.includes('YES') || btn.includes('DRANK')) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {btn.includes('SNOOZE') && <Clock className="w-3.5 h-3.5 text-cyan-400" />}
              {btn.includes('Skip') && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              {btn}
            </button>
          ))}
        </div>
      )}

      {/* Natural Language Command Bar */}
      <form onSubmit={handleSendPrompt} className="relative mt-2.5 flex items-center">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask or tell Aira something..."
          className="w-full bg-gray-900/90 border border-gray-700/70 rounded-xl px-3 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 pr-8"
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
