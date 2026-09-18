import { useEffect, useRef } from 'react';

/**
 * useMagnetic
 * Attach the returned ref to a WRAPPER element around a button — within
 * `radius` px the wrapper is gently pulled toward the cursor and springs
 * back on release. Wrapper-based so it never fights the button's own
 * hover transforms. No-ops on touch devices and reduced motion.
 */
export function useMagnetic({ radius = 110, strength = 0.34 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = null;
    let mx = 0;
    let my = 0;
    let engaged = false;

    el.style.display = 'inline-block';
    el.style.willChange = 'transform';

    const apply = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const dx = mx - (r.left + r.width / 2);
      const dy = my - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        engaged = true;
        el.style.transition = 'transform .12s ease-out';
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else if (engaged) {
        engaged = false;
        el.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1)';
        el.style.transform = 'translate(0, 0)';
      }
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [radius, strength]);

  return ref;
}
