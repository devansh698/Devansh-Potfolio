'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { REDUCED_MOTION } from '@/hooks/useMediaQuery';

interface TechSphereProps {
  words: readonly string[];
}

/**
 * Words on a Fibonacci sphere, projected by hand each frame (no WebGL needed).
 * Auto-spins, can be dragged/flung, and scroll velocity kicks it.
 */
export default function TechSphere({ words }: TechSphereProps) {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const spin = useRef({ vx: 0.004, vy: 0.002, ax: 0, ay: 0, isDragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const isStill = window.matchMedia(REDUCED_MOTION).matches;
    const n = words.length;
    // Fibonacci lattice gives an even spread without clumping at the poles.
    const points = words.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    let raf = 0;
    let isVisible = true;
    const io = new IntersectionObserver(([e]) => (isVisible = e.isIntersecting));
    io.observe(el);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!isVisible) return;
      const s = spin.current;
      if (!s.isDragging) {
        // Ease back toward a gentle idle spin after a fling.
        s.vx += (0.004 - s.vx) * 0.02;
        s.vy += (0.002 - s.vy) * 0.02;
      }
      if (!isStill) {
        s.ay += s.vx;
        s.ax += s.vy;
      }
      const radius = el.clientWidth * 0.38;
      const cosX = Math.cos(s.ax);
      const sinX = Math.sin(s.ax);
      const cosY = Math.cos(s.ay);
      const sinY = Math.sin(s.ay);
      points.forEach((p, i) => {
        const node = items.current[i];
        if (!node) return;
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const scale = 0.55 + depth * 0.75;
        node.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String(0.2 + depth * 0.8);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 6}px)` : 'none';
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [words]);

  useLenis(({ velocity }) => {
    spin.current.vy += velocity * 0.00006;
  });

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = spin.current;
    s.isDragging = true;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = spin.current;
    if (!s.isDragging) return;
    s.vx = (e.clientX - s.lastX) * 0.0025;
    s.vy = -(e.clientY - s.lastY) * 0.0025;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };
  const onUp = () => {
    spin.current.isDragging = false;
  };

  return (
    <div
      ref={root}
      data-cursor="Drag"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative mx-auto aspect-square w-full max-w-[34rem] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      role="img"
      aria-label={`Tech stack: ${words.join(', ')}`}
    >
      <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-line" />
      <div aria-hidden="true" className="absolute inset-[30%] rounded-full opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2">
        {words.map((w, i) => (
          <span
            key={w}
            ref={(node) => {
              items.current[i] = node;
            }}
            className={`absolute left-0 top-0 whitespace-nowrap px-3 py-1 text-sm font-semibold will-change-transform ${
              i % 4 === 0 ? 'bg-accent text-on-accent' : 'border border-line bg-surface-2 text-fg'
            }`}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
