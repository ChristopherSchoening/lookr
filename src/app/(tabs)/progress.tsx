import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DateNavigator } from '@/components/date-navigator';
import {
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
  const previousWeight = sortedWeights[1];
  const weightDelta =
    latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : 0;
  const trackedSummaries = appData.summaries.filter((summary) => summary.mealCount > 0);
  const trackedDays = trackedSummaries.length;
  const withinDays = trackedSummaries.filter((summary) => summary.status === 'within').length;

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
      <View className="gap-4" testID="progress-screen">
        <Card tone="low" className="gap-4" testID="progress-overview-card">
          <SectionTitle
            eyebrow="Progress"
            title="Core progress"
            body="Weight, adherence, and change since the last track."
          />
          <View className="flex-row gap-3">
            <Metric
              label="Latest"
              value={latestWeight ? `${latestWeight.weight}` : '—'}
              note={latestWeight ? formatDateLabel(latestWeight.entryDate) : 'No entries yet'}
              accent
              testID="latest-weight-metric"
            />
            <Metric
              label="Adherence"
              value={trackedDays > 0 ? `${withinDays}/${trackedDays}` : '—'}
              note="Days within effective point limit"
              testID="adherence-metric"
            />
          </View>
          <View className="rounded-[24px] bg-[#FFFFFF] px-4 py-4">
            <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
              Change since last track
            </Text>
            <Text className="mt-2 text-[28px] font-extrabold text-[#10201B]" testID="weight-delta">
              {latestWeight && previousWeight
                ? `${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)}`
                : 'Add entries'}
            </Text>
            <Text className="mt-1 text-[14px] leading-[20px] text-[#51605A]">
              {latestWeight && previousWeight
                ? `From ${formatDateLabel(previousWeight.entryDate).toLowerCase()} to ${formatDateLabel(latestWeight.entryDate).toLowerCase()}.`
                : 'Add two weights to compare the latest change.'}
            </Text>
          </View>
        </Card>

        <Card tone="lowest" className="gap-4" testID="record-weight-card">
          <SectionTitle
            eyebrow="Log weight"
            title="One entry per day"
            body="Saving again for the same date updates that day."
          />
          <DateNavigator date={entryDate} onChange={setEntryDate} />
          <Field
            label="Weight"
            value={weightInput}
            onChangeText={setWeightInput}
            placeholder="82.4"
            keyboardType="decimal-pad"
            hint="Use your preferred unit consistently for this MVP."
            testID="weight-input"
          />
          {error ? <InlineMessage message={error} tone="danger" /> : null}
          {message ? <InlineMessage message={message} /> : null}
          <PrimaryButton
            label="Save weight"
            onPress={() => void submitWeight()}
            testID="save-weight-button"
          />
        </Card>

        {sortedWeights.length === 0 ? (
          <EmptyState
            title="No weight trend yet"
            body="Add a first weight to unlock history and trend."
          />
        ) : (
          <>
            <Card tone="low" className="gap-4" testID="weight-trend-card">
              <SectionTitle eyebrow="Trend" title="Recent weight trend" />
              <View className="flex-row items-end gap-3">
                {sortedWeights
                  .slice(0, 6)
                  .reverse()
                  .map((entry) => (
                    <View key={entry.id} className="flex-1 gap-2">
                      <View
                        className="rounded-t-[20px] bg-[#00D18E]"
                        style={{ height: chartHeight(entry.weight) }}
                        testID={`weight-bar-${entry.entryDate}`}
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
                body="Newest entries stay at the top."
              />
              {sortedWeights.map((entry) => (
                <Card
                  key={entry.id}
                  tone="lowest"
                  className="gap-3"
                  testID={`weight-entry-${entry.entryDate}`}
                >
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
                      <Text
                        className="text-[18px] font-extrabold text-[#006C48]"
                        testID={`weight-value-${entry.entryDate}`}
                      >
                        {entry.weight}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    className="self-start rounded-full bg-[#F2F4F5] px-4 py-3"
                    onPress={() => void appData.deleteWeight(entry.id)}
                    testID={`delete-weight-${entry.entryDate}`}
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
