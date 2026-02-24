import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { specializations, courses, badges } from '../data';
import './Certs.css';

const TABS = ['Specializations', 'Courses', 'Badges'];

export default function Certs() {
  const [tab, setTab] = useState('Specializations');
  const ref = useRef(null);
  useScrollReveal(ref);

  return (
    <section id="certs" className="sec" ref={ref}>
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">05 —</span>
          <h2 className="sec-title">Certifi<em>cations</em></h2>
        </div>

        {/* Horizontal specializations scroll */}
        <div className="spec-row sr-up">
          {specializations.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener"
              className="spec-chip"
            >
              <span className="spec-ico">{s.ico}</span>
              <div>
                <div className="spec-title">{s.title}</div>
                <div className="spec-org">{s.org}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="cert-tabs sr-up" style={{ transitionDelay: '.15s' }}>
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
              <span className="tab-count">
                {t === 'Specializations' ? specializations.length
                  : t === 'Courses' ? courses.length
                  : badges.length}
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
                rel="noopener"
                className={`cert-card sr-card stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="cert-ico">{s.ico}</div>
                <h4 className="cert-name">{s.title}</h4>
                <span className="cert-org">{s.org}</span>
                <span className="cert-badge spec-badge">Specialization ↗</span>
              </a>
            ))}
          </div>
        )}

        {tab === 'Courses' && (
          <div className="courses-list">
            {courses.map((c, i) => (
              <a
                key={i}
                href={c.url}
                target="_blank"
                rel="noopener"
                className={`course-row sr-card stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="course-info">
                  <div className="course-title">{c.t}</div>
                  <div className="course-org">{c.o}</div>
                </div>
                <div className="course-grade">{c.g}</div>
              </a>
            ))}
          </div>
        )}

        {tab === 'Badges' && (
          <div className="cert-grid">
            {badges.map((b, i) => (
              <a
                key={i}
                href={b.url}
                target="_blank"
                rel="noopener"
                className={`cert-card badge-card sr-card stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="cert-ico">🏅</div>
                <h4 className="cert-name">{b.t}</h4>
                <span className="cert-org">{b.o}</span>
                <span className="cert-badge">Credential ↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
