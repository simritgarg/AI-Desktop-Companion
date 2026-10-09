'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Target, Plus } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchGoals, createGoal, Goal } from '@/lib/api';

export default function GoalsPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState<'LONG_TERM' | 'MEDIUM_TERM' | 'SHORT_TERM'>('LONG_TERM');

  const loadGoals = async () => {
    try {
      const fetched = await fetchGoals();
      if (fetched.length === 0) {
        setGoals([
          { id: 1, title: 'Become Senior Java & AI Software Engineer', goalType: 'LONG_TERM', status: 'IN_PROGRESS', progressPercentage: 65, description: 'Master fullstack engineering with Spring Boot, Next.js, and cloud architecture.' },
          { id: 2, title: 'Rank in Top 1% of SSC CGL 2026 Examination', goalType: 'LONG_TERM', status: 'IN_PROGRESS', progressPercentage: 75, description: 'Achieve high Tier 1 & 2 scores across Quantitative Aptitude, Reasoning, English, and GA.' },
          { id: 3, title: 'Master Spring Security 6 & Stateless JWT', goalType: 'SHORT_TERM', status: 'IN_PROGRESS', progressPercentage: 90, description: 'Implement SecurityFilterChain, Custom UserDetailsService, and CORS filters.' },
        ]);
      } else {
        setGoals(fetched);
      }
    } catch {
      setGoals([
        { id: 1, title: 'Become Senior Java & AI Software Engineer', goalType: 'LONG_TERM', status: 'IN_PROGRESS', progressPercentage: 65, description: 'Master fullstack engineering with Spring Boot, Next.js, and cloud architecture.' },
      ]);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      title,
      description,
      goalType,
      status: 'IN_PROGRESS',
      progressPercentage: 10,
    };

    try {
      await createGoal(newGoal);
      loadGoals();
      setShowAddModal(false);
      setTitle('');
      setDescription('');
    } catch {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-espresso flex items-center gap-2">
                <Target className="w-6 h-6 text-cocoa" />
                Goal Hierarchy & Career Milestones
              </h2>
              <p className="text-xs opacity-80 mt-1">
                Connect long-term career visions to medium-term targets and daily actionable milestones.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa hover:bg-cocoa text-white shadow-soft'
              }`}
            >
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Long Term */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-cocoa" />
                <h3 className="font-bold text-sm text-espresso">Long-Term Vision</h3>
              </div>
              {goals.filter(g => g.goalType === 'LONG_TERM').map(g => (
                <div key={g.id} className={`p-4 rounded-xl border space-y-3 ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-cocoa/15'
                }`}>
                  <h4 className="font-semibold text-sm text-espresso">{g.title}</h4>
                  <p className="text-xs text-camel leading-relaxed">{g.description}</p>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden p-0.5 border border-border">
                    <div className="bg-cocoa h-full rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Medium Term */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h3 className="font-bold text-sm text-espresso">Medium-Term Targets</h3>
              </div>
              {goals.filter(g => g.goalType === 'MEDIUM_TERM').map(g => (
                <div key={g.id} className={`p-4 rounded-xl border space-y-3 ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-blue-200'
                }`}>
                  <h4 className="font-semibold text-sm text-espresso">{g.title}</h4>
                  <p className="text-xs text-camel leading-relaxed">{g.description}</p>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden p-0.5 border border-border">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Short Term */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-espresso">Short-Term Action Items</h3>
              </div>
              {goals.filter(g => g.goalType === 'SHORT_TERM').map(g => (
                <div key={g.id} className={`p-4 rounded-xl border space-y-3 ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-emerald-200'
                }`}>
                  <h4 className="font-semibold text-sm text-espresso">{g.title}</h4>
                  <p className="text-xs text-camel leading-relaxed">{g.description}</p>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden p-0.5 border border-border">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Add Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master SSC CGL Quantitative Aptitude"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as any)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                >
                  <option value="LONG_TERM">Long-Term Vision</option>
                  <option value="MEDIUM_TERM">Medium-Term Target</option>
                  <option value="SHORT_TERM">Short-Term Action Item</option>
                </select>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter details about this goal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-espresso font-bold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
