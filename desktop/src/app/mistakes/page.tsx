'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  AlertOctagon, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Bookmark, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchMistakes, createMistake, updateMistake, MistakeRecord } from '@/lib/api';

const mistakeCategories = [
  { key: 'ALL', label: 'All Mistakes' },
  { key: 'CONCEPTUAL', label: 'Conceptual Error' },
  { key: 'CALCULATION', label: 'Calculation Slip' },
  { key: 'MEMORY', label: 'Memory Lapse' },
  { key: 'GUESSING', label: 'Uncertain Guessing' },
  { key: 'READING', label: 'Reading Misinterpretation' },
  { key: 'TIME_MANAGEMENT', label: 'Time Crunch' },
];

export default function MistakesPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [subject, setSubject] = useState('QUANTITATIVE_APTITUDE');
  const [category, setCategory] = useState<MistakeRecord['mistakeCategory']>('CONCEPTUAL');

  const loadData = async () => {
    try {
      const data = await fetchMistakes(undefined, activeCategory === 'ALL' ? undefined : activeCategory);
      if (data.length === 0) {
        setMistakes([
          { id: 1, questionText: 'If a man walks at 4 km/h, he misses his train by 10 mins. If he walks at 5 km/h, he arrives 5 mins early. Find the distance to the station.', correctAnswer: '5 km', userAnswer: '4.5 km', explanation: 'Distance = (s1 * s2 / |s1 - s2|) * (t1 + t2)/60 = (4 * 5 / 1) * (15/60) = 20 * (1/4) = 5 km', mistakeCategory: 'CALCULATION', subject: 'QUANTITATIVE_APTITUDE', topic: 'Speed, Distance & Time', reviewStatus: 'UNRESOLVED' },
          { id: 2, questionText: 'Identify the grammatically correct sentence: "Neither of the boys were present at the meeting."', correctAnswer: '"Neither of the boys was present at the meeting."', userAnswer: 'Selected "were present"', explanation: 'Singular indefinite pronoun "Neither" takes singular verb "was", not "were".', mistakeCategory: 'CONCEPTUAL', subject: 'ENGLISH', topic: 'Subject-Verb Agreement', reviewStatus: 'UNDER_REVIEW' },
        ]);
      } else {
        setMistakes(data);
      }
    } catch {
      setMistakes([
        { id: 1, questionText: 'If a man walks at 4 km/h, he misses his train by 10 mins. If he walks at 5 km/h, he arrives 5 mins early. Find the distance to the station.', correctAnswer: '5 km', userAnswer: '4.5 km', explanation: 'Distance = (s1 * s2 / |s1 - s2|) * (t1 + t2)/60 = (4 * 5 / 1) * (15/60) = 20 * (1/4) = 5 km', mistakeCategory: 'CALCULATION', subject: 'QUANTITATIVE_APTITUDE', topic: 'Speed, Distance & Time', reviewStatus: 'UNRESOLVED' },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  const handleCreateMistake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const record: MistakeRecord = {
      questionText,
      correctAnswer,
      userAnswer,
      explanation,
      subject,
      mistakeCategory: category,
      reviewStatus: 'UNRESOLVED',
    };

    try {
      await createMistake(record);
      loadData();
      setShowAddModal(false);
    } catch {
      setMistakes([{ ...record, id: Date.now() }, ...mistakes]);
      setShowAddModal(false);
    }
  };

  const filteredMistakes = mistakes.filter(m =>
    m.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.explanation && m.explanation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              : 'bg-gradient-to-r from-rose-950/60 via-card to-card border-rose-200'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCoffee ? 'bg-cocoa text-white' : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  Spaced Repetition & Weak Point Elimination
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <AlertOctagon className="w-7 h-7 text-rose-600" />
                Advanced Mock Analysis & Mistake Bank
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Searchable repository of incorrect questions, calculation errors, and conceptual traps. Analyze patterns and launch revision drills to eliminate recurring errors.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-soft'
              }`}
            >
              <Plus className="w-4 h-4" /> Save Question / Mistake
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {mistakeCategories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  activeCategory === c.key
                    ? isCoffee
                      ? 'bg-cocoa/10 text-espresso border border-camel/60 shadow-md'
                      : 'bg-rose-600 text-white shadow-lg shadow-soft'
                    : isCoffee
                      ? 'bg-white text-camel border border-border hover:bg-linen'
                      : 'bg-white text-camel border border-border hover:text-espresso'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-camel" />
            <input
              type="text"
              placeholder="Search mistake bank by formula, question text, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                isCoffee
                  ? 'bg-white border-border text-espresso focus:border-camel'
                  : 'bg-linen border-border text-espresso focus:border-cocoa/20'
              }`}
            />
          </div>

          {/* Mistake Cards */}
          <div className="space-y-4">
            {filteredMistakes.map((m) => (
              <div 
                key={m.id}
                className={`p-6 rounded-2xl border space-y-4 transition-all ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                        {m.mistakeCategory}
                      </span>
                      <span className="text-xs font-semibold text-camel">{m.subject}</span>
                    </div>
                    <h3 className="font-bold text-base text-espresso leading-relaxed mt-2">{m.questionText}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
                    <span className="text-[10px] font-bold text-camel block">Your Answer:</span>
                    <p className="font-semibold mt-0.5">{m.userAnswer || 'Unattempted / Incorrect'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                    <span className="text-[10px] font-bold text-camel block">Correct Answer:</span>
                    <p className="font-semibold mt-0.5">{m.correctAnswer}</p>
                  </div>
                </div>

                {m.explanation && (
                  <div className={`p-4 rounded-xl border text-xs font-mono ${
                    isCoffee ? 'bg-white border-cocoa text-cocoa' : 'bg-white/80 border-border text-blue-600'
                  }`}>
                    <span className="font-sans font-bold text-[10px] text-camel block mb-1">Detailed Solution & Trick:</span>
                    <p className="leading-relaxed">{m.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Save Mistake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Add Question to Mistake Bank</h3>
            <form onSubmit={handleCreateMistake} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Question Text</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter full question text..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Correct Answer</label>
                  <input
                    type="text"
                    placeholder="Correct answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Your Selected Answer</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Solution & Trick Note</label>
                <textarea
                  rows={2}
                  placeholder="Solution steps, formula used, key trick..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
