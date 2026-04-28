import { createSerialAsyncExecutor } from '@/utils/async/createSerialAsyncExecutor';

describe('createSerialAsyncExecutor', () => {
  it('runs async work sequentially in call order', async () => {
    const runSerial = createSerialAsyncExecutor();
    const events: string[] = [];

    const firstPromise = runSerial(async () => {
      events.push('first:start');
      await Promise.resolve();
      events.push('first:end');
      return 'first';
    });

    const secondPromise = runSerial(async () => {
      events.push('second:start');
      events.push('second:end');
      return 'second';
    });

    await expect(firstPromise).resolves.toBe('first');
    await expect(secondPromise).resolves.toBe('second');
    expect(events).toEqual([
      'first:start',
      'first:end',
      'second:start',
      'second:end',
    ]);
  });

  it('continues running later work after a rejection', async () => {
    const runSerial = createSerialAsyncExecutor();

    await expect(
      runSerial(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    await expect(
      runSerial(async () => {
        return 'next';
      }),
    ).resolves.toBe('next');
  });
});
