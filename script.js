/* =====================================================
   CONFIGURAÇÃO: WhatsApp da Julia (55 + DDD + número)
   Exemplo: '5521999999999'
   ===================================================== */
const WHATSAPP = '55XXXXXXXXXXX';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ===== Loader =====
window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 1500));

// ===== WhatsApp =====
if ($('#waBtn')) $('#waBtn').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá, Julia! Vim pelo seu site e gostaria de conversar.')}`;

// ===== Menu =====
const burger = $('#burger'), menu = $('#menu');
const toggleMenu = (open) => {
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  menu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// ===== Progresso de leitura + linha do tempo =====
const progress = $('#progress'), timeline = $('#timeline');
const onScroll = () => {
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  if (!timeline) return;
  const r = timeline.getBoundingClientRect();
  timeline.style.setProperty('--p', clamp((innerHeight * .7 - r.top) / r.height, 0, 1));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Reveal ao rolar =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('in'), (i % 4) * 90);
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// ===== Contadores (aceita prefixo e sufixo) =====
const counters = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    let n = 0;
    const step = () => {
      n += Math.max(.1, end / 60);
      if (n >= end) { el.textContent = pre + end + suf; return; }
      el.textContent = pre + Math.floor(n) + suf;
      requestAnimationFrame(step);
    };
    step();
    counters.unobserve(el);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => counters.observe(el));

// ===== Destaque do menu (desktop) =====
(() => {
  const links = [...$$('#navLinks a')].filter(a => a.getAttribute('href').startsWith('#'));
  const map = new Map([...links].map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('on'));
      const a = map.get(e.target.id);
      if (a) a.classList.add('on');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();

// ===== Brilho que acompanha o cursor nos cards =====
$$('.spot').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// ===== Cursor em anel (só com mouse) =====
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ringEl = document.createElement('div');
  ringEl.className = 'cursor';
  document.body.appendChild(ringEl);
  let mx = -100, my = -100, px = -100, py = -100;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    ringEl.classList.toggle('hover', !!e.target.closest('a,button,summary,.tooth,.card,.project,.g-item'));
  });
  (function follow() {
    px += (mx - px) * .18; py += (my - py) * .18;
    ringEl.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
}

// ===== Retrato: inclina com mouse / giroscópio =====
(() => {
  const p = $('#portrait');
  if (!p) return;
  const set = (x, y) => { p.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); p.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg'); };
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5));
  }
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    set(clamp(e.gamma / 40, -1, 1) * .5, clamp(((e.beta || 45) - 45) / 40, -1, 1) * .5);
  });
  addEventListener('pointerdown', () => {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }, { once: true });
})();

