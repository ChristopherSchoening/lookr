import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Screen, SectionTitle } from '@/components/ui';
import { useTheme } from '@/context/theme';
import {
  loadWeightReminderSettings,
  saveWeightReminderSettings,
  type WeightReminderSettings,
} from '@/lib/db';
import {
  cancelWeightReminder,
  requestNotificationPermission,
  scheduleWeeklyWeightReminder,
} from '@/lib/notifications';
import type { ThemePreference } from '@/lib/types';

const themeOptions: { value: ThemePreference; label: string; note: string }[] = [
  { value: 'light', label: 'Light', note: 'Always use light appearance' },
  { value: 'dark', label: 'Dark', note: 'Always use dark appearance' },
  { value: 'system', label: 'System preference', note: 'Follow device setting' },
];

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function isValidTime(value: string): boolean {
  const parts = value.split(':');
  if (parts.length !== 2) return false;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return /^\d{1,2}:\d{2}$/.test(value) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

export default function SettingsScreen() {
  const { preference, systemPreference, setPreference } = useTheme();

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderWeekday, setReminderWeekday] = useState(0);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [timeInput, setTimeInput] = useState('08:00');
  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    void loadWeightReminderSettings().then((s) => {
      setReminderEnabled(s.enabled);
      setReminderWeekday(s.weekday);
      setReminderTime(s.time);
      setTimeInput(s.time);
    });
  }, []);

  async function applyReminderSettings(settings: WeightReminderSettings) {
    await saveWeightReminderSettings(settings);
    if (settings.enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        const reverted = { ...settings, enabled: false };
        setReminderEnabled(false);
        await saveWeightReminderSettings(reverted);
        return;
      }
      await scheduleWeeklyWeightReminder(settings);
    } else {
      await cancelWeightReminder();
    }
  }

  function handleToggle() {
    const next = !reminderEnabled;
    setReminderEnabled(next);
    void applyReminderSettings({ enabled: next, weekday: reminderWeekday, time: reminderTime });
  }

  function handleWeekdaySelect(day: number) {
    setReminderWeekday(day);
    void applyReminderSettings({ enabled: reminderEnabled, weekday: day, time: reminderTime });
  }

  function handleTimeBlur() {
    if (!isValidTime(timeInput)) {
      setTimeError('Enter time as HH:MM (e.g. 08:30)');
      return;
    }
    setTimeError('');
    setReminderTime(timeInput);
    void applyReminderSettings({
      enabled: reminderEnabled,
      weekday: reminderWeekday,
      time: timeInput,
    });
  }

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
            const note =
              option.value === 'system'
                ? `System preference: ${systemPreference === 'dark' ? 'Dark' : 'Light'}`
                : option.note;
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
                      testID={`theme-option-note-${option.value}`}
                    >
                      {note}
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

        {Platform.OS !== 'web' && (
          <View className="gap-3">
            <SectionTitle
              eyebrow="Reminders"
              title="Weekly weight reminder"
              body="Get a notification to log your weight once a week."
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: reminderEnabled }}
              className={`rounded-[26px] px-5 py-5 ${
                reminderEnabled ? 'bg-[#102E24]' : 'bg-[#F2F4F5] dark:bg-[#162119]'
              }`}
              onPress={handleToggle}
              testID="reminder-toggle"
            >
              <View className="flex-row items-center justify-between gap-3">
                <View className="gap-1">
                  <Text
                    className={`text-[17px] font-bold ${
                      reminderEnabled ? 'text-white' : 'text-[#10201B] dark:text-[#E8F0EC]'
                    }`}
                  >
                    {reminderEnabled ? 'Reminder on' : 'Reminder off'}
                  </Text>
                  <Text
                    className={`text-[13px] leading-[18px] ${
                      reminderEnabled ? 'text-[#9BE8C9]' : 'text-[#51605A] dark:text-[#8FA49B]'
                    }`}
                  >
                    {reminderEnabled
                      ? `Every ${weekdays[reminderWeekday]} at ${reminderTime}`
                      : 'Tap to enable'}
                  </Text>
                </View>
                {reminderEnabled ? (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-[#00D18E]">
                    <Text className="text-[12px] font-bold text-[#063423]">✓</Text>
                  </View>
                ) : (
                  <View className="h-6 w-6 rounded-full border-2 border-[#D9E1DD] dark:border-[#2A3D35]" />
                )}
              </View>
            </Pressable>

            {reminderEnabled && (
              <View className="gap-3">
                <View className="flex-row gap-2">
                  {weekdays.map((label, i) => {
                    const active = reminderWeekday === i;
                    return (
                      <Pressable
                        key={label}
                        onPress={() => handleWeekdaySelect(i)}
                        className={`flex-1 items-center rounded-2xl py-2 ${
                          active ? 'bg-[#102E24]' : 'bg-[#F2F4F5] dark:bg-[#162119]'
                        }`}
                        testID={`reminder-weekday-${i}`}
                      >
                        <Text
                          className={`text-[12px] font-semibold ${
                            active ? 'text-white' : 'text-[#51605A] dark:text-[#8FA49B]'
                          }`}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="gap-1">
                  <TextInput
                    className="rounded-[26px] bg-[#F2F4F5] px-5 py-4 text-[17px] text-[#10201B] dark:bg-[#162119] dark:text-[#E8F0EC]"
                    value={timeInput}
                    onChangeText={setTimeInput}
                    onBlur={handleTimeBlur}
                    onSubmitEditing={handleTimeBlur}
                    placeholder="08:00"
                    placeholderTextColor="#51605A"
                    keyboardType="numbers-and-punctuation"
                    testID="reminder-time-input"
                  />
                  {timeError !== '' && (
                    <Text className="px-2 text-[13px] text-red-500">{timeError}</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}
