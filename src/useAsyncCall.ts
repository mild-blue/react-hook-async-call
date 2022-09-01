import { useCallback, useMemo, useState } from "react";

export const useAsyncCall = <T>(
  apiCall: (...props: any[]) => Promise<T>
): [(...props: any[]) => Promise<T | undefined>, T | undefined, boolean, boolean] => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const execute = useCallback(
    async (...props: any[]): Promise<T | undefined> => {
      setLoading(true);
      try {
        const result = await apiCall(...props);
        setData(result);
        return result;
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }

      return;
    },
    [apiCall]
  );

  return useMemo(() => {
    return [execute, data, loading, error];
  }, [execute, data, loading, error]);
};
