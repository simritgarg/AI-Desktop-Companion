'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Settings, Bot, Shield, Cpu, Volume2 } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';

export default function SettingsPage() {
  const { accountabilityMode, setAccountabilityMode, personality, setPersonality } = useCompanionStore();

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-4xl w-full mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Companion & System Preferences
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Customize Aria's coaching style, strictness level, voice, and AI engine model.
            </p>
          </div>

          {/* Accountability Mode Selector */}
          <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Shield className="w-4 h-4 text-purple-400" />
              Accountability Mode
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['FRIENDLY', 'BALANCED', 'STRICT', 'NO_EXCUSES'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAccountabilityMode(mode)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    accountabilityMode === mode
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-gray-800/40 border-border text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Personality System */}
          <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Bot className="w-4 h-4 text-cyan-400" />
              Companion Personality
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['BEST_FRIEND', 'COACH', 'STUDY_BUDDY', 'STRICT_MENTOR'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    personality === p
                      ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                      : 'bg-gray-800/40 border-border text-gray-400 hover:text-white'
                  }`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* AI Engine Settings */}
          <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Cpu className="w-4 h-4 text-emerald-400" />
              AI Engine Provider
            </div>
            <p className="text-xs text-gray-400">
              Currently running <span className="text-emerald-400 font-semibold">Local Heuristic AI Engine (100% Free & Offline)</span>. You can configure OpenAI or Ollama anytime in <code className="text-purple-300">application.yml</code>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
