'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Flame, Plus, CheckCircle2 } from 'lucide-react';
import { Habit } from '@/lib/api';

export default function HabitsPage() {
  const [habits] = useState<Habit[]>([
    { id: 1, title: 'Drink 2.5L Water Daily', category: 'HEALTH', currentStreak: 7, bestStreak: 14, targetFrequencyPerWeek: 7 },
    { id: 2, title: 'Daily Java / Engineering Practice', category: 'STUDY', currentStreak: 5, bestStreak: 12, targetFrequencyPerWeek: 7 },
    { id: 3, title: 'Morning Posture & Stretching', category: 'HEALTH', currentStreak: 4, bestStreak: 8, targetFrequencyPerWeek: 5 },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                Habit Tracker & Streaks
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Small consistent daily actions build extraordinary long-term momentum.
              </p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20">
              <Plus className="w-4 h-4" /> New Habit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <div key={habit.id} className="p-5 bg-card/60 border border-border/80 rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      {habit.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1.5">{habit.title}</h3>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 cursor-pointer hover:scale-110 transition-transform" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="font-extrabold text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {habit.currentStreak} Days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
