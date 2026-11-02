(function () {
  'use strict';

  var config = window.STORE_CONFIG || {};
  var seedProducts = window.PRODUCTS || [];
  var products = seedProducts.slice();
  var categories = window.STORE_CATEGORIES || [{ id: 'todos', label: 'Todos' }];

  var CATEGORY_LABELS = {};
  categories.forEach(function (cat) { CATEGORY_LABELS[cat.id] = cat.label; });

  var money = new Intl.NumberFormat(config.locale || 'es-BO', {
    style: 'currency',
    currency: config.currency || 'BOB',
    maximumFractionDigits: 0
  });

  var uid = 0;
  var state = {
    query: '',
    category: 'todos',
    sort: 'featured',
    product: null,
    qty: 1
  };

  var els = {
    header: document.querySelector('.site-header'),
    menuToggle: document.querySelector('.menu-toggle'),
    nav: document.getElementById('site-nav'),
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    sortSelect: document.getElementById('sort-select'),
    filters: document.getElementById('category-filters'),
    resultsCount: document.getElementById('results-count'),
    resetFilters: document.getElementById('reset-filters'),
    grid: document.getElementById('product-grid'),
    empty: document.getElementById('empty-state'),
    dialog: document.getElementById('product-dialog'),
    dialogContent: document.getElementById('dialog-content'),
    toast: document.getElementById('toast'),
    waFloat: document.getElementById('whatsapp-float'),
    contactWa: document.getElementById('contact-whatsapp'),
    footerWa: document.getElementById('footer-whatsapp'),
    footerEmailWrap: document.getElementById('footer-email-wrap'),
    footerEmail: document.getElementById('footer-email'),
    footerIgWrap: document.getElementById('footer-instagram-wrap'),
    footerIg: document.getElementById('footer-instagram'),
    year: document.getElementById('current-year'),
    heroMain: document.getElementById('hero-art-main'),
    heroBook: document.getElementById('hero-art-book'),
    heroBear: document.getElementById('hero-art-bear')
  };

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function formatMoney(value) {
    return money.format(value || 0);
  }

  function findProduct(id) {
    return products.filter(function (p) { return p.id === id; })[0] || null;
  }

  function nextId() {
    uid += 1;
    return 'g' + uid;
  }

  var HEART =
    'M400 470s-108-64-108-134a48 48 0 0 1 108-58 48 48 0 0 1 108 58c0 70-108 134-108 134Z';

  function sceneBackdrop(c3, c1, height) {
    var id = nextId();
    return (
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c3 + '"/>' +
      '<stop offset="1" stop-color="' + c1 + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="' + (height || 560) + '" fill="url(#' + id + ')"/>'
    );
  }

  function sparkles(color, count, seed) {
    var out = '';
    for (var i = 0; i < count; i += 1) {
      var x = 60 + ((seed * 73 + i * 137) % 680);
      var y = 40 + ((seed * 41 + i * 199) % 480);
      var r = 2 + ((seed + i) % 3);
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '" opacity="0.35"/>';
    }
    return out;
  }

  function photoPolaroid(x, y, w, rot, c2) {
    var h = w * 0.74;
    return (
      '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">' +
      '<rect width="' + w + '" height="' + h + '" rx="8" fill="#ffffff"/>' +
      '<rect x="9" y="9" width="' + (w - 18) + '" height="' + (h - 40) + '" rx="5" fill="' + c2 + '"/>' +
      '<rect x="' + (w / 2 - 16) + '" y="' + (h - 28) + '" width="32" height="5" rx="2.5" fill="#e4d5c9"/>' +
      '</g>'
    );
  }

  function boxArt(palette, peek) {
    var c1 = palette[0], c2 = palette[1], c4 = palette[3];
    var shadow = '<ellipse cx="400" cy="452" rx="150" ry="26" fill="#2f222c" opacity="0.14"/>';
    var photos =
      photoPolaroid(196, 214, 128, -11, c2) +
      photoPolaroid(438, 206, 138, 9, c1) +
      photoPolaroid(300, 172, 120, -4, c4);
    var ribbon =
      '<rect x="378" y="300" width="44" height="148" fill="' + c4 + '"/>' +
      '<rect x="252" y="352" width="296" height="34" fill="' + c4 + '" opacity="0.85"/>';
    var bow =
      '<ellipse cx="366" cy="292" rx="30" ry="20" fill="' + c4 + '" opacity="0.9"/>' +
      '<ellipse cx="434" cy="292" rx="30" ry="20" fill="' + c4 + '" opacity="0.9"/>' +
      '<circle cx="400" cy="296" r="13" fill="' + c4 + '"/>';
    var body =
      '<rect x="240" y="328" width="320" height="122" rx="14" fill="' + c1 + '"/>' +
      '<rect x="240" y="328" width="320" height="34" fill="#2f222c" opacity="0.08"/>';
    var lid = '<rect x="222" y="286" width="356" height="52" rx="12" fill="' + shade(c1, -18) + '"/>';
    var inner = lid + ribbon + bow + body;
    var art = shadow + photos + inner;
    if (peek) {
      art +=
        '<g transform="translate(268,236)">' +
        '<circle cx="0" cy="44" r="44" fill="' + c2 + '"/>' +
        '<circle cx="-34" cy="10" r="15" fill="' + c2 + '"/>' +
        '<circle cx="34" cy="10" r="15" fill="' + c2 + '"/>' +
        '<circle cx="-14" cy="40" r="5" fill="#2f222c"/>' +
        '<circle cx="14" cy="40" r="5" fill="#2f222c"/>' +
        '<ellipse cx="0" cy="52" rx="11" ry="8" fill="#f8efe6"/>' +
        '<circle cx="0" cy="49" r="4" fill="#2f222c"/>' +
        '<path d="M-14 36 Q0 44 14 36" stroke="#2f222c" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '</g>';
    }
    return art;
  }

  function frameArt(palette) {
    var c1 = palette[0], c2 = palette[1], c4 = palette[3];
    var shadow = '<ellipse cx="400" cy="462" rx="160" ry="22" fill="#2f222c" opacity="0.14"/>';
    var wood =
      '<rect x="248" y="176" width="304" height="240" rx="14" fill="' + c1 + '"/>' +
      '<rect x="266" y="194" width="268" height="204" rx="9" fill="#fbf4ea"/>' +
      '<rect x="248" y="176" width="304" height="240" rx="14" fill="none" stroke="' + c4 + '" stroke-width="7" opacity="0.55"/>';
    var content =
      '<path d="' + heartAt(400, 288, 0.85) + '" fill="' + c1 + '"/>' +
      '<rect x="306" y="330" width="188" height="7" rx="3.5" fill="#d8c6b4"/>' +
      '<rect x="332" y="348" width="136" height="7" rx="3.5" fill="#e4d5c9"/>';
    var flowers =
      '<g opacity="0.9">' +
      '<circle cx="272" cy="180" r="13" fill="' + c2 + '"/><circle cx="272" cy="160" r="9" fill="' + c2 + '" opacity="0.7"/>' +
      '<circle cx="528" cy="180" r="13" fill="' + c2 + '"/><circle cx="528" cy="160" r="9" fill="' + c2 + '" opacity="0.7"/>' +
      '</g>';
    var legs = '<rect x="300" y="416" width="16" height="30" rx="5" fill="' + shade(c1, -12) + '"/><rect x="484" y="416" width="16" height="30" rx="5" fill="' + shade(c1, -12) + '"/>';
    return shadow + wood + content + flowers + legs;
  }

  function heartAt(cx, cy, scale) {
    var s = scale || 1;
    return 'M' + cx + ' ' + cy + 's' + (-130 * s) + ' ' + (-86 * s) + ' ' + (-130 * s) + ' ' + (-184 * s) +
      'a70 ' + (70 * s) + ' 0 0 1 ' + (130 * s) + ' ' + (68 * s) + 'a70 ' + (70 * s) + ' 0 0 1 ' + (130 * s) + ' -' + (68 * s) +
      'c0 ' + (98 * s) + ' ' + (-130 * s) + ' ' + (184 * s) + ' ' + (-130 * s) + ' ' + (184 * s) + 'Z';
  }

  function bearArt(palette) {
    var c1 = palette[0], c2 = palette[1], c4 = palette[3];
    var shadow = '<ellipse cx="400" cy="456" rx="140" ry="24" fill="#2f222c" opacity="0.14"/>';
    var body =
      '<ellipse cx="400" cy="368" rx="118" ry="108" fill="' + c2 + '"/>' +
      '<ellipse cx="400" cy="384" rx="74" ry="82" fill="#fbf4ea"/>' +
      '<ellipse cx="306" cy="376" rx="30" ry="52" fill="' + c2 + '" transform="rotate(16 306 376)"/>' +
      '<ellipse cx="494" cy="376" rx="30" ry="52" fill="' + c2 + '" transform="rotate(-16 494 376)"/>';
    var head =
      '<circle cx="400" cy="234" r="96" fill="' + c2 + '"/>' +
      '<circle cx="318" cy="158" r="30" fill="' + c2 + '"/>' +
      '<circle cx="482" cy="158" r="30" fill="' + c2 + '"/>' +
      '<circle cx="318" cy="158" r="15" fill="#f4d7c8"/>' +
      '<circle cx="482" cy="158" r="15" fill="#f4d7c8"/>';
    var face =
      '<ellipse cx="400" cy="262" rx="52" ry="42" fill="#fbf4ea"/>' +
      '<circle cx="364" cy="222" r="8" fill="#2b1b22"/>' +
      '<circle cx="436" cy="222" r="8" fill="#2b1b22"/>' +
      '<ellipse cx="400" cy="252" rx="12" ry="9" fill="#2b1b22"/>' +
      '<path d="M400 262v16" stroke="#2b1b22" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M382 284q18 14 36 0" stroke="#2b1b22" stroke-width="4" fill="none" stroke-linecap="round"/>';
    var heart = '<path d="' + heartAt(400, 348, 0.42) + '" fill="' + c1 + '"/>';
    var feet =
      '<ellipse cx="330" cy="462" rx="34" ry="22" fill="' + shade(c2, -10) + '"/>' +
      '<ellipse cx="470" cy="462" rx="34" ry="22" fill="' + shade(c2, -10) + '"/>';
    return shadow + body + head + face + heart + feet;
  }

  function bookArt(palette) {
    var c1 = palette[0], c2 = palette[1], c4 = palette[3];
    var shadow = '<ellipse cx="400" cy="446" rx="180" ry="28" fill="#2f222c" opacity="0.16"/>';
    var cover =
      '<rect x="212" y="200" width="376" height="222" rx="18" fill="' + shade(c1, -14) + '"/>' +
      '<rect x="226" y="212" width="348" height="198" rx="12" fill="#fdf9f2"/>';
    var spine = '<rect x="397" y="212" width="6" height="198" fill="#e4d5c9"/>';
    var leftPhoto =
      '<g transform="rotate(-3 300 280)"><rect x="252" y="236" width="112" height="86" rx="7" fill="#ffffff"/>' +
      '<rect x="258" y="242" width="100" height="66" rx="5" fill="' + c2 + '"/></g>';
    var rightPhoto =
      '<g transform="rotate(3 500 268)"><rect x="438" y="232" width="108" height="82" rx="7" fill="#ffffff"/>' +
      '<rect x="444" y="238" width="96" height="64" rx="5" fill="' + c1 + '"/>' +
      '</g>';
    var lines =
      '<rect x="262" y="332" width="96" height="7" rx="3.5" fill="#e4d5c9"/>' +
      '<rect x="262" y="348" width="70" height="7" rx="3.5" fill="#ece0d4"/>' +
      '<rect x="444" y="326" width="90" height="7" rx="3.5" fill="#e4d5c9"/>' +
      '<rect x="444" y="342" width="64" height="7" rx="3.5" fill="#ece0d4"/>';
    var heart = '<path d="' + heartAt(400, 214, 0.5) + '" fill="' + c4 + '" opacity="0.9"/>';
    var stars =
      '<path d="M212 190l6 12 12 6-12 6-6 12-6-12-12-6 12-6Z" fill="' + c4 + '" opacity="0.65"/>' +
      '<path d="M596 168l5 10 10 5-10 5-5 10-5-10-10-5 10-5Z" fill="' + c4 + '" opacity="0.5"/>';
    return shadow + cover + spine + leftPhoto + rightPhoto + lines + heart + stars;
  }

  function shade(hex, amount) {
    var color = String(hex).replace('#', '');
    if (color.length !== 6) return hex;
    var num = parseInt(color, 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + amount));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    var b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  function productMedia(product, portrait) {
    if (product.photo) {
      return '<img class="product-photo' + (portrait ? ' product-photo-tall' : '') + '" src="' +
        escapeHTML(product.photo) + '" alt="" loading="lazy" decoding="async">';
    }
    return productArt(product, portrait);
  }

  function productArt(product, portrait) {
    var palette = product.palette || ['#743142', '#d58f80', '#f5ddd1', '#c7a05b'];
    var inner;
    if (product.category === 'carteles') inner = frameArt(palette);
    else if (product.category === 'peluches') inner = bearArt(palette);
    else if (product.category === 'libros') inner = bookArt(palette);
    else if (product.category === 'combos') inner = boxArt(palette, true);
    else inner = boxArt(palette, false);
    var deco =
      '<path d="' + heartAt(96, 120, 0.22) + '" fill="' + palette[1] + '" opacity="0.5"/>' +
      '<path d="' + heartAt(716, 452, 0.18) + '" fill="' + palette[1] + '" opacity="0.45"/>' +
      sparkles(palette[3], 14, products.indexOf(product) + 3);
    var body = '<g' + (portrait ? ' transform="translate(0,190)"' : '') + '>' + deco + inner + '</g>';
    return (
      '<svg viewBox="' + (portrait ? '0 0 800 1000' : '0 0 800 560') + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      sceneBackdrop(palette[2], palette[0], portrait ? 1000 : 560) + body +
      '</svg>'
    );
  }

  function whatsappLink(message) {
    var phone = String(config.whatsapp || '').replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(phone)) return null;
    var url = 'https://wa.me/' + phone;
    if (message) url += '?text=' + encodeURIComponent(message);
    return url;
  }

  var toastTimer = null;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove('is-visible');
    }, 3200);
  }

  function activeFilters() {
    return state.category !== 'todos' || state.query.trim() !== '' || state.sort !== 'featured';
  }

  function visibleProducts() {
    var query = normalize(state.query.trim().toLowerCase());
    var list = products.filter(function (p) {
      if (state.category !== 'todos' && p.category !== state.category) return false;
      if (!query) return true;
      var haystack = normalize([
        p.name, p.lead, p.description, p.category,
        CATEGORY_LABELS[p.category] || '', p.tags || '', p.badge || ''
      ].join(' '));
      return haystack.indexOf(query) !== -1;
    });
    if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
    else list.sort(function (a, b) { return (a.featured == null ? 99 : a.featured) - (b.featured == null ? 99 : b.featured); });
    return list;
  }

  function renderFilters() {
    if (!els.filters) return;
    els.filters.innerHTML = categories.map(function (cat) {
      var count = cat.id === 'todos'
        ? products.length
        : products.filter(function (p) { return p.category === cat.id; }).length;
      var active = state.category === cat.id ? ' is-active' : '';
      return '<button class="chip' + active + '" type="button" data-category="' + cat.id + '">' +
        cat.label + ' <span aria-hidden="true">(' + count + ')</span></button>';
    }).join('');
  }

  var revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

  function registerReveal(node, delay) {
    if (!node || node.classList.contains('reveal')) return;
    node.classList.add('reveal');
    node.style.transitionDelay = (delay || 0) + 'ms';
    if (revealObserver) revealObserver.observe(node);
    else node.classList.add('is-in');
  }

  function renderGrid() {
    var list = visibleProducts();
    if (!els.grid) return;
    els.grid.innerHTML = list.map(function (p) {
      var badge = p.badge ? '<span class="card-badge">' + escapeHTML(p.badge) + '</span>' : '';
      return (
        '<article class="product-card" data-product-id="' + escapeHTML(p.id) + '">' +
        '<div class="card-media" aria-hidden="true">' + productMedia(p, false) + badge + '</div>' +
        '<div class="card-body">' +
        '<span class="card-category">' + escapeHTML(CATEGORY_LABELS[p.category] || p.category) + '</span>' +
        '<h3 class="card-title">' + escapeHTML(p.name) + '</h3>' +
        '<p class="card-lead">' + escapeHTML(p.lead) + '</p>' +
        '<div class="card-foot">' +
        '<p class="card-price"><small>Desde</small><strong>' + formatMoney(p.price) + '</strong></p>' +
        '<button class="card-button" type="button" data-open-product="' + escapeHTML(p.id) + '">Personalizar</button>' +
        '</div></div></article>'
      );
    }).join('');

    Array.prototype.forEach.call(els.grid.children, function (card, index) {
      registerReveal(card, (index % 6) * 60);
    });

    if (els.resultsCount) {
      var label = list.length === 1 ? 'producto' : 'productos';
      els.resultsCount.textContent = list.length + ' ' + label;
    }
    if (els.empty) els.empty.hidden = list.length !== 0;
    if (els.resetFilters) els.resetFilters.hidden = !activeFilters();
  }

  function optionGroupHTML(group) {
    var pills = group.values.map(function (value, index) {
      var extra = value.price ? ' <small>+' + formatMoney(value.price) + '</small>' : '';
      return (
        '<label class="option-pill">' +
        '<input type="radio" name="opt-' + escapeHTML(group.name) + '" value="' + index + '"' +
        (index === 0 ? ' checked' : '') + ' data-price="' + (value.price || 0) + '">' +
        '<span>' + escapeHTML(value.label) + extra + '</span>' +
        '</label>'
      );
    }).join('');
    return (
      '<fieldset class="option-group" data-option="' + escapeHTML(group.name) + '">' +
      '<legend>' + escapeHTML(group.label) + '</legend>' +
      '<div class="option-pills">' + pills + '</div>' +
      '</fieldset>'
    );
  }

  function fieldHTML(field) {
    var full = field.type === 'textarea' ? ' field-full' : '';
    var control;
    if (field.type === 'textarea') {
      control = '<textarea name="' + escapeHTML(field.name) + '" id="f-' + escapeHTML(field.name) + '"' +
        (field.maxlength ? ' maxlength="' + field.maxlength + '"' : '') +
        ' placeholder="' + escapeHTML(field.placeholder || '') + '"></textarea>';
    } else {
      control = '<input type="' + (field.type || 'text') + '" name="' + escapeHTML(field.name) + '" id="f-' + escapeHTML(field.name) + '"' +
        (field.maxlength ? ' maxlength="' + field.maxlength + '"' : '') +
        ' placeholder="' + escapeHTML(field.placeholder || '') + '">';
    }
    return (
      '<label class="' + full.trim() + '">' +
      '<span class="field-label">' + escapeHTML(field.label) + (field.required ? ' *' : '') + '</span>' +
      control +
      '<small class="field-error">Este campo es obligatorio.</small>' +
      '</label>'
    );
  }

  function dialogHTML(product) {
    var options = (product.options || []).map(optionGroupHTML).join('');
    var fields = (product.fields || []).map(fieldHTML).join('');
    var includes = (product.includes || []).length
      ? '<ul class="includes-list">' +
        product.includes.map(function (item) { return '<li>' + escapeHTML(item) + '</li>'; }).join('') +
        '</ul>'
      : '';
    var kicker = escapeHTML(CATEGORY_LABELS[product.category] || product.category) +
      (product.badge ? ' · ' + escapeHTML(product.badge) : '');
    var demoLink = product.id === 'libro-digital'
      ? '<a class="text-link" href="' + escapeHTML(config.bookDemo || 'libro-demo.html') + '" target="_blank" rel="noopener">Ver demo del libro <span aria-hidden="true">&rarr;</span></a>'
      : '';
    return (
      '<button class="dialog-close" type="button" data-close-dialog aria-label="Cerrar">&times;</button>' +
      '<div class="dialog-media" aria-hidden="true">' + productMedia(product, true) + '</div>' +
      '<div class="dialog-info">' +
      '<p class="dialog-kicker">' + kicker + '</p>' +
      '<h2 class="dialog-title" id="product-dialog-title">' + escapeHTML(product.name) + '</h2>' +
      '<p class="dialog-lead">' + escapeHTML(product.description) + '</p>' +
      '<form id="order-form" novalidate>' +
      options +
      (fields ? '<div class="custom-grid">' + fields + '</div>' : '') +
      '<div class="qty-row">' +
      '<span class="qty-label">Cantidad</span>' +
      '<div class="qty-stepper">' +
      '<button type="button" data-qty="-1" aria-label="Menos cantidad">-</button>' +
      '<output aria-live="polite">1</output>' +
      '<button type="button" data-qty="1" aria-label="Más cantidad">+</button>' +
      '</div></div>' +
      '<p class="dialog-total"><span><small>Total estimado</small><strong data-total>' + formatMoney(product.price) + '</strong></span></p>' +
      '<button class="btn btn-primary" type="submit">Pedir por WhatsApp</button>' +
      '<p class="dialog-note">Las fotos se coordinan por WhatsApp después de confirmar el pedido. ' +
      escapeHTML(config.paymentNote || '') + ' ' + escapeHTML(config.deliveryNote || '') + '</p>' +
      '</form>' +
      includes +
      '<p class="dialog-delivery">' + escapeHTML(product.delivery || '') + '</p>' +
      demoLink +
      '</div>'
    );
  }

  function basePrice() {
    var product = state.product;
    if (!product || !els.dialogContent) return 0;
    var total = product.price;
    els.dialogContent.querySelectorAll('input[type="radio"][data-price]').forEach(function (input) {
      if (input.checked && input.dataset.price) total += Number(input.dataset.price);
    });
    return total;
  }

  function updateTotal() {
    var target = els.dialogContent.querySelector('[data-total]');
    if (target) target.textContent = formatMoney(basePrice() * state.qty);
  }

  function orderValues() {
    var form = document.getElementById('order-form');
    if (!form || !state.product) return null;
    var options = {};
    (state.product.options || []).forEach(function (group) {
      var selected = form.querySelector('input[name="opt-' + group.name + '"]:checked');
      options[group.name] = selected ? Number(selected.value) : 0;
    });
    var fields = {};
    (state.product.fields || []).forEach(function (field) {
      var input = form.querySelector('[name="' + field.name + '"]');
      fields[field.name] = input ? input.value.trim() : '';
    });
    return { options: options, fields: fields };
  }

  function buildOrderMessage(values, total) {
    var product = state.product;
    var lines = [];
    lines.push('Hola ' + (config.brand || '') + ', quiero hacer un pedido.');
    lines.push('');
    lines.push('Producto: ' + product.name);
    (product.options || []).forEach(function (group) {
      var index = values.options[group.name] || 0;
      var value = group.values[index];
      if (value) {
        var delta = value.price ? ' (+' + formatMoney(value.price) + ')' : '';
        lines.push(group.label + ': ' + value.label + delta);
      }
    });
    var personal = (product.fields || []).filter(function (field) {
      return values.fields[field.name];
    });
    if (personal.length) {
      lines.push('');
      lines.push('Personalización:');
      personal.forEach(function (field) {
        lines.push(field.label + ': ' + values.fields[field.name]);
      });
    }
    lines.push('');
    lines.push('Cantidad: ' + state.qty);
    lines.push('Total estimado: ' + formatMoney(total));
    lines.push('');
    lines.push('¿Me confirman disponibilidad y fecha de entrega?');
    return lines.join('\n');
  }

  function openWhatsApp(message) {
    var url = whatsappLink(message);
    if (!url) {
      showToast('Configura tu número de WhatsApp en js/config.js.');
      return;
    }
    showToast('Abriendo WhatsApp con tu pedido…');
    window.open(url, '_blank', 'noopener');
  }

  function setDialogOpen(open) {
    if (open) {
      if (typeof els.dialog.showModal === 'function') els.dialog.showModal();
      else els.dialog.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
      var closeBtn = els.dialogContent.querySelector('[data-close-dialog]');
      if (closeBtn) closeBtn.focus();
      if (window.history && window.history.replaceState) {
        try { window.history.replaceState(null, '', '#producto/' + state.product.id); } catch (error) { /* sin-op */ }
      }
    } else {
      if (els.dialog.open) els.dialog.close();
      else els.dialog.removeAttribute('open');
      document.body.style.overflow = '';
      if (window.location.hash.indexOf('#producto/') === 0 && window.history && window.history.replaceState) {
        try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (error) { /* sin-op */ }
      }
    }
  }

  function openProduct(id) {
    var product = findProduct(id);
    if (!product) return;
    state.product = product;
    state.qty = 1;
    els.dialogContent.innerHTML = dialogHTML(product);
    setDialogOpen(true);
    updateTotal();
  }

  function closeProduct() {
    setDialogOpen(false);
    state.product = null;
  }

  function bindDialog() {
    if (!els.dialog || !els.dialogContent) return;

    els.dialog.addEventListener('click', function (event) {
      if (event.target === els.dialog) closeProduct();
    });

    els.dialog.addEventListener('close', function () {
      state.product = null;
      document.body.style.overflow = '';
    });

    els.dialogContent.addEventListener('click', function (event) {
      var close = event.target.closest('[data-close-dialog]');
      if (close) { closeProduct(); return; }
      var qtyBtn = event.target.closest('[data-qty]');
      if (qtyBtn) {
        var delta = Number(qtyBtn.dataset.qty);
        state.qty = Math.min(20, Math.max(1, state.qty + delta));
        var output = els.dialogContent.querySelector('.qty-stepper output');
        if (output) output.textContent = String(state.qty);
        updateTotal();
        return;
      }
      var link = event.target.closest('a[href="#producto/"], a[href$="#producto/libro-digital"]');
      if (link) { closeProduct(); }
    });

    els.dialogContent.addEventListener('change', function (event) {
      if (event.target.matches('input[type="radio"][data-price]')) updateTotal();
    });

    els.dialogContent.addEventListener('submit', function (event) {
      var form = event.target.closest('#order-form');
      if (!form) return;
      event.preventDefault();
      var product = state.product;
      if (!product) return;
      var values = orderValues();
      var firstBad = null;
      (product.fields || []).forEach(function (field) {
        var input = form.querySelector('[name="' + field.name + '"]');
        if (!input) return;
        var empty = !input.value.trim();
        if (field.required && empty) {
          input.classList.add('is-error');
          if (!firstBad) firstBad = input;
        } else {
          input.classList.remove('is-error');
        }
      });
      if (firstBad) {
        firstBad.focus();
        showToast('Completa los campos marcados para continuar.');
        return;
      }
      var total = basePrice() * state.qty;
      openWhatsApp(buildOrderMessage(values, total));
    });

    els.dialogContent.addEventListener('input', function (event) {
      var target = event.target;
      if (target.matches('[name]') && target.value.trim()) target.classList.remove('is-error');
    });
  }

  function setCategory(id) {
    state.category = id;
    renderFilters();
    renderGrid();
  }

  function bindCatalog() {
    if (els.filters) {
      els.filters.addEventListener('click', function (event) {
        var chip = event.target.closest('[data-category]');
        if (chip) setCategory(chip.dataset.category);
      });
    }
    if (els.searchInput) {
      els.searchInput.addEventListener('input', function () {
        state.query = els.searchInput.value;
        if (els.searchClear) els.searchClear.hidden = state.query.trim() === '';
        renderGrid();
      });
    }
    if (els.searchClear) {
      els.searchClear.addEventListener('click', function () {
        state.query = '';
        if (els.searchInput) { els.searchInput.value = ''; els.searchInput.focus(); }
        els.searchClear.hidden = true;
        renderGrid();
      });
    }
    if (els.sortSelect) {
      els.sortSelect.addEventListener('change', function () {
        state.sort = els.sortSelect.value;
        renderGrid();
      });
    }
    if (els.resetFilters) {
      els.resetFilters.addEventListener('click', function () {
        state.category = 'todos';
        state.query = '';
        state.sort = 'featured';
        if (els.searchInput) els.searchInput.value = '';
        if (els.searchClear) els.searchClear.hidden = true;
        if (els.sortSelect) els.sortSelect.value = 'featured';
        renderFilters();
        renderGrid();
      });
    }
    if (els.empty) {
      els.empty.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-reset-filters]');
        if (!btn) return;
        state.category = 'todos';
        state.query = '';
        if (els.searchInput) els.searchInput.value = '';
        if (els.searchClear) els.searchClear.hidden = true;
        renderFilters();
        renderGrid();
      });
    }
  }

  function bindDocument() {
    document.addEventListener('click', function (event) {
      var opener = event.target.closest('[data-open-product]');
      if (opener) {
        event.preventDefault();
        openProduct(opener.dataset.openProduct);
        return;
      }
      var jump = event.target.closest('[data-category-jump]');
      if (jump) {
        setCategory(jump.dataset.categoryJump);
        if (document.body.classList.contains('menu-open')) closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !els.dialog.open && document.body.classList.contains('menu-open')) closeMenu();
    });
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (els.menuToggle) els.menuToggle.setAttribute('aria-expanded', 'false');
  }

  function bindHeader() {
    if (els.menuToggle) {
      els.menuToggle.addEventListener('click', function () {
        var open = document.body.classList.toggle('menu-open');
        els.menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (els.nav) {
      els.nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
      });
    }
    if (els.header) {
      var onScroll = function () {
        els.header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  function bindLinks() {
    var intro = 'Hola ' + (config.brand || '') + ', quiero información sobre sus productos.';
    var url = whatsappLink(intro);
    if (url) {
      if (els.waFloat) els.waFloat.href = url;
      if (els.contactWa) els.contactWa.href = url;
      if (els.footerWa) els.footerWa.href = url;
    } else {
      var warn = function (event) {
        if (els.waFloat && event.currentTarget === els.waFloat) {}
        showToast('Configura tu número de WhatsApp en js/config.js.');
        event.preventDefault();
      };
      [els.waFloat, els.contactWa, els.footerWa].forEach(function (link) {
        if (!link) return;
        link.href = '#';
        link.addEventListener('click', warn);
      });
    }
    if (config.email) {
      if (els.footerEmailWrap) els.footerEmailWrap.hidden = false;
      if (els.footerEmail) {
        els.footerEmail.href = 'mailto:' + config.email;
        els.footerEmail.textContent = config.email;
      }
    }
    if (config.instagram) {
      if (els.footerIgWrap) els.footerIgWrap.hidden = false;
      if (els.footerIg) els.footerIg.href = config.instagram;
    }
  }

  function bindHash() {
    window.addEventListener('hashchange', function () {
      if (els.dialog.open) return;
      var match = window.location.hash.match(/^#producto\/(.+)$/);
      if (match) {
        var product = findProduct(match[1]);
        if (product) openProduct(product.id);
      }
    });
  }

  function mapProductRow(row) {
    return {
      id: row.slug || String(row.id || ''),
      name: row.name || 'Producto',
      category: row.category,
      lead: row.lead || '',
      description: row.description || '',
      price: Number(row.price) || 0,
      badge: row.badge || '',
      featured: row.featured == null ? null : Number(row.featured),
      palette: Array.isArray(row.palette) && row.palette.length === 4 ? row.palette.slice(0, 4) : null,
      options: Array.isArray(row.options) ? row.options : [],
      fields: Array.isArray(row.fields) ? row.fields : [],
      includes: Array.isArray(row.includes) ? row.includes : [],
      delivery: row.delivery || '',
      tags: row.tags || '',
      photo: row.photo_url || ''
    };
  }

  function loadRemoteProducts() {
    var sb = config.supabase;
    if (!sb || !sb.url || !sb.key || !window.fetch) return Promise.resolve(null);
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 4000);
    var headers = { apikey: sb.key, Authorization: 'Bearer ' + sb.key };
    return fetch(sb.url + '/rest/v1/tienda_products?select=*&published=eq.true&order=sort.asc', {
      headers: headers,
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(function (rows) {
      clearTimeout(timer);
      if (!Array.isArray(rows)) return null;
      return rows.map(mapProductRow).filter(function (p) { return p.id; });
    }).catch(function (error) {
      clearTimeout(timer);
      if (window.console && error && error.name !== 'AbortError') {
        console.warn('Catálogo remoto no disponible, uso el respaldo local.', error);
      }
      return null;
    });
  }

  function renderHero() {
    function setArt(target, productId) {
      var product = seedProducts.filter(function (p) { return p.id === productId; })[0];
      if (target && product) target.innerHTML = productArt(product);
    }
    setArt(els.heroMain, 'caja-nuestro-momento');
    setArt(els.heroBook, 'libro-digital');
    setArt(els.heroBear, 'peluche-personalizado');
  }

  function init() {
    if (!products.length) return;
    if (els.year) els.year.textContent = String(new Date().getFullYear());
    renderHero();
    renderFilters();
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (node, index) {
      registerReveal(node, Math.min(index * 70, 280));
    });
    renderGrid();
    bindCatalog();
    bindDialog();
    bindDocument();
    bindHeader();
    bindLinks();
    bindHash();

    var match = window.location.hash.match(/^#producto\/(.+)$/);
    if (match) {
      var product = findProduct(match[1]);
      if (product) openProduct(product.id);
    }
  }

  if (config.supabase && config.supabase.url) {
    loadRemoteProducts().then(function (remote) {
      if (remote && remote.length) products = remote;
      init();
    });
  } else {
    init();
  }
})();
