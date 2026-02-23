import Dexie, { type Table } from 'dexie';
import type { Habit, CheckIn, UserSettings } from '../types';

class HabitTrackerDB extends Dexie {
  habits!: Table<Habit>;
  checkIns!: Table<CheckIn>;
  settings!: Table<UserSettings>;

  constructor() {
    super('HabitTrackerDB');
    this.version(1).stores({
      habits: 'id, createdAt, archived',
      checkIns: 'id, habitId, date, [habitId+date]',
      settings: 'id',
    });
  }
}

export const db = new HabitTrackerDB();
