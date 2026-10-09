'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Timer, Play, Pause, RotateCcw, ShieldCheck } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';

export default function FocusPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'POMODORO' | 'DEEP_WORK'>('POMODORO');

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (mins: number) => {
    setIsActive(false);
    setSecondsLeft(mins * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-4xl w-full mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-espresso flex items-center justify-center gap-3">
              <Timer className="w-8 h-8 text-cocoa" />
              Focus Session Engine
            </h2>
            <p className="text-xs text-cocoa">
              Eliminate distractions. Aira will keep you accountable during your study session.
            </p>
          </div>

          <div className={`flex items-center gap-3 p-1.5 rounded-2xl border ${
            isCoffee ? 'bg-white border-border' : 'bg-card border-border'
          }`}>
            <button
              onClick={() => { setSessionType('POMODORO'); resetTimer(25); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                sessionType === 'POMODORO'
                  ? isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa text-espresso'
                  : 'text-camel hover:text-espresso'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => { setSessionType('DEEP_WORK'); resetTimer(50); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                sessionType === 'DEEP_WORK'
                  ? isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa text-espresso'
                  : 'text-camel hover:text-espresso'
              }`}
            >
              Deep Work (50m)
            </button>
          </div>

          <div className={`relative w-72 h-72 rounded-full border-4 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all ${
            isCoffee 
              ? 'bg-white/80 border-camel shadow-soft' 
              : 'bg-card/40 border-cocoa/15 shadow-purple-900/20'
          }`}>
            <span className={`text-6xl font-extrabold tracking-tight font-mono ${
              isCoffee ? 'text-espresso' : 'text-espresso'
            }`}>
              {formatTime(secondsLeft)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95 ${
                isCoffee 
                  ? 'bg-cocoa hover:bg-espresso text-white' 
                  : 'bg-cocoa hover:bg-cocoa text-white shadow-soft'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isActive ? 'Pause Session' : 'Start Focus'}
            </button>

            <button
              onClick={() => resetTimer(sessionType === 'POMODORO' ? 25 : 50)}
              className={`p-3 rounded-2xl transition-all border ${
                isCoffee 
                  ? 'bg-white border-border text-camel hover:bg-linen' 
                  : 'bg-linen hover:bg-gray-700 text-cocoa border-border'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border ${
            isCoffee 
              ? 'bg-white/80 border-border text-camel' 
              : 'bg-linen/40 text-camel border-border'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Distraction Shield Active — 100% Privacy Mode</span>
          </div>
        </main>
      </div>
    </div>
  );
}

