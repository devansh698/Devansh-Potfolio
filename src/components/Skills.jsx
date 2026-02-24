import { useRef, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { skills } from '../data';
import './Skills.css';

export default function Skills() {
  const ref = useRef(null);
  useScrollReveal(ref);

  // Animate bars when section enters view
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
      <div className="wrap">
        <div className="sec-hdr">
          <span className="sec-num">02 —</span>
          <h2 className="sec-title">Tech <em>Stack</em></h2>
        </div>

        <div className="skills-grid">
          {skills.map((s, i) => (
            <div
              key={s.name}
              className={`skill-card sr-card stagger-${Math.min(i + 1, 8)}`}
            >
              <div className="skill-top">
                <div className="skill-icon">{s.ico}</div>
                <div>
                  <div className="skill-name">{s.name}</div>
                  <div className="skill-pct">{s.level}%</div>
                </div>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  data-level={s.level}
                  style={{ width: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
