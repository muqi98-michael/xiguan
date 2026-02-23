import { useMemo } from 'react';
import { eachDayOfInterval, subDays } from 'date-fns';
import { useCheckInStore } from '../stores/checkInStore';
import { useHabitStore } from '../stores/habitStore';
import { formatDate, shouldDoHabitOnDate, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from '../utils/date';

export function useWeeklyStats(habitId?: string) {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const targetHabits = habitId ? habits.filter((h) => h.id === habitId) : habits;

    let shouldDo = 0;
    let done = 0;

    for (const habit of targetHabits) {
      for (const day of days) {
        if (day > today) continue;
        if (!shouldDoHabitOnDate(habit.frequency, day)) continue;
        shouldDo++;
        const key = `${habit.id}-${formatDate(day)}`;
        if (checkIns.has(key)) done++;
      }
    }

    return {
      done,
      total: shouldDo,
      rate: shouldDo > 0 ? Math.round((done / shouldDo) * 100) : 0,
    };
  }, [habits, checkIns, habitId]);
}

export function useMonthlyStats(habitId?: string) {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const targetHabits = habitId ? habits.filter((h) => h.id === habitId) : habits;

    let shouldDo = 0;
    let done = 0;

    for (const habit of targetHabits) {
      for (const day of days) {
        if (day > today) continue;
        if (!shouldDoHabitOnDate(habit.frequency, day)) continue;
        shouldDo++;
        const key = `${habit.id}-${formatDate(day)}`;
        if (checkIns.has(key)) done++;
      }
    }

    return {
      done,
      total: shouldDo,
      rate: shouldDo > 0 ? Math.round((done / shouldDo) * 100) : 0,
    };
  }, [habits, checkIns, habitId]);
}

export function useTodayProgress() {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const today = new Date();
    const todayStr = formatDate(today);

    const todayHabits = habits.filter((h) => shouldDoHabitOnDate(h.frequency, today));
    const done = todayHabits.filter((h) => checkIns.has(`${h.id}-${todayStr}`)).length;

    return { done, total: todayHabits.length };
  }, [habits, checkIns]);
}

export function useLast30DaysData(habitId?: string) {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  return useMemo(() => {
    const today = new Date();
    const data: { date: string; done: number; total: number }[] = [];
    const targetHabits = habitId ? habits.filter((h) => h.id === habitId) : habits;

    for (let i = 29; i >= 0; i--) {
      const day = subDays(today, i);
      const dateStr = formatDate(day);
      let total = 0;
      let done = 0;

      for (const habit of targetHabits) {
        if (habit.createdAt > day.getTime()) continue;
        if (!shouldDoHabitOnDate(habit.frequency, day)) continue;
        total++;
        if (checkIns.has(`${habit.id}-${dateStr}`)) done++;
      }

      data.push({ date: dateStr, done, total });
    }

    return data;
  }, [habits, checkIns, habitId]);
}
