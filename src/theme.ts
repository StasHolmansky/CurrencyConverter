import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';

export interface AppColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBorder: string;
  toolbar: string;
  toolbarButton: string;
  addButton: string;
  placeholder: string;
  accent: string;
  delete: string;
}

const lightColors: AppColors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#888888',
  border: '#e0e0e0',
  inputBorder: '#cccccc',
  toolbar: '#e9ecef',
  toolbarButton: '#ffffff',
  addButton: '#e9ecef',
  placeholder: '#999999',
  accent: '#007AFF',
  delete: '#e74c3c',
};

const darkColors: AppColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#e8e8e8',
  textSecondary: '#999999',
  border: '#333333',
  inputBorder: '#444444',
  toolbar: '#2a2a2a',
  toolbarButton: '#3a3a3a',
  addButton: '#2a2a2a',
  placeholder: '#666666',
  accent: '#0A84FF',
  delete: '#ff453a',
};

export const lightNavTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.accent,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.text,
    border: lightColors.border,
  },
};

export const darkNavTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.accent,
    background: darkColors.background,
    card: darkColors.card,
    text: darkColors.text,
    border: darkColors.border,
  },
};

type ThemeOverride = 'auto' | 'light' | 'dark';

interface ThemeContextValue {
  isDark: boolean;
  override: ThemeOverride;
  colors: AppColors;
  navTheme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ThemeOverride>('auto');

  const isDark = override === 'auto' ? systemScheme === 'dark' : override === 'dark';

  const toggleTheme = useCallback(() => {
    setOverride(prev => {
      if (prev === 'auto') return isDark ? 'light' : 'dark';
      if (prev === 'dark') return 'light';
      return 'dark';
    });
  }, [isDark]);

  const value = useMemo<ThemeContextValue>(() => ({
    isDark,
    override,
    colors: isDark ? darkColors : lightColors,
    navTheme: isDark ? darkNavTheme : lightNavTheme,
    toggleTheme,
  }), [isDark, override, toggleTheme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function useAppColors(): AppColors {
  return useAppTheme().colors;
}
