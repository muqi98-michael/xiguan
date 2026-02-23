import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, parseISO, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { FrequencyConfig } from '../types';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'M月d日', { locale: zhCN });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'yyyy年M月', { locale: zhCN });
}

export function getWeekDays(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });
}

export function getMonthDays(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function shouldDoHabitOnDate(frequency: FrequencyConfig, date: Date): boolean {
  const dayOfWeek = getDay(date); // 0=Sun

  switch (frequency.type) {
    case 'daily':
      return true;
    case 'weekly':
      return true; // weekly N times doesn't restrict specific days
    case 'custom':
      return frequency.specificDays?.includes(dayOfWeek) ?? false;
    default:
      return true;
  }
}

export { isToday, isSameDay, parseISO, getDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format };
