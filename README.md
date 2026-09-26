# Mídia Led — Site institucional

Site one-page de publicidade em painéis de LED em todo o estado do Rio de Janeiro,
com painel fixo na Via Dutra, em Nova Iguaçu.
HTML, CSS e JavaScript puro — sem build, sem dependências, sem framework.

**Contato da empresa:** (21) 96617-1604 · [@midia_led_](https://www.instagram.com/midia_led_/)

## Como rodar

Abra `index.html` no navegador. Para testar com servidor local (recomendado, evita
bloqueio de autoplay em alguns navegadores):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Deploy

Hospedado na Vercel como site estático. Não há etapa de build: a Vercel publica a raiz
do repositório. O `vercel.json` define apenas o cache — longo para imagens e vídeos,
curto para CSS e JS, para que as alterações de estilo apareçam na hora.

## Portal de entrada

A primeira tela (`.gate`) é um **rodízio de vídeos**: toca um, passa ao próximo com uma
transição curta pelo preto, e recomeça. Com um vídeo só na lista, ele fica em loop.

Cada vídeo toca **inteiro** e só então passa ao próximo. Para acrescentar, some um item
em `CONFIG.portal`:

```js
portal: [
  { desktop: 'assets/video/trio-rua.mp4', mobile: 'assets/video/trio-rua-mobile.mp4', leve: 'assets/video/trio-rua-leve.mp4', posicao: 'center 57%' },
  ...
],
segundosPorVideo: 0   // 0 = vídeo inteiro; um número corta nesse tempo
```

| Campo | Para que serve |
|---|---|
| `desktop` | Arquivo principal |
| `mobile` | Versão de celular (opcional; sem ela o celular usa a principal) |
| `leve` | Versão para conexão lenta no celular (opcional) |
| `posicao` | Qual parte do quadro aparece no desktop. O vídeo é vertical e a tela é larga, então o corte importa: **valor menor sobe o enquadramento, maior desce** |

Como escolher a `posicao`: extraia alguns quadros do vídeo e veja qual faixa fica visível.
No desktop de 1440×900, um vídeo 9:16 mostra só ~35% da altura.

**Ao trocar um vídeo, revise a `posicao`.** O valor depende do conteúdo, não do arquivo:
quando o 0915 foi substituído, o enquadramento teve de sair de 66% para 57%, senão o topo
do painel da campanha ficava cortado. Extraia alguns quadros e simule a faixa visível
antes de decidir.

Só o vídeo em exibição é baixado; os outros entram quando chega a vez deles. Fora da tela,
o portal pausa. Sem JS, fica o poster.

Configuração em `assets/js/main.js` → `CONFIG`:

| Opção | Efeito |
|---|---|
| `whatsapp` | Número usado no quiz de contato e nos links (`5521966171604`) |
| `ga4Id` | Measurement ID do GA4 — vazio desliga a medição |
| `metaPixelId` | ID do Meta Pixel — vazio desliga |
| `endpointLeads` | URL que recebe os leads — vazio desliga a gravação |
| `portal` | Lista de vídeos do portal, em rodízio |
| `segundosPorVideo` | `0` = cada vídeo toca inteiro; um número corta nesse tempo |

## Estrutura

```
MídiaLed/
├── index.html                  Página inteira
├── favicon.ico                 Monograma ML (multi-resolução)
├── vercel.json                 Cache do deploy
├── robots.txt · sitemap.xml    Para o Google achar e indexar a página
├── assets/                     Tudo que o site usa (~118 MB, quase tudo vídeo)
│   ├── css/style.css
│   ├── js/main.js              Portal, menu, quiz de contato, contadores, vídeos
│   ├── js/motion.js            Movimento: texto, paralaxe, letreiro, carrossel
│   ├── img/
│   │   ├── logo-midialed.svg   Logo branca em vetor (abertura, menu, rodapé)
│   │   ├── logo-midialed.png   Mesma logo em 1600px (dados estruturados)
│   │   ├── favicon-512.png · apple-touch-icon.png
│   │   ├── og-image.jpg        Miniatura de compartilhamento (foto real do trio)
│   │   ├── gate-poster.webp    Quadro do vídeo de abertura (aparece antes do vídeo)
│   │   ├── *-poster.webp       Quadro de cada vídeo de seção (dutra, operacao, criacao, ledmob)
│   │   └── clientes/           Logos dos 20 clientes (png + webp, Egide em svg)
│   └── video/                  trio-rua (+ -mobile, -leve) · conquiste · cidade · dutra · operacao · criacao · ledmob-institucional
└── midias/                     Originais em tamanho cheio — FORA do Git (.gitignore)
```

**Regra:** originais ficam em `midias/`, versões otimizadas em `assets/`.

## Seções

1. **Portal** — vídeo da rua, logo e indicativo de scroll
2. **Hero** — H1 de busca + "A rua é um dos maiores palcos de marca."
3. **Letreiro de LED** — matriz de pixels com as mensagens-chave
4. **Trio Mídia LedMob** — a operação, com o vídeo institucional (toca com som ao dar play) e 4 números-resumo
5. **Painel fixo** — Led Dutra, filmagem aérea, em moldura que imita o painel de LED.
   O LED móvel não se repete aqui: o Trio já tem a seção 4.
6. **Clientes** — carrossel de logos
7. **A estratégia começa aqui** — institucional + 4 passos, com vídeo de fundo
8. **Prova da veiculação** — pronta e comentada, esperando a imagem do relatório
9. **Criação do conteúdo** — vídeo à esquerda, membrana fosca à direita
10. **Letreiro de LED (2ª passagem)**
11. **CTA + Contato** (quiz de 4 perguntas → WhatsApp) + **Rodapé**
12. **Botão flutuante do WhatsApp** — sempre verde. As redes (Instagram, Facebook e
    TikTok) ficam no rodapé, em "Contato e redes"

## Camada de movimento (`assets/js/motion.js`)

Tudo roda em um único `requestAnimationFrame`, só com `transform` e `opacity`. Com
`prefers-reduced-motion` (opção "reduzir movimento" do aparelho), nada se mexe: letreiro e
carrossel ficam parados, e os títulos aparecem prontos. Letreiro e carrossel contam a
velocidade em px por segundo, então andam igual a 30, 60 ou 120 quadros por segundo.

| Recurso | Como usar |
|---|---|
| Texto que se monta palavra por palavra | classe `split` no título |
| Gradiente que segue o cursor | variável `--gx`, nas palavras de destaque |
| Paralaxe | `data-parallax="0.06"` |
| Inclinação 3D | `data-tilt` |
| Botão magnético | automático em `.btn` |
| Foco de luz no hover | automático nos cartões |
| Barra de progresso | criada sozinha no topo |
| Letreiro que acelera com o scroll | automático, 33 px/s em repouso |
| Carrossel de clientes | automático, 90 px/s; pausa com o mouse em cima (só no computador) |

## Manutenção

**Logos dos clientes** — ficam em `assets/img/clientes/`. Para trocar uma logo,
**salve com nome novo** (`alamo-v2` → `alamo-v3`) e atualize o `index.html` nos dois
conjuntos do trilho. Imagens ficam um ano no cache do navegador (`vercel.json`): se o
nome não mudar, quem já visitou o site continua vendo a logo antiga.

Todas passaram por adaptação para fundo preto, com a mesma regra: **cinza e preto viram
branco, cor saturada e escura é clareada mantendo o tom, cor viva fica como está.** Sem
isso, logos como Multiplan, Pontofrio e Facility sumiriam no fundo do site.

| Cliente | Arquivo |
|---|---|
| Pontofrio | `pontofrio.webp` + `.png` |
| Multiplan | `multiplan.webp` + `.png` |
| Álamo | `alamo-v2.webp` + `.png` |
| Ultra Academia | `ultra-academia.webp` + `.png` |
| Blindados RJ | `blindados-rj.webp` + `.png` |
| Drogaria Mais Barato | `drogaria-mais-barato.webp` + `.png` |
| Louvorzão 93 FM | `louvorzao-93fm.webp` + `.png` |
| Egide Saúde | `egide-saude.svg` |
| Facility | `facility-v2.webp` + `.png` |
| Instituto Paulo Apóstolo | `ipa.webp` + `.png` |
| Athiones Fernandes | `athiones.webp` + `.png` |
| Up Ouro | `up-ouro-v2.webp` + `.png` |
| Comunidade Evangélica Zona Sul | `ceizs-v2.webp` + `.png` (azul clareado para 71,115,245) |

Para adicionar um cliente, copie um `.brandrail__item` **nos dois conjuntos** do trilho.

**Cuidado com a largura no celular:** cada placa tem a largura da própria logo
(`width: auto`), com margem entre elas. Não volte a usar largura fixa — logos largas como
Pontofrio e Multiplan vazavam por cima da vizinha. O limite é `max-width` em `vw`, para a
logo nunca passar de metade da tela.

O trilho se remede sozinho (`ResizeObserver`) quando as logos entram, porque elas carregam
só ao aproximar da seção e mudam a largura do conjunto.

**Letreiro de LED** — cada letreiro tem dois `.ledstrip__set` idênticos; o segundo é a
cópia que faz o loop ser contínuo. Ao mudar uma mensagem, mude nos dois. O `motion.js`
duplica os conjuntos sozinho conforme a largura da tela.

**Vídeos** — o ffmpeg está disponível via `pip install imageio-ffmpeg`:

```bash
FF=$(python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")

# celular: 720x1280, CRF 25, teto de 1,8 Mb/s
"$FF" -y -i midias/videos/entrada.mp4 -vf "scale=720:1280:flags=lanczos" \
      -c:v libx264 -profile:v high -preset slow -crf 25 -maxrate 1800k -bufsize 3600k \
      -pix_fmt yuv420p -an -movflags +faststart assets/video/saida-mobile.mp4

"$FF" -y -ss 3 -i assets/video/saida.mp4 -frames:v 1 -q:v 4 assets/img/poster.jpg
```

**Sempre comprima a partir do original em `midias/videos/`**, nunca de um arquivo já
comprimido. Em 23/09 os vídeos estavam em CRF 29 e 360–540px e apareciam quadriculados
no celular; foram refeitos assim:

| Uso | Resolução | CRF | Teto |
|---|---|---|---|
| Celular (todos os `-mobile`, menos o principal) | 720×1280 | 25 | 1,8 Mb/s |
| Vídeo principal, desktop (`trio-rua`) | 1440×2560 | 24 | 6 Mb/s |
| Vídeo principal, celular (`trio-rua-mobile`) | 1080×1920 | 25 | 3 Mb/s |
| Vídeo principal, conexão lenta (`trio-rua-leve`) | 720×1280 | 25 | 1,8 Mb/s |
| Demais no desktop | 720×1280 (a resolução do original) | 22 | 2,5 Mb/s |
| `criacao` (fundo deitado) | 1920×1080; no celular, faixa vertical do centro em 720×1280 | 25 | 3,5 / 1,8 Mb/s |
| `ledmob-institucional` (com som, um arquivo para todas as telas) | 848×478 (a resolução do original) | 23 | — (áudio AAC 128 kb/s) |

O vídeo principal sai do 4K em `midias/video-principal/0916 (1).mp4` (mesma edição do
`0915`, exportada em 2160×3840). O arquivo vem a 60 fps, mas só ~24 quadros por segundo
mudam de verdade: o site usa 30 fps. A versão `leve` vai para celular em 3G ou em 4G
abaixo de ~5 Mb/s (`CONFIG.portal[].leve`); o iPhone não informa a conexão e recebe a normal.
O poster (`gate-poster.webp`) é o quadro de 8s.

De onde saiu cada um: `trio-rua` ← `midias/video-principal/0916 (1).mp4` · `dutra` ← `Led Dutra - Marcha para Jesus` ·
`cidade` ← `snapinsta-1789344864337` (0–24s; celular 0–16s) · `operacao` ←
`snapinsta-1789349124415` (0–24s; celular 0–16s) · `criacao` ← `16788375_3840_2160_30fps`.
`ledmob-institucional` ← `LedMob_Institucional .mp4`.
O original do `conquiste` não está na pasta (ver PENDENCIAS.md).

O `ledmob-institucional` é o único vídeo **com som** e o único que não toca sozinho:
`preload="none"` e nada é baixado até o play (o poster é o quadro de 2s, 26 KB).
O original tem só 848×478 — não há versão de celular porque reduzir borraria os textos
do vídeo. Com uma exportação em 1080p, vale refazer: 1080p no desktop e 848 no celular.

## Desempenho em celular

O público entra pelo Instagram e pelo WhatsApp, em Android intermediário e 4G instável.
Por isso o celular é a versão principal, não a adaptada.

Medido com Lighthouse 11.7.1 (preset mobile) e Chrome emulando 360/390/430px:

| Métrica | Antes | Depois |
|---|---|---|
| Performance | sem nota (LCP falhava) | **99** |
| LCP | erro `NO_LCP` | **1,8 s** |
| FCP | 2,7 s | **1,1 s** |
| Speed Index | 6,1 s | **2,3 s** |
| TBT | 100 ms | **0 ms** |
| CLS | 0 | **0** |
| Alvos de toque < 44px | 18 | **0** |
| Campos com fonte < 16px | 5 | **0** |
| Conteúdo visível sem JS | nenhum | **tudo** |

### O que sustenta esses números

- **Nada depende de JS para aparecer.** As animações só entram quando o script marca
  `<html class="js">`. Se o JS falhar, o site aparece inteiro, sem animação.
- **Vídeo certo para cada tela.** Versões próprias para celular (tabela em "Vídeos"); o JS escolhe pelo
  `matchMedia` e nunca carrega vídeo invisível (a cópia desfocada do portal é
  `display:none` no celular).
- **Conexão fraca não baixa vídeo.** Com `saveData` ligado ou `effectiveType` 2G,
  fica só o poster.
- **Imagens em WebP** com `<picture>` e fallback, `width`/`height` declarados e
  `loading="lazy"` abaixo da dobra.
- **Contato sem digitação.** O quiz faz uma pergunta por tela e avança ao tocar na
  opção; alvos de toque com 48px. Não pede nome nem telefone: os dois chegam pelo
  próprio WhatsApp. Os botões do painel fixo e do LedMob já respondem a 1ª pergunta.
- **A fonte não segura a primeira pintura.** O Google Fonts entra por
  `media="print" onload="this.media='all'"`, com `preload` e `<noscript>` de reserva.
  Só essa mudança levou o LCP de 3,2 s para 1,8 s e a nota de 84 para 99 — o arquivo
  de fonte bloqueava 1,2 s do caminho crítico. **Não volte a usar `<link rel="stylesheet">`
  direto para a fonte.**
- **Nada que se move a cada quadro é redesenhado.** O `motion.js` move letreiros,
  carrossel e paralaxe por `transform`; o trilho precisa de `will-change:transform`,
  senão o Chrome redesenha a faixa inteira a cada deslocamento fracionado. Nos letreiros
  (texto com brilho desfocado) isso custava 670 ms de pintura a cada 3 s no celular e
  travava a rolagem; com `will-change`, 1 ms. **Todo trilho novo movido pelo JS leva
  `will-change:transform`.** Os pontos do letreiro mudam de cor com o mouse, então
  também ganham camada própria (só em aparelho com mouse): 545 → 37 ms no desktop.
- **O loop de movimento lê antes e grava depois, e só grava o que mudou.** Parado, a
  página não refaz quadro nenhum.
- **Animação invisível não roda.** No celular o "Anunciar agora" fica no menu fechado,
  fora da tela, mas as cores circulando (`background-position`, que não vai para a GPU)
  redesenhavam a cada quadro: 38% do trabalho de cada quadro. Pausa com o menu fechado.
- **O dock some quando encostaria num botão.** No celular os CTAs ocupam a largura toda e
  o botão flutuante passava por cima: o toque errava o alvo. A colisão é verificada a cada
  rolagem, e o dock volta assim que passa.

### Limitações assumidas

- **Primeira dobra acima de 1 MB**: o portal em vídeo no celular, decisão do cliente.
  O LCP, que era a outra limitação, deixou de ser problema depois que a fonte parou de
  bloquear a renderização.
- **Página com 17 telas em 360px.** Reduzi o espaçamento vertical, mas o comprimento vem
  da quantidade de conteúdo.
- **O botão flutuante passa por cima de textos** em alguns pontos da rolagem. Sobre
  botões ele se esconde; sobre texto corrido, não — esconder a cada linha faria ele
  piscar o tempo todo.

## Menu do celular

O painel lateral é `position: fixed`, então **nenhum ancestral dele pode ter `transform`,
`filter` ou `backdrop-filter`** — essas propriedades criam bloco de contenção e o painel
passa a se posicionar pela barra do topo em vez da janela (ele saía com 80px de altura).

Por isso, no celular o cabeçalho usa fundo sólido em vez de `backdrop-filter`, e a
animação de entrada usa `top` em vez de `transform`. Ao mexer no cabeçalho, mantenha isso.

O cabeçalho também fica **sempre visível no celular** — antes ele só aparecia depois do
portal, e a primeira tela ficava sem nenhuma navegação.

## Pendências antes de divulgar

| Item | Situação |
|---|---|
| CNPJ no rodapé | ✅ 62.377.877/0001-53 |
| Fontes dos dados de mercado | seção removida até as fontes serem confirmadas (PENDENCIAS.md, item 2) |
| Especificações do painel fixo | medidas, pixel pitch e horário de operação ainda genéricos |
| Logo em SVG | ✅ `logo-midialed.svg`, extraída do PDF do cliente |
