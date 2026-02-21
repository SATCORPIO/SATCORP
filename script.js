/* ═══════════════════════════════════════════
   SATCORP — COCKPIT HUD
   script.js
═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   BOOT SEQUENCE
───────────────────────────────────────── */
(function bootSequence() {
  const screen  = document.getElementById('bootScreen');
  const linesEl = document.getElementById('bootLines');
  const barEl   = document.getElementById('bootBar');
  const statEl  = document.getElementById('bootStatus');
  if (!screen) return;

  const bootMessages = [
    'SATCORP OS v4.1.0 LOADING...',
    'CHECKING SYSTEM INTEGRITY...',
    'PHOSPHOR DISPLAY: ONLINE',
    'RADAR SUBSYSTEM: ONLINE',
    'COMMS MODULE: ONLINE',
    'ANU // OPERATOR: ONLINE',
    'KYRAX // AI AGENT: ONLINE',
    'PULSΞ // BROADCAST: ONLINE',
    'KI-RA // STUDIO: ONLINE',
    'SATCORP BRANCH: ONLINE',
    'ALL DIVISIONS NOMINAL',
    'CONCIERGE PROTOCOL: ACTIVE',
    'AWAITING OPERATOR INPUT...',
  ];

  let msgIdx = 0;
  let progress = 0;

  const msgInterval = setInterval(() => {
    if (msgIdx >= bootMessages.length) {
      clearInterval(msgInterval);
      statEl.textContent = 'SYSTEM READY // ENGAGING';
      setTimeout(() => {
        screen.classList.add('done');
        setTimeout(() => { screen.style.display = 'none'; }, 700);
      }, 400);
      return;
    }
    const line = document.createElement('div');
    line.textContent = '> ' + bootMessages[msgIdx];
    linesEl.appendChild(line);
    linesEl.scrollTop = linesEl.scrollHeight;
    msgIdx++;
    progress = Math.min(100, Math.round((msgIdx / bootMessages.length) * 100));
    barEl.style.width = progress + '%';
    statEl.textContent = 'LOADING... ' + progress + '%';
  }, 140);
})();


/* ─────────────────────────────────────────
   CUSTOM HUD CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  const hoverTargets = 'a, button, .hud-panel, .div-hud-item, .tsh-opt, input, select, textarea, .manifest-row';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ─────────────────────────────────────────
   NAV — SCROLL STATE + MOBILE TOGGLE
───────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  if (toggle && mobile) {
    toggle.addEventListener('click', () => mobile.classList.toggle('open'));
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobile.classList.remove('open'));
    });
  }
})();


/* ─────────────────────────────────────────
   LIVE CLOCK
───────────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('navTime');
  if (!el) return;
  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    const ss  = String(now.getSeconds()).padStart(2, '0');
    el.textContent = hh + ':' + mm + ':' + ss;
  }
  tick();
  setInterval(tick, 1000);
})();


/* ─────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', e => {
      const href = el.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────
   ALTITUDE COUNTER (hero readout)
───────────────────────────────────────── */
(function initAltCounter() {
  const el = document.getElementById('altVal');
  if (!el) return;
  setInterval(() => {
    const base = 420;
    const drift = Math.floor((Math.random() - 0.5) * 10);
    el.textContent = 'FL ' + (base + drift);
  }, 2000);
})();


/* ─────────────────────────────────────────
   SYSTEM LOG — auto-append messages
───────────────────────────────────────── */
(function initSysLog() {
  const log = document.getElementById('sysLog');
  if (!log) return;

  const messages = [
    'CLIENT BRIEF OPEN...',
    'SCANNING FOR TARGETS...',
    'ANU MONITORING...',
    'VECTOR LOCKED',
    'SYSTEMS NOMINAL',
    'RADAR SWEEP ACTIVE',
    'COMMS CHANNEL OPEN',
    'INCOMING SIGNAL...',
    'SATCORP STANDING BY',
    'EMPIRE OPERATIONAL',
  ];

  let idx = 0;
  setInterval(() => {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = messages[idx % messages.length];
    log.appendChild(line);
    if (log.children.length > 8) log.removeChild(log.children[0]);
    log.scrollTop = log.scrollHeight;
    idx++;
  }, 3000);
})();


