import { parseDayKey } from '@/utils/dates/parseDayKey';

describe('parseDayKey', () => {
  it('parses a valid local day key', () => {
    const parsedDate = parseDayKey('2026-04-28');

    expect(parsedDate).toBeInstanceOf(Date);
    expect(parsedDate?.getFullYear()).toBe(2026);
    expect(parsedDate?.getMonth()).toBe(3);
    expect(parsedDate?.getDate()).toBe(28);
  });

  it('rejects malformed day keys', () => {
    expect(parseDayKey('2026-4-28')).toBeNull();
    expect(parseDayKey('2026/04/28')).toBeNull();
  });

  it('rejects impossible dates', () => {
    expect(parseDayKey('2026-02-30')).toBeNull();
    expect(parseDayKey('2026-13-01')).toBeNull();
  });
});
