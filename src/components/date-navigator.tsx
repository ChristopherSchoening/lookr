import { Text, View } from 'react-native';

import { formatDateLabel, formatLongDate, shiftDate, todayKey } from '@/lib/date';
import { SubtleButton } from '@/components/ui';

export function DateNavigator({
  date,
  onChange,
}: {
  date: string;
  onChange: (date: string) => void;
}) {
  const today = todayKey();
  const nextDisabled = date >= today;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <SubtleButton label="Earlier" onPress={() => onChange(shiftDate(date, -1))} />
        <SubtleButton
          label="Later"
          onPress={() => onChange(shiftDate(date, 1))}
          disabled={nextDisabled}
        />
      </View>
      <View className="gap-1 px-1">
        <Text className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#51605A]">
          {formatDateLabel(date)}
        </Text>
        <Text className="text-[15px] leading-[20px] text-[#6D7A74]">{formatLongDate(date)}</Text>
      </View>
    </View>
  );
}
