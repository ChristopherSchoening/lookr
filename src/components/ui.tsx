import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ScrollViewProps,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, shadowCard, typography } from '@/design/tokens';

export function Screen({
  children,
  ...props
}: ScrollViewProps & {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFB]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-28 pt-4"
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
    <View className="gap-3 rounded-[32px] bg-white/85 px-5 py-5" style={shadowCard}>
      <View className="self-start rounded-full bg-[#F2F4F5] px-3 py-2">
        <Text className={`${typography.label} text-[#006C48]`}>{eyebrow}</Text>
      </View>
      <Text className={`${typography.headline} max-w-[280px] text-[#10201B]`}>{title}</Text>
      <Text className={`${typography.body} max-w-[320px] text-[#51605A]`}>{body}</Text>
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
        ? 'bg-[#FFFFFF]'
        : tone === 'danger'
          ? 'bg-[#F5DEDE]'
          : 'bg-[#F2F4F5]';

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
      <Text className={`${typography.label} text-[#51605A]`}>{eyebrow}</Text>
      <Text className={`${typography.title} text-[#10201B]`}>{title}</Text>
      {body ? <Text className={`${typography.body} text-[#51605A]`}>{body}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      className={`items-center rounded-full px-5 py-4 ${
        disabled ? 'bg-[#B9D3C9]' : 'bg-[#00D18E]'
      }`}
      disabled={disabled}
      onPress={onPress}
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
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      className={`rounded-full px-4 py-3 ${active ? 'bg-[#B4F0CD]' : 'bg-[#E9EEEC]'} ${disabled ? 'opacity-45' : 'opacity-100'}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className="text-[13px] font-bold uppercase tracking-[1px] text-[#10201B]">{label}</Text>
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
      <Text className={`${typography.label} text-[#51605A]`}>{label}</Text>
      <TextInput
        className="rounded-[24px] bg-[#FFFFFF] px-4 py-4 text-[16px] text-[#10201B]"
        placeholderTextColor="#7D8B85"
        {...props}
      />
      {hint ? <Text className="text-[13px] leading-[18px] text-[#6D7A74]">{hint}</Text> : null}
    </View>
  );
}

export function Metric({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <View className={`flex-1 rounded-[26px] px-4 py-4 ${accent ? 'bg-[#FFFFFF]' : 'bg-[#E9EEEC]'}`}>
      <Text className={`${typography.label} text-[#51605A]`}>{label}</Text>
      <Text className="mt-2 text-[30px] font-extrabold text-[#10201B]">{value}</Text>
      <Text className="mt-1 text-[13px] leading-[18px] text-[#51605A]">{note}</Text>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card tone="lowest" className="gap-2">
      <Text className={`${typography.title} text-[#10201B]`}>{title}</Text>
      <Text className={`${typography.body} text-[#51605A]`}>{body}</Text>
    </Card>
  );
}

export function InlineMessage({
  message,
  tone = 'neutral',
}: {
  message: string;
  tone?: 'neutral' | 'danger';
}) {
  const background = tone === 'danger' ? colors.dangerSoft : colors.surfaceLow;
  const textColor = tone === 'danger' ? colors.danger : colors.textMuted;

  return (
    <View className="rounded-[22px] px-4 py-3" style={{ backgroundColor: background }}>
      <Text className="text-[14px] leading-[20px]" style={{ color: textColor }}>
        {message}
      </Text>
    </View>
  );
}

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#F8FAFB]">
      <ActivityIndicator size="small" color={colors.primary} />
      <Text className="mt-4 text-[14px] uppercase tracking-[1.6px] text-[#51605A]">
        Preparing lookr
      </Text>
    </SafeAreaView>
  );
}
