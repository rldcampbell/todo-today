import { getLocalDayKey } from '@/utils/dates/getLocalDayKey';
export const getLocalDateString = (date = new Date()) => {
  return getLocalDayKey(date);
};
