import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Card,
  EmptyState,
  Field,
  InlineMessage,
  PrimaryButton,
  SectionTitle,
  SubtleButton,
} from '@/components/ui';
import { formatDateLabel } from '@/lib/date';
import type {
  CombinedHistoryRow,
  MealEditorInput,
  MealEntry,
  MealSuggestion,
  MealType,
} from '@/lib/types';

const mealTypeOptions: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const suggestionDebounceMs = 250;
const suggestionLimit = 5;
const suggestionThreshold = 3;

function formatMealTypeLabel(mealType: MealType) {
  return mealType[0].toUpperCase() + mealType.slice(1);
}

function normalizeMealName(value: string) {
  return value.trim().toLowerCase();
}

function buildMealTimestamp(meal: MealEntry) {
  const match = meal.entryTime.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) {
    return Date.parse(`${meal.entryDate}T00:00:00Z`);
  }

  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3] === 'PM') {
    hours += 12;
  }

  return Date.parse(
    `${meal.entryDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`,
  );
}

type MealEditorRow = MealEntry | CombinedHistoryRow;

function getMealIds(meal: MealEditorRow) {
  return 'mealIds' in meal ? meal.mealIds : [meal.id];
}

function getMealCount(meal: MealEditorRow) {
  return 'count' in meal ? meal.count : 1;
}

function getMealPoints(meal: MealEditorRow) {
  return 'totalPoints' in meal ? meal.totalPoints : meal.points;
}

function getMealCountBadgeId(meal: MealEditorRow) {
  return 'groupKey' in meal ? meal.groupKey : String(meal.id);
}

