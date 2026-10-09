'use client';

import React from 'react';
import { Flame, Trophy, Zap, Coffee } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4 text-cocoa" />
        <span className="text-sm font-semibold text-espresso">
          Personal SSC CGL & Career Command Workspace
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
          <span>7 Day Streak</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cocoa/5 text-cocoa border border-cocoa/15">
          <Trophy className="w-3.5 h-3.5 text-camel" />
          <span>Lvl 3</span>
          <span className="opacity-60 font-normal">| 450 XP</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          <span>Optimal Focus Energy</span>
        </div>
      </div>
    </header>
  );
};
