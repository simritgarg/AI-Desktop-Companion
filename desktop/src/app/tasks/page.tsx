'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { CheckSquare, Plus, Clock, CheckCircle2, Trash2, Tag } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask, fetchCategories, Task, UserCategory } from '@/lib/api';

export default function TasksPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [estimatedMinutes, setEstimatedMinutes] = useState('45');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const loadData = async () => {
    try {
      const [data, cats] = await Promise.all([fetchTasks(), fetchCategories()]);
      setTasks(data || []);
      setCategories(cats || []);
    } catch {
      setTasks([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = { 
      title, 
      priority, 
      category: selectedCategory || undefined,
      estimatedMinutes: parseInt(estimatedMinutes) || 30, 
      status: 'TODO' 
    };

    try {
      await createTask(newTask);
      loadData();
      setShowAddModal(false);
      setTitle('');
      setSelectedCategory('');
    } catch {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    if (!task.id) return;
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      await updateTask(task.id, { status: newStatus });
      loadData();
    } catch {
      // optimistic update retained
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await deleteTask(taskId);
      loadData();
    } catch {
      // fallback
    }
  };

  const filteredTasks = activeCategoryFilter === 'ALL' 
    ? tasks 
    : tasks.filter(t => t.category === activeCategoryFilter);

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cocoa" />
                Task Planner & Schedule
              </h2>
              <p className="text-xs text-camel mt-1">
                Manage daily study tasks, categorize items, track estimates, and clean up completed tasks.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-soft bg-cocoa text-white hover:bg-espresso shrink-0"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-cocoa text-white shadow-sm'
                  : 'bg-white text-camel border border-border hover:bg-linen'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            {categories.map((cat) => {
              const count = tasks.filter(t => t.category === cat.name).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    activeCategoryFilter === cat.name
                      ? 'bg-cocoa text-white shadow-sm'
                      : 'bg-white text-camel border border-border hover:bg-linen'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#8B5CF6' }} />
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="coffee-card p-12 rounded-3xl text-center space-y-3">
              <CheckSquare className="w-10 h-10 text-cocoa mx-auto" />
              <h3 className="font-bold text-base text-espresso">No Tasks Found</h3>
              <p className="text-xs text-camel">Add tasks for your study plan or daily goals.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-cocoa text-white font-bold text-xs hover:bg-espresso"
              >
                + Add Task Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="coffee-card flex items-center justify-between p-4 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleStatus(task)}
                      className="text-khaki hover:text-cocoa transition-colors"
                    >
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-khaki hover:border-cocoa" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-espresso'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-camel mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' : 
                          task.priority === 'HIGH' ? 'bg-orange-50 text-orange-600' : 'bg-coffee-100 text-cocoa'
                        }`}>
                          {task.priority}
                        </span>
                        {task.category && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                      task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-coffee-100 text-camel'
                    }`}>
                      {task.status}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id!)}
                      title="Delete Task"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl border border-border bg-white shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-espresso">Create Study Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-camel font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quant: Complete 40 Geometry MCQs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2.5 text-espresso placeholder:text-camel/50 focus:outline-none focus:ring-2 focus:ring-cocoa/30 focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-semibold mb-1">Category Tag</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2.5 text-espresso focus:outline-none focus:ring-2 focus:ring-cocoa/30"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-camel font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2.5 text-espresso focus:outline-none focus:ring-2 focus:ring-cocoa/30"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-camel font-semibold mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    className="w-full bg-linen border border-border rounded-xl px-3 py-2.5 text-espresso font-mono focus:outline-none focus:ring-2 focus:ring-cocoa/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-camel font-semibold hover:bg-khaki/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold hover:bg-espresso transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
