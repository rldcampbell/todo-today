import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';
export const formatRelativeDueDate = (
  dayKey: string | null,
  now = new Date(),
) => {
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
};
