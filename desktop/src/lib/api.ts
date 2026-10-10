import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('companion_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Task {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedMinutes: number;
  actualMinutes?: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'IN_DUE';
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  goalId?: number;
  isTopPriority?: boolean;
  isGoalTaskOnly?: boolean;
}

export interface Goal {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  goalType: 'LONG_TERM' | 'MEDIUM_TERM' | 'SHORT_TERM';
  targetDate?: string;
  deadline?: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'LATER' | 'IN_DUE';
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

export interface SyllabusTopic {
  id?: number;
  category: 'SSC_CGL' | 'IT_CAREER';
  subject: string;
  topicName: string;
  subtopicName?: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'COMPLETED' | 'REVISION_REQUIRED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  difficulty?: 'EASY' | 'MODERATE' | 'HARD';
  targetCompletionDate?: string;
  estimatedStudyTimeMinutes?: number;
  actualStudyTimeMinutes?: number;
  notes?: string;
  formulaOrShortcuts?: string;
  questionsPracticedCount?: number;
  accuracyPercentage?: number;
  revisionCount?: number;
  nextRevisionDate?: string;
  confidenceLevel?: number;
}

export interface TestPlatform {
  id?: number;
  platformName: string;
  websiteUrl?: string;
  testSeriesName?: string;
  examCategory?: string;
  importMethod?: string;
  integrationStatus?: string;
  lastImportedAt?: string;
}

export interface TestAttempt {
  id?: number;
  platformId?: number;
  platformName: string;
  testSeriesName?: string;
  testName: string;
  attemptDate?: string;
  testType?: 'FULL_MOCK' | 'SECTIONAL' | 'TOPIC_TEST' | 'PYQ';
  totalMarks?: number;
  marksObtained: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  unattemptedQuestions?: number;
  negativeMarks?: number;
  accuracyPercentage?: number;
  attemptRatePercentage?: number;
  timeTakenMinutes?: number;
  percentileOrRank?: string;
  subjectScoresJson?: string;
  topicBreakdownJson?: string;
}

export interface MistakeRecord {
  id?: number;
  questionText: string;
  optionsJson?: string;
  correctAnswer?: string;
  userAnswer?: string;
  explanation?: string;
  examCategory?: string;
  platformName?: string;
  testName?: string;
  subject?: string;
  topic?: string;
  mistakeCategory: 'CONCEPTUAL' | 'CALCULATION' | 'MEMORY' | 'GUESSING' | 'READING' | 'TIME_MANAGEMENT';
  personalNotes?: string;
  reviewStatus?: 'UNRESOLVED' | 'UNDER_REVIEW' | 'MASTERED';
  reviewCount?: number;
}

export interface DiaryEntry {
  id?: number;
  entryDate?: string;
  title: string;
  content: string;
  mood?: 'HAPPY' | 'CALM' | 'FOCUSED' | 'TIRED' | 'ANXIOUS' | 'MOTIVATED';
  highlights?: string;
  whatILearned?: string;
  whatWentWell?: string;
  struggles?: string;
  lessonsFromMocks?: string;
  tomorrowIntention?: string;
  isFavorite?: boolean;
}

export interface VisionBoard {
  id?: number;
  boardName: string;
  category?: string;
  description?: string;
}

export interface VisionBoardItem {
  id?: number;
  boardId: number;
  title: string;
  imageUrlOrData?: string;
  caption?: string;
  externalLink?: string;
  itemType?: 'IMAGE' | 'QUOTE' | 'LINK' | 'MILESTONE';
  displayOrder?: number;
}

export interface Note {
  id?: number;
  title: string;
  category: string;
  subject?: string;
  content: string;
  tags?: string;
  isPinned?: boolean;
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

// Syllabus API
export const fetchSyllabusTopics = async (category = 'SSC_CGL', subject?: string): Promise<SyllabusTopic[]> => {
  const params: any = { category };
  if (subject) params.subject = subject;
  const res = await api.get('/syllabus', { params });
  return res.data;
};

export const createSyllabusTopic = async (topic: SyllabusTopic): Promise<SyllabusTopic> => {
  const res = await api.post('/syllabus', topic);
  return res.data;
};

export const updateSyllabusTopic = async (id: number, topic: Partial<SyllabusTopic>): Promise<SyllabusTopic> => {
  const res = await api.put(`/syllabus/${id}`, topic);
  return res.data;
};

export const deleteSyllabusTopic = async (id: number): Promise<void> => {
  await api.delete(`/syllabus/${id}`);
};

// Test Series API
export const fetchTestPlatforms = async (): Promise<TestPlatform[]> => {
  const res = await api.get('/tests/platforms');
  return res.data;
};

export const fetchTestAttempts = async (platform?: string): Promise<TestAttempt[]> => {
  const params = platform ? { platform } : {};
  const res = await api.get('/tests/attempts', { params });
  return res.data;
};

export const recordTestAttempt = async (attempt: TestAttempt): Promise<TestAttempt> => {
  const res = await api.post('/tests/attempts', attempt);
  return res.data;
};

export const fetchTestAnalyticsSummary = async () => {
  const res = await api.get('/tests/analytics/summary');
  return res.data;
};

// Mistake Bank API
export const fetchMistakes = async (subject?: string, category?: string): Promise<MistakeRecord[]> => {
  const params: any = {};
  if (subject) params.subject = subject;
  if (category) params.mistakeCategory = category;
  const res = await api.get('/mistakes', { params });
  return res.data;
};

export const createMistake = async (mistake: MistakeRecord): Promise<MistakeRecord> => {
  const res = await api.post('/mistakes', mistake);
  return res.data;
};

export const updateMistake = async (id: number, mistake: Partial<MistakeRecord>): Promise<MistakeRecord> => {
  const res = await api.put(`/mistakes/${id}`, mistake);
  return res.data;
};

// Diary API
export const fetchDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const res = await api.get('/diary');
  return res.data;
};

export const fetchDiaryByDate = async (date: string): Promise<DiaryEntry> => {
  const res = await api.get('/diary/by-date', { params: { date } });
  return res.data;
};

export const saveDiaryEntry = async (entry: DiaryEntry): Promise<DiaryEntry> => {
  const res = await api.post('/diary', entry);
  return res.data;
};

// Vision Board API
export const fetchVisionBoards = async (): Promise<VisionBoard[]> => {
  const res = await api.get('/vision-boards');
  return res.data;
};

export const createVisionBoard = async (board: VisionBoard): Promise<VisionBoard> => {
  const res = await api.post('/vision-boards', board);
  return res.data;
};

export const fetchVisionBoardItems = async (boardId: number): Promise<VisionBoardItem[]> => {
  const res = await api.get(`/vision-boards/${boardId}/items`);
  return res.data;
};

export const addVisionBoardItem = async (boardId: number, item: VisionBoardItem): Promise<VisionBoardItem> => {
  const res = await api.post(`/vision-boards/${boardId}/items`, item);
  return res.data;
};

// Notes API
export const fetchNotes = async (category?: string): Promise<Note[]> => {
  const params = category ? { category } : {};
  const res = await api.get('/notes', { params });
  return res.data;
};

export const createNote = async (note: Note): Promise<Note> => {
  const res = await api.post('/notes', note);
  return res.data;
};

export const updateNote = async (id: number, note: Partial<Note>): Promise<Note> => {
  const res = await api.put(`/notes/${id}`, note);
  return res.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const updateGoal = async (id: number, goal: Partial<Goal>): Promise<Goal> => {
  const res = await api.put(`/goals/${id}`, goal);
  return res.data;
};

export const deleteGoal = async (id: number): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

export const fetchGoalSubtasks = async (goalId: number): Promise<Task[]> => {
  const res = await api.get(`/tasks/goal/${goalId}`);
  return res.data;
};

// Habit CRUD API
export const fetchHabits = async (): Promise<Habit[]> => {
  const res = await api.get('/habits');
  return res.data;
};

export const createHabit = async (habit: Habit): Promise<Habit> => {
  const res = await api.post('/habits', habit);
  return res.data;
};

export const updateHabit = async (id: number, habit: Partial<Habit>): Promise<Habit> => {
  const res = await api.put(`/habits/${id}`, habit);
  return res.data;
};

export const deleteHabit = async (id: number): Promise<void> => {
  await api.delete(`/habits/${id}`);
};

export const logHabitCompletion = async (id: number): Promise<Habit> => {
  const res = await api.post(`/habits/${id}/log`);
  return res.data;
};

// Trash Bin API
export interface TrashResponse {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  notes: Note[];
  mistakes: MistakeRecord[];
  tests: TestAttempt[];
  totalCount: number;
}

export const fetchTrash = async (): Promise<TrashResponse> => {
  const res = await api.get('/trash');
  return res.data;
};

export const restoreTrashItem = async (type: string, id: number): Promise<void> => {
  await api.post(`/trash/restore/${type}/${id}`);
};

export const purgeTrashItem = async (type: string, id: number): Promise<void> => {
  await api.delete(`/trash/purge/${type}/${id}`);
};

export const emptyTrash = async (): Promise<void> => {
  await api.delete('/trash/empty');
};

// Career Workspace & Subject API
export interface CareerWorkspace {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface CareerSubject {
  id?: number;
  workspaceId: number;
  subjectName: string;
  description?: string;
  color?: string;
}

export const fetchCareerWorkspaces = async (): Promise<CareerWorkspace[]> => {
  const res = await api.get('/career-workspaces');
  return res.data;
};

export const createCareerWorkspace = async (workspace: CareerWorkspace): Promise<CareerWorkspace> => {
  const res = await api.post('/career-workspaces', workspace);
  return res.data;
};

export const updateCareerWorkspace = async (id: number, workspace: Partial<CareerWorkspace>): Promise<CareerWorkspace> => {
  const res = await api.put(`/career-workspaces/${id}`, workspace);
  return res.data;
};

export const deleteCareerWorkspace = async (id: number): Promise<void> => {
  await api.delete(`/career-workspaces/${id}`);
};

export const fetchCareerSubjects = async (workspaceId: number): Promise<CareerSubject[]> => {
  const res = await api.get(`/career-workspaces/${workspaceId}/subjects`);
  return res.data;
};

export const createCareerSubject = async (workspaceId: number, subject: CareerSubject): Promise<CareerSubject> => {
  const res = await api.post(`/career-workspaces/${workspaceId}/subjects`, subject);
  return res.data;
};

export const updateCareerSubject = async (subjectId: number, subject: Partial<CareerSubject>): Promise<CareerSubject> => {
  const res = await api.put(`/career-workspaces/subjects/${subjectId}`, subject);
  return res.data;
};

export const deleteCareerSubject = async (subjectId: number): Promise<void> => {
  await api.delete(`/career-workspaces/subjects/${subjectId}`);
};

export const deleteVisionBoardItem = async (itemId: number): Promise<void> => {
  await api.delete(`/vision-boards/items/${itemId}`);
};

// User Category API
export interface UserCategory {
  id?: number;
  name: string;
  color?: string;
  icon?: string;
}

export const fetchCategories = async (): Promise<UserCategory[]> => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategory = async (category: UserCategory): Promise<UserCategory> => {
  const res = await api.post('/categories', category);
  return res.data;
};

export const updateCategory = async (id: number, category: Partial<UserCategory>): Promise<UserCategory> => {
  const res = await api.put(`/categories/${id}`, category);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};