/* ─────────────────────────────────────────
   DIVISION MANIFEST — cycle active
───────────────────────────────────────── */
(function initManifestCycle() {
  const rows = document.querySelectorAll('.manifest-row');
  if (!rows.length) return;
  let activeIdx = 0;

  setInterval(() => {
    rows[activeIdx].classList.remove('active');
    activeIdx = (activeIdx + 1) % rows.length;
    rows[activeIdx].classList.add('active');
  }, 2500);
})();


/* ─────────────────────────────────────────
   PILLAR STATUS BAR ANIMATION ON REVEAL
───────────────────────────────────────── */
(function initStatusBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hud-panel').forEach(p => obs.observe(p));
})();


/* ─────────────────────────────────────────
   GLITCH EFFECT on hero title (occasional)
───────────────────────────────────────── */
(function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  function glitch() {
    title.style.textShadow = '2px 0 rgba(0,255,65,0.8), -2px 0 rgba(255,59,0,0.4)';
    title.style.transform  = 'translateX(2px)';
    setTimeout(() => {
      title.style.textShadow = '';
      title.style.transform  = 'translateX(-1px)';
      setTimeout(() => {
        title.style.textShadow = '';
        title.style.transform  = '';
      }, 60);
    }, 80);
  }

  // Random glitch every 5–12s
  function scheduleGlitch() {
    const delay = 5000 + Math.random() * 7000;
    setTimeout(() => { glitch(); scheduleGlitch(); }, delay);
  }
  scheduleGlitch();
})();


/* ─────────────────────────────────────────
   DATA STRIP — pause on hover
───────────────────────────────────────── */
(function initStrip() {
  const strip = document.querySelector('.data-strip');
  const track = document.getElementById('dataStrip');
  if (!strip || !track) return;
  strip.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  strip.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const text = btn.querySelector('.submit-text');

    btn.disabled = true;
    btn.style.background = '#00cc33';
    text.textContent = 'TRANSMISSION CONFIRMED';

    // Add log entry
    const log = document.getElementById('sysLog');
    if (log) {
      const line = document.createElement('div');
      line.className = 'log-line';
      line.style.color = 'var(--green-hot)';
      line.textContent = 'BRIEF RECEIVED // ANU NOTIFIED';
      log.appendChild(line);
      if (log.children.length > 8) log.removeChild(log.children[0]);
    }

    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      text.textContent = 'TRANSMIT BRIEF';
      form.reset();
    }, 4000);
  });
})();


/* ─────────────────────────────────────────
   HUD PANELS — scan line effect on hover
───────────────────────────────────────── */
(function initPanelScan() {
  document.querySelectorAll('.hud-panel').forEach(panel => {
    let scanEl = null;
    panel.addEventListener('mouseenter', () => {
      scanEl = document.createElement('div');
      scanEl.style.cssText = `
        position: absolute; left: 0; right: 0; height: 1px;
        background: rgba(0,255,65,0.4);
        top: 0; pointer-events: none; z-index: 10;
        box-shadow: 0 0 8px rgba(0,255,65,0.6);
        animation: panelScan 0.6s linear forwards;
      `;
      if (!document.getElementById('panelScanKF')) {
        const style = document.createElement('style');
        style.id = 'panelScanKF';
        style.textContent = '@keyframes panelScan { from { top: 0 } to { top: 100% } }';
        document.head.appendChild(style);
      }
      panel.style.position = 'relative';
      panel.appendChild(scanEl);
      setTimeout(() => { if (scanEl && scanEl.parentNode) scanEl.parentNode.removeChild(scanEl); }, 700);
    });
  });
})();


/* ─────────────────────────────────────────
   PAGE INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Hero reveals fire after boot
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 2200);
});
