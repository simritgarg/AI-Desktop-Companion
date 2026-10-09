'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  Briefcase, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Bookmark, 
  Sparkles, 
  Search, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useUserStore, CareerWorkspace } from '@/lib/userStore';

interface WorkspaceTopic {
  id: string;
  topicName: string;
  subtopicName?: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'COMPLETED' | 'REVISION_REQUIRED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  formulaOrNote?: string;
}

export default function DynamicWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { customWorkspaces, deleteWorkspace, updateWorkspaceProgress } = useUserStore();

  const workspace = customWorkspaces.find((w) => w.id === workspaceId);

  const [topics, setTopics] = useState<WorkspaceTopic[]>([
    {
      id: 't1',
      topicName: 'Core Foundations & Milestone 1',
      subtopicName: 'Syllabus Breakdown & High Weightage Concepts',
      status: 'LEARNING',
      priority: 'HIGH',
      formulaOrNote: 'Focus on high ROI topics and previous 5 year patterns',
    },
    {
      id: 't2',
      topicName: 'Practice Tests & Question Bank',
      subtopicName: 'Standard Mock Attempts & Accuracy Tuning',
      status: 'NOT_STARTED',
      priority: 'URGENT',
      formulaOrNote: 'Aim for 85%+ accuracy on timed sectionals',
    }
  ]);

  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [searchQuery, setSearchQuery] = useState('');

  if (!workspace) {
    return (
      <div className="flex min-h-screen bg-linen/30">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-8 max-w-4xl mx-auto space-y-4 text-center">
            <div className="p-12 rounded-3xl bg-white border border-border shadow-soft space-y-4">
              <AlertCircle className="w-12 h-12 text-cocoa mx-auto" />
              <h2 className="text-xl font-bold text-espresso">Career Workspace Not Found</h2>
              <p className="text-xs text-camel">The requested career workspace might have been removed or does not exist.</p>
              <button
                onClick={() => router.push('/')}
                className="px-5 py-2.5 rounded-xl bg-cocoa text-white font-bold text-xs shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic: WorkspaceTopic = {
      id: `topic_${Date.now()}`,
      topicName: newTopicName,
      subtopicName: newSubtopicName,
      status: 'LEARNING',
      priority: newPriority,
      formulaOrNote: newFormula,
    };

    const updated = [...topics, newTopic];
    setTopics(updated);

    const completed = updated.filter(t => t.status === 'COMPLETED').length;
    const progress = Math.round((completed / updated.length) * 100);
    updateWorkspaceProgress(workspaceId, progress);

    setNewTopicName('');
    setNewSubtopicName('');
    setNewFormula('');
    setShowAddTopicModal(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = topics.map((t) => {
      if (t.id === id) {
        const nextStatusMap: Record<string, WorkspaceTopic['status']> = {
          'NOT_STARTED': 'LEARNING',
          'LEARNING': 'COMPLETED',
          'COMPLETED': 'REVISION_REQUIRED',
          'REVISION_REQUIRED': 'COMPLETED',
        };
        return { ...t, status: nextStatusMap[t.status] || 'COMPLETED' };
      }
      return t;
    });

    setTopics(updated);
    const completed = updated.filter(t => t.status === 'COMPLETED').length;
    const progress = Math.round((completed / updated.length) * 100);
    updateWorkspaceProgress(workspaceId, progress);
  };

  const handleDeleteTopic = (id: string) => {
    const updated = topics.filter((t) => t.id !== id);
    setTopics(updated);
    const completed = updated.filter(t => t.status === 'COMPLETED').length;
    const progress = updated.length > 0 ? Math.round((completed / updated.length) * 100) : 0;
    updateWorkspaceProgress(workspaceId, progress);
  };

  const handleDeleteWorkspace = () => {
    if (confirm(`Are you sure you want to delete "${workspace.name}" workspace?`)) {
      deleteWorkspace(workspaceId);
      router.push('/');
    }
  };

  const completedCount = topics.filter((t) => t.status === 'COMPLETED').length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  const filteredTopics = topics.filter(t => 
    t.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.subtopicName && t.subtopicName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cocoa text-white">
                  {workspace.category} CAREER TRACK
                </span>
                {workspace.targetDate && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-cocoa border border-border flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Target Date: {workspace.targetDate}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-cocoa" />
                {workspace.name}
              </h2>
              <p className="text-xs text-camel font-medium max-w-2xl">
                Goal: <strong className="text-espresso">{workspace.targetGoal || workspace.targetExam}</strong>. Dedicated roadmap, custom syllabus, notes, and study targets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddTopicModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-cocoa hover:bg-espresso text-white shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Topic
              </button>
              <button
                onClick={handleDeleteWorkspace}
                className="p-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Career Workspace"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-5 rounded-2xl border border-border bg-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-espresso font-bold">
                <BookOpen className="w-4 h-4 text-cocoa" />
                Workspace Syllabus Mastery
              </span>
              <span className="font-mono text-cocoa font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-linen rounded-full h-3 overflow-hidden p-0.5 border border-border">
              <div 
                className="h-full rounded-full bg-cocoa transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Search & Topics Grid */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-camel" />
              <input
                type="text"
                placeholder="Search topics, formulas, notes in this workspace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border border-border bg-white text-espresso focus:border-cocoa transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className="p-5 rounded-2xl border border-border bg-white space-y-4 shadow-sm hover:border-camel/50 transition-all"
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
                          {topic.priority} Priority
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-espresso mt-1.5">{topic.topicName}</h3>
                      {topic.subtopicName && (
                        <p className="text-xs text-camel font-medium">{topic.subtopicName}</p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="p-1 text-khaki hover:text-rose-600 transition-colors"
                      title="Delete topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {topic.formulaOrNote && (
                    <div className="p-3 rounded-xl border border-cocoa/30 bg-linen/50 text-xs font-mono text-espresso">
                      <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-camel mb-1">
                        <Bookmark className="w-3 h-3" /> Key Note / Formula:
                      </div>
                      <p>{topic.formulaOrNote}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                    <span className="text-camel text-[11px]">Click status toggle when completed</span>
                    <button
                      onClick={() => handleToggleStatus(topic.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cocoa/10 hover:bg-cocoa text-cocoa hover:text-white border border-cocoa/20 text-xs font-semibold transition-all active:scale-95"
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
      {showAddTopicModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl border border-khaki bg-white text-espresso shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-espresso">Add Topic to {workspace.name}</h3>
            <form onSubmit={handleAddTopic} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Topic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Polity - Preamble & Fundamental Rights"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Subtopic / Module</label>
                <input
                  type="text"
                  placeholder="e.g. Article 12 to 35 Detailed Notes"
                  value={newSubtopicName}
                  onChange={(e) => setNewSubtopicName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Formula or Key Note</label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, memory tricks, or formulas..."
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold"
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
