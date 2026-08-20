/* AURA Kitchen & Terrace — Beyond Pixel Studio
   No dependencies. Motion specs from design-system/aura-restaurant/MASTER.md §5. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Header: solid once we leave the hero ---------- */
  var header = document.getElementById('header');
  var mobileCta = document.getElementById('mobileCta');
  var footer = document.querySelector('.footer');

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 40);

    // Show the sticky CTA after the hero, hide it once the footer is in view
    // so it never covers the contact details.
    var footerTop = footer.getBoundingClientRect().top;
    mobileCta.classList.toggle('is-visible', y > window.innerHeight * 0.7 && footerTop > window.innerHeight);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 1b. Mobile drawer ---------- */
  var drawer = document.getElementById('mobileNav');
  var navToggle = document.getElementById('navToggle');
  var navClose = document.getElementById('navClose');
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    // Force a frame so the opacity transition actually runs.
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    drawer.querySelector('.drawer__nav a').focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    var done = function () { drawer.hidden = true; };
    reduceMotion.matches ? done() : setTimeout(done, 240);
    if (lastFocus) lastFocus.focus();
  }

  navToggle.addEventListener('click', openDrawer);
  navClose.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
  });
  // Keep focus inside the drawer while it is open.
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- 2. Scroll reveal (opacity + 14px rise, stagger 60ms) ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      // Stagger only within a single batch so a long scroll never queues a slow cascade.
      var shown = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (shown++ * 60) + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Hero parallax — decorative layer only ---------- */
  var heroMedia = document.getElementById('heroMedia');
  if (heroMedia && !reduceMotion.matches) {
    var ticking = false;
    var promoted = false;

    // will-change is expensive: a permanently promoted full-bleed layer keeps a
    // large texture in GPU memory for the whole page. Promote on entry, drop on exit.
    function parallax() {
      var y = window.scrollY;
      var inHero = y < window.innerHeight;

      if (inHero !== promoted) {
        heroMedia.style.willChange = inHero ? 'transform' : 'auto';
        promoted = inHero;
      }
      if (inHero) {
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
      } else if (heroMedia.style.transform !== '') {
        heroMedia.style.transform = '';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(parallax);
    }, { passive: true });
    parallax();
  }

  /* ---------- 4. Menu tabs (WAI-ARIA tabs pattern incl. keyboard) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function selectTab(tab, setFocus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    // Newly shown cards start hidden by .reveal — make them visible immediately.
    document.getElementById(tab.getAttribute('aria-controls'))
      .querySelectorAll('.reveal').forEach(function (el) {
        el.style.transitionDelay = '0ms';
        el.classList.add('is-in');
      });
    if (setFocus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- 5. Reservation form ---------- */
  var form = document.getElementById('reserveForm');
  if (!form) return;

  // Never let someone book yesterday.
  var dateField = document.getElementById('r-date');
  var today = new Date();
  var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateField.min = iso;
  dateField.value = iso;

  var status = document.getElementById('formStatus');

  var rules = {
    'r-date':   function (v) { return v !== '' && v >= iso; },
    'r-time':   function (v) { return v !== ''; },
    'r-guests': function (v) { return v !== ''; },
    'r-name':   function (v) { return v.trim().length >= 2; },
    'r-phone':  function (v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, '')); }
  };

  function setFieldState(id, valid) {
    var input = document.getElementById(id);
    var field = input.closest('.field');
    field.classList.toggle('is-invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  // Validate on blur, then live-correct once a field has already errored.
  Object.keys(rules).forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener('blur', function () {
      if (input.value !== '') setFieldState(id, rules[id](input.value));
    });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('is-invalid')) {
        setFieldState(id, rules[id](input.value));
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
      var ok = setFieldState(id, rules[id](document.getElementById(id).value));
      if (!ok && !firstBad) firstBad = document.getElementById(id);
    });

    if (firstBad) {
      status.className = 'form__status is-visible';
      status.dataset.state = 'err';
      status.textContent = 'Please check the highlighted fields above.';
      firstBad.focus();
      return;
    }

    // Demo build: no backend. A live site would POST here, then send the
    // WhatsApp confirmation through the Business API.
    var name = document.getElementById('r-name').value.trim().split(' ')[0];
    var guests = document.getElementById('r-guests').value;
    var time = document.getElementById('r-time').value;
    var d = new Date(document.getElementById('r-date').value)
      .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    status.className = 'form__status is-visible';
    status.dataset.state = 'ok';
    status.textContent = 'Thank you, ' + name + '. We have your request for ' + guests +
      ' on ' + d + ' at ' + time + '. A confirmation will reach you on WhatsApp within 10 minutes. ' +
      '(Demo build — nothing was actually sent.)';
    form.querySelector('.form__foot').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
  });
})();
