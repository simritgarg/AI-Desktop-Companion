import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedMinutes: number;
  actualMinutes?: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  dueDate?: string;
  goalId?: number;
  isTopPriority?: boolean;
}

export interface Goal {
  id?: number;
  title: string;
  description?: string;
  goalType: 'LONG_TERM' | 'MEDIUM_TERM' | 'SHORT_TERM';
  targetDate?: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progressPercentage?: number;
}

export interface Reminder {
  id?: number;
  title: string;
  description?: string;
  reminderType: 'TIME_BASED' | 'RECURRING' | 'HABIT' | 'CONTEXT_AWARE' | 'GOAL_BASED';
  scheduledAt?: string;
  recurrenceCron?: string;
  animationType: string;
  snoozeCount?: number;
  isActive?: boolean;
}

export interface FocusSession {
  id?: number;
  sessionType: 'POMODORO' | 'DEEP_WORK' | 'CUSTOM';
  targetDurationMinutes: number;
  actualFocusMinutes?: number;
  distractionCount?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'INTERRUPTED';
  startedAt?: string;
  endedAt?: string;
}

export interface Habit {
  id?: number;
  title: string;
  description?: string;
  category: string;
  targetFrequencyPerWeek: number;
  currentStreak: number;
  bestStreak: number;
}

export interface AICoachResponse {
  message: string;
  animationState: string;
  recommendedAction?: string;
  actionButtons?: string[];
}

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get('/tasks');
  return res.data;
};

export const createTask = async (task: Task): Promise<Task> => {
  const res = await api.post('/tasks', task);
  return res.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const res = await api.put(`/tasks/${id}`, task);
  return res.data;
};

export const fetchGoals = async (): Promise<Goal[]> => {
  const res = await api.get('/goals');
  return res.data;
};

export const createGoal = async (goal: Goal): Promise<Goal> => {
  const res = await api.post('/goals', goal);
  return res.data;
};

export const fetchReminders = async (): Promise<Reminder[]> => {
  const res = await api.get('/reminders');
  return res.data;
};

export const sendAIChat = async (prompt: string, mode = 'BALANCED'): Promise<AICoachResponse> => {
  const res = await api.post('/ai/chat', { prompt, accountabilityMode: mode });
  return res.data;
};

export const fetchAIRecommendation = async (): Promise<AICoachResponse> => {
  const res = await api.get('/ai/recommend');
  return res.data;
};

export const fetchDailyAnalysis = async () => {
  const res = await api.get('/ai/analyze-day');
  return res.data;
};
