'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Coffee, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';

export default function CalendarPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [selectedDate, setSelectedDate] = useState(10); // Today 10th
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Header Banner */}
          <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
            isCoffee 
              ? 'bg-linen border-khaki/60 shadow-soft text-espresso' 
              : 'bg-gradient-to-r from-amber-950/60 via-card to-card border-cocoa/20'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/20'
                }`}>
                  ☕ Cozy Anime Study Cafe Calendar
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <Coffee className="w-7 h-7 text-cocoa animate-bounce" />
                Daily Study Planner & Coffee Calendar
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Warm latte & mocha study environment. Schedule mock tests, subject study blocks, revision sessions, and IT engineering tasks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa hover:bg-espresso text-espresso shadow-soft'
              }`}>
                <Plus className="w-4 h-4" /> Schedule Task / Mock
              </button>
            </div>
          </div>

          {/* Calendar Month Controls */}
          <div className={`p-5 rounded-3xl border space-y-6 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-espresso flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cocoa" />
                October 2026
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-linen/40 hover:bg-linen border border-border">
                  <ChevronLeft className="w-4 h-4 text-cocoa" />
                </button>
                <button className="p-2 rounded-xl bg-linen/40 hover:bg-linen border border-border">
                  <ChevronRight className="w-4 h-4 text-cocoa" />
                </button>
              </div>
            </div>

            {/* Grid of Days */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-extrabold text-cocoa/80 pb-2 border-b border-border/40">
                  {day}
                </div>
              ))}

              {daysInMonth.map(day => {
                const isSelected = selectedDate === day;
                const hasMock = day === 12 || day === 20;
                const hasTasks = day >= 8 && day <= 15;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[70px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? isCoffee
                          ? 'bg-cocoa/10 border-camel shadow-lg shadow-soft scale-105'
                          : 'bg-cocoa/10 border-cocoa/20 scale-105'
                        : isCoffee
                          ? 'bg-white border-cocoa hover:bg-khaki/20'
                          : 'bg-card/40 border-border/60 hover:bg-linen/40'
                    }`}
                  >
                    <span className={`font-mono font-bold text-xs ${isSelected ? 'text-cocoa font-extrabold' : 'text-cocoa'}`}>
                      {day}
                    </span>

                    <div className="space-y-1">
                      {hasMock && (
                        <span className="block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/30 text-rose-200 border border-rose-500/40 truncate">
                          🎯 Mock #06
                        </span>
                      )}
                      {hasTasks && (
                        <span className="block px-1.5 py-0.5 rounded text-[9px] font-bold bg-cocoa/10 text-cocoa truncate">
                          ☕ 3 Study Tasks
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
