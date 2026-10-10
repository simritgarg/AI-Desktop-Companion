'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, RotateCcw, X, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchTrash, restoreTrashItem, purgeTrashItem, emptyTrash, TrashResponse } from '@/lib/api';

interface TrashModalProps {
  onClose: () => void;
  onRestored?: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({ onClose, onRestored }) => {
  const [trashData, setTrashData] = useState<TrashResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await fetchTrash();
      setTrashData(data);
    } catch {
      setTrashData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (type: string, id: number) => {
    await restoreTrashItem(type, id);
    setActionMessage(`Restored ${type}!`);
    setTimeout(() => setActionMessage(null), 2000);
    loadTrash();
    if (onRestored) onRestored();
  };

  const handlePurge = async (type: string, id: number) => {
    await purgeTrashItem(type, id);
    setActionMessage(`Permanently deleted ${type}`);
    setTimeout(() => setActionMessage(null), 2000);
    loadTrash();
  };

  const handleEmptyAll = async () => {
    if (confirm('Are you sure you want to permanently delete all items in Trash?')) {
      await emptyTrash();
      loadTrash();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-gray-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100">Trash Bin</h2>
              <p className="text-xs text-gray-400">Items are automatically deleted permanently after 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trashData && trashData.totalCount > 0 && (
              <button
                onClick={handleEmptyAll}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
              >
                Empty Trash
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="my-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Content list */}
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
              Loading trash items...
            </div>
          ) : !trashData || trashData.totalCount === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Trash2 className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-sm font-semibold text-gray-300">Trash is Empty</p>
              <p className="text-xs text-gray-500">Deleted tasks, goals, habits, or notes will appear here for 30 days.</p>
            </div>
          ) : (
            <>
              {/* Tasks */}
              {trashData.tasks.map((task) => (
                <div key={`task-${task.id}`} className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">TASK</span>
                    <h4 className="text-sm font-semibold text-gray-200 mt-1">{task.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore('task', task.id!)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => handlePurge('task', task.id!)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Goals */}
              {trashData.goals.map((goal) => (
                <div key={`goal-${goal.id}`} className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">GOAL</span>
                    <h4 className="text-sm font-semibold text-gray-200 mt-1">{goal.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore('goal', goal.id!)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => handlePurge('goal', goal.id!)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Habits */}
              {trashData.habits.map((habit) => (
                <div key={`habit-${habit.id}`} className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">HABIT</span>
                    <h4 className="text-sm font-semibold text-gray-200 mt-1">{habit.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore('habit', habit.id!)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => handlePurge('habit', habit.id!)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Notes */}
              {trashData.notes.map((note) => (
                <div key={`note-${note.id}`} className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">NOTE</span>
                    <h4 className="text-sm font-semibold text-gray-200 mt-1">{note.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore('note', note.id!)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => handlePurge('note', note.id!)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
