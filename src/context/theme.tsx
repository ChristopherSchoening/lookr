import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';

import { loadThemePreference, saveThemePreference } from '@/lib/db';
import type { ThemePreference } from '@/lib/types';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedPreference: Exclude<ThemePreference, 'system'>;
  setPreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolvedPreference: 'light',
  setPreference: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const hasLoadedPreference = useRef(false);
  const resolvedPreference = colorScheme.colorScheme ?? 'light';

  useEffect(() => {
    if (hasLoadedPreference.current) {
      return;
    }
    hasLoadedPreference.current = true;

    void loadThemePreference()
      .then((savedPreference) => {
        setPreferenceState(savedPreference);
        colorScheme.setColorScheme(savedPreference);
      })
      .catch(() => {
        colorScheme.setColorScheme('system');
      });
  }, [colorScheme]);

  async function setPreference(nextPreference: ThemePreference) {
    setPreferenceState(nextPreference);
    colorScheme.setColorScheme(nextPreference);
    await saveThemePreference(nextPreference);
  }

  return (
    <ThemeContext.Provider value={{ preference, resolvedPreference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
