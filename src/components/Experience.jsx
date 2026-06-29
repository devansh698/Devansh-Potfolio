import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { experience } from '../data';
import './Experience.css';

export default function Experience() {
  const ref = useRef(null);
  const listRef = useRef(null);
  useScrollReveal(ref);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  });

  return (
    <section id="experience" className="sec exp-sec" ref={ref}>
      <span className="ghost-num" style={{ top: '-2rem', left: '-1rem' }}>05</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">Work <em>Experience</em></h2>
          <span className="sec-num">Section 05</span>
        </div>

        <div className="exp-list" ref={listRef}>
          <svg className="exp-trace" viewBox="0 0 24 300" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="traceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--flame)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--moss)' }} />
              </linearGradient>
            </defs>
            <path
              d="M12 0 L12 40 L4 60 L4 100 L20 130 L20 180 L12 200 L12 260 L12 300"
              className="exp-trace-bg"
            />
            <motion.path
              d="M12 0 L12 40 L4 60 L4 100 L20 130 L20 180 L12 200 L12 260 L12 300"
              className="exp-trace-fg"
              stroke="url(#traceGrad)"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          {experience.map((e, i) => (
            <div key={i} className={`exp-card sr-card stagger-${i + 1}`}>
              <div className="exp-left">
                <span className="exp-code">{e.code}</span>
                <span className={`exp-period per-${e.accent}`}>{e.period}</span>
              </div>
              <div className="exp-right">
                <h3 className="exp-role">{e.role}</h3>
                <div className="exp-org">{e.org}</div>
                <ul className="exp-bullets">
                  {e.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
                <div className="exp-tech">
                  {e.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
