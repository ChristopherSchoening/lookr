import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DateNavigator } from '@/components/date-navigator';
import {
  AppHeader,
  Card,
  EmptyState,
  Field,
  InlineMessage,
  LoadingScreen,
  Metric,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel, formatLongDate, todayKey } from '@/lib/date';

export default function ProgressScreen() {
  const appData = useAppData();
  const [entryDate, setEntryDate] = useState(todayKey());
  const [weightInput, setWeightInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const sortedWeights = appData.weights;
  const latestWeight = sortedWeights[0];
  const oldestWeight = sortedWeights[sortedWeights.length - 1];
  const weightDelta =
    latestWeight && oldestWeight && latestWeight.id !== oldestWeight.id
      ? latestWeight.weight - oldestWeight.weight
      : 0;
  const trackedDays = appData.summaries.filter((summary) => summary.mealCount > 0).length;
  const withinDays = appData.summaries.filter((summary) => summary.status === 'within').length;

  async function submitWeight() {
    const parsedWeight = Number(weightInput);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      setError('Enter a positive weight value.');
      return;
    }

    setError('');
    await appData.saveWeight({ entryDate, weight: parsedWeight });
    setWeightInput('');
    setMessage(`Weight saved for ${formatDateLabel(entryDate).toLowerCase()}.`);
  }

  function chartHeight(weight: number) {
    if (sortedWeights.length <= 1) return 80;
    const values = sortedWeights.map((entry) => entry.weight);
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (max === min) return 80;
    return 44 + ((weight - min) / (max - min)) * 72;
  }

  return (
    <Screen>
      <View className="gap-5">
        <AppHeader
          eyebrow="Progress"
          title="Weight context, not daily panic."
          body="Record body weight over time and compare it with how often you stay inside the point budget."
        />

        <Card tone="low" className="gap-4">
          <SectionTitle
            eyebrow="Overview"
            title="Weight and adherence at a glance"
            body="The first release stays lightweight: a clean history, a simple trend view, and adherence context from tracked days."
          />
          <View className="flex-row gap-3">
            <Metric
              label="Latest"
              value={latestWeight ? `${latestWeight.weight}` : '—'}
              note={latestWeight ? formatDateLabel(latestWeight.entryDate) : 'No entries yet'}
              accent
            />
            <Metric
              label="Adherence"
              value={trackedDays > 0 ? `${withinDays}/${trackedDays}` : '—'}
              note="Days within point limit"
            />
          </View>
          <View className="rounded-[24px] bg-[#FFFFFF] px-4 py-4">
            <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
              Weight change
            </Text>
            <Text className="mt-2 text-[28px] font-extrabold text-[#10201B]">
              {latestWeight && oldestWeight
                ? `${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)}`
                : 'Add entries'}
            </Text>
            <Text className="mt-1 text-[14px] leading-[20px] text-[#51605A]">
              {latestWeight && oldestWeight
                ? `From ${formatDateLabel(oldestWeight.entryDate).toLowerCase()} to ${formatDateLabel(latestWeight.entryDate).toLowerCase()}.`
                : 'Once you log multiple weights, this view highlights the directional trend.'}
            </Text>
          </View>
        </Card>

        <Card tone="lowest" className="gap-4">
          <SectionTitle
            eyebrow="Record weight"
            title="One entry per day"
            body="Saving again for the same date updates the recorded value instead of duplicating it."
          />
          <DateNavigator date={entryDate} onChange={setEntryDate} />
          <Field
            label="Weight"
            value={weightInput}
            onChangeText={setWeightInput}
            placeholder="82.4"
            keyboardType="decimal-pad"
            hint="Use your preferred unit consistently for this MVP."
          />
          {error ? <InlineMessage message={error} tone="danger" /> : null}
          {message ? <InlineMessage message={message} /> : null}
          <PrimaryButton label="Save weight" onPress={() => void submitWeight()} />
        </Card>

        {sortedWeights.length === 0 ? (
          <EmptyState
            title="No weight trend yet"
            body="Start with a first entry to unlock the progress history and simple trend visualization."
          />
        ) : (
          <>
            <Card tone="low" className="gap-4">
              <SectionTitle
                eyebrow="Trend"
                title="Recent weight curve"
                body="A restrained bar view keeps the screen editorial and easy to scan."
              />
              <View className="flex-row items-end gap-3">
                {sortedWeights
                  .slice(0, 6)
                  .reverse()
                  .map((entry) => (
                    <View key={entry.id} className="flex-1 gap-2">
                      <View
                        className="rounded-t-[20px] bg-[#00D18E]"
                        style={{ height: chartHeight(entry.weight) }}
                      />
                      <Text className="text-center text-[12px] font-bold uppercase tracking-[1px] text-[#51605A]">
                        {formatDateLabel(entry.entryDate)}
                      </Text>
                    </View>
                  ))}
              </View>
            </Card>

            <View className="gap-3">
              <SectionTitle
                eyebrow="Logbook"
                title="Recorded weights"
                body="Use the newest entries to check whether the points rhythm is moving in the right direction."
              />
              {sortedWeights.map((entry) => (
                <Card key={entry.id} tone="lowest" className="gap-3">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="gap-1">
                      <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
                        {formatDateLabel(entry.entryDate)}
                      </Text>
                      <Text className="text-[22px] font-bold leading-[26px] text-[#10201B]">
                        {formatLongDate(entry.entryDate)}
                      </Text>
                    </View>
                    <View className="rounded-full bg-[#F2F4F5] px-4 py-3">
                      <Text className="text-[18px] font-extrabold text-[#006C48]">
                        {entry.weight}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    className="self-start rounded-full bg-[#F2F4F5] px-4 py-3"
                    onPress={() => void appData.deleteWeight(entry.id)}
                  >
                    <Text className="text-[13px] font-bold uppercase tracking-[1px] text-[#994B4B]">
                      Delete entry
                    </Text>
                  </Pressable>
                </Card>
              ))}
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
