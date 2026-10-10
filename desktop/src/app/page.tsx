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
  PlusCircle,
  Calendar,
  AlertCircle,
  CheckSquare,
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { fetchTasks, Task, updateTask, fetchAIRecommendation, AICoachResponse, fetchTestAnalyticsSummary, fetchMistakes } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendation, setRecommendation] = useState<AICoachResponse | null>(null);
  const [testSummary, setTestSummary] = useState<any>(null);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks || []);
    } catch {
      setTasks([]);
    }

    try {
      const aiRec = await fetchAIRecommendation();
      setRecommendation(aiRec);
    } catch {
      setRecommendation(null);
    }

    try {
      const sumRes = await fetchTestAnalyticsSummary();
      setTestSummary(sumRes);
    } catch {
      setTestSummary(null);
    }

    try {
      const mistakes = await fetchMistakes();
      setMistakeCount(mistakes?.length || 0);
    } catch {
      setMistakeCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Instant Task Completion Handler (Optimistic Update)
  const handleToggleTask = async (taskId: number, currentStatus: Task['status']) => {
    const nextStatus: Task['status'] = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    const prevStatus: Task['status'] = currentStatus;
    
    // Fast state update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));

    try {
      await updateTask(taskId, { status: nextStatus });
    } catch (err) {
      // Rollback if failed
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: prevStatus } : t));
    }
  };

  // Calculating Today's Breakdown
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const overdueCount = tasks.filter(t => t.status === 'IN_DUE' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED')).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const userName = user?.name || 'Simrit Garg';
  const targetGoal = user?.primaryTarget || 'SSC CGL 2027 and IT Career';

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* AI Companion Banner - Coffee Latte Theme */}
          <div className="relative overflow-hidden rounded-3xl p-6 bg-[#2C1A14] text-[#F5F1EA] shadow-xl border border-[#422A1D]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A342A]/30 via-transparent to-[#B2967D]/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#D4A373] text-[#2C1A14] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2C1A14]" /> Aira&apos;s AI Coach
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold leading-snug">
                  {recommendation?.message 
                    ? recommendation.message 
                    : tasks.length > 0 
                      ? `Welcome ${userName}! You have ${pendingCount} pending task(s) today. Ready to focus?` 
                      : `No active tasks pending! Would you like me to help you set new goals or plan tomorrow's priorities?`}
                </h2>
                <p className="text-xs text-[#D7C9B8]">
                  Active Focus Target: <span className="text-[#D4A373] font-semibold">{targetGoal}</span>
                </p>
              </div>

              <Link 
                href="/focus"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 bg-[#D4A373] hover:bg-[#C8A279] text-[#2C1A14] shrink-0 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Focus Session
              </Link>
            </div>
          </div>

          {/* Today's Breakdown Summary Strip - Coffee Latte Theme */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-[#E8E0D5] p-4 rounded-3xl shadow-sm">
            <div className="p-3 rounded-2xl bg-linen border border-khaki/50">
              <div className="flex items-center gap-2 text-xs font-bold text-espresso">
                <CheckSquare className="w-4 h-4 text-cocoa" /> Total Tasks
              </div>
              <p className="text-xl font-extrabold text-espresso mt-1">{totalCount}</p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
              </div>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">{completedCount}</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" /> Pending
              </div>
              <p className="text-xl font-extrabold text-amber-700 mt-1">{pendingCount}</p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Overdue (In Due)
              </div>
              <p className="text-xl font-extrabold text-rose-700 mt-1">{overdueCount}</p>
            </div>
          </div>

          {/* Core Command Metrics Grid - User Scoped Coffee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SSC CGL Progress */}
            <Link href="/goals" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">SSC CGL Progress</span>
                  <h3 className="text-2xl font-extrabold text-cocoa mt-1">
                    {completionPercentage}%
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-cocoa/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-cocoa" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Syllabus & Topic Tracking</p>
            </Link>

            {/* IT & Dev Goals */}
            <Link href="/goals" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">IT & Dev Goals</span>
                  <h3 className="text-2xl font-extrabold text-cocoa mt-1">
                    {tasks.filter(t => t.goalId).length} Done
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Coding & System Design</p>
            </Link>

            {/* Avg Mock Score - User Scoped */}
            <Link href="/test-series" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">Avg Mock Score</span>
                  <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {testSummary?.averageScore !== undefined ? testSummary.averageScore : 0}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">
                {testSummary?.totalAttempts ? `${testSummary.totalAttempts} Tests Recorded` : '0 Tests Recorded'}
              </p>
            </Link>

            {/* Mistake Bank Items - User Scoped */}
            <Link href="/mistakes" className="coffee-card p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-camel">Mistake Bank</span>
                  <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
                    {mistakeCount} Qs
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-rose-500" />
                </div>
              </div>
              <p className="text-[11px] text-camel mt-2 font-medium">Question Error Log</p>
            </Link>
          </div>

          {/* Quick Action Dock */}
          <div className="coffee-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-espresso flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-camel" /> Quick Actions:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto w-full custom-scrollbar pb-1 sm:pb-0">
              <Link href="/tasks" className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-semibold hover:bg-purple-100 transition-colors whitespace-nowrap flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Add Task
              </Link>
              <Link href="/goals" className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold hover:bg-amber-100 transition-colors whitespace-nowrap flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Set Goal
              </Link>
              <Link href="/calendar" className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Live Calendar
              </Link>
              <Link href="/test-series" className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap">
                + Add Test Score
              </Link>
            </div>
          </div>

          {/* Today's Preparation Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-espresso flex items-center gap-2">
                <Clock className="w-5 h-5 text-cocoa" />
                Today&apos;s Preparation Schedule
              </h3>
              <Link href="/tasks" className="text-xs font-semibold text-cocoa hover:text-espresso flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Manage Tasks
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-camel">Loading schedule...</div>
            ) : tasks.length === 0 ? (
              <div className="coffee-card p-8 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-linen flex items-center justify-center mx-auto text-cocoa">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-espresso">No tasks scheduled for today</h4>
                <p className="text-xs text-camel max-w-sm mx-auto">
                  Add your daily tasks or goals. Mark them complete when finished to increase your progress!
                </p>
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cocoa text-white font-semibold text-xs hover:bg-espresso transition-all shadow-md"
                >
                  <PlusCircle className="w-4 h-4" /> Create First Task
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {tasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  return (
                    <div
                      key={task.id}
                      className={`coffee-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl gap-3 transition-all ${
                        isCompleted ? 'opacity-70 bg-linen/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={() => handleToggleTask(task.id!, task.status)}
                          className="text-khaki hover:text-cocoa transition-colors focus:outline-none"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-khaki hover:border-cocoa transition-colors" />
                          )}
                        </button>
                        <div>
                          <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through text-camel' : 'text-espresso'}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-camel mt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                            </span>
                            {task.startTime && (
                              <span className="text-[11px] font-medium text-cocoa">
                                {task.startTime} - {task.endTime || 'End'}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.priority === 'URGENT' 
                                ? 'bg-rose-50 text-rose-600' 
                                : task.priority === 'HIGH'
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-linen text-cocoa'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Link 
                          href="/focus"
                          className="text-xs font-bold px-4 py-2 rounded-xl transition-all bg-cocoa/10 text-cocoa hover:bg-cocoa hover:text-white"
                        >
                          Start Session
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
