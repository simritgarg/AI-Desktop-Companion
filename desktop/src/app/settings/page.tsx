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
    appTheme,
  } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const safeConfig = { ...defaultAvatarConfig, ...(avatarConfig || {}) };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-4xl w-full mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-espresso flex items-center gap-2">
              <Settings className="w-6 h-6 text-cocoa" />
              Companion & System Preferences
            </h2>
            <p className="text-xs text-camel mt-1">
              Customize Aira's coaching style, strictness level, customizable avatar, and AI engine model.
            </p>
          </div>

          {/* Character Avatar Customization System */}
          <div className={`p-6 border rounded-2xl space-y-6 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-cocoa/15'
          }`}>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-espresso">
                <Palette className="w-4 h-4 text-cocoa" />
                Aira Avatar Customization
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cocoa/10 text-cocoa border border-cocoa/15 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Avatar Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Avatar Live Preview */}
              <div className="flex flex-col items-center justify-center p-4 bg-white border border-border rounded-xl">
                <Avatar state="GREETING" config={safeConfig} />
                <span className="text-xs font-semibold text-cocoa mt-2">Aira (Active Avatar)</span>
              </div>

              {/* Controls Column 1 */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-camel font-semibold mb-1">Hair Style</label>
                  <select
                    value={safeConfig.hairStyle}
                    onChange={(e) => setAvatarConfig({ hairStyle: e.target.value as any })}
                    className="w-full bg-linen border border-border rounded-lg px-3 py-1.5 text-espresso"
                  >
                    <option value="LONG_WAVY">Long Wavy</option>
                    <option value="SHORT_BOB">Short Bob</option>
                    <option value="PONYTAIL">Ponytail</option>
                    <option value="BUN">Top Bun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Hair Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.hairColor}
                      onChange={(e) => setAvatarConfig({ hairColor: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-cocoa font-mono">{safeConfig.hairColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Glasses</label>
                  <select
                    value={safeConfig.glasses}
                    onChange={(e) => setAvatarConfig({ glasses: e.target.value as any })}
                    className="w-full bg-linen border border-border rounded-lg px-3 py-1.5 text-espresso"
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
                  <label className="block text-camel font-semibold mb-1">Outfit Top Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.topColor}
                      onChange={(e) => setAvatarConfig({ topColor: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-cocoa font-mono">{safeConfig.topColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Accessories</label>
                  <select
                    value={safeConfig.accessories}
                    onChange={(e) => setAvatarConfig({ accessories: e.target.value as any })}
                    className="w-full bg-linen border border-border rounded-lg px-3 py-1.5 text-espresso"
                  >
                    <option value="NONE">None</option>
                    <option value="HEADPHONES">Headphones</option>
                    <option value="BOW">Hair Bow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Skin Tone</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={safeConfig.skinTone}
                      onChange={(e) => setAvatarConfig({ skinTone: e.target.value })}
                      className="w-8 h-8 rounded border border-border bg-transparent cursor-pointer"
                    />
                    <span className="text-cocoa font-mono">{safeConfig.skinTone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accountability Mode Selector */}
          <div className={`p-6 border rounded-2xl space-y-4 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <div className="flex items-center gap-2 text-sm font-bold text-espresso">
              <Shield className="w-4 h-4 text-cocoa" />
              Accountability Mode
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['FRIENDLY', 'BALANCED', 'STRICT', 'NO_EXCUSES'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAccountabilityMode(mode)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    accountabilityMode === mode
                      ? isCoffee ? 'bg-cocoa border-camel text-white' : 'bg-cocoa/10 border-cocoa/20 text-cocoa'
                      : isCoffee ? 'bg-white border-cocoa text-camel hover:text-espresso' : 'bg-linen/40 border-border text-camel hover:text-espresso'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Personality System */}
          <div className={`p-6 border rounded-2xl space-y-4 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <div className="flex items-center gap-2 text-sm font-bold text-espresso">
              <Bot className="w-4 h-4 text-blue-600" />
              Companion Personality
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['BEST_FRIEND', 'COACH', 'STUDY_BUDDY', 'STRICT_MENTOR'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    personality === p
                      ? isCoffee ? 'bg-cocoa border-camel text-white' : 'bg-cocoa/10 border-cyan-500 text-cocoa'
                      : isCoffee ? 'bg-white border-cocoa text-camel hover:text-espresso' : 'bg-linen/40 border-border text-camel hover:text-espresso'
                  }`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* AI Engine Settings */}
          <div className={`p-6 border rounded-2xl space-y-3 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <div className="flex items-center gap-2 text-sm font-bold text-espresso">
              <Cpu className="w-4 h-4 text-emerald-600" />
              AI Engine Provider
            </div>
            <p className="text-xs text-camel">
              Currently running <span className="text-emerald-600 font-semibold">Local Heuristic AI Engine (100% Free & Offline)</span>. You can configure OpenAI or Ollama anytime in <code className="text-cocoa">application.yml</code>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

