/**
 * Session-scoped memory for the interaction layer.
 * Privacy rule: sessionStorage only (cleared when the tab closes), never sent anywhere.
 * Falls back to an in-memory map when storage is blocked.
 */
const PREFIX = 'dh:';
const fallback = new Map<string, string>();

function storage(): Storage | null {
  try {
    const s = window.sessionStorage;
    s.setItem(`${PREFIX}t`, '1');
    s.removeItem(`${PREFIX}t`);
    return s;
  } catch {
    return null;
  }
}

export function recall(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const s = storage();
  return s ? s.getItem(PREFIX + key) : (fallback.get(key) ?? null);
}

export function remember(key: string, value = '1'): void {
  if (typeof window === 'undefined') return;
  const s = storage();
  if (s) s.setItem(PREFIX + key, value);
  else fallback.set(key, value);
}

/** True the first time a key is seen this session, false afterwards. */
export function firstTime(key: string): boolean {
  const k = `once:${key}`;
  if (recall(k)) return false;
  remember(k);
  return true;
}
