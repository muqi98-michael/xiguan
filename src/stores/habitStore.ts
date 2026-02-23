import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { Habit, FrequencyConfig } from '../types';

interface HabitState {
  habits: Habit[];
  loading: boolean;
  loadHabits: () => Promise<void>;
  addHabit: (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: FrequencyConfig;
    tags: string[];
    reminderTime?: string;
  }) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: true,

  loadHabits: async () => {
    const habits = await db.habits.where('archived').equals(0).toArray();
    set({ habits: habits.sort((a, b) => a.createdAt - b.createdAt), loading: false });
  },

  addHabit: async (data) => {
    const now = Date.now();
    const habit: Habit = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      frequency: data.frequency,
      tags: data.tags,
      reminderTime: data.reminderTime,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };
    await db.habits.add(habit);
    set({ habits: [...get().habits, habit] });
    return habit;
  },

  updateHabit: async (id, data) => {
    const updates = { ...data, updatedAt: Date.now() };
    await db.habits.update(id, updates);
    set({
      habits: get().habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    });
  },

  deleteHabit: async (id) => {
    await db.habits.update(id, { archived: true });
    await db.checkIns.where('habitId').equals(id).delete();
    set({ habits: get().habits.filter((h) => h.id !== id) });
  },
}));
