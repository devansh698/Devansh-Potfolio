import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpotlight } from '../hooks/useSpotlight';
import { useTilt } from '../hooks/useTilt';
import { useProximity } from '../hooks/useProximity';
import { useCompanion } from '../interaction/CompanionContext';
import { SCRIPT } from '../interaction/script';
import { playTone } from '../interaction/tone';
import { projects } from '../data';
import './Projects.css';

const CATS = ['All', 'MERN', 'Laravel', 'Web'];

function StickyProjectCard({ p, i, total, progress, onOpen, onInterest }) {
  const spot = useSpotlight();
  const tiltRef = useTilt({ max: 3.5 });
  const proxRef = useProximity({ radius: 220 });
  const range = [i / total, Math.min((i + 1.4) / total, 1)];
  const scale = useTransform(progress, range, [1, 0.92]);
  const opacity = useTransform(progress, [range[0], range[1]], [1, i === total - 1 ? 1 : 0.45]);

  // Tilt + proximity both live on the card element itself.
  const setRefs = (el) => {
    tiltRef.current = el;
    proxRef.current = el;
  };

  return (
    <div className="sticky-slot" style={{ top: `${6 + i * 2.6}rem` }}>
      <motion.div style={{ scale, opacity }} className="proj-slot-motion">
        <div
          ref={setRefs}
          className="proj-card spotlight"
          onMouseMove={spot}
          onMouseEnter={() => onInterest(p.id)}
          onClick={() => onOpen(p)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(p);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Open ${p.title} case study`}
        >
          <span className="proj-explore" aria-hidden="true">EXPLORE ↳</span>
          <div className="proj-card-top">
            <span className="proj-code">{p.code}</span>
            <span className="proj-cat">{p.cat}</span>
          </div>
          <h3 className="proj-title">{p.title}</h3>
          <span className="proj-sub">{p.sub}</span>
          <span className="proj-period">{p.period}</span>
          <p className="proj-desc">{p.desc}</p>
          <div className="proj-tags">
            {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="proj-footer">
            {p.gh !== '#' ? (
              <a
                href={p.gh}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-link"
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon /> View Code
              </a>
            ) : (
              <span className="proj-wip">In Development</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState('All');
  const stackRef = useRef(null);
  const interestRef = useRef({});
  const { setStoryProject, say, setMood } = useCompanion();
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  const filtered = active === 'All' ? projects : projects.filter(p => p.cat === active);

  const handleOpen = (p) => {
    playTone('open');
    setStoryProject(p);
  };

  // The site noticing repeated attention on one project — once, gently.
  const handleInterest = (id) => {
    interestRef.current[id] = (interestRef.current[id] || 0) + 1;
    if (interestRef.current[id] === 3) {
      say(SCRIPT.projectInterest, { once: 'project-interest' });
      setMood('curious', 2400);
    }
  };

  return (
    <section id="projects" className="sec projects-sec">
      <span className="ghost-num" style={{ top: '-2rem', right: '-1rem' }}>04</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">Featured <em>Work</em></h2>
          <span className="sec-num">Section 04</span>
        </div>

        <div className="proj-filters">
          {CATS.map(c => (
            <button
              key={c}
              className={`filter-btn ${active === c ? 'active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div
        className="proj-stack"
        ref={stackRef}
        style={{ height: `${filtered.length * 60 + 60}vh` }}
      >
        {filtered.map((p, i) => (
          <StickyProjectCard
            key={p.id}
            p={p}
            i={i}
            total={filtered.length}
            progress={scrollYProgress}
            onOpen={handleOpen}
            onInterest={handleInterest}
          />
        ))}
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
