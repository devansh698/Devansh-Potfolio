'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { useCompanion } from '@/components/providers/CompanionProvider';
import Magnetic from '@/components/ui/Magnetic';
import { SCRIPT } from '@/lib/interaction/script';
import { initTone, playTone } from '@/lib/interaction/tone';
import { profile } from '@/lib/data';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 80, email: 120, message: 2000 } as const;
const PROMPTS = ['I’m hiring for a backend role…', 'We need a Laravel + Vue build…', 'Loved the desk. Let’s chat…'] as const;

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = 'Please add your name.';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'That email doesn’t look right.';
  if (form.message.trim().length < 10) errors.message = 'A few more words, please (10+ characters).';
  return errors;
}

const field =
  'w-full border-b border-line bg-transparent py-3 text-lg text-fg placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-accent-2';

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState('');
  const [isCopied, setCopied] = useState(false);
  const { celebrate, say, glideTo, setTldrOpen, visitorName } = useCompanion();
  const isSending = status === 'sending';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-cta-line]', { type: 'chars' });
        gsap.from(split.chars, {
          x: () => gsap.utils.random(-500, 500),
          y: () => gsap.utils.random(-300, 300),
          z: () => gsap.utils.random(-800, 400),
          rotationX: () => gsap.utils.random(-270, 270),
          rotationY: () => gsap.utils.random(-270, 270),
          opacity: 0,
          transformPerspective: 900,
          ease: 'power3.out',
          stagger: { each: 0.02, from: 'random' },
          scrollTrigger: { trigger: '[data-cta]', start: 'top 95%', end: 'top 35%', scrub: 0.8 },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const copyEmail = async () => {
    initTone();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      playTone('discover');
      say(SCRIPT.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;
    initTone();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      playTone('close');
      return;
    }

    // Web3Forms keys are public by design; they can only post to the owner's inbox.
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      setNotice(`The form isn’t connected yet — email me at ${profile.email}.`);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: `Portfolio message from ${form.name.trim()}`,
          from_name: 'Portfolio contact form',
        }),
      });
      const data: { success?: boolean } = await res.json();
      if (!res.ok || !data.success) throw new Error('send-failed');
      setForm(EMPTY);
      setStatus('sent');
      setNotice('Got it — I’ll reply within a day or two.');
      celebrate('success');
    } catch {
      setStatus('error');
      setNotice(`Couldn’t send right now. Email me directly at ${profile.email}.`);
    }
  };

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="gutter relative overflow-hidden bg-surface pt-[clamp(6rem,12vw,10rem)]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 size-[40rem] opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }} />

      <div data-cta className="relative">
        <p className="label mb-6 flex items-center gap-3 text-muted">
          <span className="text-accent">06</span>
          <span className="h-px w-8 bg-line" />
          {visitorName ? `Your turn, ${visitorName}` : 'Contact'}
        </p>
        <h2 id="contact-title" className="display text-[clamp(2.6rem,10.8vw,12rem)] leading-[0.8]">
          <span className="block">
            <span data-cta-line className="block">
              Let&apos;s build
            </span>
          </span>
          <span className="block">
            <span data-cta-line className="block text-accent">
              something
            </span>
          </span>
        </h2>
      </div>

      <div className="relative mt-16 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-[36ch] text-lg text-muted">Open to backend & full-stack roles. Got a project, an opening, or just want to talk shop — my inbox is open. I reply fast.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={`mailto:${profile.email}`} data-cursor="Write" className="inline-flex h-14 items-center bg-accent px-7 text-lg font-semibold text-on-accent">
                {profile.email}
              </a>
            </Magnetic>
            <button type="button" onClick={copyEmail} className="h-14 border border-line px-5 font-semibold transition-colors hover:bg-fg hover:text-bg" aria-live="polite">
              {isCopied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {[
              ['GitHub', 'github.com/devansh698', profile.github],
              ['LinkedIn', 'linkedin.com/in/devanshhanda', profile.linkedin],
              ['Location', profile.location, null],
            ].map(([label, value, href]) => (
              <li key={label}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between py-4 hover:text-accent">
                    <span className="label text-muted">{label}</span>
                    <span className="transition-transform group-hover:-translate-x-2">{value} ↗</span>
                  </a>
                ) : (
                  <span className="flex items-baseline justify-between py-4">
                    <span className="label text-muted">{label}</span>
                    <span>{value}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                initTone();
                playTone('open');
                say(SCRIPT.startOver);
                glideTo('#top', 2.2);
              }}
              className="label border border-line px-4 py-2.5 hover:bg-fg hover:text-bg"
            >
              ↺ Start over
            </button>
            <button
              type="button"
              onClick={() => {
                initTone();
                playTone('open');
                setTldrOpen(true);
              }}
              className="label border border-line px-4 py-2.5 hover:bg-fg hover:text-bg"
            >
              ⚡ Quick portfolio
            </button>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" className="flex h-full flex-col items-start justify-center gap-4 border border-accent p-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="grid size-14 place-items-center bg-accent text-2xl text-on-accent">✓</span>
                <p className="display text-3xl">Message sent</p>
                <p role="status" className="text-muted">
                  {notice}
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="label mt-2 border border-line px-4 py-2 hover:bg-fg hover:text-bg">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {(['name', 'email'] as const).map((key) => (
                    <label key={key} className="block">
                      <span className="label text-muted">{key === 'name' ? 'Name' : 'Email'}</span>
                      <input
                        name={key}
                        type={key === 'email' ? 'email' : 'text'}
                        autoComplete={key}
                        required
                        maxLength={LIMITS[key]}
                        value={form[key]}
                        onChange={onChange}
                        aria-invalid={Boolean(errors[key])}
                        aria-describedby={errors[key] ? `${key}-error` : undefined}
                        className={field}
                        placeholder={key === 'name' ? 'Your name' : 'you@company.com'}
                      />
                      {errors[key] && (
                        <span id={`${key}-error`} className="mt-1 block text-sm text-accent-2">
                          {errors[key]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="label flex justify-between text-muted">
                    Message
                    <span className="tabular-nums">
                      {form.message.length}/{LIMITS.message}
                    </span>
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    maxLength={LIMITS.message}
                    value={form.message}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`${field} resize-none`}
                    placeholder="What are we building?"
                  />
                  {errors.message && (
                    <span id="message-error" className="mt-1 block text-sm text-accent-2">
                      {errors.message}
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playTone('tap');
                        setForm((f) => ({ ...f, message: p }));
                      }}
                      className="border border-dashed border-line px-3 py-1 text-sm text-muted hover:border-accent hover:text-fg"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p role="status" aria-live="polite" className="text-sm text-accent-2">
                    {status === 'error' ? notice : ''}
                  </p>
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={isSending}
                      data-cursor="Send"
                      className="h-14 bg-fg px-8 font-semibold uppercase text-bg transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSending ? 'Sending…' : 'Send message →'}
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { say, celebrate, setTerminalOpen, glideTo } = useCompanion();
  const hasFound = useRef(false);

  // The strange object: first click is the discovery, afterwards it's a door.
  const onSecret = () => {
    initTone();
    if (!hasFound.current) {
      hasFound.current = true;
      celebrate('discover');
      say(SCRIPT.secretFound);
      setTimeout(() => setTerminalOpen(true), 1400);
    } else {
      playTone('open');
      setTerminalOpen(true);
    }
  };

  return (
    <footer className="relative mt-[clamp(5rem,10vw,9rem)] border-t border-line py-6">
      <p aria-hidden="true" className="display pointer-events-none select-none text-center text-[clamp(3rem,17vw,19rem)] leading-[0.8] text-fg/[0.05]">
        {profile.name}
      </p>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="label text-muted">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js, GSAP & Three.js
        </p>
        <p className="label flex items-center gap-2 text-muted">
          Press <kbd className="rounded border border-line px-1.5 py-0.5 text-fg">`</kbd> for a shell
          <button type="button" onClick={onSecret} aria-label="A strange object" data-cursor="?" className="ml-2 text-lg text-accent transition-transform hover:rotate-45 hover:scale-125">
            ◆
          </button>
        </p>
        <button type="button" onClick={() => glideTo(0, 1.8)} className="label border border-line px-4 py-2 hover:bg-fg hover:text-bg">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
