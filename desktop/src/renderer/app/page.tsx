'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Play, CheckCircle, Clock, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { fetchTasks, Task, fetchAIRecommendation, AICoachResponse } from '@/lib/api';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendation, setRecommendation] = useState<AICoachResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        const aiRec = await fetchAIRecommendation();
        setRecommendation(aiRec);
      } catch {
        // Fallback demo tasks
        setTasks([
          { id: 1, title: 'Master Java Spring Boot Security & JWT', priority: 'URGENT', estimatedMinutes: 60, status: 'TODO', isTopPriority: true },
          { id: 2, title: 'Solve 2 LeetCode Medium DSA Problems', priority: 'HIGH', estimatedMinutes: 45, status: 'TODO' },
          { id: 3, title: 'Drink Water & Stretch', priority: 'MEDIUM', estimatedMinutes: 5, status: 'COMPLETED' },
        ]);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* AI Companion Recommendation Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-card border border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Aria's Recommendation
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {recommendation ? recommendation.message : "Your highest value task right now is Spring Boot Security. Let's do a 45-minute focus session!"}
                </h2>
                <p className="text-xs text-gray-300">
                  Aligned with your career goal: <span className="text-purple-300 font-semibold">Become a Senior Engineer</span>
                </p>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30">
                <Play className="w-4 h-4 fill-white" />
                Start Focus Session
              </button>
            </div>
          </div>

          {/* Quick Action Button: "What Should I Do Now?" */}
          <div className="flex items-center justify-between bg-card/60 border border-border p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-sm text-gray-200">Indecisive or overwhelmed?</h3>
                <p className="text-xs text-gray-400">Let Aria evaluate your goals and deadlines to prioritize your next action.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/40 text-xs font-semibold transition-all">
              What Should I Do Now?
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today's Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Today's Priorities</h3>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-card/50 border border-border/80 rounded-xl hover:border-purple-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <button className="text-gray-500 hover:text-purple-400 transition-colors">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-purple-400" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" /> {task.estimatedMinutes} mins
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          task.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-purple-600/30 text-gray-300 hover:text-purple-200 transition-all border border-border">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
