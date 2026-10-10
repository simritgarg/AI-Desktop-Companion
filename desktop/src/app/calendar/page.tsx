'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Target, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { fetchTasks, fetchGoals, Task, Goal, createTask } from '@/lib/api';

export default function CalendarPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state for selected date
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, gList] = await Promise.all([fetchTasks(), fetchGoals()]);
      setTasks(tList || []);
      setGoals(gList || []);
    } catch {
      setTasks([]);
      setGoals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (dayNum: number) => {
    return (
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (dayNum: number) => {
    return (
      selectedDate.getDate() === dayNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  // Helper to format date string to YYYY-MM-DD
  const formatDateKey = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get items for a day
  const getItemsForDay = (dayNum: number) => {
    const dateKey = formatDateKey(year, month, dayNum);
    const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateKey));
    const dayGoals = goals.filter(g => {
      const target = g.targetDate || (g as any).deadline;
      return target && target.startsWith(dateKey);
    });
    return { dayTasks, dayGoals };
  };

  const handleCreateTaskForDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const dateStr = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    await createTask({
      title: newTaskTitle,
      dueDate: `${dateStr}T10:00:00`,
      priority: 'MEDIUM',
      estimatedMinutes: 30,
      status: 'TODO'
    });

    setNewTaskTitle('');
    setShowAddModal(false);
    loadData();
  };

  const selectedItems = getItemsForDay(selectedDate.getDate());

  return (
    <div className="flex min-h-screen bg-linen/30 font-sans">
      <Sidebar isOpenMobile={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900 border border-gray-800 p-6 rounded-3xl text-white shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
                <CalendarIcon className="w-4 h-4" /> Live System Calendar
              </div>
              <h1 className="text-2xl font-extrabold">{monthNames[month]} {year}</h1>
              <p className="text-xs text-gray-400 mt-1">Today is {today.toDateString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-800/80 p-1.5 rounded-2xl border border-gray-700">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold px-3 text-gray-200">{monthNames[month]}</span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
              >
                Today
              </button>
            </div>
          </div>

          {/* Calendar Grid & Side Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 p-5 rounded-3xl shadow-xl">
              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center font-bold text-xs text-gray-400 pb-3 border-b border-gray-800 mb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs">
                {/* Previous month filler days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`prev-${i}`} className="h-16 sm:h-20 p-1.5 rounded-2xl text-gray-700 opacity-40 font-mono">
                    {prevMonthDays - firstDayOfMonth + i + 1}
                  </div>
                ))}

                {/* Current Month Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const { dayTasks, dayGoals } = getItemsForDay(dayNum);
                  const activeToday = isToday(dayNum);
                  const activeSelected = isSelected(dayNum);

                  return (
                    <div
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedDate(new Date(year, month, dayNum))}
                      className={`h-16 sm:h-20 p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        activeSelected
                          ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50 shadow-lg'
                          : activeToday
                            ? 'border-amber-500/60 bg-amber-500/10'
                            : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold font-mono text-xs ${activeToday ? 'text-amber-400 font-extrabold' : 'text-gray-300'}`}>
                          {dayNum}
                        </span>
                        {activeToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>

                      {/* Items Badges */}
                      <div className="space-y-1 overflow-hidden">
                        {/* RED Goal Deadline Pill */}
                        {dayGoals.map(g => (
                          <div
                            key={`g-${g.id}`}
                            className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white truncate shadow-sm flex items-center gap-1"
                            title={`GOAL DEADLINE: ${g.title}`}
                          >
                            <Target className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{g.title}</span>
                          </div>
                        ))}

                        {/* Task Pills */}
                        {dayTasks.map(t => (
                          <div
                            key={`t-${t.id}`}
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/30 text-purple-200 border border-purple-500/40 truncate"
                            title={`Task: ${t.title}`}
                          >
                            {t.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Schedule & Action Panel */}
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-100">
                      {selectedDate.toDateString()}
                    </h3>
                    <p className="text-xs text-purple-400">Scheduled Agenda</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Item
                  </button>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                  {selectedItems.dayGoals.length === 0 && selectedItems.dayTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 space-y-2">
                      <CalendarIcon className="w-6 h-6 mx-auto text-gray-600" />
                      <p>No goals or tasks scheduled on this day.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="text-purple-400 font-semibold hover:underline"
                      >
                        + Add a task for this date
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Red Goal Deadline Pills */}
                      {selectedItems.dayGoals.map(goal => (
                        <div key={`sel-g-${goal.id}`} className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200">
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[10px]">
                              GOAL DEADLINE
                            </span>
                            <span>{goal.title}</span>
                          </div>
                          {goal.description && <p className="text-xs text-rose-300/80 mt-1">{goal.description}</p>}
                        </div>
                      ))}

                      {/* Tasks */}
                      {selectedItems.dayTasks.map(task => (
                        <div key={`sel-t-${task.id}`} className="p-3.5 rounded-2xl bg-gray-800/60 border border-gray-700/60 text-gray-200">
                          <div className="flex items-center justify-between font-semibold text-xs">
                            <span className="flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-purple-400" />
                              {task.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-gray-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-base text-gray-100 mb-1">Add Task for {selectedDate.toDateString()}</h3>
              <p className="text-xs text-gray-400 mb-4">Task will be scheduled directly on this date.</p>

              <form onSubmit={handleCreateTaskForDate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-purple-500"
                  required
                />
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
