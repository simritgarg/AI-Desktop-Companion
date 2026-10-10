'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Target, Plus, CheckCircle2, Trash2, Edit3, ChevronDown, ChevronUp, Clock, PlusCircle, Tag, Filter } from 'lucide-react';
import { fetchGoals, createGoal, updateGoal, deleteGoal, fetchGoalSubtasks, createTask, updateTask, deleteTask, fetchCategories, createCategory, Goal, Task, UserCategory } from '@/lib/api';

export default function GoalsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
  const [subtasksMap, setSubtasksMap] = useState<Record<number, Task[]>>({});

  // View mode: 'BY_TYPE' (Long/Medium/Short) or 'BY_STATUS' (In Progress, Later, In Due, Completed)
  const [viewMode, setViewMode] = useState<'BY_TYPE' | 'BY_STATUS'>('BY_STATUS');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Add/Edit Goal Modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalType, setGoalType] = useState<'LONG_TERM' | 'MEDIUM_TERM' | 'SHORT_TERM'>('LONG_TERM');
  const [goalStatus, setGoalStatus] = useState<'IN_PROGRESS' | 'LATER' | 'IN_DUE' | 'COMPLETED'>('IN_PROGRESS');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Category creation modal/inline
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Add Subtask Modal
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [subtaskGoalId, setSubtaskGoalId] = useState<number | null>(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDesc, setSubtaskDesc] = useState('');
  const [subtaskPriority, setSubtaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [subtaskStartTime, setSubtaskStartTime] = useState('');
  const [subtaskEndTime, setSubtaskEndTime] = useState('');
  const [subtaskDeadline, setSubtaskDeadline] = useState('');

  const loadGoals = async () => {
    setLoading(true);
    try {
      const [fetchedGoals, fetchedCats] = await Promise.all([fetchGoals(), fetchCategories()]);
      setGoals(fetchedGoals || []);
      setCategories(fetchedCats || []);

      if (fetchedGoals && fetchedGoals.length > 0) {
        const subMap: Record<number, Task[]> = {};
        await Promise.all(
          fetchedGoals.map(async (g) => {
            if (g.id) {
              const subs = await fetchGoalSubtasks(g.id);
              subMap[g.id] = subs || [];
            }
          })
        );
        setSubtasksMap(subMap);
      }
    } catch {
      setGoals([]);
      setCategories([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalDescription('');
    setGoalCategory(categories.length > 0 ? categories[0].name : '');
    setGoalType('LONG_TERM');
    setGoalStatus('IN_PROGRESS');
    setGoalDeadline('');
    setShowGoalModal(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDescription(goal.description || '');
    setGoalCategory(goal.category || '');
    setGoalType(goal.goalType);
    setGoalStatus((goal.status as any) || 'IN_PROGRESS');
    setGoalDeadline((goal as any).deadline ? (goal as any).deadline.substring(0, 16) : '');
    setShowGoalModal(true);
  };

  const handleCreateNewCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const created = await createCategory({ name: newCatName.trim(), color: '#8B5CF6' });
      setCategories(prev => [...prev, created]);
      setGoalCategory(created.name);
      setNewCatName('');
      setShowNewCategoryInput(false);
    } catch {
      // fallback
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    if (editingGoal && editingGoal.id) {
      await updateGoal(editingGoal.id, {
        title: goalTitle,
        description: goalDescription,
        category: goalCategory,
        goalType,
        status: goalStatus,
        deadline: goalDeadline ? `${goalDeadline}:00` : undefined,
      } as any);
    } else {
      await createGoal({
        title: goalTitle,
        description: goalDescription,
        category: goalCategory,
        goalType,
        status: goalStatus,
        progressPercentage: 0,
        deadline: goalDeadline ? `${goalDeadline}:00` : undefined,
      } as any);
    }

    setShowGoalModal(false);
    loadGoals();
  };

  const handleToggleCompleteGoal = async (goal: Goal) => {
    if (!goal.id) return;
    const nextStatus = goal.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    const nextPct = nextStatus === 'COMPLETED' ? 100 : 0;

    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: nextStatus, progressPercentage: nextPct } : g));
    await updateGoal(goal.id, { status: nextStatus, progressPercentage: nextPct });
    loadGoals();
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (confirm('Move this goal and all its nested subtasks to Trash?')) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      await deleteGoal(goalId);
      loadGoals();
    }
  };

  const handleToggleSubtask = async (subtask: Task, goalId: number) => {
    if (!subtask.id) return;
    const nextStatus: Task['status'] = subtask.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    const currentSubs = subtasksMap[goalId] || [];
    const updatedSubs = currentSubs.map(st => st.id === subtask.id ? { ...st, status: nextStatus } : st);
    
    // Check if all subtasks are completed
    const allDone = updatedSubs.length > 0 && updatedSubs.every(st => st.status === 'COMPLETED');
    const newProgress = Math.round((updatedSubs.filter(st => st.status === 'COMPLETED').length / updatedSubs.length) * 100);

    setSubtasksMap(prev => ({ ...prev, [goalId]: updatedSubs }));

    if (allDone) {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'COMPLETED', progressPercentage: 100 } : g));
      await updateGoal(goalId, { status: 'COMPLETED', progressPercentage: 100 });
    } else {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progressPercentage: newProgress } : g));
      await updateGoal(goalId, { progressPercentage: newProgress });
    }

    await updateTask(subtask.id, { status: nextStatus });
    loadGoals();
  };

  const handleDeleteSubtask = async (subtaskId: number, goalId: number) => {
    setSubtasksMap(prev => ({
      ...prev,
      [goalId]: (prev[goalId] || []).filter(st => st.id !== subtaskId)
    }));
    await deleteTask(subtaskId);
    loadGoals();
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || !subtaskGoalId) return;

    await createTask({
      title: subtaskTitle,
      description: subtaskDesc,
      priority: subtaskPriority,
      goalId: subtaskGoalId,
      isGoalTaskOnly: true,
      startTime: subtaskStartTime,
      endTime: subtaskEndTime,
      dueDate: subtaskDeadline ? `${subtaskDeadline}:00` : undefined,
      estimatedMinutes: 45,
      status: 'TODO'
    } as any);

    setShowSubtaskModal(false);
    setSubtaskTitle('');
    setSubtaskDesc('');
    setSubtaskStartTime('');
    setSubtaskEndTime('');
    setSubtaskDeadline('');
    loadGoals();
  };

  // Filter goals by category
  const filteredGoals = selectedCategoryFilter === 'ALL'
    ? goals
    : goals.filter(g => g.category === selectedCategoryFilter);

  // Status Columns definitions
  const statusColumns = [
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500', borderColor: 'border-amber-400' },
    { key: 'LATER', label: 'Later', color: 'bg-blue-500', borderColor: 'border-blue-400' },
    { key: 'IN_DUE', label: 'In Due / Nearing Deadline', color: 'bg-rose-500', borderColor: 'border-rose-400' },
    { key: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500', borderColor: 'border-emerald-400' },
  ];

  // Type Columns definitions
  const typeColumns = [
    { key: 'LONG_TERM', label: 'Long-Term Vision', color: 'bg-cocoa', borderColor: 'border-cocoa' },
    { key: 'MEDIUM_TERM', label: 'Medium-Term Targets', color: 'bg-cyan-500', borderColor: 'border-cyan-400' },
    { key: 'SHORT_TERM', label: 'Short-Term Action Items', color: 'bg-emerald-500', borderColor: 'border-emerald-400' },
  ];

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-espresso flex items-center gap-2">
                <Target className="w-6 h-6 text-cocoa" />
                Goals & Milestone Kanban
              </h2>
              <p className="text-xs text-camel mt-1">
                Track long/medium/short term goals, nested subtasks, deadline dates, and custom categories.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher Toggle */}
              <div className="flex items-center bg-white border border-border p-1 rounded-2xl text-xs font-bold shadow-sm">
                <button
                  onClick={() => setViewMode('BY_STATUS')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'BY_STATUS' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'}`}
                >
                  By Status Columns
                </button>
                <button
                  onClick={() => setViewMode('BY_TYPE')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'BY_TYPE' ? 'bg-cocoa text-white' : 'text-camel hover:text-espresso'}`}
                >
                  By Goal Type
                </button>
              </div>

              <button
                onClick={handleOpenAddGoal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-cocoa text-white font-bold text-xs transition-all shadow-lg hover:bg-espresso shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Goal Milestone
              </button>
            </div>
          </div>

          {/* Category Filter Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <span className="text-xs font-bold text-camel flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter Category:
            </span>
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategoryFilter === 'ALL' ? 'bg-cocoa text-white' : 'bg-white text-camel border border-border'
              }`}
            >
              All Categories ({goals.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCategoryFilter === cat.name ? 'bg-cocoa text-white' : 'bg-white text-camel border border-border'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#8B5CF6' }} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading your goals...</div>
          ) : filteredGoals.length === 0 ? (
            <div className="coffee-card p-12 rounded-3xl text-center space-y-3">
              <Target className="w-10 h-10 text-cocoa mx-auto" />
              <h3 className="font-bold text-base text-espresso">No Goals Found</h3>
              <p className="text-xs text-camel max-w-md mx-auto">
                Create new goals with nested subtasks. When all subtasks are finished, your goal automatically moves to Completed!
              </p>
              <button
                onClick={handleOpenAddGoal}
                className="px-5 py-2.5 rounded-2xl bg-cocoa text-white font-bold text-xs hover:bg-espresso"
              >
                + Create Goal
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${viewMode === 'BY_STATUS' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
              {(viewMode === 'BY_STATUS' ? statusColumns : typeColumns).map((col) => {
                const colGoals = filteredGoals.filter(g => 
                  viewMode === 'BY_STATUS' 
                    ? (g.status || 'IN_PROGRESS') === col.key
                    : g.goalType === col.key
                );

                return (
                  <div key={col.key} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${col.color}`} />
                        <h3 className="font-bold text-sm text-espresso">{col.label}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-linen text-cocoa font-bold text-xs">
                        {colGoals.length}
                      </span>
                    </div>

                    {colGoals.map((goal) => {
                      const isCompleted = goal.status === 'COMPLETED';
                      const subtasks = subtasksMap[goal.id!] || [];
                      const isExpanded = expandedGoalId === goal.id;
                      const deadlineStr = (goal as any).deadline || goal.targetDate;

                      return (
                        <div
                          key={goal.id}
                          className={`p-4 rounded-2xl border space-y-3 transition-all ${
                            isCompleted ? 'bg-emerald-50/20 border-emerald-300/60' : 'bg-white border-border shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {goal.category && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    {goal.category}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-linen text-cocoa">
                                  {goal.goalType}
                                </span>
                              </div>
                              <h4 className={`font-semibold text-sm mt-1 ${isCompleted ? 'line-through text-gray-400' : 'text-espresso'}`}>
                                {goal.title}
                              </h4>
                              {deadlineStr && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white shadow-sm">
                                  DEADLINE: {new Date(deadlineStr).toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Actions Dropdown / Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleToggleCompleteGoal(goal)}
                                title="Mark Complete"
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                              >
                                <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-emerald-500 text-emerald-100' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleOpenEditGoal(goal)}
                                title="Edit Goal"
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGoal(goal.id!)}
                                title="Delete Goal"
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {goal.description && (
                            <p className="text-xs text-camel leading-relaxed">{goal.description}</p>
                          )}

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-camel font-semibold mb-1">
                              <span>Progress</span>
                              <span>{goal.progressPercentage || 0}% ({subtasks.filter(s => s.status === 'COMPLETED').length}/{subtasks.length} tasks)</span>
                            </div>
                            <div className="w-full bg-linen rounded-full h-2 overflow-hidden border border-border">
                              <div
                                className={`h-full rounded-full transition-all ${col.color}`}
                                style={{ width: `${goal.progressPercentage || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Nested Subtasks Expand Toggle */}
                          <div className="pt-2 border-t border-border/60">
                            <button
                              onClick={() => setExpandedGoalId(isExpanded ? null : goal.id!)}
                              className="w-full flex items-center justify-between text-xs font-semibold text-cocoa hover:text-espresso transition-colors"
                            >
                              <span>Nested Subtasks ({subtasks.length})</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Subtasks List */}
                            {isExpanded && (
                              <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                                {subtasks.map((st) => (
                                  <div
                                    key={st.id}
                                    className="p-2.5 rounded-xl bg-linen/60 border border-border/80 flex items-start justify-between text-xs gap-2"
                                  >
                                    <div className="flex items-start gap-2">
                                      <button
                                        onClick={() => handleToggleSubtask(st, goal.id!)}
                                        className="mt-0.5 text-khaki hover:text-emerald-600"
                                      >
                                        <CheckCircle2 className={`w-4 h-4 ${st.status === 'COMPLETED' ? 'fill-emerald-500 text-white' : ''}`} />
                                      </button>
                                      <div>
                                        <p className={`font-semibold ${st.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-espresso'}`}>
                                          {st.title}
                                        </p>
                                        {(st.startTime || st.endTime) && (
                                          <p className="text-[10px] text-purple-600 font-mono flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" /> {st.startTime || 'Start'} - {st.endTime || 'End'}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSubtask(st.id!, goal.id!)}
                                      className="text-gray-400 hover:text-rose-500"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  onClick={() => {
                                    setSubtaskGoalId(goal.id!);
                                    setShowSubtaskModal(true);
                                  }}
                                  className="w-full py-1.5 rounded-xl border border-dashed border-cocoa/40 text-cocoa font-semibold text-xs hover:bg-cocoa/5 transition-all flex items-center justify-center gap-1"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" /> Add Subtask
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Goal Create/Edit Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-espresso">{editingGoal ? 'Edit Goal' : 'Add Goal Milestone'}</h3>
            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-camel mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master SSC CGL Quant & Tier 2 Mock Scores"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              {/* Category Select & Create Custom Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-camel">Category Workspace</label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                    className="text-[11px] font-bold text-cocoa hover:underline"
                  >
                    {showNewCategoryInput ? 'Cancel' : '+ Add Custom Category'}
                  </button>
                </div>

                {showNewCategoryInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Web Dev, SSC, Personal)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 bg-linen border border-border rounded-xl p-2.5 text-espresso"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewCategory}
                      className="px-3 py-2.5 rounded-xl bg-cocoa text-white font-bold text-xs"
                    >
                      Save Cat
                    </button>
                  </div>
                ) : (
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-camel mb-1">Goal Type</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as any)}
                    className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                  >
                    <option value="LONG_TERM">Long-Term Vision</option>
                    <option value="MEDIUM_TERM">Medium-Term Target</option>
                    <option value="SHORT_TERM">Short-Term Action Item</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-camel mb-1">Status Column</label>
                  <select
                    value={goalStatus}
                    onChange={(e) => setGoalStatus(e.target.value as any)}
                    className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="LATER">Later</option>
                    <option value="IN_DUE">In Due / Deadline Near</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-camel mb-1">Goal Deadline (Shows as Red Pill on Calendar)</label>
                <input
                  type="datetime-local"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              <div>
                <label className="block font-semibold text-camel mb-1">Description Box</label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed notes and targets..."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subtask Add Modal */}
      {showSubtaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-espresso">Add Goal Task</h3>
            <form onSubmit={handleAddSubtask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-camel mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Subtask name..."
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-camel mb-1">Beginning Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM"
                    value={subtaskStartTime}
                    onChange={(e) => setSubtaskStartTime(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-camel mb-1">Ending Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM"
                    value={subtaskEndTime}
                    onChange={(e) => setSubtaskEndTime(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-camel mb-1">Individual Task Deadline</label>
                <input
                  type="datetime-local"
                  value={subtaskDeadline}
                  onChange={(e) => setSubtaskDeadline(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              <div>
                <label className="block font-semibold text-camel mb-1">Description Box</label>
                <textarea
                  rows={2}
                  placeholder="Subtask notes..."
                  value={subtaskDesc}
                  onChange={(e) => setSubtaskDesc(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl p-2.5 text-espresso"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubtaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
