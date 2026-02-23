import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, getDay, isSameMonth, isFuture, isToday as checkIsToday } from 'date-fns';
import { useHabitStore } from '../stores/habitStore';
import { useCheckInStore } from '../stores/checkInStore';
import { formatDate, formatMonthYear, getMonthDays, shouldDoHabitOnDate } from '../utils/date';

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useCheckInStore((s) => s.checkIns);

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  // Offset for first day alignment (Monday=0)
  const firstDayOffset = useMemo(() => {
    const d = getDay(days[0]);
    return d === 0 ? 6 : d - 1;
  }, [days]);

  const getDayStatus = (date: Date) => {
    const dateStr = formatDate(date);
    const targetHabits = selectedHabitId
      ? habits.filter((h) => h.id === selectedHabitId)
      : habits;

    let shouldDo = 0;
    let done = 0;

    for (const habit of targetHabits) {
      if (habit.createdAt > date.getTime()) continue;
      if (!shouldDoHabitOnDate(habit.frequency, date)) continue;
      shouldDo++;
      if (checkIns.has(`${habit.id}-${dateStr}`)) done++;
    }

    if (shouldDo === 0) return 'none';
    if (done === shouldDo) return 'complete';
    if (done > 0) return 'partial';
    return 'missed';
  };

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-bold">日历</h1>

      {/* Habit Filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedHabitId(null)}
          className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          style={{
            backgroundColor: !selectedHabitId ? 'var(--color-primary)' : 'var(--color-surface)',
            color: !selectedHabitId ? '#fff' : 'var(--color-text-secondary)',
          }}
        >
          全部
        </button>
        {habits.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHabitId(h.id)}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedHabitId === h.id ? h.color + '20' : 'var(--color-surface)',
              color: selectedHabitId === h.id ? h.color : 'var(--color-text-secondary)',
              border: `1px solid ${selectedHabitId === h.id ? h.color : 'var(--color-border)'}`,
            }}
          >
            {h.icon} {h.name}
          </button>
        ))}
      </div>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-xl p-2 transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-xl p-2 transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Weekday Headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = checkIsToday(day);
            const future = isFuture(day) && !isToday;
            const status = future ? 'none' : getDayStatus(day);

            const bgColor = (() => {
              if (!isCurrentMonth) return 'transparent';
              switch (status) {
                case 'complete': return '#22c55e';
                case 'partial': return '#22c55e60';
                case 'missed': return 'var(--color-surface-hover)';
                default: return 'transparent';
              }
            })();

            const textColor = status === 'complete' ? '#fff' : 'var(--color-text)';

            return (
              <div
                key={day.toISOString()}
                className={`flex h-10 items-center justify-center rounded-xl text-sm transition-all ${
                  isToday ? 'ring-2 ring-[var(--color-primary)]' : ''
                } ${future ? 'opacity-30' : ''}`}
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4">
        {[
          { color: '#22c55e', label: '全部完成' },
          { color: '#22c55e60', label: '部分完成' },
          { color: 'var(--color-surface-hover)', label: '未完成' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