// ===== Atlas dental interativo (numeração FDI) =====
(() => {
  const svg = $('#archSvg');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';

  // Dados de referência (tipo de dente → informações)
  const INFO = {
    1: { n: 'Incisivo central', f: 'Cortar os alimentos', r: '1 raiz', e: { up: '7–8 anos', lo: '6–7 anos' } },
    2: { n: 'Incisivo lateral', f: 'Cortar os alimentos', r: '1 raiz', e: { up: '8–9 anos', lo: '7–8 anos' } },
    3: { n: 'Canino', f: 'Rasgar os alimentos', r: '1 raiz', e: { up: '11–12 anos', lo: '9–10 anos' } },
    4: { n: 'Primeiro pré-molar', f: 'Amassar e triturar', r: { up: 'geralmente 2 raízes', lo: 'geralmente 1 raiz' }, e: { up: '10–11 anos', lo: '10–12 anos' } },
    5: { n: 'Segundo pré-molar', f: 'Amassar e triturar', r: 'geralmente 1 raiz', e: { up: '10–12 anos', lo: '11–12 anos' } },
    6: { n: 'Primeiro molar', f: 'Triturar e moer', r: { up: 'geralmente 3 raízes', lo: 'geralmente 2 raízes' }, e: { up: '6–7 anos', lo: '6–7 anos' } },
    7: { n: 'Segundo molar', f: 'Triturar e moer', r: { up: 'geralmente 3 raízes', lo: 'geralmente 2 raízes' }, e: { up: '12–13 anos', lo: '11–13 anos' } },
    8: { n: 'Terceiro molar (siso)', f: 'Triturar e moer', r: 'varia bastante', e: { up: '17–21 anos', lo: '17–21 anos' } }
  };
  const WN = { 1: 26, 2: 24, 3: 24, 4: 30, 5: 30, 6: 42, 7: 40, 8: 36 };
  const SHAPES = {
    1: 'M-11,-15 Q0,-19 11,-15 Q13,0 9,14 Q0,18 -9,14 Q-13,0 -11,-15Z',
    2: 'M-10,-14 Q0,-18 10,-14 Q12,0 8,13 Q0,17 -8,13 Q-12,0 -10,-14Z',
    3: 'M0,-19 C9,-10 12,4 9,14 Q0,19 -9,14 C-12,4 -9,-10 0,-19Z',
    4: 'M-14,-10 Q0,-17 14,-10 Q16,0 12,11 Q0,17 -12,11 Q-16,0 -14,-10Z',
    5: 'M-14,-10 Q0,-17 14,-10 Q16,0 12,11 Q0,17 -12,11 Q-16,0 -14,-10Z',
    6: 'M-20,-14 Q0,-21 20,-14 Q23,0 19,15 Q0,22 -19,15 Q-23,0 -20,-14Z',
    7: 'M-19,-13 Q0,-20 19,-13 Q22,0 18,14 Q0,21 -18,14 Q-22,0 -19,-13Z',
    8: 'M-17,-12 Q0,-19 17,-12 Q20,0 16,13 Q0,19 -16,13 Q-20,0 -17,-12Z'
  };
  const UP = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const LO = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Geometria das arcadas (elipses) e comprimento do arco
  const CX = 320, RX = 270, RY = 168, CYU = 215, CYL = 255;
  const STEPS = 800, arc = [];
  let len = 0, lx = -RX, ly = 0;
  for (let k = 0; k <= STEPS; k++) {
    const u = Math.PI * k / STEPS, x = -RX * Math.cos(u), y = RY * Math.sin(u);
    if (k) len += Math.hypot(x - lx, y - ly);
    arc.push(len); lx = x; ly = y;
  }
  const uAt = (s) => {
    let k = 1;
    while (k < arc.length && arc[k] < s) k++;
    const a = arc[k - 1], b = arc[k] ?? a;
    return Math.PI * ((k - 1) + (b > a ? (s - a) / (b - a) : 0)) / STEPS;
  };

  const el = (name, attrs = {}) => {
    const n = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };

  // Elementos de apoio (linha do meio e legendas)
  svg.appendChild(el('line', { class: 'mid', x1: CX, y1: 24, x2: CX, y2: 446 }));
  const cap = (txt, y) => { const t = el('text', { class: 'cap', x: CX, y }); t.textContent = txt; svg.appendChild(t); };
  cap('SUPERIOR', 150); cap('INFERIOR', 322);
  const sideTxt = (txt, x, anchor) => { const t = el('text', { class: 'side', x, y: 466, 'text-anchor': anchor }); t.textContent = txt; svg.appendChild(t); };
  sideTxt('← direita do paciente', 4, 'start'); sideTxt('esquerda do paciente →', 636, 'end');

  const nodes = {};
  const build = (list, upper, cy) => {
    const w = list.map(f => WN[f % 10]), total = w.reduce((a, b) => a + b, 0);
    const k = len / total, sc = k / 1.08;
    let acc = 0;
    list.forEach((f, i) => {
      const s = (acc + w[i] / 2) * k; acc += w[i];
      const u = uAt(s);
      const x = CX - RX * Math.cos(u), y = upper ? cy - RY * Math.sin(u) : cy + RY * Math.sin(u);
      const nx = -Math.cos(u) / RX, ny = (upper ? -1 : 1) * Math.sin(u) / RY;
      const rot = Math.atan2(ny, nx) * 180 / Math.PI + 90;
      const type = f % 10;
      const g = el('g', { class: 'tooth', tabindex: 0, role: 'button', 'aria-label': `Dente ${f}`, 'data-fdi': f, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})` });
      g.appendChild(el('path', { class: 'shape', d: SHAPES[type], transform: `scale(${sc.toFixed(3)})` }));
      if (type >= 4) g.appendChild(el('path', { class: 'fis', d: 'M0,-9 L0,9 M-8,0 L8,0', transform: `scale(${sc.toFixed(3)})` }));
      const t = el('text', { transform: `rotate(${(-rot).toFixed(1)})` });
      t.textContent = f; g.appendChild(t);
      svg.appendChild(g);
      nodes[f] = g;
    });
  };
  build(UP, true, CYU);
  build(LO, false, CYL);

  const card = $('#atlasCard');
  const pick = (v, upper) => (v && typeof v === 'object') ? (upper ? v.up : v.lo) : v;
  const select = (f) => {
    Object.values(nodes).forEach(n => n.classList.remove('sel'));
    nodes[f].classList.add('sel');
    const q = Math.floor(f / 10), type = f % 10, upper = q <= 2, d = INFO[type];
    const arch = upper ? 'superior' : 'inferior', side = (q === 1 || q === 4) ? 'direito' : 'esquerdo';
    $('#aFdi').textContent = f;
    $('#aName').textContent = `${d.n} ${arch} ${side}`;
    $('#aSub').textContent = `Arcada ${arch} · lado ${side} do paciente`;
    $('#aFun').textContent = d.f;
    $('#aRoot').textContent = pick(d.r, upper);
    $('#aEr').textContent = pick(d.e, upper);
    card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  };
  svg.addEventListener('click', e => { const g = e.target.closest('.tooth'); if (g) select(+g.dataset.fdi); });
  svg.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = e.target.closest('.tooth');
    if (g) { e.preventDefault(); select(+g.dataset.fdi); }
  });
  select(11);
})();

// ===== Ano do rodapé =====
if ($('#year')) $('#year').textContent = new Date().getFullYear();