'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Flame, Plus, CheckCircle2, Edit3, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import { fetchHabits, createHabit, updateHabit, deleteHabit, logHabitCompletion, Habit } from '@/lib/api';

export default function HabitsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('STUDY');
  const [description, setDescription] = useState('');
  const [targetFreq, setTargetFreq] = useState(7);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const data = await fetchHabits();
      setHabits(data || []);
    } catch {
      setHabits([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setTitle('');
    setCategory('STUDY');
    setDescription('');
    setTargetFreq(7);
    setShowModal(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setTitle(habit.title);
    setCategory(habit.category || 'STUDY');
    setDescription(habit.description || '');
    setTargetFreq(habit.targetFrequencyPerWeek || 7);
    setShowModal(true);
  };

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingHabit && editingHabit.id) {
      await updateHabit(editingHabit.id, {
        title,
        category,
        description,
        targetFrequencyPerWeek: targetFreq,
      });
    } else {
      await createHabit({
        title,
        category,
        description,
        targetFrequencyPerWeek: targetFreq,
        currentStreak: 1, // Starts at Day 1 after user login
        bestStreak: 1,
      });
    }

    setShowModal(false);
    loadHabits();
  };

  const handleLogCompletion = async (id?: number) => {
    if (!id) return;
    
    // Fast optimistic UI update
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextStreak = h.currentStreak + 1;
        return {
          ...h,
          currentStreak: nextStreak,
          bestStreak: Math.max(h.bestStreak, nextStreak)
        };
      }
      return h;
    }));

    try {
      await logHabitCompletion(id);
    } catch {
      loadHabits();
    }
  };

  const handleDeleteHabit = async (id?: number) => {
    if (!id) return;
    if (confirm('Move habit to Trash?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
      await deleteHabit(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-8">
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Momentum Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
                Habits & Streak Management
              </h2>
              <p className="text-xs text-gray-400 max-w-2xl">
                Streaks start from Day 1. If a day is missed without completing the habit, the streak automatically resets to Day 1.
              </p>
            </div>

            <button 
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-gray-950 transition-all shadow-lg shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> New Habit
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading habits...</div>
          ) : habits.length === 0 ? (
            <div className="coffee-card p-12 rounded-3xl text-center space-y-3">
              <Flame className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-base text-espresso">No Habits Created Yet</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Create daily habits to build consistency. Complete habits every day to grow your streak!
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-400 transition-all"
              >
                + Add Your First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="p-5 rounded-2xl bg-white border border-border shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cocoa/10 text-cocoa">
                        {habit.category}
                      </span>
                      <h3 className="font-bold text-base text-espresso mt-1.5">{habit.title}</h3>
                      {habit.description && <p className="text-xs text-camel mt-0.5">{habit.description}</p>}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleLogCompletion(habit.id)}
                        title="Complete today's habit"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                      >
                        <CheckCircle2 className="w-6 h-6 hover:scale-110 transition-transform fill-emerald-100" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(habit)}
                        title="Edit Habit"
                        className="p-1 text-gray-400 hover:text-purple-600"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        title="Delete Habit"
                        className="p-1 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium">Best: {habit.bestStreak}d</span>
                      <span className="font-extrabold text-cocoa flex items-center gap-1 font-mono text-sm bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> {habit.currentStreak} Days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-espresso">{editingHabit ? 'Edit Habit' : 'Add Habit'}</h3>
            <form onSubmit={handleSaveHabit} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Mins Quantitative Aptitude Practice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 border border-border bg-linen text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 border border-border bg-linen text-espresso"
                >
                  <option value="STUDY">Study & Academic</option>
                  <option value="SSC_CGL">SSC CGL Prep</option>
                  <option value="IT_CAREER">IT Career & Coding</option>
                  <option value="HEALTH">Health & Wellness</option>
                </select>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Habit details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 border border-border bg-linen text-espresso"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold"
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
