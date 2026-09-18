'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { THEMES, THEME_IDS, useTheme, type ThemeId } from '@/components/providers/ThemeProvider';
import Modal, { CloseButton } from '@/components/ui/Modal';
import { playTone } from '@/lib/interaction/tone';
import { profile, projects, roles, skills } from '@/lib/data';

type Kind = 'in' | 'out' | 'sys' | 'ok' | 'err' | 'grant';
interface Line {
  id: number;
  kind: Kind;
  text: string;
}

const KIND_CLASS: Record<Kind, string> = {
  in: 'text-fg',
  out: 'text-fg/80',
  sys: 'text-muted',
  ok: 'text-accent',
  err: 'text-accent-2',
  grant: 'display text-2xl text-accent',
};

const COMMANDS = ['help', 'about', 'whoami', 'projects', 'open', 'skills', 'contact', 'theme', 'name', 'sound', 'tldr', 'goto', 'clear', 'exit', 'sudo hire devansh'];
const SECTIONS = ['about', 'skills', 'work', 'experience', 'certs', 'contact'];

/** Hidden visitor shell: ` or Ctrl/⌘+K, the monitor on the desk, or the footer's secret object. */
export default function Terminal() {
  const companion = useCompanion();
  const { isTerminalOpen, setTerminalOpen, isReady } = companion;

  useEffect(() => {
    if (!isReady) return;
    const onKey = (e: KeyboardEvent) => {
      const isCombo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (e.key !== '`' && !isCombo) return;
      if (!isCombo && e.target instanceof Element && e.target.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      playTone('open');
      setTerminalOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReady, setTerminalOpen]);

  return (
    <Modal isOpen={isTerminalOpen} onClose={() => setTerminalOpen(false)} label="Developer terminal" className="max-w-2xl !bg-bg font-mono">
      <Shell />
    </Modal>
  );
}

function Shell() {
  const { setTerminalOpen, visitorName, setVisitorName, isSoundOn, toggleSound, celebrate, setTldrOpen, setStoryProject, glideTo, say } =
    useCompanion();
  const { setTheme, theme } = useTheme();
  const nextId = useRef(0);
  const make = (kind: Kind, text: string): Line => ({ id: nextId.current++, kind, text });
  const [history, setHistory] = useState<Line[]>(() => [
    { id: -2, kind: 'sys', text: 'DH-OS v3.0 — visitor shell' },
    { id: -1, kind: 'sys', text: "type 'help' to get started · tab completes · ↑ recalls" },
  ]);
  const [value, setValue] = useState('');
  const [past, setPast] = useState<string[]>([]);
  const [pastIndex, setPastIndex] = useState(-1);
  const out = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    out.current?.scrollTo({ top: out.current.scrollHeight });
  }, [history]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const push = (...lines: Line[]) => setHistory((h) => [...h, ...lines]);
  const pushLater = (lines: Line[], step = 520) =>
    lines.forEach((line, i) => {
      const t = setTimeout(() => {
        timers.current.delete(t);
        push(line);
        playTone('type');
      }, (i + 1) * step);
      timers.current.add(t);
    });

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push(make('in', cmd));
    setPast((p) => [cmd, ...p].slice(0, 30));
    const lower = cmd.toLowerCase();
    const [head, ...rest] = lower.split(/\s+/);
    const arg = rest.join(' ');

    switch (head) {
      case 'help':
        push(
          ...[
            'about            who is devansh',
            'whoami           who are you',
            'projects         list the work',
            'open <n>         open a case study (1–6)',
            'skills           the toolkit',
            'contact          reach out',
            `theme <name>     ${THEME_IDS.join(' | ')}`,
            'goto <section>   fly somewhere',
            'name <yours>     introduce yourself',
            'sound on|off     feedback blips',
            'tldr · clear · exit',
          ].map((t) => make('out', t)),
          make('sys', '…and root can do one more thing.'),
        );
        return;
      case 'about':
        push(make('out', `${profile.name} — ${profile.role} at ${profile.company}.`), make('out', 'Intern → full-time in a year. Ships MERN + Laravel in production.'));
        return;
      case 'whoami':
        push(make('out', visitorName ? `${visitorName} — good to see you.` : "guest — try 'name <yours>'."));
        return;
      case 'projects':
        push(...projects.map((p, i) => make('out', `${i + 1}  ${p.code}  ${p.title} — ${p.kind}`)), make('sys', "try 'open 1'"));
        return;
      case 'open': {
        const p = projects[Number(arg) - 1];
        if (!p) return push(make('err', 'usage: open <1-6>'));
        push(make('ok', `opening ${p.title}…`));
        setTimeout(() => {
          setTerminalOpen(false);
          setStoryProject(p);
        }, 450);
        return;
      }
      case 'skills':
        push(...skills.map((s) => make('out', `${s.name.padEnd(22, ' ')}${'█'.repeat(Math.round(s.level / 10)).padEnd(10, '░')} ${s.level}%`)));
        return;
      case 'contact':
        push(make('out', `mail    ${profile.email}`), make('out', 'github  github.com/devansh698'), make('out', 'linked  linkedin.com/in/devanshhanda'));
        return;
      case 'theme': {
        if (!arg) return push(make('out', `current: ${theme.id} · available: ${THEME_IDS.join(', ')}`));
        if (!(arg in THEMES)) return push(make('err', `unknown theme '${arg}'`));
        setTheme(arg as ThemeId);
        playTone('discover');
        return push(make('ok', `theme → ${arg}`));
      }
      case 'goto': {
        if (!SECTIONS.includes(arg)) return push(make('err', `usage: goto <${SECTIONS.join('|')}>`));
        push(make('ok', `flying to #${arg}…`));
        setTimeout(() => {
          setTerminalOpen(false);
          glideTo(`#${arg}`);
        }, 400);
        return;
      }
      case 'name': {
        const n = cmd.slice(5).replace(/[<>]/g, '').trim().slice(0, 24);
        if (!n) return push(make('err', 'usage: name <yours>'));
        setVisitorName(n);
        say(`Hi ${n}!`);
        return push(make('ok', `Nice to meet you, ${n}.`));
      }
      case 'sound': {
        if (arg !== 'on' && arg !== 'off') return push(make('err', 'usage: sound on|off'));
        if ((arg === 'on') !== isSoundOn) toggleSound();
        return push(make('ok', `sound: ${arg}`));
      }
      case 'tldr':
        setTerminalOpen(false);
        setTldrOpen(true);
        return;
      case 'clear':
        setHistory([]);
        return;
      case 'exit':
        setTerminalOpen(false);
        return;
    }

    if (lower === 'sudo hire devansh') {
      pushLater([
        make('out', 'checking references … ok'),
        make('out', `evaluating stack [${roles[0].stack.slice(0, 3).join(' · ')}] … ok`),
        make('out', 'reviewing shipping record … ok'),
        make('grant', 'PERMISSION GRANTED.'),
        make('ok', `→ ${profile.email} — let’s talk.`),
      ]);
      const t = setTimeout(() => celebrate('success'), 4 * 520);
      timers.current.add(t);
    } else if (lower === 'hire devansh' || lower === 'hire') {
      push(make('err', 'permission denied — try sudo.'));
    } else if (head === 'sudo') {
      push(make('out', 'sudo: only one elevation is supported here. try: sudo hire devansh'));
    } else {
      push(make('err', `command not found: ${cmd} — try 'help'`));
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playTone('tap');
    run(value);
    setValue('');
    setPastIndex(-1);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(value.toLowerCase()) && value);
      if (match) setValue(match);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(-1, Math.min(past.length - 1, pastIndex + (e.key === 'ArrowUp' ? 1 : -1)));
      setPastIndex(next);
      setValue(next === -1 ? '' : past[next]);
    } else {
      playTone('type');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-3 bg-[#ff5f57]" />
          <i className="size-3 bg-[#febc2e]" />
          <i className="size-3 bg-[#28c840]" />
        </span>
        <span className="label text-muted">devansh.dev — visitor shell</span>
        <CloseButton onClick={() => setTerminalOpen(false)} label="Close terminal" />
      </header>
      <div ref={out} role="log" className="h-[min(22rem,55svh)] space-y-1 overflow-y-auto px-4 py-4 text-sm" data-lenis-prevent>
        {history.map((line) => (
          <p key={line.id} className={`whitespace-pre-wrap break-words ${KIND_CLASS[line.kind]}`}>
            {line.kind === 'in' && <span className="text-accent">visitor@portfolio:~$ </span>}
            {line.text}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm">
        <span className="shrink-0 text-accent">visitor@portfolio:~$</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none focus-visible:outline-none"
        />
      </form>
    </>
  );
}
