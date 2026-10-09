'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Flame, Plus, CheckCircle2, Award } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { Habit } from '@/lib/api';

export default function HabitsPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, title: 'Drink 2.5L Water Daily', category: 'HEALTH', currentStreak: 7, bestStreak: 14, targetFrequencyPerWeek: 7 },
    { id: 2, title: 'Daily Java / Engineering Practice', category: 'STUDY', currentStreak: 5, bestStreak: 12, targetFrequencyPerWeek: 7 },
    { id: 3, title: 'Morning Posture & Stretching', category: 'HEALTH', currentStreak: 4, bestStreak: 8, targetFrequencyPerWeek: 5 },
    { id: 4, title: 'Quantitative Aptitude 30-min Speed Drill', category: 'SSC_CGL', currentStreak: 6, bestStreak: 10, targetFrequencyPerWeek: 7 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('STUDY');

  const handleToggleHabit = (id?: number) => {
    if (!id) return;
    setHabits(habits.map(h => h.id === id ? { ...h, currentStreak: h.currentStreak + 1 } : h));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newHabit: Habit = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      currentStreak: 1,
      bestStreak: 1,
      targetFrequencyPerWeek: 7
    };
    setHabits([...habits, newHabit]);
    setShowModal(false);
    setNewTitle('');
  };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
          <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
            isCoffee 
              ? 'bg-linen border-khaki/60 shadow-soft' 
              : 'bg-gradient-to-r from-amber-950/60 via-card to-card border-cocoa/20'
          }`}>
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/20'
              }`}>
                ⚡ Daily Momentum Engine
              </span>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <Flame className="w-7 h-7 text-cocoa fill-amber-400" />
                Habit Tracker & Consistency Streaks
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Small consistent daily actions build extraordinary long-term study momentum. Track water intake, posture breaks, code practice, and mock schedules.
              </p>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa hover:bg-espresso text-espresso'
              }`}
            >
              <Plus className="w-4 h-4" /> New Habit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className={`p-6 rounded-2xl border space-y-4 transition-all hover:scale-[1.01] ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cocoa/10 text-cocoa">
                      {habit.category}
                    </span>
                    <h3 className="font-bold text-base text-espresso mt-1.5">{habit.title}</h3>
                  </div>
                  <button onClick={() => handleToggleHabit(habit.id)} title="Complete today's habit">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-camel">Current Streak</span>
                  <span className="font-extrabold text-cocoa flex items-center gap-1 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-cocoa" /> {habit.currentStreak} Days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Add Habit</h3>
            <form onSubmit={handleAddHabit} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Mins English Vocab Flashcards"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    isCoffee ? 'bg-white border-border text-espresso' : 'bg-linen border-border text-espresso'
                  }`}
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    isCoffee ? 'bg-white border-border text-espresso' : 'bg-linen border-border text-espresso'
                  }`}
                >
                  <option value="STUDY">Study & Academic</option>
                  <option value="SSC_CGL">SSC CGL</option>
                  <option value="IT_CAREER">IT Career & Coding</option>
                  <option value="HEALTH">Health & Wellness</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    isCoffee ? 'bg-linen text-camel' : 'bg-linen text-cocoa'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold ${
                    isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa text-espresso'
                  }`}
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

