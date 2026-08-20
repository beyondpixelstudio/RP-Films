/* RP Films — Beyond Pixel Studio
   No dependencies. Motion specs from design-system/r-films/MASTER.md section 5.
   The inventory below is the single source of truth for the Vault, the category
   counts, the tally strip and the WhatsApp kit list. Edit here, nowhere else. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var WA_NUMBER = '918260076264';

  /* ============================================================
     1. Inventory
     [group, name, spec, quantity, tags]  tag = [label, tone]
     ============================================================ */
  var GROUPS = [
    ['cam',  'Cameras'],
    ['air',  'Aerial'],
    ['cine', 'Cine primes'],
    ['sony', 'Sony glass'],
    ['canon','Canon glass'],
    ['filt', 'Filtration'],
    ['lite', 'Lighting'],
    ['snd',  'Sound'],
    ['mon',  'Monitoring'],
    ['comm', 'Comms']
  ];

  var GEAR = [
    // ---- Cameras: 25 bodies
    ['cam','Sony BURANO','8.6K full-frame · PL and E mount · built-in ND',1,[['Flagship','flag'],['PL','cool']]],
    ['cam','Sony FX6','Full-frame 4K · dual base ISO · internal ND',4,[['Flagship','flag'],['E-mount','cool']]],
    ['cam','Sony FX3','Full-frame cinema compact · 4K 120p',7,[['E-mount','cool']]],
    ['cam','Sony FX2','Full-frame cinema compact',2,[['E-mount','cool']]],
    ['cam','Sony A7S III','Low-light body · 4K 120p',2,[['E-mount','cool']]],
    ['cam','Sony A7 IV','Hybrid body · 33MP',2,[['E-mount','cool']]],
    ['cam','Sony A7 V','Hybrid body',2,[['E-mount','cool']]],
    ['cam','Canon EOS R3','Stacked sensor · fast tracking',1,[['RF','cool']]],
    ['cam','Canon EOS R5 C','8K cinema hybrid',1,[['Flagship','flag'],['RF','cool']]],
    ['cam','Canon EOS R6 Mark II','Full-frame hybrid',2,[['RF','cool']]],
    ['cam','Canon EOS C50','Cinema body',1,[['RF','cool']]],

    // ---- Aerial: 3 drones + 2 pocket gimbals
    ['air','DJI Mavic 3 Cine','5.1K · Apple ProRes 422 HQ',1,[['Flagship','flag']]],
    ['air','DJI Mavic 3 Pro','Triple camera · wide, tele, medium tele',1,[]],
    ['air','DJI Mavic 3 Classic','Four-thirds CMOS',1,[]],
    ['air','DJI Osmo Pocket 3 and 4','Pocket gimbal · run-and-gun',2,[]],

    // ---- Cine primes: Zeiss, 11 lenses
    ['cine','Zeiss Nano Prime 18mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss Nano Prime 24mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss Nano Prime 35mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss Nano Prime 50mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss Nano Prime 75mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss Nano Prime 100mm','T1.5 · full-frame',1,[['E-mount','cool'],['T1.5','warm']]],
    ['cine','Zeiss CP.3 15mm','T2.9 · interchangeable mount',1,[['PL','cool']]],
    ['cine','Zeiss CP.3 25mm','T2.1 · interchangeable mount',1,[['PL','cool']]],
    ['cine','Zeiss CP.3 35mm','T2.1 · interchangeable mount',1,[['PL','cool']]],
    ['cine','Zeiss CP.3 50mm','T2.1 · interchangeable mount',1,[['PL','cool']]],
    ['cine','Zeiss CP.3 85mm','T2.1 · interchangeable mount',1,[['PL','cool']]],

    // ---- Sony glass: 73 lenses
    ['sony','Sony 400–800mm','Super-telephoto zoom',1,[['E-mount','cool']]],
    ['sony','Sony 200–600mm G','Super-telephoto zoom',2,[['E-mount','cool']]],
    ['sony','Sigma 60–600mm','Sport super-zoom',1,[['E-mount','cool']]],
    ['sony','Sony 100–400mm GM','Telephoto zoom',1,[['E-mount','cool']]],
    ['sony','Sony 70–200mm f/2.8 GM','Telephoto zoom · versions I and II',11,[['E-mount','cool']]],
    ['sony','Sony 24–70mm f/2.8 GM','Standard zoom · versions I and II',10,[['E-mount','cool']]],
    ['sony','Sony 16–35mm f/2.8 GM','Wide zoom · versions I and II',8,[['E-mount','cool']]],
    ['sony','Sony 12–24mm f/2.8 GM','Ultra-wide zoom',2,[['E-mount','cool']]],
    ['sony','Sony 135mm f/1.8 GM','Telephoto prime',3,[['E-mount','cool']]],
    ['sony','Sony 85mm f/1.4 GM','Portrait prime · versions I and II',7,[['E-mount','cool']]],
    ['sony','Sony 50mm f/1.4 GM','Standard prime',6,[['E-mount','cool']]],
    ['sony','Sony 50mm f/1.2 GM','Standard prime',2,[['E-mount','cool']]],
    ['sony','Sony 35mm f/1.4 GM','Wide prime',6,[['E-mount','cool']]],
    ['sony','Sony 24mm f/1.4 GM','Wide prime',5,[['E-mount','cool']]],
    ['sony','Sony 14mm f/1.8 GM','Ultra-wide prime',4,[['E-mount','cool']]],
    ['sony','Sony 12mm f/2.8','Ultra-wide prime',2,[['E-mount','cool']]],
    ['sony','Sony 90mm f/2.8 macro','Macro prime',2,[['E-mount','cool']]],

    // ---- Canon glass: 22 lenses
    ['canon','Canon RF 200–800mm','f/6.3–9 · super-telephoto zoom',1,[['RF','cool']]],
    ['canon','Canon 100–400mm','f/5.6 · telephoto zoom',1,[['RF','cool']]],
    ['canon','Canon RF 70–200mm f/2.8','Telephoto zoom',2,[['RF','cool']]],
    ['canon','Canon EF 70–200mm f/2.8','Telephoto zoom',4,[['EF','cool']]],
    ['canon','Canon RF 24–105mm f/2.8','Standard zoom',1,[['RF','cool']]],
    ['canon','Canon RF 24–105mm f/4','Standard zoom',1,[['RF','cool']]],
    ['canon','Canon EF 24–70mm f/2.8','Standard zoom',2,[['EF','cool']]],
    ['canon','Canon RF 15–35mm f/2.8','Wide zoom',1,[['RF','cool']]],
    ['canon','Canon EF 16–35mm f/2.8','Wide zoom',1,[['EF','cool']]],
    ['canon','Canon RF 85mm f/1.4','Portrait prime',1,[['RF','cool']]],
    ['canon','Canon RF 50mm f/1.4','Standard prime',1,[['RF','cool']]],
    ['canon','Canon EF 50mm f/1.2','Standard prime',1,[['EF','cool']]],
    ['canon','Canon RF 35mm f/1.4','Wide prime',1,[['RF','cool']]],
    ['canon','Canon EF 35mm f/2','Wide prime',1,[['EF','cool']]],
    ['canon','Canon 14mm f/2.8','Ultra-wide prime',2,[['EF','cool']]],
    ['canon','Canon 100mm f/2.8 macro','Macro prime',1,[['RF','cool']]],

    // ---- Filtration
    ['filt','NiSi Black Magic diffusion 1/4','82mm screw-in',2,[['82mm','cool']]],
    ['filt','Black Pro Mist 1/8, 1/4, 1/2','NiSi and Haida · 82 / 77 / 67mm',9,[['82–67mm','cool']]],
    ['filt','Variable ND with CPL','NiSi and Haida · 82 / 77 / 67mm',12,[['82–67mm','cool']]],
    ['filt','Circular polariser','Haida · full size range',6,[]],
    ['filt','4x4 trays and step rings','Matte-box filtration set',1,[]],

    // ---- Lighting: 43 fixtures
    ['lite','Nanlite Forza 720B','Bi-colour point source · 720W',2,[['3200–5600K','warm']]],
    ['lite','Nanlite 500 Bi-colour','Point source · 500W',4,[['3200–5600K','warm']]],
    ['lite','Nanlite 500 RGB','Full colour point source',2,[['RGB','cool']]],
    ['lite','Nanlite 300','Point source · 300W',6,[['3200–5600K','warm']]],
    ['lite','Nanlite 120','Point source · 120W',4,[['3200–5600K','warm']]],
    ['lite','Nanlite tube — 8 ft','Pixel tube · full colour',6,[['RGB','cool']]],
    ['lite','Nanlite tube — 4 ft','Pixel tube · full colour',6,[['RGB','cool']]],
    ['lite','Hifen 500','Point source · 500W',6,[['3200–5600K','warm']]],
    ['lite','Hifen 300','Point source · 300W',4,[['3200–5600K','warm']]],
    ['lite','Godox AD600','Battery strobe · 600Ws',1,[['Flash','warm']]],
    ['lite','Godox AD400','Battery strobe · 400Ws',1,[['Flash','warm']]],
    ['lite','Godox AD300','Battery strobe · 300Ws',1,[['Flash','warm']]],
    ['lite','100W battery','Location power for the fixtures above',5,[]],

    // ---- Sound: 12 wireless channels
    ['snd','Sennheiser wireless lapel','Broadcast lavalier channel',4,[]],
    ['snd','Hollyland wireless lapel','Compact lavalier channel',6,[]],
    ['snd','Sony wireless lapel','Digital lavalier channel',2,[]],

    // ---- Monitoring: 17 monitors + transmission
    ['mon','24-inch director monitor','Village / client viewing',1,[]],
    ['mon','17-inch monitor','Director and client monitoring',2,[]],
    ['mon','15-inch monitor','Director and client monitoring',2,[]],
    ['mon','11-inch monitor','Focus and framing',4,[]],
    ['mon','7-inch on-camera monitor','Operator monitoring',2,[]],
    ['mon','5-inch on-camera monitor','Operator monitoring',4,[]],
    ['mon','Shogun 7-inch recorder','External record and monitor',2,[['ProRes','cool']]],
    ['mon','Hollyland and DJI wireless video','Transmitter and receiver sets',7,[]],

    // ---- Comms
    ['comm','Hollyland intercom — 5 set','Full-duplex headsets',1,[]],
    ['comm','Hollyland intercom — 8 set','Full-duplex headsets',1,[]],
    ['comm','Hollyland intercom — 20 set','Large-unit headsets',1,[]],
    ['comm','Walkie-talkie handsets','Unit-wide comms',20,[]]
  ];

  /* ============================================================
     2. Boot sequence — iris opens once fonts and first paint are ready
     ============================================================ */
  var boot = document.getElementById('boot');
  var bootFill = document.getElementById('bootFill');
  var bootPct = document.getElementById('bootPct');

  (function runBoot() {
    var pct = 0;
    var minimum = reduceMotion.matches ? 0 : 900;   // never flash past the mark
    var started = Date.now();
    var ready = false;

    var ticker = setInterval(function () {
      // Ease toward 99 while we wait, then snap to 100 when the page is ready.
      pct += Math.max(1, (99 - pct) * 0.18);
      if (ready) pct = 100;
      var shown = Math.min(100, Math.round(pct));
      bootFill.style.width = shown + '%';
      bootPct.textContent = shown < 10 ? '0' + shown : String(shown);
      if (shown >= 100) {
        clearInterval(ticker);
        boot.classList.add('is-done');
        document.body.classList.add('is-booted');
      }
    }, 60);

    function finish() {
      var wait = Math.max(0, minimum - (Date.now() - started));
      setTimeout(function () { ready = true; }, wait);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(finish).catch(finish);
    } else {
      window.addEventListener('load', finish);
    }
    // Never let a stalled font request hold the page hostage.
    setTimeout(function () { ready = true; }, 4000);
  }());

  /* ============================================================
     3. Header, drawer, scroll state
     ============================================================ */
  var header = document.getElementById('header');
  var railMark = document.getElementById('railMark');

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 40);

    if (railMark) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      railMark.style.top = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var drawer = document.getElementById('mobileNav');
  var navToggle = document.getElementById('navToggle');
  var navClose = document.getElementById('navClose');
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.classList.add('is-locked');
    navToggle.setAttribute('aria-expanded', 'true');
    drawer.querySelector('.drawer__nav a').focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    navToggle.setAttribute('aria-expanded', 'false');
    var done = function () { drawer.hidden = true; };
    reduceMotion.matches ? done() : setTimeout(done, 260);
    if (lastFocus) lastFocus.focus();
  }

  navToggle.addEventListener('click', openDrawer);
  navClose.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
  });
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ============================================================
     4. Rack-focus reveal + counters
     ============================================================ */
  function watch(nodes, onEnter, options) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { onEnter(el, true); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var shown = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        onEnter(entry.target, false, shown++);
        io.unobserve(entry.target);
      });
    }, options || { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function bindReveals(scope) {
    var nodes = Array.prototype.slice.call((scope || document).querySelectorAll('.reveal:not(.is-in)'));
    watch(nodes, function (el, instant, i) {
      if (!instant) el.style.transitionDelay = ((i || 0) * 70) + 'ms';
      el.classList.add('is-in');
    });
  }
  bindReveals();

  watch(Array.prototype.slice.call(document.querySelectorAll('[data-count]')), function (el, instant) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (instant) { el.textContent = target; return; }
    var t0 = performance.now(), dur = 1400;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }(t0));
  }, { threshold: 0.5 });

  /* ============================================================
     5. Pointer tilt — writes custom properties so the reveal still owns Y
     ============================================================ */
  if (!reduceMotion.matches && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.tilt') : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
      var card = e.target.closest ? e.target.closest('.tilt') : null;
      if (!card || card.contains(e.relatedTarget)) return;
      card.classList.remove('is-tilting');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    }, { passive: true });
  }

  /* ============================================================
     6. Ticker — duplicate the row so the -50% loop is seamless
     ============================================================ */
  var tickerRow = document.getElementById('tickerRow');
  if (tickerRow) tickerRow.innerHTML += tickerRow.innerHTML;

  /* ============================================================
     7. The Vault — filter, search, tick a kit
     ============================================================ */
  var grid = document.getElementById('vaultGrid');
  var tabs = document.getElementById('vaultTabs');
  var searchInput = document.getElementById('vaultSearch');
  var emptyNote = document.getElementById('vaultEmpty');
  var picked = Object.create(null);
  var activeGroup = 'all';
  var query = '';

  function unitsIn(group) {
    return GEAR.reduce(function (n, g) {
      return n + (group === 'all' || g[0] === group ? g[3] : 0);
    }, 0);
  }

  // Which line drawing goes beside a row. Derived rather than stored, so adding
  // a lens to GEAR never means remembering to pick an illustration for it.
  function artFor(item) {
    var g = item[0], n = item[1];
    if (g === 'cam')  return /BURANO|FX6|FX3|FX2|C50|R5 C/.test(n) ? 'g-cine' : 'g-mirrorless';
    if (g === 'air')  return /Osmo|Pocket/.test(n) ? 'g-pocket' : 'g-drone';
    if (g === 'cine') return 'g-cinelens';
    if (g === 'filt') return 'g-filter';
    if (g === 'snd')  return 'g-mic';
    if (g === 'sony' || g === 'canon') {
      if (/400–800|200–600|60–600|100–400|200–800/.test(n)) return 'g-tele';
      return n.indexOf('–') !== -1 ? 'g-zoom' : 'g-prime';
    }
    if (g === 'lite') {
      if (/tube/i.test(n))    return 'g-tube';
      if (/Godox/.test(n))    return 'g-strobe';
      if (/battery/i.test(n)) return 'g-battery';
      if (/RGB/.test(n))      return 'g-panel';
      return 'g-point';
    }
    if (g === 'mon') {
      if (/wireless video/i.test(n)) return 'g-tx';
      if (/Shogun|recorder/i.test(n)) return 'g-recorder';
      return 'g-monitor';
    }
    return /Walkie/i.test(n) ? 'g-walkie' : 'g-headset';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  (function buildTabs() {
    var html = '<button class="chip" role="tab" aria-selected="true" data-group="all">All<b>' +
               unitsIn('all') + '</b></button>';
    GROUPS.forEach(function (g) {
      html += '<button class="chip" role="tab" aria-selected="false" data-group="' + g[0] + '">' +
              esc(g[1]) + '<b>' + unitsIn(g[0]) + '</b></button>';
    });
    tabs.innerHTML = html;
  }());

  function matches(item) {
    if (activeGroup !== 'all' && item[0] !== activeGroup) return false;
    if (!query) return true;
    var hay = (item[1] + ' ' + item[2] + ' ' + item[4].map(function (t) { return t[0]; }).join(' ')).toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  function renderVault() {
    var rows = GEAR.filter(matches);
    grid.innerHTML = rows.map(function (item) {
      var id = 'kit-' + item[1].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      var tags = item[4].map(function (t) {
        return '<span class="tag tag--' + t[1] + '">' + esc(t[0]) + '</span>';
      }).join('');
      return '<label class="kit reveal" for="' + id + '">' +
               '<input type="checkbox" id="' + id + '" value="' + esc(item[1]) + '" data-qty="' + item[3] + '"' +
                 (picked[item[1]] ? ' checked' : '') + '>' +
               '<span class="kit__box"><svg aria-hidden="true"><use href="#i-check"/></svg></span>' +
               '<span class="kit__art"><svg class="gear-art" viewBox="0 0 96 64" aria-hidden="true">' +
                 '<use href="#' + artFor(item) + '"/></svg></span>' +
               '<span class="kit__body">' +
                 '<span class="kit__qty mono">' + item[3] + '</span>' +
                 '<span class="kit__name">' + esc(item[1]) + '</span>' +
                 '<span class="kit__spec">' + esc(item[2]) + '</span>' +
                 (tags ? '<span class="kit__tags">' + tags + '</span>' : '') +
               '</span>' +
             '</label>';
    }).join('');

    emptyNote.hidden = rows.length > 0;
    bindReveals(grid);
  }

  tabs.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    tabs.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-selected', String(c === chip));
    });
    activeGroup = chip.getAttribute('data-group');
    renderVault();
  });

  searchInput.addEventListener('input', function () {
    query = searchInput.value.trim().toLowerCase();
    renderVault();
  });

  grid.addEventListener('change', function (e) {
    var box = e.target;
    if (box.type !== 'checkbox') return;
    if (box.checked) picked[box.value] = parseInt(box.getAttribute('data-qty'), 10);
    else delete picked[box.value];
    syncKit();
  });

  /* ---- Kit tray ---- */
  var tray = document.getElementById('tray');
  var trayN = document.getElementById('trayN');
  var trayWa = document.getElementById('trayWa');
  var trayClear = document.getElementById('trayClear');
  var formKit = document.getElementById('formKit');
  var waDirect = document.getElementById('waDirect');

  function kitList() { return Object.keys(picked); }

  function waLink(intro) {
    var list = kitList();
    var text = intro + '\n\n';
    if (list.length) {
      text += 'Kit list:\n' + list.map(function (n, i) { return (i + 1) + '. ' + n; }).join('\n') + '\n\n';
    }
    text += 'Dates: \nLocation: ';
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function syncKit() {
    var list = kitList();
    trayN.textContent = list.length;

    document.body.classList.toggle('has-kit', list.length > 0);

    if (list.length) {
      tray.hidden = false;
      requestAnimationFrame(function () { tray.classList.add('is-up'); });
      formKit.textContent = list.length + ' item' + (list.length === 1 ? '' : 's') +
                            ' attached: ' + list.join(', ');
      formKit.classList.add('is-set');
    } else {
      tray.classList.remove('is-up');
      setTimeout(function () { if (!kitList().length) tray.hidden = true; }, reduceMotion.matches ? 0 : 380);
      formKit.textContent = 'No kit selected yet — tick items in the rental list and they attach here.';
      formKit.classList.remove('is-set');
    }

    trayWa.href = waLink('Hi RP Films, I would like a quote for this kit.');
    waDirect.href = waLink('Hi RP Films, I would like a quote.');
  }

  trayClear.addEventListener('click', function () {
    picked = Object.create(null);
    grid.querySelectorAll('input:checked').forEach(function (b) { b.checked = false; });
    syncKit();
  });

  renderVault();
  syncKit();

  /* ============================================================
     8. Quote form — validates and confirms; sending is the live build
     ============================================================ */
  var form = document.getElementById('quoteForm');
  var formOk = document.getElementById('formOk');

  function setError(input, message) {
    var field = input.closest('.field');
    var box = document.getElementById('err-' + input.id);
    field.classList.toggle('is-bad', Boolean(message));
    box.hidden = !message;
    box.querySelector('span').textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('qName');
    var phone = document.getElementById('qPhone');
    var bad = null;

    setError(name, name.value.trim() ? '' : 'We need a name to put on the quote.');
    if (!name.value.trim()) bad = bad || name;

    var digits = phone.value.replace(/\D/g, '');
    var phoneMsg = !digits ? 'Add a number we can call back on.'
                 : digits.length < 10 ? 'That looks short — Indian mobile numbers are 10 digits.'
                 : '';
    setError(phone, phoneMsg);
    if (phoneMsg) bad = bad || phone;

    if (bad) { bad.focus(); formOk.hidden = true; return; }

    var list = kitList();
    formOk.hidden = false;
    formOk.querySelector('span').textContent =
      'Thanks ' + name.value.trim() + '. ' +
      (list.length ? 'Your ' + list.length + '-item kit list is attached. ' : '') +
      'On the live site this reaches the RP Films desk and WhatsApp straight away — in this demo nothing is sent, so use the WhatsApp button to reach us today.';
    formOk.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  ['qName', 'qPhone'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-bad')) setError(el, ''); });
  });

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ============================================================
     9. Showreel frames — procedural stand-in footage.
        Each grade is a colour script, not a photograph: base wash, key haze,
        drifting bokeh, halation, grain. Static until hovered, then it rolls.
     ============================================================ */
  var GRADES = {
    temple:  { a: '#1b1206', b: '#07080c', glow: 'rgba(242,166,90,.55)', bok: [242,180,110], lx: .72, ly: .30 },
    wedding: { a: '#22110c', b: '#0a0607', glow: 'rgba(255,150,90,.5)',  bok: [255,190,150], lx: .30, ly: .38 },
    industry:{ a: '#06121a', b: '#05070c', glow: 'rgba(110,155,209,.5)', bok: [140,190,255], lx: .60, ly: .55 },
    lake:    { a: '#08161c', b: '#060a0e', glow: 'rgba(120,200,210,.42)',bok: [170,225,230], lx: .45, ly: .28 },
    brand:   { a: '#1c0910', b: '#08060a', glow: 'rgba(200,16,46,.5)',   bok: [255,120,140], lx: .38, ly: .50 },
    live:    { a: '#170a14', b: '#07070c', glow: 'rgba(190,90,200,.45)', bok: [230,160,255], lx: .55, ly: .42 }
  };

  function blade(ctx, x, y, r, rot) {
    ctx.beginPath();
    for (var s = 0; s < 9; s++) {
      var a = rot + s * 0.6981317;
      var px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      s ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  }

  function seeded(n) {
    return function () { n = (n * 16807) % 2147483647; return n / 2147483647; };
  }

  function paintFrame(canvas, grade, time) {
    var g = GRADES[grade] || GRADES.temple;
    // The grain pass reads the whole frame back every tick; without this hint
    // the browser keeps the buffer GPU-side and each readback stalls.
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var w = canvas.width, h = canvas.height;

    var wash = ctx.createLinearGradient(0, 0, w, h);
    wash.addColorStop(0, g.a); wash.addColorStop(1, g.b);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = wash; ctx.fillRect(0, 0, w, h);

    var key = ctx.createRadialGradient(w * g.lx, h * g.ly, 0, w * g.lx, h * g.ly, w * .8);
    key.addColorStop(0, g.glow); key.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = key; ctx.fillRect(0, 0, w, h);

    var rand = seeded(grade.length * 977 + 13);
    var rgb = g.bok.join(',');
    for (var i = 0; i < 32; i++) {
      var bx = rand(), by = rand(), br = rand(), sp = rand();
      var x = ((bx + time * (.010 + sp * .018)) % 1.24 - .12) * w;
      var y = (by * .92 + Math.sin(time * .45 + i) * .018) * h;
      var r = (4 + br * br * 26) * (w / 640);
      var rim = .07 + br * .13;

      var glow = ctx.createRadialGradient(x, y, 0, x, y, r);
      glow.addColorStop(0, 'rgba(' + rgb + ',' + (rim * .55).toFixed(3) + ')');
      glow.addColorStop(.74, 'rgba(' + rgb + ',' + (rim * .70).toFixed(3) + ')');
      glow.addColorStop(1, 'rgba(' + rgb + ',' + rim.toFixed(3) + ')');
      ctx.fillStyle = glow;
      blade(ctx, x, y, r, sp * 6.2832 + time * .12);
      ctx.fill();

      ctx.strokeStyle = 'rgba(' + rgb + ',' + (rim * .85).toFixed(3) + ')';
      ctx.lineWidth = Math.max(1, r * .05);
      ctx.stroke();
    }

    // Anamorphic streak through the key
    ctx.fillStyle = 'rgba(150,180,255,.05)';
    ctx.fillRect(0, h * g.ly - h * .012, w, h * .024);

    // Out-of-focus foreground: gives the plate somewhere to sit
    ctx.globalCompositeOperation = 'source-over';
    var floorGrad = ctx.createLinearGradient(0, h * .62, 0, h);
    floorGrad.addColorStop(0, 'rgba(0,0,0,0)');
    floorGrad.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = floorGrad; ctx.fillRect(0, h * .62, w, h * .38);

    var img = ctx.getImageData(0, 0, w, h), d = img.data;
    for (var p = 0; p < d.length; p += 4) {
      var n = (Math.random() - .5) * 16;
      d[p] += n; d[p + 1] += n; d[p + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
  }

  function tc(seconds) {
    var f = Math.floor((seconds % 1) * 24);
    var s = Math.floor(seconds) % 60;
    var m = Math.floor(seconds / 60) % 60;
    var pad = function (v) { return v < 10 ? '0' + v : String(v); };
    return '00:' + pad(m) + ':' + pad(s) + ':' + pad(f);
  }

  Array.prototype.slice.call(document.querySelectorAll('.frame')).forEach(function (frame) {
    var canvas = frame.querySelector('.frame__canvas');
    var clock = frame.querySelector('.frame__tc');
    var grade = frame.getAttribute('data-grade');
    var raf = null, t0 = 0;

    // The grid can report a zero width on the very first paint, before fonts
    // settle. Painting into a 0-wide canvas throws, so wait for a real width.
    function size() {
      var css = frame.clientWidth;
      if (css < 2) { requestAnimationFrame(size); return; }
      var w = Math.min(720, Math.round(css * Math.min(2, window.devicePixelRatio || 1)));
      if (canvas.width === w) return;
      canvas.width = w; canvas.height = Math.round(w * 9 / 16);
      if (!raf) paintFrame(canvas, grade, 0);
    }

    function roll(now) {
      var t = (now - t0) / 1000;
      paintFrame(canvas, grade, t);
      clock.textContent = tc(t);
      raf = requestAnimationFrame(roll);
    }

    function play() {
      if (raf || reduceMotion.matches) return;
      t0 = performance.now();
      raf = requestAnimationFrame(roll);
    }
    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf); raf = null;
      paintFrame(canvas, grade, 0);
      clock.textContent = '00:00:00:00';
    }

    frame.addEventListener('pointerenter', play);
    frame.addEventListener('pointerleave', stop);
    frame.addEventListener('focusin', play);
    frame.addEventListener('focusout', stop);
    window.addEventListener('resize', size, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(frame);
    size();
  });

  /* ============================================================
     10. Hero — a nine-blade aperture barrel, receding forever.
         Raw WebGL: the page must stay self-contained, so there is no
         3D library here, just a full-screen quad and one fragment shader.
     ============================================================ */
  (function heroBarrel() {
    var canvas = document.getElementById('heroGL');
    var hero = document.querySelector('.hero');
    if (!canvas) return;

    var gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
        || canvas.getContext('experimental-webgl');
    } catch (err) { gl = null; }

    if (!gl || reduceMotion.matches) {
      // Static equivalent: the CSS gradient carries the same light.
      canvas.style.display = 'none';
      hero.classList.add('no-gl');
      return;
    }

    var VERT =
      'attribute vec2 a_p;' +
      'void main(){ gl_Position = vec4(a_p, 0.0, 1.0); }';

    var FRAG = [
      'precision highp float;',
      'uniform vec2 u_res; uniform float u_t; uniform float u_scroll; uniform vec2 u_mouse;',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453); }',
      // Distance to a regular n-gon — nine blades, like the iris in the mark.
      'float ngon(vec2 p, float r, float n, float rot){',
      '  float a = atan(p.y, p.x) + rot;',
      '  float seg = 6.2831853 / n;',
      '  return cos(floor(0.5 + a/seg)*seg - a) * length(p) - r;',
      '}',
      'void main(){',
      '  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;',
      '  uv += u_mouse * 0.045;',
      '  float wide = clamp(u_res.x/u_res.y - 1.0, 0.0, 1.0);',
      '  vec2 bu = uv - vec2(0.30 * wide, 0.04);',
      '  vec3 col = mix(vec3(0.010,0.012,0.018), vec3(0.048,0.011,0.019),',
      '                 smoothstep(-0.7, 0.8, uv.x + uv.y*0.4));',
      '  float travel = u_t * 0.16 + u_scroll * 3.0;',
      // Sixteen rings wrapped through a modulo: an endless barrel for the price of one loop.
      '  for(float i = 0.0; i < 16.0; i++){',
      '    float z = mod(i - travel, 16.0);',
      '    float depth = z + 0.5;',
      '    float sc = 1.5 / depth;',
      '    float rot = depth * 0.17 + u_t * 0.03;',
      '    float d = abs(ngon(bu, 0.62 * sc, 9.0, rot)) - 0.010 * sc;',
      '    float a = smoothstep(0.0, 4.0, z) * smoothstep(16.0, 11.0, z);',
      '    vec2 n = normalize(bu + vec2(1e-4));',
      '    float key = 0.5 + 0.5 * dot(n, normalize(vec2(0.55, 0.83)));',
      '    vec3 tint = mix(vec3(0.62, 0.04, 0.11), vec3(1.0, 0.94, 0.88), pow(key, 2.4));',
      '    float edge = smoothstep(0.008 * sc, 0.0, d);',
      '    float bloom = 0.0016 * sc / (abs(d) + 0.0026);',
      '    col += tint * (edge * 0.5 + bloom * 1.1) * a;',
      '  }',
      // Key light with the horizontal streak an anamorphic lens throws.
      '  vec2 lp = vec2(0.30 * wide + 0.16, 0.22);',
      '  float dl = length((uv - lp) * vec2(1.0, 2.6));',
      '  col += vec3(1.0, 0.80, 0.68) * 0.030 / (dl + 0.14);',
      '  float streak = exp(-abs(uv.y - lp.y) * 90.0) * exp(-abs(uv.x - lp.x) * 1.3);',
      '  col += vec3(0.42, 0.56, 1.0) * streak * 0.14;',
      '  for(float k = 0.0; k < 3.0; k++){',
      '    vec2 q = uv * (3.0 + k * 4.0) + vec2(u_t * (0.02 + k * 0.012), u_t * -0.014);',
      '    vec2 gid = floor(q);',
      '    if(hash(gid + k * 21.0) > 0.90){',
      '      vec2 f = fract(q) - vec2(hash(gid + 3.0), hash(gid + 7.0));',
      '      col += vec3(1.0, 0.92, 0.86) * smoothstep(0.10, 0.0, length(f)) * (0.30 - k * 0.07);',
      '    }',
      '  }',
      '  vec2 vv = gl_FragCoord.xy / u_res;',
      '  col *= 0.45 + 0.55 * pow(16.0 * vv.x * vv.y * (1.0 - vv.x) * (1.0 - vv.y), 0.30);',
      '  col += (hash(gl_FragCoord.xy + fract(u_t) * 137.0) - 0.5) * 0.035;',
      '  col = col / (1.0 + col);',
      '  col = pow(max(col, vec3(0.0)), vec3(0.82));',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('RP Films shader:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = 'none'; hero.classList.add('no-gl'); return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; hero.classList.add('no-gl'); return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'u_res');
    var uT = gl.getUniformLocation(prog, 'u_t');
    var uScroll = gl.getUniformLocation(prog, 'u_scroll');
    var uMouse = gl.getUniformLocation(prog, 'u_mouse');

    function resize() {
      // A shader this heavy does not need retina pixels; 1.5x is past the point of noticing.
      var dpr = Math.min(window.innerWidth < 700 ? 1 : 1.5, window.devicePixelRatio || 1);
      var w = Math.round(canvas.clientWidth * dpr);
      var h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    var mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = -(e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) requestAnimationFrame(draw);
      }, { threshold: 0 }).observe(hero);
    }

    var start = performance.now();
    function draw(now) {
      if (!visible || document.hidden) return;
      resize();
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      var scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(draw);
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) requestAnimationFrame(draw);
    });
    requestAnimationFrame(draw);
  }());

}());
