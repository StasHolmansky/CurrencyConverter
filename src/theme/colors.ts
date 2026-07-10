export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  danger: string;
  success: string;
  chipInactiveBg: string;
  chipInactiveText: string;
  chipActiveBg: string;
  chipActiveText: string;
  inputBg: string;
  placeholder: string;
  headerBg: string;
  modalBackdrop: string;
  link: string;
  rowSeparator: string;
  /** Convenience aliases used by converter UI */
  text: string;
  delete: string;
  inputBorder: string;
  toolbar: string;
  toolbarButton: string;
  addButton: string;
}

const lightBase = {
  background: '#f8fafc',
  surface: '#fafafa',
  card: '#ffffff',
  border: '#e2e8f0',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  accent: '#2563eb',
  onAccent: '#ffffff',
  danger: '#dc2626',
  success: '#16a34a',
  chipInactiveBg: '#e2e8f0',
  chipInactiveText: '#334155',
  chipActiveBg: '#2563eb',
  chipActiveText: '#ffffff',
  inputBg: '#ffffff',
  placeholder: '#94a3b8',
  headerBg: '#ffffff',
  modalBackdrop: 'rgba(15,23,42,0.45)',
  link: '#2563eb',
  rowSeparator: '#e2e8f0',
} as const;

const darkBase = {
  background: '#0f172a',
  surface: '#1e293b',
  card: '#1e293b',
  border: '#334155',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  accent: '#3b82f6',
  onAccent: '#ffffff',
  danger: '#f87171',
  success: '#4ade80',
  chipInactiveBg: '#334155',
  chipInactiveText: '#cbd5e1',
  chipActiveBg: '#3b82f6',
  chipActiveText: '#ffffff',
  inputBg: '#0f172a',
  placeholder: '#64748b',
  headerBg: '#1e293b',
  modalBackdrop: 'rgba(0,0,0,0.65)',
  link: '#60a5fa',
  rowSeparator: '#334155',
} as const;

function withAliases(
  base: typeof lightBase | typeof darkBase,
): ThemeColors {
  return {
    ...base,
    text: base.textPrimary,
    delete: base.danger,
    inputBorder: base.border,
    toolbar: base.surface,
    toolbarButton: base.card,
    addButton: base.chipInactiveBg,
  };
}

const light: ThemeColors = withAliases(lightBase);
const dark: ThemeColors = withAliases(darkBase);

export function getPalette(isDark: boolean): ThemeColors {
  return isDark ? dark : light;
}

export function resolveDarkMode(
  preference: ThemePreference | undefined,
  systemIsDark: boolean | null | undefined,
): boolean {
  if (preference === 'dark') {
    return true;
  }
  if (preference === 'light') {
    return false;
  }
  return systemIsDark === true;
}
