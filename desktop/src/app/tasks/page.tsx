'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { CheckSquare, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchTasks, createTask, updateTask, Task } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [estimatedMinutes, setEstimatedMinutes] = useState('45');

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      if (data.length === 0) {
        setTasks([
          { id: 1, title: 'Quant: Master Profit & Loss Dishonest Shopkeeper Tricks', priority: 'URGENT', estimatedMinutes: 45, status: 'TODO', isTopPriority: true },
          { id: 2, title: 'Java: Implement Spring Security 6 & JWT Architecture', priority: 'HIGH', estimatedMinutes: 60, status: 'TODO' },
          { id: 3, title: 'Solve 2 LeetCode Medium DSA Problems', priority: 'HIGH', estimatedMinutes: 45, status: 'COMPLETED' },
          { id: 4, title: 'Drink Water & Stretch Break', priority: 'MEDIUM', estimatedMinutes: 5, status: 'COMPLETED' },
        ]);
      } else {
        setTasks(data);
      }
    } catch {
      setTasks([
        { id: 1, title: 'Quant: Master Profit & Loss Dishonest Shopkeeper Tricks', priority: 'URGENT', estimatedMinutes: 45, status: 'TODO', isTopPriority: true },
      ]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask: Task = { title, priority, estimatedMinutes: parseInt(estimatedMinutes) || 30, status: 'TODO' };
    try {
      await createTask(newTask);
      loadTasks();
      setShowAddModal(false);
      setTitle('');
    } catch {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    if (!task.id) return;
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      await updateTask(task.id, { status: newStatus });
      loadTasks();
    } catch {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cocoa" />
                Task Planner & Schedule
              </h2>
              <p className="text-xs text-camel mt-1">
                Manage daily study tasks, track estimated completion times, and set top priorities.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-soft active:scale-95 bg-cocoa text-white hover:bg-espresso"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="coffee-card flex items-center justify-between p-4 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggleStatus(task)}
                    className="text-khaki hover:text-cocoa transition-colors"
                  >
                    {task.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-khaki" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-sm font-semibold ${task.status === 'COMPLETED' ? 'line-through text-khaki' : 'text-espresso'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-camel mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' : 
                        task.priority === 'HIGH' ? 'bg-orange-50 text-orange-600' : 'bg-coffee-100 text-cocoa'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                  task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-coffee-100 text-camel'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl border border-border bg-white shadow-strong space-y-5">
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
