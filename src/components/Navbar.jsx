import { useState, useEffect } from 'react';
import './Navbar.css';

const links = ['about', 'skills', 'projects', 'experience', 'certs', 'contact'];

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
      <a href="#home" className="logo">DH<span>.</span></a>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map((l) => (
          <a key={l} href={`#${l}`} onClick={close}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
        <a href="mailto:devanshhanda0001@gmail.com" className="cta" onClick={close}>
          Hire me ↗
        </a>
      </div>

      <div className="nav-right">
        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? '◑' : '☀'}
        </button>
        <button
          className={`menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
