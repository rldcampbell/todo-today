import { advanceDateByRecurrence } from '@/utils/dates';
describe('advanceDateByRecurrence', () => {
  it('advances a date by weeks', () => {
    const nextDate = advanceDateByRecurrence('2026-04-28', {
      interval: 2,
      unit: 'week',
    });
    expect(nextDate).toBe('2026-05-12');
  });
  it('advances a date by months', () => {
    const nextDate = advanceDateByRecurrence('2026-01-15', {
      interval: 1,
      unit: 'month',
    });
    expect(nextDate).toBe('2026-02-15');
  });

  it('returns the original value when the day key is invalid', () => {
    const nextDate = advanceDateByRecurrence('2026-02-30', {
      interval: 1,
      unit: 'month',
    });

    expect(nextDate).toBe('2026-02-30');
  });
});
