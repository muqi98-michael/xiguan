import { Sun, Moon, Monitor, Bell, BellOff, Heart } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import type { ThemeMode } from '../types';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
];

export default function SettingsPage() {
  const { theme, notificationsEnabled, setTheme, setNotifications } = useSettingsStore();

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          await setNotifications(true);
        }
      }
    } else {
      await setNotifications(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-bold">设置</h1>

      {/* Theme */}
      <section
        className="mb-4 rounded-2xl p-4"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="mb-3 font-semibold">主题模式</h2>
        <div className="flex gap-2">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className="flex flex-1 flex-col items-center gap-2 rounded-xl p-3 transition-all"
              style={{
                backgroundColor: theme === value ? 'var(--color-primary)' + '20' : 'var(--color-bg)',
                border: `1px solid ${theme === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                color: theme === value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section
        className="mb-4 rounded-2xl p-4"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell size={20} style={{ color: 'var(--color-primary)' }} />
            ) : (
              <BellOff size={20} style={{ color: 'var(--color-text-secondary)' }} />
            )}
            <div>
              <h2 className="font-semibold">通知提醒</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {notificationsEnabled ? '已开启' : '已关闭'}
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificationToggle}
            className="relative h-7 w-12 rounded-full transition-colors"
            style={{
              backgroundColor: notificationsEnabled ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            <div
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
              style={{
                transform: notificationsEnabled ? 'translateX(22px)' : 'translateX(2px)',
              }}
            />
          </button>
        </div>
      </section>

      {/* About */}
      <section
        className="rounded-2xl p-4"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="mb-3 font-semibold">关于</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>版本</span>
            <span className="text-sm font-medium">MVP v1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>数据存储</span>
            <span className="text-sm font-medium">本地存储（IndexedDB）</span>
          </div>
          <div
            className="mt-2 rounded-xl p-3 text-center text-sm"
            style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
          >
            <div className="flex items-center justify-center gap-1">
              <span>用</span>
              <Heart size={14} className="text-red-500" fill="currentColor" />
              <span>构建 · 让每个人都能以自己的节奏变好</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
