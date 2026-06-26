import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import './styles/global.css';
import './styles/animations.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero.jsx';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience';
import Certs from './components/Certs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Backdrop from './components/Backdrop';
import Cursor from './components/Cursor';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const lenisRef = useRef(null);

  // Smooth scroll + scroll progress, driven off Lenis' own RAF loop
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll, limit }) => {
      setScrollPct(limit > 0 ? Math.min((scroll / limit) * 100, 100) : 0);
    });

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Intercept in-page anchor links for buttery smooth jumps
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      const target = id.length > 1 ? document.querySelector(id) : document.body;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Backdrop />
      <Cursor />

      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${scrollPct}%` }} />

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certs />
      <Contact />
      <Footer />
    </div>
  );
}

