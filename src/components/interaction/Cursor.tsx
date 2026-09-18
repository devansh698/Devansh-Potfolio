'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Dot + ring cursor. Any element with data-cursor="Label" grows the ring and shows the label.
 * Only mounts on precise pointers with motion allowed; touch users keep native behaviour.
 */
export default function Cursor() {
  const [isEnabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const [isHovering, setHovering] = useState(false);
  const [isDown, setDown] = useState(false);
  const [isHidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const apply = () => {
      setEnabled(mq.matches);
      document.documentElement.classList.toggle('has-cursor', mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = (e.target as Element | null)?.closest?.('[data-cursor], a, button, input, textarea, select, [role="button"]');
      // Text fields get the native caret, so hide ours.
      if (target?.matches('input, textarea, select')) {
        setHidden(true);
        return;
      }
      setHovering(Boolean(target));
      setLabel(target?.getAttribute('data-cursor') ?? '');
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setHidden(true);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [isEnabled, x, y]);

  if (!isEnabled) return null;

  const size = label ? 84 : isHovering ? 48 : 28;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]" style={{ opacity: isHidden ? 0 : 1 }}>
      <motion.div className="absolute left-0 top-0 size-1.5 rounded-full bg-accent" style={{ x, y, translateX: '-50%', translateY: '-50%' }} />
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          scale: isDown ? 0.8 : 1,
          backgroundColor: label ? 'var(--accent)' : 'rgba(0,0,0,0)',
          borderColor: label ? 'var(--accent)' : 'color-mix(in srgb, var(--fg) 60%, transparent)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {label && <span className="label !text-[0.62rem] font-semibold text-on-accent">{label}</span>}
      </motion.div>
    </div>
  );
}
