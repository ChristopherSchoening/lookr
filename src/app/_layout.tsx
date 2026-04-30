import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider } from '@/context/app-data';
import { ThemeProvider } from '@/context/theme';

function RootLayoutInner() {
  const { colorScheme } = useColorScheme();
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
