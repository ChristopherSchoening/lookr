import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppDataProvider } from '@/context/app-data';

export default function RootLayout() {
  return (
    <AppDataProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </AppDataProvider>
  );
}
