'use client';

import React from 'react';
import { Flame, Trophy, Zap, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border/60 bg-card/30 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-gray-200">Personal Productivity Workspace</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>7 Day Streak</span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-purple-400" />
          <span>Lvl 3</span>
          <span className="text-gray-400 font-normal">| 450 XP</span>
        </div>

        {/* Energy Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>Optimal Energy</span>
        </div>
      </div>
    </header>
  );
};
