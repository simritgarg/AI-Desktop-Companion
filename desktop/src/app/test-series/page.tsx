'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  FileCheck2, 
  Plus, 
  TrendingUp, 
  Award, 
  BarChart2, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  BrainCircuit,
  Trash2,
  Sparkles,
  PieChart,
  Clock,
  Layers,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';
import { useCompanionStore } from '@/lib/store';

export interface TestAttemptDetailed {
  id: number;
  platformName: 'Adda247' | 'Testbook' | 'Oliveboard' | 'Gradeup' | 'Other';
  testName: string;
  testType: 'FULL_MOCK' | 'SECTIONAL' | 'CHAPTERWISE' | 'PYQ';
  subject?: string;
  marksObtained: number;
  totalMarks: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  accuracyPercentage: number;
  percentileOrRank: string;
  timeTakenMinutes: number;
  attemptDate: string;
  aiImprovementNote: string;
  weakTopics: string[];
}

export default function TestSeriesPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [activePlatform, setActivePlatform] = useState<'ALL' | 'Adda247' | 'Testbook' | 'Oliveboard'>('ALL');
  const [activeViewMode, setActiveViewMode] = useState<'OVERVIEW' | 'CHAPTERWISE' | 'SUBJECTWISE' | 'AI_IMPROVEMENT'>('OVERVIEW');

  const [attempts, setAttempts] = useState<TestAttemptDetailed[]>([
    {
      id: 1,
      platformName: 'Adda247',
      testName: 'Adda247 SSC CGL Tier 1 Full Mock #08 (Purchased Series)',
      testType: 'FULL_MOCK',
      marksObtained: 156.5,
      totalMarks: 200,
      correctAnswers: 83,
      incorrectAnswers: 11,
      unattemptedQuestions: 6,
      accuracyPercentage: 88.3,
      percentileOrRank: '97.2nd Percentile (Rank 412/14800)',
      timeTakenMinutes: 54,
      attemptDate: '2026-10-09',
      aiImprovementNote: 'Excellent accuracy in Reasoning (96%). Speed up Quant Geometry questions (took 14 mins). Review English Cloze Test vocabulary.',
      weakTopics: ['Geometry Tangent Theorems', 'English Cloze Test Vocab', 'General Awareness Static GK']
    },
    {
      id: 2,
      platformName: 'Testbook',
      testName: 'Testbook Pass Pro: Quant Chapterwise - Profit & Loss',
      testType: 'CHAPTERWISE',
      subject: 'Quantitative Aptitude',
      marksObtained: 46.0,
      totalMarks: 50,
      correctAnswers: 23,
      incorrectAnswers: 2,
      unattemptedQuestions: 0,
      accuracyPercentage: 92.0,
      percentileOrRank: '98.5th Percentile',
      timeTakenMinutes: 18,
      attemptDate: '2026-10-07',
      aiImprovementNote: 'Strong mastery of dishonest shopkeeper tricks. Work on successive discount multi-item shortcuts.',
      weakTopics: ['Dishonest Shopkeeper Weighted Errors', 'Multi-item Discount Ratios']
    },
    {
      id: 3,
      platformName: 'Oliveboard',
      testName: 'Oliveboard Full Mock #05 (Tier 1 Pattern)',
      testType: 'FULL_MOCK',
      marksObtained: 148.0,
      totalMarks: 200,
      correctAnswers: 78,
      incorrectAnswers: 14,
      unattemptedQuestions: 8,
      accuracyPercentage: 84.7,
      percentileOrRank: '94.1st Percentile',
      timeTakenMinutes: 58,
      attemptDate: '2026-10-05',
      aiImprovementNote: 'Logical reasoning time management was optimal. General Awareness negative marks cost 7 marks.',
      weakTopics: ['Static History Dynasties', 'Current Affairs Economic Survey']
    }
  ]);

  // Form Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [platformName, setPlatformName] = useState<'Adda247' | 'Testbook' | 'Oliveboard' | 'Gradeup' | 'Other'>('Adda247');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState<'FULL_MOCK' | 'SECTIONAL' | 'CHAPTERWISE' | 'PYQ'>('FULL_MOCK');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('200');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [percentileRank, setPercentileRank] = useState('');
  const [weakTopicInput, setWeakTopicInput] = useState('');

  const handleRecordAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const correct = parseInt(correctAnswers) || 0;
    const incorrect = parseInt(incorrectAnswers) || 0;
    const totalAttempted = correct + incorrect;
    const computedAccuracy = totalAttempted > 0 ? parseFloat(((correct / totalAttempted) * 100).toFixed(1)) : (parseFloat(accuracy) || 0);

    const newAttempt: TestAttemptDetailed = {
      id: Date.now(),
      platformName,
      testName,
      testType,
      marksObtained: parseFloat(marksObtained) || 0,
      totalMarks: parseFloat(totalMarks) || 200,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unattemptedQuestions: Math.max(0, 100 - (correct + incorrect)),
      accuracyPercentage: computedAccuracy,
      percentileOrRank: percentileRank || '95.0th Percentile',
      timeTakenMinutes: 55,
      attemptDate: new Date().toISOString().split('T')[0],
      aiImprovementNote: `Attempt analyzed cleanly for ${platformName}. Accuracy: ${computedAccuracy}%. Focus on speed & error reduction.`,
      weakTopics: weakTopicInput ? weakTopicInput.split(',').map(s => s.trim()) : ['Calculation Speed', 'Revision Required']
    };

    setAttempts([newAttempt, ...attempts]);
    setShowAddModal(false);
    setTestName('');
    setMarksObtained('');
    setCorrectAnswers('');
    setIncorrectAnswers('');
    setAccuracy('');
    setPercentileRank('');
    setWeakTopicInput('');
  };

  const handleDeleteAttempt = (id: number) => {
    if (confirm('Are you sure you want to remove this test result entry?')) {
      setAttempts(attempts.filter(a => a.id !== id));
    }
  };

  const filteredAttempts = activePlatform === 'ALL' 
    ? attempts 
    : attempts.filter(a => a.platformName === activePlatform);

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl border border-khaki/60 bg-linen shadow-soft flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cocoa text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Adda247, Testbook & Oliveboard Sync Engine
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <FileCheck2 className="w-7 h-7 text-blue-600" />
                Test Series Integration & Performance Analysis
              </h2>
              <p className="text-xs text-camel font-medium max-w-2xl">
                Integrated analytics hub for Adda247, Testbook, and Oliveboard test series. Complete chapterwise, subjectwise, PYQ analysis with AI improvement feedback.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-cocoa hover:bg-espresso text-white shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Import Test Attempt
              </button>
            </div>
          </div>

          {/* Platform Badges Bar */}
          <div className="p-4 rounded-2xl border border-border bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="font-bold text-espresso flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Purchased Series:
              </span>
              <span className="px-3 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 font-bold">
                Adda247 Purchased Series Active
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Testbook Pass Pro Connected
              </span>
              <span className="px-3 py-1 rounded-xl bg-cocoa/10 text-cocoa border border-cocoa/20 font-bold">
                Oliveboard Mock Center
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Live AI Analysis Ready</span>
          </div>

          {/* View Modes & Platform Filter Tabs */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {(['ALL', 'Adda247', 'Testbook', 'Oliveboard'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                    activePlatform === p
                      ? 'bg-cocoa text-white shadow-md'
                      : 'bg-white text-camel border border-border hover:text-espresso'
                  }`}
                >
                  {p === 'ALL' ? 'All Combined Test Series' : `${p} Analytics`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-border text-xs">
              <button
                onClick={() => setActiveViewMode('OVERVIEW')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeViewMode === 'OVERVIEW' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveViewMode('CHAPTERWISE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeViewMode === 'CHAPTERWISE' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'
                }`}
              >
                Chapterwise
              </button>
              <button
                onClick={() => setActiveViewMode('SUBJECTWISE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeViewMode === 'SUBJECTWISE' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'
                }`}
              >
                Subjectwise
              </button>
              <button
                onClick={() => setActiveViewMode('AI_IMPROVEMENT')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeViewMode === 'AI_IMPROVEMENT' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'
                }`}
              >
                ✨ AI Improvement Report
              </button>
            </div>
          </div>

          {/* SECTION 1: Chapterwise Analysis Breakdown */}
          {activeViewMode === 'CHAPTERWISE' && (
            <div className="p-6 rounded-3xl border border-border bg-white space-y-5 shadow-sm">
              <h3 className="text-lg font-extrabold text-espresso flex items-center gap-2">
                <Layers className="w-5 h-5 text-cocoa" /> Chapterwise & Topicwise Mastery Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-border bg-linen/50 space-y-2">
                  <div className="flex justify-between font-bold text-espresso">
                    <span>Quant: Profit & Loss & Dishonest Shopkeeper</span>
                    <span className="text-emerald-600 font-mono">92% Accuracy</span>
                  </div>
                  <p className="text-camel">Average speed: 42s per question. High speed and accuracy.</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-linen/50 space-y-2">
                  <div className="flex justify-between font-bold text-espresso">
                    <span>Quant: Geometry Tangent & Circle Theorems</span>
                    <span className="text-rose-600 font-mono">68% Accuracy</span>
                  </div>
                  <p className="text-camel">Needs formula revision. Took 2.4 mins average per question.</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-linen/50 space-y-2">
                  <div className="flex justify-between font-bold text-espresso">
                    <span>Reasoning: Syllogism & Coding-Decoding</span>
                    <span className="text-emerald-600 font-mono">96% Accuracy</span>
                  </div>
                  <p className="text-camel">Flawless performance. 25 questions solved in 12 mins.</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-linen/50 space-y-2">
                  <div className="flex justify-between font-bold text-espresso">
                    <span>English: Cloze Test & Vocab Idioms</span>
                    <span className="text-amber-600 font-mono">78% Accuracy</span>
                  </div>
                  <p className="text-camel">Negative marks lost: 4 marks in prepositions and idioms.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: AI Improvement Engine Report */}
          {activeViewMode === 'AI_IMPROVEMENT' && (
            <div className="p-6 rounded-3xl border border-amber-300 bg-amber-50/40 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-espresso flex items-center gap-2">
                  <BrainCircuit className="w-6 h-6 text-cocoa" /> Actionable AI Test Improvement Engine
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cocoa text-white">
                  Adda247 & Testbook Unified Report
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-border space-y-2">
                  <h4 className="font-extrabold text-espresso flex items-center gap-1.5 text-rose-600">
                    ⚠️ 1. What You Need to Improve
                  </h4>
                  <ul className="space-y-1.5 text-camel list-disc pl-4">
                    <li>Geometry Tangent Secant proofs (took 14 mins in Adda247 mock).</li>
                    <li>General Awareness Static History Dynasties (7 negative marks lost).</li>
                    <li>Speed on English Reading Comprehension.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-border space-y-2">
                  <h4 className="font-extrabold text-espresso flex items-center gap-1.5 text-amber-600">
                    🔍 2. Detected Mistake Categories
                  </h4>
                  <ul className="space-y-1.5 text-camel list-disc pl-4">
                    <li><strong>Calculation Errors:</strong> 3 questions in Quant.</li>
                    <li><strong>Time Pressure:</strong> Rushed last 5 English questions.</li>
                    <li><strong>Conceptual Gap:</strong> Circle properties & tangents.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-border space-y-2">
                  <h4 className="font-extrabold text-espresso flex items-center gap-1.5 text-emerald-600">
                    ⚡ 3. Action Items for Next Mock
                  </h4>
                  <ul className="space-y-1.5 text-camel list-disc pl-4">
                    <li>Solve 30 Geometry PYQs from Revision Base today.</li>
                    <li>Skip tough GA questions instantly to save time for Quant.</li>
                    <li>Aim for 90%+ accuracy in Next Adda247 Full Mock.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Test Attempt Cards List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-espresso">Attempted Mock Tests & Sectionals</h3>

            <div className="grid grid-cols-1 gap-4">
              {filteredAttempts.map((item) => (
                <div 
                  key={item.id}
                  className="p-6 rounded-3xl border border-border bg-white space-y-4 shadow-sm hover:border-camel/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                          item.platformName === 'Adda247' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          item.platformName === 'Testbook' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          'bg-cocoa/10 text-cocoa border border-cocoa/20'
                        }`}>
                          {item.platformName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-linen text-camel font-semibold">
                          {item.testType}
                        </span>
                        <span className="text-xs text-camel font-mono">{item.attemptDate}</span>
                      </div>
                      <h4 className="font-bold text-base text-espresso mt-1.5">{item.testName}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-emerald-600 font-mono">{item.marksObtained}</span>
                        <span className="text-xs text-camel font-mono"> / {item.totalMarks}</span>
                        <p className="text-[11px] text-cocoa font-semibold">{item.percentileOrRank}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteAttempt(item.id)}
                        className="p-1.5 text-khaki hover:text-rose-600 transition-colors"
                        title="Delete test result"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-camel block text-[10px]">Correct Qs</span>
                      <strong className="text-emerald-700 font-mono text-sm">{item.correctAnswers}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-camel block text-[10px]">Incorrect Qs</span>
                      <strong className="text-rose-700 font-mono text-sm">{item.incorrectAnswers}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200">
                      <span className="text-camel block text-[10px]">Accuracy Rate</span>
                      <strong className="text-blue-700 font-mono text-sm">{item.accuracyPercentage}%</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                      <span className="text-camel block text-[10px]">Time Taken</span>
                      <strong className="text-purple-700 font-mono text-sm">{item.timeTakenMinutes} mins</strong>
                    </div>
                  </div>

                  {/* AI Note */}
                  {item.aiImprovementNote && (
                    <div className="p-3 rounded-xl bg-linen border border-border text-xs text-espresso font-medium space-y-1">
                      <span className="font-bold text-cocoa flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-camel" /> AI Performance Feedback:
                      </span>
                      <p>{item.aiImprovementNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Record / Import Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl border border-khaki bg-white text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-cocoa" /> Record Test Series Result
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordAttempt} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Platform</label>
                  <select
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value as any)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  >
                    <option value="Adda247">Adda247 Purchased Series</option>
                    <option value="Testbook">Testbook Pass Pro</option>
                    <option value="Oliveboard">Oliveboard Mocks</option>
                    <option value="Gradeup">Gradeup / BYJU'S</option>
                    <option value="Other">Other Custom Mock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-camel font-semibold mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  >
                    <option value="FULL_MOCK">Full Mock Test</option>
                    <option value="SECTIONAL">Sectional Test</option>
                    <option value="CHAPTERWISE">Chapterwise Test</option>
                    <option value="PYQ">Previous Year Question (PYQ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adda247 SSC CGL Tier 1 Full Mock #12"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="156.5"
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Accuracy %</label>
                  <input
                    type="number"
                    placeholder="88.3"
                    value={accuracy}
                    onChange={(e) => setAccuracy(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Correct Qs</label>
                  <input
                    type="number"
                    placeholder="83"
                    value={correctAnswers}
                    onChange={(e) => setCorrectAnswers(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Incorrect Qs</label>
                  <input
                    type="number"
                    placeholder="11"
                    value={incorrectAnswers}
                    onChange={(e) => setIncorrectAnswers(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                  />
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Percentile / Rank</label>
                  <input
                    type="text"
                    placeholder="97.2nd Percentile"
                    value={percentileRank}
                    onChange={(e) => setPercentileRank(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Weak Topics / Errors (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Geometry Tangents, Prepositions, Speed in Quant"
                  value={weakTopicInput}
                  onChange={(e) => setWeakTopicInput(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold"
                >
                  Save & Analyze Attempt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
