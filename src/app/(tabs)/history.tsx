import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { DateNavigator } from '@/components/date-navigator';
import { MealEditor } from '@/components/meal-editor';
import { Card, EmptyState, LoadingScreen, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel, formatLongDate, startOfMonth, todayKey } from '@/lib/date';
import type { CombinedHistoryRow, MealEntry } from '@/lib/types';

function buildHistoryGroupKey(meal: MealEntry) {
  return JSON.stringify([
    meal.entryDate,
    meal.entryTime,
    meal.mealType ?? null,
    meal.points,
    meal.mealName,
  ]);
}

function buildHistoryGroupTestId(mealIds: number[]) {
  return `meal-group-${mealIds.join('-')}`;
}

function combineHistoryMeals(meals: MealEntry[]): CombinedHistoryRow[] {
  const grouped = new Map<string, MealEntry[]>();

  for (const meal of meals) {
    const key = buildHistoryGroupKey(meal);
    const groupMeals = grouped.get(key) ?? [];
    groupMeals.push(meal);
    grouped.set(key, groupMeals);
  }

  return [...grouped.values()].map((groupMeals) => {
    const representative = groupMeals[0];
    const mealIds = groupMeals.map((meal) => meal.id);
    const count = mealIds.length;

    return {
      ...representative,
      groupKey: buildHistoryGroupTestId(mealIds),
      mealIds,
      count,
      totalPoints: representative.points * count,
    };
  });
}

export default function HistoryScreen() {
  const appData = useAppData();
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));

  useEffect(() => {
    setVisibleMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const meals = appData.getMealsByDate(selectedDate);
  const groupedMeals = combineHistoryMeals(meals);
  const summary = appData.getSummaryByDate(selectedDate);
  const hasTrackedMeals = appData.hasTrackedMeals(selectedDate);

  function handleDateChange(date: string) {
    setSelectedDate(date);
  }

  return (
    <Screen>
      <View className="gap-4" testID="history-screen">
        <View className="gap-3">
          <SectionTitle
            eyebrow="History"
            title="Pick any day"
            body="Jump fast to logged days. Empty days still stay open below."
          />
          <Card tone="lowest" className="gap-4">
            <DateNavigator
              date={selectedDate}
              onChange={handleDateChange}
              onMonthChange={setVisibleMonth}
              trackedDates={appData.trackedDates}
              variant="picker"
              visibleMonth={visibleMonth}
            />
          </Card>
        </View>

        {hasTrackedMeals ? (
          <Card tone="emerald" className="gap-3" testID="history-selected-summary-card">
            <View className="flex-row items-start justify-between gap-3">
              <View className="gap-1">
                <Text
                  className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#9BE8C9]"
                  testID="history-selected-summary-label"
                >
                  {formatDateLabel(summary.date)}
                </Text>
                <Text
                  className="text-[23px] font-bold leading-[28px] text-white"
                  testID="history-selected-summary-title"
                >
                  {formatLongDate(summary.date)}
                </Text>
              </View>
              <View className="rounded-full bg-white/90 px-4 py-3">
                <Text
                  className="text-[16px] font-extrabold text-[#006C48]"
                  testID="history-selected-summary-points"
                >
                  {summary.consumedPoints}/{summary.dailyLimit}
                </Text>
              </View>
            </View>
            <Text
              className="text-[14px] leading-[20px] text-[#D7EEE5]"
              testID="history-selected-summary-status"
            >
              {summary.status === 'over'
                ? `${Math.abs(summary.remainingPoints)} points over limit`
                : `${summary.remainingPoints} points remaining`}
            </Text>
          </Card>
        ) : (
          <View testID="history-empty-day-state">
            <EmptyState
              title="No meals on this day"
              body="This date stays selected. Add the first meal below."
            />
          </View>
        )}

        <MealEditor
          body="Edit, add, or remove meals for this day."
          date={selectedDate}
          emptyBody="Pick another day or add the first meal here."
          emptyTitle="No meals on this day"
          eyebrow="Corrections"
          meals={groupedMeals}
          onAdd={appData.addMeal}
          onUpdate={appData.updateMealGroup}
          onDelete={appData.deleteMealGroup}
          suggestionMeals={appData.meals}
          title={`Meals for ${formatDateLabel(selectedDate).toLowerCase()}`}
        />
      </View>
    </Screen>
  );
}
