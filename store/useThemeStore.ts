import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system', systemIsDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system',
  isDark: false,
  setTheme: (theme, systemIsDark) => {
    set({
      theme,
      isDark: theme === 'system' ? systemIsDark : theme === 'dark'
    });
  },
}));