"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = "light" | "dark" | "system" | "anime-retro";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  /** False until the client has mounted, so theme-only styling never mismatches SSR HTML. */
  mounted: boolean;
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  toggleTheme: () => null,
  mounted: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      if (defaultTheme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    }
    return (defaultTheme || "dark") as Theme;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "anime-retro");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }

    if (theme === "anime-retro") {
      root.classList.add("dark", "anime-retro");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme =
        current === 'light' ? 'dark' : current === 'dark' ? 'anime-retro' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, next);
      return next;
    });
  }, [storageKey]);

  // A new object here would re-render every consumer whenever the provider
  // re-renders for any reason, so it is memoised on what consumers read.
  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, mounted }),
    [theme, setTheme, toggleTheme, mounted],
  );

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
