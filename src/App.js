import { useState, useEffect } from 'react';
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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  // Track scroll for progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cursor glow
  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      {/* Progress bar */}
      <div
        className="progress-bar"
        style={{ width: `${scrollPct}%` }}
      />

      {/* Cursor glow */}
      <div
        className="cursor-glow"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

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

