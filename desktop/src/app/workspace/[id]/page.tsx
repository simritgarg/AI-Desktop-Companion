'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  Briefcase, 
  BookOpen, 
  Plus, 
  CheckSquare, 
  Square, 
  Trash2, 
  FileText, 
  Search, 
  Calendar,
  AlertCircle,
  X,
  Edit3,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { useUserStore } from '@/lib/userStore';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Notepad {
  id: string;
  subjectId: string;
  title: string;
  content: string; // Free text note
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color?: string;
}

export default function DynamicWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { customWorkspaces, deleteWorkspace, updateWorkspaceProgress } = useUserStore();

  const workspace = customWorkspaces.find((w) => w.id === workspaceId);

  // Default initial subjects
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'sub_1', name: 'Quantitative Aptitude', color: 'bg-amber-600' },
    { id: 'sub_2', name: 'General Intelligence & Reasoning', color: 'bg-blue-600' },
    { id: 'sub_3', name: 'English Comprehension', color: 'bg-emerald-600' },
    { id: 'sub_4', name: 'General Awareness', color: 'bg-purple-600' },
  ]);

  const [activeSubjectId, setActiveSubjectId] = useState<string>('sub_1');

  // Notepads stored by workspace ID in localStorage
  const [notepads, setNotepads] = useState<Notepad[]>([
    {
      id: 'note_1',
      subjectId: 'sub_1',
      title: 'Profit & Loss Formula Sheet & Shortcuts',
      content: 'Key Formula:\nNet change = a + b + (ab/100)%\nDishonest Shopkeeper Profit % = (Error / (True Value - Error)) * 100\n\nAlways convert percentages to fractions for speed!',
      checklist: [
        { id: 'chk_1', text: 'Master successive percentage change trick', completed: true },
        { id: 'chk_2', text: 'Solve 45 dishonest shopkeeper PYQs', completed: true },
        { id: 'chk_3', text: 'Review calculation shortcuts from Mistake Bank', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'note_2',
      subjectId: 'sub_1',
      title: 'Algebra & Quadratic Equations Key Theorems',
      content: 'Symmetric expressions:\nIf x + 1/x = k, then x^2 + 1/x^2 = k^2 - 2\nx^3 + 1/x^3 = k^3 - 3k',
      checklist: [
        { id: 'chk_4', text: 'Memorize cubic identities', completed: true },
        { id: 'chk_5', text: 'Solve 30 Tier 2 high difficulty questions', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  // Active Notepad Editor Modal / Drawer state
  const [activeNotepad, setActiveNotepad] = useState<Notepad | null>(null);

  // Add Subject Modal
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Add Notepad Modal
  const [showAddNotepadModal, setShowAddNotepadModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Checklist item input
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load persistence from localStorage
  useEffect(() => {
    if (!workspaceId) return;
    try {
      const savedSubs = localStorage.getItem(`ws_subjects_${workspaceId}`);
      if (savedSubs) {
        setSubjects(JSON.parse(savedSubs));
      }
      const savedNotes = localStorage.getItem(`ws_notepads_${workspaceId}`);
      if (savedNotes) {
        setNotepads(JSON.parse(savedNotes));
      }
    } catch {
      // Keep defaults
    }
  }, [workspaceId]);

  // Save changes to localStorage
  const saveToStorage = (updatedSubs: Subject[], updatedNotes: Notepad[]) => {
    try {
      localStorage.setItem(`ws_subjects_${workspaceId}`, JSON.stringify(updatedSubs));
      localStorage.setItem(`ws_notepads_${workspaceId}`, JSON.stringify(updatedNotes));
    } catch {
      // Ignore
    }

    // Compute overall progress across all checklists
    let totalItems = 0;
    let completedItems = 0;
    updatedNotes.forEach((n) => {
      n.checklist.forEach((c) => {
        totalItems++;
        if (c.completed) completedItems++;
      });
    });

    const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    updateWorkspaceProgress(workspaceId, totalProgress);
  };

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
              <p className="text-xs text-camel">The requested career workspace does not exist or has been removed.</p>
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

  // Handle Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSub: Subject = {
      id: `sub_${Date.now()}`,
      name: newSubjectName,
      color: 'bg-cocoa',
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    setActiveSubjectId(newSub.id);
    saveToStorage(updated, notepads);

    setNewSubjectName('');
    setShowAddSubjectModal(false);
  };

  const handleDeleteSubject = (subId: string, subName: string) => {
    if (subjects.length <= 1) {
      alert('You must keep at least one subject in the workspace.');
      return;
    }
    if (confirm(`Are you sure you want to delete subject "${subName}" and all its notepads?`)) {
      const updatedSubs = subjects.filter(s => s.id !== subId);
      const updatedNotes = notepads.filter(n => n.subjectId !== subId);
      setSubjects(updatedSubs);
      setNotepads(updatedNotes);
      setActiveSubjectId(updatedSubs[0]?.id || '');
      saveToStorage(updatedSubs, updatedNotes);
    }
  };

  // Handle Add Notepad
  const handleAddNotepad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: Notepad = {
      id: `note_${Date.now()}`,
      subjectId: activeSubjectId,
      title: newNoteTitle,
      content: newNoteContent,
      checklist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notepads, newNote];
    setNotepads(updatedNotes);
    saveToStorage(subjects, updatedNotes);

    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNotepadModal(false);
    setActiveNotepad(newNote);
  };

  const handleDeleteNotepad = (noteId: string) => {
    if (confirm('Are you sure you want to delete this notepad?')) {
      const updatedNotes = notepads.filter(n => n.id !== noteId);
      setNotepads(updatedNotes);
      if (activeNotepad?.id === noteId) setActiveNotepad(null);
      saveToStorage(subjects, updatedNotes);
    }
  };

  // Checklist Toggle & Editing
  const handleToggleCheckitem = (noteId: string, itemId: string) => {
    const updatedNotes = notepads.map((n) => {
      if (n.id === noteId) {
        const updatedChecklist = n.checklist.map((c) => 
          c.id === itemId ? { ...c, completed: !c.completed } : c
        );
        const updatedNote = { ...n, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
        if (activeNotepad?.id === noteId) setActiveNotepad(updatedNote);
        return updatedNote;
      }
      return n;
    });

    setNotepads(updatedNotes);
    saveToStorage(subjects, updatedNotes);
  };

  const handleAddChecklistItem = (noteId: string) => {
    if (!newChecklistItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `chk_${Date.now()}`,
      text: newChecklistItemText,
      completed: false,
    };

    const updatedNotes = notepads.map((n) => {
      if (n.id === noteId) {
        const updatedNote = {
          ...n,
          checklist: [...n.checklist, newItem],
          updatedAt: new Date().toISOString(),
        };
        if (activeNotepad?.id === noteId) setActiveNotepad(updatedNote);
        return updatedNote;
      }
      return n;
    });

    setNotepads(updatedNotes);
    saveToStorage(subjects, updatedNotes);
    setNewChecklistItemText('');
  };

  const handleDeleteChecklistItem = (noteId: string, itemId: string) => {
    const updatedNotes = notepads.map((n) => {
      if (n.id === noteId) {
        const updatedNote = {
          ...n,
          checklist: n.checklist.filter((c) => c.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
        if (activeNotepad?.id === noteId) setActiveNotepad(updatedNote);
        return updatedNote;
      }
      return n;
    });

    setNotepads(updatedNotes);
    saveToStorage(subjects, updatedNotes);
  };

  const handleUpdateNoteText = (noteId: string, newTitle: string, newContent: string) => {
    const updatedNotes = notepads.map((n) => {
      if (n.id === noteId) {
        const updated = { ...n, title: newTitle, content: newContent, updatedAt: new Date().toISOString() };
        if (activeNotepad?.id === noteId) setActiveNotepad(updated);
        return updated;
      }
      return n;
    });
    setNotepads(updatedNotes);
    saveToStorage(subjects, updatedNotes);
  };

  const handleDeleteWorkspace = () => {
    if (confirm(`Are you sure you want to delete "${workspace.name}" workspace?`)) {
      deleteWorkspace(workspaceId);
      router.push('/');
    }
  };

  // Active Subject & Notepads
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  const activeSubjectNotepads = notepads.filter(n => n.subjectId === activeSubjectId);

  const filteredNotepads = activeSubjectNotepads.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.checklist.some(c => c.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Overall workspace checklist completion
  let allTotal = 0;
  let allDone = 0;
  notepads.forEach(n => n.checklist.forEach(c => {
    allTotal++;
    if (c.completed) allDone++;
  }));
  const workspaceProgress = allTotal > 0 ? Math.round((allDone / allTotal) * 100) : 0;

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
                  {workspace.category} CAREER WORKSPACE
                </span>
                {workspace.targetDate && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-cocoa border border-border flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Target: {workspace.targetDate}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-cocoa" />
                {workspace.name}
              </h2>
              <p className="text-xs text-camel font-medium max-w-2xl">
                Goal: <strong className="text-espresso">{workspace.targetGoal || workspace.targetExam}</strong>. Interactive Subject Notepads, free-form writing, and completion checklists.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddNotepadModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-cocoa hover:bg-espresso text-white shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Notepad
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

          {/* Overall Workspace Progress Bar */}
          <div className="p-5 rounded-2xl border border-border bg-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-espresso font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Overall Workspace Checklist Progress
              </span>
              <span className="font-mono text-cocoa font-bold">
                {allDone} of {allTotal} Tasks Done ({workspaceProgress}%)
              </span>
            </div>
            <div className="w-full bg-linen rounded-full h-3 overflow-hidden p-0.5 border border-border">
              <div 
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${workspaceProgress}%` }}
              />
            </div>
          </div>

          {/* Subject Management Tabs (Point 4 Requirement) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-espresso flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cocoa" /> Workspace Subjects
              </h3>

              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cocoa/10 text-cocoa border border-cocoa/20 text-xs font-bold hover:bg-cocoa hover:text-white transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Subject
              </button>
            </div>

            {/* Subject Tabs Scroll Container */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {subjects.map((sub) => {
                const isActive = activeSubjectId === sub.id;
                const subNotes = notepads.filter(n => n.subjectId === sub.id);
                return (
                  <div key={sub.id} className="group relative flex items-center">
                    <button
                      onClick={() => setActiveSubjectId(sub.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-cocoa text-white shadow-md'
                          : 'bg-white text-camel border border-border hover:text-espresso'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-linen text-cocoa font-mono'
                      }`}>
                        {subNotes.length} Notes
                      </span>
                    </button>

                    {subjects.length > 1 && (
                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="ml-1 p-1 text-khaki hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        title={`Delete ${sub.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Notepads Grid under Active Subject */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-camel" />
                <input
                  type="text"
                  placeholder={`Search notepads & checklist items under ${activeSubject?.name || 'Subject'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border border-border bg-white text-espresso focus:border-cocoa transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddNotepadModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cocoa text-white text-xs font-bold shadow-md hover:bg-espresso transition-all"
              >
                <Plus className="w-4 h-4" /> + New Notepad
              </button>
            </div>

            {/* Empty state if no notepads */}
            {filteredNotepads.length === 0 && (
              <div className="p-8 rounded-3xl bg-white border border-border text-center space-y-3">
                <FileText className="w-10 h-10 text-cocoa mx-auto opacity-40" />
                <h4 className="font-bold text-sm text-espresso">No Notepads Yet in {activeSubject?.name}</h4>
                <p className="text-xs text-camel max-w-md mx-auto">
                  Click "+ New Notepad" above to create free-form notes and interactive task checklists under this subject!
                </p>
                <button
                  onClick={() => setShowAddNotepadModal(true)}
                  className="px-4 py-2 rounded-xl bg-cocoa text-white font-bold text-xs shadow-md"
                >
                  Create First Notepad
                </button>
              </div>
            )}

            {/* Grid of Notepads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotepads.map((note) => {
                const totalChk = note.checklist.length;
                const completedChk = note.checklist.filter(c => c.completed).length;
                const notePercent = totalChk > 0 ? Math.round((completedChk / totalChk) * 100) : 0;

                return (
                  <div
                    key={note.id}
                    className="p-6 rounded-3xl border border-border bg-white space-y-4 shadow-sm hover:border-camel/60 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Title & Delete button */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cocoa flex-shrink-0" />
                          <h4 className="font-extrabold text-base text-espresso">{note.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteNotepad(note.id)}
                          className="p-1 text-khaki hover:text-rose-600 transition-colors"
                          title="Delete Notepad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Free Form Text Content Preview */}
                      {note.content && (
                        <div className="p-3 rounded-2xl bg-linen/60 border border-border/80 text-xs font-mono text-espresso whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
                          {note.content}
                        </div>
                      )}

                      {/* Interactive Checklist & Live Completion Bar (Point 4 Core Feature) */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-espresso flex items-center gap-1.5 font-bold">
                            <ListTodo className="w-3.5 h-3.5 text-cocoa" /> Notepad Checklist:
                          </span>
                          <span className="font-mono text-cocoa font-bold">
                            {completedChk} / {totalChk} Done ({notePercent}%)
                          </span>
                        </div>

                        {/* Interactive Progress Bar (0% to 100%) */}
                        <div className="w-full bg-linen rounded-full h-2.5 overflow-hidden p-0.5 border border-border">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              notePercent === 100 ? 'bg-emerald-500' : 'bg-cocoa'
                            }`}
                            style={{ width: `${notePercent}%` }}
                          />
                        </div>

                        {/* Checklist items list */}
                        <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto custom-scrollbar">
                          {note.checklist.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs p-1.5 px-2 rounded-xl hover:bg-linen transition-colors"
                            >
                              <button
                                onClick={() => handleToggleCheckitem(note.id, item.id)}
                                className="flex items-center gap-2 text-left flex-1 min-w-0"
                              >
                                {item.completed ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-khaki flex-shrink-0" />
                                )}
                                <span className={`truncate ${item.completed ? 'line-through text-khaki font-medium' : 'text-espresso font-semibold'}`}>
                                  {item.text}
                                </span>
                              </button>

                              <button
                                onClick={() => handleDeleteChecklistItem(note.id, item.id)}
                                className="text-khaki hover:text-rose-600 p-0.5 ml-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Checklist Item input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="+ Add checklist task..."
                            value={activeNotepad?.id === note.id ? newChecklistItemText : ''}
                            onFocus={() => setActiveNotepad(note)}
                            onChange={(e) => {
                              setActiveNotepad(note);
                              setNewChecklistItemText(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddChecklistItem(note.id);
                              }
                            }}
                            className="flex-1 bg-linen border border-border rounded-xl px-3 py-1.5 text-xs text-espresso focus:outline-none focus:border-cocoa"
                          />
                          <button
                            onClick={() => handleAddChecklistItem(note.id)}
                            className="px-3 py-1.5 rounded-xl bg-cocoa text-white text-xs font-bold hover:bg-espresso transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Edit Note Drawer Trigger */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-camel font-mono">
                        Updated {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <button
                        onClick={() => setActiveNotepad(note)}
                        className="flex items-center gap-1 text-cocoa font-bold hover:underline text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Open Full Editor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cocoa" /> Create New Workspace Subject
              </h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design, General Awareness, Geometry"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  + Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create New Notepad */}
      {showAddNotepadModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <FileText className="w-5 h-5 text-cocoa" /> Create Notepad under {activeSubject?.name}
              </h3>
              <button onClick={() => setShowAddNotepadModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNotepad} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Notepad Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Profit & Loss Formulas & Concept Tricks"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Free-Form Text Content & Notes</label>
                <textarea
                  rows={4}
                  placeholder="Write whatever you want free-form: concepts, formulas, rules, tips..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddNotepadModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  + Save Notepad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Notepad Editor Modal (Point 4) */}
      {activeNotepad && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cocoa" />
                <input
                  type="text"
                  value={activeNotepad.title}
                  onChange={(e) => handleUpdateNoteText(activeNotepad.id, e.target.value, activeNotepad.content)}
                  className="font-extrabold text-base text-espresso bg-transparent border-b border-transparent hover:border-border focus:border-cocoa outline-none px-1"
                />
              </div>

              <button onClick={() => setActiveNotepad(null)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Progress Bar Header */}
            {(() => {
              const total = activeNotepad.checklist.length;
              const done = activeNotepad.checklist.filter(c => c.completed).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div className="p-4 rounded-2xl bg-linen border border-border space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-espresso">
                    <span>Checklist Progress Bar</span>
                    <span className="font-mono text-cocoa">{done} / {total} Completed ({pct}%)</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden p-0.5 border border-border">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-cocoa'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Free Form Writing Editor */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-camel font-bold">Free Notepad Text & Formula Writing</label>
              <textarea
                rows={6}
                value={activeNotepad.content}
                onChange={(e) => handleUpdateNoteText(activeNotepad.id, activeNotepad.title, e.target.value)}
                placeholder="Write free-form text, formulas, notes..."
                className="w-full bg-linen/50 border border-border rounded-2xl p-4 text-espresso font-mono outline-none focus:border-cocoa text-xs leading-relaxed"
              />
            </div>

            {/* Checklist Items in Full Editor */}
            <div className="space-y-3 pt-2 text-xs">
              <h4 className="font-bold text-espresso flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-cocoa" /> Interactive Checklist Items
              </h4>

              <div className="space-y-2">
                {activeNotepad.checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-linen/40 border border-border/60">
                    <button
                      onClick={() => handleToggleCheckitem(activeNotepad.id, item.id)}
                      className="flex items-center gap-2.5 text-left flex-1"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-khaki" />
                      )}
                      <span className={`text-xs ${item.completed ? 'line-through text-khaki font-medium' : 'text-espresso font-semibold'}`}>
                        {item.text}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteChecklistItem(activeNotepad.id, item.id)}
                      className="text-khaki hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="+ Add new checklist item..."
                  value={newChecklistItemText}
                  onChange={(e) => setNewChecklistItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem(activeNotepad.id);
                    }
                  }}
                  className="flex-1 bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa text-xs"
                />
                <button
                  onClick={() => handleAddChecklistItem(activeNotepad.id)}
                  className="px-4 py-2 rounded-xl bg-cocoa text-white font-bold text-xs"
                >
                  Add Item
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border/60">
              <button
                onClick={() => setActiveNotepad(null)}
                className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold text-xs shadow-md"
              >
                Close & Save Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
