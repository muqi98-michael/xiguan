import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { CheckIn } from '../types';
import { formatDate } from '../utils/date';

interface CheckInState {
  checkIns: Map<string, CheckIn>; // key: `${habitId}-${date}`
  loading: boolean;
  loadCheckIns: () => Promise<void>;
  toggleCheckIn: (habitId: string, date?: Date) => Promise<boolean>;
  getCheckIn: (habitId: string, date: string) => CheckIn | undefined;
  getCheckInsForHabit: (habitId: string) => CheckIn[];
  getCheckInsForDate: (date: string) => CheckIn[];
}

function makeKey(habitId: string, date: string) {
  return `${habitId}-${date}`;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  checkIns: new Map(),
  loading: true,

  loadCheckIns: async () => {
    const all = await db.checkIns.toArray();
    const map = new Map<string, CheckIn>();
    for (const ci of all) {
      map.set(makeKey(ci.habitId, ci.date), ci);
    }
    set({ checkIns: map, loading: false });
  },

  toggleCheckIn: async (habitId, date) => {
    const dateStr = formatDate(date ?? new Date());
    const key = makeKey(habitId, dateStr);
    const existing = get().checkIns.get(key);

    if (existing) {
      await db.checkIns.delete(existing.id);
      const next = new Map(get().checkIns);
      next.delete(key);
      set({ checkIns: next });
      return false;
    }

    const checkIn: CheckIn = {
      id: uuidv4(),
      habitId,
      date: dateStr,
      completed: true,
      timestamp: Date.now(),
    };
    await db.checkIns.add(checkIn);
    const next = new Map(get().checkIns);
    next.set(key, checkIn);
    set({ checkIns: next });
    return true;
  },

  getCheckIn: (habitId, date) => {
    return get().checkIns.get(makeKey(habitId, date));
  },

  getCheckInsForHabit: (habitId) => {
    const result: CheckIn[] = [];
    for (const ci of get().checkIns.values()) {
      if (ci.habitId === habitId) result.push(ci);
    }
    return result;
  },

  getCheckInsForDate: (date) => {
    const result: CheckIn[] = [];
    for (const ci of get().checkIns.values()) {
      if (ci.date === date) result.push(ci);
    }
    return result;
  },
}));
