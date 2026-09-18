'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export interface ThemeDef {
  id: ThemeId;
  label: string;
  /** Mirrors the CSS tokens — WebGL can't read CSS variables. */
  palette: { bg: string; surface: string; fg: string; accent: string; accent2: string };
}

export const THEMES = {
  press: { id: 'press', label: 'Press', palette: { bg: '#f2eee3', surface: '#ded7c4', fg: '#15120e', accent: '#2b44e0', accent2: '#e0452b' } },
  blueprint: { id: 'blueprint', label: 'Blueprint', palette: { bg: '#091320', surface: '#17293b', fg: '#e7f1f7', accent: '#ff6a3d', accent2: '#63e2ff' } },
  darkroom: { id: 'darkroom', label: 'Darkroom', palette: { bg: '#131010', surface: '#272120', fg: '#f0e7da', accent: '#e4572e', accent2: '#c9b27c' } },
} as const satisfies Record<string, ThemeDef>;

export type ThemeId = 'press' | 'blueprint' | 'darkroom';
export const THEME_IDS = Object.keys(THEMES) as ThemeId[];
export const THEME_STORAGE_KEY = 'dh-theme';

/** Runs before paint (inlined in <head>) so there's no flash of the wrong theme. */
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t&&${JSON.stringify(THEME_IDS)}.indexOf(t)>-1)document.documentElement.dataset.theme=t;}catch(e){}`;

interface ThemeContextValue {
  theme: ThemeDef;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => ThemeDef;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The <html data-theme> attribute is the single source of truth.
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function readTheme(): ThemeId {
  const t = document.documentElement.dataset.theme as ThemeId | undefined;
  return t && t in THEMES ? t : 'press';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const id = useSyncExternalStore(subscribe, readTheme, () => 'press' as ThemeId);

  const setTheme = useCallback((next: ThemeId) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage blocked — theme still applies for this visit
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', THEMES[next].palette.bg);
    listeners.forEach((cb) => cb());
  }, []);

  const cycleTheme = useCallback(() => {
    const next = THEME_IDS[(THEME_IDS.indexOf(readTheme()) + 1) % THEME_IDS.length];
    setTheme(next);
    return THEMES[next];
  }, [setTheme]);

  const value = useMemo(() => ({ theme: THEMES[id], setTheme, cycleTheme }), [id, setTheme, cycleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
