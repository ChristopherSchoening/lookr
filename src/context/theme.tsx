import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Platform, useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';

import { loadThemePreference, saveThemePreference } from '@/lib/db';
import type { ThemePreference } from '@/lib/types';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedPreference: Exclude<ThemePreference, 'system'>;
  systemPreference: Exclude<ThemePreference, 'system'>;
  setPreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolvedPreference: 'light',
  systemPreference: 'light',
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
  const colorSchemeRef = useRef(colorScheme);
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const hasLoadedPreference = useRef(false);
  const resolvedSystemPreference = systemColorScheme === 'dark' ? 'dark' : 'light';
  const resolvedPreference = preference === 'system' ? resolvedSystemPreference : preference;

  useEffect(() => {
    colorSchemeRef.current = colorScheme;
  }, [colorScheme]);

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

  useLayoutEffect(() => {
    syncWebThemeClass(resolvedPreference);
    if (Platform.OS !== 'web') {
      return;
    }

    const frame = window.requestAnimationFrame(() => syncWebThemeClass(resolvedPreference));
    const timeout = window.setTimeout(() => syncWebThemeClass(resolvedPreference), 0);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [resolvedPreference]);

  useEffect(() => {
    colorSchemeRef.current.setColorScheme(
      Platform.OS === 'web' && preference === 'system' ? resolvedPreference : preference,
    );
  }, [preference, resolvedPreference]);

  async function setPreference(nextPreference: ThemePreference) {
    setPreferenceState(nextPreference);
    await saveThemePreference(nextPreference);
  }

  return (
    <ThemeContext.Provider
      value={{
        preference,
        resolvedPreference,
        systemPreference: resolvedSystemPreference,
        setPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
