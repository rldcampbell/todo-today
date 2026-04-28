import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';

export function getLocalDateString(date = new Date()) {
  return getLocalDayKey(date);
}
