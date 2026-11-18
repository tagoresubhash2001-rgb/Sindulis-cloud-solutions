import { useEffect, useState } from 'react';
import type { ErrorHandler, Unsubscribe } from '../services/db';

export interface Live<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/**
 * Subscribe to a real-time source for as long as the component is mounted.
 * `subscribe` may be null to pause (e.g. until an id is known).
 */
export function useLive<T>(
  subscribe: ((onData: (v: T) => void, onError: ErrorHandler) => Unsubscribe) | null,
  deps: readonly unknown[],
  initial: T,
): Live<T> {
  const [state, setState] = useState<Live<T>>({ data: initial, loading: !!subscribe, error: null });
  useEffect(() => {
    if (!subscribe) {
      setState({ data: initial, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    return subscribe(
      (data) => setState({ data, loading: false, error: null }),
      (e) => setState((s) => ({ ...s, loading: false, error: e.message })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
