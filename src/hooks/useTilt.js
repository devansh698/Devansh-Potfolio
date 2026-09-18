import { useEffect, useRef } from 'react';

/**
 * useTilt
 * Pointer-tracked 3D tilt for cards: writes --tilt-x/--tilt-y (deg) onto
 * the element; pair with a CSS transform like
 *   perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)).
 * Subtle by design (max 4°). Disabled for touch + reduced motion.
 */
export function useTilt({ max = 4 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = null;

    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--tilt-x', `${(-py * max * 2).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(px * max * 2).toFixed(2)}deg`);
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
}
