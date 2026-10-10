'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { HeartHandshake, Plus, Sparkles, Image as ImageIcon, Quote, Link as LinkIcon, Award, Trash2 } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchVisionBoards, fetchVisionBoardItems, createVisionBoard, addVisionBoardItem, deleteVisionBoardItem, VisionBoard, VisionBoardItem } from '@/lib/api';

export default function MotivationPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [boards, setBoards] = useState<VisionBoard[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<number>(1);
  const [items, setItems] = useState<VisionBoardItem[]>([]);

  // New item modal
  const [showModal, setShowModal] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const loadBoards = async () => {
    try {
      const data = await fetchVisionBoards();
      if (data.length === 0) {
        setBoards([
          { id: 1, boardName: 'SSC CGL Government Officer Vision', category: 'SSC_CGL', description: 'Selected in Tax Assistant / Inspector in Income Tax' },
          { id: 2, boardName: 'Senior Software Engineer Career', category: 'CAREER', description: 'Mastering Java Spring Boot, System Design & Fullstack Tech' },
        ]);
      } else {
        setBoards(data);
        if (data[0].id) setActiveBoardId(data[0].id);
      }
    } catch {
      setBoards([
        { id: 1, boardName: 'SSC CGL Government Officer Vision', category: 'SSC_CGL', description: 'Selected in Tax Assistant / Inspector in Income Tax' },
      ]);
    }
  };

  const loadItems = async (boardId: number) => {
    try {
      const data = await fetchVisionBoardItems(boardId);
      if (data.length === 0) {
        setItems([
          { id: 1, boardId: 1, title: 'Selected in SSC CGL 2026', caption: '"Consistency turns ordinary efforts into extraordinary results."', itemType: 'QUOTE' },
          { id: 2, boardId: 1, title: 'Clean Desktop & Focused Study Life', caption: 'Deep focus every single day without excuses.', itemType: 'IMAGE' },
        ]);
      } else {
        setItems(data);
      }
    } catch {
      setItems([
        { id: 1, boardId: 1, title: 'Selected in SSC CGL 2026', caption: '"Consistency turns ordinary efforts into extraordinary results."', itemType: 'QUOTE' },
      ]);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (activeBoardId) loadItems(activeBoardId);
  }, [activeBoardId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    const newItem: VisionBoardItem = {
      boardId: activeBoardId,
      title: itemTitle,
      imageUrlOrData: imageUrl,
      caption: caption,
      itemType: imageUrl ? 'IMAGE' : 'QUOTE',
    };

    try {
      await addVisionBoardItem(activeBoardId, newItem);
      loadItems(activeBoardId);
      setShowModal(false);
      setItemTitle('');
      setImageUrl('');
      setCaption('');
    } catch {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setShowModal(false);
    }
  };

  const handleDeleteItem = async (itemId?: number) => {
    if (!itemId) return;
    setItems(prev => prev.filter(i => i.id !== itemId));
    try {
      await deleteVisionBoardItem(itemId);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Banner */}
          <div className="p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all bg-white border-border">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                📌 Pinterest-Inspired Inspiration & Vision Board
              </span>
              <h2 className="text-2xl font-extrabold text-espresso flex items-center gap-2">
                <HeartHandshake className="w-7 h-7 text-rose-600" />
                Motivation & Career Vision Board
              </h2>
              <p className="text-xs text-camel max-w-2xl">
                Stay visually connected to your SSC CGL dream career, technical aspirations, study quotes, and personal milestones.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 bg-rose-600 hover:bg-rose-500 text-white shrink-0"
            >
              <Plus className="w-4 h-4" /> Pin Inspiration Card
            </button>
          </div>

          {/* Board Selector */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {boards.map(b => (
              <button
                key={b.id}
                onClick={() => b.id && setActiveBoardId(b.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                  activeBoardId === b.id
                    ? 'bg-cocoa text-white shadow-md'
                    : 'bg-white text-camel border border-border hover:bg-linen'
                }`}
              >
                {b.boardName}
              </button>
            ))}
          </div>

          {/* Pinterest Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div 
                key={item.id}
                className="p-6 rounded-3xl border space-y-3 transition-all hover:scale-[1.02] shadow-sm bg-white border-border flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-600">
                      {item.itemType}
                    </span>
                    <Sparkles className="w-4 h-4 text-cocoa" />
                  </div>

                  {item.imageUrlOrData && (
                    <img 
                      src={item.imageUrlOrData} 
                      alt={item.title} 
                      className="w-full h-40 object-cover rounded-2xl border border-border"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  )}

                  <h3 className="font-bold text-base text-espresso">{item.title}</h3>
                  <p className="text-xs text-cocoa italic leading-relaxed font-serif">"{item.caption}"</p>
                </div>

                <div className="pt-3 border-t border-border/60 flex justify-end">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete Card"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl border border-border bg-white text-espresso shadow-2xl space-y-5">
            <h3 className="text-lg font-bold">Pin Card to Vision Board</h3>
            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Title / Milestone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Selected in SSC CGL 2026"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Motivational Quote / Caption</label>
                <textarea
                  rows={3}
                  placeholder="Enter quote or inspiration description..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso"
                />
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
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Pin Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
