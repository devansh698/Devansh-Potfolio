'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { THEMES, THEME_IDS, useTheme } from '@/components/providers/ThemeProvider';
import { SCRIPT } from '@/lib/interaction/script';
import { initTone, playTone } from '@/lib/interaction/tone';
import { navItems, profile } from '@/lib/data';
import { useLocalTime } from '@/hooks/useLocalTime';

const tool =
  'inline-flex h-8 items-center gap-1.5 border border-line px-2.5 text-[0.68rem] uppercase tracking-[0.14em] text-fg transition-colors hover:bg-fg hover:text-bg';

function useActiveSection(): string {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = navItems.map((n) => document.querySelector(n.href)).filter((el): el is Element => el !== null);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), {
      rootMargin: '-50% 0px -50% 0px',
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { say } = useCompanion();
  return (
    <div role="radiogroup" aria-label="Ink set" className="flex h-8 items-center gap-1 border border-line px-1.5">
      <span className="label hidden text-muted xl:inline">Ink</span>
      {THEME_IDS.map((id) => {
        const t = THEMES[id];
        const isActive = theme.id === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${t.label} ink`}
            data-cursor={t.label}
            onClick={() => {
              initTone();
              playTone('discover');
              setTheme(id);
              say(SCRIPT.themeChanged(t.label));
            }}
            className={`size-4 border transition-transform ${isActive ? 'scale-110 border-fg' : 'border-line hover:scale-110'}`}
            style={{ background: `linear-gradient(135deg, ${t.palette.bg} 50%, ${t.palette.accent} 50%)` }}
          />
        );
      })}
    </div>
  );
}

function Tools({ onAction }: { onAction?: () => void }) {
  const { isSoundOn, toggleSound, setTerminalOpen, setTldrOpen } = useCompanion();
  return (
    <>
      <ThemeSwitch />
      <button
        type="button"
        className={tool}
        onClick={toggleSound}
        aria-pressed={isSoundOn}
        aria-label={isSoundOn ? 'Mute interaction sounds' : 'Enable interaction sounds'}
        data-cursor={isSoundOn ? 'Mute' : 'Sound'}
      >
        <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
          {[0.5, 1, 0.7, 0.9].map((h, i) => (
            <motion.i
              key={i}
              className="block w-[2px] bg-current"
              animate={{ height: isSoundOn ? [`${h * 100}%`, `${(1 - h) * 60 + 30}%`, `${h * 100}%`] : '18%' }}
              transition={{ duration: 0.9 + i * 0.15, repeat: isSoundOn ? Infinity : 0 }}
            />
          ))}
        </span>
        <span className="hidden sm:inline">{isSoundOn ? 'Sound' : 'Muted'}</span>
      </button>
      <button
        type="button"
        className={`${tool} font-mono`}
        aria-label="Open terminal"
        data-cursor="Shell"
        onClick={() => {
          initTone();
          playTone('open');
          onAction?.();
          setTerminalOpen(true);
        }}
      >
        &gt;_
      </button>
      <button
        type="button"
        className={tool}
        data-cursor="Quick"
        onClick={() => {
          initTone();
          playTone('open');
          onAction?.();
          setTldrOpen(true);
        }}
      >
        TL;DR
      </button>
    </>
  );
}

/** Right-edge ruler: scroll position as a measured scale, like a page gauge. */
function ScrollRuler() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const top = useTransform(progress, (v) => `${v * 100}%`);
  const percent = useTransform(progress, (v) => String(Math.round(v * 100)).padStart(3, '0'));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed right-4 top-0 z-[55] hidden h-svh flex-col justify-center lg:flex">
      <div className="relative h-[60svh] w-12">
        <span className="absolute inset-y-0 right-3 w-px bg-line" />
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className="absolute right-3 h-px bg-line" style={{ top: `${i * 5}%`, width: i % 5 === 0 ? '10px' : '5px' }} />
        ))}
        <motion.div className="absolute right-0 flex items-center gap-1.5" style={{ top }}>
          <motion.span className="label !text-[0.6rem] tabular-nums text-accent">{percent}</motion.span>
          <span className="h-px w-3 bg-accent" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Nav() {
  const time = useLocalTime(profile.timeZone);
  const active = useActiveSection();
  const { glideTo, isMenuOpen: isOpen, setMenuOpen: setIsOpen } = useCompanion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setIsOpen]);

  const go = (href: string) => {
    setIsOpen(false);
    playTone('tap');
    glideTo(href);
  };

  return (
    <>
      {/* Masthead */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="gutter flex items-center justify-between gap-4 py-2.5">
          <a href="#top" onClick={(e) => (e.preventDefault(), go('#top'))} className="flex items-baseline gap-3" aria-label="Back to top">
            <span className="display text-xl">{profile.name}</span>
            <span className="label hidden text-muted sm:inline">— {profile.role} · No. 01</span>
          </a>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="label mr-1 hidden text-muted xl:inline">
              {profile.location} · {time} {profile.timeZoneLabel}
            </span>
            <Tools />
          </div>

          <button type="button" className={`${tool} lg:hidden`} aria-expanded={isOpen} aria-controls="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close ✕' : 'Index ☰'}
          </button>
        </div>
      </header>

      {/* Left rail: the index of the publication */}
      <nav
        aria-label="Sections"
        className="fixed left-0 top-0 z-50 hidden h-svh w-14 flex-col items-center justify-center gap-7 border-r border-line bg-bg/60 backdrop-blur-sm lg:flex"
      >
        {navItems.map((item, i) => {
          const isActive = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => (e.preventDefault(), go(item.href))}
              aria-current={isActive ? 'true' : undefined}
              className={`label flex items-center gap-2 transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-fg'}`}
              style={{ writingMode: 'vertical-rl' }}
            >
              <span className={`h-px transition-all duration-500 ${isActive ? 'w-4 bg-accent' : 'w-2 bg-line'}`} style={{ writingMode: 'horizontal-tb' }} />
              {String(i + 1).padStart(2, '0')} · {item.label}
            </a>
          );
        })}
      </nav>

      <ScrollRuler />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="gutter fixed inset-0 z-40 flex flex-col justify-end overflow-y-auto bg-bg pb-8 pt-20 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="label mb-6 text-muted">Contents</p>
            <nav aria-label="Mobile" className="flex flex-col border-t border-line">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => (e.preventDefault(), go(item.href))}
                  className={`flex items-baseline gap-3 border-b border-line py-3 ${active === item.href ? 'text-accent' : ''}`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[clamp(2rem,10vw,3.5rem)]">{item.label}</span>
                  <span className="leader" />
                  <span className="label text-muted">↗</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tools onAction={() => setIsOpen(false)} />
            </div>
            <p className="label mt-6 text-muted">
              {profile.location} · {time} {profile.timeZoneLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
