import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CareerWorkspace {
  id: string;
  name: string;
  category: 'GOVERNMENT' | 'ENGINEERING' | 'CORPORATE' | 'MANAGEMENT' | 'OTHER';
  targetExam?: string;
  targetDate?: string;
  targetGoal?: string;
  iconName?: string;
  color?: string;
  createdAt: string;
  progressPercent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  primaryTarget: string;
  registeredAt: string;
  currentDay: number;
  totalDaysGoal: number;
  streakCount: number;
  xpPoints: number;
  level: number;
  isRegistered: boolean;
}

interface UserState {
  profile: UserProfile;
  customWorkspaces: CareerWorkspace[];
  
  // Account operations
  registerNewUser: (name: string, email: string, targetExam: string) => void;
  startFreshFromZero: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  advanceDay: () => void;
  addXP: (amount: number) => void;
  
  // Workspace operations
  addWorkspace: (workspace: Omit<CareerWorkspace, 'id' | 'createdAt' | 'progressPercent'>) => CareerWorkspace;
  deleteWorkspace: (id: string) => void;
  updateWorkspaceProgress: (id: string, percent: number) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Aspirant User',
  email: 'user@example.com',
  primaryTarget: 'SSC CGL & Software Developer Track',
  registeredAt: new Date().toISOString(),
  currentDay: 1, // Starts at Day 1 / zero for new users
  totalDaysGoal: 90,
  streakCount: 1,
  xpPoints: 0,
  level: 1,
  isRegistered: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      customWorkspaces: [
        {
          id: 'ws_upsc',
          name: 'UPSC CSE Prep',
          category: 'GOVERNMENT',
          targetExam: 'UPSC CSE 2026',
          targetDate: '2026-05-24',
          targetGoal: 'IAS / IFS Officer Track',
          color: 'bg-amber-600',
          createdAt: new Date().toISOString(),
          progressPercent: 0,
        },
        {
          id: 'ws_gate',
          name: 'GATE CSE & PSU Workspace',
          category: 'ENGINEERING',
          targetExam: 'GATE 2026',
          targetDate: '2026-02-08',
          targetGoal: 'M.Tech IIT / PSU Recruitment',
          color: 'bg-indigo-600',
          createdAt: new Date().toISOString(),
          progressPercent: 0,
        }
      ],

      registerNewUser: (name: string, email: string, targetExam: string) => {
        const newProfile: UserProfile = {
          id: `user_${Date.now()}`,
          name: name || 'New Aspirant',
          email: email || 'aspirant@example.com',
          primaryTarget: targetExam || 'Custom Career Goal',
          registeredAt: new Date().toISOString(),
          currentDay: 1, // New user starts strictly from Day 1 / Zero
          totalDaysGoal: 90,
          streakCount: 0,
          xpPoints: 0,
          level: 1,
          isRegistered: true,
        };
        set({ profile: newProfile });
      },

      startFreshFromZero: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            currentDay: 1,
            streakCount: 0,
            xpPoints: 0,
            level: 1,
          },
        }));
      },

      updateProfile: (partial) => {
        set((state) => ({
          profile: { ...state.profile, ...partial },
        }));
      },

      advanceDay: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            currentDay: state.profile.currentDay + 1,
            streakCount: state.profile.streakCount + 1,
            xpPoints: state.profile.xpPoints + 100,
          },
        }));
      },

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.profile.xpPoints + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          return {
            profile: {
              ...state.profile,
              xpPoints: newXP,
              level: newLevel,
            },
          };
        });
      },

      addWorkspace: (workspaceData) => {
        const newWs: CareerWorkspace = {
          ...workspaceData,
          id: `ws_${Date.now()}`,
          createdAt: new Date().toISOString(),
          progressPercent: 0,
        };
        set((state) => ({
          customWorkspaces: [...state.customWorkspaces, newWs],
        }));
        return newWs;
      },

      deleteWorkspace: (id: string) => {
        set((state) => ({
          customWorkspaces: state.customWorkspaces.filter((w) => w.id !== id),
        }));
      },

      updateWorkspaceProgress: (id: string, percent: number) => {
        set((state) => ({
          customWorkspaces: state.customWorkspaces.map((w) =>
            w.id === id ? { ...w, progressPercent: percent } : w
          ),
        }));
      },
    }),
    {
      name: 'user_career_companion_store',
    }
  )
);
