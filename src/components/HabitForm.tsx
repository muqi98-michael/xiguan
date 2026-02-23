import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Habit, FrequencyConfig } from '../types';
import { HABIT_ICONS, HABIT_COLORS, DEFAULT_TAGS } from '../types';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: FrequencyConfig;
    tags: string[];
  }) => void;
  onClose: () => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function HabitForm({ habit, onSubmit, onClose }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [icon, setIcon] = useState(habit?.icon ?? '📖');
  const [color, setColor] = useState(habit?.color ?? '#22c55e');
  const [freqType, setFreqType] = useState<FrequencyConfig['type']>(habit?.frequency.type ?? 'daily');
  const [daysPerWeek, setDaysPerWeek] = useState(habit?.frequency.daysPerWeek ?? 3);
  const [specificDays, setSpecificDays] = useState<number[]>(habit?.frequency.specificDays ?? [1, 2, 3, 4, 5]);
  const [tags, setTags] = useState<string[]>(habit?.tags ?? []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const frequency: FrequencyConfig = { type: freqType };
    if (freqType === 'weekly') frequency.daysPerWeek = daysPerWeek;
    if (freqType === 'custom') frequency.specificDays = specificDays;

    onSubmit({ name: name.trim(), description: description.trim() || undefined, icon, color, frequency, tags });
  };

  const toggleDay = (day: number) => {
    setSpecificDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 animate-fade-in"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{habit ? '编辑习惯' : '创建新习惯'}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-[var(--color-surface-hover)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              习惯名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：阅读 15 分钟"
              className="w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)]"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              描述（可选）
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="给自己一句鼓励的话"
              className="w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)]"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              图标
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all ${
                    icon === ic ? 'ring-2 scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: icon === ic ? color + '20' : 'var(--color-bg)',
                    outlineColor: icon === ic ? color : undefined,
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c, outlineColor: color === c ? c : undefined }}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              频率
            </label>
            <div className="flex gap-2">
              {([
                ['daily', '每天'],
                ['weekly', '每周N次'],
                ['custom', '自定义'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFreqType(value)}
                  className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: freqType === value ? color + '20' : 'var(--color-bg)',
                    color: freqType === value ? color : 'var(--color-text-secondary)',
                    border: `1px solid ${freqType === value ? color : 'var(--color-border)'}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {freqType === 'weekly' && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>每周</span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: color }}
                />
                <span className="min-w-[3ch] text-center font-bold" style={{ color }}>
                  {daysPerWeek}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>次</span>
              </div>
            )}

            {freqType === 'custom' && (
              <div className="mt-3 flex gap-2">
                {WEEKDAYS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: specificDays.includes(i) ? color : 'var(--color-bg)',
                      color: specificDays.includes(i) ? '#fff' : 'var(--color-text-secondary)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: tags.includes(tag) ? color + '20' : 'var(--color-bg)',
                    color: tags.includes(tag) ? color : 'var(--color-text-secondary)',
                    border: `1px solid ${tags.includes(tag) ? color : 'var(--color-border)'}`,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-2 w-full rounded-xl py-3 text-base font-semibold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: color }}
          >
            {habit ? '保存修改' : '创建习惯'}
          </button>
        </form>
      </div>
    </div>
  );
}
