import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

// Used when nothing is stored, or when a stored value is no longer valid (e.g. the removed 'system' mode).
const DEFAULT_THEME: Theme = 'dark';

const THEME_KEY = 'openwa_theme';
// Legacy key from the removed palette picker (pre-0.9.0). Cleaned up on mount so old installs
// don't carry dead state; the picker was dropped for being hard to maintain and off-brand.
const LEGACY_PALETTE_KEY = 'openwa_palette';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return isTheme(saved) ? saved : DEFAULT_THEME;
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, applyTheme]);

  // One-time cleanup of the removed palette picker's storage + document attribute.
  useEffect(() => {
    localStorage.removeItem(LEGACY_PALETTE_KEY);
    document.documentElement.removeAttribute('data-palette');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Kept for callers; with no 'system' mode the resolved theme is the chosen one.
  const resolvedTheme = theme;

  return { theme, setTheme, toggleTheme, resolvedTheme };
}
