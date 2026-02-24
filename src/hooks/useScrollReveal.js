import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to all elements matching `selector`
 * inside the given container ref, adding `visible` class when they enter
 * the viewport — mirrors Motion's whileInView / viewport: {once:true} pattern.
 */
export function useScrollReveal(containerRef, selector = '[class*="sr-"]', options = {}) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const els = root.querySelectorAll(selector);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target); // once: true
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px', ...options }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/**
 * useSingleReveal
 * Returns a ref — when the element enters the viewport, `visible` is added.
 */
export function useSingleReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
