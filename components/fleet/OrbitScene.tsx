'use client';
import { useEffect, useRef } from 'react';

const CARDS = [
  { href: '/fleet/n971mc', pod: 'POD 1', tail: 'N971MC', photoClass: 'orbit-card-photo--n971mc' },
  { href: '/fleet/n150mb', pod: 'POD 2', tail: 'N150MB', photoClass: 'orbit-card-photo--n150mb' },
  { href: '/fleet/n251ft', pod: 'POD 3', tail: 'N251FT', photoClass: 'orbit-card-photo--n251ft' },
  { href: '/fleet/n395pd', pod: 'POD 5', tail: 'N395PD', photoClass: 'orbit-card-photo--n395pd' },
  { href: '/fleet/n7pg',   pod: 'POD 6', tail: 'N7PG',   photoClass: 'orbit-card-photo--n7pg'   },
];

export default function OrbitScene() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current!;
    if (!scene) return;

    const cards = Array.from(scene.querySelectorAll<HTMLElement>('.orbit-card'));
    const path  = scene.querySelector<HTMLElement>('.orbit-path');
    const n     = cards.length;
    if (n === 0) return;

    let angleDeg   = -90;
    let speed      = 0.10;
    let target     = 0.10;
    let rafId: number;

    function sceneW() { return scene.offsetWidth  || window.innerWidth; }
    function sceneH() { return scene.offsetHeight || window.innerHeight; }
    function mobile() { return sceneW() < 600; }

    function radii() {
      const cx = sceneW() / 2;
      const cy = sceneH() / 2;
      if (mobile()) {
        const rx = Math.max(Math.min(cx * 0.48, cx - 65), 60);
        const ry = Math.max(Math.min(cy * 0.45, cy - 140), 80);
        return { rx, ry };
      }
      const r = Math.min(cx, cy) * 0.62;
      return { rx: r, ry: r };
    }

    function sizeCards() {
      const m = mobile();
      cards.forEach(c => {
        c.style.width = m ? '110px' : '168px';
        const p = c.querySelector<HTMLElement>('.orbit-card-photo');
        if (p) p.style.height = m ? '70px' : '108px';
      });
    }

    function tick() {
      const cx  = sceneW() / 2;
      const cy  = sceneH() / 2;
      const { rx, ry } = radii();
      const now = performance.now() / 1000;

      if (path) {
        path.style.width  = rx * 2 + 'px';
        path.style.height = ry * 2 + 'px';
      }

      cards.forEach((card, i) => {
        const deg = angleDeg + i * (360 / n);
        const rad = (deg * Math.PI) / 180;
        const bob = Math.sin(now * 0.7 + i * 1.4) * 7;
        card.style.left = (cx + Math.cos(rad) * rx) + 'px';
        card.style.top  = (cy + Math.sin(rad) * ry + bob) + 'px';
        if (!card.matches(':hover')) card.style.transform = 'translate(-50%,-50%)';
      });

      angleDeg = (angleDeg + speed) % 360;
      speed   += (target - speed) * 0.04;
      rafId    = requestAnimationFrame(tick);
    }

    sizeCards();
    window.addEventListener('resize', sizeCards);

    scene.addEventListener('mouseenter', () => { target = 0.025; });
    scene.addEventListener('mouseleave', () => { target = 0.10;  });
    scene.addEventListener('touchstart', () => { target = 0.025; }, { passive: true });
    scene.addEventListener('touchend',   () => { setTimeout(() => { target = 0.10; }, 1200); });

    cards.forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        const href = card.getAttribute('href');
        if (!href) return;
        const rect = card.getBoundingClientRect();
        target = 0;
        const ov = document.createElement('div');
        Object.assign(ov.style, {
          position: 'fixed', borderRadius: '20px',
          background: '#f6f6f6', zIndex: '999',
          top: rect.top + 'px', left: rect.left + 'px',
          width: rect.width + 'px', height: rect.height + 'px',
          transition: 'top .55s cubic-bezier(.4,0,.2,1),left .55s cubic-bezier(.4,0,.2,1),width .55s cubic-bezier(.4,0,.2,1),height .55s cubic-bezier(.4,0,.2,1),border-radius .55s cubic-bezier(.4,0,.2,1)',
        });
        document.body.appendChild(ov);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          Object.assign(ov.style, { top: '0', left: '0', width: '100vw', height: '100vh', borderRadius: '0' });
        }));
        setTimeout(() => { window.location.href = href; }, 580);
      });
    });

    // body animation cleanup (clears transform:scale that breaks position:fixed)
    document.body.addEventListener('animationend', () => {
      document.body.style.animation  = 'none';
      document.body.style.transform  = 'none';
      document.body.style.opacity    = '1';
    }, { once: true });

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', sizeCards);
    };
  }, []);

  // The drifting cloud PNGs that used to sit here were a holdover from
  // the standalone fleet app, and the only thing making this page's
  // backdrop differ from the rest of the site — which shows the sky
  // gradient plain.
  return (
    <section className="orbit-scene" ref={sceneRef}>
      <div className="orbit-path" />
      <div className="orbit-center">
        <img src="/assets/Logo No.png" alt="Craft" className="orbit-logo" />
      </div>
      {CARDS.map(c => (
        <a key={c.href} href={c.href} className="orbit-card">
          <div className={`orbit-card-photo ${c.photoClass}`} />
          <div className="orbit-card-info">
            <span className="orbit-card-pod">{c.pod}</span>
            <span className="orbit-card-info-sep">·</span>
            <span className="orbit-card-tail">{c.tail}</span>
          </div>
        </a>
      ))}
    </section>
  );
}
