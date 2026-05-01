import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { saveWeight } from '@/lib/db';
import { todayKey } from '@/lib/date';
import type { WeightReminderSettings } from '@/lib/db';

const CATEGORY_ID = 'WEIGHT_REMINDER';
const ACTION_ID = 'LOG_WEIGHT';
const NOTIFICATION_ID = 'weekly-weight-reminder';

export function configureNotificationHandler() {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const existing = (await Notifications.getPermissionsAsync()) as { granted: boolean };
  if (existing.granted) return true;
  const result = (await Notifications.requestPermissionsAsync()) as { granted: boolean };
  return result.granted;
}

export async function registerNotificationCategory() {
  if (Platform.OS === 'web') return;
  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: ACTION_ID,
      buttonTitle: 'Log weight',
      textInput: { submitButtonTitle: 'Save', placeholder: 'e.g. 82.4' },
      options: { opensAppToForeground: false },
    },
  ]);
}

// expo-notifications weekly trigger weekday: 1=Sun, 2=Mon … 7=Sat
// Internal weekday: 0=Mon … 6=Sun
function toExpoWeekday(weekday: number): number {
  return weekday === 6 ? 1 : weekday + 2;
}

export async function scheduleWeeklyWeightReminder(settings: WeightReminderSettings) {
  if (Platform.OS === 'web') return;
  const [h, m] = settings.time.split(':').map(Number);
  await cancelWeightReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: 'Time to log your weight',
      body: 'Reply with your weight to log it right here.',
      categoryIdentifier: CATEGORY_ID,
      data: { action: 'weight_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: toExpoWeekday(settings.weekday),
      hour: h,
      minute: m,
    },
  });
}

export async function cancelWeightReminder() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
}

export function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data as Record<string, unknown>;
  if (data?.action !== 'weight_reminder') return;
  if (response.actionIdentifier !== ACTION_ID) return;
  if (!response.userText) return;

  const parsed = Number(response.userText.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    // Android RemoteInput cannot block invalid input at OS level — fire error notification
    void Notifications.scheduleNotificationAsync({
      content: {
        title: 'Invalid weight',
        body: 'Enter a positive number (e.g. 82.4). Open the app to log your weight.',
      },
      trigger: null,
    });
    return;
  }

  void saveWeight({ entryDate: todayKey(), weight: parsed }).then(() => {
    void Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weight logged',
        body: `${parsed} saved for today.`,
      },
      trigger: null,
    });
  });
}
