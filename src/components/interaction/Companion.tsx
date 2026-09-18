'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanion } from '@/components/providers/CompanionProvider';
import BotFace from './BotFace';

function TypeText({ text }: { text: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) clearInterval(iv);
        return Math.min(c + 1, text.length);
      });
    }, 16);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <>
      {text.slice(0, count)}
      {count < text.length && <span className="caret">▌</span>}
    </>
  );
}

/** Docked companion: tracks the cursor, blinks, speaks through one polite bubble, and reacts to pokes. */
export default function Companion() {
  const { mood, bubble, poke, isReady } = useCompanion();
  const root = useRef<HTMLButtonElement>(null);
  const [isBlinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let lastMove = 0;
    let nextGlance = performance.now() + 2200;

    const onMove = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      lastMove = performance.now();
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      tx = (dx / d) * 4.5;
      ty = (dy / d) * 4.5;
    };

    const loop = (now: number) => {
      // No pointer input for a while → curious glances around the room.
      if (now - lastMove > 2600 && now > nextGlance) {
        const a = Math.random() * Math.PI * 2;
        const m = 2 + Math.random() * 2.5;
        tx = Math.cos(a) * m;
        ty = Math.sin(a) * m * 0.7;
        nextGlance = now + 1800 + Math.random() * 2400;
      }
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      root.current?.style.setProperty('--look-x', cx.toFixed(2));
      root.current?.style.setProperty('--look-y', cy.toFixed(2));
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t1 = setTimeout(() => {
        setBlinking(true);
        t2 = setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 140);
      }, 2800 + Math.random() * 3600);
    };
    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isReady]);

  if (!isReady) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {bubble && (
          <motion.p
            key={bubble.id}
            role="status"
            aria-live="polite"
            className="relative max-w-[16rem] border border-line bg-surface-2 px-4 py-3 text-sm leading-snug text-fg shadow-xl"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <TypeText text={bubble.text} />
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        ref={root}
        type="button"
        aria-label="Site companion — give it a poke"
        data-cursor="Poke"
        onClick={poke}
        className="pointer-events-auto"
        initial={{ scale: 0, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 240, damping: 17 }}
      >
        <BotFace mood={mood} size={52} isBlinking={isBlinking} />
      </motion.button>
    </div>
  );
}
