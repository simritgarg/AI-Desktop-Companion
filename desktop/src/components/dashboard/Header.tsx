'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { Flame, Trophy, Zap, Coffee, User, LogOut, ChevronDown, Mail, Award, Trash2, Menu, Settings, ShieldCheck, Bot, BookOpen } from 'lucide-react';
import { BadgesModal } from './BadgesModal';
import { TrashModal } from './TrashModal';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const userName = user?.name || 'Simrit Garg';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      <header className="h-16 border-b border-[#E8E0D5] bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-linen text-espresso hover:bg-khaki/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Coffee className="w-4 h-4 text-cocoa shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-espresso truncate max-w-[200px] sm:max-w-none">
            Personal SSC CGL & Career Command Workspace
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{user?.streakDays ?? 1} Day Streak</span>
          </div>

          {/* Level & XP */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-900 text-xs font-bold">
            <Trophy className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600" />
            <span>Lvl {user?.level ?? 1}</span>
            <span className="text-gray-500 font-normal hidden xs:inline">| {user?.xp ?? 0} XP</span>
          </div>

          {/* Energy Status */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold">
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Optimal Energy</span>
          </div>

          {/* Account Icon Circle & Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-[#D7C9B8] hover:bg-[#C8A279] text-[#2A1810] font-bold text-sm flex items-center justify-center border border-[#B2967D] shadow-sm transition-all focus:outline-none relative"
            >
              <span>{initial}</span>
              <ChevronDown className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-[#2A1810] bg-white rounded-full border border-gray-300" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E8E0D5] rounded-2xl shadow-xl p-2 z-50 text-espresso animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Summary */}
                  <div className="px-3 py-2.5 bg-linen/60 rounded-xl mb-2 border border-khaki/40">
                    <p className="font-bold text-sm text-espresso truncate">{userName}</p>
                    <p className="text-[11px] text-camel flex items-center gap-1 truncate mt-0.5">
                      <Mail className="w-3 h-3 text-cocoa shrink-0" />
                      <span className="truncate">{user?.email || 'Logged in'}</span>
                    </p>
                    {user?.primaryTarget && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-cocoa/10 text-cocoa border border-cocoa/20">
                        {user.primaryTarget}
                      </span>
                    )}
                  </div>

                  {/* Quick Navigation Links */}
                  <Link
                    href="/companion"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso hover:bg-linen transition-colors"
                  >
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>Companion AI Coach</span>
                  </Link>

                  <Link
                    href="/diary"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso hover:bg-linen transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Personal Diary</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso hover:bg-linen transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cocoa" />
                    <span>Settings & Preferences</span>
                  </Link>

                  {/* Badges Modal Trigger */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowBadges(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>My Achievement Badges</span>
                  </button>

                  {/* Trash Bin Modal Trigger */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowTrash(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Trash Bin (30-day auto cleanup)</span>
                  </button>

                  {/* Settings & Mode Options */}
                  <div className="px-3 py-2 text-[11px] text-camel flex items-center gap-2 border-t border-border mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accountability Mode: <strong>Balanced</strong></span>
                  </div>

                  <div className="border-t border-border my-1" />

                  {/* Log Out Button */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Badges Modal */}
      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}

      {/* Trash Modal */}
      {showTrash && <TrashModal onClose={() => setShowTrash(false)} />}
    </>
  );
};
