import type { PointerEvent } from 'react';

/** Feeds pointer position into .spotlight's CSS variables. */
export function spotlight(e: PointerEvent<HTMLElement>): void {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}
