import { useState } from 'react';
import { Text, View } from 'react-native';

import { DateNavigator } from '@/components/date-navigator';
import { MealEditor } from '@/components/meal-editor';
import {
  Card,
  Field,
  InlineMessage,
  LoadingScreen,
  Metric,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel, todayKey } from '@/lib/date';

export default function DashboardScreen() {
  const appData = useAppData();
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [dailyLimitInput, setDailyLimitInput] = useState('');
  const [profileError, setProfileError] = useState('');

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const summary = appData.getSummaryByDate(selectedDate);
  const meals = appData.getMealsByDate(selectedDate);
  const overBy = Math.abs(summary.remainingPoints);

  async function createProfile() {
    const nextLimit = Number(dailyLimitInput);
    if (!Number.isFinite(nextLimit) || nextLimit <= 0) {
      setProfileError('Enter a positive daily point limit.');
      return;
    }

    setProfileError('');
    await appData.saveProfile(nextLimit);
    setDailyLimitInput('');
  }

  return (
    <Screen>
      <View className="gap-4" testID="dashboard-screen">
        {!appData.profile ? (
          <Card tone="emerald" className="gap-4" testID="profile-setup-card">
            <SectionTitle
              eyebrow="Home"
              title="Set your daily points."
              body="This limit stays fixed until you change it."
            />
            <Field
              label="Daily point limit"
              value={dailyLimitInput}
              onChangeText={setDailyLimitInput}
              placeholder="24"
              keyboardType="numeric"
              testID="daily-limit-input"
            />
            {profileError ? <InlineMessage message={profileError} tone="danger" /> : null}
            <PrimaryButton
              label="Start tracking"
              onPress={() => void createProfile()}
              testID="start-tracking-button"
            />
          </Card>
        ) : (
          <>
            <Card tone="emerald" className="gap-4" testID="daily-summary-card">
              <View className="gap-1">
                <Text
                  className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#9BE8C9]"
                  testID="selected-date-label"
                >
                  {formatDateLabel(selectedDate)}
                </Text>
                <Text className="text-[16px] leading-[22px] text-[#D7EEE5]" testID="summary-status">
                  {summary.status === 'over'
                    ? `${overBy} points over today.`
                    : summary.status === 'empty'
                      ? 'No meals yet today.'
                      : `${summary.remainingPoints} points left today.`}
                </Text>
              </View>

              <Text
                className="text-[56px] font-extrabold leading-[58px] text-white"
                testID="remaining-points-value"
              >
                {summary.remainingPoints}
              </Text>

              <View className="flex-row gap-3">
                <Metric
                  label="Consumed"
                  value={`${summary.consumedPoints}`}
                  note={`${summary.mealCount} logged meals`}
                  testID="consumed-points-metric"
                />
                <Metric
                  label="Daily limit"
                  value={`${summary.dailyLimit}`}
                  note="Daily target"
                  accent
                  testID="daily-limit-metric"
                />
              </View>
            </Card>

            <Card tone="low" className="gap-4" testID="date-focus-card">
              <SectionTitle
                eyebrow="Day"
                title="Pick a day"
                body="Use past days for backfill or corrections."
              />
              <DateNavigator date={selectedDate} onChange={setSelectedDate} />
            </Card>

            <MealEditor
              body="Add, edit, or remove meals for this day."
              date={selectedDate}
              emptyBody="Add one meal to start the day total."
              emptyTitle="No meals yet"
              meals={meals}
              onAdd={appData.addMeal}
              onUpdate={appData.updateMeal}
              onDelete={appData.deleteMeal}
            />
          </>
        )}
      </View>
    </Screen>
  );
}
