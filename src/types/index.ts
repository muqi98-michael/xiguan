export interface FrequencyConfig {
  type: 'daily' | 'weekly' | 'custom';
  daysPerWeek?: number;
  specificDays?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: FrequencyConfig;
  tags: string[];
  reminderTime?: string;
  createdAt: number;
  updatedAt: number;
  archived: boolean;
}

export interface CheckIn {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  timestamp: number;
}

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  createdAt: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export const HABIT_ICONS = [
  '📖', '🏃', '🧘', '💧', '🥗', '💪', '🛌', '✍️',
  '🎵', '🧹', '📱', '🌅', '🚶', '🧠', '💊', '🍎',
] as const;

export const HABIT_COLORS = [
  '#22c55e', '#3b82f6', '#a855f7', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
] as const;

export const DEFAULT_TAGS = ['健康', '学习', '工作', '生活'] as const;
