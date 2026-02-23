import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  current: number;
  showLabel?: boolean;
}

export default function StreakBadge({ current, showLabel = true }: StreakBadgeProps) {
  const color = current >= 21 ? '#ef4444' : current >= 7 ? '#f59e0b' : '#94a3b8';

  return (
    <div className="flex items-center gap-1" title={`连续 ${current} 天`}>
      <Flame size={16} style={{ color }} className={current > 0 ? 'animate-pulse' : ''} />
      <span className="text-sm font-medium" style={{ color }}>
        {current}
      </span>
      {showLabel && (
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>天</span>
      )}
    </div>
  );
}
