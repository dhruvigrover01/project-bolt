import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useTheme() {
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    // Apply theme to document body
    if (theme === 'light') {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }

    // Also set color-scheme for native elements
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return { theme, toggleTheme };
}
