'use client';

import { useEffect } from 'react';
import { initTone, playTone } from '@/lib/interaction/tone';

const INTERACTIVE = 'a, button, [role="tab"], [role="radio"], [data-cursor]';
const HOVER_GAP_MS = 70;

/**
 * Browsers only allow audio after a user gesture, so the first click/tap/key anywhere
 * unlocks the synth. Afterwards, pointer users get a soft tick when entering controls.
 */
export default function SoundDriver() {
  useEffect(() => {
    const unlock = () => initTone();
    const gestures = ['click', 'keydown', 'touchend'] as const;
    gestures.forEach((g) => window.addEventListener(g, unlock, { passive: true }));

    let lastTarget: Element | null = null;
    let lastAt = 0;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (!target || target === lastTarget) return;
      lastTarget = target;
      const now = performance.now();
      if (now - lastAt < HOVER_GAP_MS) return;
      lastAt = now;
      playTone('hover');
    };
    const onOut = (e: PointerEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest?.(INTERACTIVE)) lastTarget = null;
    };
    if (canHover) {
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerout', onOut, { passive: true });
    }

    return () => {
      gestures.forEach((g) => window.removeEventListener(g, unlock));
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);

  return null;
}
