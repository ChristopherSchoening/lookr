import { Pressable, Text, View } from 'react-native';

import { Screen, SectionTitle } from '@/components/ui';
import { useTheme } from '@/context/theme';
import type { ThemePreference } from '@/lib/types';

const themeOptions: { value: ThemePreference; label: string; note: string }[] = [
  { value: 'light', label: 'Light', note: 'Always use light appearance' },
  { value: 'dark', label: 'Dark', note: 'Always use dark appearance' },
  { value: 'system', label: 'System', note: 'Follow device setting' },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();

  return (
    <Screen>
      <View className="gap-4" testID="settings-screen">
        <SectionTitle
          eyebrow="Settings"
          title="Appearance"
          body="Choose how lookr looks on this device."
        />
        <View className="gap-3">
          {themeOptions.map((option) => {
            const active = preference === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className={`rounded-[26px] px-5 py-5 ${
                  active ? 'bg-[#102E24]' : 'bg-[#F2F4F5] dark:bg-[#162119]'
                }`}
                onPress={() => void setPreference(option.value)}
                testID={`theme-option-${option.value}`}
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="gap-1">
                    <Text
                      className={`text-[17px] font-bold ${
                        active ? 'text-white' : 'text-[#10201B] dark:text-[#E8F0EC]'
                      }`}
                    >
                      {option.label}
                    </Text>
                    <Text
                      className={`text-[13px] leading-[18px] ${
                        active ? 'text-[#9BE8C9]' : 'text-[#51605A] dark:text-[#8FA49B]'
                      }`}
                    >
                      {option.note}
                    </Text>
                  </View>
                  {active ? (
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-[#00D18E]">
                      <Text className="text-[12px] font-bold text-[#063423]">✓</Text>
                    </View>
                  ) : (
                    <View className="h-6 w-6 rounded-full border-2 border-[#D9E1DD] dark:border-[#2A3D35]" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
