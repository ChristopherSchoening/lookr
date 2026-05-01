import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InlineMessage, PrimaryButton } from '@/components/ui';
import { useAppData } from '@/context/app-data';

type StepId = 'welcome' | 'idea' | 'current' | 'target' | 'limit';

type Step = {
  id: StepId;
  eyebrow: string;
  title: string;
  body: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const steps: Step[] = [
  {
    id: 'welcome',
    eyebrow: 'Welcome',
    title: 'lookr keeps the day simple.',
    body: 'Set a few basics once, then track meals against a daily points limit.',
    icon: 'star-four-points',
  },
  {
    id: 'idea',
    eyebrow: 'Basic idea',
    title: 'Points guide meals. Weight shows the trend.',
    body: 'Each meal spends points from today. Weight entries keep progress honest without crowding home.',
    icon: 'chart-timeline-variant-shimmer',
  },
  {
    id: 'current',
    eyebrow: 'Current weight',
    title: 'Where are you now?',
    body: 'Use the same unit you already track with. lookr will save this as today.',
    icon: 'scale-bathroom',
  },
  {
    id: 'target',
    eyebrow: 'Target weight',
    title: 'Where are you headed?',
    body: 'This gives the progress screen a clear remaining-to-goal number.',
    icon: 'bullseye-arrow',
  },
  {
    id: 'limit',
    eyebrow: 'Daily points',
    title: 'Pick the daily limit.',
    body: 'This becomes today and future days. You can adjust it later in Progress.',
    icon: 'gauge',
  },
];

function parsePositiveNumber(value: string) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function StepInput({
  label,
  value,
  placeholder,
  onChangeText,
  testID,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  testID: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[12px] font-bold uppercase tracking-[1.6px] text-[#51605A] dark:text-[#8FA49B]">
        {label}
      </Text>
      <TextInput
        className="rounded-[28px] border border-[#D9E1DD] bg-white px-5 py-5 text-[30px] font-extrabold text-[#10201B] dark:border-[#2A3D35] dark:bg-[#1C2A22] dark:text-[#E8F0EC]"
        keyboardType="decimal-pad"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7D8B85"
        testID={testID}
        value={value}
      />
    </View>
  );
}

function ProgressRail({ activeIndex }: { activeIndex: number }) {
  return (
    <View className="flex-row gap-2" testID="onboarding-progress">
      {steps.map((step, index) => (
        <View
          key={step.id}
          className={`h-2 flex-1 rounded-full ${
            index <= activeIndex ? 'bg-[#00D18E]' : 'bg-[#D9E1DD] dark:bg-[#2A3D35]'
          }`}
        />
      ))}
    </View>
  );
}

function IdeaVisual() {
  return (
    <View className="gap-3" testID="onboarding-idea-visual">
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-[28px] bg-[#102E24] p-4">
          <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#9BE8C9]">
            Today
          </Text>
          <Text className="mt-2 text-[38px] font-extrabold leading-[42px] text-white">18</Text>
          <Text className="mt-1 text-[13px] leading-[18px] text-[#D7EEE5]">points left</Text>
        </View>
        <View className="flex-1 rounded-[28px] bg-[#E9EEEC] p-4 dark:bg-[#233029]">
          <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#51605A] dark:text-[#8FA49B]">
            Trend
          </Text>
          <View className="mt-5 flex-row items-end gap-2">
            {[52, 66, 44, 74].map((height, index) => (
              <View
                key={index}
                className={`flex-1 rounded-t-2xl ${index === 3 ? 'bg-[#00D18E]' : 'bg-[#B4F0CD]'}`}
                style={{ height }}
              />
            ))}
          </View>
        </View>
      </View>
      <View className="rounded-[28px] border border-[#D9E1DD] bg-white p-4 dark:border-[#2A3D35] dark:bg-[#1C2A22]">
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-bold text-[#10201B] dark:text-[#E8F0EC]">
            Lunch bowl
          </Text>
          <Text className="text-[15px] font-extrabold text-[#006C48]">6 pt</Text>
        </View>
        <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#E9EEEC] dark:bg-[#233029]">
          <View className="h-2 w-[62%] rounded-full bg-[#00D18E]" />
        </View>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const appData = useAppData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentWeightInput, setCurrentWeightInput] = useState('');
  const [targetWeightInput, setTargetWeightInput] = useState('');
  const [dailyLimitInput, setDailyLimitInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const activeStep = steps[activeIndex];
  const isFinalStep = activeStep.id === 'limit';

  function validateStep(step: Step) {
    if (step.id === 'current') {
      const currentWeight = parsePositiveNumber(currentWeightInput);
      return currentWeight !== null && currentWeight >= 30 && currentWeight <= 300
        ? ''
        : 'Weight must be between 30 and 300.';
    }

    if (step.id === 'target') {
      const targetWeight = parsePositiveNumber(targetWeightInput);
      return targetWeight !== null && targetWeight >= 30 && targetWeight <= 300
        ? ''
        : 'Target weight must be between 30 and 300.';
    }

    if (step.id === 'limit') {
      const dailyLimit = parsePositiveNumber(dailyLimitInput);
      return dailyLimit !== null && dailyLimit > 0
        ? ''
        : 'Daily point limit must be a positive number.';
    }

    return '';
  }

  async function handleNext() {
    const nextError = validateStep(activeStep);
    if (nextError) {
      setError(nextError);
      return;
    }

    setError('');

    if (!isFinalStep) {
      setActiveIndex((index) => Math.min(index + 1, steps.length - 1));
      return;
    }

    const currentWeight = parsePositiveNumber(currentWeightInput);
    const targetWeight = parsePositiveNumber(targetWeightInput);
    const dailyPointsLimit = parsePositiveNumber(dailyLimitInput);

    if (currentWeight === null || targetWeight === null || dailyPointsLimit === null) {
      setError('Finish each setup value before starting.');
      return;
    }

    setSaving(true);
    try {
      await appData.saveOnboarding({ currentWeight, targetWeight, dailyPointsLimit });
      router.replace('/');
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    setError('');
    setActiveIndex((index) => Math.max(index - 1, 0));
  }

  function renderStepBody() {
    if (activeStep.id === 'idea') {
      return <IdeaVisual />;
    }

    if (activeStep.id === 'current') {
      return (
        <StepInput
          label="Current weight"
          onChangeText={(value) => {
            setCurrentWeightInput(value);
            if (error) setError('');
          }}
          placeholder="82.4"
          testID="onboarding-current-weight-input"
          value={currentWeightInput}
        />
      );
    }

    if (activeStep.id === 'target') {
      return (
        <StepInput
          label="Target weight"
          onChangeText={(value) => {
            setTargetWeightInput(value);
            if (error) setError('');
          }}
          placeholder="78"
          testID="onboarding-target-weight-input"
          value={targetWeightInput}
        />
      );
    }

    if (activeStep.id === 'limit') {
      return (
        <StepInput
          label="Daily points limit"
          onChangeText={(value) => {
            setDailyLimitInput(value);
            if (error) setError('');
          }}
          placeholder="24"
          testID="onboarding-daily-limit-input"
          value={dailyLimitInput}
        />
      );
    }

    return (
      <View className="gap-3" testID="onboarding-welcome-visual">
        <View className="rounded-[30px] bg-[#102E24] p-5">
          <Text className="text-[12px] font-bold uppercase tracking-[1.6px] text-[#9BE8C9]">
            Ready base
          </Text>
          <Text className="mt-3 text-[42px] font-extrabold leading-[44px] text-white">0</Text>
          <Text className="mt-1 text-[15px] leading-[22px] text-[#D7EEE5]">meals logged today</Text>
        </View>
        <View className="flex-row gap-3">
          {['Limit', 'Weight', 'Goal'].map((label) => (
            <View
              key={label}
              className="flex-1 rounded-[24px] bg-[#E9EEEC] px-3 py-4 dark:bg-[#233029]"
            >
              <Text className="text-center text-[12px] font-bold uppercase tracking-[1px] text-[#51605A] dark:text-[#8FA49B]">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFB] dark:bg-[#0F1A16]" testID="onboarding-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="min-h-full justify-between gap-6 px-5 pb-8 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-6">
            <ProgressRail activeIndex={activeIndex} />

            <View className="gap-5">
              <View className="h-16 w-16 items-center justify-center rounded-[24px] bg-[#B4F0CD]">
                <MaterialCommunityIcons color="#063423" name={activeStep.icon} size={32} />
              </View>

              <View className="gap-3">
                <Text
                  className="text-[12px] font-bold uppercase tracking-[1.6px] text-[#006C48]"
                  testID="onboarding-eyebrow"
                >
                  {activeStep.eyebrow}
                </Text>
                <Text
                  className="max-w-[340px] text-[42px] font-extrabold leading-[46px] text-[#10201B] dark:text-[#E8F0EC]"
                  testID="onboarding-title"
                >
                  {activeStep.title}
                </Text>
                <Text
                  className="max-w-[360px] text-[16px] leading-[24px] text-[#51605A] dark:text-[#8FA49B]"
                  testID="onboarding-body"
                >
                  {activeStep.body}
                </Text>
              </View>
            </View>

            {renderStepBody()}

            {error ? (
              <View testID="onboarding-error">
                <InlineMessage message={error} tone="danger" />
              </View>
            ) : null}
          </View>

          <View className="gap-3">
            <PrimaryButton
              disabled={saving}
              label={isFinalStep ? (saving ? 'Saving' : 'Start lookr') : 'Continue'}
              onPress={() => void handleNext()}
              testID={isFinalStep ? 'onboarding-finish-button' : 'onboarding-next-button'}
            />
            {activeIndex > 0 ? (
              <Pressable
                accessibilityRole="button"
                className="items-center rounded-full px-5 py-4"
                disabled={saving}
                onPress={handleBack}
                testID="onboarding-back-button"
              >
                <Text className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#51605A] dark:text-[#8FA49B]">
                  Back
                </Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
