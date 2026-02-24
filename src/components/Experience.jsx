import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Experience.css';

const experience = [
  {
    period: 'May 2025 – Present',
    role: 'Software Developer Intern',
    org: 'Oriental Outsourcing',
    type: 'Full-time Internship',
    accent: 'a',
    bullets: [
      'Developing and maintaining full-stack web applications using React.js, Node.js, and MySQL',
      'Collaborating with senior developers to design RESTful APIs and database schemas',
      'Optimising front-end performance resulting in measurable improvements in load time',
      'Participating in agile sprints, code reviews, and daily stand-ups',
    ],
    tech: ['React', 'Node.js', 'MySQL', 'REST API', 'Git'],
  },
  {
    period: 'Apr 2024 – Jun 2024',
    role: 'Cisco AICTE Virtual Intern',
    org: 'Cisco Networking Academy',
    type: 'Virtual Internship',
    accent: 'a2',
    bullets: [
      'Completed modules on cybersecurity fundamentals and network infrastructure design',
      'Gained hands-on experience with AI applications in modern enterprise environments',
      'Studied Cisco networking tools, packet analysis, and security protocols',
    ],
    tech: ['Cybersecurity', 'Networking', 'AI/ML', 'Cisco Tools'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  useScrollReveal(ref);

  return (
    <section id="experience" className="sec exp-sec" ref={ref}>
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">04 —</span>
          <h2 className="sec-title">Work <em>Experience</em></h2>
        </div>

        <div className="exp-list">
          {experience.map((e, i) => (
            <div key={i} className={`exp-card sr-card stagger-${i + 1}`}>
              <div className="exp-left">
                <span className={`exp-period per-${e.accent}`}>{e.period}</span>
                <span className="exp-type">{e.type}</span>
                <div className="exp-org-badge">{e.org.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
              </div>
              <div className="exp-right">
                <h3 className="exp-role">{e.role}</h3>
                <div className={`exp-org org-${e.accent}`}>{e.org}</div>
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
