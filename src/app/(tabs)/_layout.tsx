import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBarBaseHeight = 68;
const tabBarPaddingTop = 6;
const tabBarPaddingBottom = 12;

const tabIcons = {
  index: 'home-variant-outline',
  history: 'history',
  progress: 'chart-line',
} as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const resolvedPaddingBottom = Math.max(bottomInset, tabBarPaddingBottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#006C48',
        tabBarInactiveTintColor: '#6D7A74',
        tabBarStyle: {
          backgroundColor: '#F8FAFB',
          borderTopWidth: 1,
          borderTopColor: '#D9E1DD',
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
