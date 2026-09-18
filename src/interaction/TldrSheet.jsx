import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from './CompanionContext';
import { projects, skills, links, experience } from '../data';
import { playTone } from './tone';
import './TldrSheet.css';

/**
 * "QUICK PORTFOLIO" — the whole story on one card, for visitors who
 * skipped the tour. Static content pulled straight from data.js.
 */
export default function TldrSheet() {
  const { tldrOpen, setTldrOpen, lockScroll } = useCompanion();

  useEffect(() => {
    if (!tldrOpen) return undefined;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') setTldrOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [tldrOpen, setTldrOpen, lockScroll]);

  const close = () => {
    playTone('close');
    setTldrOpen(false);
  };

  const top = projects.filter((p) => p.gh !== '#').slice(0, 3);
  const now = experience[0];

  return (
    <AnimatePresence>
      {tldrOpen && (
        <motion.div
          className="tldr-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className="tldr-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Quick portfolio summary"
            data-lenis-prevent
            initial={{ scale: 0.94, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="tldr-head">
              <span className="tldr-stamp">TL;DR</span>
              <button type="button" className="tldr-close" onClick={close} aria-label="Close summary">✕</button>
            </header>

            <h3 className="tldr-name">Devansh Handa</h3>
            <p className="tldr-role">
              Software Engineer @ {now.org} · {now.period.split(' — ')[0]} → now
            </p>

            <div className="tldr-block">
              <span className="tldr-label">STACK</span>
              <p className="tldr-val">{skills.slice(0, 6).map((s) => s.name).join(' · ')}</p>
            </div>

            <div className="tldr-block">
              <span className="tldr-label">PROOF</span>
              <ul className="tldr-projects">
                {top.map((p) => (
                  <li key={p.id}>
                    <a href={p.gh} target="_blank" rel="noopener noreferrer">
                      <span className="tldr-code">{p.code}</span> {p.title} — {p.sub} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tldr-block">
              <span className="tldr-label">FACT</span>
              <p className="tldr-val">Intern → full-time engineer inside a year, shipping production CRMs.</p>
            </div>

            <div className="tldr-actions">
              <a className="btn-solid" href={`mailto:${links.email}`}>Email Me</a>
              <a className="btn-ghost" href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="btn-ghost" href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
