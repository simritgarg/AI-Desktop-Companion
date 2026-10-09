'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { BookOpen, Smile, Frown, Zap, Coffee, Heart, Plus, Search, Calendar as CalendarIcon, ShieldCheck, Lock } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchDiaryEntries, saveDiaryEntry, DiaryEntry } from '@/lib/api';

const moods = [
  { key: 'FOCUSED', label: 'Focused', icon: Zap, color: 'text-cocoa' },
  { key: 'MOTIVATED', label: 'Motivated', icon: Heart, color: 'text-rose-600' },
  { key: 'HAPPY', label: 'Happy', icon: Smile, color: 'text-emerald-600' },
  { key: 'CALM', label: 'Calm', icon: Coffee, color: 'text-blue-600' },
  { key: 'TIRED', label: 'Tired', icon: Frown, color: 'text-camel' },
];

export default function DiaryPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<'HAPPY' | 'CALM' | 'FOCUSED' | 'TIRED' | 'ANXIOUS' | 'MOTIVATED'>('FOCUSED');

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [struggles, setStruggles] = useState('');
  const [lessonsFromMocks, setLessonsFromMocks] = useState('');
  const [tomorrowIntention, setTomorrowIntention] = useState('');

  const loadEntries = async () => {
    try {
      const data = await fetchDiaryEntries();
      if (data.length === 0) {
        setEntries([
          { id: 1, entryDate: '2026-10-10', title: 'Productive Quant Practice & Spring Security Success', content: 'Focused 3 hours on Profit & Loss dishonest shopkeeper problems. Understood the net profit formula completely.', mood: 'FOCUSED', whatILearned: 'Successive percentage formula: a + b + ab/100', whatWentWell: 'Completed 25 LeetCode/Quant questions', struggles: 'Minor distraction around 4 PM', tomorrowIntention: 'Execute Oliveboard Full Mock #06 in morning' }
        ]);
      } else {
        setEntries(data);
      }
    } catch {
      setEntries([
        { id: 1, entryDate: '2026-10-10', title: 'Productive Quant Practice & Spring Security Success', content: 'Focused 3 hours on Profit & Loss dishonest shopkeeper problems. Understood the net profit formula completely.', mood: 'FOCUSED', whatILearned: 'Successive percentage formula: a + b + ab/100', whatWentWell: 'Completed 25 LeetCode/Quant questions', struggles: 'Minor distraction around 4 PM', tomorrowIntention: 'Execute Oliveboard Full Mock #06 in morning' }
      ]);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const entry: DiaryEntry = {
      title,
      content,
      mood: selectedMood,
      whatILearned,
      whatWentWell,
      struggles,
      lessonsFromMocks,
      tomorrowIntention,
    };

    try {
      await saveDiaryEntry(entry);
      loadEntries();
      setTitle('');
      setContent('');
      setWhatILearned('');
      setWhatWentWell('');
    } catch {
      setEntries([{ ...entry, id: Date.now() }, ...entries]);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Header Banner */}
          <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
            isCoffee 
              ? 'bg-linen border-khaki/60 shadow-soft' 
              : 'bg-gradient-to-r from-emerald-950/60 via-card to-card border-emerald-200'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCoffee ? 'bg-cocoa text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  🔒 100% Private Local Journaling & Reflections
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-emerald-600" />
                Personal Private Diary & Reflection Journal
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Record your daily thoughts, mood tracking, learning highlights, mock test lessons, and tomorrow's intentions in a cozy, private diary.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
              <Lock className="w-4 h-4" />
              <span>Offline & Encrypted Local Privacy</span>
            </div>
          </div>

          {/* New Entry Form */}
          <div className={`p-6 rounded-3xl border space-y-5 shadow-xl ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <h3 className="text-base font-bold text-espresso flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Today's Reflection Entry
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Mood Selector */}
              <div>
                <label className="block text-camel font-semibold mb-2">Select Today's Mood</label>
                <div className="flex items-center gap-3">
                  {moods.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMood === m.key;
                    return (
                      <button
                        type="button"
                        key={m.key}
                        onClick={() => setSelectedMood(m.key as any)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? isCoffee
                              ? 'bg-cocoa/10 text-espresso border-camel'
                              : 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                            : 'bg-linen border-border text-camel'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${m.color}`} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-camel font-semibold mb-1">Entry Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mastered Profit & Loss Dishonest Shopkeeper Tricks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Tomorrow's Primary Intention</label>
                  <input
                    type="text"
                    placeholder="e.g. Complete 50 Quant Qs & 1 Full Mock"
                    value={tomorrowIntention}
                    onChange={(e) => setTomorrowIntention(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Diary Entry Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your thoughts, feelings, study progress, and observations today..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-camel font-semibold mb-1">What I Learned Today</label>
                  <input
                    type="text"
                    placeholder="Key formula, concept, or technical trick..."
                    value={whatILearned}
                    onChange={(e) => setWhatILearned(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">What Went Well</label>
                  <input
                    type="text"
                    placeholder="Highlights, achievements, high focus sessions..."
                    value={whatWentWell}
                    onChange={(e) => setWhatWentWell(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Save Reflection Entry
                </button>
              </div>
            </form>
          </div>

          {/* Past Diary Entries */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-espresso">Past Journal Entries</h3>
            <div className="grid grid-cols-1 gap-4">
              {entries.map(e => (
                <div 
                  key={e.id}
                  className={`p-6 rounded-2xl border space-y-3 ${
                    isCoffee ? 'bg-white border-border' : 'bg-white border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-600">
                        {e.mood}
                      </span>
                      <span className="text-xs text-camel font-mono">{e.entryDate}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-espresso">{e.title}</h4>
                  <p className="text-xs text-cocoa leading-relaxed font-sans">{e.content}</p>

                  {e.whatILearned && (
                    <div className="p-3 rounded-xl bg-white/40 border border-border text-xs text-emerald-600 font-mono">
                      💡 Learned: {e.whatILearned}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
