const pad = (value: number) => {
  return value.toString().padStart(2, '0');
};
export const getLocalDayKey = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
