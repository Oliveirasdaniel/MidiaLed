/* =========================================================
   MÍDIA LED — Scripts do site
   ========================================================= */
(function () {
  'use strict';

  /* =========================================================
     CONFIGURAÇÃO
     Preencha as chaves abaixo e os recursos ligam sozinhos.
     Vazio = recurso desligado, sem erro e sem script carregado.
     ========================================================= */
  const CONFIG = {
    whatsapp: '5521966171604',      // DDI + DDD + número
    /* PENDENTE: medição. Enquanto estiver vazio, nada é enviado
       e nenhum script de terceiro é baixado. Ver PENDENCIAS.md (item 4). */
    ga4Id: '',                      // ex.: 'G-XXXXXXXXXX'
    metaPixelId: '',                // ex.: '123456789012345'

    /* PENDENTE: gravação de leads. Sem endpoint, o formulário continua
       funcionando normalmente — só não guarda cópia. Ver PENDENCIAS.md (item 5). */
    endpointLeads: ''               // ex.: 'https://formspree.io/f/xxxxxxx'
  };

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* =========================================================
     0. MEDIÇÃO
     Os scripts só são baixados se houver ID configurado, e sempre
     de forma assíncrona — nunca seguram a renderização da página.
     ========================================================= */
  function carregarAnalytics() {
    if (CONFIG.ga4Id) {
      const tag = document.createElement('script');
      tag.async = true;
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4Id;
      document.head.appendChild(tag);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.ga4Id);
    }

    if (CONFIG.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', CONFIG.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  /**
   * Dispara um evento nas ferramentas configuradas.
   * Sem ID configurado, não faz nada — e não quebra.
   */
  function rastrear(evento, parametros = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', evento, parametros);
    if (typeof window.fbq === 'function') {
      const padrao = { envio_formulario: 'Lead', clique_whatsapp: 'Contact' };
      if (padrao[evento]) window.fbq('track', padrao[evento], parametros);
      else window.fbq('trackCustom', evento, parametros);
    }
  }

  carregarAnalytics();

  /* =========================================================
     1. PORTAL DE ENTRADA
     A abertura com a logo foi removida: em celular, splash screen
     custa conversão. O visitante cai direto no vídeo da rua.
     ========================================================= */
  const gate = $('#gate');

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
  /* O valor final já está escrito no HTML: se o JS falhar, o número
     correto continua na tela. A animação só passa por cima dele. */
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animarNumero(el) {
    const alvo = parseInt(el.dataset.count, 10);
    if (!Number.isFinite(alvo)) return;

    const sufixo = el.dataset.suffix || '';
    const textoFinal = alvo.toLocaleString('pt-BR') + sufixo;
    const duracao = 1600;
    const inicio = performance.now();

    function passo(agora) {
      const p = Math.min((agora - inicio) / duracao, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(alvo * eased).toLocaleString('pt-BR') + sufixo;
      if (p < 1) requestAnimationFrame(passo);
      else el.textContent = textoFinal;          // termina sempre no valor certo
    }
    requestAnimationFrame(passo);
  }

  const contadores = menosMovimento ? [] : $$('[data-count]');
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
    /* navegador sem webp cai no arquivo original, se houver */
    img.onerror = () => {
      const reserva = el.dataset.imgFallback;
      if (!reserva || el.dataset.tentouReserva) return;
      el.dataset.tentouReserva = '1';
      el.dataset.img = reserva;
      const outra = new Image();
      outra.onload = () => aplicar(el, reserva);
      outra.src = reserva;
    };
    img.onload = () => {
      /* placas de cliente: o nome escrito dá lugar à logo assim que o arquivo existir */
      const placa = el.querySelector('.brandrail__txt');
      if (placa) {
        const real = document.createElement('img');
        real.src = src;
        real.alt = placa.textContent.trim() + ' — cliente da Mídia Led';
        placa.replaceWith(real);
        return;
      }
      aplicar(el, src);
    };
    img.src = src;
  });

  function aplicar(el, src) {
    const placa = el.querySelector('.brandrail__txt');
    if (placa) {
      const real = document.createElement('img');
      real.src = src;
      real.alt = placa.textContent.trim() + ' — cliente da Mídia Led';
      real.loading = 'lazy';
      real.decoding = 'async';
      placa.replaceWith(real);
      return;
    }
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add('has-img');
  }

  /* =========================================================
     7. FORMULÁRIO → GRAVA O LEAD → WHATSAPP

     O lead é gravado ANTES do redirecionamento, mas a gravação
     nunca bloqueia nem atrasa o WhatsApp: se o endpoint estiver
     fora do ar, o visitante nem percebe.
     ========================================================= */

  /**
   * Envia o lead para o endpoint configurado. Falha em silêncio.
   * Usa `keepalive` para o navegador terminar o envio mesmo que
   * a aba mude para o WhatsApp no instante seguinte.
   */
  function salvarLead(dados) {
    if (!CONFIG.endpointLeads) return Promise.resolve(false);

    return fetch(CONFIG.endpointLeads, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        ...dados,
        origem: 'site',
        pagina: location.pathname,
        recebidoEm: new Date().toISOString()
      }),
      keepalive: true
    }).then(() => true).catch(() => false);
  }

  const form = $('#form');
  const erroForm = $('#formErro');

  function mostrarErro(msg, campo) {
    if (erroForm) {
      erroForm.textContent = msg;
      erroForm.hidden = false;
    }
    campo?.focus();
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (erroForm) erroForm.hidden = true;

    const d = new FormData(form);
    const nome = (d.get('nome') || '').toString().trim();
    const telefone = (d.get('telefone') || '').toString().trim();
    const digitos = telefone.replace(/\D/g, '');

    /* validação antes de sair da página */
    if (nome.length < 2) {
      return mostrarErro('Escreva seu nome para a gente saber como te chamar.', $('#nome'));
    }
    if (digitos.length < 10 || digitos.length > 11) {
      return mostrarErro('Confira o WhatsApp: precisa de DDD + número, como (21) 96617-1604.', $('#telefone'));
    }

    const lead = {
      nome,
      empresa: (d.get('empresa') || '').toString().trim(),
      telefone,
      interesse: (d.get('interesse') || '').toString(),
      mensagem: (d.get('mensagem') || '').toString().trim()
    };

    const texto =
      `*Novo contato pelo site — Mídia Led*\n\n` +
      `*Nome:* ${lead.nome}\n` +
      `*Empresa:* ${lead.empresa || '-'}\n` +
      `*WhatsApp:* ${lead.telefone}\n` +
      `*Interesse:* ${lead.interesse || '-'}\n` +
      `*Mensagem:* ${lead.mensagem || '-'}`;

    /* estado de carregando: em 4G instável o visitante toca duas vezes
       achando que falhou, e acaba abrindo duas conversas */
    const botao = form.querySelector('button[type="submit"]');
    const rotuloOriginal = botao ? botao.textContent : '';
    if (botao) {
      botao.disabled = true;
      botao.classList.add('is-enviando');
      botao.textContent = 'Abrindo o WhatsApp…';
    }

    salvarLead(lead);                                   // não esperamos a resposta
    rastrear('envio_formulario', { interesse: lead.interesse });

    const destino = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
    setTimeout(() => {
      window.open(destino, '_blank');
      if (botao) {
        botao.classList.remove('is-enviando');
        botao.classList.add('is-enviado');
        botao.textContent = 'Conversa aberta ✓';
        setTimeout(() => {
          botao.disabled = false;
          botao.classList.remove('is-enviado');
          botao.textContent = rotuloOriginal;
        }, 4000);
      }
    }, 260);
  });

  /* o campo em foco não pode ficar atrás do teclado do celular */
  if (window.matchMedia('(max-width: 820px)').matches) {
    $$('#form input, #form select, #form textarea').forEach(campo => {
      campo.addEventListener('focus', () => {
        setTimeout(() => campo.scrollIntoView({ behavior: 'smooth', block: 'center' }), 320);
      });
    });
  }

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

  function sincronizarFaq(item) {
    item.querySelector('summary')?.setAttribute('aria-expanded', String(item.open));
  }

  faqs.forEach(item => {
    sincronizarFaq(item);
    item.addEventListener('toggle', () => {
      if (item.open) faqs.forEach(o => { if (o !== item) o.open = false; });
      faqs.forEach(sincronizarFaq);
    });
  });

  /* =========================================================
     9. ANO NO RODAPÉ (o HTML já traz um valor; aqui só atualiza)
     ========================================================= */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* =========================================================
     9b. DOCK x FORMULÁRIO
     No celular os botões flutuantes ficariam por cima do botão
     de enviar. Quando a área de contato entra na tela, o dock sai.
     ========================================================= */
  const dock = document.querySelector('.dock');
  const areaContato = $('#contato');
  if (dock && areaContato && 'IntersectionObserver' in window) {
    const ioDock = new IntersectionObserver((entradas) => {
      entradas.forEach(e => dock.classList.toggle('is-oculto', e.isIntersecting));
    }, { threshold: 0.2 });
    ioDock.observe(areaContato);
  }

  /* =========================================================
     9b2. ABAS — painel fixo x LED móvel
     Clique ou setas do teclado trocam o ativo em exibição.
     ========================================================= */
  (function () {
    const abas = $$('.aba');
    if (!abas.length) return;

    let atual = 0;

    function trocar(indice, focar = true) {
      if (indice === atual) return;
      const voltando = indice < atual;      // a aba anterior entra deslizando da esquerda
      atual = indice;

      abas.forEach((aba, i) => {
        const painel = document.getElementById(aba.getAttribute('aria-controls'));
        const ativa = i === indice;

        aba.classList.toggle('is-ativa', ativa);
        aba.setAttribute('aria-selected', String(ativa));
        aba.tabIndex = ativa ? 0 : -1;

        if (!painel) return;
        painel.hidden = !ativa;
        painel.classList.toggle('vem-da-esquerda', ativa && voltando);
        painel.classList.toggle('is-ativo', ativa);
      });

      if (focar) abas[indice].focus();
      rastrear('troca_aba', { ativo: abas[indice].textContent.trim() });
    }

    abas.forEach((aba, i) => {
      aba.addEventListener('click', () => trocar(i, false));
      aba.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const passo = e.key === 'ArrowRight' ? 1 : -1;
        trocar((i + passo + abas.length) % abas.length);
      });
    });

    /* ---------- chamar atenção para a aba fechada ----------
       Um empurrão a cada 7s, no máximo 3 vezes, e só enquanto a
       seção estiver na tela. Para de vez no primeiro toque. */
    const linha = $('#abasLinha');
    const secao = $('#painel');
    let usada = false, visivel = false, empurroes = 0;

    function marcarUsada() {
      if (usada) return;
      usada = true;
      linha?.classList.add('is-usada');
    }
    abas.forEach(a => a.addEventListener('click', marcarUsada, { once: true }));

    if (secao && 'IntersectionObserver' in window) {
      new IntersectionObserver((e) => { visivel = e[0].isIntersecting; }, { threshold: 0.3 })
        .observe(secao);
    }

    if (!menosMovimento) {
      const relogio = setInterval(() => {
        if (usada || empurroes >= 3) return clearInterval(relogio);
        if (!visivel) return;

        const fechada = abas.find(a => !a.classList.contains('is-ativa'));
        if (!fechada) return;
        fechada.classList.add('chama');
        setTimeout(() => fechada.classList.remove('chama'), 1200);
        empurroes++;
      }, 7000);
    }

    /* ---------- arrastar para o lado no celular ---------- */
    let toqueX = 0, toqueY = 0;
    secao?.addEventListener('touchstart', (e) => {
      toqueX = e.changedTouches[0].clientX;
      toqueY = e.changedTouches[0].clientY;
    }, { passive: true });

    secao?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - toqueX;
      const dy = e.changedTouches[0].clientY - toqueY;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;  // rolagem vertical

      const atualIdx = abas.findIndex(a => a.classList.contains('is-ativa'));
      const destino = dx < 0 ? atualIdx + 1 : atualIdx - 1;
      if (destino < 0 || destino >= abas.length) return;

      marcarUsada();
      trocar(destino, false);
    }, { passive: true });
  })();

  /* =========================================================
     9c. EVENTOS DE CLIQUE
     Todo link de WhatsApp e todo CTA são rastreados, com o
     rótulo do próprio botão para saber qual converte mais.
     ========================================================= */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const rotulo = (link.dataset.evento || link.textContent || '').trim().slice(0, 60);

    if (href.includes('wa.me')) {
      rastrear('clique_whatsapp', { origem: link.closest('.dock') ? 'botao_flutuante'
                                         : link.closest('.footer') ? 'rodape' : 'pagina' });
    } else if (href.startsWith('#contato')) {
      rastrear('clique_cta', { cta: rotulo });
    } else if (href.includes('instagram.com')) {
      rastrear('clique_instagram');
    } else if (href.startsWith('mailto:')) {
      rastrear('clique_email');
    }
  });

  /* =========================================================
     9d. PROFUNDIDADE DE ROLAGEM (25 / 50 / 75 / 100%)
     ========================================================= */
  (function () {
    const marcos = [25, 50, 75, 100];
    const vistos = new Set();
    let agendado = false;

    function medir() {
      agendado = false;
      const alturaRolavel = document.documentElement.scrollHeight - innerHeight;
      if (alturaRolavel <= 0) return;

      const pct = (window.scrollY / alturaRolavel) * 100;
      marcos.forEach(m => {
        if (pct >= m && !vistos.has(m)) {
          vistos.add(m);
          rastrear('rolagem', { profundidade: m + '%' });
        }
      });
      if (vistos.size === marcos.length) window.removeEventListener('scroll', aoRolar);
    }

    function aoRolar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    }
    window.addEventListener('scroll', aoRolar, { passive: true });
  })();

  /* =========================================================
     10. VÍDEOS DE FUNDO
     Só rodam enquanto estão na tela — economiza bateria e CPU.
     ========================================================= */
  /* ---------- qual arquivo de vídeo carregar ----------
     Celular recebe a versão leve. Em conexão fraca ou com economia
     de dados ligada, nenhum vídeo decorativo é baixado: fica o poster,
     que já mostra a cena. Onde a API não existe, segue o fluxo normal. */
  const con = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const economizando = !!(con && (con.saveData ||
                    ['slow-2g', '2g'].includes(con.effectiveType)));
  const telaPequena = window.matchMedia('(max-width: 820px)').matches;

  function prepararVideo(v) {
    if (v.src) return true;                       // já preparado
    if (economizando) return false;               // só o poster
    const fonte = (telaPequena && v.dataset.videoMobile) || v.dataset.video;
    if (!fonte) return false;
    v.src = fonte;
    return true;
  }

  /* os vídeos do portal estão na primeira dobra: preparados de imediato.
     A cópia desfocada do fundo fica display:none no celular — carregar um
     vídeo invisível seria jogar megabytes fora. */
  $$('.gate__video').forEach(v => {
    if (menosMovimento) return;
    if (v.offsetParent === null) return;          // invisível: não baixa
    if (prepararVideo(v)) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  });

  const videosFundo = $$('video[data-inview]');

  if (menosMovimento) {
    /* movimento reduzido: ninguém toca. O poster continua na tela,
       então a seção não fica vazia. */
    $$('video').forEach(v => {
      v.autoplay = false;
      v.removeAttribute('autoplay');
      v.pause();
    });
  } else if (videosFundo.length && 'IntersectionObserver' in window) {
    const ioVid = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) {
          if (!prepararVideo(v)) return;   // conexão fraca: fica só o poster
          const p = v.play();              // o download começa aqui, não antes
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
