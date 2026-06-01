/* ============================================================
   BALLESTA CONDOMINIO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── INJECT IMAGES FROM IMGS object ─── */
  function injectImages() {
    if (typeof IMGS === 'undefined') return;
    document.querySelectorAll('[data-img]').forEach(el => {
      const key = el.getAttribute('data-img');
      if (IMGS[key]) {
        if (el.tagName === 'IMG') el.src = IMGS[key];
        else el.style.backgroundImage = `url(${IMGS[key]})`;
      }
    });
  }
  injectImages();

  /* ─── LOADER ─── */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  /* ─── CUSTOM CURSOR (desktop only) ─── */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (isTouchDevice && dot)  dot.style.display  = 'none';
  if (isTouchDevice && ring) ring.style.display = 'none';
  if (isTouchDevice) { document.body.style.cursor = 'auto'; }

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    if (dot && ring) {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
    }
    requestAnimationFrame(animCursor);
  })();

  /* ─── NAV SCROLL ─── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ─── HAMBURGER ─── */
  const ham  = document.getElementById('hamburger');
  const mMenu = document.getElementById('mobile-menu');
  ham?.addEventListener('click', () => {
    ham.classList.toggle('active');
    mMenu?.classList.toggle('open');
    document.body.style.overflow = mMenu?.classList.contains('open') ? 'hidden' : '';
  });
  mMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham?.classList.remove('active');
    mMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
  document.getElementById('mobile-close')?.addEventListener('click', () => {
    ham?.classList.remove('active');
    mMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });

  /* ─── SCROLL REVEAL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stat-cell').forEach(el => revealObs.observe(el));

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el, target, suffix = '', decimals = 0) {
    const duration = 1600;
    const start = performance.now();
    const run = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      const val = eased * target;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (pct < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        const target = parseFloat(e.target.dataset.target);
        const suffix = e.target.dataset.suffix || '';
        const dec    = parseInt(e.target.dataset.dec || '0');
        animateCounter(e.target, target, suffix, dec);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  /* ─── TABS (modelos) ─── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(panel)?.classList.add('active');
    });
  });

  /* ─── LIGHTBOX ─── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  let lbImages   = [];
  let lbIndex    = 0;

  function openLb(imgs, idx) {
    lbImages = imgs; lbIndex = idx;
    lbImg.src = imgs[idx];
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    lbImg.style.opacity = '0';
    setTimeout(() => { lbImg.src = lbImages[lbIndex]; lbImg.style.opacity = '1'; }, 200);
  }

  document.getElementById('lb-close')?.addEventListener('click', closeLb);
  document.getElementById('lb-prev')?.addEventListener('click', () => lbNav(-1));
  document.getElementById('lb-next')?.addEventListener('click', () => lbNav(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft')  lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  // Collect gallery items
  function setupGallery() {
    const items = document.querySelectorAll('.g-item[data-img]');
    const allSrcs = [];
    items.forEach((item, i) => {
      const key  = item.getAttribute('data-img');
      const src  = (typeof IMGS !== 'undefined' && IMGS[key]) ? IMGS[key] : '';
      allSrcs.push(src);
      item.addEventListener('click', () => openLb(allSrcs, i));
    });
  }
  setupGallery();

  /* ─── SMOOTH ANCHOR ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── PARALLAX HERO ─── */
  const heroImg = document.querySelector('.hero-img-wrap img');
  window.addEventListener('scroll', () => {
    if (!heroImg) return;
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });

  /* ─── TICKER CLONE ─── */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML; // duplicate for seamless loop
  }

  /* ─── MORTGAGE CALCULATOR ─── */
  const calcForm = document.getElementById('calc-form');
  if (calcForm) {
    function calcMortgage() {
      const price    = parseFloat(document.getElementById('calc-price')?.value) || 0;
      const enganche = parseFloat(document.getElementById('calc-enganche')?.value) || 20;
      const rate     = parseFloat(document.getElementById('calc-rate')?.value) || 10.5;
      const years    = parseInt(document.getElementById('calc-years')?.value) || 20;

      const loan    = price * (1 - enganche / 100);
      const monthly = rate / 100 / 12;
      const n       = years * 12;
      const payment = n === 0 ? 0 : loan * monthly * Math.pow(1 + monthly, n) / (Math.pow(1 + monthly, n) - 1);

      const fmt = v => v.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
      document.getElementById('calc-result-monthly')  && (document.getElementById('calc-result-monthly').textContent  = fmt(payment));
      document.getElementById('calc-result-enganche') && (document.getElementById('calc-result-enganche').textContent = fmt(price * enganche / 100));
      document.getElementById('calc-result-loan')     && (document.getElementById('calc-result-loan').textContent    = fmt(loan));
      document.getElementById('calc-result-total')    && (document.getElementById('calc-result-total').textContent   = fmt(payment * n));
    }

    calcForm.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calcMortgage));
    calcMortgage();
  }

  /* ─── CONTACT FORM ─── */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '¡Mensaje enviado!';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; contactForm.reset(); }, 3000);
    }, 1200);
  });

});