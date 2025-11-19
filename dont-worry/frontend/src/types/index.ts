// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  entryMode: 'editor' | 'form' | 'ask_every_time';
  theme: 'fireplace' | 'autumn' | 'calm';
  language: 'cs' | 'en';
  notificationsEnabled: boolean;
}

// Entry Types
export type EntryType = 'editor' | 'form';

export interface Entry {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  type: EntryType;
  content: EditorContent | FormContent;
  synced: boolean;
  localOnly?: boolean;
}

export interface EditorContent {
  text: string; // Rich text HTML
  wordCount: number;
}

export interface FormContent {
  questions: FormQuestion[];
}

export interface FormQuestion {
  question: string;
  answer: string | number;
}

// Metrics Types
export interface Metric {
  id: string;
  entryId: string;
  moodScore: number; // 1-10, required
  sleepHours?: number;
  stressLevel?: number; // 1-10
  socialInteractions?: number;
  exerciseMinutes?: number;
  extractedKeywords?: string[];
  sentimentScore?: number; // -1 to 1
}

// Activity Types
export type ActivityType = 'work' | 'sport' | 'social' | 'hobby' | 'rest';

export interface Activity {
  id: string;
  entryId: string;
  activityType: ActivityType;
  durationMinutes: number;
}

// Achievement Types
export type AchievementType = 
  | 'streak_7' 
  | 'streak_30' 
  | 'first_prediction' 
  | 'entries_10'
  | 'entries_50'
  | 'entries_100';

export interface Achievement {
  id: string;
  userId: string;
  achievementType: AchievementType;
  unlockedAt: Date;
  points: number;
}

// Form Questionnaire
export interface QuestionnaireData {
  mood: number; // 1-10
  sleepHours: number;
  sleepQuality: number; // 1-5
  stressLevel: number; // 1-10
  activities: ActivityType[];
  note?: string;
}

// Dashboard/Analytics Types
export interface TrendData {
  date: string;
  moodScore: number;
  sleepHours?: number;
  stressLevel?: number;
}

export interface PredictionData {
  date: string;
  predictedMood: number;
  confidence: number;
}

// Sync Types
export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entryId: string;
  data: any;
  timestamp: Date;
  retries: number;
}

export interface SyncStatus {
  lastSyncAt?: Date;
  pendingChanges: number;
  isSyncing: boolean;
  error?: string;
}
