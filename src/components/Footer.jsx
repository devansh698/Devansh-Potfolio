import { links } from '../data';
import './Footer.css';

const navLinks = ['about', 'skills', 'projects', 'experience', 'certs', 'contact'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="f-left">
          <a href="#home" className="f-logo">Devansh Handa</a>
          <p className="f-copy">Full-Stack Software Developer · Kurukshetra, India</p>
        </div>
        <div className="f-links">
          {navLinks.map(l => (
            <a key={l} href={`#${l}`}>{l.charAt(0).toUpperCase() + l.slice(1)}</a>
          ))}
        </div>
        <div className="f-right">
          <span className="f-stamp">EOF — 2026</span>
          <a href={`mailto:${links.email}`}>{links.email}</a>
        </div>
      </div>
    </footer>
  );
}
