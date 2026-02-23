import { useHabitStore } from '../stores/habitStore';
import { useStreak } from '../hooks/useStreak';
import { useWeeklyStats, useMonthlyStats, useLast30DaysData } from '../hooks/useStats';
import type { Habit } from '../types';

function HabitStatsCard({ habit }: { habit: Habit }) {
  const { current, best } = useStreak(habit);
  const weekly = useWeeklyStats(habit.id);
  const monthly = useMonthlyStats(habit.id);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{habit.icon}</span>
        <span className="font-semibold">{habit.name}</span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="text-xl font-bold" style={{ color: habit.color }}>{current}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>当前连续</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="text-xl font-bold" style={{ color: habit.color }}>{best}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>最长连续</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="text-xl font-bold" style={{ color: habit.color }}>{monthly.done}</div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>本月完成</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>本周</span>
          <span className="text-sm font-semibold" style={{ color: habit.color }}>{weekly.rate}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${weekly.rate}%`, backgroundColor: habit.color }}
          />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>本月</span>
          <span className="text-sm font-semibold" style={{ color: habit.color }}>{monthly.rate}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${monthly.rate}%`, backgroundColor: habit.color }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniChart({ data, color }: { data: { date: string; done: number; total: number }[]; color: string }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 48 }}>
      {data.map((d, i) => {
        const h = d.total > 0 ? (d.done / d.total) * 100 : 0;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max(h, 4)}%`,
              backgroundColor: d.done > 0 ? color : 'var(--color-border)',
              opacity: d.done > 0 ? 0.4 + (d.done / (d.total || 1)) * 0.6 : 0.3,
            }}
            title={`${d.date}: ${d.done}/${d.total}`}
          />
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const habits = useHabitStore((s) => s.habits);
  const weeklyAll = useWeeklyStats();
  const monthlyAll = useMonthlyStats();
  const last30Days = useLast30DaysData();

  if (habits.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-6">
        <h1 className="mb-6 text-2xl font-bold">统计</h1>
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span className="text-4xl">📊</span>
          <p className="mt-3 font-medium">还没有数据</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            创建习惯并开始打卡后，这里会显示你的统计数据
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-bold">统计</h1>

      {/* Overall Stats */}
      <div
        className="mb-4 rounded-2xl p-4"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="mb-3 font-semibold">整体概览</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{weeklyAll.rate}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>本周完成率</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{monthlyAll.rate}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>本月完成率</div>
          </div>
        </div>

        {/* 30-day trend */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>最近 30 天趋势</span>
          </div>
          <MiniChart data={last30Days} color="var(--color-primary)" />
        </div>
      </div>

      {/* Per-habit Stats */}
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitStatsCard key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
