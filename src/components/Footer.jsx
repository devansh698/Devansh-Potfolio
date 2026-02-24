import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="f-left">
          <a href="#home" className="f-logo">DH<span>.</span></a>
          <p className="f-copy">
            Designed & built by <strong>Devansh Handa</strong> · 2026
          </p>
        </div>
        <div className="f-links">
          {['about', 'skills', 'projects', 'experience', 'certs', 'contact'].map(l => (
            <a key={l} href={`#${l}`}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
