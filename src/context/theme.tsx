import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform, useColorScheme as useSystemColorScheme } from 'react-native';
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

function syncWebThemeClass(resolvedPreference: Exclude<ThemePreference, 'system'>) {
  if (Platform.OS !== 'web') {
    return;
  }

  document.documentElement.classList.toggle('dark', resolvedPreference === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const hasLoadedPreference = useRef(false);
  const resolvedSystemPreference = systemColorScheme === 'dark' ? 'dark' : 'light';
  const resolvedPreference = preference === 'system' ? resolvedSystemPreference : preference;

  useEffect(() => {
    if (hasLoadedPreference.current) {
      return;
    }
    hasLoadedPreference.current = true;

    void loadThemePreference()
      .then((savedPreference) => {
        setPreferenceState(savedPreference);
      })
      .catch(() => {
        setPreferenceState('system');
      });
  }, []);

  useEffect(() => {
    syncWebThemeClass(resolvedPreference);
    colorScheme.setColorScheme(
      Platform.OS === 'web' && preference === 'system' ? resolvedPreference : preference,
    );
  }, [colorScheme, preference, resolvedPreference]);

  async function setPreference(nextPreference: ThemePreference) {
    setPreferenceState(nextPreference);
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
