import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

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
import { formatDateLabel, todayKey } from '@/lib/date';

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
  const latestWeight = sortedWeights[0] ?? null;
  const previousWeight = sortedWeights[1] ?? null;
  const targetWeight = appData.profile?.targetWeight ?? null;

  const weightChange =
    latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : null;
  const remaining =
    latestWeight && targetWeight !== null ? latestWeight.weight - targetWeight : null;
  const trendDirection =
    weightChange === null ? null : weightChange < 0 ? 'down' : weightChange > 0 ? 'up' : 'flat';

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

  if (sortedWeights.length === 0) {
    return (
      <Screen>
        <View className="gap-4" testID="progress-screen">
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
              hint="Use your preferred unit consistently."
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
          <EmptyState
            title="No weight entries yet"
            body="Add your first weight above to unlock your progress overview and details."
            testID="progress-empty-state"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="gap-4" testID="progress-screen">
        <Card tone="low" className="gap-4" testID="progress-overview-card">
          <SectionTitle eyebrow="Progress" title="Weight overview" />
          <View className="flex-row gap-3">
            <Metric
              label="Latest"
              value={latestWeight ? `${latestWeight.weight}` : '—'}
              note={latestWeight ? formatDateLabel(latestWeight.entryDate) : 'No entries yet'}
              accent
              testID="latest-weight-metric"
            />
            <Metric
              label="Goal"
              value={targetWeight !== null ? `${targetWeight}` : '—'}
              note={targetWeight !== null ? 'Target weight' : 'Not set'}
              testID="goal-weight-metric"
            />
          </View>
          <View className="flex-row gap-3">
            <Metric
              label="Change"
              value={
                weightChange !== null
                  ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}`
                  : '—'
              }
              note={
                weightChange !== null
                  ? `${trendDirection === 'down' ? '↓ Trending down' : trendDirection === 'up' ? '↑ Trending up' : '→ Flat'}`
                  : 'Add two entries'
              }
              testID="weight-change-metric"
            />
            <Metric
              label="Remaining"
              value={
                remaining !== null ? `${remaining > 0 ? '+' : ''}${remaining.toFixed(1)}` : '—'
              }
              note={remaining !== null ? 'To goal' : 'Set a goal'}
              testID="weight-remaining-metric"
            />
          </View>
          <View className="rounded-[12px] bg-[#FFFFFF] px-4 py-3">
            <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
              Latest entry
            </Text>
            <Text
              className="mt-1 text-[14px] leading-[20px] text-[#10201B]"
              testID="latest-entry-date"
            >
              {latestWeight ? formatDateLabel(latestWeight.entryDate) : '—'}
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
            hint="Use your preferred unit consistently."
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

        <PrimaryButton
          label="View details"
          onPress={() => router.push('/progress/details')}
          testID="view-details-button"
        />
      </View>
    </Screen>
  );
}
