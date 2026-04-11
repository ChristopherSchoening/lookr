import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
import type { MealEntry } from '@/lib/types';

export function MealEditor({
  date,
  meals,
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
  meals: MealEntry[];
  onAdd: (input: { mealName: string; points: number; entryDate: string }) => Promise<void>;
  onUpdate: (
    id: number,
    input: { mealName: string; points: number; entryDate: string },
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  eyebrow?: string;
  title?: string;
  body?: string;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const [mealName, setMealName] = useState('');
  const [points, setPoints] = useState('');
  const [editing, setEditing] = useState<MealEntry | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMealName('');
    setPoints('');
    setEditing(null);
    setError('');
    setMessage('');
  }, [date]);

  async function submit() {
    const parsedPoints = Number(points);

    if (!mealName.trim()) {
      setError('Meal name is required.');
      return;
    }

    if (!Number.isFinite(parsedPoints) || parsedPoints <= 0) {
      setError('Enter a positive points value.');
      return;
    }

    setError('');

    try {
      if (editing) {
        await onUpdate(editing.id, {
          mealName,
          points: parsedPoints,
          entryDate: date,
        });
        setMessage('Meal updated.');
      } else {
        await onAdd({
          mealName,
          points: parsedPoints,
          entryDate: date,
        });
        setMessage('Meal added.');
      }

      setMealName('');
      setPoints('');
      setEditing(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to save meal.');
    }
  }

  async function remove(id: number) {
    setError('');
    setMessage('');
    await onDelete(id);
    if (editing?.id === id) {
      setEditing(null);
      setMealName('');
      setPoints('');
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

      <Card tone="lowest" className="gap-4" testID="meal-editor-form">
        <Field
          label={editing ? 'Edit meal name' : 'Meal name'}
          value={mealName}
          onChangeText={setMealName}
          placeholder="Greek yogurt bowl"
          testID="meal-name-input"
        />
        <Field
          label="Points"
          value={points}
          onChangeText={setPoints}
          placeholder="7"
          keyboardType="numeric"
          testID="meal-points-input"
        />
        {error ? <InlineMessage message={error} tone="danger" /> : null}
        {message ? <InlineMessage message={message} /> : null}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <PrimaryButton
              label={editing ? 'Save changes' : 'Add meal'}
              onPress={() => void submit()}
              testID="save-meal-button"
            />
          </View>
          {editing ? (
            <SubtleButton
              label="Cancel"
              onPress={() => {
                setEditing(null);
                setMealName('');
                setPoints('');
                setError('');
              }}
              testID="cancel-meal-edit-button"
            />
          ) : null}
        </View>
      </Card>

      {meals.length === 0 ? (
        <EmptyState title={emptyTitle} body={emptyBody} />
      ) : (
        <View className="gap-3">
          {meals.map((meal) => (
            <Card key={meal.id} tone="low" className="gap-3" testID={`meal-entry-${meal.id}`}>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
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
                </View>
                <View className="rounded-full bg-[#FFFFFF] px-4 py-3">
                  <Text
                    className="text-[18px] font-extrabold text-[#006C48]"
                    testID={`meal-points-${meal.id}`}
                  >
                    {meal.points} pt
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <SubtleButton
                  label="Edit"
                  active={editing?.id === meal.id}
                  onPress={() => {
                    setEditing(meal);
                    setMealName(meal.mealName);
                    setPoints(String(meal.points));
                    setError('');
                    setMessage('');
                  }}
                  testID={`edit-meal-${meal.id}`}
                />
                <Pressable
                  className="rounded-full bg-[#FFFFFF] px-4 py-3"
                  onPress={() => void remove(meal.id)}
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
    </View>
  );
}
