import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';

const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDayKey = (dayKey: string) => {
  if (!DAY_KEY_PATTERN.test(dayKey)) {
    return null;
  }

  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (getLocalDayKey(date) !== dayKey) {
    return null;
  }

  return date;
};
