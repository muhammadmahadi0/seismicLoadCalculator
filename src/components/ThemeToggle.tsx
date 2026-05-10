'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for mounted to avoid hydration mismatch
  useEffect(() => {
    if (mounted && !theme) {
      setTheme('light');
    }
  }, [mounted, theme, setTheme]);

  if (!mounted) {
    return (
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center z-50"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  // Use resolvedTheme to get the actual applied theme
  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full
        bg-emerald-600 hover:bg-emerald-700
        shadow-lg shadow-emerald-600/25
        flex items-center justify-center z-50
        transition-all duration-200 hover:scale-105 active:scale-95
        text-white"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}