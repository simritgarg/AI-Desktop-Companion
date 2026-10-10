'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Flame, 
  Calendar, 
  Sparkles, 
  GraduationCap, 
  Code, 
  Plus, 
  UserPlus, 
  Coffee, 
  X,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

const commandCentreItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Task Planner', href: '/tasks', icon: CheckSquare },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Habit & Streaks', href: '/habits', icon: Flame },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Motivation and Vision', href: '/vision', icon: Sparkles },
  { name: 'Career Notepad', href: '/notes', icon: BookOpen },
];

const analysisItems = [
  { name: 'SSC Analytics & Mocks', href: '/test-series', icon: GraduationCap },
  { name: 'LeetCode & Stats', href: '/analytics', icon: Code, badge: 'Sync' },
];

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const userName = user?.name || 'Simrit Garg';
  const targetSubtext = user?.primaryTarget 
    ? `Day 1 • ${user.primaryTarget}` 
    : 'Day 1 • SSC CGL 2027 and IT Career';

  const content = (
    <div className="flex flex-col justify-between h-full p-4 text-[#E6D7C3] font-sans">
      <div className="space-y-5">
        {/* User Profile Card Header */}
        <div className="bg-[#2E1C12] border border-[#422A1D] rounded-2xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7D5A44] to-[#B2967D] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                <span className="truncate">{userName}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#B2967D]/20 text-[#D7C9B8] border border-[#B2967D]/30 shrink-0">
                  + New
                </span>
              </h2>
              <p className="text-[11px] text-[#B2967D] truncate mt-0.5">{targetSubtext}</p>
            </div>
          </div>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden p-1.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* COMMAND CENTRE Section */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold text-[#B2967D] uppercase tracking-wider mb-2">
            COMMAND CENTRE
          </h3>
          <nav className="space-y-1">
            {commandCentreItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#3D2517] text-white border-l-4 border-[#D4A373] shadow-md'
                      : 'text-[#C5B39F] hover:text-white hover:bg-[#342014]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A373]' : 'text-[#A08875]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CAREER WORKSPACE Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[10px] font-extrabold text-[#B2967D] uppercase tracking-wider">
              CAREER WORKSPACE
            </h3>
            <Link
              href="/notes"
              onClick={onCloseMobile}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3D2517] text-[#D4A373] hover:bg-[#4A2D1C] transition-colors border border-[#523321] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </Link>
          </div>
          <nav className="space-y-1">
            <Link
              href="/notes"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#C5B39F] hover:text-white hover:bg-[#342014] transition-all"
            >
              <span className="w-4 h-4 rounded bg-[#4A342A] border border-[#634538] flex items-center justify-center text-[10px]">💼</span>
              <span>SSC CGL</span>
            </Link>
            <Link
              href="/notes"
              onClick={onCloseMobile}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#B2967D] hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Career Workspace</span>
            </Link>
          </nav>
        </div>

        {/* ANALYSIS SECTION Section */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold text-[#B2967D] uppercase tracking-wider mb-2">
            ANALYSIS SECTION
          </h3>
          <nav className="space-y-1">
            {analysisItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3D2517] text-white border-l-4 border-[#D4A373]'
                      : 'text-[#C5B39F] hover:text-white hover:bg-[#342014]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A373]' : 'text-[#A08875]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Theme Footer Card */}
      <div className="bg-[#2E1C12] border border-[#422A1D] rounded-2xl p-3 text-xs mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#E6D7C3] font-bold flex items-center gap-1.5 text-xs">
            <Coffee className="w-3.5 h-3.5 text-[#D4A373]" /> Coffee Latte Theme
          </span>
          <span className="text-[10px] text-[#B2967D] font-medium">Day 1</span>
        </div>
        <p className="text-[#B2967D] text-[11px]">Warm, focused & productive workspace.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (warm dark espresso) */}
      <aside className="hidden md:flex w-64 bg-[#21130B] border-r border-[#382216] min-h-screen shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-xs bg-[#21130B] border-r border-[#382216] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
