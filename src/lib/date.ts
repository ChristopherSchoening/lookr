const DAY = 24 * 60 * 60 * 1000;

export type MonthGridCell = {
  date: string;
  dayOfMonth: number;
  inMonth: boolean;
  isFuture: boolean;
};

function toDateParts(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateParts(new Date());
}

export function nowIso() {
  return new Date().toISOString();
}

export function currentTimeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

export function isFutureDate(dateKey: string) {
  return dateKey > todayKey();
}

export function shiftDate(dateKey: string, direction: -1 | 1) {
  const next = new Date(`${dateKey}T12:00:00`);
  next.setTime(next.getTime() + direction * DAY);
  return toDateParts(next);
}

export function monthKey(dateKey: string) {
  return dateKey.slice(0, 7);
}

export function startOfMonth(dateKey: string) {
  return `${monthKey(dateKey)}-01`;
}

export function shiftMonth(dateKey: string, direction: -1 | 1) {
  const next = new Date(`${startOfMonth(dateKey)}T12:00:00`);
  next.setMonth(next.getMonth() + direction);
  return startOfMonth(toDateParts(next));
}

export function formatMonthLabel(dateKey: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${startOfMonth(dateKey)}T12:00:00`));
}

export function isSameMonth(leftDateKey: string, rightDateKey: string) {
  return monthKey(leftDateKey) === monthKey(rightDateKey);
}

export function buildMonthGrid(dateKey: string): MonthGridCell[][] {
  const monthStart = new Date(`${startOfMonth(dateKey)}T12:00:00`);
  const monthStartWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - monthStartWeekday);
  const today = todayKey();
  const month = monthKey(dateKey);
  const weeks: MonthGridCell[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week: MonthGridCell[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const current = new Date(gridStart);
      current.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
      const currentDateKey = toDateParts(current);

      week.push({
        date: currentDateKey,
        dayOfMonth: current.getDate(),
        inMonth: monthKey(currentDateKey) === month,
        isFuture: currentDateKey > today,
      });
    }

    weeks.push(week);
  }

  return weeks;
}

export function formatDateLabel(dateKey: string) {
  const today = todayKey();
  const yesterday = shiftDate(today, -1);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function formatLongDate(dateKey: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function sortByDateDesc<T extends { entryDate: string }>(items: T[]) {
  return [...items].sort((left, right) => right.entryDate.localeCompare(left.entryDate));
}
