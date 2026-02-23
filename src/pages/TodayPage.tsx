import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import { useTodayProgress } from '../hooks/useStats';
import { shouldDoHabitOnDate, formatDate } from '../utils/date';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import ConfirmDialog from '../components/ConfirmDialog';
import ProgressRing from '../components/ProgressRing';
import type { Habit, FrequencyConfig } from '../types';

export default function TodayPage() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const { done, total } = useTodayProgress();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const today = new Date();
  const todayStr = formatDate(today);
  const todayHabits = habits.filter((h) => shouldDoHabitOnDate(h.frequency, today));
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const greeting = (() => {
    const hour = today.getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  })();

  const handleCreate = async (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: FrequencyConfig;
    tags: string[];
  }) => {
    await addHabit(data);
    setShowForm(false);
  };

  const handleEdit = async (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: FrequencyConfig;
    tags: string[];
  }) => {
    if (!editingHabit) return;
    await updateHabit(editingHabit.id, data);
    setEditingHabit(null);
  };

  const handleDelete = async () => {
    if (!deletingHabit) return;
    await deleteHabit(deletingHabit.id);
    setDeletingHabit(null);
  };

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{greeting} 👋</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {todayStr} · 今天有 {total} 个习惯待完成
        </p>
      </div>

      {/* Progress Ring */}
      {total > 0 && (
        <div className="mb-6 flex justify-center">
          <ProgressRing progress={progress} done={done} total={total} />
        </div>
      )}

      {/* Celebration */}
      {total > 0 && done === total && (
        <div className="mb-6 rounded-2xl p-4 text-center animate-celebration" style={{ backgroundColor: '#22c55e20' }}>
          <span className="text-3xl">🎉</span>
          <p className="mt-1 font-semibold" style={{ color: '#22c55e' }}>
            太棒了！今天的习惯全部完成！
          </p>
        </div>
      )}

      {/* Habit List */}
      <div className="flex flex-col gap-3">
        {todayHabits.length === 0 && habits.length === 0 && (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <span className="text-4xl">🌱</span>
            <p className="mt-3 font-medium">还没有任何习惯</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              点击下方按钮，开始你的第一个习惯吧
            </p>
          </div>
        )}

        {todayHabits.length === 0 && habits.length > 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <span className="text-3xl">😌</span>
            <p className="mt-2 font-medium">今天没有需要完成的习惯</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              好好休息，明天继续加油
            </p>
          </div>
        )}

        {todayHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={setEditingHabit}
            onDelete={setDeletingHabit}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Forms & Dialogs */}
      {showForm && (
        <HabitForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {editingHabit && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleEdit}
          onClose={() => setEditingHabit(null)}
        />
      )}

      {deletingHabit && (
        <ConfirmDialog
          title="删除习惯"
          message={`确定要删除「${deletingHabit.name}」吗？相关的打卡记录也会一并删除，此操作无法撤销。`}
          confirmLabel="删除"
          onConfirm={handleDelete}
          onCancel={() => setDeletingHabit(null)}
        />
      )}
    </div>
  );
}
