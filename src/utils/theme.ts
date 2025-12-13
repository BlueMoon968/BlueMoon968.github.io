import type { Theme } from '../types';

const THEME_KEY = 'bluemoon-theme';

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY) as Theme;
  if (saved) return saved;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme') as Theme;
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
