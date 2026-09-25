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

    /* VÍDEOS DO PORTAL
       Cada vídeo toca INTEIRO e só então passa ao próximo, em rodízio.
       `mobile` é opcional: sem ele, o celular usa o arquivo principal.
       `leve` é opcional: versão menor para celular em conexão lenta
       (3G, ou 4G medido abaixo de ~5 Mb/s).
       `posicao` decide qual parte do quadro fica visível no desktop —
       o vídeo é vertical e a tela é larga, então o corte importa.
       Valor menor sobe o enquadramento, maior desce. */
    portal: [
      { desktop: 'assets/video/trio-rua.mp4',  mobile: 'assets/video/trio-rua-mobile.mp4',  leve: 'assets/video/trio-rua-leve.mp4', posicao: 'center 57%' },
      { desktop: 'assets/video/conquiste.mp4', mobile: 'assets/video/conquiste-mobile.mp4', posicao: 'center 60%' },
      { desktop: 'assets/video/cidade.mp4',    mobile: 'assets/video/cidade-mobile.mp4',    posicao: 'center 52%' }
    ],
    segundosPorVideo: 0,            // 0 = toca o vídeo inteiro; um número corta nesse tempo
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

  /* véu atrás do painel: fecha ao tocar fora */
  let veu = null;
  if (burger && nav) {
    veu = document.createElement('div');
    veu.className = 'veu';
    veu.hidden = true;
    document.body.appendChild(veu);
  }

  function menu(abrir) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', abrir);
    burger.classList.toggle('is-open', abrir);
    burger.setAttribute('aria-expanded', String(abrir));
    document.body.classList.toggle('menu-aberto', abrir);

    if (veu) {
      if (abrir) {
        veu.hidden = false;
        requestAnimationFrame(() => veu.classList.add('is-on'));
      } else {
        veu.classList.remove('is-on');
        setTimeout(() => { if (!nav.classList.contains('is-open')) veu.hidden = true; }, 380);
      }
    }
    /* com o painel aberto, o foco por teclado fica dentro dele */
    if (abrir) nav.querySelector('a')?.focus({ preventScroll: true });
  }

  burger?.addEventListener('click', () => menu(!nav.classList.contains('is-open')));
  veu?.addEventListener('click', () => menu(false));
  $$('#nav a').forEach(a => a.addEventListener('click', () => menu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('is-open')) { menu(false); burger?.focus(); }
  });
  /* girar a tela para o modo paisagem fecha o menu, que vira desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && nav?.classList.contains('is-open')) menu(false);
  });

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
  /* As logos do carrossel são dezenas de arquivos que ninguém vê na
     primeira tela. Só entram quando a seção se aproxima. */
  function carregarQuandoPerto(el, acao) {
    if (!('IntersectionObserver' in window)) return acao();

    const io = new IntersectionObserver((entradas) => {
      if (!entradas[0].isIntersecting) return;
      io.disconnect();
      acao();
    }, { rootMargin: '400px 0px' });
    io.observe(el);
  }

  function carregarImagem(el) {
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
    img.onload = () => aplicar(el, src);
    img.src = src;
  }

  /* No carrossel, quem vigia é o trilho inteiro: as logos da ponta direita
     ficam fora da tela e nunca disparariam sozinhas. A lista é montada só
     na hora de carregar, para incluir as cópias que o motion.js acrescenta
     ao trilho em telas largas. */
  $$('.brandrail').forEach(trilho => carregarQuandoPerto(trilho, () => {
    $$('[data-img]', trilho).forEach(carregarImagem);
  }));
  $$('[data-img]').filter(el => !el.closest('.brandrail'))
    .forEach(el => carregarQuandoPerto(el, () => carregarImagem(el)));

  function aplicar(el, src) {
    /* placas de cliente: o nome escrito dá lugar à logo assim que o arquivo existir */
    const placa = el.querySelector('.brandrail__txt');
    if (placa) {
      const real = document.createElement('img');
      real.src = src;
      real.alt = placa.textContent.trim() + ' — cliente da Mídia Led';
      real.decoding = 'async';
      placa.replaceWith(real);
      return;
    }
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add('has-img');
  }

  /* =========================================================
     6b. QUIZ DE CONTATO
     Uma pergunta por vez. Escolher uma opção já responde e
     avança — o visitante nunca encara o formulário inteiro.
     Os CTAs de painel fixo e LedMob entram com a primeira
     pergunta já respondida (`data-quiz` no botão).
     ========================================================= */
  const quiz = (function () {
    const caixa  = $('#form');
    if (!caixa) return null;

    const telas = $$('.quiz__tela', caixa);
    if (telas.length < 2) return null;

    const preenche = $('#quizPreenche');
    const conta    = $('#quizConta');
    const btVoltar = $('#quizVoltar');
    const resumo   = $('#quizResumo');
    const total    = telas.length;
    const ultima   = total - 1;              // a última tela são os dados, não uma pergunta
    let atual = 0, iniciado = false;

    /* nome do campo de cada tela de pergunta, na ordem */
    const campos = telas.slice(0, ultima).map(t => {
      const r = t.querySelector('input[type="radio"]');
      return r ? r.name : null;
    });

    const resposta = (nome) => {
      const m = caixa.querySelector(`input[name="${nome}"]:checked`);
      return m ? m.value : '';
    };

    /* todas as respostas, na ordem das perguntas */
    function respostas() {
      const r = {};
      campos.forEach(nome => { if (nome) r[nome] = resposta(nome); });
      return r;
    }

    /* índice da primeira pergunta ainda sem resposta (-1 se todas ok) */
    function pendente() {
      for (let i = 0; i < campos.length; i++) {
        if (campos[i] && !resposta(campos[i])) return i;
      }
      return -1;
    }

    function montarResumo() {
      if (!resumo) return;
      resumo.textContent = '';
      campos.forEach((nome, i) => {
        const valor = nome && resposta(nome);
        if (!valor) return;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'quiz__chip';
        chip.textContent = valor;
        chip.title = 'Trocar esta resposta';
        chip.addEventListener('click', () => irPara(i, true));
        resumo.appendChild(chip);
      });
    }

    function irPara(indice, voltando = false) {
      const i = Math.max(0, Math.min(ultima, indice));
      if (iniciado && i === atual) return;
      iniciado = true;

      telas.forEach((t, n) => {
        t.classList.toggle('is-ativa', n === i);
        t.classList.toggle('volta', n === i && voltando);
      });
      atual = i;

      if (preenche) preenche.style.width = ((i + 1) / total * 100).toFixed(1) + '%';
      if (conta)    conta.textContent = i === ultima ? 'Confira e envie' : `Pergunta ${i + 1} de ${ultima}`;
      if (btVoltar) btVoltar.hidden = i === 0;
      if (i === ultima) montarResumo();

      /* o leitor de tela precisa ouvir a pergunta nova */
      telas[i].setAttribute('tabindex', '-1');
      try { telas[i].focus({ preventScroll: true }); } catch (e) { telas[i].focus(); }

      /* se o topo do quiz ficou acima da tela, traz de volta */
      const r = caixa.getBoundingClientRect();
      if (r.top < 0) caixa.scrollIntoView({ behavior: menosMovimento ? 'auto' : 'smooth', block: 'start' });
    }

    /* ---------- responder avança sozinho ---------- */
    $$('.quizop input[type="radio"]', caixa).forEach(op => {
      op.addEventListener('change', () => {
        if (!op.checked) return;
        rastrear('quiz_resposta', { pergunta: op.name, resposta: op.value });
        /* se ja respondeu tudo, veio corrigir algo: volta direto para os dados */
        const proxima = pendente() < 0 ? ultima : atual + 1;
        setTimeout(() => irPara(proxima), menosMovimento ? 0 : 300);
      });
    });

    btVoltar?.addEventListener('click', () => irPara(atual - 1, true));

    /* ---------- atalho: o CTA já responde a primeira pergunta ---------- */
    $$('[data-quiz]').forEach(bt => {
      bt.addEventListener('click', () => {
        const alvo = caixa.querySelector(`input[data-atalho="${bt.dataset.quiz}"]`);
        if (!alvo) return;
        alvo.checked = true;
        irPara(1);
      });
    });

    irPara(0);
    return { irPara, respostas, pendente };
  })();

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

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    /* alguma pergunta ficou em branco: volta para ela em vez de enviar pela metade */
    const faltando = quiz ? quiz.pendente() : -1;
    if (faltando >= 0) return quiz.irPara(faltando, true);

    const d = new FormData(form);
    const lead = {
      interesse: (d.get('interesse') || '').toString(),
      objetivo:  (d.get('objetivo')  || '').toString(),
      prazo:     (d.get('prazo')     || '').toString(),
      criacao:   (d.get('criacao')   || '').toString()
    };

    const texto =
      `*Quero anunciar com a Mídia Led*\n\n` +
      `*Quero:* ${lead.interesse || '-'}\n` +
      `*Objetivo:* ${lead.objetivo || '-'}\n` +
      `*Prazo:* ${lead.prazo || '-'}\n` +
      `*Arte da campanha:* ${lead.criacao || '-'}`;

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

  /* =========================================================
     8. ANO NO RODAPÉ (o HTML já traz um valor; aqui só atualiza)
     ========================================================= */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* =========================================================
     9b. DOCK x BOTÕES
     Os botões flutuantes ficam no canto inferior direito. No celular
     os CTAs ocupam a largura toda, então volta e meia um deles passa
     por baixo do dock e o toque erra o alvo. Aqui o dock sai de cena
     exatamente quando encostaria em algum botão — e só então.
     ========================================================= */
  const dock = document.querySelector('.dock');
  const botoesCTA = $$('.btn--primary, .btn--ghost');

  if (dock && botoesCTA.length) {
    let agendado = false;

    function checarDock() {
      agendado = false;
      if (window.innerWidth > 820) {            // no desktop o dock fica ao lado, não embaixo
        dock.classList.remove('is-oculto');
        return;
      }
      const d = dock.getBoundingClientRect();
      const folga = 10;
      const colide = botoesCTA.some(b => {
        const r = b.getBoundingClientRect();
        if (r.width === 0) return false;
        return r.bottom > d.top - folga && r.top < d.bottom + folga &&
               r.right > d.left - folga && r.left < d.right + folga;
      });
      dock.classList.toggle('is-oculto', colide);
    }

    function aoMexer() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(checarDock);
    }

    window.addEventListener('scroll', aoMexer, { passive: true });
    window.addEventListener('resize', aoMexer);
    window.addEventListener('load', aoMexer);
    checarDock();
  }

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
    } else if (href.includes('facebook.com')) {
      rastrear('clique_facebook');
    } else if (href.includes('tiktok.com')) {
      rastrear('clique_tiktok');
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
     9. VÍDEOS DE FUNDO
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
  /* conexão que não sustenta o vídeo em alta: 3G, ou estimativa abaixo de 5 Mb/s.
     O Safari (iPhone) não informa a conexão e fica com a versão normal. */
  const conexaoLenta = !!(con && (con.effectiveType === '3g' ||
                    (typeof con.downlink === 'number' && con.downlink > 0 && con.downlink < 5)));

  function prepararVideo(v) {
    if (v.src) return true;                       // já preparado
    if (economizando) return false;               // só o poster
    const fonte = (telaPequena && v.dataset.videoMobile) || v.dataset.video;
    if (!fonte) return false;
    v.src = fonte;
    return true;
  }

  /* =========================================================
     PORTAL — rodízio de vídeos

     Toca um vídeo por vez e passa ao próximo, com uma transição
     curta pelo preto. Só o vídeo em exibição é baixado: os outros
     entram sob demanda, quando chega a vez deles.
     A cópia desfocada do fundo é display:none no celular — carregar
     um vídeo invisível seria jogar megabytes fora.
     ========================================================= */
  (function portal() {
    const principal = $('.gate__video--main');
    const fundo = $('.gate__video--blur');
    if (!principal) return;

    const lista = (CONFIG.portal || []).filter(Boolean);
    if (!lista.length || menosMovimento || economizando) return;   // fica o poster

    const varios = lista.length > 1;
    let atual = 0, trocando = false, relogio = null;

    function fonteDe(item) {
      if (telaPequena) return (conexaoLenta && item.leve) || item.mobile || item.desktop;
      return (conexaoLenta && item.mobile) || item.desktop;
    }

    function carregar(indice, comTransicao) {
      const item = lista[indice];
      if (!item) return;
      const fonte = fonteDe(item);

      const aplicar = (v) => {
        if (!v || v.offsetParent === null) return;   // invisível: não baixa
        v.src = fonte;
        v.loop = !varios;                            // vídeo único fica em loop
        if (item.posicao) v.style.objectPosition = item.posicao;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };

      if (comTransicao) {
        principal.classList.add('is-trocando');
        fundo?.classList.add('is-trocando');
        setTimeout(() => {
          aplicar(principal); aplicar(fundo);
          requestAnimationFrame(() => {
            principal.classList.remove('is-trocando');
            fundo?.classList.remove('is-trocando');
          });
          agendar();
        }, 420);
      } else {
        aplicar(principal); aplicar(fundo);
        agendar();
      }
    }

    function proximo() {
      if (!varios || trocando) return;
      trocando = true;
      clearTimeout(relogio);
      atual = (atual + 1) % lista.length;
      carregar(atual, true);
      setTimeout(() => { trocando = false; }, 900);
    }

    /* Quem manda é o fim do vídeo. O relógio existe só como rede de
       segurança, caso o evento 'ended' não chegue (acontece em alguns
       navegadores de app), e usa a duração real do arquivo. */
    function agendar() {
      clearTimeout(relogio);
      if (!varios) return;

      const corte = Number(CONFIG.segundosPorVideo) || 0;
      if (corte > 0) { relogio = setTimeout(proximo, corte * 1000); return; }

      const dur = principal.duration;
      if (isFinite(dur) && dur > 0) relogio = setTimeout(proximo, (dur + 3) * 1000);
    }

    principal.addEventListener('ended', proximo);
    principal.addEventListener('error', proximo);
    /* a duração só é conhecida depois dos metadados */
    principal.addEventListener('loadedmetadata', agendar);

    /* fora da tela, o portal não gasta bateria */
    const secao = $('#gate');
    if (secao && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          const p = principal.play(); if (p && p.catch) p.catch(() => {});
          fundo?.play().catch?.(() => {});
          agendar();
        } else {
          principal.pause(); fundo?.pause(); clearTimeout(relogio);
        }
      }, { threshold: 0.1 }).observe(secao);
    }

    carregar(0, false);
  })();

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
     10. PAUSA O LETREIRO DE LED FORA DA TELA (economia de CPU)
     ========================================================= */
  const letreiros = $$('.ledstrip');
  if (letreiros.length && 'IntersectionObserver' in window) {
    const ioLed = new IntersectionObserver((entradas) => {
      entradas.forEach(e => e.target.classList.toggle('is-paused', !e.isIntersecting));
    }, { threshold: 0 });
    letreiros.forEach(el => ioLed.observe(el));
  }
})();
