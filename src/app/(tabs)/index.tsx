import { useState } from 'react';
import { Text, View } from 'react-native';

import { DateNavigator } from '@/components/date-navigator';
import { MealEditor } from '@/components/meal-editor';
import {
  AppHeader,
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
      <View className="gap-5">
        <AppHeader
          eyebrow="The clinical curator"
          title="Track points with less friction and more signal."
          body="A calm editorial dashboard for your daily point budget, meal corrections, and steady progress."
        />

        {!appData.profile ? (
          <Card tone="emerald" className="gap-4">
            <SectionTitle
              eyebrow="Setup"
              title="Set your fixed daily point budget."
              body="This single number becomes the baseline for every day in the first release."
            />
            <Field
              label="Daily point limit"
              value={dailyLimitInput}
              onChangeText={setDailyLimitInput}
              placeholder="24"
              keyboardType="numeric"
            />
            {profileError ? <InlineMessage message={profileError} tone="danger" /> : null}
            <PrimaryButton label="Start tracking" onPress={() => void createProfile()} />
          </Card>
        ) : (
          <>
            <Card tone="emerald" className="gap-4">
              <View className="gap-1">
                <Text className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#9BE8C9]">
                  {formatDateLabel(selectedDate)}
                </Text>
                <Text className="text-[16px] leading-[22px] text-[#D7EEE5]">
                  {summary.status === 'over'
                    ? `You are ${overBy} points over today.`
                    : summary.status === 'empty'
                      ? 'No meals logged yet for this day.'
                      : 'A precise view of what remains for the day.'}
                </Text>
              </View>

              <Text className="text-[56px] font-extrabold leading-[58px] text-white">
                {summary.remainingPoints}
              </Text>

              <View className="flex-row gap-3">
                <Metric
                  label="Consumed"
                  value={`${summary.consumedPoints}`}
                  note={`${summary.mealCount} logged meals`}
                />
                <Metric
                  label="Daily limit"
                  value={`${summary.dailyLimit}`}
                  note="Fixed across all days"
                  accent
                />
              </View>
            </Card>

            <Card tone="low" className="gap-4">
              <SectionTitle
                eyebrow="Date focus"
                title="Review today or correct a prior day."
                body="The dashboard supports manual backfilling and edits for past days without touching future dates."
              />
              <DateNavigator date={selectedDate} onChange={setSelectedDate} />
            </Card>

            <MealEditor
              date={selectedDate}
              meals={meals}
              onAdd={appData.addMeal}
              onUpdate={appData.updateMeal}
              onDelete={appData.deleteMeal}
            />
          </>
        )}

        {appData.profile ? (
          <Card tone="lowest" className="gap-3">
            <SectionTitle
              eyebrow="Product edge"
              title="Manual in now, calculator later."
              body="The MVP optimizes for fast manual entry. Nutrition-based point calculation stays out of the critical path for this version."
            />
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}
