/* BALTACTICS — интерактив главной страницы (демо, без бэкенда) */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = 'https://baltactics.ru/lib/image/product/';
  var PLACEHOLDER = 'assets/img/placeholder.svg';

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Каталог (данные с baltactics.ru) ---------- */
  var COLORS = { 'Чёрный': '#1b1b18', 'Олива': '#5d5f3a', 'Песочный': '#c8b48a', 'Милитари': '#6b6b45' };
  var C3 = ['Чёрный', 'Олива', 'Песочный'];
  var S3 = '46–50, 50–54, 54–56';
  var PRODUCTS = [
    { id: 'zaschitnik', cat: 'vests', title: 'Бронежилет «Защитник»', price: 19000, img: IMG + 'bulletproof_vest_zaschitnik_1_0.webp', colors: C3, meta: 'Размеры: ' + S3, tag: 'Хит' },
    { id: 'cc-vest', cat: 'concealed', title: 'Жилет скрытого ношения', price: 23500, img: IMG + 'concealed_carry_vest_2_0.webp', colors: C3, meta: 'Полиэстер · ' + S3 },
    { id: 'cc-shirt', cat: 'concealed', title: 'Майка скрытого ношения', price: 11500, img: IMG + 'concealed_carry_vest_1_0.webp', colors: C3, meta: 'Полиэстер, вискоза, нейлон, спандекс' },
    { id: 'nevidimka', cat: 'concealed', title: 'Жилет скрытого ношения «Невидимка»', price: 12000, img: IMG + 'concealed_carry_vest_nevidimka_1_0.webp', colors: C3, meta: 'Размеры: ' + S3 },
    { id: 'plate', cat: 'vests', title: 'Бронепанель', price: 14000, img: 'assets/img/cat-plates.jpg', cover: true, colors: C3, meta: 'Размеры: ' + S3 },
    { id: 'ins-c2', cat: 'insoles', title: 'Кевларовые стельки, класс C2', price: 2500, img: IMG + 'kevlar_insoles_3.webp', meta: 'Противоосколочные · спецполимер', tag: 'C2' },
    { id: 'ins-anti', cat: 'insoles', title: 'Кевларовые стельки антипрокольные', price: 3000, img: IMG + 'kevlar_insoles_6.webp', meta: 'Противоосколочные · спецполимер' },
    { id: 'ins-34', cat: 'insoles', title: 'Кевларовые стельки 3,4 мм', price: 1900, img: IMG + 'kevlar_insoles_5.webp', colors: ['Милитари'], meta: 'Толщина 3,4 мм · размеры 40–46' },
    { id: 'bogatyr', cat: 'concealed', title: 'Жилет скрытого ношения «Русский Богатырь»', price: 0, img: IMG + 'concealed_carry_vest_russky_bogatyr_1_0.webp', colors: C3, meta: 'Размеры: ' + S3, tag: 'Новинка' },
    { id: 'vest-line', cat: 'vests', title: 'Линейка жилетов', price: 0, img: IMG + 'vest_1_0.webp', colors: C3, meta: 'Размеры: ' + S3 },
    { id: 'jacket', cat: 'other', title: 'Куртка «Броне»', price: 0, img: 'assets/img/cat-pouches.jpg', cover: true, meta: 'Размеры: ' + S3 },
    { id: 'blanket', cat: 'other', title: 'Противоосколочное одеяло', price: 0, img: 'assets/img/cat-vest.jpg', cover: true, colors: ['Чёрный'], meta: 'Односпальное, полуторное, двуспальное' }
  ];
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  var fmt = function (n) { return n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var imgTag = function (p, cls) {
    return '<img src="' + p.img + '" alt="' + esc(p.title) + '" loading="lazy"' + (cls ? ' class="' + cls + '"' : '') +
      ' onerror="this.onerror=null;this.src=\'' + PLACEHOLDER + '\';this.classList.add(\'is-cover\')">';
  };

  /* ---------- Тост ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }
  $$('[data-toast]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); toast(el.dataset.toast); }); });

  /* ---------- Тема ---------- */
  var root = document.documentElement;
  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('bt-theme', next); } catch (e) {}
    var m = $('meta[name="theme-color"]'); if (m) m.content = next === 'dark' ? '#0e0e0c' : '#f4f3ee';
    var b = $('#themeToggle'); b.innerHTML = b.innerHTML;
  });

  /* ---------- Оверлеи (модалки, шторки) ---------- */
  var backdrop = $('#backdrop'), openEl = null;
  function open(el) {
    if (openEl) close();
    openEl = el; el.classList.add('is-open'); backdrop.classList.add('is-open'); root.classList.add('lock');
    var f = el.querySelector('input'); if (f && el.id === 'searchModal') setTimeout(function () { f.focus(); }, 80);
  }
  function close() {
    if (!openEl) return;
    openEl.classList.remove('is-open'); backdrop.classList.remove('is-open'); root.classList.remove('lock');
    if (openEl.id === 'videoModal') $('#videoImg').removeAttribute('src');
    openEl = null;
  }
  backdrop.addEventListener('click', close);
  $$('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) close(); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); closeMega(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open($('#searchModal')); }
  });
  $$('[data-modal]').forEach(function (b) { b.addEventListener('click', function () { open($('#' + b.dataset.modal)); }); });

  $('#accountOpen').addEventListener('click', function () { open($('#accountModal')); });
  $('#cartOpen').addEventListener('click', function () { renderCart(); open($('#cartDrawer')); });
  $('#burger').addEventListener('click', function () { open($('#mobileMenu')); });
  $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', close); });
  $('#searchOpen').addEventListener('click', function () { open($('#searchModal')); });
  $('#searchOpenSm').addEventListener('click', function () { open($('#searchModal')); });
  $('#playBtn').addEventListener('click', function () {
    var img = $('#videoImg'); img.src = img.dataset.src;
    img.onerror = function () { img.onerror = null; img.src = 'assets/img/about.jpg'; };
    open($('#videoModal'));
  });

  /* ---------- Мега-меню ---------- */
  var mega = $('#mega'), megaBtn = $('#catalogBtn'), megaT;
  function openMega() { clearTimeout(megaT); mega.classList.add('is-open'); megaBtn.setAttribute('aria-expanded', 'true'); }
  function closeMega() { mega.classList.remove('is-open'); megaBtn.setAttribute('aria-expanded', 'false'); }
  megaBtn.addEventListener('click', function () { mega.classList.contains('is-open') ? closeMega() : openMega(); });
  var megaWrap = megaBtn.parentElement;
  megaWrap.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) openMega(); });
  megaWrap.addEventListener('mouseleave', function () { megaT = setTimeout(closeMega, 180); });
  $$('#mega a').forEach(function (a) { a.addEventListener('click', closeMega); });
  document.addEventListener('click', function (e) { if (!megaWrap.contains(e.target)) closeMega(); });

  /* ---------- Авторизация (демо) ---------- */
  $$('.seg__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.seg__btn').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      $$('.auth').forEach(function (f) { f.hidden = f.dataset.pane !== b.dataset.auth; });
    });
  });
  $$('.auth').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); close();
      toast('Личный кабинет появится в рабочей версии сайта');
    });
  });

  /* ---------- Hero-слайдер ---------- */
  var slides = $$('.slide'), bgImg = $('.hero__bg-img'), cur = 0, timer;
  var prog = $('#slideProgress');
  $('#slideTotal').textContent = String(slides.length).padStart(2, '0');
  slides.forEach(function (s) { var i = new Image(); i.src = s.dataset.bg; });
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === cur); });
    bgImg.classList.add('is-fading');
    setTimeout(function () {
      setBg(slides[cur]);
      bgImg.classList.remove('is-fading');
    }, 350);
    $('#slideNow').textContent = String(cur + 1).padStart(2, '0');
    prog.classList.remove('run'); void prog.offsetWidth; prog.classList.add('run');
    clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6500);
  }
  function setBg(sl) { bgImg.style.backgroundImage = 'url("' + sl.dataset.bg + '")'; bgImg.style.backgroundPosition = sl.dataset.pos || 'center'; }
  setBg(slides[0]);
  $('#slideNext').addEventListener('click', function () { go(cur + 1); });
  $('#slidePrev').addEventListener('click', function () { go(cur - 1); });
  var tx = null, hero = $('#hero');
  hero.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); tx = null;
  });
  go(0);

  /* ---------- Товары + вкладки ---------- */
  var grid = $('#productGrid'), activeTab = 'all', expanded = false;
  var cart = store.get('bt-cart', {});

  function card(p, i) {
    var sw = (p.colors || []).map(function (c) { return '<span class="swatch" title="' + c + '" style="background:' + (COLORS[c] || '#777') + '"></span>'; }).join('');
    var priceHtml = p.price ? '<span class="price">' + fmt(p.price) + '</span>' : '<span class="price price--ask">Цена по запросу</span>';
    var btn = p.price
      ? '<button class="add-btn' + (cart[p.id] ? ' is-added' : '') + '" data-add="' + p.id + '"><svg class="i"><use href="#i-' + (cart[p.id] ? 'cart' : 'plus') + '"/></svg>' + (cart[p.id] ? 'В корзине' : 'В корзину') + '</button>'
      : '<a class="add-btn" href="https://wa.me/79951138708?text=' + encodeURIComponent('Здравствуйте! Интересует: ' + p.title) + '" target="_blank" rel="noopener">Узнать цену</a>';
    return '<article class="product" style="animation-delay:' + (i * 40) + 'ms">' +
      '<div class="product__media">' + (p.tag ? '<span class="product__tag">' + p.tag + '</span>' : '') +
      imgTag(p, p.cover ? 'is-cover' : '') + '</div>' +
      '<div class="product__body"><h3 class="product__title">' + esc(p.title) + '</h3>' +
      '<p class="product__meta">' + esc(p.meta || '') + '</p>' + (sw ? '<div class="swatches">' + sw + '</div>' : '') +
      '<div class="product__foot">' + priceHtml + btn + '</div></div></article>';
  }
  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return activeTab === 'all' || p.cat === activeTab; });
    var limit = (activeTab === 'all' && !expanded) ? 8 : list.length;
    grid.innerHTML = list.slice(0, limit).map(card).join('');
    $('#showMore').hidden = !(activeTab === 'all' && !expanded && list.length > 8);
  }
  function setTab(t) {
    activeTab = t;
    $$('.tab').forEach(function (b) { var on = b.dataset.tab === t; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    renderGrid();
  }
  $$('.tab').forEach(function (b) { b.addEventListener('click', function () { setTab(b.dataset.tab); }); });
  $$('[data-tab-jump]').forEach(function (a) {
    a.addEventListener('click', function () { setTab(a.dataset.tabJump); });
    if (a.getAttribute('href') === '#catalog') a.setAttribute('href', '#products');
  });
  $('#showMore').addEventListener('click', function () { expanded = true; renderGrid(); });

  /* ---------- Корзина ---------- */
  function cartQty() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function updateCartBadge(bump) {
    var b = $('#cartCount'), n = cartQty(); b.textContent = n; b.classList.toggle('is-on', n > 0);
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function saveCart() { store.set('bt-cart', cart); updateCartBadge(true); }
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1; saveCart(); toast('«' + byId[id].title + '» в корзине');
    $$('.add-btn[data-add="' + id + '"]').forEach(function (b) { b.classList.add('is-added'); b.innerHTML = '<svg class="i"><use href="#i-cart"/></svg>В корзине'; });
  }
  function renderCart() {
    var box = $('#cartItems'), ids = Object.keys(cart), total = 0;
    if (!ids.length) {
      box.innerHTML = '<div class="empty"><svg class="i"><use href="#i-cart"/></svg>Корзина пуста<br><small>Добавьте товары из каталога</small></div>';
    } else {
      box.innerHTML = ids.map(function (id) {
        var p = byId[id]; if (!p) return ''; total += p.price * cart[id];
        return '<div class="line-item">' + imgTag(p) + '<div><div class="line-item__title">' + esc(p.title) + '</div><div class="line-item__price">' + fmt(p.price) + '</div>' +
          '<button class="remove" data-rm="' + id + '">Удалить</button></div>' +
          '<div class="qty"><button data-dec="' + id + '" aria-label="Меньше"><svg class="i"><use href="#i-minus"/></svg></button><span>' + cart[id] + '</span><button data-inc="' + id + '" aria-label="Больше"><svg class="i"><use href="#i-plus"/></svg></button></div></div>';
      }).join('');
    }
    $('#cartTotal').textContent = fmt(total);
    $('#checkout').disabled = !ids.length; $('#checkout').style.opacity = ids.length ? 1 : .5;
  }
  $('#checkout').addEventListener('click', function () { close(); toast('Оформление заказа будет подключено в рабочей версии'); });

  /* Делегирование кликов */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm]'); if (!t) return;
    var d = t.dataset;
    if (d.add) { addToCart(d.add); if (openEl && openEl.id === 'cartDrawer') renderCart(); }
    else if (d.inc) { cart[d.inc]++; saveCart(); renderCart(); }
    else if (d.dec) { if (--cart[d.dec] <= 0) delete cart[d.dec]; saveCart(); renderCart(); renderGrid(); }
    else if (d.rm) { delete cart[d.rm]; saveCart(); renderCart(); renderGrid(); }
  });

  /* ---------- Поиск ---------- */
  var sInput = $('#searchInput'), sRes = $('#searchResults');
  sInput.addEventListener('input', function () {
    var q = sInput.value.trim().toLowerCase();
    if (!q) { sRes.innerHTML = ''; return; }
    var hits = PRODUCTS.filter(function (p) { return (p.title + ' ' + (p.meta || '')).toLowerCase().indexOf(q) > -1; });
    sRes.innerHTML = hits.length ? hits.map(function (p) {
      return '<a href="#products" class="sr" data-sr="' + p.cat + '">' + imgTag(p) + '<div><div class="sr__t">' + esc(p.title) + '</div><div class="sr__m">' + esc(p.meta || '') + '</div></div><span class="sr__p">' + (p.price ? fmt(p.price) : 'по запросу') + '</span></a>';
    }).join('') : '<div class="sr-empty">Ничего не найдено. Попробуйте «стельки» или «жилет».</div>';
  });
  sRes.addEventListener('click', function (e) { var a = e.target.closest('[data-sr]'); if (!a) return; setTab(a.dataset.sr); close(); });

  /* ---------- Форма обратной связи ---------- */
  $('#feedback').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('input[required]', this).forEach(function (i) {
      var bad = i.type === 'checkbox' ? !i.checked : !i.value.trim();
      i.classList.toggle('is-error', bad); if (bad) ok = false;
    });
    if (!ok) { toast('Заполните обязательные поля'); return; }
    this.reset(); toast('Спасибо! Мы свяжемся с вами в ближайшее время');
  });

  /* ---------- Появление при скролле ---------- */
  var revealEls = $$('.section__head, .cats, .tech, .about__content, .reviews, .coop, .contacts > *, .features__grid');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- Init ---------- */
  $('#year').textContent = new Date().getFullYear();
  renderGrid(); updateCartBadge(false);
})();
