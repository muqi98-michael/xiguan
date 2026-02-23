import { useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Home, CalendarDays, BarChart3, Settings } from 'lucide-react';
import { useHabitStore } from './stores/habitStore';
import { useCheckInStore } from './stores/checkInStore';
import { useSettingsStore } from './stores/settingsStore';
import TodayPage from './pages/TodayPage';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

const NAV_ITEMS = [
  { path: '/today', label: '今日', icon: Home },
  { path: '/calendar', label: '日历', icon: CalendarDays },
  { path: '/stats', label: '统计', icon: BarChart3 },
  { path: '/settings', label: '设置', icon: Settings },
] as const;

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? '' : 'opacity-50'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            })}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function AppLoader({ children }: { children: React.ReactNode }) {
  const loadHabits = useHabitStore((s) => s.loadHabits);
  const loadCheckIns = useCheckInStore((s) => s.loadCheckIns);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const habitsLoading = useHabitStore((s) => s.loading);
  const checkInsLoading = useCheckInStore((s) => s.loading);
  const settingsLoading = useSettingsStore((s) => s.loading);

  useEffect(() => {
    loadHabits();
    loadCheckIns();
    loadSettings();
  }, [loadHabits, loadCheckIns, loadSettings]);

  if (habitsLoading || checkInsLoading || settingsLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl animate-pulse">🌱</div>
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            加载中...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <AppLoader>
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </AppLoader>
    </HashRouter>
  );
}
