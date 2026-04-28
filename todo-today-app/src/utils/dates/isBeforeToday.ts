import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';

export function isBeforeToday(dayKey: string, now = new Date()) {
  return dayKey < getLocalDayKey(now);
}
