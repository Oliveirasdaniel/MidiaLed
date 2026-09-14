/* =========================================================
   MÍDIA LED — Scripts do site
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURAÇÃO RÁPIDA ---------- */
  const CONFIG = {
    whatsapp: '5521966171604',      // DDI + DDD + número
    velocidadeAbertura: 2.05,       // quantas vezes mais rápido a logo se forma (~4,9s)
    limiteAberturaMs: 6200,         // trava de segurança: nunca prende mais que isso
    aberturaUmaVezPorSessao: true   // não repete a abertura a cada navegação interna
  };

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* =========================================================
     1. ABERTURA
     A logo se forma acelerada, sai de cena sozinha e entrega
     o vídeo da rua, que fica rodando até o visitante rolar.
     Sem botões: nada de "pular" ou "clique aqui".
     ========================================================= */
  const gate = $('#gate');
  const layer = $('#revealLayer');
  const revealVideo = $('#revealVideo');
  let encerrada = false;

  function encerrarAbertura() {
    if (encerrada || !layer) return;
    encerrada = true;
    layer.classList.add('is-done');
    document.body.classList.remove('is-locked');
    revealVideo?.pause();
    setTimeout(() => layer.remove(), 700);
  }

  function iniciarAbertura() {
    if (!layer || !revealVideo) return;

    let jaViu = false;
    if (CONFIG.aberturaUmaVezPorSessao) {
      try { jaViu = sessionStorage.getItem('ml_abertura') === '1'; } catch (e) {}
    }
    if (jaViu) { layer.remove(); return; }
    try { sessionStorage.setItem('ml_abertura', '1'); } catch (e) {}

    document.body.classList.add('is-locked');
    revealVideo.playbackRate = CONFIG.velocidadeAbertura;

    const tocar = revealVideo.play();
    if (tocar && tocar.catch) tocar.catch(encerrarAbertura);

    /* o playbackRate pode ser redefinido quando os metadados carregam */
    revealVideo.addEventListener('loadedmetadata', () => {
      revealVideo.playbackRate = CONFIG.velocidadeAbertura;
    });
    revealVideo.addEventListener('ended', encerrarAbertura);
    revealVideo.addEventListener('error', encerrarAbertura);

    /* trava de segurança + saída antecipada se o visitante já quiser rolar */
    setTimeout(encerrarAbertura, CONFIG.limiteAberturaMs);
    ['wheel', 'touchstart', 'keydown'].forEach(ev =>
      window.addEventListener(ev, encerrarAbertura, { once: true, passive: true })
    );
  }

  iniciarAbertura();

  /* =========================================================
     2. HEADER — aparece depois do portal
     ========================================================= */
  const header = $('#header');

  function atualizarHeader() {
    if (!header) return;
    const limite = gate ? gate.offsetHeight * 0.6 : 60;
    header.classList.toggle('is-visible', window.scrollY > limite);
    header.classList.toggle('is-stuck', window.scrollY > limite + 40);
  }
  window.addEventListener('scroll', atualizarHeader, { passive: true });
  window.addEventListener('resize', atualizarHeader);
  atualizarHeader();

  /* =========================================================
     3. MENU MOBILE
     ========================================================= */
  const burger = $('#burger');
  const nav = $('#nav');

  burger?.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', aberto);
    burger.setAttribute('aria-expanded', String(aberto));
  });

  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    burger?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  }));

  /* =========================================================
     4. ANIMAÇÃO DE ENTRADA (scroll reveal)
     ========================================================= */
  const alvos = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('is-visible'), i * 70);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    alvos.forEach(el => io.observe(el));
  } else {
    alvos.forEach(el => el.classList.add('is-visible'));
  }

  /* =========================================================
     5. CONTADORES DOS NÚMEROS
     ========================================================= */
  function animarNumero(el) {
    const alvo = parseInt(el.dataset.count, 10) || 0;
    const sufixo = el.dataset.suffix || '';
    const duracao = 1600;
    const inicio = performance.now();

    function passo(agora) {
      const p = Math.min((agora - inicio) / duracao, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(alvo * eased).toLocaleString('pt-BR') + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  const contadores = $$('[data-count]');
  if (contadores.length && 'IntersectionObserver' in window) {
    const ioNum = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        animarNumero(e.target);
        ioNum.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    contadores.forEach(el => ioNum.observe(el));
  }

  /* =========================================================
     6. IMAGENS PLACEHOLDER
     Se o arquivo existir, entra como background.
     Se não existir, mantém o placeholder com o nome esperado.
     ========================================================= */
  $$('[data-img]').forEach(el => {
    const src = el.dataset.img;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      /* placas de cliente: o nome escrito dá lugar à logo assim que o arquivo existir */
      const placa = el.querySelector('.brandrail__txt');
      if (placa) {
        const real = document.createElement('img');
        real.src = src;
        real.alt = placa.textContent.trim();
        placa.replaceWith(real);
        return;
      }
      el.style.backgroundImage = `url("${src}")`;
      el.classList.add('has-img');
    };
    img.src = src;
  });

  /* =========================================================
     7. FORMULÁRIO → WHATSAPP
     ========================================================= */
  const form = $('#form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const texto =
      `*Novo contato pelo site — Mídia Led*\n\n` +
      `*Nome:* ${d.get('nome') || '-'}\n` +
      `*Empresa:* ${d.get('empresa') || '-'}\n` +
      `*WhatsApp:* ${d.get('telefone') || '-'}\n` +
      `*Interesse:* ${d.get('interesse') || '-'}\n` +
      `*Mensagem:* ${d.get('mensagem') || '-'}`;

    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank');
  });

  /* Máscara simples de telefone */
  const tel = $('#telefone');
  tel?.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    tel.value = v;
  });

  /* =========================================================
     8. FAQ — abre um por vez
     ========================================================= */
  const faqs = $$('.faq__item');
  faqs.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) faqs.forEach(o => { if (o !== item) o.open = false; });
  }));

  /* =========================================================
     9. ANO NO RODAPÉ
     ========================================================= */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* =========================================================
     10. VÍDEOS DE FUNDO
     Só rodam enquanto estão na tela — economiza bateria e CPU.
     ========================================================= */
  const videosFundo = $$('video[data-inview]');
  if (videosFundo.length && 'IntersectionObserver' in window) {
    const ioVid = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.15 });
    videosFundo.forEach(v => { v.muted = true; ioVid.observe(v); });
  }

  /* =========================================================
     11. PAUSA O LETREIRO DE LED FORA DA TELA (economia de CPU)
     ========================================================= */
  const letreiros = $$('.ledstrip');
  if (letreiros.length && 'IntersectionObserver' in window) {
    const ioLed = new IntersectionObserver((entradas) => {
      entradas.forEach(e => e.target.classList.toggle('is-paused', !e.isIntersecting));
    }, { threshold: 0 });
    letreiros.forEach(el => ioLed.observe(el));
  }
})();
