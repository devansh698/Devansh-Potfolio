import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { projects } from '../data';
import './Projects.css';

const CATS = ['All', 'MERN', 'Laravel', 'Web'];

export default function Projects() {
  const [active, setActive] = useState('All');
  const ref = useRef(null);
  useScrollReveal(ref);

  const filtered = active === 'All' ? projects : projects.filter(p => p.cat === active);

  return (
    <section id="projects" className="sec" ref={ref}>
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">03 —</span>
          <h2 className="sec-title">Featured <em>Projects</em></h2>
        </div>

        <div className="proj-filters sr-up">
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

        <div className="proj-grid">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={`proj-card sr-card stagger-${Math.min(i + 1, 8)}`}
            >
              <div className="proj-ico">{p.e}</div>
              <span className="proj-cat">{p.cat}</span>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-desc">{p.desc}</p>
              <div className="proj-tags">
                {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="proj-footer">
                {p.gh !== '#' ? (
                  <a href={p.gh} target="_blank" rel="noopener" className="proj-link">
                    <GithubIcon /> Code
                  </a>
                ) : (
                  <span className="proj-wip">🔧 In Development</span>
                )}
              </div>
            </div>
          ))}
        </div>
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
