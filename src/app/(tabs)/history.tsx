import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MealEditor } from '@/components/meal-editor';
import { AppHeader, Card, EmptyState, LoadingScreen, Screen, SectionTitle } from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel, formatLongDate, todayKey } from '@/lib/date';

export default function HistoryScreen() {
  const appData = useAppData();
  const [selectedDate, setSelectedDate] = useState(todayKey());

  useEffect(() => {
    if (
      appData.summaries.length > 0 &&
      !appData.summaries.some((item) => item.date === selectedDate)
    ) {
      setSelectedDate(appData.summaries[0]?.date ?? todayKey());
    }
  }, [appData.summaries, selectedDate]);

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const meals = appData.getMealsByDate(selectedDate);

  return (
    <Screen>
      <View className="gap-5">
        <AppHeader
          eyebrow="History"
          title="Revisit tracked days without losing the signal."
          body="A day-level archive for spotting patterns, validating adherence, and correcting missed or mistyped meals."
        />

        {appData.summaries.length === 0 ? (
          <EmptyState
            title="No tracked history yet"
            body="Once meals are logged, each day appears here with a concise summary and correction path."
          />
        ) : (
          <>
            <View className="gap-3">
              <SectionTitle
                eyebrow="Tracked days"
                title="Recent summaries"
                body="Choose a day to inspect the meal list and make corrections."
              />
              {appData.summaries.map((summary) => (
                <Pressable key={summary.date} onPress={() => setSelectedDate(summary.date)}>
                  <Card
                    tone={selectedDate === summary.date ? 'emerald' : 'lowest'}
                    className="gap-3"
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="gap-1">
                        <Text
                          className={`text-[13px] font-bold uppercase tracking-[1.6px] ${
                            selectedDate === summary.date ? 'text-[#9BE8C9]' : 'text-[#51605A]'
                          }`}
                        >
                          {formatDateLabel(summary.date)}
                        </Text>
                        <Text
                          className={`text-[23px] font-bold leading-[28px] ${
                            selectedDate === summary.date ? 'text-white' : 'text-[#10201B]'
                          }`}
                        >
                          {formatLongDate(summary.date)}
                        </Text>
                      </View>
                      <View className="rounded-full bg-white/90 px-4 py-3">
                        <Text className="text-[16px] font-extrabold text-[#006C48]">
                          {summary.consumedPoints}/{summary.dailyLimit}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-[14px] leading-[20px] ${
                        selectedDate === summary.date ? 'text-[#D7EEE5]' : 'text-[#51605A]'
                      }`}
                    >
                      {summary.status === 'over'
                        ? `${Math.abs(summary.remainingPoints)} points over limit`
                        : summary.status === 'empty'
                          ? 'Untracked or empty day'
                          : `${summary.remainingPoints} points remaining`}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>

            <MealEditor
              date={selectedDate}
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