export function MealEditor({
  date,
  meals,
  suggestionMeals = meals,
  onAdd,
  onUpdate,
  onDelete,
  eyebrow = 'Meals',
  title,
  body,
  emptyTitle = 'No meals yet',
  emptyBody = 'Add one meal to update points for this day.',
}: {
  date: string;
  meals: MealEditorRow[];
  suggestionMeals?: MealEntry[];
  onAdd: (input: MealEditorInput) => Promise<void>;
  onUpdate: (ids: number[], input: MealEditorInput) => Promise<void>;
  onDelete: (ids: number[]) => Promise<void>;
  eyebrow?: string;
  title?: string;
  body?: string;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const insets = useSafeAreaInsets();
  const [mealName, setMealName] = useState('');
  const [points, setPoints] = useState('');
  const [count, setCount] = useState('1');
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [sessionMode, setSessionMode] = useState<'add' | 'edit' | null>(null);
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [initialMealName, setInitialMealName] = useState('');
  const [hasEditedMealName, setHasEditedMealName] = useState(false);
  const [debouncedMealName, setDebouncedMealName] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const editingMeal = useMemo(
    () => meals.find((meal) => meal.id === editingMealId) ?? null,
    [editingMealId, meals],
  );
  const isModalOpen = sessionMode !== null;

  function resetDraft() {
    setMealName('');
    setPoints('');
    setCount('1');
    setMealType(null);
    setSessionMode(null);
    setEditingMealId(null);
    setInitialMealName('');
    setHasEditedMealName(false);
    setDebouncedMealName('');
    setDismissedSuggestions(false);
    setError('');
  }

  function openAddModal() {
    setMealName('');
    setPoints('');
    setCount('1');
    setMealType(null);
    setSessionMode('add');
    setEditingMealId(null);
    setInitialMealName('');
    setHasEditedMealName(false);
    setDebouncedMealName('');
    setDismissedSuggestions(false);
    setError('');
    setMessage('');
  }

  function openEditModal(meal: MealEntry) {
    setMealName(meal.mealName);
    setPoints(String(meal.points));
    setCount(String(getMealCount(meal)));
    setMealType(meal.mealType ?? null);
    setSessionMode('edit');
    setEditingMealId(meal.id);
    setInitialMealName(meal.mealName);
    setHasEditedMealName(false);
    setDebouncedMealName(meal.mealName);
    setDismissedSuggestions(false);
    setError('');
    setMessage('');
  }

  useEffect(() => {
    resetDraft();
    setMessage('');
  }, [date]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedMealName(mealName);
    }, suggestionDebounceMs);

    return () => clearTimeout(timeoutId);
  }, [isModalOpen, mealName]);

  const shouldEvaluateSuggestions =
    isModalOpen &&
    !dismissedSuggestions &&
    (sessionMode === 'add' || hasEditedMealName) &&
    normalizeMealName(debouncedMealName).length >= suggestionThreshold;

  const visibleSuggestions = useMemo(() => {
    if (!shouldEvaluateSuggestions) {
      return [];
    }

    const normalizedQuery = normalizeMealName(debouncedMealName);
    const nextSuggestions: MealSuggestion[] = [];
    const seenNames = new Set<string>();
    const mealsByRecency = [...suggestionMeals].sort((left, right) => {
      const rightTimestamp = buildMealTimestamp(right);
      const leftTimestamp = buildMealTimestamp(left);
      return rightTimestamp - leftTimestamp || right.id - left.id;
    });

    for (const meal of mealsByRecency) {
      const normalizedName = normalizeMealName(meal.mealName);
      if (!normalizedName.startsWith(normalizedQuery) || seenNames.has(normalizedName)) {
        continue;
      }

      seenNames.add(normalizedName);
      nextSuggestions.push({
        displayName: meal.mealName.trim(),
        normalizedName,
        sourceMealId: meal.id,
        sourcePoints: meal.points,
        sourceMealType: meal.mealType ?? null,
      });

      if (nextSuggestions.length === suggestionLimit) {
        break;
      }
    }

    return nextSuggestions;
  }, [debouncedMealName, shouldEvaluateSuggestions, suggestionMeals]);

  function handleMealNameChange(nextMealName: string) {
    setMealName(nextMealName);
    setDismissedSuggestions(false);
    if (sessionMode === 'edit') {
      setHasEditedMealName(nextMealName !== initialMealName);
      return;
    }
    setHasEditedMealName(true);
  }

  function applySuggestion(suggestion: MealSuggestion) {
    setMealName(suggestion.displayName);
    setPoints(String(suggestion.sourcePoints));
    setMealType(suggestion.sourceMealType ?? null);
    setHasEditedMealName(true);
    setDismissedSuggestions(true);
    setError('');
  }

  async function submit() {
    const parsedPoints = Number(points);
    const trimmedCount = count.trim();
    const parsedCount = Number(trimmedCount);

    if (!mealName.trim()) {
      setError('Meal name is required.');
      return;
    }

    if (!Number.isFinite(parsedPoints) || parsedPoints <= 0) {
      setError('Enter a positive points value.');
      return;
    }

    if (!/^\d+$/.test(trimmedCount) || parsedCount < 1 || parsedCount > 99) {
      setError('Enter a whole-number count from 1 to 99.');
      return;
    }

    setError('');

    try {
      const payload = {
        mealName,
        points: parsedPoints,
        entryDate: date,
        mealType,
        count: parsedCount,
      } satisfies MealEditorInput;

      if (sessionMode === 'edit' && editingMeal) {
        await onUpdate(getMealIds(editingMeal), payload);
        setMessage('Meal updated.');
      } else {
        await onAdd(payload);
        setMessage('Meal added.');
      }

      resetDraft();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to save meal.');
    }
  }

  async function remove(meal: MealEditorRow) {
    setError('');
    setMessage('');
    await onDelete(getMealIds(meal));
    if (editingMealId === meal.id) {
      resetDraft();
    }
    setMessage('Meal removed.');
  }

  return (
    <View className="gap-4" testID={`meal-editor-${date}`}>
      <SectionTitle
        eyebrow={eyebrow}
        title={title ?? `Meals for ${formatDateLabel(date).toLowerCase()}`}
        body={body}
      />

      <Card tone="lowest" className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-[20px] font-bold text-[#10201B]">Track meals</Text>
            <Text className="text-[14px] leading-[20px] text-[#51605A]">
              Keep each day accurate with quick meal changes.
            </Text>
          </View>
          <View className="min-w-[120px]">
            <PrimaryButton label="Add meal" onPress={openAddModal} testID="open-add-meal-button" />
          </View>
        </View>
        {message ? <InlineMessage message={message} /> : null}
      </Card>

      {meals.length === 0 ? (
        <EmptyState title={emptyTitle} body={emptyBody} />
      ) : (
        <View className="gap-3">
          {meals.map((meal) => (
            <Card key={meal.id} tone="low" className="gap-3" testID={`meal-entry-${meal.id}`}>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-2">
                  <Text
                    className="text-[13px] font-bold uppercase tracking-[1.3px] text-[#51605A]"
                    testID={`meal-time-${meal.id}`}
                  >
                    {meal.entryTime}
                  </Text>
                  <Text
                    className="text-[22px] font-bold leading-[26px] text-[#10201B]"
                    testID={`meal-name-${meal.id}`}
                  >
                    {meal.mealName}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {getMealCount(meal) > 1 ? (
                      <View
                        className="self-start rounded-full bg-[#E6F1FF] px-3 py-2"
                        testID={`meal-count-badge-${getMealCountBadgeId(meal)}`}
                      >
                        <Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#1358A8]">
                          x{getMealCount(meal)}
                        </Text>
                      </View>
                    ) : null}
                    {meal.mealType ? (
                      <View
                        className="self-start rounded-full bg-[#DDF6EA] px-3 py-2"
                        testID={`meal-type-${meal.id}`}
                      >
                        <Text className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#006C48]">
                          {formatMealTypeLabel(meal.mealType)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View className="rounded-full bg-[#FFFFFF] px-4 py-3">
                  <Text
                    className="text-[18px] font-extrabold text-[#006C48]"
                    testID={`meal-points-${meal.id}`}
                  >
                    {getMealPoints(meal)} pt
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <SubtleButton
                  label="Edit"
                  active={editingMealId === meal.id && isModalOpen}
                  onPress={() => openEditModal(meal)}
                  testID={`edit-meal-${meal.id}`}
                />
                <Pressable
                  className="rounded-full bg-[#FFFFFF] px-4 py-3"
                  onPress={() => void remove(meal)}
                  testID={`delete-meal-${meal.id}`}
                >
                  <Text className="text-[13px] font-bold uppercase tracking-[1px] text-[#994B4B]">
                    Delete
                  </Text>
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Modal
        animationType="fade"
        onRequestClose={resetDraft}
        presentationStyle="overFullScreen"
        transparent
        visible={isModalOpen}
      >
        <View
          className="flex-1 justify-end bg-[#10201B]/50 px-4 pt-10"
          style={{ paddingBottom: 24 + insets.bottom }}
          testID="meal-modal-overlay"
        >
          <Pressable
            className="absolute inset-0"
            onPress={resetDraft}
            testID="meal-modal-dismiss"
          />
          <Card tone="lowest" className="gap-4" testID="meal-modal">
            <View className="gap-2">
              <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
                {sessionMode === 'edit' ? 'Edit meal' : 'Add meal'}
              </Text>
              <Text className="text-[28px] font-extrabold leading-[32px] text-[#10201B]">
                {sessionMode === 'edit' ? 'Update saved meal' : 'Log a meal'}
              </Text>
              <Text className="text-[14px] leading-[20px] text-[#51605A]">
                {formatDateLabel(date)}
              </Text>
            </View>

            <Field
              label="Meal name"
              value={mealName}
              onChangeText={handleMealNameChange}
              placeholder="Greek yogurt bowl"
              testID="meal-name-input"
            />
            {visibleSuggestions.length > 0 ? (
              <View className="gap-2" testID="meal-suggestion-list">
                <Text className="text-[13px] font-bold uppercase tracking-[1.2px] text-[#51605A]">
                  Prior meals
                </Text>
                <View className="gap-2">
                  {visibleSuggestions.map((suggestion, index) => (
                    <Pressable
                      key={suggestion.normalizedName}
                      className="rounded-[22px] bg-[#E9EEEC] px-4 py-3"
                      onPress={() => applySuggestion(suggestion)}
                      testID={`meal-suggestion-row-${index}`}
                    >
                      <Text
                        className="text-[15px] font-bold text-[#10201B]"
                        testID={`meal-suggestion-name-${index}`}
                      >
                        {suggestion.displayName}
                      </Text>
                      <Text
                        className="mt-1 text-[12px] uppercase tracking-[1px] text-[#51605A]"
                        testID={`meal-suggestion-meta-${index}`}
                      >
                        {suggestion.sourceMealType
                          ? `${suggestion.sourcePoints} pt · ${formatMealTypeLabel(suggestion.sourceMealType)}`
                          : `${suggestion.sourcePoints} pt`}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : shouldEvaluateSuggestions ? (
              <InlineMessage
                message="No saved meals match that start yet."
                testID="meal-suggestion-empty"
              />
            ) : null}
            <Field
              label="Points"
              value={points}
              onChangeText={setPoints}
              placeholder="7"
              keyboardType="numeric"
              testID="meal-points-input"
            />
            <Field
              label="Count"
              value={count}
              onChangeText={setCount}
              placeholder="1"
              keyboardType="numeric"
              testID="meal-count-input"
            />

            <View className="gap-3">
              <Text className="text-[13px] font-bold uppercase tracking-[1.4px] text-[#51605A]">
                Meal type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <SubtleButton
                  label="No type"
                  active={mealType === null}
                  onPress={() => setMealType(null)}
                  testID="meal-type-option-none"
                />
                {mealTypeOptions.map((option) => (
                  <SubtleButton
                    key={option}
                    label={formatMealTypeLabel(option)}
                    active={mealType === option}
                    onPress={() => setMealType(option)}
                    testID={`meal-type-option-${option}`}
                  />
                ))}
              </View>
            </View>

            {error ? <InlineMessage message={error} tone="danger" /> : null}

            <View className="flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  label={sessionMode === 'edit' ? 'Save changes' : 'Save meal'}
                  onPress={() => void submit()}
                  testID="save-meal-button"
                />
              </View>
              <SubtleButton label="Cancel" onPress={resetDraft} testID="cancel-meal-modal-button" />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
}
