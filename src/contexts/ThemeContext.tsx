import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [storedTheme, setStoredTheme] = useLocalStorage<string>('fitforge-theme', 'dark');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const validTheme = (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme as ThemeMode : 'dark';
    setThemeState(validTheme);
  }, [storedTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'gradient');
    root.classList.add(theme);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
