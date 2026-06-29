import { useEffect, useRef } from 'react';
import './Backdrop.css';

export default function Backdrop() {
  const gridRef = useRef(null);
  const b1 = useRef(null);
  const b2 = useRef(null);
  const b3 = useRef(null);
  const b4 = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (gridRef.current) gridRef.current.style.transform = `translateY(${y * 0.08}px)`;
        if (b1.current) b1.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
        if (b2.current) b2.current.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
        if (b3.current) b3.current.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
        if (b4.current) b4.current.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="bd-grid" ref={gridRef} />
      <div className="bd-blob bd-1" ref={b1} />
      <div className="bd-blob bd-2" ref={b2} />
      <div className="bd-blob bd-3" ref={b3} />
      <div className="bd-blob bd-4" ref={b4} />
      <div className="bd-scanline" />
    </div>
  );
}
