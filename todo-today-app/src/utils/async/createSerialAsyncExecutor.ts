export const createSerialAsyncExecutor = () => {
  let queueTail = Promise.resolve();

  return async <TValue>(work: () => Promise<TValue>) => {
    const resultPromise = queueTail.catch(() => undefined).then(work);

    queueTail = resultPromise.then(
      () => undefined,
      () => undefined,
    );

    return resultPromise;
  };
};
