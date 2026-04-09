import { Tabs } from 'expo-router';

export default function TabsLayout() {
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
          height: 84,
          paddingTop: 10,
          paddingBottom: 12,
          marginHorizontal: 12,
          marginBottom: 12,
          borderRadius: 28,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
    </Tabs>
  );
}
