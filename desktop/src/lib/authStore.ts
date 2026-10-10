import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  primaryTarget?: string;
  xp?: number;
  level?: number;
  streakDays?: number;
  companionName?: string;
  accountabilityMode?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, primaryTarget?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('companion_auth_token') : null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const data = res.data;

      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('companion_auth_token', data.token);
          localStorage.setItem('companion_auth_login_timestamp', Date.now().toString());
        }
        const user: UserProfile = {
          id: data.userId,
          name: data.name,
          email: data.email,
          primaryTarget: data.primaryTarget,
          xp: data.xp,
          level: data.level,
          streakDays: data.streakDays,
          companionName: data.companionName,
          accountabilityMode: data.accountabilityMode
        };
        set({
          user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return { success: true, message: data.message || 'Login successful' };
      } else {
        const errorMsg = data.message || 'Wrong email or password';
        set({ isLoading: false, error: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Wrong email or password. Please try again.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  register: async (name, email, password, primaryTarget) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        primaryTarget: primaryTarget || 'General Productivity'
      });
      const data = res.data;

      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('companion_auth_token', data.token);
          localStorage.setItem('companion_auth_login_timestamp', Date.now().toString());
        }
        const user: UserProfile = {
          id: data.userId,
          name: data.name,
          email: data.email,
          primaryTarget: data.primaryTarget,
          xp: data.xp,
          level: data.level,
          streakDays: data.streakDays,
          companionName: data.companionName,
          accountabilityMode: data.accountabilityMode
        };
        set({
          user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return { success: true, message: data.message || 'Registration successful' };
      } else {
        const errorMsg = data.message || 'Registration failed. Email might already exist.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'An account with this email already exists or invalid data.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('companion_auth_token');
      localStorage.removeItem('companion_auth_login_timestamp');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('companion_auth_token') : null;
    const loginTimeStr = typeof window !== 'undefined' ? localStorage.getItem('companion_auth_login_timestamp') : null;

    if (!token) {
      set({ isAuthenticated: false, isLoading: false, user: null });
      return;
    }

    // Check 24 hour session expiration
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      if (Date.now() - loginTime > TWENTY_FOUR_HOURS) {
        get().logout();
        return;
      }
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      if (data.userId) {
        const user: UserProfile = {
          id: data.userId,
          name: data.name,
          email: data.email,
          primaryTarget: data.primaryTarget,
          xp: data.xp,
          level: data.level,
          streakDays: data.streakDays,
          companionName: data.companionName,
          accountabilityMode: data.accountabilityMode
        };
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        get().logout();
      }
    } catch (err) {
      get().logout();
    }
  },

  clearError: () => set({ error: null })
}));
