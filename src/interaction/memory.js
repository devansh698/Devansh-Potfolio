/**
 * Session-scoped memory for the interaction layer.
 *
 * Privacy rule: everything lives in sessionStorage only (cleared when the
 * tab closes). Nothing is ever sent anywhere. Falls back to an in-memory
 * map when storage is unavailable (private windows, blocked storage).
 */
const PREFIX = 'dh-companion:';
const fallback = new Map();

function storageAvailable() {
  try {
    const k = `${PREFIX}test`;
    window.sessionStorage.setItem(k, '1');
    window.sessionStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const hasStorage = typeof window !== 'undefined' && storageAvailable();

export function recall(key) {
  if (hasStorage) return window.sessionStorage.getItem(PREFIX + key);
  return fallback.has(key) ? fallback.get(key) : null;
}

export function remember(key, value = '1') {
  if (hasStorage) window.sessionStorage.setItem(PREFIX + key, String(value));
  else fallback.set(key, String(value));
}

export function forget(key) {
  if (hasStorage) window.sessionStorage.removeItem(PREFIX + key);
  else fallback.delete(key);
}

/**
 * One-shot gate: returns true the first time it's called with a key
 * during this session, false ever after. Used so contextual lines fire
 * exactly once and never spam the visitor.
 */
export function firstTime(key) {
  const k = `once:${key}`;
  if (recall(k)) return false;
  remember(k);
  return true;
}
