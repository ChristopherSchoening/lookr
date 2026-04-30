import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ScrollViewProps,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, shadowCard, typography } from '@/design/tokens';

const floatingTabBarBottomOffset = 12;
const floatingTabBarContentClearance = 100;

export function Screen({
  children,
  ...props
}: ScrollViewProps & {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const resolvedBottomOffset = Math.max(bottomInset, floatingTabBarBottomOffset);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFB] dark:bg-[#0F1A16]" testID="screen-root">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4"
        contentContainerStyle={{
          paddingBottom: floatingTabBarContentClearance + resolvedBottomOffset,
        }}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function AppHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <View
      className="gap-3 rounded-[32px] bg-[#F2F4F5] px-5 py-5 dark:bg-[#162119]"
      style={shadowCard}
    >
      <View className="self-start rounded-full bg-[#E9EEEC] px-3 py-2 dark:bg-[#233029]">
        <Text className={`${typography.label} text-[#006C48]`}>{eyebrow}</Text>
      </View>
      <Text className={`${typography.headline} max-w-[280px] text-[#10201B] dark:text-[#E8F0EC]`}>
        {title}
      </Text>
      <Text className={`${typography.body} max-w-[320px] text-[#51605A] dark:text-[#8FA49B]`}>
        {body}
      </Text>
    </View>
  );
}

export function Card({
  children,
  tone = 'low',
  className = '',
  ...props
}: ViewProps & {
  children: React.ReactNode;
  tone?: 'low' | 'lowest' | 'emerald' | 'danger';
  className?: string;
}) {
  const background =
    tone === 'emerald'
      ? 'bg-[#102E24]'
      : tone === 'lowest'
        ? 'bg-[#FFFFFF] dark:bg-[#1C2A22]'
        : tone === 'danger'
          ? 'bg-[#F5DEDE] dark:bg-[#3A2020]'
          : 'bg-[#F2F4F5] dark:bg-[#162119]';

  return (
    <View
      className={`rounded-[30px] p-5 ${background} ${className}`.trim()}
      style={shadowCard}
      {...props}
    >
      {children}
    </View>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <View className="gap-2 px-1">
      <Text className={`${typography.label} text-[#51605A] dark:text-[#8FA49B]`}>{eyebrow}</Text>
      <Text className={`${typography.title} text-[#10201B] dark:text-[#E8F0EC]`}>{title}</Text>
      {body ? (
        <Text className={`${typography.body} text-[#51605A] dark:text-[#8FA49B]`}>{body}</Text>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  testID,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      className={`items-center rounded-full px-5 py-4 ${
        disabled ? 'bg-[#B9D3C9]' : 'bg-[#00D18E]'
      }`}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <Text className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#063423]">
        {label}
      </Text>
    </Pressable>
  );
}

export function SubtleButton({
  label,
  onPress,
  active = false,
  disabled = false,
  testID,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      className={`rounded-full px-4 py-3 ${active ? 'bg-[#B4F0CD]' : 'bg-[#E9EEEC] dark:bg-[#233029]'} ${disabled ? 'opacity-45' : 'opacity-100'}`}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <Text
        className={`text-[13px] font-bold uppercase tracking-[1px] ${active ? 'text-[#10201B]' : 'text-[#10201B] dark:text-[#E8F0EC]'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  ...props
}: TextInputProps & {
  label: string;
  hint?: string;
}) {
  return (
    <View className="gap-2">
      <Text className={`${typography.label} text-[#51605A] dark:text-[#8FA49B]`}>{label}</Text>
      <TextInput
        className="rounded-[24px] bg-[#FFFFFF] px-4 py-4 text-[16px] text-[#10201B] dark:bg-[#1C2A22] dark:text-[#E8F0EC]"
        placeholderTextColor="#7D8B85"
        {...props}
      />
      {hint ? (
        <Text className="text-[13px] leading-[18px] text-[#6D7A74] dark:text-[#7A9089]">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function Metric({
  label,
  value,
  note,
  accent = false,
  testID,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
  testID?: string;
}) {
  return (
    <View
      className={`flex-1 rounded-[26px] px-4 py-4 ${accent ? 'bg-[#FFFFFF] dark:bg-[#1C2A22]' : 'bg-[#E9EEEC] dark:bg-[#233029]'}`}
      testID={testID}
    >
      <Text className={`${typography.label} text-[#51605A] dark:text-[#8FA49B]`}>{label}</Text>
      <Text className="mt-2 text-[30px] font-extrabold text-[#10201B] dark:text-[#E8F0EC]">
        {value}
      </Text>
      <Text className="mt-1 text-[13px] leading-[18px] text-[#51605A] dark:text-[#8FA49B]">
        {note}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  body,
  testID,
}: {
  title: string;
  body: string;
  testID?: string;
}) {
  return (
    <Card tone="low" className="gap-2" testID={testID}>
      <Text className={`${typography.title} text-[#10201B] dark:text-[#E8F0EC]`}>{title}</Text>
      <Text className={`${typography.body} text-[#51605A] dark:text-[#8FA49B]`}>{body}</Text>
    </Card>
  );
}

export function InlineMessage({
  message,
  tone = 'neutral',
  testID,
}: {
  message: string;
  tone?: 'neutral' | 'danger';
  testID?: string;
}) {
  const background =
    tone === 'danger' ? 'bg-[#F5DEDE] dark:bg-[#3A2020]' : 'bg-[#F2F4F5] dark:bg-[#162119]';
  const textColor =
    tone === 'danger' ? 'text-[#994B4B] dark:text-[#E07070]' : 'text-[#51605A] dark:text-[#8FA49B]';

  return (
    <View className={`rounded-[22px] px-4 py-3 ${background}`} testID={testID}>
      <Text className={`text-[14px] leading-[20px] ${textColor}`}>{message}</Text>
    </View>
  );
}

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#F8FAFB] dark:bg-[#0F1A16]">
      <ActivityIndicator size="small" color={colors.primary} />
      <Text className="mt-4 text-[14px] uppercase tracking-[1.6px] text-[#51605A] dark:text-[#8FA49B]">
        Preparing lookr
      </Text>
    </SafeAreaView>
  );
}
