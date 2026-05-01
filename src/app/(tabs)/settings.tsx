import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

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

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTimeString(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderWeekday, setReminderWeekday] = useState(0);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    void loadWeightReminderSettings().then((s) => {
      setReminderEnabled(s.enabled);
      setReminderWeekday(s.weekday);
      setReminderTime(s.time);
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

  function handleTimeChange(event: DateTimePickerEvent, date?: Date) {
    setShowTimePicker(false);
    if (event.type === 'set' && date) {
      const timeStr = dateToTimeString(date);
      setReminderTime(timeStr);
      void applyReminderSettings({
        enabled: reminderEnabled,
        weekday: reminderWeekday,
        time: timeStr,
      });
    }
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
            const note = option.value === 'system' ? `System preference` : option.note;
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
                      ? `Every ${weekdays[reminderWeekday]} at ${formatTime12h(reminderTime)}`
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

                <Pressable
                  className="rounded-[26px] bg-[#F2F4F5] px-5 py-4 dark:bg-[#162119]"
                  onPress={() => setShowTimePicker(true)}
                  testID="reminder-time-button"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[15px] text-[#51605A] dark:text-[#8FA49B]">Time</Text>
                    <Text className="text-[17px] font-semibold text-[#10201B] dark:text-[#E8F0EC]">
                      {formatTime12h(reminderTime)}
                    </Text>
                  </View>
                </Pressable>

                {showTimePicker && (
                  <DateTimePicker
                    value={timeStringToDate(reminderTime)}
                    mode="time"
                    is24Hour={false}
                    onChange={handleTimeChange}
                    testID="reminder-time-picker"
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}
