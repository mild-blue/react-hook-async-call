/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";

type InitialState<S> = S extends Array<any> ? [] : undefined;

export const useAsyncCall = <P extends any[], S, I extends InitialState<S>>(
  apiCall: (...argArray: P) => Promise<S>,
  initialState: I,
  onSuccess: ((result: S) => void) | undefined = undefined,
  onError: ((e: unknown) => void) | undefined = undefined
): [(...argArray: P) => Promise<S | I>, S | I, boolean, boolean] => {
  const [data, setData] = useState<S | I>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const execute = useCallback(
    async (...argArray: P): Promise<S | I> => {
      setError(false);
      setLoading(true);
      try {
        const result = await apiCall(...argArray);
        if (onSuccess !== undefined) {
          onSuccess(result);
        }
        setData(result);
        setError(false);
        return result;
      } catch (e) {
        setError(true);
        if (onError !== undefined) {
          onError(e);
        }
        return data;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, data, onError, onSuccess]
  );

  return useMemo(() => {
    return [execute, data, loading, error];
  }, [execute, data, loading, error]);
};
