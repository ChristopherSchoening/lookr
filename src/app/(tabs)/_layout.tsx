import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBarBaseHeight = 68;
const tabBarPaddingTop = 6;
const tabBarPaddingBottom = 12;

const tabIcons = {
  index: 'home-variant-outline',
  history: 'history',
  progress: 'chart-line',
  settings: 'cog-outline',
} as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const resolvedPaddingBottom = Math.max(bottomInset, tabBarPaddingBottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#00D18E' : '#006C48',
        tabBarInactiveTintColor: isDark ? '#7A9089' : '#6D7A74',
        tabBarStyle: {
          backgroundColor: isDark ? '#0F1A16' : '#F8FAFB',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#2A3D35' : '#D9E1DD',
          height: tabBarBaseHeight + resolvedPaddingBottom,
          paddingTop: tabBarPaddingTop,
          paddingBottom: resolvedPaddingBottom,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButtonTestID: 'tab-button-home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={tabIcons.index}
              size={size}
              testID="tab-icon-home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarButtonTestID: 'tab-button-history',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={tabIcons.history}
              size={size}
              testID="tab-icon-history"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarButtonTestID: 'tab-button-settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={tabIcons.settings}
              size={size}
              testID="tab-icon-settings"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarButtonTestID: 'tab-button-progress',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={tabIcons.progress}
              size={size}
              testID="tab-icon-progress"
            />
          ),
        }}
      />
    </Tabs>
  );
}
