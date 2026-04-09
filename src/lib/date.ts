const DAY = 24 * 60 * 60 * 1000;

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
