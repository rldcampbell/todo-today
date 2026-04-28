import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';
export const isBeforeToday = (dayKey: string, now = new Date()) => {
  return dayKey < getLocalDayKey(now);
};
