/* ═══════════════════════════════════════════
   SATCORP — Concierge Empire
   script.js
═══════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────
   Custom Cursor
─────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    rafId = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  const hoverEls = document.querySelectorAll(
    'a, button, .pillar-card, .division-row, .client-card, .tier-radio, input, select, textarea'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();


/* ───────────────────────────────────────────
   Nav — scroll state + mobile toggle
─────────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!nav) return;

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Force on init
  if (window.scrollY > 40) nav.classList.add('scrolled');

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => s.style.opacity = navLinks.classList.contains('open') ? '0.5' : '1');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();


/* ───────────────────────────────────────────
   Smooth scroll for data-scroll links
─────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', e => {
      const href = el.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ───────────────────────────────────────────
   Reveal on scroll (IntersectionObserver)
─────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
})();


/* ───────────────────────────────────────────
   Contact Form
─────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = form.querySelector('.form-submit');
    const text = btn.querySelector('.submit-text');
    const arrow = btn.querySelector('.submit-arrow');

    btn.disabled = true;
    text.textContent = 'Received.';
    arrow.textContent = '✓';
    btn.style.background = '#4caf7d';
    btn.style.color = '#fff';

    setTimeout(() => {
      btn.disabled = false;
      text.textContent = 'Submit Brief';
      arrow.textContent = '→';
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3500);
  });
})();


/* ───────────────────────────────────────────
   Parallax – hero background grid
─────────────────────────────────────────── */
(function initParallax() {
  const grid = document.querySelector('.hero-grid');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
})();


/* ───────────────────────────────────────────
   Stat counter animation (hero numbers if any)
─────────────────────────────────────────── */
(function initCounters() {
  // If you add stat numbers later with data-count, they'll animate
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ───────────────────────────────────────────
   Pillar card — tilt micro-interaction
─────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.pillar-card');
  const MAX_TILT = 3; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * MAX_TILT;
      const rotY   =  dx * MAX_TILT;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ───────────────────────────────────────────
   Division rows — stagger on enter
─────────────────────────────────────────── */
(function initDivisionHover() {
  const rows = document.querySelectorAll('.division-row');
  rows.forEach((row, i) => {
    row.addEventListener('mouseenter', () => {
      rows.forEach((r, j) => {
        if (r !== row) {
          r.style.opacity = '0.45';
        }
      });
    });
    row.addEventListener('mouseleave', () => {
      rows.forEach(r => { r.style.opacity = ''; });
    });
  });
})();


/* ───────────────────────────────────────────
   Marquee — pause on hover
─────────────────────────────────────────── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const hero  = document.querySelector('.hero-marquee');
  if (!hero)  return;

  hero.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  hero.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ───────────────────────────────────────────
   Page init
─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger visible for above-fold reveals
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  });
});
