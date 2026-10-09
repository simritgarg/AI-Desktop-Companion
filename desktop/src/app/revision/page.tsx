'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { RotateCcw, Clock, Sparkles, CheckCircle2, Bookmark, Flame } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';

export default function RevisionPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
            isCoffee 
              ? 'bg-linen border-khaki/60 shadow-soft' 
              : 'bg-gradient-to-r from-purple-950/60 via-card to-card border-cocoa/15'
          }`}>
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/15'
              }`}>
                Spaced Repetition & PYQ Bank
              </span>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <RotateCcw className="w-7 h-7 text-cocoa" />
                Revision Centre & PYQ Master Queue
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Scheduled revision queues based on spaced-repetition memory curves, Previous Year Questions (PYQ) 2018–2025, and formula drills.
              </p>
            </div>
          </div>

          {/* Daily Revision Drills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-border'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm text-cocoa">
                <Flame className="w-4 h-4 fill-amber-400" /> Overdue Topic Revisions
              </div>
              <p className="text-xs text-camel">3 Topics require immediate review today</p>
              <div className="space-y-2 text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-white/40 border border-border flex items-center justify-between">
                  <span>Trigonometric Identities</span>
                  <span className="text-cocoa font-bold">2 Days Overdue</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/40 border border-border flex items-center justify-between">
                  <span>Noun & Pronoun Errors</span>
                  <span className="text-cocoa font-bold">1 Day Overdue</span>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-border'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm text-blue-600">
                <Bookmark className="w-4 h-4" /> Formula & Shortcut Sheet
              </div>
              <p className="text-xs text-camel">Quick 10-minute daily memory refresh</p>
              <div className="p-3 rounded-xl bg-white/40 border border-border text-xs font-mono text-blue-600">
                Incentre angle: 90° + A/2
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-border'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> PYQ 2024 Practice Set
              </div>
              <p className="text-xs text-camel font-semibold">Tier 1 Shift 2 Quantitative Aptitude</p>
              <button className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                Start PYQ Drill
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
