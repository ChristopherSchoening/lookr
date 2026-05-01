import '../../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider, useAppData } from '@/context/app-data';
import { ThemeProvider } from '@/context/theme';
import { LoadingScreen } from '@/components/ui';
import { loadWeightReminderSettings } from '@/lib/db';
import {
  configureNotificationHandler,
  handleNotificationResponse,
  registerNotificationCategory,
  scheduleWeeklyWeightReminder,
} from '@/lib/notifications';

configureNotificationHandler();

function e2eQuerySuffix() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return '';
  }

  const e2eEnabled =
    new URLSearchParams(window.location.search).get('e2e') === '1' ||
    window.__LOOKR_E2E__?.enabled === true;
  return e2eEnabled ? '?e2e=1' : '';
}

function RootLayoutInner() {
  const { colorScheme } = useColorScheme();
  const appData = useAppData();
  const router = useRouter();
  const segments = useSegments();
  const firstSegment = String(segments[0] ?? '');

  useEffect(() => {
    if (Platform.OS === 'web') return;

    void registerNotificationCategory();

    void loadWeightReminderSettings().then((s) => {
      if (s.enabled) void scheduleWeeklyWeightReminder(s);
    });

    const sub = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!appData.isReady) return;

    const inOnboarding = firstSegment === 'onboarding';

    if (!appData.profile && !inOnboarding) {
      router.replace(`/onboarding${e2eQuerySuffix()}` as never);
      return;
    }

    if (appData.profile && inOnboarding) {
      router.replace(`/${e2eQuerySuffix()}` as never);
    }
  }, [appData.isReady, appData.profile, firstSegment, router]);

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppDataProvider>
          <RootLayoutInner />
        </AppDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
