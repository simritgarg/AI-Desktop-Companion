'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Target, Plus } from 'lucide-react';
import { Goal } from '@/lib/api';

export default function GoalsPage() {
  const [goals] = useState<Goal[]>([
    { id: 1, title: 'Become a Senior Java & AI Software Engineer', goalType: 'LONG_TERM', status: 'IN_PROGRESS', progressPercentage: 65, description: 'Master fullstack development with Spring Boot, Next.js, AI integrations, and cloud architecture.' },
    { id: 2, title: 'Build AI Desktop Productivity Companion', goalType: 'MEDIUM_TERM', status: 'IN_PROGRESS', progressPercentage: 80, description: 'Complete full production application with Electron desktop shell, JPA persistence, and rule-based AI.' },
    { id: 3, title: 'Master Spring Security & JWT Architecture', goalType: 'SHORT_TERM', status: 'IN_PROGRESS', progressPercentage: 90, description: 'Implement JWT token parsing, dynamic authorization rules, and CORS filters.' },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Goal System
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Link long-term vision to yearly, monthly, and daily actionable milestones.
              </p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="font-bold text-sm text-gray-200">Long-Term Vision</h3>
              </div>
              {goals.filter(g => g.goalType === 'LONG_TERM').map(g => (
                <div key={g.id} className="p-4 bg-card/60 border border-purple-500/30 rounded-xl space-y-3">
                  <h4 className="font-semibold text-sm text-white">{g.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{g.description}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h3 className="font-bold text-sm text-gray-200">Medium-Term Targets</h3>
              </div>
              {goals.filter(g => g.goalType === 'MEDIUM_TERM').map(g => (
                <div key={g.id} className="p-4 bg-card/60 border border-cyan-500/30 rounded-xl space-y-3">
                  <h4 className="font-semibold text-sm text-white">{g.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{g.description}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-gray-200">Short-Term Action Items</h3>
              </div>
              {goals.filter(g => g.goalType === 'SHORT_TERM').map(g => (
                <div key={g.id} className="p-4 bg-card/60 border border-emerald-500/30 rounded-xl space-y-3">
                  <h4 className="font-semibold text-sm text-white">{g.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{g.description}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${g.progressPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
