import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from './CompanionContext';
import { projects, skills, links, experience } from '../data';
import { playTone } from './tone';
import './Terminal.css';

const BOOT = [
  'DH-OS v2.6 — visitor shell',
  'type `help` to get started',
];

/**
 * Hidden developer terminal. Opened with the ` key or via the secret
 * object in the footer. Pure easter egg — professional, tasteful, and
 * home to `sudo hire devansh`.
 */
export default function Terminal() {
  const {
    terminalOpen, setTerminalOpen,
    visitorName, setVisitorName,
    soundOn, toggleSound,
    celebrate, introDone, lockScroll,
  } = useCompanion();

  const [history, setHistory] = useState(() => BOOT.map((t) => ({ kind: 'sys', text: t })));
  const [value, setValue] = useState('');
  const outRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef(new Set());

  // Global shortcut: ` opens the terminal (unless the visitor is typing).
  useEffect(() => {
    if (!introDone) return undefined;
    const onKey = (e) => {
      if (e.key !== '`' || terminalOpen) return;
      if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      playTone('open');
      setTerminalOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [introDone, terminalOpen, setTerminalOpen]);

  useEffect(() => {
    if (!terminalOpen) return undefined;
    inputRef.current?.focus();
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') setTerminalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const timers = timersRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [terminalOpen, setTerminalOpen, lockScroll]);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [history, terminalOpen]);

  const push = (entries) => setHistory((h) => [...h, ...entries]);

  const pushDelayed = (entries, step = 550) => {
    entries.forEach((entry, i) => {
      const t = setTimeout(() => {
        timersRef.current.delete(t);
        push([entry]);
      }, (i + 1) * step);
      timersRef.current.add(t);
    });
  };

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push([{ kind: 'in', text: cmd }]);
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      push([
        { kind: 'out', text: 'help            this list' },
        { kind: 'out', text: 'about           who is devansh' },
        { kind: 'out', text: 'whoami          who are you' },
        { kind: 'out', text: 'projects        list the work' },
        { kind: 'out', text: 'skills          the toolkit' },
        { kind: 'out', text: 'contact         reach out' },
        { kind: 'out', text: 'name <yours>    introduce yourself' },
        { kind: 'out', text: 'sound on|off    feedback blips' },
        { kind: 'out', text: 'clear · exit' },
        { kind: 'sys', text: '…and root can do one more thing.' },
      ]);
    } else if (lower === 'about') {
      push([
        { kind: 'out', text: 'Devansh Handa — software engineer at Oriental Outsourcing.' },
        { kind: 'out', text: 'Intern → full-time in a year. Ships MERN + Laravel in production.' },
      ]);
    } else if (lower === 'whoami') {
      push([{ kind: 'out', text: visitorName ? `${visitorName} — good to see you.` : 'guest — you, probably.' }]);
    } else if (lower === 'projects') {
      push(projects.map((p) => ({ kind: 'out', text: `${p.code}  ${p.title} — ${p.sub}` })));
    } else if (lower === 'skills') {
      push([{ kind: 'out', text: skills.slice(0, 8).map((s) => s.name).join(' · ') }]);
    } else if (lower === 'contact') {
      push([
        { kind: 'out', text: `mail   ${links.email}` },
        { kind: 'out', text: 'github github.com/devansh698' },
        { kind: 'out', text: 'linked linkedin.com/in/devanshhanda' },
      ]);
    } else if (lower.startsWith('name ')) {
      const n = cmd.slice(5).replace(/[<>]/g, '').trim().slice(0, 24);
      if (n) {
        setVisitorName(n);
        push([{ kind: 'ok', text: `Nice to meet you, ${n}.` }]);
      } else {
        push([{ kind: 'err', text: 'usage: name <yours>' }]);
      }
    } else if (lower === 'sound on' || lower === 'sound off') {
      const wantOn = lower.endsWith('on');
      if (wantOn !== soundOn) toggleSound();
      push([{ kind: 'ok', text: `sound: ${wantOn ? 'on' : 'off'}` }]);
    } else if (lower === 'clear') {
      setHistory([]);
    } else if (lower === 'exit') {
      setTerminalOpen(false);
    } else if (lower === 'sudo hire devansh') {
      pushDelayed([
        { kind: 'out', text: 'checking references … ok' },
        { kind: 'out', text: `evaluating stack [${experience[0].tech.slice(0, 3).join(' · ')}] … ok` },
        { kind: 'out', text: 'reviewing shipping record … ok' },
        { kind: 'grant', text: 'PERMISSION GRANTED.' },
        { kind: 'ok', text: `→ ${links.email} — let\u2019s talk.` },
      ]);
      const t = setTimeout(() => {
        timersRef.current.delete(t);
        celebrate('success');
      }, 4 * 550);
      timersRef.current.add(t);
    } else if (lower === 'hire devansh' || lower === 'hire') {
      push([{ kind: 'err', text: 'permission denied — try sudo.' }]);
    } else if (lower.startsWith('sudo')) {
      push([{ kind: 'out', text: 'sudo: only one elevation is supported here. try: sudo hire devansh' }]);
    } else {
      push([{ kind: 'err', text: `command not found: ${cmd} — try 'help'` }]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    playTone('tap');
    run(value);
    setValue('');
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          className="term-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setTerminalOpen(false);
          }}
        >
          <motion.div
            className="term-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Developer terminal"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="term-head">
              <span className="term-dots"><i /><i /><i /></span>
              <span className="term-title">devansh.dev — visitor shell</span>
              <button type="button" className="term-close" onClick={() => setTerminalOpen(false)} aria-label="Close terminal">✕</button>
            </header>

            <div className="term-out" ref={outRef} data-lenis-prevent role="log">
              {history.map((h, i) => (
                <p key={i} className={`term-line term-${h.kind}`}>
                  {h.kind === 'in' && <span className="term-prompt">visitor@portfolio:~$ </span>}
                  {h.text}
                </p>
              ))}
            </div>

            <form className="term-form" onSubmit={onSubmit}>
              <span className="term-prompt">visitor@portfolio:~$</span>
              <input
                ref={inputRef}
                className="term-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
