/* NM BEAUTY BAR — animations.js
   Firma hero: split-text cinematic con stagger + light sweep dorato (via CSS keyframe su .accent)
   Scroll reveal GSAP + ScrollTrigger su ogni sezione, parallax, stagger card/galleria. */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- HERO: split-text cinematic ---------- */
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    // Wrappa ogni parola in .word-mask > .word (preserva l'accento esistente)
    var nodes = Array.from(h1.childNodes);
    h1.innerHTML = '';
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part.trim()) { h1.appendChild(document.createTextNode(' ')); return; }
          var mask = document.createElement('span');
          mask.className = 'word-mask';
          var w = document.createElement('span');
          w.className = 'word';
          w.textContent = part;
          mask.appendChild(w);
          h1.appendChild(mask);
        });
      } else if (node.nodeType === 1) {
        var mask2 = document.createElement('span');
        mask2.className = 'word-mask';
        var w2 = document.createElement('span');
        w2.className = 'word';
        w2.appendChild(node.cloneNode(true));
        mask2.appendChild(w2);
        h1.appendChild(mask2);
      }
    });

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.hero .word',
        { yPercent: 115, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.09 }, 0.15)
      .fromTo('.hero__kicker', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, 0.35)
      .fromTo('.hero__sub',    { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
      .fromTo('.hero__actions > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.1)
      .fromTo('.hero__meta-item',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.3)
      .fromTo('.hero__scroll',      { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.7)
      .fromTo('.navbar',            { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.5);

    // Parallax sull'immagine hero
    gsap.to('.hero__bg img', {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  /* ---------- Reveal generico su ogni sezione (scrub 0.6) ---------- */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    var dir = el.dataset.reveal || 'up';
    var from = { opacity: 0 };
    if (dir === 'up') from.y = 48;
    if (dir === 'left') from.x = -56;
    if (dir === 'right') from.x = 56;
    gsap.fromTo(el, from,
      {
        opacity: 1, x: 0, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', scrub: 0.6 }
      });
  });

  /* ---------- Stagger: card servizi ---------- */
  var servGrid = document.querySelector('.servizi__grid');
  if (servGrid) {
    gsap.fromTo(servGrid.children,
      { opacity: 0, y: 64, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.14,
        scrollTrigger: { trigger: servGrid, start: 'top 82%', scrub: 0.6 }
      });
  }

  /* ---------- Stagger: galleria ---------- */
  var gal = document.querySelector('.gallery__grid');
  if (gal) {
    gsap.fromTo(gal.children,
      { opacity: 0, y: 70 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: gal, start: 'top 84%', scrub: 0.6 }
      });
    // Parallax sulle immagini tall della galleria
    gal.querySelectorAll('.gallery__item--tall img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.closest('.gallery__item'), start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });
  }

  /* ---------- Parallax: fascia stats (numero enorme di fondo) ---------- */
  var statsBg = document.querySelector('.stats__ghost');
  if (statsBg) {
    gsap.fromTo(statsBg, { yPercent: -22 }, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: '.stats', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  }
})();
