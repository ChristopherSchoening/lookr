import { Pressable, Text, View } from 'react-native';

import { SubtleButton } from '@/components/ui';
import {
  buildMonthGrid,
  formatDateLabel,
  formatLongDate,
  formatMonthLabel,
  isSameMonth,
  shiftDate,
  shiftMonth,
  startOfMonth,
  todayKey,
} from '@/lib/date';
import type { DailySummary } from '@/lib/types';

const weekDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type PickerTrackedDates = Record<
  string,
  {
    mealCount: number;
    status: DailySummary['status'];
  }
>;

export function DateNavigator({
  date,
  onChange,
  variant = 'stepper',
  visibleMonth,
  onMonthChange,
  trackedDates = {},
}: {
  date: string;
  onChange: (date: string) => void;
  variant?: 'stepper' | 'picker';
  visibleMonth?: string;
  onMonthChange?: (date: string) => void;
  trackedDates?: PickerTrackedDates;
}) {
  const today = todayKey();
  const nextDisabled = date >= today;

  if (variant === 'picker') {
    const pickerMonth = visibleMonth ?? startOfMonth(date);
    const nextMonth = shiftMonth(pickerMonth, 1);
    const canMoveLater = startOfMonth(today) >= nextMonth;

    return (
      <View className="gap-4" testID="history-date-picker">
        <View className="flex-row items-center justify-between gap-3">
          <SubtleButton
            label="Prev"
            onPress={() => onMonthChange?.(shiftMonth(pickerMonth, -1))}
            testID="history-picker-previous-month"
          />
          <Text
            className="text-[16px] font-bold text-[#10201B] dark:text-[#E8F0EC]"
            testID="history-picker-month-label"
          >
            {formatMonthLabel(pickerMonth)}
          </Text>
          <SubtleButton
            label="Next"
            onPress={() => onMonthChange?.(nextMonth)}
            disabled={!canMoveLater}
            testID="history-picker-next-month"
          />
        </View>

        <View className="gap-2">
          <View className="flex-row gap-2">
            {weekDayLabels.map((label, index) => (
              <View key={`${label}-${index}`} className="flex-1 items-center">
                <Text className="text-[11px] font-bold uppercase tracking-[1px] text-[#6D7A74] dark:text-[#7A9089]">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View className="gap-2">
            {buildMonthGrid(pickerMonth).map((week, weekIndex) => (
              <View key={`${pickerMonth}-${weekIndex}`} className="flex-row gap-2">
                {week.map((cell) => {
                  if (!cell.inMonth) {
                    return <View key={cell.date} className="flex-1" />;
                  }

                  const trackedDate = trackedDates[cell.date];
                  const isSelected = cell.date === date;
                  const isToday = cell.date === today;
                  const disabled = cell.isFuture;
                  const baseTone = isSelected
                    ? 'bg-[#102E24]'
                    : trackedDate
                      ? 'bg-[#DDF6EA] dark:bg-[#1A3325]'
                      : 'bg-[#EEF2F1] dark:bg-[#233029]';
                  const borderTone =
                    isToday && !isSelected
                      ? 'border-[#00D18E]'
                      : 'border-transparent dark:border-transparent';
                  const textTone = isSelected ? 'text-white' : 'text-[#10201B] dark:text-[#E8F0EC]';
                  const noteTone = isSelected
                    ? 'text-[#D7EEE5]'
                    : 'text-[#6D7A74] dark:text-[#7A9089]';

                  return (
                    <Pressable
                      key={cell.date}
                      accessibilityRole="button"
                      accessibilityState={{ disabled, selected: isSelected }}
                      className={`flex-1 rounded-[22px] border px-2 py-3 ${baseTone} ${borderTone} ${disabled ? 'opacity-35' : 'opacity-100'}`}
                      disabled={disabled}
                      onPress={() => onChange(cell.date)}
                      testID={`history-picker-day-${cell.date}`}
                    >
                      <Text
                        className={`text-center text-[16px] font-bold ${textTone}`}
                        testID={`history-picker-day-label-${cell.date}`}
                      >
                        {cell.dayOfMonth}
                      </Text>
                      <View className="mt-2 min-h-[16px] items-center justify-center">
                        {trackedDate ? (
                          <View
                            className={`min-w-[16px] rounded-full px-2 py-1 ${isSelected ? 'bg-white/20' : 'bg-[#B4F0CD] dark:bg-[#234D3B]'}`}
                            testID={`history-picker-tracked-${cell.date}`}
                          >
                            <Text
                              className={`text-center text-[10px] font-bold uppercase tracking-[0.6px] ${isSelected ? 'text-white' : 'text-[#006C48] dark:text-[#9BE8C9]'}`}
                            >
                              {trackedDate.mealCount}
                            </Text>
                          </View>
                        ) : isToday ? (
                          <Text
                            className={`text-center text-[10px] font-bold uppercase tracking-[0.6px] ${noteTone}`}
                            testID={`history-picker-today-${cell.date}`}
                          >
                            Today
                          </Text>
                        ) : (
                          <Text
                            className={`text-center text-[10px] font-bold uppercase tracking-[0.6px] ${noteTone}`}
                          >
                            Open
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View className="gap-1 px-1" testID="history-selected-date">
          <Text
            className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#51605A] dark:text-[#8FA49B]"
            testID="history-selected-date-label"
          >
            {formatDateLabel(date)}
          </Text>
          <Text
            className="text-[15px] leading-[20px] text-[#6D7A74] dark:text-[#7A9089]"
            testID="history-selected-date-value"
          >
            {formatLongDate(date)}
          </Text>
          <Text className="text-[12px] leading-[18px] text-[#6D7A74] dark:text-[#7A9089]">
            {isSameMonth(date, pickerMonth)
              ? 'Tracked days glow stronger. Empty days still work.'
              : 'Selected day stays locked while you browse months.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3" testID="date-navigator">
      <View className="flex-row items-center justify-between gap-3">
        <SubtleButton
          label="Earlier"
          onPress={() => onChange(shiftDate(date, -1))}
          testID="date-earlier-button"
        />
        <SubtleButton
          label="Later"
          onPress={() => onChange(shiftDate(date, 1))}
          disabled={nextDisabled}
          testID="date-later-button"
        />
      </View>
      <View className="gap-1 px-1">
        <Text
          className="text-[13px] font-bold uppercase tracking-[1.6px] text-[#51605A] dark:text-[#8FA49B]"
          testID="date-label"
        >
          {formatDateLabel(date)}
        </Text>
        <Text
          className="text-[15px] leading-[20px] text-[#6D7A74] dark:text-[#7A9089]"
          testID="date-long-label"
        >
          {formatLongDate(date)}
        </Text>
      </View>
    </View>
  );
}
