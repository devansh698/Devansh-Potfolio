import { useRef, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { skills } from '../data';
import './Skills.css';

export default function Skills() {
  const ref = useRef(null);
  useScrollReveal(ref);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const bars = ref.current?.querySelectorAll('.bar-fill');
          bars?.forEach((bar) => {
            bar.style.width = bar.dataset.level + '%';
          });
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="sec skills-sec" ref={ref}>
      <span className="ghost-num" style={{ top: '-2rem', left: '-1rem' }}>03</span>
      <div className="wrap">
        <div className="sec-hdr">
          <h2 className="sec-title">Tech <em>Stack</em></h2>
          <span className="sec-num">Section 03</span>
        </div>

        <div className="skills-list">
          <div className="skills-list-head">
            <span>Skill</span>
            <span>Proficiency</span>
          </div>
          {skills.map((s, i) => (
            <div key={s.name} className={`skill-row sr-up stagger-${Math.min(i + 1, 8)}`}>
              <div className="skill-name-col">
                <span className="skill-ico">{s.ico}</span>
                <span className="skill-name">{s.name}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" data-level={s.level} style={{ width: 0 }} />
              </div>
              <span className="skill-pct">{s.level}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
