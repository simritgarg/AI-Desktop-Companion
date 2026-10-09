'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { BookOpen, Search, Plus, Pin, Bookmark, Tag, Trash2, Edit3, Sparkles } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchNotes, createNote, updateNote, deleteNote, Note } from '@/lib/api';

const categories = [
  { key: 'ALL', label: 'All Notes' },
  { key: 'SSC_CGL', label: 'SSC CGL Notes' },
  { key: 'IT_CAREER', label: 'IT & Java Notes' },
  { key: 'FORMULAS', label: 'Formulas & Shortcuts' },
  { key: 'VOCABULARY', label: 'English Vocabulary' },
];

export default function NotesPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SSC_CGL');
  const [subject, setSubject] = useState('QUANTITATIVE_APTITUDE');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes(activeCategory === 'ALL' ? undefined : activeCategory);
      if (data.length === 0) {
        setNotes([
          { id: 1, title: 'Quantitative Aptitude Formula Master Key', category: 'FORMULAS', subject: 'QUANTITATIVE_APTITUDE', content: '1. Incentre Angle = 90 + A/2\n2. Circumcentre Angle = 2A\n3. Tangent Secant Theorem: PT^2 = PA * PB', tags: 'quant,geometry,formulas', isPinned: true },
          { id: 2, title: 'Spring Security 6 & JWT Architecture Summary', category: 'IT_CAREER', subject: 'JAVA', content: 'SecurityFilterChain bean config, OncePerRequestFilter for JWT token extraction and SecurityContextHolder setAuthentication.', tags: 'java,spring,jwt', isPinned: false },
        ]);
      } else {
        setNotes(data);
      }
    } catch {
      setNotes([
        { id: 1, title: 'Quantitative Aptitude Formula Master Key', category: 'FORMULAS', subject: 'QUANTITATIVE_APTITUDE', content: '1. Incentre Angle = 90 + A/2\n2. Circumcentre Angle = 2A\n3. Tangent Secant Theorem: PT^2 = PA * PB', tags: 'quant,geometry,formulas', isPinned: true },
      ]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [activeCategory]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      title,
      category,
      subject,
      content,
      tags,
      isPinned,
    };

    try {
      await createNote(newNote);
      loadNotes();
      setShowModal(false);
      setTitle('');
      setContent('');
    } catch {
      setNotes([{ ...newNote, id: Date.now() }, ...notes]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteNote(id);
      loadNotes();
    } catch {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.tags && n.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Header */}
          <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
            isCoffee 
              ? 'bg-linen border-khaki/60 shadow-soft' 
              : 'bg-gradient-to-r from-amber-950/60 via-card to-card border-cocoa/20'
          }`}>
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa/10 text-cocoa border border-cocoa/20'
              }`}>
                📚 Personal Knowledge Base & Study Notes
              </span>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-cocoa" />
                Notes & Knowledge Base Workspace
              </h2>
              <p className="text-xs opacity-80 max-w-2xl">
                Searchable repository for SSC CGL formulas, English vocabulary, Java code snippets, System Design notes, and revision cheatsheets.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
                isCoffee ? 'bg-cocoa text-white' : 'bg-cocoa hover:bg-espresso text-espresso shadow-soft'
              }`}
            >
              <Plus className="w-4 h-4" /> Create Study Note
            </button>
          </div>

          {/* Categories Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  activeCategory === c.key
                    ? isCoffee
                      ? 'bg-cocoa/10 text-espresso border border-camel/60 shadow-md'
                      : 'bg-cocoa text-espresso shadow-lg shadow-soft'
                    : isCoffee
                      ? 'bg-white text-camel border border-border'
                      : 'bg-white text-camel border border-border hover:text-espresso'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-camel" />
            <input
              type="text"
              placeholder="Search notes by title, formulas, code snippets, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                isCoffee
                  ? 'bg-white border-border text-espresso focus:border-camel'
                  : 'bg-linen border-border text-espresso focus:border-cocoa/20'
              }`}
            />
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                className={`p-6 rounded-2xl border space-y-3 transition-all ${
                  isCoffee ? 'bg-white border-border' : 'bg-white border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cocoa/10 text-cocoa">
                      {note.category}
                    </span>
                    {note.isPinned && <Pin className="w-3.5 h-3.5 text-cocoa fill-amber-400" />}
                  </div>

                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-khaki hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-espresso">{note.title}</h3>

                <div className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                  isCoffee ? 'bg-white border-cocoa text-cocoa' : 'bg-white/80 border-border text-blue-600'
                }`}>
                  {note.content}
                </div>

                {note.tags && (
                  <div className="flex items-center gap-1.5 text-[10px] text-camel pt-1">
                    <Tag className="w-3 h-3 text-cocoa" />
                    <span>{note.tags}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isCoffee ? 'bg-white border-khaki text-espresso' : 'bg-white border-border text-espresso'
          }`}>
            <h3 className="text-lg font-bold">Create Study Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circle Tangent Theorems & Incentre Angle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  >
                    <option value="SSC_CGL">SSC CGL Notes</option>
                    <option value="IT_CAREER">IT & Java Notes</option>
                    <option value="FORMULAS">Formulas & Shortcuts</option>
                    <option value="VOCABULARY">English Vocabulary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="quant, geometry, formulas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Note Content / Code / Formula</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter formula, key definitions, or code snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-linen border-border"
                />
                <label htmlFor="pinNote" className="text-cocoa font-semibold cursor-pointer">
                  Pin to top of knowledge base
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-espresso font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
