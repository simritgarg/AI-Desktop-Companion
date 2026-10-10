'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  HeartHandshake, 
  Target, 
  Coffee,
  CheckSquare,
  Flame,
  Plus,
  Globe,
  Briefcase,
  UserPlus,
  Trash2,
  BarChart2,
  X
} from 'lucide-react';
import { useUserStore } from '@/lib/userStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { customWorkspaces, addWorkspace, deleteWorkspace, profile, registerNewUser } = useUserStore();

  // Modals state
  const [showAddWsModal, setShowAddWsModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // New Workspace form state
  const [wsName, setWsName] = useState('');
  const [wsCategory, setWsCategory] = useState<'GOVERNMENT' | 'ENGINEERING' | 'CORPORATE' | 'MANAGEMENT' | 'OTHER'>('GOVERNMENT');
  const [wsTargetExam, setWsTargetExam] = useState('');
  const [wsTargetGoal, setWsTargetGoal] = useState('');

  // User Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGoal, setRegGoal] = useState('');

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;

    const created = addWorkspace({
      name: wsName,
      category: wsCategory,
      targetExam: wsTargetExam || wsName,
      targetGoal: wsTargetGoal || 'Mastery Track',
      color: wsCategory === 'GOVERNMENT' ? 'bg-amber-600' : wsCategory === 'ENGINEERING' ? 'bg-blue-600' : 'bg-emerald-600',
    });

    setWsName('');
    setWsTargetExam('');
    setWsTargetGoal('');
    setShowAddWsModal(false);
    router.push(`/workspace/${created.id}`);
  };

  const handleDeleteWorkspaceDirect = (e: React.MouseEvent, wsId: string, wsName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the "${wsName}" workspace?`)) {
      deleteWorkspace(wsId);
      if (pathname === `/workspace/${wsId}`) {
        router.push('/');
      }
    }
  };

  const handleRegisterNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;
    registerNewUser(regName, regEmail, regGoal || 'Career Aspirant Track');
    setShowUserModal(false);
    setRegName('');
    setRegEmail('');
    setRegGoal('');
  };

  return (
    <>
      <aside className="w-64 min-h-screen flex flex-col justify-between bg-espresso text-coffee-100 border-r border-coffee-900/40">
        <div className="space-y-3 p-4">
          {/* App Header & User Account Info */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-cocoa/40 border border-cocoa/30">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-camel text-espresso shadow-md font-bold text-lg">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-xs text-coffee-100 truncate">
                  {profile.name}
                </h1>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="text-[10px] text-camel hover:underline flex items-center gap-0.5"
                  title="Register new user or start from 0"
                >
                  <UserPlus className="w-3 h-3" /> New
                </button>
              </div>
              <p className="text-[10px] font-medium text-camel/90 truncate">
                Day {profile.currentDay || 1} • {profile.primaryTarget}
              </p>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4 max-h-[calc(100vh-190px)] overflow-y-auto pr-1 custom-scrollbar text-xs">
            {/* Section 1: Command Centre (Dashboard, Task Planner, Goals, Habit & Streaks, Calendar, Motivation and Vision) */}
            <div className="space-y-0.5">
              <h2 className="px-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-camel/80">
                Command Centre
              </h2>

              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-camel" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/tasks"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/tasks'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-camel/70" />
                <span>Task Planner</span>
              </Link>

              <Link
                href="/goals"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/goals'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <Target className="w-4 h-4 text-camel/70" />
                <span>Goals</span>
              </Link>

              <Link
                href="/habits"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/habits'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Habit & Streaks</span>
              </Link>

              <Link
                href="/calendar"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/calendar'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-camel/70" />
                <span>Calendar</span>
              </Link>

              <Link
                href="/motivation"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/motivation'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-camel/70" />
                <span>Motivation and Vision</span>
              </Link>
            </div>

            {/* Section 2: Career Workspace */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between px-3 pt-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-camel/80">
                  Career Workspace
                </h2>
                <button
                  onClick={() => setShowAddWsModal(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-camel/20 hover:bg-camel/40 text-[10px] font-bold text-camel transition-colors"
                  title="Add another career workspace"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {/* Dynamic Workspaces */}
              {customWorkspaces.map((ws) => (
                <div key={ws.id} className="group relative flex items-center">
                  <Link
                    href={`/workspace/${ws.id}`}
                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                      pathname === `/workspace/${ws.id}`
                        ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                        : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-camel/60 flex-shrink-0" />
                    <span className="truncate pr-4">{ws.name}</span>
                  </Link>

                  <button
                    onClick={(e) => handleDeleteWorkspaceDirect(e, ws.id, ws.name)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-khaki hover:text-rose-400 transition-all"
                    title={`Delete ${ws.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowAddWsModal(true)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-camel/70 hover:bg-cocoa/20 hover:text-camel border border-dashed border-camel/20 transition-all text-xs font-semibold mt-1"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Career Workspace</span>
              </button>
            </div>

            {/* Section 3: Analysis Section (SSC CGL & LeetCode External Coding Platforms) */}
            <div className="space-y-0.5">
              <h2 className="px-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-camel/80">
                Analysis Section
              </h2>

              <Link
                href="/test-series"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/test-series'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-camel/80" />
                <span>SSC Analytics & Mocks</span>
              </Link>

              <Link
                href="/coding-platforms"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                  pathname === '/coding-platforms'
                    ? 'bg-camel/30 text-coffee-100 border border-camel/40 shadow-sm'
                    : 'text-coffee-300 hover:bg-cocoa/30 hover:text-coffee-100'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <div className="flex-1 flex items-center justify-between">
                  <span>LeetCode & Stats</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono">Sync</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cocoa/30">
          <div className="px-3 py-2 rounded-xl bg-cocoa/20 text-xs">
            <p className="text-[11px] font-semibold text-camel flex items-center justify-between">
              <span>☕ Coffee Latte Theme</span>
              <span className="font-mono text-[9px] text-camel/70">Day {profile.currentDay}</span>
            </p>
            <p className="text-[10px] text-coffee-300/70 mt-0.5">Warm, focused & productive</p>
          </div>
        </div>
      </aside>

      {/* Modal 1: Add Career Workspace Modal */}
      {showAddWsModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2 text-espresso">
                <Briefcase className="w-5 h-5 text-cocoa" /> Create New Career Workspace
              </h3>
              <button onClick={() => setShowAddWsModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Workspace Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSC CGL Prep, IT & Web Engineering, UPSC CSE"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Category / Field</label>
                <select
                  value={wsCategory}
                  onChange={(e) => setWsCategory(e.target.value as any)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                >
                  <option value="GOVERNMENT">Government Exam (SSC, UPSC, Bank, Railway)</option>
                  <option value="ENGINEERING">Software Engineering & Tech Track</option>
                  <option value="CORPORATE">Management & Corporate Career</option>
                  <option value="MANAGEMENT">Higher Studies / MBA Prep</option>
                  <option value="OTHER">Custom Career Goal</option>
                </select>
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Target Exam or Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 Tier 1 & 2 / Senior Full Stack Dev"
                  value={wsTargetExam}
                  onChange={(e) => setWsTargetExam(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Key Milestone / Target Score</label>
                <input
                  type="text"
                  placeholder="e.g. 160+ Marks / Master System Design & Microservices"
                  value={wsTargetGoal}
                  onChange={(e) => setWsTargetGoal(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddWsModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  + Add Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Register New User */}
      {showUserModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-border text-espresso shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2 text-espresso">
                <UserPlus className="w-5 h-5 text-cocoa" /> Register New Aspirant Account
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-khaki hover:text-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-camel leading-relaxed">
              Registering a new account will start progress strictly from <strong>Day 1 (0% completed)</strong> for a fresh user. If an existing user logs in, progress resumes automatically from where they left off!
            </p>

            <form onSubmit={handleRegisterNewUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-camel font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Simrit Garg"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. simrit@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div>
                <label className="block text-camel font-bold mb-1">Primary Preparation Target</label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 & Senior Backend Dev"
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value)}
                  className="w-full bg-linen border border-border rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-cocoa"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-linen text-cocoa font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cocoa text-white font-bold shadow-md hover:bg-espresso transition-colors"
                >
                  Start Fresh (Day 1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
