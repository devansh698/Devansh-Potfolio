import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { links } from '../data';
import { useSpotlight } from '../hooks/useSpotlight';
import { useMagnetic } from '../hooks/useMagnetic';
import './Hero.css';

const WORDS = [
  'Full-Stack Developer',
  'Software Engineer',
  'MERN / Laravel Specialist',
  'REST API Architect',
  'Real-Time Systems Builder',
];

const TICKER = [
  'REACT', 'LARAVEL', 'NODE.JS', 'MERN STACK', 'FLASK', 'REST APIs',
  'WEBSOCKETS', 'JWT AUTH', 'MONGODB', 'MYSQL', 'AWS', 'REDIS',
];

function useTypewriter(words) {
  const [display, setDisplay] = useState('');
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wi % words.length];
    const speed = deleting ? 26 : 62;

    const t = setTimeout(() => {
      if (!deleting) {
        const next = ci + 1;
        setDisplay(word.slice(0, next));
        if (next === word.length) {
          setTimeout(() => setDeleting(true), 1500);
        } else {
          setCi(next);
        }
      } else {
        const next = ci - 1;
        setDisplay(word.slice(0, next));
        if (next === 0) {
          setDeleting(false);
          setWi((w) => w + 1);
          setCi(0);
        } else {
          setCi(next);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [ci, deleting, wi, words]);

  return display;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const typed = useTypewriter(WORDS);
  const spot = useSpotlight();
  const magRef = useMagnetic();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="crop tl" /><div className="crop tr" /><div className="crop bl" /><div className="crop br" />
      <div className="hero-grid" />
      <motion.span className="ghost-num hero-ghost" style={{ y: ghostY }}>01</motion.span>

      <div className="hero-inner wrap">
        <motion.div className="stamp" initial="hidden" animate="show" custom={0} variants={fadeUp}>
          Open to Backend &amp; Full-Stack Roles
        </motion.div>

        <motion.h1 className="name" initial="hidden" animate="show" custom={1} variants={fadeUp}>
          <span>Devansh</span>
          <span className="ital">Handa</span>
        </motion.h1>

        <motion.div className="typed-row" initial="hidden" animate="show" custom={2} variants={fadeUp}>
          <span className="prefix">Currently shipping as a&nbsp;</span>
          <span className="typed-word">{typed}</span>
          <span className="cur blink-cursor">_</span>
        </motion.div>

        <motion.p className="bio" initial="hidden" animate="show" custom={3} variants={fadeUp}>
          Software Engineer at Oriental Outsourcing — went from intern to full-time
          inside a year, shipping production CRM systems across the MERN and
          Laravel stacks. I design REST APIs, build real-time features, and care
          about code that's still readable six months later.
        </motion.p>

        <motion.div className="hero-actions" initial="hidden" animate="show" custom={4} variants={fadeUp}>
          <span ref={magRef}>
            <a href="#projects" className="btn-solid">View Work ↗</a>
          </span>
          <a href="#contact" className="btn-ghost">Get In Touch</a>
          <div className="socials">
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="sc" title="GitHub"><GithubIcon /></a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="sc" title="LinkedIn"><LinkedinIcon /></a>
            <a href={`mailto:${links.email}`} className="sc" title="Email"><MailIcon /></a>
          </div>
        </motion.div>

        <motion.div className="stat-cards" initial="hidden" animate="show" custom={5} variants={fadeUp}>
          {[
            { n: '01+', l: 'Year in Production' },
            { n: '06+', l: 'Projects Shipped' },
            { n: '20+', l: 'Certifications' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              className="stat-card spotlight"
              onMouseMove={spot}
              whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
              style={{ '--rot': `${i % 2 ? 1 : -1}deg` }}
            >
              <span className="stat-n">{s.n}</span>
              <span className="stat-l">{s.l}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="ticker-strip">
        <div className="marquee">
          {[...TICKER, ...TICKER].map((w, i) => (
            <span key={i} className="ticker-item">{w} <span className="ticker-dot">●</span></span>
          ))}
        </div>
      </div>

      <a href="#about" className="scroll-cue">
        <span className="sline" />
        Scroll
      </a>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
