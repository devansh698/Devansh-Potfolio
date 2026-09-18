'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface CounterProps {
  to: number;
  pad?: number;
  suffix?: string;
  className?: string;
}

/** Counts up once when scrolled into view. */
export default function Counter({ to, pad = 2, suffix = '', className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView) return;
    const format = (v: number) => `${String(Math.round(v)).padStart(pad, '0')}${suffix}`;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(to);
      return;
    }
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = format(v)) });
    return () => controls.stop();
  }, [isInView, to, pad, suffix]);

  return (
    <span ref={ref} className={className}>
      {`${'0'.repeat(pad)}${suffix}`}
    </span>
  );
}
