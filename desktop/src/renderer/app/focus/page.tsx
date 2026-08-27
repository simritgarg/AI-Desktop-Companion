'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Timer, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function FocusPage() {
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
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-4xl w-full mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <Timer className="w-8 h-8 text-purple-400" />
              Focus Session Engine
            </h2>
            <p className="text-xs text-gray-400">
              Eliminate distractions. Aria will keep you accountable during your session.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-3 bg-card p-1.5 rounded-xl border border-border">
            <button
              onClick={() => { setSessionType('POMODORO'); resetTimer(25); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                sessionType === 'POMODORO' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => { setSessionType('DEEP_WORK'); resetTimer(50); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                sessionType === 'DEEP_WORK' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Deep Work (50m)
            </button>
          </div>

          {/* Giant Timer Display */}
          <div className="relative w-72 h-72 rounded-full border-4 border-purple-500/30 flex items-center justify-center bg-card/40 backdrop-blur-md shadow-2xl shadow-purple-900/20">
            <span className="text-6xl font-extrabold tracking-tight text-white font-mono">
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-xl shadow-purple-600/30"
            >
              {isActive ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              {isActive ? 'Pause Session' : 'Start Focus'}
            </button>

            <button
              onClick={() => resetTimer(sessionType === 'POMODORO' ? 25 : 50)}
              className="p-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all border border-border"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy & Distraction Shield Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/40 px-4 py-2 rounded-xl border border-border">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Distraction Shield Active — Privacy Mode (No password/keystroke tracking)</span>
          </div>
        </main>
      </div>
    </div>
  );
}
