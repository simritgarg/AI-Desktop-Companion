'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Code, Terminal, Plus, CheckCircle2, Cpu, FileCode2, Laptop, Briefcase, Bookmark, Trash2 } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchSyllabusTopics, createSyllabusTopic, updateSyllabusTopic, deleteSyllabusTopic, SyllabusTopic } from '@/lib/api';

const techTracks = [
  { key: 'JAVA', label: 'Java 21 & Spring Boot 3.2', color: 'bg-rose-500' },
  { key: 'WEB_DEV', label: 'Next.js 14, React & TypeScript', color: 'bg-cyan-500' },
  { key: 'DSA', label: 'DSA & LeetCode Practice', color: 'bg-cocoa' },
  { key: 'SYSTEM_DESIGN', label: 'System Design & Database Architecture', color: 'bg-emerald-500' },
];

export default function ITCareerPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [activeTrack, setActiveTrack] = useState('JAVA');
  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Topic Form
  const [topicName, setTopicName] = useState('');
  const [subtopicName, setSubtopicName] = useState('');
  const [formulaOrShortcuts, setFormulaOrShortcuts] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');

  const loadData = async () => {
    try {
      const data = await fetchSyllabusTopics('IT_CAREER', activeTrack);
      if (data.length === 0) {
        setTopics([
          { id: 101, category: 'IT_CAREER', subject: 'JAVA', topicName: 'Spring Boot 3 Security & Stateless JWT', subtopicName: 'Filter Chain & Authentication Manager', status: 'COMPLETED', priority: 'URGENT', confidenceLevel: 90, formulaOrShortcuts: 'SecurityFilterChain bean + JwtAuthenticationFilter', questionsPracticedCount: 25, accuracyPercentage: 95.0 },
          { id: 102, category: 'IT_CAREER', subject: 'JAVA', topicName: 'Spring Data JPA & Hibernate Performance', subtopicName: 'N+1 Query Problem & Entity Graphs', status: 'LEARNING', priority: 'HIGH', confidenceLevel: 80, formulaOrShortcuts: '@EntityGraph or JOIN FETCH query', questionsPracticedCount: 15, accuracyPercentage: 85.0 },
        ]);
      } else {
        setTopics(data);
      }
    } catch {
      setTopics([
        { id: 101, category: 'IT_CAREER', subject: 'JAVA', topicName: 'Spring Boot 3 Security & Stateless JWT', subtopicName: 'Filter Chain & Authentication Manager', status: 'COMPLETED', priority: 'URGENT', confidenceLevel: 90, formulaOrShortcuts: 'SecurityFilterChain bean + JwtAuthenticationFilter', questionsPracticedCount: 25, accuracyPercentage: 95.0 },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTrack]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const topicObj: SyllabusTopic = {
      category: 'IT_CAREER',
      subject: activeTrack,
      topicName,
      subtopicName,
      status: 'LEARNING',
      priority,
      formulaOrShortcuts,
      confidenceLevel: 60,
      questionsPracticedCount: 0,
      accuracyPercentage: 0.0,
    };

    try {
      await createSyllabusTopic(topicObj);
      loadData();
      setShowAddModal(false);
      setTopicName('');
      setSubtopicName('');
      setFormulaOrShortcuts('');
    } catch {
      setTopics([...topics, { ...topicObj, id: Date.now() }]);
      setShowAddModal(false);
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
              : 'bg-gradient-to-r from-purple-950/60 via-card to-card border-cocoa/15'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/15'
                }`}>
                  Technical Skills, DSA & Portfolio Engineering
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <Code className="w-7 h-7 text-blue-600" />
                IT & Software Engineering Career Workspace
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Dedicated preparation track for Java Spring Boot backend mastery, Next.js frontend development, LeetCode DSA problem solving, and System Design interviews.
              </p>
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa hover:bg-cocoa text-white shadow-soft'
              }`}
            >
              <Plus className="w-4 h-4" /> Add Engineering Topic
            </button>
          </div>

          {/* Tech Tracks Navigation Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {techTracks.map((track) => (
              <button
                key={track.key}
                onClick={() => setActiveTrack(track.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                  activeTrack === track.key
                    ? isCoffee
                      ? 'bg-cocoa/10 text-espresso border border-camel/60 shadow-lg shadow-soft'
                      : 'bg-cocoa text-white shadow-lg shadow-soft'
                    : isCoffee
                      ? 'bg-white text-camel border border-border hover:bg-linen'
                      : 'bg-white text-camel border border-border hover:text-espresso'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${track.color}`} />
                {track.label}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div 
                key={t.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-600">
                      {t.status}
                    </span>
                    <h3 className="font-bold text-base text-espresso mt-1.5">{t.topicName}</h3>
                    <p className="text-xs text-camel mt-0.5">{t.subtopicName}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1 text-khaki hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {t.formulaOrShortcuts && (
                  <div className={`p-3 rounded-xl border text-xs font-mono ${
                    isCoffee ? 'bg-white border-cocoa text-cocoa' : 'bg-white/80 border-border text-cocoa'
                  }`}>
                    Key Code Pattern: {t.formulaOrShortcuts}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Add Engineering Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Caching with Redis & Spring Cache"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    isCoffee ? 'bg-white border-border text-espresso' : 'bg-linen border-border text-espresso'
                  }`}
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Subtopic / Module</label>
                <input
                  type="text"
                  placeholder="e.g. Cache Eviction Policies & RedisSerializer"
                  value={subtopicName}
                  onChange={(e) => setSubtopicName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    isCoffee ? 'bg-white border-border text-espresso' : 'bg-linen border-border text-espresso'
                  }`}
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Key Code Pattern / Architecture Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. @Cacheable(value = 'topics', key = '#id')"
                  value={formulaOrShortcuts}
                  onChange={(e) => setFormulaOrShortcuts(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border outline-none font-mono ${
                    isCoffee ? 'bg-white border-border text-espresso' : 'bg-linen border-border text-espresso'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    isCoffee ? 'bg-linen text-camel' : 'bg-linen text-cocoa'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold ${
                    isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa text-espresso'
                  }`}
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

