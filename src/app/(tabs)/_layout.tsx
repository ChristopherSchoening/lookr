import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const floatingTabBarHeight = 84;
const floatingTabBarBottomOffset = 12;
const floatingTabBarHorizontalOffset = 12;
const floatingTabBarPaddingTop = 10;
const floatingTabBarPaddingBottom = 12;

const tabIcons = {
  index: 'home-variant-outline',
  history: 'history',
  progress: 'chart-line',
} as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const resolvedBottomOffset = Math.max(bottomInset, floatingTabBarBottomOffset);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#006C48',
        tabBarInactiveTintColor: '#6D7A74',
        tabBarStyle: {
          backgroundColor: 'rgba(248, 250, 251, 0.9)',
          borderTopWidth: 0,
          position: 'absolute',
          height: floatingTabBarHeight,
          paddingTop: floatingTabBarPaddingTop,
          paddingBottom: floatingTabBarPaddingBottom,
          left: floatingTabBarHorizontalOffset,
          right: floatingTabBarHorizontalOffset,
          bottom: resolvedBottomOffset,
          borderRadius: 16,
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
