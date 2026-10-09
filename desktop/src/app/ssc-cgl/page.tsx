'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Bookmark,
  Trash2
} from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchSyllabusTopics, createSyllabusTopic, updateSyllabusTopic, deleteSyllabusTopic, SyllabusTopic } from '@/lib/api';

const subjects = [
  { key: 'QUANTITATIVE_APTITUDE', label: 'Quantitative Aptitude', color: 'bg-cocoa' },
  { key: 'REASONING', label: 'General Intelligence & Reasoning', color: 'bg-cyan-500' },
  { key: 'ENGLISH', label: 'English Comprehension', color: 'bg-cocoa' },
  { key: 'GENERAL_AWARENESS', label: 'General Awareness', color: 'bg-emerald-500' },
];

export default function SSCCGLPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [activeSubject, setActiveSubject] = useState('QUANTITATIVE_APTITUDE');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New topic form state
  const [newTopicName, setNewTopicName] = useState('');
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [newFormula, setNewFormula] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchSyllabusTopics('SSC_CGL', activeSubject);
      if (data.length === 0) {
        // Provide sample initial topics if empty
        setTopics([
          { id: 1, category: 'SSC_CGL', subject: 'QUANTITATIVE_APTITUDE', topicName: 'Percentage & Applications', subtopicName: 'Successive Percentage Changes', status: 'LEARNING', priority: 'HIGH', confidenceLevel: 75, formulaOrShortcuts: 'a + b + (ab/100)% for net percentage change', questionsPracticedCount: 85, accuracyPercentage: 88.5 },
          { id: 2, category: 'SSC_CGL', subject: 'QUANTITATIVE_APTITUDE', topicName: 'Profit and Loss', subtopicName: 'Dishonest Shopkeeper Problems', status: 'REVISION_REQUIRED', priority: 'URGENT', confidenceLevel: 60, formulaOrShortcuts: 'Profit % = (Error / (True Value - Error)) * 100', questionsPracticedCount: 110, accuracyPercentage: 72.0 },
          { id: 3, category: 'SSC_CGL', subject: 'QUANTITATIVE_APTITUDE', topicName: 'Algebra & Quadratic Equations', subtopicName: 'Identities & Symmetric Expressions', status: 'COMPLETED', priority: 'MEDIUM', confidenceLevel: 90, formulaOrShortcuts: 'x + 1/x = k => x^2 + 1/x^2 = k^2 - 2', questionsPracticedCount: 150, accuracyPercentage: 94.0 },
        ]);
      } else {
        setTopics(data);
      }
    } catch {
      setTopics([
        { id: 1, category: 'SSC_CGL', subject: 'QUANTITATIVE_APTITUDE', topicName: 'Percentage & Applications', subtopicName: 'Successive Percentage Changes', status: 'LEARNING', priority: 'HIGH', confidenceLevel: 75, formulaOrShortcuts: 'a + b + (ab/100)% for net percentage change', questionsPracticedCount: 85, accuracyPercentage: 88.5 },
        { id: 2, category: 'SSC_CGL', subject: 'QUANTITATIVE_APTITUDE', topicName: 'Profit and Loss', subtopicName: 'Dishonest Shopkeeper Problems', status: 'REVISION_REQUIRED', priority: 'URGENT', confidenceLevel: 60, formulaOrShortcuts: 'Profit % = (Error / (True Value - Error)) * 100', questionsPracticedCount: 110, accuracyPercentage: 72.0 },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSubject]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const topicObj: SyllabusTopic = {
      category: 'SSC_CGL',
      subject: activeSubject,
      topicName: newTopicName,
      subtopicName: newSubtopicName,
      status: 'LEARNING',
      priority: newPriority,
      formulaOrShortcuts: newFormula,
      confidenceLevel: 50,
      questionsPracticedCount: 0,
      accuracyPercentage: 0.0,
    };

    try {
      await createSyllabusTopic(topicObj);
      loadData();
      setShowAddModal(false);
      setNewTopicName('');
      setNewSubtopicName('');
      setNewFormula('');
    } catch {
      setTopics([...topics, { ...topicObj, id: Date.now() }]);
      setShowAddModal(false);
    }
  };

  const handleStatusToggle = async (topic: SyllabusTopic) => {
    const nextStatusMap: Record<string, SyllabusTopic['status']> = {
      'NOT_STARTED': 'LEARNING',
      'LEARNING': 'COMPLETED',
      'COMPLETED': 'REVISION_REQUIRED',
      'REVISION_REQUIRED': 'COMPLETED'
    };
    const updatedStatus = nextStatusMap[topic.status] || 'COMPLETED';
    if (topic.id) {
      try {
        await updateSyllabusTopic(topic.id, { status: updatedStatus });
        loadData();
      } catch {
        setTopics(topics.map(t => t.id === topic.id ? { ...t, status: updatedStatus } : t));
      }
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteSyllabusTopic(id);
      loadData();
    } catch {
      setTopics(topics.filter(t => t.id !== id));
    }
  };

  const filteredTopics = topics.filter(t => 
    t.topicName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.subtopicName && t.subtopicName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedCount = topics.filter(t => t.status === 'COMPLETED').length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

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
              : 'bg-gradient-to-r from-amber-950/60 via-card to-card border-cocoa/20'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/20'
                }`}>
                  Official Tier 1 & Tier 2 Syllabus Tracker
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-cocoa" />
                SSC CGL Preparation Command Workspace
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Track subject-wise completion, formula sheets, accuracy rates, and revision queues across Quantitative Aptitude, Reasoning, English, and General Awareness.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee 
                  ? 'bg-cocoa hover:bg-espresso text-white' 
                  : 'bg-cocoa hover:bg-espresso text-espresso shadow-soft'
              }`}
            >
              <Plus className="w-4 h-4" /> Add Syllabus Topic
            </button>
          </div>

          {/* Syllabus Progress Bar */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isCoffee ? 'bg-white border-border' : 'bg-white border-border'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cocoa" />
                Current Subject Mastery Completion
              </span>
              <span className="font-mono text-cocoa font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden p-0.5 border border-border">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isCoffee ? 'bg-cocoa' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Subject Navigation Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub.key}
                onClick={() => setActiveSubject(sub.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                  activeSubject === sub.key
                    ? isCoffee
                      ? 'bg-cocoa/10 text-espresso border border-camel/60 shadow-lg shadow-soft'
                      : 'bg-cocoa text-white shadow-lg shadow-soft'
                    : isCoffee
                      ? 'bg-white text-camel border border-border hover:bg-linen'
                      : 'bg-white text-camel border border-border hover:text-espresso'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                {sub.label}
              </button>
            ))}
          </div>

          {/* Search & Topic Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-camel" />
                <input
                  type="text"
                  placeholder="Search topics, subtopics, formula shortcuts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                    isCoffee
                      ? 'bg-white border-border text-espresso focus:border-camel'
                      : 'bg-linen border-border text-espresso focus:border-cocoa/20'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 hover:scale-[1.01] ${
                    isCoffee 
                      ? 'bg-white border-border hover:border-camel/50' 
                      : 'bg-white border-border hover:border-cocoa/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          topic.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                          topic.status === 'REVISION_REQUIRED' ? 'bg-rose-50 text-rose-600' :
                          'bg-cocoa/10 text-cocoa'
                        }`}>
                          {topic.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-semibold text-camel font-mono">
                          Priority: {topic.priority}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-espresso mt-1.5">{topic.topicName}</h3>
                      {topic.subtopicName && (
                        <p className="text-xs text-cocoa/80 font-medium">{topic.subtopicName}</p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDelete(topic.id)}
                      className="p-1 text-khaki hover:text-rose-600 transition-colors"
                      title="Delete topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Formula & Shortcuts Section */}
                  {topic.formulaOrShortcuts && (
                    <div className={`p-3 rounded-xl border text-xs font-mono ${
                      isCoffee 
                        ? 'bg-white border-cocoa text-cocoa' 
                        : 'bg-white/80 border-border text-blue-600'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-camel mb-1">
                        <Bookmark className="w-3 h-3" /> Formula & Shortcut Key:
                      </div>
                      <p className="leading-relaxed">{topic.formulaOrShortcuts}</p>
                    </div>
                  )}

                  {/* Performance Metrics & Status Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-4 text-camel">
                      <span>Practiced: <strong className="text-espresso">{topic.questionsPracticedCount || 0} Qs</strong></span>
                      <span>Accuracy: <strong className="text-emerald-600">{topic.accuracyPercentage || 0}%</strong></span>
                    </div>

                    <button
                      onClick={() => handleStatusToggle(topic)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cocoa/10 hover:bg-cocoa/50 text-cocoa border border-cocoa/20 text-xs font-semibold transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Status Toggle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Add New SSC CGL Syllabus Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geometry & Triangle Theorems"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Subtopic (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Incentre & Circumcentre Properties"
                  value={newSubtopicName}
                  onChange={(e) => setNewSubtopicName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Important Formula / Shortcut Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Angle in a semicircle is a right angle (90 deg)"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
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
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
