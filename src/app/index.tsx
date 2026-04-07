import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const habits = [
  { label: 'Calorie target', value: '1,950', note: 'Balanced for steady loss' },
  { label: 'Protein goal', value: '145g', note: 'Supports fullness and recovery' },
  { label: 'Daily movement', value: '8k', note: 'Simple, repeatable baseline' },
];

const priorities = [
  'Log meals in under a minute.',
  'Stay inside your weekly calorie range.',
  'Use trend weight instead of reacting to daily swings.',
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F6EFE6]">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 px-5 pb-8 pt-5 ios:pt-3">
          <View className="gap-3.5 rounded-[28px] bg-[#18211B] p-6">
            <View className="self-start rounded-full bg-[#F3B35B] px-3 py-1.5">
              <Text className="text-[12px] font-extrabold tracking-[1.6px] text-[#18211B]">
                LOOKR
              </Text>
            </View>
            <Text className="text-[14px] font-bold uppercase tracking-[0.8px] text-[#F3B35B]">
              Weight loss without crash-plan chaos
            </Text>
            <Text className="text-[34px] font-extrabold leading-10 text-[#FFF7EF]">
              Build momentum with small targets you can actually keep.
            </Text>
            <Text className="text-[16px] leading-6 text-[#D6D0C8]">
              Lookr is designed to help users lose weight through consistent habits, calmer data,
              and a weekly rhythm that feels sustainable.
            </Text>
          </View>

          <View className="gap-3.5">
            {habits.map((habit) => (
              <View
                key={habit.label}
                className="gap-1.5 rounded-3xl border border-[#E8DCCB] bg-[#FFF9F1] p-5"
              >
                <Text className="text-[14px] font-semibold uppercase tracking-[0.6px] text-[#6D665C]">
                  {habit.label}
                </Text>
                <Text className="text-[32px] font-extrabold text-[#18211B]">{habit.value}</Text>
                <Text className="text-[15px] leading-[21px] text-[#4C4A46]">{habit.note}</Text>
              </View>
            ))}
          </View>

          <View className="gap-3.5 rounded-[28px] bg-[#D9E6D5] p-[22px]">
            <Text className="text-[13px] font-bold uppercase tracking-[0.8px] text-[#34513C]">
              Week one focus
            </Text>
            <Text className="text-[26px] font-extrabold leading-8 text-[#18211B]">
              Keep the first plan boring on purpose.
            </Text>
            <View className="gap-3">
              {priorities.map((priority) => (
                <View key={priority} className="flex-row items-start gap-2.5">
                  <View className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#34513C]" />
                  <Text className="flex-1 text-[16px] font-semibold leading-[23px] text-[#18211B]">
                    {priority}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-2.5 rounded-[28px] border border-[#E8DCCB] bg-[#FFF9F1] p-[22px]">
            <Text className="text-[13px] font-bold uppercase tracking-[0.8px] text-[#8A5D2A]">
              Core product direction
            </Text>
            <Text className="text-[24px] font-extrabold leading-[30px] text-[#18211B]">
              Fast logging, weekly insight, visible progress.
            </Text>
            <Text className="text-[16px] leading-6 text-[#4C4A46]">
              This starter screen gives the app a clear product voice and a visual baseline you can
              extend into onboarding, meal logging, progress charts, and coaching flows.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
