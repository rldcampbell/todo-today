import type { RecurrenceRule } from '@/features/tasks/task-types';

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function getLocalDayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getLocalDateString(date = new Date()) {
  return getLocalDayKey(date);
}

export function isBeforeToday(dayKey: string, now = new Date()) {
  return dayKey < getLocalDayKey(now);
}

export function formatRelativeDueDate(dayKey: string | null, now = new Date()) {
  if (!dayKey) {
    return null;
  }

  const today = getLocalDayKey(now);
  if (dayKey === today) {
    return 'Today';
  }

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = getLocalDayKey(tomorrowDate);

  if (dayKey === tomorrow) {
    return 'Tomorrow';
  }

  if (dayKey < today) {
    return 'Before today';
  }

  return dayKey;
}

export function advanceDateByRecurrence(dayKey: string, recurrence: RecurrenceRule) {
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  switch (recurrence.unit) {
    case 'day':
      date.setDate(date.getDate() + recurrence.interval);
      break;
    case 'week':
      date.setDate(date.getDate() + recurrence.interval * 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() + recurrence.interval);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() + recurrence.interval);
      break;
  }

  return getLocalDayKey(date);
}
