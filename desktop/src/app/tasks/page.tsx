'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { CheckSquare, Plus, Clock } from 'lucide-react';
import { Task } from '@/lib/api';

export default function TasksPage() {
  const [tasks] = useState<Task[]>([
    { id: 1, title: 'Master Java Spring Boot Security & JWT', priority: 'URGENT', estimatedMinutes: 60, status: 'TODO', isTopPriority: true },
    { id: 2, title: 'Solve 2 LeetCode Medium DSA Problems', priority: 'HIGH', estimatedMinutes: 45, status: 'TODO' },
    { id: 3, title: 'Build Electron Transparent Desktop Overlay', priority: 'HIGH', estimatedMinutes: 45, status: 'COMPLETED' },
    { id: 4, title: 'Drink Water & Stretch', priority: 'MEDIUM', estimatedMinutes: 5, status: 'COMPLETED' },
  ]);

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-purple-400" />
                Task Planner & Schedule
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Manage actionable tasks, track estimated completion times, and set daily top priorities.
              </p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20">
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-card/60 border border-border rounded-xl">
                <div>
                  <h4 className={`text-sm font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      task.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
