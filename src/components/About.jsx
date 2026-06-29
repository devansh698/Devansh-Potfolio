import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { education, links } from '../data';
import './About.css';

const file = [
  { k: 'Role', v: 'Software Engineer' },
  { k: 'Company', v: 'Oriental Outsourcing' },
  { k: 'Stack', v: 'MERN · Laravel · Flask' },
  { k: 'Based In', v: 'Kurukshetra, India' },
  { k: 'Status', v: 'Open to new roles' },
];

export default function About() {
  const ref = useRef(null);
  const spot = useSpotlight();
  useScrollReveal(ref);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const fileY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const eduY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section id="about" className="sec about-sec" ref={ref}>
      <span className="ghost-num" style={{ top: '-2rem', right: '-1rem' }}>02</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">About <em>Me</em></h2>
          <span className="sec-num">Section 02</span>
        </div>

        <div className="about-grid">
          <div className="about-left sr-left">
            <p className="about-lead">
              I'm <strong>Devansh Handa</strong> — a full-stack developer who went
              from intern to Software Engineer at Oriental Outsourcing in under a
              year, and I'm finishing my B.E. in Computer Science &amp; Engineering
              at Chitkara University alongside it.
            </p>
            <p>
              My day-to-day is building and maintaining live CRM applications:
              REST APIs, database schemas, WebSocket-driven real-time features,
              and the front-end that ties it together — across MERN, Laravel,
              and Flask. I like the parts of the job tutorials skip: keeping a
              production system stable while you change it.
            </p>
            <p>
              Outside of shipping features, I've put real hours into the
              fundamentals — data structures &amp; algorithms, applied machine
              learning, cloud architecture — because I want to understand systems
              from the query layer up to deployment, not just glue libraries
              together.
            </p>

            <div className="about-tags">
              {['React', 'Node.js', 'Laravel', 'Flask', 'MongoDB', 'MySQL', 'AWS', 'WebSockets'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <a href={`mailto:${links.email}`} className="btn-solid" style={{ marginTop: '2.5rem' }}>
              Work With Me →
            </a>
          </div>

          <div className="file-wrap sr-right">
            <motion.div className="file-card spotlight" onMouseMove={spot} style={{ y: fileY }}>
              <div className="file-head">
                <span>CASE FILE</span>
                <span className="file-id">#DH-2026</span>
              </div>
              {file.map((f) => (
                <div key={f.k} className="file-row">
                  <span className="file-k">{f.k}</span>
                  <span className="file-v">{f.v}</span>
                </div>
              ))}
              <div className="file-stamp">VERIFIED</div>
            </motion.div>

            <motion.div className="edu-card spotlight" onMouseMove={spot} style={{ y: eduY }}>
              <span className="edu-label">Education</span>
              {education.map((e, i) => (
                <div key={i} className="edu-row">
                  <span className="edu-period">{e.period}</span>
                  <div>
                    <div className="edu-deg">{e.deg}</div>
                    <div className="edu-org">{e.org}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
