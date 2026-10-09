'use client';

// SSC CGL & IT Career Command Centre Main Dashboard
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  GraduationCap, 
  Code, 
  FileCheck2, 
  AlertOctagon, 
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useCompanionStore } from '@/lib/store';
import { fetchTasks, Task, fetchAIRecommendation, AICoachResponse, fetchTestAnalyticsSummary } from '@/lib/api';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendation, setRecommendation] = useState<AICoachResponse | null>(null);
  const [testSummary, setTestSummary] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        const aiRec = await fetchAIRecommendation();
        setRecommendation(aiRec);
        const sumRes = await fetchTestAnalyticsSummary();
        setTestSummary(sumRes);
      } catch {
        setTasks([
          { id: 1, title: 'Quant: Master Profit & Loss Dishonest Shopkeeper Tricks', priority: 'URGENT', estimatedMinutes: 45, status: 'TODO', isTopPriority: true },
          { id: 2, title: 'Java: Implement Spring Security & JWT Filter Chain', priority: 'HIGH', estimatedMinutes: 60, status: 'TODO' },
          { id: 3, title: 'Mock Test: Oliveboard Full Test #06 Attempt & Analysis', priority: 'HIGH', estimatedMinutes: 60, status: 'TODO' },
        ]);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* AI Companion Recommendation Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 bg-espresso text-coffee-100 shadow-strong">
            <div className="absolute inset-0 bg-gradient-to-br from-cocoa/20 via-transparent to-camel/10" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-camel text-espresso">
                    ✨ Aira's AI Preparation Coach
                  </span>
                </div>
                <h2 className="text-lg font-bold leading-snug">
                  {recommendation ? recommendation.message : "Your highest value task right now is Profit & Loss Dishonest Shopkeeper problems. Let me guide your 45-minute focus session!"}
                </h2>
                <p className="text-xs text-camel/80">
                  Target: <span className="text-camel font-semibold">SSC CGL 2026 Tier 1 & 2 + Senior Backend Developer Track</span>
                </p>
              </div>

              <Link 
                href="/focus"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 bg-camel hover:bg-coffee-400 text-espresso"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Focus Session
              </Link>
            </div>
          </div>

          {/* Core Command Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* SSC CGL Progress */}
            <Link href="/ssc-cgl" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">SSC CGL Progress</span>
                  <h3 className="text-2xl font-extrabold text-cocoa mt-1">72%</h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-cocoa/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-cocoa" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Quant & Reasoning High Mastery</p>
            </Link>

            {/* IT Career Prep */}
            <Link href="/it-career" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">IT Career Prep</span>
                  <h3 className="text-2xl font-extrabold text-cocoa mt-1">85%</h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Java Spring Boot & Next.js</p>
            </Link>

            {/* Avg Mock Score */}
            <Link href="/test-series" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">Avg Mock Score</span>
                  <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {testSummary?.averageScore || 151.2}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Oliveboard, Testbook & Adda247</p>
            </Link>

            {/* Mistake Bank Items */}
            <Link href="/mistakes" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">Mistake Bank</span>
                  <h3 className="text-2xl font-extrabold text-rose-600 mt-1">14 Qs</h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-rose-500" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Conceptual & Calculation errors</p>
            </Link>
          </div>

          {/* Quick Action Dock */}
          <div className="coffee-card p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-espresso flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-camel" /> Quick Command Actions:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
              <Link href="/test-series" className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap">
                + Add Test Score
              </Link>
              <Link href="/ssc-cgl" className="px-3 py-1.5 rounded-xl bg-cocoa/5 text-cocoa border border-cocoa/15 font-semibold hover:bg-cocoa/10 transition-colors whitespace-nowrap">
                + Add Syllabus Topic
              </Link>
              <Link href="/mistakes" className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 transition-colors whitespace-nowrap">
                + Log Mistake
              </Link>
              <Link href="/diary" className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap">
                + Write Diary Reflection
              </Link>
            </div>
          </div>

          {/* Today's Prioritized Preparation Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-espresso flex items-center gap-2">
                <Clock className="w-5 h-5 text-cocoa" />
                Today&apos;s Prioritized Preparation Schedule
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="coffee-card flex items-center justify-between p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-3.5">
                    <button className="text-khaki hover:text-cocoa transition-colors">
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
                          task.priority === 'URGENT' 
                            ? 'bg-rose-50 text-rose-600' 
                            : task.priority === 'HIGH'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-coffee-100 text-cocoa'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href="/focus"
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all bg-cocoa/10 text-cocoa hover:bg-cocoa hover:text-white"
                  >
                    Start Session
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
