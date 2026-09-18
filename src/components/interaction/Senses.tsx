'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { useCompanion, type Mood } from '@/components/providers/CompanionProvider';
import { SCRIPT } from '@/lib/interaction/script';
import { firstTime } from '@/lib/interaction/memory';

const ZONES: Record<string, Mood> = {
  top: 'curious',
  about: 'idle',
  skills: 'focused',
  work: 'excited',
  experience: 'focused',
  certs: 'idle',
  contact: 'farewell',
};

/**
 * The site noticing the visitor: which section they settled in, how fast they
 * scroll, and whether they went quiet. Each observation speaks at most once.
 */
export default function Senses() {
  const { isReady, say, setMood, visitorName } = useCompanion();
  const zone = useRef<string | null>(null);
  const visited = useRef(new Set<string>());
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Section sense
  useEffect(() => {
    if (!isReady) return;
    const sections = Object.keys(ZONES)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit || hit.target.id === zone.current) return;
        const id = hit.target.id;
        const previous = zone.current;
        zone.current = id;
        document.body.dataset.zone = id;
        setMood(ZONES[id], id === 'contact' ? undefined : 6000);

        if (previous && visited.current.has(id) && id !== 'top') say(SCRIPT.revisit, { once: 'revisit' });
        visited.current.add(id);

        if (lineTimer.current) clearTimeout(lineTimer.current);
        // Only speak if they actually settle here.
        lineTimer.current = setTimeout(() => {
          if (zone.current !== id) return;
          if (id === 'contact') {
            if (!firstTime('farewell')) return;
            say(SCRIPT.farewell.thanks(visitorName), { mood: 'farewell' });
            setTimeout(() => say(SCRIPT.farewell.build), 3400);
            return;
          }
          const line = SCRIPT.zones[id];
          if (line) say(line, { once: `zone:${id}` });
        }, 1200);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      if (lineTimer.current) clearTimeout(lineTimer.current);
    };
  }, [isReady, say, setMood, visitorName]);

  // Greeting for named visitors, or a desk hint if they linger at the top.
  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => {
      if (visitorName) say(SCRIPT.greet(visitorName), { once: 'greet' });
      if (window.scrollY < 120) say(SCRIPT.zones.top, { once: 'zone:top' });
    }, 2500);
    return () => clearTimeout(t);
  }, [isReady, say, visitorName]);

  // Scroll sense
  useLenis(
    ({ velocity }) => {
      if (isReady && Math.abs(velocity) > 90) {
        say(SCRIPT.fastScroll, { once: 'fast-scroll' });
        setMood('excited', 1600);
      }
    },
    [isReady, say, setMood],
  );

  // Idle sense
  useEffect(() => {
    if (!isReady) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setMood('thinking');
        say(SCRIPT.idleNudge, { once: 'idle', mood: 'thinking' });
      }, 30000);
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [isReady, say, setMood]);

  return null;
}
