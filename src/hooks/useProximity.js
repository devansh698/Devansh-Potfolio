import { useEffect, useRef } from 'react';

/**
 * useProximity
 * The world notices the cursor approaching before it arrives: writes
 * --prox (0 → 1, 1 = touching) and data-near onto the element as the
 * cursor closes within `radius` px of its edge. Only measures while the
 * element is on screen. Touch + reduced-motion safe (simply inert).
 */
export function useProximity({ radius = 200 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    let raf = null;
    let visible = false;
    let mx = -1e4;
    let my = -1e4;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        el.style.setProperty('--prox', '0');
        delete el.dataset.near;
      }
    });
    io.observe(el);

    const measure = () => {
      raf = null;
      if (!visible) return;
      const r = el.getBoundingClientRect();
      // Distance from cursor to the nearest edge of the rect.
      const dx = Math.max(r.left - mx, 0, mx - r.right);
      const dy = Math.max(r.top - my, 0, my - r.bottom);
      const dist = Math.hypot(dx, dy);
      const prox = Math.max(0, 1 - dist / radius);
      el.style.setProperty('--prox', prox.toFixed(3));
      if (prox > 0.02) el.dataset.near = '1';
      else delete el.dataset.near;
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(measure);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [radius]);

  return ref;
}
