/* Advish Brain & Spine Care — site interactions */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  /* Header shadow on scroll */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Lightbox for gallery + news clipping */
  var dialog = document.getElementById('lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var lbImg = dialog.querySelector('img');
    var lbCap = dialog.querySelector('figcaption');
    var items = [];
    var index = 0;
    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      lbImg.src = item.src; lbImg.alt = item.alt; lbCap.textContent = item.caption || item.alt;
      var multi = items.length > 1;
      dialog.querySelectorAll('.lb-prev, .lb-next').forEach(function (b) { b.hidden = !multi; });
    }
    document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var group = trigger.getAttribute('data-lightbox');
        var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + group + '"]'));
        items = triggers.map(function (t) {
          var img = t.querySelector('img');
          return { src: t.getAttribute('data-full') || img.src, alt: img.alt, caption: t.getAttribute('data-caption') };
        });
        show(triggers.indexOf(trigger));
        dialog.showModal();
      });
    });
    dialog.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    dialog.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }
})();
