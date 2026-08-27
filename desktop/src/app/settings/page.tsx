'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Settings, Bot, Shield, Cpu, Palette, Sparkles } from 'lucide-react';
import { useCompanionStore, AvatarConfig } from '@/lib/store';
import { Avatar } from '@/components/companion/Avatar';

const defaultAvatarConfig: AvatarConfig = {
  hairStyle: 'LONG_WAVY',
  hairColor: '#4C1D95',
  skinTone: '#FBCFE8',
  eyeStyle: 'SPARKLING',
  glasses: 'NONE',
  outfit: 'CASUAL',
  topColor: '#8B5CF6',
  bottomColor: '#475569',
  shoesColor: '#1E1B4B',
  accessories: 'NONE',
};

export default function SettingsPage() {
  const {
    accountabilityMode,
    setAccountabilityMode,
    personality,
    setPersonality,
    avatarConfig,
    setAvatarConfig,
  } = useCompanionStore();

  const safeConfig = { ...defaultAvatarConfig, ...(avatarConfig || {}) };

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
              Customize Aira's coaching style, strictness level, customizable avatar, and AI engine model.
            </p>
          </div>

          {/* Character Avatar Customization System */}
          <div className="p-6 bg-card/60 border border-purple-500/30 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Palette className="w-4 h-4 text-purple-400" />
                Aira Avatar Customization
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Avatar Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Avatar Live Preview */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-950/60 border border-border rounded-xl">
                <Avatar state="GREETING" config={safeConfig} />
                <span className="text-xs font-semibold text-purple-300 mt-2">Aira (Active Avatar)</span>
              </div>

              {/* Controls Column 1 */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Hair Style</label>
                  <select
                    value={safeConfig.hairStyle}
                    onChange={(e) => setAvatarConfig({ hairStyle: e.target.value as any })}
                    className="w-full bg-gray-900 border border-border rounded-lg px-3 py-1.5 text-gray-200"
                  >
                    <option value="LONG_WAVY">Long Wavy</option>
                    <option value="SHORT_BOB">Short Bob</option>
                    <option value="PONYTAIL">Ponytail</option>
                    <option value="BUN">Top Bun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Hair Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.hairColor}
                      onChange={(e) => setAvatarConfig({ hairColor: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-gray-300 font-mono">{safeConfig.hairColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Glasses</label>
                  <select
                    value={safeConfig.glasses}
                    onChange={(e) => setAvatarConfig({ glasses: e.target.value as any })}
                    className="w-full bg-gray-900 border border-border rounded-lg px-3 py-1.5 text-gray-200"
                  >
                    <option value="NONE">None</option>
                    <option value="READING">Reading Glasses</option>
                    <option value="STYLISH">Stylish Frame</option>
                  </select>
                </div>
              </div>

              {/* Controls Column 2 */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Outfit Top Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.topColor}
                      onChange={(e) => setAvatarConfig({ topColor: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-gray-300 font-mono">{safeConfig.topColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Accessories</label>
                  <select
                    value={safeConfig.accessories}
                    onChange={(e) => setAvatarConfig({ accessories: e.target.value as any })}
                    className="w-full bg-gray-900 border border-border rounded-lg px-3 py-1.5 text-gray-200"
                  >
                    <option value="NONE">None</option>
                    <option value="HEADPHONES">Headphones</option>
                    <option value="BOW">Hair Bow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Skin Tone</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.skinTone}
                      onChange={(e) => setAvatarConfig({ skinTone: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-gray-300 font-mono">{safeConfig.skinTone}</span>
                  </div>
                </div>
              </div>
            </div>
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
