export const toNullOn404 =
  <T,>(fn: () => Promise<T>) =>
  () =>
    fn().catch((err: { response?: { status?: number } }) => {
      if (err.response?.status === 404) return null;
      throw err;
    });
