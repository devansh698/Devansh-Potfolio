import { links } from '../data';
import { useCompanion } from '../interaction/CompanionContext';
import { SCRIPT } from '../interaction/script';
import { firstTime } from '../interaction/memory';
import { playTone } from '../interaction/tone';
import './Footer.css';

const navLinks = ['about', 'skills', 'projects', 'experience', 'certs', 'contact'];

export default function Footer() {
  const { say, celebrate, setTerminalOpen } = useCompanion();

  // The strange object: first click is the discovery, then it's a door.
  const handleSecret = () => {
    if (firstTime('secret-object')) {
      celebrate('discover');
      say(SCRIPT.secretFound);
      setTimeout(() => setTerminalOpen(true), 1400);
    } else {
      playTone('open');
      setTerminalOpen(true);
    }
  };

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
          <span className="f-stamp">
            EOF — 2026
            <button
              type="button"
              className="f-secret"
              onClick={handleSecret}
              aria-label="A strange object"
            >
              ◆
            </button>
          </span>
          <a href={`mailto:${links.email}`}>{links.email}</a>
        </div>
      </div>
    </footer>
  );
}
