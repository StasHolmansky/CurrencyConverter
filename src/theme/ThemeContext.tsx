import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import {
  getPalette,
  resolveDarkMode,
  type ThemeColors,
  type ThemePreference,
} from './colors';

const THEME_PREF_KEY = 'themePreference';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  navTheme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribeToAppearance(callback: () => void) {
  const sub = Appearance.addChangeListener(callback);
  return () => sub.remove();
}

function getSnapshotAppearance() {
  return Appearance.getColorScheme();
}

function buildNavTheme(colors: ThemeColors, isDark: boolean): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.headerBg,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.danger,
    },
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const appearanceScheme = useSyncExternalStore(
    subscribeToAppearance,
    getSnapshotAppearance,
    getSnapshotAppearance,
  );
  const systemIsDark = (appearanceScheme ?? systemScheme) === 'dark';

  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(THEME_PREF_KEY)
      .then(raw => {
        if (cancelled) {
          return;
        }
        if (raw === 'light' || raw === 'dark' || raw === 'system') {
          setPreferenceState(raw);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(THEME_PREF_KEY, p).catch(() => {});
  }, []);

  const isDark = useMemo(
    () => resolveDarkMode(preference, systemIsDark),
    [preference, systemIsDark],
  );

  const colors = useMemo(() => getPalette(isDark), [isDark]);
  const navTheme = useMemo(() => buildNavTheme(colors, isDark), [colors, isDark]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [hydrated, isDark]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      preference,
      setPreference,
      navTheme,
    }),
    [colors, isDark, preference, setPreference, navTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

/** @deprecated Prefer useTheme(); kept for existing screens. */
export function useAppTheme(): ThemeContextValue {
  return useTheme();
}

export function useAppColors(): ThemeColors {
  return useTheme().colors;
}

export type { ThemeColors, ThemePreference };
export type AppColors = ThemeColors;
