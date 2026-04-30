import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { WeightChart } from '@/components/weight-chart';
import {
  Card,
  EmptyState,
  Field,
  InlineMessage,
  LoadingScreen,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '@/components/ui';
import { useAppData } from '@/context/app-data';
import { formatDateLabel } from '@/lib/date';
import type { WeightEntry } from '@/lib/types';

function computeYRange(
  entries: WeightEntry[],
  targetWeight: number | null,
): { yMin: number; yMax: number } {
  if (entries.length === 0) return { yMin: 0, yMax: 100 };

  const weights = entries.map((e) => e.weight);
  const highestLogged = Math.max(...weights);
  const lowestLogged = Math.min(...weights);

  if (targetWeight !== null) {
    const candidateMin = targetWeight - 5;
    const candidateMax = highestLogged + 5;
    const yMin = Math.min(candidateMin, lowestLogged - 5);
    const yMax = Math.max(candidateMax, targetWeight + 5);
    return { yMin, yMax };
  }

  return { yMin: lowestLogged - 5, yMax: highestLogged + 5 };
}

type EditState = {
  id: number;
  weightInput: string;
  dateInput: string;
  error: string;
};

export default function WeightDetailsScreen() {
  const appData = useAppData();
  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  if (!appData.isReady) {
    return <LoadingScreen />;
  }

  const sortedDesc = [...appData.weights].sort((a, b) => b.entryDate.localeCompare(a.entryDate));
  const sortedAsc = [...sortedDesc].reverse();

  const targetWeight = appData.profile?.targetWeight ?? null;
  const { yMin, yMax } = computeYRange(sortedAsc, targetWeight);

  function startEdit(entry: WeightEntry) {
    setEditState({
      id: entry.id,
      weightInput: String(entry.weight),
      dateInput: entry.entryDate,
      error: '',
    });
    setDeleteConfirmId(null);
  }

  function cancelEdit() {
    setEditState(null);
  }

  async function saveEdit() {
    if (!editState) return;

    const parsed = Number(editState.weightInput);
    if (!Number.isFinite(parsed) || parsed < 30 || parsed > 300) {
      setEditState({ ...editState, error: 'Weight must be between 30 and 300 kg' });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(editState.dateInput)) {
      setEditState({ ...editState, error: 'Date must be in YYYY-MM-DD format' });
      return;
    }

    const duplicateEntry = appData.weights.find(
      (w) => w.entryDate === editState.dateInput && w.id !== editState.id,
    );
    if (duplicateEntry) {
      setEditState({ ...editState, error: 'An entry for this date already exists' });
      return;
    }

    try {
      await appData.updateWeight(editState.id, {
        entryDate: editState.dateInput,
        weight: parsed,
      });
      setEditState(null);
    } catch {
      setEditState({ ...editState, error: 'Failed to save. Please try again.' });
    }
  }

  function startDelete(id: number) {
    setDeleteConfirmId(id);
    setEditState(null);
  }

  async function confirmDelete() {
    if (deleteConfirmId === null) return;
    await appData.deleteWeight(deleteConfirmId);
    setDeleteConfirmId(null);
  }

  function cancelDelete() {
    setDeleteConfirmId(null);
  }

  if (sortedDesc.length === 0) {
    return (
      <Screen>
        <View className="gap-4" testID="weight-details-screen">
          <EmptyState
            title="No weight entries yet"
            body="Add your first weight from the progress overview."
            testID="weight-details-empty"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="gap-4" testID="weight-details-screen">
        <SectionTitle eyebrow="Weight" title="Weight log" body="All recorded entries." />

        {sortedAsc.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <WeightChart
              entries={sortedAsc}
              targetWeight={targetWeight}
              yMin={yMin}
              yMax={yMax}
              testID="weight-chart"
            />
          </ScrollView>
        )}

        {targetWeight === null && sortedAsc.length > 0 && (
          <InlineMessage message="Set a target weight to enable goal-based chart scaling." />
        )}

        <PrimaryButton
          label="Add entry"
          onPress={() => {
            router.push('/progress');
          }}
          testID="add-entry-button"
        />

        <View className="gap-3">
          {sortedDesc.map((entry) => {
            const isEditing = editState?.id === entry.id;
            const isConfirmingDelete = deleteConfirmId === entry.id;

            return (
              <Card key={entry.id} tone="lowest" className="gap-3" testID="weight-entry-row">
                {isEditing ? (
                  <View className="gap-3">
                    <Field
                      label="Weight (kg)"
                      value={editState.weightInput}
                      onChangeText={(v) =>
                        setEditState({ ...editState, weightInput: v, error: '' })
                      }
                      keyboardType="decimal-pad"
                      placeholder="82.4"
                      testID="edit-weight-input"
                    />
                    <Field
                      label="Date (YYYY-MM-DD)"
                      value={editState.dateInput}
                      onChangeText={(v) => setEditState({ ...editState, dateInput: v, error: '' })}
                      placeholder="2024-01-15"
                      testID="edit-date-input"
                    />
                    {editState.error ? (
                      <InlineMessage
                        message={editState.error}
                        tone="danger"
                        testID="edit-error-message"
                      />
                    ) : null}
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <PrimaryButton
                          label="Save"
                          onPress={() => void saveEdit()}
                          testID="save-edit-button"
                        />
                      </View>
                      <View className="flex-1">
                        <PrimaryButton
                          label="Cancel"
                          onPress={cancelEdit}
                          testID="cancel-edit-button"
                        />
                      </View>
                    </View>
                  </View>
                ) : isConfirmingDelete ? (
                  <View className="gap-3">
                    <Text className="text-[14px] leading-[20px] text-[#10201B]">
                      Delete entry for {formatDateLabel(entry.entryDate)}?
                    </Text>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <PrimaryButton
                          label="Delete"
                          onPress={() => void confirmDelete()}
                          testID="confirm-delete-button"
                        />
                      </View>
                      <View className="flex-1">
                        <PrimaryButton
                          label="Cancel"
                          onPress={cancelDelete}
                          testID="cancel-delete-button"
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="gap-1">
                      <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
                        {formatDateLabel(entry.entryDate)}
                      </Text>
                      <Text
                        className="text-[22px] font-bold leading-[26px] text-[#10201B]"
                        testID="entry-weight-value"
                      >
                        {entry.weight.toFixed(1)}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="rounded-full bg-[#F2F4F5] px-4 py-3">
                        <Text
                          className="text-[13px] font-bold uppercase tracking-[1px] text-[#10201B]"
                          onPress={() => startEdit(entry)}
                          testID="edit-weight-button"
                        >
                          Edit
                        </Text>
                      </View>
                      <View className="rounded-full bg-[#F5DEDE] px-4 py-3">
                        <Text
                          className="text-[13px] font-bold uppercase tracking-[1px] text-[#994B4B]"
                          onPress={() => startDelete(entry.id)}
                          testID="delete-weight-button"
                        >
                          Delete
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
