'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MainScript() {
  const pathname = usePathname();

  useEffect(() => {
    // ── Cabin config toggle ────────────────────────────────────
    const configBtns = document.querySelectorAll<HTMLButtonElement>('.config-toggle-btn');
    configBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target   = btn.dataset.config;
        const incoming = document.getElementById('config-' + target);
        if (!incoming) return;
        configBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const current = [...document.querySelectorAll<HTMLElement>('.config-panel')].find(p => !p.classList.contains('config-panel--hidden'));
        if (!current || current === incoming) return;
        current.style.transition = 'opacity 0.35s ease';
        current.style.opacity = '0';
        setTimeout(() => {
          current.classList.add('config-panel--hidden');
          current.style.opacity = current.style.transition = '';
          incoming.classList.remove('config-panel--hidden');
          incoming.style.opacity = '0';
          incoming.style.transition = 'opacity 0.35s ease';
          requestAnimationFrame(() => requestAnimationFrame(() => { incoming.style.opacity = '1'; }));
          setTimeout(() => { incoming.style.opacity = incoming.style.transition = ''; }, 380);
        }, 350);
      });
    });

    // ── Range map toggle ──────────────────────────────────────
    const rangeBtns = document.querySelectorAll<HTMLButtonElement>('.range-toggle-btn');
    rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target   = btn.dataset.range;
        const incoming = document.getElementById('range-' + target);
        if (!incoming) return;
        rangeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const current = [...document.querySelectorAll<HTMLElement>('.range-panel')].find(p => !p.classList.contains('range-panel--hidden'));
        if (!current || current === incoming) return;
        current.style.transition = 'opacity 0.35s ease';
        current.style.opacity = '0';
        setTimeout(() => {
          current.classList.add('range-panel--hidden');
          current.style.opacity = current.style.transition = '';
          incoming.classList.remove('range-panel--hidden');
          incoming.style.opacity = '0';
          incoming.style.transition = 'opacity 0.35s ease';
          requestAnimationFrame(() => requestAnimationFrame(() => { incoming.style.opacity = '1'; }));
          setTimeout(() => { incoming.style.opacity = incoming.style.transition = ''; }, 380);
        }, 350);
      });
    });

    // ── Carousel ──────────────────────────────────────────────
    const carousel      = document.querySelector<HTMLElement>('.section-carousel');
    const carouselTrack = document.querySelector<HTMLElement>('.carousel-track');
    let carouselRAF: number | null = null;

    if (carousel && carouselTrack) {
      const slides     = Array.from(carouselTrack.querySelectorAll<HTMLElement>('.carousel-slide'));
      const baseSpeed  = 0.55;
      let position     = 0;
      let isDragging   = false;
      let dragStartX   = 0;
      let dragStartPos = 0;
      let lastMouseX   = 0;
      let lastMouseTime = 0;
      let momentum     = 0;

      function getAutoSpeed(t: number) { return baseSpeed * (1 + 0.38 * Math.sin(t / 7000) + 0.18 * Math.sin(t / 2800)); }
      function halfWidth() { return carouselTrack!.scrollWidth / 2; }
      function wrap(pos: number) { const hw = halfWidth(); return ((pos % hw) + hw) % hw; }

      function updateSlides() {
        const cw = carousel!.offsetWidth;
        const cx = cw / 2;
        const cr = carousel!.getBoundingClientRect();
        slides.forEach(s => {
          const sr   = s.getBoundingClientRect();
          const sCx  = sr.left - cr.left + sr.width / 2;
          const norm = Math.min(1, Math.abs(cx - sCx) / (cw * 0.52));
          s.style.transform = `scale(${(1 - 0.05 * norm).toFixed(4)})`;
          s.style.opacity   = (1 - 0.30 * norm).toFixed(4);
        });
      }

      function animate(ts: number) {
        if (!isDragging) {
          momentum *= 0.93;
          position = wrap(position + getAutoSpeed(ts) + momentum);
          carouselTrack!.style.transform = `translateX(-${position}px)`;
          updateSlides();
        }
        carouselRAF = requestAnimationFrame(animate);
      }
      carouselRAF = requestAnimationFrame(animate);

      carouselTrack.addEventListener('mousedown', e => {
        isDragging = true; dragStartX = e.clientX; dragStartPos = position;
        lastMouseX = e.clientX; lastMouseTime = performance.now(); momentum = 0;
        carouselTrack!.classList.add('is-dragging'); e.preventDefault();
      });
      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const now = performance.now(); const dt = Math.max(1, now - lastMouseTime);
        momentum = (lastMouseX - e.clientX) / dt * 16;
        lastMouseX = e.clientX; lastMouseTime = now;
        position = wrap(dragStartPos + (dragStartX - e.clientX));
        carouselTrack!.style.transform = `translateX(-${position}px)`; updateSlides();
      });
      document.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; carouselTrack!.classList.remove('is-dragging'); });

      carouselTrack.addEventListener('touchstart', e => {
        isDragging = true; dragStartX = e.touches[0].clientX; dragStartPos = position;
        lastMouseX = e.touches[0].clientX; lastMouseTime = performance.now(); momentum = 0;
      }, { passive: true });
      carouselTrack.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const now = performance.now(); const dt = Math.max(1, now - lastMouseTime);
        const cx = e.touches[0].clientX;
        momentum = (lastMouseX - cx) / dt * 16; lastMouseX = cx; lastMouseTime = now;
        position = wrap(dragStartPos + (dragStartX - cx));
        carouselTrack!.style.transform = `translateX(-${position}px)`; updateSlides();
      }, { passive: true });
      carouselTrack.addEventListener('touchend', () => { isDragging = false; });
    }

    // ── Snack zoom ────────────────────────────────────────────
    const snackImgs = document.querySelectorAll<HTMLImageElement>('.snack-card-img');
    let snackOverlay: HTMLDivElement | null = null;

    function closeSnack() {
      if (!snackOverlay) return;
      snackOverlay.classList.remove('snack-zoom-overlay--visible');
      const ov = snackOverlay;
      ov.addEventListener('transitionend', () => ov.remove(), { once: true });
      snackOverlay = null;
    }

    snackImgs.forEach(img => {
      img.addEventListener('click', e => {
        e.stopPropagation();
        if (snackOverlay) { closeSnack(); return; }
        snackOverlay = document.createElement('div');
        snackOverlay.className = 'snack-zoom-overlay';
        const big = document.createElement('img');
        big.src = img.src; big.alt = img.alt; big.className = 'snack-zoom-img';
        snackOverlay.appendChild(big);
        document.body.appendChild(snackOverlay);
        requestAnimationFrame(() => requestAnimationFrame(() => snackOverlay!.classList.add('snack-zoom-overlay--visible')));
        snackOverlay.addEventListener('click', closeSnack);
      });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSnack(); });

    // ── Body animation cleanup ────────────────────────────────
    document.body.addEventListener('animationend', () => {
      document.body.style.animation = 'none';
      document.body.style.transform = 'none';
      document.body.style.opacity   = '1';
    }, { once: true });

    // ── Scroll nav shadow ─────────────────────────────────────
    const nav = document.querySelector<HTMLElement>('.nav');
    function onScroll() {
      if (!nav) return;
      nav.style.boxShadow = window.scrollY > 40
        ? '0 8px 40px rgba(12,29,61,0.14)'
        : '0 4px 32px rgba(12,29,61,0.08)';
    }
    if (nav) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (carouselRAF !== null) cancelAnimationFrame(carouselRAF);
      window.removeEventListener('scroll', onScroll);
      if (snackOverlay) { snackOverlay.remove(); snackOverlay = null; }
    };
  }, [pathname]);

  return null;
}
