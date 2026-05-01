import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import * as Notifications from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider } from '@/context/app-data';
import { ThemeProvider } from '@/context/theme';
import { loadWeightReminderSettings } from '@/lib/db';
import {
  configureNotificationHandler,
  handleNotificationResponse,
  registerNotificationCategory,
  scheduleWeeklyWeightReminder,
} from '@/lib/notifications';

configureNotificationHandler();

function RootLayoutInner() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    void registerNotificationCategory();

    void loadWeightReminderSettings().then((s) => {
      if (s.enabled) void scheduleWeeklyWeightReminder(s);
    });

    const sub = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => sub.remove();
  }, []);

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
