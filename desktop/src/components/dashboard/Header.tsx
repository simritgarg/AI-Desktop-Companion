'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Trophy, 
  Zap, 
  Coffee, 
  Settings, 
  Timer, 
  BarChart3, 
  BookOpen, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ChevronDown,
  User,
  X
} from 'lucide-react';
import { useUserStore } from '@/lib/userStore';

export const Header: React.FC = () => {
  const { profile, registerNewUser } = useUserStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTarget, setRegTarget] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginModal(false);
    alert(`Logged in successfully as ${emailInput || profile.email}`);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;
    registerNewUser(regName, regEmail, regTarget || 'SSC CGL & Tech Preparation');
    setShowRegisterModal(false);
    setRegName('');
    setRegEmail('');
    setRegTarget('');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your current progress will remain saved.')) {
      setShowDropdown(false);
      alert('Logged out cleanly. You can sign in anytime to resume your progress!');
    }
  };

  return (
    <>
      <header className="h-14 px-6 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        {/* Left Branding */}
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-cocoa" />
          <span className="text-sm font-semibold text-espresso">
            Personal SSC CGL & Career Command Workspace
          </span>
        </div>

        {/* Right Action Widgets & Account Icon Dropdown */}
        <div className="flex items-center gap-3">
          {/* Day Streak Badge */}
          <Link href="/habits" className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors">
            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span>{profile.streakCount || 1} Day Streak</span>
          </Link>

          {/* Level & XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cocoa/5 text-cocoa border border-cocoa/15">
            <Trophy className="w-3.5 h-3.5 text-camel" />
            <span>Lvl {profile.level || 1}</span>
            <span className="opacity-60 font-normal">| {profile.xpPoints || 0} XP</span>
          </div>

          {/* Focus Energy Badge */}
          <Link href="/focus" className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>Optimal Energy</span>
          </Link>

          {/* Account Icon Dropdown ONLY (Settings Cog Removed as Requested) */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 p-1 px-2 rounded-full bg-cocoa/10 hover:bg-cocoa/20 text-espresso border border-cocoa/20 transition-all text-xs font-semibold"
              title="Account & Quick Navigation Menu"
            >
              <div className="w-7 h-7 rounded-full bg-camel text-espresso flex items-center justify-center font-bold text-xs shadow-sm">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-camel transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Popup */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-border text-espresso shadow-2xl p-2 z-50 text-xs space-y-1">
                {/* User Info Header */}
                <div className="px-3 py-2 rounded-xl bg-linen border border-border">
                  <p className="font-bold text-espresso truncate">{profile.name}</p>
                  <p className="text-[10px] text-camel truncate">Day {profile.currentDay} • {profile.primaryTarget}</p>
                </div>

                <div className="h-px bg-border/60 my-1" />

                {/* Quick Navigation Items */}
                <Link
                  href="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 font-semibold text-espresso transition-colors"
                >
                  <Settings className="w-4 h-4 text-cocoa" />
                  <span>Settings & Preferences</span>
                </Link>

                <Link
                  href="/focus"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 font-semibold text-espresso transition-colors"
                >
                  <Timer className="w-4 h-4 text-cocoa" />
                  <span>Focus Timer</span>
                </Link>

                <Link
                  href="/habits"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 font-semibold text-espresso transition-colors"
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Habits & Streaks</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 font-semibold text-espresso transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-cocoa" />
                  <span>Analytics & AI Insights</span>
                </Link>

                <Link
                  href="/diary"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 font-semibold text-espresso transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cocoa" />
                  <span>Personal Diary</span>
                </Link>

                <div className="h-px bg-border/60 my-1" />

                {/* Account Actions */}
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-700 font-semibold transition-colors"
                >
                  <LogIn className="w-4 h-4 text-emerald-600" />
                  <span>Sign In to Account</span>
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowRegisterModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cocoa/10 text-cocoa font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-cocoa" />
                  <span>New Account Registration</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <LogIn className="w-5 h-5 text-cocoa" /> Sign In to Your Account
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  Sign In & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Account Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cocoa" /> Register New Aspirant Account
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-camel leading-relaxed">
              Registering a new account will start progress strictly from <strong>Day 1 (0% progress)</strong> for a fresh user. If you are an existing user, signing in restores your saved progress!
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Simrit Garg"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="simrit@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Primary Preparation Goal</label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 & Full Stack Engineering"
                  value={regTarget}
                  onChange={(e) => setRegTarget(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  Start Fresh (Day 1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
