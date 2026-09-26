/* =========================================================
   MÍDIA LED — Camada de movimento
   Tudo roda em um único requestAnimationFrame, só com
   transform/opacity, para não travar o scroll.
   Respeita "prefers-reduced-motion".
   ========================================================= */
(function () {
  'use strict';

  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const raiz = document.documentElement;

  /* estado compartilhado do ponteiro */
  const ponteiro = { x: innerWidth / 2, y: innerHeight / 2, sx: innerWidth / 2, sy: innerHeight / 2 };

  if (!reduz) {
    window.addEventListener('mousemove', (e) => {
      ponteiro.x = e.clientX;
      ponteiro.y = e.clientY;
    }, { passive: true });
  }

  /* =========================================================
     1. TEXTO EM PALAVRAS
     .split → o título entra palavra por palavra
     ========================================================= */
  function quebrar(el) {
    let i = 0;
    const textoOriginal = el.textContent.trim().replace(/\s+/g, ' ');

    function percorrer(no) {
      Array.from(no.childNodes).forEach(filho => {
        if (filho.nodeType === 3) {                       // nó de texto
          const partes = filho.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();

          partes.forEach(parte => {
            if (!parte.trim()) { frag.appendChild(document.createTextNode(parte)); return; }

            const palavra = document.createElement('span');
            palavra.className = 'w';
            palavra.style.setProperty('--i', i++);
            palavra.textContent = parte;
            frag.appendChild(palavra);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1 && filho.tagName !== 'BR') {
          percorrer(filho);                               // preserva <em>, <strong> etc.
        }
      });
    }

    percorrer(el);
    /* leitores de tela leem a frase inteira, não letra por letra */
    if (textoOriginal) el.setAttribute('aria-label', textoOriginal);
    $$('.w', el).forEach(w => w.setAttribute('aria-hidden', 'true'));
    el.classList.add('is-split');
  }

  const titulos = $$('.split');
  if (!reduz) titulos.forEach(el => quebrar(el));

  /* =========================================================
     2. OBSERVADOR ÚNICO DE ENTRADA
     ========================================================= */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-on');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8%' });

    titulos.forEach(t => io.observe(t));
  } else {
    titulos.forEach(t => t.classList.add('is-on'));
  }

  /* =========================================================
     3. BOTÕES MAGNÉTICOS
     ========================================================= */
  const magneticos = temMouse && !reduz
    ? $$('.btn, [data-magnetic], .dock__btn').map(el => ({ el, x: 0, y: 0, ax: 0, ay: 0 }))
    : [];

  /* =========================================================
     4. FOCO DE LUZ QUE SEGUE O MOUSE NOS CARTÕES
     ========================================================= */
  if (temMouse && !reduz) {
    const cartoes = $$('.worklist li, .form, .brandrail__item, .depo');
    cartoes.forEach(c => {
      c.classList.add('tem-foco');
      c.addEventListener('mousemove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });
  }

  /* =========================================================
     5. INCLINAÇÃO 3D
     ========================================================= */
  const inclinaveis = temMouse && !reduz
    ? $$('[data-tilt]').map(el => ({ el, rx: 0, ry: 0, arx: 0, ary: 0 }))
    : [];

  /* =========================================================
     6. PARALAXE POR SCROLL
     data-parallax="0.25"  → quanto o elemento se desloca
     ========================================================= */
  const paralaxes = !reduz
    ? $$('[data-parallax]').map(el => ({
        el,
        forca: parseFloat(el.dataset.parallax) || .2,
        y: 0, ay: 0
      }))
    : [];

  /* =========================================================
     7. BARRA DE PROGRESSO EM LED
     ========================================================= */
  const barra = document.createElement('div');
  barra.className = 'progresso';
  barra.innerHTML = '<i></i>';
  document.body.appendChild(barra);
  const barraFill = barra.firstElementChild;

  /* =========================================================
     8. LETREIRO QUE ACELERA COM O SCROLL
     O movimento passa a ser controlado aqui (a animação de CSS
     é desligada) para poder variar de velocidade sem solavanco.
     ========================================================= */
  const letreiros = $$('.ledstrip').map(strip => {
    const track = strip.querySelector('.ledstrip__track');
    const set = strip.querySelector('.ledstrip__set');
    if (!track || !set) return null;

    track.style.animation = 'none';
    const dir = strip.classList.contains('ledstrip--rev') ? -1 : 1;
    const largura = preencherTrilho(track, '.ledstrip__set') || set.offsetWidth;
    return { strip, track, set, largura, dir, pos: dir === -1 ? -largura : 0 };
  }).filter(Boolean);

  function medirLetreiros() {
    letreiros.forEach(t => {
      const nova = preencherTrilho(t.track, '.ledstrip__set') || t.set.offsetWidth;
      if (nova) t.largura = nova;
    });
  }
  window.addEventListener('load', medirLetreiros);
  window.addEventListener('resize', medirLetreiros);

  /* Garante trilho mais largo que a tela: em monitores grandes, dois
     conjuntos não bastam e abriria um vão no fim da volta. */
  function preencherTrilho(track, seletorConjunto) {
    const base = track.querySelector(seletorConjunto);
    if (!base) return 0;
    const largura = base.offsetWidth;
    if (!largura) return 0;

    let alvo = innerWidth * 2 + largura;
    let guarda = 12;
    while (track.offsetWidth < alvo && guarda-- > 0) {
      const copia = base.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      track.appendChild(copia);
    }
    return largura;
  }

  /* carrossel de clientes — mesmo motor, em ritmo próprio e sem reagir ao scroll */
  const trilhoMarcas = (() => {
    const rail = document.querySelector('.brandrail');
    const track = rail?.querySelector('.brandrail__track');
    const set = rail?.querySelector('.brandrail__set');
    if (!rail || !track || !set) return null;
    const largura = preencherTrilho(track, '.brandrail__set') || set.offsetWidth;
    return { rail, track, set, largura, pos: 0, pausado: false };
  })();

  if (trilhoMarcas) {
    /* só com mouse: no celular o toque dispara mouseenter e o mouseleave
       só vem quando se toca em outro lugar — o carrossel ficava parado */
    if (temMouse) {
      trilhoMarcas.rail.addEventListener('mouseenter', () => { trilhoMarcas.pausado = true; });
      trilhoMarcas.rail.addEventListener('mouseleave', () => { trilhoMarcas.pausado = false; });
    }
    const remedir = () => {
      const l = preencherTrilho(trilhoMarcas.track, '.brandrail__set') || trilhoMarcas.set.offsetWidth;
      if (l) trilhoMarcas.largura = l;
    };
    window.addEventListener('load', remedir);
    window.addEventListener('resize', remedir);

    /* As logos entram depois, quando a seção se aproxima: quando isso
       acontece a largura do conjunto muda e o trilho precisa saber. */
    if ('ResizeObserver' in window) {
      new ResizeObserver(remedir).observe(trilhoMarcas.set);
    }
  }

  let scrollAnterior = window.scrollY;
  let velocidade = 0, velSuave = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    velocidade = Math.abs(y - scrollAnterior);
    scrollAnterior = y;
  }, { passive: true });

  /* =========================================================
     9. PORTAL QUE SE DISSOLVE AO ROLAR
     ========================================================= */
  const gate = document.getElementById('gate');
  const gateContent = document.querySelector('.gate__content');
  const gateScroll = document.querySelector('.gate__scroll');

  /* =========================================================
     LOOP ÚNICO
     Primeiro lê todas as posições, depois grava. Ler a posição de um
     elemento logo depois de mudar o estilo de outro obriga o navegador
     a recalcular o estilo ali mesmo — várias vezes por quadro.
     E só grava o que mudou: cada gravação, mesmo com o valor igual,
     pode fazer o navegador refazer o quadro inteiro.
     ========================================================= */
  let quadroAnterior = 0;
  const ultimo = { gx: '', gy: '', barra: '', portal: -1 };

  function transformar(item, el, valor) {
    if (item.tf === valor) return;
    item.tf = valor;
    el.style.transform = valor;
  }

  function loop(agora) {
    /* segundos desde o último quadro; teto evita salto ao voltar de outra aba */
    const dt = quadroAnterior ? Math.min((agora - quadroAnterior) / 1000, .1) : 0;
    quadroAnterior = agora;

    /* ---------- leituras ---------- */
    const y = window.scrollY;
    const altura = document.documentElement.scrollHeight - innerHeight;
    magneticos.forEach(m => { m.r = m.el.getBoundingClientRect(); });
    inclinaveis.forEach(t => { t.r = t.el.getBoundingClientRect(); });
    paralaxes.forEach(p => { p.r = p.el.getBoundingClientRect(); });
    if (!reduz) letreiros.forEach(t => { t.r = t.strip.getBoundingClientRect(); });
    const rMarcas = !reduz && trilhoMarcas && trilhoMarcas.largura
      ? trilhoMarcas.rail.getBoundingClientRect() : null;
    const alturaGate = gate ? (gate.offsetHeight || innerHeight) : 0;

    /* ---------- gravações ---------- */
    /* todo gradiente do site acompanha a posição horizontal do mouse */
    if (!reduz) {
      const gx = ((ponteiro.x / innerWidth) * 100).toFixed(1) + '%';
      const gy = ((ponteiro.y / innerHeight) * 100).toFixed(1) + '%';
      if (gx !== ultimo.gx) { raiz.style.setProperty('--gx', gx); ultimo.gx = gx; }
      if (gy !== ultimo.gy) { raiz.style.setProperty('--gy', gy); ultimo.gy = gy; }
    }

    /* botões magnéticos */
    magneticos.forEach(m => {
      const r = m.r;
      if (r.bottom < -100 || r.top > innerHeight + 100) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = ponteiro.x - cx;
      const dy = ponteiro.y - cy;
      const dist = Math.hypot(dx, dy);
      /* raio curto e força baixa: o botão só insinua o movimento,
         nunca foge do cursor na hora do clique */
      const raio = Math.max(r.width, r.height) * .5 + 18;

      if (dist < raio) {
        const f = (1 - dist / raio) * .10;
        m.ax = clamp(dx * f, -6, 6);
        m.ay = clamp(dy * f, -6, 6);
      } else {
        m.ax = 0; m.ay = 0;
      }

      m.x = lerp(m.x, m.ax, .16);
      m.y = lerp(m.y, m.ay, .16);

      transformar(m, m.el, Math.abs(m.x) > .05 || Math.abs(m.y) > .05
        ? `translate3d(${m.x.toFixed(2)}px,${m.y.toFixed(2)}px,0)`
        : '');
    });

    /* inclinação 3D */
    inclinaveis.forEach(t => {
      const r = t.r;
      if (r.bottom < 0 || r.top > innerHeight) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      t.ary = clamp((ponteiro.x - cx) / r.width, -.5, .5) * 12;
      t.arx = clamp((cy - ponteiro.y) / r.height, -.5, .5) * 8;

      t.rx = lerp(t.rx, t.arx, .07);
      t.ry = lerp(t.ry, t.ary, .07);
      transformar(t, t.el,
        `perspective(1100px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg)`);
    });

    /* paralaxe */
    paralaxes.forEach(p => {
      const r = p.r;
      if (r.bottom < -200 || r.top > innerHeight + 200) return;

      const centro = r.top + r.height / 2 - innerHeight / 2;
      p.ay = -centro * p.forca;
      p.y = lerp(p.y, p.ay, .08);
      transformar(p, p.el, `translate3d(0,${p.y.toFixed(2)}px,0)`);
    });

    /* progresso */
    const barraTf = `scaleX(${altura > 0 ? clamp(y / altura, 0, 1) : 0})`;
    if (barraTf !== ultimo.barra) { barraFill.style.transform = barraTf; ultimo.barra = barraTf; }

    /* letreiro acelera conforme a rolagem. Velocidades em px por segundo,
       não por quadro: assim andam igual a 30, 60 ou 120 fps (iPhone em modo
       de pouca energia cai para 30). Com movimento reduzido, ficam parados. */
    velSuave = lerp(velSuave, velocidade, .12);
    velocidade *= .88;
    const fator = 1 + clamp(velSuave / 16, 0, 2.6);

    if (!reduz) letreiros.forEach(t => {
      const r = t.r;
      if (r.bottom < -50 || r.top > innerHeight + 50) return;   // fora da tela, nem calcula

      t.pos -= 33 * fator * dt * t.dir;
      if (t.dir === 1 && t.pos <= -t.largura) t.pos += t.largura;
      if (t.dir === -1 && t.pos >= 0) t.pos -= t.largura;
      transformar(t, t.track, `translate3d(${t.pos.toFixed(2)}px,0,0)`);
    });

    /* carrossel de clientes: constante, e para quando o mouse encosta */
    if (rMarcas && rMarcas.bottom > -50 && rMarcas.top < innerHeight + 50) {
      if (!trilhoMarcas.pausado) {
        trilhoMarcas.pos -= 90 * dt;
        if (trilhoMarcas.pos <= -trilhoMarcas.largura) trilhoMarcas.pos += trilhoMarcas.largura;
      }
      transformar(trilhoMarcas, trilhoMarcas.track, `translate3d(${trilhoMarcas.pos.toFixed(2)}px,0,0)`);
    }

    /* portal se dissolve */
    /* depois que o portal saiu da tela, para de recalcular */
    if (gate) {
      const bruto = y / alturaGate;
      const p = clamp(bruto, 0, 1);
      if (bruto < 1.02 && p !== ultimo.portal) {
        ultimo.portal = p;
        if (gateContent) {
          gateContent.style.transform = `translate3d(0,${(-4 - p * 8).toFixed(2)}vh,0) scale(${(1 - p * .12).toFixed(3)})`;
          gateContent.style.opacity = (1 - p * 1.6).toFixed(3);
        }
        if (gateScroll) gateScroll.style.opacity = (1 - p * 3).toFixed(3);
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
