import { useState, useEffect } from 'react';
import { links } from '../data';
import './Navbar.css';

const navLinks = [
  { id: 'about', n: '01' },
  { id: 'skills', n: '02' },
  { id: 'projects', n: '03' },
  { id: 'experience', n: '04' },
  { id: 'certs', n: '05' },
  { id: 'contact', n: '06' },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#home" className="logo">
          <span className="logo-mark">DH</span>
          <span className="logo-idx">N° 01</span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={close}>
              <span className="nl-n">{l.n}</span>
              {l.id.charAt(0).toUpperCase() + l.id.slice(1)}
            </a>
          ))}
          <a href={`mailto:${links.email}`} className="cta" onClick={close}>
            Hire Me ↗
          </a>
        </div>

        <div className="nav-right">
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? '◐' : '●'}
          </button>
          <button className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
