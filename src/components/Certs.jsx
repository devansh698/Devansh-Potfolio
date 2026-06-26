import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { specializations, courses } from '../data';
import './Certs.css';

const TABS = ['Specializations', 'Verified Courses'];

export default function Certs() {
  const [tab, setTab] = useState('Specializations');
  const ref = useRef(null);
  const spot = useSpotlight();
  useScrollReveal(ref);

  return (
    <section id="certs" className="sec certs-sec" ref={ref}>
      <span className="ghost-num" style={{ top: '-2rem', right: '-1rem' }}>06</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">Certifi<em>cations</em></h2>
          <span className="sec-num">Section 06</span>
        </div>

        <div className="cert-tabs sr-up">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
              <span className="tab-count">
                {t === 'Specializations' ? specializations.length : courses.length}
              </span>
            </button>
          ))}
        </div>

        {tab === 'Specializations' && (
          <div className="cert-grid">
            {specializations.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`cert-card spotlight sr-card stagger-${Math.min(i + 1, 8)}`}
                onMouseMove={spot}
              >
                <div className="cert-top">
                  <span className="cert-ico">{s.ico}</span>
                  <span className="cert-date">{s.date}</span>
                </div>
                <h4 className="cert-name">{s.title}</h4>
                <span className="cert-org">{s.org}</span>
                <span className="cert-badge">Specialization ↗</span>
              </a>
            ))}
          </div>
        )}

        {tab === 'Verified Courses' && (
          <div className="courses-list">
            {courses.map((c, i) => (
              <a
                key={i}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`course-row sr-up stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="course-info">
                  <div className="course-title">{c.t}</div>
                  <div className="course-org">{c.o}</div>
                </div>
                <span className="course-arrow">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
