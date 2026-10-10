'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { Flame, Trophy, Zap, Sparkles, User, LogOut, ChevronDown, ShieldCheck, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <span>{user?.streakDays ?? 0} Day Streak</span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-purple-400" />
          <span>Lvl {user?.level ?? 1}</span>
          <span className="text-gray-400 font-normal">| {user?.xp ?? 0} XP</span>
        </div>

        {/* Energy Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>Optimal Energy</span>
        </div>

        {/* Account Icon & Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 text-xs font-medium text-gray-200 transition-all focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-[11px]">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700/80 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-gray-800 mb-1">
                  <p className="font-semibold text-sm text-gray-100 truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                    <span className="truncate">{user?.email || 'Logged in'}</span>
                  </p>
                  {user?.primaryTarget && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {user.primaryTarget}
                    </span>
                  )}
                </div>

                <div className="px-3 py-1.5 text-[11px] text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authenticated Session</span>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
