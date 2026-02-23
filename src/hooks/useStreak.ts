import { useMemo } from 'react';
import { subDays } from 'date-fns';
import { useCheckInStore } from '../stores/checkInStore';
import { formatDate, shouldDoHabitOnDate } from '../utils/date';
import type { Habit } from '../types';

export function useStreak(habit: Habit) {
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    let current = 0;
    let best = 0;
    let date = new Date();

    const todayStr = formatDate(date);
    const todayDone = checkIns.has(`${habit.id}-${todayStr}`);

    if (!todayDone && shouldDoHabitOnDate(habit.frequency, date)) {
      // today not done yet, start counting from yesterday
      date = subDays(date, 1);
    }

    // Count backwards
    for (let i = 0; i < 365; i++) {
      const d = subDays(new Date(), i + (todayDone ? 0 : 1));
      if (!shouldDoHabitOnDate(habit.frequency, d)) continue;

      const key = `${habit.id}-${formatDate(d)}`;
      if (checkIns.has(key)) {
        current++;
      } else {
        break;
      }
    }

    // Find best streak by scanning all check-ins for this habit
    const habitCheckIns: string[] = [];
    for (const [key] of checkIns) {
      if (key.startsWith(habit.id + '-')) {
        habitCheckIns.push(key.split('-').slice(1).join('-'));
      }
    }
    habitCheckIns.sort();

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = subDays(new Date(), i);
      if (!shouldDoHabitOnDate(habit.frequency, d)) continue;

      const key = `${habit.id}-${formatDate(d)}`;
      if (checkIns.has(key)) {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    }

    best = Math.max(best, current);

    return { current, best };
  }, [habit, checkIns]);
}
