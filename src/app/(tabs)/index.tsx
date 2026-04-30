import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { MealEditor } from '@/components/meal-editor';
import { Card, LoadingScreen, Metric, PrimaryButton, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel, todayKey } from '@/lib/date';

export default function DashboardScreen() {
  const appData = useAppData();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayKey());

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const summary = appData.getSummaryByDate(selectedDate);
  const meals = appData.getMealsByDate(selectedDate);
  const overBy = Math.abs(summary.remainingPoints);

  return (
    <Screen>
      <View className="gap-4" testID="dashboard-screen">
        {!appData.profile ? (
          <Card tone="emerald" className="gap-4" testID="profile-setup-card">
            <SectionTitle
              eyebrow="Home"
              title="Set points in Progress."
              body="Home shows today's budget after setup."
            />
            <PrimaryButton
              label="Open Progress"
              onPress={() => router.push('/progress')}
              testID="open-progress-limit-setup-button"
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

            <MealEditor
              body="Add, edit, or remove meals for this day."
              date={selectedDate}
              emptyBody="Add one meal to start the day total."
              emptyTitle="No meals yet"
              meals={meals}
              onAdd={appData.addMeal}
              onUpdate={appData.updateMealGroup}
              onDelete={appData.deleteMealGroup}
              suggestionMeals={appData.meals}
            />
          </>
        )}
      </View>
    </Screen>
  );
}
