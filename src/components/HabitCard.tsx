import { useState } from 'react';
import { Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useCheckInStore } from '../stores/checkInStore';
import { useStreak } from '../hooks/useStreak';
import { formatDate } from '../utils/date';
import StreakBadge from './StreakBadge';
import type { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const toggleCheckIn = useCheckInStore((s) => s.toggleCheckIn);
  const getCheckIn = useCheckInStore((s) => s.getCheckIn);

  const todayStr = formatDate(new Date());
  const isChecked = !!getCheckIn(habit.id, todayStr);
  const { current } = useStreak(habit);

  const handleToggle = async () => {
    setAnimating(true);
    await toggleCheckIn(habit.id);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <div
      className="relative flex items-center gap-3 rounded-2xl p-4 transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid ${isChecked ? habit.color + '40' : 'var(--color-border)'}`,
      }}
    >
      <button
        onClick={handleToggle}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${animating ? 'animate-check' : ''}`}
        style={{
          borderColor: habit.color,
          backgroundColor: isChecked ? habit.color : 'transparent',
        }}
      >
        {isChecked && <Check size={20} className="text-white" />}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.icon}</span>
          <span
            className={`font-medium transition-all ${isChecked ? 'line-through opacity-60' : ''}`}
            style={{ color: 'var(--color-text)' }}
          >
            {habit.name}
          </span>
        </div>
        {habit.tags.length > 0 && (
          <div className="mt-1 flex gap-1">
            {habit.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: habit.color + '20',
                  color: habit.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <StreakBadge current={current} />

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-1 transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <MoreVertical size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div
              className="absolute right-0 top-8 z-20 w-32 rounded-xl py-1 shadow-lg animate-fade-in"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={() => { onEdit(habit); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <Pencil size={14} /> 编辑
              </button>
              <button
                onClick={() => { onDelete(habit); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <Trash2 size={14} /> 删除
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
