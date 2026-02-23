import { create } from 'zustand';
import { db } from '../db/database';
import type { ThemeMode } from '../types';

interface SettingsState {
  theme: ThemeMode;
  notificationsEnabled: boolean;
  loading: boolean;
  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setNotifications: (enabled: boolean) => Promise<void>;
}

const SETTINGS_ID = 'default';

function applyTheme(theme: ThemeMode) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  notificationsEnabled: false,
  loading: true,

  loadSettings: async () => {
    let settings = await db.settings.get(SETTINGS_ID);
    if (!settings) {
      settings = {
        id: SETTINGS_ID,
        theme: 'system',
        notificationsEnabled: false,
        createdAt: Date.now(),
      };
      await db.settings.add(settings);
    }
    applyTheme(settings.theme);
    set({
      theme: settings.theme,
      notificationsEnabled: settings.notificationsEnabled,
      loading: false,
    });
  },

  setTheme: async (theme) => {
    await db.settings.update(SETTINGS_ID, { theme });
    applyTheme(theme);
    set({ theme });
  },

  setNotifications: async (enabled) => {
    await db.settings.update(SETTINGS_ID, { notificationsEnabled: enabled });
    set({ notificationsEnabled: enabled });
  },
}));
