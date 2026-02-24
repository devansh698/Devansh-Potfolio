import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

const timeline = [
  {
    yr: '2025 – Present',
    role: 'Software Developer Intern',
    org: 'Oriental Outsourcing',
    desc: 'Building and maintaining full-stack web applications using React, Node.js, and MySQL. Collaborating with cross-functional teams to deliver scalable business solutions.',
    accent: 'a',
  },
  {
    yr: '2024',
    role: 'Cisco AICTE Virtual Intern',
    org: 'Cisco Networking Academy',
    desc: 'Completed virtual internship focusing on cybersecurity fundamentals, network infrastructure, and AI applications in modern enterprise environments.',
    accent: 'a2',
  },
  {
    yr: '2022 – 2026',
    role: 'B.E. Computer Science & Engineering',
    org: 'Chitkara University',
    desc: 'Pursuing a four-year engineering degree with specialisations in full-stack development, machine learning, and software product management. CGPA: 8.5+',
    accent: 'a3',
  },
  {
    yr: '2022',
    role: 'Class XII – Science (PCM)',
    org: 'D.A.V. Public School, Hisar',
    desc: 'Completed senior secondary with Physics, Chemistry, and Mathematics. Developed a strong analytical foundation that drives my engineering approach.',
    accent: 'a2',
  },
];

export default function About() {
  const ref = useRef(null);
  useScrollReveal(ref);

  return (
    <section id="about" className="sec" ref={ref}>
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">01 —</span>
          <h2 className="sec-title">About <em>Me</em></h2>
        </div>

        <div className="about-grid">
          <div className="about-left sr-left">
            <p className="about-lead">
              Hey! I'm <strong>Devansh Handa</strong>, a Computer Science &amp; Engineering
              student at Chitkara University with a passion for building software that
              genuinely makes a difference.
            </p>
            <p>
              I thrive at the intersection of elegant front-end experiences and robust
              back-end architecture — whether that's a MERN-stack product or a
              machine-learning pipeline. When I'm not coding, I'm exploring new
              certifications, contributing to open-source, or diving deep into AI research.
            </p>
            <p>
              I'm actively seeking internship and full-time opportunities where I can
              ship real-world impact alongside great teams.
            </p>

            <div className="about-tags">
              {['React', 'Node.js', 'Python', 'Java', 'Laravel', 'AWS', 'PyTorch', 'MongoDB'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <a
              href="mailto:devanshhanda0001@gmail.com"
              className="btn-solid"
              style={{ marginTop: '2rem', display: 'inline-flex' }}
            >
              Work with me →
            </a>
          </div>

          <div className="timeline-wrap sr-right">
            {timeline.map((item, i) => (
              <div key={i} className={`tl-item stagger-${i + 1}`}>
                <div className={`tl-dot dot-${item.accent}`} />
                <div className="tl-content">
                  <span className={`tl-yr yr-${item.accent}`}>{item.yr}</span>
                  <h4 className="tl-role">{item.role}</h4>
                  <span className="tl-org">{item.org}</span>
                  <p className="tl-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
