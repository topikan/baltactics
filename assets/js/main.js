/* БалТактика — интерактив (статичный сайт, без бэкенда) */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var page = document.body.dataset.page;
  var IMG = 'assets/img/products/';
  var PLACEHOLDER = 'assets/img/placeholder.svg';
  var WA = '79951138708';

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (n) { return n.toLocaleString('ru-RU').replace(/ |,/g, ' ') + ' ₽'; };
  var waLink = function (t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); };

  /* ---------- Каталог: данные с baltactics.ru ---------- */
  var COLORS = { 'Чёрный': '#1b1b18', 'Олива': '#5d5f3a', 'Песочный': '#c8b48a', 'Милитари': '#6b6b45', 'Белый': '#f4f4f0' };
  var C3 = ['Чёрный', 'Олива', 'Песочный'];
  var SZ = ['46–50', '50–54', '54–56'];
  var SZF = ['40', '41', '42', '43', '44', '45', '46'];
  var PRODUCTS = [
    { id: 'zaschitnik', cat: 'vests', title: 'Бронежилет «Защитник»', price: 19000, img: 'zaschitnik.jpg', colors: C3, sizes: SZ, tag: 'Хит', meta: 'Размеры 46–56' },
    { id: 'strazh', cat: 'vests', title: 'Бронежилет «Страж»', price: 20000, img: 'strazh.jpg', colors: C3, sizes: SZ, meta: 'Размеры 46–56' },
    { id: 'vest', cat: 'vests', title: 'Защитный жилет', price: 15000, img: 'vest.jpg', colors: C3, sizes: SZ, meta: 'Бр1+ / С2 · 1 кг 105 г',
      desc: 'Внутри бронепакеты СВМПЭ 25×30 см толщиной 1,5 см по классу защиты Бр1+/С2. Защищает проекцию жизненно важных органов со стороны груди и спины.',
      specs: [['Класс защиты', 'Бр1+ / С2'], ['Вес', '1 кг 105 г'], ['Материал', 'Спандекс'], ['Бронепакеты', 'СВМПЭ 25×30 см']] },
    { id: 'plate', cat: 'vests', title: 'Бронепанель', price: 14000, img: 'plate.jpg', cover: true, colors: C3, sizes: SZ, meta: 'Лёгкая и гибкая',
      desc: 'Лёгкость и гибкость, высокий класс защиты, долговечность. Сертифицировано EAC, сделано в России.' },
    { id: 'cc-vest', cat: 'concealed', title: 'Жилет скрытого ношения', price: 23500, img: 'cc-vest.jpg', colors: C3, sizes: SZ, meta: 'Полиэстер',
      specs: [['Материал', 'Полиэстер']] },
    { id: 'nevidimka', cat: 'concealed', title: 'Жилет скрытого ношения «Невидимка»', price: 12000, img: 'nevidimka.jpg', colors: C3, sizes: SZ, meta: 'Размеры 46–56' },
    { id: 'bogatyr', cat: 'concealed', title: 'Жилет скрытого ношения «Русский Богатырь»', price: 18000, img: 'bogatyr.jpg', colors: C3, sizes: SZ, meta: 'Размеры 46–56' },
    { id: 'cc-shirt', cat: 'concealed', title: 'Майка скрытого ношения', price: 11500, img: 'cc-shirt.jpg', colors: C3, sizes: SZ, meta: 'Полиэстер, вискоза, нейлон',
      specs: [['Материал', 'Полиэстер, вискоза, нейлон, твилл, спандекс']] },
    { id: 'ins-34', cat: 'insoles', title: 'Кевларовые стельки 3,4 мм', price: 1900, img: 'ins-dark.jpg', colors: ['Милитари'], sizes: SZF, tag: 'EAC', meta: 'Арамид · 1600 Дж/Н',
      desc: 'Антипрокольные стельки из твила, полимера и арамидного волокна. Специальный полимер для соединения слоёв.',
      specs: [['Материал', 'Твил, полимер, арамидное волокно'], ['Толщина', '3,4 мм'], ['Стойкость к проколу', '1600 Дж/Н'], ['Сертификация', 'ЕАС']] },
    { id: 'ins-c2-12', cat: 'insoles', title: 'Стельки СВМПЭ, 12 слоёв, класс C2', price: 2200, img: 'ins-multicam.jpg', colors: ['Милитари'], sizes: SZF, tag: 'C2', meta: 'Баллистические · 6,5 мм',
      desc: 'Баллистические, противоосколочные и антипрокольные стельки.',
      specs: [['Материал', 'СВМПЭ 160 г, 12 слоёв'], ['Толщина', '6,5 мм'], ['Класс защиты', 'C2'], ['Сертификация', 'ЕАС']] },
    { id: 'ins-c2-24', cat: 'insoles', title: 'Стельки СВМПЭ, 24 слоя, класс C2', price: 2500, img: 'ins-green.jpg', colors: ['Милитари'], sizes: SZF, tag: 'C2', meta: 'Баллистические · 6,5 мм',
      desc: 'Антипрокольные, баллистические и противоосколочные стельки.',
      specs: [['Материал', 'СВМПЭ 160 г, 24 слоя'], ['Толщина', '6,5 мм'], ['Класс защиты', 'C2'], ['Сертификация', 'ЕАС']] },
    { id: 'fiber', cat: 'other', title: 'Пуленепробиваемые ткани СВМПЭ и арамид', price: 550, img: 'fiber.jpg', cover: true, colors: ['Белый'], meta: 'Гиперпрочный материал' },
    { id: 'blanket', cat: 'other', title: 'Противоосколочное одеяло', price: 0, img: null, colors: ['Чёрный'], sizes: ['Односпальное', 'Полуторное', 'Двуспальное'], meta: 'Три размера' },
    { id: 'bag', cat: 'other', title: 'Сумка раздвижная с бронёй', price: 0, img: null, meta: 'Аксессуар' },
    { id: 'jacket', cat: 'other', title: 'Куртка «Броне»', price: 0, img: null, sizes: SZ, meta: 'Размеры 46–56' },
    { id: 'kofta', cat: 'other', title: 'Кофта с защитой локтей', price: 0, img: null, sizes: SZ, meta: 'Размеры 46–56' }
  ];
  var byId = {}; PRODUCTS.forEach(function (p, i) { p.order = i; byId[p.id] = p; });
  var imgSrc = function (p) { return p.img ? IMG + p.img : PLACEHOLDER; };
  var imgTag = function (p, extra) {
    var cover = p.cover || !p.img;
    return '<img src="' + imgSrc(p) + '" alt="' + esc(p.title) + '" loading="lazy"' + (cover ? ' class="is-cover"' : '') + (extra || '') + '>';
  };

  /* ---------- Тост ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600); }

  /* ---------- Тема ---------- */
  function applyThemeColor() { var m = $('meta[name="theme-color"]'); if (m) m.content = root.dataset.theme === 'dark' ? '#0f0f0d' : '#f2f0eb'; }
  applyThemeColor();
  $('#themeToggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next; applyThemeColor();
    try { localStorage.setItem('bt-theme', next); } catch (e) {}
  });

  /* ---------- Подсветка пункта меню ---------- */
  $$('[data-nav="' + (page === 'catalog' ? 'catalog' : 'home') + '"]').forEach(function (a) { a.classList.add('is-current'); });

  /* ---------- Оверлеи ---------- */
  var backdrop = $('#backdrop'), openEl = null, lastFocus = null;
  function open(el) {
    if (!el) return;
    if (openEl) close(true);
    lastFocus = document.activeElement;
    openEl = el; el.classList.add('is-open'); backdrop.classList.add('is-open'); root.classList.add('lock');
    setTimeout(function () { var f = el.querySelector('input:not([type=checkbox]), button:not(.modal__close):not([data-close]), a[href]'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function close(keepFocus) {
    if (!openEl) return;
    openEl.classList.remove('is-open'); backdrop.classList.remove('is-open'); root.classList.remove('lock');
    openEl = null;
    if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  backdrop.addEventListener('click', function () { close(); });
  $$('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) close(); }); });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-close]'); if (c) { close(); return; }
    var o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open($('#' + o.dataset.open)); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open($('#searchModal')); }
    if (e.key === 'Tab' && openEl) {
      var f = $$('a[href], button:not([disabled]), input, textarea, select', openEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', function () { close(true); }); });

  /* ---------- Вход (демо) ---------- */
  $$('.seg__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.seg__btn').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      $$('.auth[data-pane]').forEach(function (f) { f.hidden = f.dataset.pane !== b.dataset.auth; });
    });
  });
  $$('.auth[data-pane]').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); close(); toast('Личный кабинет появится в рабочей версии сайта'); }); });

  /* ---------- Корзина ---------- */
  var cart = store.get('bt-cart3', {});
  function inCart(id) { return Object.keys(cart).some(function (k) { return k.split('|')[0] === id; }); }
  function needsOptions(p) { return (p.colors && p.colors.length > 1) || (p.sizes && p.sizes.length > 1); }
  function cartQty() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function updateBadge(bump) {
    var b = $('#cartCount'), n = cartQty(); b.textContent = n; b.classList.toggle('is-on', n > 0);
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function saveCart(bump) { store.set('bt-cart3', cart); updateBadge(bump); }
  function setAddedState(id) {
    $$('.add-btn[data-add="' + id + '"]').forEach(function (b) {
      var on = inCart(id); b.classList.toggle('is-added', on);
      b.innerHTML = '<svg class="i"><use href="#i-' + (on ? 'check' : 'cart') + '"/></svg>' + (on ? 'В корзине' : 'В корзину');
    });
  }
  function addToCart(id, color, size, qty) {
    var key = [id, color || '', size || ''].join('|');
    cart[key] = Math.min(99, (cart[key] || 0) + (qty || 1)); saveCart(true); setAddedState(id);
    toast('«' + byId[id].title + '» в корзине');
  }
  function requestAdd(id) {
    var p = byId[id];
    if (needsOptions(p)) { openProduct(p); return; }
    addToCart(id, p.colors ? p.colors[0] : '', p.sizes ? p.sizes[0] : '', 1);
  }
  function renderCart() {
    var box = $('#cartItems'), keys = Object.keys(cart), total = 0;
    if (!keys.length) box.innerHTML = '<div class="empty"><svg class="i"><use href="#i-cart"/></svg>Корзина пуста<br><small>Добавьте товары из <a href="catalog.html" style="text-decoration:underline">каталога</a></small></div>';
    else box.innerHTML = keys.map(function (key) {
      var parts = key.split('|'), p = byId[parts[0]]; if (!p) return '';
      total += p.price * cart[key];
      var vars = [parts[1] ? 'Цвет: ' + parts[1] : '', parts[2] ? 'Размер: ' + parts[2] : ''].filter(Boolean).join(' · '), k = esc(key);
      return '<div class="line-item">' + imgTag(p) + '<div><div class="line-item__title">' + esc(p.title) + '</div>' +
        (vars ? '<div class="line-item__vars">' + esc(vars) + '</div>' : '') + '<div class="line-item__price">' + fmt(p.price) + '</div>' +
        '<button class="remove" data-rm="' + k + '">Удалить</button></div>' +
        '<div class="qty"><button data-dec="' + k + '" aria-label="Меньше"><svg class="i"><use href="#i-minus"/></svg></button><span>' + cart[key] + '</span><button data-inc="' + k + '" aria-label="Больше"><svg class="i"><use href="#i-plus"/></svg></button></div></div>';
    }).join('');
    $('#cartTotal').textContent = fmt(total);
    $('#checkout').disabled = !keys.length; $('#checkout').style.opacity = keys.length ? 1 : .5;
  }
  $('#cartOpen').addEventListener('click', function () { renderCart(); open($('#cartDrawer')); });

  /* ---------- Карточка товара (окно) ---------- */
  var opt = { p: null, color: '', size: '', qty: 1 };
  function chips(name, list, cur, isColor) {
    return list.map(function (v) {
      return '<button type="button" class="chip' + (v === cur ? ' is-on' : '') + '" data-opt="' + name + '" data-val="' + esc(v) + '" aria-pressed="' + (v === cur) + '">' +
        (isColor ? '<span class="swatch" style="background:' + (COLORS[v] || '#777') + '"></span>' : '') + esc(v) + '</button>';
    }).join('');
  }
  function renderProduct() {
    var p = opt.p;
    var foot = p.price
      ? '<div class="qty qty--lg"><button type="button" data-oq="-1" aria-label="Меньше"><svg class="i"><use href="#i-minus"/></svg></button><span>' + opt.qty + '</span><button type="button" data-oq="1" aria-label="Больше"><svg class="i"><use href="#i-plus"/></svg></button></div>' +
        '<button type="button" class="btn btn--primary" id="optAdd">В корзину · ' + fmt(p.price * opt.qty) + '</button>'
      : '<a class="btn btn--primary" target="_blank" rel="noopener" href="' + waLink('Здравствуйте! Интересует: ' + p.title + (opt.color ? ', цвет ' + opt.color : '') + (opt.size ? ', размер ' + opt.size : '') + '. Подскажите цену.') + '">Узнать цену в WhatsApp</a>';
    $('#optBody').innerHTML = '<div class="pv"><div class="pv__media">' + imgTag(p) + '</div><div class="pv__body">' +
      '<h3 class="h4">' + esc(p.title) + '</h3><div class="pv__price">' + (p.price ? fmt(p.price) : 'Цена по запросу') + '</div>' +
      (p.desc ? '<p class="pv__desc">' + esc(p.desc) + '</p>' : '') +
      (p.specs ? '<ul class="pv__specs">' + p.specs.map(function (s) { return '<li><span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b></li>'; }).join('') + '</ul>' : '') +
      (p.colors && p.colors.length ? '<div class="pv__group"><div class="pv__label">Цвет: <b>' + esc(opt.color || 'не выбран') + '</b></div><div class="chips">' + chips('color', p.colors, opt.color, true) + '</div></div>' : '') +
      (p.sizes && p.sizes.length ? '<div class="pv__group"><div class="pv__label">Размер: <b>' + esc(opt.size || 'не выбран') + '</b></div><div class="chips">' + chips('size', p.sizes, opt.size, false) + '</div></div>' : '') +
      '<div class="pv__foot">' + foot + '</div></div></div>';
  }
  function openProduct(p) {
    opt = { p: p, color: p.colors && p.colors.length === 1 ? p.colors[0] : '', size: p.sizes && p.sizes.length === 1 ? p.sizes[0] : '', qty: 1 };
    renderProduct(); open($('#optModal'));
  }
  $('#optModal').addEventListener('click', function (e) {
    var c = e.target.closest('[data-opt]'), q = e.target.closest('[data-oq]');
    if (c) { opt[c.dataset.opt] = c.dataset.val; renderProduct(); return; }
    if (q) { opt.qty = Math.max(1, Math.min(99, opt.qty + (+q.dataset.oq))); renderProduct(); return; }
    if (e.target.closest('#optAdd')) {
      var p = opt.p;
      if (p.colors && p.colors.length && !opt.color) { toast('Выберите цвет'); return; }
      if (p.sizes && p.sizes.length && !opt.size) { toast('Выберите размер'); return; }
      addToCart(p.id, opt.color, opt.size, opt.qty); close();
    }
  });

  /* ---------- Сетка товаров ---------- */
  function card(p, i) {
    var sw = (p.colors || []).map(function (c) { return '<span class="swatch" title="' + c + '" style="background:' + (COLORS[c] || '#777') + '"></span>'; }).join('');
    var on = inCart(p.id);
    var btn = p.price
      ? '<button class="add-btn' + (on ? ' is-added' : '') + '" data-add="' + p.id + '"><svg class="i"><use href="#i-' + (on ? 'check' : 'cart') + '"/></svg>' + (on ? 'В корзине' : 'В корзину') + '</button>'
      : '<button class="add-btn add-btn--ask" data-view="' + p.id + '">Узнать цену</button>';
    return '<article class="product" style="animation-delay:' + (i * 40) + 'ms">' +
      '<div class="product__media" data-view="' + p.id + '" role="button" tabindex="0" aria-label="Подробнее: ' + esc(p.title) + '">' +
      (p.tag ? '<span class="product__tag">' + esc(p.tag) + '</span>' : '') + imgTag(p) + '</div>' +
      '<div class="product__body"><h3 class="product__title" data-view="' + p.id + '">' + esc(p.title) + '</h3>' +
      (p.meta ? '<p class="product__meta">' + esc(p.meta) + '</p>' : '') +
      (p.price ? '<span class="price">' + fmt(p.price) + '</span>' : '<span class="price price--ask">Цена по запросу</span>') +
      '<div class="swatches">' + sw + '</div>' + btn + '</div></article>';
  }
  var grid = $('#productGrid'), state = { cat: 'all', sort: 'pop' };
  function list() {
    if (grid.dataset.ids) return grid.dataset.ids.split(',').map(function (id) { return byId[id]; }).filter(Boolean);
    var l = PRODUCTS.filter(function (p) { return state.cat === 'all' || p.cat === state.cat; });
    if (state.sort !== 'pop') l = l.slice().sort(function (a, b) {
      var pa = a.price || Infinity, pb = b.price || Infinity;
      return (state.sort === 'asc' ? pa - pb : (b.price || -1) - (a.price || -1)) || 0;
    });
    return l;
  }
  function renderGrid() { if (grid) grid.innerHTML = list().map(card).join(''); }

  if (page === 'catalog') {
    var setCat = function (cat, push) {
      if (!$('[data-cat="' + cat + '"]')) cat = 'all';
      state.cat = cat;
      $$('#catChips .chip').forEach(function (c) { var on = c.dataset.cat === cat; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', on); });
      if (push) history.replaceState(null, '', cat === 'all' ? 'catalog.html' : '#' + cat);
      renderGrid();
    };
    $$('#catChips .chip').forEach(function (c) {
      var n = c.dataset.cat === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cat === c.dataset.cat; }).length;
      $('.chip__n', c).textContent = n;
      c.addEventListener('click', function () { setCat(c.dataset.cat, true); });
    });
    $('#sortSel').addEventListener('change', function () { state.sort = this.value; renderGrid(); });
    window.addEventListener('hashchange', function () { setCat(location.hash.slice(1) || 'all'); });
    setCat(location.hash.slice(1) || 'all');
  } else renderGrid();

  /* ---------- Делегирование кликов ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-view],[data-inc],[data-dec],[data-rm]'); if (!t) return;
    var d = t.dataset;
    if (d.add) requestAdd(d.add);
    else if (d.view) openProduct(byId[d.view]);
    else if (d.inc) { cart[d.inc] = Math.min(99, cart[d.inc] + 1); saveCart(); renderCart(); }
    else if (d.dec || d.rm) {
      var k = d.dec || d.rm, id = k.split('|')[0];
      if (d.rm || --cart[k] <= 0) delete cart[k];
      saveCart(); renderCart(); setAddedState(id);
    }
  });
  document.addEventListener('keydown', function (e) {
    var v = e.target.closest && e.target.closest('.product__media[data-view]');
    if (v && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProduct(byId[v.dataset.view]); }
  });

  /* ---------- Оформление заказа ---------- */
  function cartLines() {
    var total = 0, lines = Object.keys(cart).map(function (key) {
      var parts = key.split('|'), p = byId[parts[0]]; if (!p) return null;
      total += p.price * cart[key];
      var vars = [parts[1], parts[2] ? 'р. ' + parts[2] : ''].filter(Boolean).join(', ');
      return { text: p.title + (vars ? ' (' + vars + ')' : '') + ' × ' + cart[key], sum: p.price * cart[key] };
    }).filter(Boolean);
    return { lines: lines, total: total };
  }
  $('#checkout').addEventListener('click', function () {
    var c = cartLines(); if (!c.lines.length) return;
    $('#orderSum').innerHTML = c.lines.map(function (l) { return '<div><span>' + esc(l.text) + '</span><span>' + fmt(l.sum) + '</span></div>'; }).join('') +
      '<div class="order-sum__total"><span>Итого</span><b>' + fmt(c.total) + '</b></div>';
    open($('#orderModal'));
  });
  function validate(form) {
    var ok = true;
    $$('input[required]', form).forEach(function (i) {
      var bad = i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'tel' && i.value.replace(/\D/g, '').length < 10);
      i.classList.toggle('is-error', bad); if (bad) ok = false;
    });
    if (!ok) toast('Проверьте обязательные поля');
    return ok;
  }
  var via = 'wa';
  $$('#orderForm [data-via]').forEach(function (b) { b.addEventListener('click', function () { via = b.dataset.via; }); });
  $('#orderForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var f = this.elements, c = cartLines();
    var text = 'Заказ с сайта БалТактика\n\n' + c.lines.map(function (l, i) { return (i + 1) + '. ' + l.text + ' — ' + fmt(l.sum); }).join('\n') +
      '\n\nИтого: ' + fmt(c.total) + '\n\nИмя: ' + f.name.value.trim() + '\nТелефон: ' + f.phone.value.trim() +
      (f.addr.value.trim() ? '\nДоставка: ' + f.addr.value.trim() : '') + (f.msg.value.trim() ? '\nКомментарий: ' + f.msg.value.trim() : '');
    var url = via === 'mail' ? 'mailto:micasawar@mail.ru?subject=' + encodeURIComponent('Заказ с сайта') + '&body=' + encodeURIComponent(text) : waLink(text);
    window.open(url, '_blank', 'noopener');
    cart = {}; saveCart(); renderGrid(); close(); this.reset();
    toast('Заказ сформирован — отправьте сообщение менеджеру');
  });

  /* ---------- Обратная связь ---------- */
  var fb = $('#feedback');
  if (fb) fb.addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(this)) return;
    var f = this.elements;
    var text = 'Заявка с сайта БалТактика\nИмя: ' + f.name.value.trim() + '\nТелефон: ' + f.phone.value.trim() +
      (f.email.value.trim() ? '\nE-mail: ' + f.email.value.trim() : '') + (f.msg.value.trim() ? '\n\n' + f.msg.value.trim() : '');
    window.open(waLink(text), '_blank', 'noopener');
    this.reset(); toast('Сообщение подготовлено в WhatsApp');
  });

  /* ---------- Поиск ---------- */
  var sInput = $('#searchInput'), sRes = $('#searchResults');
  sInput.addEventListener('input', function () {
    var q = sInput.value.trim().toLowerCase();
    if (!q) { sRes.innerHTML = ''; return; }
    var hits = PRODUCTS.filter(function (p) { return (p.title + ' ' + (p.meta || '') + ' ' + (p.desc || '')).toLowerCase().indexOf(q) > -1; });
    sRes.innerHTML = hits.length ? hits.map(function (p) {
      return '<button class="sr" data-view="' + p.id + '">' + imgTag(p) + '<div><div class="sr__t">' + esc(p.title) + '</div><div class="sr__m">' + esc(p.meta || '') + '</div></div><span class="sr__p">' + (p.price ? fmt(p.price) : 'по запросу') + '</span></button>';
    }).join('') : '<div class="sr-empty">Ничего не найдено. Попробуйте «стельки» или «жилет».</div>';
  });

  /* ---------- Отзывы (реальные, с Авито) ---------- */
  var REVIEWS = [
    { n: 'Елена', d: '29 июня', p: 'Стельки кевларовые, антипрокольные', t: 'Купили два вида кевларовых стелек, очень качественные! Стельки лёгкие, прочные, сделаны очень аккуратно. Большое спасибо продавцу за вежливость и пунктуальность! Рекомендую!' },
    { n: 'Егор', d: '14 сентября 2024', p: 'Костюм тактический с защитой', t: 'Рад, что купил, размеров много, подобрали быстро, качеством костюма доволен. Рекомендую. Спасибо!' },
    { n: 'Виталий', d: '4 июля', p: 'Пуленепробиваемые ткани СВМПЭ, арамид', t: 'Получил посылочку. Заказывал несколько метров СВМПЭ. Всё пришло, как договаривались. Продавцу большая благодарность!' },
    { n: 'Василий', d: '17 мая 2024', p: 'Стельки тактические', t: 'Прекрасные, очень необходимые стельки, благодарю за быстрое реагирование и доставку.' },
    { n: 'Алексей', d: '4 июля', p: 'Пуленепробиваемые ткани СВМПЭ, арамид', t: 'Очень отзывчивый и надёжный партнёр, с хорошими предложениями. Спасибо за доведённое дело.' },
    { n: 'Просто Саша', d: '12 сентября 2024', p: 'Стельки антипрокольные', t: 'Товар соответствует описанию, рекомендую.' }
  ];
  var revEl = $('#review');
  if (revEl) {
    var ri = 0, star = '<svg class="i"><use href="#i-star"/></svg>';
    var showRev = function (n) {
      ri = (n + REVIEWS.length) % REVIEWS.length; var r = REVIEWS[ri];
      revEl.innerHTML = '<div class="review__top"><span class="avatar" aria-hidden="true">' + esc(r.n.charAt(0)) + '</span><div><div class="review__name">' + esc(r.n) + '</div><div class="review__date">' + esc(r.d) + ' · Авито</div></div></div>' +
        '<div class="stars" aria-label="Оценка 5 из 5">' + star + star + star + star + star + '</div>' +
        '<p class="review__text">' + esc(r.t) + '</p><div class="review__product">' + esc(r.p) + '</div>';
      revEl.classList.remove('is-swap'); void revEl.offsetWidth; revEl.classList.add('is-swap');
    };
    $('#revPrev').addEventListener('click', function () { showRev(ri - 1); });
    $('#revNext').addEventListener('click', function () { showRev(ri + 1); });
    showRev(0);
  }

  /* ---------- Появление при скролле ---------- */
  var rv = $$('.section__head, .split__about, .split__reviews, .coop-grid, .docs, .contacts > *, .tech__content, .catalog-note');
  if ('IntersectionObserver' in window) {
    rv.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { threshold: .1 });
    rv.forEach(function (el) { io.observe(el); });
  }

  $$('.js-year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  updateBadge(false);
})();
