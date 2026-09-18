'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Live media-query match; `false` during server render. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
