/* NM BEAUTY BAR — main.js
   Lenis smooth scroll (driven by GSAP ticker) + navbar + sticky CTA + counters + menu */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  // Safety net anti-flash: qualunque cosa succeda, dopo 4s tutto è visibile
  setTimeout(function () {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (parseFloat(getComputedStyle(el).opacity) < 1 && !el.dataset.revealPending) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
    document.querySelectorAll('.hero .word').forEach(function (w) { w.style.transform = 'none'; });
  }, 4000);

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis (SEMPRE drivato dal ticker GSAP) ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Anchor scroll via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ---------- Navbar: stato dopo scroll ---------- */
  var navbar = document.querySelector('.navbar');
  var onScrollNav = function () {
    if (window.scrollY > 60) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.navbar__burger');
  var menu = document.querySelector('.navbar__menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Sticky CTA dopo l'hero ---------- */
  var stickyCta = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    ScrollTrigger.create({
      trigger: hero, start: 'bottom 65%',
      onEnter: function () { stickyCta.classList.add('is-visible'); },
      onLeaveBack: function () { stickyCta.classList.remove('is-visible'); }
    });
  }

  /* ---------- Counter animati ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count);
    var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    var run = function () {
      gsap.to({ v: 0 }, {
        v: end, duration: 1.8, ease: 'power2.out',
        onUpdate: function () {
          // this.targets()[0].v è il valore corrente
          el.textContent = this.targets()[0].v.toFixed(decimals);
        }
      });
    };
    // Già in viewport al load (es. hero): parte subito, senza aspettare scroll
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) { run(); return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: run
    });
  });
})();
