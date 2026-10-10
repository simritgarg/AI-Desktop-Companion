'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  BookOpen, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  Square, 
  Sparkles, 
  FolderPlus, 
  Tag, 
  Palette, 
  Layers,
  X
} from 'lucide-react';
import { 
  fetchNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  fetchCareerWorkspaces, 
  createCareerWorkspace, 
  deleteCareerWorkspace,
  fetchCareerSubjects, 
  createCareerSubject, 
  deleteCareerSubject,
  Note, 
  CareerWorkspace, 
  CareerSubject 
} from '@/lib/api';

const colorOptions = [
  { name: 'Dark Gray', hex: '#1F2937', border: 'border-gray-700' },
  { name: 'Golden Amber', hex: '#451A03', border: 'border-amber-700' },
  { name: 'Emerald Forest', hex: '#064E3B', border: 'border-emerald-700' },
  { name: 'Deep Sapphire', hex: '#1E3A8A', border: 'border-blue-700' },
  { name: 'Purple Velvet', hex: '#4C1D95', border: 'border-purple-700' },
  { name: 'Midnight Rose', hex: '#881337', border: 'border-rose-700' },
];

export default function NotesPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // State
  const [workspaces, setWorkspaces] = useState<CareerWorkspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<CareerSubject[]>([]);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('ALL');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Workspace & Subject Modals
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Note Modal State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('#1F2937');
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; checked: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const wsList = await fetchCareerWorkspaces();
      setWorkspaces(wsList || []);
      if (wsList && wsList.length > 0) {
        setSelectedWorkspaceId(wsList[0].id!);
        const subList = await fetchCareerSubjects(wsList[0].id!);
        setSubjects(subList || []);
      }
      const nList = await fetchNotes();
      setNotes(nList || []);
    } catch {
      setWorkspaces([]);
      setNotes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectWorkspace = async (wsId: number) => {
    setSelectedWorkspaceId(wsId);
    setSelectedSubjectName('ALL');
    try {
      const subList = await fetchCareerSubjects(wsId);
      setSubjects(subList || []);
    } catch {
      setSubjects([]);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    const created = await createCareerWorkspace({ name: newWorkspaceName });
    setShowWorkspaceModal(false);
    setNewWorkspaceName('');
    loadInitialData();
  };

  const handleDeleteWorkspace = async (wsId: number) => {
    if (confirm('Delete this workspace and its subjects?')) {
      await deleteCareerWorkspace(wsId);
      loadInitialData();
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !selectedWorkspaceId) return;
    await createCareerSubject(selectedWorkspaceId, {
      workspaceId: selectedWorkspaceId,
      subjectName: newSubjectName,
    });
    setShowSubjectModal(false);
    setNewSubjectName('');
    if (selectedWorkspaceId) handleSelectWorkspace(selectedWorkspaceId);
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (confirm('Delete this subject?')) {
      await deleteCareerSubject(subjectId);
      if (selectedWorkspaceId) handleSelectWorkspace(selectedWorkspaceId);
    }
  };

  // Keep Note Handlers
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteColor('#1F2937');
    setIsChecklist(false);
    setChecklistItems([]);
    setIsPinned(false);
    setShowNoteModal(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content || '');
    setNoteColor((note as any).color || '#1F2937');
    setIsChecklist((note as any).isChecklist || false);
    setIsPinned(note.isPinned || false);

    if ((note as any).checklistJson) {
      try {
        setChecklistItems(JSON.parse((note as any).checklistJson));
      } catch {
        setChecklistItems([]);
      }
    } else {
      setChecklistItems([]);
    }
    setShowNoteModal(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const currentWs = workspaces.find(w => w.id === selectedWorkspaceId);

    const notePayload: Partial<Note> = {
      title: noteTitle,
      content: noteContent,
      category: currentWs ? currentWs.name : 'GENERAL',
      subject: selectedSubjectName !== 'ALL' ? selectedSubjectName : undefined,
      color: noteColor,
      isChecklist,
      checklistJson: isChecklist ? JSON.stringify(checklistItems) : undefined,
      isPinned,
    } as any;

    if (editingNote && editingNote.id) {
      await updateNote(editingNote.id, notePayload);
    } else {
      await createNote(notePayload as Note);
    }

    setShowNoteModal(false);
    const nList = await fetchNotes();
    setNotes(nList || []);
  };

  const handleDeleteNote = async (noteId?: number) => {
    if (!noteId) return;
    if (confirm('Move this note to Trash?')) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      await deleteNote(noteId);
    }
  };

  const handleToggleCheckitemInCard = async (note: Note, itemIndex: number) => {
    if (!note.id || !(note as any).checklistJson) return;
    let items: { id: string; text: string; checked: boolean }[] = [];
    try {
      items = JSON.parse((note as any).checklistJson);
      items[itemIndex].checked = !items[itemIndex].checked;
    } catch {
      return;
    }

    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, checklistJson: JSON.stringify(items) } as any : n));
    await updateNote(note.id, { checklistJson: JSON.stringify(items) } as any);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([...checklistItems, { id: String(Date.now()), text: newChecklistText, checked: false }]);
    setNewChecklistText('');
  };

  const filteredNotes = notes.filter(n => {
    if (selectedSubjectName !== 'ALL' && n.subject && n.subject !== selectedSubjectName) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Google Keep-Style Career Workspace
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Custom Sections & Keep Notes App
              </h2>
              <p className="text-xs text-gray-400">
                Create custom preparation sections, add custom subjects, and store color-coded notes & checkable todo lists!
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition-all shrink-0"
              >
                <FolderPlus className="w-4 h-4 text-purple-400" /> + Add Section
              </button>
              <button
                onClick={handleOpenAddNote}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20 shrink-0"
              >
                <Plus className="w-4 h-4" /> + Keep Note
              </button>
            </div>
          </div>

          {/* Section 1: Workspaces Navigation Tabs */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-camel uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cocoa" /> Career Workspace Sections:
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              {workspaces.map((ws) => {
                const isSelected = selectedWorkspaceId === ws.id;
                return (
                  <div key={ws.id} className="relative group shrink-0">
                    <button
                      onClick={() => handleSelectWorkspace(ws.id!)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                          : 'bg-white text-espresso border border-border hover:bg-gray-100'
                      }`}
                    >
                      <span>{ws.name}</span>
                      {workspaces.length > 1 && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWorkspace(ws.id!);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-100 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Subjects under Workspace */}
          {selectedWorkspaceId && (
            <div className="p-4 rounded-2xl bg-white border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-espresso flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cocoa" /> Subjects under Selected Workspace:
                </span>
                <button
                  onClick={() => setShowSubjectModal(true)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                <button
                  onClick={() => setSelectedSubjectName('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSubjectName === 'ALL'
                      ? 'bg-cocoa text-white'
                      : 'bg-linen text-camel border border-border'
                  }`}
                >
                  All Subjects
                </button>

                {subjects.map((sub) => {
                  const isSel = selectedSubjectName === sub.subjectName;
                  return (
                    <div key={sub.id} className="relative group shrink-0 flex items-center">
                      <button
                        onClick={() => setSelectedSubjectName(sub.subjectName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSel
                            ? 'bg-cocoa text-white'
                            : 'bg-linen text-camel border border-border hover:text-espresso'
                        }`}
                      >
                        <span>{sub.subjectName}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub.id!)}
                        className="ml-1 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keep Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="coffee-card p-12 rounded-3xl text-center space-y-3">
              <BookOpen className="w-10 h-10 text-purple-500 mx-auto" />
              <h3 className="font-bold text-base text-espresso">No Keep Notes for this subject</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Click "+ Keep Note" above to create text notes or checkable todo lists with custom color tags!
              </p>
              <button
                onClick={handleOpenAddNote}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shadow-md"
              >
                + Create Note / Checklist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => {
                const cardColor = (note as any).color || '#1F2937';
                const isCheck = (note as any).isChecklist;
                let items: { id: string; text: string; checked: boolean }[] = [];
                if (isCheck && (note as any).checklistJson) {
                  try {
                    items = JSON.parse((note as any).checklistJson);
                  } catch {
                    items = [];
                  }
                }

                return (
                  <div
                    key={note.id}
                    style={{ backgroundColor: cardColor }}
                    className="p-5 rounded-3xl border border-gray-700/60 shadow-lg text-white space-y-3 flex flex-col justify-between transition-transform hover:scale-[1.01]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-gray-100 leading-snug">{note.title}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          {note.isPinned && <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />}
                          <button
                            onClick={() => handleOpenEditNote(note)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {note.subject && (
                        <span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-purple-200 border border-white/20">
                          {note.subject}
                        </span>
                      )}

                      {/* Content or Checklist */}
                      {isCheck ? (
                        <div className="space-y-1.5 my-2">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleToggleCheckitemInCard(note, idx)}
                              className="flex items-center gap-2 text-xs cursor-pointer text-gray-200 hover:text-white"
                            >
                              {item.checked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400 shrink-0" />
                              )}
                              <span className={item.checked ? 'line-through text-gray-400' : ''}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Add Workspace Modal */}
        {showWorkspaceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-3xl text-white shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-gray-100">Create Career Workspace Section</h3>
              <form onSubmit={handleCreateWorkspace} className="space-y-4 text-xs">
                <input
                  type="text"
                  placeholder="Section Name (e.g. SSC CGL 2027, Senior Developer)..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWorkspaceModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Create Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Subject Modal */}
        {showSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-3xl text-white shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-gray-100">Add Subject</h3>
              <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
                <input
                  type="text"
                  placeholder="Subject Name (e.g. Quantitative Aptitude, System Design)..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubjectModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Keep Note Add/Edit Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-lg bg-gray-900 border border-purple-500/30 p-6 rounded-3xl text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h3 className="font-bold text-base text-gray-100">{editingNote ? 'Edit Keep Note' : 'New Keep Note'}</h3>
              <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-gray-400 font-semibold mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> Note Color Tag
                  </label>
                  <div className="flex items-center gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setNoteColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          noteColor === c.hex ? 'scale-110 border-white ring-2 ring-purple-500' : 'border-gray-600'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Note Type Toggle */}
                <div className="flex items-center gap-4 py-1">
                  <button
                    type="button"
                    onClick={() => setIsChecklist(false)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      !isChecklist ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Text Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChecklist(true)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isChecklist ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Checklist App
                  </button>
                </div>

                {!isChecklist ? (
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Note Content</label>
                    <textarea
                      rows={5}
                      placeholder="Write your note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-gray-400 font-semibold">Checklist Items</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add item..."
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklistItem}
                        className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl shrink-0"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {checklistItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-800/60 p-2 rounded-xl">
                          <span className="text-gray-200">{item.text}</span>
                          <button
                            type="button"
                            onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded bg-gray-800"
                  />
                  <label htmlFor="pinCheck" className="text-xs text-gray-300 font-semibold cursor-pointer">
                    Pin note to top
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20"
                  >
                    Save Keep Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
