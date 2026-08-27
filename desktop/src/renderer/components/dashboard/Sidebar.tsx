'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, CheckSquare, Timer, Flame, BarChart3, Settings, Bot } from 'lucide-react';

const navItems = [
  { name: 'Today', href: '/', icon: LayoutDashboard },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Focus Session', href: '/focus', icon: Timer },
  { name: 'Habits', href: '/habits', icon: Flame },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card/60 backdrop-blur-xl border-r border-border min-h-screen p-4 flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Companion
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">Desktop Friend & Coach</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-900/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Companion Card Widget */}
      <div className="bg-gray-800/40 border border-border/60 rounded-xl p-3 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-300 font-semibold">Accountability Mode</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Balanced
          </span>
        </div>
        <p className="text-gray-400 text-[11px]">Honest feedback + encouraging coaching.</p>
      </div>
    </aside>
  );
};
